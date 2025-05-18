"use client";

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
  Badge,
  Stack,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { StarIcon } from "@chakra-ui/icons";

import NextLink from "next/link";
import { motion } from "framer-motion";
import Content from "@/components/content";
import Sidebar from "@/components/sidebar";
import { sr } from "date-fns/locale";
import { useUserContext } from "@/contexts/useUserContext";

const MotionBox = motion(Box);

const apps = [
  {
    title: "タイピング練習",
    href: "/typing",
    description:
      "速度に応じて雪が降るエフェクト付きのタイピング練習。ランキング機能あり。",
    src: "/images/illust/obj/typingLogo.webp",
    rate: 5,
  },
  {
    title: "画像検索",
    href: "/searchPicture",
    description: "商用利用可能な画像のみを検索できるツール。",
    src: "/images/illust/obj/searchPictureLogo.webp",
    rate: 2,
  },
  {
    title: "ブログ（JAMStack）",
    href: "/blogs",
    description: "microCMSを使用した高速・静的配信のJAMStackブログ。",
    src: "/images/illust/obj/blogLogo.webp",
    onlyDeveloper: true,
    rate: 3,
  },
  {
    title: "居酒屋注文システム(注文)",
    href: "/order",
    description: "栄養バランス可視化。注文確定で受注側にデータ送信",
    src: "/images/illust/obj/orderLogo.webp",
    rate: 4,
  },
  {
    title: "居酒屋注文システム(受注)",
    href: "/orderAdmin",
    description:
      "メニューの選択で、食材をToDoリストで確認。GPTを利用して約1分で新しいメニューを追加可能。",
    src: "/images/illust/obj/orderLogo.webp",
    rate: 5,
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
  const { colorMode } = useColorMode();
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
      <Sidebar isDrawer={false} />
      <Content>
        <Box p={4}>
          <Heading mb={8} fontWeight="600" textAlign="center">
            WEBアプリ一覧
          </Heading>
          <SimpleGrid columns={{ base: 2, sm: 2, md: 3, lg: 4 }} spacing={2}>
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
                display="flex"
                justifyContent="center"
              >
                <Card
                  maxW="200px"
                  bg="transparent"
                  _hover={{ boxShadow: "xl", bg: "gray.50", color: "#000" }}
                  display="flex"
                  flexDirection="column"
                  mb={6}
                >
                  <CardBody p={2}>
                    <Box display="flex" justifyContent="center">
                      <Image
                        src={app.src}
                        alt="Green double couch with wooden legs"
                        borderRadius="lg"
                        width="140px"
                        height="120px"
                      />
                    </Box>
                    <Stack mt="4" spacing="3">
                      <Heading size="sm">{app.title}</Heading>
                      <Box display="flex" alignItems="center">
                        {Array(5)
                          .fill("")
                          .map((_, i) => (
                            <StarIcon
                              key={i}
                              color={i < app.rate ? "orange.400" : "gray.300"}
                            />
                          ))}
                      </Box>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter
                    p={2}
                    flex="1"
                    display="flex"
                    alignItems="flex-end"
                  >
                    <Text fontSize="12px">{app.description}</Text>
                  </CardFooter>
                </Card>
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
