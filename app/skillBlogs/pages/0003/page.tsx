"use client";

import React, { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  List,
  ListItem,
  Divider,
  ChakraProvider,
  extendTheme,
  IconButton,
  Badge,
  Avatar,
  Code,
  Image,
  Kbd,
  Center,
  Flex,
  Icon,
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { LuPanelRightOpen } from "react-icons/lu";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "@/components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/CustomBadge";
import ModalWork from "@/components/modalWork";
import ImageCard from "../../components/imageCard";
import Detail01 from "../../components/worksDetail/01";
import Detail01talk from "../../components/worksDetail/01_talk";
import Detail02 from "../../components/worksDetail/02";
import Detail02talk from "../../components/worksDetail/02_talk";
import Detail03 from "../../components/worksDetail/03";

import { useUserContext } from "@/contexts/useUserContext";
import { useReadCount } from "@/hooks/useReadCount";

import styles from "@/styles/home.module.scss";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
//テキストジャンプアニメーション
const jumpAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
`;
//Kbdのスタイル
const kbdStyle = {
  border: "1px solid",
  fontSize: "16px",
  bg: "white",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};
const CustomIcon = createIcon({
  displayName: "CustomIcon",
  viewBox: "0 0 26 26",
  path: (
    <path
      d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
});
const BlogPage: React.FC = () => {
  const { currentUserId } = useUserContext();
  const { readByCount } = useReadCount(currentUserId);
  const { language, setLanguage } = useLanguage();
  //右リストの読み込みをlanguage取得後にする
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  useEffect(() => {
    if (language) {
      setIsLanguageLoaded(true);
    }
  }, [language]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const showToast = useCustomToast();
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
    return <div>Loading...</div>; // 言語がロードされるまでのプレースホルダー
  }
  const skillCards = [
    {
      title: getMessage({
        ja: "生産準備+",
        language,
      }),
      subTitle: getMessage({
        ja: "画像を自動で作る",
        us: "Automatic image creation",
        cn: "自动创建图像",
        language,
      }),
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
      titleTalk: getMessage({
        ja: "詳細(第1話)を見る",
        us: "Details (Episode 1)",
        cn: "详情（第 1 集）",
        language,
      }),
    },
    {
      title: getMessage({
        ja: "導通検査",
        language,
      }),
      subTitle: getMessage({
        ja: "WEB技術の基礎",
        us: "Fundamentals of Web Technology",
        cn: "网络技术基础",
        language,
      }),
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
      titleTalk: getMessage({
        ja: "詳細(第2話)を見る",
        us: "Details (Episode 2)",
        cn: "详情（第 2 集）",
        language,
      }),
    },
    {
      title: getMessage({
        ja: "誘導ナビ.net",
        language,
      }),
      subTitle: getMessage({
        ja: "マイコン",
        us: "microcomputer",
        cn: "微机",
        language,
      }),
      eyeCatchPath: "/images/detail_03_title.png",
      detail: <Detail03 />,
      detailTalk: (
        <Center>
          {getMessage({
            ja: "そのうち追記します",
            us: "I'll add it soon.",
            cn: "我将在适当的时候补充这一点。",
            language,
          })}
        </Center>
      ),
      rate: 4,
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
      titleTalk: getMessage({
        ja: "詳細(第3話)を見る",
        us: "Details (Episode 3)",
        cn: "详情（第 3 集）",
        language,
      }),
    },
  ];
  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <Avatar
              size="xs"
              src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
              borderWidth={1}
            />
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>
              {getMessage({
                ja: "開発",
                language,
              })}
            </Text>
            <Spacer />
            <Flex justifyContent="flex-end">
              <Text>
                <Icon as={CustomIcon} mr={0} />
                {readByCount}
              </Text>
            </Flex>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "改善活動の参考事例集",
              us: "Reference Case Studies of Improvement Activities",
              cn: "改进活动的参考案例研究。",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "参考",
              us: "consultation",
              cn: "参考",
              language,
            })}
          />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            {getMessage({
              ja: "更新日",
              language,
            })}
            :2024-11-18
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title={
            "1." +
            getMessage({
              ja: "はじめに",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box ml={4}>
            <Text>
              {getMessage({
                ja: "現場の意見と相談しながらどのように改善していくかを試行錯誤した経験をまとめていきます。改善を進める人の参考になれば幸いです。",
                us: "This section summarizes our trial-and-error experience on how to make improvements in consultation with opinions from the field. We hope it will be helpful to those who promote improvements.",
                cn: "本节总结了我们在征求实地意见的基础上进行改进的试错经验。希望能对推动改进工作的人员有所帮助。",
                language,
              })}
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "",
              us: "Business improvement using ",
              cn: "",
              language,
            }) +
            getMessage({
              ja: "生産準備+",
              language,
            }) +
            getMessage({
              ja: "を使った業務改善",
              us: "",
              cn: " 使用以下方法改进操作",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box ml={4}>
            <Text>
              {getMessage({
                ja: "デフォルメしています。娘は居ません。",
                us: "I'm deformed. I don't have a daughter.",
                cn: "畸形。没有女儿",
                language,
              })}
            </Text>
            <Box
              mt={4}
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
            >
              {skillCards.map((item, index) => {
                return (
                  <Box display={"inline-block"} key={index} textAlign="center">
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
                      <Box className={styles.cardList}>
                        <Box className={styles.balloon} boxShadow="md">
                          {item.titleTalk}
                        </Box>
                      </Box>
                    </ModalWork>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "まとめ",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box
            height="80vh"
            style={{
              backgroundImage:
                "url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              position: "relative",
            }}
          >
            <Text
              style={{
                padding: "13px",
                paddingTop: "20px",
                textAlign: "left",
                color: "#fff",
                textShadow: "none",
                fontFamily: "'Yomogi', sans-serif",
                fontWeight: "bold",
              }}
            ></Text>
            <Image
              src="/images/hippo.gif"
              alt="Hippo"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "50px",
              }}
            />
          </Box>
        </SectionBox>
        <Box h="0.01vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
