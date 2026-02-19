"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { isBlackKey } from "../lib/noteUtils";
import type { PlaybackEvent, PlaybackStatus } from "../lib/usePlayback";
import { getHandColor, getScoreColors } from "../lib/colors";

interface FallingNotesProps {
  events: PlaybackEvent[];
  /** Transport.seconds（usePlayback の currentTime） */
  currentTime: number;
  /** rAFごとに更新される高精度タイム ref（再生中はこちらを優先） */
  currentTimeRef?: React.RefObject<number>;
  /** テンポ倍率（1.0 = 原速） */
  tempo: number;
  /** 表示する鍵盤範囲（PianoKeyboard と同じ min/max MIDI） */
  keyboardRange: { min: number; max: number } | null;
  darkMode: boolean;
  playbackStatus: PlaybackStatus;
}

/** 先読み表示する時間幅（スコア秒数） */
const VISIBLE_WINDOW = 4;

/**
 * PianoKeyboard.tsx と完全に一致する X 座標を算出するためのルックアップテーブルを構築
 * 返り値: midiNote → { x: 0~1 正規化X座標（左端）, w: 正規化幅, black: boolean }
 */
function buildKeyLayout(startMidi: number, endMidi: number) {
  // 白鍵数をカウント
  let whiteKeyCount = 0;
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (!isBlackKey(midi)) whiteKeyCount++;
  }
  if (whiteKeyCount === 0) return new Map<number, { x: number; w: number; black: boolean }>();

  const wkw = 1 / whiteKeyCount; // 白鍵幅（正規化）
  const blackKeyHalf = wkw * 0.3; // 黒鍵が白鍵に食い込む片側の幅

  const layout = new Map<number, { x: number; w: number; black: boolean }>();
  let whiteKeyIndex = 0;

  // 白鍵を配置（上部の見える幅に合わせてノートバーを細くする）
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (!isBlackKey(midi)) {
      // 左隣に黒鍵があるか（=この白鍵の左側が黒鍵に食い込まれるか）
      const hasBlackLeft = midi > startMidi && isBlackKey(midi - 1);
      // 右隣に黒鍵があるか（=この白鍵の右側が黒鍵に食い込まれるか）
      const hasBlackRight = midi < endMidi && isBlackKey(midi + 1);

      let noteX = whiteKeyIndex * wkw;
      let noteW = wkw;

      if (hasBlackLeft) {
        noteX += blackKeyHalf;
        noteW -= blackKeyHalf;
      }
      if (hasBlackRight) {
        noteW -= blackKeyHalf;
      }

      layout.set(midi, { x: noteX, w: noteW, black: false });
      whiteKeyIndex++;
    }
  }

  // 黒鍵を配置（PianoKeyboard.tsx と同じロジック）
  whiteKeyIndex = 0;
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (isBlackKey(midi)) {
      const position = whiteKeyIndex * wkw - blackKeyHalf;
      layout.set(midi, { x: position, w: wkw * 0.6, black: true });
    } else {
      whiteKeyIndex++;
    }
  }

  return layout;
}

