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
              <Avatar src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/112.jpg" />
              <Avatar src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp" />
            </AvatarGroup>
            <Text>@ou @kataoka</Text>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            サブナンバー引越しのやり方
          </Heading>
          <CustomBadge text="生準+" />
          <CustomBadge text="高知" />
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
              マイナーチェンジって旧製品品番と新製品品番でサブ形態が殆ど変わらない事が多いですよね？
              そこで「サブナンバーを引越し」させる機能を追加しました。
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.全体の流れ"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>下図の流れで実行します</Text>
          <Image src="/images/dio/0001.svg" alt="0001.png" />
        </SectionBox>
        <SectionBox
          id="section3"
          title="3.サブナンバーの出力"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>旧製品品番を含む生産準備+から出力します</Text>
          <Text textAlign="center">---作成途中---</Text>
        </SectionBox>
        <SectionBox
          id="section4"
          title="4.サブナンバーの取得"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text textAlign="center">---作成途中---</Text>
        </SectionBox>
        <SectionBox
          id="section5"
          title="5.まとめ"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text textAlign="center">---作成途中---</Text>
        </SectionBox>
        <Box height="100vh"></Box>
      </Frame>
    </>
  );
};

export default BlogPage;
