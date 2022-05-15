// レイアウトを決める
import { Container, Center, Box } from "@chakra-ui/react";
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
      <Center h="50px" color="gray">
        ©︎ 2022 Teppei Kataoka. All rights Reserved.
      </Center>
    </>
  );
}
