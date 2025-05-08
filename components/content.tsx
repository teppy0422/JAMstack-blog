import { useContext } from "react";

import { Container, Center, Box, Flex, useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";

import Header from "./header";
import Header_ from "./header_";
import { Global } from "@emotion/react";

import { useLanguage } from "../context/LanguageContext";
import getMessage from "./getMessage";
// import { AppContext } from "../pages/_app";

import {
  ChakraProvider,
  useColorModeValue,
  ColorModeScript,
} from "@chakra-ui/react";

export default function Content({
  children,
  isCustomHeader = false,
  maxWidth = "900px",
  isUse = true,
}) {
  const { language, setLanguage } = useLanguage();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box id="content">
      <Global
        styles={{
          "@media print": {
            ".no-print-page": {
              display: "none !important",
            },
          },
          "::-webkit-scrollbar": {
            width: "6px",
          },
          "::-webkit-scrollbar-track": {
            background: colorMode === "light" ? "#f8e9df" : "#111",
            borderRadius: "3px",
          },
          "::-webkit-scrollbar-thumb": {
            background: colorMode === "light" ? "#8d7c6f" : "#555",
            borderRadius: "3px",
          },
          "::-webkit-scrollbar-thumb:hover": {
            background: colorMode === "light" ? "#555" : "#777",
          },
        }}
      />
      {isUse ? (
        <>
          <Flex
            direction="column"
            minHeight="90vh"
            bg={
              colorMode === "light"
                ? "custom.theme.light.500"
                : "custom.theme.dark.500"
            }
          >
            <Box flex="1">
              {isCustomHeader ? <Header_ /> : <Header />}
              <Box height="42px" />
              <Container
                maxWidth={maxWidth}
                className="container"
                position="relative" // 相対位置を設定
                px={1}
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg={
                    colorMode === "light"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)"
                  }
                  filter="blur(20px)" // ブラー効果を追加
                  zIndex="-1" // 背景として扱うためにzIndexを設定
                />
                {children}
              </Container>
            </Box>
          </Flex>
          <Box
            className="no-print-page"
            zIndex={10}
            bg={
              colorMode === "light"
                ? "custom.theme.light.500"
                : "custom.theme.dark.500"
            }
            // minH="10vh"
          >
            <Center
              py="14px"
              color={colorMode === "light" ? "black" : "white"}
              bg={
                colorMode === "light"
                  ? "custom.theme.light.500"
                  : "custom.theme.dark.500"
              }
              fontSize="14px"
              fontFamily={getMessage({
                ja: "Noto Sans JP",
                us: "Noto Sans JP",
                cn: "Noto Sans SC",
                language,
              })}
              fontWeight="100"
            >
              <NextLink href="/privacy">
                {getMessage({
                  ja: "プライバシーポリシー",
                  us: "Privacy Policy",
                  cn: "隐私政策",
                  language,
                })}
              </NextLink>
              <Box mr={5} />
              <NextLink href="/terms">
                {getMessage({
                  ja: "利用規約",
                  us: "Terms of Use",
                  cn: "条款和条件",
                  language,
                })}
              </NextLink>
            </Center>
            <Center mb="2px" color={colorMode === "light" ? "black" : "white"}>
              ©︎ 2022-2024 Teppei Kataoka. All rights Reserved.
            </Center>
          </Box>
        </>
      ) : (
        <>{children}</>
      )}
    </Box>
  );
}
