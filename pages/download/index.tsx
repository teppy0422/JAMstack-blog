import React from "react";
import { useRouter } from "next/router";
import Content from "../../components/content";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { GetServerSideProps } from "next";

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
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Heading,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート
import { DownloadIcon } from "../../components/icons";
import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import NextImage from "next/image";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート

import styles from "../../styles/home.module.scss";

import CustomLinkBox from "../../components/customLinkBox";
import CustomPopver from "../../components/popver";
import Sidebar from "../../components/sidebar"; // Sidebar コンポーネントをインポート

// ファイル名から最大の数字を取得する関数
function getMaxVersionNumber(directory: string): {
  maxVersionString: string;
  lastModified: Date;
} {
  try {
    const files = fs.readdirSync(directory);
    console.log("Files in directory:", files); // デバッグ用ログ
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
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <div
          className={styles.me}
          style={{ paddingTop: "50px", fontFamily: "Noto Sans JP" }}
        >
          <Box textAlign="center" mb={8}>
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <DownloadIcon
                size={42}
                title="Sjp+"
                color={colorMode === "light" ? "#000" : "#FFF"} // カラーモードに応じて色を設定
              />
              <Text fontSize="lg" mb={2}>
                ダウンロード
              </Text>
            </HStack>
            <Box fontSize="lg">
              以下から選択してください
              <br />
              更新都度の追加をします
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
            mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
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
                <Divider borderColor="gray.500" />
              </CardHeader>
              <CardBody p={0}>
                <Box
                  px={4}
                  py={2}
                  cursor="pointer"
                  onClick={() => router.push("/download/sjp")}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  position="relative"
                  borderColor="gray.200"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "4px",
                    backgroundColor: colorMode === "light" ? "#888" : "#FFF",
                  }}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="sm" textTransform="uppercase">
                      Sjp+本体
                    </Heading>
                    <Flex justifyContent="flex-end" alignItems="center">
                      <Text fontSize="xs" margin="auto" textAlign="right">
                        最終更新:
                        {new Date(lastModified).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                        <br />
                        {maxVersionString}
                      </Text>
                    </Flex>
                  </Flex>
                  <Badge variant="solid" colorScheme="green" mr={2}>
                    EXCEL2010
                  </Badge>
                  <Badge variant="solid" colorScheme="green" mr={2}>
                    EXCEL2013
                  </Badge>
                  <Badge variant="outline" colorScheme="gray" mr={2}>
                    MICROSOFT365
                  </Badge>
                  <Text pt="2" fontSize="sm">
                    最初はこれから始めるのがおすすめです
                    <br />
                    ハメ図を作成したりサブ形態を入力する本体
                    <br />
                    PVSW.csvとRLTF.txtが必須
                  </Text>
                </Box>
                <Divider borderColor="gray.500" />
                <Box
                  px={4}
                  py={2}
                  cursor="pointer"
                  onClick={() => router.push("/download/camera")}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  position="relative"
                  borderColor="gray.200"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "4px",
                    backgroundColor: colorMode === "light" ? "#888" : "#FFF",
                  }}
                >
                  <Heading size="xs" textTransform="uppercase">
                    CAMERA+
                  </Heading>
                  <Badge variant="solid" colorScheme="purple" mr={2}>
                    VB.net
                  </Badge>
                  <Text pt="2" fontSize="sm">
                    コネクタを撮影するアプリケーション
                    <br />
                    SONYのカメラのみ対応
                    <br />
                    生産準備+で写真撮影を実行時に自動インストールされるので使用には必要ありません
                    <br />
                    アプリケーションを修正したい場合のみダウンロードしてください
                  </Text>
                </Box>
                <Divider borderColor="gray.500" />
                <Box px={4} py={2}>
                  <Heading size="xs" textTransform="uppercase">
                    誘導ナビ.net
                  </Heading>
                  <Badge variant="solid" colorScheme="purple" mr={2}>
                    VB.net
                  </Badge>
                  <Text pt="2" fontSize="sm">
                    配策誘導のディスプレイを移動させる
                    <br />
                    .NetFrameWork4.8はインストーラーに含まれます
                  </Text>
                </Box>
                <Divider borderColor="gray.500" />
                <Box px={4} py={2}>
                  <Heading size="xs" textTransform="uppercase">
                    検査履歴システム
                  </Heading>
                  <Badge variant="solid" colorScheme="purple" mr={2}>
                    VB.net
                  </Badge>
                  <Text pt="2" fontSize="sm">
                    YC-CのWHモードでエラーのポイントを表示する画像を生産準備+が作成
                    <br />
                    開発は山口部品
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
                <Divider borderColor="gray.500" />
              </CardHeader>
              <CardBody p={0}>
                <Box
                  px={4}
                  py={2}
                  cursor="pointer"
                  onClick={() => router.push("/download/jdss")}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  position="relative"
                  borderColor="gray.200"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: "4px",
                    backgroundColor: colorMode === "light" ? "#888" : "#FFF",
                  }}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="sm" textTransform="uppercase">
                      main
                    </Heading>
                    <Flex justifyContent="flex-end" alignItems="center">
                      <Text fontSize="xs" margin="auto" textAlign="right">
                        最終更新:
                        {new Date(lastModified).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                        <br />
                        {maxVersionString}
                      </Text>
                    </Flex>
                  </Flex>
                  <Badge
                    variant="solid"
                    style={{ backgroundColor: "#808" }}
                    mr={2}
                  >
                    ACCESS2002
                  </Badge>
                  <Badge
                    variant="solid"
                    style={{ backgroundColor: "#808" }}
                    mr={2}
                  >
                    ACCESS2010
                  </Badge>
                  <Text pt="2" fontSize="sm">
                    一貫工程などの連続して生産する工程で有効
                    <br />
                    カンバン等のデータを読み込んでその順番で各作業場所で生産指示を行う
                    <br />
                    生産指示の対象は[作業者] [自動機(SA,AS)] [CB10,70]
                    [YSS]に対応
                  </Text>
                </Box>
                <Divider borderColor="gray.500" />
                <Box
                  px={4}
                  py={2}
                  cursor="pointer"
                  onClick={() => router.push("/download/camera")}
                  _hover={{
                    boxShadow: "dark-lg",
                  }}
                  position="relative"
                  borderColor="gray.200"
                >
                  <Heading size="xs" textTransform="uppercase">
                    初回セットアップ
                  </Heading>
                  <Badge variant="solid" colorScheme="purple" mr={2}>
                    VB.net
                  </Badge>
                  <Text pt="2" fontSize="sm">
                    初回のPCセットアップに必要なファイル
                    <br />
                    セットアップ終了後はMAINのみ更新を行う
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </SimpleGrid>
        </div>
        <Box mb={10} />
      </Content>
    </>
  );
}
