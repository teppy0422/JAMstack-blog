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
  keyframes,
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

import "@fontsource/dela-gothic-one";
import "@fontsource/rampart-one";

export const getServerSideProps = async (context) => {
  const { query } = context;
  return {
    props: {
      isNewCreated: query.isNewCreated || null, // クエリパラメータを取得
    },
  };
};

import getMessage from "../components/getMessage";
import { useLanguage } from "../context/LanguageContext";

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

    const totalDays = getMessage({
      ja: `${years > 0 ? years + "年" : ""}${months}ヶ月${days}日`,
      us: `${
        years > 0 ? years + " years, " : ""
      }${months} months, ${days} days`,
      cn: `${years > 0 ? years + "年" : ""}${months}个月${days}天`,
      language,
    });
    return {
      elapsedTime: `2024/7/10 - ${formattedToday}`,
      totalDays,
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
          fontFamily={getMessage({
            ja: "Dela Gothic One",
            us: "Dela Gothic One",
            cn: "Noto Sans Jp",
            language,
          })}
          fontSize="28px"
          letterSpacing="0.1em"
          lineHeight={0.9}
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
              lineHeight="1.2"
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
        fontFamily={getMessage({
          ja: "Rampart One",
          us: "Rampart One",
          cn: "Noto Sans Jp",
          language,
        })}
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
        <Text
          flex="10"
          p={2}
          fontSize={{ base: "15px", sm: "18px" }}
          lineHeight={1.2}
        >
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
        <Text
          flex="10"
          p={2}
          fontSize={{ base: "15px", sm: "18px" }}
          lineHeight={1.2}
        >
          {text}
        </Text>
      </HStack>
    </Box>
  );

  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true} maxWidth="1200px">
        <Box
          style={{
            paddingTop: "30px",
            fontFamily: getMessage({
              ja: "Noto Sans JP",
              us: "Noto Sans JP",
              cn: "Noto Sans SC",
              language,
            }),
          }}
        >
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
                <Text fontSize="lg">
                  {getMessage({
                    ja: "アカウント作成が完了しました",
                    us: "Your account has been created.",
                    cn: "账户创建完成",
                    language,
                  })}
                </Text>
                <Text fontSize="lg" alignItems="center">
                  {getMessage({
                    ja: "右上の",
                    us: "",
                    cn: "右上角",
                    language,
                  })}
                  {language === "ja" ||
                    (language === "cn" && (
                      <Avatar
                        size="xs"
                        src="https://bit.ly/broken-link"
                        mx={1}
                      />
                    ))}
                  {getMessage({
                    ja: "からログインしてください",
                    us: "Please log in from",
                    cn: "请从",
                    language,
                  })}
                  {language === "us" && (
                    <Avatar size="xs" src="https://bit.ly/broken-link" mx={1} />
                  )}
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
                    {getMessage({
                      ja: "右上の",
                      us: "",
                      cn: "右上角",
                      language,
                    })}
                    {language === "ja" ||
                      (language === "cn" && (
                        <Avatar
                          size="xs"
                          src="https://bit.ly/broken-link"
                          mx={1}
                        />
                      ))}
                    {getMessage({
                      ja: "からアカウントを新規作成/またはログインしてください",
                      us: "Please create a new account/login from ",
                      cn: "创建新账户/或从",
                      language,
                    })}
                    {language === "us" && (
                      <Avatar
                        size="xs"
                        src="https://bit.ly/broken-link"
                        mx={1}
                      />
                    )}
                  </Text>
                )}
                {userName === null && (
                  <Text
                    fontSize="lg"
                    color={colorMode === "light" ? "red" : "orange"}
                  >
                    {getMessage({
                      ja: "アカウントが認証されていません。管理者に連絡して認証を行なってください",
                      us: "Your account has not been verified. Please contact your administrator to authenticate.",
                      cn: "您的账户尚未授权。请联系您的管理员进行验证",
                      language,
                    })}
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
                  <Text mr={2}>
                    {getMessage({
                      ja: "右上のアイコンからログインしてください",
                      us: "Please log in using the icon in the upper right corner.",
                      cn: "请通过右上角的图标登录",
                      language,
                    })}
                  </Text>
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
                      cn: "・可以立即实时提出问题和困难。",
                      language,
                    })}
                  </Text>
                  <Text pt="2" fontSize="15px">
                    {getMessage({
                      ja: "・開発スピードが",
                      us: "・Development speed is ",
                      cn: "・开发速度",
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
                        cn: " 快",
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
                        cn: "定额",
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
                    cn: "在转换产品零件编号/启动新产品时。您是否花费了大量的工时来准备生产？我们为此开发了一种解决方案。 大约每周更新两次。",
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
                          ja: "52920 パターン",
                          us: "52920 Patterns.",
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
                        cn: "通过 生产准备+ 控制 MKED 节省输入时间。",
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
                  {getMessage({
                    ja: "準備中...",
                    us: "Under Preparation...",
                    cn: "準備中...",
                    language,
                  })}
                </Text>
              </Box>
              <Heading size="md" py="2">
                {getMessage({
                  ja: "部材一覧+",
                  us: "Part List+",
                  cn: "组件清单+",
                  language,
                })}
              </Heading>
              <Stack mt="1" mb="2" spacing="3">
                <Text>
                  {getMessage({
                    ja: "製品品番毎の部材一覧表を作成",
                    us: "Create a parts list by product part number.",
                    cn: "按产品零件编号创建组件列表。",
                    language,
                  })}
                  <br />
                  {getMessage({
                    ja: "※製品品番と設変を入力してボタンを押すだけで作成/更新が可能。通常は年に一回だけ更新すると思いますが毎日でも更新が可能です。",
                    us: "*Creation/updating can be done by simply entering the product part number and the change and pressing a button. Normally, you would update only once a year, but you can also update daily.",
                    cn: "*只需输入产品部件号和设计变更并按下按钮，即可创建/更新。通常每年只需更新一次，但也可以每天更新。",
                    language,
                  })}
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
                  {getMessage({
                    ja: "目安効果",
                    us: "Objective effect",
                    cn: "客观效果",
                    language,
                  })}
                </Badge>
                <Text fontSize="xl">
                  {getMessage({
                    ja: "特に部材手配をする部署の製品切替時に有効",
                    us: "Particularly effective when switching products in the department that arranges parts and materials.",
                    cn: "特别适用于排列部件的部门进行产品更换。",
                    language,
                  })}
                </Text>
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
                  {getMessage({
                    ja: "準備中...",
                    us: "Under Preparation...",
                    cn: "準備中...",
                    language,
                  })}
                </Text>
              </Box>
              <Heading size="md" py="2">
                {getMessage({
                  ja: "順立生産システム+",
                  us: "Sequenced Production System+",
                  cn: "连续生产系统+",
                  language,
                })}
              </Heading>
              <Stack mt="1" mb="2" spacing="3">
                <Text>
                  <br />
                  {getMessage({
                    ja: "宮崎部品が開発した3種類の順立生産システムを1つにまとめて更に機能を追加したものです。現在はACCESSベースで色々と問題を含んでいてVB.netで作り直しています。",
                    us: "This is a combination of three different sequential production systems developed by Miyazaki Parts, with further functionality added. Currently, the system is based on ACCESS and contains various problems, so it is being reworked in VB.net.",
                    cn: "它将 宮崎部品 开发的三种不同的顺序生产系统合而为一，并增加了更多的功能。该系统目前基于 ACCESS 存在各种问题，因此正在用 VB.net 进行重建。",
                    language,
                  })}
                  <br />
                  {getMessage({
                    ja: "※2024年2月を目処に完成予定",
                    us: "*Expected to be completed by February 2024.",
                    cn: "*将于 2024 年 2 月完成。",
                    language,
                  })}
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
                  {getMessage({
                    ja: "効果",
                    us: "Effect",
                    cn: "影响",
                    language,
                  })}
                </Badge>
                <Text fontSize="xl">
                  {getMessage({
                    ja: "一貫工程の生産指示をSSC/自動機/忘れん棒セット等の機械で共有",
                    us: "Share production instructions for consistent processes with SSC/automatic machines/forgotten bar sets and other machines",
                    cn: "由 SSC/自动机器/遗忘条组和其他机器共享一致流程的生产指令",
                    language,
                  })}
                </Text>
              </Box>
            </CardFooter>
          </Card>

          <Text textAlign="center">
            {getMessage({
              ja: "その他のアプリも共有できるように修正中です",
              us: "Other apps are being modified to share as well.",
              cn: "其他应用程序正在进行修改，以允许共享。",
              language,
            })}
          </Text>

          {renderSection(
            getMessage({
              ja: "おすすめプログラム",
              us: "Recommended Programs",
              cn: "建议的计划",
              language,
            }),
            14,
            1
          )}
          <Text textAlign="center" mb={6}>
            {getMessage({
              ja: "昔に作成した事があるプログラムです",
              us: "It's a program I've created in the past.",
              cn: "这是我过去制作的一个节目。",
              language,
            })}
            <br />
            {getMessage({
              ja: "依頼があれば作成します",
              us: "Will create upon request.",
              cn: "应要求编写。",
              language,
            })}
            <br />
            {getMessage({
              ja: "1ヶ月以内に完成すると思います",
              us: "I expect it to be completed within a month.",
              cn: "应在一个月内完成。",
              language,
            })}
          </Text>

          <Card
            maxWidth="550px"
            mx="auto"
            bg="transparent"
            border="1px solid"
            borderColor="gray.500"
          >
            <Divider />
            <CardBody p={4}>
              <Stack
                divider={<StackDivider borderColor="gray.500" />}
                spacing="4"
              >
                <Box>
                  <Heading size="sm" textTransform="uppercase" fontWeight={600}>
                    {getMessage({
                      ja: "準完計画の自動立案",
                      us: "Automatic planning of semi-completion plans",
                      cn: "自动半完成规划",
                      language,
                    })}
                  </Heading>
                  <Divider
                    mt="4"
                    borderColor={colorMode === "light" ? "black" : "white"}
                  />
                  <Text pt="2" fontSize="15px">
                    {getMessage({
                      ja: "1.生産リードタイムと稼働日程を手入力",
                      us: "1.Manual input of production lead time and operating schedule",
                      cn: "1.手动输入生产准备时间和运行时间表",
                      language,
                    })}
                  </Text>
                  <Text pt="1" fontSize="15px">
                    {getMessage({
                      ja: "2.在庫と内示から準完計画を自動立案",
                      us: "2.Automatic planning of semi-completion plans based on inventory and unofficial orders",
                      cn: "2.根据库存和非正式报价自动进行半成品规划",
                      language,
                    })}
                  </Text>
                  <Text pt="1" fontSize="15px">
                    {getMessage({
                      ja: "3.手動で調整する",
                      us: "3.Manual adjustment",
                      cn: "3.手动调节",
                      language,
                    })}
                  </Text>
                  <Text pt="1" fontSize="15px">
                    {getMessage({
                      ja: "4.EXTESへの自動出力",
                      us: "4.Automatic output to EXTES",
                      cn: "4.自动输出到 EXTES",
                      language,
                    })}
                  </Text>
                  <Text pt="1" fontSize="15px">
                    {getMessage({
                      ja: "5.DDとの照合でアンマッチが無いかを自動チェック",
                      us: "5.Automatic check for unmatch against DD",
                      cn: "5.自动检查 DD 是否不匹配",
                      language,
                    })}
                  </Text>
                  <Text pt="1" fontSize="15px">
                    {getMessage({
                      ja: "6.組立工程向けの準完計画を自動作成",
                      us: "6.Automatic creation of semi-complete plans for assembly processes",
                      cn: "6.自动创建装配过程的半完整计划",
                      language,
                    })}
                  </Text>
                  <Divider
                    mt="2"
                    borderColor={colorMode === "light" ? "black" : "white"}
                  />
                  <Text pt="3" fontSize="15px">
                    {getMessage({
                      ja: "毎月：稼働日程の入力",
                      us: "Monthly: Input of operating schedule",
                      cn: "每月：输入运行日期",
                      language,
                    })}
                    <br />
                    {getMessage({
                      ja: "毎日：準完計画の更新",
                      us: "Daily: Update on semi-complete plan",
                      cn: "每日：半完整计划的最新情况",
                      language,
                    })}
                    <br />
                    {getMessage({
                      ja: "適宜：生産リードタイムの変更",
                      us: "As appropriate: Change in production lead time",
                      cn: "在适当情况下：更改生产周转时间",
                      language,
                    })}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Text textAlign="center">
            {getMessage({
              ja: "特に準完計画は手動では困難なので自動化する事をお勧めします",
              us: "It is recommended to automate the semi-completion plan, especially since it is difficult to do it manually.",
              cn: "半完成计划尤其难以手动完成，因此建议将其自动化",
              language,
            })}
            <br />
            {getMessage({
              ja: "他にも思いついたら追記します",
              us: "I'll add others as I think of them.",
              cn: "如果我还能想到其他的，我会补充进来",
              language,
            })}
          </Text>
          {renderSection(
            getMessage({
              ja: "WEBサービスの機能",
              us: "Web Service Features",
              cn: "网络服务的功能",
              language,
            }),
            14,
            0
          )}
          <Text textAlign="center" mb={10}>
            {getMessage({
              ja: "それぞれ左のメニューからアクセスできます",
              us: "Each can be accessed from the menu on the left",
              cn: "可通过左侧的菜单访问每项内容。",
              language,
            })}
          </Text>
          <Center flex="1" style={{ gap: "8px" }}>
            <Flex wrap="wrap" justify="center" style={{ gap: "24px" }}>
              {renderCard(
                getMessage({
                  ja: "ダウンロード",
                  us: "Download",
                  cn: "下载",
                  language,
                }),
                <Box transform="rotate(270deg)" position="relative" my={1.5}>
                  <IoTicketOutline size={80} />
                </Box>,
                <Text
                  fontFamily="Noto Sans Jp"
                  fontSize="13px"
                  lineHeight={1.4}
                >
                  {getMessage({
                    ja: "プログラムのダウンロードと短い説明動画",
                    us: "Download the program and short instructional videos",
                    cn: "程序下载和教学视频短片",
                    language,
                  })}
                </Text>,
                "/download"
              )}
              {renderCard(
                getMessage({
                  ja: "技術ブログ",
                  us: "Skills Blog",
                  cn: "技术博客",
                  language,
                }),
                <PiGithubLogoLight size={90} />,
                <Text fontSize="13px" lineHeight={1.4}>
                  {getMessage({
                    ja: "プログラムの使い方や技術を紹介",
                    us: "Introduction to program usage and technology.",
                    cn: "介绍计划的使用和技术",
                    language,
                  })}
                  <br />
                  {getMessage({
                    ja: "※自分で更新する方法も追加予定",
                    us: "*We will add a way to update it yourself.",
                    cn: "*我们还将添加一种自行更新的方法。",
                    language,
                  })}
                </Text>,
                "/skillBlogs/0000"
              )}
              {renderCard(
                getMessage({
                  ja: "問い合わせ",
                  us: "Inquiry",
                  cn: "询问",
                  language,
                }),
                <AiOutlineWechat size={90} />,
                <Text
                  fontFamily="Noto Sans Jp"
                  fontSize="13px"
                  lineHeight={1.4}
                >
                  {getMessage({
                    ja: "LINEのようなリアルタイムチャットで分からない事や不具合 / 新機能の追加を相談",
                    us: "Real-time chat like LINE for questions, problems, and new features",
                    cn: "像 微信 一样的实时聊天功能，用于回答问题、疑难杂症或新功能",
                    language,
                  })}
                  ,
                </Text>,
                "/BBS"
              )}
              {renderCard(
                getMessage({
                  ja: "ロードマップ",
                  us: "Road Map",
                  cn: "路线图",
                  language,
                }),
                <MdEditRoad size={90} />,
                <Text
                  fontFamily="Noto Sans Jp"
                  fontSize="13px"
                  lineHeight={1.4}
                >
                  {getMessage({
                    ja: "各プログラムの改良/連携を長期的に進めていく道順の確認",
                    us: "Identification of a long-term path for improvement/coordination of each program",
                    cn: "确定改进/长期合作每项计划的途径。",
                    language,
                  })}
                </Text>,
                "/roadMap"
              )}
              {renderCard(
                getMessage({
                  ja: "その他",
                  us: "Other",
                  cn: "其他",
                  language,
                }),
                <Box my={1.5}>
                  <FaEarthAsia size={75} />
                </Box>,
                <Text
                  fontFamily="Noto Sans Jp"
                  fontSize="13px"
                  lineHeight={1.4}
                >
                  {getMessage({
                    ja: "練習実績が記録できるタイピング練習ソフトなど",
                    us: "Typing practice software that can record practice results, etc.",
                    cn: "可记录练习结果的打字练习软件，例如",
                    language,
                  })}
                </Text>,
                "/app/typing"
              )}
            </Flex>
          </Center>
          <Box textAlign="center">
            <Text textAlign="center" mt={3} lineHeight={2}>
              {getMessage({
                ja: "必要な機能があれば追加していきます",
                us: "We will add any necessary features.",
                cn: "我们将添加任何必要的功能。",
                language,
              })}
            </Text>
          </Box>

          {renderSection(
            getMessage({
              ja: "ご利用の流れ",
              us: "Flow of Use",
              cn: "使用流程",
              language,
            }),
            14,
            0
          )}
          <Text textAlign="center" mb={10}>
            {getMessage({
              ja: "〜生産準備+に機能追加の場合〜",
              us: "〜For additional functionality to Production PREPARATION+〜",
              cn: "~ 生产就绪 + 的附加功能 ~",
              language,
            })}
          </Text>
          {ChatInquiryCard(
            "1",
            <Text>
              {getMessage({
                ja: "チャットで問い合わせる",
                us: "Chat with us",
                cn: "与我们聊天",
                language,
              })}
            </Text>,
            <BsChatLeftText size={40} />,
            <Text>
              {getMessage({
                ja: "稼働日の8:00 - 17:00は即日の回答を行います",
                us: "We will respond on the same day from 8:00 - 17:00 on operating days.",
                cn: "工作日 8:00 - 17:00 将在当天给予答复",
                language,
              })}
            </Text>,
            true
          )}
          {ChatInquiryCard(
            "2",
            <Text>
              {getMessage({
                ja: "チャットで仕様を検討する",
                us: "Chat with us to discuss specifications",
                cn: "聊天讨论规格",
                language,
              })}
            </Text>,
            <BsChatRightText size={40} />,
            <>
              <Text>
                {getMessage({
                  ja: "およそ数回のやりとりで仕様は決定します",
                  us: "Specifications are determined in approximately a few exchanges.",
                  cn: "规格大约在几次交换中决定",
                  language,
                })}
              </Text>
              <Text fontSize={{ base: "10px", sm: "14px" }}>
                {getMessage({
                  ja: "※過去半年の実績",
                  us: "*Actual results for the past six months",
                  cn: "*过去六个月",
                  language,
                })}
              </Text>
            </>,
            true
          )}
          {ChatInquiryCard(
            "3",
            <Text>
              {getMessage({
                ja: "待つ",
                us: "Wait",
                cn: "等待",
                language,
              })}
            </Text>,
            <FaLaptopCode size={40} />,
            <>
              <Text>
                {getMessage({
                  ja: "約6時間後に完成してアップロードします",
                  us: "Completed and uploaded in ~6 hours.",
                  cn: "它将在大约六小时内完成并上传",
                  language,
                })}
              </Text>
              <Text fontSize={{ base: "10px", sm: "14px" }}>
                {getMessage({
                  ja: "※過去半年の実績(1〜56時間)の平均値",
                  us: "*Average actual results (1-56 hrs) over past 6 months",
                  cn: "*过去六个月实际结果（1-56 小时）的平均值。",
                  language,
                })}
              </Text>
            </>,
            true
          )}
          {ChatInquiryCard(
            "4",
            <Text>
              {getMessage({
                ja: "ダウンロードして動作確認",
                us: "Download and check operation",
                cn: "下载并检查操作",
                language,
              })}
            </Text>,
            <VscChecklist size={40} />,
            <>
              <Text>
                {getMessage({
                  ja: "依頼内容が意図したものだったかを確認",
                  us: "Confirm that the request was what was intended.",
                  cn: "确保请求与预期相符",
                  language,
                })}
              </Text>
              <Text fontSize={{ base: "10px", sm: "14px" }}>
                {getMessage({
                  ja: "※もし意図と異なる場合は",
                  us: "*If it is different from your intention",
                  cn: "*如果与意图不同",
                  language,
                })}
                <Box
                  as="span"
                  fontFamily="Rampart One"
                  fontSize={{ base: "14px", sm: "18px" }}
                  mx={1}
                >
                  {getMessage({
                    ja: "1",
                    us: "",
                    cn: "1",
                    language,
                  })}
                </Box>
                {getMessage({
                  ja: "に戻ります",
                  us: "return to",
                  cn: "返回",
                  language,
                })}
                <Box
                  as="span"
                  fontFamily="Rampart One"
                  fontSize={{ base: "14px", sm: "18px" }}
                  mx={1}
                >
                  {getMessage({
                    ja: "",
                    us: "1",
                    cn: "",
                    language,
                  })}
                </Box>
              </Text>
            </>,
            true
          )}
          {ChatInquiryCard(
            "5",
            <Text>
              {getMessage({
                ja: "結果の報告",
                us: "Reporting Results",
                cn: "成果报告",
                language,
              })}
            </Text>,
            <FaRegThumbsUp size={40} />,
            <>
              <Text>
                {getMessage({
                  ja: "実際に使ってみた感想や考察などを連絡",
                  us: "Share your product feedback with us.",
                  cn: "有关实际使用和注意事项的联系信息",
                  language,
                })}
              </Text>
              <Text fontSize={{ base: "10px", sm: "14px" }}>
                {getMessage({
                  ja: "※結果連絡をお願いします",
                  us: "*Please contact me with the results.",
                  cn: "*请将结果与我联系",
                  language,
                })}
              </Text>
            </>,
            false
          )}
          <Text textAlign="center" mb={10} mt={2}>
            {getMessage({
              ja: "月末に活動レポートをまとめてメール連絡します",
              us: "An activity report will be compiled and emailed to you at the end of the month.",
              cn: "活动报告将在月底汇编并通过电子邮件发送给您",
              language,
            })}
          </Text>

          {renderSection(
            getMessage({
              ja: "成長する仕組み",
              us: "Growth Mechanisms",
              cn: "增长机制",
              language,
            }),
            14,
            3
          )}
          <Text textAlign="center" mb={4}>
            {getMessage({
              ja: "このWEBサイトを中心にシステムを更新していきます",
              us: "We will update the system around this web site",
              cn: "该系统将围绕本网站进行更新。",
              language,
            })}
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
                  _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                >
                  <CardHeader p={2}>
                    <Text fontSize="20px">STUDIO+</Text>
                  </CardHeader>
                  <CardBody p={2}>
                    <Text>
                      {getMessage({
                        ja: "このWEBサービス",
                        us: "This Web Service",
                        cn: "该网络服务",
                        language,
                      })}
                    </Text>
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
                    {getMessage({
                      ja: "ダウンロード",
                      us: "Download",
                      cn: "下载",
                      language,
                    })}
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
                    {getMessage({
                      ja: "アップロード",
                      us: "upload",
                      cn: "上传",
                      language,
                    })}
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
                  _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                  flex="4"
                >
                  <CardHeader p={2}>
                    <Text fontSize="20px">
                      {getMessage({
                        ja: "各工場",
                        us: "Each Factory",
                        cn: "各工場",
                        language,
                      })}
                    </Text>
                  </CardHeader>
                  <CardBody p={0}>
                    <Text>
                      {getMessage({
                        ja: "問題点を見つける",
                        us: "Finding the Problem",
                        cn: "发现问题",
                        language,
                      })}
                    </Text>
                  </CardBody>
                </Card>
                <VStack justifyContent="center" my={2} flex="1">
                  <Icon
                    as={BsArrowDownUp}
                    fontSize="40px"
                    transform="rotate(90deg)"
                  />
                  <Text>
                    {getMessage({
                      ja: "相談",
                      us: "Consult",
                      cn: "协商",
                      language,
                    })}
                  </Text>
                </VStack>
                <Card
                  width="100%"
                  maxW="280px"
                  p={2}
                  backgroundColor="transparent"
                  border="1px solid"
                  borderColor="gray.500"
                  textAlign="center"
                  _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                  flex="4"
                >
                  <CardHeader p={2}>
                    <Text fontSize="20px">
                      {getMessage({
                        ja: "開発担当",
                        us: "Development",
                        cn: "发展干事",
                        language,
                      })}
                    </Text>
                  </CardHeader>
                  <CardBody p={0}>
                    <Text>
                      {getMessage({
                        ja: "総合的に開発",
                        us: "Comprehensive development",
                        cn: "全面发展",
                        language,
                      })}
                    </Text>
                  </CardBody>
                </Card>
              </Grid>
            </Box>
          </Center>

          {renderSection(
            getMessage({
              ja: "最終目標までのステップ",
              us: "Steps to the final goal",
              cn: "实现最终目标的步骤",
              language,
            }),
            14,
            10
          )}
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
              {StepRender(
                1,
                getMessage({
                  ja: "このサービスを安定運用する(テスト済み)",
                  us: "Stable operation of this service (tested)",
                  cn: "确保该服务的稳定运行（已测试）",
                  language,
                })
              )}
              {StepRender(
                2,
                getMessage({
                  ja: "参加してくれる工場を増やす",
                  us: "Increase the number of participating factories.",
                  cn: "增加参与工厂的数量",
                  language,
                })
              )}
              {StepRender(
                3,
                getMessage({
                  ja: "色々な工場の意見を基にシステムを成長させる",
                  us: "Grow the system based on the opinions of various factories.",
                  cn: "根据不同工厂的意见发展系统",
                  language,
                })
              )}
              {StepRender(
                4,
                getMessage({
                  ja: "グループ全体の生産性が上がる",
                  us: "Increased productivity for the entire group.",
                  cn: "提高整个团队的工作效率",
                  language,
                })
              )}
              {StepRender(
                5,
                getMessage({
                  ja: "開発メンバーを増やす",
                  us: "Increase development members.",
                  cn: "增加发展成员的数量",
                  language,
                })
              )}
              {StepRender(
                6,
                getMessage({
                  ja: "発起人がこのサービスを離れても成長し続ける仕組みを作る",
                  us: "Create a system that will continue to grow even after the founder leaves this service.",
                  cn: "创建一个即使在创始人离职后仍能继续发展的系统",
                  language,
                })
              )}
            </VStack>
          </Box>

          {renderSection(
            getMessage({
              ja: "導入までの流れ",
              us: "Flow of Introduction",
              cn: "介绍流程",
              language,
            }),
            14,
            10
          )}
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
                getMessage({
                  ja: "teppy@au.comにメール連絡する(または紹介)",
                  us: "Contact teppy@au.com by email (or referral)",
                  cn: "通过电子邮件（或转介）与 teppy@au.com 联系。",
                  language,
                })
              )}
              {IntroductionRender(
                2,
                getMessage({
                  ja: "契約書がメールで届くので社内で検討をお願いします",
                  us: "Contracts will be emailed to you for your internal review.",
                  cn: "合同将通过电子邮件发送给您，供您内部审查",
                  language,
                })
              )}
              {IntroductionRender(
                3,
                getMessage({
                  ja: "契約後、初回導入時は伺ってフォローを行います",
                  us: "After signing the contract, we will visit and follow up on the initial installation.",
                  cn: "签订合同后，我们将上门服务并跟进初始安装。",
                  language,
                })
              )}
            </VStack>
          </Box>

          <Box height="180px"></Box>
          <Text textAlign="center" fontSize="md">
            {getMessage({
              ja: "※ログインして認証を受けないと閲覧/ダウンロードは出来ません",
              us: "*You must be logged in and authenticated to view/download.",
              cn: "*您需要登录并获得授权才能查看/下载。",
              language,
            })}
          </Text>
          <Text textAlign="center" mt={6} lineHeight={1.6}>
            {elapsedTime}
          </Text>
          <Text textAlign="center" mt={0.6} lineHeight={1.6} fontSize={12}>
            {language === "ja" && <>サービス開始から{totalDays}が経過</>}
            {language === "us" && <>{totalDays} since the start of service</>}
            {language === "cn" && <>服务开始后的 {totalDays}</>}
          </Text>
        </Box>
      </Content>
    </>
  );
};

export default Welcome;
