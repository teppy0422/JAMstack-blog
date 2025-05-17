"use client";

import React, { useEffect, useState, useRef, useContext } from "react";
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
  Flex,
  Icon,
  createIcon,
  Spacer,
  useColorMode,
  Grid,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";
import { CiBeerMugFull } from "react-icons/ci";
import Content from "@/components/content";
import { useCustomToast } from "@/components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/CustomBadge";
import SkillGraph from "../../components/sillGraph";
import BusinessCard from "../../components/BusinessCard";
import ICT from "../../components/ICT/page";
import styles from "@/styles/home.module.scss";
import { useUserContext } from "@/contexts/useUserContext";
import { useReadCount } from "@/hooks/useReadCount";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const customTheme = extendTheme({
  fonts: {
    heading: "'Noto Sans JP', sans-serif",
    body: "'Noto Sans JP', sans-serif",
  },
  fontWeights: {
    normal: 200,
    medium: 300,
    bold: 400,
    light: 300,
    extraLight: 100,
  },
});
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

  const handleOpen = (drawerName: string) => {
    setActiveDrawer(drawerName);
    onOpen();
  };
  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
  };

  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
    return <div>Loading...</div>; // 言語がロードされるまでのプレースホルダー
  }
  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs} isThrough={true}>
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
              ja: "開発スタッフ",
              us: "Development Staff",
              cn: "开发人员",
              language,
            })}
          </Heading>
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            {getMessage({
              ja: "更新日",
              language,
            })}
            :2025-2-6
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title={getMessage({
            ja: "1.片岡 哲兵",
            us: "1.Kataoka Teppei",
            cn: "1.片岡 哲兵",
            language,
          })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <BusinessCard />
          {/* 必要に応じて他のBusinessCardを追加 */}
          <Flex alignItems="left" m={4} mt={6}>
            <Flex alignItems="center" borderBottom="1px solid">
              <Icon as={CiBeerMugFull} w={6} h={6} />
              <ICT />
            </Flex>
          </Flex>
        </SectionBox>
        <SectionBox
          id="section2"
          title={getMessage({
            ja: "2.このサイトについて",
            us: "2.About this site",
            cn: "2.关于本网站",
            language,
          })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box
            height="auto"
            style={{
              backgroundImage:
                "url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              position: "relative",
            }}
            pb="5vh"
          >
            <Text
              style={{
                padding: "13px",
                paddingTop: "20px",
                textAlign: "left",
                color: "#fff",
                textShadow: "none",
                fontFamily: "'Yomogi', sans-serif",
                fontWeight: "100",
              }}
            >
              {getMessage({
                ja: "このWEBサイトは効率良く活動を進めるために作成しました。",
                us: "This web site was created to promote activities efficiently.",
                cn: "创建该网站的目的是为了有效地宣传各项活动。",
                language,
              })}
              <br />
              {getMessage({
                ja: "たとえば従来のメール連絡だと下記が不都合でした。",
                us: "For example, the following were inconvenient with conventional e-mail communication",
                cn: "例如，传统的电子邮件通信有以下不便之处",
                language,
              })}
              <br />
              {getMessage({
                ja: "1.送信できるファイルサイズが小さい(2MB程度)",
                us: "1. Small file size (about 2MB) that can be sent",
                cn: "1. 可发送的文件大小较小（约 2 MB）",
                language,
              })}
              <br />
              {getMessage({
                ja: "2.過去のやりとりの確認がし辛い",
                us: "2. It is hard to confirm past correspondence.",
                cn: "2. 难以检查过去的通信",
                language,
              })}
              <br />
              <br />
              {getMessage({
                ja: "そこで、LINEのようなリアルタイムチャットを用意しました。",
                us: "Therefore, we have prepared a real-time chat like LINE.",
                cn: "因此，我们准备了一个类似 LINE 的实时聊天系统。",
                language,
              })}
              <br />
              {getMessage({
                ja: "1.管理者が認証したアカウントのみ閲覧可能",
                us: "1. Only accounts authenticated by the administrator can be viewed",
                cn: "1. 只有管理员授权的账户才能查看。",
                language,
              })}
              <br />
              {getMessage({
                ja: "2.他社のやりとりは閲覧不可",
                us: "2. Interactions with other companies are not viewable.",
                cn: "2. 无法查看与其他公司的交流。",
                language,
              })}
              <br />
              <br />
              {getMessage({
                ja: "その他、最新のプログラムのダウンロードや使い方を載せていきます。",
                us: "We will also post the latest program downloads and instructions on how to use them.",
                cn: "此外，还将张贴最新的程序下载和使用说明。",
                language,
              })}
              <br />
              <br />
              <br />
              {getMessage({
                ja: "このサイトのソースコードはGitHubに公開しています。",
                us: "The source code for this site is available on GitHub.",
                cn: "该网站的源代码可在 GitHub 上获取。",
                language,
              })}
              <br />
              {getMessage({
                ja: "レポジトリは JAMstack-blog。 自由に使って構いません。",
                us: "",
                cn: "",
                language,
              })}
              <br />
              {getMessage({
                ja: "※チャット内容/添付ファイル/ユーザー情報/その他一部のファイルはsupabase内にあるのでアクセス出来ない事をご了承ください。",
                us: "Please note that the chat contents/attachments/user information and some other files are in supabase and cannot be accessed.",
                cn: "请注意，聊天内容/附件/用户信息和其他一些文件位于 SUPABASE 中，无法访问。",
                language,
              })}
              <br />
              <br />
              {getMessage({
                ja: "Next.js + TypeScriptで書いています",
                us: "Written in Next.js + TypeScript",
                cn: "使用 Next.js + TypeScript 编写",
                language,
              })}
              <br />
              {getMessage({
                ja: "CSSフレームワークはChakraUI",
                us: "CSS framework is ChakraUI",
                cn: "CSS 框架是 ChakraUI。",
                language,
              })}
              <br />
              {getMessage({
                ja: "データベースはVercel + supabase",
                us: "Database is Vercel + supabase",
                cn: "数据库是 Vercel + supabase。",
                language,
              })}
              <br />
              {getMessage({
                ja: "ブログはmicroCMS",
                us: "Blog is microCMS",
                cn: "博客是 microCMS。",
                language,
              })}
            </Text>
            <Flex alignItems="left" m={4} mt={6}>
              <Link href="https://github.com/teppy0422" isExternal>
                <Flex alignItems="center">
                  <Icon as={FaGithub} w={6} h={6} />
                  <Text ml={2}>GitHub</Text>
                </Flex>
              </Link>
            </Flex>
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
        <Box h="10vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
