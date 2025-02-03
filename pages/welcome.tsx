import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

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
  Avatar,
  Center,
  Stack,
  StackDivider,
  HStack,
  VStack,
  Icon,
  Image,
  CardFooter,
  Button,
  Grid,
  ButtonGroup,
  Skeleton,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";

import {
  FaArrowCircleDown,
  FaUser,
  FaLaptopCode,
  FaRegThumbsUp,
} from "react-icons/fa";
import {
  BsChatLeftText,
  BsChatRightText,
  BsArrowUp,
  BsArrowDownUp,
} from "react-icons/bs";
import { keyframes } from "@emotion/react"; // 修正: @emotion/reactからインポート

import { MdEditRoad } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { FaCheckCircle, FaClipboardList, FaRegClock } from "react-icons/fa";
import { LuPanelRightOpen } from "react-icons/lu";
import { BsQuestionCircle } from "react-icons/bs";

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
import UnderlinedTextWithDrawer from "./skillBlogs/UnderlinedTextWithDrawer";
import CustomModal from "./skillBlogs/customModal";
import IframeDisplay from "./skillBlogs/IframeDisplay";
import SjpChart01 from "./skillBlogs/chart/chart_01";

import { useLanguage } from "../context/LanguageContext";

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

import getMessage from "../components/getMessage";
import { AppContext } from "../pages/_app";

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
  const { language, setLanguage } = useLanguage();

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const handleOpen = (drawerName: string) => {
    setActiveDrawer(drawerName);
    onOpen();
  };
  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
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
  50% { transform: translateY(-15px); }
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

  const renderCard = (title, icon, text, path_) => (
    <NextLink href={path_} passHref legacyBehavior>
      <Card
        width={{ base: "100%", sm: "40%", md: "30%", lg: "30%", xl: "30%" }}
        maxW="280px"
        p={2}
        backgroundColor="transparent"
        border="1px solid"
        borderColor="gray.500"
        textAlign="center"
        cursor="pointer"
        _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
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
    </NextLink>
  );
  const ChatInquiryCard = (num, title, icon, value, underArrow) => (
    <>
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
                {num}
              </Text>
            </Box>
            <Box
              flex="6"
              fontSize={{
                base: "14px",
                sm: "16px",
                md: "18px",
                lg: "20px",
                xl: "20px",
              }}
            >
              {title}
            </Box>

            <Box flex="1" justifyContent="center">
              {icon}
            </Box>
            <Box height="100%" width="1px" backgroundColor="gray.500" mx={0} />
            <Box
              flex="8"
              fontSize={{
                base: "12px",
                sm: "14px",
                md: "16px",
                lg: "18px",
                xl: "18px",
              }}
            >
              {value}
            </Box>
          </HStack>
        </CardBody>
      </Card>
      {underArrow && (
        <HStack justifyContent="center" my={2}>
          <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
        </HStack>
      )}
    </>
  );

  const renderSection = (sectionName, mt, mb) => (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt={mt}
      mb={mb}
    >
      <Text
        fontFamily="Rampart One"
        fontWeight={800}
        fontSize={{ base: 30, sm: 40 }}
      >
        {sectionName}
      </Text>
    </Box>
  );

  const StepRender = (num, text) => (
    <Box
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      width="100%"
      bg="transparent"
      border="1px solid"
      borderColor="gray.500"
      p={1}
      display="block"
      maxWidth="800px"
    >
      <HStack p={0} height="50px" gap={1}>
        <Text
          flex="1"
          fontSize="36px"
          fontFamily="Rampart One"
          px={1}
          textAlign="center"
        >
          {num}
        </Text>
        <Box height="100%" width="1px" backgroundColor="gray.500" mx={0} />
        <Text flex="10" p={2} fontSize={{ base: "15px", sm: "18px" }}>
          {text}
        </Text>
      </HStack>
    </Box>
  );
  const IntroductionRender = (num, text) => (
    <Box
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      width="100%"
      bg="transparent"
      border="1px solid"
      borderColor="gray.500"
      p={1}
      display="block"
      maxWidth="800px"
    >
      <HStack p={0} height="50px" gap={1}>
        <Text
          flex="1"
          fontSize="36px"
          fontFamily="Rampart One"
          px={1}
          textAlign="center"
        >
          {num}
        </Text>
        <Box height="100%" width="1px" backgroundColor="gray.500" mx={0} />
        <Text flex="10" p={2} fontSize={{ base: "15px", sm: "18px" }}>
          {text}
        </Text>
      </HStack>
    </Box>
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
                  display="inline-block"
                  animation={`${jumpAnimation} 0.5s ease-in-out ${
                    index * 0.1
                  }s 4`}
                >
                  {char}
                </Text>
              ))}
            </Heading>
            {/* <Text fontSize={26} fontFamily="Not Sans Jp" fontWeight={600}> */}
            <Text
              fontSize={{ base: 24, sm: 26 }}
              fontFamily="Noto Sans Jp"
              fontWeight={600}
            >
              {/* 現場直送の声を、カタチにする */}
              {getMessage({
                ja: "システム開発は、次の時代へ",
                us: "System development is moving to the next era",
                cn: "系统开发进入下一个时代",
                language,
              })}
            </Text>
            {/* <Text fontSize={22} fontFamily="Noto Sans Jp" fontWeight={600}>
              開発の手間をも省く仕組みづくり
            </Text> */}

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
                {getMessage({
                  ja: "このWEBサービスの特徴",
                  us: "Features of this web service",
                  cn: "该网络服务的特点",
                  language,
                })}
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
                    {getMessage({
                      ja: "迅速に対応",
                      us: "Quick response",
                      cn: "快速反应。",
                      language,
                    })}
                  </Heading>
                  <Text pt="2" fontSize="15px">
                    {getMessage({
                      ja: "・疑問や問題をリアルタイムですぐに問い合わせが出来ます",
                      us: "・You can contact us immediately with any questions or problems in real time.",
                      cn: "可以立即实时提出问题和困难。",
                      language,
                    })}
                  </Text>
                  <Text pt="2" fontSize="15px">
                    {getMessage({
                      ja: "・開発スピードが",
                      us: "・Development speed is ",
                      cn: "・......发展速度。",
                      language,
                    })}
                    <Box
                      as="span"
                      onClick={() => handleOpen("hayai")}
                      cursor="pointer"
                      color="blue.500"
                      display="inline-flex"
                      borderBottom="1px solid"
                      mr="2px"
                    >
                      {getMessage({
                        ja: "速い",
                        us: " Fast",
                        cn: "(为时尚早",
                        language,
                      })}
                      <BsQuestionCircle
                        style={{ marginTop: "4px", marginLeft: "2px" }}
                      />
                    </Box>
                    <CustomModal
                      isOpen={activeDrawer === "hayai"}
                      onClose={handleClose}
                      title={getMessage({
                        ja: "開発が速い",
                        us: "Fast Development",
                        cn: "快速发展",
                        language,
                      })}
                      modalBody=<>
                        <Center>
                          <Image
                            src="images/welcome/subscription.svg"
                            width="100px"
                            height="100px"
                          />
                        </Center>
                        <Text>
                          {getMessage({
                            ja: "ハメ図作成システム完成まで3日",
                            us: "3 days to complete the frame drawing system.",
                            cn: "3 天完成框架图系统。",
                            language,
                          })}
                          <br />
                          {getMessage({
                            ja: "配策経路作成機能の追加まで5日",
                            us: "5 days to add the ability to create a route for the allocation of measures.",
                            cn: "5 天内增加创建配送路线的功能。",
                            language,
                          })}
                          <br />
                          {getMessage({
                            ja: "※どちらも現場で使えるようになるまでの日数",
                            us: "*Number of days until both are ready for use in the field.",
                            cn: "* 两种设备均可在现场使用的天数。",
                            language,
                          })}
                          <br />
                          <br />
                          {getMessage({
                            ja: "※目安として通常の6倍程速く作成できます。",
                            us: "*As a rough guide, it can be created about 6 times faster than usual.",
                            cn: "*作为指南，它的创建速度比正常速度快六倍左右。",
                            language,
                          })}
                        </Text>
                      </>
                    />
                  </Text>
                  <Text pt="2" fontSize="15px">
                    ・
                    <Box
                      as="span"
                      onClick={() => handleOpen("teigaku")}
                      cursor="pointer"
                      color="blue.500"
                      display="inline-flex"
                      borderBottom="1px solid"
                      mr="2px"
                    >
                      {getMessage({
                        ja: "定額",
                        us: "fixed amount. ",
                        cn: "定额。",
                        language,
                      })}
                      <BsQuestionCircle
                        style={{ marginTop: "4px", marginLeft: "2px" }}
                      />
                    </Box>
                    <CustomModal
                      isOpen={activeDrawer === "teigaku"}
                      onClose={handleClose}
                      title={getMessage({
                        ja: "定額",
                        us: "fixed amount",
                        cn: "定额",
                        language,
                      })}
                      modalBody=<>
                        <Center>
                          <Image
                            src="images/welcome/subscription.svg"
                            width="100px"
                            height="100px"
                          />
                        </Center>
                        <Text>
                          {getMessage({
                            ja: "以前は依頼されてから見積書が承認されてから対応していました。しかし、承認まで1ヶ月程かかって対応が遅くなっていました。特に不具合の場合には現場が困っていました。",
                            us: "Previously, we used to respond only after a request was made and a quote was approved. However, it took about a month to get approval, which slowed down our response. The field was troubled, especially in the case of defects.",
                            cn: "以前，我们只有在提出要求和报价获得批准后才会做出回应。然而，获得批准需要大约一个月的时间，这就拖慢了回复速度。网站很麻烦，尤其是在出现缺陷的情况下。",
                            language,
                          })}
                          <br />
                          <br />
                          {getMessage({
                            ja: "定額にする事で連絡が来たらすぐに対応する事が可能です。プログラムが大きくなると定期的に書き直しを行います。",
                            us: "By making it a fixed price, we can respond as soon as we are contacted. As the program grows, we will rewrite it periodically.",
                            cn: "通过固定价格，我们可以在接到联系后立即做出回应。随着计划的发展，我们将定期改写计划。",
                            language,
                          })}
                          <br />
                          <br />
                          {getMessage({
                            ja: "※新しいアプリ開発や大きい機能追加の場合には別途見積を出させて頂く場合があります。(48Hを超えそうな場合)",
                            us: "*We may provide a separate estimate for new application development or large function additions. (If it is likely to exceed 48h)",
                            cn: "*如需开发新的应用程序或增加大量功能，可另行估算。(如果可能超过 48 小时）",
                            language,
                          })}
                        </Text>
                      </>
                    />
                    {getMessage({
                      ja: "だからすぐに対応する事が可能です",
                      us: "So we can respond immediately.",
                      cn: "这样我们就能立即做出反应。",
                      language,
                    })}
                  </Text>
                </Box>

                <Box>
                  <Heading size="sm" textTransform="uppercase" fontWeight={600}>
                    {getMessage({
                      ja: "依頼が簡単",
                      us: "Easy to request",
                      cn: "易于调试",
                      language,
                    })}
                  </Heading>
                  <Text pt="2" fontSize="15px">
                    {getMessage({
                      ja: "・システム開発依頼書や仕様書を用意する必要はありません",
                      us: "・No need to prepare a system development request or specifications.",
                      cn: "・无需准备系统开发申请或规格说明。",
                      language,
                    })}
                    <br />
                    <Box as="span" ml={3.5}>
                      {getMessage({
                        ja: "リアルタイムチャットから業務の問題を教えてください",
                        us: "Tell us about your business problems from real-time chat.",
                        cn: "通过实时聊天了解您的业务问题。",
                        language,
                      })}
                    </Box>
                    <br />
                    <Box as="span" ml={3.5}>
                      {getMessage({
                        ja: "解決するアイデアを提案します",
                        us: "We propose ideas to solve the problem.",
                        cn: "提出解决方案。",
                        language,
                      })}
                    </Box>
                  </Text>
                </Box>
                <Box>
                  <Heading size="sm" textTransform="uppercase" fontWeight={600}>
                    {getMessage({
                      ja: "安価に提供",
                      us: "Offered at a low price",
                      cn: "以低廉的价格提供",
                      language,
                    })}
                  </Heading>
                  <Text pt="2" fontSize="15px">
                    {getMessage({
                      ja: "・移動時間がないので低価格を実現しています",
                      us: "・Low price due to no travel time",
                      cn: "・由于没有旅行时间，价格低廉",
                      language,
                    })}
                    <br />
                    {getMessage({
                      ja: "・エンジニアを雇用する",
                      us: "・You can hire an engineer without ",
                      cn: "・聘用工程师。",
                      language,
                    })}
                    <Box
                      as="span"
                      onClick={() => handleOpen("chrome")}
                      cursor="pointer"
                      color="blue.500"
                      display="inline-flex"
                      borderBottom="1px solid"
                      mx="2px"
                    >
                      {getMessage({
                        ja: "高額な人件費",
                        us: " incurring high labor costs.",
                        cn: "劳动力成本高",
                        language,
                      })}
                      <BsQuestionCircle
                        style={{ marginTop: "4px", marginLeft: "2px" }}
                      />
                    </Box>
                    <CustomModal
                      isOpen={activeDrawer === "chrome"}
                      onClose={handleClose}
                      title={getMessage({
                        ja: "エンジニア雇用の人件費",
                        us: "Labor costs of hiring engineers",
                        cn: "聘用工程师的劳动力成本",
                        language,
                      })}
                      modalBody=<>
                        <Text>
                          {getMessage({
                            ja: "40-60万円/月が相場(日本)。通常はワイヤーハーネスの知識は無いので勉強してもらうか仲介役が必要になります。特にシステムを連携させる前提で作成するには知識が必要で、作成したシステムが他のシステムと連携できない事になりがちです。",
                            us: "400,000-600,000 yen/month is the market price (Japan). Usually, there is no knowledge of wiring harnesses, so it is necessary to have someone study or act as an intermediary. In particular, knowledge is required to create a system on the premise that it will be linked with other systems, which tends to result in the created system not being able to be linked with other systems.",
                            cn: "400 000-600 000 日元/月是市场价格（日本）。通常没有线束方面的知识，因此需要学习，或者需要中介。特别需要的知识是在可以连接的前提下创建系统，这往往会导致创建的系统无法与其他系统连接。",
                            language,
                          })}
                        </Text>
                      </>
                    />
                    {getMessage({
                      ja: "が不要です",
                      us: "",
                      cn: "不需要。",
                      language,
                    })}
                  </Text>
                </Box>
                <Box>
                  <Heading size="sm" textTransform="uppercase" fontWeight={600}>
                    {getMessage({
                      ja: "プログラムの共有",
                      us: "Program Sharing",
                      cn: "计划共享",
                      language,
                    })}
                  </Heading>
                  <Text pt="2" fontSize="15px">
                    {getMessage({
                      ja: "・参加している全ての工場で最新のプログラムを使用できます",
                      us: "・All factories participating in this web service can use the latest program.",
                      cn: "・所有参与工厂均可获得最新计划。",
                      language,
                    })}
                  </Text>
                  <Text pt="2" fontSize="15px">
                    {getMessage({
                      ja: "・これにより更に効果的な生産性向上が図れます",
                      us: "・This will further improve productivity.",
                      cn: "・这将进一步提高生产率。",
                      language,
                    })}
                  </Text>
                  <Text pt="2" fontSize="15px">
                    {getMessage({
                      ja: "※他工場での使用を許可しない事も可能です",
                      us: "*It is also possible to disallow use at other factories.",
                      cn: "*可以禁止在其他植物中使用。",
                      language,
                    })}
                    <Box as="span" fontSize="13px" ml="4px">
                      {getMessage({
                        ja: "※新規開発の場合のみ",
                        us: "*Only for new development",
                        cn: "*仅适用于新开发项目。",
                        language,
                      })}
                    </Box>
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Text textAlign="center" fontSize="md">
            {getMessage({
              ja: "※基本的にはフルリモートですが必要に応じて伺います",
              us: "*Basically full remote, but we will come to you if necessary.",
              cn: "*基本上是全职远程管理，但必要时会进行访问。",
              language,
            })}
          </Text>

          {renderSection(
            getMessage({
              ja: "提供中の主なプログラム",
              us: "Main programs being offered",
              cn: "提供的主要计划",
              language,
            }),
            14,
            10
          )}

          <Card
            maxW="640px"
            mx="auto"
            mb="8"
            bg="transparent"
            border="1px solid"
          >
            <CardBody>
              <video
                width="100%"
                height="100%"
                style={{ borderRadius: "10px" }}
                loop
                autoPlay
                muted
                playsInline // iOS Safariでのフルスクリーン防止
              >
                <source src="/images/0006/SjpPromotion.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
              <Heading size="md" py="2">
                {getMessage({
                  ja: "生産準備+",
                  us: "PROCUCTION PREPARATION+",
                  cn: "生产准备+",
                  language,
                })}
              </Heading>
              <Stack mt="1" mb="2" spacing="3">
                <Text>
                  {getMessage({
                    ja: "製品品番の切り替え時/新規立ち上げ時、生産準備で多くの工数が掛かっていませんか？それを解決する為に作成しました。 約2回/週で更新しています。",
                    us: "Do you spend a lot of man-hours preparing for production when switching product part numbers/starting a new product? We created this system to solve this problem. We update this about 2 times/week.",
                    cn: "在转换产品零件编号/启动新产品时，您是否花费了大量的工时来准备生产？我们为此开发了一种解决方案。 大约每周更新两次。",
                    language,
                  })}
                </Text>
              </Stack>
              <UnderlinedTextWithDrawer
                text=<>
                  <Box
                    as="span"
                    display="inline"
                    _hover={{ textDecoration: "underline" }} // ホバー時にアンダーバーを表示
                  >
                    {getMessage({
                      ja: "ハメ図の作成",
                      us: "Creating frame diagram",
                      cn: "创建框架图",
                      language,
                    })}
                  </Box>
                  <LuPanelRightOpen
                    size="20px"
                    style={{ marginBottom: "-5px", display: "inline" }}
                  />
                </>
                onOpen={() => handleOpen("ハメ図の作成")}
                isOpen={isOpen && activeDrawer === "ハメ図の作成"}
                onClose={handleClose}
                header={getMessage({
                  ja: "ハメ図の作成",
                  us: "Creating frame diagram",
                  cn: "创建框架图",
                  language,
                })}
                size="md"
                children={
                  <Box>
                    <video
                      width="100%"
                      height="100%"
                      loop
                      autoPlay
                      muted
                      playsInline
                    >
                      <source
                        src="/images/0006/selectSjpMenu.mp4"
                        type="video/mp4"
                      />
                      {getMessage({
                        ja: "お使いのブラウザは動画タグをサポートしていません。",
                        us: "Your browser does not support video tags.",
                        cn: "您的浏览器不支持视频标记。",
                        language,
                      })}
                    </video>
                    <Text mt={4}>
                      {getMessage({
                        ja: "作成メニューで選択して作成します",
                        us: "Select in the Create menu to create",
                        cn: "在创建菜单中选择创建",
                        language,
                      })}
                    </Text>
                    <Text mt={4}>
                      {getMessage({
                        ja: "組み合わせは",
                        us: "The combination is ",
                        cn: "组合是",
                        language,
                      })}
                      <span style={{ fontWeight: "600" }}>
                        {getMessage({
                          ja: "52920パターン",
                          us: "52920Patterns.",
                          cn: "52920 图案。",
                          language,
                        })}
                      </span>
                      <br />
                      {getMessage({
                        ja: "(2024/11/20現在)",
                        us: "(as of 11/20/20/2024)",
                        cn: "(截至 2024 年 11 月 20 日）。",
                        language,
                      })}
                    </Text>
                    <Text fontWeight="600" mt={4}>
                      {getMessage({
                        ja: "システムの要点",
                        us: "System Essentials",
                        cn: "系统要点",
                        language,
                      })}
                    </Text>
                    <Text>
                      {getMessage({
                        ja: "製造拠点によってニーズが異なる為、選択式にしました。",
                        us: "Since different manufacturing sites have different needs, we have made it a choice type.",
                        cn: "由于不同的生产基地有不同的需求，该系统具有选择性。",
                        language,
                      })}
                    </Text>
                  </Box>
                }
              />
              <br />
              <UnderlinedTextWithDrawer
                text=<>
                  <Box
                    as="span"
                    display="inline"
                    _hover={{ textDecoration: "underline" }} // ホバー時にアンダーバーを表示
                  >
                    {getMessage({
                      ja: "配策誘導ナビv3.1(iPad対応)",
                      us: "Guidance Navigation v3.1 (for iPad)",
                      cn: "作业指导导航 v3.1（与 iPad 兼容）",
                      language,
                    })}
                  </Box>
                  <LuPanelRightOpen
                    size="20px"
                    style={{ marginBottom: "-5px", display: "inline" }}
                  />
                </>
                onOpen={() => handleOpen("配策誘導ナビモバイル")}
                isOpen={isOpen && activeDrawer === "配策誘導ナビモバイル"}
                onClose={handleClose}
                header={getMessage({
                  ja: "配策誘導ナビv3.1(iPad対応)",
                  us: "Guidance Navigation v3.1 (for iPad)",
                  cn: "作业指导导航 v3.1（与 iPad 兼容）",
                  language,
                })}
                size="xl"
                children={
                  <Box>
                    <IframeDisplay src="/56v3.1_" width="100%" />
                    <Text mt={4}></Text>
                    <Text>
                      {getMessage({
                        ja: "配策誘導をタッチ操作に対応してiPadのようなモバイル端末でも操作できるようにしました。上の画面で電線や端末をタッチ/クリックしてみてください。",
                        us: "We have made the distribution guidance compatible with touch operation so that it can be operated on mobile devices such as the iPad. Try touching/clicking on the wires and terminals in the screen above.",
                        cn: "配电指导现在可以触摸操作，因此可以在 iPad 等移动设备上操作。触摸/点击上图中的电线和端子。",
                        language,
                      })}
                    </Text>
                    <Text>
                      {getMessage({
                        ja: "現在は表示のみですが、サブ形態の変更などの機能拡張が見込めます。",
                        us: "Currently, it is only for display, but we expect to expand the functionality, such as changing the sub form.",
                        cn: "目前，它仅用于显示，但预计会进行功能扩展，例如更改子表单。",
                        language,
                      })}
                    </Text>
                  </Box>
                }
              />
              <br />
              <UnderlinedTextWithDrawer
                text=<>
                  <Box
                    as="span"
                    display="inline"
                    _hover={{ textDecoration: "underline" }} // ホバー時にアンダーバーを表示
                  >
                    {getMessage({
                      ja: "MKEDへの回路符号入力",
                      us: "Circuit code input to MKED",
                      cn: "输入 MKED 的电路代码",
                      language,
                    })}
                  </Box>
                  <LuPanelRightOpen
                    size="20px"
                    style={{ marginBottom: "-5px", display: "inline" }}
                  />
                </>
                onOpen={() => handleOpen("MKEDへの回路符号入力")}
                isOpen={isOpen && activeDrawer === "MKEDへの回路符号入力"}
                onClose={handleClose}
                header={getMessage({
                  ja: "MKEDへの回路符号入力",
                  us: "Circuit code input to MKED",
                  cn: "输入 MKED 的电路代码",
                  language,
                })}
                size="md"
                children={
                  <Box>
                    <video
                      width="100%"
                      height="100%"
                      loop
                      autoPlay
                      muted
                      playsInline
                    >
                      <source src="/images/0006/v4220.mp4" type="video/mp4" />
                      {getMessage({
                        ja: "お使いのブラウザは動画タグをサポートしていません。",
                        us: "Your browser does not support video tags.",
                        cn: "您的浏览器不支持视频标记。",
                        language,
                      })}
                    </video>
                    <Text mt={4}></Text>
                    <Text>
                      {getMessage({
                        ja: "生産準備+からMKEDを制御して入力時間を省きます。",
                        us: "Control MKED from Production Preparation+ to save input time.",
                        cn: "通过 Production Preparation+ 控制 MKED 节省输入时间。",
                        language,
                      })}
                    </Text>
                    <Text>
                      {getMessage({
                        ja: "※EasyCheckerも対応が可能です。",
                        us: "*EasyChecker is also available.",
                        cn: "*还可支持*EasyChecker。",
                        language,
                      })}
                    </Text>
                  </Box>
                }
              />
              <Divider borderColor="grya.500" my="3" />
              <Box lineHeight="1">
                <Badge
                  colorScheme="purple"
                  variant="solid"
                  display="inline-block"
                  p="1"
                  mb="3"
                >
                  {getMessage({
                    ja: "目安効果",
                    us: "Objective effect",
                    cn: "客观效果",
                    language,
                  })}
                </Badge>
              </Box>
              <SjpChart01 language={language} />
            </CardBody>
          </Card>

          <Card
            maxW="640px"
            mx="auto"
            mb="8"
            bg="transparent"
            border="1px solid"
          >
            <CardBody>
              <Box
                maxWidth="600px"
                height="125px"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Skeleton width="100%" height="100%" borderRadius="10px" />
                <Text position="absolute" textAlign="center">
                  作成中...
                </Text>
              </Box>
              <Heading size="md" py="2">
                部材一覧+
              </Heading>
              <Stack mt="1" mb="2" spacing="3">
                <Text>
                  <br />
                  製品品番毎の部材一覧表を作成
                  <br />
                  ※製品品番と設変を入力してボタンを押すだけで更新可能。通常は年に一回だけ更新すると思いますが毎日でも更新が可能です。
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter pt="3">
              <Box lineHeight="1">
                <Badge
                  colorScheme="purple"
                  variant="solid"
                  display="inline-block"
                  p="1"
                  mb="3"
                >
                  効果目安
                </Badge>
                <Text fontSize="xl">特に部材手配をする部署の切替で有効</Text>
              </Box>
            </CardFooter>
          </Card>

          <Card
            maxW="640px"
            mx="auto"
            mb="3"
            bg="transparent"
            border="1px solid"
          >
            <CardBody>
              <Box
                maxWidth="600px"
                height="125px"
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Skeleton width="100%" height="100%" borderRadius="10px" />
                <Text position="absolute" textAlign="center">
                  作成中...
                </Text>
              </Box>
              <Heading size="md" py="2">
                順立生産システム+
              </Heading>
              <Stack mt="1" mb="2" spacing="3">
                <Text>
                  <br />
                  宮崎部品が開発した3種類の順立生産システムを1つにまとめて更に機能を追加したものです。
                  ACCESSなので色々と問題を含んでいてVB.netで作り直しています。
                  <br />
                  ※2月を目処に完成予定
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter pt="3">
              <Box lineHeight="1">
                <Badge
                  colorScheme="purple"
                  variant="solid"
                  display="inline-block"
                  p="1"
                  mb="3"
                >
                  効果
                </Badge>
                <Text fontSize="xl">
                  一貫工程の生産指示をSSC/自動機/忘れん棒セット等の機械で共有
                </Text>
              </Box>
            </CardFooter>
          </Card>

          <Text textAlign="center">
            その他のアプリも共有できるように修正中です
          </Text>

          {renderSection("WEBサービスの機能", 14, 10)}
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
                </Text>,
                "/download"
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
                </Text>,
                "/skillBlogs/0000"
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
                </Text>,
                "/BBS"
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
                </Text>,
                "/roadMap"
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
                </Text>,
                "/app/typing"
              )}
            </Flex>
          </Center>
          <Box textAlign="center">
            <Text textAlign="center" mt={3} lineHeight={2}>
              必要な機能があれば追加していきます
            </Text>
          </Box>

          {renderSection("ご利用の流れ", 14, 0)}
          <Text textAlign="center" mb={10}>
            〜生産準備+に機能追加の場合〜
          </Text>
          {ChatInquiryCard(
            "1",
            <Text>チャットで問い合わせる</Text>,
            <BsChatLeftText size={40} />,
            <Text>稼働日の8:00 - 17:00は即日の回答を行います</Text>,
            true
          )}
          {ChatInquiryCard(
            "2",
            <Text>チャットで仕様を検討する</Text>,
            <BsChatRightText size={40} />,
            <>
              <Text>およそ数回のやりとりで仕様は決定します</Text>
              <Text fontSize={{ base: "10px", sm: "14px" }}>
                ※過去半年の実績
              </Text>
            </>,
            true
          )}
          {ChatInquiryCard(
            "3",
            <Text>待つ</Text>,
            <FaLaptopCode size={40} />,
            <>
              <Text>約6時間後に完成してアップロードします</Text>
              <Text fontSize={{ base: "10px", sm: "14px" }}>
                ※過去半年の実績(1〜56時間)の平均値
              </Text>
            </>,
            true
          )}
          {ChatInquiryCard(
            "4",
            <Text>ダウンロードして動作確認</Text>,
            <VscChecklist size={40} />,
            <>
              <Text>依頼内容が意図したものだったかを確認</Text>
              <Text fontSize={{ base: "10px", sm: "14px" }}>
                ※もし違う場合は
                <Box
                  as="span"
                  fontFamily="Rampart One"
                  fontSize={{ base: "14px", sm: "18px" }}
                  mx={1}
                >
                  1
                </Box>
                に戻ります
              </Text>
            </>,
            true
          )}
          {ChatInquiryCard(
            "5",
            <Text>結果の報告</Text>,
            <FaRegThumbsUp size={40} />,
            <>
              <Text>実際に使ってみた感想や考察などを連絡</Text>
              <Text fontSize={{ base: "10px", sm: "14px" }}>
                ※結果連絡をお願いします
              </Text>
            </>,
            false
          )}
          <Text textAlign="center" mb={10}>
            月末に活動レポートをまとめてメール連絡します
          </Text>

          {renderSection("成長する仕組み", 14, 1)}
          <Text textAlign="center" mb={10}>
            このWEBサイトを中心にシステムを更新していきます
          </Text>
          <Center>
            <Box
              style={{ paddingTop: "30px", fontFamily: "Noto Sans JP" }}
              justifyContent="center"
              alignItems="center"
              width="100%"
              maxWidth="600px"
            >
              <Center>
                <Card
                  width={{
                    base: "100%",
                    sm: "40%",
                    md: "30%",
                    lg: "30%",
                    xl: "30%",
                  }}
                  maxW="280px"
                  minW="280px"
                  p={2}
                  backgroundColor="transparent"
                  border="1px solid"
                  borderColor="gray.500"
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                >
                  <CardHeader p={2}>
                    <Text fontSize="20px">STUDIO+</Text>
                  </CardHeader>
                  <CardBody p={2}>
                    <Text>このWEBサービス</Text>
                  </CardBody>
                </Card>
              </Center>

              <SimpleGrid
                columns={{ base: 2, md: 2 }}
                spacing={2}
                justifyContent="center"
              >
                <HStack
                  justifyContent="center"
                  my={2}
                  ml={-8}
                  position="relative"
                >
                  <Icon
                    as={BsArrowUp}
                    fontSize="40px"
                    transform="rotate(215deg)"
                  />
                  <Text
                    position="absolute"
                    top="50%"
                    left="50%"
                    fontSize="14px"
                    transform="translate(10%, -50%)"
                    // textShadow="1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white"
                  >
                    ダウンロード
                  </Text>
                </HStack>
                <HStack
                  justifyContent="center"
                  mx={0}
                  my={2}
                  ml={2}
                  pl={10}
                  position="relative"
                >
                  <Text
                    position="absolute"
                    top="50%"
                    left="50%"
                    fontSize="14px"
                    transform="translate(-100%, -50%)"
                    // textShadow="1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white"
                  >
                    アップロード
                  </Text>
                  <Icon
                    as={BsArrowUp}
                    fontSize="40px"
                    transform="rotate(315deg)"
                  />
                </HStack>
              </SimpleGrid>
              <Grid
                templateColumns="3fr 1fr 3fr" // カラムの幅を指定
                justifyContent="center"
              >
                <Card
                  width="100%"
                  maxW="280px"
                  p={2}
                  backgroundColor="transparent"
                  border="1px solid"
                  borderColor="gray.500"
                  textAlign="center"
                  justifyContent="center"
                  cursor="pointer"
                  _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                  flex="4"
                >
                  <CardHeader p={2}>
                    <Text fontSize="20px">各工場</Text>
                  </CardHeader>
                  <CardBody p={0}>
                    <Text>問題点を見つける</Text>
                  </CardBody>
                </Card>
                <VStack justifyContent="center" my={2} flex="1">
                  <Icon
                    as={BsArrowDownUp}
                    fontSize="40px"
                    transform="rotate(90deg)"
                  />
                  <Text>相談</Text>
                </VStack>
                <Card
                  width="100%"
                  maxW="280px"
                  p={2}
                  backgroundColor="transparent"
                  border="1px solid"
                  borderColor="gray.500"
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                  flex="4"
                >
                  <CardHeader p={2}>
                    <Text fontSize="20px">開発担当</Text>
                  </CardHeader>
                  <CardBody p={0}>
                    <Text>総合的に開発</Text>
                  </CardBody>
                </Card>
              </Grid>
            </Box>
          </Center>

          {renderSection("最終目標までのステップ", 14, 10)}
          <Box
            display="flex"
            flexDirection="column" // 縦方向に配置
            justifyContent="center"
            alignItems="center"
            mt={10}
            width="100%"
          >
            <VStack
              spacing={4}
              align="center"
              bg="transparent"
              width="100%"
              maxWidth="600px"
            >
              {StepRender(1, "このサービスを安定運用する(テスト済み)")}
              {StepRender(2, "参加してくれる工場を増やす")}
              {StepRender(3, "色々な工場の意見を基にシステムを成長させる")}
              {StepRender(4, "グループ全体の生産性が上がる")}
              {StepRender(5, "開発メンバーを増やす")}
              {StepRender(
                6,
                "発起人がこのサービスを離れても成長し続ける仕組みを作る"
              )}
            </VStack>
          </Box>

          {renderSection("導入までの流れ", 14, 10)}
          <Box
            display="flex"
            flexDirection="column" // 縦方向に配置
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <VStack
              spacing={4}
              align="center"
              bg="transparent"
              width="100%"
              maxWidth="520px"
            >
              {IntroductionRender(
                1,
                "teppy@au.comにメール連絡する(または紹介)"
              )}
              {IntroductionRender(
                2,
                "契約書がメールで届くので社内で検討をお願いします"
              )}
              {IntroductionRender(
                3,
                "契約後、初回導入時は伺ってフォローを行います"
              )}
            </VStack>
          </Box>

          <Box height="180px"></Box>
          <Text textAlign="center" fontSize="md">
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
