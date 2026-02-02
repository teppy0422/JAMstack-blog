"use client";

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

// 音符をMIDI番号に変換
const noteToMidi = (
  step: string | number,
  octave: number,
  alter: number,
): number => {
  const stepToSemitone: { [key: string]: number } = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
    "0": 0,
    "1": 2,
    "2": 4,
    "3": 5,
    "4": 7,
    "5": 9,
    "6": 11, // 数値の場合（0=C, 1=D, etc）
  };
  const stepKey = typeof step === "string" ? step.toUpperCase() : String(step);
  const semitone = stepToSemitone[stepKey] || 0;
  const safeAlter = typeof alter === "number" ? alter : 0;
  return (octave + 1) * 12 + semitone + safeAlter;
};

// MIDI番号から音符名を取得
const midiToNoteName = (midi: number): string => {
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const octave = Math.floor(midi / 12) - 1;
  const note = noteNames[midi % 12];
  return `${note}${octave}`;
};

// 黒鍵かどうか判定
const isBlackKey = (midi: number): boolean => {
  if (typeof midi !== "number" || isNaN(midi)) {
    return false;
  }
  const semitone = midi % 12;
  return [1, 3, 6, 8, 10].includes(semitone);
};

export default function PianoKeyboard({
  notes,
  minMidi,
  maxMidi,
}: PianoKeyboardProps) {
  // 表示する鍵盤の範囲（デフォルト: C1-C7: MIDI 24-96）
  // If minMidi/maxMidi are provided but seem incorrect, use defaults
  let startMidi = 24;
  let endMidi = 96;

  if (minMidi !== undefined && maxMidi !== undefined) {
    // Only use provided range if it seems valid
    if (minMidi <= maxMidi && minMidi >= 0 && maxMidi <= 127) {
      startMidi = minMidi;
      endMidi = maxMidi;
    }
  }

  // ハイライトする鍵盤のMIDI番号とstaff情報、表記名をマッピング
  const midiToStaffMap = new Map<number, number>();
  const midiToDisplayNameMap = new Map<number, string>();
  notes
    .filter((note) => note.step && typeof note.octave === "number")
    .forEach((note) => {
      const midi = noteToMidi(note.step, note.octave, note.alter);
      if (note.staff !== undefined) {
        midiToStaffMap.set(midi, note.staff);
      }
      // 元の音符データから表記名を保存（フラット・シャープを区別）
      midiToDisplayNameMap.set(midi, noteToDisplayName(note));
    });

  const highlightedMidis = Array.from(midiToStaffMap.keys());
  console.log("PianoKeyboard - highlightedMidis:", highlightedMidis);
  console.log("PianoKeyboard - midiToStaffMap:", Array.from(midiToStaffMap.entries()));

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

  for (let midi = startMidi; midi <= endMidi; midi++) {
    const isHighlighted = highlightedMidis.includes(midi);
    const isBlack = isBlackKey(midi);
    const staff = midiToStaffMap.get(midi);
    const displayName = midiToDisplayNameMap.get(midi) || midiToNoteName(midi);

    // staff 0 = 右手（緑色 #4CAF50）, staff 1 = 左手（濃い緑 #2E7D32）
    let whiteKeyColor = "#ffffff";
    if (isHighlighted) {
      whiteKeyColor = staff === 1 ? "#33e02f" : "#33e02f";
    }

    if (!isBlack) {
      whiteKeys.push(
        <div
          key={`white-${midi}`}
          style={{
            position: "relative",
            width: `${100 / whiteKeyCount}%`,
            height: "100%",
            backgroundColor: whiteKeyColor,
            opacity: 0.6,
            border: "1px solid #333",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontSize: "10px",
            paddingBottom: "5px",
            color: isHighlighted ? "#000" : "#999",
            fontWeight: isHighlighted ? "bold" : "normal",
            transition: "background-color 0.2s",
          }}
        >
          {isHighlighted && (
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
        </div>,
      );
      whiteKeyIndex++;
    }
  }

  // 黒鍵を白鍵の上に重ねて配置
  whiteKeyIndex = 0;
  for (let midi = startMidi; midi <= endMidi; midi++) {
    const isHighlighted = highlightedMidis.includes(midi);
    const isBlack = isBlackKey(midi);
    const staff = midiToStaffMap.get(midi);
    const displayName = midiToDisplayNameMap.get(midi) || midiToNoteName(midi);

    // staff 0 = 右手（青色 #2196F3）, staff 1 = 左手（濃い青 #1565C0）
    let blackKeyColor = "#000";
    if (isHighlighted) {
      blackKeyColor = staff === 1 ? "#85EC82" : "#85EC82";
    }

    if (isBlack) {
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
            backgroundColor: blackKeyColor,
            opacity: 1,
            border: "1px solid #000",
            boxSizing: "border-box",
            zIndex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontSize: "6px",
            paddingBottom: "5px",
            color: "#000",
            fontWeight: isHighlighted ? "bold" : "normal",
            transition: "background-color 0.2s",
          }}
        >
          {isHighlighted && (
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
        backgroundColor: "#f5f5f5",
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
