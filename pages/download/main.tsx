import React from "react";
import Content from "../../components/content";
import Link from "next/link";
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
  useColorMode,
  HStack,
} from "@chakra-ui/react";

import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート

import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import { JdssIcon } from "../../components/icons";
import NextImage from "next/image";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート

import styles from "../../styles/home.module.scss";

import CustomLinkBox from "../../components/customLinkBox";
import CustomPopver from "../../components/popver";
import Sidebar from "../../components/sidebar"; // Sidebar コンポーネントをインポート
import { useUserData } from "../../hooks/useUserData";
import { useUserInfo } from "../../hooks/useUserId";

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

function TransitionExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<FocusableElement>(null); // 型を明示的に指定
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <Box onClick={onOpen} cursor="pointer">
        <MdHelpOutline />
      </Box>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            {getMessage({
              ja: "アップロードの手順",
              us: "Upload Procedure",
              cn: "上传程序",
              language,
            })}
          </AlertDialogHeader>
          <AlertDialogCloseButton _focus={{ _focus: "none" }} />
          <AlertDialogBody p={4}>
            <Box as="p" textAlign="center" mb={4}>
              {"1." +
                getMessage({
                  ja: "ダウンロードしたエクセルブックを開く",
                  us: "Open the downloaded Excel book.",
                  cn: "打开下载的 Excel 电子书。",
                  language,
                })}
              <br />
              {"2." +
                getMessage({
                  ja: "Menuを開いてVerupを押す",
                  us: "Open Menu and press Verup.",
                  cn: "打开菜单并按下 Verup",
                  language,
                })}
              <br />
              {"3." +
                getMessage({
                  ja: "",
                  us: "Click [このVerのアップロード] while holding down ",
                  cn: "按住 ",
                  language,
                })}
              <span>
                <Kbd>Shift</Kbd>
              </span>
              {getMessage({
                ja: "を押しながら[このVerのアップロード]をクリック",
                us: ".",
                cn: " 单击 [このVerのアップロード]",
                language,
              })}
            </Box>
            <Box textAlign="center" mb={4}>
              <video
                src="/images/sjpUpload.mp4"
                autoPlay
                muted
                loop
                width="100%"
              />
            </Box>
            <Box as="p" textAlign="center" mb={1}>
              {getMessage({
                ja: "以上で全ての生産準備+からこのバージョンへの更新が可能になります",
                us: "This is all you need to do to update from Production Ready+ to this version!",
                cn: "这将使所有生产准备+ 更新到该版本",
                language,
              })}
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="red" ml={3} onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export default function About() {
  const { colorMode } = useColorMode();
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <div
          className={styles.me}
          style={{ paddingTop: "10px", fontFamily: "Noto Sans JP" }}
        >
          <Box textAlign="center" mb={8}>
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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="auto"
                mt={2}
              >
                {/* <Box fontSize="sm" mr={1}>
                  アップロードの手順
                </Box>
                <TransitionExample /> */}
              </Box>
            </Box>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
            spacing={5}
            mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
          >
            <CustomLinkBox
              dateTime="2024-11-29T20:26:00+0900"
              description1="すべてOKになる。リンクテーブルが切れて起動時にエラー。次に読むべきレコードが画面外になる"
              description2="判別を修正。リンクテーブルの再作成を修正。absolutePosition=>.bookmark-5"
              descriptionIN=""
              linkHref="/files/download/Jdss/main_128.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={true}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2024-11-01T16:33:00+0900"
              description1="起動時にsqlエラー"
              description2="sqlを使わないように変更。テーブルリンクが無い場合は作成"
              descriptionIN=""
              linkHref="/files/download/Jdss/main_127.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2024-10-11T23:44:00+0900"
              description1="サーバー接続が出来ない場合にテーブル読み込みエラー"
              description2="サーバーIP接続とファイル接続を分ける"
              descriptionIN=""
              linkHref="/files/download/Jdss/main_126.zip"
              inCharge="徳島,小松さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-10-11T02:49:00+0900"
              description1="main2_ラベル発行データ履歴がない場合にリンクテーブルの作成エラーが発生"
              description2="ファイル接続が可能な場合のみ作成する"
              descriptionIN=""
              linkHref="/files/download/Jdss/main_125.zip"
              inCharge="徳島,小松さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-10-07T07:17:00+0900"
              description1="main2_次回QRラベルが飛ぶ時がある"
              description2="SQLクエリ->専用関数の作成に書き直し"
              descriptionIN="自動機を使用しない場合にラベル印刷だけできるように修正"
              linkHref="/files/download/Jdss/main_123.zip"
              inCharge="徳島,小松さん,藤原さん,Win10zip"
              isLatest={false}
            />
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
