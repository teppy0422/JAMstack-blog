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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { FaFile } from "react-icons/fa";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import DownloadLink from "./DownloadLink";
import UnderlinedTextWithDrawer from "./UnderlinedTextWithDrawer";
import ExternalLink from "./ExternalLink";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ImageSliderModal from "./ImageSliderModal"; // モーダルコンポーネントをインポート

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
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

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
  //生産準備+着手からの経過日数の計算
  const calculateElapsedTime = () => {
    const startDate = new Date(2016, 6, 11); // 月は0から始まるので7月は6
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30); // おおよその月数
    const days = (diffDays % 365) % 30;
    return `${years}年${months}ヶ月${days}日`;
  };
  type FileSystemItem = {
    name: string;
    type: "folder" | "file"; // 'folder' または 'file' のみを許可する
    children?: FileSystemItem[];
    popOver?: string;
    isOpen?: boolean;
  };
  const directoryData: FileSystemItem = {
    name: "任意のフォルダ",
    type: "folder",
    isOpen: true,
    popOver: "※社内間でアクセスできるNASSサーバーに作成がお勧め",
    children: [
      {
        name: "メーカー名Aのフォルダ",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "車種_モデル名のフォルダ",
            type: "folder",
            isOpen: true,
            children: [
              {
                name: "Sjp3.100.89_Gタイプ.xlsm",
                type: "file",
                popOver:
                  "ダウンロードした生産準備+をここに配置。治具タイプを末尾に付ける事をお勧めします。ここではGタイプの治具の場合です。",
              },
            ],
          },
        ],
      },
      {
        name: "メーカー名Bのフォルダ",
        type: "folder",
        isOpen: false,
      },
    ],
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null; // クライアントサイドでのみ表示する場合はnullを返す
  }
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
            生産準備+の練習(中級)
          </Heading>
          <CustomBadge text="生準+" />
          <CustomBadge text="作成途中" />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            更新日:2024-11-25
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
              ここでは何もデータを持っていない状態から生産準備+で成果物を作成する流れを解説します。
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.生産準備+の入手"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box>
            <Text fontWeight="bold"></Text>
            <Text>以下のリンクから最新版をダウンロードしてください。</Text>
            <ExternalLink href="../../download/sjp" text="download/sjp" />
          </Box>
        </SectionBox>
        <SectionBox
          id="section3"
          title="3.生産準備+の配置"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text mb={4}>下記のようにフォルダを作成して配置。</Text>
          <FileSystemNode item={directoryData} />
        </SectionBox>
        <SectionBox
          id="section4"
          title="4.必要データの入手"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text mb={4}>
            生産準備+にインポートするデータを入手していきます。
            <br />
            入手せずにすぐに試したい場合は下記から準備済みのデータをダウンロードしてご利用ください。
          </Text>
          <UnderlinedTextWithDrawer
            text="#準備済みの必要データ"
            onOpen={() => handleOpen("準備済みの必要データ")}
            isOpen={isOpen && activeDrawer === "準備済みの必要データ"}
            onClose={handleClose}
            header="準備済みの必要データ"
            size="md"
            children={
              <>
                <Text mb={4}>※このデータは以下の製品品番を含みます</Text>
                <Box border="1px solid" p={2} borderRadius="md" mb={4}>
                  <Text fontWeight={400}>
                    8216136D20
                    <br />
                    8216136D30
                    <br />
                    8216136D40
                    <br />
                    8216136D50
                    <br />
                    8216136E00
                    <br />
                  </Text>
                </Box>
                <Text mb={4}>下記からダウンロードしてお使いください</Text>
                <DownloadLink
                  text="必要データのダウンロード"
                  href="/images/0008/必要データ.zip"
                />
              </>
            }
          />
        </SectionBox>
        <Box m={0} ml={3} w="100%">
          <SectionBox
            id="section4_1"
            title="4-1.RLTFの入手"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              EXTESから単線分析リクエストを実行して以下2つのRLTFを入手します
            </Text>
            <Text>
              <Icon as={FaFile} color="gray.600" mr={1} />
              RLTF-A
            </Text>
            <Text>
              <Icon as={FaFile} color="gray.600" mr={1} />
              RLTF-B
            </Text>
          </SectionBox>
          <Box m={0} ml={3}>
            <SectionBox
              id="section4_1_1"
              title="4-1-1.手動での起動"
              sectionRefs={sectionRefs}
              sections={sections}
              size="sm"
            >
              <Divider
                borderColor={colorMode === "light" ? "black" : "white"}
              />
              <Text mb={4}>
                通常の手順で手入力で起動します。
                手順が分からない場合は工務にご相談ください。
                それでも分からない場合は
                <ExternalLink
                  href="../../thread/8d7d2ec1-3157-4f5c-a2c3-2e1223e1d2b9"
                  text=" 開発/相談"
                />
                のチャットから問い合わせてください。
              </Text>
            </SectionBox>
            <SectionBox
              id="section4_1_2"
              title="4-1-2.生産準備+から起動"
              sectionRefs={sectionRefs}
              sections={sections}
              size="sm"
            >
              <Divider
                borderColor={colorMode === "light" ? "black" : "white"}
              />
              <Text mb={4}>
                生産準備+の[製品品番]の情報から起動までを自動入力します
              </Text>
              <></>
              <Text>
                自動入力の為に初回のみEXTESの設定変更が必要です。
                <br />※<span onClick={onModalOpen}>EXTESの設定変更</span>
                <ImageSliderModal
                  images={[
                    "../../images/0008/extes2.jpg",
                    "../../images/0008/extes3.jpg",
                  ]}
                  isOpen={isModalOpen}
                  onClose={onModalClose}
                />
              </Text>
            </SectionBox>
          </Box>
          <SectionBox
            id="section4_2"
            title="4-2.社内図の設計データ入手"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>主管工場の設計にメールで依頼して入手します</Text>
            <UnderlinedTextWithDrawer
              text="#メールのサンプル"
              onOpen={() => handleOpen("メールサンプル")}
              isOpen={isOpen && activeDrawer === "メールサンプル"}
              onClose={handleClose}
              header="メールのサンプル"
              size="md"
              children={
                <>
                  <Text mb={4}>※下記をコピーしてお使いください</Text>
                  <Box border="1px solid" p={2} borderRadius="md" mb={4}>
                    <Text fontWeight={400}>
                      宛先: 〇〇工場 設計 〇〇様
                      <br />
                      件名: PVSWとSUBデータ依頼_生産準備用
                      <br />
                      内容: 〇〇様 お世話になります
                      <br />
                      <br />
                      下記のPVSW.csv、SUB.csv、HSFの出力をお願い致します
                      <br />
                      用途はCV試作の準備です 設変は最新(最終)でお願い致します
                      <br />
                      製品品番
                      <br />
                      841W 82111-V1070 代)82111-V1020
                      <br />
                      841W 82111-V1080
                      <br />
                      841W 82111-V1090
                      <br />
                      以上3点よろしくお願い致します。 <br />
                      <br />
                      〇〇工場 生産準備 〇〇
                    </Text>
                  </Box>

                  <Text fontWeight={600} mt={4}>
                    各データの必要性
                  </Text>
                  <Text>・PVSW.csvは必須です</Text>
                  <Text>
                    ・SUB.csvは社内図の標準サブ形態を使用するなら必要です
                  </Text>
                  <Text>
                    ・HSFは手入力が大幅に削減出来るのであった方が良いです
                  </Text>

                  <Text fontWeight={600} mt={4}>
                    各データの名称について
                  </Text>
                  <Text>
                    各データの正式名称は不明です。
                    すべて社内図を出力するシステムからの出力と聞いています。
                    <br />
                    もし上記メールでどのデータなのか伝わらなければ、下記からダウンロードした参考データを以って設計の方に相談してみてください。
                  </Text>
                  <DownloadLink
                    text="参考データのダウンロード"
                    href="/images/0008/参考.zip"
                  />
                </>
              }
            />
          </SectionBox>
        </Box>
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
                fontWeight: "400",
              }}
            >
              以上で生産準備+の使い方の説明は終わりです。
              <br />
              練習(上級)では生産準備+の動作を変更するアイデアを提案するコツを紹介します。
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
