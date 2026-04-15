"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  Handle,
  NodeProps,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Text,
  Box,
  Flex,
  Button,
  HStack,
  useColorMode,
} from "@chakra-ui/react";

// プラン定義
const PLANS = ["A", "B", "C", "D", "E"] as const;
type Plan = (typeof PLANS)[number];

// 凡例の色定義
const COLOR = {
  existing: "#d0d0d0",
  check: "#fcd49a",
  new: "#c8b4e8",
  print: "#ffffff",
  external: "#ffffff",
};
const BORDER = {
  existing: "1px solid #999",
  check: "1px solid #e8a000",
  new: "1px solid #7c4dbd",
  print: "1px solid #999",
  external: "1px solid #999",
};

const CustomNode = ({ data }: NodeProps) => {
  return (
    <div
      style={{
        padding: data.padding ?? 8,
        borderRadius: data.rounded ? 20 : 4,
        background: data.color ?? COLOR.existing,
        border: data.border ?? BORDER.existing,
        color: data.fontColor ?? "#111",
        fontSize: data.fontSize ?? 12,
        textAlign: "center",
        minWidth: data.minWidth ?? 100,
        maxWidth: data.maxWidth ?? 180,
        whiteSpace: "pre-wrap",
        cursor: "default",
      }}
    >
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{ opacity: 0, width: 0, height: 0 }}
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ opacity: 0, width: 0, height: 0 }}
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ opacity: 0, width: 0, height: 0 }}
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ opacity: 0, width: 0, height: 0 }}
        isConnectable={false}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ opacity: 0, width: 0, height: 0 }}
        isConnectable={false}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{ opacity: 0, width: 0, height: 0 }}
        isConnectable={false}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={{ opacity: 0, width: 0, height: 0 }}
        isConnectable={false}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ opacity: 0, width: 0, height: 0 }}
        isConnectable={false}
      />
      {data.label}
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

// ─── ノード定義（plans: 含まれるプラン） ──────────────────────
// plans 未指定 = 全プランで表示
type NodeDef = Omit<Node, "data"> & {
  data: {
    label: string;
    color?: string;
    border?: string;
    fontColor?: string;
    fontSize?: number;
    minWidth?: number;
    maxWidth?: number;
    padding?: number;
    rounded?: boolean;
    plans?: Plan[];
  };
};

const CX = 300;
const RX = 480;

