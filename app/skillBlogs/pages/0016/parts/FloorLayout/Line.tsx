import { Box } from "@chakra-ui/react";

type RatioLineProps = {
  xRatio: number; // 左端位置の比率（例: 0.1）
  yRatio: number; // 上端位置の比率（例: 0.2）
  lengthRatio: number; // 線の長さの比率（例: 0.3）
  color?: string; // 線の色
  thickness?: number; // 線の太さ（px単位）
  vertical?: boolean; // trueなら縦線、falseなら横線
  stageWidth: number;
  stageHeight: number;
};

export default function RatioLine({
  xRatio,
  yRatio,
  lengthRatio,
  color = "black",
  thickness = 1,
  vertical = false,
  stageWidth,
  stageHeight,
}: RatioLineProps) {
  const x = stageWidth * xRatio;
  const y = stageHeight * yRatio;
  const length = vertical
    ? stageHeight * lengthRatio
    : stageWidth * lengthRatio;

  return (
    <Box
      position="absolute"
      zIndex={0}
      left={`${x}px`}
      top={`${y}px`}
      width={vertical ? `${thickness}px` : `${length}px`}
      height={vertical ? `${length}px` : `${thickness}px`}
      bg={color}
    />
  );
}
