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
              ja: "マイコンの使い方",
              us: "",
              cn: "",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "Arduino",
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
            :2026-08-25
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
              ja: "Arduino IDEのインストール",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Box mt={4}>
          </Box>
          {/* <Box mt={4}>
            <PartListTable />
          </Box> */}
        </SectionBox>
        
        <SectionBox
          id="section14"
          title={
            "14." +
            getMessage({
              ja: "まとめ",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box
            style={{
              backgroundImage:
                "url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              position: "relative",
            }}
            borderRadius="10px"
          >
            <Box
              px="13px"
              py="20px"
              style={{
                textAlign: "left",
                color: "#fff",
                textShadow: "none",
                fontWeight: "400",
              }}
              lineHeight={1.6}
            >
              <Text>✅ Androidタブレットに関して</Text>
              <Text fontSize="15px">
                現在、生産現場で使用するタッチ操作対応のWindows
                PCは市場の縮小に伴い、以下のような課題が顕在化しております：
              </Text>
              <UnorderedList fontSize="14px" my={3}>
                <ListItem>
                  専用機の流通量が減少し、一般店頭ではほぼ入手困難
                </ListItem>
                <ListItem>
                  入手可能な機種は価格が高騰し、選択肢も限られている
                </ListItem>
                <ListItem>
                  通販では、**信頼性に不安のある海外製品（主に中華系）**が多く、長期運用には不安が残る
                </ListItem>
              </UnorderedList>
              <Text fontSize="15px">
                このような背景から、従来のWindowsベースの構成を継続することは、コスト・調達性・将来性の面で持続性が低いと判断いたしました。
                そこで、今後の運用においては、以下の理由から
                Androidタブレットをベースとしたシステム構成に移行することを提案・検討しております。
              </Text>
              <Text mt={8}>✅ Androidタブレットの利点</Text>

              <UnorderedList fontSize="14px" my={3}>
                <ListItem>
                  安価かつ入手性が高い（市場規模が大きく流通が安定）
                </ListItem>
                <ListItem>
                  タッチパネルが標準搭載されており、追加機器が不要
                </ListItem>
                <ListItem>
                  スピーカー内蔵のため、音声ガイダンス等にも対応可能
                </ListItem>
                <ListItem>
                  軽量・省スペース・可搬性が高い（生産現場に適した形状）
                </ListItem>
                <ListItem>今後も継続的に新機種が登場する見込み</ListItem>
              </UnorderedList>
              <Text fontSize="15px">
                以降後のアプリケーションはAndroidだけじゃなくWindows/Mac/Linuxでも対応可能であり、現場で必要な機能（QRコード読み取り、USB機器接続、音声案内など）も十分実現可能です。
              </Text>

              <Text mt={8}>✅ iPadの利点</Text>
              <UnorderedList fontSize="14px" my={3}>
                <ListItem>部品性能が高く使用期間が長い(10年以上)</ListItem>
                <ListItem>動作の安定性が高い</ListItem>
              </UnorderedList>
              <Text mt={8}>🟥 iPadのデメリット</Text>
              <UnorderedList fontSize="14px" my={3}>
                <ListItem>アプリのバージョンアップにMacが必須</ListItem>
                <ListItem>シリアル通信が使用不可</ListItem>
              </UnorderedList>
            </Box>
          </Box>
        </SectionBox>
      </Frame>
    </>
  );
};

export default BlogPage;
