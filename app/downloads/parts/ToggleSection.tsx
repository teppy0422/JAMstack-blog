"use client";

import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

interface ToggleSectionProps {
  id: number;
  isShown: boolean;
  toggleShowAll: (id: number) => void;
  children: ReactNode;
}
export const ToggleSection = ({
  id,
  isShown,
  toggleShowAll,
  children,
}: ToggleSectionProps) => {
  return (
    <>
      <Box position="relative" h="40px" w="1px" bg="gray.500" ml="50%">
        <Box
          position="absolute"
          top={isShown ? "50%" : "70%"}
          left="50%"
          transform="translate(-50%, -50%)"
          py={0.5}
          px={2}
          textAlign="center"
          m="auto"
          border="1px solid"
          borderColor="gray.500"
          bg="#b8b2ad"
          fontWeight={600}
          color="white"
          borderRadius="md"
          cursor="pointer"
          fontSize="xs"
          whiteSpace="nowrap"
          transition="all 0.3s ease"
          _hover={{
            bg: "#a69d96",
            color: "white",
            borderColor: "gray.600",
          }}
          onClick={() => toggleShowAll(id)}
        >
          {isShown ? "閉じる" : "関連を表示"}
        </Box>
      </Box>
      <Box
        border="1px solid"
        borderColor="gray.500"
        borderRadius="md"
        transition="all 0.3s ease"
        maxHeight={isShown ? "1200px" : "0px"}
        opacity={isShown ? 1 : 0}
        p={isShown ? "16px" : "0px"}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(85, 85, 85, 0.1) 0,
            rgba(85, 85, 85, 0.1) 10px,
            transparent 10px,
            transparent 20px
          ),
          repeating-linear-gradient(
            -45deg,
            rgba(85, 85, 85, 0.1) 0,
            rgba(85, 85, 85, 0.1) 10px,
            transparent 10px,
            transparent 20px
          )`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {children}
      </Box>
    </>
  );
};
