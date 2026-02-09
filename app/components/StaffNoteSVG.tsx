"use client";

import { midiToStaffPosition, type StaffNote } from "../lib/noteUtils";

interface StaffNoteSVGProps {
  note: StaffNote;
  feedbackState?: "none" | "correct" | "incorrect";
  showNoteName?: boolean;
  darkMode?: boolean;
}

// ト音記号 SVGパス (simplified)
const TREBLE_CLEF_PATH =
  "M12 0C12 0 12.8 4.8 12.8 8.8C12.8 12 11.2 14.4 8.8 16C6.4 17.6 4 17.6 2.4 16.4C0.8 15.2 0 13.2 0 11.2C0 9.2 0.8 7.6 2.4 6.4C4 5.2 6.4 5.2 8 6C9.6 6.8 10.4 8 10.4 9.6C10.4 11.2 9.6 12.4 8.4 13.2C7.2 14 5.6 14 4.4 13.2C3.2 12.4 2.8 11.2 3.2 10C3.6 8.8 4.8 8 6 8.4C6 8.4 5.2 7.6 4 7.6C2.8 7.6 1.6 8.8 1.6 10.4C1.6 12 2.8 13.6 4.8 14C6.8 14.4 8.8 13.2 9.6 11.6C10.4 10 10 8 8.4 6.8C6.8 5.6 4.4 5.6 2.8 6.8C1.2 8 0.4 10 0.8 12C1.2 14 3.2 16 5.6 16.4C8 16.8 10.4 15.6 11.6 13.6C12.8 11.6 12.8 8.8 12 6.4L12 0Z";

// ヘ音記号 SVGパス (simplified)
const BASS_CLEF_PATH =
  "M0 4C0 1.6 2 0 4.4 0C6.8 0 8.8 1.6 8.8 4C8.8 6.4 6.8 8 4.4 8C2 8 0 6.4 0 4ZM10.4 1.2C10.4 0.4 11.2 0 11.6 0C12.4 0 12.8 0.4 12.8 1.2C12.8 2 12 2.4 11.6 2.4C10.8 2.4 10.4 2 10.4 1.2ZM10.4 5.2C10.4 4.4 11.2 4 11.6 4C12.4 4 12.8 4.4 12.8 5.2C12.8 6 12 6.4 11.6 6.4C10.8 6.4 10.4 6 10.4 5.2Z";

/**
 * 五線譜上に1つの音符を表示するSVGコンポーネント
 */
