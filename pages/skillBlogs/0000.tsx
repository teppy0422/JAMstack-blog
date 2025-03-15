import React, { useEffect, useState, useRef, useContext } from "react";
import Confetti from "react-confetti";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  List,
  ListItem,
  Divider,
  ChakraProvider,
  extendTheme,
  IconButton,
  Badge,
  Avatar,
  Code,
  Image,
  Kbd,
  Flex,
  Icon,
  createIcon,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import { PiGithubLogoFill } from "react-icons/pi";

import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import { AnimationImage } from "../../components/CustomImage";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import Sidebar from "../../components/sidebar";

import { useUserData } from "../../hooks/useUserData";
import { useUserInfo } from "../../hooks/useUserId";
import { useReadCount } from "../../hooks/useReadCount";

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

const CustomIcon = createIcon({
  displayName: "CustomIcon",
  viewBox: "0 0 26 26",
  path: (
    <path
      d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
});
const BlogPage: React.FC = () => {
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const { readByCount } = useReadCount(userId);
  const { language, setLanguage } = useLanguage();
  //右リストの読み込みをlanguage取得後にする
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  useEffect(() => {
    if (language) {
      setIsLanguageLoaded(true);
    }
  }, [language]);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const showToast = useCustomToast();
  const pulseAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.6);
    opacity: 0.5;
  }
`;
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
    return <div>Loading...</div>; // 言語がロードされるまでのプレースホルダー
  }
  return (
    <>
      <Content isCustomHeader={true}>
        <Sidebar />
        <Stack mb={4} direction="row" justify="center">
          <Box
            width={{
              base: "90%",
              sm: "60%",
              md: "80%",
              lg: "80%",
              xl: "80%",
            }}
          >
            <HStack spacing={2} align="center" mb={1} ml={1}>
              <Avatar
                size="xs"
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                borderWidth={1}
              />
              <Text>@kataoka</Text>
              <Text>in</Text>
              <Text>
                {getMessage({
                  ja: "開発",
                  language,
                })}
              </Text>
              <Spacer />
              <Flex justifyContent="flex-end">
                <Text>
                  <Icon as={CustomIcon} mr={0} />
                  {readByCount}
                </Text>
              </Flex>
            </HStack>
            <Heading fontSize="3xl" mb={1} mt={5}>
              <Flex alignItems="center" gap="3px">
                {getMessage({
                  ja: "技術ブログ",
                  us: "Technology Blog",
                  cn: "技术博客",
                  language,
                })}
                {/* <PiGithubLogoFill size={40} /> */}
                <Box
                  position="relative"
                  width="50px"
                  display="flex"
                  justifyContent="center"
                  mx={5}
                >
                  <AnimationImage
                    src="/images/illust/hippo/hippo_016.svg"
                    width="50px"
                    left="0px"
                    bottom="-36px"
                    animation="kinoco_nyoki 1s forwards 1s"
                    sealSize={2}
                  />
                  <Box
                    position="absolute"
                    top="-28px"
                    left="6px"
                    borderRadius="50%"
                    w={10}
                    h={10}
                    bg="yellow"
                    opacity="0.1"
                    animation={`${pulseAnimation} 3s infinite 2s`}
                    background="radial-gradient(circle, rgba(255,255,0,1) 0%, rgba(255,255,0,0) 70%)"
                  />
                </Box>
              </Flex>
            </Heading>
            <Text
              fontSize="sm"
              color={colorMode === "light" ? "gray.800" : "white"}
              mt={1}
            >
              {getMessage({
                ja: "更新日",
                language,
              })}
              :2024-11-18
            </Text>

            <Text fontSize="sm" my={5}>
              {getMessage({
                ja: "ここに各システムの使い方や開発の経緯/進め方をまとめていきます。",
                us: "Here is a summary of how each system is used and how it was/is developed.",
                cn: "以下是每个系统的使用方法和开发过程的摘要。",
                language,
              })}
              <br />
            </Text>
            <Box
              w="100%"
              borderRadius={10}
              style={{
                backgroundImage:
                  "url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                position: "relative",
              }}
            >
              <Text
                style={{
                  padding: "13px",
                  paddingTop: "20px",
                  textAlign: "left",
                  color: "#fff",
                  textShadow: "none",
                  fontFamily: "'Yomogi', sans-serif",
                  fontWeight: "200",
                }}
              >
                <>
                  <Frame
                    sections={sections}
                    sectionRefs={sectionRefs}
                    isMain={true}
                  >
                    <></>
                  </Frame>
                </>
              </Text>
              <Box
                as="span"
                style={{
                  position: "absolute",
                  bottom: "-280px",
                  right: "-130px",
                  width: "50px",
                  margin: "200px",
                }}
              >
                <AnimationImage
                  src="/images/hippo.gif"
                  width="50px"
                  left="80px"
                  bottom="73px"
                  animation="nyoki_rabit 5s forwards, rabitJump 10s infinite 7s"
                  sealSize={2.5}
                />
              </Box>
            </Box>
            <Box height="5vh"></Box>
          </Box>
        </Stack>
      </Content>
    </>
  );
};

export default BlogPage;
