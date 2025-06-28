"use client";
import { useEffect, useRef, useState } from "react";
import { Box, Text, useColorMode, List, ListItem } from "@chakra-ui/react";
import ModalButton from "./ModalButton";

type StaticStar = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaDir: number;
};

type RiverStar = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  speed: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
};

export default function MilkyWayPage() {
  const { colorMode, setColorMode } = useColorMode();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticStarsRef = useRef<StaticStar[]>([]);
  const riverStarsRef = useRef<RiverStar[]>([]);
  const timeRef = useRef(0);

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const modalBody = (
    <Box
      color="custom.theme.light.100"
      textShadow="
        -1px -1px 2px black,
        1px -1px 2px black,
        -1px  1px 2px black,
        1px  1px 2px black
      "
    >
      <Box
        display="inline-block"
        fontSize="20px"
        px={1}
        lineHeight={1}
        borderRadius="5px"
        width="auto"
        my={4}
      >
        七夕
      </Box>
      <Box
        mb={2}
        fontSize="10px"
        borderRadius="5px"
        display="inline-block"
        width="auto"
      >
        たなばた
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
        働き者の織姫と、のんびり屋の彦星。神様に「仕事しろ」と怒られ、年に一度しか会えなくなった2人の物語。会えるのは7月7日。ただし天気が悪ければ延期なしで中止。ブラック企業もびっくりの評価制度が光る行事。
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
          <ListItem>{`開催日: 7月7日（または旧暦の8月）`}</ListItem>
          <ListItem>{`風習: 短冊に願いを書く → 風に飛ばされる → 願いも飛ぶ`}</ListItem>
          <ListItem>{`織姫: 機織りの神様であり、ガチの職人系女子`}</ListItem>
          <ListItem>{`彦星: 牛飼いの青年で、草食系（文字通り）`}</ListItem>
          <ListItem>{`短冊文化: 昔は字の上達を願う日、今は「世界平和」から「バグが出ませんように。出ても気づかれませんように」までカオス`}</ListItem>
          <ListItem>{`笹の命: 飾った翌日には枯れ始めるため、エコとは無縁`}</ListItem>
        </List>
      </Box>
    </Box>
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // === 点滅星（背景）生成 ===
    staticStarsRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.5 + 0.3,
      alphaDir: Math.random() * 0.01 + 0.003,
    }));

    // === 天の川の星（右上 → 左下へ流れる）生成 ===
    riverStarsRef.current = Array.from({ length: 400 }, () => {
      const baseX = Math.random() * width;
      const baseY = Math.random() * height;

      return {
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        speed: Math.random() * 0.05 + 0.01,
        size: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.4 + 0.3,
        color: ["#ffffff", "#d0ccff", "#bcd9ff", "#ffe0f0"][
          Math.floor(Math.random() * 4)
        ],
        phase: Math.random() * Math.PI * 2,
      };
    });

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      timeRef.current += 0.01;

      // === 点滅星描画 ===
      for (const star of staticStarsRef.current) {
        // α値で点滅
        star.alpha += star.alphaDir;
        if (star.alpha >= 1 || star.alpha <= 0.1) {
          star.alphaDir *= -1;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      }

      // === 天の川（流れる星）描画 ===
      for (const star of riverStarsRef.current) {
        // 右上→左下方向のベクトル（x--, y++）
        star.x -= star.speed;
        star.y += star.speed;

        // カーブ：sinカーブ追加
        const curve =
          Math.sin(star.x * 0.005 + timeRef.current + star.phase) * 15;
        const yOffset = curve;
        const x = star.x;
        const y = star.y + yOffset;

        // 画面外に出たら再生成（右上から出現）
        if (x < -star.size || y > height + star.size) {
          const baseX = width + Math.random() * 90;
          const baseY = -Math.random() * 100;
          Object.assign(star, {
            baseX,
            baseY,
            x: baseX,
            y: baseY,
          });
        }
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* 背景Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* 短冊：上部に */}
      <Box
        position="fixed"
        top="32px"
        left="0px"
        w="100vw"
        gap={4}
        py={2}
        zIndex={1010}
        color="custom.theme.light.850"
      >
        {["七夕まつり"].map((text, idx) => (
          <Box position="relative" bg="red">
            <Box
              position="absolute"
              right="110px"
              flexDirection="column"
              alignItems="center" // 子要素を左右中央に
              display="flex"
            >
              {/* 紐 */}
              <Box w="0.5px" h="12px" bg="gray.400" />
              {/* 穴 */}
              <Box
                position="absolute"
                top="12px"
                w="3px"
                h="3px"
                bg="custom.theme.light.850"
                borderRadius="full"
                zIndex="2"
              />
              {/* 短冊本体 */}
              <Box
                w="24px"
                h="78px"
                bg="linear-gradient(to bottom,#87cefa 0%,  #fffacd, #ffcccb)"
                borderRadius="1px"
                boxShadow="md"
                display="flex"
                justifyContent="center"
                alignItems="center"
                fontSize="14px"
                animation="sway 2s ease-in-out infinite alternate"
                transformOrigin="top center"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "upright",
                  animationDelay: `${idx * 0.3}s`,
                }}
                onClick={() => {
                  openModal();
                  setColorMode("dark");
                }}
                cursor="pointer"
                _hover={{ transform: "scale(1.2)" }}
                transition="transform 0.2s ease-in-out"
              >
                <Text fontFamily="kokuryu">{text}</Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <style>
        {`
          @keyframes sway {
            0% { transform: rotate(2deg); }
            100% { transform: rotate(-2deg); }
          }
        `}
      </style>
      <Box opacity="0">
        <ModalButton
          isOpen={isModalOpen}
          onClose={closeModal}
          onOpen={openModal}
          colorMode={colorMode}
          title="源氏蛍"
          bgImage="url('/images/common/tanabata.webp')"
          body={modalBody}
        />
      </Box>
    </>
  );
}
