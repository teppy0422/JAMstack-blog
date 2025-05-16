import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

interface IpadFrameProps {
  children: ReactNode;
}
const IpadFrame: React.FC<IpadFrameProps> = ({ children }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="transparent"
    >
      <Box
        border="16px solid"
        borderColor="#332"
        borderRadius="36px"
        mx={{ base: 0, md: 10 }}
        boxShadow="0 0 2px rgba(0, 0, 0, 0.5)"
        overflow="hidden"
        position="relative"
        bg="#eee"
      >
        {children}
      </Box>
    </Box>
  );
};

export default IpadFrame;
