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
            </Box>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
            spacing={5}
            mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
          >
            <CustomLinkBox
              dateTime="2025-01-30T04:42:00+0900"
              description1={getMessage({
                ja: "access2003で閉じる時に最適化チェックオフになる?",
                us: "Optimization check off when closing in access2003?",
                cn: "在 access2003 中关闭时勾选优化？",
                language,
              })}
              description2={getMessage({
                ja: "オープン時にチェックオンを追加",
                us: "Add check on when open",
                cn: "开放时增加签到",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_145.zip"
              inCharge="徳島,小松さん,???,Win10zip"
              isLatest={true}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-30T02:37:00+0900"
              description1={getMessage({
                ja: "動作が不安定",
                us: "Unstable operation",
                cn: "运行不稳定",
                language,
              })}
              description2={getMessage({
                ja: "importRecord_Clickを1度のみ実行に修正。SSC更新を書き直し。閉じる時に最適化のチェックオン",
                us: "Fixed importRecord_Click to be executed only once",
                cn: "修复 importRecord_Click 只运行一次的问题。",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_143.zip"
              inCharge="徳島,小松さん,???,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-29T18:55:00+0900"
              description1={getMessage({
                ja: "動作が不安定",
                us: "Unstable operation",
                cn: "运行不稳定",
                language,
              })}
              description2={getMessage({
                ja: "タイマーの削除。解放を追加",
                us: "Removed timer. Added release.",
                cn: "删除计时器。增加了释放功能。",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_142.zip"
              inCharge="徳島,小松さん,???,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-29T14:52:00+0900"
              description1={getMessage({
                ja: "途中からデータが送信できない時がある",
                us: "Sometimes data cannot be sent during the process.",
                cn: "有时，数据无法在过程中传输。",
                language,
              })}
              description2={getMessage({
                ja: "label.captionで条件分岐を変数に変更",
                us: "Change conditional branch to variable in label.caption",
                cn: "将条件分支改为标签标题中的变量",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_139.zip"
              inCharge="徳島,小松さん,???,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-23T13:59:00+0900"
              description1={getMessage({
                ja: "",
                us: "",
                cn: "",
                language,
              })}
              description2={getMessage({
                ja: "データインポート後に1秒の待機を追加",
                us: "Add 1 second wait after data import",
                cn: "数据导入后增加 1 秒等待时间",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_138.zip"
              inCharge="徳島,小松さん,???,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-22T14:50:00+0900"
              description1={getMessage({
                ja: "win7/access2003で送信印刷の途中でエラー無しで停止",
                us: "Stopped without error in the middle of outgoing printing in win7/access2003",
                cn: "在 win7/access2003 中，在外发打印过程中无错误地停止打印",
                language,
              })}
              description2={getMessage({
                ja: "sleepとdoeventsを追記。データ仕掛中が無い場合にメッセージを追加。ロック中の非表示を削除",
                us: "Add sleep and doevents",
                cn: "添加了 SLEEP 和 doevents。",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_137.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-22T00:59:00+0900"
              description1={getMessage({
                ja: "ACCESS2003でエラー",
                us: "Error in ACCESS2003",
                cn: "ACCESS 2003 中的错误。",
                language,
              })}
              description2=""
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_136.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-21T19:24:00+0900"
              description1={getMessage({
                ja: "QRリーダーで読み込み時にENTERイベントが発生する",
                us: "ENTER event occurs when reading with QR reader",
                cn: "使用 QR 阅读器阅读时会发生 ENTER 事件。",
                language,
              })}
              description2=""
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_135.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-21T14:14:00+0900"
              description1={getMessage({
                ja: "自動機に送信しないをオンでラベル印刷する",
                us: 'No label printing with "Do not send to automatic machines" turned on.',
                cn: "打开 不发送到自动机器，不打印标签",
                language,
              })}
              description2={getMessage({
                ja: "ラベル印刷もしないように修正",
                us: "Fixed to not print labels as well.",
                cn: "修改后也不打印标签",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_134.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-20T16:44:00+0900"
              description1={getMessage({
                ja: "自動機に送信しない不具合",
                us: "Failure to transmit to automatic machine",
                cn: "无法传输到自动机器",
                language,
              })}
              description2={getMessage({
                ja: "自動機バーコードを送信するように修正",
                us: "Modified to send automatic machine barcodes",
                cn: "经改装后可传输自动机器条形码",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_133.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-20T10:54:00+0900"
              description1={getMessage({
                ja: "押せないボタンがある",
                us: "There's a button I can't press.",
                cn: "某些按钮无法按下",
                language,
              })}
              description2={getMessage({
                ja: "押せるように修正。ネーム印刷の下地",
                us: "Modified so that it can be stamped.。 Base for name printing",
                cn: "经过改装，可进行烫印。用于印制名称的底座。",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_132.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2025-01-19T22:54:00+0900"
              description1={getMessage({
                ja: "自動機に送信できない。自動機タイプが常にASだから待機時間が常に長い(10秒)",
                us: "Cannot transmit to automatic machine. Waiting time is always long (10 seconds) because automatic machine type is always AS.",
                cn: "无法传输到自动设备。等待时间总是很长（10 秒），因为自动机器类型总是 AS。",
                language,
              })}
              description2={getMessage({
                ja: "自動機へのシリアル送信に関わる箇所の書き直し。自動機タイプSAを追加(3秒)",
                us: "Rewriting of the part related to the serial transmission to the automatic machine. Add automatic machine type SA (3 seconds)",
                cn: "重写与自动机串行传输有关的章节。增加自动机械类型 SA（3 秒）。",
                language,
              })}
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_130.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2024-11-29T20:26:00+0900"
              description1="すべてOKになる。リンクテーブルが切れて起動時にエラー。次に読むべきレコードが画面外になる"
              description2="判別を修正。リンクテーブルの再作成を修正。absolutePosition=>.bookmark-5"
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_128.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2024-11-01T16:33:00+0900"
              description1="起動時にsqlエラー"
              description2="sqlを使わないように変更。テーブルリンクが無い場合は作成"
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_127.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
              userName={userName ?? ""}
            />
            <CustomLinkBox
              dateTime="2024-10-11T23:44:00+0900"
              description1="サーバー接続が出来ない場合にテーブル読み込みエラー"
              description2="サーバーIP接続とファイル接続を分ける"
              descriptionIN=""
              linkHref="/files/download/html/Jdss/main_126.zip"
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
              linkHref="/files/download/html/Jdss/main_123.zip"
              inCharge="徳島,小松さん,藤原さん,Win10zip"
              isLatest={false}
            />
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
