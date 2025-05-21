"use client";

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
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaBan, FaObjectGroup } from "react-icons/fa";
import Content from "@/components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "@/components/ui/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/ui/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/ui/CustomBadge";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート

import { useUserContext } from "@/contexts/useUserContext";
import { useReadCount } from "@/hooks/useReadCount";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
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
  const { currentUserId, currentUserCompany } = useUserContext();
  const { readByCount } = useReadCount(currentUserId);
  const { language, setLanguage } = useLanguage();
  //右リストの読み込みをlanguage取得後にする
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  useEffect(() => {
    if (language) {
      setIsLanguageLoaded(true);
    }
  }, [language]);
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
  type FileSystemItem = {
    name: string;
    type: "folder" | "file"; // 'folder' または 'file' のみを許可する
    children?: FileSystemItem[];
    popOver?: string;
    isOpen?: boolean;
  };
  const directoryData2: FileSystemItem = {
    name: getMessage({
      ja: "良く使うコード",
      us: "Frequently Used Codes",
      cn: "常用代码",
      language,
    }),
    type: "folder",
    isOpen: true,
    children: [
      {
        name: getMessage({
          ja: "1次元配列の並び替え",
          us: "Sorting one-dimensional arrays",
          cn: "一维数组排序",
          language,
        }),
        type: "folder",
        isOpen: false,
        children: [
          {
            name: "Function sort1ary(arr_) As Variant",
            type: "file",
            popOver: getMessage({
              ja: "arr_は1次元配列,1,2,3,10,11,A,Bのような昇順で並び替える",
              us: "arr_ is a 1D array, sorted in ascending order as 1,2,3,10,11,A,B",
              cn: "arr_ 是一个一维数组，按升序排列为 1、2、3、10、11、A、B",
              language,
            }),
          },
        ],
      },
      {
        name: getMessage({
          ja: "部品品番の変換",
          us: "Conversion of part part numbers",
          cn: "零件编号的转换",
          language,
        }),

        type: "folder",
        isOpen: false,
        children: [
          {
            name: "Function convertYazakiNumber(str_ As String) As String",
            type: "file",
            popOver: getMessage({
              ja: "str_が7119-5555-30なら7119555530に変換.7119555530なら7119-5555-30に変換",
              us: "If str_ is 7119-5555-30, convert to 7119555530.If 7119555530, convert to 7119-5555-30",
              cn: "如果 str_ 是 7119-5555-30，转换为 7119555530.如果是 7119555530，转换为 7119-5555-30",
              language,
            }),
          },
        ],
      },
      {
        name: getMessage({
          ja: "1次元配列をUTF8でテキスト出力",
          us: "Text output of 1D array in UTF8",
          cn: "以 UTF8 编码输出一维数组文本",
          language,
        }),
        type: "folder",
        isOpen: false,
        children: [
          {
            name: "Sub exportText_UTF8(ary_() As String,path_ As String)",
            type: "file",
            popOver: getMessage({
              ja: "Excel-vbaの標準だとShift_JISでテキスト出力されて文字化けの原因になるからUTF8で出力.htmlとか.cssとかで使う",
              us: "Excel-vba's standard outputs text in Shift_JIS, which causes character corruption, so use UTF8 output .html or .css.",
              cn: "Excel-vba 标准以 Shift_JIS 输出文本，这会导致字符损坏，因此请使用 UTF8 输出 .html 或 .css。",
              language,
            }),
          },
        ],
      },
    ],
  };
  const directoryData1: FileSystemItem = {
    name: getMessage({
      ja: "ワイヤーハーネス(治具単位)",
      us: "Wire harnesses (jig unit)",
      cn: "线束（夹具单元）",
      language,
    }),
    type: "folder",
    isOpen: true,
    children: [
      {
        name: getMessage({
          ja: "エクセルvbaでは専用のライブラリも概念も無い為、classとcollectionを使ってオブジェクト指向を実現しています。以下はワイヤーハーネスのオブジェクトのイメージです。※これは省略した形で実際はもっと要素数が多いです。",
          us: "Since there are no dedicated libraries or concepts in Excel vba, classes and collections are used to achieve object orientation. Below is an image of a wire harness object. This is an abbreviated form and the actual number of elements is much larger.",
          cn: "由于 Excel vba 中没有专门的库或概念，因此使用类和集合来实现面向对象。下面是线束对象的图像。*这是一个缩写形式，实际上包含更多元素。",
          language,
        }),
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
            popOver: getMessage({
              ja: "製品品番の点数\n値:1\nInteger",
              us: "Number of points of product part number.\nValue:1\nInteger",
              cn: "产品部件号数量\n値:1\nInteger",
              language,
            }),
            isOpen: false,
          },
          {
            name: "item 1",
            type: "folder",
            isOpen: true,
            popOver: getMessage({
              ja: "製品品番の1点目\nproductクラス",
              us: "The first point of the product part number.\nclass: product",
              cn: "第一点是产品部件号\n类: 产品",
              language,
            }),
            children: [
              {
                name: "name",
                type: "file",
                popOver: getMessage({
                  ja: "製品品番\n値:82111A123     \nString",
                  us: "Product part number.\nValue:82111A123     \nString",
                  cn: "产品编号\n値:82111A123     \nString",
                  language,
                }),
              },
              {
                name: "RLTFA_designNum",
                type: "file",
                popOver: getMessage({
                  ja: "設変\n値:C00\nString",
                  us: "engineering change\nValue:C00\nString",
                  cn: "工程变更\n値:C00\nString",
                  language,
                }),
              },
              {
                name: "nickName",
                type: "file",
                popOver: getMessage({
                  ja: "呼称\n値:123\nString",
                  us: "designation\nValue:123\nString",
                  cn: "名称\n値:123\nString",
                  language,
                }),
              },
              {
                name: "cavTotalCount",
                type: "file",
                popOver: getMessage({
                  ja: "cavの合計数\n値:1042\nInteger",
                  us: "Total number of cav\nValue:1042\nInteger",
                  cn: "骑兵总数\n値:1042\nInteger",
                  language,
                }),
              },
              {
                name: "insertAfterCount",
                type: "file",
                popOver: getMessage({
                  ja: "後ハメ数の合計\n値:162\nInteger",
                  us: "Total number of insert after\nValue:162\nInteger",
                  cn: "后插入总数\n値:162\nInteger",
                  language,
                }),
              },
              {
                name: "terminals",
                type: "folder",
                isOpen: false,
                popOver: getMessage({
                  ja: "コネクタ端末\ncollection",
                  us: "Connector terminals.\ncollection",
                  cn: "连接器端子\ncollection",
                  language,
                }),
                children: [
                  {
                    name: "picturePath",
                    type: "file",
                    popOver: getMessage({
                      ja: "コネクタ写真のアドレス\n値:G:¥18_部材一覧¥201_写真¥7283-1018-40_1_001.png\nString",
                      us: "Connector photo address.\nValue:G:¥18_部材一覧¥201_写真¥7283-1018-40_1_001.png\nString",
                      cn: "连接照片地址\n値:G:¥18_部材一覧¥201_写真¥7283-1018-40_1_001.png\nString",
                      language,
                    }),
                  },
                  {
                    name: "number",
                    type: "file",
                    popOver: getMessage({
                      ja: "端末No\n値:6\nString",
                      us: "Terminal No\nValue:6\nString",
                      cn: "端子编号\n値:6\nString",
                      language,
                    }),
                  },
                  {
                    name: "subNumber",
                    type: "file",
                    popOver: getMessage({
                      ja: "サブNo\n値:GK4\nString",
                      us: "Sub No\nValue:GK4\nString",
                      cn: "子编号\n値:GK4\nString",
                      language,
                    }),
                  },
                  {
                    name: "Item 1",
                    type: "folder",
                    isOpen: false,
                    popOver: getMessage({
                      ja: "1つ目の端末\nterminalクラス",
                      us: "First terminal\nterminal class",
                      cn: "第一个端子\nterminal类",
                      language,
                    }),
                    children: [
                      {
                        name: "Holes",
                        type: "folder",
                        isOpen: false,
                        popOver: getMessage({
                          ja: "端末の穴\ncollection",
                          us: "Holes of terminal\ncollection",
                          cn: "端子的孔\ncollection",
                          language,
                        }),
                        children: [
                          {
                            name: "Item 1",
                            type: "folder",
                            isOpen: false,
                            children: [
                              {
                                name: "shapeType",
                                type: "file",
                                popOver: getMessage({
                                  ja: "穴の形状\n値:Cir\nString",
                                  us: "Shape of hole\nValue:Cir\nString",
                                  cn: "孔的形状\n値:Cir\nString",
                                  language,
                                }),
                              },
                              {
                                name: "point",
                                type: "file",
                                popOver: getMessage({
                                  ja: "導通検査のポイントナンバー\n値:1014\nString",
                                  us: "Point number for continuity test\nValue:1014\nString",
                                  cn: "导通测试的点号\n値:1014\nString",
                                  language,
                                }),
                              },
                              {
                                name: "xLeft",
                                type: "file",
                                popOver: getMessage({
                                  ja: "コネクタ写真に対しての穴の左位置\n値:77\nString",
                                  us: "Left position of hole relative to connector photo\nValue:77\nString",
                                  cn: "相对于连接器照片的孔的左侧位置\n値:77\nString",
                                  language,
                                }),
                              },
                              {
                                name: "wires",
                                type: "folder",
                                isOpen: false,
                                popOver: getMessage({
                                  ja: "電線\ncollection",
                                  us: "Wires\ncollection",
                                  cn: "电线\ncollection",
                                  language,
                                }),
                                children: [
                                  {
                                    name: "Item 1",
                                    type: "folder",
                                    isOpen: false,
                                    children: [
                                      {
                                        name: "color",
                                        type: "file",
                                        popOver: getMessage({
                                          ja: "電線の色番号\n値:70\nString",
                                          us: "Color number of wire\nValue:70\nString",
                                          cn: "电线的颜色编号\n値:70\nString",
                                          language,
                                        }),
                                      },
                                      {
                                        name: "colorCode",
                                        type: "file",
                                        popOver: getMessage({
                                          ja: "電線の色呼称\n値:Y\nString",
                                          us: "Color code of wire\nValue:Y\nString",
                                          cn: "电线的颜色代码\n値:Y\nString",
                                          language,
                                        }),
                                      },
                                      {
                                        name: "wireSize",
                                        type: "file",
                                        popOver: getMessage({
                                          ja: "電線のサイズ呼称\n値:039\nString",
                                          us: "Size designation of wire\nValue:039\nString",
                                          cn: "电线的尺寸名称\n値:039\nString",
                                          language,
                                        }),
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
    name: getMessage({
      ja: "Sjp*.xlsmがあるフォルダ",
      us: "Folder with Sjp*.xlsm",
      cn: "带 Sjp*.xlsm 的文件夹",
      language,
    }),
    type: "folder",
    children: [
      {
        name: "00_temp",
        type: "folder",
        isOpen: false,
        popOver: getMessage({
          ja: "入手したRLTF-AとRLTF-Bを分解する為には、その2ファイルのみをここに入れます",
          us: "To disassemble the RLTF-A and RLTF-B files you have obtained, put only those two files here",
          cn: "要反汇编您获得的 RLTF-A 和 RLTF-B，只需将这两个文件放在此处",
          language,
        }),
        children: [
          {
            name: "001_テキストデータ",
            type: "folder",
            isOpen: false,
            popOver: getMessage({
              ja: "分解元のデータ\nこれは開発者の確認用で通常は使用しません\n※単線分析リクエストの管理No.毎に保存されます",
              us: "Data from the decomposition source,\nThis is for developer confirmation only and is not normally used,\n※It is stored for each control No. of single line analysis request.",
              cn: "来自分解源的数据，\n这是供开发人员确认的。通常不使用。\n※它为每个单线分析请求控制号存储。",
              language,
            }),
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
            popOver: getMessage({
              ja: "分解したデータ\nこれは古い生産準備+で使用していたデータで通常は使用しません",
              us: "Disassembled data \nThis is the data used in the old Production Preparation+ and is not normally used.",
              cn: "拆解数据。该数据用于旧的生产就绪+，通常不使用",
              language,
            }),
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
        popOver: getMessage({
          ja: "入手したPVSW.csvを入れます。生産準備+のPVSWインポートのターゲットフォルダです。インポート後は適当な名前のフォルダを付けて保存してください",
          us: "Put the PVSW.csv you obtained. This is the target folder for PVSW import in Production Preparation+. After importing, save the file with an appropriately named folder.",
          cn: "插入获得的 PVSW.csv。在生产准备+ 中导入 PVSW 的目标文件夹。导入后，请将文件保存到适当命名的文件夹中",
          language,
        }),
        isOpen: false,
        children: [{ name: "PVSW***.csv", type: "file" }],
      },
      {
        name: "05_RLTF_A",
        type: "folder",
        isOpen: false,
        popOver: getMessage({
          ja: "生産準備+からRLTF-Aを指定するのに使用します",
          us: "Used to specify RLTF-A from Production Ready+.",
          cn: "用于从 生产准备+ 指定 RLTF-A。",
          language,
        }),
        children: [{ name: "RLTF17A*.txt", type: "file" }],
      },
      {
        name: "06_RLTF_B",
        type: "folder",
        isOpen: false,
        popOver: getMessage({
          ja: "生産準備+からRLTF-Bを指定するのに使用します",
          us: "Used to specify RLTF-B from Production Ready+.",
          cn: "用于从 生产准备+ 指定 RLTF-B。",
          language,
        }),
        children: [{ name: "RLTF17B*.txt", type: "file" }],
      },
      {
        name: "07_SUB",
        type: "folder",
        popOver: getMessage({
          ja: "社内図のサブ形態を利用する時にSUBデータを入れます。通常は使用しません",
          us: "SUB data is put in when using a sub-form of an internal chart. Normally not used",
          cn: "使用内部图表的子表格时会包含 SUB 数据。通常不使用",
          language,
        }),
        children: [
          { name: "製品品番1-A01-SUB.csv", type: "file" },
          { name: "製品品番2-B02-SUB.csv", type: "file" },
          { name: "製品品番3-C03-SUB.csv", type: "file" },
        ],
      },
      {
        name: "08_hsfデータ変換",
        type: "folder",
        popOver: getMessage({
          ja: "ここに入手したMDデータを入れて変換します",
          us: "Put the obtained MD data here and convert it.",
          cn: "将获得的 MD 数据放在这里并进行转换。",
          language,
        }),
        children: [
          {
            name: "製品品番1_____A0011_MD_20240614200253",
            type: "folder",
            popOver: getMessage({
              ja: "入手したMDデータ",
              us: "MD data obtained",
              cn: "获得 MD 数据。",
              language,
            }),
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
            popOver: getMessage({
              ja: "生産準備+で使えるように変換するプログラム",
              us: "Program to convert for use in Production Preparation+.",
              cn: "转换用于生产准备的方案+。",
              language,
            }),
          },
          {
            name: "HsfDataConvert.ini",
            type: "file",
            popOver: getMessage({
              ja: "上記.exeの設定ファイルです。生産準備+を起動する度に自動で書き換えられます",
              us: "This is the configuration file for the above .exe. It is automatically rewritten each time Production Preparation+ is started.",
              cn: "上述 .exe 的配置文件。每次启动 Production Preparation+ 时，该文件都会自动重写。",
              language,
            }),
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
            popOver: getMessage({
              ja: "変換後のMDデータ",
              us: "MD data after conversion",
              cn: "转换后的 MD 数据",
              language,
            }),
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
        popOver: getMessage({
          ja: "生産準備+が提案したサブ形態",
          us: "Sub-forms proposed by Production Preparation+.",
          cn: "生产准备+提出的子表格。",
          language,
        }),
        isOpen: false,
        children: [
          { name: "製品品番1_term.txt", type: "file" },
          { name: "製品品番1_wire.txt", type: "file" },
          { name: "製品品番1_wiresum.txt", type: "file" },
        ],
      },
    ],
  };
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
    return <div>Loading...</div>; // 言語がロードされるまでのプレースホルダー
  }
  return (
    <>
      {isClient && (
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
              <Text>
                {getMessage({
                  ja: "開発",
                  language,
                })}
              </Text>
              <Spacer />
              <Flex justifyContent="flex-end">
                <Text>
                  <Icon as={CustomIcon} mr={0} />
                  {readByCount}
                </Text>
              </Flex>
            </HStack>
            <Heading fontSize="3xl" mb={1}>
              {getMessage({
                ja: "プログラムの解説",
                us: "Program Description",
                cn: "计划说明",
                language,
              })}
            </Heading>
            <CustomBadge
              text={getMessage({
                ja: "生準+",
                language,
              })}
            />
            <CustomBadge
              text={getMessage({
                ja: "開発",
                language,
              })}
            />
            <Text
              fontSize="sm"
              color={colorMode === "light" ? "gray.800" : "white"}
              mt={1}
            >
              {getMessage({ ja: "更新日", language })}
              :2024-11-17
            </Text>
          </Box>
          <SectionBox
            id="section1"
            title={
              "1." +
              getMessage({
                ja: "はじめに",
                language,
              })
            }
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
                {getMessage({
                  ja: "コードを書ける人なら誰でも更新出来る形を目指して更新しています。最終的目標は自分が離れても維持/更新が出来る仕組みを作る事です。",
                  us: "I am updating the site in a way that anyone who can write code can update it. The ultimate goal is to create a system that can be maintained/updated even after I leave.",
                  cn: "我更新它的方式是，任何会写代码的人都可以更新它。最终目标是创建一个即使我离开后也能维护/更新的系统。",
                  language,
                })}
              </Text>
            </Box>
          </SectionBox>
          <SectionBox
            id="section2"
            title={
              "2." +
              getMessage({
                ja: "コーディングスタイルガイド",
                us: "Coding Style Guide",
                cn: "编码风格指南",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "コーディングは下記のルールで行います",
                us: "Coding is done according to the following rules",
                cn: "编码基于以下规则",
                language,
              })}
            </Text>
            <Box m={3}>
              <Text as="span" fontWeight="bold" mr={2}>
                {getMessage({
                  ja: "命名規則",
                  us: "Naming Rules",
                  cn: "命名規則",
                  language,
                }) + ":"}
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
                    {getMessage({
                      ja: "boolean型はis,他は動詞(get,paint)から始める",
                      us: "Start with is for boolean types, verbs (get, paint) for others",
                      cn: "布尔类型是，其他类型以动词开头（get、paint）。",
                      language,
                    })}
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon
                      as={CheckCircleIcon}
                      color="green.500"
                      mt={1}
                      mr={1.5}
                    />
                    {getMessage({
                      ja: "定数は全て大文字, 変数はキャメルケース(camelCase)",
                      us: "Constants are all uppercase, variables are camelCase",
                      cn: "常量均为大写，变量为驼峰字体",
                      language,
                    })}
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon
                      as={CheckCircleIcon}
                      color="green.500"
                      mt={1}
                      mr={1.5}
                    />
                    {getMessage({
                      ja: "JavaScriptが用意している関数名を出来るだけ真似る",
                      us: "Mimic the function names provided by JavaScript as much as possible.",
                      cn: "尽可能模仿 JavaScript 提供的函数名称。",
                      language,
                    })}
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon
                      as={CheckCircleIcon}
                      color="green.500"
                      mt={1}
                      mr={1.5}
                    />
                    {getMessage({
                      ja: "インデントは4スペース,全角スペースは使わない",
                      us: "Indent 4 spaces, no full-width spaces",
                      cn: "缩进 4 个空格，没有全宽空格。",
                      language,
                    })}
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon
                      as={CheckCircleIcon}
                      color="green.500"
                      mt={1}
                      mr={1.5}
                    />
                    {getMessage({
                      ja: "アップロード前にコンパイルを実行,option explicitは必須",
                      us: "Compile before uploading,option explicit is required",
                      cn: "上传前编译，需要 option explicit",
                      language,
                    })}
                  </Flex>
                  <Text as="span" fontWeight="bold" mr={2}>
                    {getMessage({
                      ja: "禁止",
                      us: "prohibition",
                      cn: "禁令",
                      language,
                    }) + ":"}
                  </Text>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon as={FaBan} color="red.500" mt={1} mr={1.5} />
                    {getMessage({
                      ja: "on error resume nextは使わない(EXCELの軽い破損で動作しない)",
                      us: "on error resume next is not used (does not work with EXCEL light corruption).",
                      cn: "在出错时恢复下一个不使用（在 EXCEL 轻度损坏时不起作用）。",
                      language,
                    })}
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon as={FaBan} color="red.500" mt={1} mr={1.5} />
                    {getMessage({
                      ja: "SQL文は使わない(リモートでのデバッグが難しい)",
                      us: "SQL statements are not used (difficult to debug remotely)",
                      cn: "不使用 SQL 语句（难以远程调试）。",
                      language,
                    })}
                  </Flex>
                  <Flex alignItems="flex-start" my={2}>
                    <ListIcon as={FaBan} color="red.500" mt={1} mr={1.5} />
                    {getMessage({
                      ja: "go toは使わない(予想外のエラーが発生しがち)",
                      us: "Do not use go to (tends to cause unexpected errors)",
                      cn: "不要使用 go to（容易导致意外错误）。",
                      language,
                    })}
                  </Flex>
                </ListItem>
              </List>
            </Box>
          </SectionBox>
          <SectionBox
            id="section3"
            title={
              "3." +
              getMessage({
                ja: "オブジェクト指向について",
                us: "About Object Oriented",
                cn: "关于面向对象",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text display="inline">
              {getMessage({
                ja: "生産準備+",
                language,
              })}
              {getMessage({
                ja: "では",
                us: "will consist mainly of",
                cn: "主要包括",
                language,
              })}
              <UnderlinedTextWithDrawer
                text={getMessage({
                  ja: " オブジェクト指向 ",
                  us: " object-oriented ",
                  cn: " 面向对象 ",
                  language,
                })}
                onOpen={() => handleOpen("オブジェクト指向")}
                isOpen={isOpen && activeDrawer === "オブジェクト指向"}
                onClose={handleClose}
                header={getMessage({
                  ja: "オブジェクト指向",
                  us: " object-oriented ",
                  cn: "面向对象",
                  language,
                })}
                children={
                  <Box>
                    <Icon as={FaObjectGroup} w="36px" h="36px" mb={2} />

                    <VStack spacing={4} align="start">
                      <Text>
                        {getMessage({
                          ja: "オブジェクト指向プログラミングは、プログラムを「オブジェクト」という単位で考える方法です。",
                          us: "Object-oriented programming is a way of thinking of programs in terms of units called [objects].",
                          cn: "面向对象编程是一种以称为 「对象」的单元来思考程序的方法。",
                          language,
                        })}
                      </Text>
                      <Divider />
                      <Text>
                        <strong>
                          {getMessage({
                            ja: "オブジェクト",
                            us: "Object ",
                            cn: "对象 ",
                            language,
                          })}
                        </strong>
                        {getMessage({
                          ja: "とは、データ（プロパティ）とそのデータを操作するための関数（メソッド）をまとめたものです。",
                          us: "is a collection of data (properties) and functions (methods) to manipulate that data.",
                          cn: "是数据（属性）和操作数据的函数（方法）的集合。",
                          language,
                        })}
                      </Text>
                      <Text>
                        {getMessage({
                          ja: "例えば、",
                          us: "For example,",
                          cn: "例如 ",
                          language,
                        })}
                        <strong>
                          {getMessage({
                            ja: "「ワイヤーハーネス」",
                            us: " [Wire harnesses] ",
                            cn: "[线束]",
                            language,
                          })}
                        </strong>
                        {getMessage({
                          ja: "というオブジェクトを考えてみましょう。",
                          us: "Consider an object called",
                          cn: "考虑一个名为",
                          language,
                        })}
                      </Text>
                      <Box bg="gray.100" p={1} borderRadius="md">
                        <Text mb={1}>
                          <strong>
                            {getMessage({
                              ja: "プロパティ",
                              us: "property",
                              cn: "财产",
                              language,
                            })}
                            :
                          </strong>
                          {getMessage({
                            ja: "生産治具、コネクタ品番、電線色、電線サイズ、端子品番、付属部品など",
                            us: "Production jigs, connector part numbers, wire colors, wire sizes, terminal part numbers, accessory parts, etc.",
                            cn: "生产夹具、连接器零件编号、导线颜色、导线尺寸、端子零件编号、附件零件等。",
                            language,
                          })}
                        </Text>
                        <Text>
                          <strong>
                            {getMessage({
                              ja: "メソッド",
                              us: "method",
                              cn: "方法",
                              language,
                            })}
                            :
                          </strong>
                          {getMessage({
                            ja: "端子挿入、配策など",
                            us: "Terminal insertion, distribution, etc.",
                            cn: "端子插入、分配等",
                            language,
                          })}
                        </Text>
                      </Box>
                      <Text>
                        {getMessage({
                          ja: "オブジェクト指向では、現実世界のものをプログラムで表現する事により設計がし易くなります。",
                          us: "Object-oriented design facilitates design by allowing programs to represent things in the real world.",
                          cn: "面向对象技术通过在程序中表示真实世界的对象来促进设计。",
                          language,
                        })}
                      </Text>
                    </VStack>
                  </Box>
                }
              />
              {getMessage({
                ja: "と関数型をメインで作成しています。",
                us: "and functional types",
                cn: "和功能类型。",
                language,
              })}
            </Text>
            <Box m={3}>
              <Text fontWeight="400" my={4}>
                3-1.
                {getMessage({
                  ja: "ExcelVBAでの実装方法",
                  us: "How to implement in ExcelVBA",
                  cn: "如何在 ExcelVBA 中实施",
                  language,
                })}
              </Text>
              <Text fontWeight="400" my={4}>
                {getMessage({
                  ja: "以下はワイヤーハーネスのオブジェクトのイメージです。",
                  us: "Below is an image of a wiring harness object.",
                  cn: "下面是一个线束物体的图像。",
                  language,
                })}
              </Text>
              <FileSystemNode item={directoryData1} />
            </Box>
          </SectionBox>
          <SectionBox
            id="section4"
            title={
              "4." +
              getMessage({
                ja: "ディレクトリ構造",
                us: "directory structure",
                cn: "目录结构",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "生産準備+に関係するファイルのディレクトリ構造です。",
                us: "Directory structure of files related to production preparation+.",
                cn: "与生产准备相关的文件目录结构+。",
                language,
              })}
            </Text>
            <Box m={3}>
              <Text my={4}>
                4-1.
                {getMessage({
                  ja: "専用ディレクトリ",
                  us: "dedicated directory",
                  cn: "专用目录",
                  language,
                })}
              </Text>
              <FileSystemNode item={directoryData0} />
              <Text my={4}>
                4-2.
                {getMessage({
                  ja: "外部ディレクトリ",
                  us: "external directory",
                  cn: "外部目录",
                  language,
                })}
              </Text>
              <Text my={4}>
                {getMessage({
                  ja: "--そのうち追加--",
                  us: "--Sooner or later, add--",
                  cn: "--迟早要加--",
                  language,
                })}
              </Text>
            </Box>
          </SectionBox>
          <SectionBox
            id="section5"
            title={
              "5." +
              getMessage({
                ja: "よく使うコード",
                us: "Frequently used codes",
                cn: "常用代码",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "汎用性の高いコードをここにまとめていきます。",
                us: "We will summarize the versatile codes here.",
                cn: "这里总结了最通用的代码。",
                language,
              })}
            </Text>
            <FileSystemNode item={directoryData2} />
          </SectionBox>
          <SectionBox
            id="section6"
            title={
              "6." +
              getMessage({
                ja: "更新とアップロードの手順",
                us: "Update and Upload Procedures",
                cn: "更新和上传程序",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "--そのうち追加--",
                us: "--Sooner or later, add--",
                cn: "--迟早要加--",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section7"
            title={
              "7." +
              getMessage({
                ja: "まとめ",
                language,
              })
            }
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
          <Box h="10vh" />
        </Frame>
      )}
    </>
  );
};

export default BlogPage;
