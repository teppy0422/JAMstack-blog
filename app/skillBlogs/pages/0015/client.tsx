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

import dynamic from "next/dynamic";
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
            :2025-07-22
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
        </SectionBox>
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "日程",
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

          <SchedulePage />
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "必要物の購入について",
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
            <OrderedList spacing={2}>
              <ListItem>購入方法</ListItem>
              <UnorderedList>
                <ListItem>システム開発に必要な物は片岡が各1点ずつ購入</ListItem>
                <ListItem>残りは要相談</ListItem>
              </UnorderedList>
              <ListItem>端末</ListItem>
              <SpecTable_terminal />
              <ListItem>サーバー(Nas)</ListItem>
              <SpecTable_sarver />
              <UnorderedList fontSize="14px">
                <ListItem>使用パッケージ</ListItem>
                <CodeBlock
                  title="terminal"
                  code={`npm install cors
npm install express
npm install pg
npm install check-disk-space
npm install dotenv
npm install multer
`}
                />
                <ListItem>テーブル一覧</ListItem>
                <UnorderedList>
                  <ListItem>users</ListItem>
                  <ListItem>m_processing_conditions</ListItem>
                </UnorderedList>
              </UnorderedList>
            </OrderedList>
            <Text></Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "アプリ開発の定義",
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
            <OrderedList spacing={2}>
              <ListItem>基本的な考え方</ListItem>
              <UnorderedList>
                <ListItem>
                  ローカルアプリとして作成しインターネット接続しないオフライン運用とする
                  ※これによりOSのサポート期間に影響されません
                </ListItem>
                <ListItem>
                  1つのアプリに全ての機能をまとめる。複数は作成しない。
                </ListItem>
                <ListItem>
                  バージョンアップは専用サイトからAPKをダウンロードしてNasに配置。各端末からアップデートを実行ボタンを押す事を想定。
                </ListItem>
              </UnorderedList>
              <ListItem>アプリケーションの構成</ListItem>
              <UnorderedList fontSize="15px">
                <ListItem>
                  Flutter（Dart）を基盤としたクロスプラットフォーム構成（Android中心）
                </ListItem>
                <ListItem>
                  画面遷移には Flutter の Navigator（`MaterialPageRoute`）を使用
                </ListItem>
                <ListItem>
                  UI構築は Material Design + カスタムレイアウト
                </ListItem>
                <ListItem>
                  ローカルDBは PostgreSQL を使用（Node.js
                  APIサーバー経由でアクセス）
                </ListItem>
                <ListItem>
                  NAS上のファイル操作は Node.js
                  APIサーバーが担当し、HTTP経由でFlutterから通信
                </ListItem>
                <ListItem>
                  GitHub で引き継ぎ可能な体制を用意
                  <br />
                  <Button
                    as="a"
                    href="https://github.com/teppy0422/preharness"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                  >
                    https://github.com/teppy0422/preharness
                  </Button>
                  <Text>
                    ※上記リンクを伝える事で他の開発者に引き継げるようにしておきます
                    <br />
                    ※.env は Nas の C:\ に保存
                    <br />
                    ※サーバー側(node.js)も同様にする予定
                  </Text>
                </ListItem>
                <ListItem>ChatGPT等を利用する場合のプロンプト</ListItem>
                <Box maxW="95%">
                  <CodeBlock
                    code={`Flutter + Node.js + PostgreSQL による業務アプリ開発

前提：
- Androidタブレットでローカル運用
- NAS に格納された固定長ファイルを Node.js API経由で操作
- APIサーバーが DB と NAS の橋渡しを担当
- Flutter アプリは API に対して HTTP 通信を行う（Dio）

構成：
- フロントエンド：Flutter（Material UI）
- サーバー：Node.js + Express + pg（PostgreSQLドライバ）
- NAS連携：fs/promises でファイル操作（移動・保存）
- データベース：PostgreSQL

- アプリのアップデートを NAS 経由で配布したい（APK）

制約：
- Flutter から直接 NAS は扱えない → Node.js API経由が必須
- オフラインでも動作する設計が必要
- Flutter は Android 権限設定が必要（READ/WRITE）

`}
                    title="txt"
                  />
                </Box>
              </UnorderedList>

              <ListItem>システム要件</ListItem>
              <UnorderedList fontSize="14px">
                <ListItem>Android TV / Fire TVは制限あり。</ListItem>
              </UnorderedList>
              <Tabs size="md" variant="enclosed">
                <TabList>
                  <Tab
                    _selected={{
                      color: "custom.theme.light.850",
                      borderBottom: "2px solid",
                      borderBottomColor: "custom.theme.light.850",
                      fontWeight: "bold",
                    }}
                    fontSize="14px"
                    color="gray.500"
                    p={0}
                    mr={3}
                  >
                    Android
                  </Tab>
                  <Tab
                    _selected={{
                      color: "custom.theme.light.850",
                      borderBottom: "2px solid",
                      borderBottomColor: "custom.theme.light.850",
                      fontWeight: "bold",
                    }}
                    fontSize="14px"
                    color="gray.500"
                    p={0}
                    mr={3}
                  >
                    iOS/iPadOS
                  </Tab>
                  <Tab
                    _selected={{
                      color: "custom.theme.light.850",
                      borderBottom: "2px solid",
                      borderBottomColor: "custom.theme.light.850",
                      fontWeight: "bold",
                    }}
                    fontSize="14px"
                    color="gray.500"
                    p={0}
                    mr={3}
                  >
                    Windows
                  </Tab>
                  <Tab
                    _selected={{
                      color: "custom.theme.light.850",
                      borderBottom: "2px solid",
                      borderBottomColor: "custom.theme.light.850",
                      fontWeight: "bold",
                    }}
                    fontSize="14px"
                    color="gray.500"
                    p={0}
                    mr={3}
                  >
                    macOS
                  </Tab>
                  <Tab
                    _selected={{
                      color: "custom.theme.light.850",
                      borderBottom: "2px solid",
                      borderBottomColor: "custom.theme.light.850",
                      fontWeight: "bold",
                    }}
                    fontSize="14px"
                    color="gray.500"
                    p={0}
                    mr={3}
                  >
                    Linux
                  </Tab>
                </TabList>
                <TabPanels
                  bg={
                    colorMode === "light"
                      ? "custom.theme.light.300"
                      : "custom.theme.dark.600"
                  }
                >
                  <TabPanel px={0}>
                    <Box>
                      <Text fontWeight="bold" mb={2} fontSize="xs">
                        推奨:
                      </Text>
                      <RequirementTable
                        requirements={{
                          OS: "Android 5.0（API 21）以上",
                          プロセッサー:
                            "ARM または ARM64\n※x86エミュレーターでも可（開発用途）",
                          メモリー: "2 GB RAM 以上",
                          ストレージ: "10 MB 以上",
                        }}
                      />
                    </Box>
                  </TabPanel>
                  <TabPanel px={0}>
                    <Box>
                      <Text fontWeight="bold" mb={2} fontSize="xs">
                        推奨:
                      </Text>
                      <RequirementTable
                        requirements={{
                          OS: "iOS 12.0 以上",
                          プロセッサー: "Apple A10 Fusion 以降（iPhone 7以降）",
                          メモリー: "2 GB RAM 以上",
                          ストレージ: "20 MB 以上",
                        }}
                      />
                    </Box>
                  </TabPanel>
                  <TabPanel px={0}>
                    <Box>
                      <Text fontWeight="bold" mb={2} fontSize="xs">
                        推奨:
                      </Text>
                      <RequirementTable
                        requirements={{
                          OS: "Windows 10以上 (64bit)\n※32bitはFlutter未対応",
                          プロセッサー:
                            "Intel Core i5-8250U 以上 または同等のAMD\n※ARM版Windowsは非推奨",
                          メモリー: "8 GB RAM",
                          ストレージ: "500 MB 以上",
                        }}
                      />
                    </Box>
                  </TabPanel>
                  <TabPanel px={0}>
                    <Box>
                      <Text fontWeight="bold" mb={2} fontSize="xs">
                        推奨:
                      </Text>
                      <RequirementTable
                        requirements={{
                          OS: "macOS 10.14 Mojave 以上",
                          プロセッサー: "Intel または Apple Silicon (M1/M2)",
                          メモリー: "8 GB RAM",
                          ストレージ: "100 MB 以上",
                        }}
                      />
                    </Box>
                  </TabPanel>
                  <TabPanel px={0}>
                    <Box>
                      <Text fontWeight="bold" mb={2} fontSize="xs">
                        推奨:
                      </Text>
                      <RequirementTable
                        requirements={{
                          OS: "Ubuntu 20.04 LTS 以上\n※他のディストリビューションも可",
                          プロセッサー: "x64ベースCPU",
                          メモリー: "8 GB RAM",
                          ストレージ: "200 MB 以上",
                        }}
                      />
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </OrderedList>
          </Box>
        </SectionBox>
        <SectionBox
          id="section5"
          title={
            "5." +
            getMessage({
              ja: "デザイン",
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
          <UnorderedList spacing={2}>
            <ListItem>アイコン</ListItem>
            <Box display="inline-block" mr={3}>
              <Box
                border="1.5px solid #666"
                borderRadius="md"
                overflow="hidden"
                _hover={{ opacity: 0.9, transform: "scale(1.05)" }}
              >
                <Image
                  src="/images/preharnesspro/icon.ico"
                  alt="PreHarnessPro Icon"
                  boxSize="40px"
                  cursor="pointer"
                  onClick={onOpen}
                />
              </Box>
              <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalBody p={0}>
                    <Image
                      src="/images/preharnesspro/preharnesspro_sample.png"
                      alt="拡大画像"
                      width="100%"
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
            <Box display="inline-block">
              <Box
                // border="1.5px solid #666"
                borderRadius="md"
                overflow="hidden"
                _hover={{ opacity: 0.9, transform: "scale(1.05)" }}
              >
                <Image
                  src="/images/preharnesspro/icon2.png"
                  alt="PreHarnessPro Icon"
                  boxSize="42px"
                  cursor="pointer"
                  onClick={onOpen}
                />
              </Box>
              <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalBody p={0}>
                    <Image
                      src="/images/preharnesspro/preharnesspro_sample.png"
                      alt="拡大画像"
                      width="100%"
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
            <ListItem>アプリ全体デザイン</ListItem>
            <Text>
              {getMessage({
                ja: "特に参考にしたいデザインがあればWEBページやアプリ名などを教えてください",
                us: "If you have a particular design you would like to refer to, please let us know the web page or the name of the application.",
                cn: "如果您想参考某个设计，请提供网页或应用程序名称。",
                language,
              })}
            </Text>
            <ImageSelector
              images={[
                {
                  id: 1,
                  url: "/images/0015/2.png",
                  comment: "・左にメニュー 右に中身という一般的なデザイン",
                },
                {
                  id: 2,
                  url: "/images/0015/1.png",
                  comment:
                    "・目の負担を考えてダークモードがメイン\n・注目箇所はハイライトで表示(上図では緑)",
                },
                {
                  id: 3,
                  url: "/images/0015/3.png",
                  comment: "・たとえば奇抜なデザインも対応可能です",
                },
                {
                  id: 4,
                  url: "/images/0015/001.webp",
                  comment:
                    "・圧着作業画面(作成途中)\n・実機の横幅は243mm(上図をズームして合わせてみてください)",
                },
                {
                  id: 5,
                  url: "/images/0015/002.webp",
                  comment:
                    "・ダークモードをオンにした画面\n・ハイライト色は緑に設定",
                },
                {
                  id: 6,
                  url: "/images/0015/004.webp",
                  comment: "・エフを読み込んだらダイヤル値と規格測定を表示",
                },
                {
                  id: 7,
                  url: "/images/0015/003.webp",
                  comment:
                    "・ダイヤル値の履歴が無ければ赤色で表示\n・タップでダイヤル値を保存",
                },
                {
                  id: 8,
                  url: "/images/0015/006.webp",
                  comment: "・色一覧の表示などのテストページ",
                },
              ]}
            />
          </UnorderedList>
          <UnorderedList>
            <ListItem>動作イメージ30秒動画</ListItem>
            <video
              src="/images/0015/preHarness_demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controls={false}
              style={{
                width: "100%",
                height: "auto",
                pointerEvents: "none", // ← タップ無効
              }}
            />
            <UnorderedList>
              <ListItem>1.QRコードでエフを読む</ListItem>
              <ListItem>
                2.規格測定でNGの場合は推奨ダイヤルが点滅(C/Hのみ)
              </ListItem>
              <ListItem>3.フットスイッチを検知してカウント</ListItem>
              <ListItem>
                4.規格表は2本指でズーム。タップでフルスクリーン表示。
              </ListItem>
              <ListItem>
                ※動画は開発中のもので特にデザインは最後に作ります。
              </ListItem>
            </UnorderedList>
          </UnorderedList>
        </SectionBox>
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "アプリの機能",
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
          <OrderedList spacing={2}>
            <ListItem>圧着作業</ListItem>
            <UnorderedList>
              <ListItem>ログイン(PC毎)</ListItem>
              <ListItem>単線データ読み込み</ListItem>
              <ListItem>かんばんデータ読み込み</ListItem>
              <ListItem>規格データ呼び出し</ListItem>
              <ListItem>ダイヤル値の呼び出し</ListItem>
              <ListItem>作業実績のDB保存</ListItem>
            </UnorderedList>
            <ListItem>出荷作業</ListItem>
            <UnorderedList>
              <ListItem>ログイン</ListItem>
              <ListItem>照合チェック</ListItem>
              <ListItem>作業実績のDB保存</ListItem>
            </UnorderedList>
            <ListItem>管理</ListItem>
            <UnorderedList>
              <ListItem>実績出力(.csv)</ListItem>
              <ListItem>実績閲覧</ListItem>
              <ListItem>かんばん印刷</ListItem>
              <ListItem>作業者QR印刷</ListItem>
            </UnorderedList>
            <ListItem>対応外</ListItem>
            <UnorderedList>
              <ListItem>シールド切断実績</ListItem>
              <ListItem>皮むき実績</ListItem>
            </UnorderedList>
          </OrderedList>
        </SectionBox>
        <SectionBox
          id="section7"
          title={
            "7." +
            getMessage({
              ja: "機能の追加提案",
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
            <Text>・外国語に対応</Text>
            <Text>・前回使用したハイト調整ダイヤル値を表示する機能</Text>
            <Text>・過去の不良実績がある条件は警告等を表示する機能</Text>
            <Text>・規格表の任意の場所をズームする機能</Text>
          </Box>
        </SectionBox>

        <SectionBox
          id="section8"
          title={
            "8." +
            getMessage({
              ja: "データフロー図",
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
            <Text whiteSpace="pre-line">
              {getMessage({
                ja: "",
                us: "",
                cn: "",
                language,
              })}
            </Text>
            <DataFlowDiagram />
          </Box>
        </SectionBox>

        <SectionBox
          id="section9"
          title={
            "9." +
            getMessage({
              ja: "必要な外部ファイル",
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
          <CustomBadge text="四国部品" />
          <Text>それぞれのファイルの受け渡しルールを決める必要があります</Text>
          <Text fontSize="14px" color="gray.600">
            例:毎日9:00まで 担当:鈴木 副担当:佐藤
          </Text>
          <Box>
            <OrderedList spacing={2} mt={4}>
              <ListItem>毎日追加</ListItem>
              <UnorderedList spacing={1} fontSize="sm">
                <ListItem>切断データ(RLTF-AまたはB?)</ListItem>
              </UnorderedList>
              <ListItem>更新都度の追加(月に1回程度?)</ListItem>
              <UnorderedList spacing={1} fontSize="sm">
                <ListItem>TCSSC(規格データ)</ListItem>
                <ListItem>規格表画像</ListItem>
              </UnorderedList>
              <ListItem>変更都度</ListItem>
              <UnorderedList spacing={1} fontSize="sm">
                <ListItem>シールドかんばん</ListItem>
                <ListItem>作業者QR</ListItem>
              </UnorderedList>
            </OrderedList>
            <Text mt={6}>切断データの候補一覧</Text>
            <Text fontSize="sm">担当不在なので手探りで調査中</Text>
            <UnorderedList spacing={2}>
              <ListItem fontSize="sm">
                10.7.120.31/東四国disk/program/製造指示書かんばん/data/Rlg29_0.txt
                ←新見からの転送データ?
              </ListItem>
              <ListItem fontSize="sm">
                10.7.120.31/東四国disk/program/製造指示書かんばん/data/kanban.txt
                ←五十嵐さん作成?
              </ListItem>
            </UnorderedList>
          </Box>
        </SectionBox>
        <SectionBox
          id="section10"
          title={
            "10." +
            getMessage({
              ja: "レイアウト",
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
            <Text whiteSpace="pre-line">
              {getMessage({
                ja: "",
                us: "",
                cn: "",
                language,
              })}
            </Text>
            <FloorPlan />
          </Box>
        </SectionBox>
        <SectionBox
          id="section11"
          title={
            "11." +
            getMessage({
              ja: "設置について",
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
            <Text whiteSpace="pre-line">
              {getMessage({
                ja: "",
                us: "",
                cn: "",
                language,
              })}
            </Text>
          </Box>
          <CustomBadge text="四国部品" />

          <OrderedList spacing={2} mt={4}>
            <ListItem>圧着作業</ListItem>
            <UnorderedList spacing={1} fontSize="sm">
              <ListItem>
                設置に専用ステー等が必要になります。通常、金属を溶接して作るのが強度が高くサイズも小さくなります。
              </ListItem>
            </UnorderedList>
          </OrderedList>
        </SectionBox>
        <SectionBox
          id="section12"
          title={
            "12." +
            getMessage({
              ja: "処理フロー図",
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
            <Text whiteSpace="pre-line">
              {getMessage({
                ja: "",
                us: "",
                cn: "",
                language,
              })}
            </Text>
            <DataFlowDiagram2 />
          </Box>
        </SectionBox>
        <SectionBox
          id="section13"
          title={
            "13." +
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
