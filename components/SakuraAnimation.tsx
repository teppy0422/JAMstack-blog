import React, { useEffect, useState, useCallback } from "react";
import { Box, Image } from "@chakra-ui/react";

interface Sakura {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
  speed: number;
  opacity: number;
  sway: number; // 左右の揺れを追加
}

const SakuraAnimation: React.FC = () => {
  const [sakuras, setSakuras] = useState<Sakura[]>([]);

  // 桜の生成を最適化
  const createSakura = useCallback(
    (): Sakura => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      size: Math.random() * 12 + 6, // サイズを少し小さく
      speed: Math.random() * 0.8 + 5, // 速度を遅く
      opacity: Math.random() * 0.2 + 0.2, // 透明度を調整
      sway: Math.random() * 2 - 1, // -1から1の間の値で左右の揺れを設定
    }),
    []
  );

  useEffect(() => {
    // 初期の桜を生成
    const initialSakuras = Array.from({ length: 15 }, createSakura);
    setSakuras(initialSakuras);

    // アニメーションループ
    const interval = setInterval(() => {
      setSakuras((prevSakuras) => {
        // 既存の桜を更新
        const updatedSakuras = prevSakuras
          .map((sakura) => ({
            ...sakura,
            y: sakura.y + sakura.speed,
            x: sakura.x + sakura.sway, // 左右に揺れる
            rotation: (sakura.rotation + 0.3) % 360, // 回転速度を遅く
          }))
          .filter((sakura) => sakura.y < window.innerHeight + 20);

        // 新しい桜を追加
        if (Math.random() < 0.05 && updatedSakuras.length < 20) {
          updatedSakuras.push(createSakura());
        }

        return updatedSakuras;
      });
    }, 50); // 更新頻度を上げて滑らかに

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
    >
      {sakuras.map((sakura) => (
        <Image
          key={sakura.id}
          src="/images/illust/obj/sakura_pixcel.svg"
          position="absolute"
          left={`${sakura.x}px`}
          top={`${sakura.y}px`}
          width={`${sakura.size}px`}
          height={`${sakura.size}px`}
          transform={`rotate(${sakura.rotation}deg)`}
          opacity={sakura.opacity}
          transition="all 0.05s linear"
        />
      ))}
    </Box>
  );
};

export default SakuraAnimation;