const BASE_NODES: NodeDef[] = [
  // NAS（新規購入: A,B,C / D,E は既存代用）
  {
    id: "nas",
    type: "custom",
    position: { x: CX, y: 30 },
    data: {
      label: "NAS\nサーバー",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 100,
      plans: ["A", "B", "C"],
    },
  },
  // NAS大換えMAC
  {
    id: "nas",
    type: "custom",
    position: { x: CX, y: 30 },
    data: {
      label: "NAS\n代替MAC",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 100,
      plans: ["D", "E"],
    },
  },

  {
    id: "hub",
    type: "custom",
    position: { x: CX, y: 120 },
    data: {
      label: "無線LAN\n ",
      color: COLOR.check,
      border: BORDER.check,
      minWidth: 100,
      plans: ["A", "B", "C", "D", "E"],
    },
  },

  // かんばん管理（常時）
  {
    id: "kanban_pc",
    type: "custom",
    position: { x: CX - 120, y: 120 },
    data: {
      label: "PC\n（実績参照）",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 100,
    },
  },
  {
    id: "kanban_sys",
    type: "custom",
    position: { x: CX - 240, y: 120 },
    data: {
      label: "新規アプリ\n(実績確認)",
      color: COLOR.new,
      border: BORDER.new,
      minWidth: 100,
    },
  },
  {
    id: "printer",
    type: "custom",
    position: { x: CX - 120, y: 200 },
    data: {
      label: "プリンター\n ",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 60,
    },
  },
  {
    id: "kanban",
    type: "custom",
    position: { x: CX - 50, y: 260 },
    data: {
      label: "かんばん",
      color: COLOR.print,
      border: BORDER.print,
      minWidth: 85,
      plans: ["A", "B"],
    },
  },
  {
    id: "name_tag",
    type: "custom",
    position: { x: CX - 50, y: 300 },
    data: {
      label: "作業者ネーム",
      color: COLOR.print,
      border: BORDER.print,
      minWidth: 85,
    },
  },
  {
    id: "te_label",
    type: "custom",
    position: { x: RX - 25, y: 265 },
    data: {
      label: "手圧着",
      color: "transparent",
      border: "none",
      fontColor: "#333",
      fontSize: 11,
    },
  },
  {
    id: "te_pc",
    type: "custom",
    position: { x: RX + 10, y: 300 },
    data: {
      label: "Android\nタブレット",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 110,
    },
  },
  {
    id: "te_sys",
    type: "custom",
    position: { x: RX + 160, y: 300 },
    data: {
      label: "新規アプリ\n(手圧着)",
      color: COLOR.new,
      border: BORDER.new,
      minWidth: 110,
    },
  },
  {
    id: "te_qr",
    type: "custom",
    position: { x: RX + 160, y: 370 },
    data: {
      label: "QRリーダー",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
    },
  },
  {
    id: "te_usb",
    type: "custom",
    position: { x: RX + 10, y: 370 },
    data: {
      label: "USBハブ",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 70,
    },
  },
  {
    id: "te_cable",
    type: "custom",
    position: { x: RX + 160, y: 420 },
    data: {
      label: "専用ケーブル",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
    },
  },
  {
    id: "te_micom",
    type: "custom",
    position: { x: RX + 160, y: 470 },
    data: {
      label: "マイコン",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
    },
  },
  {
    id: "te_switch",
    type: "custom",
    position: { x: RX + 300, y: 470 },
    data: {
      label: "カウントスイッチ",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
    },
  },
  {
    id: "te_micro",
    type: "custom",
    position: { x: RX + 300, y: 420 },
    data: {
      label: "マイクロメーター",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
    },
  },

  // 皮むき（A のみ）
  {
    id: "ka_label",
    type: "custom",
    position: { x: RX - 25, y: 980 },
    data: {
      label: "皮むき",
      color: "transparent",
      border: "none",
      fontColor: "#333",
      fontSize: 11,
      plans: ["A"],
    },
  },
  {
    id: "ka_pc",
    type: "custom",
    position: { x: RX + 10, y: 1015 },
    data: {
      label: "Android\nタブレット",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 110,
      plans: ["A"],
    },
  },
  {
    id: "ka_sys",
    type: "custom",
    position: { x: RX + 160, y: 1015 },
    data: {
      label: "新規アプリ\n(皮むき)",
      color: COLOR.new,
      border: BORDER.new,
      minWidth: 110,
      plans: ["A"],
    },
  },
  {
    id: "ka_qr",
    type: "custom",
    position: { x: RX + 160, y: 1085 },
    data: {
      label: "QRリーダー",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
      plans: ["A"],
    },
  },
  {
    id: "ka_usb",
    type: "custom",
    position: { x: RX + 10, y: 1085 },
    data: {
      label: "USBハブ",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 70,
      plans: ["A"],
    },
  },
  {
    id: "ka_micom",
    type: "custom",
    position: { x: RX + 160, y: 1135 },
    data: {
      label: "マイコン",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
      plans: ["A"],
    },
  },
  {
    id: "ka_switch",
    type: "custom",
    position: { x: RX + 300, y: 1135 },
    data: {
      label: "カウントスイッチ",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
      plans: ["A"],
    },
  },

  // シールド切断（A のみ: shield.json sets>=1）
  // シールド切断（A のみ）
  {
    id: "sh_label",
    type: "custom",
    position: { x: RX - 25, y: 735 },
    data: {
      label: "シールド切断",
      color: "transparent",
      border: "none",
      fontColor: "#333",
      fontSize: 11,
      plans: ["A"],
    },
  },
  {
    id: "sh_pc",
    type: "custom",
    position: { x: RX + 10, y: 770 },
    data: {
      label: "Android\nタブレット",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 110,
      plans: ["A"],
    },
  },
  {
    id: "sh_sys",
    type: "custom",
    position: { x: RX + 160, y: 770 },
    data: {
      label: "新規アプリ\n(シールド切断)",
      color: COLOR.new,
      border: BORDER.new,
      minWidth: 110,
      plans: ["A"],
    },
  },
  {
    id: "sh_qr",
    type: "custom",
    position: { x: RX + 160, y: 840 },
    data: {
      label: "QRリーダー",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
      plans: ["A"],
    },
  },
  {
    id: "sh_usb",
    type: "custom",
    position: { x: RX + 10, y: 840 },
    data: {
      label: "USBハブ",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 70,
      plans: ["A"],
    },
  },
  {
    id: "sh_cable",
    type: "custom",
    position: { x: RX + 160, y: 890 },
    data: {
      label: "変換装置",
      color: COLOR.new,
      border: BORDER.new,
      minWidth: 80,
      plans: ["A"],
    },
  },
  {
    id: "sh_micro",
    type: "custom",
    position: { x: RX + 300, y: 890 },
    data: {
      label: "PowerStrip\n9500",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
      plans: ["A"],
    },
  },

  // 準完チェック（A,B）
  {
    id: "jk_label",
    type: "custom",
    position: { x: RX - 25, y: 540 },
    data: {
      label: "準完チェック",
      color: "transparent",
      border: "none",
      fontColor: "#333",
      fontSize: 11,
      plans: ["A", "B"],
    },
  },
  {
    id: "jk_pc",
    type: "custom",
    position: { x: RX + 10, y: 575 },
    data: {
      label: "Android\nタブレット",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 110,
      plans: ["A", "B"],
    },
  },
  {
    id: "jk_sys",
    type: "custom",
    position: { x: RX + 160, y: 575 },
    data: {
      label: "新規アプリ\n(準完チェック)",
      color: COLOR.new,
      border: BORDER.new,
      minWidth: 110,
      plans: ["A", "B"],
    },
  },
  {
    id: "jk_qr",
    type: "custom",
    position: { x: RX + 160, y: 645 },
    data: {
      label: "QRリーダー",
      color: COLOR.existing,
      border: BORDER.existing,
      minWidth: 80,
      plans: ["A", "B"],
    },
  },
];

