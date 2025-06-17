"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  AspectRatio,
} from "@chakra-ui/react";

export type ThumnailCardProps = {
  src: string;
  title: string;
  name: string;
  thumbnail?: string;
  time?: string;
  isActive?: boolean;
  onClick: () => void;
};
const ThumnailCard: React.FC<ThumnailCardProps> = ({
  src,
  title,
  name,
  thumbnail,
  time = "00;00",
  isActive,
  onClick,
}) => {
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      borderRadius="0"
      border="0px"
      boxShadow={0}
      cursor="pointer"
      _hover={{ bg: "custom.system.500" }}
      bg={isActive ? "custom.system.500" : "transparent"}
      onClick={onClick}
      py={1}
      pl={1.5}
    >
      <Box position="relative">
        <Image
          src={thumbnail}
          w={{ base: "80px", md: "96px" }}
          minW={{ base: "80px", md: "96px" }}
          maxW={{ base: "80px", md: "96px" }}
          h={{ base: "45px", md: "54px" }}
          minH={{ base: "45px", md: "54px" }}
          maxH={{ base: "45px", md: "54px" }}
          objectFit="cover"
          objectPosition="center"
          borderRadius="6px"
          border="0.5px solid"
        />
        <Box
          position="absolute"
          right="4px"
          bottom="3px"
          borderRadius="sm"
          bg="rgba(0,0,0,0.6)"
        >
          <Text color="#fafafa" fontWeight={800} fontSize="10px" px={1}>
            {time}
          </Text>
        </Box>
      </Box>

      <Stack>
        <CardBody maxH={{ base: "80px", md: "60px" }} p={1} pl={2}>
          <Flex
            direction="column"
            justifyContent="space-between"
            height="100%"
            textAlign="left"
          >
            <Heading
              fontSize="12px"
              textAlign="left"
              overflow="hidden"
              display="-webkit-box"
              style={{
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
              color="#eee"
            >
              {title}
            </Heading>
            <Flex
              align="center" // ← 垂直方向中央揃え
              py="1"
              fontSize="10px"
              bottom="0"
              position="absolute"
              textAlign="left"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              color="#ccc"
            >
              {thumbnail?.includes("youtube.com") && (
                <Box
                  as="svg"
                  viewBox="0 0 24 24"
                  width="16px"
                  height="16px"
                  fill="red"
                  mr="1" // ← テキストとの余白
                  mt="0"
                  display="block" // ← アイコンの上下ズレ防止
                >
                  <path d="M19.615 3.184A3.003 3.003 0 0 1 21.8 5.368c.583 1.491.583 4.6.583 4.6s0 3.108-.583 4.6a3.003 3.003 0 0 1-2.184 2.184C17.123 17.2 12 17.2 12 17.2s-5.123 0-7.615-.447a3.003 3.003 0 0 1-2.184-2.184C1.618 13.077 1.618 10 1.618 10s0-3.108.583-4.6A3.003 3.003 0 0 1 4.385 3.184C6.877 2.737 12 2.737 12 2.737s5.123 0 7.615.447zM10 14.546l5.455-3.455L10 7.636v6.91z" />
                </Box>
              )}
              {name}ネーム
            </Flex>
          </Flex>
        </CardBody>
      </Stack>
    </Card>
  );
};

export default ThumnailCard;
