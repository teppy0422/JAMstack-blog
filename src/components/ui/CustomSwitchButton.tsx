import React from "react";
import { Box, useColorMode, Text } from "@chakra-ui/react";
import { IoMoonOutline } from "react-icons/io5";
import { FaCloud, FaMoon, FaSun } from "react-icons/fa";

const labels = ["居酒屋", "バー", "カフェ", "料亭"];

export const CustomSwitchMultiButton = ({ onClick, mode }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      bg={
        colorMode === "light"
          ? "custom.theme.light.100"
          : "custom.theme.dark.100"
      }
      h="1.2rem"
      w="10rem"
      borderRadius="2px"
      border="1px solid"
      borderColor="custom.theme.light.800"
      overflow="hidden"
      boxShadow="sm"
    >
      {labels.map((label, idx) => (
        <React.Fragment key={label}>
          <Box
            flex="1"
            textAlign="center"
            cursor="pointer"
            py={0}
            zIndex={2}
            color={mode === idx ? "white" : "custom.theme.light.900"}
            fontWeight="600"
            fontSize="xs"
            onClick={() => onClick(idx)}
            position="relative"
            transition="color 0.2s"
          >
            {label}
          </Box>
          {/* 区切り線（最後以外） */}
          {idx < labels.length - 1 && (
            <Box
              w="0.5px"
              h="60%"
              bg={
                colorMode === "light"
                  ? "custom.theme.light.800"
                  : "custom.theme.dark.400"
              }
              alignSelf="center"
              zIndex={0}
            />
          )}
        </React.Fragment>
      ))}
      {/* インジケーターバー */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        height="100%"
        width={`${100 / labels.length}%`}
        bg={
          colorMode === "light"
            ? "custom.theme.light.850"
            : "custom.theme.dark.400"
        }
        borderRadius="2px"
        transform={`translateX(${mode * 100}%)`}
        transition="transform 0.3s cubic-bezier(.4,1.2,.6,1)"
        zIndex={1}
      />
    </Box>
  );
};

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
    <Box cursor="pointer" _hover={{ transform: "scale(1.1)" }}>
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
