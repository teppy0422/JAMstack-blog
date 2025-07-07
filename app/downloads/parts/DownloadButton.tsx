import React, { useState } from "react";
import { css, keyframes } from "@emotion/react";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { CustomToast } from "@/components/ui/CustomToast";
import DownloadButton2 from "@/components/ui/DownloadButton2";
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
  return (
    <>
      <Box
        position={isClicked ? "fixed" : "absolute"}
        zIndex={1}
        top={isClicked ? "0" : "0"}
        left={isClicked ? "0" : "0"}
        width={isClicked ? "100vw" : "1.4rem"}
        height={isClicked ? "100vh" : "100%"}
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
        transition="all 1s ease-in-out, clip-path 0.8s ease-in-out"
        // transform={isClicked ? "translateX(-100%)" : "translateX(0)"}
        clipPath={
          isHovered
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(0 0, 0% 0, 0% 100%, 0 100%)"
        }
        _hover={{
          animation:
            isClicked || !userName
              ? "none"
              : `${shake} 0.6s ease-in-out infinite`,
        }}
      >
        <Box
          transform={isClicked ? "rotate(0deg)" : "rotate(270deg)"}
          letterSpacing="0.2em"
          marginLeft="-0.1rem"
          color="white"
          fontFamily="'Archivo Black', 'M PLUS Rounded 1c'"
          fontSize="16px"
          userSelect="none"
        >
          <DownloadButton2
            url={path}
            bg={backGroundColor}
            currentUserName={userName ?? null}
            color="white"
          />
        </Box>
      </Box>
      <Box
        position="absolute"
        zIndex={0}
        top={0}
        left={0}
        bottom={0}
        width="1.4rem"
        opacity={0.5}
        backgroundColor="gray"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        cursor="pointer"
        borderRight="2px dotted"
        borderColor="white"
        borderBottomLeftRadius={borderBottomLeftRadius}
        clipPath="polygon(0 0, 100% 0, 100% 100%, 0 100%)"
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
    </>
  );
};
export default DownloadButton;
