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
import { SjpIcon } from "@/components/ui/icons";
import styles from "@/styles/home.module.scss";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import CustomLinkBox from "../../parts/customLinkBox";
import CustomPopver from "@/components/ui/popver";
import Sidebar from "@/components/sidebar";

import { useUserContext } from "@/contexts/useUserContext";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import LatestUpdateDate from "../../parts/LatestUpdateDate";
import { ChangelogAccordion } from "../../parts/ChangelogAccordion";

import DownloadButton from "@/components/ui/DownloadButton2";
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
              <SjpIcon
                size={48}
                title="Sjp+"
                color={colorMode === "light" ? "#000" : "#FFF"} // カラーモードに応じて色を設定
              />
              <Text fontSize="2xl" mb={2} fontWeight={600}>
                {getMessage({
                  ja: "誘導ポイント設定一覧表+",
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
                ja: "最新版には以前の更新が全て含まれています",
                us: "The latest version includes all previous updates",
                cn: "最新版本包括之前的所有更新",
                language,
              })}
              <br />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="auto"
                fontSize="sm"
                mt={2}
              >
                <Link
                  href="/skillBlogs/pages/0010"
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
                        <Box>本体</Box>
                        <Box fontSize="xs" textAlign="right">
                          <LatestUpdateDate
                            folderPath="./download/yps/yps/"
                            removeStrings={[]}
                          />
                        </Box>
                      </Flex>
                    </Heading>
                    <Badge bg="custom.excel" color="white" marginRight={2}>
                      Excel 2010
                    </Badge>
                    <Badge bg="custom.excel" color="white" marginRight={2}>
                      Excel 2013
                    </Badge>
                    <Divider borderColor="gray.500" my={2} />
                  </Box>
                  <List spacing={1} styleType="disc" pl={3}>
                    <ListItem>
                      誘導ポイント設定一覧表からYIC書き込み機にデータ転送する事で入力ミスと動作確認の手間を省けます。
                    </ListItem>
                    <ListItem>アップロード/バージョンアップに対応</ListItem>
                    <ListItem>複数のYICを使った生産に対応(4台まで)</ListItem>
                    <ListItem>従来の設定一覧表を作成可能</ListItem>
                  </List>
                  <ChangelogAccordion
                    changelog={[
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
                </Stack>
              </CardBody>
              <Divider />
              <DownloadButton
                currentUserName={currentUserName}
                url="/download/yps/yps/"
                bg="custom.excel"
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
                        <Box>バージョンアップ</Box>
                        <Box fontSize="xs" textAlign="right">
                          <LatestUpdateDate
                            folderPath="./download/yps/verup/"
                            removeStrings={[]}
                          />
                        </Box>
                      </Flex>
                    </Heading>
                    <Badge bg="custom.excel" color="white" marginRight={2}>
                      Excel 2010
                    </Badge>
                    <Badge bg="custom.excel" color="white" marginRight={2}>
                      Excel 2013
                    </Badge>
                    <Divider borderColor="gray.500" my={2} />
                  </Box>
                  <List spacing={1} styleType="disc" pl={3}>
                    <ListItem>
                      本体に更新があった場合に他の本体をバージョンアップが可能
                    </ListItem>
                    <ListItem>設置場所はサーバーのルートパス</ListItem>
                  </List>
                  <ChangelogAccordion
                    changelog={[
                      {
                        version: "1.00",
                        date: "2025/06/02",
                        change: ["リリース"],
                      },
                    ]}
                  />
                </Stack>
              </CardBody>
              <Divider />
              <DownloadButton
                currentUserName={currentUserName}
                url="/download/yps/verup/"
                bg="custom.excel"
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
                        <Box>バーコードフォント</Box>
                        <Box fontSize="xs" textAlign="right">
                          <LatestUpdateDate
                            folderPath="./download/library/code39/"
                            removeStrings={[]}
                          />
                        </Box>
                      </Flex>
                    </Heading>
                    <Badge bg="custom.windows" color="white" marginRight={2}>
                      Windows
                    </Badge>
                    <Badge bg="custom.mac" color="white" marginRight={2}>
                      Mac
                    </Badge>
                    <Badge bg="custom.linux" color="white" marginRight={2}>
                      Linux
                    </Badge>
                    <Divider borderColor="gray.500" my={2} />
                  </Box>
                  <List spacing={1} styleType="disc" pl={3}>
                    <ListItem>
                      YICから呼び出すバーコードを設定一覧表に表示するために使用
                    </ListItem>
                  </List>
                </Stack>
              </CardBody>
              <Divider />
              <DownloadButton
                currentUserName={currentUserName}
                url="/download/library/code39"
                bg="custom.windows"
                color={
                  colorMode === "light" ? "custom.theme.light.900" : "white"
                }
              />
            </Card>
            <Box h="20px" w="1px" bg="gray.500" ml="50%" />
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
                        <Box>MSCOMM32.OCX</Box>
                        <Box fontSize="xs" textAlign="right">
                          <LatestUpdateDate
                            folderPath="./download/library/MSCOMM32"
                            removeStrings={[]}
                          />
                        </Box>
                      </Flex>
                    </Heading>
                    <Badge bg="custom.windows" color="white" marginRight={2}>
                      Windows+VB6
                    </Badge>
                    <Divider borderColor="gray.500" my={2} />
                  </Box>
                  <List spacing={1} styleType="disc" pl={3}>
                    <ListItem>
                      YICへの書き込みに利用しているライブラリがWindowsOSに無い場合に使用。例えばWindows7には無い為、設置が必要
                    </ListItem>
                  </List>
                </Stack>
              </CardBody>
              <Divider m="0" p="0" />
              <DownloadButton
                currentUserName={currentUserName}
                url="/download/library/MSCOMM32"
                bg="custom.windows"
                color={
                  colorMode === "light" ? "custom.theme.light.900" : "white"
                }
              />
            </Card>
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
