import React from "react";
import { Box } from "@chakra-ui/react";

const CustomSwitchButton = ({ onClick, isRight }) => {
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
          top="2px"
          mx="2px"
          bg="custom.theme.light.400"
          border="1px solid"
          borderColor="custom.theme.light.800"
          h="1rem"
          w="1rem"
          borderRadius="full"
          // 位置を切り替える
          transform={isRight ? "translateX(85%)" : "translateX(0)"}
          transition="transform 0.2s ease" // アニメーションを追加
        ></Box>
      </Box>
    </Box>
  );
};

export default CustomSwitchButton;
