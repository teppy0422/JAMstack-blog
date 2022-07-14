// レイアウトを決める
import { Container, Center, Box, Spacer } from "@chakra-ui/react";
import NextLink from "next/link";

import Header from "../components/header";

export default function Content({ children }) {
  return (
    <>
      <Header />

      <Box height="66px" />
      <Container
        maxWidth="980px"
        className={`container2`}
        style={{ background: "rgba(255,255,255,0.1)" }}
        px={0}
      >
        {children}
      </Container>

      <hr />
      <Center my="14px" color="gray">
        <NextLink href="/privacy">
          <a>プライバシーポリシー</a>
        </NextLink>
        <Box mr={5} />
        <NextLink href="/terms">
          <a>利用規約</a>
        </NextLink>
      </Center>
      <Center mb="18px" color="gray">
        ©︎ 2022 Teppei Kataoka. All rights Reserved.
      </Center>
    </>
  );
}
