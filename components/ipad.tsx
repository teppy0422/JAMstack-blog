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
    >
      <Box
        border="16px solid"
        borderColor="#333"
        borderRadius="36px"
        mx={10}
        boxShadow="0 0 20px rgba(0, 0, 0, 0.5)"
        overflow="hidden"
        position="relative"
      >
        {children}
      </Box>
    </Box>
  );
};

export default IpadFrame;
