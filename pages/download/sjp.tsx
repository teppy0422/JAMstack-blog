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
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート
import { SiSemanticuireact } from "react-icons/si";
import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import NextImage from "next/image";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import { SjpIcon } from "../../components/icons";
import styles from "../../styles/home.module.scss";

import Hippo_001_wrap from "../../components/3d/hippo_001_wrap";

import CustomLinkBox from "../../components/customLinkBox";
import CustomPopver from "../../components/popver";
import Sidebar from "../../components/sidebar"; // Sidebar コンポーネ��トをインポート

function TransitionExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<FocusableElement>(null); // 型を明示的に指定
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
          <AlertDialogHeader>アップロードの手順</AlertDialogHeader>
          <AlertDialogCloseButton _focus={{ _focus: "none" }} />
          <AlertDialogBody p={4}>
            <Box as="p" textAlign="center" mb={4}>
              1.ダウンロードしたエクセルブックを開く
              <br />
              2.Menuを開いてVerupを押す
              <br />
              3.
              <span>
                <Kbd>Shift</Kbd>
              </span>
              を押しながら[このVerのアップロード]をクリック
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
              以上で全ての生産準備+からこのバージョンへの更新が可能になります
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
  const illusts = [{ src: "/images/illust/hippo/hippo_001.png" }];
  const { colorMode } = useColorMode();

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
              <SjpIcon
                size={48}
                title="Sjp+"
                color={colorMode === "light" ? "#000" : "#FFF"} // カラーモードに応じて色を設定
              />
              <Text fontSize="2xl" mb={2}>
                生産準備+
              </Text>
            </HStack>
            <Box fontSize="lg">
              以下からダウンロードしてください
              <br />
              通常は最新版
              <Badge colorScheme="teal" margin={1}>
                LATEST
              </Badge>
              を選択します
              <br />
              最新版には以前の更新が全て含まれています
              <br />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="auto"
                mt={2}
              >
                <Box fontSize="sm" mr={1}>
                  アップロードの手順
                </Box>
                <TransitionExample />
              </Box>
            </Box>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
            spacing={5}
            mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
          >
            <CustomLinkBox
              dateTime="2024-10-18T14:11:00+0900"
              description1="部品リストIEで略図ダウンロード時にエラー"
              description2="多分登録されてないからWEBページの構成が違う->IDで取得に変更"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.31_.zip"
              inCharge="高知,王さん,Win10zip"
              isLatest={true}
            />
            <CustomLinkBox
              dateTime="2024-10-18T12:03:00+0900"
              description1="部品リスト作成で新規部品がある場合にエラー"
              description2="略図ボタンの有無確認方法の修正"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.30_.zip"
              inCharge="高知,王さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-10-18T01:33:00+0900"
              description1="部品リスト作成時に新規部品がある場合Edgeエラー"
              description2="EdgeまたはIEの選択式に変更"
              descriptionIN=" "
              linkHref="/files/download/Sjp/Sjp3.100.29_.zip"
              inCharge="高知,王さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-10-17T15:23:00+0900"
              description1="単線分析+にあった電線仕分け表がほしい"
              description2="作成機能の追加"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.27_.zip"
              inCharge="高知,王さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-10-07T16:17:00+0900"
              description1="コネクタ性別がハメ図で分からない"
              description2="ハメ図作成の選択肢にコネクタ性別で点線を追加"
              descriptionIN="コネクタ性別がMaleの場合は点線にする"
              linkHref="/files/download/Sjp/Sjp3.100.26_.zip"
              inCharge="高知,王さん,徳島,山田さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-27T12:12:00+0900"
              description1="NextJsのpublic/filesで構文エラーが10kくらい出て見辛い"
              description2="main.jsと端末.htmlを修正"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.25_.zip"
              inCharge="開発,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-26T14:16:00+0900"
              description1=""
              description2="サブ図の後ハメ電線一覧を印刷範囲として認識"
              descriptionIN=" "
              linkHref="/files/download/Sjp/Sjp3.100.23_.zip"
              inCharge="開発,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-26T11:16:00+0900"
              description1=""
              description2="サブ図のシート順を文字列に対応"
              descriptionIN=" "
              linkHref="/files/download/Sjp/Sjp3.100.22_.zip"
              inCharge="高知,王さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-25T12:28:00+0900"
              description1="製品品番が1点の時に検査履歴作成Menuでエラー"
              description2="ハメ図_印刷シート作成時の配置を修正"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.21_.zip"
              inCharge="徳島,小松さん,不具合,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-24T05:59:00+0900"
              description1="部品リスト作成時にMDが無い場合にCAV一覧から取得時に存在しない端末Noに取得される"
              description2="端末Noの存在を確認する処理を追加"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.17_.zip"
              inCharge="高知,王さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-20T09:30:00+0900"
              description1="配策誘導の配置とmain.jsを修正"
              description2=""
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.10_.zip"
              inCharge="開発,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-18T10:13:00+0900"
              description1="検査履歴システムで.jsのadd.classが動作しない"
              description2=".className=+に修正"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.05_.zip"
              inCharge="不具合,徳島,緒方さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-17T20:32:00+0900"
              description1=""
              description2="検査履歴システムポイント点滅をグループ単位での作成に対応"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.03_.zip"
              inCharge="不具合,徳島,緒方さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-17T13:05:00+0900"
              description1="検査履歴システム用ポイント点滅画像をIE11で.jsエラー"
              description2="IE11で動作するように修正。ポイントの点滅を.pngからdivに変更"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.02_.zip"
              inCharge="不具合,徳島,緒方さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-16T05:55:00+0900"
              description1="MDが正しく処理されない場合に部品リストに端末No.を手入力する必要がある"
              description2="MDが無い場合、コネクタはPVSW_RLTFから取得(その場合はオレンジ色で着色)。詰栓はCAV一覧から取得"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.100.01_.zip"
              inCharge="高知,王さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-09-15T05:35:00+0900"
              description1=""
              description2="タッチ操作に対応した配策誘導ナビの追加"
              descriptionIN="画像の重ね合わせ=>要素をオブジェクトとして作成"
              linkHref="/files/download/Sjp/Sjp3.100.00_.zip"
              inCharge="開発,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-08-26T14:35:00+0900"
              description1="pNumbersが定義されていないエラーでサブ図が作成できない"
              description2="public.pNumbersの定義を削除"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.005.20_.zip"
              inCharge="不具合,高知,王さん,Win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-08-25T16:57:00+0900"
              description1=""
              description2="配策誘導ナビ端末-のデザインとコードを最適化"
              descriptionIN="ハメ図の数字は相手の端末ナンバー"
              linkHref="/files/download/Sjp/Sjp3.005.19_.zip"
              inCharge="書き直し,開発,win10zip"
              isLatest={true}
            />
            <CustomLinkBox
              dateTime="2024-08-25T14:54:00+0900"
              description1=""
              description2="配策誘導ナビ端末のデザインとコードを最適化"
              descriptionIN=" "
              linkHref="/files/download/Sjp/Sjp3.005.18_.zip"
              inCharge="書き直し,開発,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-08-24T19:36:00+0900"
              description1=""
              description2="配策誘導ナビ構成上部の情報を最適化"
              descriptionIN="電線コードと端末部品名を表示"
              linkHref="/files/download/Sjp/Sjp3.005.17_.zip"
              inCharge="書き直し,開発,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-08-24T08:03:00+0900"
              description1="配策誘導ナビの構成No.が画面サイズが小さい場合にバランスが崩れる"
              description2="レスポンシブに対応※IE11以上のみ"
              descriptionIN="構成No毎の.cssを廃止=>.htmlにstyleを記入。ファイルサイズ284->264MB。ファイル数1269->1105"
              linkHref="/files/download/Sjp/Sjp3.005.16_.zip"
              inCharge="不具合,書き直し,開発,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-08-24T01:03:00+0900"
              description1="モバイルでサイズのバランスが崩れる"
              description2="レスポンシブデザインに修正"
              descriptionIN="検査履歴システム※IE11以上のみ"
              linkHref="/files/download/Sjp/Sjp3.005.15_.zip"
              inCharge="不具合,書き直し,開発,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-08-21T19:49:00+0900"
              description1="製品品番のデータ参照がRange型で扱い辛く修正に問題がある"
              description2="製品品番をRange型からclass型に変更。検査履歴システムの作成をグループで出来るように変更"
              descriptionIN="検査履歴システム用点滅画像の修正"
              linkHref="/files/download/Sjp/Sjp3.005.13_.zip"
              inCharge="不具合,書き直し,開発,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-08-18T16:24:00+0900"
              description1="検査履歴システム用点滅画像を1品番毎に作成ボタンを押すのが手間"
              description2="グループ単位での作成に対応。UIに作成イメージを追加"
              descriptionIN=" "
              linkHref="/files/download/Sjp/Sjp3.005.06_.zip"
              inCharge="書き直し,開発,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-08-04T10:50:00+0900"
              description1="部品リストの防水栓に端末Noを入力するのが手間"
              description2="部品リストに防水栓の端末No入力が全て0の場合はCAV一覧からサブNo.を取得"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.004.97_.zip"
              inCharge="不具合,高知,王さん,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-07-18T17:34:00+0900"
              description1="ダブり圧着で先ハメの時に片方しか赤枠にならない"
              description2="複数電線でも赤枠になるように修正"
              descriptionIN="ダブり圧着の赤枠を複数電線でも赤枠になるように修正"
              linkHref="/files/download/Sjp/Sjp3.004.94_.zip"
              inCharge="不具合,高知,王さん,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-07-14T14:59:00+0900"
              description1="検査履歴システムで先ハメ/後ハメが分かるようにしたい"
              description2="検査履歴用の画像で共用ポイントを点滅するように修正"
              descriptionIN="先ハメ/後ハメが分かるように更新。共用ポイントは点滅"
              linkHref="/files/download/Sjp/Sjp3.004.86_.zip"
              inCharge="更新,高知,王さん,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-06-26T10:46:00+0900"
              description1="配索誘導の画像を出力できない"
              description2="sleepMax_を5倍に修正"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.004.85_.zip"
              inCharge="不具合,高知,王さん,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-06-24T11:01:00+0900"
              description1="配索誘導の画像を出力できない"
              description2="CPUの速度に応じてsleep時間を長くするように変更"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.004.84_.zip"
              inCharge="不具合,高知,王さん,win10zip"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-06-11T12:24:00+0900"
              description1="高知のPC設定が徳島と異なるためサーバー接続が出来ない"
              description2="サーバーへの接続タイミングを修正"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.004.83_.zip"
              inCharge="不具合,高知,王さん,win10のzip圧縮"
              isLatest={false}
            />
            <CustomLinkBox
              dateTime="2024-06-10T11:04:00+0900"
              description1=""
              description2="空のフォントサイズを9に変更"
              descriptionIN=""
              linkHref="/files/download/Sjp/Sjp3.004.82_.zip"
              inCharge="徳島,秋山さん,win10でzip"
              isLatest={false}
            />
          </SimpleGrid>

          <Box style={{ textAlign: "center" }}>
            {illusts.map((item, index) => {
              const aosOffset: number = (index % 2) * 150;
              const aosDuration = (index % 4) * 700;
              const aosDelay = (index % 4) * 300;
              return (
                <div
                  data-aos="flip-left"
                  data-aos-offset={aosOffset}
                  data-aos-duration={aosDuration}
                  data-aos-delay={aosDelay}
                  style={{ display: "inline-block" }}
                >
                  <Image
                    src={item.src}
                    style={{ display: "inline-block" }}
                    m={3}
                    className={styles.purupuru}
                  />
                </div>
              );
            })}
            <Hippo_001_wrap />
          </Box>
        </div>
      </Content>
    </>
  );
}
