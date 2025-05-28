"use client";

import React, { useEffect, useState } from "react";
import { Box, Text, AccordionIcon } from "@chakra-ui/react";

import { keyframes } from "@emotion/react";
//ローディングとかに使う
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const float = keyframes`
  0% { transform: {translateY(1px) }
  50% { transform: translateY(-1px); }
  100% { transform: translateY(1px); }
`;
const scaleUp = keyframes`
  0% { transform: scale(0); }
  70% { transform: scale(1.3); }
  100% { transform: scale(1); }
`;
interface CustomLoadingProps {
  text: string;
  radius?: number;
  fontSize?: number;
  duration?: number;
  imageUrl?: string;
  imageSize?: number;
  color: string;
}
export const CustomLoading = ({
  text,
  radius = 100,
  fontSize = 16,
  duration = 10,
  imageUrl,
  imageSize = 50,
  color,
}: CustomLoadingProps) => {
  const characters = text.split("");
  const angleStep = 360 / characters.length;

  return (
    <Box
      position="relative"
      width={radius * 0.7}
      height={radius * 0.7}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {imageUrl && (
        <Box
          position="absolute"
          width={`${imageSize}px`}
          zIndex={1}
          animation={`${scaleUp} 0.5s ease-out, ${float} 3s ease-in-out infinite`}
        >
          <img
            src={imageUrl}
            alt="center"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(100%)",
            }}
          />
        </Box>
      )}
      <Box
        position="absolute"
        zIndex={0}
        width="100%"
        height="100%"
        animation={`${rotate} ${duration}s linear infinite`}
        style={{ transformOrigin: "50% 50%" }}
      >
        {characters.map((char, i) => {
          const angle = angleStep * i;
          const radian = (angle - 90) * (Math.PI / 180);
          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);

          return (
            <Box
              key={i}
              fontFamily="Dela Gothic One"
              letterSpacing="4px"
              position="absolute"
              left="50%"
              top="50%"
              transform={`translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`}
              fontSize={`${fontSize}px`}
              fontWeight={800}
              style={{
                transformOrigin: "center",
                WebkitTextStroke: "0.5px #111", // アウトラインを黒にする
              }}
              color={color}
            >
              {char}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
