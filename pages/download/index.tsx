import React, { useState } from "react";
import { useRouter } from "next/router";
import Content from "../../components/content";
import fs from "fs";
import path from "path";
import { GetServerSideProps } from "next";

import {
  Image,
  Text,
  Box,
  SimpleGrid,
  Badge,
  useDisclosure,
  HStack,
  useColorMode,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Heading,
  Divider,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useMediaQuery,
} from "@chakra-ui/react";

import { IoTicketOutline } from "react-icons/io5";

import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート
import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import NextImage from "next/image";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import DownloadButton from "../../components/DownloadButton";
import styles from "../../styles/home.module.scss";
import { useUserContext } from "../../context/useUserContext";
import Hippo_001_wrap from "../../components/3d/hippo_001_wrap";

import CustomLinkBox from "../../components/customLinkBox";
import CustomPopver from "../../components/popver";
import Sidebar from "../../components/sidebar";
import { Global } from "@emotion/react";

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

// ファイル名から最大の数字を取得する関数
function getMaxVersionNumber(directory: string): {
  maxVersionString: string;
  lastModified: Date;
} {
  try {
    const files = fs.readdirSync(directory);
    let maxNumber = 0;
    let maxVersionString = "";
    let lastModified = new Date(0); // 初期値を設定

    files.forEach((file) => {
      // 'Sjp'で始まり、'_.zip'で終わるファイル名から数字を抽出
      const match = file.match(/^Sjp([\d.]+)_\.zip$/);
      if (match) {
        const versionString = match[1];
        const number = match[1].replace(/\./g, "");
        if (Number(number) > maxNumber) {
          maxNumber = Number(number);
          maxVersionString = versionString; // ドットを含む元の形式を保持
          const filePath = path.join(directory, file);
          const stats = fs.statSync(filePath);
          lastModified = stats.mtime; // 更新日時を取得
        }
      }
    });
    return { maxVersionString, lastModified };
  } catch (error) {
    console.error("Error reading directory:", error);
    return { maxVersionString: "0", lastModified: new Date(0) }; // デフォルト値を返す
  }
}
// サーバーサイドでデータを取得
export const getServerSideProps: GetServerSideProps = async () => {
  const directoryPath = path.join(
    process.cwd(),
    "/public/files/download/html/Sjp/"
  );
  const { maxVersionString, lastModified: originalLastModified } =
    getMaxVersionNumber(directoryPath);
  const lastModified = new Date().toISOString(); // DateオブジェクトをISO文字列に変換
  return {
    props: {
      maxVersionString,
      lastModified,
    },
  };
};

