import Content from "../../components/content";
import Header from "../../components/header";
import { Center } from "@chakra-ui/react";
import Image from "next/image";

export default function About() {
  return (
    <Content>
      <Header />
      <div style={{ height: "30px" }}></div>
      <Center>
        <Image
          src="/images/hippo.gif"
          alt="hippo_walking"
          width={100}
          height={178}
        />
      </Center>
    </Content>
  );
}
