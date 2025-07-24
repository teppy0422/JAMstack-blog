import { Box, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import LabelBox from "./LabelBox";
import RatioLine from "./Line";

export default function FloorPlanBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(500);
  const stageHeight = stageWidth * 1.1;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const getX = (ratio: number) => `${stageWidth * ratio}px`;
  const getY = (ratio: number) => `${stageHeight * ratio}px`;

  const newAdd = "#F89173";
  return (
    //   <Box
    //     ref={containerRef}
    //     width="100%"
    //     mt="20px"
    //     position="relative"
    //     height={`${stageHeight}px`}
    //     bg="gray.50"
    //     backgroundImage={`
    //   repeating-linear-gradient(
    //     to right,
    //     rgba(0, 0, 0, 0.1) 0px,
    //     rgba(0, 0, 0, 0.1) 1px,
    //     transparent 1px,
    //     transparent 20px
    //   ),
    //   repeating-linear-gradient(
    //     to bottom,
    //     rgba(0, 0, 0, 0.1) 0px,
    //     rgba(0, 0, 0, 0.1) 1px,
    //     transparent 1px,
    //     transparent 20px
    //   )
    // `}
    //     backgroundSize="20px 20px"
    //   >
    <>
      <Box my={2} fontSize="14px">
        <Box display="flex" alignItems="center" mr={3} gap={1}>
          <Box bg="red" w="1em" h="1em" />
          <Text>新規設備</Text>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box bg="red" w="1em" h="0.15em" />
          <Text>新規接続(Wifiが動作安定しない場合は有線)</Text>
        </Box>
      </Box>
      <Box
        ref={containerRef}
        width="100%"
        position="relative"
        height={`${stageHeight}px`}
        bg="gray.50"
        backgroundImage="url('/images/temp/ueda.png')" // ← 画像パスに置き換えてください
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="contain" // ← アスペクト比を維持して全体に収める
      >
        <RatioLine
          xRatio={0.21}
          yRatio={0.2}
          lengthRatio={0.145}
          color="red"
          thickness={2}
          stageWidth={stageWidth}
          stageHeight={stageHeight}
          vertical
        />
        <RatioLine
          xRatio={0.21}
          yRatio={0.345}
          lengthRatio={0.088}
          color="red"
          thickness={2}
          stageWidth={stageWidth}
          stageHeight={stageHeight}
        />
        <LabelBox
          leftRatio={0.18}
          topRatio={0.2}
          widthRatio={0.06}
          heightRatio={0.032}
          stageWidth={stageWidth}
          stageHeight={stageHeight}
          label="PC"
          bg="#ccc"
        />
        <LabelBox
          leftRatio={0.18}
          topRatio={0.33}
          widthRatio={0.06}
          heightRatio={0.032}
          stageWidth={stageWidth}
          stageHeight={stageHeight}
          label="Nas"
          bg="red"
          color="white"
        />
        <LabelBox
          leftRatio={0.2435}
          topRatio={0.33}
          widthRatio={0.05}
          heightRatio={0.032}
          stageWidth={stageWidth}
          stageHeight={stageHeight}
          label="Wifi"
          bg="red"
          color="white"
        />
        <LabelBox
          leftRatio={0.175}
          topRatio={0.1}
          widthRatio={0.07}
          heightRatio={0.032}
          stageWidth={stageWidth}
          stageHeight={stageHeight}
          label="プリンタ"
          bg="#ccc"
        />
      </Box>
    </>
  );
}
