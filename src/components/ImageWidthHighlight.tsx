// components/ImageWithHighlight.tsx
import { Box, Center, Image, BoxProps } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { TbBorderRadius } from "react-icons/tb";

interface Highlight {
  top: string;
  left: string;
  w: string;
  h: string;
  animation?: string;
  border?: string;
  borderRadius?: string;
  label?: string;
  labelTop?: string;
  labelLeft?: string;
  bg?: string;
}
interface ImageWithHighlightProps extends BoxProps {
  src: string;
  srcWidth?: string;
  srcHeight?: string;
  label: string;
  mt?: number;
  mb?: number;
  highlights?: Highlight[];
}
export const ImageWithHighlight = ({
  src,
  srcWidth,
  label,
  highlights,
  mt = 2,
  mb = 6,
  ...props
}: ImageWithHighlightProps) => {
  // 🔴 点滅アニメーションを定義
  const blink = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  `;
  const blinkAnimation = `${blink} 0.8s infinite`;

  return (
    <Center w="100%" mt={mt} mb={mb} flexDirection="column">
      <Box position="relative" {...props}>
        <Image src={src} {...(srcWidth ? { w: srcWidth } : {})} />

        {highlights &&
          highlights.map((h, index) => (
            <Box
              key={index}
              position="absolute"
              top={h.top}
              left={h.left}
              w={h.w}
              h={h.h}
              bg={h.bg || "transparent"}
              borderRadius={h.borderRadius || "10px"}
              border={h.border || "2px solid red"}
              animation={h.animation === "blink" ? blinkAnimation : h.animation}
            >
              {h.label && (
                <Box
                  position="absolute"
                  top={h.labelTop || "-28%"}
                  left={h.labelLeft || "50%"}
                  transform="translate(-50%, -50%)"
                  color="red"
                  fontSize="xs"
                  whiteSpace="nowrap"
                >
                  {h.label}
                </Box>
              )}
            </Box>
          ))}
      </Box>
      <Box fontSize="xs" whiteSpace="nowrap">
        {label}
      </Box>
    </Center>
  );
};

export default ImageWithHighlight;
