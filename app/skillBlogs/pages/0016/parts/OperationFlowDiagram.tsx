"use client";

import React from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  EdgeProps,
  MarkerType,
  Node,
  Position,
  Handle,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { Box, Flex, Text } from "@chakra-ui/react";
import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";

// ── 凡例（ReactFlow内右上） ──────────────────────
const Legend = () => (
  <Box
    position="absolute"
    top="10px"
    right="10px"
    background="white"
    border="1px solid #ccc"
    borderRadius="md"
    p={2}
    boxShadow="sm"
    fontSize="xs"
    zIndex={10}
  >
    {[
      { color: C.blue5, label: "入力・読取" },
      { color: C.org4, label: "規格測定" },
      { color: C.grn5, label: "量産・記録" },
      { color: C.red, label: "※要検討", textColor: C.red },
    ].map(({ color, label, textColor }) => (
      <Flex key={label} align="center" mb={1}>
        {!textColor ? (
          <Box
            w="14px"
            h="14px"
            bg="transparent"
            border={`2px solid ${color}`}
            mr={1}
            borderRadius="2px"
            flexShrink={0}
          />
        ) : (
          <Box w="0" h="14px"></Box>
        )}
        <Text
          color={textColor ?? "inherit"}
          fontWeight={textColor ? "600" : "normal"}
        >
          {label}
        </Text>
      </Flex>
    ))}
  </Box>
);

// ── カラー ──────────────────────────────────────
const C = {
  blue5: "#3182CE",
  org4: "#ED8936",
  yel3: "#ECC94B",
  yel6: "#B7791F",
  grn5: "#38A169",
  grn7: "#276749",
  red: "#FC4141",
  gray: "#A0AEC0",
};

// 各色の薄い背景色（不透明）
const LIGHT: Record<string, string> = {
  [C.blue5]: "#EBF4FF",
  [C.org4]: "#FFF5EB",
  [C.grn5]: "#EDFAF4",
  [C.grn7]: "#EBF5EF",
  [C.red]: "#FFF5F5",
  [C.gray]: "#F7FAFC",
  [C.yel3]: "#FEFCE8",
};

