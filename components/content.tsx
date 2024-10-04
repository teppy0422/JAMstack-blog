import { Container, Center, Box, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

import Header from "../components/header";
import Header_ from "../components/header_";

export default function Content({ children, isCustomHeader = false }) {
  return (
    <>
      <Flex>
        <Box flex="1" zIndex="1000">
          {isCustomHeader ? <Header_ /> : <Header />}
          <Box height="66px"></Box>
          <Container
            maxWidth="900px"
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
      <hr />
      <Center my="14px" color="gray" fontFamily="Noto Sans JP" fontWeight="100">
        <NextLink href="/privacy">プライバシーポリシー</NextLink>
        <Box mr={5} />
        <NextLink href="/terms">利用規約</NextLink>
      </Center>
      <Center mb="18px" color="gray">
        ©︎ 2022-2024 Teppei Kataoka. All rights Reserved.
      </Center>
    </>
  );
}
