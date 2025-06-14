import { Box, Flex, Text } from "@chakra-ui/react";

export function SectionHeader({ title, children }) {
  return (
    <>
      <Box
        borderRadius="md"
        py={2}
        px={4}
        border="0.5px solid #4c4b49"
        color="#ccc"
      >
        <Text fontWeight="bold" fontSize="12px">
          {title}
        </Text>
        <Box h="1px" w="100%" bg="#4c4b49" my={2} />
        <Flex
          direction="column"
          alignItems="center"
          width="100%"
          gap={6}
          py={2}
          textAlign="center"
          fontSize="13px"
        >
          {children}
        </Flex>
      </Box>
    </>
  );
}