// ── カスタムノード（矩形・ひし形共用） ──────────────
const CustomNode = ({ data }: NodeProps) => {
  if (data.shape === "text") {
    return (
      <div
        style={{
          color: data.color ?? "#1A202C",
          fontSize: data.fontSize ?? 13,
          fontWeight: data.fontWeight ?? "normal",
          fontFamily: "'Hiragino Kaku Gothic ProN', Meiryo, sans-serif",
          whiteSpace: "pre-wrap",
          pointerEvents: "none",
        }}
      >
        {data.label}
      </div>
    );
  }

  const isDiamond = data.shape === "diamond";

  if (isDiamond) {
    const size = data.size ?? 110;
    return (
      <div style={{ width: size, height: size, position: "relative" }}>
        {(["top", "right", "bottom", "left"] as const).map((pos) => (
          <React.Fragment key={pos}>
            <Handle
              type="source"
              position={
                Position[
                  (pos.charAt(0).toUpperCase() +
                    pos.slice(1)) as keyof typeof Position
                ]
              }
              id={pos}
              style={{ opacity: 0, width: 0, height: 0 }}
              isConnectable={false}
            />
            <Handle
              type="target"
              position={
                Position[
                  (pos.charAt(0).toUpperCase() +
                    pos.slice(1)) as keyof typeof Position
                ]
              }
              id={pos}
              style={{ opacity: 0, width: 0, height: 0 }}
              isConnectable={false}
            />
          </React.Fragment>
        ))}
        <div
          style={{
            width: size * 0.7,
            height: size * 0.7,
            background: LIGHT[data.color ?? C.org4] ?? "#FEFCE8",
            border: data.border ?? `1px solid ${C.org4}`,
            transform: "rotate(45deg)",
            position: "absolute",
            top: size * 0.15,
            left: size * 0.15,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size,
            height: size,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontSize: data.fontSize ?? 13,
            fontWeight: "bold",
            color: data.fontColor ?? "#1A202C",
            fontFamily: "'Hiragino Kaku Gothic ProN', Meiryo, sans-serif",
            textAlign: "center",
            whiteSpace: "pre-wrap",
            pointerEvents: "none",
          }}
        >
          <div>{data.label}</div>
          {data.sub && (
            <div
              style={{
                fontSize: 14,
                fontWeight: "normal",
                color: "#555",
                marginTop: 2,
                opacity: 0.85,
              }}
            >
              {data.sub}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: data.padding ?? 8,
        borderRadius: data.rounded ? 20 : 4,
        background: LIGHT[data.color ?? C.gray] ?? "#F7FAFC",
        border: data.border ?? `2px solid ${data.color ?? C.gray}`,
        color: data.fontColor ?? "#1A202C",
        fontSize: data.fontSize ?? 14,
        fontWeight: "bold",
        textAlign: "center",
        minWidth: data.minWidth ?? 200,
        maxWidth: data.maxWidth ?? 220,
        whiteSpace: "pre-wrap",
        cursor: "default",
        fontFamily: "'Hiragino Kaku Gothic ProN', Meiryo, sans-serif",
      }}
    >
      {(["top", "right", "bottom", "left"] as const).map((pos) => (
        <React.Fragment key={pos}>
          <Handle
            type="source"
            position={
              Position[
                (pos.charAt(0).toUpperCase() +
                  pos.slice(1)) as keyof typeof Position
              ]
            }
            id={pos}
            style={{ opacity: 0, width: 0, height: 0 }}
            isConnectable={false}
          />
          <Handle
            type="target"
            position={
              Position[
                (pos.charAt(0).toUpperCase() +
                  pos.slice(1)) as keyof typeof Position
              ]
            }
            id={pos}
            style={{ opacity: 0, width: 0, height: 0 }}
            isConnectable={false}
          />
        </React.Fragment>
      ))}
      <div>{data.label}</div>
      {data.sub && (
        <div
          style={{
            fontSize: 13,
            fontWeight: data.review ? "bold" : "normal",
            color: data.review ? C.red : "#555",
            marginTop: 3,
          }}
        >
          {data.sub}
        </div>
      )}
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

// ── ウェイポイント付きカスタムエッジ ──────────────
// data.waypoints: [{x, y}, ...] で中間点を指定（絶対座標）
const WaypointEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  style,
  markerEnd,
  label,
  labelStyle,
}: EdgeProps) => {
  const pts: { x: number; y: number }[] = data?.waypoints ?? [];
  const all = [{ x: sourceX, y: sourceY }, ...pts, { x: targetX, y: targetY }];

  // ポリライン形式でパスを組み立て
  const d = all.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // ラベル位置：中間点の中央
  const mid = all[Math.floor(all.length / 2)];
  const labelX = mid.x + (data?.labelXOffset ?? 0);
  const labelY = mid.y + (data?.labelYOffset ?? 0);

  return (
    <>
      <path
        id={id}
        d={d}
        fill="none"
        style={style}
        markerEnd={markerEnd as string}
      />
      {label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          style={labelStyle as React.CSSProperties}
        >
          {label as string}
        </text>
      )}
    </>
  );
};

const edgeTypes = { waypoint: WaypointEdge };

// ── エッジ共通ヘルパー ────────────────────────────
function e(
  id: string,
  source: string,
  target: string,
  label: string,
  color: string,
  dashed = false,
  sourceHandle = "bottom",
  targetHandle = "top",
  labelXOffset = 0,
  labelYOffset = 0,
): Edge {
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    label,
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color },
    style: {
      stroke: color,
      strokeWidth: 1.5,
      strokeDasharray: dashed ? "6,3" : undefined,
    },
    labelStyle: {
      fontSize: 14,
      fontWeight: "bold",
      fill: color,
      fontFamily: "'Hiragino Kaku Gothic ProN', Meiryo, sans-serif",
      transform: `translate(${labelXOffset}px, ${labelYOffset}px)`,
    },
    labelBgStyle: { fill: "transparent" },
  };
}

