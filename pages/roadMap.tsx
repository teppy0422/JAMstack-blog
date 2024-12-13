import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  Divider,
  Flex,
  Icon,
  Progress,
  Badge,
  HStack,
} from "@chakra-ui/react";
import {
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineCheckBox,
  MdEditRoad,
} from "react-icons/md";
import Sidebar from "../components/sidebar";
import Content from "../components/content";
import { Global } from "@emotion/react";

import "@fontsource/noto-sans-jp";

interface RoadmapItem {
  year?: string;
  month?: string;
  titleColor?: string;
  main?: string;
  mainDetail?: string[];
  items?: { text: string; completed: boolean }[];
  result?: string;
  possibility?: number;
  duration?: number;
  category?: string[];
  idea?: string[];
}

function getBadgeForCategory(category: string): JSX.Element {
  let colorScheme: string;
  switch (category) {
    case "生産準備+":
      colorScheme = "green";
      break;
    case "順立生産システム":
      colorScheme = "purple";
      break;
    case "部材一覧+":
      colorScheme = "yellow";
      break;
    default:
      colorScheme = "red";
  }
  return (
    <Badge
      variant="outline"
      colorScheme={colorScheme}
      mr={2}
      p={0.5}
      px={1}
      mb={1}
    >
      {category}
    </Badge>
  );
}
const roadmap: RoadmapItem[] = [
  {
    year: "2023年",
    month: "6月",
    category: ["WEBサービス"],
    titleColor: "gray",
    main: "WEBサービス開発スタート",
    mainDetail: [
      "より効率良く業務改善を行う為にWEB上でやりとりをしてシステムを提供する事を目的に開発",
    ],
    items: [
      { text: "ダウンロード機能の追加", completed: true },
      {
        text: "リアルタイムチャットの追加",
        completed: true,
      },
      { text: "技術ブログ(取扱説明書とか)の追加", completed: true },
      { text: "タイピングソフトの追加", completed: true },
    ],
    result: "半年を目安に運用テストを開始しました",
    duration: 360,
  },
  {
    year: "2023年",
    month: "10月",
    category: ["生産準備+"],
    titleColor: "gray",
    main: "オブジェクト指向に修正",
    mainDetail: [
      "生産準備業務を把握せずに機能を追加していった結果、コードが読みづらくなっていた為、オブジェクト指向に修正",
    ],
    items: [
      { text: "不要なコードの削除", completed: true },
      {
        text: "EXCELが壊れた時に動作しなくなるコードを廃止",
        completed: true,
      },
      { text: "オブジェクト指向に修正:80%", completed: true },
    ],
    result: "この修正で他の人でも理解しやすくなり修正が容易になりました",
    duration: 295,
  },
  {
    year: "-省略-",
    titleColor: "gray",
  },
  {
    year: "2024年",
    month: "9月",
    category: ["生産準備+"],
    titleColor: "gray",
    main: "拡張性を高くする",
    mainDetail: [
      "配策誘導ナビでサブ形態を変更/検査履歴システムで不良登録などの拡張を考慮して要素を独立させるように修正",
    ],
    items: [
      { text: "配策誘導ナビを画像から要素に修正", completed: true },
      { text: "検査履歴システムを画像から要素に修正", completed: true },
      { text: "現場の評価確認", completed: false },
    ],
    result:
      "クリック/タップで各ページにアクセス出来るようになった為、iPadなどのタブレットでの操作が可能になりました。配策の目安位置を表示してより効率良く作業をする事が可能になりました。",
    duration: 228,
  },
  {
    year: "2024年",
    month: "10月",
    category: ["生産準備+"],
    titleColor: "gray",
    main: "協力会社向けの機能追加",
    mainDetail: ["高知協力会社(組立)の要望に対応"],
    items: [
      { text: "構成No.順の仕分けリストを追加", completed: true },
      { text: "サブリストの作成を追加", completed: true },
      { text: "現場(高知)の評価確認", completed: false },
    ],
    result: "",
    duration: 90.0,
  },
  {
    year: "2024年",
    month: "11月",
    category: ["生産準備+", "高知"],
    titleColor: "gray",
    main: "サブナンバーの引越しを追加",
    mainDetail: [
      "引越しの際のPVSW_RLTFと端末一覧の手入力の手間と入力ミスを減らす",
    ],
    items: [
      { text: "引越し機能(旧→新)の追加", completed: true },
      { text: "現場(高知)の評価確認", completed: false },
    ],
    result: "",
    duration: 117.6,
  },
  {
    category: ["生産準備+", "徳島"],
    titleColor: "gray",
    main: "チューブリストの追加",
    mainDetail: [
      "主に一貫工程でチューブ類をオミットする為に構成No.を含む一覧を作成",
    ],
    items: [
      { text: "機能の追加", completed: true },
      { text: "現場(徳島)の評価確認", completed: false },
    ],
    result: "",
  },
  {
    year: "-活動中断-",
    titleColor: "gray",
  },
  {
    month: "12月",
    titleColor: "gray",
  },
  {
    year: "2025年",
    month: "1月",
    category: ["生産準備+"],
    titleColor: "teal",
    main: "hsfの分解を生産準備+で実行する",
    mainDetail: [
      "既存のWH_DataConvert.exeはMDへの分解に失敗することがある為、生産準備+でhsfの分解を行う",
    ],
    items: [{ text: "hsfの分解機能の追加", completed: false }],
    possibility: 50,
  },
  {
    year: "2025年",
    month: "2月",
    category: ["生産準備+", "高知"],
    titleColor: "teal",
    main: "MDデータから治具座標データを作成",
    mainDetail: [
      "手動作成2.0H/枚→自動化で0H/枚",
      "同じ端末No.が複数ある場合でもその製品品番に応じた座標で表示",
    ],
    items: [{ text: "MDデータから治具座標データを作成", completed: false }],
    possibility: 70,
  },
  {
    year: "2025年",
    category: ["生産準備+"],
    titleColor: "teal",
    main: "配策誘導ナビをIE11に対応",
    mainDetail: [
      "誘導ナビ.vbはIE11を参照する為、徳島補給品で配策誘導Ver3.1を使用する場合はIE11で動作するように修正が必要。現在はEdge以上で動作可能",
    ],
    items: [{ text: "IE11での動作確認", completed: false }],
    possibility: 95,
  },
  {
    year: "2025年",
    month: "3月",
    category: ["生産準備+"],
    titleColor: "teal",
    main: "グループ単位でのサブ自動立案",
    mainDetail: [
      "単体でのサブ自動立案は量産では使いづらい為、他の製品品番のサブ形態を考慮した(グループ単位)での自動立案を行えるようにする",
      "最初の試作でサブ自動立案を使用、そのサブで実際に作業しながら本番サブを考える事を想定",
    ],
    items: [{ text: "サブ自動立案の更新", completed: false }],
    possibility: 95,
  },
  {
    year: "2025年",
    category: ["生産準備+", "高知"],
    titleColor: "teal",
    main: "共通化の提案",
    mainDetail: [
      "同じ経路なのに電線サイズや色が異なる箇所を調査して変更を立案",
    ],
    items: [{ text: "共通化分析", completed: false }],
    possibility: 90,
  },
  {
    year: "2025年",
    month: "4月",
    category: ["生産準備+", "順立生産システム", "部材一覧+"],
    titleColor: "teal",
    main: "プログラムの最適化",
    mainDetail: ["誰でも更新できる事を目指してプログラム修正"],
    items: [
      { text: "オブジェクト指向になっていない箇所の修正", completed: false },
      {
        text: "プログラムの更新方法についての説明ページの追加を開始",
        completed: false,
      },
    ],
    possibility: 100,
  },
  {
    year: "2025年",
    month: "5月",
    category: ["生産準備+", "徳島"],
    titleColor: "teal",
    main: "ハメ図で作業番号を管理する機能の追加",
    mainDetail: [
      "PVSW_RLTFに作業番号を入力する項目を追加",
      "主にSSCのハメ図や後ハメ図に使用を想定",
    ],
    items: [
      { text: "PVSW_RLTFに入力欄を追加", completed: false },
      {
        text: "入力方法の最適化",
        completed: false,
      },
      {
        text: "現場の評価確認",
        completed: false,
      },
    ],
    possibility: 90,
  },
  {
    year: "2025年",
    month: "6月",
    category: ["生産準備+", "高知"],
    titleColor: "teal",
    main: "自動機APPLの設置順を提案する機能の追加",
    mainDetail: [
      "APPLの設置順によって生産効率が大きく変わるけど、人間が考えるのは難しい為プログラムに提案させる",
    ],
    items: [
      { text: "SA,ASそれぞれのステータスを生準+に追加", completed: false },
      { text: "配置を計算する過程を出力する機能の追加", completed: false },
      { text: "高知工場による評価", completed: false },
    ],
    possibility: 90,
  },
  {
    year: "2025年",
    month: "7月",
    category: ["生産準備+", "徳島"],
    titleColor: "teal",
    main: "Verup実行時にハメ図の色を引き継ぎたい",
    mainDetail: [
      "Verupを実行するとハメ色が標準に戻る為、都度の手修正が必要になっている",
    ],
    items: [
      { text: "設定したハメ色を保存/呼び出しを追加", completed: false },
      { text: "徳島工場による評価", completed: false },
    ],
    possibility: 100,
  },
  {
    year: "2025年",
    category: ["生産準備+"],
    titleColor: "teal",
    main: "PVSW_RLTFの変更は専用のフォームで行う",
    mainDetail: [
      "PVSW_RLTFの変更を手修正で行っている為、入力ミスによりハメ図にミスが発生する可能性がある。変更履歴が残っていない",
    ],
    items: [
      { text: "専用フォームの追加", completed: false },
      { text: "履歴を通知書に出力", completed: false },
      { text: "ログイン機能の追加", completed: false },
      { text: "現場の評価確認", completed: false },
    ],
    possibility: 100,
  },
  {
    year: "2025年",
    month: "8月",
    category: ["配策誘導ナビ.vb"],
    titleColor: "teal",
    main: "配策誘導ナビ.vbからのシリアル送信でディスプレイ移動の作り方を新規作成",
    mainDetail: [
      "配策誘導ナビ.vbとArudinoの組み合わせでディスプレイが移動しない場合の対応方法と新規作成方法をページに掲載",
    ],
    items: [
      {
        text: "電気回路とステッピングドライバーの耐久動作テスト",
        completed: false,
      },
      { text: "回路図と作り方を掲載", completed: false },
    ],
    possibility: 90,
  },
  {
    year: "2025年",
    month: "9月",
    category: ["生産準備+"],
    titleColor: "teal",
    main: "類似コネクタ調査",
    mainDetail: [
      "類似コネクタをPythonを利用して画像比較",
      "Pythonはサーバーが必要な為、無ければExcelで行う",
    ],
    items: [
      {
        text: "Python環境の構築",
        completed: false,
      },
      { text: "類似コネクタ比較機能の追加", completed: false },
    ],
    possibility: 60,
  },
];

