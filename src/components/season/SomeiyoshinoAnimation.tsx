import React, { useEffect, useState, useCallback } from "react";
import { Box, useColorMode, List, ListItem } from "@chakra-ui/react";
import ModalButton from "./ModalButton";
import Image from "next/image";

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

// SVGのURLを定数として定義
const SAKURA_SVG_URL = "/images/illust/obj/someiyoshino_pixcel.svg";

const SomeiyoshinoAnimation: React.FC = () => {
  const [sakuras, setSakuras] = useState<Sakura[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const { colorMode } = useColorMode();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const createSakura = useCallback((): Sakura => {
    const swayValue = Math.random() * 100 - 50;
    return {
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      size: Math.random() * 8 + 12,
      opacity: Math.random() * 0.2 + 0.5,
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
            }, 2000);
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

  // モーダルの内容を定義
  const modalBody = (
    <Box color="custom.theme.light.100">
      <Box
        display="inline-block"
        fontSize="20px"
        px={1}
        lineHeight={1}
        borderRadius="5px"
        width="auto"
        my={4}
      >
        染井吉野
      </Box>
      <Box
        mb={2}
        fontSize="10px"
        borderRadius="5px"
        display="inline-block"
        width="auto"
      >
        ソメイヨシノ
      </Box>
      <Box />
      <Box
        px={1}
        my={2}
        borderRadius="5px"
        display="inline-block"
        width="auto"
        fontSize="sm"
      >
        日本で最も有名な桜。
      </Box>
      <Box
        px={1}
        my={4}
        borderRadius="5px"
        display="inline-block"
        width="auto"
        fontSize="sm"
      >
        <List spacing={2}>
          <ListItem>{`開花時期: 3月下旬〜4月上旬`}</ListItem>
          <ListItem>{`歴史: 江戸時代の園芸ブーム「推しの植物を掛け合わせて新品種を作る」みたいなノリで誕生`}</ListItem>
          <ListItem>{`交配: エドヒガン ✖︎ オオシマザクラ`}</ListItem>
          <ListItem>{`繁殖: 種から増えないので、全国に広まったソメイヨシノはすべて挿し木によるクローン`}</ListItem>
          <ListItem>{`起源: 江戸時代（東京の染井村 : 今の駒込）`}</ListItem>
          <ListItem>{`必殺技: ☄️【瞬咲一閃（しゅんしょう・いっせん）開花したと思ったら一気に満開！全国の桜前線を一刀両断するかのごとく駆け抜ける。
「一気に咲いて、一気に散る」その潔さ、まさに侍スタイル！`}</ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
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
        {/* 桜のSVGを一度だけ読み込むための非表示コンテナ */}
        <Box display="none" filter="brightness(0.1) contrast(1.2)">
          <Image
            src={SAKURA_SVG_URL}
            alt="sakura"
            width={32}
            height={32}
            priority
            unoptimized
          />
        </Box>
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
        @keyframes slideLeft {
          0% {
            transform: translateX(0);
          }
          50%{
            transform:translateX(-10px);
            opacity:0.3;
          }
          100% {
            transform: translateX(-16px);
            opacity:0;
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
                    ? `slideLeft 2s ease-out forwards`
                    : `fall ${sakura.duration}s linear infinite`,
                  animationPlayState: sakura.isPaused ? "running" : "running",
                  willChange: "transform",
                  zIndex: sakura.isPaused ? 10001 : 10,
                  opacity: sakura.opacity,
                  transition: "opacity 0.3s ease",
                  backgroundImage: `url(${SAKURA_SVG_URL})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                } as React.CSSProperties
              }
            />
          );
        })}
      </Box>
      <ModalButton
        isOpen={isModalOpen}
        onClose={closeModal}
        onOpen={openModal}
        colorMode={colorMode}
        title="染井吉野"
        bgImage="url('/images/common/flower2985.png')"
        body={modalBody}
      />
    </>
  );
};

export default SomeiyoshinoAnimation;
