import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Content from "../../components/content";
import SkillGraph from "../../components/sillGraph";
import SkillCircle from "../../components/skillCircle";
import ModalWork from "../../components/modalWork";
import ImageCard from "../../components/imageCard";

import Detail01 from "../../components/worksDetail/01";
import Detail01talk from "../../components/worksDetail/01_talk";
import Detail02 from "../../components/worksDetail/02";
import Detail02talk from "../../components/worksDetail/02_talk";
import Detail03 from "../../components/worksDetail/03";

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
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  //AOS用_ページ遷移時に表示されない��らだけど変化しない
  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeComplete", handleChangeRoute);
    return () => {
      router.events.off("routeChangeComplete", handleChangeRoute);
    };
  }, []);
  function handleChangeRoute(path: string) {
    AOS.init({
      once: false,
      easing: "ease-out-sine",
      duration: 600,
    });
  }
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  const skillCircles = [
    {
      value: 90,
      cirText: "EXCEL-vba\nアプリ制御など\n15年",
      color: "excel",
      img: "/images/logo_excel.svg",
    },
    {
      value: 65,
      cirText: "ACCESS-vba\n部品管理\n3年",
      color: "excel",
      img: "/images/logo_access.svg",
    },
    {
      value: 30,
      cirText: "vb.net\nシリアル通信\nカメラ制御\n半年",
      color: "dotNet",
      img: "/images/logo_dotNet.svg",
    },
    {
      value: 60,
      cirText: "HTML\n基本的な使い方\n4年",
      color: "front",
      img: "/images/logo_html5.svg",
    },
    {
      value: 65,
      cirText: "CSS\n基本的な使い方\n+SCSS\n4年",
      color: "front",
      img: "/images/logo_css.svg",
    },
    {
      value: 40,
      cirText: "JavaScript\n4年",
      color: "front",
      img: "/images/logo_javascript.svg",
    },
    {
      value: 35,
      cirText: "Next\nこのサイトで利用\n1年",
      color: "front",
      img: "/images/logo_next.svg",
    },
    {
      value: 30,
      cirText: "PHP\n半年",
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
      cirText: "Arduino\n2年",
      color: "arduino",
      img: "/images/logo_arduino.svg",
    },
    {
      value: 30,
      cirText: "Davinci Resolve\n半年",
      color: "davinci",
      img: "/images/logo_davinci.svg",
    },
    {
      value: 30,
      cirText: "InkScape\n1年",
      color: "inkscape",
      img: "/images/logo_inkscape.svg",
    },
  ];
  const skillCards = [
    {
      title: "生産準備+",
      subTitle: "画像を自動で作る",
      eyeCatchPath: "/images/sjp_menu.png",
      detail: <Detail01 />,
      detailTalk: <Detail01talk />,
      rate: 5,
      users: 341,
      skillTags: [
        {
          skillName: "EXCEL",
          skillColor: "green",
        },
      ],
      titleTalk: "詳細(茶番劇1話)を見る",
    },
    {
      title: "導通検査+",
      subTitle: "WEB技術の基礎",
      eyeCatchPath: "/images/sjp_kensarireki_YCC.png",
      detail: <Detail02 />,
      detailTalk: <Detail02talk />,
      rate: 5,
      users: 120,
      skillTags: [
        {
          skillName: "EXCEL",
          skillColor: "green",
        },
        {
          skillName: "HTML",
          skillColor: "orange",
        },
        {
          skillName: "CSS",
          skillColor: "blue",
        },
        {
          skillName: "JavaScript",
          skillColor: "yellow",
        },
      ],
      titleTalk: "詳細(茶番劇2話)を見る",
    },
    {
      title: "作業誘導+",
      subTitle: "マイコン",
      eyeCatchPath: "/images/detail_03_title.png",
      detail: <Detail03 />,
      detailTalk: <Center>Comming soon. maybe</Center>,
      rate: 5,
      users: 8,
      skillTags: [
        {
          skillName: "EXCEL",
          skillColor: "green",
        },
        {
          skillName: "HTML",
          skillColor: "orange",
        },
        {
          skillName: "CSS",
          skillColor: "blue",
        },
        {
          skillName: "JavaScript",
          skillColor: "yellow",
        },
        {
          skillName: "VB.net",
          skillColor: "purple",
        },
        {
          skillName: "Arduino",
          skillColor: "teal",
        },
      ],
      titleTalk: "詳細(茶番劇3話)を見る",
    },
  ];
  return (
    <Content isCustomHeader={false}>
      <div className={styles.me}>
        <VStack>
          <Flex>
            <Box>
              <Text fontSize={[28, 32, 36, 40]} className={styles.name}>
                Teppei Kataoka
              </Text>
              <Text className={styles.tool}>
                Programmer for
                <Tooltip label="Arduino" hasArrow placement="top" bg="tomato">
                  machines
                </Tooltip>
                and
                <Tooltip
                  label="VBA JavaScript.."
                  hasArrow
                  placement="top"
                  bg="tomato"
                >
                  software
                </Tooltip>
              </Text>
              <Text className={styles.tool}>
                I do
                <Tooltip label="InkScape" hasArrow placement="top" bg="tomato">
                  design
                </Tooltip>
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
                width={64}
                height={64}
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
          <Text w={["100%", "95%", "85%", "75%"]} fontFamily="Noto Sans JP">
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

        <SkillGraph />
        <Box style={{ textAlign: "center" }}>
          {skillCircles.map((item, index) => {
            const aosOffset: number = (index % 5) * 70;
            return (
              <Flex
                key={index}
                data-aos="fade-up"
                data-aos-offset={aosOffset}
                style={{ display: "inline-block" }}
              >
                <SkillCircle
                  value={item.value}
                  cirText={item.cirText}
                  color={item.color}
                  timing={index}
                  img={item.img}
                />
              </Flex>
            );
          })}
        </Box>

        <Box ml={[0, 0, "8%", "16%"]}>
          <div data-aos="fade-right" style={{ display: "inline-block" }}>
            <Text className={styles.subTitle}>Works</Text>
          </div>
        </Box>
        <div style={{ height: "24px" }}></div>

        <Box style={{ textAlign: "center" }} className={styles.cardList}>
          {skillCards.map((item, index) => {
            return (
              <Box display={"inline-block"} key={index}>
                <ModalWork title={item.title} detail={item.detail} m={0}>
                  <ImageCard
                    title={item.title}
                    subTitle={item.subTitle}
                    eyeCatchPath={item.eyeCatchPath}
                    rate={item.rate}
                    users={item.users}
                    skillTags={item.skillTags}
                  />
                </ModalWork>
                <ModalWork title={item.title} detail={item.detailTalk}>
                  <Box className={styles.balloon} boxShadow="md">
                    {item.titleTalk}
                  </Box>
                </ModalWork>
              </Box>
            );
          })}
        </Box>
      </div>
    </Content>
  );
}
