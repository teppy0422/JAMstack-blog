"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
const MotionBox = motion(Box);
type Direction = "left" | "right" | "bottom" | "top";

interface AnimatedListItemProps {
  children: React.ReactNode;
  direction?: Direction; // 省略時は left
}

const AnimatedListItem = ({
  children,
  direction = "left",
}: AnimatedListItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = document.getElementById("modal-scroll-body");

    const checkVisibility = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;

      if (rect.top >= 0 && rect.top <= vh * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false); // 画面外なら非表示に戻す場合（毎回アニメーション）
      }
    };

    scrollContainer?.addEventListener("scroll", checkVisibility);
    checkVisibility();

    return () => {
      scrollContainer?.removeEventListener("scroll", checkVisibility);
    };
  }, []);

  // directionに応じて初期位置を切り替え
  let initialPosition;
  switch (direction) {
    case "right":
      initialPosition = { opacity: 0, x: 300 };
      break;
    case "bottom":
      initialPosition = { opacity: 0, y: 30 };
      break;
    case "top":
      initialPosition = { opacity: 0, x: 10000, y: -100 };
      break;
    case "left":
    default:
      initialPosition = { opacity: 0, x: -300 };
      break;
  }

  return (
    <MotionBox
      ref={ref}
      style={{ marginLeft: "auto", width: "fit-content" }}
      initial={initialPosition}
      animate={isVisible ? { opacity: 1, x: 0, y: 0 } : initialPosition}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </MotionBox>
  );
};

export default AnimatedListItem;
