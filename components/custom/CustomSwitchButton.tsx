import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import { IoMoonOutline } from "react-icons/io5";
import { FaCloud, FaMoon, FaSun } from "react-icons/fa";

export const CustomSwitchButton = ({ onClick, isRight }) => {
  return (
    <Box onClick={onClick} cursor="pointer">
      <Box
        position="relative"
        bg="white"
        h="1.3rem"
        w="2.2rem"
        borderRadius="full"
        border="1px solid"
        borderColor="custom.theme.light.800"
      >
        <Box
          position="absolute"
          m="2px"
          bg="custom.theme.light.400"
          border="1px solid"
          borderColor="custom.theme.light.900"
          h="1rem"
          w="1rem"
          borderRadius="full"
          // 位置を切り替える
          transform={isRight ? "translateX(85%)" : "translateX(0)"}
          transition="transform 0.2s ease" // アニメーションを追加
        />
      </Box>
    </Box>
  );
};
export const CustomSwitchColorModeButton = ({}) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box cursor="pointer">
      <Box
        position="relative"
        bg={colorMode === "light" ? "white" : "white"}
        h="1.3rem"
        w="2.2rem"
        borderRadius="full"
        border="1px solid"
        borderColor="custom.theme.light.800"
        onClick={toggleColorMode}
      >
        <Box
          position="absolute"
          m="2px"
          bg={
            colorMode === "light"
              ? "custom.theme.light.500"
              : "custom.theme.dark.500"
          }
          border="1px solid"
          borderColor="custom.theme.light.900"
          h="1rem"
          w="1rem"
          borderRadius="full"
          transform={
            colorMode === "light" ? "translateX(0)" : "translateX(85%)"
          }
          transition="transform 0.2s ease !important"
        />
        <Box
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
          left={colorMode === "light" ? "auto" : "1.5px"}
          right={colorMode === "light" ? "1.5px" : "auto"}
        >
          {colorMode === "light" ? (
            <FaMoon size="12px" color="purple" />
          ) : (
            <FaSun size="13px" color="#ffa500" />
          )}
        </Box>
      </Box>
    </Box>
  );
};
