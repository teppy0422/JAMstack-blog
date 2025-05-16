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
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { FaFile, FaRegEdit, FaFolder } from "react-icons/fa";
import { IoIosCheckboxOutline } from "react-icons/io";
import { PiAppWindowFill } from "react-icons/pi";
import { BsRecordCircle, BsCircle } from "react-icons/bs";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "../../../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../../../components/customToast";
import SectionBox from "../../../../components/SectionBox";
import BasicDrawer from "../../../../components/BasicDrawer";
import Frame from "../../../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "../../components/customBadge";
import DownloadLink from "../../components/DownloadLink";
import UnderlinedTextWithDrawer from "../../components/UnderlinedTextWithDrawer";
import ExternalLink from "../../components/ExternalLink";
import { FileSystemNode } from "../../../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ImageSliderModal from "../../components/ImageSliderModal"; // モーダルコンポーネントをインポート
import OptionalBox from "../../components/OptionalBox";
import ReferenceSettingModal from "../../components/referenceSettingModal";
import { useUserContext } from "@/contexts/useUserContext";
import { useReadCount } from "@/hooks/useReadCount";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

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
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const showToast = useCustomToast();
  const handleOpen = (drawerName: string) => {
    setActiveDrawer(drawerName);
    onOpen();
  };
  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
  };
  //生産準備+着手からの経過日数の計算
  const calculateElapsedTime = () => {
    const startDate = new Date(2016, 6, 11); // 月は0から始まるので7月は6
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30); // おおよその月数
    const days = (diffDays % 365) % 30;
    return `${years}年${months}ヶ月${days}日`;
  };
  type FileSystemItem = {
    name: string;
    type: "folder" | "file"; // 'folder' または 'file' のみを許可する
    children?: FileSystemItem[];
    popOver?: string;
    isOpen?: boolean;
    icon?;
  };
  const directoryData: FileSystemItem = {
    name: getMessage({
      ja: "任意のフォルダ",
      us: "Any folder",
      cn: "任何文件夹",
      language,
    }),

    type: "folder",
    isOpen: true,
    popOver: getMessage({
      ja: "※社内間でアクセスできるNASSサーバーに作成がお勧め",
      us: "*Recommended to create on a NASS server that can be accessed internally.",
      cn: "*建议在 NASS 服务器上进行创建，以便公司之间进行访问。",
      language,
    }),
    children: [
      {
        name: getMessage({
          ja: "メーカー名Aのフォルダ",
          us: "Folder with manufacturer name A",
          cn: "印有制造商名称的文件夹 A.",
          language,
        }),
        type: "folder",
        isOpen: true,
        children: [
          {
            name: getMessage({
              ja: "車種_モデル名のフォルダ",
              us: "Folder of car_type_model_name",
              cn: "文件夹中的车型_车型名称",
              language,
            }),
            type: "folder",
            isOpen: true,
            children: [
              {
                name: "Sjp3.100.89_Gタイプ.xlsm",
                type: "file",
                popOver: getMessage({
                  ja: "ダウンロードした生産準備+をここに配置。治具タイプを末尾に付ける事をお勧めします。ここではGタイプの治具の場合です。",
                  us: "Place the downloaded Production Preparation+ here. It is recommended to put the jig type at the end. Here is the case of G type jig.",
                  cn: "将下载的生产准备+ 放在此处。建议将夹具类型放在最后。这里是 G 型夹具的情况。",
                  language,
                }),
              },
            ],
          },
        ],
      },
      {
        name: getMessage({
          ja: "メーカー名Bのフォルダ",
          us: "Folder with manufacturer name B",
          cn: "印有制造商名称的文件夹 B",
          language,
        }),
        type: "folder",
        isOpen: false,
      },
    ],
  };

  const directoryData2: FileSystemItem = {
    name: getMessage({
      ja: "生産準備+があるフォルダ",
      us: "Folder with production ready+.",
      cn: "生产准备文件夹+。",
      language,
    }),
    type: "folder",
    isOpen: true,
    children: [
      {
        name: "00_temp",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "RLTF*A*.txt",
            type: "file",
            icon: <Icon as={FaFile} color="gray.600" mr={1} />,
          },
          {
            name: "RLTF*B*.txt",
            type: "file",
            icon: <Icon as={FaFile} color="gray.600" mr={1} />,
          },
        ],
      },
      {
        name: "01_PVSW_csv",
        type: "folder",
        isOpen: false,
      },
      {
        name: "05_RLTF_A",
        type: "folder",
        isOpen: false,
      },
      {
        name: "06_RLTF_B",
        type: "folder",
        isOpen: false,
      },
      {
        name: "07_SUB",
        type: "folder",
        isOpen: false,
      },
      {
        name: "08_MD",
        type: "folder",
        isOpen: false,
      },
    ],
  };
  const directoryData3: FileSystemItem = {
    name: getMessage({
      ja: "生産準備+があるフォルダ",
      us: "Folder with production ready+.",
      cn: "生产准备文件夹+。",
      language,
    }),
    type: "folder",
    isOpen: true,
    children: [
      {
        name: "00_temp",
        type: "folder",
        isOpen: false,
      },
      {
        name: "01_PVSW_csv",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "PVSW-*.csv",
            type: "file",
            icon: <Icon as={FaFile} color="gray.600" mr={1} />,
            popOver: getMessage({
              ja: "入手したPVSWを全てここに配置",
              us: "Place all obtained PVSW here",
              cn: "将所有获取的 PVSW 放在此处。",
              language,
            }),
          },
        ],
      },
      {
        name: "07_SUB",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "*SUB.csv",
            type: "file",
            icon: <Icon as={FaFile} color="gray.600" mr={1} />,
            popOver: getMessage({
              ja: "入手したSUBを含むファイルを全てここに配置",
              us: "Place all files containing the SUB you obtained here",
              cn: "将包含您获得的 SUB 的所有文件放在此处。",
              language,
            }),
          },
        ],
      },
      {
        name: "08_hsfデータ変換",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "*MD*",
            type: "folder",
            icon: <Icon as={FaFolder} color="gray.600" mr={1} />,
            popOver: getMessage({
              ja: "入手したMDを含むフォルダを全てここに配置",
              us: "Place all folders containing acquired MDs here",
              cn: "将包含已获取 MD 的所有文件夹放在此处。",
              language,
            }),
          },
        ],
      },
      {
        name: "08_MD",
        type: "folder",
        isOpen: false,
      },
      {
        name: "09_AutoSub",
        type: "folder",
        isOpen: false,
      },
    ],
  };
  const directoryData4: FileSystemItem = {
    name: getMessage({
      ja: "生産準備+があるフォルダ",
      us: "Folder with production Preparation+.",
      cn: "生产准备文件夹+。",
      language,
    }),
    type: "folder",
    isOpen: true,
    children: [
      {
        name: "00_temp",
        type: "folder",
        isOpen: false,
      },
      {
        name: "01_PVSW_csv",
        type: "folder",
        isOpen: false,
      },
      {
        name: "07_SUB",
        type: "folder",
        isOpen: false,
      },
      {
        name: "08_hsfデータ変換",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "*MD(分解前)",
            type: "folder",
            icon: <Icon as={FaFolder} color="gray.600" mr={1} />,
          },
          {
            name:
              "WH-DataConvert " +
              getMessage({
                ja: "←1.これを実行すると...",
                us: "←1. Do this...",
                cn: "←1.这样做是为了...",
                language,
              }),
            type: "file",
            icon: (
              <Icon
                as={PiAppWindowFill}
                color="gray.600"
                mr={1}
                fontSize={18}
              />
            ),
            popOver: "",
          },
        ],
      },
      {
        name: "08_MD",
        type: "folder",
        isOpen: true,
        children: [
          {
            name:
              "*MD" +
              getMessage({
                ja: "←2.この中に展開される",
                us: "←2.Unfolding in this",
                cn: "←2.在此",
                language,
              }),
            type: "folder",
            isOpen: true,
            icon: <Icon as={FaFolder} color="gray.600" mr={1} />,
          },
        ],
      },
      {
        name: "09_AutoSub",
        type: "folder",
        isOpen: false,
      },
    ],
  };

  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
    return <div>Loading...</div>; // 言語がロードされるまでのプレースホルダー
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
              ja: "生産準備+の練習(中級)",
              us: "Production Preparation+ Practice (Intermediate)",
              cn: "生产准备+实践（中级）。",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "生準+",
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
            :2024-11-26
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
                ja: "ここでは何もデータを持っていない状態から生産準備+で成果物を作成する流れを解説します。",
                us: "This section describes the process of creating deliverables in Production Preparation+ from a state of having no data.",
                cn: "本节介绍在 生产准备+ 中从无数据创建交付品的过程。",
                language,
              })}
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "生産準備+の入手",
              us: "Obtain Production Preparation+.",
              cn: "为生产做好准备+。",
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
                ja: "以下のリンクから最新版をダウンロードしてください。",
                us: "Please download the latest version from the link below.",
                cn: "从以下链接下载最新版本。",
                language,
              })}
            </Text>
            <ExternalLink href="../../download/sjp" text="download/sjp" />
          </Box>
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "生産準備+の配置",
              us: "Production Preparation + Placement",
              cn: "生产准备+安排",
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
          <Text mb={4}>
            {getMessage({
              ja: "下記のようにフォルダを作成して配置。",
              us: "Create and place folders as follows.",
              cn: "创建并放置文件夹如下。",
              language,
            })}
          </Text>
          <FileSystemNode item={directoryData} />
        </SectionBox>
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "必要データの入手と配置",
              us: "Obtain and deploy required data",
              cn: "获取和部署所需数据",
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
          <Text mb={4}>
            {getMessage({
              ja: "生産準備+にインポートするデータを入手していきます。",
              us: "We will obtain the data to be imported into Production Preparation+.",
              cn: "我们将获取要导入 生产准备+ 的数据。",
              language,
            })}
            <br />
            {getMessage({
              ja: "入手せずにすぐに試したい場合は下記から準備済みのデータをダウンロードしてご利用ください。",
              us: "If you want to try it immediately without obtaining it, please download the prepared data from below.",
              cn: "如果您想在未获取的情况下立即试用，可以从下面下载准备好的数据。",
              language,
            })}
          </Text>
          <UnderlinedTextWithDrawer
            text=<>
              <Box as="span" display="inline" borderBottom="2px solid">
                {"#" +
                  getMessage({
                    ja: "準備済みの必要データ",
                    us: "Prepared required data",
                    cn: "准备所需数据",
                    language,
                  })}
              </Box>
              <LuPanelRightOpen
                size="20px"
                style={{ marginBottom: "-5px", display: "inline" }}
              />
            </>
            onOpen={() => handleOpen("準備済みの必要データ")}
            isOpen={isOpen && activeDrawer === "準備済みの必要データ"}
            onClose={handleClose}
            header={getMessage({
              ja: "準備済みの必要データ",
              us: "Prepared required data",
              cn: "准备所需数据。",
              language,
            })}
            size="md"
            children={
              <>
                <Text mb={4}>
                  {getMessage({
                    ja: "※このデータは以下の製品品番を含みます",
                    us: "*This data includes the following product part numbers",
                    cn: "*本数据包括以下产品部件号",
                    language,
                  })}
                </Text>
                <Box border="1px solid" p={2} borderRadius="md" mb={4}>
                  <Text fontWeight={400}>
                    8216136D20
                    <br />
                    8216136D30
                    <br />
                    8216136D40
                    <br />
                    8216136D50
                    <br />
                    8216136E00
                    <br />
                  </Text>
                </Box>
                <Text mb={4}>
                  {getMessage({
                    ja: "下記からダウンロードしてお使いください",
                    us: "Please download and use the following",
                    cn: "请下载并使用",
                    language,
                  })}
                </Text>
                <DownloadLink
                  text={getMessage({
                    ja: "必要データのダウンロード",
                    us: "Download required data",
                    cn: "下载所需数据",
                    language,
                  })}
                  href="/images/0008/必要データ.zip"
                />
              </>
            }
          />
        </SectionBox>
        <Box m={0} ml={3} w="100%">
          <SectionBox
            id="section4_1"
            title={
              "4-1." +
              getMessage({
                ja: "RLTFの入手",
                us: "Obtaining RLTF",
                cn: "获得 RLTF",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "EXTESから単線分析リクエストを実行して以下2つのRLTFを入手します",
                us: "Execute a single-line analysis request from EXTES to obtain the following two RLTFs",
                cn: "从 EXTES 中执行单线分析请求，获取以下两个 RLTF",
                language,
              })}
            </Text>
            <Text>
              <Icon as={FaFile} color="gray.600" mr={1} />
              RLTF*A*.txt
            </Text>
            <Text>
              <Icon as={FaFile} color="gray.600" mr={1} />
              RLTF*B*.txt
            </Text>
          </SectionBox>
          <Box m={0} ml={3}>
            <SectionBox
              id="section4_1_1"
              title={
                "4-1-1." +
                getMessage({
                  ja: "手動での起動",
                  us: "Manual activation",
                  cn: "手动启动",
                  language,
                })
              }
              sectionRefs={sectionRefs}
              sections={sections}
              size="sm"
            >
              <Divider
                borderColor={colorMode === "light" ? "black" : "white"}
              />
              <Text mb={4}>
                {getMessage({
                  ja: "通常の手順で手入力で起動します。手順が分からない場合は工務にご相談ください。",
                  us: "Follow the normal procedure to start manually. If you do not understand the procedure, please contact Engineering.",
                  cn: "按照正常程序手动激活。如果您不确定操作步骤，请联系工程部。",
                  language,
                })}
                {getMessage({
                  ja: "それでも分からない場合は",
                  us: "If you still don't understand, please contact us through the chat in ",
                  cn: "如果您仍不明白，请通过 ",
                  language,
                })}
                <ExternalLink
                  href="../../thread/8d7d2ec1-3157-4f5c-a2c3-2e1223e1d2b9"
                  text={getMessage({
                    ja: " 開発/相談",
                    us: " Development/Consultation",
                    cn: " 开发/咨询",
                    language,
                  })}
                />
                {getMessage({
                  ja: "のチャットから問い合わせてください。",
                  us: "",
                  cn: "上的聊天工具联系我们。",
                  language,
                })}
              </Text>
            </SectionBox>
            <SectionBox
              id="section4_1_2"
              title={
                "4-1-2." +
                getMessage({
                  ja: "生産準備+から起動",
                  us: "Start from Production Preparation+",
                  cn: "+从 生产准备+ 激活",
                  language,
                })
              }
              sectionRefs={sectionRefs}
              sections={sections}
              size="sm"
            >
              <Divider
                borderColor={colorMode === "light" ? "black" : "white"}
              />
              <Text mb={4}>
                {getMessage({
                  ja: "生産準備+でEXTESに自動入力します",
                  us: "Automatically populates EXTES in Production Preparation+.",
                  cn: "自动为 EXTES 添加生产准备+。",
                  language,
                })}
              </Text>
              <Box ml={4}>
                <Text>
                  {getMessage({
                    ja: "※EXTESのインストールが必要です。自動インストールには対応していません。",
                    us: "*EXTES installation is required. Automatic installation is not supported.",
                    cn: "*需要安装 EXTES。不支持自动安装。",
                    language,
                  })}
                </Text>
                <Text>
                  {getMessage({
                    ja: "※初回のみ",
                    us: "*",
                    cn: "*",
                    language,
                  })}
                  <ImageSliderModal
                    title={getMessage({
                      ja: "EXTESの設定変更",
                      us: "EXTES settings",
                      cn: "EXTES 设置",
                      language,
                    })}
                    text={getMessage({
                      ja: "EXTESを起動してプロパティで下記と同じように設定します",
                      us: "Start EXTES and set the same as below in the properties",
                      cn: "启动 EXTES 并在属性中设置如下。",
                      language,
                    })}
                    images={[
                      "../../images/0008/extes2.jpg",
                      "../../images/0008/extes3.jpg",
                      "../../images/0008/extes4.jpg",
                      "../../images/0008/extes5.jpg",
                    ]}
                    isOpen={isModalOpen}
                    onClose={onModalClose}
                    onModalOpen={onModalOpen}
                  />
                  {getMessage({
                    ja: "が必要です。",
                    us: "need to be changed for the first time only",
                    cn: "只需首次更改。",
                    language,
                  })}
                </Text>
                <Box
                  bg="gray.300"
                  color="black"
                  w="70%"
                  p={1}
                  mt={4}
                  fontSize="14px"
                >
                  {getMessage({
                    ja: "[製品品番]に設変(手配符号)の入力",
                    us: "Enter the change (arrangement code) in the [Product Part Number] field.",
                    cn: "在 [产品编号] 字段中输入更改（排列代码）。",
                    language,
                  })}
                </Box>
                <Image
                  mb={4}
                  src="/images/0008/製品品番に設変の入力.png"
                  width="70%"
                  alt="製品品番に設変の入力.png"
                />
                <Box
                  bg="gray.300"
                  color="black"
                  w="55%"
                  p={1}
                  mt={4}
                  fontSize="14px"
                >
                  {getMessage({
                    ja: "MENU → 入力 → 00_起動",
                    us: "MENU → Input → 00_Startup",
                    cn: "菜单 → 输入 → 00_ 启动",
                    language,
                  })}
                </Box>
                <Image
                  mb={4}
                  src="/images/0008/MENU_起動.png"
                  width="55%"
                  alt="製品品番に設変の入力.png"
                />
                <Box
                  bg="gray.300"
                  color="black"
                  w="80%"
                  p={1}
                  mt={4}
                  fontSize="14px"
                >
                  {getMessage({
                    ja: "RLTFのリクエストを実行",
                    us: "Execute RLTF request",
                    cn: "执行 RLTF 请求。",
                    language,
                  })}
                </Box>
                <Image
                  mb={4}
                  src="/images/0008/MENU_起動_RLTFのリクエスト.png"
                  width="80%"
                  alt="製品品番に設変の入力.png"
                />
                <Text>
                  {getMessage({
                    ja: "※動作中にPCを操作すると途中で停止する事があります",
                    us: "*Operation of the PC during the operation may cause it to stop in the middle of the operation.",
                    cn: "*如果在操作过程中操作 PC，可能会中途停止。",
                    language,
                  })}
                </Text>
                <Text>
                  {getMessage({
                    ja: "※途中で失敗する事が稀にあります。その場合はEXTESを終了してから再度実行してください。",
                    us: "*In rare cases, EXTES may fail in the middle of the process. If this happens, exit EXTES and run it again.",
                    cn: "*在极少数情况下，运行过程中可能会出现故障。如果出现这种情况，请退出 EXTES 并重新运行。",
                    language,
                  })}
                </Text>
              </Box>
            </SectionBox>
          </Box>
          <SectionBox
            id="section4_2"
            title={
              "4-2." +
              getMessage({
                ja: "RLTFの配置",
                us: "RLTF placement",
                cn: "RLTF 安置",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "入手したファイルを下記の場所に保存します",
                us: "Save the obtained file in the following location",
                cn: "将获得的文件保存到以下位置",
                language,
              })}
            </Text>

            <FileSystemNode item={directoryData2} />
          </SectionBox>
          <SectionBox
            id="section4_3"
            title={
              "4-3." +
              getMessage({
                ja: "RLTFの分解",
                us: "Decomposition of RLTF",
                cn: "RLTF 的分解",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "以下を実行します",
                us: "Do the following",
                cn: "请执行以下操作",
                language,
              })}
            </Text>
            <Box
              bg="gray.300"
              color="black"
              w="80%"
              p={1}
              mt={4}
              fontSize="14px"
            >
              {getMessage({
                ja: "MENU → 入力 → 00_起動 → MENU_起動_後引張支援システムでの変換",
                us: "MENU → Input → 00_Activation → MENU_Activation_Conversion with post-tension support system",
                cn: "MENU → 输入 → 00_激活 → 菜单_激活_后张法支撑系统中的转换",
                language,
              })}
            </Box>
            <Image
              mb={4}
              src="/images/0008/MENU_起動_後引張支援システムでの変換.png"
              width="80%"
              alt="MENU_起動_後引張支援システムでの変換.png"
            />
            <Text mb={2}>
              {getMessage({
                ja: "実行すると下記の処理が行われます",
                us: "When executed, the following processing is performed",
                cn: "执行时会发生以下过程",
                language,
              })}
            </Text>
            <Box ml={2}>
              <Text>
                {getMessage({
                  ja: "・00_tempに分解データが作成される",
                  us: "・Decomposition data is created in 00_temp",
                  cn: "・反汇编数据在 00_temp 中创建",
                  language,
                })}
              </Text>
              <Text>
                {getMessage({
                  ja: "・05-RTF_AにRLTF*A*.txtが移動",
                  us: "・RLTF*A*.txt moved to 05-RTF_A",
                  cn: "・05-RTF*A*.txt 移至 RTF_A",
                  language,
                })}
              </Text>
              <Text>
                {getMessage({
                  ja: "・06-RTF_BにRLTF*B*.txtが移動",
                  us: "・RLTF*B*.txt moved to 06-RTF_B",
                  cn: "・RLTF*B*.txt 移至 06-RTF_B",
                  language,
                })}
              </Text>
            </Box>
            <Text>
              {getMessage({
                ja: "※実行中はPCを操作しないでください",
                us: "*Do not operate the PC while it is running.",
                cn: "*请勿在电脑运行时对其进行操作。",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section4_4"
            title={
              "4-4." +
              getMessage({
                ja: "生産準備+にRLTFを関連づける",
                us: "Associate RLTF with production readiness+.",
                cn: "将 RLTF 与生产准备+联系起来。",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "以下のようにRLTFのファイル名を入力",
                us: "Enter the RLTF file name as follows",
                cn: "输入 RLTF 的文件名，如下所示",
                language,
              })}
            </Text>
            <Box
              bg="gray.300"
              color="black"
              w="80%"
              p={1}
              mt={4}
              fontSize="14px"
            >
              {getMessage({
                ja: "[製品品番]のRLTF-AとRLTF-Bにファイル名を入力",
                us: "Enter file names in RLTF-A and RLTF-B under [Product Part Number].",
                cn: "在 [产品部件号] 下的 RLTF-A 和 RLTF-B 中输入文件名。",
                language,
              })}
            </Box>
            <Image
              mb={4}
              src="/images/0008/製品品番にRLTFを入力.png"
              width="60%"
              alt="MENU_起動_後引張支援システムでの変換.png"
            />
            <Text mb={2}>
              {getMessage({
                ja: "※この操作によりRLTFのインポート時に参照するファイルが更新されます",
                us: "*This operation updates the file referenced during RLTF import.",
                cn: "*此操作可更新 RLTF 导入过程中引用的文件",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "以上でRLTFの準備は完了です。",
                us: "This completes the RLTF preparation.",
                cn: "至此，RLTF 的准备工作完成。",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section4_5"
            title={
              "4-5." +
              getMessage({
                ja: "社内図の設計データの入手",
                us: "Obtaining design data for in-house drawings",
                cn: "为内部图纸获取设计数据。",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "主管工場の設計にメールで依頼して入手します",
                us: "We will obtain this information by emailing the main factory design.",
                cn: "请发送电子邮件至主厂设计部，索取并获得相关信息。",
                language,
              })}
            </Text>
            <UnderlinedTextWithDrawer
              text=<>
                <Box as="span" display="inline" borderBottom="2px solid">
                  {"#" +
                    getMessage({
                      ja: "メールのサンプル",
                      us: "Email Samples",
                      cn: "电子邮件样本",
                      language,
                    })}
                </Box>
                <LuPanelRightOpen
                  size="20px"
                  style={{ marginBottom: "-5px", display: "inline" }}
                />
              </>
              onOpen={() => handleOpen("メールサンプル")}
              isOpen={isOpen && activeDrawer === "メールサンプル"}
              onClose={handleClose}
              header={getMessage({
                ja: "メールのサンプル",
                us: "Email Samples",
                cn: "电子邮件样本",
                language,
              })}
              size="md"
              children={
                <>
                  <Text mb={4}>
                    {getMessage({
                      ja: "※下記をコピーしてお使いください",
                      us: "*Please copy and use the following",
                      cn: "*请复制并使用以下内容",
                      language,
                    })}
                  </Text>
                  <Box border="1px solid" p={2} borderRadius="md" mb={4}>
                    <Text fontWeight={400}>
                      {getMessage({
                        ja: "宛先: 〇〇工場 設計 〇〇様",
                        us: "To: Mr. 00, Designer, 00 Plant",
                        cn: "致: 00 工厂设计，00 先生",
                        language,
                      })}
                      <br />
                      {getMessage({
                        ja: "件名: PVSWとSUBデータ依頼_生産準備用",
                        us: "Subject: PVSW and SUB data request_for production preparation",
                        cn: "主题: PVSW 和 SUB 数据申请_用于生产准备",
                        language,
                      })}
                      <br />
                      {getMessage({
                        ja: "内容: 〇〇様 お世話になります",
                        us: "Description: Mr. 00, thank you for your business.",
                        cn: "说明： 00 先生，感谢您的帮助。",
                        language,
                      })}
                      <br />
                      <br />
                      {getMessage({
                        ja: "下記のPVSW.csv、SUB.csv、HSFの出力をお願い致します",
                        us: "Please output the following PVSW.csv, SUB.csv and HSF",
                        cn: "请输出 PVSW.csv、SUB.csv 和 HSF",
                        language,
                      })}
                      <br />
                      {getMessage({
                        ja: "用途はCV試作の準備です 設変は最新(最終)でお願い致します",
                        us: "The purpose is to prepare for CV prototyping. Please use the latest (final) modifications.",
                        cn: "修改内容必须是最新的（最终的）。",
                        language,
                      })}
                      <br />
                      {getMessage({
                        ja: "製品品番",
                        us: "Product part number",
                        cn: "产品编号",
                        language,
                      })}
                      <br />
                      841W 82111-V1070 代)82111-V1020
                      <br />
                      841W 82111-V1080
                      <br />
                      841W 82111-V1090
                      <br />
                      {getMessage({
                        ja: "以上3点よろしくお願い致します。",
                        us: "Thank you in advance for your cooperation on the above three points.",
                        cn: "请考虑这三点。",
                        language,
                      })}
                      <br />
                      <br />
                      {getMessage({
                        ja: "〇〇工場 生産準備 〇〇",
                        us: "00 Factory Production Preparation 00",
                        cn: "00 工厂 00 生产准备 00",
                        language,
                      })}
                    </Text>
                  </Box>

                  <Text fontWeight={600} mt={4}>
                    {getMessage({
                      ja: "各データの必要性",
                      us: "Need for each data",
                      cn: "需要每个数据",
                      language,
                    })}
                  </Text>
                  <Text>
                    {getMessage({
                      ja: "・PVSW.csvは必須です",
                      us: "・PVSW.csv is required",
                      cn: "・需要 PVSW.csv",
                      language,
                    })}
                  </Text>
                  <Text>
                    {getMessage({
                      ja: "・SUB.csvは社内図の標準サブ形態を使用するなら必要です",
                      us: "・SUB.csv is required if you use the standard sub-forms of the company chart.",
                      cn: "・如果使用内部图表的标准子表格，则需要 SUB.csv。",
                      language,
                    })}
                  </Text>
                  <Text>
                    {getMessage({
                      ja: "・HSFは手入力が大幅に削減出来るのであった方が良いです",
                      us: "・HSF is better because it greatly reduces manual input.",
                      cn: "・HSF 更好，因为它大大减少了人工输入。",
                      language,
                    })}
                  </Text>

                  <Text fontWeight={600} mt={4}>
                    {getMessage({
                      ja: "各データの名称について",
                      us: "About the name of each data",
                      cn: "每项数据的名称",
                      language,
                    })}
                  </Text>
                  <Text>
                    {getMessage({
                      ja: "各データの正式名称は不明です。すべて社内図を出力するシステムからの出力と聞いています。",
                      us: "The official name of each data is unknown. We are told that all of the output comes from a system that outputs internal diagrams.",
                      cn: "每项数据的正式名称不得而知。我们被告知，所有输出都来自一个输出内部图表的系统。",
                      language,
                    })}
                    <br />

                    {getMessage({
                      ja: "もし上記メールでどのデータなのか伝わらなければ、下記からダウンロードした参考データを以って設計の方に相談してみてください。",
                      us: "If the above email does not convey which data you are looking for, please consult with the design team with the reference data downloaded below.",
                      cn: "如果上述电子邮件没有告诉您是哪种数据，请通过下面下载的参考数据咨询设计团队。",
                      language,
                    })}
                  </Text>
                  <DownloadLink
                    text={getMessage({
                      ja: "参考データのダウンロード",
                      us: "Download Reference Data",
                      cn: "下载参考数据。",
                      language,
                    })}
                    href="/images/0008/参考.zip"
                  />
                </>
              }
            />
            <Text mt={4}>
              {getMessage({
                ja: "下記3点のデータを入手します",
                us: "Obtain the following three data points",
                cn: "获取以下三个数据点",
                language,
              })}
            </Text>
            <Box ml={2}>
              <Text>
                <Icon as={FaFile} color="gray.600" mr={1} />
                PSVW*.csv (
                {getMessage({
                  ja: "必須",
                  us: "Must",
                  cn: "必須",
                  language,
                })}
                )
              </Text>
              <Text>
                <Icon as={FaFile} color="gray.600" mr={1} />
                SUB*.csv
              </Text>
              <Text>
                <Icon as={FaFolder} color="gray.600" mr={1} />
                *MD
              </Text>
            </Box>
          </SectionBox>
          <SectionBox
            id="section4_6"
            title={
              "4-6." +
              getMessage({
                ja: "設計データの配置",
                us: "Placement of design data",
                cn: "放置设计数据",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text mb={4}>
              {getMessage({
                ja: "入手したデータを下記のフォルダに配置してください。",
                us: "Place the obtained data in the following folder.",
                cn: "将获得的数据放到以下文件夹中。",
                language,
              })}
            </Text>
            <FileSystemNode item={directoryData3} />
          </SectionBox>
          <SectionBox
            id="section4_7"
            title={
              "4-7." +
              getMessage({
                ja: "MDデータの分解",
                us: "Decomposition of MD data",
                cn: "MD 数据分解",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text mb={4}>
              {getMessage({
                ja: "08_hsfデータ変換に入れた",
                us: "Disassemble the ",
                cn: "拆解放入 08_hsfデータ変換 的",
                language,
              })}
              <Icon as={FaFolder} color="gray.600" mx={1} />
              {getMessage({
                ja: "MDを分解します",
                us: "MD put in 08_hsfデータ変換",
                cn: "MD。",
                language,
              })}
            </Text>
            <FileSystemNode item={directoryData4} />
            <Text mt={4}>
              {getMessage({
                ja: "※実行完了まで10分程度かかります",
                us: "*It takes about 10 minutes to complete the execution.",
                cn: "*完成执行大约需要 10 分钟。",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "※これは自分が作成したアプリでは無いのでエラー対応はできません",
                us: "*This is not an application I created, so I cannot respond to errors.",
                cn: "*这不是我创建的应用程序，因此我无法回复错误。",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "※エラーが発生した場合はシートへの手入力が増えます",
                us: "*In the event of an error, more manual input will be required on the sheet.",
                cn: "*如果出现错误，则需要手动输入更多信息。",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section4_8"
            title={
              "4-8." +
              getMessage({
                ja: "生産準備+にSUBを関連づける",
                us: "Associate SUB with Production Preparation+.",
                cn: "联系 SUB，为生产做好准备+。",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text mb={4}>
              {getMessage({
                ja: "社内図の標準(最初)のサブ形態を利用したい事は稀だと思いますが、その場合は下記の操作が必要です",
                us: "It is rare that you want to use the standard (first) sub-form of the company chart, but if you do, you will need to do the following",
                cn: "使用内部图表的标准（第一）子格式的情况很少见，在这种情况下需要进行以下操作",
                language,
              })}
            </Text>
            <Box
              bg="gray.300"
              color="black"
              w="60%"
              p={1}
              mt={4}
              fontSize="14px"
            >
              {getMessage({
                ja: "[製品品番]のSUBのファイル名を製品品番毎に入力",
                us: "Enter the file name of the SUB for [製品品番] for each product part number.",
                cn: "为每个产品零件编号输入[製品品番]的 SUB 文件名。",
                language,
              })}
            </Box>
            <Image
              mb={4}
              src="/images/0008/製品品番にSUBの入力.png"
              width="60%"
              alt="製品品番にSUBの入力.png"
            />
            <Text mt={4}>
              {getMessage({
                ja: "以上で社内図の設計データの準備は完了です。",
                us: "This completes the preparation of design data for in-house drawings.",
                cn: "至此，内部图纸的设计数据准备工作完成。",
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
              ja: "必要データのインポート",
              us: "Import of required data",
              cn: "导入所需数据",
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
              ja: "4.で入手したデータを生産準備+にインポートしていきます",
              us: "The data obtained in 4. will be imported into Production Preparation+.",
              cn: "4.节中获得的数据将导入生产准备+。",
              language,
            })}
          </Text>
          <Box bg="gray.300" color="black" w="60%" p={1} mt={4} fontSize="14px">
            MENU → 入力 → 01_インポート
          </Box>
          <Image
            mb={4}
            src="/images/0008/MENU_入力_インポート.png"
            width="60%"
            alt="MENU_入力_インポート.png"
          />
          <Image
            mb={4}
            src="/images/0008/MENU_入力_インポート2.png"
            width="40%"
            alt="MENU_入力_インポート2.png"
          />
        </SectionBox>
        <SectionBox
          id="section5_1"
          title={
            "5-1." +
            getMessage({
              ja: "PVSWのインポート",
              us: "PVSW Import",
              cn: "PVSW 输入。",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          size="sm"
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            {"・" +
              getMessage({
                ja: "[PVSW_RLTF]を作成。00_PVSWからPVSWのデータを読み込みます。",
                us: "Create [PVSW_RLTF]. read PVSW data from 00_PVSW.",
                cn: "创建 [PVSW_RLTF]；从 00_PVSW 读取 PVSW 数据。",
                language,
              })}
            <br />
            {"・" +
              getMessage({
                ja: "フィールドが",
                us: "Fields marked ",
                cn: "标 ",
                language,
              })}
            <span style={{ color: "#92CCFF" }}>■</span>
            {getMessage({
              ja: "水色の箇所が使用するデータです。",
              us: "Light blue are the data to be used.",
              cn: "浅蓝色 的字段是要使用的数据。",
              language,
            })}
            <br />
            {"・" +
              getMessage({
                ja: "[PVSW_RLTF]が既にある場合は末尾に連番を付けた新しいシートを作成します。",
                us: "If [PVSW_RLTF] already exists, create a new sheet with a sequential number at the end.",
                cn: "如果 [PVSW_RLTF] 已经存在，则创建一个新工作表，并在末尾加上顺序号。",
                language,
              })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section5_2"
          title={
            "5-2." +
            getMessage({
              ja: "RLTFのインポート",
              us: "RLTF Import",
              cn: "RLTF 输入",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          size="sm"
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            ・
            {getMessage({
              ja: "[製品品番]で指定したRLTFから電線情報を取得します。",
              us: "Obtains wire information from the RLTF specified in [製品品番].",
              cn: "从[製品品番]中指定的 RLTF 获取导线信息。",
              language,
            })}
            <br />
            {"・" +
              getMessage({
                ja: "フィールドが",
                us: "The fields marked ",
                cn: "标有 ",
                language,
              })}
            <span style={{ color: "#FFCCFF" }}>■</span>
            {getMessage({
              ja: "ピンク色の箇所が使用するデータです。",
              us: "pink are the data to be used.",
              cn: "粉红色 的字段是要使用的数据。",
              language,
            })}
            <br />
            {"・" +
              getMessage({
                ja: "PVSWとRLTFの値が異なる場合はそのセルにコメントを追加します。コメントがRLTFの値です。異なる場合は社内図を正として修正を行ってください。",
                us: "If the PVSW and RLTF values are different, add a comment to that cell. The comment is the RLTF value. If they are different, correct the internal diagram as correct.",
                cn: "如果 PVSW 值和 RLTF 值不同，则会在该单元格中添加注释。注释为 RLTF 值。如果两者不同，则更正内部图表为正确。",
                language,
              })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section5_3"
          title={
            "5-3." +
            getMessage({
              ja: "[PVSW_RLTF]の最適化",
              us: "Optimization of [PVSW_RLTF]",
              cn: "优化 [PVSW_RLTF]。",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
          size="sm"
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            {"・" +
              getMessage({
                ja: "電線条件が同じ場合は同じ行にまとめて見やすくします。",
                us: "If the wire conditions are the same, they are grouped on the same line for easier viewing.",
                cn: "如果导线条件相同，则将它们归为同一行，以便于查看。",
                language,
              })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "手入力シートの作成",
              us: "Creation of manual input sheets",
              cn: "创建手工输入表",
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
              ja: "[PVSW_RLTF]のデータと用意したデータで手入力シートを作成します。",
              us: "Create a manual input sheet with the data in [PVSW_RLTF] and the data you have prepared.",
              cn: "使用 [PVSW_RLTF] 中的数据和您准备的数据创建手动输入表。",
              language,
            })}
          </Text>
          <Box bg="gray.300" color="black" w="60%" p={1} mt={4} fontSize="14px">
            MENU → 入力 → 02_手入力シート作成
          </Box>
          <Image
            mb={4}
            src="/images/0008/MENU_入力_手入力シート作成.png"
            width="60%"
            alt="MENU_入力_手入力シート作成.png"
          />
          <Image
            mb={4}
            src="/images/0008/MENU_入力_手入力シート作成2.png"
            width="35%"
            alt="MENU_入力_手入力シート作成2.png"
          />
        </SectionBox>
        <Box ml={3}>
          <SectionBox
            id="section6_1"
            title={
              "6-1." +
              getMessage({
                ja: "端末一覧",
                us: "Terminal List",
                cn: "终端列表",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "[PVSW_RLTF]を基に[端末一覧]を作成。",
                us: "Create [端末一覧] based on [PVSW_RLTF].",
                cn: "基于 [PVSW_RLTF] 的 [端末一覧]。",
                language,
              })}
              <br />
              {getMessage({
                ja: "端末サブナンバー/成型角度/成型方向を手入力する為に使用。",
                us: "Used to manually input terminal sub-numbers/molding angle/molding direction.",
                cn: "用于手动输入端子子编号/注塑角度/注塑方向。",
                language,
              })}
            </Text>
            <OptionalBox colorMode={colorMode}>
              <Flex alignItems="center">
                <Icon as={IoIosCheckboxOutline} boxSize={5} mt={0.5} />
                <Text ml={1}>
                  {getMessage({
                    ja: "[07_SUB]からサブNo.を取得",
                    us: "Obtain sub No. from [07_SUB]",
                    cn: "从 [07_SUB] 获取子编号。",
                    language,
                  })}
                </Text>
              </Flex>
              <Text ml={7}>
                {getMessage({
                  ja: "チェックを入れると、初期(標準)のサブNo.を取得します。",
                  us: "If checked, the initial (standard) sub-no. is obtained.",
                  cn: "如果选中，则获得初始（标准）子编号。",
                  language,
                })}
              </Text>
            </OptionalBox>
          </SectionBox>
          <SectionBox
            id="section6_2"
            title={
              "6-2." +
              getMessage({
                ja: "部品リスト",
                us: "Parts List",
                cn: "零件清单",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "RLTF-A.txtを基に[部品リスト]を作成。",
                us: "Create [部品リスト] based on RLTF-A.txt.",
                cn: "[部品リスト] 基于 RLTF-A.txt。",
                language,
              })}
              <br />
              {getMessage({
                ja: "端末に付属する部品品番を手入力する為に使用。",
                us: "Used to manually enter part part numbers attached to terminals.",
                cn: "用于手动输入终端上的零件编号。",
                language,
              })}
              <br />
            </Text>
            <OptionalBox colorMode={colorMode}>
              <Flex alignItems="center">
                <Icon as={BsRecordCircle} boxSize={4} mt={0.5} />
                <Text ml={1}>IE</Text>
                <Icon as={BsCircle} boxSize={4} mt={0.5} ml={2} />
                <Text ml={1}>Edge</Text>
              </Flex>
              <Text ml={4}>
                {getMessage({
                  ja: "どちらかを選択。",
                  us: "Choose one or the other.",
                  cn: "任选其一。",
                  language,
                })}
                <br />
                {getMessage({
                  ja: "生産準備+のサーバーに部品品番の詳細情報が無い場合に情報を取得するブラウザを選択。Edgeはバージョンによってはエラー停止する事があります。",
                  us: "Select the browser to retrieve information when there is no detailed part number information on the server of Production Preparation+.",
                  cn: "当 生产准备+ 服务器上没有关于零件编号的详细信息时，选择浏览器检索信息: 在某些版本中，Edge 可能会错误停止。",
                  language,
                })}
              </Text>
              <Flex alignItems="center" mt={2}>
                <Icon as={IoIosCheckboxOutline} boxSize={5} mt={0.5} />
                <Text ml={1}>
                  {getMessage({
                    ja: "[08_MD]から端末No.を取得",
                    us: "Obtain terminal No. from [08_MD]",
                    cn: "从 [08_MD] 获取终端编号。",
                    language,
                  })}
                </Text>
              </Flex>
              <Text ml={4}>
                {getMessage({
                  ja: "チェックを入れると、MDから部品品番に付属する端末No.を取得します。MDが正しく分解されていない場合は[PVSW_RLTF]と[CAV一覧]から端末No.を取得します。",
                  us: "If checked, the terminal No. attached to the part No. is obtained from the MD; if the MD is not properly disassembled, the terminal No. is obtained from [PVSW_RLTF] and [CAV List].",
                  cn: "如果核对无误，则从 MD 中获取元件部件号所附端子号；如果 MD 未正确拆卸，则从 [PVSW_RLTF] 和 [CAV一覧] 中获取端子号。",
                  language,
                })}
              </Text>
              <Flex alignItems="center" mt={2}>
                <Icon as={IoIosCheckboxOutline} boxSize={5} mt={0.5} />
                <Text ml={1}>
                  {getMessage({
                    ja: "部材詳細の再取得",
                    us: "Re-acquisition of part details",
                    cn: "重新获取零件细节。",
                    language,
                  })}
                </Text>
              </Flex>
              <Text ml={4}>
                {getMessage({
                  ja: "チェックを入れると、生産準備+のサーバーに部品品番の詳細情報がある場合でも取得しなおします。通常は必要ありません。取得する詳細情報をあたらしく追加した場合に使用します。",
                  us: "If checked, the detailed information of the part part number will be retrieved again even if the server in Production Preparation+ has the detailed information of the part number. Normally, this is not necessary. Use this checkbox if you have added new detailed information to be retrieved.",
                  cn: "如果选中此选项，即使生产准备+ 中的服务器有零件编号的详细信息，也会再次检索零件编号的详细信息。通常不需要。在添加新的待检索详细信息时使用。",
                  language,
                })}
                {getMessage({
                  ja: "チェックを入れると、生産準備+のサーバーに部品品番の詳細情報がある場合でも取得しなおします。通常は必要ありません。取得する詳細情報をあたらしく追加した場合に使用します。",
                  us: "If checked, the detailed information of the part part number will be retrieved again even if the server in Production Preparation+ has the detailed information of the part number. Normally, this is not necessary. Use this checkbox when you add new detailed information to be retrieved.",
                  cn: "如果选中此选项，即使生产准备+ 中的服务器有零件编号的详细信息，也会再次检索零件编号的详细信息。通常不需要。在添加新的待检索详细信息时使用。",
                  language,
                })}
              </Text>
            </OptionalBox>
          </SectionBox>
          <SectionBox
            id="section6_3"
            title={
              "6-3." +
              getMessage({
                ja: "CAV一覧",
                us: "CAV List",
                cn: "CAV一覧",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "[PVSW_RLTF]を基に[CAV一覧]を作成。",
                us: "Create [CAV一覧] based on [PVSW_RLTF].",
                cn: "基于 [PVSW_RLTF] 的 [CAV一覧]。",
                language,
              })}
              <br />
              {getMessage({
                ja: "空栓(詰栓)の情報を入力する為に使用。",
                us: "Used to enter information on empty (plugged) plugs.",
                cn: "用于输入空（堵塞）插头的信息。",
                language,
              })}
              <br />
              {getMessage({
                ja: "※部材詳細.txtから空栓の色を取得",
                us: "*Get the color of the empty plug from the component details.txt",
                cn: "*从组件详细信息 .txt 中获取空插头的颜色。",
                language,
              })}
              <br />
              {getMessage({
                ja: "MDがある場合はMDからデータを取得",
                us: "Get data from MD if MD is available",
                cn: "如果有 MD，则从 MD 获取数据。",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section6_4"
            title={
              "6-4." +
              getMessage({
                ja: "ポイント一覧",
                us: "List of Points",
                cn: "要点清单",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "[PVSW_RLTF]を基に[ポイント一覧]を作成。",
                us: "Create [ポイント一覧] based on [PVSW_RLTF].",
                cn: "基于 [PVSW_RLTF] 的 [ポイント一覧]。",
                language,
              })}
              <br />
              {getMessage({
                ja: "空栓(詰栓)の情報を入力する為に使用。",
                us: "Used to enter information on empty (plugged) plugs.",
                cn: "用于输入空（堵塞）插头的信息。",
                language,
              })}
              <br />
              {getMessage({
                ja: "※部材詳細.txtから極数(CAV数)を取得。",
                us: "*Get the number of poles (CAV number) from the material details.txt.",
                cn: "*从组件详细信息.txt 中获取极数（CAV 编号）。",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section6_5"
            title={
              "6-5." +
              getMessage({
                ja: "治具",
                us: "fixture (machining)",
                cn: "治具",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "[製品品番]の結きの値を基に作成します。",
                us: "The value is created based on the value of the [製品品番] tubercle.",
                cn: "根据[製品品番]纽带的值创建。",
                language,
              })}
              <br />
              {getMessage({
                ja: "治具の座標を手入力する為に使用します。",
                us: "Used to manually input jig coordinates.",
                cn: "用于手动输入夹具的坐标。",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section6_6"
            title={
              "6-6." +
              getMessage({
                ja: "通知書",
                us: "Notification",
                cn: "通知書",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              {getMessage({
                ja: "[製品品番]の結きの値で作成。",
                us: "Created with the value of the [製品品番] tubercle.",
                cn: "用[製品品番]中的领带值创建。",
                language,
              })}
              <br />
              {getMessage({
                ja: "マル即/設計変更通知書/部品変更通知書や修正履歴を入力するのに使用します。",
                us: "Used to enter mal immediate/design change notice/part change notice and revision history.",
                cn: "用于输入马尔即时/设计变更通知/部件变更通知和修订历史。",
                language,
              })}
            </Text>
          </SectionBox>
        </Box>
        <Text textAlign="center" mx="auto">
          {getMessage({
            ja: "--作成途中--",
            us: "--on the way--",
            cn: "--作成途中--",
            language,
          })}
        </Text>
        <SectionBox
          id="section99"
          title={
            "99." +
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
                fontWeight: "400",
              }}
            >
              {getMessage({
                ja: "以上で生産準備+の使い方の説明は終わりです。",
                us: "This concludes the explanation of how to use Production Preparation+.",
                cn: "关于如何使用 生产准备+ 的说明到此为止。",
                language,
              })}
              <br />
              {getMessage({
                ja: "練習(上級)では生産準備+の動作を変更するアイデアを提案するコツを紹介します。",
                us: "Practice (Advanced) will show you tips on how to propose ideas to change the behavior of Production Preparation+.",
                cn: "实践（高级）提供了如何提出改变生产准备+行为的建议。",
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
        <Box h="3vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
