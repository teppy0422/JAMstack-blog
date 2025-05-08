import { useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Link,
  Image,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import NextLink from "next/link";
import { motion } from "framer-motion";
import Content from "../components/content";
import { sr } from "date-fns/locale";
import { useUserContext } from "../context/useUserContext";

const MotionBox = motion(Box);

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
    onlyDeveloper: true,
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
      "メニューの選択で、食材をToDoリストで確認。GPTを利用して約1分で新しいメニューを追加可能。",
    src: "/images/illust/obj/orderLogo.webp",
  },
];

export default function AppList() {
  const {
    currentUserId,
    currentUserPictureUrl,
    currentUserEmail,
    currentUserCreatedAt,
    getUserById,
    isLoading,
  } = useUserContext();
  const userData = currentUserId ? getUserById(currentUserId) : null;
  const router = useRouter(); // ← これが必要！
  const toast = useToast();

  const [direction, setDirection] = useState<"right" | "left">("right");

  const handleComplete = () => {
    setDirection((prev) => (prev === "right" ? "left" : "right"));
  };

  const isRight = direction === "right";
  const imageSrc = isRight
    ? "/images/illust/hippo/hippo_ct125_r.gif"
    : "/images/illust/hippo/hippo_ct125_l.gif";

  const xAnimation = isRight ? ["-50vw", "100vw"] : ["150vw", "-100vw"];
  return (
    <>
      <Content isCustomHeader={true} maxWidth="100vw">
        <Box p={8}>
          <Heading mb={6}>WEBアプリ一覧</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {apps.map((app) => (
              <Link
                as="div"
                key={app.title}
                onClick={() => {
                  if (app.onlyDeveloper) {
                    // 開発専用アプリ → ユーザーが「開発」の場合のみ許可
                    if (userData?.user_company === "開発") {
                      router.push(app.href);
                    } else {
                      toast({
                        title: "閲覧制限",
                        description: "このアプリは開発部のみアクセスできます。",
                        status: "warning",
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                  } else {
                    // 開発専用ではない → 誰でもOK
                    router.push(app.href);
                  }
                }}
                _hover={{ textDecoration: "none", cursor: "pointer" }}
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
      <Box position="fixed" w="100%" h="120px" bottom="0" zIndex={0}>
        <MotionBox
          key={direction}
          position="absolute"
          animate={{ x: xAnimation }}
          transition={{ duration: 12, ease: "linear" }}
          onAnimationComplete={handleComplete}
        >
          <Image src={imageSrc} alt="hippo" h="120px" />
        </MotionBox>
      </Box>
    </>
  );
}
