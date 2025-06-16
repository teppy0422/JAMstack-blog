"use client";

import React from "react";
import Content from "@/components/content";
import {
  Image,
  Text,
  Box,
  SimpleGrid,
  Badge,
  Kbd,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  HStack,
  useColorMode,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Divider,
  ButtonGroup,
  useToast,
  Toast,
  Flex,
  List,
  ListItem,
  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Icon,
} from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート
import { SiSemanticuireact } from "react-icons/si";
import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import NextImage from "next/image";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import { JdssIcon } from "@/components/ui/icons";
import styles from "@/styles/home.module.scss";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import UnzipModal from "@/components/howto/os/UnzipModal";

import CustomLinkBox from "../../parts/customLinkBox";
import CustomPopver from "@/components/ui/popver";
import Sidebar from "@/components/sidebar";

import { useUserContext } from "@/contexts/useUserContext";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import LatestUpdateDate from "../../parts/LatestUpdateDate";
import { ChangelogAccordion } from "../../parts/ChangelogAccordion";

import DownloadButton2 from "@/components/ui/DownloadButton2";
function formatDateTime(input: string): string {
  const date = new Date(input);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}

export default function Page() {
  const { colorMode } = useColorMode();
  const { currentUserId, currentUserName } = useUserContext();
  const { language, setLanguage } = useLanguage();
  const toast = useToast();

  return (
    <>
      <Sidebar isDrawer={false} />
      <Content>
        <div
          className={styles.me}
          style={{ paddingTop: "10px", fontFamily: "Noto Sans JP" }}
        >
          <Box textAlign="center" mb={3}>
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <JdssIcon
                size={48}
                title="JDSS+"
                color={colorMode === "light" ? "#800080" : "#FFF"} // カラーモードに応じて色を設定
              />
              <Text fontSize="2xl" mb={2} fontWeight={600}>
                {getMessage({
                  ja: "順立生産システム+",
                  language,
                })}
              </Text>
            </HStack>
            <Box fontSize="lg" fontWeight={400}>
              {getMessage({
                ja: "以下からダウンロードしてください",
                us: "Please download below",
                cn: "请在下方下载。",
                language,
              })}
              <br />
              {getMessage({
                ja: "ダウンロードした.zipは展開(解凍)してください",
                us: "Please extract (unzip) the .zip file you downloaded.",
                cn: "请解压缩下载的 .zip",
                language,
              })}
              <br />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="auto"
                mt={2}
              >
                <Box fontSize="sm" mr={1}>
                  {getMessage({
                    ja: "ダウンロードしたmain_*.zipを展開(解凍)してからmain_*.mdbが在るフォルダに入れてください",
                    us: "Extract (unzip) the downloaded main_*.zip file and place it in the folder containing the main_*.mdb file.",
                    cn: "解压缩下载的 main_*.zip, 并将其放入 main_*.mdb 所在文件夹。",
                    language,
                  })}
                </Box>
                {/* <TransitionExample /> */}
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="auto"
                fontSize="sm"
                mt={2}
              >
                <Link
                  href="/skillBlogs/pages/0006"
                  isExternal
                  fontWeight="bold"
                >
                  <Icon as={ExternalLinkIcon} mr={1} />
                  {getMessage({
                    ja: "使い方のページ",
                    us: "Upload Procedure",
                    cn: "上传程序",
                    language,
                  })}
                </Link>
              </Box>
            </Box>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
            spacing={0}
            mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
          >
            <Card
              maxW="2xl"
              w="100%"
              mt="10px"
              mx="auto"
              bg="transparent"
              border="1px solid"
              borderColor="gray.500"
              overflow="hidden"
            >
              <CardBody p="2">
                <Stack mt="0" spacing="1">
                  <Box>
                    <Heading size="md">
                      <Flex justify="space-between" align="center">
                        <Box>main</Box>
                        <Box fontSize="xs" textAlign="right">
                          <LatestUpdateDate
                            folderPath="./download/jdss/main/"
                            removeStrings={[]}
                          />
                        </Box>
                      </Flex>
                    </Heading>
                    <Badge bg="custom.access" color="white" marginRight={2}>
                      access2003
                    </Badge>
                    <Badge bg="custom.access" color="white" marginRight={2}>
                      2010
                    </Badge>
                    <Divider borderColor="gray.500" my={2} />
                  </Box>
                  <Box>バージョンアップ手順</Box>
                  <List spacing={1} styleType="decimal" pl={5}>
                    <ListItem>
                      <Text fontWeight="bold">
                        {getMessage({
                          ja: "ダウンロードした.zipファイルを",
                          us: "Please ",
                          cn: "",
                          language,
                        })}
                        <UnzipModal />
                        {getMessage({
                          ja: "をしてください。",
                          us: "the .zip file you downloaded.",
                          cn: "下载的 .zip 文件。",
                          language,
                        })}
                      </Text>
                    </ListItem>
                    <ListItem>既存のmain_**がある位置に保存</ListItem>
                    <ListItem>ショートカットの作成</ListItem>
                    <ListItem>
                      スタートアップにあるショートカットを削除する
                    </ListItem>
                    <ListItem>
                      スタートアップに3で作成したショートカットを移動
                    </ListItem>
                    <ListItem>PCの再起動</ListItem>
                  </List>
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
                </Stack>
              </CardBody>
              <Divider />
              <DownloadButton2
                currentUserName={currentUserName}
                url="/download/jdss/main/"
                bg={"custom.access"}
                color={
                  colorMode === "light" ? "custom.theme.light.900" : "white"
                }
              />
            </Card>
            <Box h="20px" w="1px" bg="gray.500" ml="50%" />
            <Card
              maxW="xl"
              w="100%"
              mx="auto"
              bg="transparent"
              border="1px solid"
              borderColor="gray.500"
              overflow="hidden"
            >
              <CardBody p="2">
                <Stack mt="0" spacing="1">
                  <Box>
                    <Heading size="md">
                      <Flex justify="space-between" align="center">
                        <Box>main3用ラダー図</Box>
                        <Box fontSize="xs" textAlign="right">
                          <LatestUpdateDate
                            folderPath="./download/jdss/main3/"
                            removeStrings={[]}
                          />
                        </Box>
                      </Flex>
                    </Heading>
                    <Badge bg="custom.omron" color="white" marginRight={2}>
                      OMRON CP**
                    </Badge>
                    <Divider borderColor="gray.500" my={2} />
                  </Box>
                  <List spacing={1} styleType="disc" pl={3}>
                    <ListItem>
                      順立生産システムからオムロン社のPLCを制御するサンプルのラダー図。
                    </ListItem>
                    <ListItem>
                      これはmain3からPLCへデータを送信して部品セットを行う。
                    </ListItem>
                    <ListItem>
                      main3からシリアル送信するデータは2進数でPLC受信で対応した内部リレーをON/OFFする
                    </ListItem>
                    <ListItem>
                      このラダー図そのままでは使用できるケースは少ないですがラダー図をカスタムして使用
                    </ListItem>
                    <ListItem>
                      書き込みにはオムロン社のCX-Programmerが必要
                    </ListItem>
                  </List>
                  <ChangelogAccordion
                    changelog={[
                      {
                        version: "17",
                        date: "2024/03/13",
                        change: ["最終更新"],
                      },
                    ]}
                  />
                </Stack>
              </CardBody>
              <Divider />
              <DownloadButton2
                currentUserName={currentUserName}
                url="/download/jdss/main3/"
                bg="custom.omron"
                color={
                  colorMode === "light" ? "custom.theme.light.900" : "white"
                }
              />
            </Card>
            <Box h="20px" w="1px" bg="gray.500" ml="50%" />{" "}
            <Card
              maxW="lg"
              w="100%"
              mx="auto"
              bg="transparent"
              border="1px solid"
              borderColor="gray.500"
              overflow="hidden"
            >
              <CardBody p="2">
                <Stack mt="0" spacing="1">
                  <Box>
                    <Heading size="md">
                      <Flex justify="space-between" align="center">
                        <Box>桜咲くQR</Box>
                        <Box fontSize="xs" textAlign="right">
                          <LatestUpdateDate
                            folderPath="./download/"
                            removeStrings={[]}
                          />
                        </Box>
                      </Flex>
                    </Heading>
                    <Divider borderColor="gray.500" my={2} />
                  </Box>
                  <List spacing={1} styleType="disc" pl={3}>
                    <ListItem>
                      QRコード描画用アプリ。他社製品のため載せる事が出来ません
                    </ListItem>
                  </List>
                </Stack>
              </CardBody>
            </Card>
            <Box h="20px" w="1px" bg="gray.500" ml="50%" />{" "}
            <Card
              maxW="lg"
              w="100%"
              mx="auto"
              bg="transparent"
              border="1px solid"
              borderColor="gray.500"
              overflow="hidden"
            >
              <CardBody p="2">
                <Stack mt="0" spacing="1">
                  <Box>
                    <Heading size="md">
                      <Flex justify="space-between" align="center">
                        <Box>RS-reciiver light</Box>
                        <Box fontSize="xs" textAlign="right">
                          <LatestUpdateDate
                            folderPath="./download/"
                            removeStrings={[]}
                          />
                        </Box>
                      </Flex>
                    </Heading>
                    <Divider borderColor="gray.500" my={2} />
                  </Box>
                  <List spacing={1} styleType="disc" pl={3}>
                    <ListItem>
                      バーコードリーダーがシリアルタイプの場合に変換するために使用。他社製品のため載せる事が出来ません
                    </ListItem>
                  </List>
                </Stack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