// ─── エッジ定義 ────────────────────────────────────────────
type EdgeDef = Edge & { plans?: Plan[] };

const e = (
  id: string,
  source: string,
  target: string,
  sh: string,
  th: string,
  label?: string,
  color = "#888",
  plans?: Plan[],
  dashed = false,
): EdgeDef => ({
  id,
  source,
  target,
  sourceHandle: sh,
  targetHandle: th,
  type: "smoothstep",
  label,
  style: {
    stroke: color,
    strokeWidth: 1.5,
    strokeDasharray: dashed ? "6 3" : undefined,
  },
  labelStyle: { fontSize: 11 },
  labelBgStyle: { fill: "#f5f5f5" },
  plans,
});

const BASE_EDGES: EdgeDef[] = [
  // NAS → HUB（有線のみ：黒線、全プラン）
  e("e-nas-hub", "nas", "hub", "bottom", "top", undefined, "#111"),

  // HUB → 各PC（有線/無線切替可能：青線）
  e("e-hub-kanban-w", "nas", "kanban_pc", "left", "top", undefined, "#111"),
  e(
    "e-hub-te-w",
    "hub",
    "te_pc",
    "right",
    "left",
    undefined,
    "#e8a000",
    ["C", "D", "E"],
    true,
  ),
  e("e-hub-ka-w", "hub", "ka_pc", "right", "left", undefined, "#4a90d9", ["A"]),
  e("e-hub-sh-w", "hub", "sh_pc", "right", "left", undefined, "#4a90d9", ["A"]),
  e("e-hub-jk-w", "hub", "jk_pc", "right", "left", undefined, "#4a90d9", [
    "A",
    "B",
  ]),
  e("e-hub-jk-w", "hub", "te_pc", "right", "left", undefined, "#4a90d9", [
    "A",
    "B",
  ]),

  // かんばん管理
  e("e-kanbanpc-sys", "kanban_pc", "kanban_sys", "left", "right"),
  e("e-kanbansys-pr", "kanban_pc", "printer", "bottom", "top"),
  e("e-pr-kanban", "printer", "kanban", "bottom", "left"),
  e("e-pr-name", "printer", "name_tag", "bottom", "left"),

  // 手圧着
  e(
    "e-te-qr-usb",
    "te_qr",
    "te_pc",
    "left",
    "right",
    undefined,
    "#e8a000",
    undefined,
    true,
  ),
  e("e-te-pc-sys", "te_pc", "te_sys", "top", "top"),
  e("e-te-usb-pc", "te_usb", "te_pc", "top", "bottom"),
  e("e-te-cable", "te_cable", "te_usb", "left", "bottom"),
  e("e-te-micro", "te_micro", "te_cable", "left", "right"),
  e("e-te-micom", "te_micom", "te_usb", "left", "bottom"),
  e("e-te-switch", "te_switch", "te_usb", "left", "bottom"),

  // 皮むき
  e(
    "e-ka-qr-usb",
    "ka_qr",
    "ka_pc",
    "left",
    "right",
    undefined,
    "#e8a000",
    ["A"],
    true,
  ),
  e("e-ka-pc-sys", "ka_pc", "ka_sys", "top", "top", undefined, undefined, [
    "A",
  ]),
  e("e-ka-usb-pc", "ka_usb", "ka_pc", "top", "bottom", undefined, undefined, [
    "A",
  ]),
  e(
    "e-ka-cable",
    "ka_cable",
    "ka_usb",
    "left",
    "bottom",
    undefined,
    undefined,
    ["A"],
  ),
  e(
    "e-ka-micro",
    "ka_micro",
    "ka_cable",
    "left",
    "right",
    undefined,
    undefined,
    ["A"],
  ),
  e(
    "e-ka-micom",
    "ka_micom",
    "ka_usb",
    "left",
    "bottom",
    undefined,
    undefined,
    ["A"],
  ),
  e(
    "e-ka-switch",
    "ka_switch",
    "ka_usb",
    "left",
    "bottom",
    undefined,
    undefined,
    ["A"],
  ),

  // シールド切断
  e(
    "e-sh-qr-usb",
    "sh_qr",
    "sh_pc",
    "left",
    "right",
    undefined,
    "#e8a000",
    ["A"],
    true,
  ),
  e("e-sh-pc-sys", "sh_pc", "sh_sys", "top", "top", undefined, undefined, [
    "A",
  ]),
  e("e-sh-usb-pc", "sh_usb", "sh_pc", "top", "bottom", undefined, undefined, [
    "A",
  ]),
  e(
    "e-sh-cable",
    "sh_cable",
    "sh_usb",
    "left",
    "bottom",
    undefined,
    undefined,
    ["A"],
  ),
  e(
    "e-sh-micro",
    "sh_micro",
    "sh_cable",
    "left",
    "right",
    undefined,
    undefined,
    ["A"],
  ),
  e(
    "e-sh-micom",
    "sh_micom",
    "sh_usb",
    "left",
    "bottom",
    undefined,
    undefined,
    ["A"],
  ),
  e(
    "e-sh-switch",
    "sh_switch",
    "sh_usb",
    "left",
    "bottom",
    undefined,
    undefined,
    ["A"],
  ),

  // 準完チェック
  e(
    "e-jk-qr-usb",
    "jk_qr",
    "jk_pc",
    "left",
    "right",
    undefined,
    "#e8a000",
    ["A", "B"],
    true,
  ),
  e("e-jk-pc-sys", "jk_pc", "jk_sys", "top", "top", undefined, undefined, [
    "A",
    "B",
  ]),
  e("e-jk-usb-pc", "jk_usb", "jk_pc", "top", "bottom", undefined, undefined, [
    "A",
    "B",
  ]),
  e(
    "e-jk-cable",
    "jk_cable",
    "jk_usb",
    "left",
    "bottom",
    undefined,
    undefined,
    ["A", "B"],
  ),
  e(
    "e-jk-micro",
    "jk_micro",
    "jk_cable",
    "left",
    "right",
    undefined,
    undefined,
    ["A", "B"],
  ),
  e(
    "e-jk-micom",
    "jk_micom",
    "jk_usb",
    "left",
    "bottom",
    undefined,
    undefined,
    ["A", "B"],
  ),
  e(
    "e-jk-switch",
    "jk_switch",
    "jk_usb",
    "left",
    "bottom",
    undefined,
    undefined,
    ["A", "B"],
  ),
];

