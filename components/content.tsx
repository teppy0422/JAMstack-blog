// レイアウトを決める
import { Container, Center } from "@chakra-ui/react";
import Header from "../components/header";

export default function Content({ children }) {
  return (
    <>
      <Header />
      <Container
        maxWidth="960px"
        className={`container`}
        style={{ background: "rgba(255,255,255,0.1)", marginTop: "66px" }}
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
