/**
 * 楽譜アプリ共通カラー定数
 *
 * 鍵盤・楽譜・落下ノート・フラッシュカード等の色を一元管理。
 * 色を変更したい場合はここだけ修正すればOK。
 */

// ─── 手ごとの色 ───

/** 右手（staff=1）白鍵ハイライト色 */
export const COLOR_RIGHT_HAND = "#19F3FF";
/** 右手（staff=1）黒鍵ハイライト色 */
export const COLOR_RIGHT_HAND_BLACK = "#0DAFFF";

/** 左手（staff=2）白鍵ハイライト色 */
export const COLOR_LEFT_HAND = "#73FF79";
/** 左手（staff=2）黒鍵ハイライト色 */
export const COLOR_LEFT_HAND_BLACK = "#10C817";

/** 間違い音の色（白鍵） */
export const COLOR_WRONG = "#FF4444";
/** 間違い音の色（黒鍵） */
export const COLOR_WRONG_BLACK = "#CC3636";

/** 正解フィードバックの色 */
export const COLOR_CORRECT = "#4CAF50";

/** staff と黒鍵フラグからハイライト色を返すヘルパー */
export function getHandColor(
  staff: number | undefined,
  black: boolean,
): string {
  if (staff === 2) return black ? COLOR_LEFT_HAND_BLACK : COLOR_LEFT_HAND;
  return black ? COLOR_RIGHT_HAND_BLACK : COLOR_RIGHT_HAND;
}

/** 間違い音の色を返すヘルパー */
export function getWrongColor(black: boolean): string {
  return black ? COLOR_WRONG_BLACK : COLOR_WRONG;
}

// ─── モード別カラーセット ───

export interface ScoreColors {
  /** 落下ノート / キャンバス背景 */
  fallingNotesBg: string;
  /** ヒットライン */
  hitLine: string;
  /** 鍵盤背景（白鍵領域の外枠） */
  pianoBackground: string;
  /** 白鍵のデフォルト色 */
  whiteKey: string;
  /** 黒鍵のデフォルト色 */
  blackKey: string;
  /** 白鍵の文字色（非ハイライト時） */
  whiteKeyLabel: string;
  /** 白鍵の枠線色 */
  whiteKeyBorder: string;
  /** 黒鍵の枠線色 */
  blackKeyBorder: string;
  /** ハイライト時の文字色（白鍵上） */
  highlightLabel: string;
  /** 白鍵ハイライト時の透明度サフィックス (hex 2桁) */
  whiteKeyHighlightAlpha: string;
  /** 楽譜の音符・棒・休符の色（空文字 = OSMD デフォルト） */
  scoreNotehead: string;
  /** 楽譜のタイトル色（空文字 = OSMD デフォルト） */
  scoreTitle: string;
  /** 楽譜カーソルオーバーレイ色 */
  cursorOverlay: string;
  /** 楽譜カーソルオーバーレイ透明度 */
  cursorOverlayOpacity: string;
  /** 小節線（FallingNotes内）の色 */
  measureLine: string;
  /** 小節番号テキスト色 */
  measureLabel: string;
  /** 鍵盤区切り線（FallingNotes内） */
  keyDivider: string;
}

export const LIGHT_COLORS: ScoreColors = {
  fallingNotesBg: "#2c2c3a",
  hitLine: "rgba(255, 255, 255, 0.4)",
  pianoBackground: "#f5f5f5",
  whiteKey: "#ffffff",
  blackKey: "#000000",
  whiteKeyLabel: "#999",
  whiteKeyBorder: "#333",
  blackKeyBorder: "#000",
  highlightLabel: "#000",
  whiteKeyHighlightAlpha: "77",
  scoreNotehead: "",
  scoreTitle: "",
  cursorOverlay: "",
  cursorOverlayOpacity: "0.5",
  measureLine: "rgba(255,255,255,0.25)",
  measureLabel: "rgba(255,255,255,0.5)",
  keyDivider: "rgba(255,255,255,0.06)",
};

export const DARK_COLORS: ScoreColors = {
  fallingNotesBg: "#1a1a2e",
  hitLine: "rgba(255, 255, 255, 0.4)",
  pianoBackground: "#f5f5f5",
  whiteKey: "#ffffff",
  blackKey: "#000000",
  whiteKeyLabel: "#999",
  whiteKeyBorder: "#333",
  blackKeyBorder: "#000",
  highlightLabel: "#000",
  whiteKeyHighlightAlpha: "99",
  scoreNotehead: "#FFD700",
  scoreTitle: "#FFFFFF",
  cursorOverlay: "#F89173",
  cursorOverlayOpacity: "0.7",
  measureLine: "rgba(255,255,255,0.25)",
  measureLabel: "rgba(255,255,255,0.5)",
  keyDivider: "rgba(255,255,255,0.08)",
};

/** darkMode フラグに応じたカラーセットを返す */
export function getScoreColors(darkMode: boolean): ScoreColors {
  return darkMode ? DARK_COLORS : LIGHT_COLORS;
}

// ─── 後方互換（既存 import 向け） ───

/** @deprecated getScoreColors(darkMode).hitLine を使ってください */
export const COLOR_HIT_LINE = "rgba(255, 255, 255, 0.4)";
