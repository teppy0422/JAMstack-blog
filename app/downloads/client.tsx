"use client";

import React, { useState } from "react";
import Content from "@/components/content";

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
  Button,
  Spacer,
  Link,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート
import NextImage from "next/image";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import DownloadButton from "./parts/DownloadButton";
import styles from "@/styles/home.module.scss";
import { useUserContext } from "@/contexts/useUserContext";
import { AnimationImage } from "@/components/ui/CustomImage";
import CustomLinkBox from "./parts/customLinkBox";
import CustomPopver from "@/components/ui/popver";
import Sidebar from "@/components/sidebar";
import { Global } from "@emotion/react";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import ResponsiveModal from "@/components/responsiveModal";

import LatestUpdateDate from "./parts/LatestUpdateDate";
import { ChangelogAccordion } from "./parts/ChangelogAccordion";
import UploadSjp from "app/skillBlogs/components/howTo/UploadSjp";
import BadgeList from "@/components/ui/BadgeList";
import customcardHeader from "./parts/CustomCardHeader";
import CustomCardHeader from "./parts/CustomCardHeader";
import DownloadIconAnimation from "./parts/DownloadIconAnimation";
import CustomModalTab from "./parts/CustomModalTab";
import CustomModal from "app/skillBlogs/components/customModal";
import { ToggleSection } from "./parts/ToggleSection";

