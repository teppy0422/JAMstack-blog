/**
 * 共有音符ユーティリティ
 * PianoKeyboard, page.tsx, SightReadingFlashcard 等で共通利用
 */

export interface StaffNote {
  step: string; // "C" | "D" | "E" | "F" | "G" | "A" | "B"
  octave: number;
  alter: number; // 0=ナチュラル, 1=シャープ, -1=フラット
  midi: number;
  clef: "treble" | "bass";
}

const STEP_TO_SEMITONE: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// ナチュラル音のみのMIDI番号→ステップ名マッピング
const SEMITONE_TO_STEP: Record<number, string> = {
  0: "C",
  2: "D",
  4: "E",
  5: "F",
  7: "G",
  9: "A",
  11: "B",
};

/** 音符をMIDI番号に変換 */
export const noteToMidi = (
  step: string | number,
  octave: number,
  alter: number,
): number => {
  const stepKey = typeof step === "string" ? step.toUpperCase() : String(step);
  // 数値ステップもサポート (0=C, 1=D, etc.)
  const numericSteps: Record<string, number> = {
    "0": 0, "1": 2, "2": 4, "3": 5, "4": 7, "5": 9, "6": 11,
  };
  const semitone = STEP_TO_SEMITONE[stepKey] ?? numericSteps[stepKey] ?? 0;
  const safeAlter = typeof alter === "number" ? alter : 0;
  return (octave + 1) * 12 + semitone + safeAlter;
};

/** MIDI番号から音符名を取得 (例: "C4", "D#5") */
export const midiToNoteName = (midi: number): string => {
  const octave = Math.floor(midi / 12) - 1;
  const note = NOTE_NAMES[midi % 12];
  return `${note}${octave}`;
};

/** 黒鍵かどうか判定 */
export const isBlackKey = (midi: number): boolean => {
  if (typeof midi !== "number" || isNaN(midi)) return false;
  return [1, 3, 6, 8, 10].includes(midi % 12);
};

/** ナチュラル音のステップ名一覧（C〜Bの順） */
export const NATURAL_STEPS = ["C", "D", "E", "F", "G", "A", "B"] as const;

/**
 * ランダムな音符を生成
 * @param clef "treble" | "bass"
 * @param includeAccidentals シャープ・フラットを含むか（初期版はfalse）
 */
export const generateRandomNote = (
  clef: "treble" | "bass",
  includeAccidentals: boolean = false,
): StaffNote => {
  // ト音記号: C4(60)〜C6(84) / ヘ音記号: C2(36)〜C4(60)
  const minMidi = clef === "treble" ? 60 : 36;
  const maxMidi = clef === "treble" ? 84 : 60;

  if (!includeAccidentals) {
    // ナチュラル音のみ: 範囲内のナチュラルMIDI番号を列挙
    const naturals: number[] = [];
    for (let m = minMidi; m <= maxMidi; m++) {
      if (!isBlackKey(m)) naturals.push(m);
    }
    const midi = naturals[Math.floor(Math.random() * naturals.length)];
    const semitone = midi % 12;
    const octave = Math.floor(midi / 12) - 1;
    const step = SEMITONE_TO_STEP[semitone] || "C";
    return { step, octave, alter: 0, midi, clef };
  }

  // シャープ・フラット込み
  const midi = minMidi + Math.floor(Math.random() * (maxMidi - minMidi + 1));
  const semitone = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const step = SEMITONE_TO_STEP[semitone];
  if (step) {
    return { step, octave, alter: 0, midi, clef };
  }
  // 黒鍵: シャープとして扱う
  const sharpStep = SEMITONE_TO_STEP[semitone - 1] || "C";
  return { step: sharpStep, octave, alter: 1, midi, clef };
};

/**
 * MIDI番号を五線譜上のダイアトニック位置に変換
 * 戻り値: 下第1線からのダイアトニックステップ数
 *   0=下第1線, 1=第1間, 2=第2線, ... 8=上第1線
 *
 * ト音記号: 下第1線=E4, 上第1線=F5
 * ヘ音記号: 下第1線=G2, 上第1線=A3
 */
export const midiToStaffPosition = (
  midi: number,
  clef: "treble" | "bass",
): number => {
  // ダイアトニック音階（C=0, D=1, E=2, F=3, G=4, A=5, B=6）
  const SEMITONE_TO_DIATONIC: Record<number, number> = {
    0: 0, // C
    1: 0, // C#→C
    2: 1, // D
    3: 1, // D#→D
    4: 2, // E
    5: 3, // F
    6: 3, // F#→F
    7: 4, // G
    8: 4, // G#→G
    9: 5, // A
    10: 5, // A#→A
    11: 6, // B
  };

  const octave = Math.floor(midi / 12) - 1;
  const semitone = midi % 12;
  const diatonic = SEMITONE_TO_DIATONIC[semitone] ?? 0;

  // 絶対ダイアトニック位置 (C0 = 0)
  const absolutePos = octave * 7 + diatonic;

  // 基準: 下第1線のダイアトニック位置
  // ト音記号: E4 → 4*7+2 = 30
  // ヘ音記号: G2 → 2*7+4 = 18
  const refPos = clef === "treble" ? 30 : 18;

  return absolutePos - refPos;
};
