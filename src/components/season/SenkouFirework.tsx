"use client";
import { useEffect, useRef, useState } from "react";
import { useColorMode, Box, List, ListItem } from "@chakra-ui/react";
import ModalButton from "./ModalButton";

export default function SenkouFireworkWithBody() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number>();
  const [showBox, setShowBox] = useState(false);
  const showBoxRef = useRef(false); // ← useRefで状態管理
  const boxYRef = useRef<number>(0);
  const boxXRef = useRef<number>(0);
  const { setColorMode } = useColorMode();

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
        花火大会
      </Box>
      <Box
        mb={2}
        fontSize="10px"
        borderRadius="5px"
        display="inline-block"
        width="auto"
      >
        はなびたいかい
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
        江戸時代から続く「夜空の一発芸大会」。打ち上げ花火の豪快さと、人混みと交通規制が共演する一大イベント。早く行けば炎天下で待たされ、遅く行けば人の壁で何も見えない。
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
          <ListItem>{`開催日: 7月〜8月の週末、各地で渋滞と混雑の祭典`}</ListItem>
          <ListItem>{`観客: 町の人口より多い。どこから来たのか誰も知らない`}</ListItem>
          <ListItem>{`雨天: 中止。晴れでも風で中止。開催されても中止みたいな気持ち`}</ListItem>
          <ListItem>{`帰り道: カエルの声がSE`}</ListItem>
        </List>
      </Box>
    </Box>
  );
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let baseX = canvas.width - 120;
    let baseY = 42;
    let flameSize = 2;
    let isFalling = false;
    let fallY = 0;
    let frame = 0;

    // sakura要素の位置取得
    let sakuraTop = 0;
    const sakuraElement = document.querySelector('[data-roof-id="sakura"]');
    if (sakuraElement) {
      const rect = sakuraElement.getBoundingClientRect();
      sakuraTop = rect.top;
    }

    function drawRod(ctx: CanvasRenderingContext2D, x: number, y: number) {
      const rodHeight = 24;
      const rodWidth = 2;

      const gradient = ctx.createLinearGradient(x, y, x, y + rodHeight);
      gradient.addColorStop(0.0, "#87cefa");
      gradient.addColorStop(0.5, "#fffacd");
      gradient.addColorStop(1.0, "#ffcccb");

      ctx.fillStyle = gradient;
      ctx.fillRect(x - rodWidth / 2, y, rodWidth, rodHeight);
    }

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const angle = Math.sin(frame / 30) * 0.1;
      const rodX = baseX + Math.sin(angle) * 2;

      if (!showBoxRef.current) {
        drawRod(ctx, rodX, baseY);

        let flameX = rodX;
        let flameY = baseY + 24;

        if (!isFalling) {
          flameSize += 0.08;
          if (flameSize >= 10) {
            isFalling = true;
          }
        } else {
          fallY += 5; // 速度5倍
          flameY += fallY;

          // 落下判定 & Box表示
          if (fallY >= sakuraTop - baseY && !showBoxRef.current) {
            setShowBox(true);
            showBoxRef.current = true; // 最新状態を更新
            boxYRef.current = sakuraTop - 50;
            boxXRef.current = rodX;
          }
        }

        const gradient = ctx.createRadialGradient(
          flameX,
          flameY,
          1,
          flameX + Math.random() * 2 - 1,
          flameY + Math.random() * 2 - 1,
          flameSize
        );
        gradient.addColorStop(0, "rgba(255,255,100,1)");
        gradient.addColorStop(1, "rgba(255,50,50,0.3)");

        ctx.beginPath();
        ctx.ellipse(
          flameX,
          flameY,
          flameSize * (0.8 + Math.random() * 0.4),
          flameSize * (0.8 + Math.random() * 0.4),
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId.current!);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 10,
          background: "transparent",
        }}
      />
      {showBox && (
        <>
          <Box
            onClick={() => {
              openModal();
              setColorMode("dark");
            }}
            style={{
              position: "fixed",
              top: `${boxYRef.current + 22}px`,
              left: `${boxXRef.current}px`,
              transform: "translate(-50%, 0)",
              transformOrigin: "top center",
              background:
                "linear-gradient(to right,#87cefa 0%,  #fffacd, #ffcccb)",
              padding: "3px 6px",
              borderRadius: "6px",
              cursor: "pointer",
              zIndex: 30,
              pointerEvents: "auto",
              fontSize: "11px",
              height: "auto",
              overflow: "hidden",
              animation: "growBox 0.5s ease-out forwards",
            }}
            color="custom.theme.light.900"
          >
            花火大会
          </Box>
          <ModalButton
            isOpen={isModalOpen}
            onClose={closeModal}
            onOpen={openModal}
            colorMode="dark"
            title="源氏蛍"
            bgImage="url('/images/common/hanabi.webp')"
            body={modalBody}
          />
        </>
      )}
    </>
  );
}
