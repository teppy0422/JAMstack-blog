import React, { useEffect, useState, useCallback } from "react";
import { Box, Image } from "@chakra-ui/react";
import { AnimationImage } from "./CustomImage";

interface Sakura {
  id: number;
  x: number;
  size: number;
  opacity: number;
  sway: number;
  duration: number;
  delay: number;
  isPaused: boolean;
  pausedPosition?: { x: number; y: number };
}

const MAX_SAKURAS = 10;
const INITIAL_SAKURAS = 15;

const SakuraAnimation: React.FC = () => {
  const [sakuras, setSakuras] = useState<Sakura[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const createSakura = useCallback((): Sakura => {
    const swayValue = Math.random() * 100 - 50;
    return {
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      size: Math.random() * 8 + 12,
      opacity: Math.random() * 0.2 + 0.4,
      sway: swayValue,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 0,
      isPaused: false,
    };
  }, []);

  // ローディング完了後に桜を開始
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const initialSakuras = Array.from(
        { length: INITIAL_SAKURAS },
        createSakura
      );
      setSakuras(initialSakuras);
      const interval = setInterval(() => {
        setSakuras((prevSakuras) => {
          const currentCount = prevSakuras.length;
          if (currentCount < MAX_SAKURAS) {
            const newSakuras = Array.from(
              { length: MAX_SAKURAS - currentCount },
              createSakura
            );
            return [...prevSakuras, ...newSakuras];
          }
          return prevSakuras;
        });
      }, 1000);
      return () => clearInterval(interval);
    }, 3000); // 3秒後に開始
    return () => clearTimeout(timer);
  }, [createSakura]);

  // 桜の位置を監視して停止ゾーンとの衝突を検知
  useEffect(() => {
    if (isLoading) return;

    const checkCollision = () => {
      setSakuras((prevSakuras) =>
        prevSakuras.map((sakura) => {
          if (sakura.isPaused) return sakura;

          const sakuraElement = document.querySelector(
            `[data-sakura-id="${sakura.id}"]`
          );
          if (!sakuraElement) return sakura;

          const rect = sakuraElement.getBoundingClientRect();
          const sakuraY = rect.top;

          // 固定要素の位置を取得
          const roofElement = document.querySelector('[data-roof-id="sakura"]');
          if (!roofElement) return sakura;

          const roofRect = roofElement.getBoundingClientRect();
          const stopY = roofRect.top;

          // 固定要素の上で停止
          if (sakuraY >= stopY && stopY > 500 && sakuraY > 500) {
            // 衝突した桜を5秒後に削除
            setTimeout(() => {
              setSakuras((currentSakuras) =>
                currentSakuras.filter((s) => s.id !== sakura.id)
              );
            }, 5000);
            return {
              ...sakura,
              isPaused: true,
              pausedPosition: { x: rect.left, y: sakuraY },
              zIndex: 10000,
            };
          }
          return sakura;
        })
      );
    };

    const animationFrame = requestAnimationFrame(function animate() {
      checkCollision();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      pointerEvents="none"
      zIndex={10000}
      overflow="hidden"
    >
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
          }
          5% {
            translateY(5vh);
          }
          40% {
            transform: translateY(40vh) translateX(-10vw) rotate(144deg);
          }
          60% {
            transform: translateY(60vh) translateX(-15vw) rotate(216deg);
          }
          80% {
            transform: translateY(80vh) translateX(-25vw) rotate(288deg);
          }
          100% {
            transform: translateY(100vh) translateX(-35vw) rotate(360deg);
          }
        }
      `}</style>
      {sakuras.map((sakura) => {
        return (
          <Box
            key={sakura.id}
            data-sakura-id={sakura.id}
            position="absolute"
            left={
              sakura.isPaused
                ? `${sakura.pausedPosition?.x}px`
                : `${sakura.x}px`
            }
            top={sakura.isPaused ? `${sakura.pausedPosition?.y}px` : "0"}
            width={`${sakura.size}px`}
            height={`${sakura.size}px`}
            style={
              {
                "--sway": `${sakura.sway}px`,
                animation: sakura.isPaused
                  ? "none"
                  : `fall ${sakura.duration}s linear infinite`,
                // animationDelay: `${sakura.delay}s`,
                animationPlayState: sakura.isPaused ? "paused" : "running",
                willChange: "transform",
                zIndex: sakura.isPaused ? 10001 : 10,
                opacity: sakura.opacity,
                transition: "opacity 0.3s ease",
              } as React.CSSProperties
            }
          >
            <Image
              src="/images/illust/obj/sakura_pixcel.svg"
              width="100%"
              height="100%"
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default SakuraAnimation;