// ── ノード定義 ───────────────────────────────────
//  shape: "diamond" でひし形、未指定で矩形
//  x: 水平位置（中央列: 120, 右列サイドノード: 380）
//  y: 垂直位置
const NODES: Node[] = [
  // ─ メイン縦列 ─
  {
    id: "kanban",
    type: "custom",
    position: { x: 180, y: 50 },
    data: { label: "製造指示書/かんばん読取", sub: "QRコード", color: C.blue5 },
  },
  {
    id: "text-note",
    type: "custom",
    position: { x: 280, y: 100 },
    data: {
      shape: "text",
      label: "CFMの自動切替は未定",
      color: C.red,
      fontWeight: 600,
    },
  },
  {
    id: "sameApp",
    type: "custom",
    position: { x: 180, y: 170 },
    data: {
      shape: "diamond",
      label: "前回と同じ\nアプリか？",
      sub: "前回 vs 今回のアプリ",
      color: C.yel3,
      border: `1px solid ${C.org4}`,
    },
  },

  // ─ 右側サイドノード ─
  {
    id: "appScan",
    type: "custom",
    position: { x: 400, y: 170 },
    data: {
      label: "アプリケーター読取",
      sub: "QRコード",
      color: C.blue5,
    },
  },
  {
    id: "sameTerm",
    type: "custom",
    position: { x: 180, y: 330 },
    data: {
      shape: "diamond",
      label: "前回と同じ\n端子品番か？",
      sub: "前回 vs 今回",
      color: C.yel3,
      border: `1px solid ${C.org4}`,
    },
  },
  {
    id: "termScan",
    type: "custom",
    position: { x: 400, y: 330 },
    data: {
      label: "端子リール読込",
      sub: "QRコード",
      color: C.blue5,
    },
  },
  {
    id: "sameWire",
    type: "custom",
    position: { x: 180, y: 490 },
    data: {
      shape: "diamond",
      label: "前回と同じ\n品種/サイズか？",
      sub: "前回 vs 今回",
      color: C.yel3,
      border: `1px solid ${C.org4}`,
    },
  },
  {
    id: "specDisp",
    type: "custom",
    position: { x: 400, y: 490 },
    data: {
      label: "ダイヤル目安値を表示",
      sub: "ダイヤルを合わせる",
      color: C.org4,
    },
  },
  {
    id: "viewMeasure",
    type: "custom",
    position: { x: 400, y: 590 },
    data: {
      label: "規格表を表示",
      sub: "芯線出などの確認",
      color: C.org4,
    },
  },
  {
    id: "specMeasure",
    type: "custom",
    position: { x: 400, y: 690 },
    data: {
      label: "規格測定",
      sub: "マイクロメーター",
      color: C.org4,
    },
  },
  {
    id: "judge",
    type: "custom",
    position: { x: 400, y: 810 },
    data: {
      shape: "diamond",
      label: "規格内か？",
      sub: "計測値 vs 規格値",
      color: C.yel3,
      border: `1px solid ${C.org4}`,
    },
  },
  {
    id: "production",
    type: "custom",
    position: { x: 180, y: 900 },
    data: {
      label: "量産モードへ移行",
      sub: "※すべて照合OKで連続圧着可",
      color: C.grn5,
      review: true,
      border: `2px solid ${C.grn5}`,
    },
  },
  {
    id: "changeTerm",
    type: "custom",
    position: { x: 180, y: 1020 },
    data: {
      label: "端子切れ?",
      sub: "端子交換",
      shape: "diamond",
      color: C.org4,
      review: false,
      border: `1px solid ${C.org4}`,
      minWidth: 100,
    },
  },
  {
    id: "termScan2",
    type: "custom",
    position: { x: 400, y: 1020 },
    data: {
      label: "端子リール読込",
      sub: "QRコード",
      color: C.blue5,
    },
  },
  {
    id: "recheck",
    type: "custom",
    position: { x: 180, y: 1140 },
    data: {
      label: "定期再計測",
      sub: "※500圧着毎?・作業終了時",
      color: C.org4,
      review: true,
      border: `2px solid ${C.org4}`,
    },
  },
  {
    id: "report",
    type: "custom",
    position: { x: 180, y: 1240 },
    data: { label: "圧着履歴の保存", sub: "NASへ一元保存", color: C.grn5 },
  },
];

