// レイアウトを決める
import { Container, Center } from "@chakra-ui/react";

export default function Content({ children }) {
  return (
    <>
      <Container
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
