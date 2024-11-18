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
  Icon,
  Flex,
  ListIcon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaBan, FaObjectGroup } from "react-icons/fa";
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート

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
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
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
  //アンダーライン付きテキスト_ドロワー
  const UnderlinedTextWithDrawer = ({
    text,
    onOpen,
    isOpen,
    onClose,
    header,
    children,
  }) => {
    const { colorMode } = useColorMode();
    const color = colorMode === "light" ? "blue.500" : "blue.200";
    return (
      <>
        <HStack
          as="span"
          style={{ whiteSpace: "nowrap" }}
          color={color}
          cursor="pointer"
          onClick={onOpen}
          spacing={1}
          borderBottom="2px solid"
          borderColor={color}
          display="inline"
        >
          <Box as="span" display="inline">
            {text}
          </Box>
          <LuPanelRightOpen
            size="20px"
            style={{ marginBottom: "-3px", display: "inline" }}
          />
        </HStack>
        <BasicDrawer isOpen={isOpen} onClose={onClose} header={header}>
          {children}
        </BasicDrawer>
      </>
    );
  };
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
  type FileSystemItem = {
    name: string;
    type: "folder" | "file"; // 'folder' または 'file' のみを許可する
    children?: FileSystemItem[];
    popOver?: string;
    isOpen?: boolean;
  };
  const directoryData2: FileSystemItem = {
    name: "良く使うコード",
    type: "folder",
    isOpen: true,
    children: [
      {
        name: "1次元配列の並び替え",
        type: "folder",
        isOpen: false,
        children: [
          {
            name: "Function sort1ary(arr_) As Variant",
            type: "file",
            popOver: "arr_は1次元配列,1,2,3,10,11,A,Bのような昇順で並び替える",
          },
        ],
      },
      {
        name: "部品品番の変換",
        type: "folder",
        isOpen: false,
        children: [
          {
            name: "Function convertYazakiNumber(str_ As String) As String",
            type: "file",
            popOver:
              "str_が7119-5555-30なら7119555530に変換.7119555530なら7119-5555-30に変換",
          },
        ],
      },
      {
        name: "1次元配列をUTF8でテキスト出力",
        type: "folder",
        isOpen: false,
        children: [
          {
            name: "Sub exportText_UTF8(ary_ As Variant,path_ As String)",
            type: "file",
            popOver:
              "EXCEL-VBAの標準だとShift_JISでテキスト出力されて文字化けの原因になるからUTF8で出力.htmlとか.cssとかで使う",
          },
        ],
      },
    ],
  };
  const directoryData1: FileSystemItem = {
    name: "ワイヤーハーネス(治具単位)",
    type: "folder",
    isOpen: true,
    children: [
      {
        name: "エクセルvbaでは専用のライブラリも概念も無い為、classとcollectionを使ってオブジェクト指向を実現しています。以下はワイヤーハーネスのオブジェクトのイメージです。※これは省略した形で実際はもっと要素数が多いです。",
        type: "file",
      },
      {
        name: "products",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "count",
            type: "file",
            popOver: "製品品番の点数\n値:1\n型:Integer",
            isOpen: false,
          },
          {
            name: "item 1",
            type: "folder",
            isOpen: true,
            popOver: "製品品番の1点目\n型:productクラス",
            children: [
              {
                name: "name",
                type: "file",
                popOver: "製品品番\n値:82111A123     \n型:String",
              },
              {
                name: "RLTFA_designNum",
                type: "file",
                popOver: "設変\n値:C00\n型:String",
              },
              {
                name: "nickName",
                type: "file",
                popOver: "呼称\n値:123\n型:String",
              },
              {
                name: "cavTotalCount",
                type: "file",
                popOver: "cavの合計数\n値:1042\n型:Integer",
              },
              {
                name: "insertAfterCount",
                type: "file",
                popOver: "後ハメ数の合計\n値:162\n型:Integer",
              },
              {
                name: "terminals",
                type: "folder",
                isOpen: false,
                popOver: "コネクタ端末\n型:collection",
                children: [
                  {
                    name: "picturePath",
                    type: "file",
                    popOver:
                      "コネクタ写真のアドレス\n値:G:¥18_部材一覧¥201_写真¥7283-1018-40_1_001.png\n型:String",
                  },
                  {
                    name: "number",
                    type: "file",
                    popOver: "端末No\n値:6\n型:String",
                  },
                  {
                    name: "subNumber",
                    type: "file",
                    popOver: "サブNo\n値:GK4\n型:String",
                  },
                  {
                    name: "Item 1",
                    type: "folder",
                    isOpen: false,
                    popOver: "1つ目の端末\n型:terminalクラス",
                    children: [
                      {
                        name: "Holes",
                        type: "folder",
                        isOpen: false,
                        popOver: "端末の穴\n型:collection",
                        children: [
                          {
                            name: "Item 1",
                            type: "folder",
                            isOpen: false,
                            children: [
                              {
                                name: "shapeType",
                                type: "file",
                                popOver: "穴の形状\n値:Cir\n型:String",
                              },
                              {
                                name: "point",
                                type: "file",
                                popOver:
                                  "導通検査のポイントナンバー\n値:1014\n型:String",
                              },
                              {
                                name: "xLeft",
                                type: "file",
                                popOver:
                                  "コネクタ写真に対しての穴の左位置\n値:77\n型:String",
                              },
                              {
                                name: "wires",
                                type: "folder",
                                isOpen: false,
                                popOver: "電線\n型:collection",
                                children: [
                                  {
                                    name: "Item 1",
                                    type: "folder",
                                    isOpen: false,
                                    children: [
                                      {
                                        name: "color",
                                        type: "file",
                                        popOver:
                                          "電線の色番号\n値:70\n型:String",
                                      },
                                      {
                                        name: "colorCode",
                                        type: "file",
                                        popOver:
                                          "電線の色呼称\n値:Y\n型:String",
                                      },
                                      {
                                        name: "wireSize",
                                        type: "file",
                                        popOver:
                                          "電線のサイズ呼称\n値:039\n型:String",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  const directoryData0: FileSystemItem = {
    name: "Sjp*.xlsmがあるフォルダ",
    type: "folder",
    children: [
      {
        name: "00_temp",
        type: "folder",
        isOpen: false,
        popOver:
          "入手したRLTF-AとRLTF-Bを分解する為にはその2ファイルのみをここに入れます",
        children: [
          {
            name: "001_テキストデータ",
            type: "folder",
            isOpen: false,
            popOver:
              "分解元のデータ\nこれは開発者の確認用で通常は使用しません\n※単線分析リクエストの管理No.毎に保存されます",
            children: [
              {
                name: "N090195",
                type: "folder",
                isOpen: false,
                children: [
                  { name: "N090195_KairoMat_3.txt", type: "file" },
                  { name: "N090195_MRP.TXT", type: "file" },
                  { name: "RLTF*A*.TXT", type: "file" },
                  { name: "RLTF*B*.TXT", type: "file" },
                ],
              },
            ],
          },
          {
            name: "002_エクセルデータ",
            type: "folder",
            isOpen: false,
            popOver:
              "分解したデータ\nこれは古い生産準備+で使用していた���ので通常は使用しません",
            children: [
              {
                name: "N090195",
                type: "folder",
                isOpen: false,
                children: [
                  { name: "仕分けリスト", type: "file" },
                  { name: "部品リスト", type: "file" },
                  {
                    name: "N090195_製品別回路マトリクス.xls",
                    type: "file",
                  },
                  { name: "N090195_部材所要量.xls", type: "file" },
                ],
              },
            ],
          },
          {
            name: "010_部材使用量_分解_in",
            type: "folder",
            isOpen: false,
            children: [
              { name: "N90195_MRP.TXT", type: "file" },
              { name: "RLTF*B*_.txt", type: "file" },
            ],
          },
          {
            name: "011_部材使用量_分解_out",
            type: "folder",
          },
          {
            name: "100_部材使用量_品番別",
            type: "folder",
          },
        ],
      },
      {
        name: "01_PVSW_csv",
        type: "folder",
        popOver:
          "入手したPVSW.csvを入れます。生産準備+のPVSWインポートのターゲットフォルダです。インポート後は適当な名前のフォルダを付けて保存してください",
        isOpen: false,
        children: [{ name: "PVSW***.csv", type: "file" }],
      },
      {
        name: "05_RLTF_A",
        type: "folder",
        isOpen: false,
        popOver: "生準+からRLTF-Aを指定するのに使用します",
        children: [{ name: "RLTF17A*.txt", type: "file" }],
      },
      {
        name: "06_RLTF_B",
        type: "folder",
        isOpen: false,
        popOver: "生準+からRLTF-Bを指定するのに使用します",
        children: [{ name: "RLTF17B*.txt", type: "file" }],
      },
      {
        name: "07_SUB",
        type: "folder",
        popOver:
          "社内図のサブ形態で生産する時にSUBデータを入れます。通常は使用しません",
        children: [
          { name: "製品品番1-A01-SUB.csv", type: "file" },
          { name: "製品品番2-B02-SUB.csv", type: "file" },
          { name: "製品品番3-C03-SUB.csv", type: "file" },
        ],
      },
      {
        name: "08_hsfデータ変換",
        type: "folder",
        popOver: "ここに入手したMDデータを入れて変換します",
        children: [
          {
            name: "製品品番1_____A0011_MD_20240614200253",
            type: "folder",
            popOver: "入手したMDデータ",
            isOpen: false,
            children: [
              { name: "製品品番1_____A0011_5200comb.csv", type: "file" },
              { name: "製品品番1_____A0011_5201node.csv", type: "file" },
              { name: "製品品番1_____A0011_5202sgmt.csv", type: "file" },
              { name: "製品品番1_____A0011_5203size.csv", type: "file" },
              { name: "製品品番1_____A0011_5204tape.csv", type: "file" },
              { name: "製品品番1_____A0011_5205tube.csv", type: "file" },
              { name: "製品品番1_____A0011_5206shet.csv", type: "file" },
              { name: "製品品番1_____A0011_5207part.csv", type: "file" },
              { name: "製品品番1_____A0011_5208cnct.csv", type: "file" },
              { name: "製品品番1_____A0011_5209wire.csv", type: "file" },
              { name: "製品品番1_____A0011_5210cavi.csv", type: "file" },
              { name: "製品品番1_____A0011_5211nail.csv", type: "file" },
              { name: "製品品番1_____A0011_5213geom.csv", type: "file" },
              { name: "製品品番1_____A0011_5214subcnct.csv", type: "file" },
              { name: "製品品番1_____A0011_5215subwire.csv", type: "file" },
              { name: "製品品番1_____A0011_5216subpart.csv", type: "file" },
              { name: "製品品番1_____A0011_5217code.csv", type: "file" },
              {
                name: "製品品番1_____A0011_5218prd2code.csv",
                type: "file",
              },
              {
                name: "製品品番1_____A0011_5219id2figure.csv",
                type: "file",
              },
            ],
          },
          {
            name: "WH_DataConvert.exe",
            type: "file",
            popOver: "生産準備+で使えるようにする為に変換するファイル",
          },
          {
            name: "HsfDataConvert.ini",
            type: "file",
            popOver:
              "上記.exeの設定ファイルです。生産準備+を起動する度に書き換えられます",
          },
        ],
      },
      {
        name: "08_MD",
        type: "folder",
        children: [
          {
            name: "製品品番1_A01_MD",
            type: "folder",
            popOver: "変換後のMDデータ",
            isOpen: false,
            children: [
              { name: "000Info.csv", type: "file" },
              { name: "001Node.csv", type: "file" },
              { name: "002Sgmt.csv", type: "file" },
              { name: "003Tube.csv", type: "file" },
              { name: "004Term.csv", type: "file" },
              { name: "005Part.csv", type: "file" },
              { name: "006Cone.csv", type: "file" },
              { name: "007Wire.csv", type: "file" },
              { name: "008Cavi.csv", type: "file" },
              { name: "009Tape.csv", type: "file" },
              { name: "010ID.csv", type: "file" },
              { name: "011Fuze.csv", type: "file" },
              { name: "012Hugou.csv", type: "file" },
              { name: "013Figure.csv", type: "file" },
              { name: "014Hinban.csv", type: "file" },
              { name: "015JB.csv", type: "file" },
              { name: "021TubeS.csv", type: "file" },
              { name: "022PartS.csv", type: "file" },
              { name: "023TapeS.csv", type: "file" },
              { name: "024Gromet.csv", type: "file" },
              { name: "050PartInWire.csv", type: "file" },
              { name: "0100Work40.csv", type: "file" },
              { name: "0101Work50.csv", type: "file" },
              { name: "0102Work60.csv", type: "file" },
            ],
          },
          {
            name: "製品品番2_B02_MD",
            type: "folder",
            isOpen: false,
            children: [
              { name: "000Info.csv", type: "file" },
              { name: "001Node.csv", type: "file" },
              { name: "002Sgmt.csv", type: "file" },
              { name: "003Tube.csv", type: "file" },
              { name: "004Term.csv", type: "file" },
              { name: "005Part.csv", type: "file" },
              { name: "006Cone.csv", type: "file" },
              { name: "007Wire.csv", type: "file" },
              { name: "008Cavi.csv", type: "file" },
              { name: "009Tape.csv", type: "file" },
              { name: "010ID.csv", type: "file" },
              { name: "011Fuze.csv", type: "file" },
              { name: "012Hugou.csv", type: "file" },
              { name: "013Figure.csv", type: "file" },
              { name: "014Hinban.csv", type: "file" },
              { name: "015JB.csv", type: "file" },
              { name: "021TubeS.csv", type: "file" },
              { name: "022PartS.csv", type: "file" },
              { name: "023TapeS.csv", type: "file" },
              { name: "024Gromet.csv", type: "file" },
              { name: "050PartInWire.csv", type: "file" },
              { name: "0100Work40.csv", type: "file" },
              { name: "0101Work50.csv", type: "file" },
              { name: "0102Work60.csv", type: "file" },
            ],
          },
          {
            name: "製品品番3_C03_MD",
            type: "folder",
            isOpen: false,
            children: [
              { name: "000Info.csv", type: "file" },
              { name: "001Node.csv", type: "file" },
              { name: "002Sgmt.csv", type: "file" },
              { name: "003Tube.csv", type: "file" },
              { name: "004Term.csv", type: "file" },
              { name: "005Part.csv", type: "file" },
              { name: "006Cone.csv", type: "file" },
              { name: "007Wire.csv", type: "file" },
              { name: "008Cavi.csv", type: "file" },
              { name: "009Tape.csv", type: "file" },
              { name: "010ID.csv", type: "file" },
              { name: "011Fuze.csv", type: "file" },
              { name: "012Hugou.csv", type: "file" },
              { name: "013Figure.csv", type: "file" },
              { name: "014Hinban.csv", type: "file" },
              { name: "015JB.csv", type: "file" },
              { name: "021TubeS.csv", type: "file" },
              { name: "022PartS.csv", type: "file" },
              { name: "023TapeS.csv", type: "file" },
              { name: "024Gromet.csv", type: "file" },
              { name: "050PartInWire.csv", type: "file" },
              { name: "0100Work40.csv", type: "file" },
              { name: "0101Work50.csv", type: "file" },
              { name: "0102Work60.csv", type: "file" },
            ],
          },
        ],
      },
      {
        name: "09_AutoSub",
        type: "folder",
        popOver: "生産準備+が提案したサブ形態",
        isOpen: false,
        children: [
          { name: "製品品番1_term.txt", type: "file" },
          { name: "製品品番1_wire.txt", type: "file" },
          { name: "製品品番1_wiresum.txt", type: "file" },
        ],
      },
    ],
  };
  return (
    <>
      {isClient && (
        <Frame sections={sections} sectionRefs={sectionRefs}>
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
              プログラミング解説
            </Heading>
            <CustomBadge text="生準+" />
            <CustomBadge text="開発" />
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
                コードを書ける人なら誰でも更新出来る形を目指して更新しています。
                最終的には自分が離れても維持/更新が出来る仕組みを作るのが目標です。
              </Text>
            </Box>
          </SectionBox>
          <SectionBox
            id="section2"
            title="2.コーディングスタイルガイド"
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>コーディングは下記のルールで行います</Text>
            <Box m={3}>
              <Text as="span" fontWeight="bold" mr={2}>
                命名規則:
              </Text>
              <List spacing={4}>
                <ListItem>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon
                      as={CheckCircleIcon}
                      color="green.500"
                      mt={1}
                      mr={1.5}
                    />
                    boolean型はis,他は動詞(get,paint)から始める
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon
                      as={CheckCircleIcon}
                      color="green.500"
                      mt={1}
                      mr={1.5}
                    />
                    定数は全て大文字, 変数はキャメルケース(camelCase)
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon
                      as={CheckCircleIcon}
                      color="green.500"
                      mt={1}
                      mr={1.5}
                    />
                    JavaScriptが用意している関数名を出来るだけ真似る
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon
                      as={CheckCircleIcon}
                      color="green.500"
                      mt={1}
                      mr={1.5}
                    />
                    インデントは4スペース,全角スペースは使わない
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon
                      as={CheckCircleIcon}
                      color="green.500"
                      mt={1}
                      mr={1.5}
                    />
                    アップロード前にコンパイルを実行,option explicitは必須
                  </Flex>
                  <Text as="span" fontWeight="bold" mr={2}>
                    禁止:
                  </Text>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon as={FaBan} color="red.500" mt={1} mr={1.5} />
                    on error resume nextは使わない(EXCELの軽い破損で動作しない)
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon as={FaBan} color="red.500" mt={1} mr={1.5} />
                    SQL文は使わない(リモートでのデバッグが難しい)
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon as={FaBan} color="red.500" mt={1} mr={1.5} />
                    go toは使わない(予想外のエラーが発生しがち)
                  </Flex>
                </ListItem>
              </List>
            </Box>
          </SectionBox>
          <SectionBox
            id="section3"
            title="3.オブジェクト指向について"
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text display="inline">
              生準+では
              <UnderlinedTextWithDrawer
                text="オブジェクト指向"
                onOpen={() => handleOpen("オブジェクト指向")}
                isOpen={isOpen && activeDrawer === "オブジェクト指向"}
                onClose={handleClose}
                header="オブジェクト指向"
                children={
                  <Box>
                    <Icon as={FaObjectGroup} w="36px" h="36px" mb={2} />

                    <VStack spacing={4} align="start">
                      <Text>
                        オブジェクト指向プログラミングは、プログラムを「オブジェクト」という単位で考える方法です。
                      </Text>
                      <Divider />
                      <Text>
                        <strong>オブジェクト</strong>
                        とは、データ（プロパティ）とそのデータを操作するための関数（メソッド）をまとめたものです。
                      </Text>
                      <Text>
                        例えば、<strong>「ワイヤーハーネス」</strong>
                        というオブジェクトを考えてみましょう。
                      </Text>
                      <Box bg="gray.100" p={1} borderRadius="md">
                        <Text mb={1}>
                          <strong>プロパティ:</strong>
                          生産治具、コネクタ品番、電線色、電線サイズ、端子品番、付属部品など
                        </Text>
                        <Text>
                          <strong>メソッド:</strong> 端子挿入、配策など
                        </Text>
                      </Box>
                      <Text>
                        オブジェクト指向では、現実世界のものをプログラムで表現する事により設計がし易くなります。
                      </Text>
                      <Divider borderColor="gray.500" />
                      <Text>
                        例えば<strong>「ワイヤーハーネス」</strong>
                        クラスを使って、色やメーカーが異なる複数のオブジェクトを作成できます。
                      </Text>
                    </VStack>
                  </Box>
                }
              />
              をメインにしています。
            </Text>
            <Box m={3}>
              <Text fontWeight="400" my={4}>
                3-1.ExcelVBAでの実装方法
              </Text>
              <Text fontWeight="400" my={4}>
                以下はワイヤーハーネスのオブジェクトのイメージです。
              </Text>
              <FileSystemNode item={directoryData1} />
            </Box>
          </SectionBox>
          <SectionBox
            id="section4"
            title="4.ディレクトリ構造"
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>生産準備+に関係するファイルのディレクトリ構造です。</Text>
            <Box m={3}>
              <Text my={4}>4-1.専用ディレクトリ</Text>
              <FileSystemNode item={directoryData0} />

              <Text my={4}>4-2.外部ディレクトリ</Text>
              <Text my={4}>--そのうち追加--</Text>
            </Box>
          </SectionBox>
          <SectionBox
            id="section5"
            title="5.よく使うコード"
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>汎用性の高いコードをここにまとめていきます。</Text>
            <FileSystemNode item={directoryData2} />
          </SectionBox>
          <SectionBox
            id="section6"
            title="6.更新とアップロードの手順"
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>--そのうち追加--</Text>
          </SectionBox>
          <Box height="100vh"></Box>
        </Frame>
      )}
    </>
  );
};

export default BlogPage;
