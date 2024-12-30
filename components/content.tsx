import { useContext } from "react";

import { Container, Center, Box, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

import Header from "../components/header";
import Header_ from "../components/header_";
import { Global } from "@emotion/react";

import getMessage from "./getMessage";
import { AppContext } from "../pages/_app";

export default function Content({
  children,
  isCustomHeader = false,
  maxWidth = "900px",
}) {
  const { language, setLanguage } = useContext(AppContext);

  return (
    <>
      <Global
        styles={{
          "@media print": {
            ".no-print-page": {
              display: "none !important",
            },
          },
        }}
      />
      <Flex direction="column" minHeight="90vh">
        <Box flex="1" zIndex="1000">
          {isCustomHeader ? <Header_ /> : <Header />}
          <Box height="66px"></Box>
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
              background="rgba(255,255,255,0.05)"
              filter="blur(20px)" // ブラー効果を追加
              zIndex="-1" // 背景として扱うためにzIndexを設定
            />
            {children}
          </Container>
        </Box>
      </Flex>
      <Box className="no-print-page">
        <Center
          my="14px"
          color="gray"
          fontFamily="Noto Sans JP"
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
        <Center mb="18px" color="gray">
          ©︎ 2022-2024 Teppei Kataoka. All rights Reserved.
        </Center>
      </Box>
    </>
  );
}
