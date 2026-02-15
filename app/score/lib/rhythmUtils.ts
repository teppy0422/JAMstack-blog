/**
 * リズム練習ユーティリティ
 * リズムパターンの定義、タイミング判定ロジック
 */

/** 音符の種類 */
export type NoteValue =
  | "whole"
  | "half"
  | "dotted-half"
  | "quarter"
  | "dotted-quarter"
  | "eighth"
  | "dotted-eighth"
  | "sixteenth"
  | "quarter-rest"
  | "eighth-rest";

/** 1拍 = 1.0 として各音符の長さ */
export const NOTE_DURATIONS: Record<NoteValue, number> = {
  whole: 4.0,
  half: 2.0,
  "dotted-half": 3.0,
  quarter: 1.0,
  "dotted-quarter": 1.5,
  eighth: 0.5,
  "dotted-eighth": 0.75,
  sixteenth: 0.25,
  "quarter-rest": 1.0,
  "eighth-rest": 0.5,
};

/** 音符の日本語表示名 */
export const NOTE_LABELS: Record<NoteValue, string> = {
  whole: "全音符",
  half: "2分音符",
  "dotted-half": "付点2分音符",
  quarter: "4分音符",
  "dotted-quarter": "付点4分音符",
  eighth: "8分音符",
  "dotted-eighth": "付点8分音符",
  sixteenth: "16分音符",
  "quarter-rest": "4分休符",
  "eighth-rest": "8分休符",
};

/** 休符かどうか */
export function isRest(nv: NoteValue): boolean {
  return nv.endsWith("-rest");
}

/** 付点音符かどうか */
export function isDotted(nv: NoteValue): boolean {
  return nv.startsWith("dotted-");
}

/** 付点音符の元の音符種を取得（dotted-quarter → quarter） */
export function getBaseNote(nv: NoteValue): NoteValue {
  if (nv.startsWith("dotted-")) {
    return nv.replace("dotted-", "") as NoteValue;
  }
  return nv;
}

/** リズムパターン定義 */
export interface RhythmPattern {
  /** パターンID */
  id: string;
  /** 表示名 */
  label: string;
  /** 拍子 (例: 4 → 4/4拍子) */
  beatsPerMeasure: number;
  /** 音符の並び */
  notes: NoteValue[];
  /** 難易度 (1-4) */
  difficulty: number;
}

// ── 基本パターン集 ──

/** レベル1: 2分音符混在 */
const LEVEL1_PATTERNS: RhythmPattern[] = [
  {
    id: "j1-1",
    label: "4分 + 8分×2 + 4分",
    beatsPerMeasure: 3,
    notes: ["quarter", "eighth", "eighth", "quarter"],
    difficulty: 1,
  },
  {
    id: "j1-2",
    label: "8分×2 + 4分 + 8分×2",
    beatsPerMeasure: 3,
    notes: ["eighth", "eighth", "quarter", "eighth", "eighth"],
    difficulty: 1,
  },
  {
    id: "j1-3",
    label: "4分休符 + 8分×2 + 4分",
    beatsPerMeasure: 3,
    notes: ["quarter-rest", "eighth", "eighth", "quarter"],
    difficulty: 1,
  },
];

