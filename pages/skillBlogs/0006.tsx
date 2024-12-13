import React, { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  List,
  ListItem,
  Divider,
  ChakraProvider,
  extendTheme,
  IconButton,
  Badge,
  Avatar,
  Code,
  Image,
  Kbd,
  AvatarGroup,
  Flex,
  Tooltip,
  Icon,
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import UnderlinedTextWithDrawer from "./UnderlinedTextWithDrawer";
import IframeDisplay from "./IframeDisplay";
import { useUserData } from "../../hooks/useUserData";
import { useUserInfo } from "../../hooks/useUserId";
import { useReadCount } from "../../hooks/useReadCount";

import "@fontsource/noto-sans-jp";

const customTheme = extendTheme({
  fonts: {
    heading: "'Noto Sans JP', sans-serif",
    body: "'Noto Sans JP', sans-serif",
  },
  fontWeights: {
    normal: 200,
    medium: 300,
    bold: 400,
    light: 300,
    extraLight: 100,
  },
});
//テキストジャンプアニメーション
const jumpAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
`;
//Kbdのスタイル
const kbdStyle = {
  border: "1px solid",
  fontSize: "16px",
  bg: "white",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};
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
const BlogPage: React.FC = () => {
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const { readByCount } = useReadCount(userId);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const showToast = useCustomToast();
  //64pxまでスクロールしないとサイドバーが表示されないから暫定
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64; // 64pxのオフセット
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100); // 100msの遅延を追加
    } else {
      window.scrollTo(0, 150);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, []);
  //#の位置にスクロールした時のアクティブなセクションを装飾
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-64px 0px -99% 0px", threshold: 0 }
    );
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  //#クリックした時のオフセット
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64; // 64pxのオフセット
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange, false);
    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
    };
  }, []);
  const handleOpen = (drawerName: string) => {
    setActiveDrawer(drawerName);
    onOpen();
  };
  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
  };

  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                borderWidth={1}
              />
            </AvatarGroup>
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>開発</Text>
            <Spacer />
            <Flex justifyContent="flex-end">
              <Text>
                <Icon as={CustomIcon} mr={0} />
                {readByCount}
              </Text>
            </Flex>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            生産準備+とは
          </Heading>
          <CustomBadge text="生準+" />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            更新日:2024-11-20
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title="1.はじめに"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box>
            <Text fontWeight="bold"></Text>
            <Text>
              ワイヤーハーネスの品番切替には多くの時間が掛かります。
              特に従来のハメ図から写真のハメ図に置き換えるのが大変です。
              そこで、より効率良くハメ図を作成するシステムを作成しました。
              その後、現場の意見を聞きながら更新を続けています。
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.できること"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <video width="100%" height="100%" loop autoPlay muted>
            <source src="/images/0006/SjpPromotion.mp4" type="video/mp4" />
            お使いのブラウザは動画タグをサポートしていません。
          </video>
        </SectionBox>
        <Box m={3}>
          <SectionBox
            id="section2_1"
            title="2-1.コネクタ写真の共用"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              誰かが撮影したコネクタ写真を使いまわせたら便利ですよね。ということでその仕組みを作りました。
            </Text>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box bg="gray.300" color="black" w="80%" p={1}>
                登録済みのコネクタデータは共用します
              </Box>
              <Image src="/images/0006/0001.svg" w="80%" />
              <Text ml={4}>2024/11/19時点で1680点が登録済みです。</Text>
            </Flex>
          </SectionBox>
          <SectionBox
            id="section2_2"
            title="2-2.ハメ図の作成"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>
              写真のハメ図を作るのが大変だから何とかしてほしい。という意見を受けて作成しました。
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Tooltip
                label="通常のハメ図です。詰栓や先ハメ付属部品はこのように表示されます。"
                placement="top"
              >
                <Image
                  src="/images/0006/1_150_all.png"
                  width="55%"
                  alt="1_150_all.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
              <Tooltip
                label="ボンダーは線長順で表示され各行き先の端末No.が分かるようになっています。"
                placement="top"
              >
                <Image
                  src="/images/0006/1_434_all.png"
                  alt="1_434_all.png"
                  maxWidth="37%"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
            </Flex>
            <Text ml={6}>
              拠点によって要望が違うので
              <UnderlinedTextWithDrawer
                text="選択式"
                onOpen={() => handleOpen("ハメ図は選択式")}
                isOpen={isOpen && activeDrawer === "ハメ図は選択式"}
                onClose={handleClose}
                header="ハメ図は選択式"
                size="sm"
                children={
                  <Box>
                    <video width="100%" height="100%" loop autoPlay muted>
                      <source
                        src="/images/0006/selectSjpMenu.mp4"
                        type="video/mp4"
                      />
                      お使いのブラウザは動画タグをサポートしていません。
                    </video>
                    <Text mt={4}>作成メニューで選択して作成します</Text>
                    <Text mt={4}>
                      組み合わせは
                      <span style={{ fontWeight: "600" }}>52920パターン</span>
                      <br />
                      (2024/11/20現在)
                    </Text>
                    <Text fontWeight="600" mt={4}>
                      ポイント
                    </Text>
                    <Text>
                      製造拠点によってニーズが異なる為、選択式にしました。
                    </Text>
                  </Box>
                }
              />
              で作成できるようにしています。
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_3"
            title="2-3.サブ図"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>生産準備+の今の状態をサブ図として出力します。</Text>
            <Image
              src="/images/0006/sub0001.png"
              width="100%"
              alt="4_516_all.png"
              mb={{ base: 4, md: 0 }}
            />
            <Text>
              他にも以下が作成されます
              <br />
              #先ハメリスト
              <br />
              #後ハメリスト
              <br />
              #サブサンプルに付けるタグ
              <br />
              #電線チェックリスト
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_4"
            title="2-4.共通ハメ図の作成"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              これ!!ハメ図より作成するのが大変ですよね。開発にも苦労しました。
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Tooltip label="製品品番220のハメ図" placement="top">
                <Image
                  src="/images/0006/4_516_all.png"
                  width="45%"
                  alt="4_516_all.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
              <Tooltip label="製品品番310/131のハメ図" placement="top">
                <Image
                  src="/images/0006/3_516_all.png"
                  maxWidth="42%"
                  alt="3_516_all.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
            </Flex>
            <Text ml={6} mt={4}>
              ハメ図を
              <UnderlinedTextWithDrawer
                text="貼るスペースが狭い"
                onOpen={() => handleOpen("ハメ図の共通化")}
                isOpen={isOpen && activeDrawer === "ハメ図の共通化"}
                onClose={handleClose}
                header="ハメ図の共通化"
                children={
                  <Box>
                    <Image
                      src="/images/0006/commonPicture.jpeg"
                      maxWidth="100%"
                      alt="commonPicture.png"
                    />
                    <Text mt={4}>
                      上図のように狭いスペースで使う場合には共通化が有効です。ですが
                      手動で作成/更新するには時間が掛かりすぎる為、この機能を追加しました。
                    </Text>
                  </Box>
                }
              />
              場合に有効です。
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_5"
            title="2-5.サブナンバーの印刷"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>生産準備+で決めたサブナンバーをエフに印刷します。</Text>
            <Flex
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Image
                my={4}
                src="/images/0006/0002.svg"
                maxWidth="100%"
                alt="0002.svg"
              />
              <Image
                src="/images/0006/printF1.png"
                maxWidth="90%"
                alt="printF1.png"
                mb={{ base: 4, md: 0 }}
              />
              <Text>
                ※印刷システムが対応していない場合は1時間程度の修正が必要です
              </Text>
            </Flex>
          </SectionBox>
          <SectionBox
            id="section2_6"
            title="2-6.ポイントナンバー点滅"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>
              検査履歴システム(瀬戸内部品開発)用のポイントナンバー点滅が作成可能。
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
              mt={4}
            >
              <IframeDisplay
                src="../../files/download/Sjp/70/8211158A40/0080.html"
                width="240"
                height="300"
              />
              <IframeDisplay
                src="../../files/download/Sjp/70/8211158A40/0022.html"
                width="240"
                height="300"
              />
            </Flex>
          </SectionBox>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Text mt={4}>現在は主に下記で使用しています</Text>
            <UnderlinedTextWithDrawer
              text="#1.検査履歴システム"
              onOpen={() => handleOpen("検査履歴システム")}
              isOpen={isOpen && activeDrawer === "検査履歴システム"}
              onClose={handleClose}
              header="検査履歴システムとは"
              size="sm"
              children={
                <Box>
                  <video width="100%" height="100%" loop autoPlay muted>
                    <source
                      src="/images/0006/検査履歴システム用ポイント図.mp4"
                      type="video/mp4"
                    />
                    お使いのブラウザは動画タグをサポートしていません。
                  </video>
                  <Text mt={4}>©︎瀬戸内部品</Text>
                  <Text>
                    YCCに接続して検査状況を監視/検査履歴を記録するシステム。
                    ラベル印刷に対応。QRリーダー(シリアル通信タイプ)が必要。
                  </Text>
                  <Text mt={4}>
                    上記でOPEN/SHORTが発生した場合の画面を生産準備+が作成。
                  </Text>
                  <Text mt={4}>
                    検査履歴システムはこのWEBサイトでのダウンロード不可です。
                  </Text>
                </Box>
              }
            />
          </Flex>
          <SectionBox
            id="section2_7"
            title="2-7.配策誘導ナビ"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>
              配策作業は慣れた製品じゃないと端末を探すのが大変ですよね。なのでその経路が分かるものを作成しました。
              試作品や補給品などの非量産品に特に有効です。
            </Text>
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0006/0084.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
            </Box>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Text mt={4}>現在は主に下記で使用しています</Text>
              <UnderlinedTextWithDrawer
                text="#1.配策誘導ナビ"
                onOpen={() => handleOpen("配策誘導ナビ")}
                isOpen={isOpen && activeDrawer === "配策誘導ナビ"}
                onClose={handleClose}
                header="配策誘導ナビとは"
                children={
                  <Box>
                    <Text mt={4}>配策誘導ナビ</Text>
                    <Text>配策誘導を使用する結き工程で使用</Text>
                    <Text mt={4}>
                      結き治具は横幅が長い為、通常のディスプレイでは作業者は見えません。
                      なので移動させるようにしました。
                    </Text>
                    <Text mt={4}>
                      キーボード入力タイプのQRリーダーが必要
                      <br />
                      ディスプレイを移動させる為にVB.netのシリアルコントロールを利用。
                    </Text>
                  </Box>
                }
              />
              <UnderlinedTextWithDrawer
                text="#2.配策誘導ナビv3.1(モバイル)"
                onOpen={() => handleOpen("配策誘導ナビモバイル")}
                isOpen={isOpen && activeDrawer === "配策誘導ナビモバイル"}
                onClose={handleClose}
                header="配策誘導ナビv3.1(モバイル)とは"
                size="xl"
                children={
                  <Box>
                    <IframeDisplay src="/56v3.1_" width="100%" />
                    <Text mt={4}></Text>
                    <Text>
                      配策誘導をタッチ操作に対応してiPadのようなモバイル端末でも操作できるようにしました。
                      上の画面をタッチ/クリックしてみてください。
                    </Text>

                    <Text>
                      現在は表示のみですが、サブ形態の変更などの機能拡張が見込めます。
                    </Text>

                    <Text mt={4}>
                      モバイル端末からアクセスするには別途WEBサーバーが必要。
                      <br />
                      WEBサーバーの値段は1万円-500万円(20万円弱がお勧めです)
                    </Text>
                  </Box>
                }
              />
            </Flex>
          </SectionBox>
          <SectionBox
            id="section2_8"
            title="2-8.MKEDへの回路符号入力"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>チェッカー用データ作成で回路符号の入力。</Text>
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0006/v4220.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
            </Box>
          </SectionBox>
          <SectionBox
            id="section2_9"
            title="2-9.竿レイアウト(AMDAS作成)"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              AMDASデータの作成は時間がかかるし入力ミスが発生しますよね。下記のように効率良く作成する方法を作成しました。
            </Text>
            <Image src="/images/0006/0003.svg" width="100%" alt="0003.svg" />
            <Text>
              これは使用頻度が低い為、作り込みがあまり出来ていません。不具合があれば連絡下さい。
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_10"
            title="2-10.サブナンバー引越し"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              特にマイナーチェンジ時はサブ形態が引き継がれる事が多いと思います。その際に旧→新にサブナンバーを引っ越す事が可能です
            </Text>
            <Image src="/images/0005/0001.svg" width="100%" alt="0001.svg" />
            <Image
              src="/images/0005/new_menu3.png"
              width="100%"
              alt="new_menu3.png"
              mt={4}
            />
            <Text>上図は82111V4662のみ引越しを実行した結果です。</Text>
          </SectionBox>
          <SectionBox
            id="section2_11"
            title="2-11.バージョンアップ"
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              生産準備+は日に1回程度の更新をしています。
              通常は新しいコードに手修正するのに10分くらいかかります。
              生産準備+の数は治具台数と等しい為、手修正が現実的ではありません。
              そこでバージョンアップ機能を追加しました。4クリックで完了します。
            </Text>

            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                my={4}
                src="/images/0006/0004.svg"
                width="50%"
                alt="0004.svg"
              />
              <Image
                my={4}
                src="/images/0006/verup_.svg"
                width="45%"
                alt="verup_.svg"
              />
            </Flex>
            <Text></Text>
          </SectionBox>
          <SectionBox
            id="section2_12"
            title="2-12.その他"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              他にも以下のようにできることはありますが、説明は未だ作れていません。
            </Text>
            <Text>#先ハメ誘導ナビ</Text>
            <Text>#部品箱の表示作成(TEPRA)</Text>
            <Text>#電線仕分け表</Text>
            <Text>#サブリスト</Text>
            <Text>#EXTESからの共通化分析リクエストの実行</Text>
            <Text>#サブ自動立案</Text>
            <Text textAlign="center">---作成途中---</Text>
          </SectionBox>
        </Box>

        <SectionBox
          id="section3"
          title="3.まとめ"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box
            height="80vh"
            style={{
              backgroundImage:
                "url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              position: "relative",
            }}
          >
            <Text
              style={{
                padding: "13px",
                paddingTop: "20px",
                textAlign: "left",
                color: "#fff",
                textShadow: "none",
                fontFamily: "'Yomogi', sans-serif",
                fontWeight: "200",
              }}
            >
              現場の意見を基に相談しながら新しい機能を追加しています。
              何かアイデアや要望があればメニューの問い合わせから相談下さい。
              アカウントが未作成の場合は開発のチャットからメッセージください。
            </Text>
            <Image
              src="/images/hippo.gif"
              alt="Hippo"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "50px",
              }}
            />
          </Box>
        </SectionBox>
        <Box h="0.01vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
