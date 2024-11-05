import React, { useEffect, useState } from "react";
import Content from "../../components/content";
import {
  Image,
  Text,
  Box,
  Badge,
  Kbd,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  List,
  ListItem,
  ListIcon,
  Center,
  Flex,
  Avatar,
  Link,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート

import AwesomIcon from "../../components/awesomIcon";
import { FaGithub } from "react-icons/fa"; // react-iconsからGitHubアイコンをインポート
import styles from "../../styles/home.module.scss";
import Sidebar from "../../components/sidebar"; // Sidebar コンポーネントをインポート

import ModalWork from "../../components/modalWork";
import ImageCard from "../../components/imageCard";
import SkillCircle from "../../components/skillCircle";
import SkillGraph from "../../components/sillGraph";

import Detail01 from "../../components/worksDetail/01";
import Detail01talk from "../../components/worksDetail/01_talk";
import Detail02 from "../../components/worksDetail/02";
import Detail02talk from "../../components/worksDetail/02_talk";
import Detail03 from "../../components/worksDetail/03";

export default function About() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null; // クライアントサイドでのみレンダリング
  }
  function CustomAccordion({
    title,
    children,
    badges,
    colorScheme,
    variant,
  }: {
    title: string;
    children: React.ReactNode;
    badges?: string[];
    colorScheme?: string;
    variant?: string;
  }) {
    return (
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {title}
            </Box>
            {badges &&
              badges.map((badge, index) => {
                let colorScheme = "gray";
                let variant = "subtle";

                // バッジの値に応じて色とバリアントを設定
                switch (badge) {
                  case "開発者":
                    colorScheme = "red";
                    variant = "outline";
                    break;
                  case "使用者":
                    colorScheme = "gray";
                    variant = "solid";
                    break;
                  case "作業者":
                    colorScheme = "green";
                    variant = "solid";
                    break;
                  // 他のケースを追加可能
                  default:
                    break;
                }

                return (
                  <Badge
                    key={index}
                    colorScheme={colorScheme}
                    variant={variant}
                    mr={2}
                  >
                    {badge}
                  </Badge>
                );
              })}
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Box>{children}</Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }
  type FileSystemItem = {
    name: string;
    type: "folder" | "file"; // 'folder' または 'file' のみを許可する
    children?: FileSystemItem[];
    popOver?: string;
    isOpen?: boolean;
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
              "分解したデータ\nこれは古い生産準備+で使用していたもので通常は使用しません",
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
  const directoryData1: FileSystemItem = {
    name: "エクセルvbaでオブジェクト指向",
    type: "folder",
    isOpen: true,
    children: [
      {
        name: "エクセルvbaでは専用のライブラリも概念も無い為、classとcollectionを使ってオブジェクト指向を実現しています\n以下はワイヤーハーネスのオブジェクトのイメージです\n※実際はもっと要素数が多いですが分かりやすく製品品番も1点としてシンプルにしています\n配列では無くオブジェクト指向にする事で柔軟性が向上します\n近年ではオブジェクト指向はデバッグがしづらい点が懸念されていますがその場合は関数型を採用しています",
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
  const skillCards = [
    {
      title: "生産準備+",
      subTitle: "画像を自動で作る",
      eyeCatchPath: "/images/sjp_menu.png",
      detail: <Detail01 />,
      detailTalk: <Detail01talk />,
      rate: 5,
      users: 341,
      skillTags: [
        {
          skillName: "EXCEL",
          skillColor: "green",
        },
      ],
      titleTalk: "詳細(茶番劇1話)を見る",
    },
    {
      title: "導通検査+",
      subTitle: "WEB技術の基礎",
      eyeCatchPath: "/images/sjp_kensarireki_YCC.png",
      detail: <Detail02 />,
      detailTalk: <Detail02talk />,
      rate: 5,
      users: 120,
      skillTags: [
        {
          skillName: "EXCEL",
          skillColor: "green",
        },
        {
          skillName: "HTML",
          skillColor: "orange",
        },
        {
          skillName: "CSS",
          skillColor: "blue",
        },
        {
          skillName: "JavaScript",
          skillColor: "yellow",
        },
      ],
      titleTalk: "詳細(茶番劇2話)を見る",
    },
    {
      title: "作業誘導+",
      subTitle: "マイコン",
      eyeCatchPath: "/images/detail_03_title.png",
      detail: <Detail03 />,
      detailTalk: <Center>Comming soon. maybe</Center>,
      rate: 5,
      users: 8,
      skillTags: [
        {
          skillName: "EXCEL",
          skillColor: "green",
        },
        {
          skillName: "HTML",
          skillColor: "orange",
        },
        {
          skillName: "CSS",
          skillColor: "blue",
        },
        {
          skillName: "JavaScript",
          skillColor: "yellow",
        },
        {
          skillName: "VB.net",
          skillColor: "purple",
        },
        {
          skillName: "Arduino",
          skillColor: "teal",
        },
      ],
      titleTalk: "詳細(茶番劇3話)を見る",
    },
  ];
  const skillCircles = [
    {
      value: 90,
      cirText: "EXCEL-vba\nアプリ制御など\n15年",
      color: "excel",
      img: "/images/logo_excel.svg",
    },
    {
      value: 65,
      cirText: "ACCESS-vba\n部品管理\n3年",
      color: "excel",
      img: "/images/logo_access.svg",
    },
    {
      value: 30,
      cirText: "vb.net\nシリアル通信\nカメラ制御\n半年",
      color: "dotNet",
      img: "/images/logo_dotNet.svg",
    },
    {
      value: 60,
      cirText: "HTML\n基本的な使い方\n4年",
      color: "front",
      img: "/images/logo_html5.svg",
    },
    {
      value: 65,
      cirText: "CSS\n基本的な使い方\n+SCSS\n4年",
      color: "front",
      img: "/images/logo_css.svg",
    },
    {
      value: 40,
      cirText: "JavaScript\n4年",
      color: "front",
      img: "/images/logo_javascript.svg",
    },
    {
      value: 40,
      cirText: "Next\nこのサイトで利用\n1年",
      color: "front",
      img: "/images/logo_next.svg",
    },
    {
      value: 30,
      cirText: "PHP\n半年",
      color: "php",
      img: "/images/logo_php.svg",
    },
    {
      value: 20,
      cirText: "Python\n少しだけ",
      color: "php",
      img: "/images/logo_python.svg",
    },
    {
      value: 60,
      cirText: "Arduino\n2年",
      color: "arduino",
      img: "/images/logo_arduino.svg",
    },
    {
      value: 30,
      cirText: "Davinci Resolve\n半年",
      color: "davinci",
      img: "/images/logo_davinci.svg",
    },
    {
      value: 30,
      cirText: "InkScape\n1年",
      color: "inkscape",
      img: "/images/logo_inkscape.svg",
    },
  ];
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <div
          className={styles.me}
          style={{ fontFamily: "Noto Sans JP", whiteSpace: "pre-line" }}
        >
          <Box textAlign="center" mb={8}>
            <Text fontSize="xl" colorScheme="black" mb={8}>
              プログラムの更新について
            </Text>
            <Text fontSize="sm" colorScheme="black">
              プログラムを誰でも編集出来るようにする事を目指して以下に編集のポイントを記載していきます
              <br />
              過去の失敗を元に追記していきます
            </Text>
          </Box>
          <CustomAccordion
            title="自己紹介"
            badges={["開発者", "使用者", "作業者"]}
          >
            <Flex alignItems="center" mb={4} justifyContent="center">
              <Text fontSize={[16, 18, 20, 24]} className={styles.name} mb={4}>
                Teppei Kataoka
              </Text>
              <Avatar
                className={styles.pic}
                src="/images/me.jpeg"
                objectFit="cover"
                width={16}
                height={16}
              />
            </Flex>
            <Flex justifyContent="center">
              <Text
                w={["100%", "95%", "85%", "75%"]}
                fontFamily="Noto Sans JP"
                mb={20}
              >
                高知出身。
                自動車のワイヤーハーネス製造/機械保全/生産計画/生産分析を経験。現場の問題改善を繰り返す内にITや電子工学技術に興味を持つ。
                EXCEL/ACCESSのソフトウェアからPLC/Arduinoなどのハードウェアを経験。それらをHTML/JavaScript/PHPで連携させる仕組みを作ったりします。
                現場の使用者と相談しながら更に発展させていくのが好きです。カバも好き。プログラミングは嫌い。
              </Text>
            </Flex>
            <div data-aos="fade-right" style={{ display: "inline-block" }}>
              <Text className={styles.subTitle}>スキル</Text>
            </div>
            <Flex justifyContent="center">
              <SkillGraph />
            </Flex>

            <Box style={{ textAlign: "center" }} mb={20}>
              {skillCircles.map((item, index) => {
                const aosOffset: number = (index % 5) * 70;
                return (
                  <Flex
                    key={index}
                    data-aos="fade-up"
                    data-aos-offset={aosOffset}
                    style={{ display: "inline-block" }}
                  >
                    <SkillCircle
                      value={item.value}
                      cirText={item.cirText}
                      color={item.color}
                      timing={index}
                      img={item.img}
                    />
                  </Flex>
                );
              })}
            </Box>
            <Flex justifyContent="center">
              <Text mb={40}>
                以上の技術は教える事も可能なのでご気軽にお問い合わせください
              </Text>
            </Flex>
          </CustomAccordion>
          <CustomAccordion
            title="業務改善の進め方の例"
            badges={["開発者", "使用者", "作業者"]}
          >
            <Box style={{ textAlign: "center" }} className={styles.cardList}>
              <Text>
                過去の活動をまとめてみました
                <br />
                娘は居ません。実際のやりとりをデフォルメしています
              </Text>
              {skillCards.map((item, index) => {
                return (
                  <Box display={"inline-block"} key={index}>
                    <ModalWork title={item.title} detail={item.detail} m={0}>
                      <ImageCard
                        title={item.title}
                        subTitle={item.subTitle}
                        eyeCatchPath={item.eyeCatchPath}
                        rate={item.rate}
                        users={item.users}
                        skillTags={item.skillTags}
                      />
                    </ModalWork>
                    <ModalWork title={item.title} detail={item.detailTalk}>
                      <Box className={styles.balloon} boxShadow="md">
                        {item.titleTalk}
                      </Box>
                    </ModalWork>
                  </Box>
                );
              })}
            </Box>
          </CustomAccordion>
          <CustomAccordion
            title="コーディングスタイルガイド"
            badges={["開発者"]}
          >
            <Box p={8} maxWidth="800px" mx="auto">
              <List spacing={4}>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  <Text as="span" fontWeight="bold" mr={2}>
                    命名規則:
                  </Text>
                  定数は全て大文字, 変数はキャメルケース(camelCase)
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  <Text as="span" fontWeight="bold" mr={2}>
                    命名規則:
                  </Text>
                  boolean型はis,他は動詞(get,paint)から始める
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  <Text as="span" fontWeight="bold" mr={2}>
                    命名規則:
                  </Text>
                  JavaScriptが用意している関数名を出来るだけ真似る
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  <Text as="span" fontWeight="bold" mr={2}>
                    インデントとスペース:
                  </Text>
                  インデントは4スペース,全角スペースは使わない
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  <Text as="span" fontWeight="bold" mr={2}>
                    アップロード:
                  </Text>
                  アップロード前にコンパイルを実行,option explicitは必須
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  <Text as="span" fontWeight="bold" mr={2}>
                    バージョン管理:
                  </Text>
                  開発者が増えた場合はGitHubの使用を検討
                </ListItem>
                <ListItem>
                  <ListIcon as={WarningTwoIcon} color="red.500" />
                  <Text as="span" fontWeight="bold" mr={2}>
                    禁止:
                  </Text>
                  on error resume nextは使わない(EXCELの軽い破損で止まる)
                </ListItem>
                <ListItem>
                  <ListIcon as={WarningTwoIcon} color="red.500" />
                  <Text as="span" fontWeight="bold" mr={2}>
                    禁止:
                  </Text>
                  SQL文は使わない(リモートでのデバッグが難しい)
                </ListItem>
                <ListItem>
                  <ListIcon as={WarningTwoIcon} color="red.500" />
                  <Text as="span" fontWeight="bold" mr={2}>
                    禁止:
                  </Text>
                  go toは使わない(予想外のエラーが発生)
                </ListItem>
              </List>
            </Box>
          </CustomAccordion>
          <CustomAccordion title="ディレクトリ構造" badges={["開発者"]}>
            <FileSystemNode item={directoryData0} />
          </CustomAccordion>
          <CustomAccordion title="オブジェクト指向について" badges={["開発者"]}>
            <FileSystemNode item={directoryData1} />
          </CustomAccordion>
          <CustomAccordion title="よく使うコード" badges={["開発者"]}>
            <FileSystemNode item={directoryData2} />
          </CustomAccordion>
          <CustomAccordion title="このWEBサイトのソース" badges={["開発者"]}>
            <Flex alignItems="left" mb={4}>
              <Link
                href="https://github.com/teppy0422/JAMstack-blog"
                isExternal
              >
                <Flex alignItems="center">
                  <Icon as={FaGithub} w={6} h={6} />
                  <Text ml={2}>GitHub</Text>
                </Flex>
              </Link>
            </Flex>
            <Text>
              このサイトのソースコードはGitHubに公開しています
              <br />
              自由に使って構いません
              <br />
              ※チャットやユーザー情報、一部のファイルはsupabase内にあるのでアクセスできません
              <br />
              Next.js, ChakraUIがベースで
              supabase,microCMSの外部サービスを利用しています
            </Text>
          </CustomAccordion>
          <Box height={800}></Box>
        </div>
      </Content>
    </>
  );
}