export default function StaffNoteSVG({
  note,
  feedbackState = "none",
  showNoteName = false,
  darkMode = false,
}: StaffNoteSVGProps) {
  const staffPosition = midiToStaffPosition(note.midi, note.clef);

  // SVG座標系
  const svgWidth = 240;
  const svgHeight = 160;
  const staffTop = 45; // 上第1線のy座標
  const lineSpacing = 14; // 線間の距離
  const staffLines = [0, 1, 2, 3, 4]; // 5本の線（上から0-4）

  // 各線のy座標（上から下へ）
  const lineY = (lineIndex: number) => staffTop + lineIndex * lineSpacing;

  // 下第1線のy座標 = lineY(4) = staffTop + 4 * lineSpacing
  const bottomLineY = lineY(4);

  // staffPosition=0が下第1線、1ステップ上がるごとにlineSpacing/2だけ上へ
  const noteY = bottomLineY - staffPosition * (lineSpacing / 2);

  // 音符のx位置
  const noteX = 155;

  // 音符の色
  const lineColor = darkMode ? "#d0d0d0" : "#333";
  const noteColor =
    feedbackState === "correct"
      ? "#4CAF50"
      : feedbackState === "incorrect"
        ? "#FF4444"
        : darkMode
          ? "#d0d0d0"
          : "#333";

  // 加線（レジャーライン）の計算
  const ledgerLines: number[] = [];
  // 下第1線より下（staffPosition < 0）
  if (staffPosition <= -2) {
    for (let pos = -2; pos >= staffPosition; pos -= 2) {
      ledgerLines.push(bottomLineY - pos * (lineSpacing / 2));
    }
  }
  // staffPosition == 0 は下第1線そのもの → 加線1本
  if (staffPosition === 0) {
    ledgerLines.push(bottomLineY);
  }
  // 上第1線より上（staffPosition > 8）
  const topLineY = lineY(0);
  if (staffPosition >= 10) {
    for (let pos = 10; pos <= staffPosition; pos += 2) {
      ledgerLines.push(bottomLineY - pos * (lineSpacing / 2));
    }
  }
  // staffPosition == 8 は上第1線そのもの（五線の一部なので加線不要）
  // staffPosition == -2 は下の加線1本追加済み

  // シャープ・フラット記号
  const accidentalSymbol =
    note.alter === 1 ? "♯" : note.alter === -1 ? "♭" : null;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      style={{ maxWidth: "400px", maxHeight: "280px" }}
    >
      {/* 五線 */}
      {staffLines.map((i) => (
        <line
          key={`line-${i}`}
          x1={30}
          y1={lineY(i)}
          x2={svgWidth - 15}
          y2={lineY(i)}
          stroke={lineColor}
          strokeWidth={1}
        />
      ))}

      {/* 音部記号 */}
      {note.clef === "treble" ? (
        <g
          transform={`translate(36, ${lineY(0) - 2}) scale(1.2)`}
          fill={lineColor}
        >
          <path d={TREBLE_CLEF_PATH} />
        </g>
      ) : (
        <g
          transform={`translate(36, ${lineY(0) - 1}) scale(1.5)`}
          fill={lineColor}
        >
          <path d={BASS_CLEF_PATH} />
        </g>
      )}

      {/* 加線（レジャーライン） */}
      {ledgerLines.map((y, i) => (
        <line
          key={`ledger-${i}`}
          x1={noteX - 18}
          y1={y}
          x2={noteX + 18}
          y2={y}
          stroke={lineColor}
          strokeWidth={1}
        />
      ))}

      {/* 音符ヘッド（楕円） */}
      <ellipse
        cx={noteX}
        cy={noteY}
        rx={8}
        ry={5.5}
        fill={noteColor}
        transform={`rotate(-15, ${noteX}, ${noteY})`}
        style={{ transition: "fill 0.2s" }}
      />

      {/* 符幹（ステム） */}
      {staffPosition <= 4 ? (
        // 下半分の音符→ステムは右上に伸びる
        <line
          x1={noteX + 7.5}
          y1={noteY}
          x2={noteX + 7.5}
          y2={noteY - 40}
          stroke={noteColor}
          strokeWidth={1.5}
          style={{ transition: "stroke 0.2s" }}
        />
      ) : (
        // 上半分の音符→ステムは左下に伸びる
        <line
          x1={noteX - 7.5}
          y1={noteY}
          x2={noteX - 7.5}
          y2={noteY + 40}
          stroke={noteColor}
          strokeWidth={1.5}
          style={{ transition: "stroke 0.2s" }}
        />
      )}

      {/* 臨時記号 */}
      {accidentalSymbol && (
        <text
          x={noteX - 20}
          y={noteY + 5}
          fontSize="18"
          fill={noteColor}
          textAnchor="middle"
          style={{ transition: "fill 0.2s" }}
        >
          {accidentalSymbol}
        </text>
      )}

      {/* 音名表示（フィードバック時） */}
      {showNoteName && (
        <text
          x={noteX}
          y={svgHeight - 8}
          fontSize="16"
          fontWeight="bold"
          fill={noteColor}
          textAnchor="middle"
          style={{ transition: "fill 0.2s" }}
        >
          {note.step}
          {note.alter === 1 ? "♯" : note.alter === -1 ? "♭" : ""}
          {note.octave}
        </text>
      )}
    </svg>
  );
}
