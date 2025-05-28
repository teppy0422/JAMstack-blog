"use client";

import { Link, Text, Image, Box } from "@chakra-ui/react";

type FaviconLinkItemProps = {
  href: string;
  mainText: string;
  subText?: string;
};

export const FaviconLinkItem = ({
  href,
  mainText,
  subText,
}: FaviconLinkItemProps) => {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}`;
    } catch {
      return "";
    }
  };

  return (
    <Box>
      <Link
        href={href}
        isExternal
        color="blue.500"
        display="flex"
        alignItems="center"
        gap="1"
      >
        <Image src={getFaviconUrl(href)} alt="favicon" boxSize="16px" />
        <Text>{mainText}</Text>
      </Link>
      {subText && (
        <Text pl={0} color="gray.600" fontSize="sm">
          {subText}
        </Text>
      )}
    </Box>
  );
};
