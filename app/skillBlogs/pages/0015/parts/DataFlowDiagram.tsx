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
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ccc",
        borderRadius: 6,
        background: data.color || "#f0f0f0",
        textAlign: "center",
        minWidth: 120,
        position: "relative",
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
    id: "1",
    type: "custom",
    data: { label: "1.サーバー", color: "orange" },
    position: { x: 250, y: 300 },
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
    data: { label: "3.出荷チェック", color: "orange" },
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
      color: "#66f",
    },
    style: { stroke: "#66f", strokeWidth: 2 },
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
      color: "#66f",
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#66f",
    },
    style: { stroke: "#66f", strokeWidth: 2 },
    labelStyle: { fontSize: 13 },
    labelBgStyle: { fill: "#fff" },
  },
];

export default function DataFlowDiagram() {
  return (
    <div style={{ width: "100%", height: "450px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={{ custom: CustomEdge }}
        fitView
        nodeTypes={nodeTypes}
        zoomOnScroll={false} // スクロールでズームしない
        preventScrolling={false} // 親スクロールを制御しない
      >
        <Background gap={12} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
