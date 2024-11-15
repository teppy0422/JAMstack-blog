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
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";

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

const QiitaPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const showToast = useCustomToast();
  //64pxまでスクロールしないとサイドバーが表示されないから暫定
  useEffect(() => {
    window.scrollTo(0, 150);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
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
  return (
    <>
      <Content isCustomHeader={true} maxWidth="1200px">
        <ChakraProvider theme={customTheme}>
          <HStack
            align="start"
            spacing={4}
            p={4}
            fontFamily="Noto Sans JP"
            w="100%"
          >
            <VStack
              align="start"
              flex=".5"
              position="sticky"
              top="64px"
              display={["none", "none", "none", "block"]}
            >
              <IconButton
                icon={<CiHeart />}
                ref={buttonRef}
                fontSize="24px"
                borderRadius="50%"
                border="1px solid"
                borderColor={colorMode === "light" ? "black" : "white"}
                color={colorMode === "light" ? "black" : "white"}
                aria-label="いいね"
                onClick={() => {
                  showToast(
                    "用意していません",
                    "そのうち追加するかもです",
                    "success"
                  );
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 8000); // 3秒後に紙吹雪を消す
                }}
              />
            </VStack>
            <VStack
              align="start"
              spacing={6}
              flex="10"
              bg="rgb(255,255,255,0.3)"
              w={["100%", "100%", "100%", "70%"]}
              p={4}
              borderRadius="10px"
            >
              <Box>
                <HStack spacing={2} align="center" mb={1} ml={1}>
                  <Avatar
                    size="xs"
                    src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                  />
                  <Text>@kataoka</Text>
                  <Text>in</Text>
                  <Text>開発</Text>
                </HStack>
                <Heading fontSize="3xl" mb={1}>
                  コネクタの撮影から座標登録まで
                </Heading>
                <Badge>生準+</Badge>
                <Text
                  fontSize="sm"
                  color={colorMode === "light" ? "gray.800" : "white"}
                  mt={1}
                >
                  投稿日:2024-11-15
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
                    <Kbd border="1px solid" fontSize="16px" bg="white" mx={1}>
                      Ctrl
                    </Kbd>
                    +
                    <Kbd border="1px solid" fontSize="16px" bg="white" mx={1}>
                      Enter
                    </Kbd>
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
                title="3.コネクタ写真の加工"
                sectionRefs={sectionRefs}
                sections={sections}
              >
                <Divider
                  mt={2}
                  borderColor={colorMode === "light" ? "black" : "white"}
                />
                <Text>
                  撮影したコネクタ写真の背景を削除して使用しやすくします
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
                    <Kbd border="1px solid" fontSize="16px" bg="white" mx={1}>
                      Shift
                    </Kbd>
                    +
                    <Kbd border="1px solid" fontSize="16px" bg="white" mx={1}>
                      Enter
                    </Kbd>
                    を押す
                  </Text>
                  <Box bg="gray.300" color="black" w="100%" p={1}>
                    写真加工ソフト(InkScape)がインストールされていない場合はダウンロードサイトが開きます
                  </Box>
                  <Image src="/images/0001/0007.png" alt="0007.png" />
                  <Text>
                    ※InkScapeはオープンソースの無料ソフトです。
                    InkScapeのダウンロードアドレスが変わっていたら開きません。
                    その場合はブラウザ(Edgeとか)で検索してダウンロードサイトを探してください。
                    赤枠辺りをクリックしてダウンロードページを開きます。
                  </Text>
                </Box>
              </SectionBox>
              <SectionBox
                id="section5"
                title="python大学"
                sectionRefs={sectionRefs}
                sections={sections}
              >
                <Box>
                  <Text fontWeight="bold">Pythonプログラミング入門</Text>
                  <Text>
                    Pythonについて環境構築から始まり、基本文法、数値解析など応用的な使い方までを分かりやすく解説している。
                  </Text>
                </Box>
              </SectionBox>
              <SectionBox
                id="section6"
                title="aws大学"
                sectionRefs={sectionRefs}
                sections={sections}
              >
                <Text mt={2} fontFamily="M PLUS Rounded 1c" fontWeight="bold">
                  ネットワークやクラウド、インフラの仕組みの解説から始まり、AWSの構成パターンなどが基礎から解説されている。
                </Text>
              </SectionBox>
              <SectionBox
                id="section7"
                title="ひだり大学"
                sectionRefs={sectionRefs}
                sections={sections}
              >
                <Text mt={2} fontFamily="M PLUS Rounded 1c" fontWeight="bold">
                  今回は大学が無料で公開している、エンジニア向けの学びになる資料をまとめていきます。
                </Text>
              </SectionBox>
              <Box height="1000vh"></Box>
            </VStack>

            {/* サイドバー */}
            <VStack
              align="start"
              spacing={3}
              flex="4"
              position="sticky"
              top="64px"
              display={["none", "none", "none", "block"]}
            >
              <List spacing={1} fontSize="sm">
                {sections.current.map((section) => {
                  const underscoreCount = (section.id.match(/_/g) || []).length; // アンダースコアの数をカウント
                  const indent = 2 + underscoreCount * 2; // 基本インデントにアンダースコアの数に応じたインデントを追加

                  return (
                    <ListItem
                      w="100%"
                      key={section.id}
                      p={1}
                      borderRadius="5px"
                      bg={
                        activeSection === section.id
                          ? "gray.500"
                          : "transparent"
                      }
                      color={
                        activeSection === section.id
                          ? "white"
                          : colorMode === "light"
                          ? "black"
                          : "white"
                      }
                      pl={indent}
                    >
                      <Link href={`#${section.id}`}>{section.title}</Link>
                    </ListItem>
                  );
                })}
              </List>
            </VStack>
          </HStack>
        </ChakraProvider>
      </Content>
      {showConfetti && buttonRef.current && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={20}
          gravity={0.5} // 重力を調整して紙吹雪の動きを制御
          recycle={false}
          confettiSource={{
            x:
              buttonRef.current.getBoundingClientRect().left +
              buttonRef.current.offsetWidth / 2,
            y:
              buttonRef.current.getBoundingClientRect().top +
              buttonRef.current.offsetHeight / 2,

            w: 0.1,
            h: 0.3,
          }}
          style={{
            position: "absolute",
            zIndex: 10000,
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
};

export default QiitaPage;
