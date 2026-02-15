"use client";

import { midiToStaffPosition, type StaffNote } from "../lib/noteUtils";
import { VEXFLOW_GLYPHS, VEXFLOW_RESOLUTION, getGlyphPath } from "../lib/staffGlyphs";

interface StaffChordSVGProps {
  notes: StaffNote[];
  feedbackState?: "none" | "correct" | "incorrect";
  showChordName?: string;
  darkMode?: boolean;
}

/**
 * 五線譜上に和音（複数音符）を表示するSVGコンポーネント
 */
export default function StaffChordSVG({
  notes,
  feedbackState = "none",
  showChordName,
  darkMode = false,
}: StaffChordSVGProps) {
  if (notes.length === 0) return null;

  const clef = notes[0].clef;

  // SVG座標系
  const svgWidth = 240;
  const svgHeight = 160;
  const staffTop = 45;
  const lineSpacing = 14;
  const staffLines = [0, 1, 2, 3, 4];

  const lineY = (lineIndex: number) => staffTop + lineIndex * lineSpacing;
  const bottomLineY = lineY(4);
  const halfSpace = lineSpacing / 2;

  // 色
  const lineColor = darkMode ? "#d0d0d0" : "#333";
  const noteColor =
    feedbackState === "correct"
      ? "#4CAF50"
      : feedbackState === "incorrect"
        ? "#FF4444"
        : darkMode
          ? "#d0d0d0"
          : "#333";

  // 各音の五線譜位置を計算
  const noteData = notes
    .map((n) => ({
      note: n,
      staffPos: midiToStaffPosition(n.midi, n.clef),
    }))
    .sort((a, b) => a.staffPos - b.staffPos); // 低→高

  const noteX = 155;
  const notePoint = 52;
  const noteScale = (notePoint * 72.0) / (VEXFLOW_RESOLUTION * 100.0);
  const noteXOffset = -7;
  const noteRightEdge = noteXOffset + 428 * noteScale - 2;
  const noteLeftEdge = noteXOffset + 1;
  const noteheadWidth = 428 * noteScale;

  // ステムの向き: 平均位置が第3線(pos=4)以下なら上向き
  const avgPos =
    noteData.reduce((s, d) => s + d.staffPos, 0) / noteData.length;
  const stemUp = avgPos <= 4;

  // 2度音程の衝突検出: 隣接音は横にずらす
  const notePositions: {
    staffPos: number;
    noteY: number;
    xOffset: number;
    note: StaffNote;
  }[] = [];

  for (let i = 0; i < noteData.length; i++) {
    const pos = noteData[i].staffPos;
    const y = bottomLineY - pos * halfSpace;
    let xOff = 0;

    // 前の音との距離が1（2度音程）なら横にずらす
    if (i > 0) {
      const prevPos = noteData[i - 1].staffPos;
      if (pos - prevPos === 1) {
        // 上向きステム: 上の音を右にずらす / 下向き: 下の音を右にずらす
        if (stemUp) {
          xOff = noteheadWidth;
        } else {
          // 下向きの場合、前の音をずらす
          notePositions[i - 1].xOffset = -noteheadWidth;
        }
      }
    }

    notePositions.push({
      staffPos: pos,
      noteY: y,
      xOffset: xOff,
      note: noteData[i].note,
    });
  }

  // 加線の計算（全音符の合集合）
  const ledgerLineYs = new Set<number>();
  for (const np of notePositions) {
    const pos = np.staffPos;
    if (pos <= -2) {
      for (let p = -2; p >= pos; p -= 2) {
        ledgerLineYs.add(bottomLineY - p * halfSpace);
      }
    }
    if (pos === 0) {
      ledgerLineYs.add(bottomLineY);
    }
    if (pos >= 10) {
      for (let p = 10; p <= pos; p += 2) {
        ledgerLineYs.add(bottomLineY - p * halfSpace);
      }
    }
  }

  // 臨時記号の配置（衝突回避: 下から上へ配置、近い音は左にずらす）
  const accidentals: { x: number; y: number; alter: number }[] = [];
  let lastAccY = Infinity;
  const accSpacing = 15;

  // 上から下に処理して近い音の臨時記号を左にずらす
  const sortedByPosDesc = [...notePositions].sort(
    (a, b) => b.staffPos - a.staffPos,
  );
  let accCol = 0;
  for (const np of sortedByPosDesc) {
    if (np.note.alter === 0) continue;
    const y = np.noteY;
    if (lastAccY - y < 18) {
      accCol++;
    } else {
      accCol = 0;
    }
    accidentals.push({
      x: noteX - 20 - accCol * accSpacing,
      y,
      alter: np.note.alter,
    });
    lastAccY = y;
  }

  // ステム
  const lowestY = notePositions[0].noteY;
  const highestY = notePositions[notePositions.length - 1].noteY;

  let stemX: number;
  let stemY1: number;
  let stemY2: number;

  if (stemUp) {
    stemX = noteX + noteRightEdge;
    stemY1 = lowestY; // 最低音から
    stemY2 = highestY - 40; // 最高音の上へ
  } else {
    stemX = noteX + noteLeftEdge;
    stemY1 = highestY; // 最高音から
    stemY2 = lowestY + 40; // 最低音の下へ
  }

  // 音部記号のパス
  const trebleClefPath = getGlyphPath(
    VEXFLOW_GLYPHS.trebleClef,
    38,
    lineY(3),
    57,
  );
  const bassClefPath = getGlyphPath(VEXFLOW_GLYPHS.bassClef, 38, lineY(1), 57);

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
      <path
        d={clef === "treble" ? trebleClefPath : bassClefPath}
        fill={lineColor}
      />

      {/* 加線 */}
      {[...ledgerLineYs].map((y, i) => (
        <line
          key={`ledger-${i}`}
          x1={noteX - 18}
          y1={y}
          x2={noteX + 18 + (notePositions.some((np) => np.xOffset > 0) ? noteheadWidth : 0)}
          y2={y}
          stroke={lineColor}
          strokeWidth={1}
        />
      ))}

      {/* 音符ヘッド */}
      {notePositions.map((np, i) => (
        <path
          key={`head-${i}`}
          d={getGlyphPath(
            VEXFLOW_GLYPHS.noteheadBlack,
            noteX + noteXOffset + np.xOffset,
            np.noteY,
            notePoint,
          )}
          fill={noteColor}
          style={{ transition: "fill 0.2s" }}
        />
      ))}

      {/* ステム */}
      <line
        x1={stemX}
        y1={stemY1}
        x2={stemX}
        y2={stemY2}
        stroke={noteColor}
        strokeWidth={1.5}
        style={{ transition: "stroke 0.2s" }}
      />

      {/* 臨時記号 */}
      {accidentals.map((acc, i) => (
        <path
          key={`acc-${i}`}
          d={getGlyphPath(
            acc.alter === 1
              ? VEXFLOW_GLYPHS.accidentalSharp
              : VEXFLOW_GLYPHS.accidentalFlat,
            acc.x,
            acc.y,
            22,
          )}
          fill={noteColor}
          style={{ transition: "fill 0.2s" }}
        />
      ))}

      {/* コード名表示（フィードバック時） */}
      {showChordName && (
        <text
          x={noteX}
          y={svgHeight - 8}
          fontSize="16"
          fontWeight="bold"
          fill={noteColor}
          textAnchor="middle"
          style={{ transition: "fill 0.2s" }}
        >
          {showChordName}
        </text>
      )}
    </svg>
  );
}
