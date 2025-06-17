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
  ListIcon,
  Divider,
  ChakraProvider,
  extendTheme,
  IconButton,
  Badge,
  Avatar,
  Code,
  Image,
  Kbd,
  AvatarGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Icon,
  createIcon,
  Spacer,
  Center,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import {
  FaFile,
  FaRegEdit,
  FaFolder,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { PiAppWindowFill, PiArrowFatLineDownLight } from "react-icons/pi";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "@/components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "@/components/ui/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/ui/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/ui/CustomBadge";
import DownloadLink from "../../components/DownloadLink";
import UnderlinedTextWithDrawer from "../../components/UnderlinedTextWithDrawer";
import ExternalLink from "../../components/ExternalLink";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ReferenceSettingModal from "../../../../src/components/howto/office/referenceSettingModal";
import { useUserContext } from "@/contexts/useUserContext";
import { supabase } from "@/utils/supabase/client";
import { getIpAddress } from "@/lib/getIpAddress";
import { BsFiletypeExe } from "react-icons/bs";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import DownloadButton from "@/components/ui/DownloadButton2";
import UnzipModal from "@/components/howto/os/UnzipModal";
import FontInstallModal from "@/components/howto/os/FontInstall";
import { getLocalIp } from "../../components/getLocalIp";
import { Key } from "@/components/ui/Key";
import { FaviconLinkItem } from "app/skillBlogs/components/FaviconLinkItem";
import { CustomModal } from "@/components/ui/CustomModal";

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
  const {
    currentUserId,
    currentUserName,
    currentUserMainCompany,
    currentUserCompany,
    currentUserCreatedAt,
    getUserById,
    isLoading: isLoadingContext,
  } = useUserContext();

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
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const showToast = useCustomToast();
  // 点滅アニメーションを定義
  const blink = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  `;

  const blinkAnimation = `${blink} 0.8s infinite`;
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
  }

  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                borderWidth={1}
              />
            </AvatarGroup>
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>
              {getMessage({
                ja: "開発",
                language,
              })}
            </Text>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "おすすめWEBサイトとアプリ",
              us: "Website/Application",
              cn: "网站/应用程序",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "ツール",
              us: "Tools",
              cn: "工具",
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
            :2025-05-29
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
          mt="0"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box>
            <Text pl={3}>
              {getMessage({
                ja: "役立ちそうなサイトをまとめていきます",
                us: "We will compile a list of sites that may be useful.",
                cn: "我们将汇编一份有用的网站清单。",
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
              ja: "画像",
              us: "image",
              cn: "图片",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="0"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <List spacing={1} mb={6} styleType="decimal" pl={5}>
            <ListItem>
              <FaviconLinkItem
                href="https://saruwakakun.com/tools/png-jpeg-to-webp/"
                mainText={getMessage({
                  ja: "サルワカ",
                  us: "Convert image to .webp",
                  cn: "将图像转换为 .webp",
                  language,
                })}
                subText={getMessage({
                  ja: "webpに変換。拡張子が大文字の場合は.webpにならないから小文字してから変換がおすすめ。",
                  us: "Convert to webp. If the extension is in uppercase, it won't become .webp, so it's better to convert it to lowercase.",
                  cn: "转换为 webp。如果扩展名是大写的，就不会变成 .webp，所以最好先更正为小写，然后再转换。",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://youcompress.com/ja/webp/"
                mainText={getMessage({
                  ja: "YOUCOMPRESS",
                  language,
                })}
                subText={getMessage({
                  ja: "webpを圧縮。圧縮率は0-20%くらい。",
                  us: "Compress webp. Compression ratio is about 0-20%.",
                  cn: "压缩 webp。压缩率约为 0-20%。",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://www.iloveimg.com/ja/compress-image/compress-png"
                mainText={getMessage({
                  ja: "I LOVE IMG",
                  language,
                })}
                subText={getMessage({
                  ja: "pngを圧縮。圧縮率30-60%くらい。",
                  us: "Compress webp. Compression ratio is about 0-20%.",
                  cn: "压缩 webp。压缩率约为 0-20%。",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://www.remove.bg/ja"
                mainText={getMessage({
                  ja: "remove bg",
                  language,
                })}
                subText={getMessage({
                  ja: "背景を透過。",
                  us: "Transparent background",
                  cn: "透明背景",
                  language,
                })}
              />
            </ListItem>
          </List>
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "フォント",
              us: "Fonts",
              cn: "字体",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="0"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <List spacing={1} mb={6} styleType="decimal" pl={5}>
            <ListItem>
              <FaviconLinkItem
                href="https://fonts.google.com/"
                mainText={getMessage({
                  ja: "Google Fonts",
                  language,
                })}
                subText={getMessage({
                  ja: "定番のサイト。種類が多くてPCやWEBで利用が可能。",
                  us: "Google Fonts. Many types are available for PC and web.",
                  cn: "谷歌字体。可用于个人电脑和网络，种类繁多。",
                  language,
                })}
              />
            </ListItem>
          </List>
        </SectionBox>
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "アイコン",
              us: "Icons",
              cn: "图标",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="0"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <List spacing={1} mb={6} styleType="decimal" pl={5}>
            <ListItem>
              <FaviconLinkItem
                href="https://react-icons.github.io/react-icons/"
                mainText={getMessage({
                  ja: "React Icons",
                  language,
                })}
                subText={getMessage({
                  ja: "WEBサイト用。表示されるアイコンはSVGだからデベロッパーツールでコード取得したら.svgとしても使える。",
                  us: "Google Fonts. Many types are available for PC and web.",
                  cn: "谷歌字体。可用于个人电脑和网络，种类繁多。",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://fontawesome.com/"
                mainText={getMessage({
                  ja: "Font Awesome",
                  language,
                })}
                subText={getMessage({
                  ja: "フォントのように使えるアイコン集。デザインパターンは豊富。通常のアイコンと使い方が違うから注意。",
                  us: "Google Fonts. Many types are available for PC and web.",
                  cn: "谷歌字体。可用于个人电脑和网络，种类繁多。",
                  language,
                })}
              />
            </ListItem>
          </List>
        </SectionBox>
        <SectionBox
          id="section5"
          title={
            "5." +
            getMessage({
              ja: "AI",
              us: "AI",
              cn: "人工智能",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="0"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <List spacing={1} mb={6} styleType="decimal" pl={5}>
            <ListItem>
              <FaviconLinkItem
                href="https://chatgpt.com/"
                mainText={getMessage({
                  ja: "Chat-GPT",
                  language,
                })}
                subText={getMessage({
                  ja: "テキストベースなAIサイト。ログインが必要。",
                  us: "Standard AI site. Login required.",
                  cn: "标准人工智能网站。需要登录。",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://suno.com/create?wid=default&page=1/"
                mainText={getMessage({
                  ja: "SUNO",
                  language,
                })}
                subText={getMessage({
                  ja: "音楽生成AI。自然な日本語に対応。ログインが必要。",
                  us: "Music generation AI. natural Japanese language support.",
                  cn: "支持自然日语。",
                  language,
                })}
              />
            </ListItem>
          </List>
        </SectionBox>
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "WEB開発",
              us: "",
              cn: "",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="0"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <List spacing={1} mb={6} styleType="decimal" pl={5}>
            <ListItem>
              <FaviconLinkItem
                href="https://nextjs.org/"
                mainText={getMessage({
                  ja: "Next.js",
                  language,
                })}
                subText={getMessage({
                  ja: "Reactをもっと便利にしてくれるツールの詰め合わせ。",
                  us: "An assortment of tools to make React more useful.",
                  cn: "让 React 更有用的各种工具。",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://chakra-ui.com/"
                mainText={getMessage({
                  ja: "Chakra",
                  language,
                })}
                subText={getMessage({
                  ja: "Next.jsなどで使える コンポーネントライブラリ のひとつです。",
                  us: "It is one of the component libraries that can be used with Next.js and others.",
                  cn: "例如，它是可与 Next.js 一起使用的组件库之一。",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://supabase.com/"
                mainText={getMessage({
                  ja: "supabase",
                  language,
                })}
                subText={getMessage({
                  ja: "バックエンド即席サービス。",
                  us: "Back-end immediate service.",
                  cn: "后端简易服务",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://vercel.com/"
                mainText={getMessage({
                  ja: "Vercel",
                  language,
                })}
                subText={getMessage({
                  ja: "フロントエンドを簡単に公開できるホスティングサービス。GitHubと連携可能。",
                  us: "A hosting service that makes it easy to publish your front end, and can be integrated with GitHub.",
                  cn: "可轻松发布前端的托管服务；可与 GitHub 集成。",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://github.com/"
                mainText={getMessage({
                  ja: "GitHub",
                  language,
                })}
                subText={getMessage({
                  ja: "コードを置いておく倉庫みたいな場所。",
                  us: "A warehouse-like place to keep the cords.",
                  cn: "一个像仓库一样的地方，用来存放电线。",
                  language,
                })}
              />
            </ListItem>
            <ListItem>
              <FaviconLinkItem
                href="https://microcms.io/"
                mainText={getMessage({
                  ja: "MicroSMC",
                  language,
                })}
                subText={getMessage({
                  ja: "管理画面でコンテンツを作成 → APIでデータ取得できるCMS。",
                  us: "Create content on the admin screen → CMS that can retrieve data via API",
                  cn: "在管理屏幕上创建内容 → 内容管理系统可通过应用程序接口检索数据",
                  language,
                })}
              />
            </ListItem>
          </List>
        </SectionBox>
      </Frame>
    </>
  );
};

export default BlogPage;
