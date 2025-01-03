import React, { useEffect, useRef, useState, useContext } from "react";
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
  Button,
  useColorMode,
} from "@chakra-ui/react";
import {
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineCheckBox,
  MdEditRoad,
} from "react-icons/md";
import Sidebar from "../components/sidebar";
import Content from "../components/content";
import { Global } from "@emotion/react";

import getMessage from "../components/getMessage";
import { AppContext } from "../pages/_app";

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

const Roadmap = () => {
  const roadmapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { colorMode, toggleColorMode } = useColorMode();

  const [years, setYears] = useState<number[]>([]);
  let previousYear: string | undefined;

  // 現在の年月にスクロール
  const moveThisMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 月は0から始まるので+1
    const targetTitle = `${currentYear}-${currentMonth}`;
    const targetElement = roadmapRefs.current.find((ref) =>
      ref?.textContent?.includes(targetTitle)
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "auto", block: "center" });
    }
  };

  useEffect(() => {
    moveThisMonth;
  }, []);

  const { language, setLanguage } = useContext(AppContext);
  const roadmap: RoadmapItem[] = [
    {
      year: "2023",
      month: "06",
      category: [
        getMessage({
          ja: "WEBサービス",
          us: "Web Services",
          cn: "网络服务",
          language,
        }),
      ],
      titleColor: "gray",
      main: getMessage({
        ja: "WEBサービス開発スタート",
        us: "Web service development starts",
        cn: "开始网络服务开发",
        language,
      }),
      mainDetail: [
        getMessage({
          ja: "より効率良く業務改善を行う為にWEB上でやりとりをしてシステムを提供する事を目的に開発",
          us: "Developed for the purpose of providing a system with web-based interaction to improve business operations more efficiently.",
          cn: "开发该系统的目的是提供一个基于网络的互动系统，以便更有效地改进运作。",
          language,
        }),
      ],
      items: [
        {
          text: getMessage({
            ja: "ダウンロード機能の追加",
            us: "Addition of download function",
            cn: "附加下载功能",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "リアルタイムチャットの追加",
            us: "Addition of real-time chat",
            cn: "额外的实时聊天。",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "技術ブログの追加",
            us: "Add a technical blog",
            cn: "其他技术博客",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "タイピングソフトの追加",
            us: "Add typing software",
            cn: "其他打字软件",
            language,
          }),
          completed: true,
        },
      ],
      result: getMessage({
        ja: "半年間の運用テストを開始しました",
        us: "Six-month operational testing has begun.",
        cn: "为期六个月的运行测试已经启动。",
        language,
      }),
      duration: 360,
    },
    {
      year: "2023",
      month: "10",
      category: [
        getMessage({
          ja: "生産準備+",
          us: "Production Preparation+",
          cn: "生产准备+",
          language,
        }),
      ],
      titleColor: "gray",
      main: getMessage({
        ja: "オブジェクト指向に修正",
        us: "Modified to object-oriented",
        cn: "修改为面向对象。",
        language,
      }),
      mainDetail: [
        getMessage({
          ja: "生産準備業務を把握せずに機能を追加していった結果、コードが読みづらくなっていた為、オブジェクト指向に修正",
          us: "The code had become difficult to read as a result of adding functions without understanding production preparation operations, so the code was modified to be object-oriented.",
          cn: "在不了解生产准备工作的情况下添加函数，导致代码难以阅读，因此对代码进行了修改，使其面向对象。",
          language,
        }),
      ],
      items: [
        {
          text: getMessage({
            ja: "不要なコードの削除",
            us: "Delete unnecessary codes",
            cn: "删除不必要的代码。",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "EXCELが壊れた時に動作しなくなるコードを廃止",
            us: "Eliminate code that stops working when EXCEL is broken",
            cn: "消除 EXCEL 崩溃时停止工作的代码。",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "オブジェクト指向を導入",
            us: "Introducing Object Oriented",
            cn: "介绍面向对象",
            language,
          }),
          completed: true,
        },
      ],
      result: getMessage({
        ja: "この修正で他の開発者でも理解しやすくなり修正が容易になりました",
        us: "This fix makes it easier for other developers to understand and fix",
        cn: "该修复使其他开发人员更容易理解和修复",
        language,
      }),
      duration: 295,
    },
    {
      year: getMessage({
        ja: "-省略-",
        us: "-skip-",
        cn: "-节略-",
        language,
      }),
      titleColor: "gray",
    },
    {
      year: "2024",
      month: "9",
      category: [
        getMessage({
          ja: "生産準備+",
          us: "Production Preparation+",
          cn: "生产准备+",
          language,
        }),
      ],
      titleColor: "gray",
      main: getMessage({
        ja: "拡張性を高くする",
        us: "Highly scalable",
        cn: "高度可扩展性",
        language,
      }),
      mainDetail: [
        getMessage({
          ja: "配策誘導ナビでサブ形態を変更/検査履歴システムで不良登録などの拡張を考慮して要素を独立させるように修正",
          us: "Modified the subforms in the layout guidance navigation/inspection history system to make the elements independent in consideration of extensions such as defect registration.",
          cn: "考虑到缺陷登记等扩展功能，在布局指导导航/检查历史系统中对子表单进行了修改，使各元素相互独立。",
          language,
        }),
      ],
      items: [
        {
          text: getMessage({
            ja: "配策誘導ナビを画像から要素に修正",
            us: "Corrected the layout guidance navigation from images to elements.",
            cn: "将分配引导导航系统从图像修改为元素。",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "検査履歴システムを画像から要素に修正",
            us: "Modified inspection history system from images to elements",
            cn: "将检查历史系统从图像修改为元素。",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "現場の評価確認",
            us: "Confirmation of site evaluation",
            cn: "确认现场评估。",
            language,
          }),
          completed: false,
        },
      ],
      result: getMessage({
        ja: "クリック/タップで各ページにアクセス出来るようになった為、iPadなどのタブレットでの操作が可能になりました。配策の目安位置を表示してより効率良く作業をする事が可能になりました。",
        us: "Click/tap to access each page, enabling operation on iPads and other tablets. The approximate location of the layout can now be displayed for more efficient operation.",
        cn: "现在只需点击/轻点即可访问页面，从而可以在 iPad 等平板电脑上进行操作。现在可以通过显示措施分布的大致位置来提高工作效率。",
        language,
      }),
      duration: 228,
    },
    {
      year: "2024",
      month: "10",
      category: [
        getMessage({
          ja: "生産準備+",
          us: "Production Preparation+",
          cn: "生产准备+",
          language,
        }),
      ],
      titleColor: "gray",
      main: getMessage({
        ja: "協力会社向けの機能追加",
        us: "Additional functionality for subcontractors",
        cn: "合作伙伴公司的其他功能",
        language,
      }),
      mainDetail: [
        getMessage({
          ja: "高知協力会社(組立)の要望に対応",
          us: "Respond to requests from Kochi subcontractors (assembly)",
          cn: "满足高知分包商（组装）的要求。",
          language,
        }),
      ],
      items: [
        {
          text: getMessage({
            ja: "構成No.順の仕分けリストを追加",
            us: "Add sorting list in order of configuration No.",
            cn: "按配置编号顺序添加排序列表。",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "サブリストの作成を追加",
            us: "Added creation of sub-listings",
            cn: "创建附加子列表。",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "現場(高知)の評価確認",
            us: "Confirmation of on-site (Kochi) evaluation",
            cn: "确认现场（高知）评估。",
            language,
          }),
          completed: false,
        },
      ],
      result: "",
      duration: 90.0,
    },
    {
      year: "2024",
      month: "11",
      category: [
        getMessage({
          ja: "生産準備+",
          us: "Production Preparation+",
          cn: "生产准备+",
          language,
        }),
        getMessage({
          ja: "高知",
          us: "Kochi",
          cn: "高知",
          language,
        }),
      ],
      titleColor: "gray",
      main: getMessage({
        ja: "サブナンバーの引越しを追加",
        us: "Added sub-number move",
        cn: "增加了有小编号的移动。",
        language,
      }),
      mainDetail: [
        getMessage({
          ja: "引越しの際のPVSW_RLTFと端末一覧の手入力の手間と入力ミスを減らす",
          us: "Reduce labor and input errors in manually entering PVSW_RLTF and terminal list when moving",
          cn: "减少移动过程中 PVSW_RLTF 和终端列表的手动输入以及输入错误",
          language,
        }),
      ],
      items: [
        {
          text: getMessage({
            ja: "引越し機能(旧→新)の追加",
            us: "Addition of move function (old to new)",
            cn: "增加移动功能（新旧移动）。",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "現場(高知)の評価確認",
            us: "Confirmation of on-site (Kochi) evaluation",
            cn: "确认现场（高知）评估。",
            language,
          }),
          completed: false,
        },
      ],
      result: "",
      duration: 117.6,
    },
    {
      year: "2024",

      category: [
        getMessage({
          ja: "生産準備+",
          us: "Production Preparation+",
          cn: "生产准备+",
          language,
        }),
        getMessage({
          ja: "徳島",
          us: "Tokushima",
          cn: "徳島",
          language,
        }),
      ],
      titleColor: "gray",
      main: getMessage({
        ja: "チューブリストの追加",
        us: "Add Tubelist",
        cn: "添加管道清单",
        language,
      }),
      mainDetail: [
        getMessage({
          ja: "主に一貫工程でチューブ類をオミットする為に構成No.を含む一覧を作成",
          us: "Create a list including the configuration No. mainly to omit tubes in the integrated process.",
          cn: "包括配置编号的清单，主要用于在集成过程中省略管道。",
          language,
        }),
      ],
      items: [
        {
          text: getMessage({
            ja: "機能の追加",
            us: "Additional Functions",
            cn: "附加功能",
            language,
          }),
          completed: true,
        },
        {
          text: getMessage({
            ja: "現場(徳島)の評価確認",
            us: "Confirmation of on-site (Tokushima) evaluation",
            cn: "确认现场（徳島）评估。",
            language,
          }),
          completed: true,
        },
      ],
      result: "",
    },
    {
      year: getMessage({
        ja: "-活動中断-",
        us: "-Activity Interruption-",
        cn: "-活動中断-",
        language,
      }),
      titleColor: "gray",
    },

    {
      year: "2025",
      month: "1",
      category: [
        getMessage({
          ja: "生産準備+",
          us: "Production Preparation+",
          cn: "生产准备+",
          language,
        }),
      ],
      titleColor: "teal",
      main: getMessage({
        ja: "生産準備+にhsfの分解を追加",
        us: "hsf decomposition added to production preparation+.",
        cn: "hsf 分解加入生产准备+。",
        language,
      }),
      mainDetail: [
        getMessage({
          ja: "既存のWH_DataConvert.exeはMDへの分解に失敗することがある為、生産準備+でhsfの分解を行う",
          us: "Existing WH_DataConvert.exe may fail to decompose to MD, so use production preparation+ to decompose hsf",
          cn: "现有的 WH_DataConvert.exe 可能无法分解为 MD 因此请在生产准备+中分解 hsf。",
          language,
        }),
      ],
      items: [
        {
          text: getMessage({
            ja: "hsfの分解機能の追加",
            us: "Addition of hsf decomposition function",
            cn: "增加 hsf 分解功能。",
            language,
          }),
          completed: false,
        },
      ],
      possibility: 50,
    },
    {
      year: "2025",
      month: "2",
      category: [
        getMessage({
          ja: "生産準備+",
          us: "Production Preparation+",
          cn: "生产准备+",
          language,
        }),
        getMessage({
          ja: "高知",
          us: "Kochi",
          cn: "高知",
          language,
        }),
      ],
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
      year: "2025",
      category: [
        getMessage({
          ja: "生産準備+",
          us: "Production Preparation+",
          cn: "生产准备+",
          language,
        }),
      ],
      titleColor: "teal",
      main: getMessage({
        ja: "配策誘導ナビをIE11に対応",
        us: "Supported IE11 for the navigation system for guiding the allocation of measures.",
        cn: "分发引导导航系统支持 IE11。",
        language,
      }),
      mainDetail: [
        getMessage({
          ja: "誘導ナビ.vbはIE11を参照する為、徳島補給品で配策誘導Ver3.1を使用する場合はIE11で動作するように修正が必要。現在はEdge以上で動作可能",
          us: "Guidance Navi.vb refers to IE11, so it needs to be modified to work with IE11 if you want to use the distribution guidance Ver3.1 with Tokushima supplies. (Currently, it can work with Edge or higher.",
          cn: "Guidance Navi.vb 指的是 IE11 因此在使用德岛供货的 Distribution Guidance Ver 3.1 时，需要对其进行修改才能在 IE11 下运行。目前，它可以在 Edge 及以上版本中使用。",
          language,
        }),
      ],
      items: [{ text: "IE11での動作確認", completed: false }],
      possibility: 95,
    },
    {
      year: "2025",
      month: "3",
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
      year: "2025",
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
      year: "2025",
      month: "4",
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
      year: "2025",
      month: "5",
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
      year: "2025",
      month: "6",
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
      year: "2025",
      month: "7",
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
      year: "2025",
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
      year: "2025",
      month: "8",
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
      year: "2025",
      month: "9",
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
        <Button
          onClick={() => moveThisMonth()}
          position="fixed"
          right="0"
          // top="64px"
          bottom="0px"
          p={2}
          m={2}
          bg="transparent"
          border="solid 1px"
          zIndex={99999}
          fontSize={13}
          h={8}
        >
          {getMessage({
            ja: "今月に移動",
            us: "Moved to this month",
            cn: "移至本月",
            language,
          })}
        </Button>
        <Text ml={4} className="print-only">
          {getMessage({
            ja: "※別紙1",
            us: "*Attachment 1",
            cn: "*附录1.",
            language,
          })}
        </Text>
        <Container
          maxW="container.lg"
          py={8}
          fontFamily={getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans JP",
            cn: "Noto Sans SC",
            language,
          })}
          fontWeight={200}
        >
          <Heading as="h3" fontSize="24px" mb={8} textAlign="center">
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <Text>
                {getMessage({
                  ja: "ロードマップ",
                  us: "Road map",
                  cn: "路线图",
                  language,
                })}
              </Text>
              <MdEditRoad size={30} />
            </HStack>
          </Heading>
          <Badge variant="solid" colorScheme="green" ml={2}>
            {getMessage({
              ja: "使用者",
              us: "user",
              cn: "使用者",
              language,
            })}
          </Badge>
          <Badge variant="solid" colorScheme="purple" ml={2}>
            {getMessage({
              ja: "管理者",
              us: "administrator",
              cn: "管理者",
              language,
            })}
          </Badge>
          <Badge variant="solid" colorScheme="red" ml={2}>
            {getMessage({
              ja: "開発者",
              us: "developer",
              cn: "开发人员",
              language,
            })}
          </Badge>
          <Box mb={8} p={4} borderRadius="md">
            <Text textAlign="left" colorScheme="gray">
              {getMessage({
                ja: "・以下は契約書に基づいた活動予定内容です。",
                us: "・The following is a list of planned activities based on the contract.",
                cn: "・以下是根据合同计划开展的活动清单。",
                language,
              })}
              <br />
              {getMessage({
                ja: "・実行順は必要だと思う順になっています。順番を変更したい場合はご相談ください。",
                us: "・The order of execution is in the order we think necessary. If you wish to change the order, please contact us.",
                cn: "・执行的顺序是他们认为必要的顺序。如果您想更改订单，请联系我们。",
                language,
              })}
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
                    borderColor="transparent"
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
                          {getMessage({
                            ja: "実現する可能性 ",
                            us: "Possibility of realization ",
                            cn: "可行性 ",
                            language,
                          })}
                          {section.possibility}%
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
                      {section.year}-{section.month}
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
