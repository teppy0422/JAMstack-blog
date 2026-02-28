"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/** 再生イベント（1つの音符に対応） */
export interface PlaybackEvent {
  /** 曲頭からの絶対時間（秒） */
  timeSeconds: number;
  /** 音の長さ（秒） */
  durationSeconds: number;
  /** MIDIノート番号 */
  midiNote: number;
  /** 譜表番号（1=右手, 2=左手） */
  staff?: number;
  /** OSMD小節インデックス */
  measureIndex: number;
  /** 小節内タイムスタンプ（拍単位） */
  timestampInMeasure: number;
}

export type PlaybackStatus = "stopped" | "playing" | "paused";

interface UsePlaybackOptions {
  events: PlaybackEvent[];
  onCursorMove: (measureIndex: number, timestampInMeasure: number) => void;
  onPlaybackEnd: () => void;
  enabled: boolean;
}

interface UsePlaybackReturn {
  status: PlaybackStatus;
  currentTime: number;
  /** ref版 — rAFごとに更新されるが React 再レンダーを起こさない */
  currentTimeRef: React.RefObject<number>;
  totalDuration: number;
  tempo: number;
  samplesLoaded: boolean;
  play: (startFromSeconds?: number) => void;
  pause: () => void;
  stop: () => void;
  setTempo: (multiplier: number) => void;
}

/** Salamander Grand Piano サンプルマッピング */
const PIANO_SAMPLES: Record<string, string> = {
  A0: "A0.mp3", C1: "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
  A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
  A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
  A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
  A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
  A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
  A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
  A7: "A7.mp3", C8: "C8.mp3",
};
const PIANO_BASE_URL = "https://tonejs.github.io/audio/salamander/";

// Tone.js の型（動的importのため any で扱う）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ToneModule: any = null;