const Roadmap = () => {
  // 現在の年月にスクロール
  const roadmapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [years, setYears] = useState<number[]>([]);
  let previousYear: string | undefined;

  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 月は0から始まるので+1
    const targetTitle = `${currentYear}年${currentMonth}月`;
    const targetElement = roadmapRefs.current.find((ref) =>
      ref?.textContent?.includes(targetTitle)
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, []);
  return (
    <>
      <Global
        styles={{
          "@media print": {
            ".print-only": {
              display: "block !important",
            },
          },
          ".print-only": {
            display: "none",
          },
        }}
      />
      <Sidebar />
      <Content isCustomHeader={true}>
        <Text ml={4} className="print-only">
          ※別紙1
        </Text>
        <Container
          maxW="container.lg"
          py={8}
          fontFamily="Noto Sans JP"
          fontWeight={200}
        >
          <Heading as="h3" fontSize="24px" mb={8} textAlign="center">
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <Text>ロードマップ</Text> <MdEditRoad size={30} />
            </HStack>
          </Heading>
          <Badge variant="solid" colorScheme="green" ml={2}>
            使用者
          </Badge>
          <Badge variant="solid" colorScheme="purple" ml={2}>
            管理者
          </Badge>
          <Badge variant="solid" colorScheme="red" ml={2}>
            開発者
          </Badge>
          <Box mb={8} p={4} borderRadius="md">
            <Text textAlign="left" colorScheme="gray">
              ・以下は契約書に基づいた活動予定内容です。
              <br />
              ・実行する順番を変えたい場合はご相談ください。
            </Text>
          </Box>
          <VStack spacing={8} align="stretch" position="relative">
            <Box
              position="absolute"
              left="50%"
              top="0"
              bottom="0"
              width="2px"
              bg="gray"
            />
            {roadmap.map((section, index) => (
              <Flex
                justify={index % 2 === 0 ? "flex-start" : "flex-end"}
                width="100%"
                position="relative"
                ref={(el) => {
                  if (el) {
                    roadmapRefs.current[index] = el;
                  }
                }}
              >
                {section.main && (
                  <Box
                    fontFamily="Noto Sans JP"
                    fontWeight={400}
                    bg="white"
                    mt={2}
                    p={5}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    width="44%"
                    position="relative"
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: "25px",
                      width: 0,
                      height: 0,
                      borderStyle: "solid",
                      borderWidth:
                        index % 2 !== 0
                          ? "10px 10px 10px 0"
                          : "10px 0 10px 10px",
                      borderColor:
                        index % 2 !== 0
                          ? "transparent white transparent transparent"
                          : "transparent transparent transparent white",
                      left: index % 2 !== 0 ? "-10px" : "auto",
                      right: index % 2 === 0 ? "-10px" : "auto",
                    }}
                  >
                    <Heading
                      as="h2"
                      size="md"
                      mb={2}
                      color={
                        section.titleColor === "gray" ? "gray.600" : "teal.600"
                      }
                    >
                      {section.category &&
                        section.category.map((category) =>
                          getBadgeForCategory(category)
                        )}
                      <br />
                      {section.main}
                      {section.mainDetail &&
                        section.mainDetail.map((detail, idx) => (
                          <Text key={idx} fontSize="sm" color="gray.500" my={1}>
                            {detail}
                          </Text>
                        ))}
                    </Heading>
                    <Divider mb={4} />
                    {section.items &&
                      section.items.map((item, idx) => (
                        <Flex key={idx} align="center" mb={2}>
                          <Icon
                            as={
                              item.completed
                                ? MdOutlineCheckBox
                                : MdOutlineCheckBoxOutlineBlank
                            }
                            color={item.completed ? "green.500" : "red.500"}
                            mr={2}
                          />
                          <Text fontSize="md" color="gray.700">
                            {item.text}
                          </Text>
                        </Flex>
                      ))}
                    {section.result && (
                      <>
                        <Divider my={4} />
                        <Text fontSize="sm" color="gray.700">
                          {section.result}
                        </Text>
                      </>
                    )}
                    {section.possibility !== undefined && (
                      <>
                        <Divider my={4} />
                        <Text fontSize="sm" color="gray.700">
                          実現する可能性 {section.possibility}%
                        </Text>
                        <Progress
                          value={section.possibility}
                          size="sm"
                          colorScheme="teal"
                        />
                      </>
                    )}
                    {section.duration !== undefined && (
                      <>
                        <Divider my={4} />
                        <Text fontSize="sm" color="gray.700">
                          {section.duration}H
                        </Text>
                        <Progress
                          value={
                            section.duration > 160
                              ? (160 / section.duration) * 100
                              : (section.duration / 160) * 100
                          }
                          colorScheme="gray"
                          bg={section.duration > 160 ? "orange" : "red"}
                          size="sm"
                        />
                      </>
                    )}
                  </Box>
                )}
                <Box
                  bg={section.titleColor}
                  color="white"
                  position="absolute"
                  left="50%"
                  transform="translateX(-50%)"
                  px={1}
                  zIndex={1}
                >
                  {section.year !== previousYear ? (
                    <>
                      {section.year}
                      {section.month}
                    </>
                  ) : (
                    <>
                      <span style={{ position: "absolute", opacity: 0 }}>
                        {section.year}
                      </span>
                      {section.month}
                    </>
                  )}
                </Box>
                {(previousYear = section.year) && null}
              </Flex>
            ))}
          </VStack>
        </Container>
      </Content>
    </>
  );
};

export default Roadmap;
