"use client";
import { useColorMode } from "@chakra-ui/react";
import { noteToMidi, midiToNoteName, isBlackKey } from "../lib/noteUtils";
import { getHandColor, getWrongColor, getScoreColors } from "../lib/colors";

interface Note {
  step: string;
  octave: number;
  alter: number;
  staff?: number;
}

interface PianoKeyboardProps {
  notes: Note[];
  minMidi?: number;
  maxMidi?: number;
  /** 間違えて押した鍵盤のMIDI番号配列（赤く表示される） */
  wrongNotes?: number[];
  /** 実際に押されている鍵盤のMIDI番号配列（下部インジケーターで表示） */
  pressedNotes?: number[];
}

// 音符データから表記名を取得（フラット・シャープの区別を保持）
const noteToDisplayName = (note: Note): string => {
  let noteName = note.step;
  if (note.alter === 1) {
    noteName += "#";
  } else if (note.alter === -1) {
    noteName += "b";
  }
  return `${noteName}${note.octave}`;
};

export default function PianoKeyboard({
  notes,
  minMidi,
  maxMidi,
  wrongNotes = [],
  pressedNotes = [],
}: PianoKeyboardProps) {
  // 表示する鍵盤の範囲（デフォルト: C1-C7: MIDI 24-96）
  // If minMidi/maxMidi are provided but seem incorrect, use defaults
  let startMidi = 24;
  let endMidi = 96;
  const { colorMode } = useColorMode();
  const darkMode = colorMode === "dark";
  const sc = getScoreColors(darkMode);

  if (minMidi !== undefined && maxMidi !== undefined) {
    // Only use provided range if it seems valid
    if (minMidi <= maxMidi && minMidi >= 0 && maxMidi <= 127) {
      startMidi = minMidi;
      endMidi = maxMidi;
    }
  }

  // ハイライトする鍵盤のMIDI番号とstaff情報、表記名をマッピング
  const midiToStaffMap = new Map<number, number | undefined>();
  const midiToDisplayNameMap = new Map<number, string>();
  const highlightedMidiSet = new Set<number>();
  notes
    .filter((note) => note.step && typeof note.octave === "number")
    .forEach((note) => {
      const midi = noteToMidi(note.step, note.octave, note.alter);
      midiToStaffMap.set(midi, note.staff);
      highlightedMidiSet.add(midi);
      // 元の音符データから表記名を保存（フラット・シャープを区別）
      midiToDisplayNameMap.set(midi, noteToDisplayName(note));
    });

  const highlightedMidis = Array.from(highlightedMidiSet);

  // 白鍵の数を数える
  let whiteKeyCount = 0;
  for (let midi = startMidi; midi <= endMidi; midi++) {
    if (!isBlackKey(midi)) {
      whiteKeyCount++;
    }
  }

  // 白鍵と黒鍵を描画
  const whiteKeys: JSX.Element[] = [];
  const blackKeys: JSX.Element[] = [];
  let whiteKeyIndex = 0;

  const wrongNoteSet = new Set(wrongNotes);
  const pressedNoteSet = new Set(pressedNotes);

  for (let midi = startMidi; midi <= endMidi; midi++) {
    const isHighlighted = highlightedMidis.includes(midi);
    const isWrong = wrongNoteSet.has(midi);
    const isBlack = isBlackKey(midi);
    const staff = midiToStaffMap.get(midi);
    const displayName = midiToDisplayNameMap.get(midi) || midiToNoteName(midi);

    // 間違い音は赤、正しい音はstaff色（右手=青、左手=緑）、それ以外は白
    let highlightKeyColor = sc.whiteKey;
    if (isWrong) {
      highlightKeyColor = getWrongColor(false);
    } else if (isHighlighted) {
      highlightKeyColor = getHandColor(staff, false);
    }
    if (!isBlack) {
      const isPressed = pressedNoteSet.has(midi);
      whiteKeys.push(
        <div
          key={`white-${midi}`}
          style={{
            position: "relative",
            width: `${100 / whiteKeyCount}%`,
            height: "100%",
            backgroundColor: `${highlightKeyColor}${sc.whiteKeyHighlightAlpha}`,
            border: `1px solid ${sc.whiteKeyBorder}`,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontSize: "10px",
            paddingBottom: "5px",
            color: isHighlighted || isWrong ? sc.highlightLabel : sc.whiteKeyLabel,
            fontWeight: isHighlighted || isWrong ? "bold" : "normal",
            transition: "background-color 0.2s",
          }}
        >
          {(isHighlighted || isWrong) && (
            <span
              style={{
                display: "inline-block",
                transform: "rotate(90deg)",
                transformOrigin: "center",
              }}
            >
              {displayName}
            </span>
          )}
          {isPressed && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "10%",
                backgroundColor: "#f59e0b",
                pointerEvents: "none",
              }}
            />
          )}
        </div>,
      );
      whiteKeyIndex++;
    }
  }

  // 黒鍵を白鍵の上に重ねて配置
  whiteKeyIndex = 0;
  for (let midi = startMidi; midi <= endMidi; midi++) {
    const isHighlighted = highlightedMidis.includes(midi);
    const isWrong = wrongNoteSet.has(midi);
    const isBlack = isBlackKey(midi);
    const staff = midiToStaffMap.get(midi);
    const displayName = midiToDisplayNameMap.get(midi) || midiToNoteName(midi);

    // 間違い音は赤、正しい音はstaff色（右手=青、左手=緑）、それ以外は黒
    let highlightKeyColor = sc.blackKey;
    if (isWrong) {
      highlightKeyColor = getWrongColor(true);
    } else if (isHighlighted) {
      highlightKeyColor = getHandColor(staff, true);
    }
    if (isBlack) {
      const isPressed = pressedNoteSet.has(midi);
      const position =
        whiteKeyIndex * (100 / whiteKeyCount) - (100 / whiteKeyCount) * 0.3;
      blackKeys.push(
        <div
          key={`black-${midi}`}
          style={{
            position: "absolute",
            left: `${position}%`,
            width: `${(100 / whiteKeyCount) * 0.6}%`,
            height: "60%",
            backgroundColor: highlightKeyColor,
            border: `1px solid ${sc.blackKeyBorder}`,
            boxSizing: "border-box",
            zIndex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontSize: "6px",
            paddingBottom: "5px",
            color: sc.highlightLabel,
            fontWeight: isHighlighted || isWrong ? "bold" : "normal",
            transition: "background-color 0.2s",
          }}
        >
          {(isHighlighted || isWrong) && (
            <span
              style={{
                display: "inline-block",
                transform: "rotate(90deg)",
                transformOrigin: "center",
              }}
            >
              {displayName}
            </span>
          )}
          {isPressed && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "10%",
                backgroundColor: "#f59e0b",
                pointerEvents: "none",
              }}
            />
          )}
        </div>,
      );
    } else {
      whiteKeyIndex++;
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        backgroundColor: sc.pianoBackground,
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      {/* 白鍵 */}
      {whiteKeys}

      {/* 黒鍵 */}
      {blackKeys}
    </div>
  );
}
