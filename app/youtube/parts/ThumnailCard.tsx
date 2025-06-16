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
} from "@chakra-ui/react";

// 再生ソースを切り替える関数（必要に応じてグローバル管理にする）
const changeVideoSource = (newSrc: string) => {
  const fullPath = "/" + newSrc.replace(/^\/+/, ""); // 先頭のスラッシュを除去してから追加
  console.log(fullPath);
  window.location.href = fullPath;
};
// props 型定義
export type ThumnailCardProps = {
  src: string;
  title: string;
  name: string;
  thumbnail?: string;
  isActive?: boolean;
  onClick: () => void; // 追加
};
const ThumnailCard: React.FC<ThumnailCardProps> = ({
  src,
  title,
  name,
  thumbnail,
  isActive,
  onClick,
}) => {
  const [youtubePath, setYoutubePath] = useState("");

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
      // onClick={handleCardClick}
      onClick={onClick}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        position="absolute"
      >
        {youtubePath === src ? ">" : null}
      </Box>

      <Image
        objectFit="cover"
        w={{ base: "50%", sm: "100px" }}
        h={{ base: "80px", sm: "60px" }}
        src={thumbnail}
        borderRadius="6px"
        border="0.5px solid"
        py="4px"
        ml="4px"
      />

      <Stack>
        <CardBody maxH={{ base: "80px", sm: "60px" }} p={1} pl={2}>
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
            <Text
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
              {name}
            </Text>
          </Flex>
        </CardBody>
      </Stack>
    </Card>
  );
};

export default ThumnailCard;
