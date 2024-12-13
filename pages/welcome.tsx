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
} from "@chakra-ui/react";
import { FaArrowCircleDown, FaUser } from "react-icons/fa";
import Sidebar from "../components/sidebar"; // Sidebar コンポーネントをインポート
import Content from "../components/content"; // Content コンポーネントをインポート
import { useUserInfo } from "../hooks/useUserId";
import { useUserData } from "../hooks/useUserData";
import { useColorMode } from "@chakra-ui/react";

export default function Welcome() {
  const router = useRouter();
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const { isNewCreated } = router.query;
  const { colorMode } = useColorMode();

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
    const startDate = new Date(2024, 7, 6); // 月は0から始まるので7月は6
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30); // おおよその月数
    const days = (diffDays % 365) % 30;
    return `${years}年${months}ヶ月${days}日`;
  };
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <div style={{ paddingTop: "50px", fontFamily: "Noto Sans JP" }}>
          <Box textAlign="center" mb={8}>
            <Heading
              size="lg"
              mb={2}
              fontFamily="'Archivo Black', 'M PLUS Rounded 1c'"
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
                  <Text fontSize="lg">
                    右上の
                    <Avatar size="xs" src="https://bit.ly/broken-link" mx={1} />
                    からアカウントを新規作成/またはログインしてください
                  </Text>
                )}
                {userName === null && (
                  <Text fontSize="lg">
                    "アカウントが認証されていません。管理者に連絡して認証を行なってください"
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={5}
              mb={10}
            >
              {isNewCreated === "true" ? (
                <Box
                  backgroundImage="/images/hippo.gif"
                  backgroundSize="contain"
                  backgroundRepeat="no-repeat"
                  width={{ base: "80px", md: "100px", lg: "120px" }}
                  height={{ base: "160px", md: "180px", lg: "200px" }}
                />
              ) : (
                <Box></Box>
              )}
            </Box>
            <Card
              backgroundColor="transparent"
              border="1px solid"
              borderColor="gray.500"
            >
              <CardHeader
                p={2}
                pl={3}
                pb={0}
                borderTopRadius={5}
                bg={colorMode === "light" ? "#333" : "#222"}
                color={colorMode === "light" ? "white" : "#white"}
              >
                <Heading size="md" mb={3} textAlign="center">
                  このWEBサービスの目的
                </Heading>
              </CardHeader>
              <Divider borderColor="gray.500" />
              <CardBody p={4} lineHeight="2.5">
                <Text>業務効率化を図る為に以下の機能があります</Text>
                <Text>1.プログラムのダウンロード</Text>
                <Text>2.プログラムの使い方の解説</Text>
                <Text>3.チャットによる新規開発依頼/機能追加</Text>
                <Text>4.チャットによる不具合対応</Text>
                <Text>5.タイピング練習とグラフ化</Text>
                <Text
                  fontSize="sm"
                  mt={2}
                  color={colorMode === "light" ? "red" : "orange"}
                >
                  ※ログインして認証を行わないと閲覧/ダウンロードは出来ません
                </Text>
              </CardBody>
            </Card>
            <Text>
              WEBサービス開発から{calculateElapsedTime()}が経過しています。
              <br />
              必要な機能は都度追加していきます。
            </Text>
            <Flex
              fontSize="sm"
              mt={3}
              textAlign="center"
              alignItems="center"
              justifyContent="center"
            >
              {isNewCreated === "true" && (
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
              )}
            </Flex>
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
