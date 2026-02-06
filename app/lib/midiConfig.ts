/**
 * MIDI入力設定の型定義とプリセット
 */

export interface MidiConfig {
  /** 音の判定方式: "any"=何でも進む, "contains"=必要な音が含まれていれば進む, "exact"=完全一致 */
  matchMode: "any" | "contains" | "exact";
  /** 和音判定の時間窓(ms) - この時間内に押された音をまとめて判定 */
  chordTimeWindow: number;
  /** 休符を自動スキップするか */
  skipRests: boolean;
  /** 間違い時に赤鍵盤表示するか */
  showWrongNotes: boolean;
  /** 赤鍵盤クリアのタイミング: "nextNoteOn"=次の音入力時, "timeout"=一定時間後 */
  wrongNoteResetOn: "nextNoteOn" | "timeout";
  /** wrongNoteResetOn が "timeout" の場合のミリ秒 */
  wrongNoteTimeout: number;
  /** オクターブ無視モード: ピッチクラス(音名)のみで比較 */
  octaveIgnore: boolean;
  /** ベロシティ感度: 弱い入力を無視する */
  velocitySensitivity: boolean;
  /** ベロシティ閾値 (1-127): この値未満のNote Onを無視 */
  velocityThreshold: number;
  /** 判定対象の譜表: "both"=両手, 1=右手のみ, 2=左手のみ */
  staffFilter: "both" | 1 | 2;
}

export type MidiPresetName = "performance" | "practice" | "exact";

export const midiPresets: Record<MidiPresetName, MidiConfig> = {
  /** 演奏モード: どんな音でも進む */
  performance: {
    matchMode: "any",
    chordTimeWindow: 50,
    skipRests: true,
    showWrongNotes: false,
    wrongNoteResetOn: "nextNoteOn",
    wrongNoteTimeout: 1000,
    octaveIgnore: false,
    velocitySensitivity: false,
    velocityThreshold: 20,
    staffFilter: "both",
  },
  /** 練習モード: 必要な音が含まれていれば進む（余分な音はOK） */
  practice: {
    matchMode: "contains",
    chordTimeWindow: 50,
    skipRests: true,
    showWrongNotes: true,
    wrongNoteResetOn: "nextNoteOn",
    wrongNoteTimeout: 1000,
    octaveIgnore: true,
    velocitySensitivity: false,
    velocityThreshold: 20,
    staffFilter: "both",
  },
  /** 完全一致モード: 余分な音もNG */
  exact: {
    matchMode: "exact",
    chordTimeWindow: 50,
    skipRests: true,
    showWrongNotes: true,
    wrongNoteResetOn: "nextNoteOn",
    wrongNoteTimeout: 1000,
    octaveIgnore: false,
    velocitySensitivity: false,
    velocityThreshold: 20,
    staffFilter: "both",
  },
};

export const defaultMidiConfig: MidiConfig = midiPresets.exact;
