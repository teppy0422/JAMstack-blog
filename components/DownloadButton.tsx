import React, { useState } from "react";
import { css, keyframes } from "@emotion/react";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCustomToast } from "../components/customToast";
import "@/styles/globals.css";
const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-0.5px); }
  50% { transform: translateX(-1); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;
interface DownloadButtonProps {
  path: string;
  isHovered: boolean;
  backGroundColor: string;
  userName?: string | null;
  borderBottomLeftRadius?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  path,
  isHovered,
  backGroundColor,
  userName,
  borderBottomLeftRadius,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();
  const showToast = useCustomToast();
  return (
    <>
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        width="1.4rem"
        opacity={0.8}
        backgroundColor={backGroundColor}
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        cursor="pointer"
        borderRight="2px dotted"
        borderColor="white"
        borderBottomLeftRadius={borderBottomLeftRadius}
        transition="transform 1s ease, clip-path 1s ease"
        transform={isClicked ? "translateX(-100%)" : "translateX(0)"}
        clipPath={
          isHovered
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 0% 0, 0% 100%, 0 100%)"
        }
        onClick={() => {
          if (!userName) {
            showToast(
              "ダウンロード出来ません",
              "ダウンロードするにはログインと開発による認証が必要です",
              "error"
            );
          } else {
            setIsClicked(true);
            setTimeout(() => {
              router.push(path);
            }, 500);
          }
        }}
        _hover={{
          animation:
            isClicked || !userName
              ? "none"
              : `${shake} 0.6s ease-in-out infinite`,
        }}
      >
        <Text
          transform="rotate(270deg)"
          letterSpacing="0.2em"
          marginLeft="-0.1rem"
          color="white"
          fontFamily="'Archivo Black', 'M PLUS Rounded 1c'"
          fontSize="16px"
          userSelect="none"
        >
          DOWNLOAD
        </Text>
      </Box>
      <Box
        position="absolute"
        zIndex={-1}
        top={0}
        left={0}
        bottom={0}
        width="1.4rem"
        backgroundColor="transparent"
        borderRight="2px dotted"
        borderColor="gray.500"
      />
    </>
  );
};
export default DownloadButton;
