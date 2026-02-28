"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  List,
  ListItem,
  ListIcon,
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
  createIcon,
  Spacer,
  Center,
  useColorMode,
  useToast,
  OrderedList,
  UnorderedList,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  DarkMode,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { PiAppWindowFill, PiArrowFatLineDownLight } from "react-icons/pi";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "@/components/content";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/ui/BasicDrawer";
import Frame from "../../components/frame";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/ui/CustomBadge";
import DownloadLink from "../../components/DownloadLink";
import UnderlinedTextWithDrawer from "../../components/UnderlinedTextWithDrawer";
import ExternalLink from "../../components/ExternalLink";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ReferenceSettingModal from "../../../../src/components/howto/office/referenceSettingModal";
import { useUserContext } from "@/contexts/useUserContext";
import { supabase } from "@/utils/supabase/client";
import { getIpAddress } from "@/lib/getIpAddress";
import { BsFiletypeExe } from "react-icons/bs";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import DownloadButton from "@/components/ui/DownloadButton2";
import UnzipModal from "@/components/howto/os/UnzipModal";
import FontInstallModal from "@/components/howto/os/FontInstall";
import { getLocalIp } from "../../components/getLocalIp";
import { Key } from "@/components/ui/Key";
import { ImageWithHighlight } from "../../../../src/components/ImageWidthHighlight";
import VBATrustSettingsPage from "@/components/howto/office/VbaTrustSettings";

import ModalYps from "app/downloads/tabs/yps/yps";
import BorderBox from "@/components/ui/BorderBox";
import { downloadLatestFile } from "@/lib/downloadLatestFile";
import CodeBlock from "@/components/CodeBlock";

import SchedulePage from "./parts/SchedulePage";
import EstimateSection from "./parts/pdfPrint/EstimateSection";
import EstimateSection2 from "./parts/pdfPrint/EstimateSection2";
import { ANNEX_SECTIONS } from "./parts/pdfPrint/annexContent";
import ContractSection from "./parts/pdfPrint/ContractSection";
import MaintenancePdfSection from "./parts/pdfPrint/MaintenancePdfSection";
import {
  SECTION4_ITEMS,
  SECTION4_1_LEGEND,
  SECTION4_1_NOTES,
  SECTION4_2_INTRO,
  SECTION4_2_ITEMS,
} from "./parts/pdfPrint/section4Content";
import DataFlowDiagram from "app/skillBlogs/pages/0015/parts/DataFlowDiagram";
import DataFlowDiagram2 from "app/skillBlogs/pages/0015/parts/DataFlowDiagram2";
import { UrlModalButton } from "@/components/ui/UrlModalButton";
import { ImageSelector } from "@/components/ui/ImageSelector";
import SpecTable_terminal from "./parts/SpecTable_terminal";
import SpecTable_sarver from "./parts/SpecTable_sarver";
import PartListTable from "./parts/pdfPrint/PartListTable";
import PartListPlan from "./parts/pdfPrint/PartListPlan";

import dynamic from "next/dynamic";
import QR_Payload from "./parts/QrPayloadTable";
const FloorPlan = dynamic(() => import("./parts/FloorLayout/ueda"), {
  ssr: false,
});

const BlogPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    currentUserId,
    currentUserName,
    currentUserMainCompany,
    currentUserCompany,
    currentUserCreatedAt,
    getUserById,
    isLoading: isLoadingContext,
  } = useUserContext();

  const { setLanguage } = useLanguage();
  //右リストの読み込みをlanguage取得後にする
  const { language } = useLanguage();
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

  const toast = useToast();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const estimate2PrintFnRef = useRef<(() => void) | null>(null);

  // 点滅アニメーションを定義
  const blink = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  `;
  const blinkAnimation = `${blink} 0.8s infinite`;

  function RequirementTable({
    requirements,
  }: {
    requirements: Record<string, string>;
  }) {
    return (
      <Grid templateColumns="150px 1fr" gap={1} fontSize="sm">
        {Object.entries(requirements).map(([label, value]) => (
          <React.Fragment key={label}>
            <GridItem fontWeight="semibold" color="gray.600">
              {label}
            </GridItem>
            <GridItem whiteSpace="pre-line">{value}</GridItem>
          </React.Fragment>
        ))}
      </Grid>
    );
  }
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
  }
  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs} isThrough hideMenu>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                borderWidth={1}
              />
            </AvatarGroup>
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>
              {getMessage({
                ja: "開発",
                language,
              })}
            </Text>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "PreHarnessPro(仮)",
              us: "",
              cn: "",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "名称未定",
              us: "",
              cn: "",
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
            :2026-02-09
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title={"1." + getMessage({ ja: "概要", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <VStack align="start" spacing={3} mt={3}>
            <ExternalLink
              href="https://shoryokuka.smrj.go.jp/ippan/"
              text="中小企業省力化投資補助金（一般型）公式サイト"
            />
            <Text fontSize="sm">
              人手不足に悩む中小企業等が、IoT・ロボット等のデジタル技術を活用した設備を導入する際の費用を補助する制度です。
              ハード・ソフトを自由に組み合わせて申請できます。
            </Text>
            <Grid templateColumns="auto 1fr" gap={2} fontSize="sm" w="100%">
              <GridItem fontWeight="semibold" color="gray.500">
                補助対象者
              </GridItem>
              <GridItem>
                中小企業者、小規模企業者、特定非営利活動法人 など
              </GridItem>

              <GridItem fontWeight="semibold" color="gray.500">
                補助率
              </GridItem>
              <GridItem>
                中小企業：1/2（賃上げ実施で2/3）／小規模企業者：2/3
              </GridItem>

              <GridItem fontWeight="semibold" color="gray.500">
                補助上限額
              </GridItem>
              <GridItem>
                750万〜8,000万円（従業員数により異なる）
                <br />
                賃上げ実施で上限額引き上げ可（最大1億円）
              </GridItem>

              <GridItem fontWeight="semibold" color="gray.500">
                対象設備
              </GridItem>
              <GridItem>
                IoT・ロボット・AI等、人手不足解消に効果があるデジタル技術を活用した設備
              </GridItem>

              <GridItem fontWeight="semibold" color="gray.500">
                申請状況
              </GridItem>
              <GridItem>
                第5回公募申請受付中（GビズIDプライムアカウント必須）
              </GridItem>
            </Grid>
          </VStack>
        </SectionBox>
        <SectionBox
          id="section2"
          title={"2." + getMessage({ ja: "システム概要書", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <VStack align="start" spacing={3} mt={3}>
            <Text fontSize="sm" color="gray.500">
              ※作成中
            </Text>
          </VStack>
        </SectionBox>
        <SectionBox
          id="section3"
          title={"3." + getMessage({ ja: "省力化効果", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <VStack align="start" spacing={3} mt={3}>
            <Text fontSize="sm" color="gray.500">
              ※要作成
            </Text>
          </VStack>
        </SectionBox>
        <Box position="relative" pr="14px" mt={5}>
          {/* 縦棒 */}
          <Box
            position="absolute"
            right={0}
            top="13px"
            bottom={0}
            w="2px"
            bg={
              colorMode === "light"
                ? "custom.theme.dark.300"
                : "custom.theme.light.800"
            }
            borderRadius="full"
          />
          <SectionBox
            id="section4"
            title={"4." + getMessage({ ja: "保守点検の考え方", language })}
            sectionRefs={sectionRefs}
            sections={sections}
            rightElement={
              <Box position="relative">
                <MaintenancePdfSection />
                {/* 横線：ボタン右端から縦棒まで */}
                <Box
                  position="absolute"
                  top="50%"
                  left="100%"
                  transform="translateY(-50%)"
                  h="2px"
                  w="14px"
                  bg={
                    colorMode === "light"
                      ? "custom.theme.dark.300"
                      : "custom.theme.light.800"
                  }
                />
              </Box>
            }
            mt="0"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <VStack align="start" spacing={1} mt={3} fontSize="sm">
              {SECTION4_ITEMS.map((item, i) => (
                <Box key={i}>
                  <Text fontWeight="600" mt={i > 0 ? 4 : 0}>
                    {item.heading}
                  </Text>
                  {item.lines.map((line, j) => (
                    <Text key={j}>{line}</Text>
                  ))}
                </Box>
              ))}
            </VStack>
          </SectionBox>
          <SectionBox
            id="section4-1"
            title={"4-1." + getMessage({ ja: "保証・サポート範囲", language })}
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Box mt={4} fontSize="sm">
              {/* タイムライン */}
              <Grid templateColumns="80px 1fr" gap={0} mb={4}>
                {/* ラベル列 */}
                <Box />
                <Box position="relative" pb={1}>
                  <Grid templateColumns="1fr 3fr" gap={0}>
                    <Box fontSize="xs" color="gray.500" textAlign="left">
                      納品
                    </Box>
                    <Box fontSize="xs" color="gray.500" textAlign="right">
                      1年
                    </Box>
                  </Grid>
                  <Box
                    position="absolute"
                    left="25%"
                    top="0"
                    fontSize="xs"
                    color="gray.500"
                    transform="translateX(-50%)"
                  >
                    3ヶ月
                  </Box>
                </Box>

                {/* 初期調整期間バー */}
                <Box
                  fontSize="xs"
                  color="gray.600"
                  display="flex"
                  alignItems="center"
                  pr={2}
                  fontWeight="bold"
                >
                  初期調整
                </Box>
                <Grid templateColumns="1fr 3fr" gap={0}>
                  <Box
                    bg="green.400"
                    borderRadius="sm"
                    h="28px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    color="white"
                    fontWeight="bold"
                  >
                    無償
                  </Box>
                  <Box h="28px" />
                </Grid>

                {/* 保証期間バー */}
                <Box
                  fontSize="xs"
                  color="gray.600"
                  display="flex"
                  alignItems="center"
                  pr={2}
                  fontWeight="bold"
                  mt={1}
                >
                  不具合対応
                </Box>
                <Grid templateColumns="1fr 2fr 1fr" gap={0} mt={1}>
                  <Box
                    bg="blue.300"
                    h="28px"
                    borderRadius="sm"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    color="white"
                    fontWeight="bold"
                  >
                    無償
                  </Box>
                  <Box
                    bg="blue.500"
                    h="28px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    color="white"
                    fontWeight="bold"
                  >
                    仕様内のみ無償
                  </Box>
                  <Box
                    bg="blue.800"
                    borderRadius="sm"
                    h="28px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    color="white"
                    fontWeight="bold"
                  >
                    ※延長あり→
                  </Box>
                </Grid>
              </Grid>

              {/* 凡例 */}
              <VStack
                align="start"
                spacing={1}
                fontSize="xs"
                color="gray.600"
                mt={2}
              >
                {SECTION4_1_LEGEND.map((item, i) => (
                  <HStack key={i} alignItems="flex-start">
                    <Box
                      w="12px"
                      h="12px"
                      bg={item.color}
                      borderRadius="sm"
                      flexShrink={0}
                      mt="3px"
                    />
                    <Text>{item.label}</Text>
                  </HStack>
                ))}
              </VStack>
              {SECTION4_1_NOTES.map((note, i) => (
                <Text
                  key={i}
                  fontSize="xs"
                  color="gray.800"
                  mt={i === 0 ? 3 : 1}
                >
                  {note}
                </Text>
              ))}
            </Box>
          </SectionBox>
          <SectionBox
            id="section4-2"
            title={
              "4-2." +
              getMessage({ ja: "外部要因による影響について", language })
            }
            sectionRefs={sectionRefs}
            sections={sections}
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <VStack align="start" spacing={3} mt={3} fontSize="sm">
              <Text>{SECTION4_2_INTRO}</Text>
              <Box w="100%">
                <Text fontWeight="bold" mb={2}>
                  不具合が発生し得る外部要因
                </Text>
                <VStack align="start" spacing={2} pl={2}>
                  {SECTION4_2_ITEMS.map((item, i) => (
                    <Box key={i}>
                      <Text fontWeight="bold" fontSize="xs">
                        {item.heading}
                      </Text>
                      {item.lines.map((line, j) => (
                        <Text key={j}>{line}</Text>
                      ))}
                    </Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </SectionBox>
        </Box>
        <SectionBox
          id="section5"
          title={"5." + getMessage({ ja: "見積書", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <EstimateSection />
        </SectionBox>
        <Box position="relative" pr="14px" mt={5}>
          {/* 縦棒 */}
          <Box
            position="absolute"
            right={0}
            top="33px"
            bottom={0}
            w="2px"
            bg={
              colorMode === "light"
                ? "custom.theme.dark.300"
                : "custom.theme.light.800"
            }
            borderRadius="full"
          />
          <SectionBox
            id="section6"
            title={
              "6." + getMessage({ ja: "見積書（開発費のみ請求）", language })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            rightElement={
              <Box position="relative">
                <Button
                  size="xs"
                  leftIcon={<FaDownload />}
                  variant="outline"
                  borderColor={
                    colorMode === "light"
                      ? "custom.theme.dark.300"
                      : "custom.theme.light.800"
                  }
                  color={
                    colorMode === "light"
                      ? "custom.theme.dark.300"
                      : "custom.theme.light.800"
                  }
                  onClick={() => estimate2PrintFnRef.current?.()}
                >
                  PDF
                </Button>
                <Box
                  position="absolute"
                  top="50%"
                  left="100%"
                  transform="translateY(-50%)"
                  h="2px"
                  w="14px"
                  bg={
                    colorMode === "light"
                      ? "custom.theme.dark.300"
                      : "custom.theme.light.800"
                  }
                />
              </Box>
            }
          >
            <EstimateSection2
              isAdmin={currentUserCompany === "開発"}
              onPrintReady={(fn) => {
                estimate2PrintFnRef.current = fn;
              }}
            />
            <Box mt={7} fontSize="sm">
              <Text fontWeight="600" mb={2} w="100%" fontSize="sm">
                ※別紙 見積補足資料
              </Text>
              <VStack align="start" spacing={3}>
                {ANNEX_SECTIONS.map((s) => (
                  <Box key={s.title}>
                    <Text fontWeight="bold" mb={1}>
                      {s.title}
                    </Text>
                    {s.lines.map((line, i) => (
                      <Text key={i} mt={i > 0 ? 1 : 0}>
                        {line}
                      </Text>
                    ))}
                  </Box>
                ))}
              </VStack>
            </Box>
          </SectionBox>
        </Box>
        <SectionBox
          id="section6-1"
          title={"6-1." + getMessage({ ja: "業務委託契約書", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          {currentUserCompany === "開発" ? (
            <ContractSection />
          ) : (
            <Text fontSize="sm" color="gray.500">
              ※作成中
            </Text>
          )}
        </SectionBox>
        <SectionBox
          id="section7"
          title={"7." + getMessage({ ja: "システム構成図", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontSize="sm" color="gray.500">
            ※作成中
          </Text>
          <Box mt={3}>
            <DataFlowDiagram />
          </Box>
        </SectionBox>
        <SectionBox
          id="section8"
          title={
            "8." + getMessage({ ja: "導入スケジュール(プランC)", language })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontSize="sm" color="gray.500">
            ※作成中
          </Text>
          <Box mt={3}>
            <SchedulePage />
          </Box>
        </SectionBox>
      </Frame>
    </>
  );
};

export default BlogPage;
