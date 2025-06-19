import React, { useState, useEffect } from "react";
import {
  Box,
  PlacementWithLogical,
  Tooltip,
  Avatar,
  SkeletonCircle,
  useColorMode,
} from "@chakra-ui/react";

interface AnimationAvatarProps {
  src: string | undefined | null;
  boxSize?: string;
  mt?: number;
  mr?: number;
}
export const CustomAvatar: React.FC<AnimationAvatarProps> = ({
  boxSize = "sm",
  src,
  mr = 0,
  mt = 0,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState<boolean>(true); // 画像の読み込み状態を管理

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoading(false);
      };
      img.onerror = () => {
        setIsLoading(false);
      };
    }
  }, [src]);
  return (
    <>
      {src ? (
        isLoading ? (
          <SkeletonCircle boxSize={boxSize} mt={mt} mr={mr} />
        ) : (
          <Avatar
            src={src}
            boxSize={boxSize}
            mt={mt}
            mr={mr}
            bg={colorMode === "light" ? "#bfb1a4" : "#888"}
          />
        )
      ) : (
        <Avatar
          boxSize={boxSize}
          mt={mt}
          mr={mr}
          bg={colorMode === "light" ? "#bfb1a4" : "#888"}
        />
      )}
    </>
  );
};
