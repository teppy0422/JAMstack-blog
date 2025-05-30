// app/storybook/components/PictureBookPage.tsx
"use client";

import { Box, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionBox = motion(Box);

export const PictureBookPage = ({
  imageSrc,
  text,
  soundSrc,
}: {
  imageSrc: string;
  text: string;
  soundSrc?: string;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (soundSrc) {
      const audio = new Audio(soundSrc);
      audio.play();
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <MotionBox
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      onClick={handleClick}
      animate={isAnimating ? { scale: 1.1 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Image src={imageSrc} alt={text} maxH="60%" />
      <Text fontSize="3xl" mt={4}>
        {text}
      </Text>
    </MotionBox>
  );
};
