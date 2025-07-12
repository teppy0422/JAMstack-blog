// src/components/Alert.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";

export default function Readme() {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bg = useColorModeValue("yellow.100", "yellow.200");
  const border = useColorModeValue("yellow.300", "yellow.500");
  const textColor = useColorModeValue("black", "gray.800");

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/readme")
      .then((res) => {
        if (!res.ok) throw new Error("読み込み失敗");
        return res.json();
      })
      .then((data) => {
        const replacedHtml = data.html.replace(
          /:([\d]{4}-[\d]{2}-[\d]{2}):/g,
          '<span class="date-tag">$1</span>'
        );
        setHtml(replacedHtml);
      })
      .catch((err) => {
        console.error("READMEの読み込みに失敗:", err);
        setError("READMEの読み込みに失敗しました");
      });
  }, []);
  // 読み込んだら最下段までスクロール
  useEffect(() => {
    if (html && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [html]);

  return (
    <Flex justify="center" mt="40px">
      <Box
        ref={contentRef}
        color={textColor}
        className="prose"
        overflowY="auto"
        overflowX="hidden"
        maxW="390px"
        h="405px"
        py="100px"
        px="44px"
        bg="#f0e4da"
      >
        {error ? (
          <Text color="red.500">{error}</Text>
        ) : html ? (
          <Box
            sx={{
              scrollbarWidth: "thin", // Firefox
              "&::-webkit-scrollbar": {
                width: "6px", // Chrome系
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "gray.400",
                borderRadius: "md",
              },
              "& h1": { fontSize: "xl", fontWeight: "bold", mb: 2 },
              "& h2": { fontSize: "lg", fontWeight: "semibold", mt: 4, mb: 2 },
              "& h3": { fontSize: "lg", fontWeight: "semibold", mt: 4, mb: 2 },
              "& h4": {
                fontSize: "15px !important",
                fontWeight: "semibold",
                mt: 4,
                mb: 2,
              },
              "& p": { fontSize: "13px", mb: 2, px: 2 },
              "& pre": {
                bg: "gray.100",
                rounded: "md",
                overflowX: "auto",
                fontSize: "sm",
                whiteSpace: "pre-wrap", // ← 折り返し
                wordBreak: "break-word",
              },
              "& code": {
                fontFamily: "monospace",
                px: 1,
                bg: "gray.50",
                rounded: "sm",
                whiteSpace: "normal", // ← インラインコードも折り返し
              },
              "& a": {
                color: "blue.500",
                textDecoration: "underline",
              },
              "& .date-tag": {
                backgroundColor: "custom.theme.light.200",
                color: "custom.theme.light.900",
                fontWeight: "bold",
                px: "2",
                py: "0.5",
                borderRadius: "md",
                fontSize: "xs",
                display: "block",
                textAlign: "center",
                mb: "0px",
                lineHeight: "1",
              },
              "& .date-tag + br": {
                display: "none",
              },
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <Spinner size="sm" color="gray.600" />
        )}
      </Box>
    </Flex>
  );
}
