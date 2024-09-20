import React from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  Divider,
  Flex,
  Circle,
  Stack,
  Icon,
  Progress,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
interface RoadmapItem {
  title: string;
  main?: string;
  mainDetail?: string[];
  items?: { text: string; completed: boolean }[];
  result?: string;
  possibility?: number;
  duration?: number;
}
import Sidebar from "../components/sidebar";
import Content from "../components/content";

const roadmap: RoadmapItem[] = [
  {
    title: "2023年10月",
    main: "生産準備+をオブジェクト指向に修正",
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
    title: "-省略-",
  },
  {
    title: "2024年9月",
    main: "拡張性を高くする",
    mainDetail: [
      "配策誘導ナビでサブ形態を変更/検査履歴システムで不良登録などの拡張を考慮して要素を独立させるように修正",
    ],
    items: [
      { text: "配策誘導ナビを画像から要素に修正", completed: true },
      { text: "検査履歴システムを画像から要素に修正", completed: true },
    ],
    result:
      "クリック/タップで各ページにアクセス出来るようになった為、iPadなどのタブレットでの操作が可能になりました",
    duration: 228,
  },
  {
    title: "10月",
    main: "hsfの分解を生産準備+で実行する",
    mainDetail: [
      "既存のWH_DataConvert.exeはMDへの分解に失敗することがある為、生産準備+でhsfの分解を行う",
    ],
    items: [{ text: "hsfの分解機能の追加", completed: false }],
    possibility: 50,
  },
  {
    title: "11月",
    main: "MDデータから治具座標データを作成",
    mainDetail: [
      "手動作成2.0H/枚→自動化で0H/枚",
      "同じ端末No.が複数ある場合でもその製品品番に応じた座標で表示",
    ],
    items: [{ text: "MDデータから治具座標データを作成", completed: false }],
    possibility: 70,
  },
  {
    title: "12月",
    main: "グループ単位でのサブ自動立案",
    mainDetail: [
      "単体でのサブ自動立案は量産では使いづらい為、他の製品品番のサブ形態を考慮した(グループ単位)での自動立案を行えるようにする",
      "最初の試作でサブ自動立案を使用、そのサブで実際に作業しながら本番サブを考える事を想定",
    ],
    items: [{ text: "サブ自動立案の更新", completed: false }],
    possibility: 95,
  },
  {
    title: "2025年1月",
    main: "生産準備+の最適化",
    mainDetail: ["出来るだけ誰でも更新できるようにプログラムの構成を修正"],
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
    title: "2月",
    main: "ハメ図に作業番号を表示する機能の追加",
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
    ],
    possibility: 90,
  },
];

const Roadmap = () => {
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <Container maxW="container.lg" py={8}>
          <Heading as="h1" mb={8} textAlign="center" color="teal.500">
            ロードマップ
          </Heading>
          <Box mb={8} p={4} borderRadius="md">
            <Text textAlign="left" color="gray.700">
              ・使い方や説明についてはページを追加/更新していきます
              <br />
              ・他の人でも生産準備+を更新できるようにプログラムを修正し説明ページを追加していきます
              <br />
              ・その他、不具合や細かい機能修正は都度行います
              <br />
              ・最終目標は各工場で担当が更新して維持/管理できるようにすることです
            </Text>
          </Box>
          <VStack spacing={8} align="stretch" position="relative">
            <Box
              position="absolute"
              left="50%"
              top="0"
              bottom="0"
              width="2px"
              bg="teal.500"
            />
            {roadmap.map((section, index) => (
              <Flex
                key={index}
                justify={index % 2 === 0 ? "flex-start" : "flex-end"}
                width="100%"
                position="relative"
              >
                {section.main && (
                  <Box
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
                    <Heading as="h2" size="md" mb={2} color="teal.600">
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
                            as={item.completed ? CheckCircleIcon : WarningIcon}
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
                          colorScheme="teal"
                          bg={section.duration > 160 ? "orange" : "red"}
                          size="sm"
                        />
                      </>
                    )}
                  </Box>
                )}
                <Box
                  bg="teal.500"
                  color="white"
                  position="absolute"
                  left="50%"
                  transform="translateX(-50%)"
                  px={1}
                  zIndex={1}
                >
                  {section.title}
                </Box>
              </Flex>
            ))}
          </VStack>
        </Container>
      </Content>
    </>
  );
};

export default Roadmap;
