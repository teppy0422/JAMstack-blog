import React from "react";
import Content from "../../components/content";
import Header from "../../components/header";
import Skillchart from "../../components/skillchart";
import {
  Center,
  Image,
  Text,
  VStack,
  Box,
  Tooltip,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";

export default function About() {
  const myheight = "400";
  return (
    <Content>
      <Header />
      <div style={{ height: "30px" }}></div>
      <div className={styles.me}>
        <Text>-作成中-</Text>
        <Flex>
          <Box width={"75%"}>
            <Text fontSize={[28, 32, 36, 40]} className={styles.name}>
              Teppei Kataoka
            </Text>
            <Text className={styles.tool}>
              Programmer for{" "}
              <Tooltip label="Arduino" hasArrow placement="top" bg="tomato">
                machines
              </Tooltip>{" "}
              and{" "}
              <Tooltip
                label="VBA JavaScript.."
                hasArrow
                placement="top"
                bg="tomato"
              >
                software
              </Tooltip>
              .
            </Text>
            <Text className={styles.tool}>
              I do{" "}
              <Tooltip label="InkScape" hasArrow placement="top" bg="tomato">
                design
              </Tooltip>{" "}
              sometimes.
            </Text>
          </Box>
          <Center filter="auto" brightness="110%">
            <NextImage
              className={styles.pic}
              src="/images/me.jpeg"
              alt="me.jpeg"
              objectFit="cover"
              width={126}
              height={126}
            />
          </Center>
          <Spacer />
        </Flex>
        <Text className={styles.subTitle}>自己紹介</Text>
        <Center>
          <Text>
            高知県出身のエンジニア。
            自動車のワイヤーハーネス製造/機械保全/生産計画/生産分析に従事。現場改善を繰り返す内にITや電子工学技術に興味を持つ。
            EXCEL/ACCESSのソフトウェアからPLC/Arduinoなどのハードウェアを経験。それらをHTML/JavaScript/PHPで連携させる仕組みを構築。
            現場の利用者と相談して更に発展させていくのが得意です。
          </Text>
        </Center>

        <Text className={styles.subTitle}>スキル</Text>

        <Skillchart myHeight={myheight} />

        <NextImage
          src="/images/hippo.gif"
          alt="hippo_walking"
          width={100}
          height={178}
        />
      </div>
    </Content>
  );
}
