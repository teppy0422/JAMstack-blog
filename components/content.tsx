// レイアウトを決める
import { Container, Center } from "@chakra-ui/react";

export default function Content({ children }) {
  return (
    <>
      <Container className={`container`}>{children}</Container>
      <hr />
      <Center h="50px" color="gray">
        ©︎ 2022 Teppei Kataoka. All rights Reserved.
      </Center>
    </>
  );
}