/** レベル2: ジャズ風シンコペーション */
const LEVEL2_PATTERNS: RhythmPattern[] = [
  {
    id: "l2-1",
    label: "4分×2 + 8分 + 8分休符 + 4分",
    beatsPerMeasure: 4,
    notes: ["quarter", "quarter", "eighth", "eighth-rest", "quarter"],
    difficulty: 2,
  },
  {
    id: "l2-2",
    label: "8分休符 + 8分 + 4分 + 8分休符 + 8分 + 4分",
    beatsPerMeasure: 4,
    notes: ["eighth-rest", "eighth", "quarter", "eighth-rest", "eighth", "quarter"],
    difficulty: 2,
  },
  {
    id: "l2-3",
    label: "8分 + 4分 + 8分 + 4分 + 4分",
    beatsPerMeasure: 4,
    notes: ["eighth", "quarter", "eighth", "quarter", "quarter"],
    difficulty: 2,
  },
  {
    id: "l2-4",
    label: "4分休符 + 8分 + 8分 + 4分 + 4分",
    beatsPerMeasure: 4,
    notes: ["quarter-rest", "eighth", "eighth", "quarter", "quarter"],
    difficulty: 2,
  },
  {
    id: "l2-5",
    label: "8分 + 4分 + 8分 + 8分 + 4分 + 8分",
    beatsPerMeasure: 4,
    notes: ["eighth", "quarter", "eighth", "eighth", "quarter", "eighth"],
    difficulty: 2,
  },
];

/** レベル3: 付点リズム・ジャズ風 */
const LEVEL3_PATTERNS: RhythmPattern[] = [
  {
    id: "l3-1",
    label: "付点4分 + 8分 + 4分×2",
    beatsPerMeasure: 4,
    notes: ["dotted-quarter", "eighth", "quarter", "quarter"],
    difficulty: 3,
  },
  {
    id: "l3-2",
    label: "4分 + 付点4分 + 8分 + 4分",
    beatsPerMeasure: 4,
    notes: ["quarter", "dotted-quarter", "eighth", "quarter"],
    difficulty: 3,
  },
  {
    id: "l3-3",
    label: "付点4分 + 8分 + 付点4分 + 8分",
    beatsPerMeasure: 4,
    notes: ["dotted-quarter", "eighth", "dotted-quarter", "eighth"],
    difficulty: 3,
  },
  {
    id: "l3-4",
    label: "8分休符 + 付点4分 + 4分 + 4分",
    beatsPerMeasure: 4,
    notes: ["eighth-rest", "dotted-quarter", "quarter", "quarter"],
    difficulty: 3,
  },
  {
    id: "l3-5",
    label: "付点8分 + 16分 + 4分 + 4分 + 4分",
    beatsPerMeasure: 4,
    notes: ["dotted-eighth", "sixteenth", "quarter", "quarter", "quarter"],
    difficulty: 3,
  },
];

/** 全パターン */
export const ALL_RHYTHM_PATTERNS: RhythmPattern[] = [
  ...LEVEL1_PATTERNS,
  ...LEVEL2_PATTERNS,
  ...LEVEL3_PATTERNS,
];

/** 難易度でフィルタ（指定レベルのみ）
 * @param excludeLeadingRest true の場合、先頭が休符のパターンを除外（比率ベースでは先頭休符が無意味なため）
 */
export function getPatternsByDifficulty(
  difficulty: number,
  excludeLeadingRest: boolean = false,
): RhythmPattern[] {
  return ALL_RHYTHM_PATTERNS.filter((p) => {
    if (p.difficulty !== difficulty) return false;
    if (excludeLeadingRest && isRest(p.notes[0])) return false;
    return true;
  });
}

/** ランダムにパターンを選択 */
export function getRandomPattern(
  patterns: RhythmPattern[],
  prevId?: string,
): RhythmPattern {
  const candidates = prevId
    ? patterns.filter((p) => p.id !== prevId)
    : patterns;
  const list = candidates.length > 0 ? candidates : patterns;
  return list[Math.floor(Math.random() * list.length)];
}

// ── タイミング判定 ──

/**
 * パターンの各ノートの理想タップタイミング比率を計算
 * 休符はスキップ（タップしない）
 * 戻り値: 0.0〜1.0 の比率配列（最初のノートが0.0）
 */
export function getIdealRatios(pattern: RhythmPattern): number[] {
  const totalBeats = pattern.beatsPerMeasure;
  const ratios: number[] = [];
  let currentBeat = 0;

  for (const note of pattern.notes) {
    if (!isRest(note)) {
      ratios.push(currentBeat / totalBeats);
    }
    currentBeat += NOTE_DURATIONS[note];
  }

  return ratios;
}

