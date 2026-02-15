"use client";

import { midiToStaffPosition, type StaffNote } from "../lib/noteUtils";
import { VEXFLOW_GLYPHS, VEXFLOW_RESOLUTION, getGlyphPath } from "../lib/staffGlyphs";

interface StaffNoteSVGProps {
  note: StaffNote;
  feedbackState?: "none" | "correct" | "incorrect";
  showNoteName?: boolean;
  darkMode?: boolean;
}

/**
 * 五線譜上に1つの音符を表示するSVGコンポーネント
 * 音部記号・音符・臨時記号にVexFlowのグリフを使用
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
  if (staffPosition <= -2) {
    for (let pos = -2; pos >= staffPosition; pos -= 2) {
      ledgerLines.push(bottomLineY - pos * (lineSpacing / 2));
    }
  }
  if (staffPosition === 0) {
    ledgerLines.push(bottomLineY);
  }
  if (staffPosition >= 10) {
    for (let pos = 10; pos <= staffPosition; pos += 2) {
      ledgerLines.push(bottomLineY - pos * (lineSpacing / 2));
    }
  }

  // VexFlowグリフのパス生成
  // ト音記号: point=38で第3線（B4）中心あたりに配置
  const trebleClefPath = getGlyphPath(
    VEXFLOW_GLYPHS.trebleClef,
    38,
    lineY(3),
    57,
  );
  // ヘ音記号: point=32で第2線（D3）あたり
  const bassClefPath = getGlyphPath(VEXFLOW_GLYPHS.bassClef, 38, lineY(1), 57);

  // 音符ヘッドのサイズ（point）
  // noteheadBlackの座標範囲は373単位。線間(14px)にフィットさせるにはpoint≈52が必要
  const notePoint = 52;
  const noteScale = (notePoint * 72.0) / (VEXFLOW_RESOLUTION * 100.0);
  // ノートヘッドの端の位置（ステム接続用）
  const noteXOffset = -7; // originXのオフセット（ノートヘッドを中央寄せ）
  const noteRightEdge = noteXOffset + 428 * noteScale - 2; // ノートヘッド右端から2px内側
  const noteLeftEdge = noteXOffset + 1; // ノートヘッド左端から2px内側
  const noteheadPath = getGlyphPath(
    VEXFLOW_GLYPHS.noteheadBlack,
    noteX + noteXOffset,
    noteY,
    notePoint,
  );

  // 臨時記号のパス
  const accidentalPath =
    note.alter === 1
      ? getGlyphPath(VEXFLOW_GLYPHS.accidentalSharp, noteX - 20, noteY, 22)
      : note.alter === -1
        ? getGlyphPath(VEXFLOW_GLYPHS.accidentalFlat, noteX - 18, noteY, 22)
        : null;

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

      {/* 音部記号（VexFlowグリフ） */}
      <path
        d={note.clef === "treble" ? trebleClefPath : bassClefPath}
        fill={lineColor}
      />

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

      {/* 音符ヘッド（VexFlowグリフ） */}
      <path
        d={noteheadPath}
        fill={noteColor}
        style={{ transition: "fill 0.2s" }}
      />

      {/* 符幹（ステム） */}
      {staffPosition <= 4 ? (
        <line
          x1={noteX + noteRightEdge}
          y1={noteY}
          x2={noteX + noteRightEdge}
          y2={noteY - 40}
          stroke={noteColor}
          strokeWidth={1.5}
          style={{ transition: "stroke 0.2s" }}
        />
      ) : (
        <line
          x1={noteX + noteLeftEdge}
          y1={noteY}
          x2={noteX + noteLeftEdge}
          y2={noteY + 40}
          stroke={noteColor}
          strokeWidth={1.5}
          style={{ transition: "stroke 0.2s" }}
        />
      )}

      {/* 臨時記号（VexFlowグリフ） */}
      {accidentalPath && (
        <path
          d={accidentalPath}
          fill={noteColor}
          style={{ transition: "fill 0.2s" }}
        />
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
