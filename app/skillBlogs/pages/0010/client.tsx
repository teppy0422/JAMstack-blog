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
} from "@chakra-ui/react";

import { PiAppWindowFill, PiArrowFatLineDownLight } from "react-icons/pi";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "@/components/content";
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
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

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
            :2025-06-14
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
            <ModalYps />
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
              ja: "してください。",
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
              ja: "EXCELの設定",
              us: "Check reference settings",
              cn: "EXCEL 设置。",
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
              ja: "プログラムを含むエクセルの場合に必要ないつもの設定です。",
              us: "This is the usual setup required for Excel, including programs.",
              cn: "这是 Excel（包括程序）所需的常规设置。",
              language,
            })}
          </Text>
        </SectionBox>
        <Box ml={2}>
          <SectionBox
            id="section4_1"
            title={
              "4-1." +
              getMessage({
                ja: "セキュリティの設定",
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
              <VBATrustSettingsPage />
              {getMessage({
                ja: "をしてください。",
                us: ".",
                cn: "。",
                language,
              })}
            </Text>
            <Box h="2rem" />
          </SectionBox>
          <SectionBox
            id="section4_2"
            title={
              "4-2." +
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
        </Box>
        <SectionBox
          id="section5"
          title={
            "5." +
            getMessage({
              ja: "設定",
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
                  ja: "VerUpに使用する場所のアドレスをコピーする。これは通常、サーバーのトップレベルに",
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
              label={
                "*" +
                getMessage({
                  ja: "フォルダ(Explorer)",
                  us: "Folder (Explorer)",
                  cn: "文件夹(Explorer)",
                  language,
                })
              }
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
              <Center fontSize="xs">
                {"*" +
                  getMessage({
                    ja: "フォルダ(Explorer)",
                    us: "Folder (Explorer)",
                    cn: "文件夹(Explorer)",
                    language,
                  })}
              </Center>
            </Box>
            <Text>
              2.
              {getMessage({
                ja: "[設定]の赤枠にアドレスを入力します。",
                us: "Enter the address in the red box under [Settings].",
                cn: "[在 '设置' 下的红色框中输入地址。",
                language,
              })}
            </Text>
            <Text ml={4}>
              {currentUserCompany}の場合は setting_
              {getLocalIp(currentUserCompany)} の右セルに入力します。
            </Text>
            <ImageWithHighlight
              src="/images/0010/sheet-setting.webp"
              label={
                "*" +
                getMessage({
                  ja: "シート[設定]",
                  us: "Sheet [Setup].",
                  cn: "工作表 [设置]。",
                  language,
                })
              }
              highlights={[
                {
                  top: "27%",
                  left: "5%",
                  w: "80%",
                  h: "28%",
                },
              ]}
            />
            <Text>
              {"3." +
                getMessage({
                  ja: "接続テスト",
                  us: "connection test",
                  cn: "连接测试",
                  language,
                })}
            </Text>
            <Text ml={4}>
              {getMessage({
                ja: "シート[設定]を選択した状態で",
                us: "While selecting the [Settings] sheet,",
                cn: "选中[设置]工作表的状态下，",
                language,
              })}
              <Key>Ctrl</Key> + <Key>Shift</Key> + <Key>Enter</Key>
              {getMessage({
                ja: "を押す。以下が表示されたらサーバーの設定は完了です。",
                us: "press the keys. If the following is displayed, the server settings are complete.",
                cn: "按下这些键。如果显示以下内容，说明服务器设置已完成。",
                language,
              })}
            </Text>
            <ImageWithHighlight
              src="/images/0010/successcomplete.webp"
              label={
                "*" +
                getMessage({
                  ja: "シート[設定]",
                  us: "Sheet [Setup].",
                  cn: "工作表 [设置]。",
                  language,
                })
              }
            />
            <Text ml={4}>
              {"*" +
                getMessage({
                  ja: "もし接続出来ない場合は、ネットワークドライブになっている可能性が高いです。その場合は連絡ください。IPアドレスの調べ方をここに追記します。",
                  us: "If you cannot connect, it is most likely a network drive. If so, please contact us and we will add here how to find out the IP address.",
                  cn: "如果无法连接，很可能是网络硬盘的问题。如果是这种情况，请联系我们，我们会在这里补充如何查找 IP 地址。",
                  language,
                })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section5_2"
            title={
              "5-2." +
              getMessage({
                ja: "印鑑の設定",
                us: "Seal Setup",
                cn: "设置密封件",
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
                us: "Set the seal when the sheet [input source paper] is created.",
                cn: "设置纸张 [输入源纸张] 创建时的封印。",
                language,
              })}
            </Text>
            <Text>
              {"1." +
                getMessage({
                  ja: "[設定]の赤枠に印鑑に使用する名前を入力します。",
                  us: "Enter the name to be used for the seal in the red box under [Settings].",
                  cn: "[在 '设置' 下的红框中输入印章使用的名称。",
                  language,
                })}
            </Text>
            <Text ml={4}>
              {getMessage({
                ja: "{currentUserCompany}の場合は stump_{getLocalIp(currentUserCompany)} の右セルに入力します。",
                us: "If your company is {currentUserCompany}, enter it in the cell to the right of stump_{getLocalIp(currentUserCompany)}.",
                cn: "如果是{currentUserCompany}，请在 stump_{getLocalIp(currentUserCompany)} 的右侧单元格中输入。",
                language,
              })}
            </Text>

            <ImageWithHighlight
              src="/images/0010/sheet-setting.webp"
              label={
                "*" +
                getMessage({
                  ja: "シート[設定]",
                  us: "Sheet [Setup].",
                  cn: "工作表 [设置]。",
                  language,
                })
              }
              highlights={[
                {
                  top: "60%",
                  left: "5%",
                  w: "68%",
                  h: "28%",
                },
              ]}
            />
            <Text>
              {getMessage({
                ja: "使用しない場合は空欄にしてください。",
                us: "如果未使用，则留空。",
                cn: "如果未使用，则留空。",
                language,
              })}
            </Text>
          </SectionBox>
        </Box>
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "アップロード",
              us: "upload",
              cn: "上传",
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
              us: "Upload so that other files can be upgraded.",
              cn: "上传，以便升级其他文件。",
              language,
            })}
          </Text>
          <Text>
            {"1." +
              getMessage({
                ja: "シート[設定]を選択した状態で",
                us: "While the [設定] sheet is selected,",
                cn: "在选择 [設定] 工作表的状态下，",
                language,
              })}
            <Key>Ctrl</Key> + <Key>Enter</Key>
            {getMessage({
              ja: "を押すとシート[入力原紙]が作成されます。",
              us: "press <Ctrl> + <Enter> to create the [入力原紙] sheet.",
              cn: "按下 <Ctrl> + <Enter> 后将创建 [入力原紙] 工作表。",
              language,
            })}
          </Text>

          <ImageWithHighlight
            src="/images/0010/sheet-input.webp"
            label={
              "*" +
              getMessage({
                ja: "フォルダ(Explorer)",
                us: "Folder (Explorer)",
                cn: "文件夹(Explorer)",
                language,
              })
            }
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
            {getMessage({
              ja: "2.右上の",
              us: "2. Click",
              cn: "2. 点击右上角的",
              language,
            })}
            <Key>MENU</Key>
            {getMessage({
              ja: "をクリックします。",
              us: "in the top-right corner.",
              cn: "。",
              language,
            })}
          </Text>
          <ImageWithHighlight
            src="/images/0010/sheet-input.webp"
            label={getMessage({
              ja: "※シート[入力原紙]",
              us: "* Sheet [Input Template]",
              cn: "※表格[输入模板]",
              language,
            })}
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
          <Text>
            {"3." +
              getMessage({
                ja: "MENUが開いたらVerUpをクリック",
                us: "When the MENU opens, click VerUp.",
                cn: "菜单打开后，单击 VerUp。",
                language,
              })}
          </Text>
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
            <Box>
              {"※" +
                getMessage({
                  ja: "フォーム[MENU]",
                  us: "Form [MENU].",
                  cn: "输入 [MENU]。",
                  language,
                })}
            </Box>
          </Center>
          <Text>
            {"4." +
              getMessage({
                ja: "[このVerのアップロード]を",
                language,
              })}
            <Key>Shift</Key>
            {getMessage({
              ja: "を押したままクリックします。",
              us: "Click [Upload this Ver] while holding ",
              cn: "按住",
              language,
            })}
            {getMessage({
              ja: "",
              us: ".",
              cn: "键的同时点击[上传此版本]。",
              language,
            })}
          </Text>
          <ImageWithHighlight
            src="/images/0010/yps-verup.webp"
            srcWidth="300px"
            label={getMessage({
              ja: "※フォーム(VerUp)",
              us: "*Form (VerUp)",
              cn: "※表单（版本升级）",
              language,
            })}
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
          <Text>
            {getMessage({
              ja: "5秒程度でアップロードが完了します。",
              us: "Uploading is completed in about 5 seconds.",
              cn: "上传大约在 5 秒钟内完成。",
              language,
            })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section7"
          title={
            "7." +
            getMessage({
              ja: "バージョンアップファイルの設置",
              us: "Installation of upgrade files",
              cn: "安装升级文件",
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
              us: "Prepare VerUp.xlsm so that other files can be upgraded.",
              cn: "准备好 VerUp.xlsm，以便升级其他文件。",
              language,
            })}
            {getMessage({
              ja: "この操作は初回だけで以降は必要ありません。",
              us: "This operation is only required the first time and is not necessary thereafter.",
              cn: "该操作仅在第一次需要时进行，以后不再需要。",
              language,
            })}
          </Text>
          <Text>
            {getMessage({
              ja: "以下のDownloadをクリックしてVerUp.zipをダウンロードしてください。",
              us: "Click Download below to download VerUp.zip.",
              cn: "单击下面的下载链接下载 VerUp.zip。",
              language,
            })}
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
              us: "Please extract the downloaded .zip file using",
              cn: "请使用以下工具解压下载的.zip文件",
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
            {getMessage({
              ja: "展開したVerUp.xlsmを[設定]のsetting_",
              us: "Place the extracted VerUp.xlsm in the cell next to setting_",
              cn: "将解压后的 VerUp.xlsm 放置在 [設定] 表中的 setting_",
              language,
            })}
            {getLocalIp(currentUserCompany)}
            {getMessage({
              ja: "のアドレスに設置します。",
              us: " in the [Setting] sheet.",
              cn: " 的地址处。",
              language,
            })}
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
          <Text>
            {getMessage({
              ja: "以上でバージョンアップが可能になります。",
              us: "This is all that is required to upgrade the version.",
              cn: "这就是启动升级所需的全部条件。",
              language,
            })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section8"
          title={
            "8." +
            getMessage({
              ja: "データ入力",
              us: "data entry",
              cn: "数据输入",
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
              us: "We will create a list of induction point settings.",
              cn: "将编制一份感应点设置清单。",
              language,
            })}
          </Text>
          <Text>
            {getMessage({
              ja: "シート[入力原紙]に入力していきます。",
              us: "The data will be entered on the sheet [input source paper].",
              cn: "纸张 [输入源纸张]。",
              language,
            })}
            <br />
            {"*" +
              getMessage({
                ja: "シート名は自由に変更して構いません。",
                us: "You may change the name of the sheet as you wish.",
                cn: "工作表的名称可随意更改。",
                language,
              })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section8_1"
          title={
            "8-1." +
            getMessage({
              ja: "システム予約と役割",
              us: "System Reservations and Roles",
              cn: "系统预订和角色",
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
              us: "This section explains where the system is used.",
              cn: "本节说明了系统的使用范围。",
              language,
            })}
          </Text>
          <ImageWithHighlight
            src="/images/0010/yps-sheet.webp"
            label={getMessage({
              ja: "※フォーム(VerUp)",
              us: "*Form (VerUp)",
              cn: "※表单（VerUp）",
              language,
            })}
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
              {getMessage({
                ja: "[ｲﾝﾗｲﾝ]この列をインラインナンバーとして認識します。",
                us: "The column labeled [INLINE] is recognized as the inline number.",
                cn: "将标记为 [ｲﾝﾗｲﾝ] 的列识别为 inline 编号。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                2.
              </Box>
              {getMessage({
                ja: "[start_]から右を製品品番として認識します。",
                us: "The columns to the right of [start_] are recognized as product numbers.",
                cn: "从 [start_] 开始向右的列被识别为产品编号。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                3.
              </Box>
              {getMessage({
                ja: "[end_]から左を製品品番として認識します。",
                us: "The columns to the left of [end_] are recognized as product numbers.",
                cn: "从 [end_] 开始向左的列被识别为产品编号。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                4.
              </Box>
              {getMessage({
                ja: "[ｲﾝﾗｲﾝ]がある行で[start_]から[end_]までの列を製品品番として認識します。",
                us: "In the row with [INLINE], the columns from [start_] to [end_] are recognized as product numbers.",
                cn: "在含有 [ｲﾝﾗｲﾝ] 的行中，从 [start_] 到 [end_] 的列被识别为产品编号。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                5.
              </Box>
              {getMessage({
                ja: "書き込み器への設定ナンバーとして使用されます。この行は必ず",
                us: "Used as the setting number for the writer. This row must be placed",
                cn: "作为写入器的设定编号使用。该行必须位于",
                language,
              })}
              <Box as="span" color="red">
                4.
              </Box>
              {getMessage({
                ja: "の1セル上にある必要があります。",
                us: "one cell above line 4.",
                cn: "第4条上方的一个单元格中。",
                language,
              })}
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
              us: "Input Sample",
              cn: "输入样本",
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
              us: "It can be freely edited in this way.",
              cn: "这样就可以自由编辑。",
              language,
            })}
          </Text>

          <ImageWithHighlight
            src="/images/0010/yps-sample.webp"
            label={
              "*" +
              getMessage({
                ja: "シート[入力原紙]",
                us: " Sheet [Input Template]",
                cn: "表格[输入模板]",
                language,
              })
            }
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
              {getMessage({
                ja: "制御器のLED番号。背景色を変える事で複数台での作業に対応。",
                us: "LED number of the controller. Background color helps distinguish multiple devices.",
                cn: "控制器的LED编号。通过更改背景色支持多台设备同时作业。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                2.
              </Box>
              {getMessage({
                ja: "制御器の設定番号。制御器のプロジェクト番号。空欄で出力しない。",
                us: "Setting number of the controller (project number). If left blank, it will not be output.",
                cn: "控制器的设定编号（项目编号）。留空时将不会输出。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                3.
              </Box>
              {getMessage({
                ja: "作業項目の有無。空欄じゃない場合は作業有りとして認識。",
                us: "Presence of a task item. If not blank, it will be recognized as a task.",
                cn: "作业项目是否存在。非空时将被视为有作业。",
                language,
              })}
            </ListItem>

            <Text>
              {getMessage({
                ja: "作業項目の入力が特に手間が掛かると思いますが、これらは生産準備+からデータ取得できる可能性があります。",
                us: "Entering task items may be time-consuming, but the data might be obtainable from Production Preparation+.",
                cn: "输入作业项目可能较为繁琐，但这些数据可能可以从“生产准备+”中获取。",
                language,
              })}
            </Text>
          </List>
        </SectionBox>
        <SectionBox
          id="section9"
          title={
            "9." +
            getMessage({
              ja: "MENU画面",
              us: "MENU screen",
              cn: "菜单屏幕",
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
            label={
              "※" +
              getMessage({
                ja: "フォーム[MENU]",
                us: "Form [MENU].",
                cn: "输入 [MENU]。",
                language,
              })
            }
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
              {getMessage({
                ja: "8-2.1の背景色ごとにボタンが表示されます。最大4台。",
                us: "Buttons are displayed for each background color in 8-2.1. Up to 4 units.",
                cn: "根据8-2.1的背景色显示按钮。最多支持4台。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                2.
              </Box>
              {getMessage({
                ja: "YIC機種:異なる場合に変更。",
                us: "YIC model: Change if different.",
                cn: "YIC机种：若不同则需更改。",
                language,
              })}
            </ListItem>
            <ListItem ml={3}>
              {getMessage({
                ja: "出力ポート:YICに対する出力ポートを指定。",
                us: "Output port: Specify the output port for YIC.",
                cn: "输出端口：指定针对YIC的输出端口。",
                language,
              })}
            </ListItem>
            <ListItem ml={3}>
              {getMessage({
                ja: "72と73を入れ替える:制御器によって反転する場合があります。徳島工場の保有は反転してる為、チェックが必要。",
                us: "Swap 72 and 73: May be reversed depending on the controller. Tokushima factory has reversed setup, so check is necessary.",
                cn: "交换72和73：根据控制器可能会反转。德岛工厂设备为反转设置，需确认。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Box as="span" color="red">
                3.
              </Box>
              {getMessage({
                ja: "YICに転送:転送設定を元にYICにシリアル送信します。",
                us: "Transfer to YIC: Serial transmission to YIC based on transfer settings.",
                cn: "传输至YIC：根据传输设置进行串口发送。",
                language,
              })}
            </ListItem>
            <ListItem ml={3}>
              {getMessage({
                ja: "設定一覧表を作成:作成します。",
                us: "Create setting list: It will be created.",
                cn: "生成设定列表：将会生成。",
                language,
              })}
            </ListItem>
          </List>
        </SectionBox>
        <SectionBox
          id="section10"
          title={
            "10." +
            getMessage({
              ja: "設定一覧表",
              us: "List of settings",
              cn: "设置列表",
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
            {getMessage({
              ja: "9.の設定一覧を作成をオンで作成されます。LEDベースでの確認が容易です。",
              us: "The list of settings is created by turning on '9.' It is easy to check the LED-based settings.",
              cn: "LED 指示灯可以很容易地在 LED 基础上进行检查。",
              language,
            })}
          </Text>

          <ImageWithHighlight
            src="/images/0010/yps-inlineClipSheet.webp"
            label={getMessage({
              ja: "※シート[出力]",
              us: "※Sheet [Output]",
              cn: "※工作表[输出]",
              language,
            })}
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
              <Key>MENU</Key>{" "}
              {getMessage({
                ja: "をクリックしてYICへの書込みを行います。9.MENU画面と同じなので説明は割愛。",
                us: "Click to write to YIC. Same as screen 9 MENU, so explanation is omitted.",
                cn: "点击进行写入到YIC。与9.MENU画面相同，故省略说明。",
                language,
              })}
            </ListItem>
            <ListItem
              sx={{
                "&::marker": {
                  color: "red",
                },
              }}
            >
              {getMessage({
                ja: "ここにバーコードが表示されていない場合はバーコードフォントがインストールされていません。下記手順でインストールしてください。",
                us: "If the barcode is not displayed here, the barcode font is not installed. Please follow the procedure below to install it.",
                cn: "如果此处未显示条形码，则表示未安装条形码字体。请按照以下步骤安装。",
                language,
              })}
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
              {getMessage({
                ja: "ダウンロードしたら ",
                us: "After downloading, ",
                cn: "下载后，",
                language,
              })}
              <UnzipModal />
              {getMessage({
                ja: "して、",
                us: ", then unzip, and ",
                cn: "后解压，并执行",
                language,
              })}
              <FontInstallModal />
              {getMessage({
                ja: "を実行してください。このバーコードからYICに接続したリーダーから設定番号を呼び出し出来るようになります。",
                us: ". This allows the reader connected to YIC via this barcode to retrieve the setting number.",
                cn: "。执行此操作后，可以通过连接到YIC的读码器从此二维码调用设定编号。",
                language,
              })}
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
              us: "Please write in the following order.",
              cn: "请按以下顺序书写",
              language,
            })}
          </Text>
          <List spacing={1} my={4} styleType="decimal" pl={4}>
            <ListItem>
              {getMessage({
                ja: "書込器の電源を入れる",
                us: "Turn on the programmer power",
                cn: "打开写入器电源",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "PCと書込器をUSBシリアル変換で接続",
                us: "Connect the PC and programmer via USB-serial converter",
                cn: "通过USB串口转换器连接PC和写入器",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "Yps*.**_.xlsmのMENUを開く",
                us: "Open the MENU of Yps*.**_.xlsm",
                cn: "打开 Yps*.**_.xlsm 的菜单",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "YIC機種を設定",
                us: "Set the YIC model",
                cn: "设置YIC机型",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "出力ポートの設定",
                us: "Configure output port",
                cn: "设置输出端口",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "YICに転送をオン",
                us: "Turn on transfer to YIC",
                cn: "开启传输到YIC",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "実行を押す",
                us: "Press Execute",
                cn: "按下执行按钮",
                language,
              })}
            </ListItem>
          </List>
        </SectionBox>
        <SectionBox
          id="section12"
          title={
            "12." +
            getMessage({
              ja: "バージョンアップ",
              us: "version upgrade",
              cn: "版本升级",
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
              us: "You can update to the new version by following these steps",
              cn: "您可以按照以下步骤更新到新版本",
              language,
            })}
          </Text>
          <Center w="100%" my={6} flexDirection="column">
            <Box position="relative">
              <Image src="/images/0010/yps-verup-select.webp" />
            </Box>
            <Box>
              {getMessage({
                ja: "フォーム[VerUp]",
                us: "Form [VerUp]",
                cn: "表单[VerUp]",
                language,
              })}
            </Box>
          </Center>

          <List spacing={1} my={4} styleType="decimal" pl={4}>
            <ListItem>
              {getMessage({
                ja: "入力原紙のMENUからVerUpを選択",
                us: "Select VerUp from the MENU of the input form",
                cn: "从输入原纸的菜单中选择VerUp",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "更新したいバージョンを選択。通常は最新を選択。",
                us: "Select the version you want to update. Usually, select the latest.",
                cn: "选择要更新的版本。通常选择最新版本。",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "このバージョンを選択をクリック",
                us: "Click Select this version",
                cn: "点击选择此版本",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "VerUp.xlsmが開くので",
                us: "VerUp.xlsm will open, so click ",
                cn: "VerUp.xlsm 会打开，请点击 ",
                language,
              })}
              <Key baseColor="red">VerUp</Key>
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "数秒後に更新が完了。シート[Ver]と[設定]そしてプログラムコードが更新されます。",
                us: "The update will complete in a few seconds. Sheets [Ver] and [Setting], and the program code will be updated.",
                cn: "几秒后更新完成。[Ver]和[设置]工作表以及程序代码将被更新。",
                language,
              })}
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
                bottom: "-10px",
                right: "-10px",
                width: "50px",
              }}
            />
          </Box>
        </SectionBox>
      </Frame>
    </>
  );
};

export default BlogPage;
