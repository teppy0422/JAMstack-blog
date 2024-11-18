import React, { useEffect, useState } from "react";
import Content from "../../components/content";
import {
  Image,
  Text,
  Box,
  Badge,
  Kbd,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  List,
  ListItem,
  ListIcon,
  Center,
  Flex,
  Avatar,
  Link,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { FaGithub } from "react-icons/fa"; // react-iconsからGitHubアイコンをインポート
import styles from "../../styles/home.module.scss";
import Sidebar from "../../components/sidebar"; // Sidebar コンポーネントをインポート

import SkillCircle from "../../components/skillCircle";
import SkillGraph from "../../components/sillGraph";

export default function About() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null; // クライアントサイドでのみレンダリング
  }
  function CustomAccordion({
    title,
    children,
    badges,
    colorScheme,
    variant,
  }: {
    title: string;
    children: React.ReactNode;
    badges?: string[];
    colorScheme?: string;
    variant?: string;
  }) {
    return (
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {title}
            </Box>
            {badges &&
              badges.map((badge, index) => {
                let colorScheme = "gray";
                let variant = "subtle";

                // バッジの値に応じて色とバリアントを設定
                switch (badge) {
                  case "開発者":
                    colorScheme = "red";
                    variant = "outline";
                    break;
                  case "使用者":
                    colorScheme = "gray";
                    variant = "solid";
                    break;
                  case "作業者":
                    colorScheme = "green";
                    variant = "solid";
                    break;
                  // 他のケースを追加可能
                  default:
                    break;
                }

                return (
                  <Badge
                    key={index}
                    colorScheme={colorScheme}
                    variant={variant}
                    mr={2}
                  >
                    {badge}
                  </Badge>
                );
              })}
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Box>{children}</Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }

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
      value: 40,
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
      cirText: "Python\n少しだけ",
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
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <div
          className={styles.me}
          style={{ fontFamily: "Noto Sans JP", whiteSpace: "pre-line" }}
        >
          <Box textAlign="center" mb={8}>
            <Text fontSize="xl" colorScheme="black" mb={8}>
              プログラムの更新について
            </Text>
            <Text fontSize="sm" colorScheme="black">
              プログラムを誰でも編集出来るようにする事を目指して以下に編集のポイントを記載していきます
              <br />
              過去の失敗を元に追記していきます
            </Text>
          </Box>
          <CustomAccordion
            title="自己紹介"
            badges={["開発者", "使用者", "作業者"]}
          >
            <Flex alignItems="center" mb={4} justifyContent="center">
              <Text fontSize={[16, 18, 20, 24]} className={styles.name} mb={4}>
                Teppei Kataoka
              </Text>
              <Avatar
                className={styles.pic}
                src="/images/me.jpeg"
                objectFit="cover"
                width={16}
                height={16}
              />
            </Flex>
            <Flex justifyContent="center">
              <Text
                w={["100%", "95%", "85%", "75%"]}
                fontFamily="Noto Sans JP"
                mb={20}
              >
                高知出身。
                自動車のワイヤーハーネス製造/機械保全/生産計画/生産分析を経験。現場の問題改善を繰り返す内にITや電子工学技術に興味を持つ。
                EXCEL/ACCESSのソフトウェアからPLC/Arduinoなどのハードウェアを経験。それらをHTML/JavaScript/PHPで連携させる仕組みを作ったりします。
                現場の使用者と相談しながら更に発展させていくのが好きです。カバも好き。プログラミングは嫌い。
              </Text>
            </Flex>
            <div data-aos="fade-right" style={{ display: "inline-block" }}>
              <Text className={styles.subTitle}>スキル</Text>
            </div>
            <Flex justifyContent="center">
              <SkillGraph />
            </Flex>

            <Box style={{ textAlign: "center" }} mb={20}>
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
            <Flex justifyContent="center">
              <Text mb={40}>
                以上の技術は教える事も可能なのでご気軽にお問い合わせください
              </Text>
            </Flex>
          </CustomAccordion>
          <CustomAccordion
            title="コーディングスタイルガイド"
            badges={["開発者"]}
          >
            <Box p={8} maxWidth="800px" mx="auto">
              <List spacing={4}>
                <ListItem>
                  <Flex alignItems="flex-start">
                    <ListIcon as={CheckCircleIcon} color="green.500" mt={0.5} />{" "}
                    <Text as="span" fontWeight="bold" mr={2}>
                      バージョン管理:
                    </Text>
                    開発者が増えた場合はGitHubの使用を検討
                  </Flex>
                </ListItem>
              </List>
            </Box>
          </CustomAccordion>
          <CustomAccordion title="このWEBサイトのソース" badges={["開発者"]}>
            <Flex alignItems="left" mb={4}>
              <Link
                href="https://github.com/teppy0422/JAMstack-blog"
                isExternal
              >
                <Flex alignItems="center">
                  <Icon as={FaGithub} w={6} h={6} />
                  <Text ml={2}>GitHub</Text>
                </Flex>
              </Link>
            </Flex>
            <Text>
              このサイトのソースコードはGitHubに公開しています
              <br />
              自由に使って構いません
              <br />
              ※チャットやユーザー情報、一部のファイルはsupabase内にあるのでアクセスできません
              <br />
              Next.js, ChakraUIがベースで
              supabase,microCMSの外部サービスを利用しています
            </Text>
          </CustomAccordion>
          <Box height={800}></Box>
        </div>
      </Content>
    </>
  );
}
