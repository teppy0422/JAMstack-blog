import React, { useEffect, useState, useRef, useContext } from "react";
import Confetti from "react-confetti";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Link,
  List,
  ListItem,
  IconButton,
  Avatar,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  createIcon,
} from "@chakra-ui/react";
import { PiGithubLogoFill } from "react-icons/pi";
import Content from "@/components/content";
import { useColorMode } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

import { useReadCount } from "@/hooks/useReadCount";
import { useUserContext } from "@/contexts/useUserContext";

import { CustomAccordionIcon } from "@/components/ui/CustomText";
import { CustomLoading } from "@/components/ui/CustomLoading";
import UnAuthenticatedNotice from "@/components/UnAuthenticatedNotice";

import "@fontsource/noto-sans-jp";
import "@fontsource/yomogi";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import ReadByIcon from "./ReadByIcon";
import { LuHeartIcon } from "@/components/ui/icons";

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
const Frame: React.FC<{
  children: React.ReactNode;
  sections?: any;
  sectionRefs?: React.RefObject<HTMLElement[]> | null;
  isThrough?: boolean;
  isMain?: boolean;
}> = ({ children, sections, sectionRefs, isThrough, isMain }) => {
  const { language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState("");

  const { currentUserId, currentUserName, getUserById } = useUserContext();
  const { readByCount, skillBlogsData, refresh, insertOrUpdate } =
    useReadCount(currentUserId);
  // 既読ユーザーボタン
  const [isReadByUser, setIsReadByUser] = useState<boolean>(false);
  const [matchedBlog, setMatchedBlog] = useState<any>(null);
  const [currentPath, setCurrentPath] = useState("");
  const [pathUrl, setPathUrl] = useState<string>("");
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const [isReadByOpen, setIsReadByOpen] = useState(false);
  // いいねボタン
  const [isLikeHovered, setIsLikeHovered] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    refresh();
  }, []);

  useEffect(() => {
    if (!skillBlogsData) return;
    const pathSplit = currentPath.split("/");
    const pathUrl = pathSplit[3];
    console.log(pathUrl);
    setPathUrl(pathUrl);
    const matchedBlog = skillBlogsData.find((data) => data.url === pathUrl);
    console.log(matchedBlog);
    const isReadByUser = matchedBlog?.readBy.includes(currentUserId ?? "");
    console.log(isReadByUser);
    setIsReadByUser(isReadByUser ?? false);
    setMatchedBlog(matchedBlog);
  }, [currentPath, skillBlogsData]);

  if (!matchedBlog) {
    null;
  }

  // 2秒後にハッシュ位置へスクロール
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      handleHashScroll();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let ticking = false;
    const updateActiveSection = () => {
      if (sectionRefs?.current) {
        const scrollPosition = window.scrollY + 100; // ヘッダーの高さを考慮
        sectionRefs.current.forEach((section) => {
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (
              scrollPosition >= sectionTop &&
              scrollPosition <= sectionBottom
            ) {
              const newActiveSection = section.id;
              setActiveSection(newActiveSection);
            }
          }
        });
      }
      ticking = false;
    };
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
      const isBottomTemp =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (!isBottom && isBottomTemp) {
        setIsBottom(isBottomTemp);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRefs]);

  useEffect(() => {
    console.log("ページの一番下に到達しました！");
    console.log(isReadByUser);
    console.log(currentUserId);
    console.log(pathUrl);
    if (!isReadByUser && currentUserId) {
      (async () => {
        setIsReadByOpen(true); //ReadByIconをopen
        await insertOrUpdate(pathUrl, currentUserId);
        refresh();
      })();
      console.log("更新");
    }
  }, [isBottom]);

  const handleHashScroll = () => {
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
      }, 100);
    }
  };

  const [accordionIndex, setAccordionIndex] = useState<number[]>([]);

  const createLinkPanel = (path: string, text: string, isMain?: boolean) => {
    const pathSplit = path.split("/").filter(Boolean);
    const pathUrl = pathSplit[2];

    let isRead = true;
    if (pathUrl !== undefined) {
      const matchingData =
        skillBlogsData.find((data) => data.url === pathUrl)?.readBy || [];
      isRead = matchingData.includes(currentUserId ?? "");
    }

    const linkStyles = {
      fontSize: "13px",
      ml: 6,
      px: 2,
      borderRadius: "4px",
      bg: currentPath === path ? "#d8cabf" : "transparent",
      cursor: path === "#" ? "not-allowed" : "pointer",
    };
    return (
      <AccordionPanel m={0} p={0}>
        <Link
          href={path}
          {...linkStyles}
          color={
            isMain
              ? "#FFF"
              : colorMode === "light"
              ? "black"
              : currentPath === path
              ? "black"
              : ""
          }
          display="block"
          my={0.5}
        >
          {text}
          {!isRead && (
            <CustomIcon
              color={colorMode === "light" ? "red.500" : "orange.500"}
              ml={0.5}
            />
          )}
        </Link>
      </AccordionPanel>
    );
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      let index: number[] = [];
      switch (true) {
        case window.location.pathname.includes("/skillBlogs/pages/0004"):
          index = [0];
          break;
        case window.location.pathname.includes("/skillBlogs/pages/0006"):
        case window.location.pathname.includes("/skillBlogs/pages/0009"):
        case window.location.pathname.includes("/skillBlogs/pages/0007"):
        case window.location.pathname.includes("/skillBlogs/pages/0008"):
        case window.location.pathname.includes("/skillBlogs/pages/0001"):
        case window.location.pathname.includes("/skillBlogs/pages/0002"):
        case window.location.pathname.includes("/skillBlogs/pages/0005"):
          index = [1];
          break;
        case window.location.pathname.includes("/skillBlogs/pages/0011"):
          index = [2];
          break;
        case window.location.pathname.includes("/skillBlogs/pages/0010"):
          index = [3];
          break;
        case window.location.pathname.includes("/skillBlogs/pages/0003"):
          index = [4];
          break;
        case window.location.pathname.includes("/skillBlogs/pages/0012"):
          index = [5];
          break;
        default:
          index = [];
      }
      setAccordionIndex(index);
    }
  }, []);

  // sections.currentの監視と再試行ロジック
  useEffect(() => {
    if (
      sections?.current &&
      Object.keys(sections.current).length === 0 &&
      retryCount < maxRetries
    ) {
      const timer = setTimeout(() => {
        console.log(`再試行 ${retryCount + 1}回目`);
        setRetryCount((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sections?.current, retryCount]);

  const ReadByList = () => {
    return (
      <VStack align="center" mx=".5px">
        {matchedBlog?.readBy && matchedBlog.readBy.length > 0 ? (
          <Box position="relative" width="fit-content" mx="auto">
            {matchedBlog.readBy.map((user, index) => {
              const userData = getUserById(user);
              return (
                <Box
                  key={index}
                  position="relative"
                  mt={index === 0 ? 0 : "-2px"}
                  _hover={{ cursor: "pointer" }}
                >
                  <Avatar
                    src={userData?.picture_url}
                    h="32px"
                    w="32px"
                    border={
                      colorMode === "light"
                        ? "1px solid black"
                        : "1px solid white"
                    }
                    outline={
                      colorMode === "light"
                        ? "1px solid #f0e4da"
                        : "1px solid #202024"
                    }
                  />
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box display="flex" justifyContent="center">
            <Avatar
              h="32px"
              w="32px"
              border="1px solid black"
              outline="1px solid #eee"
            />
          </Box>
        )}
      </VStack>
    );
  };

  return (
    <>
      <Content maxWidth="1280px" isUse={!isMain}>
        {isLoading ? (
          <Box
            h="30vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <CustomLoading
              text="LOADING LOADING LOADING "
              radius={40}
              fontSize={11}
              imageUrl="/images/illust/hippo/hippo_014.svg"
              imageSize={40}
              color="#FFF"
            />
          </Box>
        ) : !isThrough && !isLoading && (!currentUserId || !currentUserName) ? (
          <Box h="30vh">
            <UnAuthenticatedNotice
              colorMode={colorMode}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
            />
          </Box>
        ) : (
          <HStack align="start" spacing={2} p={2} w="100%" bg="transparent">
            <VStack
              align="start"
              flex={isMain ? "100" : "3.5"}
              position="sticky"
              top="64px"
              display={
                isMain
                  ? ["block", "block", "block", "block"]
                  : ["none", "none", "none", "block"]
              }
              color={colorMode === "light" ? "black" : "white"}
            >
              {!isMain && (
                <Link href="/skillBlogs/">
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
              )}
              <Accordion
                index={accordionIndex}
                onChange={(index) =>
                  setAccordionIndex(Array.isArray(index) ? index : [index])
                }
                allowToggle
                allowMultiple
              >
                <AccordionItem border="0">
                  {({ isExpanded }) => (
                    <>
                      <AccordionButton m={1} p={0}>
                        <CustomAccordionIcon
                          isExpanded={isExpanded}
                          color_={isMain ? "#FFF" : ""}
                        />
                        <Box
                          flex="4"
                          textAlign="left"
                          fontSize="13px"
                          color={isMain ? "#FFF" : ""}
                        >
                          1.
                          {getMessage({
                            ja: "自己紹介",
                            us: "self-introduction",
                            cn: "自我介绍",
                            language,
                          })}
                        </Box>
                      </AccordionButton>
                      {createLinkPanel(
                        "/skillBlogs/pages/0004/",
                        getMessage({
                          ja: "開発スタッフ",
                          us: "Development Staff",
                          cn: "开发人员",
                          language,
                        }),
                        isMain
                      )}
                    </>
                  )}
                </AccordionItem>
                <AccordionItem border="0">
                  {({ isExpanded }) => (
                    <>
                      <AccordionButton m={1} p={0}>
                        <CustomAccordionIcon
                          isExpanded={isExpanded}
                          color_={isMain ? "#FFF" : ""}
                        />
                        <Box
                          flex="1"
                          textAlign="left"
                          fontSize="13px"
                          color={isMain ? "#FFF" : ""}
                        >
                          2.
                          {getMessage({
                            ja: "生産準備+の使い方",
                            us: "How to use Production Preparation+",
                            cn: "如何使用生产准备+",
                            language,
                          })}
                        </Box>
                      </AccordionButton>
                      {createLinkPanel(
                        "/skillBlogs/pages/0006/",
                        getMessage({
                          ja: "生産準備+とは",
                          us: "What is Production Preparation+",
                          cn: "什么是生产准备+？",
                          language,
                        }),
                        isMain
                      )}
                      {createLinkPanel(
                        "/skillBlogs/pages/0009/",
                        getMessage({
                          ja: "導入の効果",
                          us: "Effects of Introduction",
                          cn: "引进的影响",
                          language,
                        }),
                        isMain
                      )}
                      {createLinkPanel(
                        "/skillBlogs/pages/0007/",
                        getMessage({
                          ja: "練習(初級)",
                          us: "Practice (Elementary)",
                          cn: "实践（初级）",
                          language,
                        }),
                        isMain
                      )}
                      {createLinkPanel(
                        "/skillBlogs/pages/0008/",
                        getMessage({
                          ja: "練習(中級)",
                          us: "Practice (Intermediate)",
                          cn: "实践（中级）",
                          language,
                        }),
                        isMain
                      )}
                      {createLinkPanel(
                        "/skillBlogs/pages/0002/",
                        getMessage({
                          ja: "コネクタの撮影から座標登録",
                          us: "Coordinate registration from connector shooting",
                          cn: "登记连接器拍摄的坐标",
                          language,
                        }),
                        isMain
                      )}
                      {createLinkPanel(
                        "/skillBlogs/pages/0005/",
                        getMessage({
                          ja: "サブナンバーの引越し",
                          us: "Moving sub-numbers",
                          cn: "移动子编号",
                          language,
                        }),
                        isMain
                      )}
                      {createLinkPanel(
                        "/skillBlogs/pages/0001/",
                        getMessage({
                          ja: "プログラムの解説",
                          us: "Program Description",
                          cn: "计划说明",
                          language,
                        }),
                        isMain
                      )}
                    </>
                  )}
                </AccordionItem>
                <AccordionItem border="0">
                  {({ isExpanded }) => (
                    <>
                      <AccordionButton m={1} p={0}>
                        <CustomAccordionIcon
                          isExpanded={isExpanded}
                          color_={isMain ? "#FFF" : ""}
                        />
                        <Box
                          flex="4"
                          textAlign="left"
                          fontSize="13px"
                          color={isMain ? "#FFF" : ""}
                        >
                          3.
                          {getMessage({
                            ja: "順立生産システム+の使い方",
                            us: "How to use the Sequential Production System+",
                            cn: "如何使用顺序生产系统+",
                            language,
                          })}
                        </Box>
                      </AccordionButton>
                      {createLinkPanel(
                        "/skillBlogs/pages/0011/",
                        getMessage({
                          ja: "PC初回セットアップ手順",
                          us: "PC First Time Setup Procedure",
                          cn: "电脑首次设置程序",
                          language,
                        }),
                        isMain
                      )}
                      {createLinkPanel(
                        "#",
                        getMessage({
                          ja: "MODE1(計画)の設定",
                          us: "MODE1 (planning) setting",
                          cn: "模式1（规划）。",
                          language,
                        }),
                        isMain
                      )}
                    </>
                  )}
                </AccordionItem>
                <AccordionItem border="0">
                  {({ isExpanded }) => (
                    <>
                      <AccordionButton m={1} p={0}>
                        <CustomAccordionIcon
                          isExpanded={isExpanded}
                          color_={isMain ? "#FFF" : ""}
                        />
                        <Box
                          flex="1"
                          textAlign="left"
                          fontSize="13px"
                          color={isMain ? "#FFF" : ""}
                        >
                          4.
                          {getMessage({
                            ja: "誘導ポイント設定一覧表",
                            us: "Induction point setting list",
                            cn: "感应点设置列表",
                            language,
                          })}
                        </Box>
                      </AccordionButton>
                      {createLinkPanel(
                        "/skillBlogs/pages/0010/",
                        getMessage({
                          ja: "使い方",
                          us: "treatment",
                          cn: "待遇",
                          language,
                        }),
                        isMain
                      )}
                    </>
                  )}
                </AccordionItem>
                <AccordionItem border="0">
                  {({ isExpanded }) => (
                    <>
                      <AccordionButton m={1} p={0}>
                        <CustomAccordionIcon
                          isExpanded={isExpanded}
                          color_={isMain ? "#FFF" : ""}
                        />
                        <Box
                          flex="1"
                          textAlign="left"
                          fontSize="13px"
                          color={isMain ? "#FFF" : ""}
                        >
                          5.
                          {getMessage({
                            ja: "改善活動の進め方",
                            us: "How to proceed with improvement activities",
                            cn: "如何开展改进活动",
                            language,
                          })}
                        </Box>
                      </AccordionButton>
                      {createLinkPanel(
                        "/skillBlogs/pages/0003/",
                        getMessage({
                          ja: "参考事例集",
                          us: "Collection of reference examples",
                          cn: "参考事例集",
                          language,
                        }),
                        isMain
                      )}
                    </>
                  )}
                </AccordionItem>
                <AccordionItem border="0">
                  {({ isExpanded }) => (
                    <>
                      <AccordionButton m={1} p={0}>
                        <CustomAccordionIcon
                          isExpanded={isExpanded}
                          color_={isMain ? "#FFF" : ""}
                        />
                        <Box
                          flex="1"
                          textAlign="left"
                          fontSize="13px"
                          color={isMain ? "#FFF" : ""}
                        >
                          6.
                          {getMessage({
                            ja: "ツール",
                            us: "tool (esp. software, etc.)",
                            cn: "工具",
                            language,
                          })}
                        </Box>
                      </AccordionButton>
                      {createLinkPanel(
                        "/skillBlogs/pages/0012/",
                        getMessage({
                          ja: "WEBサイト/WEBアプリ",
                          us: "Website/Application",
                          cn: "网站/应用程序",
                          language,
                        }),
                        isMain
                      )}
                    </>
                  )}
                </AccordionItem>
              </Accordion>
            </VStack>
            {!isMain && (
              <>
                <VStack
                  align="center"
                  flex=".5"
                  position="sticky"
                  top="64px"
                  display={["none", "none", "none", "block"]}
                  alignItems="center"
                  justifyContent="center"
                  bg="transparent"
                >
                  <IconButton
                    _hover={{ color: "pink.100" }} // ホバー時の色
                    icon={
                      <LuHeartIcon
                        size={20}
                        stroke={colorMode === "light" ? "black" : "white"}
                        fill={
                          isLikeHovered
                            ? colorMode === "light"
                              ? "#F56565"
                              : "orange"
                            : "none"
                        }
                      />
                    }
                    ref={buttonRef}
                    minWidth="33px"
                    width="33px !important"
                    height="33px !important"
                    mx="auto"
                    borderRadius="50%"
                    border="1px solid"
                    borderColor={colorMode === "light" ? "black" : "white"}
                    color={colorMode === "light" ? "none" : "white"}
                    aria-label="いいね"
                    mb={1}
                    onClick={() => {
                      setShowConfetti(true);
                      setTimeout(() => setShowConfetti(false), 8000);
                    }}
                    onMouseEnter={() => setIsLikeHovered(true)}
                    onMouseLeave={() => setIsLikeHovered(false)}
                  />
                  <ReadByIcon
                    content={<ReadByList />}
                    isRead={isReadByUser}
                    open={isReadByOpen}
                    onToggleOpen={() => setIsReadByOpen((prev) => !prev)}
                  />
                  <Text textAlign="center">{readByCount}</Text>
                </VStack>
                <VStack
                  align="start"
                  spacing={6}
                  flex="10"
                  bg={
                    colorMode === "light"
                      ? "rgb(255,255,255,0.15)"
                      : "rgb(255,255,255,0.01)"
                  }
                  w={["100%", "100%", "100%", "70%"]}
                  p={4}
                  borderRadius="10px"
                >
                  <>{children}</>
                </VStack>
                <VStack
                  align="start"
                  spacing={3}
                  flex="4"
                  position="sticky"
                  top="63px"
                  display={["none", "none", "none", "block"]}
                >
                  <List spacing={1} fontSize="sm">
                    {(() => {
                      // 配列を適切に再構築
                      const sectionsArray = sections?.current
                        ? Object.entries(sections.current)
                            .filter(([key]) => !isNaN(Number(key)))
                            .map(
                              ([_, value]) =>
                                value as { id: string; title: string }
                            )
                        : [];
                      // 再試行中は読み込み中の表示
                      if (
                        sectionsArray.length === 0 &&
                        retryCount < maxRetries
                      ) {
                        return (
                          <ListItem>
                            <Text textAlign="center">
                              {getMessage({
                                ja: "読み込み中...",
                                us: "Loading...",
                                cn: "正在加载...",
                                language,
                              })}
                            </Text>
                          </ListItem>
                        );
                      }
                      return sectionsArray.length > 0 ? (
                        sectionsArray.map((section) => {
                          const underscoreCount = (section.id.match(/_/g) || [])
                            .length;
                          const indent = 2 + underscoreCount * 3;
                          return (
                            <ListItem
                              w="100%"
                              maxWidth={["0px", "0px", "200px", "240px"]}
                              key={section.id}
                              p={0}
                              borderRadius="5px"
                              bg={
                                activeSection === section.id
                                  ? "#d8cabf"
                                  : "transparent"
                              }
                              color={
                                activeSection === section.id
                                  ? "black"
                                  : colorMode === "light"
                                  ? "black"
                                  : "white"
                              }
                              pl={indent}
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              <Link
                                href={`#${section.id}`}
                                title={section.title}
                                onClick={(e) => {
                                  e.preventDefault(); // デフォルトの#リンクを無効化
                                  const target = document.getElementById(
                                    section.id
                                  );
                                  if (target) {
                                    const targetY =
                                      target.getBoundingClientRect().top +
                                      window.pageYOffset;
                                    const offsetY = targetY - 40;
                                    window.scrollTo({
                                      top: offsetY,
                                      behavior: "smooth",
                                    });
                                  }
                                }}
                              >
                                {section.title}
                              </Link>
                            </ListItem>
                          );
                        })
                      ) : (
                        <ListItem>
                          <Text textAlign="center">
                            {getMessage({
                              ja: "レンダリング条件が見つかりませんでした",
                              us: "No blog found",
                              cn: "没有找到博客",
                              language,
                            })}
                          </Text>
                        </ListItem>
                      );
                    })()}
                  </List>
                </VStack>
              </>
            )}
          </HStack>
        )}
      </Content>
      {showConfetti && buttonRef.current && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={20}
          gravity={1}
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
            zIndex: 1000,
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
