"use client";
import { Box } from "@chakra-ui/react";

type Terminal = {
  terminal: string;
  part: string;
  wireCount: number;
  connections: {
    terminal: string;
    part: string;
    count: number;
    avgLength: number;
  }[];
};

type FixedNode = {
  terminal: string;
  x: number; // %単位
  y: number;
};

export default function TerminalGraph({
  data,
  fixedNodes,
}: {
  data: Terminal[];
  fixedNodes: FixedNode[];
}) {
  // 固定端末マップ
  const fixedMap: Record<string, { x: number; y: number }> = {};
  fixedNodes.forEach((n) => {
    if (n.terminal) fixedMap[n.terminal] = { x: n.x, y: n.y };
  });

  // 簡易位置推定（平均位置）
  const getPosition = (terminal: string) => {
    if (fixedMap[terminal]) return fixedMap[terminal];
    const related = data.find((t) => t.terminal === terminal);
    if (!related) return { x: 50, y: 50 };
    const positions = related.connections
      .map((conn) => fixedMap[conn.terminal])
      .filter(Boolean);
    if (positions.length === 0) return { x: 50, y: 50 };
    const x = positions.reduce((sum, p) => sum + p.x, 0) / positions.length;
    const y = positions.reduce((sum, p) => sum + p.y, 0) / positions.length;
    return { x, y };
  };

  // 全端末の位置計算
  const nodePositions: Record<string, { x: number; y: number }> = {};
  data.forEach((t) => {
    nodePositions[t.terminal] = getPosition(t.terminal);
  });

  // 線が他の端末に近すぎる（≒跨ぐ）かの判定
  const isCrossingTerminal = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    ignore: string[]
  ) => {
    for (const [key, pos] of Object.entries(nodePositions)) {
      if (ignore.includes(key)) continue;
      const d =
        Math.abs((x2 - x1) * (y1 - pos.y) - (x1 - pos.x) * (y2 - y1)) /
        Math.hypot(x2 - x1, y2 - y1);
      if (d < 3) return true; // 3%以内なら跨ぎとみなす
    }
    return false;
  };

  // 分岐点生成
  const getBendPoint = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const norm = { x: dx / len, y: dy / len };
    const perp = { x: -norm.y, y: norm.x };
    return {
      x: (x1 + x2) / 2 + perp.x * 5, // 5%横にずらす
      y: (y1 + y2) / 2 + perp.y * 5,
    };
  };

  return (
    <Box
      position="relative"
      width="100%"
      height="600px"
      border="1px solid #ccc"
    >
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        {/* 接続線 */}
        {data.map((t) =>
          t.connections.map((conn, idx) => {
            const from = nodePositions[t.terminal];
            const to = nodePositions[conn.terminal];
            const ignore = [t.terminal, conn.terminal];

            const needsBend = isCrossingTerminal(
              from.x,
              from.y,
              to.x,
              to.y,
              ignore
            );
            if (needsBend) {
              const bend = getBendPoint(from.x, from.y, to.x, to.y);
              return (
                <g key={`${t.terminal}-${conn.terminal}-${idx}`}>
                  <line
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${bend.x}%`}
                    y2={`${bend.y}%`}
                    stroke="gray"
                    strokeWidth={2}
                  />
                  <line
                    x1={`${bend.x}%`}
                    y1={`${bend.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="gray"
                    strokeWidth={2}
                  />
                  <circle
                    cx={`${bend.x}%`}
                    cy={`${bend.y}%`}
                    r={4}
                    fill="black"
                  />
                </g>
              );
            } else {
              return (
                <line
                  key={`${t.terminal}-${conn.terminal}-${idx}`}
                  x1={`${from.x}%`}
                  y1={`${from.y}%`}
                  x2={`${to.x}%`}
                  y2={`${to.y}%`}
                  stroke="gray"
                  strokeWidth={2}
                />
              );
            }
          })
        )}
        {/* 端末ラベル */}
        {Object.entries(nodePositions).map(([key, pos]) => (
          <g key={key}>
            <circle cx={`${pos.x}%`} cy={`${pos.y}%`} r={5} fill="#3182CE" />
            <text
              x={`${pos.x + 1}%`}
              y={`${pos.y - 1}%`}
              fontSize="10"
              fill="black"
            >
              {key}
            </text>
          </g>
        ))}
      </svg>
    </Box>
  );
}
