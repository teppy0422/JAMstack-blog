"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Text } from "@chakra-ui/react";
import { storybooks } from "../../storybooks";
import { PictureBookPage } from "../../parts/PictureBookPage";

export default function BookPage() {
  const params = useParams() as { id?: string | string[] };
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const book = storybooks.find((b) => b.id === id);

  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!book) return <Text>このえほんは みつかりませんでした。</Text>;

  const page = book.pages[currentPage];

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (currentPage < book.pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      router.push("/storybook");
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;

    const threshold = 50; // スワイプ検出の閾値(px)

    if (diff > threshold) {
      handlePrev(); // 右にスワイプ → 前のページ
    } else if (diff < -threshold) {
      handleNext(); // 左にスワイプ → 次のページ
    }

    touchStartX.current = null;
  };
  const toggleFullScreen = () => {
    const el = document.documentElement;
    const isFullScreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    } else {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else if ((el as any).mozRequestFullScreen) {
        (el as any).mozRequestFullScreen();
      } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
      }
    }
  };
  return (
    <Box
      w="100vw"
      h="100vh"
      bg="pink.50"
      position="relative"
      overflow="hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Box textAlign="center" mb={6}>
        <Button colorScheme="teal" onClick={toggleFullScreen}>
          画面を最大化する
        </Button>
      </Box>
      <PictureBookPage
        imageSrc={page.image}
        text={page.text}
        soundSrc={page.sound}
      />

      <Button
        position="absolute"
        bottom="4"
        left="4"
        onClick={handlePrev}
        isDisabled={currentPage === 0}
      >
        ←
      </Button>
      <Button position="absolute" bottom="4" right="4" onClick={handleNext}>
        →
      </Button>
    </Box>
  );
}
