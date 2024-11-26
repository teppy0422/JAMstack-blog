import React, { useState } from "react";
import { useRouter } from "next/router";
import Content from "../../components/content";
import fs from "fs";
import path from "path";
import { GetServerSideProps } from "next";

import {
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
} from "@chakra-ui/react";
import { IoTicketOutline } from "react-icons/io5";

import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート
import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import NextImage from "next/image";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import DownloadButton from "../../components/DownloadButton";
import styles from "../../styles/home.module.scss";
import { useUserInfo } from "../../hooks/useUserId";
import { useUserData } from "../../hooks/useUserData";

import CustomLinkBox from "../../components/customLinkBox";
import CustomPopver from "../../components/popver";
import Sidebar from "../../components/sidebar";
import { Global } from "@emotion/react";

import "@fontsource/noto-sans-jp";

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
  const directoryPath = path.join(process.cwd(), "/public/files/download/Sjp/");
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
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalPath, setModalPath] = useState("");
  const handleBoxClick = (path) => {
    setModalPath(path);
    onOpen();
  };
  const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const CustomBadge: React.FC<{ path: string; text: string }> = ({
    path,
    text,
  }) => (
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
      {text}
    </Badge>
  );
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
              fontFamily: "Noto Sans JP",
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
      <Sidebar />
      <Content isCustomHeader={true}>
        <Box
          className={styles.me}
          sx={{
            paddingTop: "30px",
            fontFamily: "Noto Sans JP",
            fontWeight: "200",
          }}
        >
          <Box textAlign="center" mb={8}>
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <Box transform="rotate(270deg)" position="relative" top="-3px">
                <IoTicketOutline size={28} />
              </Box>
              <Text
                fontSize="lg"
                mb={2}
                fontFamily="'Archivo Black', 'M PLUS Rounded 1c'"
              >
                DOWNLOAD
              </Text>
            </HStack>
            <Box fontSize="md">
              ダウンロードと説明は適宜追加します
              <br />
              右側にある
              <Badge backgroundColor="#444" color="white" mt={-0.5} mr={0.5}>
                バッジ
              </Badge>
              をクリックすると説明ページが表示されます
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
            spacing={5}
            mx={{ base: 2, md: 20, lg: 30, xl: 30 }}
          >
            <Card
              backgroundColor="transparent"
              border="1px solid"
              borderColor="gray.500"
            >
              <CardHeader p={2} pl={3} pb={0}>
                <Heading size="md" mb={3}>
                  生産準備+
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
                    path="/download/sjp"
                    isHovered={isHovered}
                    backGroundColor="green"
                    userName={userName}
                  />

                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        Sjp+本体
                      </Heading>
                      <Flex justifyContent="flex-end" alignItems="center">
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
                        最初はこれから始めるのがおすすめです
                        <br />
                        ハメ図を作成したりサブ形態を入力する本体
                        <br />
                        PVSW.csvとRLTF.txtが必須
                        <br />
                        <Badge
                          backgroundColor="#444"
                          color="white"
                          mt={-0.5}
                          mr={0.5}
                        >
                          41.先ハメ誘導
                        </Badge>
                        は生産準備+が自動立案したサブ形態のみ対応
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right" right={0}>
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
                      <CustomBadge path="" text="10.竿レイアウト" />
                      <CustomBadge
                        path="/files/download/Sjp/40/index.html"
                        text="40.サブ図"
                      />
                      <CustomBadge path="/41" text="41.先ハメ誘導" />
                      <CustomBadge path="/56v3.1" text="56.配策経路" />
                      <CustomBadge
                        path="/files/download/Sjp/70/index.html"
                        text="70.検査履歴点滅"
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
                    userName={userName}
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
                        コネクタを撮影するアプリケーション
                        <br />
                        SONYのカメラのみ対応
                        <br />
                        生産準備+で写真撮影を実行時に自動インストールされるので使用には必要ありません
                        <br />
                        アプリケーションを修正したい場合のみダウンロードしてください
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" margin="auto" textAlign="right">
                          #2019/09/02
                          <br />
                          1.0.0.4
                        </Text>
                      </Flex>
                      <CustomBadge path="" text="撮影方法" />
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
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        誘導ナビ.net
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
                        <Badge
                          variant="solid"
                          backgroundColor="#007582"
                          color="white"
                          opacity={0.8}
                          mr={2}
                        >
                          Arduino
                        </Badge>
                      </Flex>
                      <Text pt="2" fontSize="sm">
                        配策誘導のディスプレイを移動させる
                        <br />
                        ブラウザではCOMポートへのアクセスがページ毎に許可される必要がある為に作成しました
                        <br />
                        .NetFrameWork4.8はインストーラーに含まれます
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
                      <CustomBadge path="/56.net" text="ディスプレイ移動" />
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
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        検査履歴システム
                      </Heading>

                      <Flex justifyContent="flex-end" alignItems="center">
                        <Badge
                          variant="solid"
                          backgroundColor="#6C277D"
                          mr={2}
                          opacity={0.8}
                        >
                          VB.net
                        </Badge>
                      </Flex>
                      <Text pt="2" fontSize="sm">
                        YC-CのWHモードでエラーのポイントを表示する画像を生産準備+が作成
                        <br />
                        開発は山口部品でダウンロードはここで出来るようにはしません
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right" right={0}></Text>
                      </Flex>
                      <CustomBadge path="" text="ポイント点滅設置" />
                    </Stack>
                  </Flex>
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
                  部材一覧+
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
                    全製品品番の使用部品リストの一覧表を作成
                    <br />
                    EXTESを自動制御して手入力の手間とミスを無くせます
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
                  順立生産システム
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
                    userName={userName}
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
                          ACCESS2002
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
                        一貫工程などの連続して生産する工程で有効
                        <br />
                        カンバン等のデータを読み込んでその順番で各作業場所で生産指示を行う
                        <br />
                        生産指示の対象は[作業者] [自動機(SA,AS)] [CB10,70]
                        [YSS]に対応
                        <br />
                        ※宮崎部品が委託開発した3つのシステムを統合したもの
                      </Text>
                    </Flex>
                    <Stack
                      spacing={1}
                      direction="column"
                      alignItems="flex-start"
                    >
                      <Flex justifyContent="flex-end" width="100%">
                        <Text fontSize="xs" textAlign="right">
                          #2024/11/01
                          <br />
                          127
                        </Text>
                      </Flex>
                      <CustomBadge path="" text="main1.計画指示" />
                      <CustomBadge path="/main2" text="main2.SSC" />
                      <CustomBadge path="" text="main3.CB" />
                      <CustomBadge path="/main3.plc" text="main3.PLC" />
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
                    userName={userName}
                  />
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Flex direction="column" alignItems="flex-start" flex={1}>
                      <Heading size="sm" mb={1.5}>
                        main3用PLC
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
                        main3からPLCへデータを送信して部品セットを行う
                        <br />
                        main3からシリアル送信するデータは2進数でPLC受信で対応した内部リレーをON/OFFする
                        <br />
                        このラダー図そのままでは使用できるケースは少ないですが部品セットの参考になる筈です
                        <br />
                        CX-Programmerが必要です
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
                    初回セットアップ
                  </Heading>
                  <Badge variant="solid" colorScheme="purple" mr={2}></Badge>
                  <Text pt="2" fontSize="sm">
                    初回のPCセットアップに必要なファイル
                    <br />
                    セットアップ終了後はMAINのみ更新を行う
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent maxW="90vw" maxH="90%">
              <ModalCloseButton right="3px" />
              {/* <ModalHeader></ModalHeader> */}
              <ModalBody mx={0}>
                <Box
                  width="99%"
                  height={{ base: "80vh", sm: "70vh", md: "70vh", lg: "80vh" }}
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
