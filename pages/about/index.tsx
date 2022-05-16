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
          <SkillCircle
            value={90}
            cirText={"EXCEL-vba\nアプリ制御など"}
            color="excel"
            timing={0}
            img="/images/logo_excel.svg"
          />
          <SkillCircle
            value={65}
            cirText={"ACCESS-vba\n"}
            color="excel"
            timing={1}
            img="/images/logo_access.svg"
          />
          <SkillCircle
            value={30}
            cirText={"vb.net\nカメラ制御\n生産誘導"}
            color="dotNet"
            timing={2}
            img="/images/logo_dotNet.svg"
          />
          <SkillCircle
            value={60}
            cirText={"HTML\n基本的な使い方"}
            color="front"
            timing={3}
            img="/images/logo_html5.svg"
          />
          <SkillCircle
            value={65}
            cirText={"CSS\n基本的な使い方\n+SCSS"}
            color="front"
            timing={4}
            img="/images/logo_css.svg"
          />
          <SkillCircle
            value={40}
            cirText={"JavaScript\n "}
            color="front"
            timing={5}
            img="/images/logo_javascript.svg"
          />
          <SkillCircle
            value={35}
            cirText={"Next\nこのサイトで利用"}
            color="front"
            timing={6}
            img="/images/logo_next.svg"
          />
          <SkillCircle
            value={30}
            cirText={"PHP\n "}
            color="php"
            timing={7}
            img="/images/logo_php.svg"
          />
          <SkillCircle
            value={20}
            cirText={"Python\nほんの少しだけ"}
            color="php"
            timing={8}
            img="/images/logo_python.svg"
          />
          <SkillCircle
            value={60}
            cirText={"Arduino\n "}
            color="arduino"
            timing={9}
            img="/images/logo_arduino.svg"
          />
          <SkillCircle
            value={30}
            cirText={"Davinci Resolve\n "}
            color="davinci"
            timing={10}
            img="/images/logo_davinci.svg"
          />
          <SkillCircle
            value={30}
            cirText={"InkScape\n "}
            color="inkscape"
            timing={11}
            img="/images/logo_inkscape.svg"
          />
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
