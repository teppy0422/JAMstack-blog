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
  Flex,
  Icon,
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaExternalLinkAlt } from "react-icons/fa";
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
import ExternalLink from "./ExternalLink";
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
  //現在のパスを取得
  const [currentPath, setCurrentPath] = useState("");
  const [accordionIndex, setAccordionIndex] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
      // 現在のパスに基づいて開くべきアコーディオンのインデックスを設定
      if (
        window.location.pathname.includes("/skillBlogs/0001") ||
        window.location.pathname.includes("/skillBlogs/0002")
      ) {
        setAccordionIndex([0]);
      } else if (window.location.pathname.includes("/skillBlogs/0003")) {
        setAccordionIndex([1]);
      } else {
        setAccordionIndex([]);
      }
    }
  }, []);

  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <Avatar
              size="xs"
              src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
              borderWidth={1}
            />
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
            コネクタの撮影から座標登録まで
          </Heading>
          <CustomBadge text="生準+" />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            更新日:2024-11-17
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
              誰かが撮影したコネクタ画像はみんなで共有した方が良いよね？という考えで開発しました。
              登録した写真と座標データは共有して使用する事で生産効率の向上を図ります。
              以下はその手順です。
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.カメラアプリの起動"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>専用のカメラアプリで撮影して保存します</Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              2-1.生産準備+の[端末一覧]を選択
            </Text>
            <Text fontWeight="400" my={4}>
              2-2.撮影する端末/コネクタ品番を選択
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              下図は11行目(7283-0391-30)を選択している状態です
            </Box>
            <Image src="/images/0001/0002.png" alt="0002.png" />
            <Text fontWeight="400" my={4}>
              2-3.
              <Kbd {...kbdStyle}>Ctrl</Kbd>+<Kbd {...kbdStyle}>Enter</Kbd>
              を押す
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              撮影ソフト(camera+)が起動します
            </Box>
            <Image src="/images/0001/0013.png" alt="0013.png" />
            <Text>
              ※インストールされていない場合はインストール画面が表示されるのでインストールを行ってください。開発の署名は片岡哲兵です。
            </Text>
          </Box>
          <Text textAlign="center">---作成途中---</Text>
        </SectionBox>
        <SectionBox
          id="section3"
          title="3.コネクタ写真の加工(通常)"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text display="inline">
            無料の画像編集ソフト
            <UnderlinedTextWithDrawer
              text="InkScape"
              onOpen={() => handleOpen("InkScape")}
              isOpen={isOpen && activeDrawer === "InkScape"}
              onClose={handleClose}
              header="InkScapeとは"
              children={
                <Box>
                  <Image
                    src="/images/brandIcons/logo_inkscape.svg"
                    alt="logo_inkscape.svg"
                    w="36px"
                    h="36px"
                    mb={2}
                  />
                  <Text>
                    <span style={{ fontWeight: "600" }}>InkScape</span>
                    は、コンピュータで絵を描くための無料のソフトです。特に「ベクターグラフィックス」という方法で絵を描けます。
                  </Text>
                  <Text fontWeight="600" mt={4}>
                    ベクターグラフィックスって何？
                  </Text>
                  <Text>
                    拡大してもきれい:
                    普通の写真や画像は、拡大するとぼやけてしまうことがあります。でも、ベクターグラフィックスは、どんなに拡大しても線がくっきりしています。これは、絵が線や形で表現されているからです。
                  </Text>
                  <Text fontWeight="600" mt={4}>
                    Inkscapeのいいところ
                  </Text>
                  <Text>
                    無料で使える:
                    お金を払わなくても、誰でも自由にダウンロードして使えます。
                  </Text>
                  <Text>
                    みんなで作っている:
                    Inkscapeは、世界中の人たちが協力して作っているソフトです。だから、どんどん良くなっています。
                  </Text>
                  <Text
                    fontWeight="600"
                    mt={4}
                    animation={`${jumpAnimation} 1s infinite`} // アニメーションを適用
                  >
                    注意点
                  </Text>
                  <Text>
                    通常の会社ではソフトのインストール許可申請が必要です。許可が降りてからインストールを行なってください。
                  </Text>
                </Box>
              }
            />
            で写真の背景除去を行います
          </Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              3-1.生産準備+の[端末一覧]を選択
            </Text>
            <Text fontWeight="400" my={4}>
              3-2.登録/修正したい部品品番を選択
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              下図は11行目(7283-0391-30)を選択している状態です
            </Box>
            <Image src="/images/0001/0002.png" alt="0002.png" />
            <Text fontWeight="400" my={4}>
              3-3.
              <Kbd {...kbdStyle}>Shift</Kbd>+<Kbd {...kbdStyle}>Enter</Kbd>
              を押す
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              写真加工ソフト(InkScape)がインストールされていない場合はダウンロードサイトが開きます
            </Box>
            <Image src="/images/0001/0007.png" alt="0007.png" />
            <Text>
              ※InkScapeのダウンロードアドレスがわっていたら開きません。
              その場合はブラウザ(Edgeとか)で検索してダウンロードサイトを探してください。
            </Text>
            <Text my={4}>上図の赤枠辺りをクリックして進みます。</Text>
            <Text my={4}>
              3-4.下図の赤枠辺りをクリックしてダウンロードページを開きます。
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              お使いのパソコンに最適なバージョンが自動選択されます
            </Box>
            <Image src="/images/0001/0008.png" alt="0008.png" />
            <Text my={4}>3-5.click hereをクリックしてダウンロード開始</Text>
            <Image src="/images/0001/0009.png" alt="0009.png" />
            <Text>
              ※ダウンロードが上手く出来ない場合はシステム管理者などにご相談ください
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section4"
          title="4.コネクタ写真の加工(簡単)"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            この方法では簡単に背景除去ができます。コネクタと背景のコントラストがある一定必要です。
            端子写真は電線部分の除去は出来ません。
          </Text>
          <Box m={3}>
            <Text my={4}>4-1.下記のWEBサイトを開く</Text>
            <ExternalLink
              href="https://www.photoroom.com/ja/tools/background-remover"
              text="photoroom.com/ja/tools/background-remover"
            />
            <Text display="inline-block" mt={4}>
              4-2.
              <UnderlinedTextWithDrawer
                text="Photoroom"
                onOpen={() => handleOpen("Photoroom")}
                isOpen={isOpen && activeDrawer === "Photoroom"}
                onClose={handleClose}
                header="Photoroomの使い方"
                children={
                  <Box>
                    <video width="100%" height="100%" loop autoPlay muted>
                      <source
                        src="/images/0001/howToPhotoroom.mp4"
                        type="video/mp4"
                      />
                      お使いのブラウザは動画タグをサポートしていません。
                    </video>
                    <Text mt={4}>
                      <span style={{ fontWeight: "600" }}>Photoroom</span>
                      は、ブラウザ上で動作する画像加工WEBアプリです。2024/11/16現在は無料です。
                    </Text>
                    <Text fontWeight="600" mt={4}>
                      使い方
                    </Text>
                    <Text>
                      1.上の動画のように加工したい写真をドラッグすると背景が除去されます。
                      <br />
                      2.ダウンロード(標準解像度)してパソコンに保存します。
                    </Text>
                  </Box>
                }
              />
              で写真の背景除去を行なってダウンロードします
            </Text>
            <Text my={4}>4-3.ダウンロードしたファイルをリネームします。</Text>
            <Text ml={4}>
              例)
              <br />
              7283-0391-30.png
              <br />
              ⇩<br />
              7283-0391-30_1_001.png
            </Text>
            <Text my={4}>4-4.ファイルを任意の場所に保存します。</Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section5"
          title="5.コネクタ座標の編集"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
        </SectionBox>
        <SectionBox
          id="section6"
          title="6.まとめ"
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
