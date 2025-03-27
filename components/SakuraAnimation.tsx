import React, { useEffect, useState, useCallback } from "react";
import { Box, Image } from "@chakra-ui/react";

interface Sakura {
  id: number;
  x: number;
  size: number;
  opacity: number;
  sway: number;
  duration: number;
  delay: number;
}

const SakuraAnimation: React.FC = () => {
  const [sakuras, setSakuras] = useState<Sakura[]>([]);

  const createSakura = useCallback(
    (): Sakura => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      size: Math.random() * 12 + 6,
      opacity: Math.random() * 0.2 + 0.2,
      sway: Math.random() * 100 - 50, // -50pxから50pxの間で左右の揺れ
      duration: Math.random() * 10 + 15, // 15-25秒
      delay: Math.random() * 5, // 0-5秒の遅延
    }),
    []
  );

  useEffect(() => {
    const initialSakuras = Array.from({ length: 15 }, createSakura);
    setSakuras(initialSakuras);

    const interval = setInterval(() => {
      setSakuras((prevSakuras) => {
        if (Math.random() < 0.05 && prevSakuras.length < 20) {
          return [...prevSakuras, createSakura()];
        }
        return prevSakuras;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [createSakura]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      pointerEvents="none"
      zIndex={1000}
      overflow="hidden"
    >
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(var(--sway)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      {sakuras.map((sakura) => (
        <Box
          key={sakura.id}
          position="absolute"
          left={`${sakura.x}px`}
          top="0"
          width={`${sakura.size}px`}
          height={`${sakura.size}px`}
          style={
            {
              "--sway": `${sakura.sway}px`,
              animation: `fall ${sakura.duration}s linear infinite`,
              animationDelay: `${sakura.delay}s`,
            } as React.CSSProperties
          }
        >
          <Image
            src="/images/illust/obj/sakura_pixcel.svg"
            width="100%"
            height="100%"
            opacity={sakura.opacity}
          />
        </Box>
      ))}
    </Box>
  );
};

export default SakuraAnimation;
