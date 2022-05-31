import React from "react";
import Content from "../../components/content";

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
  Stack,
} from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";
import { theme } from "highcharts";

export default function About() {
  const illusts = [
    {
      src: "/images/illust/hippo/hippo_001.png",
    },
    {
      src: "/images/illust/hippo/hippo_001_a.png",
    },
    {
      src: "/images/illust/hippo/hippo_002.png",
    },
    {
      src: "/images/illust/hippo/hippo_004.png",
    },
    {
      src: "/images/illust/hippo/hippo_005.png",
    },
    {
      src: "/images/illust/hippo/hippo_005_a.png",
    },
    {
      src: "/images/illust/hippo/hippo_006.png",
    },
    {
      src: "/images/illust/hippo/hippo_007.png",
    },
    {
      src: "/images/illust/hippo/hippo_008.png",
    },
    {
      src: "/images/illust/hippo/hippo_010.png",
    },
    {
      src: "/images/illust/hippo/hippo_011.png",
    },
    {
      src: "/images/illust/hippo/hippo_011_a.png",
    },
    {
      src: "/images/illust/hippo/hippo_012.png",
    },
    {
      src: "/images/illust/hippo/hippo_013.png",
    },
    {
      src: "/images/illust/hippo/hippo_014.png",
    },
    {
      src: "/images/illust/hippo/hippo_015.png",
    },
    {
      src: "/images/illust/hippo/hippo_016.png",
    },
    {
      src: "/images/illust/hippo/hippo_017.png",
    },
    {
      src: "/images/illust/hippo/hippo_017_a.png",
    },
    {
      src: "/images/illust/hippo/hippo_019.png",
    },
    {
      src: "/images/illust/hippo/hippo_020.png",
    },
    {
      src: "/images/illust/hippo/hippo_021.png",
    },
    {
      src: "/images/illust/hippo/hippo_022.png",
    },
    {
      src: "/images/illust/obj/obj_001.png",
    },
    {
      src: "/images/illust/obj/obj_002.png",
    },
    {
      src: "/images/illust/obj/obj_003.png",
    },
    {
      src: "/images/illust/obj/obj_004.png",
    },
  ];
  return (
    <Content>
      <div className={styles.me}>
        <Text>-作成中-</Text>
        <VStack>
          <Flex>
            <Box>
              <Box className={styles.watercolor} h={100}>
                <Text p={5} fontSize="32px" fontWeight="700">
                  イラスト
                </Text>
              </Box>
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

        <Box ml={[0, 18, 70, 115]}>
          <div data-aos="fade-right" data-aos-duration="300">
            <Text className={styles.subTitle}>自己紹介</Text>
          </div>
        </Box>
        <Center>
          <Text w={["100%", "95%", "85%", "75%"]}>
            高知県出身のエンジニア。
            自動車のワイヤーハーネス製造/機械保全/生産計画/生産分析に従事。現場の問題改善を繰り返す内にITや電子工学技術に興味を持つ。
            EXCEL/ACCESSのソフトウェアからPLC/Arduinoなどのハードウェアを経験。それらをHTML/JavaScript/PHPで連携させる仕組みを構築。
            現場の利用者と相談して更に発展させていくのが得意です。カバが好き。
          </Text>
        </Center>

        <Box ml={[0, 18, 70, 115]}>
          <div data-aos="fade-right" style={{ display: "inline-block" }}>
            <Text className={styles.subTitle}>スキル</Text>
          </div>
        </Box>

        <Box style={{ textAlign: "center" }}>
          {illusts.map((item, index) => {
            const aosOffset: number = (index % 2) * 100;
            return (
              <div
                data-aos="flip-left"
                data-aos-offset={aosOffset}
                style={{ display: "inline-block" }}
              >
                <Image
                  src={item.src}
                  style={{ display: "inline-block" }}
                  m={3}
                />
              </div>
            );
          })}
        </Box>
      </div>
    </Content>
  );
}
