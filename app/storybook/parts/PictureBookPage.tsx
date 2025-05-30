// app/storybook/components/PictureBookPage.tsx
"use client";

import { Box, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionBox = motion(Box);
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
    animate: { x: -300, opacity: 0 },
    transition: { type: "tween", duration: 1 },
  },
  zoomOut: {
    initial: { scale: 1 },
    animate: { scale: 0.5, opacity: 0 },
    transition: { type: "spring", stiffness: 300 },
  },
};
export const PictureBookPage = ({
  imageSrc,
  text,
  soundSrc,
  animationType = "zoom",
}: {
  imageSrc: string;
  text: string;
  soundSrc?: string;
  animationType?: keyof typeof animationPresets; // アニメーションタイプを指定
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (soundSrc) {
      const audio = new Audio(soundSrc);
      audio.play();
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3000);
  };
  const selectedAnimation =
    animationPresets[animationType] || animationPresets.zoom;

  return (
    <MotionBox
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      onClick={handleClick}
      animate={
        isAnimating ? selectedAnimation.animate : selectedAnimation.initial
      } // アニメーション状態
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Image src={imageSrc} alt={text} maxH="60%" />
      <Text fontSize="3xl" mt={4}>
        {text}
      </Text>
    </MotionBox>
  );
};
