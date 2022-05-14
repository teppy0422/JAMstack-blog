import React from "react";
import Content from "../../components/content";
import Header from "../../components/header";
import Skillchart from "../../components/skillchart";
import ImageCard from "../../components/imageCard";
import {
  Center,
  Image,
  Text,
  VStack,
  Box,
  Tooltip,
  Flex,
  Spacer,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";

export default function About() {
  return (
    <Content>
      <div style={{ height: "66px" }}></div>
      <div className={styles.me}>
        <Text>-作成中-</Text>
        <VStack>
          <Flex>
            <Box>
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
            <Spacer />
            <Box filter="auto" brightness="110%">
              <NextImage
                className={styles.pic}
                src="/images/me.jpeg"
                alt="me.jpeg"
                objectFit="cover"
                width={126}
                height={126}
              />
            </Box>
          </Flex>
        </VStack>

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
        <Skillchart />

        <CircularProgress
          value={90}
          color="excel"
          size="120px"
          trackColor="gray.300"
        >
          <CircularProgressLabel fontSize={18}>EXCEL</CircularProgressLabel>
        </CircularProgress>

        <CircularProgress
          value={30}
          color="vb"
          size="120px"
          trackColor="gray.300"
        >
          <CircularProgressLabel fontSize={18}>VB.net</CircularProgressLabel>
        </CircularProgress>

        <CircularProgress
          value={65}
          color="front"
          size="120px"
          trackColor="gray.300"
        >
          <CircularProgressLabel fontSize={18}>HTML</CircularProgressLabel>
        </CircularProgress>

        <Text className={styles.subTitle}>Works</Text>
        <Text>ここ最近の実績です。</Text>

        <div style={{ height: "66px" }}></div>

        <ImageCard imagePath="../../public/images/sjp_menu.png" />
        <ImageCard imagePath="../../public/images/sjp_menu.png" />

        <Box boxShadow="xl" rounded="md">
          <NextImage
            src="/images/hippo.gif"
            alt="hippo_walking"
            width={100}
            height={178}
          />
        </Box>
      </div>
    </Content>
  );
}
