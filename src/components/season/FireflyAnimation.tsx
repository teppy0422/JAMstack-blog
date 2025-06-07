import { useEffect, useRef, useState } from "react";
import { Box, List, ListItem, Modal, useColorMode } from "@chakra-ui/react";
import ModalButton from "./ModalButton";

const FIREFLY_COUNT = 20;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type Firefly = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaDir: number;
  speed: number;
  angle: number;
  color: string;
  waitFrames: number;
};

function createFirefly(width: number, height: number): Firefly {
  return {
    x: random(0, width),
    y: random(0, height),
    size: random(1, 3),
    alpha: random(0.5, 1),
    alphaDir: random(0.005, 0.015) * (Math.random() > 0.5 ? 1 : -1),
    speed: random(0.2, 0.7),
    angle: random(0, Math.PI * 2),
    color: `rgba(255,255,180,1)`,
    waitFrames: 0,
  };
}

export default function FireflyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const { colorMode } = useColorMode();

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
        源氏蛍
      </Box>
      <Box
        mb={2}
        fontSize="10px"
        borderRadius="5px"
        display="inline-block"
        width="auto"
      >
        ゲンジボタル
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
        日本で最も有名なホタル。幻想的に光るその姿は、古くから和歌や文学にも登場し、日本文化に深く根付いています。
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
          <ListItem>{`観察時期: 5月中旬〜6月上旬ごろ`}</ListItem>
          <ListItem>{`全長: 15-20mm`}</ListItem>
          <ListItem>{`幼虫の生息場所: 清流の水中`}</ListItem>
          <ListItem>{`発光色: 黄緑色`}</ListItem>
          <ListItem>{`名前の由来: 源氏蛍は、平家蛍（ヘイケボタル）と対になり、源平合戦になぞらえて名付けられたとされています。`}</ListItem>
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

    let fireflies: Firefly[] = [];
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      fireflies.push(createFirefly(width, height));
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let f of fireflies) {
        // 軌跡をランダムに
        f.angle += random(-0.1, 0.1);
        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle) * f.speed;

        // 画面外に出たら戻す
        if (f.x < 0 || f.x > width || f.y < 0 || f.y > height) {
          Object.assign(f, createFirefly(width, height));
        }

        // 点滅
        f.alpha += f.alphaDir;
        if (f.alpha > 1) {
          f.alpha = 1;
          f.alphaDir *= -1;
        }
        if (f.alpha < 0) {
          f.alpha = 0;
          f.alphaDir *= -1;
        }

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,255,100,${f.alpha})`;
        ctx.shadowColor = "#ffffa0";
        ctx.shadowBlur = 20 * f.alpha;
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }
    animate();

    // リサイズ対応
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
      <canvas
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "block",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none", // ← これを追加
        }}
      />
      <ModalButton
        isOpen={isModalOpen}
        onClose={closeModal}
        onOpen={openModal}
        colorMode={colorMode}
        title="源氏蛍"
        bgImage="url('/images/common/firefly.webp')"
        body={modalBody}
      />
    </>
  );
}
