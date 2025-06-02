"use client";

import { useEffect, useState, useRef } from "react";
import { Box } from "@chakra-ui/react";

export default function GameClient() {
  // クライアントAPIはここでOK
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // WASDキー操作用
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPos((prev) => {
        let dx = 0,
          dy = 0;
        switch (e.key.toLowerCase()) {
          case "w":
            dy = -10;
            break;
          case "a":
            dx = -10;
            break;
          case "s":
            dy = 10;
            break;
          case "d":
            dx = 10;
            break;
        }
        return { x: prev.x + dx, y: prev.y + dy };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Gamepad（スティック）操作用
  useEffect(() => {
    let animationId: number;

    const handleGamepad = () => {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        const x = gp.axes[0]; // 左スティックのX軸
        const y = gp.axes[1]; // 左スティックのY軸
        setPos((prev) => ({
          x: prev.x + x * 5,
          y: prev.y + y * 5,
        }));
      }
      animationId = requestAnimationFrame(handleGamepad);
    };

    handleGamepad();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <Box
      w="100vw"
      h="100vh"
      bg="repeating-conic-gradient(#444 0 25%, #222 0 50%)"
      backgroundSize="40px 40px"
      position="relative"
    >
      <Box
        position="absolute"
        left={`calc(50% + ${pos.x}px)`}
        top={`calc(50% + ${pos.y}px)`}
        w="20px"
        h="20px"
        bg="red"
        borderRadius="50%"
      />
    </Box>
  );
}
