import { Container, Center, Box, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

import Header from "../components/header";
import Header_ from "../components/header_";
import Sidebar from "../components/sidebar";

export default function Content({ children, isCustomHeader = false }) {
  return (
    <>
      <Flex>
        {isCustomHeader ? <Sidebar /> : null}
        <Box flex="1" zIndex="1000">
          {isCustomHeader ? <Header_ /> : <Header />}
          <Box height="66px"></Box>
          <Container
            maxWidth="900px"
            className="container"
            style={{ background: "rgba(255,255,255,0.1)" }}
            px={0}
          >
            {children}
          </Container>
        </Box>
      </Flex>
      <hr />
      <Center my="14px" color="gray">
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
