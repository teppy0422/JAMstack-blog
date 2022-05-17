import React from "react";
import Content from "../../components/content";
import Skillchart from "../../components/skillchart";
import SkillCircle from "../../components/skillCircle";
import ModalWork from "../../components/modalWork";
import ImageCard from "../../components/imageCard";
import SjpDetail from "../../components/worksDetail/SjpDetail";

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
  Wrap,
  WrapItem,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";
import { theme } from "highcharts";

export default function About() {
  const skillCircles = [
    {
      value: 90,
      cirText: "EXCEL-vba\nアプリ制御など",
      color: "excel",
      img: "/images/logo_excel.svg",
    },
    {
      value: 65,
      cirText: "ACCESS-vba\n",
      color: "excel",
      img: "/images/logo_access.svg",
    },
    {
      value: 30,
      cirText: "vb.net\nカメラ制御\n生産誘導",
      color: "dotNet",
      img: "/images/logo_dotNet.svg",
    },
    {
      value: 60,
      cirText: "HTML\n基本的な使い方",
      color: "front",
      img: "/images/logo_html5.svg",
    },
    {
      value: 65,
      cirText: "CSS\n基本的な使い方\n+SCSS",
      color: "front",
      img: "/images/logo_css.svg",
    },
    {
      value: 40,
      cirText: "JavaScript\n ",
      color: "front",
      img: "/images/logo_javascript.svg",
    },
    {
      value: 35,
      cirText: "Next\nこのサイトで利用",
      color: "front",
      img: "/images/logo_next.svg",
    },
    {
      value: 30,
      cirText: "PHP\n ",
      color: "php",
      img: "/images/logo_php.svg",
    },
    {
      value: 20,
      cirText: "Python\nほんの少しだけ",
      color: "php",
      img: "/images/logo_python.svg",
    },
    {
      value: 60,
      cirText: "Arduino\n ",
      color: "arduino",
      img: "/images/logo_arduino.svg",
    },
    {
      value: 30,
      cirText: "Davinci Resolve\n ",
      color: "davinci",
      img: "/images/logo_davinci.svg",
    },
    {
      value: 30,
      cirText: "InkScape\n ",
      color: "inkscape",
      img: "/images/logo_inkscape.svg",
    },
  ];
  return (
    <Content>
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
        <Box style={{ textAlign: "center" }}>
          {skillCircles.map((item, index) => {
            return (
              <SkillCircle
                key={index}
                value={item.value}
                cirText={item.cirText}
                color={item.color}
                timing={index}
                img={item.img}
              />
            );
          })}
        </Box>

        <Text className={styles.subTitle}>Works</Text>
        <Text>ここ最近の実績です。</Text>
        <div style={{ height: "24px" }}></div>

        <VStack>
          <Box textAlign="center">
            <ModalWork title="生産準備+" detail={<SjpDetail />}>
              <ImageCard
                title="生産準備+"
                eyeCatchPath="/images/sjp_menu.png"
                rate={5}
                users={341}
              />
            </ModalWork>
            <ModalWork>
              <ImageCard
                title="検査結果表示+"
                eyeCatchPath="/images/sjp_kensarireki_YCC.png"
                rate={5}
                users={120}
              />
            </ModalWork>
          </Box>
        </VStack>

        <div style={{ height: "66px" }}></div>
        <Box boxShadow="xl" rounded="md">
          <NextImage
            src="/images/hippo.gif"
            alt="hippo_walking"
            width={100}
            height={178}
          />
        </Box>
        <Text className={styles.subTitle}>経験した構成</Text>
      </div>
    </Content>
  );
}
