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
const BlogPage: React.FC = () => {
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
        <Box>
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp" />
            </AvatarGroup>
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>開発</Text>
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
            更新日:2024-11-19
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
          <Box m={3}>
            <Text fontWeight="400" mt={4}>
              2-1.コネクタ写真と座標の共用(.xlsm)
            </Text>
            <Divider
              mb={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
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
            <Text fontWeight="400" mt={4}>
              2-2.ハメ図の作成(.xlsm)
            </Text>
            <Divider
              mb={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
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
              で色々なハメ図の作成が可能です。
            </Text>
            <Text fontWeight="400" mt={4}>
              2-3.共通ハメ図の作成(.xlsm)
            </Text>
            <Divider
              mb={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
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
            <Text ml={6}>
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
            <Text fontWeight="400" mt={4}>
              2-4.サブナンバーの印刷
            </Text>
            <Divider
              mb={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Tooltip label="生産準備+のサブナンバーを印刷" placement="top">
                <Image
                  src="/images/0006/printF1.png"
                  maxWidth="90%"
                  alt="printF1.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
              <Text>※印刷システムの修正(1.0H程度)が必要です</Text>
            </Flex>
            <Text fontWeight="400" mt={4}>
              2-5.ポイントナンバー点滅
            </Text>
            <Divider
              mb={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              .htmlで点滅する画像を作成
              <br />
              .cssの関係で現在はIE11以上が必要。必要ならIE7にも対応可能です。
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
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
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
            <Text fontWeight="400" mt={4}>
              2-6.配策経路ナビ(.html)
            </Text>
            <Divider
              mb={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>.htmlの都合でIE11が必須です</Text>
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
            <Text fontWeight="400" mt={4}>
              2-7.MKEDへの回路符号入力
            </Text>
            <Divider
              mb={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Box display="flex" justifyContent="center" width="100%">
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0006/v4220.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
            </Box>
            <Text fontWeight="400" mt={4}>
              2-8.その他
            </Text>
            <Divider
              mb={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>#サブ図</Text>
            <Text>#竿レイアウト→自動機データ作成</Text>
            <Text>#先ハメ誘導ナビ</Text>
            <Text>#部品箱の表示作成(TEPRA)</Text>
            <Text>#電線仕分け表</Text>
            <Text>#サブリスト</Text>
            <Text>#EXTESからの共通化分析リクエストの実行</Text>
          </Box>
          <Text textAlign="center">---作成途中---</Text>
        </SectionBox>
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
                fontWeight: "bold",
              }}
            ></Text>
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
