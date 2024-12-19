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
  HStack,
  Icon,
  Image,
  CardFooter,
  Button,
} from "@chakra-ui/react";
import {
  FaArrowCircleDown,
  FaUser,
  FaLaptopCode,
  FaRegThumbsUp,
} from "react-icons/fa";
import { BsChatLeftText, BsChatRightText } from "react-icons/bs";
import { MdEditRoad } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { VscChecklist } from "react-icons/vsc";
import {
  PiGithubLogoFill,
  PiGithubLogoLight,
  PiArrowFatLineDownLight,
} from "react-icons/pi";
import { AiOutlineWechat } from "react-icons/ai";
import { FaEarthAsia } from "react-icons/fa6";
import Sidebar from "../components/sidebar"; // Sidebar コンポーネントをインポート
import Content from "../components/content"; // Content コンポーネントをインポート
import { useUserInfo } from "../hooks/useUserId";
import { useUserData } from "../hooks/useUserData";
import { useColorMode } from "@chakra-ui/react";

import "@fontsource/noto-sans-jp";
import "@fontsource/dela-gothic-one";
import "@fontsource/rampart-one";
import "@fontsource/rocknroll-one";

export const getServerSideProps = async (context) => {
  const { query } = context;
  return {
    props: {
      isNewCreated: query.isNewCreated || null, // クエリパラメータを取得
    },
  };
};

