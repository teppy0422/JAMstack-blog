import React, { ReactNode } from "react";
import { Box, useColorMode } from "@chakra-ui/react";

interface IpadFrameProps {
  children: ReactNode;
}
const IpadFrame: React.FC<IpadFrameProps> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      display="flex" // 子要素を中央揃え
      alignItems="center"
      justifyContent="center"
      bg="transparent"
      width="auto" // 画面いっぱいに広げる
      height="auto" // 画面いっぱいに広げる
    >
      <Box
        className="ipad-frame"
        display="inline-block" // 子要素のサイズにフィット
        border="18px solid"
        borderColor={colorMode === "light" ? "#332" : "#bbb"}
        borderRadius="36px"
        mx={{ base: 0, md: 0 }}
        boxShadow="1px 1px 3px rgba(0, 0, 0, 0.7)"
        overflow="hidden"
        position="relative"
        bg={colorMode === "light" ? "#eee" : "#333"}
        h={{ base: "700px", sm: "700px", md: "600px", lg: "800px" }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default IpadFrame;
