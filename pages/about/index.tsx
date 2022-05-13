import Content from "../../components/content";
import Header from "../../components/header";
import { Center, Image } from "@chakra-ui/react";

export default function About() {
  return (
    <Content>
      <Header />
      <div style={{ height: "30px" }}></div>
      <Center>
        <Image src="/images/hippo.gif" alt="hippo_walking" width="100px" />
      </Center>
    </Content>
  );
}
