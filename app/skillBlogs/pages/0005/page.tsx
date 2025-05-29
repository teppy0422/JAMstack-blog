"use client";

import React, { useEffect, useState, useRef } from "react";
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
  AvatarGroup,
  Flex,
  Icon,
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import Content from "@/components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "@/components/ui/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/ui/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/ui/CustomBadge";
import UnderlinedTextWithDrawer from "../../components/UnderlinedTextWithDrawer";

import { useUserContext } from "@/contexts/useUserContext";
import { useReadCount } from "@/hooks/useReadCount";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const customTheme = extendTheme({
  fonts: {
    heading: "'Noto Sans JP', sans-serif",
    body: "'Noto Sans JP', sans-serif",
  },
  fontWeights: {
    normal: 200,
    medium: 300,
    bold: 400,
    light: 300,
    extraLight: 100,
  },
});
//テキストジャンプアニメーション
const jumpAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
`;
//Kbdのスタイル
const kbdStyle = {
  border: "1px solid",
  fontSize: "16px",
  bg: "white",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};
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
  const { currentUserId } = useUserContext();
  const { readByCount } = useReadCount(currentUserId);
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

  const handleOpen = (drawerName: string) => {
    setActiveDrawer(drawerName);
    onOpen();
  };
  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
  };
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
  }
  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/112.jpg"
                borderWidth={1}
              />
              <Avatar
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                borderWidth={1}
              />
            </AvatarGroup>
            <Text>@ou @kataoka</Text>
            <Spacer />
            <Flex justifyContent="flex-end">
              <Text>
                <Icon as={CustomIcon} mr={0} />
                {readByCount}
              </Text>
            </Flex>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "サブナンバー引越しのやり方",
              us: "How to do a sub-number move",
              cn: "如何进行子编号移动",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "生準+",
              language,
            })}
          />
          <CustomBadge
            text={getMessage({
              ja: "高知",
              language,
            })}
          />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            {getMessage({
              ja: "更新日",
              language,
            })}
            :2024-11-20
          </Text>
        </Box>

        <SectionBox
          id="section1"
          title={
            "1." +
            getMessage({
              ja: "はじめに",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box>
            <Text fontWeight="bold"></Text>
            <Text>
              {getMessage({
                ja: "マイナーチェンジって旧製品品番と新製品品番でサブ形態が殆ど変わらない事が多いですよね？そこで「サブナンバーを引越し」させる機能を追加しました。",
                us: "Minor changes often leave the sub-numbers almost the same between the old and new product part numbers, don't they? Therefore, we have added a function to [move the sub-number].",
                cn: "微小的变化往往意味着新旧产品零件编号之间的子编号几乎没有变化，不是吗？这就是我们增加 [移动子编号 功能的原因]",
                language,
              })}
            </Text>
            <UnderlinedTextWithDrawer
              text=<>
                <Box as="span" display="inline" borderBottom="2px solid">
                  {getMessage({
                    ja: "開発の背景",
                    us: "Development Background",
                    cn: "发展背景",
                    language,
                  })}
                </Box>
                <LuPanelRightOpen
                  size="20px"
                  style={{ marginBottom: "-5px", display: "inline" }}
                />
              </>
              onOpen={() => handleOpen("開発の背景")}
              isOpen={isOpen && activeDrawer === "開発の背景"}
              onClose={handleClose}
              header={getMessage({
                ja: "開発の背景",
                us: "Development Background",
                cn: "发展背景",
                language,
              })}
              size="md"
              children={
                <Box>
                  <Image src="/images/0005/0005.png" w="100%" />
                  <Text mt={4}>
                    {getMessage({
                      ja: "高知工場の王さんの提案を元に作成しました。当初は電線サブナンバーしか考えていませんでしたが、途中で端末サブナンバーも必要やなと思って追加しました。",
                      us: "This was created based on a proposal by Mr. Oh of the Kochi Plant. At first, we only thought of wire sub-numbers, but we added terminal sub-numbers along the way because we thought we also needed them.",
                      cn: "它是根据高知工厂王先生的建议而创建的。起初，我们只考虑了导线子编号，但后来又增加了端子子编号，因为我们认为我们也需要这些子编号。",
                      language,
                    })}
                  </Text>
                </Box>
              }
            />
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "全体の流れ",
              us: "Overall flow",
              cn: "总流量",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            {getMessage({
              ja: "下図の流れで実行します",
              us: "Execute the following flow chart",
              cn: "执行下图中的流程",
              language,
            })}
          </Text>
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <Image src="/images/0005/0001.svg" alt="0001.png" />
          </Flex>
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "サブナンバーの出力",
              us: "Output sub-numbers",
              cn: "子编号的输出",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            {getMessage({
              ja: "旧の生産準備+から出力します",
              us: "Output from the old Production Preparation+.",
              cn: "旧版 生产准备+ 的输出。",
              language,
            })}
          </Text>
          <Text fontWeight="400" my={4}>
            {"3-1." +
              getMessage({
                ja: "旧の生産準備+から「MENU」をクリック",
                us: "Click on [MENU] from the old Production Preparation+.",
                cn: "点击旧生产准备+中的 [MENU]",
                language,
              })}
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image src="/images/0005/old_menu.png" alt="old_menu.png" w="50%" />
          </Flex>
          <Text fontWeight="400" my={4}>
            {"3-2." +
              getMessage({
                ja: "「サブナンバー引越し」をクリック",
                us: "Click on [Sub Number Move].",
                cn: "点击 [移动子编号]",
                language,
              })}
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/old_menu2.png"
              alt="old_menu2.png"
              w="50%"
            />
          </Flex>
          <Text fontWeight="400" my={4}>
            {"3-3." +
              getMessage({
                ja: "「メイン品番」で出力をクリック",
                us: "Under [Main Part Number], click Output.",
                cn: "在 主要零件编号 下，[点击输出]",
                language,
              })}
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/old_menu3.png"
              alt="old_menu3.png"
              w="50%"
            />
          </Flex>
          <Text fontWeight="400" my={4}>
            {"3-4." +
              getMessage({
                ja: "一時保管場所(B01_サブナンバー引越し)に出力されました",
                us: "Output to temporary storage (B01_Subnumber moved)",
                cn: "临时存储中的输出（B01_子编号已移动）。",
                language,
              })}
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/old_menu4.png"
              alt="old_menu4.png"
              w="70%"
            />
          </Flex>
        </SectionBox>
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "サブナンバーの取得",
              us: "Obtaining a sub-number",
              cn: "获取子编号",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            {getMessage({
              ja: "新の製品品番を開いて取得します",
              us: "Open and retrieve the new product part number",
              cn: "打开并检索新产品部件号",
              language,
            })}
          </Text>
          <Text fontWeight="400" my={4}>
            {"4-1." +
              getMessage({
                ja: "旧メイン品番の項目に引き継ぎたい製品品番(旧)を入力",
                us: "Enter the product part number (old) to be transferred in the Old main part number field.",
                cn: "在旧主部件号字段中输入要转移的（旧）产品部件号。",
                language,
              })}
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image src="/images/0005/new_menu.png" alt="new_menu.png" w="50%" />
          </Flex>
          <Text fontWeight="400" my={4}>
            {"4-2." +
              getMessage({
                ja: "「旧メイン品番で取得」をクリック",
                us: "Click on Retrieve by old main part number.",
                cn: "单击 「按旧主部件号检索」",
                language,
              })}
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/new_menu2.png"
              alt="new_menu2.png"
              w="50%"
            />
          </Flex>
          <Text fontWeight="400" my={4}>
            {"4-3." +
              getMessage({
                ja: "旧のサブナンバーが取得されました",
                us: "The old sub-numbers have been obtained.",
                cn: "已获得旧的子编号",
                language,
              })}
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Image
              src="/images/0005/new_menu3.png"
              alt="new_menu3.png"
              w="100%"
            />
          </Flex>
          <Text fontWeight="400" my={4}>
            {"4-4." +
              getMessage({
                ja: "旧のサブナンバーが取得されました",
                us: "The old sub-numbers have been obtained.",
                cn: "已获得旧的子编号",
                language,
              })}
          </Text>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Box bg="gray.300" color="black" w="50%" p={1}>
              {getMessage({
                ja: "PVSW_RLTFに電線サブナンバーを取得",
                us: "Get wire sub-number in PVSW_RLTF",
                cn: "获取 PVSW_RLTF 中的导线子编号",
                language,
              })}
            </Box>
            <Image
              src="/images/0005/new_menu4.png"
              alt="new_menu4.png"
              w="50%"
            />
            <Box bg="gray.300" color="black" w="70%" p={1} mt={5}>
              {getMessage({
                ja: "端末一覧に端末サブナンバーを取得",
                us: "Get terminal sub-number in the terminal list",
                cn: "获取终端列表中的终端子编号",
                language,
              })}
            </Box>
            <Image
              src="/images/0005/new_menu5.png"
              alt="new_menu5.png"
              w="70%"
            />
          </Flex>
          <Text mt={2}>
            {getMessage({
              ja: "※取得したサブナンバーは",
              us: "*Sub-numbers obtained will be ",
              cn: "*获得的子编号将以",
              language,
            })}
            <strong>
              {getMessage({
                ja: " 太字 ",
                us: " bold ",
                cn: " 粗体 ",
                language,
              })}
            </strong>
            {getMessage({
              ja: "になります",
              us: ".",
              cn: "显示。",
              language,
            })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section5"
          title={
            "5." +
            getMessage({
              ja: "まとめ",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box
            height="80vh"
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
              {getMessage({
                ja: "このようにサブナンバーを任意の製品品番から取得出来る為、類似した製品形態から取得するのも良いかもしれません",
                us: "Since sub-numbers can be obtained from any product part number in this way, it may be a good idea to obtain sub-numbers from similar product forms.",
                cn: "由于子编号可以通过这种方式从任何产品零件编号中获取，因此最好从类似的产品表格中获取子编号。",
                language,
              })}
            </Text>
            <Image
              src="/images/hippo.gif"
              alt="Hippo"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "50px",
              }}
            />
          </Box>
        </SectionBox>
        <Box h="5vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