export default function Ui({ filterId }: { filterId?: string }) {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue(
    "custom.theme.light.500",
    "custom.theme.dark.500"
  );
  const { currentUserId, currentUserName } = useUserContext();

  const [isHovered, setIsHovered] = useState(false);
  const [showAllMap, setShowAllMap] = useState<Record<number, boolean>>({});
  const toggleShowAll = (groupIndex: number) => {
    setShowAllMap((prev) => ({
      ...prev,
      [groupIndex]: !prev[groupIndex],
    }));
  };

  const { language, setLanguage } = useLanguage();
  const [hoverdId, setHoveredId] = useState<string | null>(null);

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
      <Content>
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
            <HStack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              mb={3}
            >
              <DownloadIconAnimation />
              <AnimationImage
                src="/images/illust/hippo/hippo_007_pixcel.gif"
                width="50px"
                position="relative"
                left="-40px"
              />
            </HStack>
            <Box fontSize="md">
              {getMessage({
                ja: "ダウンロードは適宜追加していきます",
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
              <br />
              {getMessage({
                ja: "過去のバージョンが必要な場合は連絡ください",
                us: "Please contact us if you need previous versions.",
                cn: "如果您需要以前的版本，请联系我们。",
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
            {(!filterId || filterId === "sjp") && (
              <>
                <Card
                  backgroundColor="transparent"
                  border="1px solid"
                  borderColor="gray.500"
                >
                  <CustomCardHeader
                    text={getMessage({
                      ja: "生産準備+",
                      language,
                    })}
                    link={<UploadSjp />}
                  />
                  <Divider borderColor="gray.500" />
                  <CardBody p={0}>
                    <Box
                      key="01"
                      position="relative"
                      px={2}
                      pl={7}
                      py={1}
                      _hover={{
                        boxShadow: "dark-lg",
                      }}
                      onMouseEnter={() => setHoveredId("01")}
                    >
                      <DownloadButton
                        path="/download/sjp"
                        isHovered={hoverdId === "01"}
                        backGroundColor="custom.excel"
                        userName={currentUserName}
                      />
                      <Flex
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Flex
                          direction="column"
                          alignItems="flex-start"
                          flex={1}
                        >
                          <Heading size="sm" mb="3px">
                            {getMessage({
                              ja: "Sjp+ 本体",
                              us: "Sjp+ main unit",
                              cn: "Sjp+ 机构",
                              language,
                            })}
                          </Heading>
                          <BadgeList
                            labels={["EXCEL2010", "EXCEL2013", "EXCEL365"]}
                            useGetColor={[true, true, false]}
                          />
                          <Text pt="3px" fontSize="sm">
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
                            <Box fontSize="xs" textAlign="right">
                              <LatestUpdateDate
                                folderPath="/download/sjp/"
                                removeStrings={[]}
                              />
                            </Box>
                          </Flex>
                          <CustomModalTab
                            path=""
                            text="10.竿レイアウト"
                            media=""
                          />
                          <CustomModalTab
                            path="./tabs/40/"
                            text="10.サブ図"
                            media="html"
                          />
                          <CustomModalTab
                            path="./tabs/41/"
                            text="41.先ハメ誘導"
                            media="movie"
                          />
                          <CustomModalTab
                            path="./tabs/56/"
                            text="56.配策誘導ナビ"
                            media="html"
                          />
                          <CustomModalTab
                            path="./tabs/70/"
                            text="70.ポイント点滅"
                            media="html"
                          />
                        </Stack>
                      </Flex>
                    </Box>
                    <Divider borderColor="gray.500" />
                    <ChangelogAccordion
                      changelog={[
                        {
                          version: "3.101.18",
                          date: "2025/04/25",
                          reason: [
                            "82111_Aで検査履歴が作成できない?端末114がネック",
                          ],
                          change: [
                            "114でのstopを削除",
                            "まとめて作成する場合に進捗を必ず存在する端末を返すように修正",
                          ],
                          inCharge: ["高知", "王さん"],
                        },
                        {
                          version: "3.100.29",
                          date: "2024/10/18",
                          reason: [
                            "部品リスト作成時に新規部品がある場合Edgeエラー",
                          ],
                          change: ["EdgeまたはIEの選択式に変更"],
                          inCharge: ["高知", "王さん"],
                          html: "/html/sjp/",
                          htmlText: " ",
                        },
                        {
                          version: "3.100.26",
                          date: "2024/10/07",
                          change: ["ハメ図作成の選択肢にコネクタ性別を追加"],
                          inCharge: ["高知", "王さん", "徳島", "山田さん"],
                          html: "/html/sjp/",
                          htmlText: "コネクタ性別がMaleの場合は点線にする",
                        },
                        {
                          version: "3.100.00",
                          date: "2024/09/15",
                          change: ["タッチ操作に対応した配策誘導ナビの追加"],
                          inCharge: ["開発", "書き直し", "新機能"],
                          html: "/html/sjp/",
                          htmlText: "ハメ図の数字は相手端末ナンバー",
                        },
                        {
                          version: "3.005.19",
                          date: "2024/08/25",
                          change: [
                            "配策誘導ナビ端末-のデザインとコードを最適化",
                          ],
                          inCharge: ["開発", "書き直し"],
                          html: "/html/sjp/",
                          htmlText: "ハメ図の数字は相手端末ナンバー",
                        },
                        {
                          version: "3.005.18",
                          date: "2024/08/25",
                          change: [
                            "配策誘導ナビ端末のデザインとコードを最適化",
                          ],
                          inCharge: ["開発", "書き直し"],
                          html: "/html/sjp/",
                          htmlText: " ",
                        },
                        {
                          version: "3.005.17",
                          date: "2024/08/24",
                          change: ["配策誘導ナビ構成のタブ情報を最適化"],
                          inCharge: ["開発", "書き直し"],
                          html: "/html/sjp/",
                          htmlText: "電線コードと端末部品名を追加",
                        },
                        {
                          version: "3.005.16",
                          date: "2024/08/24",
                          reason: ["画面サイズが小さい場合にデザインが崩れる"],
                          change: ["レスポンシブデザインに対応"],
                          inCharge: ["開発", "書き直し", "不具合"],
                          html: "/html/sjp/",
                          htmlText:
                            "構成No毎の.cssを廃止->ファイルサイズ284->264MB。ファイル数1269->1105",
                        },
                        {
                          version: "3.005.15",
                          date: "2024/08/24",
                          reason: ["モバイルでサイズのバランスが崩れる"],
                          change: ["レスポンシブデザインに対応"],
                          inCharge: ["開発", "書き直し", "不具合"],
                          html: "/html/sjp/",
                          htmlText: "検査履歴システム※IE11以上が必要",
                        },
                        {
                          version: "3.005.06",
                          date: "2024/08/18",
                          change: ["ポイント点滅をグループ単位で作成に対応"],
                          inCharge: ["開発", "書き直し"],
                          html: "/html/sjp/",
                          htmlText: "デザインの変更",
                        },
                        {
                          version: "3.004.94",
                          date: "2024/07/18",
                          reason: [
                            "ダブり圧着で先ハメの時に片方しか赤枠にならない",
                          ],
                          change: ["複数電線でも赤枠になるように修正"],
                          inCharge: ["高知", "王さん", "不具合"],
                          html: "/html/sjp/",
                          htmlText:
                            "ダブり圧着の赤枠を複数電線でも赤枠になるように修正",
                        },
                        {
                          version: "3.004.86",
                          date: "2024/07/14",
                          reason: [
                            "検査履歴システムで先ハメ/後ハメが分かるようにしたい",
                          ],
                          change: [
                            "検査履歴用の画像で共用ポイントを点滅するように修正",
                          ],
                          inCharge: ["高知", "王さん"],
                          html: "/html/sjp/",
                          htmlText:
                            "先ハメ/後ハメが分かるように更新。共用ポイントは点滅",
                        },
                        {
                          version: "3.004.82",
                          date: "2024/06/10",
                          change: ["空のフォントサイズを9に変更"],
                          inCharge: ["徳島", "秋山さん"],
                        },
                      ]}
                    />
                  </CardBody>
                </Card>
                <ToggleSection
                  id={3}
                  isShown={showAllMap[3]}
                  toggleShowAll={toggleShowAll}
                >
                  <Card bg={bg} border="1px solid" borderColor="gray.500">
                    <CustomCardHeader
                      text={getMessage({
                        ja: "コネクタ撮影",
                        language,
                      })}
                      textSize="sm"
                    />
                    <Divider borderColor="gray.500" />
                    <CardBody p={0}>
                      <Box
                        key="02"
                        position="relative"
                        px={2}
                        pl={7}
                        py={1}
                        _hover={{
                          boxShadow: "dark-lg",
                        }}
                        onMouseEnter={() => setHoveredId("02")}
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
                        <Flex
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Flex
                            direction="column"
                            alignItems="flex-start"
                            flex={1}
                          >
                            <Heading size="sm" mb="3px">
                              CAMERA+
                            </Heading>
                            <BadgeList labels={["VB.net"]} />
                            <Text pt="3px" fontSize="sm">
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
                            <CustomModalTab
                              path=""
                              text={getMessage({
                                ja: "撮影方法",
                                us: "Shooting Method",
                                cn: "拍摄方法",
                                language,
                              })}
                              media=""
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
                    bg={bg}
                    border="1px solid"
                    borderColor="gray.500"
                    mx="24px"
                  >
                    <CustomCardHeader
                      text={getMessage({
                        ja: "誘導ナビ.net",
                        language,
                      })}
                      textSize="sm"
                    />
                    <Divider borderColor="gray.500" />
                    <CardBody p={0}>
                      <Box
                        position="relative"
                        px={2}
                        pl={7}
                        py={1}
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
                        <Flex
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Flex
                            direction="column"
                            alignItems="flex-start"
                            flex={1}
                          >
                            <Heading size="sm" mb="3px">
                              yudo.net
                            </Heading>
                            <BadgeList labels={["VB.net"]} />
                            <Text pt="3px" fontSize="sm">
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
                        py={1}
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
                        <Flex
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Flex
                            direction="column"
                            alignItems="flex-start"
                            flex={1}
                            maxW={{ base: "40vw" }}
                          >
                            <Heading size="sm" mb="3px" maxW="100%">
                              i_000L6470_SPI_stepMoter_sketch
                            </Heading>
                            <BadgeList labels={["Arduino"]} />
                            <Text pt="3px" fontSize="sm">
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
                            <CustomModalTab
                              path="./tabs/56.net"
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
                    bg={bg}
                    border="1px solid"
                    borderColor="gray.500"
                    mx="24px"
                  >
                    <CardBody p={0}>
                      <Box
                        position="relative"
                        px={2}
                        pl={7}
                        py={1}
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
                        <Flex
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Flex
                            direction="column"
                            alignItems="flex-start"
                            flex={1}
                          >
                            <Heading size="sm" mb="3px">
                              {getMessage({
                                ja: "検査履歴システム",
                                language,
                              })}
                            </Heading>
                            <BadgeList labels={["VB.net"]} />
                            <Text pt="3px" fontSize="sm">
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
                </ToggleSection>
              </>
            )}
            {(!filterId || filterId === "bip") && (
              <>
                <Card
                  bg={bg}
                  border="1px solid"
                  borderColor="gray.500"
                  my="20px"
                >
                  <CustomCardHeader
                    text={getMessage({
                      ja: "部材一覧+",
                      language,
                    })}
                    textSize="md"
                  />
                  <Divider borderColor="gray.500" />
                  <CardBody p={0}>
                    <Box
                      key="03"
                      position="relative"
                      px={2}
                      pl={7}
                      py={1}
                      minH={140}
                      onMouseEnter={() => setHoveredId("03")}
                    >
                      <DownloadButton
                        path="/download/bip/"
                        isHovered={hoverdId === "03"}
                        backGroundColor="green"
                        userName={currentUserName}
                      />
                      <Flex
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Flex
                          direction="column"
                          alignItems="flex-start"
                          flex={1}
                        >
                          <Heading size="sm" mb="3px">
                            Bip+
                          </Heading>
                          <BadgeList
                            labels={["EXCEL2010", "EXCEL2013", "EXCEL365"]}
                            useGetColor={[true, true, false]}
                          />
                          <Text pt="3px" fontSize="sm">
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
                        </Flex>
                        <Stack
                          spacing={1}
                          direction="column"
                          alignItems="flex-start"
                        >
                          <Flex justifyContent="flex-end" width="100%">
                            <Box fontSize="xs" textAlign="right">
                              <LatestUpdateDate
                                folderPath="/download/bip/"
                                removeStrings={[]}
                              />
                            </Box>
                          </Flex>
                        </Stack>
                      </Flex>
                    </Box>
                  </CardBody>
                </Card>
              </>
            )}
            {(!filterId || filterId === "jdss") && (
              <>
                <Card bg={bg} border="1px solid" borderColor="gray.500">
                  <CustomCardHeader
                    text={getMessage({
                      ja: "順立生産システム",
                      language,
                    })}
                    textSize="md"
                  />
                  <Divider borderColor="gray.500" />
                  <CardBody p={0}>
                    <Box
                      key="04"
                      position="relative"
                      px={2}
                      pl={7}
                      py={1}
                      _hover={{
                        boxShadow: "dark-lg",
                      }}
                      onMouseEnter={() => setHoveredId("04")}
                    >
                      <DownloadButton
                        path="/download/jdss/main"
                        isHovered={hoverdId === "04"}
                        backGroundColor="custom.access"
                        userName={currentUserName}
                      />
                      <Flex
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Flex
                          direction="column"
                          alignItems="flex-start"
                          flex={1}
                        >
                          <Heading size="sm" mb="3px">
                            main
                          </Heading>

                          <BadgeList labels={["ACCESS2003", "ACCESS2010"]} />
                          <Text pt="3px" fontSize="sm">
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
                            <Box fontSize="xs" textAlign="right">
                              <LatestUpdateDate
                                folderPath="./download/jdss/main"
                                removeStrings={[]}
                              />
                            </Box>
                          </Flex>
                          <CustomModalTab
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
                          <CustomModalTab
                            path="./tabs/main2"
                            media="movie"
                            text="main2.SSC"
                          />
                          <CustomModalTab path="" media="" text="main3.CB" />
                          <CustomModalTab
                            path="./tabs/main3plc"
                            media="movie"
                            text="main3.PLC"
                          />
                        </Stack>
                      </Flex>
                    </Box>
                    <Divider borderColor="gray.500" />
                    <ChangelogAccordion
                      changelog={[
                        {
                          version: "165",
                          date: "2025/03/18",
                          reason: [
                            "access2003のみ(?)で送信/印刷ボタンを押すと設定枚数以上に処理される",
                          ],
                          change: [
                            "送信/印刷ボタンを押した時のみ処理完了までこのボタンを無効",
                            "test",
                          ],
                          inCharge: ["徳島", "小松さん", "不具合"],
                        },
                        {
                          version: "164",
                          date: "2025/02/05",
                          reason: [],
                          change: [
                            "軽微な不具合の修正",
                            "送信/印刷の数量の初期値を設定に追加",
                          ],
                          inCharge: ["徳島", "作業者さん"],
                        },
                        {
                          version: "163",
                          date: "2025/02/04",
                          reason: ["access2003で開くとaccessが強制終了する"],
                          change: ["Form!F_main2_settingが破損=>作り直し"],
                          inCharge: ["徳島", "訪問対応", "小松さん"],
                        },
                        {
                          html: "/html/Jdss/",
                          htmlText: "デザインの変更",
                          version: "158",
                          date: "2025/02/03",
                          reason: [],
                          change: ["不要なコードの削除", "デザインの変更"],
                          inCharge: ["徳島"],
                        },
                        {
                          html: "/html/Jdss/",
                          htmlText:
                            "自動機を使用しない場合にラベル印刷だけ行えるように修正",
                          version: "123",
                          date: "2024/10/07",
                          reason: ["main2_次回QRラベルが飛ぶ時がある"],
                          change: ["SQLクエリ->専用関数に書き直し"],
                          inCharge: ["徳島", "小松さん", "藤原さん"],
                        },
                      ]}
                    />
                  </CardBody>
                </Card>
                <ToggleSection
                  id={2}
                  isShown={showAllMap[2]}
                  toggleShowAll={toggleShowAll}
                >
                  <Card
                    bg={bg}
                    border="1px solid"
                    borderColor="gray.500"
                    mx="20px"
                    overflow="hidden"
                  >
                    <CustomCardHeader
                      text={getMessage({
                        ja: "PLCとの連携",
                        language,
                      })}
                      textSize="sm"
                    />
                    <Divider borderColor="gray.500" />
                    <CardBody p={0}>
                      <Box
                        key="05"
                        position="relative"
                        px={2}
                        pl={7}
                        py={1}
                        _hover={{
                          boxShadow: "dark-lg",
                        }}
                        onMouseEnter={() => setHoveredId("05")}
                      >
                        <DownloadButton
                          path="/download/jdss/main3/"
                          isHovered={hoverdId === "05"}
                          backGroundColor="custom.omron"
                          userName={currentUserName}
                        />
                        <Flex
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Flex
                            direction="column"
                            alignItems="flex-start"
                            flex={1}
                          >
                            <Heading size="sm" mb="3px">
                              {getMessage({
                                ja: "main3用ラダー図",
                                us: "PLC for main3",
                                cn: "main3 的梯形图",
                                language,
                              })}
                            </Heading>
                            <BadgeList labels={["OMRON CP**"]} />
                            <Text pt="3px" fontSize="sm">
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
                              <Box fontSize="xs" textAlign="right">
                                <LatestUpdateDate
                                  folderPath="/download/jdss/main3/"
                                  removeStrings={[]}
                                />
                              </Box>
                            </Flex>
                            <Flex>
                              <Flex direction="column" mr={2}></Flex>
                              <Flex direction="column"></Flex>
                            </Flex>
                          </Stack>
                        </Flex>
                      </Box>
                      <Divider borderColor="gray.500" />
                      <ChangelogAccordion
                        changelog={[
                          {
                            version: "17",
                            date: "2024/03/13",
                            change: ["最終更新"],
                          },
                        ]}
                      />
                    </CardBody>
                  </Card>
                </ToggleSection>
              </>
            )}
            {(!filterId || filterId === "yps") && (
              <>
                <Card
                  bg={bg}
                  border="1px solid"
                  borderColor="gray.500"
                  mt="20px"
                >
                  <CustomCardHeader
                    text={getMessage({
                      ja: "誘導ポイント設定一覧表",
                      language,
                    })}
                    link={
                      <Link
                        href="/skillBlogs/pages/0010"
                        isExternal
                        fontWeight="bold"
                        fontSize="xs"
                      >
                        <Icon as={ExternalLinkIcon} mr={0.5} />
                        {getMessage({
                          ja: "使い方のページ",
                          us: "Upload Procedure",
                          cn: "上传程序",
                          language,
                        })}
                      </Link>
                    }
                  />
                  <Divider borderColor="gray.500" />
                  <CardBody p={0}>
                    <Box
                      key="07"
                      position="relative"
                      px={2}
                      pl={7}
                      py={1}
                      minH={"9em"}
                      onMouseEnter={() => setHoveredId("07")}
                    >
                      <DownloadButton
                        path="/download/yps/yps/"
                        isHovered={hoverdId === "07"}
                        backGroundColor="green"
                        userName={currentUserName}
                      />
                      <Flex
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Flex
                          direction="column"
                          alignItems="flex-start"
                          flex={1}
                        >
                          <Heading size="sm" mb="3px">
                            {getMessage({
                              ja: "誘導ポイント設定一覧表",
                              language,
                            })}
                          </Heading>
                          <BadgeList
                            labels={["EXCEL2010", "EXCEL2013", "EXCEL365"]}
                            useGetColor={[true, true, false]}
                          />
                          <Text pt="3px" fontSize="sm">
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
                        </Flex>
                        <Stack
                          spacing={1}
                          direction="column"
                          alignItems="flex-start"
                        >
                          <Flex justifyContent="flex-end" width="100%">
                            <Box fontSize="xs" textAlign="right">
                              <LatestUpdateDate
                                folderPath="./download/yps/yps/"
                                removeStrings={[]}
                              />
                            </Box>
                          </Flex>
                        </Stack>
                      </Flex>
                    </Box>
                    <Divider borderColor="gray.500" />
                    <ChangelogAccordion
                      changelog={[
                        {
                          version: "1.01",
                          date: "2025/06/04",
                          reason: ["印鑑の設定が無い時にエラーが出る"],
                          change: ["文字サイズを取得する関数を追加"],
                          inCharge: ["徳島", "桒原さん", "不具合"],
                        },
                        {
                          version: "1.00",
                          date: "2025/06/02",
                          change: ["リリース"],
                        },
                        {
                          version: "0.61",
                          date: "2025/05/26",
                          change: ["パスチェックを修正"],
                        },
                      ]}
                    />
                  </CardBody>
                </Card>
                <ToggleSection
                  id={1}
                  isShown={showAllMap[1]}
                  toggleShowAll={toggleShowAll}
                >
                  <Card
                    bg={bg}
                    border="1px solid"
                    borderColor="gray.500"
                    mx="24px"
                    overflow="hidden"
                  >
                    <CardBody p={0}>
                      <Box
                        key="08"
                        position="relative"
                        px={2}
                        pl={7}
                        py={1}
                        minH={"9em"}
                        onMouseEnter={() => setHoveredId("08")}
                      >
                        <DownloadButton
                          path="/download/yps/verup/"
                          isHovered={hoverdId === "08"}
                          backGroundColor="green"
                          userName={currentUserName}
                        />
                        <Flex
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Flex
                            direction="column"
                            alignItems="flex-start"
                            flex={1}
                          >
                            <Heading size="sm" mb="3px">
                              {getMessage({
                                ja: "バージョンアップ",
                                language,
                              })}
                            </Heading>
                            <BadgeList
                              labels={["EXCEL2010", "EXCEL2013", "EXCEL365"]}
                              useGetColor={[true, true, false]}
                            />
                            <Text pt="3px" fontSize="sm">
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
                          </Flex>
                          <Stack
                            spacing={1}
                            direction="column"
                            alignItems="flex-start"
                          >
                            <Flex justifyContent="flex-end" width="100%">
                              <Box fontSize="xs" textAlign="right">
                                <LatestUpdateDate
                                  folderPath="./download/yps/verup/"
                                  removeStrings={[]}
                                />
                              </Box>
                            </Flex>
                          </Stack>
                        </Flex>
                      </Box>
                      <Divider borderColor="gray.500" />
                      <ChangelogAccordion
                        changelog={[
                          {
                            version: "1.00",
                            date: "2025/06/02",
                            change: ["リリース"],
                          },
                        ]}
                      />
                    </CardBody>
                  </Card>
                </ToggleSection>
              </>
            )}
            {(!filterId || filterId === "library") && (
              <>
                <Card
                  mt="20px"
                  bg={bg}
                  border="1px solid"
                  borderColor="gray.500"
                  overflow="hidden"
                >
                  <CustomCardHeader
                    text={getMessage({
                      ja: "その他ライブラリなど",
                      us: "Other libraries, etc.",
                      cn: "其他图书馆等",
                      language,
                    })}
                    textSize="sm"
                  />
                  <Divider borderColor="gray.500" />
                  <CardBody p={0}>
                    <Box
                      key="06"
                      position="relative"
                      px={2}
                      pl={7}
                      py={1}
                      minH={"9em"}
                      onMouseEnter={() => setHoveredId("06")}
                    >
                      <DownloadButton
                        path="/download/library/code39/"
                        isHovered={hoverdId === "06"}
                        backGroundColor="#333"
                        userName={currentUserName}
                      />
                      <Flex
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Flex
                          direction="column"
                          alignItems="flex-start"
                          flex={1}
                        >
                          <Heading size="sm" mb="3px">
                            {getMessage({
                              ja: "バーコードフォント",
                              us: "bar code font",
                              cn: "条形码字体",
                              language,
                            })}
                          </Heading>
                          <BadgeList labels={["Windows", "Mac", "Linux"]} />
                          <Text pt="3px" fontSize="sm">
                            {getMessage({
                              ja: "バーコードを表示するためのフォント",
                              us: "",
                              cn: "",
                              language,
                            })}
                            <br />
                            <br />
                          </Text>
                        </Flex>
                        <Stack
                          spacing={1}
                          direction="column"
                          alignItems="flex-start"
                        >
                          <Flex justifyContent="flex-end" width="100%">
                            <Box fontSize="xs" textAlign="right">
                              <LatestUpdateDate
                                folderPath="/download/library/code39/"
                                removeStrings={[]}
                              />
                            </Box>
                          </Flex>
                        </Stack>
                      </Flex>
                    </Box>
                    <Divider borderColor="gray.500" />
                    <Box
                      key="09"
                      position="relative"
                      px={2}
                      pl={7}
                      py={1}
                      minH={"9em"}
                      onMouseEnter={() => setHoveredId("09")}
                    >
                      <DownloadButton
                        path="/download/library/MSCOMM32/"
                        isHovered={hoverdId === "09"}
                        backGroundColor="custom.windows"
                        userName={currentUserName}
                      />
                      <Flex
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Flex
                          direction="column"
                          alignItems="flex-start"
                          flex={1}
                        >
                          <Heading size="sm" mb="3px">
                            {getMessage({
                              ja: "シリアル通信用ライブラリ",
                              us: "",
                              cn: "",
                              language,
                            })}
                          </Heading>
                          <BadgeList
                            labels={["Windows", "VB6", "VB.net"]}
                            useGetColor={[true, true, false]}
                          />
                          <Text pt="3px" fontSize="sm">
                            {getMessage({
                              ja: "VBの環境でシリアル通信を行うためのライブラリ",
                              us: "",
                              cn: "",
                              language,
                            })}
                            <br />
                            <br />
                          </Text>
                        </Flex>
                        <Stack
                          spacing={1}
                          direction="column"
                          alignItems="flex-start"
                        >
                          <Flex justifyContent="flex-end" width="100%">
                            <Box fontSize="xs" textAlign="right">
                              <LatestUpdateDate
                                folderPath="/download/library/MSCOMM32/"
                                removeStrings={[]}
                              />
                            </Box>
                          </Flex>
                        </Stack>
                      </Flex>
                    </Box>
                  </CardBody>
                </Card>
              </>
            )}
            {!filterId && (
              <HStack spacing={2} justifyContent="center" mt={0} height="100%">
                <Image
                  src="/images/illust/hippo/hippo_001.png"
                  alt="hippo_001.png"
                  height={200}
                  style={{ marginTop: "40px" }}
                />
              </HStack>
            )}
          </SimpleGrid>
        </Box>
        <Box mb={10} />
      </Content>
    </>
  );
}
