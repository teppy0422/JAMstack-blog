import React, { useEffect, useState, useRef, useContext } from "react";
import Confetti from "react-confetti";
import {
  Box,
  Flex,
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
  createIcon,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { PiGithubLogoFill } from "react-icons/pi";
import { LuPanelRightOpen } from "react-icons/lu";
import Content from "./content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "./customToast";
import { useDisclosure } from "@chakra-ui/react";
import { useUserInfo } from "../hooks/useUserId";
import { useUserData } from "../hooks/useUserData";
import { useReadCount } from "../hooks/useReadCount";

import "@fontsource/noto-sans-jp";
import "@fontsource/yomogi";

import { useLanguage } from "../context/LanguageContext";
import getMessage from "../components/getMessage";

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
const CustomIcon = createIcon({
  displayName: "CustomIcon",
  viewBox: "0 0 26 26",
  path: (
    <path
      d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
      fill="gray"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
});
const CustomIcon2 = createIcon({
  displayName: "CustomIcon2",
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
const Frame: React.FC<{
  children: React.ReactNode;
  sections?: any;
  sectionRefs?: React.RefObject<HTMLElement[]> | null;
  isThrough?: boolean;
}> = ({ children, sections, sectionRefs, isThrough }) => {
  const { language, setLanguage } = useLanguage();

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
  const { readByCount, skillBlogsData } = useReadCount(userId);

  //64pxまでスクロールしないとサイドバーが表示されないから暫定
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64;
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
  }, [sectionRefs, userName]);
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
  // #に移動をレンダリング後に行う
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64; // オフセットを設定
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    }
  }, [userId, userName]); // userIdまたはuserNameが変更されたときに実行

  //現在のパスを取得
  const [currentPath, setCurrentPath] = useState("");
  const [accordionIndex, setAccordionIndex] = useState<number[]>([]);
  // ブログリストを表示
  const createLinkPanel = (path: string, text: string) => {
    const pathSplit = path.split("/").filter(Boolean);
    const pathUrl = pathSplit[1];

    let isReadByUser = true;
    if (pathUrl !== undefined) {
      const matchingData =
        skillBlogsData.find((data) => data.url === pathUrl)?.readBy || [];
      isReadByUser = matchingData.includes(userId ?? ""); // matchingDataにuserIdが含まれるか確認
    }

    const linkStyles = {
      fontSize: "13px",
      ml: 4,
      px: 2,
      borderRadius: "4px",
      bg: currentPath === path ? "#4a5569" : "transparent",
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
          {!isReadByUser && <CustomIcon />}
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
        //順立生産システムの使い方
        case window.location.pathname.includes("/skillBlogs/0011"): //
          index = [2];
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
  useEffect(() => {
    // userNameが変わったときの処理をここに記述
    console.log("userNameが変更されました:", userName);
  }, [userName]); // userNameを依存配列に追加

  useEffect(() => {
    // 言語が変更されたときに実行する処理
    console.log(`Language changed to: ${language}`);
    // 必要に応じて他の処理を追加
  }, [language]); // 言語が変わるたびに実行

  return (
    <>
      <Content isCustomHeader={true} maxWidth="1280px">
        <ChakraProvider theme={customTheme}>
          {!isThrough && !userId ? (
            <Box h="60vh">
              <Text
                fontSize="lg"
                textAlign="center"
                mt={4}
                fontWeight="bold"
                color={colorMode === "light" ? "red" : "orange"}
              >
                {getMessage({
                  ja: "閲覧するにはログインと開発による認証が必要です",
                  us: "Login and authentication by development is required to view",
                  cn: "查看需要开发人员登录和验证",
                  language,
                })}
              </Text>
            </Box>
          ) : !isThrough && !userName ? (
            <Box h="60vh">
              <Text
                fontSize="lg"
                textAlign="center"
                mt={4}
                fontWeight="bold"
                color={colorMode === "light" ? "red" : "orange"}
              >
                {getMessage({
                  ja: "閲覧するには開発による認証が必要です",
                  us: "Authentication by development is required to view",
                  cn: "观看需要得到开发部门的授权",
                  language,
                })}
              </Text>
            </Box>
          ) : (
            <HStack align="start" spacing={2} p={2} w="100%">
              <VStack
                align="start"
                flex="3.5"
                position="sticky"
                top="64px"
                display={["none", "none", "none", "block"]}
                color={colorMode === "light" ? "black" : "white"}
              >
                <Link href="/skillBlogs/0000/">
                  <Flex alignItems="center" gap="3px">
                    <Text fontWeight="bold" textAlign="left" m={1}>
                      {getMessage({
                        ja: "技術ブログ",
                        us: "skills blog",
                        cn: "技术博客",
                        language,
                      })}
                    </Text>
                    <PiGithubLogoFill size={24} />
                  </Flex>
                </Link>
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
                        1.
                        {getMessage({
                          ja: " 自己紹介",
                          us: " self-introduction",
                          cn: " 自我介绍",
                          language,
                        })}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    {createLinkPanel(
                      "/skillBlogs/0004/",
                      getMessage({
                        ja: "メンバーリスト",
                        us: "Member List",
                        cn: "成员名单",
                        language,
                      })
                    )}
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionButton m={1} p={0}>
                      <Box flex="1" textAlign="left" fontSize="13px">
                        2.
                        {getMessage({
                          ja: " 生産準備+の使い方",
                          us: " How to use Production Preparation+",
                          cn: " 如何使用生产准备+",
                          language,
                        })}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    {createLinkPanel(
                      "/skillBlogs/0006/",
                      getMessage({
                        ja: "生産準備+とは",
                        us: "What is Production Preparation+",
                        cn: "什么是生产准备+？",
                        language,
                      })
                    )}
                    {createLinkPanel(
                      "/skillBlogs/0009/",
                      getMessage({
                        ja: "導入の効果",
                        us: "Effects of Introduction",
                        cn: "引进的影响",
                        language,
                      })
                    )}
                    {createLinkPanel(
                      "/skillBlogs/0007/",
                      getMessage({
                        ja: "練習(初級)",
                        us: "Practice (Elementary)",
                        cn: "实践（初级）",
                        language,
                      })
                    )}
                    {createLinkPanel(
                      "/skillBlogs/0008/",
                      getMessage({
                        ja: "練習(中級)",
                        us: "Practice (Intermediate)",
                        cn: "实践（中级）",
                        language,
                      })
                    )}
                    {createLinkPanel(
                      "/skillBlogs/0002/",
                      getMessage({
                        ja: "コネクタの撮影から座標登録",
                        us: "Coordinate registration from connector shooting",
                        cn: "登记连接器拍摄的坐标",
                        language,
                      })
                    )}
                    {createLinkPanel(
                      "/skillBlogs/0005/",
                      getMessage({
                        ja: "サブナンバーの引越し",
                        us: "Moving sub-numbers",
                        cn: "移动子编号",
                        language,
                      })
                    )}
                    {createLinkPanel(
                      "/skillBlogs/0001/",
                      getMessage({
                        ja: "プログラムの解説",
                        us: "Program Description",
                        cn: "计划说明",
                        language,
                      })
                    )}
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionButton m={1} p={0}>
                      <Box flex="4" textAlign="left" fontSize="13px">
                        3.
                        {getMessage({
                          ja: " 順立生産システム+の使い方",
                          us: " How to use the Sequential Production System+",
                          cn: " 如何使用顺序生产系统+",
                          language,
                        })}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    {createLinkPanel(
                      "/skillBlogs/0011/",
                      getMessage({
                        ja: "PC初回セットアップ手順",
                        us: "PC First Time Setup Procedure",
                        cn: "电脑首次设置程序",
                        language,
                      })
                    )}
                    {createLinkPanel(
                      "#",
                      getMessage({
                        ja: "MODE1(計画)の設定",
                        us: "MODE1 (planning) setting",
                        cn: "模式1（规划）。",
                        language,
                      })
                    )}
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionButton m={1} p={0}>
                      <Box flex="1" textAlign="left" fontSize="13px">
                        4.
                        {getMessage({
                          ja: " 誘導ポイント設定一覧表",
                          us: " Induction point setting list",
                          cn: " 感应点设置列表",
                          language,
                        })}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    {createLinkPanel(
                      "/skillBlogs/0010/",
                      getMessage({
                        ja: "使い方",
                        us: "treatment",
                        cn: "待遇",
                        language,
                      })
                    )}
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionButton m={1} p={0}>
                      <Box flex="1" textAlign="left" fontSize="13px">
                        5.
                        {getMessage({
                          ja: " 改善活動の進め方",
                          us: " How to proceed with improvement activities",
                          cn: " 如何开展改进活动",
                          language,
                        })}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    {createLinkPanel(
                      "/skillBlogs/0003/",
                      getMessage({
                        ja: "参考事例集",
                        us: "Collection of reference examples",
                        cn: "参考事例集",
                        language,
                      })
                    )}
                  </AccordionItem>
                </Accordion>
              </VStack>
              <VStack
                align="center"
                flex=".5"
                position="sticky"
                top="64px"
                display={["none", "none", "none", "block"]}
              >
                <IconButton
                  icon={<CiHeart size={24} />}
                  ref={buttonRef}
                  minWidth="33px"
                  width="33px !important"
                  height="33px !important"
                  borderRadius="50%"
                  border="1px solid"
                  borderColor={colorMode === "light" ? "black" : "white"}
                  color={colorMode === "light" ? "black" : "white"}
                  backgroundColor={colorMode === "light" ? "#eee" : "black"}
                  aria-label="いいね"
                  mb={3}
                  onClick={() => {
                    showToast(
                      getMessage({
                        ja: "用意していません",
                        us: "Not provided.",
                        cn: "不详",
                        language,
                      }),
                      getMessage({
                        ja: "そのうち追加するかもです",
                        us: "I may add it soon.",
                        cn: "我可能很快就会加入",
                        language,
                      }),
                      "success"
                    );
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 8000);
                  }}
                />
                <IconButton
                  icon={<CustomIcon2 viewBox="0 0 24 24" fill="red" />}
                  minWidth="33px"
                  width="33px !important"
                  height="33px !important"
                  borderRadius="50%"
                  border="1px solid"
                  borderColor={colorMode === "light" ? "black" : "white"}
                  color={colorMode === "light" ? "black" : "white"}
                  backgroundColor={colorMode === "light" ? "#eee" : "black"}
                  aria-label="既読数"
                  cursor="default"
                />
                <Text textAlign="center" cursor="default">
                  {readByCount}
                </Text>
              </VStack>
              <VStack
                align="start"
                spacing={6}
                flex="10"
                bg={
                  colorMode === "light"
                    ? "rgb(255,255,255,0.3)"
                    : "rgb(255,255,255,0.1)"
                }
                w={["100%", "100%", "100%", "70%"]}
                p={4}
                borderRadius="10px"
              >
                <>{children}</>
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
                      const indent = 2 + underscoreCount * 3; // 基本インデントにアンダースコアの数に応じたインデントを追加

                      return (
                        <ListItem
                          w="100%"
                          maxWidth={["0px", "0px", "200px", "240px"]}
                          key={section.id}
                          p={0}
                          borderRadius="5px"
                          bg={
                            activeSection === section.id
                              ? "#4a5569"
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
                            whiteSpace: "nowrap",
                            overflow: "hidden",
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
          )}
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
