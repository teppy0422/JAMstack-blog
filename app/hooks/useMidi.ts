"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MidiConfig, defaultMidiConfig } from "../lib/midiConfig";

/** MIDI接続状態 */
export type MidiConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "unsupported";

/** MIDI判定結果 */
export interface MidiJudgmentResult {
  /** 判定成功（次へ進む） */
  success: boolean;
  /** 間違えて押したMIDI番号の配列 */
  wrongNotes: number[];
  /** 今回入力されたMIDI番号の配列 */
  inputNotes: number[];
}

interface UseMidiOptions {
  /** MIDI設定 */
  config: MidiConfig;
  /** 現在のカーソル位置で期待される音符のMIDI番号配列 */
  expectedMidiNotes: number[];
  /** 判定成功時のコールバック（カーソルを進める） */
  onMatch: () => void;
  /** 判定失敗時のコールバック（間違い音のMIDI番号を渡す） */
  onMismatch: (wrongNotes: number[]) => void;
  /** MIDI有効フラグ */
  enabled: boolean;
}

/**
 * MIDI入力を受け取り、期待される音符と照合するカスタムフック
 */
export function useMidi({
  config,
  expectedMidiNotes,
  onMatch,
  onMismatch,
  enabled,
}: UseMidiOptions) {
  const [connectionStatus, setConnectionStatus] =
    useState<MidiConnectionStatus>("disconnected");
  const [deviceName, setDeviceName] = useState<string | null>(null);

  // Refs for latest values (to avoid stale closures in MIDI callbacks)
  const configRef = useRef(config);
  configRef.current = config;
  const expectedRef = useRef(expectedMidiNotes);
  expectedRef.current = expectedMidiNotes;
  const onMatchRef = useRef(onMatch);
  onMatchRef.current = onMatch;
  const onMismatchRef = useRef(onMismatch);
  onMismatchRef.current = onMismatch;

  // Buffer for chord time window
  const noteBufferRef = useRef<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // MIDI access ref for cleanup
  const midiAccessRef = useRef<WebMidi.MIDIAccess | null>(null);
  const inputHandlersRef = useRef<
    Map<WebMidi.MIDIInput, (e: WebMidi.MIDIMessageEvent) => void>
  >(new Map());

  /**
   * 時間窓内に溜まったノートをまとめて判定する
   */
  const judgeNotes = useCallback(() => {
    const cfg = configRef.current;
    const expected = expectedRef.current;
    const inputNotes = [...noteBufferRef.current];
    noteBufferRef.current = [];

    if (inputNotes.length === 0) return;

    // "any" モード: 何でも進む
    if (cfg.matchMode === "any") {
      onMatchRef.current();
      return;
    }

    // 期待される音がない場合（休符など）、any note で進む
    if (expected.length === 0) {
      onMatchRef.current();
      return;
    }

    const expectedSet = new Set(expected);
    const inputSet = new Set(inputNotes);

    if (cfg.matchMode === "contains") {
      // 必要な音が全て含まれていれば成功（余分な音はOK）
      const allExpectedPresent = expected.every((n) => inputSet.has(n));
      if (allExpectedPresent) {
        onMatchRef.current();
      } else {
        // 間違い: 期待される音のうち入力に含まれなかったものと、入力のうち期待に含まれなかったもの
        const wrongNotes = inputNotes.filter((n) => !expectedSet.has(n));
        if (cfg.showWrongNotes) {
          onMismatchRef.current(wrongNotes.length > 0 ? wrongNotes : inputNotes);
        }
      }
    } else if (cfg.matchMode === "exact") {
      // 完全一致: 期待される音と入力が完全に一致
      const allExpectedPresent = expected.every((n) => inputSet.has(n));
      const noExtraNotes = inputNotes.every((n) => expectedSet.has(n));

      if (allExpectedPresent && noExtraNotes) {
        onMatchRef.current();
      } else {
        // 間違い: 期待に含まれない入力音
        const wrongNotes = inputNotes.filter((n) => !expectedSet.has(n));
        if (cfg.showWrongNotes) {
          onMismatchRef.current(wrongNotes.length > 0 ? wrongNotes : inputNotes);
        }
      }
    }
  }, []);

  /**
   * Note On イベントを受け取ってバッファに追加し、時間窓後に判定
   */
  const handleNoteOn = useCallback(
    (midiNote: number) => {
      noteBufferRef.current.push(midiNote);

      // 時間窓タイマーをリセット
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        judgeNotes();
        timerRef.current = null;
      }, configRef.current.chordTimeWindow);
    },
    [judgeNotes],
  );

  /**
   * MIDIメッセージハンドラ
   */
  const onMidiMessage = useCallback(
    (e: WebMidi.MIDIMessageEvent) => {
      if (!e.data || e.data.length < 3) return;
      const [status, note, velocity] = e.data;
      const isNoteOn = (status & 0xf0) === 0x90 && velocity > 0;
      if (isNoteOn) {
        handleNoteOn(note);
      }
    },
    [handleNoteOn],
  );

  /**
   * MIDIデバイスへの接続/切断を管理
   */
  const setupMidiInputs = useCallback(
    (access: WebMidi.MIDIAccess) => {
      // 既存のハンドラをクリーンアップ
      inputHandlersRef.current.forEach((handler, input) => {
        input.onmidimessage = null;
      });
      inputHandlersRef.current.clear();

      // 最初に見つかった入力デバイスに接続
      let connected = false;
      for (const input of access.inputs.values()) {
        console.log("MIDI input found:", input.name, input.id);
        input.onmidimessage = onMidiMessage;
        inputHandlersRef.current.set(input, onMidiMessage);
        if (!connected) {
          setDeviceName(input.name || "Unknown MIDI Device");
          setConnectionStatus("connected");
          connected = true;
          console.log("MIDI connected to:", input.name);
        }
      }

      if (!connected) {
        setDeviceName(null);
        setConnectionStatus("disconnected");
        console.log("No MIDI input devices found");
      }
    },
    [onMidiMessage],
  );

  useEffect(() => {
    if (!enabled) {
      // 無効時はクリーンアップ
      if (midiAccessRef.current) {
        inputHandlersRef.current.forEach((_, input) => {
          input.onmidimessage = null;
        });
        inputHandlersRef.current.clear();
      }
      setConnectionStatus("disconnected");
      setDeviceName(null);
      return;
    }

    if (!navigator.requestMIDIAccess) {
      setConnectionStatus("unsupported");
      console.warn("Web MIDI API is not supported in this browser");
      return;
    }

    setConnectionStatus("connecting");

    navigator
      .requestMIDIAccess()
      .then((access) => {
        midiAccessRef.current = access;
        setupMidiInputs(access);

        // デバイスの接続/切断を監視
        access.onstatechange = () => {
          console.log("MIDI state changed");
          setupMidiInputs(access);
        };
      })
      .catch((err) => {
        console.error("MIDI access denied:", err);
        setConnectionStatus("disconnected");
      });

    return () => {
      // クリーンアップ
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      inputHandlersRef.current.forEach((_, input) => {
        input.onmidimessage = null;
      });
      inputHandlersRef.current.clear();
      if (midiAccessRef.current) {
        midiAccessRef.current.onstatechange = null;
      }
    };
  }, [enabled, setupMidiInputs]);

  return {
    connectionStatus,
    deviceName,
  };
}