// ── エッジ定義 ───────────────────────────────────
//  e(id, source, target, label, color, dashed, sourceHandle, targetHandle, labelXOffset, labelYOffset)
const EDGES: Edge[] = [
  // メイン縦列
  e("e-kanban-sameApp", "kanban", "sameApp", "", C.gray),
  e(
    "e-sameApp-sameTerm",
    "sameApp",
    "sameTerm",
    "YES",
    C.grn5,
    false,
    "bottom",
    "top",
    22,
    0,
  ),
  e(
    "e-changeTerm-termScan2",
    "changeTerm",
    "termScan2",
    "YES",
    C.grn5,
    false,
    "right",
    "left",
    0,
    -12,
  ),
  e(
    "e-changeTerm-recheck",
    "changeTerm",
    "recheck",
    "NO",
    C.blue5,
    true,
    "bottom",
    "top",
    18,
    0,
  ),
  e(
    "e-sameTerm-sameWire",
    "sameTerm",
    "sameWire",
    "YES",
    C.grn5,
    false,
    "bottom",
    "top",
    22,
    0,
  ),
  e(
    "e-production-changeTerm",
    "production",
    "changeTerm",
    "圧着カウント",
    C.grn5,
    false,
    "bottom",
    "top",
    50,
    0,
  ),
  e("e-trial-measure", "trial", "measure", "", C.gray),
  e("e-measure-judge", "measure", "judge", "", C.gray),

  e("e-count-recheck", "count", "recheck", "", C.gray),
  e("e-recheck-report", "recheck", "report", "", C.gray),
  e("e-viewMeasure-specMeasure", "viewMeasure", "specMeasure", "", C.gray),
  e("e-specMeasure-judge", "specMeasure", "judge", "", C.gray),
  e("e-specDisp-viewMeasure", "specDisp", "viewMeasure", "", C.gray),
  e("e-appScan-sameTerm", "appScan", "sameTerm", "", C.grn5),
  e("e-termScan-sameWire", "termScan", "sameWire", "", C.grn5),

  e(
    "e-sameApp-appScan",
    "sameApp",
    "appScan",
    "NO",
    C.blue5,
    true,
    "right",
    "left",
    0,
    -12,
  ),
  e(
    "e-sameWire-specDisp",
    "sameWire",
    "specDisp",
    "NO",
    C.blue5,
    true,
    "right",
    "left",
    0,
    -12,
  ),
  e(
    "e-sameWire-specDisp",
    "sameTerm",
    "termScan",
    "NO",
    C.blue5,
    true,
    "right",
    "left",
    0,
    -12,
  ),
  e(
    "e-judge-production",
    "judge",
    "production",
    "YES",
    C.grn5,
    false,
    "bottom",
    "right",
    0,
    -12,
  ),
  // sameSpec YES → 量産モード（左側バイパス）
  e(
    "e-sameWire-production",
    "sameWire",
    "production",
    "YES",
    C.grn5,
    false,
    "bottom",
    "top",
    22,
    0,
  ),
  e(
    "e-judge-specDisp",
    "judge",
    "specDisp",
    "",
    C.blue5,
    true,
    "left",
    "left",
    22,
    0,
  ),
  e(
    "e-recheck-specMeasure",
    "recheck",
    "specMeasure",
    "再判定",
    C.org4,
    false,
    "right",
    "right",
    28,
    0,
  ),
  e(
    "e-termScan2-specMeasure",
    "termScan2",
    "specMeasure",
    "",
    C.org4,
    false,
    "right",
    "right",
    0,
    0,
  ),
];

// ── メインコンポーネント ──────────────────────────
export default function OperationFlowDiagram() {
  return (
    <Box w="100%">
      <div style={{ width: "100%", height: 1320 }}>
        <ReactFlow
          nodes={NODES}
          edges={EDGES}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodeOrigin={[0.5, 0.5]}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={false}
          defaultViewport={{ x: 10, y: 10, zoom: 1 }}
          minZoom={0.3}
          zoomOnScroll={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
        >
          <Legend />
          <Background gap={12} />
          <Controls
            showZoom={true}
            showFitView={true}
            showInteractive={false}
            position="bottom-right"
          />
        </ReactFlow>
      </div>
    </Box>
  );
}
