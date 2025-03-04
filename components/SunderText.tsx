import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

interface SunderTextProps {
  colorMode: "light" | "dark";
  text: String;
}

const SunderText: React.FC<SunderTextProps> = ({ colorMode, text }) => {
  // dededede文字
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
        fontSize="84px"
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
        fontSize="84px"
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
        fontSize="84px"
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

export default SunderText;
