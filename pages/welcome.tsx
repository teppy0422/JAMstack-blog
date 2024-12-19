import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Text,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Flex,
  keyframes,
  Avatar,
  Center,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { FaArrowCircleDown, FaUser } from "react-icons/fa";
import { MdEditRoad } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { PiGithubLogoFill } from "react-icons/pi";
import { AiOutlineWechat } from "react-icons/ai";
import { FaEarthAsia } from "react-icons/fa6";
import Sidebar from "../components/sidebar"; // Sidebar コンポーネントをインポート
import Content from "../components/content"; // Content コンポーネントをインポート
import { useUserInfo } from "../hooks/useUserId";
import { useUserData } from "../hooks/useUserData";
import { useColorMode } from "@chakra-ui/react";

import "@fontsource/noto-sans-jp";
import "@fontsource/dela-gothic-one";

export default function Welcome() {
  const router = useRouter();
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const { isNewCreated } = router.query;
  const { colorMode } = useColorMode();
  const colors = {
    light: {
      text: "#151500",
    },
    dark: {
      text: "#FFe",
    },
  };
  const moveAnimation = keyframes`
  from {
    transform: translate(-4px, 4px) rotate(225deg);
  }
  to {
    transform: translate(0, 0) rotate(225deg);
  }
`;
  //生産準備+着手からの経過日数の計算

  const calculateElapsedTime = () => {
    const startDate = new Date(2024, 7, 10); // 月は0から始まるので7月は6
    const today = new Date();
    const formattedToday = `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()}`; // yyyy/m/d形式にフォーマット

    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30); // おおよその月数
    const days = (diffDays % 365) % 30;

    // 0年の場合は0年を表示しない
    return {
      elapsedTime: `2024/7/10 - ${formattedToday}`,
      totalDays: `${years > 0 ? years + "年" : ""}${months}ヶ月${days}日`, // 追加の返り値
    };
  };
  const { elapsedTime, totalDays } = calculateElapsedTime();
  const renderCard = (title, icon, text) => (
    <Card
      width={{ base: "100%", sm: "40%", md: "30%", lg: "30%", xl: "30%" }}
      p={4}
      backgroundColor="transparent"
      border="1px solid"
      borderColor="gray.500"
      textAlign="center"
    >
      <CardHeader
        display="flex"
        justifyContent="center"
        p={1}
        color={colorMode === "light" ? colors.light.text : colors.dark.text}
      >
        {icon}
      </CardHeader>
      <Text
        fontFamily="Dela Gothic One"
        fontSize="28px"
        letterSpacing="0.1em"
        mb={0}
        color={colorMode === "light" ? colors.light.text : colors.dark.text}
      >
        {title}
      </Text>
      <CardBody p={1} lineHeight="1.2">
        <Text fontFamily="Noto Sans Jp" fontSize="13px">
          {text}
        </Text>
      </CardBody>
    </Card>
  );
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true} maxWidth="1200px">
        <div style={{ paddingTop: "50px", fontFamily: "Noto Sans JP" }}>
          <Box textAlign="center" mb={8}>
            <Heading
              size="lg"
              mb={2}
              fontFamily="'Archivo Black', 'M PLUS Rounded 1c'"
              color={
                colorMode === "light" ? colors.light.text : colors.dark.text
              }
            >
              WELCOME
            </Heading>

            {isNewCreated === "true" ? (
              <>
                <Text fontSize="lg">アカウント作成が完了しました</Text>
                <Text fontSize="lg">
                  右上の
                  <Avatar size="xs" src="https://bit.ly/broken-link" mx={1} />
                  からログインしてください
                </Text>
              </>
            ) : (
              <>
                {userId === null && (
                  <Text
                    fontSize="lg"
                    color={colorMode === "light" ? "red" : "orange"}
                  >
                    右上の
                    <Avatar size="xs" src="https://bit.ly/broken-link" mx={1} />
                    からアカウントを新規作成/またはログインしてください
                  </Text>
                )}
                {userName === null && (
                  <Text
                    fontSize="lg"
                    color={colorMode === "light" ? "red" : "orange"}
                  >
                    アカウントが認証されていません。管理者に連絡して認証を行なってください
                  </Text>
                )}
              </>
            )}
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1 }}
            spacing={5}
            mx={{ base: 2, md: 40, lg: 40 }}
          >
            {isNewCreated === "true" && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={5}
                mb={10}
              >
                <Box
                  backgroundImage="/images/hippo.gif"
                  backgroundSize="contain"
                  backgroundRepeat="no-repeat"
                  width={{ base: "80px", md: "100px", lg: "120px" }}
                  height={{ base: "160px", md: "180px", lg: "200px" }}
                />
              </Box>
            )}

            {isNewCreated === "true" && (
              <Flex
                fontSize="sm"
                mt={3}
                textAlign="center"
                alignItems="center"
                justifyContent="center"
              >
                <>
                  <Text mr={2}>右上のアイコンからログインしてください</Text>
                  <Box
                    as={FaArrowCircleDown}
                    animation={`${moveAnimation} .5s ease-in-out infinite alternate`}
                    style={{
                      verticalAlign: "middle",
                    }}
                  />
                </>
              </Flex>
            )}
          </SimpleGrid>

          <Card
            maxWidth="540px"
            mx="auto"
            bg="transparent"
            border="1px solid"
            borderColor="gray.500"
          >
            <CardHeader p={3}>
              <Heading size="md" textAlign="center">
                このWEBサービスのメリット
              </Heading>
            </CardHeader>
            <Divider />
            <CardBody>
              <Stack
                divider={<StackDivider borderColor="gray.500" />}
                spacing="4"
              >
                <Box>
                  <Heading size="xs" textTransform="uppercase" fontWeight={600}>
                    リアルタイムで迅速に対応
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    ・疑問や問題をすぐに問い合わせが出来ます
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase" fontWeight={600}>
                    依頼が簡単
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    ・システム開発依頼書や仕様書を用意する必要はありません
                    <br />
                    <Box as="span" ml={3.5}>
                      リアルタイムチャットから業務の問題を教えてください
                    </Box>
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase" fontWeight={600}>
                    安価に提供
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    ・移動時間がないので低価格を実現しています
                    <br />
                    ・フルリモートなのでエンジニア雇用に必要な高額な人件費を削減可能です
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={5}
            mb={10}
            fontSize={40}
          >
            <Text fontFamily="Noto Sans Jp" fontWeight={800}>
              特徴
            </Text>
          </Box>
          <Center flex="1" style={{ gap: "8px" }}>
            <Flex wrap="wrap" justify="center" style={{ gap: "24px" }}>
              {renderCard(
                "ダウンロード",
                <Box transform="rotate(270deg)" position="relative">
                  <IoTicketOutline size={85} />
                </Box>,
                "プログラムのダウンロードと使い方イメージ"
              )}
              {renderCard(
                "技術ブログ",
                <PiGithubLogoFill size={90} />,
                <Text>
                  プログラムの使い方や共有したい技術を紹介
                  <br />
                  ※自分で更新する方法も追加予定
                </Text>
              )}
              {renderCard(
                "問い合わせ",
                <AiOutlineWechat size={90} />,
                <Text>
                  LINEのようなリアルタイムチャットで分からない事や不具合 /
                  新しい機能の追加を相談
                </Text>
              )}
              {renderCard(
                "ロードマップ",
                <MdEditRoad size={90} />,
                "依頼が無くても改良を進めていく道順の確認ができます"
              )}
              {renderCard(
                "その他",
                <FaEarthAsia size={85} />,
                "練習実績が記録できるタイピング練習ソフトなど"
              )}
            </Flex>
          </Center>
          <Box textAlign="center">
            <Text textAlign="center" mt={8} lineHeight={2}>
              他に必要な機能があれば意見ください
            </Text>
            <Text fontSize="md" mt={2}>
              ※ログインして認証を受けないと閲覧/ダウンロードは出来ません
            </Text>
            <Text textAlign="center" mt={12} lineHeight={1.6}>
              {elapsedTime}
            </Text>
            <Text textAlign="center" mt={0.6} lineHeight={1.6} fontSize={12}>
              {totalDays}
            </Text>
          </Box>
        </div>
      </Content>
    </>
  );
}
