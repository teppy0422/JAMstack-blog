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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import Content from "./content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "./customToast";
import { useDisclosure } from "@chakra-ui/react";
import { useUserInfo } from "../hooks/useUserId";
import { useUserData } from "../hooks/useUserData";

import "@fontsource/noto-sans-jp";
import "@fontsource/yomogi";

const customTheme = extendTheme({
  fonts: {
    heading: ",'Noto Sans JP', sans-serif",
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

const Frame: React.FC<{
  children: React.ReactNode;
  sections?: any;
  sectionRefs?: React.RefObject<HTMLElement[]> | null;
}> = ({ children, sections, sectionRefs }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const showToast = useCustomToast();
  const [ipAddress, setIpAddress] = useState("");

  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
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
    if (typeof window !== "undefined" && sectionRefs?.current) {
      const sectionsToObserve = sectionRefs.current;
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

      sectionsToObserve.forEach((section) => {
        if (section) observer.observe(section);
      });

      return () => {
        sectionsToObserve.forEach((section) => {
          if (section) observer.unobserve(section);
        });
      };
    }
  }, [sectionRefs]);
  //#クリックした時のオフセット
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -50;
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

  //現在のパスを取得
  const [currentPath, setCurrentPath] = useState("");
  const [accordionIndex, setAccordionIndex] = useState<number[]>([]);
  const createLinkPanel = (path: string, text: string) => {
    const linkStyles = {
      fontSize: "13px",
      ml: 4,
      p: 1,
      borderRadius: "6px",
      bg: currentPath === path ? "gray.500" : "transparent",
      color:
        currentPath === path
          ? "white"
          : colorMode === "light"
          ? "black"
          : "white",
      cursor: path === "#" ? "not-allowed" : "pointer", // カーソルを変更
    };
    return (
      <AccordionPanel m={0} p={0}>
        <Link href={path} {...linkStyles}>
          {text}
        </Link>
      </AccordionPanel>
    );
  };
  // 現在のパスに基づいて開くべきアコーディオンのインデックスを設定
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
      let index: number[] = [];
      switch (true) {
        //自己紹介
        case window.location.pathname.includes("/skillBlogs/0004"): //メンバーリスト
          index = [0];
          break;
        //生産準備+の使い方
        case window.location.pathname.includes("/skillBlogs/0006"): //生産準備+とは
        case window.location.pathname.includes("/skillBlogs/0009"): //効果の確認
        case window.location.pathname.includes("/skillBlogs/0007"): //生産準備+の練習(初級)
        case window.location.pathname.includes("/skillBlogs/0008"): //生産準備+の練習(中級)
        case window.location.pathname.includes("/skillBlogs/0001"): //プログラミング解説
        case window.location.pathname.includes("/skillBlogs/0002"): //コネクタの撮影から座標登録まで
        case window.location.pathname.includes("/skillBlogs/0005"): //コネクタの撮影から座標登録まで
          index = [1];
          break;
        //誘導ポイント設定一覧表
        case window.location.pathname.includes("/skillBlogs/0010"): //誘導ポイント設定一覧表
          index = [3];
          break;
        //改善活動の進め方
        case window.location.pathname.includes("/skillBlogs/0003"): //参考事例集
          index = [4];
          break;
        default:
          index = [];
      }
      setAccordionIndex(index);
    }
  }, []);

  return (
    <>
      <Content isCustomHeader={true} maxWidth="1280px">
        <ChakraProvider theme={customTheme}>
          <HStack
            align="start"
            spacing={2}
            p={2}
            fontFamily="Noto Sans JP"
            w="100%"
          >
            <VStack
              align="start"
              flex="3.5"
              position="sticky"
              top="64px"
              display={["none", "none", "none", "block"]}
              color={colorMode === "light" ? "black" : "white"}
            >
              <Text fontWeight="bold" textAlign="left" m={1}>
                技術ブログ
              </Text>
              <Accordion
                index={accordionIndex}
                onChange={(index) =>
                  setAccordionIndex(Array.isArray(index) ? index : [index])
                }
                allowToggle
                allowMultiple
              >
                <AccordionItem>
                  <AccordionButton m={1} p={0}>
                    <Box flex="4" textAlign="left" fontSize="13px">
                      1. 自己紹介
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  {createLinkPanel("/skillBlogs/0004/", "メンバーリスト")}
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton m={1} p={0}>
                    <Box flex="1" textAlign="left" fontSize="13px">
                      2. 生産準備+の使い方
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  {createLinkPanel("/skillBlogs/0006/", "生産準備+とは")}
                  {createLinkPanel("/skillBlogs/0009/", "導入の効果")}
                  {createLinkPanel(
                    "/skillBlogs/0007/",
                    "生産準備+の練習(初級)"
                  )}
                  {createLinkPanel(
                    "/skillBlogs/0008/",
                    "生産準備+の練習(中級)"
                  )}
                  {createLinkPanel(
                    "/skillBlogs/0002/",
                    "コネクタの撮影から座標登録"
                  )}
                  {createLinkPanel("/skillBlogs/0005/", "サブナンバーの引越し")}
                  {createLinkPanel("/skillBlogs/0001/", "プログラムの解説")}
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton m={1} p={0}>
                    <Box flex="4" textAlign="left" fontSize="13px">
                      3. 順立生産システムの使い方
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  {createLinkPanel("#", "PC初回セットアップ手順")}
                  {createLinkPanel("#", "MODE1(計画)の設定")}
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton m={1} p={0}>
                    <Box flex="1" textAlign="left" fontSize="13px">
                      4. 誘導ポイント設定一覧表
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  {createLinkPanel("/skillBlogs/0010/", "使い方")}
                </AccordionItem>
                <AccordionItem>
                  <AccordionButton m={1} p={0}>
                    <Box flex="1" textAlign="left" fontSize="13px">
                      5. 改善活動の進め方
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  {createLinkPanel("/skillBlogs/0003/", "参考事例集")}
                </AccordionItem>
              </Accordion>
            </VStack>
            <VStack
              align="start"
              flex=".5"
              position="sticky"
              top="64px"
              display={["none", "none", "none", "block"]}
            >
              <IconButton
                icon={<CiHeart size={24} />}
                ref={buttonRef}
                width="40px"
                height="40px"
                borderRadius="50%"
                border="1px solid"
                borderColor={colorMode === "light" ? "black" : "white"}
                color={colorMode === "light" ? "black" : "black"}
                aria-label="いいね"
                onClick={() => {
                  showToast(
                    "用意していません",
                    "そのうち追加するかもです",
                    "success"
                  );
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 8000);
                }}
              />
            </VStack>
            <VStack
              align="start"
              spacing={6}
              flex="10"
              bg="rgb(255,255,255,0.3)"
              w={["100%", "100%", "100%", "70%"]}
              p={4}
              borderRadius="10px"
            >
              {/* {userName === null ? (
                <Box h="60vh">
                  <Text
                    fontSize="lg"
                    textAlign="center"
                    mt={4}
                    fontWeight="bold"
                  >
                    閲覧するにはログインと管理者による認証が必要です。
                  </Text>
                </Box>
              ) : (
              )} */}
              {children}
            </VStack>

            {/* サイドバー */}
            <VStack
              align="start"
              spacing={3}
              flex="4"
              position="sticky"
              top="64px"
              display={["none", "none", "none", "block"]}
            >
              <List spacing={1} fontSize="sm">
                {sections.current
                  // ?.sort((a, b) => {
                  //   const aParts = a.id.split('-').map(part => parseInt(part, 10));
                  //   const bParts = b.id.split('-').map(part => parseInt(part, 10));

                  //   for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                  //     const aPart = aParts[i] !== undefined ? aParts[i] : -1;
                  //     const bPart = bParts[i] !== undefined ? bParts[i] : -1;

                  //     if (aPart !== bPart) {
                  //       return aPart - bPart;
                  //     }
                  //   }
                  //   // 長さが異なる場合、短い方を先にする
                  //   return aParts.length - bParts.length;
                  // })
                  .map((section) => {
                    const underscoreCount = (section.id.match(/_/g) || [])
                      .length; // アンダースコアの数をカウント
                    const indent = 2 + underscoreCount * 2; // 基本インデントにアンダースコアの数に応じたインデントを追加

                    return (
                      <ListItem
                        w="100%"
                        maxWidth={["0px", "0px", "200px", "240px"]}
                        key={section.id}
                        p={0}
                        borderRadius="5px"
                        bg={
                          activeSection === section.id
                            ? "gray.500"
                            : "transparent"
                        }
                        color={
                          activeSection === section.id
                            ? "white"
                            : colorMode === "light"
                            ? "black"
                            : "white"
                        }
                        pl={indent}
                        style={{
                          whiteSpace: "nowrap", // 改行を防ぐ
                          overflow: "hidden", // 溢れた部分を隠す
                          textOverflow: "ellipsis", // 溢れた部分に「...」を付ける
                        }}
                      >
                        <Link href={`#${section.id}`} title={section.title}>
                          {section.title}
                        </Link>
                      </ListItem>
                    );
                  })}
              </List>
            </VStack>
          </HStack>
        </ChakraProvider>
      </Content>
      {showConfetti && buttonRef.current && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={20}
          gravity={1} // 重力を調整して紙吹雪の動きを制御
          recycle={false}
          confettiSource={{
            x:
              buttonRef.current.getBoundingClientRect().left +
              buttonRef.current.offsetWidth / 2,
            y:
              buttonRef.current.getBoundingClientRect().top +
              buttonRef.current.offsetHeight / 2,
            w: 0.1,
            h: 0.1,
          }}
          style={{
            position: "absolute",
            zIndex: 10000,
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
};

export default Frame;
