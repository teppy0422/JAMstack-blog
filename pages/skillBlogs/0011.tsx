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
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import DownloadLink from "./DownloadLink";
import ExternalLink from "./ExternalLink";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ImageSliderModal from "./ImageSliderModal"; // モーダルコンポーネントをインポート
import ReferenceSettingModal from "./referenceSettingModal";
import { useUserContext } from "../../context/useUserContext";
import { supabase } from "@/utils/supabase/client";
import { useReadCount } from "../../hooks/useReadCount";

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

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
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

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
              ja: "PC初回セットアップ手順",
              us: "PC First Time Setup Procedure",
              cn: "电脑首次设置程序",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "順立生産システム",
              language,
            })}
          />
          <CustomBadge
            text={getMessage({
              ja: "作成途中",
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
            :2024-12-07
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
            <Text>
              {getMessage({
                ja: "順立生産システムでは初回だけPCのセットアップが必要です。",
                us: "The sequential production system requires PC setup only for the first time.",
                cn: "顺序生产系统只要求首次设置 PC。",
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
              ja: "インストールソフトについて",
              us: "About Installation Software",
              cn: "关于安装软件",
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
              {getMessage({
                ja: "現在のバージョンでは下記の他社製品を含んでいます。",
                us: "The current version includes the following third-party products",
                cn: "当前版本包括以下第三方产品。",
                language,
              })}
              <br />
              {"・" +
                getMessage({
                  ja: "RS-RecieverLight(シリアル受信)",
                  us: "RS-RecieverLight (serial receive)",
                  cn: "RS-Reciever 灯（串行接收）",
                  language,
                })}
              <br />
              {"・" +
                getMessage({
                  ja: "さくらさくQR(QR作成)",
                  us: "さくらさくQR (QR creation)",
                  cn: "さくらさくQR（QR 创建）",
                  language,
                })}
              <br />
              <br />
              {getMessage({
                ja: "これによりここでPCセットアップの全てを解説する事が出来ません。",
                us: "This makes it impossible to explain the entire PC setup here.",
                cn: "因此，无法在此对 PC 设置的所有方面进行说明。",
                language,
              })}
              <br />
              {getMessage({
                ja: "WEBサービス開始後に上記機能を自作してセットアップ手順を記載します。",
                us: "After the web service is started, we will describe the setup procedure by creating the above functions by ourselves.",
                cn: "网络服务启动后，将自行设计上述功能，并介绍设置程序。",
                language,
              })}
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section99"
          title={
            "99." +
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
                fontWeight: "400",
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
        <Box h="3vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
