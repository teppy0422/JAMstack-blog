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
  Icon,
  createIcon,
  Spacer,
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
import UnderlinedTextWithDrawer from "./UnderlinedTextWithDrawer";
import { useUserData } from "../../hooks/useUserData";
import { useUserInfo } from "../../hooks/useUserId";
import { useReadCount } from "../../hooks/useReadCount";

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
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const readByCount = useReadCount(userId);

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
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/112.jpg" />
              <Avatar src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp" />
            </AvatarGroup>
            <Text>@ou @kataoka</Text>
            <Spacer />
            <Flex justifyContent="flex-end">
              <Text>
                <Icon as={CustomIcon} mr={0} />
                {readByCount}
              </Text>
            </Flex>
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
            更新日:2024-11-20
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
            <UnderlinedTextWithDrawer
              text="開発の背景"
              onOpen={() => handleOpen("開発の背景")}
              isOpen={isOpen && activeDrawer === "開発の背景"}
              onClose={handleClose}
              header="開発の背景"
              size="md"
              children={
                <Box>
                  <Image src="/images/0005/0005.png" w="100%" />

                  <Text mt={4}>
                    高知工場の王さんの提案を元に作成しました。
                    当初は電線サブナンバーしか考えていませんでしたが、途中で端末サブナンバーも必要やなと思って追加しました。
                  </Text>
                </Box>
              }
            />
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
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <Image src="/images/0005/0001.svg" alt="0001.png" />
          </Flex>
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
          <Text>旧の生産準備+から出力します</Text>
          <Text fontWeight="400" my={4}>
            3-1.旧の生産準備+から「MENU」をクリック
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image src="/images/0005/old_menu.png" alt="old_menu.png" w="50%" />
          </Flex>
          <Text fontWeight="400" my={4}>
            3-2.「サブナンバー引越し」をクリック
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/old_menu2.png"
              alt="old_menu2.png"
              w="50%"
            />
          </Flex>
          <Text fontWeight="400" my={4}>
            3-3.「メイン品番」で出力をクリック
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/old_menu3.png"
              alt="old_menu3.png"
              w="50%"
            />
          </Flex>
          <Text fontWeight="400" my={4}>
            3-4.一時保管場所(B01_サブナンバー引越し)に出力されました
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/old_menu4.png"
              alt="old_menu4.png"
              w="70%"
            />
          </Flex>
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
          <Text>新の製品品番から取得します</Text>
          <Text fontWeight="400" my={4}>
            4-1.旧メイン品番の項目に引き継ぎたい製品品番(旧)を入力
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image src="/images/0005/new_menu.png" alt="new_menu.png" w="50%" />
          </Flex>
          <Text fontWeight="400" my={4}>
            4-2.「旧メイン品番で取得」をクリック
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/new_menu2.png"
              alt="new_menu2.png"
              w="50%"
            />
          </Flex>
          <Text fontWeight="400" my={4}>
            4-3.旧のサブナンバーが取得されました
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/new_menu3.png"
              alt="new_menu3.png"
              w="100%"
            />
          </Flex>
          <Text fontWeight="400" my={4}>
            4-4.旧のサブナンバーが取得されました
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Box bg="gray.300" color="black" w="50%" p={1}>
              PVSW_RLTFに電線サブナンバーを取得
            </Box>
            <Image
              src="/images/0005/new_menu4.png"
              alt="new_menu4.png"
              w="50%"
            />
            <Box bg="gray.300" color="black" w="70%" p={1} mt={5}>
              端末一覧に端末サブナンバーを取得
            </Box>
            <Image
              src="/images/0005/new_menu5.png"
              alt="new_menu5.png"
              w="70%"
            />
          </Flex>
          <Text mt={2}>
            ※取得したサブナンバーは<strong>太字</strong>になります
          </Text>
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
                fontWeight: "200",
              }}
            >
              このようにサブナンバーを任意の製品品番から取得出来る為、類似した製品形態から取得するのも良いかもしれません
            </Text>
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
