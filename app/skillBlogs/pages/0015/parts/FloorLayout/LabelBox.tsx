import { Box, Text } from "@chakra-ui/react";

type LabelBoxProps = {
  leftRatio: number;
  topRatio: number;
  widthRatio: number;
  heightRatio: number;
  stageWidth: number;
  stageHeight: number;
  label: string;
  bg: string;
  color?: string;
};

export default function LabelBox({
  leftRatio,
  topRatio,
  widthRatio,
  heightRatio,
  stageWidth,
  stageHeight,
  label,
  bg,
  color = "black",
}: LabelBoxProps) {
  const left = `${stageWidth * leftRatio}px`;
  const top = `${stageHeight * topRatio}px`;
  const width = `${stageWidth * widthRatio}px`;
  const height = `${stageHeight * heightRatio}px`;

  return (
    <Box
      position="absolute"
      zIndex={10}
      left={left}
      top={top}
      width={width}
      height={height}
      bg={bg}
      border="1px solid black"
      color={color}
    >
      <Text
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        fontSize="11px"
        fontWeight={600}
        whiteSpace="nowrap"
      >
        {label}
      </Text>
    </Box>
  );
}
