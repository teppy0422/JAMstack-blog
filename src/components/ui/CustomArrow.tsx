import { Box, Text } from "@chakra-ui/react";

export function CustomArrow({ h, text, textTop, textLeft }) {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        position="relative"
      >
        <Text
          position="absolute"
          whiteSpace="nowrap"
          top={textTop}
          left={textLeft}
          fontSize="11px"
        >
          {text}
        </Text>
        <Box h={h} w="1px" bg="custom.system.200" />
        <Box
          w="0"
          h="0"
          borderLeft="6px solid transparent"
          borderRight="6px solid transparent"
          borderTop="10px solid"
          borderTopColor="custom.system.200" // or any color
          mx="auto"
        />
      </Box>
    </>
  );
}

export default CustomArrow;
