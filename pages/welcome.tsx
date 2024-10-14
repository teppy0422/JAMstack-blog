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
} from "@chakra-ui/react";
import { FaArrowCircleDown, FaUser } from "react-icons/fa";
import Sidebar from "../components/sidebar"; // Sidebar コンポーネントをインポート
import Content from "../components/content"; // Content コンポーネントをインポート

export default function Welcome() {
  const router = useRouter();
  const { isNewCreated } = router.query;
  const moveAnimation = keyframes`
  from {
    transform: translate(-4px, 4px) rotate(225deg);
  }
  to {
    transform: translate(0, 0) rotate(225deg);
  }
`;
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
              <Text fontSize="lg">アカウント作成が完了しました</Text>
            ) : (
              <Text fontSize="lg">
                右上の
                <Avatar size="xs" src="https://bit.ly/broken-link" mx={1} />
                からアカウントを新規作成してください
              </Text>
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
              <CardHeader p={2} pl={3} pb={0}>
                <Heading size="md" mb={3}>
                  ログインするメリット
                </Heading>
              </CardHeader>
              <Divider borderColor="gray.500" />
              <CardBody p={4} lineHeight="2.5">
                <Text>1.チャットで自分の投稿を削除出来るようになります</Text>
                <Text>
                  2.タイピング練習で自分のスコアを登録/確認できるようになります
                </Text>
                <Text color="red">
                  3.プログラムやデータがダウンロード出来るようになります
                </Text>
                <Text color="red">4.各ページの閲覧制限が解除されます</Text>
                <Text fontSize="sm" mt={2} color="red">
                  ※管理者による承認が必要です。お手数ですがご連絡をお願いします
                </Text>
              </CardBody>
            </Card>
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
