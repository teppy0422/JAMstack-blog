import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface CustomBoxProps {
  children: React.ReactNode;
  colorMode: "light" | "dark";
}

const OptionalBox: React.FC<CustomBoxProps> = ({ children, colorMode }) => (
  <Box
    border="1px solid"
    position="relative"
    p={2}
    pt={4}
    mt={4}
    borderRadius={2}
    fontSize={14}
  >
    <Text
      position="absolute"
      top="-10px"
      left="6px"
      bg={colorMode === "light" ? "#f5ede6" : "#676a73"}
      px={1}
      fontSize={13}
    >
      Optional
    </Text>
    {children}
  </Box>
);

export default OptionalBox;