// ─── 凡例 ──────────────────────────────────────────────────
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
      { color: COLOR.existing, border: BORDER.existing, label: "既存" },
      { color: COLOR.new, border: BORDER.new, label: "新規システム" },
      { color: COLOR.print, border: BORDER.print, label: "印刷物" },
    ].map((item) => (
      <Flex key={item.label} align="center" mb={1}>
        <Box
          w="14px"
          h="14px"
          bg={item.color}
          border={item.border}
          mr={1}
          borderRadius="2px"
          flexShrink={0}
        />
        <Text>{item.label}</Text>
      </Flex>
    ))}
    <Flex align="center" mt={2} mb={1}>
      <Box w="22px" h="0" borderTop="2px solid #111" mr={1} flexShrink={0} />
      <Text>有線のみ</Text>
    </Flex>
    <Flex align="center" mb={1}>
      <Box w="22px" h="0" borderTop="2px solid #4a90d9" mr={1} flexShrink={0} />
      <Text>有線/無線切替可能</Text>
    </Flex>
    <Flex align="center" mb={1}>
      <Box
        w="22px"
        h="0"
        borderTop="2px dashed #e8a000"
        mr={1}
        flexShrink={0}
      />
      <Text>無線専用</Text>
    </Flex>
  </Box>
);

