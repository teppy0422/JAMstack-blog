import React from "react";
import { HStack, Link } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa6";
import { useColorMode } from "@chakra-ui/react";

const DownloadLink: React.FC<{ href: string; text: string }> = ({
  href,
  text,
}) => {
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
      <Link
        href={href}
        download
        color={color}
        _hover={{ textdecoration: "none" }}
      >
        {text}
      </Link>
      <FaDownload
        size="20px"
        style={{ marginBottom: "-3px", display: "inline" }}
      />
    </HStack>
  );
};

export default DownloadLink;
