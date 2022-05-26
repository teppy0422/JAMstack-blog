// レイアウトを決める
import { Container, Center, Box } from "@chakra-ui/react";
import NextLink from "next/link";

import Header from "../components/header";

export default function Content({ children }) {
  return (
    <>
      <Header />
      <Box height="66px"></Box>
      <Container
        maxWidth="960px"
        className={`container`}
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        {children}
      </Container>
      <hr />
      <Center mt="20px" color="gray">
        ©︎ 2022 Teppei Kataoka. All rights Reserved.
      </Center>
      <Center mb="40px" color="gray">
        <NextLink href="/privacy">
          <a>privacy policy</a>
        </NextLink>
      </Center>
    </>
  );
}
