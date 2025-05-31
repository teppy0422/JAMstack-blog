// app/storybook/components/PictureBookPage.tsx
"use client";

import { Box, Image, Text, Center } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

const MotionBox = motion(Box);
export type AnimationType = "zoom" | "fadeOut" | "slideLeft" | "zoomOut";

// アニメーションのプリセットを定義
const animationPresets = {
  zoom: {
    initial: { scale: 1, x: 0, opacity: 1 },
    animate: { scale: 1.1, x: 300, opacity: 0 },
    transition: { type: "spring", stiffness: 200 },
  },
  fadeOut: {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    transition: { duration: 2 },
  },
  slideLeft: {
    initial: { x: 0 },
    animate: { x: -300, opacity: 0.1 },
    transition: { type: "tween", duration: 1 },
  },
  zoomOut: {
    initial: { scale: 1 },
    animate: { scale: 0.5, opacity: 0 },
    transition: { type: "spring", stiffness: 300 },
  },
  jump: {
    initial: { y: 0, x: 0, opacity: 1 },
    animate: {
      y: [-60, 0, 0, 0], // ジャンプは最初だけ
      x: [0, 30, -1000, 1000], // 右→左→右に戻る
      opacity: [1, 1, 0, 0], // 途中で薄くなる → 戻って復活
    },
    transition: {
      duration: 1,
      times: [0, 0.3, 0.9, 1], // 0%→10%→60%→100% のタイミング
      ease: "easeInOut",
    },
  },
} as const;

export const PictureBookPage = ({
  imageSrc,
  text,
  soundSrc,
  animationType = "zoom",
}: {
  imageSrc: string;
  text: string;
  soundSrc?: string;
  animationType?: string;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (soundSrc) {
      const audio = new Audio(soundSrc);
      audio.play();
    }
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const selectedAnimation =
    animationPresets[animationType] || animationPresets.zoom;
  const isVideo = useMemo(() => {
    return imageSrc.endsWith(".webm") || imageSrc.endsWith(".mp4");
  }, [imageSrc]);
  return (
    <>
      <Center w="100%" h="100%" flexDirection="column">
        <MotionBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          onClick={handleClick}
          animate={
            isAnimating ? selectedAnimation.animate : selectedAnimation.initial
          }
          transition={selectedAnimation.transition}
        >
          {isVideo ? (
            <Box
              as="video"
              src={imageSrc}
              autoPlay
              loop
              muted
              playsInline
              maxH="80vh"
            />
          ) : (
            <Image src={imageSrc} alt={text} maxH="80vh" />
          )}
        </MotionBox>
        <Text fontSize="3xl" mt={4}>
          {text}
        </Text>
      </Center>
    </>
  );
};
