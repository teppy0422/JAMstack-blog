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
import { CustomToast } from "@/components/ui/CustomToast";
import getMessage from "@/utils/getMessage";
import { useLanguage } from "../../src/contexts/LanguageContext";
import YoutubeLike from "@/public/images/etc/youtubeLike.svg";

const MotionBox = motion(Box);

const apps = [
  {
    title: "タイピング",
    href: "/typing",
    description:
      "速度に応じて雪が降るエフェクト付きのタイピング練習。ランキング機能あり。",
    src: "/images/illust/obj/typingLogo.webp",
    rate: 5,
    limitTag: "",
  },
  {
    title: "画像検索",
    href: "/searchPicture",
    description: "商用利用可能な画像のみを検索できるツール。",
    src: "/images/illust/obj/searchPictureLogo.webp",
    rate: 2,
    limitTag: "",
  },
  {
    title: "ブログ（JAMStack）",
    href: "/blogs",
    description: "microCMSを使用した高速・静的配信のJAMStackブログ。",
    src: "/images/illust/obj/blogLogo.webp",
    onlyDeveloper: true,
    rate: 3,
    limitTag: "閲覧",
  },
  {
    title: "居酒屋注文システム(注文)",
    href: "/order",
    description: "栄養バランス表示。リアルタイム注文。",
    src: "/images/ico/order-cover.png",
    rate: 4,
    limitTag: "使用",
  },
  {
    title: "居酒屋注文システム(受注)",
    href: "/orderAdmin",
    description: "食材ToDoリストで買い物。レシピ登録/編集。栄養バランス表示。",
    src: "/images/ico/orderAdmin-cover.png",
    rate: 5,
    limitTag: "使用",
  },
  {
    title: "絵本アプリ",
    href: "/storybook",
    description:
      "1-2歳向けの絵本アプリ。iPhoneでホームアプリにして閲覧予定。イラスト作成が退屈で頓挫中。",
    src: "/images/ico/storybook-cover.png",
    rate: 1,
  },
  {
    title: "YouTube(偽)",
    href: "/youtube",
    description: "動画再生用のページをなんとなく弄ってたら出来ました。",
    src: "/images/etc/youtubeLike.svg",
    rate: 2,
    limitTag: "閲覧",
    useSvgComponent: true,
  },
  {
    title: "ピアノ学習",
    href: "/score",
    description: "MIDI出力が可能な電子ピアノで学習",
    src: "/images/ico/score-logo.svg",
    rate: 5,
    limitTag: "",
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
  const router = useRouter();
  const toast = useToast();
  const { language } = useLanguage();
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
          <Heading
            mb={8}
            fontWeight="600"
            textAlign="center"
            fontFamily="Noto Sans JP"
          >
            WEBアプリ一覧
          </Heading>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 3, lg: 4 }} spacing={2}>
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
                        position: "bottom",
                        duration: 3000,
                        isClosable: true,
                        render: ({ onClose }) => (
                          <CustomToast
                            onClose={onClose}
                            title={getMessage({
                              ja: "閲覧制限",
                              us: "Restricted Viewing",
                              cn: "限制浏览",
                              language,
                            })}
                            description={
                              <>
                                <Box>
                                  {getMessage({
                                    ja: "このアプリは開発のみアクセスできます。",
                                    us: "This application is accessible only for development.",
                                    cn: "该应用程序只能通过开发访问。",
                                    language,
                                  })}
                                </Box>
                              </>
                            }
                          />
                        ),
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
                      {app.useSvgComponent ? (
                        <Box
                          color={colorMode === "light" ? "#D13030" : "#F89173"}
                          width="120px"
                          height="120px"
                        >
                          <YoutubeLike
                            style={{
                              fill: "currentColor",
                              width: "100%",
                              height: "100%",
                            }}
                          />
                        </Box>
                      ) : (
                        <Image
                          src={app.src}
                          alt="image"
                          width="120px"
                          height="120px"
                          style={
                            app.src.endsWith(".svg")
                              ? {
                                  filter:
                                    colorMode === "dark" ? "invert(1)" : "none",
                                }
                              : undefined
                          }
                        />
                      )}
                    </Box>
                    <Stack mt="3" spacing="1">
                      <Heading fontSize="15px">{app.title}</Heading>
                      <Box display="flex" fontSize="13px" alignItems="center">
                        <Box m={0} p={0}>
                          {Array(5)
                            .fill("")
                            .map((_, i) => (
                              <StarIcon
                                key={i}
                                color={i < app.rate ? "orange.400" : "gray.300"}
                              />
                            ))}
                        </Box>
                        {app.limitTag === "閲覧" && (
                          <Badge
                            colorScheme="red"
                            variant="outline"
                            fontSize="0.8em"
                            ml="4px"
                          >
                            閲覧制限
                          </Badge>
                        )}
                        {app.limitTag === "使用" && (
                          <Badge
                            colorScheme="orange"
                            variant="outline"
                            fontSize="0.8em"
                            ml="4px"
                          >
                            使用制限
                          </Badge>
                        )}
                      </Box>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter
                    p={1}
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
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
