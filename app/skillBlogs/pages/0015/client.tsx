"use client";

import React, { useEffect, useState, useRef } from "react";
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
  createIcon,
  Spacer,
  Center,
  useColorMode,
  useToast,
  OrderedList,
} from "@chakra-ui/react";

import { PiAppWindowFill, PiArrowFatLineDownLight } from "react-icons/pi";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "@/components/content";
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
import { ImageWithHighlight } from "../../../../src/components/ImageWidthHighlight";
import VBATrustSettingsPage from "@/components/howto/office/VbaTrustSettings";

import ModalYps from "app/downloads/tabs/yps/yps";
import BorderBox from "@/components/ui/BorderBox";
import { downloadLatestFile } from "@/lib/downloadLatestFile";
import CodeBlock from "@/components/CodeBlock";

import SchedulePage from "./parts/SchedulePage";
import DataFlowDiagram from "app/skillBlogs/pages/0015/parts/DataFlowDiagram";

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

  const { setLanguage } = useLanguage();
  //右リストの読み込みをlanguage取得後にする
  const { language } = useLanguage();
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
  const toast = useToast();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

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
              ja: "PreHarnessPro(仮)",
              us: "",
              cn: "",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "名称未定",
              us: "",
              cn: "",
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
            :2025-07-18
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
          <Box>
            <Text whiteSpace="pre-line">
              {getMessage({
                ja: "7/10に交付決定。",
                us: "",
                cn: "",
                language,
              })}
            </Text>
            <Text whiteSpace="pre-line">
              {getMessage({
                ja: "事業終了期限の9/30に間に合わない場合は片岡が社労士に連絡する。",
                us: "",
                cn: "",
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
              ja: "日程",
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
          <SchedulePage />
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "アプリ開発の定義",
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
          <Box>
            <Text>
              ・ローカルアプリとして作成しインターネット接続しないオフライン運用とする
            </Text>
            <Text>・Windows/Macでのみ動作する</Text>
            <Text>・CPUはIntelまたはAMD(64bit)のみ動作する</Text>
            <Text>・ARMは別途対応が必要なので必要なら連絡してください</Text>
            <Text>最近のSurfaceのCPUはWindowsじゃないので動作しません</Text>
            <Text>Androidタブレットは動作しません</Text>
            <Text>・1つのアプリに全ての機能を搭載して複数作成しない</Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "購入について",
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
          <Box>
            <Text>・システム開発に必要な物は片岡が各1点ずつ購入</Text>
            <Text>・残り必要なものは有限会社ウエダ様で購入</Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section5"
          title={
            "5." +
            getMessage({
              ja: "アプリの機能",
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
          <Box>
            <Text>・ログイン</Text>
            <Text>・圧着作業実績</Text>
            <Text>・出荷作業実績</Text>
            <Text>・実績出力</Text>
            <Text>・実績印刷</Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "機能の追加提案",
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
          <Box>
            <Text>・外国語に対応</Text>
            <Text>・過去の不良実績がある条件は警告を表示機能</Text>
          </Box>
        </SectionBox>

        <SectionBox
          id="section7"
          title={
            "7." +
            getMessage({
              ja: "データフロー",
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
          <Box>
            <Text whiteSpace="pre-line">
              {getMessage({
                ja: "",
                us: "",
                cn: "",
                language,
              })}
            </Text>
            <DataFlowDiagram />
            <OrderedList spacing={1} fontSize="xs">
              <ListItem>切断データ(RLTF-AまたはB)</ListItem>
              <ListItem>TCSSC</ListItem>
              <ListItem>規格表画像</ListItem>
            </OrderedList>
          </Box>
        </SectionBox>
        <SectionBox
          id="section13"
          title={
            "13." +
            getMessage({
              ja: "まとめ",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box
            style={{
              backgroundImage:
                "url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              position: "relative",
            }}
            borderRadius="10px"
            pb="10vh"
          >
            <Text
              px="13px"
              py="20px"
              style={{
                textAlign: "left",
                color: "#fff",
                textShadow: "none",
                fontWeight: "400",
              }}
              lineHeight={1.6}
            >
              {getMessage({
                ja: "外部データの利用には四国部品様の協力が必要で内容が変わる可能性が高いです。適宜更新していきます。",
                us: "This system is actually in operation, but it is incomplete and contains the following problems",
                cn: "该系统已实际运行，但并不完整，存在以下问题",
                language,
              })}
            </Text>
          </Box>
        </SectionBox>
      </Frame>
    </>
  );
};

export default BlogPage;
