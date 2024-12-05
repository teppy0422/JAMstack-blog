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
import {
  FaFile,
  FaRegEdit,
  FaFolder,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { PiAppWindowFill, PiArrowFatLineDownLight } from "react-icons/pi";
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
import ReferenceSettingModal from "./referenceSettingModal";

import "@fontsource/noto-sans-jp";
import { BsFiletypeExe } from "react-icons/bs";
import SjpChart01 from "./chart/chart_0009_01";
import SjpChart02 from "./chart/chart_0009_02";

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
    icon?;
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
            誘導ポイント設定一覧表の使い方
          </Heading>
          <CustomBadge text="誘導ポイント設定" />
          <CustomBadge text="作成途中" />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            更新日:2024-11-30
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
            <Text>
              作業順を記した手順書にLED番号が有りますよね？
              その手順書を見ながら制御器のデータを手入力作成していると思います。
              手順書から制御器に直接書き込むシステムを作成しました。
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.参照設定の確認"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold">
            正しく動作しない場合は
            <ReferenceSettingModal />
            をしてください。
          </Text>

          <Text mt={6}>
            WindowsのOSによっては参照不可が発生すると思います。
            <br />
            例えばWindows7で利用する場合は、制御器にデータ送信を行うためにMicroSoft社のMsComm32.ocxが参照不可になったと思います。
            <br />
            スクリーンショットが撮れないのではっきりしません。
            <br />
            参照不可になってる場合はその画面を「問い合わせ」のチャットから送ってください。
            <br />
            その場合の手順をここに追記します。
          </Text>
        </SectionBox>
        <SectionBox
          id="section3"
          title="3.シリアルポートの準備"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold">シリアルポートの準備を以下で行います。</Text>

          <Text mt={6}>作成途中です</Text>
        </SectionBox>
        <SectionBox
          id="section4"
          title="4.データ入力"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold"></Text>
          <Text mt={6}></Text>
        </SectionBox>
        <Box ml={2}>
          <SectionBox
            id="section4_1"
            title="4-1.列の指定"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
            mt="0"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold">
              下記の3項目を以下のルールで配置してください。
              それ以外は自由に編集が可能です。
            </Text>
            <Image src="/images/0010/0001.png" w="100%" mb={6} />
            <Text>1.ｲﾝﾗｲﾝ = 作業に対応するLED番号を入力する列を指定</Text>
            <Text>2.start_ = 製品品番の左端の列を指定</Text>
            <Text>3.end_ = 製品品番の右端の列を指定</Text>
            <Text mt={2}>
              ※実際には原紙を使うと思うので編集時に以上のルールを守るだけになると思います
            </Text>
          </SectionBox>
          <SectionBox
            id="section4_2"
            title="4-2.値の入力"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold">
              入力ルールは以下のようになります。
              <br />
              入力箇所のセル結合はしないてください。
              結合範囲のセルは左上しか認識できないので不具合の原因になります。
            </Text>
            <Image src="/images/0010/0002.png" w="100%" mb={6} />
            <Text>
              4.ｲﾝﾗｲﾝ番号の入力 = 作業に対し光らせたいLED番号の入力
              <br />
              4.ｲﾝﾗｲﾝ色 =
              複数のYICで作業をする場合は背景色を変える事で背景色毎の出力が可能
            </Text>
            <Text>5.YICの呼び出し番号 = 空欄の場合は出力しない</Text>
            <Text>6.作業の有無 = 空欄の場合はLEDが光らない</Text>
          </SectionBox>
        </Box>
        <SectionBox
          id="section5"
          title="5.YICへの出力"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold">MENUの説明</Text>
          <Image src="/images/0010/0003.png" w="45%" mb={6} />

          <Text>
            ①48P、100P、200Pを選択
            <br />
            ※200Pは動作未確認です。不具合がある場合は連絡をお願いします。
            <br />
            ②YICと接続したシリアルポート番号の選択。背景色が白で接続完了です。
            <br />
            ③ｲﾝﾗｲﾝ色の選択。
            <br />
            ④チェックオンでYICに直接転送する。
            <br />
            ⑤チェックオンでインラインクリップ設定一覧表のシートを作成する。
            <br />
            ※作成したシートからも出力可能です。
            <br />
            ⑥④または⑤を実行します。
            <br />
            ⑦このブックに含まれるバージョンをアップロード。
            <br />
            ⑧カレントディレクトリ以下のサブディレクトリのファイル名が「誘導ポイント設定一覧表」を含むブックに対して⑦のプログラムを与えます
          </Text>
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
                fontWeight: "400",
              }}
            >
              このシステムは実際に運用中ですが、未完成で以下の問題を含んでいます。
              <br />
              <br />
              1.200Pは運用中の工場での保有が無いので動作は未確認です。
              <br />
              2.ポイント72と73が反対になる(LED72を指示をしても73が光る)不具合が発生しています。
              <br />
              ※おそらく書き込み器側の不具合なのですが解決する方法が無いのでオプションで「入れ替える」機能の追加を予定しています。
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
