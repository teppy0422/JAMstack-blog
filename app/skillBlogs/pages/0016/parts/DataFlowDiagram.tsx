"use client";

import React from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
  Position,
  Handle,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { Text, Box } from "@chakra-ui/react";
import CustomEdge from "./CustomEdge";

// カスタムノード（非表示Handle付き）
const CustomNode = ({ data }: NodeProps) => {
  const padding = data.padding ?? 6;
  return (
    <div
      style={{
        padding,
        border: "1px solid #ccc",
        borderRadius: 6,
        background: data.color || "#f0f0f0",
        textAlign: "center",
        minWidth: data.minWidth ?? 120,
        minHeight: data.minHeight ?? undefined,
        maxWidth: data.maxWidth ?? undefined,
        maxHeight: data.maxHeight ?? undefined,
        position: "relative",
        whiteSpace: "pre-wrap",
        cursor: "grab",
      }}
    >
      {/* 4方向の非表示ハンドル */}
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
      {data.label}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// ── エッジヘルパー ────────────────────────────────
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
  labelBgFill = "transparent",
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
      strokeWidth: 2,
      strokeDasharray: dashed ? "6,3" : undefined,
    },
    labelStyle: {
      fontSize: 13,
      transform: `translate(${labelXOffset}px, ${labelYOffset}px)`,
    },
    labelBgStyle: { fill: labelBgFill },
  };
}

const nodes: Node[] = [
  {
    id: "shikoku",
    type: "custom",
    data: { label: "四国部品PC", color: "#ddd", minWidth: 200 },
    position: { x: 250, y: -30 },
  },
  {
    id: "rltf",
    type: "custom",
    data: {
      label: "RLTF-AまたはB",
      color: "#FFF",
      minWidth: 100,
      maxHeight: 40,
    },
    position: { x: 50, y: 68 },
  },
  {
    id: "tcssc",
    type: "custom",
    data: {
      label: "TCSSC(規格データ)\n規格表画像",
      color: "#FFF",
      minWidth: 100,
      maxHeight: 80,
    },
    position: { x: 250, y: 80 },
  },
  {
    id: "shield",
    type: "custom",
    data: {
      label: "シールドかんばん",
      color: "#FFF",
      minWidth: 100,
      maxHeight: 80,
    },
    position: { x: 450, y: 68 },
  },
  {
    id: "usb",
    type: "custom",
    data: { label: "USBメモリ\n(または通信)", color: "#ddd" },
    position: { x: 250, y: 200 },
  },
  {
    id: "ueda",
    type: "custom",
    data: { label: "ウエダPC", color: "#ddd" },
    position: { x: 250, y: 300 },
  },
  {
    id: "server",
    type: "custom",
    data: { label: "サーバー", color: "orange" },
    position: { x: 250, y: 400 },
  },
  {
    id: "cm20",
    type: "custom",
    data: { label: "圧着PC", color: "orange" },
    position: { x: 450, y: 400 },
  },
  // {
  //   id: "3",
  //   type: "custom",
  //   data: { label: "3.出荷PC", color: "orange" },
  //   position: { x: 450, y: 500 },
  // },
];

const edges: Edge[] = [
  {
    id: "e4-1",
    source: "4",
    target: "5",
    type: "custom",
    label: (
      <>
        <Box
          bg="white"
          px={1}
          borderRadius="md"
          boxShadow="sm"
          fontSize="13px"
          mt={2}
        >
          <Text>メール送信(切断データ)</Text>
          <Text>TCSSC(規格データ)</Text>
          <Text>規格表画像</Text>
        </Box>
      </>
    ),
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#aaa",
    },
    style: { stroke: "#aaa", strokeWidth: 2 },
    labelBgStyle: { fill: "#fff" },
  },
  e("e1-2", "1", "2", "圧着用データ相互通信", "orange"),
  e(
    "e-sikoku-rltf",
    "shikoku",
    "rltf",
    "毎日",
    "orange",
    false,
    "left",
    "top",
    0,
    -8,
  ),
  e(
    "e-sikoku-tcssc",
    "shikoku",
    "tcssc",
    "更新都度(月一回?)",
    "orange",
    false,
    "bottom",
    "top",
    0,
    -8,
  ),
  e(
    "e-sikoku-shield",
    "shikoku",
    "shield",
    "変更都度",
    "orange",
    false,
    "right",
    "top",
    0,
    -8,
  ),
  e("e-rltf-usb", "rltf", "usb", "", "orange", false, "bottom", "top"),
  e("e-tcssc-usb", "tcssc", "usb", "", "orange", false, "bottom", "top"),
  e("e-shield-usb", "shield", "usb", "", "orange", false, "bottom", "top"),
  e("e-usb-ueda", "usb", "ueda", "", "orange", false, "bottom", "top"),
  e(
    "e-ueda-server",
    "ueda",
    "server",
    "PreHarnessでインポート処理",
    "orange",
    false,
    "bottom",
    "top",
    94,
  ),
  e(
    "e-server-cm20",
    "server",
    "cm20",
    "データ提供",
    "orange",
    false,
    "right",
    "left",
    0,
    -12,
  ),
  e(
    "e-cm20-server",
    "cm20",
    "server",
    "作業実績保存",
    "orange",
    false,
    "bottom",
    "bottom",
    0,
    16,
  ),
  e(
    "e-server-ueda",
    "server",
    "ueda",
    "データ参照",
    "orange",
    false,
    "left",
    "left",
    -36,
    0,
  ),
];

export default function DataFlowDiagram() {
  return (
    <div style={{ width: "100%", height: "660px", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        nodeOrigin={[0.5, 0.5]}
        nodesDraggable={true}
        edges={edges}
        edgeTypes={{ custom: CustomEdge }}
        fitView
        nodeTypes={nodeTypes}
        zoomOnScroll={false} // スクロールでズームしない
        preventScrolling={false} // 親スクロールを制御しない
        proOptions={{ hideAttribution: true }} // ★ 右下ロゴ非表示
      >
        <Background gap={12} />
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
}
