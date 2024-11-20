import React from "react";
import { HStack, Link } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useColorMode } from "@chakra-ui/react";

interface ExternalLinkProps {
  href: string;
  text: string;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, text }) => {
  const { colorMode } = useColorMode();
  const color = colorMode === "light" ? "blue.500" : "blue.200";
  return (
    <HStack
      as="span"
      style={{ whiteSpace: "nowrap" }}
      color={color}
      cursor="pointer"
      spacing={1}
      borderBottom="2px solid"
      borderColor={color}
      display="inline"
    >
      <Link href={href} target="_blank" rel="noopener noreferrer">
        {text}
      </Link>
      <FaExternalLinkAlt
        size="20px"
        style={{
          marginBottom: "-3px",
          display: "inline",
          marginLeft: "6px",
        }}
      />
    </HStack>
  );
};

export default ExternalLink;
