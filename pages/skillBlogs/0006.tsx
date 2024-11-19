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
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";

import "@fontsource/noto-sans-jp";

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
const BlogPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const showToast = useCustomToast();
  //64pxまでスクロールしないとサイドバーが表示されないから暫定
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64; // 64pxのオフセット
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100); // 100msの遅延を追加
    } else {
      window.scrollTo(0, 150);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, []);
  //#の位置にスクロールした時のアクティブなセクションを装飾
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-64px 0px -99% 0px", threshold: 0 }
    );
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  //#クリックした時のオフセット
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64; // 64pxのオフセット
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange, false);
    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
    };
  }, []);
  //アンダーライン付きテキスト_ドロワー
  const UnderlinedTextWithDrawer = ({
    text,
    onOpen,
    isOpen,
    onClose,
    header,
    children,
  }) => {
    const { colorMode } = useColorMode();
    const color = colorMode === "light" ? "blue.500" : "blue.200";
    return (
      <>
        <HStack
          as="span"
          style={{ whiteSpace: "nowrap" }}
          color={color}
          cursor="pointer"
          onClick={onOpen}
          spacing={1}
          borderBottom="2px solid"
          borderColor={color}
          display="inline"
        >
          <Box as="span" display="inline">
            {text}
          </Box>
          <LuPanelRightOpen
            size="20px"
            style={{ marginBottom: "-3px", display: "inline" }}
          />
        </HStack>
        <BasicDrawer isOpen={isOpen} onClose={onClose} header={header}>
          {children}
        </BasicDrawer>
      </>
    );
  };
  const handleOpen = (drawerName: string) => {
    setActiveDrawer(drawerName);
    onOpen();
  };
  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
  };

  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box>
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp" />
            </AvatarGroup>
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>開発</Text>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            生産準備+とは
          </Heading>
          <CustomBadge text="生準+" />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            更新日:2024-11-19
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title="1.はじめに"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box>
            <Text fontWeight="bold"></Text>
            <Text>
              ワイヤーハーネスの品番切替には多くの時間が掛かります。
              特に従来のハメ図から写真のハメ図に置き換えるのが大変です。
              そこで、より効率良くハメ図を作成するシステムを作成しました。
              その後、現場の意見を聞きながら更新を続けています。
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.できること"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <video width="100%" height="100%" loop autoPlay muted>
            <source src="/images/0006/SjpPromotion.mp4" type="video/mp4" />
            お使いのブラウザは動画タグをサポートしていません。
          </video>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              2-1.コネクタ写真と座標の共用(.xlsm)
            </Text>
            <Text ml={4}>
              撮影した写真/座標を共用する事が可能。2024/11/19時点で1680点が登録済みです。
            </Text>
            <Text fontWeight="400" my={4}>
              2-2.ハメ図の作成(.xlsm)
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Tooltip
                label="通常のハメ図です。詰栓や先ハメ付属部品はこのように表示されます。"
                placement="top"
              >
                <Image
                  src="/images/0006/1_150_all.png"
                  width="55%"
                  alt="1_150_all.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
              <Tooltip
                label="ボンダーは線長順で表示され各行き先の端末No.が分かるようになっています。"
                placement="top"
              >
                <Image
                  src="/images/0006/1_434_all.png"
                  alt="1_434_all.png"
                  maxWidth="37%"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
            </Flex>
            <Text fontWeight="400" my={4}>
              2-3.共通ハメ図の作成(.xlsm)
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Tooltip label="製品品番220のハメ図" placement="top">
                <Image
                  src="/images/0006/4_516_all.png"
                  width="45%"
                  alt="4_516_all.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
              <Tooltip label="製品品番310/131のハメ図" placement="top">
                <Image
                  src="/images/0006/3_516_all.png"
                  maxWidth="42%"
                  alt="3_516_all.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
            </Flex>
            <Text fontWeight="400" my={4}>
              2-4.サブナンバーの印刷
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Tooltip label="生産準備+のサブナンバーを印刷" placement="top">
                <Image
                  src="/images/0006/printF1.png"
                  maxWidth="90%"
                  alt="printF1.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
            </Flex>

            <Text fontWeight="400" my={4}>
              2-5.ポイントナンバー点滅(.html)
            </Text>
            <Box display="flex" justifyContent="center" width="100%">
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0006/1335.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
            </Box>
            <Text fontWeight="400" my={4}>
              2-6.配策経路ナビ(.html)
            </Text>
            <Box display="flex" justifyContent="center" width="100%">
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0006/0084.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
            </Box>
            <Text fontWeight="400" my={4}>
              2-7.MKEDへの回路符号入力
            </Text>
            <Box display="flex" justifyContent="center" width="100%">
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0006/v4220.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
            </Box>
            <Text fontWeight="400" my={4}>
              2-8.その他
            </Text>
            <Text>#サブ図</Text>
            <Text>#竿レイアウト→自動機データ作成</Text>
            <Text>#先ハメ誘導ナビ</Text>
            <Text>#部品箱の表示作成(TEPRA)</Text>
            <Text>#電線仕分け表</Text>
            <Text>#サブリスト</Text>
            <Text>#EXTESからの共通化分析リクエストの実行</Text>
          </Box>
          <Text textAlign="center">---作成途中---</Text>
        </SectionBox>
        <SectionBox
          id="section3"
          title="3.まとめ"
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
