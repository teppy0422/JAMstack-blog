// レイアウトを決める
import { Container, Center, Box, Spacer } from "@chakra-ui/react";
import NextLink from "next/link";

import Header from "../components/header";
import CustomHeader from "../components/header_";

export default function Content({ children, isCustomHeader }) {
  return (
    <>
      {isCustomHeader ? <CustomHeader /> : <Header />}
      <Box height="66px"></Box>
      <Container
        maxWidth="960px"
        className={`container`}
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        {children}
      </Container>
      <hr />
      <Center my="16px" color="gray">
        <NextLink href="/privacy">
          <a>プライバシーポリシー</a>
        </NextLink>
        <Box mr={5} />
        <NextLink href="/terms">
          <a>利用規約</a>
        </NextLink>
      </Center>
      <Center mb="20px" color="gray">
        ©︎ 2022 Teppei Kataoka. All rights Reserved.
      </Center>
    </>
  );
}