/** ソート済み配列から visibleStart 以上の最初のインデックスを二分探索 */
function lowerBound(events: PlaybackEvent[], time: number): number {
  let lo = 0;
  let hi = events.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    // noteEnd = timeSeconds + durationSeconds; noteEnd < time ならスキップ
    if (events[mid].timeSeconds + events[mid].durationSeconds < time) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

export default function FallingNotes({
  events,
  currentTime,
  currentTimeRef: externalTimeRef,
  tempo,
  keyboardRange,
  darkMode,
  playbackStatus,
}: FallingNotesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // 最新の currentTime/tempo を ref で保持（draw の依存に含めない）
  const currentTimeRef = useRef(currentTime);
  currentTimeRef.current = currentTime;
  const tempoRef = useRef(tempo);
  tempoRef.current = tempo;
  const darkModeRef = useRef(darkMode);
  darkModeRef.current = darkMode;

  const startMidi = keyboardRange?.min ?? 24;
  const endMidi = keyboardRange?.max ?? 96;

  // キーレイアウト（鍵盤範囲が変わった時のみ再構築）
  const keyLayout = useMemo(
    () => buildKeyLayout(startMidi, endMidi),
    [startMidi, endMidi],
  );
  const keyLayoutRef = useRef(keyLayout);
  keyLayoutRef.current = keyLayout;

  // イベントを timeSeconds でソート済みコピー
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => a.timeSeconds - b.timeSeconds);
  }, [events]);
  const sortedEventsRef = useRef(sortedEvents);
  sortedEventsRef.current = sortedEvents;

  // 小節線用: measureIndex → 最小 timeSeconds のマップ（ソート済み配列）
  const measureLines = useMemo(() => {
    const map = new Map<number, number>();
    for (const evt of events) {
      const existing = map.get(evt.measureIndex);
      if (existing === undefined || evt.timeSeconds < existing) {
        map.set(evt.measureIndex, evt.timeSeconds);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([idx, time]) => ({ measureIndex: idx, timeSeconds: time }));
  }, [events]);
  const measureLinesRef = useRef(measureLines);
  measureLinesRef.current = measureLines;

  // Canvas を HiDPI 対応でリサイズ
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, []);

  // 描画関数（依存なし — すべて ref から読む）
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width;
    const ch = canvas.height;

    // クリア
    ctx.clearRect(0, 0, cw, ch);

    // 背景
    const sc = getScoreColors(darkModeRef.current);
    ctx.fillStyle = sc.fallingNotesBg;
    ctx.fillRect(0, 0, cw, ch);

    // 再生中は高精度 ref から読み、停止中は state から読む
    const time = (externalTimeRef?.current ?? currentTimeRef.current) || 0;
    // スコア時間（Transport.seconds × tempo = 原曲上の時間位置）
    const scoreTime = time * tempoRef.current;

    // 可視範囲: [scoreTime, scoreTime + VISIBLE_WINDOW]
    const visibleStart = scoreTime;
    const visibleEnd = scoreTime + VISIBLE_WINDOW;

    // ヒットライン（下端から少し上、3px）
    const hitLineY = ch - 2 * dpr;
    ctx.fillStyle = sc.hitLine;
    ctx.fillRect(0, hitLineY, cw, 2 * dpr);

    // ノートバー描画
    const cornerRadius = 3 * dpr;
    const evts = sortedEventsRef.current;
    const kl = keyLayoutRef.current;

    // 二分探索で可視範囲の開始インデックスを特定
    const startIdx = lowerBound(evts, visibleStart);

    for (let i = startIdx; i < evts.length; i++) {
      const evt = evts[i];
      const noteStart = evt.timeSeconds;

      // ノートの先端が画面上端より上なら終了
      if (noteStart > visibleEnd) break;

      const noteEnd = noteStart + evt.durationSeconds;

      const layout = kl.get(evt.midiNote);
      if (!layout) continue;

      // Y 座標: 下端 = scoreTime, 上端 = scoreTime + VISIBLE_WINDOW
      const yBottom = ch * (1 - (noteStart - scoreTime) / VISIBLE_WINDOW);
      const yTop = ch * (1 - (noteEnd - scoreTime) / VISIBLE_WINDOW);

      // 画面外のノートはスキップ
      if (yBottom < 0 || yTop > ch) continue;

      const barHeight = yBottom - yTop;

      // X 座標
      const x = layout.x * cw;
      const w = layout.w * cw;

      // 色（staff + 黒鍵/白鍵で分ける）
      const baseColor = getHandColor(evt.staff, layout.black);

      // 黒鍵のノートは少し透明
      const alpha = layout.black ? "cc" : "ff";
      ctx.fillStyle = `${baseColor}${alpha}`;

      // 角丸矩形（上端のみ角丸、下端は直角＝鍵盤に吸い込まれるように見せる）
      const r = Math.min(cornerRadius, barHeight / 2, w / 2);
      if (r > 0 && barHeight > 0) {
        ctx.beginPath();
        ctx.moveTo(x + r, yTop);
        ctx.lineTo(x + w - r, yTop);
        ctx.quadraticCurveTo(x + w, yTop, x + w, yTop + r);
        ctx.lineTo(x + w, yBottom);
        ctx.lineTo(x, yBottom);
        ctx.lineTo(x, yTop + r);
        ctx.quadraticCurveTo(x, yTop, x + r, yTop);
        ctx.closePath();
        ctx.fill();
      }
    }

    // 小節線と小節番号を描画
    {
      const ml = measureLinesRef.current;
      ctx.strokeStyle = sc.measureLine;
      ctx.lineWidth = 1;
      ctx.setLineDash([4 * dpr, 4 * dpr]);
      const fontSize = Math.round(11 * dpr);
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = sc.measureLabel;
      ctx.textBaseline = "bottom";

      for (const m of ml) {
        // 小節開始時刻の Y 座標
        const y = ch * (1 - (m.timeSeconds - scoreTime) / VISIBLE_WINDOW);
        if (y < 0 || y > ch) continue;

        // 横線（破線）
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.stroke();

        // 小節番号（左端に表示、線の少し上）
        ctx.fillText(`${m.measureIndex + 1}`, 4 * dpr, y - 2 * dpr);
      }
      ctx.setLineDash([]);
    }

    // 鍵盤の区切り線（白鍵の境界）を薄く描画
    ctx.strokeStyle = sc.keyDivider;
    ctx.lineWidth = 1;
    {
      const totalWhiteKeys = Array.from(kl.values()).filter(k => !k.black).length;
      const wkWidth = totalWhiteKeys > 0 ? 1 / totalWhiteKeys : 0;
      let wki = 0;
      for (let m = startMidi; m <= endMidi; m++) {
        if (!isBlackKey(m)) {
          const lx = Math.round(wki * wkWidth * cw);
          ctx.beginPath();
          ctx.moveTo(lx, 0);
          ctx.lineTo(lx, ch);
          ctx.stroke();
          wki++;
        }
      }
    }
  }, [startMidi, endMidi]);

  // ResizeObserver でコンテナサイズに追従
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      resizeCanvas();
      draw();
    });
    observer.observe(container);

    // 初期リサイズ
    resizeCanvas();
    draw();

    return () => observer.disconnect();
  }, [resizeCanvas, draw]);

  // requestAnimationFrame ループ（再生中のみ）
  useEffect(() => {
    if (playbackStatus !== "playing") {
      // 停止/一時停止中は1回だけ描画
      resizeCanvas();
      draw();
      return;
    }

    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [playbackStatus, draw, resizeCanvas]);

  // 停止中に currentTime が変わったら再描画（MIDI入力で進む場合）
  useEffect(() => {
    if (playbackStatus !== "playing") {
      draw();
    }
  }, [currentTime, playbackStatus, draw]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
