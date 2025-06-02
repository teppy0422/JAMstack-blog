"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const tileSize = 40;

  // ゲームパッドのスティック入力を監視
  useEffect(() => {
    let animationId: number;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0];
      if (gp) {
        const [lx, ly] = gp.axes; // 左スティックのX, Y
        const threshold = 0.1; // 入力のしきい値

        setOffset((prev) => ({
          x: prev.x - (Math.abs(lx) > threshold ? lx * 5 : 0),
          y: prev.y - (Math.abs(ly) > threshold ? ly * 5 : 0),
        }));
      }

      animationId = requestAnimationFrame(pollGamepad);
    };

    pollGamepad();

    return () => cancelAnimationFrame(animationId);
  }, []);

  // 背景描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / tileSize) + 2;
      const rows = Math.ceil(canvas.height / tileSize) + 2;

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * tileSize + (offset.x % (tileSize * 2));
          const y = j * tileSize + (offset.y % (tileSize * 2));
          ctx.fillStyle = (i + j) % 2 === 0 ? "#555" : "#999";
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }

      // プレイヤー（中央固定）
      const playerSize = 30;
      ctx.fillStyle = "red";
      ctx.fillRect(
        canvas.width / 2 - playerSize / 2,
        canvas.height / 2 - playerSize / 2,
        playerSize,
        playerSize
      );

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [offset]);

  return (
    <Box position="relative" w="100vw" h="100vh" bg="black">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ display: "block" }}
      />
    </Box>
  );
}
