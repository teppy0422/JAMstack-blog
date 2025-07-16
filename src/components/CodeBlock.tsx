import {
  Box,
  Code,
  Flex,
  IconButton,
  useClipboard,
  useToast,
  Text,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useState } from "react";

type Props = {
  code: string;
  title?: string;
};
export default function CodeBlock({ code, title }: Props) {
  const { onCopy } = useClipboard(code);
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    toast({
      title: "Copied!",
      description: "コードをクリップボードにコピーしました。",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box position="relative" overflowX="auto" fontFamily="mono" mt={1} mb={1}>
      <Flex
        position="absolute"
        top={-1.5}
        w="100%"
        justifyContent="space-between"
      >
        {title ? (
          <Text
            fontSize="10px"
            fontWeight="600"
            color="custom.theme.light.850"
            pl="6px"
            pt="7px"
          >
            {title}
          </Text>
        ) : (
          <Box />
        )}
        <IconButton
          right="0px"
          pt="2px"
          aria-label="Copy code"
          icon={copied ? <Text fontSize="xs">コピーした!</Text> : <CopyIcon />}
          size="sm"
          onClick={handleCopy}
          variant="ghost"
          colorScheme={copied ? "green" : "gray"}
        />
      </Flex>
      <Code
        whiteSpace="pre"
        display="block"
        fontSize="sm"
        p={4}
        borderRadius="md"
      >
        {code}
      </Code>
    </Box>
  );
}