/**
 * タップタイミングの比率を計算
 * timestamps: タップのタイムスタンプ (ms) 配列
 * 戻り値: 0.0〜1.0 の比率配列（最初のタップが0.0）
 */
export function getTapRatios(timestamps: number[]): number[] {
  if (timestamps.length < 2) return timestamps.length === 1 ? [0] : [];
  const total = timestamps[timestamps.length - 1] - timestamps[0];
  if (total === 0) return timestamps.map(() => 0);
  return timestamps.map((t) => (t - timestamps[0]) / total);
}

/**
 * B案: 比率ベースのタイミング判定
 * 理想比率と実際の比率の差の平均を計算
 * 戻り値: 0〜1 のスコア (1.0 = 完璧, 0.0 = 最悪)
 */
export function judgeRatioTiming(
  idealRatios: number[],
  tapRatios: number[],
  /** 許容誤差 (0〜1) — この値以下なら完璧とみなす */
  tolerance: number = 0.1,
): { score: number; perNoteErrors: number[] } {
  // タップ数が足りない場合
  if (tapRatios.length < idealRatios.length) {
    const errors = idealRatios.map(() => 1);
    return { score: 0, perNoteErrors: errors };
  }

  const perNoteErrors: number[] = [];
  // idealRatios と tapRatios の最後の要素を1.0に正規化して比較
  // ただし最初の要素は両方0.0
  const idealNorm = normalizeRatios(idealRatios);
  const tapNorm = normalizeRatios(tapRatios.slice(0, idealRatios.length));

  for (let i = 0; i < idealNorm.length; i++) {
    perNoteErrors.push(Math.abs(idealNorm[i] - tapNorm[i]));
  }

  const avgError =
    perNoteErrors.reduce((s, e) => s + e, 0) / perNoteErrors.length;
  const score = Math.max(0, 1 - avgError / tolerance);

  return { score, perNoteErrors };
}

/** 比率を正規化: 最初=0, 最後=1 */
function normalizeRatios(ratios: number[]): number[] {
  if (ratios.length <= 1) return ratios.map(() => 0);
  const first = ratios[0];
  const last = ratios[ratios.length - 1];
  const range = last - first;
  if (range === 0) return ratios.map(() => 0);
  return ratios.map((r) => (r - first) / range);
}

/**
 * A案: メトロノームベースのタイミング判定
 * BPMから各ノートの理想タイムスタンプを計算し、実タップとの差を判定
 */
export function judgeMetronomeTiming(
  pattern: RhythmPattern,
  tapTimestamps: number[],
  bpm: number,
  startTimestamp: number,
  tolerance: number = 0.15,
): { score: number; perNoteErrors: number[] } {
  const beatDurationMs = 60000 / bpm;
  const idealTimestamps: number[] = [];
  let currentBeat = 0;

  for (const note of pattern.notes) {
    if (!isRest(note)) {
      idealTimestamps.push(startTimestamp + currentBeat * beatDurationMs);
    }
    currentBeat += NOTE_DURATIONS[note];
  }

  if (tapTimestamps.length < idealTimestamps.length) {
    return { score: 0, perNoteErrors: idealTimestamps.map(() => 1) };
  }

  const perNoteErrors: number[] = [];
  const totalDuration = pattern.beatsPerMeasure * beatDurationMs;

  for (let i = 0; i < idealTimestamps.length; i++) {
    const diff = Math.abs(tapTimestamps[i] - idealTimestamps[i]);
    perNoteErrors.push(diff / totalDuration);
  }

  const avgError =
    perNoteErrors.reduce((s, e) => s + e, 0) / perNoteErrors.length;
  const score = Math.max(0, 1 - avgError / tolerance);

  return { score, perNoteErrors };
}

/** タップすべき音符の数を計算（休符を除く） */
export function countTapNotes(pattern: RhythmPattern): number {
  return pattern.notes.filter((n) => !isRest(n)).length;
}

