import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Link,
  Image,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Content from "../components/content";
import { sr } from "date-fns/locale";

const apps = [
  {
    title: "タイピング練習",
    href: "/app/typing",
    description:
      "速度に応じて雪が降るエフェクト付きのタイピング練習。ランキング機能あり。",
    src: "/images/illust/obj/typingLogo.webp",
  },
  {
    title: "画像検索",
    href: "/app/searchPicture",
    description: "商用利用可能な画像のみを検索できるツール。",
    src: "/images/illust/obj/searchPictureLogo.webp",
  },
  {
    title: "ブログ（JAMStack）",
    href: "/blogs",
    description: "microCMSを使用した高速・静的配信のJAMStackブログ。",
    src: "/images/illust/obj/blogLogo.webp",
  },
  {
    title: "居酒屋注文システム(注文)",
    href: "/order",
    description: "栄養バランス可視化。注文確定で受注側にデータ送信",
    src: "/images/illust/obj/orderLogo.webp",
  },
  {
    title: "居酒屋注文システム(受注)",
    href: "/orderAdmin",
    description:
      "メニュー決定後、食材をToDoリストで確認。GPTでプロンプト自動生成し、約1分でメニュー追加可能。",
    src: "/images/illust/obj/orderLogo.webp",
  },
];

export default function AppList() {
  return (
    <Content isCustomHeader={true} maxWidth="100vw">
      <Box p={8}>
        <Heading mb={6}>WEBアプリ一覧</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {apps.map((app) => (
            <Link
              as={NextLink}
              href={app.href}
              key={app.title}
              _hover={{ textDecoration: "none" }}
            >
              <Box
                p={6}
                borderWidth="1px"
                borderRadius="2xl"
                boxShadow="md"
                _hover={{ boxShadow: "xl", bg: "gray.50" }}
                transition="all 0.2s"
              >
                <VStack align="start" spacing={2}>
                  <Flex align="center" gap={2}>
                    <Image src={app.src} w="30px" />
                    <Heading size="md">{app.title}</Heading>
                  </Flex>
                  <Text fontSize="sm" color="gray.600">
                    {app.description}
                  </Text>
                </VStack>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      </Box>
    </Content>
  );
}