export function usePlayback({
  events,
  onCursorMove,
  onPlaybackEnd,
  enabled,
}: UsePlaybackOptions): UsePlaybackReturn {
  const [status, setStatus] = useState<PlaybackStatus>("stopped");
  const [tempo, setTempoState] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [samplesLoaded, setSamplesLoaded] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const synthRef = useRef<any>(null);
  const scheduledIdsRef = useRef<number[]>([]);
  const animFrameRef = useRef<number>(0);
  const statusRef = useRef<PlaybackStatus>("stopped");
  statusRef.current = status;
  const tempoRef = useRef(1.0);
  /** rAF ごとに更新される高精度タイム（state 更新なし） */
  const currentTimeRef = useRef(0);
  const lastStateUpdateRef = useRef(0);

  const eventsRef = useRef(events);
  eventsRef.current = events;
  const onCursorMoveRef = useRef(onCursorMove);
  onCursorMoveRef.current = onCursorMove;
  const onPlaybackEndRef = useRef(onPlaybackEnd);
  onPlaybackEndRef.current = onPlaybackEnd;

  const totalDuration =
    events.length > 0
      ? events[events.length - 1].timeSeconds +
        events[events.length - 1].durationSeconds
      : 0;

  /** Tone.js を遅延ロード＆初期化 */
  const ensureTone = useCallback(async () => {
    if (ToneModule) return ToneModule;
    ToneModule = await import("tone");
    // モバイルデバイスでの音声・UI同期を改善
    ToneModule.getDraw().anticipation = 0.08;
    return ToneModule;
  }, []);

  /** ピアノサンプラーを初期化 */
  const ensureSynth = useCallback(async () => {
    const Tone = await ensureTone();
    await Tone.start();
    if (!synthRef.current) {
      await new Promise<void>((resolve) => {
        synthRef.current = new Tone.Sampler({
          urls: PIANO_SAMPLES,
          baseUrl: PIANO_BASE_URL,
          release: 1,
          onload: () => {
            setSamplesLoaded(true);
            resolve();
          },
        }).toDestination();
        synthRef.current.volume.value = -3;
      });
    }
    return Tone;
  }, [ensureTone]);

  /** イベントをTransportにスケジュール（tempoMultiplierでタイミングを調整、offsetSecondsから再生） */
  const scheduleEvents = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Tone: any, evts: PlaybackEvent[], tempoMultiplier: number, offsetSeconds: number = 0) => {
      // 既存スケジュールをクリア
      scheduledIdsRef.current.forEach((id) => Tone.getTransport().clear(id));
      scheduledIdsRef.current = [];

      // テンポ倍率を直接タイミングに反映（playbackRateに依存しない）
      const rate = tempoMultiplier || 1;

      // カーソル位置の重複排除用
      const cursorPositions = new Map<
        string,
        { time: number; measureIndex: number; ts: number }
      >();

      for (const evt of evts) {
        // オフセット以前のイベントはスキップ
        if (evt.timeSeconds + evt.durationSeconds <= offsetSeconds) continue;

        const adjustedTime = (evt.timeSeconds - offsetSeconds) / rate;
        const adjustedDuration = evt.durationSeconds / rate;

        // 開始位置が途中の音は短縮して再生
        const schedTime = Math.max(adjustedTime, 0);

        // 音のスケジュール（SamplerはMIDIノート名で再生）
        const id = Tone.getTransport().schedule((time: number) => {
          if (!synthRef.current?.loaded) return;
          const noteName = Tone.Frequency(evt.midiNote, "midi").toNote();
          synthRef.current?.triggerAttackRelease(
            noteName,
            Math.max(adjustedDuration * 0.9, 0.05),
            time,
          );
        }, schedTime);
        scheduledIdsRef.current.push(id);

        // カーソル位置を記録
        const key = `${evt.measureIndex}-${evt.timestampInMeasure}`;
        if (!cursorPositions.has(key)) {
          cursorPositions.set(key, {
            time: schedTime,
            measureIndex: evt.measureIndex,
            ts: evt.timestampInMeasure,
          });
        }
      }

      // カーソル移動をスケジュール（Transport→Draw直接で遅延を最小化）
      for (const pos of cursorPositions.values()) {
        const id = Tone.getTransport().schedule((time: number) => {
          Tone.getDraw().schedule(() => {
            onCursorMoveRef.current(pos.measureIndex, pos.ts);
          }, time);
        }, pos.time);
        scheduledIdsRef.current.push(id);
      }

      // 再生終了イベント
      const lastEvent = evts[evts.length - 1];
      if (lastEvent) {
        const endTime =
          (lastEvent.timeSeconds + lastEvent.durationSeconds + 0.3 - offsetSeconds) / rate;
        const id = Tone.getTransport().schedule((time: number) => {
          Tone.getDraw().schedule(() => {
            stopPlayback();
          }, time);
        }, Math.max(endTime, 0));
        scheduledIdsRef.current.push(id);
      }
    },
    [],
  );

  /** 時間追跡用アニメーションフレーム */
  const startTimeTracking = useCallback(async () => {
    const Tone = await ensureTone();
    const tick = () => {
      if (statusRef.current === "playing") {
        const t = Tone.getTransport().seconds;
        currentTimeRef.current = t;
        // React state は ~100ms ごとに更新（PianoKeyboard 用）
        const now = performance.now();
        if (now - lastStateUpdateRef.current > 100) {
          lastStateUpdateRef.current = now;
          setCurrentTime(t);
        }
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, [ensureTone]);

  /** 再生（startFromSeconds で途中から再生可能） */
  const play = useCallback(async (startFromSeconds?: number) => {
    if (!enabled || events.length === 0) return;
    const Tone = await ensureSynth();

    if (statusRef.current === "paused") {
      Tone.getTransport().start();
      setStatus("playing");
      startTimeTracking();
      return;
    }

    // 新規再生（オフセット対応）
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    const offset = startFromSeconds || 0;
    scheduleEvents(Tone, events, tempoRef.current, offset);
    Tone.getTransport().start();
    setStatus("playing");
    startTimeTracking();
  }, [enabled, events, ensureSynth, scheduleEvents, startTimeTracking]);

  /** 一時停止 */
  const pause = useCallback(async () => {
    const Tone = await ensureTone();
    Tone.getTransport().pause();
    synthRef.current?.releaseAll();
    setStatus("paused");
    cancelAnimationFrame(animFrameRef.current);
  }, [ensureTone]);

  /** 停止 */
  const stopPlayback = useCallback(async () => {
    const Tone = await ensureTone();
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    synthRef.current?.releaseAll();
    scheduledIdsRef.current.forEach((id) => Tone.getTransport().clear(id));
    scheduledIdsRef.current = [];
    setStatus("stopped");
    setCurrentTime(0);
    currentTimeRef.current = 0;
    cancelAnimationFrame(animFrameRef.current);
    onPlaybackEndRef.current();
  }, [ensureTone]);

  /** テンポ変更（再生中は再スケジュールして反映） */
  const setTempo = useCallback(
    async (multiplier: number) => {
      tempoRef.current = multiplier;
      setTempoState(multiplier);
      // 再生中または一時停止中なら、現在位置から再スケジュール
      if (ToneModule && statusRef.current !== "stopped") {
        const transport = ToneModule.getTransport();
        const currentPos = transport.seconds;
        // 旧テンポでの経過時間から、元の楽譜上の経過時間を逆算
        // （旧スケジュールは旧tempoで time/oldRate だったので、currentPos * oldRate = 元の時間）
        // → シンプルに停止→新テンポで最初から再スケジュール→現在位置にシーク
        const wasPlaying = statusRef.current === "playing";
        transport.pause();
        synthRef.current?.releaseAll();

        // 現在の再生位置に相当する元の楽譜時間を推定
        // currentPos は Transport 上の秒数（旧テンポで調整済みの時間軸上）
        // 新テンポで再スケジュール
        scheduleEvents(ToneModule, eventsRef.current, multiplier);

        // 新テンポでの時間軸上で同じ楽譜位置にシーク
        // 旧テンポ時間 currentPos → 楽譜上の実時間 = 算出不要（比例関係）
        // 新しいスケジュールの先頭から再生し直すのが最もシンプル
        transport.position = 0;
        if (wasPlaying) {
          transport.start();
        }
      }
    },
    [scheduleEvents],
  );

  // events が変わったら停止
  useEffect(() => {
    if (statusRef.current !== "stopped") {
      stopPlayback();
    }
  }, [events, stopPlayback]);

  // アンマウント時クリーンアップ
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (ToneModule) {
        ToneModule.getTransport().stop();
        ToneModule.getTransport().cancel();
        synthRef.current?.dispose();
        synthRef.current = null;
      }
    };
  }, []);

  return {
    status,
    currentTime,
    currentTimeRef,
    totalDuration,
    tempo,
    samplesLoaded,
    play,
    pause,
    stop: stopPlayback,
    setTempo,
  };
}
