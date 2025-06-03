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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Icon,
  createIcon,
  Spacer,
  Center,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import {
  FaFile,
  FaRegEdit,
  FaFolder,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { PiAppWindowFill, PiArrowFatLineDownLight } from "react-icons/pi";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "@/components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "@/components/ui/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/ui/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/ui/CustomBadge";
import DownloadLink from "../../components/DownloadLink";
import UnderlinedTextWithDrawer from "../../components/UnderlinedTextWithDrawer";
import ExternalLink from "../../components/ExternalLink";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ImageSliderModal from "../../components/ImageSliderModal"; // モーダルコンポーネントをインポート
import ReferenceSettingModal from "../../components/howTo/referenceSettingModal";
import { useUserContext } from "@/contexts/useUserContext";
import { supabase } from "@/utils/supabase/client";
import { useReadCount } from "@/hooks/useReadCount";
import { getIpAddress } from "@/lib/getIpAddress";
import { BsFiletypeExe } from "react-icons/bs";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import DownloadButton from "@/components/ui/DownloadButton2";
import UnzipModal from "app/skillBlogs/components/howTo/UnzipModal";
import FontInstallModal from "app/skillBlogs/components/howTo/FontInstall";
import { getLocalIp } from "../../components/getLocalIp";
import { Key } from "@/components/ui/Key";
import { ImageWithHighlight } from "../../components/ImageWidthHighlight";

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
  const {
    currentUserId,
    currentUserName,
    currentUserMainCompany,
    currentUserCompany,
    currentUserCreatedAt,
    getUserById,
    isLoading: isLoadingContext,
  } = useUserContext();

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
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const showToast = useCustomToast();
  // 点滅アニメーションを定義
  const blink = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  `;
  const blinkAnimation = `${blink} 0.8s infinite`;
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
              ja: "誘導ポイント設定一覧表の使い方",
              us: "How to use the Guidance Point Setting List",
              cn: "如何使用感应点设置列表。",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "誘導ポイント設定",
              us: "Guidance point setting",
              cn: "感应点设置",
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
            :2025-06-04
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
            <Text whiteSpace="pre-line">
              {getMessage({
                ja: "作業順を記した手順書にLED番号が有りますよね？その手順書を見ながら制御器のデータを手入力作成していると思います。これは手入力のミスが発生します。\n手順書から制御器に直接書き込むシステムを作成しました。",
                us: "There are LED numbers in the procedure manual that describes the work order, aren't there? I think you are manually inputting data into the controller while looking at the procedure manual. We have created a system that directly writes data from the procedure manual to the controller.",
                cn: "程序手册中不是有描述操作顺序的 LED 编号吗？我认为控制器的数据是在查看程序手册时手动创建的。我们创建了一个系统，可以直接从程序手册写入控制器。",
                language,
              })}
            </Text>
            <br />
            <Text>
              <Link
                href="/downloads/yps"
                isExternal
                color="blue.500"
                fontWeight="bold"
              >
                {getMessage({
                  ja: "誘導ポイント設定一覧表のダウンロードページ",
                  us: "Download page for induction point setting list",
                  cn: "感应点设置列表下载页面",
                  language,
                })}
              </Link>
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "本体のダウンロード",
              us: "Download the main unit",
              cn: "下载主机",
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
          <Text fontWeight="bold">
            {getMessage({
              ja: "下記のクリックで最新バージョンがダウンロードされます",
              us: "If it does not work correctly, do ",
              cn: "如果不能正常工作，请执行 ",
              language,
            })}
            <Box
              mt={2}
              w="140px"
              height="24px"
              border="1px solid"
              borderRadius="md"
              borderColor={
                colorMode === "light"
                  ? "custom.theme.light.800"
                  : "custom.theme.dark.100"
              }
              lineHeight="1"
              fontSize="inherit"
              overflow="hidden"
            >
              <DownloadButton
                currentUserName={currentUserName}
                url="/download/yps/yps"
                bg="custom.excel"
                color={
                  colorMode === "light" ? "custom.theme.light.900" : "white"
                }
              />
            </Box>
          </Text>
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "ファイルの展開(解凍)",
              us: "File decompression (unzip)",
              cn: "提取（解压）文件",
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
          <Text fontWeight="bold">
            {getMessage({
              ja: "ダウンロードした.zipファイルを",
              us: "Please ",
              cn: "",
              language,
            })}
            <UnzipModal />
            {getMessage({
              ja: "をしてください。",
              us: "the .zip file you downloaded.",
              cn: "下载的 .zip 文件。",
              language,
            })}
          </Text>

          <Text mt={6}>
            {getMessage({
              ja: "この解凍したファイルを利用する場所(通常はNASサーバー)に設置してください。",
              us: "Place the extracted files in the location where they will use it(usually the NAS server).",
              cn: "请将解压后的文件放置到需要使用的位置（通常为 NAS 服务器）。",
              language,
            })}
            <br />
            {getMessage({
              ja: "ファイル名を変更する場合は、先頭のYps*.**_は変更しないでください。バージョンアップ/アップロードができなくなります。",
              us: "If you want to rename the files, do not change the beginning part: Yps*._**. If you do, you will not be able to perform version upgrades or uploads.",
              cn: "如果要更改文件名，请不要更改以 Yps*.**_ 开头的部分，否则将无法进行版本升级或上传。",
              language,
            })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "参照設定の確認",
              us: "Check reference settings",
              cn: "检查参考设置",
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
          <Text fontWeight="bold">
            {getMessage({
              ja: "ファイルを開いて",
              us: "If it does not work correctly, do ",
              cn: "如果不能正常工作，请执行 ",
              language,
            })}
            <ReferenceSettingModal />
            {getMessage({
              ja: "をしてください。",
              us: ".",
              cn: "。",
              language,
            })}
          </Text>

          <Text mt={6}>
            {getMessage({
              ja: "参照不可がある場合はその画面を「問い合わせ」から連絡をください。",
              us: 'If it is unreferenced, please send us the screen from the "Contact" chat.',
              cn: '如果屏幕没有参考资料，请通过 "联系" 聊天将其发送给我们。',
              language,
            })}
            <br />
            {getMessage({
              ja: "誘導ポイント設定一覧表では標準ライブラリしか使ってないので通常は参照不可は無いはずです。",
              us: "The induction point setting list uses only the standard library, so the unreferenced should not occur.",
              cn: "感应点设置列表只使用标准库，因此不应出现不引用的情况。",
              language,
            })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section5"
          title={
            "5." +
            getMessage({
              ja: "設定",
              us: "setting",
              cn: "设置",
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
          <Text mt={2}>
            {getMessage({
              ja: "使用する為の設定を行います。これは初回だけの作業です。",
              us: "Set up the system for use. This is only the first time.",
              cn: "设置系统以便使用。这是首次操作。",
              language,
            })}
          </Text>
        </SectionBox>
        <Box ml={2}>
          <SectionBox
            id="section5_1"
            title={
              "5-1." +
              getMessage({
                ja: "サーバーの設定",
                us: "Server Configuration",
                cn: "服务器配置",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
            mt="0"
          >
            <Divider
              my={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold" mb={6}>
              {getMessage({
                ja: "バージョンアップ/アップロード用のサーバーを設定します。",
                us: "Set up a server for version upgrades/uploads.",
                cn: "建立一个用于升级/上传的服务器。",
                language,
              })}
            </Text>
            <Text mb={2}>
              {"1. " +
                getMessage({
                  ja: "VerUpに使用する場所のアドレスをコピーする",
                  us: "Copy the address of the location to be used for VerUp.",
                  cn: "复制用于 VerUp 的位置地址。",
                  language,
                })}
            </Text>
            <Text ml={4}>
              {getMessage({
                ja: "フォルダを表示して使用場所まで移動。アドレスバー内の右空きスペースをクリックします。",
                us: "Display the folder and navigate to the location where it is used. Click on the right free space in the address bar.",
                cn: "显示文件夹并导航到使用该文件夹的位置。单击地址栏中右侧的空闲空间。",
                language,
              })}
            </Text>
            <ImageWithHighlight
              src="/images/0010/folder-selectPath.webp"
              label="※フォルダ(Explorer)"
              highlights={[
                {
                  top: "27%",
                  left: "92%",
                  w: "8%",
                  h: "25%",
                  animation: "blink",
                  border: "transparent",
                  label: "Click",
                  labelTop: "50%",
                  bg: "repeating-linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 4px, transparent 4px, transparent 6px)",
                },
              ]}
            />
            <Text>
              {getMessage({
                ja: "クリックするとアドレスを選択した状態になるのでコピーします。",
                us: "Click to select the address and copy it.",
                cn: "点击选择地址并复制。",
                language,
              })}
            </Text>

            <Box position="relative" w="100%" mt={2} mb={6}>
              <Image src="/images/0010/folder-selectPath2.webp" w="100%" />
              <Center fontSize="xs">※フォルダ(Explorer)</Center>
            </Box>
            <Text>2.[設定]の赤枠にアドレスを入力します。</Text>
            <Text ml={4}>
              {currentUserCompany}の場合は setting_
              {getLocalIp(currentUserCompany)} の右セルに入力します。
            </Text>
            <ImageWithHighlight
              src="/images/0010/sheet-setting.webp"
              label="※シート[設定]"
              highlights={[
                {
                  top: "27%",
                  left: "5%",
                  w: "80%",
                  h: "28%",
                },
              ]}
            />
            <Text>3.接続テスト</Text>
            <Text ml={4}>
              シート[設定]を選択した状態で
              <Key>Ctrl</Key> + <Key>Shift</Key> + <Key>Enter</Key>
              を押す。以下が表示されたらサーバーの設定は完了です。
            </Text>
            <ImageWithHighlight
              src="/images/0010/successcomplete.webp"
              label="※シート[設定]"
            />
            <Text ml={4}>
              ※もし接続出来ない場合は、ネットワークドライブになっている可能性が高いです。その場合は連絡ください。IPアドレスの調べ方をここに追記します。
            </Text>
          </SectionBox>
          <SectionBox
            id="section5_2"
            title={
              "5-2." +
              getMessage({
                ja: "印鑑の設定",
                us: "",
                cn: "",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
            mt="16px"
          >
            <Divider
              my={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold" mb={6}>
              {getMessage({
                ja: "シート[入力原紙]を作成した時の印鑑を設定します。",
                us: "",
                cn: "",
                language,
              })}
            </Text>
            <Text>1.[設定]の赤枠に印鑑に使用する名前を入力します。</Text>
            <Text ml={4}>
              {currentUserCompany}の場合は stump_
              {getLocalIp(currentUserCompany)} の右セルに入力します。
            </Text>
            <ImageWithHighlight
              src="/images/0010/sheet-setting.webp"
              label="※シート[設定]"
              highlights={[
                {
                  top: "60%",
                  left: "5%",
                  w: "68%",
                  h: "28%",
                },
              ]}
            />
            <Text>使用しない場合は空欄にしてください。</Text>
          </SectionBox>
        </Box>
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "アップロード",
              us: "",
              cn: "",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="16px"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold" mb={6}>
            {getMessage({
              ja: "他のファイルがバージョンアップ出来るようにアップロードします。",
              us: "",
              cn: "",
              language,
            })}
          </Text>
          <Text>
            1.シート[設定]を選択した状態で<Key>Ctrl</Key> + <Key>Enter</Key>
            を押すとシート[入力原紙]が作成されます。
          </Text>
          <ImageWithHighlight
            src="/images/0010/sheet-input.webp"
            label="※フォルダ(Explorer)"
            highlights={[
              {
                top: "92%",
                left: "21%",
                w: "11.5%",
                h: "8%",
                borderRadius: "7px",
              },
            ]}
          />
          <Text>
            2.右上の<Key>MENU</Key>をクリックします。
          </Text>
          <ImageWithHighlight
            src="/images/0010/sheet-input.webp"
            label="※シート(入力原紙)"
            highlights={[
              {
                top: "3%",
                left: "94%",
                w: "7%",
                h: "8%",
                borderRadius: "7px",
              },
            ]}
          />
          <Text>3.MENUが開いたらVerUpをクリック</Text>
          <Center w="100%" my={6} flexDirection="column">
            <Box position="relative">
              <Box h="200px" overflow="hidden">
                <Image src="/images/0010/yps-menu.webp" w="200px" />
                <Box
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  height="30%"
                  bgGradient="linear(to-t, rgba(255,255,255,1), transparent)"
                  pointerEvents="none"
                />
              </Box>
              <Box
                position="absolute"
                top="-0.5%"
                left="48%"
                w="26%"
                h="12%"
                bg="transparent"
                borderRadius="7px"
                border="2px solid red"
              />
            </Box>
            <Box>※フォーム[MENU]</Box>
          </Center>
          <Text>
            4.[このVerのアップロード]を<Key>Shift</Key>
            を押したままクリックします。
          </Text>
          <ImageWithHighlight
            src="/images/0010/yps-verup.webp"
            srcWidth="300px"
            label="※フォーム(VerUp)"
            highlights={[
              {
                top: "39%",
                left: "2%",
                w: "55%",
                h: "13%",
                borderRadius: "7px",
              },
            ]}
          />
          <Text>5秒程度でアップロードが完了します。</Text>
        </SectionBox>
        <SectionBox
          id="section7"
          title={
            "7." +
            getMessage({
              ja: "バージョンアップファイルの設置",
              us: "",
              cn: "",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="16px"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold" mb={6}>
            {getMessage({
              ja: "他のファイルがバージョンアップ出来るようにVerUp.xlsmを準備します。",
              us: "",
              cn: "",
              language,
            })}
            この操作は初回だけで以降は必要ありません。
          </Text>
          <Text>
            以下のDownloadをクリックしてVerUp.zipをダウンロードしてください。
          </Text>
          <Box
            mt={2}
            w="140px"
            height="24px"
            border="1px solid"
            borderRadius="md"
            borderColor={
              colorMode === "light"
                ? "custom.theme.light.800"
                : "custom.theme.dark.100"
            }
            lineHeight="1"
            fontSize="inherit"
            overflow="hidden"
          >
            <DownloadButton
              currentUserName={currentUserName}
              url="/download/yps/verup"
              bg="custom.excel"
              color={colorMode === "light" ? "custom.theme.light.900" : "white"}
            />
          </Box>
          <Text fontWeight="bold">
            {getMessage({
              ja: "ダウンロードした.zipファイルを",
              us: "",
              cn: "",
              language,
            })}
            <UnzipModal />
            {getMessage({
              ja: "をしてください。",
              us: ".",
              cn: "。",
              language,
            })}
          </Text>
          <Text>
            展開したVerUp.xlsmを[設定]のsetting_{getLocalIp(currentUserCompany)}
            のアドレスに設置します。
          </Text>
          <ImageWithHighlight
            src="/images/0010/yps-masterfolder.webp"
            label="※Explorer[setting_の場所]"
            highlights={[
              {
                top: "68%",
                left: "2%",
                w: "30%",
                h: "14%",
                borderRadius: "7px",
              },
            ]}
          />
          <Text>以上でバージョンアップが可能になります。</Text>
        </SectionBox>
        <SectionBox
          id="section8"
          title={
            "8." +
            getMessage({
              ja: "データ入力",
              us: "",
              cn: "",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="16px"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold" mb={6}>
            {getMessage({
              ja: "誘導ポイント設定一覧表を作成していきます。",
              us: "",
              cn: "",
              language,
            })}
          </Text>
          <Text>
            シート[入力原紙]に入力していきます。
            <br />
            ※シート名は自由に変更して構いません。
          </Text>
        </SectionBox>
        <SectionBox
          id="section8_1"
          title={
            "8-1." +
            getMessage({
              ja: "システム予約と役割",
              us: "",
              cn: "",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="16px"
          size="sm"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold" mb={6}>
            {getMessage({
              ja: "システムが利用している箇所を解説します。",
              us: "",
              cn: "",
              language,
            })}
          </Text>
          <ImageWithHighlight
            src="/images/0010/yps-sheet.webp"
            label="※フォーム(VerUp)"
            highlights={[
              {
                top: "68%",
                left: "5%",
                w: "4%",
                h: "14%",
                borderRadius: "7px",
                label: "1.",
                animation: "blink",
              },
              {
                top: "50%",
                left: "74.5%",
                w: "4%",
                h: "5%",
                borderRadius: "7px",
                label: "2.",
                labelTop: "30%",
                labelLeft: "-40%",
                animation: "blink",
              },
              {
                top: "50%",
                left: "97%",
                w: "4%",
                h: "5%",
                borderRadius: "7px",
                label: "3.",
                labelTop: "30%",
                labelLeft: "-40%",
                animation: "blink",
              },
              {
                top: "68.5%",
                left: "75%",
                w: "25%",
                h: "13%",
                borderRadius: "5px",
                label: "4.",
                labelTop: "30%",
                labelLeft: "-6%",
                animation: "blink",
              },
              {
                top: "64%",
                left: "75%",
                w: "25%",
                h: "5%",
                borderRadius: "5px",
                label: "5.",
                labelTop: "30%",
                labelLeft: "-6%",
                animation: "blink",
              },
            ]}
          />
          <List spacing={1} mb={6} styleType="none" pl={0}>
            <ListItem>
              <Box as="span" color="red">
                1.
              </Box>
              [ｲﾝﾗｲﾝ]この列をインラインナンバーとして認識します。
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                2.
              </Box>
              [start_]から右を製品品番として認識します。
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                3.
              </Box>
              [end_]から左を製品品番として認識します。
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                4.
              </Box>
              [ｲﾝﾗｲﾝ]がある行で[start_]から[end_]までの列を製品品番として認識します。
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                5.
              </Box>
              書き込み器への設定ナンバーとして使用されます。この行は必ず
              <Box as="span" color="red">
                4.
              </Box>
              の1セル上にある必要があります。
            </ListItem>
          </List>
          <Text>
            上記の理由により
            <Box as="span" color="red">
              1.-3.
            </Box>
            のセルは文字を変更/削除しないで下さい。それ以外は自由に変更して大丈夫です。
          </Text>
        </SectionBox>
        <SectionBox
          id="section8_2"
          title={
            "8-2." +
            getMessage({
              ja: "入力サンプル",
              us: "",
              cn: "",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="16px"
          size="sm"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold" mb={6}>
            {getMessage({
              ja: "このように自由に編集可能です。",
              us: "",
              cn: "",
              language,
            })}
          </Text>

          <ImageWithHighlight
            src="/images/0010/yps-sample.webp"
            label="※シート[入力原紙]"
            highlights={[
              {
                top: "51%",
                left: "3%",
                w: "4.2%",
                h: "49%",
                label: "1.",
                labelTop: "-5%",
                labelLeft: "50%",
                borderRadius: "5px",
                animation: "blink",
                bg: "rgba(255,0,0,0.1)",
              },
              {
                top: "40%",
                left: "73.5%",
                w: "26.5%",
                h: "3%",
                label: "2.",
                labelTop: "-3%",
                labelLeft: "-5%",
                borderRadius: "5px",
                animation: "blink",
                bg: "rgba(255,0,0,0.1)",
              },
              {
                top: "50.5%",
                left: "73.5%",
                w: "26.5%",
                h: "50%",
                label: "3.",
                labelTop: "-3%",
                labelLeft: "-5%",
                borderRadius: "5px",
                animation: "blink",
                bg: "rgba(255,0,0,0.1)",
              },
            ]}
          />

          <List spacing={1} mb={6} styleType="none" pl={0}>
            <ListItem>
              <Box as="span" color="red">
                1.
              </Box>
              制御器のLED番号。背景色を変える事で複数台での作業に対応。
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                2.
              </Box>
              制御器の設定番号。制御器のプロジェクト番号。空欄で出力しない。
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                3.
              </Box>
              作業項目の有無。空欄じゃない場合は作業有りとして認識。
            </ListItem>
          </List>
          <Text>
            作業項目の入力が特に手間が掛かると思いますが、これらは生産準備+からデータ取得できる可能性があります。
          </Text>
        </SectionBox>
        <SectionBox
          id="section9"
          title={
            "9." +
            getMessage({
              ja: "MENU画面",
              us: "",
              cn: "",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="16px"
          size="sm"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <ImageWithHighlight
            src="/images/0010/yps-menu.webp"
            srcWidth="200px"
            label="※フォーム[MENU]"
            highlights={[
              {
                top: "9%",
                left: "7.5%",
                w: "82.5%",
                h: "14%",
                label: "1.",
                labelTop: "3%",
                labelLeft: "-6%",
                borderRadius: "5px",
                animation: "blink",
                bg: "rgba(255,0,0,0.1)",
              },
              {
                top: "28%",
                left: "7.5%",
                w: "82.5%",
                h: "28%",
                label: "2.",
                labelTop: "3%",
                labelLeft: "-6%",
                borderRadius: "5px",
                animation: "blink",
                bg: "rgba(255,0,0,0.1)",
              },
              {
                top: "75%",
                left: "7.5%",
                w: "82.5%",
                h: "14.5%",
                label: "3.",
                labelTop: "3%",
                labelLeft: "-6%",
                borderRadius: "5px",
                animation: "blink",
                bg: "rgba(255,0,0,0.1)",
              },
            ]}
          />
          <List spacing={1} mb={6} styleType="none" pl={0}>
            <ListItem>
              <Box as="span" color="red">
                1.
              </Box>
              8-2.1の背景色ごとにボタンが表示されます。最大4台。
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                2.
              </Box>
              YIC機種:異なる場合に変更。
            </ListItem>
            <ListItem ml={3}>出力ポート:YICに対する出力ポートを指定。</ListItem>
            <ListItem ml={3}>
              72と73を入れ替える:制御器によって反転する場合があります。徳島工場の保有は反転してる為、チェックが必要。
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                3.
              </Box>
              YICに転送:転送設定を元にYICにシリアル送信します。
            </ListItem>
            <ListItem ml={3}>設定一覧表を作成:作成します。</ListItem>
          </List>
        </SectionBox>
        <SectionBox
          id="section10"
          title={
            "10." +
            getMessage({
              ja: "設定一覧表",
              us: "",
              cn: "",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          mt="16px"
          size="sm"
        >
          <Divider
            my={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            9.の設定一覧を作成をオンで作成されます。LEDベースでの確認が容易です。
          </Text>

          <ImageWithHighlight
            src="/images/0010/yps-inlineClipSheet.webp"
            label="※シート[出力]"
            highlights={[
              {
                top: "31%",
                left: "90%",
                w: "7.7%",
                h: "16%",
                label: "1.",
                labelTop: "3%",
                labelLeft: "-20%",
                bg: "rgba(255,0,0,0.1)",
                borderRadius: "7px",
                animation: "blink",
              },
              {
                top: "66%",
                left: "13%",
                w: "5%",
                h: "34%",
                label: "2.",
                labelTop: "6%",
                labelLeft: "-33%",
                bg: "rgba(255,0,0,0.1)",
                borderRadius: "7px",
                animation: "blink",
              },
            ]}
          />
          <List spacing={1} mb={6} styleType="decimal" pl={4}>
            <ListItem
              sx={{
                "&::marker": {
                  color: "red",
                },
              }}
            >
              <Key>MENU</Key>
              をクリックしてYICへの書込みを行います。9.MENU画面と同じなので説明は割愛。
            </ListItem>
            <ListItem
              sx={{
                "&::marker": {
                  color: "red",
                },
              }}
            >
              ここにバーコードが表示されていない場合はバーコードフォントがインストールされていません。下記手順でインストールしてください。
            </ListItem>
            <Box
              mt={2}
              w="140px"
              height="24px"
              border="1px solid"
              borderRadius="md"
              borderColor={
                colorMode === "light"
                  ? "custom.theme.light.800"
                  : "custom.theme.dark.100"
              }
              lineHeight="1"
              fontSize="inherit"
              overflow="hidden"
            >
              <DownloadButton
                currentUserName={currentUserName}
                url="/download/library/code39"
                bg="custom.windows"
                color={
                  colorMode === "light" ? "custom.theme.light.900" : "white"
                }
              />
            </Box>
            <Text>
              ダウンロードしたら <UnzipModal />
              して、
              <FontInstallModal />
              を実行してください。このバーコードからYICに接続したリーダーから設定番号を呼び出し出来るようになります。
            </Text>
          </List>
        </SectionBox>

        <SectionBox
          id="section11"
          title={
            "11." +
            getMessage({
              ja: "YICへの出力手順",
              us: "Output to YIC",
              cn: "输出至 YIC",
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
          <Text fontWeight="bold">
            {getMessage({
              ja: "以下の順番で書込みを行ってください。",
              us: "",
              cn: "",
              language,
            })}
          </Text>
          <List spacing={1} my={4} styleType="decimal" pl={4}>
            <ListItem>書込器の電源を入れる</ListItem>
            <ListItem>PCと書込器をUSBシリアル変換で接続</ListItem>
            <ListItem>Yps*.**_.xlsmのMENUを開く</ListItem>
            <ListItem>YIC機種を設定</ListItem>
            <ListItem>出力ポートの設定</ListItem>
            <ListItem>YICに転送をオン</ListItem>
            <ListItem>実行を押す</ListItem>
          </List>
        </SectionBox>
        <SectionBox
          id="section12"
          title={
            "12." +
            getMessage({
              ja: "バージョンアップ",
              us: "",
              cn: "",
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
          <Text fontWeight="bold">
            {getMessage({
              ja: "以下の手順で新しいバージョンに更新できます。",
              us: "",
              cn: "",
              language,
            })}
          </Text>
          <Center w="100%" my={6} flexDirection="column">
            <Box position="relative">
              <Image src="/images/0010/yps-verup-select.webp" />
            </Box>
            <Box>フォーム[VerUp]</Box>
          </Center>

          <List spacing={1} my={4} styleType="decimal" pl={4}>
            <ListItem>入力原紙のMENUからVerUpを選択</ListItem>
            <ListItem>更新したいバージョンを選択。通常は最新を選択。</ListItem>
            <ListItem>このバージョンを選択をクリック</ListItem>
            <ListItem>
              VerUp.xlsmが開くので<Key baseColor="red">VerUp</Key>をクリック
            </ListItem>

            <ListItem>
              数秒後に更新が完了。シート[Ver]と[設定]そしてプログラムコードが更新されます。
            </ListItem>
          </List>
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
            pb="10vh"
          >
            <Text
              px="13px"
              py="20px"
              style={{
                textAlign: "left",
                color: "#fff",
                textShadow: "none",
                fontFamily: "'Yomogi', sans-serif",
                fontWeight: "400",
              }}
              lineHeight={1.6}
            >
              {getMessage({
                ja: "このシステムは以下の問題を含んでいる可能性があります。",
                us: "This system is actually in operation, but it is incomplete and contains the following problems",
                cn: "该系统已实际运行，但并不完整，存在以下问题",
                language,
              })}
              <br />
              <br />
              {"1." +
                getMessage({
                  ja: "200Pでの動作テストは未確認。実際に使用して不具合がある場合は連絡ください。",
                  us: "The 200P has not been held at the factory in operation, so its operation has not been tested.",
                  cn: "由于 200P 出厂时未进行运行测试。",
                  language,
                })}
              <br />
            </Text>
            <Image
              src="/images/hippo.gif"
              alt="Hippo"
              style={{
                position: "absolute",
                top: "73%",
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
