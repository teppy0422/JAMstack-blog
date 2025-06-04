import { ReactNode } from "react";
import { Box, CardHeader, Flex, Heading, Spacer } from "@chakra-ui/react";

type Props = {
  text: string;
  textSize?: string;
  link?: ReactNode;
};

export default function CustomCardHeader({
  text,
  textSize = "md",
  link,
}: Props) {
  const p = textSize === "md" ? 2 : 1;
  const pl = textSize === "md" ? 3 : 2;
  const pb = textSize === "md" ? 0 : 1;
  const mb = textSize === "md" ? 2 : 0;
  return (
    <CardHeader p={p} pl={pl} pb={pb}>
      <Flex align="center">
        <Heading size={textSize} mb={mb}>
          {text}
        </Heading>
        <Spacer />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="auto"
          mt={2}
          fontSize="xs"
          _hover={{
            color: "blue.500",
            cursor: "pointer",
          }}
        >
          {link}
        </Box>
      </Flex>
    </CardHeader>
  );
}
