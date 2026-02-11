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
import DataFlowDiagram from "app/skillBlogs/pages/0015/parts/DataFlowDiagram";
import DataFlowDiagram2 from "app/skillBlogs/pages/0015/parts/DataFlowDiagram2";
import { UrlModalButton } from "@/components/ui/UrlModalButton";
import { ImageSelector } from "@/components/ui/ImageSelector";
import SpecTable_terminal from "./parts/SpecTable_terminal";
import SpecTable_sarver from "./parts/SpecTable_sarver";
import PartListTable from "../../../components/PartListTable";
import PartListPlan from "../../../components/PartListPlan";

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
      <Frame sections={sections} sectionRefs={sectionRefs} isThrough>
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
        {/* <SectionBox
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
            <UnorderedList spacing={1}>
              <ListItem>7/10に交付決定</ListItem>
              <ListItem>
                事業終了期限は9/30。間に合わない場合は片岡が社労士に連絡する。
              </ListItem>
              <ListItem>
                運用開始から3ヶ月間を無償サポート期間とさせて頂きます。
              </ListItem>
              <ListItem>以下の計画は作成途中で適宜変更していきます。</ListItem>
            </UnorderedList>
          </Box>
        </SectionBox> */}
        <SectionBox
          id="section1"
          title={
            "1." +
            getMessage({
              ja: "プランと購入品",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Text fontSize="sm">確認日:2026/2/10</Text>
          <Box mt={4}>
            <PartListPlan
              planPaths={[
                "/partlist/plans/plan-a.json",
                "/partlist/plans/plan-b.json",
                "/partlist/plans/plan-c.json",
                "/partlist/plans/plan-d.json",
                "/partlist/plans/plan-e.json",
              ]}
            />
          </Box>
          {/* <Box mt={4}>
            <PartListTable />
          </Box> */}
        </SectionBox>
      </Frame>
    </>
  );
};

export default BlogPage;
