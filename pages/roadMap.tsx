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
} from "@chakra-ui/react";

interface RoadmapItem {
  title: string;
  items: string[];
}

const roadmap: RoadmapItem[] = [
  {
    title: "2023年1月",
    items: ["プロジェクトキックオフ", "要件定義", "初期デザイン作成"],
  },
  {
    title: "2023年2月",
    items: ["デザインレビュー", "フロントエンド開発開始", "バックエンド設計"],
  },
  {
    title: "2023年3月",
    items: ["フロントエンド開発継続", "バックエンド開発開始", "API設計"],
  },
  {
    title: "2023年4月",
    items: ["フロントエンド開発完了", "バックエンド開発継続", "テスト計画作成"],
  },
  {
    title: "2023年5月",
    items: ["統合テスト開始", "バグ修正", "ユーザーテスト準備"],
  },
  {
    title: "2023年6月",
    items: ["ユーザーテスト実施", "フィードバック収集", "最終調整"],
  },
  {
    title: "2023年7月",
    items: ["リリース準備", "最終テスト", "プロジェクト完了"],
  },
];

const Roadmap = () => {
  return (
    <Container maxW="container.lg" py={8}>
      <Heading as="h1" mb={8} textAlign="center" color="teal.500">
        ロードマップ
      </Heading>
      <VStack spacing={8} align="stretch">
        {roadmap.map((section, index) => (
          <Flex key={index} align="center">
            <Circle size="40px" bg="teal.500" color="white">
              {section.title.split("年")[1]}
            </Circle>
            <Box
              ml={4}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              flex="1"
            >
              <Heading as="h2" size="md" mb={2} color="teal.600">
                {section.title}
              </Heading>
              <Divider mb={4} />
              {section.items.map((item, idx) => (
                <Text key={idx} fontSize="md" color="gray.700" mb={2}>
                  {item}
                </Text>
              ))}
            </Box>
          </Flex>
        ))}
      </VStack>
    </Container>
  );
};

export default Roadmap;