export default function About({
  maxVersionString,
  lastModified,
}: {
  maxVersionString: string;
  lastModified: Date;
}) {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { currentUserId, currentUserName } = useUserContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalPath, setModalPath] = useState("");
  const handleBoxClick = (path) => {
    setModalPath(path);
    onOpen();
  };
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const CustomBadge: React.FC<{
    path: string;
    text: string;
    media: string;
  }> = ({ path, text, media }) => {
    const [isBase] = useMediaQuery("(max-width: 480px)");
    const maxLen = isBase ? 16 : 99;

    return (
      <Badge
        variant={path ? "solid" : "outline"} // pathが空の場合はoutline
        colorScheme={path ? undefined : "gray"} // pathが空の場合はgrayのカラースキーム
        backgroundColor={path ? "#444" : undefined} // pathが空でない場合は背景色を設定
        color={path ? "white" : undefined} // pathが空でない場合は文字色を設定
        display="inline-block"
        cursor={path ? "pointer" : "default"}
        _hover={path ? { boxShadow: "dark-lg" } : undefined}
        onClick={path ? () => handleBoxClick(path) : undefined}
      >
        <Flex alignItems="center">
          <Box mr={0}>{truncatedText(text, maxLen)}</Box>
          {media === "movie" ? (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="20px"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.437,19.937H4.562a2.5,2.5,0,0,1-2.5-2.5V6.563a2.5,2.5,0,0,1,2.5-2.5H19.437a2.5,2.5,0,0,1,2.5,2.5V17.437A2.5,2.5,0,0,1,19.437,19.937ZM4.562,5.063a1.5,1.5,0,0,0-1.5,1.5V17.437a1.5,1.5,0,0,0,1.5,1.5H19.437a1.5,1.5,0,0,0,1.5-1.5V6.563a1.5,1.5,0,0,0-1.5-1.5Z"></path>
              <path d="M14.568,11.149,10.6,8.432a1.032,1.032,0,0,0-1.614.851v5.434a1.032,1.032,0,0,0,1.614.851l3.972-2.717A1.031,1.031,0,0,0,14.568,11.149Z"></path>
            </svg>
          ) : media === "html" ? (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 240 240"
              height="20px"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M214,120V88a6,6,0,0,0-1.76-4.24l-56-56A6,6,0,0,0,152,26H56A14,14,0,0,0,42,40v80a6,6,0,0,0,12,0V40a2,2,0,0,1,2-2h90V88a6,6,0,0,0,6,6h50v26a6,6,0,0,0,12,0ZM158,46.48,193.52,82H158ZM66,160v48a6,6,0,0,1-12,0V190H30v18a6,6,0,0,1-12,0V160a6,6,0,0,1,12,0v18H54V160a6,6,0,0,1,12,0Zm56,0a6,6,0,0,1-6,6H106v42a6,6,0,0,1-12,0V166H84a6,6,0,0,1,0-12h32A6,6,0,0,1,122,160Zm72,0v48a6,6,0,0,1-12,0V178l-13.2,17.6a6,6,0,0,1-9.6,0L146,178v30a6,6,0,0,1-12,0V160a6,6,0,0,1,10.8-3.6L164,182l19.2-25.6A6,6,0,0,1,194,160Zm56,48a6,6,0,0,1-6,6H216a6,6,0,0,1-6-6V160a6,6,0,0,1,12,0v42h22A6,6,0,0,1,250,208Z"></path>
            </svg>
          ) : null}
        </Flex>
      </Badge>
    );
  };
  const { language, setLanguage } = useLanguage();
  const truncatedText = (text: string, maxLength: number) => {
    return text.length > 20 ? text.slice(0, maxLength) + "..." : text;
  };
  return (
    <>
      <Global
        styles={{
          "@media print": {
            ".page-number::after": {
              content: "counter(page)",
              position: "fixed",
              top: "10px",
              right: "10px",
              fontSize: "12px",
            },
            ".print-only": {
              display: "block !important",
            },
            body: {
              counterReset: "page",
            },
            "@page": {
              "@top-right": {
                content: "counter(page)",
              },
            },
          },
          ".print-only": {
            display: "none",
          },
        }}
      />

      <Text ml={4} className="print-only">
        ※別紙3
      </Text>
      <Sidebar isDrawer={false} />
      <Content isCustomHeader={true}>
        <Box
          className={styles.me}
          sx={{
            paddingTop: "30px",
            fontWeight: "400",
          }}
          fontFamily={getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans,Noto Sans JP",
            cn: "Noto Sans SC,Noto Sans JP",
            language,
          })}
        >
          <Box textAlign="center" mb={8}>
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <Box transform="rotate(270deg)" position="relative" top="-3px">
                {/* <IoTicketOutline size={28} /> */}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="28px"
                  width="28px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke-miterlimit="10"
                    stroke-width="32"
                    stroke-dasharray="1350"
                    stroke-dashoffset="1350"
                    d="M366.05 146a46.7 46.7 0 0 1-2.42-63.42 3.87 3.87 0 0 0-.22-5.26l-44.13-44.18a3.89 3.89 0 0 0-5.5 0l-70.34 70.34a23.62 23.62 0 0 0-5.71 9.24 23.66 23.66 0 0 1-14.95 15 23.7 23.7 0 0 0-9.25 5.71L33.14 313.78a3.89 3.89 0 0 0 0 5.5l44.13 44.13a3.87 3.87 0 0 0 5.26.22 46.69 46.69 0 0 1 65.84 65.84 3.87 3.87 0 0 0 .22 5.26l44.13 44.13a3.89 3.89 0 0 0 5.5 0l180.4-180.39a23.7 23.7 0 0 0 5.71-9.25 23.66 23.66 0 0 1 14.95-15 23.62 23.62 0 0 0 9.24-5.71l70.34-70.34a3.89 3.89 0 0 0 0-5.5l-44.13-44.13a3.87 3.87 0 0 0-5.26-.22 46.7 46.7 0 0 1-63.42-2.32z"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="1350"
                      to="0"
                      dur="3s"
                      fill="freeze"
                    />
                  </path>
                  <path
                    fill="none"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="32"
                    stroke-dasharray="10"
                    stroke-dashoffset="10"
                    d="m250.5 140.44-16.51-16.51m60.53 60.53-11.01-11m55.03 55.03-11-11.01m60.53 60.53-16.51-16.51"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="10"
                      begin="4s"
                      dur="6s"
                      fill="freeze"
                    />
                  </path>
                </svg>
              </Box>
              <svg
                width="200"
                height="50"
                viewBox="0 0 200 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <clipPath id="textClip">
                    <rect x="0" y="0" width="0" height="50">
                      <animate
                        attributeName="width"
                        from="0"
                        to="200"
                        dur="1s"
                        begin="2s"
                        fill="freeze"
                      />
                    </rect>
                  </clipPath>
                </defs>
                <text
                  x="0"
                  y="30"
                  font-family="'Archivo Black', 'M PLUS Rounded 1c'"
                  font-size="24"
                  fill="none"
                  stroke={colorMode === "light" ? "Orange" : "white"}
                  stroke-width="2"
                  stroke-dasharray="200"
                  stroke-dashoffset="200"
                >
                  DOWNLOAD
                  <animate
                    attributeName="stroke-dashoffset"
                    from="200"
                    to="0"
                    dur="3s"
                    fill="freeze"
                  />
                </text>
                <text
                  x="0"
                  y="30"
                  font-family="'Archivo Black', 'M PLUS Rounded 1c'"
                  font-size="24"
                  fill={colorMode === "light" ? "#333" : "#111"}
                  clip-path="url(#textClip)"
                >
                  DOWNLOAD
                </text>
              </svg>
            </HStack>
            <Box fontSize="md">
              {getMessage({
                ja: "ダウンロードと説明は適宜追加します",
                us: "Downloads and descriptions will be added as appropriate.",
                cn: "将酌情添加下载和说明",
                language,
              })}
              <br />
              {getMessage({
                ja: "右側にある",
                us: "Click on the ",
                cn: "点击右侧的",
                language,
              })}
              <Badge backgroundColor="#444" color="white" mt={-0.5} mr={0.5}>
                {getMessage({
                  ja: "バッジ",
                  us: "badge",
                  cn: "奖章",
                  language,
                })}
              </Badge>
              {getMessage({
                ja: "をクリックすると説明ページが表示されます",
                us: "on the right to go to the description page",
                cn: "进入说明页面",
                language,
              })}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="auto"
                mt={2}
              ></Box>
            </Box>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
            spacing={0}
            mx={{ base: 2, md: 20, lg: 30, xl: 30 }}
          >
            <Card
              backgroundColor="transparent"
              border="1px solid"
              borderColor="gray.500"
            >
              <CardHeader p={2} pl={3} pb={0}>
                <Heading size="md" mb={3}>
                  {getMessage({
                    ja: "生産準備+",
                    language,
                  })}
                </Heading>
              </CardHeader>
              <Divider borderColor="gray.500" />
              <CardBody p={0}>
                <Box
                  position="relative"
                  px={2}
                  pl={7}
                  py={2}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                >
                  <DownloadButton
                    path="/download/Sjp"
                    isHovered={isHovered}
                    backGroundColor="green"
                    userName={currentUserName}
                  />
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        {getMessage({
                          ja: "Sjp+ 本体",
                          us: "Sjp+ main unit",
                          cn: "Sjp+ 机构",
                          language,
                        })}
                      </Heading>
                      <Flex justifyContent="flex-end" alignItems="center">
                        <Badge variant="solid" bg="green" mr={2} opacity={0.8}>
                          EXCEL2010
                        </Badge>
                        <Badge variant="solid" bg="green" mr={2} opacity={0.8}>
                          2013
                        </Badge>
                        <Badge
                          variant="outline"
                          colorScheme="gray"
                          mr={2}
                          opacity={0.8}
                        >
                          365
                        </Badge>
                      </Flex>
                      <Text pt="2" fontSize="sm">
                        {getMessage({
                          ja: "最初はこれから始めるのがおすすめです",
                          us: "I recommend starting with this one.",
                          cn: "建议从这里开始。",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "ハメ図を作成したりサブ形態を入力する本体",
                          us: "Main body to create frame diagrams and enter sub-forms",
                          cn: "用于创建框架图和输入子表格的主单元",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "PVSW.csvとRLTF.txtが必須",
                          us: "PVSW.csv and RLTF.txt are required",
                          cn: "需要 PVSW.csv 和 RLTF.txt 文件",
                          language,
                        })}
                        <br />
                        <Badge
                          backgroundColor="#444"
                          color="white"
                          mt={-0.5}
                          mr={0.5}
                        >
                          {"41." +
                            getMessage({
                              ja: "先ハメ誘導",
                              language,
                            })}
                        </Badge>
                        {getMessage({
                          ja: "は生産準備+が自動立案したサブ形態のみ対応",
                          us: "is only supported for sub-forms automatically planned by Production Preparation+.",
                          cn: "仅支持由生产准备+ 自动起草的子表格。",
                          language,
                        })}
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right">
                          #
                          {new Date(lastModified).toLocaleString("ja-JP", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                          <br />
                          {maxVersionString}
                        </Text>
                      </Flex>
                      <CustomBadge
                        path=""
                        media=""
                        text={
                          "10." +
                          getMessage({
                            ja: "竿レイアウト",
                            language,
                          })
                        }
                      />
                      <CustomBadge
                        path="/download/Sjp/40/"
                        media="html"
                        text={
                          "40." +
                          getMessage({
                            ja: "サブ図",
                            language,
                          })
                        }
                      />
                      <CustomBadge
                        path="/youtube/41"
                        media="movie"
                        text={
                          "41." +
                          getMessage({
                            ja: "先ハメ誘導",
                            language,
                          })
                        }
                      />
                      <CustomBadge
                        path="/56v3.1"
                        media="html"
                        text={
                          "56." +
                          getMessage({
                            ja: "配策誘導ナビ",
                            language,
                          })
                        }
                      />
                      <CustomBadge
                        path="/download/Sjp/70/"
                        media="html"
                        text={
                          "70+" +
                          getMessage({
                            ja: "ポイント点滅",
                            language,
                          })
                        }
                      />
                    </Stack>
                  </Flex>
                </Box>
                <Divider borderColor="gray.500" />
                <Box
                  position="relative"
                  px={2}
                  pl={7}
                  py={2}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                >
                  <DownloadButton
                    path="/download/camera"
                    isHovered={isHovered}
                    backGroundColor="#6C277D"
                    userName={currentUserName}
                    borderBottomLeftRadius="5px"
                  />
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        CAMERA+
                      </Heading>
                      <Flex justifyContent="flex-end" alignItems="center">
                        <Badge
                          variant="solid"
                          backgroundColor="#6C277D"
                          color="white"
                          opacity={0.8}
                          mr={2}
                        >
                          VB.net
                        </Badge>
                      </Flex>
                      <Text pt="2" fontSize="sm">
                        {getMessage({
                          ja: "コネクタを撮影するアプリケーション",
                          us: "Application to shoot connectors",
                          cn: "应用于拍摄连接器",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "SONYのカメラのみ対応",
                          us: "Only SONY cameras are supported.",
                          cn: "仅与 SONY 相机兼容。",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "生産準備+で写真撮影を実行時に自動インストールされるので使用には必要ありません",
                          us: "Automatically installed when running a photo shoot in Production Preparation+, so not required for use.",
                          cn: "无需使用，因为在 生产准备+ 中运行照片拍摄时会自动安装。",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "アプリケーションを修正したい場合のみダウンロードしてください",
                          us: "Download only if you want to modify your application",
                          cn: "仅在要修改应用程序时下载",
                          language,
                        })}
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right">
                          #2019/09/02
                          <br />
                          1.0.0.4
                        </Text>
                      </Flex>
                      <CustomBadge
                        path=""
                        media=""
                        text={getMessage({
                          ja: "撮影方法",
                          us: "Shooting Method",
                          cn: "拍摄方法",
                          language,
                        })}
                      />
                    </Stack>
                  </Flex>
                </Box>
                <Divider borderColor="gray.500" />
              </CardBody>
            </Card>
            <Box position="relative" h="20px" w="100%" m="0">
              <Box
                position="absolute"
                left="50%"
                top="0"
                bottom="0"
                borderLeft="1px solid"
                borderColor="gray.500"
                transform="translateX(-50%)"
              />
            </Box>
            <Card
              backgroundColor="transparent"
              border="1px solid"
              borderColor="gray.500"
              mx="24px"
            >
              <CardHeader p={1} pl={3} pb={0}>
                <Heading size="sm" mb={1}>
                  {getMessage({
                    ja: "誘導ナビ.net",
                    language,
                  })}
                </Heading>
              </CardHeader>
              <Divider borderColor="gray.500" />
              <CardBody p={0}>
                <Box
                  position="relative"
                  px={2}
                  pl={7}
                  py={2}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    bottom={0}
                    width="1.4rem"
                    backgroundColor="transparent"
                    borderRight="2px dotted"
                    borderColor="gray.500"
                  />
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        yudo.net
                      </Heading>
                      <Flex justifyContent="flex-end" alignItems="center">
                        <Badge
                          variant="solid"
                          backgroundColor="#6C277D"
                          color="white"
                          opacity={0.8}
                          mr={2}
                        >
                          VB.net
                        </Badge>
                      </Flex>
                      <Text pt="2" fontSize="sm">
                        {getMessage({
                          ja: "",
                          us: "Application for displaying ",
                          cn: "申请显示 ",
                          language,
                        })}
                        <Badge
                          backgroundColor="#444"
                          color="white"
                          mt={-0.5}
                          mr={0.5}
                        >
                          {"56." +
                            getMessage({
                              ja: "配策誘導ナビ",
                              language,
                            })}
                        </Badge>
                        {getMessage({
                          ja: " の表示とディスプレイ移動の為のアプリケーション",
                          us: " and moving the display.",
                          cn: " 和移动显示屏",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "ブラウザではCOMポートへのアクセス許可がページ毎に必要なので作成しました",
                          us: "Created because the browser requires permission to access the COM port on a page-by-page basis.",
                          cn: "创建的原因是浏览器需要逐页访问 COM 端口的权限",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: ".NetFrameWork4.8はインストーラーに含まれます",
                          us: ".NetFrameWork4.8 is included in the installer.",
                          cn: "安装程序中包含 .NetFrameWork4.8",
                          language,
                        })}
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right" right={0}>
                          #2018/11/26
                          <br />
                          1.0.0.10
                        </Text>
                      </Flex>
                    </Stack>
                  </Flex>
                </Box>

                <Divider borderColor="gray.500" />

                <Box
                  position="relative"
                  px={2}
                  pl={7}
                  py={2}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    bottom={0}
                    width="1.4rem"
                    backgroundColor="transparent"
                    borderRight="2px dotted"
                    borderColor="gray.500"
                  />
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Flex
                      direction="column"
                      alignItems="flex-start"
                      flex={1}
                      maxW={{ base: "40vw" }}
                    >
                      <Heading size="sm" mb={1.5} maxW="100%">
                        i_000L6470_SPI_stepMoter_sketch
                      </Heading>

                      <Flex justifyContent="flex-end" alignItems="center">
                        <Badge
                          variant="solid"
                          bg="#007582"
                          color="white"
                          opacity={0.8}
                          mr={2}
                        >
                          Arduino
                        </Badge>
                      </Flex>
                      <Text pt="2" fontSize="sm">
                        {getMessage({
                          ja: "yudo.netから信号を受けて配策誘導のディスプレイを移動させるArduinoのスケッチ",
                          us: "Sketch of an Arduino that receives a signal from yudo.net and moves the display of the routing guidance.",
                          cn: "接收来自 yudo.net 的信号并移动分发指南显示屏的 Arduino 的草图。",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "ArduinoのATmega328P系にプログラムを書き込む事で動作可能",
                          us: "Can be operated by writing a program to Arduino's ATmega328P series.",
                          cn: "可通过向 Arduino ATmega328P 系列编写程序来操作。",
                          language,
                        })}
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right">
                          #0000/00/00
                          <br />0
                        </Text>
                      </Flex>
                      <CustomBadge
                        path="/youtube/56.net"
                        media="movie"
                        text={getMessage({
                          ja: "ディスプレイ移動",
                          us: "Display Movement",
                          cn: "显示屏移动",
                          language,
                        })}
                      />
                    </Stack>
                  </Flex>
                </Box>
              </CardBody>
            </Card>
            <Box position="relative" h="20px" w="100%" m="0">
              <Box
                position="absolute" // 絶対位置で配置
                left="50%" // 左から50%の位置に配置
                top="0"
                bottom="0"
                borderLeft="1px solid" // 左に線を引く
                borderColor="gray.500"
                transform="translateX(-50%)" // 左に50%移動して中央に揃える
              />
            </Box>

            <Card
              backgroundColor="transparent"
              border="1px solid"
              borderColor="gray.500"
              mx="24px"
              mb="20px"
            >
              <Divider borderColor="gray.500" />
              <CardBody p={0}>
                <Box
                  position="relative"
                  px={2}
                  pl={7}
                  py={2}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                >
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    bottom={0}
                    width="1.4rem"
                    backgroundColor="transparent"
                    borderRight="2px dotted"
                    borderColor="gray.500"
                  />
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        {getMessage({
                          ja: "検査履歴システム",
                          language,
                        })}
                      </Heading>
                      <Flex justifyContent="flex-end" alignItems="center">
                        <Badge
                          variant="solid"
                          backgroundColor="#6C277D"
                          color="white"
                          opacity={0.8}
                          mr={2}
                        >
                          VB.net
                        </Badge>
                      </Flex>
                      <Text pt="2" fontSize="sm">
                        {getMessage({
                          ja: "検査実績の記憶とラベル印刷が可能",
                          us: "Capable of storing inspection results and printing labels.",
                          cn: "能够存储检测结果并打印标签",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "瀬戸内部品の開発なのでここではダウンロードできません",
                          us: "Not available for download here as it is a development of the Setouchi component.",
                          cn: "在此无法下载，因为它是 Setouchi 组件的开发版本。",
                          language,
                        })}
                        <br />
                        <Badge
                          backgroundColor="#444"
                          color="white"
                          mt={-0.5}
                          mr={0.5}
                        >
                          {"70." +
                            getMessage({
                              ja: "ポイント点滅",
                              language,
                            })}
                        </Badge>
                        {getMessage({
                          ja: "を利用すると更に作業効率の向上を図れます",
                          us: "can be used to further improve work efficiency.",
                          cn: "可以用来进一步提高工作效率。",
                          language,
                        })}
                        <br />
                        {"⚠️" +
                          getMessage({
                            ja: "ブラウザのバージョンはPCに依存しているので注意",
                            us: "Note that browser version is PC-dependent.",
                            cn: "请注意，浏览器版本取决于电脑。",
                            language,
                          })}
                        {getMessage({
                          ja: "※最新Verは不明です",
                          us: "*Latest version is unknown.",
                          cn: "*最新版本未知。",
                          language,
                        })}
                        <br />
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right" right={0}>
                          #2019/12/05
                          <br />
                          2.0.5.4
                        </Text>
                      </Flex>
                    </Stack>
                  </Flex>
                </Box>
              </CardBody>
            </Card>

            <Card
              backgroundColor="transparent"
              border="1px solid"
              borderColor="gray.500"
              mb="20px"
            >
              <CardHeader p={2} pl={3} pb={0}>
                <Heading size="md" mb={3}>
                  {getMessage({
                    ja: "部材一覧+",
                    language,
                  })}
                </Heading>
              </CardHeader>
              <Divider borderColor="gray.500" />
              <CardBody p={0}>
                <Box position="relative" px={4} pl={8} py={2} minH={140}>
                  <DownloadButton
                    path="/download/Bip"
                    isHovered={isHovered}
                    backGroundColor="green"
                    userName={currentUserName}
                  />
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="sm">Bip+</Heading>
                    <Flex justifyContent="flex-end" alignItems="center">
                      <Text
                        fontSize="xs"
                        margin="auto"
                        textAlign="right"
                      ></Text>
                    </Flex>
                  </Flex>
                  <Badge
                    variant="solid"
                    backgroundColor="green"
                    mr={2}
                    opacity={0.8}
                  >
                    EXCEL2010
                  </Badge>
                  <Badge
                    variant="solid"
                    backgroundColor="green"
                    mr={2}
                    opacity={0.8}
                  >
                    2013
                  </Badge>
                  <Badge variant="outline" colorScheme="gray" mr={2}>
                    365
                  </Badge>
                  <Text pt="2" fontSize="sm">
                    {getMessage({
                      ja: "全製品品番の使用部品リストの一覧表を作成",
                      us: "Create a list of parts used for all product part numbers",
                      cn: "编制所有产品部件号所用部件清单",
                      language,
                    })}
                    <br />
                    {getMessage({
                      ja: "EXTESを自動制御して手入力の手間とミスを無くせます",
                      us: "Automatically control EXTES to eliminate manual input and errors.",
                      cn: "自动控制 EXTES，消除手动输入和错误。",
                      language,
                    })}
                  </Text>
                </Box>
              </CardBody>
            </Card>
            <Card
              backgroundColor="transparent"
              border="1px solid"
              borderColor="gray.500"
              mb="20px"
            >
              <CardHeader p={2} pl={3} pb={0}>
                <Heading size="md" mb={3}>
                  {getMessage({
                    ja: "順立生産システム",
                    language,
                  })}
                </Heading>
              </CardHeader>
              <Divider borderColor="gray.500" />

              <CardBody p={0}>
                <Box
                  position="relative"
                  px={2}
                  pl={7}
                  py={2}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                >
                  <DownloadButton
                    path="/download/main"
                    isHovered={isHovered}
                    backGroundColor="#B02334"
                    userName={currentUserName}
                  />
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        main
                      </Heading>
                      <Flex justifyContent="flex-end" alignItems="center">
                        <Badge
                          variant="solid"
                          style={{ backgroundColor: "#B02334" }}
                          mr={2}
                          opacity={0.8}
                        >
                          ACCESS2003
                        </Badge>
                        <Badge
                          variant="solid"
                          style={{ backgroundColor: "#B02334" }}
                          mr={2}
                          opacity={0.8}
                        >
                          2010
                        </Badge>
                      </Flex>
                      <Text pt="2" fontSize="sm">
                        {getMessage({
                          ja: "一貫工程などの連続して生産する工程で有効",
                          us: "Effective in continuous production processes such as integrated processes.",
                          cn: "适用于连续生产工艺，如集成工艺",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "かんばん等のデータを読み込んでその順番で各作業場所で生産指示を行う",
                          us: "Reads Kanban and other data and gives production instructions at each work location in that order.",
                          cn: "读取来自看板和其他来源的数据，并按顺序在每个工作地点下达生产指令。",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "生産指示の対象は[作業者] [自動機(SA,AS)] ",
                          us: "The subject of the production order is [Operator] [automatic(SA,AS)] ",
                          cn: "生产订单受 [工人] [自动(SA,AS)] ",
                          language,
                        }) + "[CB10,70] [YSS]."}
                        <br />
                        {getMessage({
                          ja: "※宮崎部品が委託開発した3つのシステムを統合して機能追加しました",
                          us: "*Miyazaki Parts has integrated three systems developed on consignment and added functionality.",
                          cn: "*宮崎部品 整合了由 委托开发的三个系统，并增加了其他功能",
                          language,
                        })}
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right">
                          #2025/01/22
                          <br />
                          136
                        </Text>
                      </Flex>
                      <CustomBadge
                        path=""
                        media=""
                        text={
                          "main1." +
                          getMessage({
                            ja: "指示",
                            us: "directives",
                            cn: "指示",
                            language,
                          })
                        }
                      />
                      <CustomBadge
                        path="/youtube/main2"
                        media="movie"
                        text="main2.SSC"
                      />
                      <CustomBadge path="" media="" text="main3.CB" />
                      <CustomBadge
                        path="/youtube/main3.plc"
                        media="movie"
                        text="main3.PLC"
                      />
                    </Stack>
                  </Flex>
                </Box>
                <Divider borderColor="gray.500" />
                <Box
                  position="relative"
                  px={2}
                  pl={7}
                  py={2}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                >
                  <DownloadButton
                    path="/download/main3"
                    isHovered={isHovered}
                    backGroundColor="#005cb3"
                    userName={currentUserName}
                  />
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        {getMessage({
                          ja: "main3用PLC",
                          us: "PLC for main3",
                          cn: "main3用PLC",
                          language,
                        })}
                      </Heading>
                      <Flex justifyContent="flex-end" alignItems="center">
                        <Badge
                          variant="solid"
                          style={{ backgroundColor: "#005cb3" }}
                          mr={2}
                          opacity={0.8}
                        >
                          OMRON CP**
                        </Badge>
                      </Flex>
                      <Text pt="2" fontSize="sm">
                        {getMessage({
                          ja: "main3からPLCへデータを送信して部品セットを行う",
                          us: "Send data from main3 to PLC to set parts",
                          cn: "从 main3 向 PLC 发送数据以设置部件。",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "main3からシリアル送信するデータは2進数でPLC受信で対応した内部リレーをON/OFFする",
                          us: "Data sent serially from main3 is binary and turns on/off the internal relay corresponding to the PLC reception.",
                          cn: "从 main3 串行发送的数据为二进制数，在 PLC 接收到这些数据时会打开/关闭相应的内部继电器。",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "このラダー図そのままでは使用できるケースは少ないですが部品セットの参考になると思います",
                          us: "This ladder diagram can be used as is in only a few cases, but it can be used as a reference for the parts set.",
                          cn: "这种梯形图只能在少数情况下使用，但可以作为组件集的参考。",
                          language,
                        })}
                        <br />
                        {getMessage({
                          ja: "オムロン社のCX-Programmerが必要です",
                          us: "Requires Omron's CX-Programmer",
                          cn: "需要使用 Omron 的 CX-Programmer",
                          language,
                        })}
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right">
                          #2024/03/13
                          <br />
                          17
                        </Text>
                      </Flex>
                      <Flex>
                        <Flex direction="column" mr={2}></Flex>
                        <Flex direction="column"></Flex>
                      </Flex>
                    </Stack>
                  </Flex>
                </Box>

                <Divider borderColor="gray.500" />
                <Box position="relative" px={4} pl={8} py={2}>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    bottom={0}
                    width="1.4rem"
                    backgroundColor="transparent"
                    borderRight="2px dotted"
                    borderColor="gray.500"
                  />
                  <Heading size="xs" textTransform="uppercase">
                    {getMessage({
                      ja: "初回セットアップ",
                      us: "Initial Setup",
                      cn: "初始设置",
                      language,
                    })}
                  </Heading>
                  <Badge variant="solid" colorScheme="purple" mr={2}></Badge>
                  <Text pt="2" fontSize="sm">
                    {getMessage({
                      ja: "初回のPCセットアップに必要なファイル",
                      us: "Files required for initial PC setup",
                      cn: "初始 PC 设置所需的文件。",
                      language,
                    })}
                    <br />
                    {getMessage({
                      ja: "セットアップ終了後はmainのみ更新を行う",
                      us: "Only main will be updated after setup is complete.",
                      cn: "设置完成后只更新 main。",
                      language,
                    })}
                  </Text>
                </Box>
              </CardBody>
            </Card>
            <Card
              backgroundColor="transparent"
              border="1px solid"
              borderColor="gray.500"
              mb="20px"
            >
              <CardHeader p={2} pl={3} pb={0}>
                <Heading size="md" mb={3}>
                  {getMessage({
                    ja: "誘導ポイント設定一覧表",
                    language,
                  })}
                </Heading>
              </CardHeader>
              <Divider borderColor="gray.500" />
              <CardBody p={0}>
                <Box position="relative" px={4} pl={8} py={2}>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    bottom={0}
                    width="1.4rem"
                    backgroundColor="transparent"
                    borderRight="2px dotted"
                    borderColor="gray.500"
                  />
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="sm">
                      {getMessage({
                        ja: "誘導ポイント設定一覧表",
                        language,
                      })}
                    </Heading>
                    <Flex justifyContent="flex-end" alignItems="center">
                      <Text
                        fontSize="xs"
                        margin="auto"
                        textAlign="right"
                      ></Text>
                    </Flex>
                  </Flex>
                  <Badge
                    variant="solid"
                    backgroundColor="green"
                    mr={2}
                    opacity={0.8}
                  >
                    EXCEL2010
                  </Badge>
                  <Badge
                    variant="solid"
                    backgroundColor="green"
                    mr={2}
                    opacity={0.8}
                  >
                    2013
                  </Badge>
                  <Badge variant="outline" colorScheme="gray" mr={2}>
                    365
                  </Badge>
                  <Text pt="2" fontSize="sm">
                    {getMessage({
                      ja: "誘導ポイント設定一覧表(作業内容とインラインNo./忘れん棒番号/製品品番の使い分けを記した作業手順書)",
                      us: "Induction point setting list (work procedure document describing the work and the use of inline No./forgotten bar number/product part number)",
                      cn: "上岗点设置清单（附有工作描述的工作程序以及内联编号/遗忘的条形码/产品部件编号的使用）。",
                      language,
                    })}
                    {getMessage({
                      ja: "からYICの書き込み器にデータ転送を行います。作業効率化/入力ミス削減が図れます。",
                      us: "The data is transferred from the YIC to the writer of the YIC. This improves work efficiency and reduces input errors.",
                      cn: "数据从 YIC 传输到 YIC 写入器。提高工作效率/减少输入错误。",
                      language,
                    })}
                  </Text>
                </Box>
              </CardBody>
            </Card>
            <Card
              backgroundColor="transparent"
              border="1px solid"
              borderColor="gray.500"
            >
              <CardHeader p={2} pl={3} pb={0}>
                <Heading size="md" mb={3}>
                  {getMessage({
                    ja: "その他ライブラリなど",
                    us: "Other libraries, etc.",
                    cn: "其他图书馆等",
                    language,
                  })}
                </Heading>
              </CardHeader>
              <Divider borderColor="gray.500" />
              <CardBody p={0}>
                <Box position="relative" px={4} pl={8} py={2} minH={"9em"}>
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    bottom={0}
                    width="1.4rem"
                    backgroundColor="transparent"
                    borderRight="2px dotted"
                    borderColor="gray.500"
                  />
                  <DownloadButton
                    path="/download/library"
                    isHovered={isHovered}
                    backGroundColor="#333"
                    userName={currentUserName}
                    borderBottomLeftRadius="5px"
                  />
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="sm">
                      {getMessage({
                        ja: "Windowsライブラリ",
                        us: "Windows Library",
                        cn: "视窗图书馆",
                        language,
                      })}
                    </Heading>
                    <Flex justifyContent="flex-end" alignItems="center">
                      <Text
                        fontSize="xs"
                        margin="auto"
                        textAlign="right"
                      ></Text>
                    </Flex>
                  </Flex>
                  <Badge
                    variant="solid"
                    color="white"
                    backgroundColor="#333"
                    mr={2}
                    opacity={0.8}
                  >
                    .OCX
                  </Badge>
                  <Badge
                    variant="solid"
                    color="white"
                    backgroundColor="#333"
                    mr={2}
                    opacity={0.8}
                  >
                    .DLL
                  </Badge>
                  <Text pt="2" fontSize="sm">
                    {getMessage({
                      ja: "WindowsOSが新しくなった場合にライブラリが削除される事があります。ライブラリが不足している場合はここからダウンロードして使用してください。",
                      us: "The library may be deleted when the Windows OS is newer. If the library is missing, download it from here and use it.",
                      cn: "Windows 操作系统更新后，程序库可能会被删除。如果缺少库，请从此处下载并使用。",
                      language,
                    })}
                    <br />
                    <br />
                  </Text>
                </Box>
              </CardBody>
            </Card>
            <HStack spacing={2} justifyContent="center" mt={0} height="100%">
              <Image
                src="/images/illust/hippo/hippo_001.png"
                alt="hippo_001.png"
                height={200}
                style={{ marginTop: "40px" }}
              />
              <Hippo_001_wrap />
            </HStack>
          </SimpleGrid>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
              maxW="90vw"
              maxH="95%"
              bg={colorMode === "light" ? "#f2e9df" : "black"}
            >
              <ModalCloseButton right="3px" _focus={{ boxShadow: "none" }} />
              {/* <ModalHeader></ModalHeader> */}
              <ModalBody mx={0}>
                <Box
                  width="99%"
                  height={{ base: "70vh", sm: "75vh", md: "75vh", lg: "85vh" }}
                  border="none"
                  maxW="90vw"
                >
                  <iframe
                    src={modalPath}
                    style={{ width: "100%", height: "100%", border: "none" }} // iframeのサイズを100%に設定
                    title="Embedded Content"
                  />
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
        <Box mb={10} />
      </Content>
    </>
  );
}