const Welcome = ({ isNewCreated }) => {
  const router = useRouter();
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
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
  }`;
  const jumpAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }`;
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
      maxW="280px"
      p={2}
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
        {text}
      </CardBody>
    </Card>
  );
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true} maxWidth="1200px">
        <Box style={{ paddingTop: "30px", fontFamily: "Noto Sans JP" }}>
          <Box textAlign="center" mb={4}>
            <Heading
              size="lg"
              mb={8}
              fontFamily="'Rampart One', 'M PLUS Rounded 1c'"
              fontSize={45}
              color={
                colorMode === "light" ? colors.light.text : colors.dark.text
              }
              display="inline-block"
            >
              {Array.from("WELCOME").map((char, index) => (
                <Text
                  as="span"
                  key={index}
                  display="inline-block" // 追加: インラインブロックにする
                  animation={`${jumpAnimation} 0.5s ease-in-out ${
                    index * 0.1
                  }s 5`}
                >
                  {char}
                </Text>
              ))}
            </Heading>

            {isNewCreated === "true" ? (
              <>
                <Text fontSize="lg">アカウント作成が完了しました</Text>
                <Text fontSize="lg" alignItems="center">
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
                    alignItems="center"
                    mb={3}
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
            maxWidth="550px"
            mx="auto"
            bg="transparent"
            border="1px solid"
            borderColor="gray.500"
          >
            <CardHeader p={3} borderTopRadius={5} bg="rgba(255, 255, 255, 0.2)">
              <Heading size="md" textAlign="center" fontWeight={600}>
                このWEBサービスのメリット
              </Heading>
            </CardHeader>
            <Divider />
            <CardBody p={4}>
              <Stack
                divider={<StackDivider borderColor="gray.500" />}
                spacing="4"
              >
                <Box>
                  <Heading size="sm" textTransform="uppercase" fontWeight={600}>
                    迅速に対応
                  </Heading>
                  <Text pt="2" fontSize="15px">
                    ・疑問や問題をリアルタイムで問い合わせが出来ます
                  </Text>
                </Box>
                <Box>
                  <Heading size="sm" textTransform="uppercase" fontWeight={600}>
                    依頼が簡単
                  </Heading>
                  <Text pt="2" fontSize="15px">
                    ・システム開発依頼書や仕様書を用意する必要はありません
                    <br />
                    <Box as="span" ml={3.5}>
                      リアルタイムチャットから業務の問題を教えてください
                    </Box>
                    <br />
                    <Box as="span" ml={3.5}>
                      解決するアイデアを提案します
                    </Box>
                  </Text>
                </Box>
                <Box>
                  <Heading size="sm" textTransform="uppercase" fontWeight={600}>
                    安価に提供
                  </Heading>
                  <Text pt="2" fontSize="15px">
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
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mt={12}
            mb={10}
          >
            <Text fontFamily="Rampart One" fontWeight={800} fontSize={40}>
              主な機能
            </Text>
          </Box>
          <Center flex="1" style={{ gap: "8px" }}>
            <Flex wrap="wrap" justify="center" style={{ gap: "24px" }}>
              {renderCard(
                "ダウンロード",
                <Box transform="rotate(270deg)" position="relative" my={1.5}>
                  <IoTicketOutline size={80} />
                </Box>,
                <Text
                  fontFamily="Noto Sans Jp"
                  fontSize="13px"
                  lineHeight={1.4}
                >
                  プログラムのダウンロードと説明動画
                </Text>
              )}
              {renderCard(
                "技術ブログ",
                <PiGithubLogoLight size={90} />,
                <Text
                  fontFamily="Noto Sans Jp"
                  fontSize="13px"
                  lineHeight={1.4}
                >
                  プログラムの使い方や技術を紹介
                  <br />
                  ※自分で更新する方法も追加予定
                </Text>
              )}
              {renderCard(
                "問い合わせ",
                <AiOutlineWechat size={90} />,
                <Text
                  fontFamily="Noto Sans Jp"
                  fontSize="13px"
                  lineHeight={1.4}
                >
                  LINEのようなリアルタイムチャットで分からない事や不具合 /
                  新機能の追加を相談
                </Text>
              )}
              {renderCard(
                "ロードマップ",
                <MdEditRoad size={90} />,
                <Text
                  fontFamily="Noto Sans Jp"
                  fontSize="13px"
                  lineHeight={1.4}
                >
                  各プログラムの改良/連携を長期的に進めていく道順の確認
                </Text>
              )}
              {renderCard(
                "その他",
                <Box my={1.5}>
                  <FaEarthAsia size={75} />
                </Box>,
                <Text
                  fontFamily="Noto Sans Jp"
                  fontSize="13px"
                  lineHeight={1.4}
                >
                  練習実績が記録できるタイピング練習ソフトなど
                </Text>
              )}
            </Flex>
          </Center>
          <Box textAlign="center">
            <Text textAlign="center" mt={8} lineHeight={2}>
              機能は必要都度追加していきます
            </Text>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={12}
          >
            <Text fontFamily="Rampart One" fontWeight={800} fontSize={40}>
              ご利用の流れ
            </Text>
          </Box>
          <Text textAlign="center" mb={10}>
            〜生産準備+に機能追加の場合〜
          </Text>
          <Card
            maxW={800}
            overflow="hidden"
            variant="outline"
            bg="transparent"
            border="1px solid"
            borderColor="gray.500"
            p={1}
            display="flex"
            justifyContent="center"
            margin="0 auto"
          >
            <CardBody p={2}>
              <HStack height="50px">
                <Box
                  flex="1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontFamily="Rampart One" fontSize="45px">
                    1
                  </Text>
                </Box>
                <Box flex="6">
                  <Text fontSize="20px">チャットで問い合わせる</Text>
                </Box>

                <Box flex="1" justifyContent="center">
                  <BsChatLeftText size={40} />
                </Box>
                <Box
                  height="100%"
                  width="1px"
                  backgroundColor="gray.500"
                  mx={0}
                />
                <Box flex="8">稼働日の8:00 - 17:00は即日の回答を行います</Box>
              </HStack>
            </CardBody>
          </Card>

          <HStack justifyContent="center" my={2}>
            <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
          </HStack>

          <Card
            maxW={800}
            overflow="hidden"
            variant="outline"
            bg="transparent"
            border="1px solid"
            borderColor="gray.500"
            p={1}
            display="flex"
            justifyContent="center"
            margin="0 auto"
          >
            <CardBody p={2}>
              <HStack height="50px">
                <Box
                  flex="1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontFamily="Rampart One" fontSize="45px">
                    2
                  </Text>
                </Box>
                <Box flex="6">
                  <Text fontSize="20px">チャットで仕様を検討する</Text>
                </Box>
                <Box flex="1" justifyContent="center">
                  <BsChatRightText size={40} />
                </Box>
                <Box
                  height="100%"
                  width="1px"
                  backgroundColor="gray.500"
                  mx={0}
                />
                <Box flex="8">
                  <Text>およそ数回のやりとりで仕様は決定します</Text>
                  <Text fontSize="14px">※過去半年の実績</Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>
          <HStack justifyContent="center" my={2}>
            <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
          </HStack>

          <Card
            maxW={800}
            overflow="hidden"
            variant="outline"
            bg="transparent"
            border="1px solid"
            borderColor="gray.500"
            p={1}
            display="flex"
            justifyContent="center"
            margin="0 auto"
          >
            <CardBody p={2}>
              <HStack height="50px">
                <Box
                  flex="1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontFamily="Rampart One" fontSize="45px">
                    3
                  </Text>
                </Box>
                <Box flex="6">
                  <Text fontSize="20px">開発する</Text>
                </Box>
                <Box flex="1" justifyContent="center">
                  <FaLaptopCode size={45} />
                </Box>
                <Box
                  height="100%"
                  width="1px"
                  backgroundColor="gray.500"
                  mx={0}
                />
                <Box flex="8">
                  <Text>約6時間後に完成してアップロードします</Text>
                  <Text fontSize="14px">
                    ※過去半年の実績(1〜56時間)の平均値
                  </Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>
          <HStack justifyContent="center" my={2}>
            <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
          </HStack>

          <Card
            maxW={800}
            overflow="hidden"
            variant="outline"
            bg="transparent"
            border="1px solid"
            borderColor="gray.500"
            p={1}
            display="flex"
            justifyContent="center"
            margin="0 auto"
          >
            <CardBody p={2}>
              <HStack height="50px">
                <Box
                  flex="1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontFamily="Rampart One" fontSize="45px">
                    4
                  </Text>
                </Box>
                <Box flex="6">
                  <Text fontSize="20px">ダウンロードして動作確認</Text>
                </Box>
                <Box flex="1" justifyContent="center">
                  <VscChecklist size={40} />
                </Box>
                <Box
                  height="100%"
                  width="1px"
                  backgroundColor="gray.500"
                  mx={0}
                />
                <Box flex="8">
                  <Text>依頼内容が意図したものだったかを確認</Text>
                  <Text fontSize="14px">
                    ※もし違う場合は
                    <Box
                      as="span"
                      fontFamily="Rampart One"
                      fontSize="18px"
                      mx={1}
                    >
                      1
                    </Box>
                    に戻ります
                  </Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>
          <HStack justifyContent="center" my={2}>
            <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
          </HStack>

          <Card
            maxW={800}
            overflow="hidden"
            variant="outline"
            bg="transparent"
            border="1px solid"
            borderColor="gray.500"
            p={1}
            display="flex"
            justifyContent="center"
            margin="0 auto"
          >
            <CardBody p={2}>
              <HStack height="50px">
                <Box
                  flex="1"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontFamily="Rampart One" fontSize="45px">
                    5
                  </Text>
                </Box>
                <Box flex="6">
                  <Text fontSize="20px">結果の報告</Text>
                </Box>
                <Box flex="1" justifyContent="center">
                  <FaRegThumbsUp size={40} />
                </Box>
                <Box
                  height="100%"
                  width="1px"
                  backgroundColor="gray.500"
                  mx={0}
                />
                <Box flex="8">
                  <Text>実際に使ってみた感想や考察などを連絡</Text>
                  <Text fontSize="14px">※結果連絡は必ずお願いします</Text>
                </Box>
              </HStack>
            </CardBody>
          </Card>

          <Text textAlign="center" fontSize="md" mt={18}>
            ※ログインして認証を受けないと閲覧/ダウンロードは出来ません
          </Text>
          <Text textAlign="center" mt={6} lineHeight={1.6}>
            {elapsedTime}
          </Text>
          <Text textAlign="center" mt={0.6} lineHeight={1.6} fontSize={12}>
            サービス開始から{totalDays}が経過
          </Text>
        </Box>
      </Content>
    </>
  );
};

export default Welcome;
