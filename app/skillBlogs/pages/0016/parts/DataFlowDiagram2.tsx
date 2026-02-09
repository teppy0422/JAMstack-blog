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
import { Text, Box, Flex } from "@chakra-ui/react";
import CustomEdge from "./CustomEdge";

// カスタムノード（非表示Handle付き）
const CustomNode = ({ data }: NodeProps) => {
  const padding = data.padding ?? 10;
  const isWrap = typeof data.label === "string" && data.label.includes("\n");
  const fontColor = data.fontColor?.trim() ? data.fontColor : "#111";
  const isTransparent =
    typeof data.fontColor === "string" &&
    data.fontColor.includes("transparent");

  return (
    <div
      style={{
        padding,
        borderRadius: 6,
        color: fontColor,
        background: data.color || "#f0f0f0",
        textAlign: isWrap ? "left" : "center",
        width: "fit-content", // ← ここ重要（広がりすぎないよう制限）
        minWidth: 120,
        position: "relative",
        cursor: "grab", // ★ 追加
        whiteSpace: "pre-wrap", // ★ これでもOK
      }}
    >
      {/* 非表示の接続点（必要） */}
      <Handle
        type="source"
        position={Position.Top}
        style={{
          display: "block",
          width: 0,
          height: 0,
          background: "transparent",
          border: "none",
        }}
        isConnectable={false}
        id="top"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          display: "block",
          width: 0,
          height: 0,
          background: "transparent",
          border: "none",
        }}
        isConnectable={false}
        id="right"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          display: "block",
          width: 0,
          height: 0,
          background: "transparent",
          border: "none",
        }}
        isConnectable={false}
        id="bottom"
      />
      <Handle
        type="source"
        position={Position.Left}
        style={{
          display: "block",
          width: 0,
          height: 0,
          background: "transparent",
          border: "none",
        }}
        isConnectable={false}
        id="left"
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{
          display: "block",
          width: 0,
          height: 0,
          background: "transparent",
          border: "none",
        }}
        isConnectable={false}
        id="top"
      />
      <Handle
        type="target"
        position={Position.Right}
        style={{
          display: "block",
          width: 0,
          height: 0,
          background: "transparent",
          border: "none",
        }}
        isConnectable={false}
        id="right"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        style={{
          display: "block",
          width: 0,
          height: 0,
          background: "transparent",
          border: "none",
        }}
        isConnectable={false}
        id="bottom"
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          display: "block",
          width: 0,
          height: 0,
          background: "transparent",
          border: "none",
        }}
        isConnectable={false}
        id="left"
      />
      {data.label}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const Legend = () => (
  <Box
    position="absolute"
    top="10px"
    right="10px"
    background="#fff"
    border="1px solid #ccc"
    borderRadius="md"
    p={2}
    boxShadow="md"
    fontSize="xs"
  >
    <Flex align="center" mb={1}>
      <Box w="16px" h="16px" bg="#f9f9f9" border="2px solid blue" mr={1} />
      <Text>アプリの処理</Text>
    </Flex>
    <Flex align="center" mb={1}>
      <Box w="16px" h="16px" bg="#ccc" border="1px solid #ccc" mr={1} />
      <Text>データ取込(1回/日)</Text>
    </Flex>
  </Box>
);

const nodes: Node[] = [
  {
    id: "1",
    type: "custom",
    data: {
      label: "1.データをNasに移動",
      color: "#ccc",
    },
    position: { x: 171, y: 0 },
  },
  {
    id: "2",
    type: "custom",
    data: {
      label: "2.データをDBにインポート",
      color: "#ccc",
    },
    position: { x: 150, y: 100 },
  },
  {
    id: "3",
    type: "custom",
    data: { label: "3.エフを読み込む", color: "#f9f9f9" },
    position: { x: 408, y: 150 },
  },
  {
    id: "4",
    type: "custom",
    data: { label: "4.圧着対象をタップ", color: "#f9f9f9" },
    position: { x: 400, y: 250 },
  },
  {
    id: "45",
    type: "custom",
    data: {
      label:
        "①規格データをNasから取得\n②規格画像をNasから取得\n③前回のダイヤル値を設定情報から取得\n④CFM番号を設定情報から取得",
      fontColor: "blue",
      color: "#f9f9f9",
    },
    position: { x: 100, y: 350 },
  },
  {
    id: "11",
    type: "custom",
    data: { label: "11.CMF番号変更", color: "#f9f9f9" },
    position: { x: -13, y: 550 },
  },
  {
    id: "9",
    type: "custom",
    data: { label: "9.ダイヤル合わせ", color: "#f9f9f9" },
    position: { x: -13, y: 650 },
  },
  {
    id: "10",
    type: "custom",
    data: { label: "10.試し線圧着", color: "#f9f9f9" },
    position: { x: -2, y: 750 },
  },
  {
    id: "5",
    type: "custom",
    data: { label: "5.規格測定", color: "#f9f9f9" },
    position: { x: 0, y: 850 },
  },
  {
    id: "7",
    type: "custom",
    data: { label: "7.再調整", color: "#f9f9f9" },
    position: { x: 250, y: 900 },
  },
  {
    id: "6",
    type: "custom",
    data: { label: "6.圧着作業", color: "#f9f9f9" },
    position: { x: 0, y: 1000 },
  },
  {
    id: "8",
    type: "custom",
    data: { label: "8.DB登録", color: "#f9f9f9", fontColor: "blue" },
    position: { x: 0, y: 1150 },
  },
];

const edges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#ddd" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    sourceHandle: "bottom",
    targetHandle: "left",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#ddd" },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "custom",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#ddd" },
  },
  {
    id: "e4-45",
    source: "4",
    target: "45",
    sourceHandle: "bottom",
    targetHandle: "right",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#ddd" },
  },
  {
    id: "e45-9",
    source: "45",
    target: "9",
    sourceHandle: "left",
    targetHandle: "top",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#ddd" },
  },
  {
    id: "e9-10",
    source: "9",
    target: "10",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#ddd" },
  },
  {
    id: "e10-5",
    source: "10",
    target: "5",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#ddd" },
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "smoothstep",
    label: "合格",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "blue.100" },
  },
  {
    id: "e7-9",
    source: "7",
    target: "9",
    sourceHandle: "top",
    targetHandle: "right",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "blue.100" },
  },
  {
    id: "e5-7",
    source: "5",
    target: "7",
    sourceHandle: "bottom",
    targetHandle: "left",
    type: "smoothstep",
    label: "不合格",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "blue.100" },
  },
  {
    id: "e6-8",
    source: "6",
    target: "8",
    sourceHandle: "bottom",
    targetHandle: "top",
    type: "smoothstep",
    label: "作業完了",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888",
    },
    style: { stroke: "#888", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "blue.100" },
  },
];

export default function DataFlowDiagram2() {
  return (
    <div style={{ width: "100%", height: "900px", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        nodesDraggable={true}
        edges={edges}
        edgeTypes={{ custom: CustomEdge }}
        fitView
        nodeTypes={nodeTypes}
        zoomOnScroll={false} // スクロールでズームしない
        preventScrolling={false} // 親スクロールを制御しない
        proOptions={{ hideAttribution: true }} // ★ 右下ロゴ非表示
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
  );
}
