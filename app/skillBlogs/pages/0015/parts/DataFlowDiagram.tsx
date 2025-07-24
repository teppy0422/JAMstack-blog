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
  const padding = data.padding ?? 10;
  return (
    <div
      style={{
        padding,
        border: "1px solid #ccc",
        borderRadius: 6,
        background: data.color || "#f0f0f0",
        textAlign: "center",
        minWidth: 120,
        position: "relative",
        cursor: "grab", // ★ 追加
      }}
    >
      {/* 非表示の接続点（必要） */}
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
      />
      {data.label}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const nodes: Node[] = [
  {
    id: "4",
    type: "custom",
    data: { label: "4.四国部品PC", color: "#ddd" },
    position: { x: 250, y: 0 },
  },
  {
    id: "5",
    type: "custom",
    data: { label: "5.ウエダPC", color: "#ddd" },
    position: { x: 250, y: 200 },
  },
  {
    id: "6",
    type: "custom",
    data: { label: "6.かんばん", color: "orange", padding: 0 },
    position: { x: 500, y: 350 },
  },
  {
    id: "7",
    type: "custom",
    data: { label: "7.作業者ネーム", color: "orange", padding: 0 },
    position: { x: 500, y: 380 },
  },
  {
    id: "8",
    type: "custom",
    data: { label: "8.作業実績", color: "orange", padding: 0 },
    position: { x: 10, y: 350 },
  },
  {
    id: "1",
    type: "custom",
    data: { label: "1.サーバー", color: "orange" },
    position: { x: 250, y: 350 },
  },
  {
    id: "2",
    type: "custom",
    data: { label: "2.圧着PC", color: "orange" },
    position: { x: 50, y: 500 },
  },
  {
    id: "3",
    type: "custom",
    data: { label: "3.出荷PC", color: "orange" },
    position: { x: 450, y: 500 },
  },
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
  {
    id: "e5-6",
    source: "5",
    target: "8",
    type: "smoothstep",
    label: "印刷/検索/出力",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "orange",
    },
    style: { stroke: "orange", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#fff" },
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    type: "smoothstep",
    label: "印刷",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "orange",
    },
    style: { stroke: "orange", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#fff" },
  },
  {
    id: "e5-1",
    source: "5",
    target: "1",
    type: "smoothstep",
    label: "切断データを移動",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "orange",
    },
    style: { stroke: "orange", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#fff" },
  },
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    label: "圧着用データ相互通信",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "orange",
    },
    style: { stroke: "orange", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#fff" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    label: "出荷用データ相互通信",
    markerStart: {
      type: MarkerType.ArrowClosed,
      color: "orange",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "orange",
    },
    style: { stroke: "orange", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#fff" },
  },
];

export default function DataFlowDiagram() {
  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
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