// ── 音の長さ（duration）判定 ──

/** NoteOn/NoteOff のペア */
export interface NoteEvent {
  press: number; // NoteOn タイムスタンプ (ms)
  release: number; // NoteOff タイムスタンプ (ms)
}

/**
 * パターンの各ノートの理想 duration 比率を計算
 * 各ノートの長さを全体の長さで割った比率配列
 * 休符はスキップ
 */
export function getIdealDurationRatios(pattern: RhythmPattern): number[] {
  const totalBeats = pattern.beatsPerMeasure;
  const ratios: number[] = [];
  for (const note of pattern.notes) {
    if (!isRest(note)) {
      ratios.push(NOTE_DURATIONS[note] / totalBeats);
    }
  }
  return ratios;
}

/**
 * 実際の NoteEvent から duration 比率を計算
 * 各ノートの押している時間を全体の時間で割った比率配列
 */
export function getActualDurationRatios(events: NoteEvent[]): number[] {
  if (events.length === 0) return [];
  // 全体の時間 = 最初のpress から 最後のrelease
  const totalDuration = events[events.length - 1].release - events[0].press;
  if (totalDuration <= 0) return events.map(() => 0);
  return events.map((e) => (e.release - e.press) / totalDuration);
}

/**
 * 音の長さ（duration）の判定
 * 理想比率と実際の比率を比較
 */
export function judgeDurationRatios(
  idealDurations: number[],
  actualDurations: number[],
  tolerance: number = 0.15,
): { score: number; perNoteErrors: number[] } {
  if (actualDurations.length < idealDurations.length) {
    return { score: 0, perNoteErrors: idealDurations.map(() => 1) };
  }

  const perNoteErrors: number[] = [];
  // 理想と実際を正規化して比較（合計=1.0になるように）
  const idealSum = idealDurations.reduce((s, d) => s + d, 0);
  const actualSlice = actualDurations.slice(0, idealDurations.length);
  const actualSum = actualSlice.reduce((s, d) => s + d, 0);

  for (let i = 0; i < idealDurations.length; i++) {
    const idealNorm = idealSum > 0 ? idealDurations[i] / idealSum : 0;
    const actualNorm = actualSum > 0 ? actualSlice[i] / actualSum : 0;
    perNoteErrors.push(Math.abs(idealNorm - actualNorm));
  }

  const avgError =
    perNoteErrors.reduce((s, e) => s + e, 0) / perNoteErrors.length;
  const score = Math.max(0, 1 - avgError / tolerance);
  return { score, perNoteErrors };
}

/**
 * タイミング + 音の長さ の総合判定
 * タイミングスコア(50%) + 音長スコア(50%) の加重平均
 */
export function judgeFullRhythm(
  pattern: RhythmPattern,
  events: NoteEvent[],
  timingTolerance: number = 0.1,
  durationTolerance: number = 0.15,
): {
  score: number;
  timingScore: number;
  durationScore: number;
  perNoteTimingErrors: number[];
  perNoteDurationErrors: number[];
} {
  // タイミング判定（従来の比率ベース）
  const idealRatios = getIdealRatios(pattern);
  const tapTimestamps = events.map((e) => e.press);
  const tapRatios = getTapRatios(tapTimestamps);
  const timing = judgeRatioTiming(idealRatios, tapRatios, timingTolerance);

  // 音の長さ判定
  const idealDurations = getIdealDurationRatios(pattern);
  const actualDurations = getActualDurationRatios(events);
  const duration = judgeDurationRatios(
    idealDurations,
    actualDurations,
    durationTolerance,
  );

  // 加重平均 (50:50)
  const score = timing.score * 0.5 + duration.score * 0.5;

  return {
    score,
    timingScore: timing.score,
    durationScore: duration.score,
    perNoteTimingErrors: timing.perNoteErrors,
    perNoteDurationErrors: duration.perNoteErrors,
  };
}