// ─── 内部コンポーネント（useReactFlow使用） ──────────────────
function ConnectionDiagramInner({
  activePlan,
  nodes,
  edges,
  containerRef,
  onPrintReady,
}: {
  activePlan: Plan;
  nodes: Node[];
  edges: Edge[];
  containerRef: React.RefObject<HTMLDivElement>;
  onPrintReady?: (fn: () => void) => void;
}) {
  const { fitView, getViewport, setViewport } = useReactFlow();

  const handlePrint = async () => {
    const el = containerRef.current;
    if (!el) return;

    // 現在の状態を保存
    const prevViewport = getViewport();
    const prevW = el.style.width;
    const prevH = el.style.height;

    // プランごとのコンテンツ高さに合わせてキャプチャサイズを決定
    const PRINT_W = 900;
    const PRINT_H = (
      { A: 880, B: 510, C: 370, D: 370, E: 370 } as Record<Plan, number>
    )[activePlan];
    el.style.width = `${PRINT_W}px`;
    el.style.height = `${PRINT_H}px`;
    await new Promise((r) => setTimeout(r, 80));

    // 全ノードが収まるようfitView（padding=0で余白なし）
    fitView({ padding: 0, duration: 0 });
    await new Promise((r) => setTimeout(r, 200));

    // ズームボタンを一時非表示
    const controls = el.querySelector(
      ".react-flow__controls",
    ) as HTMLElement | null;
    if (controls) controls.style.display = "none";

    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(el, {
      backgroundColor: "#fff",
      scale: 2,
      useCORS: true,
      width: PRINT_W,
      height: PRINT_H as number,
    });

    if (controls) controls.style.display = "";
    // サイズとビューポートを元に戻す
    el.style.width = prevW;
    el.style.height = prevH;
    setViewport(prevViewport, { duration: 0 });

    const imgData = canvas.toDataURL("image/png");
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>設備接続図_プラン${activePlan}</title>
<style>
  @page { size: A4 portrait; margin: 10mm; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; font-family: sans-serif; }
  h2 { font-size: 13px; margin: 0 0 6px; }
  img { width: 100%; height: auto; display: block; }
</style></head>
<body>
<h2>7-1. 設備接続図（プラン${activePlan}）</h2>
<img src="${imgData}" />
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) return;
    setTimeout(() => {
      win.focus();
      win.print();
      URL.revokeObjectURL(url);
    }, 800);
  };

  useEffect(() => {
    onPrintReady?.(() => {
      void handlePrint();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlan]);

  return (
    <ReactFlow
      key={activePlan}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      nodesDraggable={true}
      nodeOrigin={[0.5, 0.5]}
      defaultViewport={{ x: 10, y: 10, zoom: 0.72 }}
      minZoom={0.3}
      zoomOnScroll={false}
      preventScrolling={false}
      proOptions={{ hideAttribution: true }}
    >
      <Legend />
      <Background gap={16} color="#e8e8e8" />
      <Controls
        showZoom={true}
        showFitView={true}
        showInteractive={false}
        position="bottom-left"
      />
    </ReactFlow>
  );
}

// ─── メインコンポーネント ──────────────────────────────────
export default function ConnectionDiagram({
  onPrintReady,
}: {
  onPrintReady?: (fn: () => void) => void;
} = {}) {
  const [activePlan, setActivePlan] = useState<Plan>("C");
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const activeBtnBg = isDark ? "#E3836D" : "#503F35";
  const containerRef = useRef<HTMLDivElement>(null);

  // プランに含まれるノード・エッジのみ抽出
  const nodes: Node[] = BASE_NODES.filter(
    (n) => !n.data.plans || n.data.plans.includes(activePlan),
  ).map(({ data: { plans, ...restData }, ...rest }) => ({
    ...rest,
    data: restData,
  }));

  const edges: Edge[] = BASE_EDGES.filter(
    (ed) =>
      !(ed as EdgeDef).plans || (ed as EdgeDef).plans!.includes(activePlan),
  ).map((ed) => {
    const { plans, ...rest } = ed as EdgeDef;
    return rest;
  });

  return (
    <Box>
      {/* プラン選択ボタン */}
      <HStack mb={3} spacing={1} flexWrap="wrap">
        <Text fontSize="xs" color="gray.500" mr={1}>
          プラン：
        </Text>
        {PLANS.map((p) => (
          <Button
            key={p}
            size="xs"
            bg={p === activePlan ? activeBtnBg : undefined}
            color={
              p === activePlan ? "white" : isDark ? "gray.200" : "gray.700"
            }
            variant={p === activePlan ? "solid" : "outline"}
            borderColor={
              p === activePlan ? activeBtnBg : isDark ? "gray.500" : "gray.400"
            }
            _hover={{}}
            onClick={() => setActivePlan(p)}
          >
            プラン{p}
          </Button>
        ))}
      </HStack>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: (
            {
              A: "880px",
              B: "500px",
              C: "440px",
              D: "440px",
              E: "440px",
            } as Record<Plan, string>
          )[activePlan],
          position: "relative",
        }}
      >
        <ReactFlowProvider>
          <ConnectionDiagramInner
            activePlan={activePlan}
            nodes={nodes}
            edges={edges}
            containerRef={containerRef}
            onPrintReady={onPrintReady}
          />
        </ReactFlowProvider>
      </div>
    </Box>
  );
}
