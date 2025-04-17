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

const MAX_SAKURAS = 25;
const INITIAL_SAKURAS = 30;

// SVGのURLを定数として定義
const SAKURA_SVG_URL = "/images/illust/obj/hachisuka_pixcel.svg";

const HachisukaAnimation: React.FC = () => {
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
      size: Math.random() * 8 + 11,
      opacity: Math.random() * 0.2 + 0.6,
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
      setSakuras(
        (prevSakuras) =>
          prevSakuras
            .map((sakura) => {
              if (sakura.isPaused) return sakura;

              const sakuraElement = document.querySelector(
                `[data-sakura-id="${sakura.id}"]`
              );
              if (!sakuraElement) return sakura;

              const rect = sakuraElement.getBoundingClientRect();

              // 複数のroofを取得
              const roofElements = document.querySelectorAll(
                '[data-roof-id="sakura"]'
              );
              let hasCollision = false;

              roofElements.forEach((roofElement) => {
                const roofRect = roofElement.getBoundingClientRect();

                // X・Yの矩形衝突判定
                const isColliding =
                  rect.bottom >= roofRect.top + 10 &&
                  rect.top <= roofRect.bottom &&
                  rect.right >= roofRect.left &&
                  rect.left <= roofRect.right;

                if (isColliding && roofRect.top > 100 && rect.top > 100) {
                  hasCollision = true;
                }
              });

              // 画面外に出た桜を削除
              if (rect.top > window.innerHeight) {
                return null; // 画面外に出た桜は null を返す
              }

              if (hasCollision) {
                // 衝突した桜を2秒後に削除
                setTimeout(() => {
                  setSakuras((currentSakuras) =>
                    currentSakuras.filter((s) => s.id !== sakura.id)
                  );
                }, 2000);

                return {
                  ...sakura,
                  x: Math.random() * window.innerWidth,
                  isPaused: true,
                  pausedPosition: { x: rect.left, y: rect.top },
                  zIndex: 10000,
                };
              }

              return sakura;
            })
            .filter((sakura) => sakura !== null) // null をフィルタリング
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
        蜂須賀桜
      </Box>
      <Box
        mb={2}
        fontSize="10px"
        borderRadius="5px"
        display="inline-block"
        width="auto"
      >
        ハチスカザクラ
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
        ソメイヨシノより1か月以上早く咲く早咲きの桜
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
          <ListItem>{`開花時期: 2月中旬〜3月上旬ごろ`}</ListItem>
          <ListItem>{`歴史: 徳島城跡原産。江戸時代、蜂須賀家が治めていた土地で見つかったことからこの名がついた。`}</ListItem>
          <ListItem>{`交配: カンヒザクラ系`}</ListItem>
          <ListItem>{`繁殖: 種から育てると違う花が咲く可能性があるため、クローン的な繁殖が主流`}</ListItem>
          <ListItem>{`特徴: 花の色は濃いめの桃色で、ソメイヨシノより華やか。花びらは一重咲き。都市部でも育ちやすく、徳島以外にも植樹されている。`}</ListItem>
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
            transform: translateY(40vh) translateX(5vw) rotate(144deg);
          }
          60% {
            transform: translateY(62vh) translateX(-5vw) rotate(216deg);
          }
          80% {
            transform: translateY(80vh) translateX(-20vw) rotate(288deg);
          }
          100% {
            transform: translateY(100vh) translateX(-25vw) rotate(360deg);
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
        title="蜂須賀桜"
        bgImage="url('/images/common/flower3403.webp')"
        body={modalBody}
      />
    </>
  );
};

export default HachisukaAnimation;
