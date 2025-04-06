"use client";

import React, { useEffect, useState } from "react";
import { Box, Text, AccordionIcon } from "@chakra-ui/react";

import { keyframes } from "@emotion/react";

interface CustomAccordionIconProps {
  isExpanded: boolean;
  color_?: string;
}
export const CustomAccordionIcon: React.FC<CustomAccordionIconProps> = ({
  isExpanded,
  color_,
}) => {
  return (
    <>
      <AccordionIcon
        transform={isExpanded ? "rotate(0deg)" : "rotate(-90deg)"}
        transition="transform 0.2s"
        boxSize={4}
        color={color_}
      />
    </>
  );
};

interface ScrollTextProps {
  colorMode: "light" | "dark";
  text: String;
}
export const ScrollText: React.FC<ScrollTextProps> = ({ colorMode, text }) => {
  return (
    <>
      <Box
        as="span"
        display="inline-block"
        whiteSpace="nowrap"
        animation="scrollText 30s linear infinite"
        style={{
          // WebkitTextStroke: "0.5px #e5f22c", // アウトラインを黒にする
          letterSpacing: "1px",
        }}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index}>{text}</span>
        ))}
      </Box>
      <style jsx>{`
        @keyframes scrollText {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
};

// dededede文字
interface SunderTextProps {
  colorMode: "light" | "dark";
  text: string;
  fontSize?: string;
}
export const SunderText: React.FC<SunderTextProps> = ({
  colorMode,
  text,
  fontSize = "84px",
}) => {
  const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: "translate(0, 0)",
  });
  const [animationStyle2, setAnimationStyle2] = useState<React.CSSProperties>({
    opacity: 0,
    transform: "translate(0, 0)",
  });
  useEffect(() => {
    const colors = ["#82d9d0", "#FF5833", "#ffef42"];
    const animateText = () => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      setAnimationStyle((prevStyle) => ({
        ...prevStyle,
        opacity: 0,
        color: randomColor,
        transform: "translate(0px, 0px)",
        transition: "transform 0s",
      }));
      setTimeout(() => {
        setAnimationStyle({
          color: randomColor,
          transform: "translate(-2px, 3px)",
          transition: "transform 0.01s",
          opacity: 1,
        });
      }, 4860); // 81% of 6000ms
      setTimeout(() => {
        setAnimationStyle({
          color: randomColor,
          transform: "translate(3px, -2px)",
          transition: "transform 0.02s",
          opacity: 1,
        });
      }, 4980); // 83% of 6000ms
      setTimeout(() => {
        setAnimationStyle({
          color: randomColor,
          transform: "translate(-3px, 2px)",
          transition: "transform 0.02s",
          opacity: 1,
        });
      }, 5100); // 85% of 6000ms
      setTimeout(() => {
        setAnimationStyle({
          color: randomColor,
          transform: "translate(4px, -3px)",
          transition: "transform 0.02s",
          opacity: 1,
        });
      }, 5220); // 87% of 6000ms
      setTimeout(() => {
        setAnimationStyle({
          color: randomColor,
          transform: "translate(0px, 0px)",
          transition: "transform 0.03s",
          opacity: 0,
        });
      }, 5400); // 90% of 6000ms
      setTimeout(() => {
        setAnimationStyle({
          color: randomColor,
          transform: "translate(2px, -4px)",
          transition: "transform 0.02s",
          opacity: 1,
        });
      }, 5760); // 96% of 6000ms
      setTimeout(() => {
        setAnimationStyle({
          color: randomColor,
          transform: "translate(0px, 0px)",
          transition: "transform 0.02s",
          opacity: 1,
        });
      }, 5820); // 97% of 6000ms
      setTimeout(() => {
        setAnimationStyle({
          color: randomColor,
          transform: "translate(0px, 0px)",
          transition: "transform 0.01s",
          opacity: 0,
        });
      }, 5880); // 98% of 6000ms

      setAnimationStyle2({
        opacity: 0,
        transform: "translate(0px, 0px)",
        transition: "transform 0s",
      });
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(-3px, -2px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 2040); // 34% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(4px, 3px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 2160); // 36% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(-1px, -2px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 2280); // 38% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(0px, 0px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 2400); // 40% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(0px, 0px)",
          transition: "transform 0.01s",
          opacity: 0.4,
        });
      }, 2460); // 41% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(-3px, -3px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 3900); // 65% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(4px, 2px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 4020); // 67% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(-3px, -1px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 4140); // 69% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(1px, -3px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 4200); // 70% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(2px, 3px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 4260); // 71% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(0px, 0px)",
          transition: "transform 0.02s",
          opacity: 0.4,
        });
      }, 4320); // 72% of 6000ms
      setTimeout(() => {
        setAnimationStyle2({
          transform: "translate(0px, 0px)",
          transition: "transform 0.01s",
          opacity: 0,
        });
      }, 4380); // 73% of 6000ms
    };
    const startAnimation = () => {
      animateText();
      setTimeout(startAnimation, 7000); // 7秒ごとにアニメーションを繰り返す
    };
    startAnimation();
  }, []); // 依存配列を空にすることで、初回マウント時にのみ実行

  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <Text
        fontFamily="Dela Gothic One"
        fontWeight="400"
        fontSize={fontSize}
        color="white"
        position="relative"
        zIndex={2}
        top="0"
        left="0"
        style={{
          WebkitTextStroke: "1px #000", // アウトラインを黒にする
        }}
      >
        {text}
      </Text>
      <Text
        fontFamily="Dela Gothic One"
        fontWeight="400"
        fontSize={fontSize}
        color={colorMode === "light" ? "#F00" : "#000"}
        position="absolute"
        zIndex={1}
        style={animationStyle}
      >
        {text}
      </Text>
      <Text
        fontFamily="Dela Gothic One"
        fontWeight="400"
        fontSize={fontSize}
        color={colorMode === "light" ? "#FFF" : "#000"}
        position="absolute"
        zIndex={3}
        style={animationStyle2}
      >
        {text}
      </Text>
    </Box>
  );
};

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
          // borderRadius="50%"
          // overflow="hidden"
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
              // boxShadow="0 0 4px #000"
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
