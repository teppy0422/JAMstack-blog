"use client";

import {
  type NoteValue,
  NOTE_DURATIONS,
  isRest,
  isDotted,
  getBaseNote,
} from "../lib/rhythmUtils";
import {
  VEXFLOW_GLYPHS,
  VEXFLOW_RESOLUTION,
  getGlyphPath,
  getTimeSigDigitGlyph,
} from "../lib/staffGlyphs";

interface RhythmNoteSVGProps {
  notes: NoteValue[];
  /** 各ノートのハイライト状態 */
  highlights?: ("none" | "active" | "correct" | "incorrect")[];
  darkMode?: boolean;
  beatsPerMeasure?: number;
}

/**
 * リズムパターンを五線譜上に表示するSVGコンポーネント
 * StaffNoteSVG / StaffChordSVG と同じ五線スタイルを使用
 */
export default function RhythmNoteSVG({
  notes,
  highlights,
  darkMode = false,
  beatsPerMeasure = 4,
}: RhythmNoteSVGProps) {
  // StaffNoteSVG / StaffChordSVG と同じ座標系
  const svgWidth = 440;
  const svgHeight = 160;
  const staffTop = 45;
  const lineSpacing = 14;
  const staffLines = [0, 1, 2, 3, 4];

  const lineY = (lineIndex: number) => staffTop + lineIndex * lineSpacing;
  const bottomLineY = lineY(4);
  const halfSpace = lineSpacing / 2;

  // 音符は第3線（E4）= staffPosition 0 に配置
  const staffY = bottomLineY - 0 * halfSpace;

  const timeSignatureX = 82; // 音部記号の右
  const startX = 105; // 音符エリア開始
  const endX = svgWidth - 20; // 右端に余白
  const usableWidth = endX - startX;

  const lineColor = darkMode ? "#d0d0d0" : "#333";

  const totalBeats = beatsPerMeasure;

  // VexFlowグリフ用の定数 (StaffNoteSVGと同じ)
  const notePoint = 52;
  const noteScale = (notePoint * 72.0) / (VEXFLOW_RESOLUTION * 100.0);
  const noteXOffset = -7;
  const noteRightEdge = noteXOffset + 428 * noteScale - 2;

  // 音部記号パス (ト音記号)
  const trebleClefPath = getGlyphPath(
    VEXFLOW_GLYPHS.trebleClef,
    38,
    lineY(3),
    57,
  );

  // 各ノートの位置と幅を計算
  interface NoteLayout {
    x: number;
    width: number;
    note: NoteValue;
    highlight: "none" | "active" | "correct" | "incorrect";
  }
  const layout: NoteLayout[] = [];
  let currentBeat = 0;
  for (let i = 0; i < notes.length; i++) {
    const dur = NOTE_DURATIONS[notes[i]];
    const x = startX + (currentBeat / totalBeats) * usableWidth;
    const width = (dur / totalBeats) * usableWidth;
    layout.push({
      x: x + width / 2,
      width,
      note: notes[i],
      highlight: highlights?.[i] ?? "none",
    });
    currentBeat += dur;
  }

  function getNoteColor(
    hl: "none" | "active" | "correct" | "incorrect",
  ): string {
    switch (hl) {
      case "active":
        return "#2196F3";
      case "correct":
        return "#4CAF50";
      case "incorrect":
        return "#FF4444";
      default:
        return lineColor;
    }
  }

  // 8分音符の連桁グループを検出
  interface BeamGroup {
    startIdx: number;
    endIdx: number;
  }
  const beamGroups: BeamGroup[] = [];
  let beamStart = -1;
  for (let i = 0; i < notes.length; i++) {
    const isBeamable = notes[i] === "eighth" || notes[i] === "sixteenth";
    if (isBeamable && beamStart === -1) {
      beamStart = i;
    } else if (!isBeamable && beamStart !== -1) {
      if (i - beamStart >= 2) {
        beamGroups.push({ startIdx: beamStart, endIdx: i - 1 });
      }
      beamStart = -1;
    }
  }
  if (beamStart !== -1 && notes.length - beamStart >= 2) {
    beamGroups.push({ startIdx: beamStart, endIdx: notes.length - 1 });
  }

  function isInBeamGroup(idx: number): boolean {
    return beamGroups.some((g) => idx >= g.startIdx && idx <= g.endIdx);
  }

  const stemLength = 40; // StaffNoteSVGと同じ

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      style={{ maxWidth: "500px", maxHeight: "280px" }}
    >
      {/* 五線 (StaffNoteSVGと同じスタイル) */}
      {staffLines.map((i) => (
        <line
          key={`line-${i}`}
          x1={30}
          y1={lineY(i)}
          x2={svgWidth - 8}
          y2={lineY(i)}
          stroke={lineColor}
          strokeWidth={1}
        />
      ))}

      {/* 音部記号 (ト音記号) */}
      <path d={trebleClefPath} fill={lineColor} />

      {/* 拍子記号 (VexFlowグリフ) */}
      <path
        d={getGlyphPath(
          getTimeSigDigitGlyph(beatsPerMeasure),
          timeSignatureX - 2,
          lineY(2.14),
          65.5,
        )}
        fill={lineColor}
      />
      <path
        d={getGlyphPath(
          getTimeSigDigitGlyph(4),
          timeSignatureX - 2,
          lineY(4.18),
          65.5,
        )}
        fill={lineColor}
      />

      {/* 小節線（右端: 複縦線） */}
      {/* <line
        x1={svgWidth - 11}
        y1={staffTop}
        x2={svgWidth - 11}
        y2={staffTop + lineSpacing * 4}
        stroke={lineColor}
        strokeWidth={1}
      /> */}
      {/* <line
        x1={svgWidth - 0}
        y1={staffTop}
        x2={svgWidth + 8}
        y2={staffTop + lineSpacing * 4}
        stroke={lineColor}
        strokeWidth={1}
      /> */}

      {/* 拍子の区切りガイド */}
      {Array.from({ length: beatsPerMeasure + 1 }, (_, i) => {
        const x = startX + (i / totalBeats) * usableWidth;
        return (
          <line
            key={`beat-${i}`}
            x1={x}
            y1={staffTop + lineSpacing * 4 + 8}
            x2={x}
            y2={staffTop + lineSpacing * 4 + 14}
            stroke={lineColor}
            strokeWidth={0.5}
            opacity={0.6}
          />
        );
      })}

      {/* 拍子番号 */}
      {Array.from({ length: beatsPerMeasure }, (_, i) => {
        const x = startX + ((i + 0.5) / totalBeats) * usableWidth;
        return (
          <text
            key={`beatnum-${i}`}
            x={x}
            y={staffTop + lineSpacing * 4 + 26}
            fontSize="11"
            fill={lineColor}
            textAnchor="middle"
            opacity={0.6}
          >
            {i + 1}
          </text>
        );
      })}

      {/* 各ノートの描画 */}
      {layout.map((item, i) => {
        const color = getNoteColor(item.highlight);
        const { x, note } = item;

        if (isRest(note)) {
          // 休符: VexFlowグリフを使用
          const restGlyph =
            note === "quarter-rest"
              ? VEXFLOW_GLYPHS.restQuarter
              : VEXFLOW_GLYPHS.rest8th;
          // 4分休符は第2線〜第3線の中心、8分休符は第3線付近
          const restY = note === "quarter-rest" ? lineY(2) : lineY(2);
          return (
            <g key={`note-${i}`}>
              <path
                d={getGlyphPath(restGlyph, x - 5, restY, notePoint)}
                fill={color}
                style={{ transition: "fill 0.2s" }}
              />
            </g>
          );
        }

        // 付点音符の場合、元の音符種で描画判定
        const base = getBaseNote(note);
        const dotted = isDotted(note);

        // 音符の描画: VexFlowグリフの符頭を使用
        const isFilled = base !== "whole" && base !== "half";
        const hasStem = base !== "whole";
        const hasFlag =
          (base === "eighth" || base === "sixteenth") && !isInBeamGroup(i);

        // VexFlowグリフの符頭
        const headPath = getGlyphPath(
          VEXFLOW_GLYPHS.noteheadBlack,
          x + noteXOffset - 1,
          staffY,
          notePoint,
        );

        // 符幹のX位置（右端）
        const stemX = x + noteRightEdge;

        return (
          <g key={`note-${i}`}>
            {/* 符頭 */}
            {isFilled ? (
              <path
                d={headPath}
                fill={color}
                style={{ transition: "fill 0.2s" }}
              />
            ) : (
              // 2分音符・全音符: 白抜き楕円
              <ellipse
                cx={x}
                cy={staffY}
                rx={9}
                ry={6}
                fill="none"
                stroke={color}
                strokeWidth={2}
                transform={`rotate(-15, ${x}, ${staffY})`}
                style={{ transition: "stroke 0.2s" }}
              />
            )}
            {/* 符幹 (ステム) */}
            {hasStem && (
              <line
                x1={isFilled ? stemX : x + 8}
                y1={staffY}
                x2={isFilled ? stemX : x + 8}
                y2={staffY - stemLength - 10}
                stroke={color}
                strokeWidth={1.5}
                style={{ transition: "stroke 0.2s" }}
              />
            )}

            {/* 旗 (flag) - 連桁外の8分・16分 (VexFlowグリフ) */}
            {hasFlag && base === "eighth" && (
              <path
                d={getGlyphPath(
                  VEXFLOW_GLYPHS.flag8thUp,
                  stemX + 1,
                  staffY - stemLength - 10,
                  notePoint,
                )}
                fill={color}
                style={{ transition: "fill 0.2s" }}
              />
            )}
            {hasFlag && base === "sixteenth" && (
              <path
                d={getGlyphPath(
                  VEXFLOW_GLYPHS.flag16thUp,
                  stemX,
                  staffY - stemLength - 10,
                  notePoint,
                )}
                fill={color}
                style={{ transition: "fill 0.2s" }}
              />
            )}

            {/* 付点 (augmentation dot) */}
            {dotted && (
              <circle
                cx={x + noteRightEdge + 6}
                cy={staffY - halfSpace / 2}
                r={2.5}
                fill={color}
                style={{ transition: "fill 0.2s" }}
              />
            )}
          </g>
        );
      })}

      {/* 連桁 (beams) */}
      {beamGroups.map((group, gi) => {
        const firstX = layout[group.startIdx].x + noteRightEdge;
        const lastX = layout[group.endIdx].x + noteRightEdge;
        const beamY = staffY - stemLength - 10;

        const elements = [
          <line
            key={`beam-${gi}`}
            x1={firstX - 0.5}
            y1={beamY}
            x2={lastX + 0.5}
            y2={beamY}
            stroke={lineColor}
            strokeWidth={3.5}
          />,
        ];

        const has16th = notes
          .slice(group.startIdx, group.endIdx + 1)
          .some((n) => n === "sixteenth");
        if (has16th) {
          for (let i = group.startIdx; i <= group.endIdx; i++) {
            if (notes[i] === "sixteenth") {
              const nx = layout[i].x + noteRightEdge;
              if (i < group.endIdx && notes[i + 1] === "sixteenth") {
                const nextX = layout[i + 1].x + noteRightEdge;
                elements.push(
                  <line
                    key={`beam16-${gi}-${i}`}
                    x1={nx}
                    y1={beamY + 6}
                    x2={nextX}
                    y2={beamY + 6}
                    stroke={lineColor}
                    strokeWidth={3.5}
                  />,
                );
              } else if (i > group.startIdx && notes[i - 1] !== "sixteenth") {
                elements.push(
                  <line
                    key={`beam16-${gi}-${i}`}
                    x1={nx - 10}
                    y1={beamY + 6}
                    x2={nx}
                    y2={beamY + 6}
                    stroke={lineColor}
                    strokeWidth={3.5}
                  />,
                );
              }
            }
          }
        }

        return <g key={`beamgroup-${gi}`}>{elements}</g>;
      })}
    </svg>
  );
}
