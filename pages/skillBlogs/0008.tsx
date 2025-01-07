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
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import DownloadLink from "./DownloadLink";
import UnderlinedTextWithDrawer from "./UnderlinedTextWithDrawer";
import ExternalLink from "./ExternalLink";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ImageSliderModal from "./ImageSliderModal"; // モーダルコンポーネントをインポート
import OptionalBox from "./OptionalBox";
import ReferenceSettingModal from "./referenceSettingModal";
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
                通常の手順で手入力で起動します。
                手順が分からない場合は工務にご相談ください。
                それでも分からない場合は
                <ExternalLink
                  href="../../thread/8d7d2ec1-3157-4f5c-a2c3-2e1223e1d2b9"
                  text=" 開発/相談"
                />
                のチャットから問い合わせてください。
              </Text>
            </SectionBox>
            <SectionBox
              id="section4_1_2"
              title="4-1-2.生産準備+から起動"
              sectionRefs={sectionRefs}
              sections={sections}
              size="sm"
            >
              <Divider
                borderColor={colorMode === "light" ? "black" : "white"}
              />
              <Text mb={4}>
                生産準備+の[製品品番]の情報から起動までを自動入力します
              </Text>
              <Box ml={4}>
                <Text>
                  ※EXTESのインストールが必要です。自動インストールには対応していません。
                </Text>
                <Text>
                  ※初回のみ
                  <ImageSliderModal
                    title="EXTESの設定変更"
                    text="EXTESを起動してプロパティで下記と同じように設定します"
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
                  が必要です。
                </Text>
                <Box
                  bg="gray.300"
                  color="black"
                  w="70%"
                  p={1}
                  mt={4}
                  fontSize="14px"
                >
                  [製品品番]に設変(手配符号)の入力
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
                  MENU → 入力 → 00_起動
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
                  RLTFのリクエストを実行
                </Box>
                <Image
                  mb={4}
                  src="/images/0008/MENU_起動_RLTFのリクエスト.png"
                  width="80%"
                  alt="製品品番に設変の入力.png"
                />
                <Text>※動作中はPCを操作しないでください</Text>
                <Text>
                  ※途中で失敗する事が稀にあります。その場合はEXTESを終了してから再度実行してください。
                </Text>
              </Box>
            </SectionBox>
          </Box>
          <SectionBox
            id="section4_2"
            title="4-2.RLTFの配置"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>入手したファイルを下記の場所に保存します</Text>

            <FileSystemNode item={directoryData2} />
          </SectionBox>
          <SectionBox
            id="section4_3"
            title="4-3.RLTFの分解"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>以下を実行します</Text>
            <Box
              bg="gray.300"
              color="black"
              w="80%"
              p={1}
              mt={4}
              fontSize="14px"
            >
              MENU → 入力 → 00_起動 → MENU_起動_後引張支援システムでの変換
            </Box>
            <Image
              mb={4}
              src="/images/0008/MENU_起動_後引張支援システムでの変換.png"
              width="80%"
              alt="MENU_起動_後引張支援システムでの変換.png"
            />
            <Text mb={2}>実行すると下記の処理が行われます</Text>
            <Box ml={2}>
              <Text>・00_tempに分解データが作成される</Text>
              <Text>・05-RTF_AにRLTF*A*.txtが移動</Text>
              <Text>・06-RTF_BにRLTF*B*.txtが移動</Text>
            </Box>
            <Text>※実行中はPCを操作しないでください</Text>
          </SectionBox>
          <SectionBox
            id="section4_4"
            title="4-4.生産準備+にRLTFを関連づける"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>以下のようにRLTFのファイル名を入力</Text>
            <Box
              bg="gray.300"
              color="black"
              w="80%"
              p={1}
              mt={4}
              fontSize="14px"
            >
              [製品品番]のRLTF-AとRLTF-Bにファイル名を入力
            </Box>
            <Image
              mb={4}
              src="/images/0008/製品品番にRLTFを入力.png"
              width="60%"
              alt="MENU_起動_後引張支援システムでの変換.png"
            />
            <Text mb={2}>
              ※この操作によりRLTFのインポート時に参照するファイルが更新されます
            </Text>
            <Text>以上でRLTFの準備は完了です。</Text>
          </SectionBox>
          <SectionBox
            id="section4_5"
            title="4-5.社内図の設計データの入手"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>主管工場の設計にメールで依頼して入手します</Text>
            <UnderlinedTextWithDrawer
              text=<>
                <Box as="span" display="inline" borderBottom="2px solid">
                  #メールのサンプル
                </Box>
                <LuPanelRightOpen
                  size="20px"
                  style={{ marginBottom: "-5px", display: "inline" }}
                />
              </>
              onOpen={() => handleOpen("メールサンプル")}
              isOpen={isOpen && activeDrawer === "メールサンプル"}
              onClose={handleClose}
              header="メールのサンプル"
              size="md"
              children={
                <>
                  <Text mb={4}>※下記をコピーしてお使いください</Text>
                  <Box border="1px solid" p={2} borderRadius="md" mb={4}>
                    <Text fontWeight={400}>
                      宛先: 〇〇工場 設計 〇〇様
                      <br />
                      件名: PVSWとSUBデータ依頼_生産準備用
                      <br />
                      内容: 〇〇様 お世話になります
                      <br />
                      <br />
                      下記のPVSW.csv、SUB.csv、HSFの出力をお願い致します
                      <br />
                      用途はCV試作の準備です 設変は最新(最終)でお願い致します
                      <br />
                      製品品番
                      <br />
                      841W 82111-V1070 代)82111-V1020
                      <br />
                      841W 82111-V1080
                      <br />
                      841W 82111-V1090
                      <br />
                      以上3点よろしくお願い致します。 <br />
                      <br />
                      〇〇工場 生産準備 〇〇
                    </Text>
                  </Box>

                  <Text fontWeight={600} mt={4}>
                    各データの必要性
                  </Text>
                  <Text>・PVSW.csvは必須です</Text>
                  <Text>
                    ・SUB.csvは社内図の標準サブ形態を使用するなら必要です
                  </Text>
                  <Text>
                    ・HSFは手入力が大幅に削減出来るのであった方が良いです
                  </Text>

                  <Text fontWeight={600} mt={4}>
                    各データの名称について
                  </Text>
                  <Text>
                    各データの正式名称は不明です。
                    すべて社内図を出力するシステムからの出力と聞いています。
                    <br />
                    もし上記メールでどのデータなのか伝わらなければ、下記からダウンロードした参考データを以って設計の方に相談してみてください。
                  </Text>
                  <DownloadLink
                    text="参考データのダウンロード"
                    href="/images/0008/参考.zip"
                  />
                </>
              }
            />
            <Text mt={4}>下記3点のデータを入手します</Text>
            <Box ml={2}>
              <Text>
                <Icon as={FaFile} color="gray.600" mr={1} />
                PSVW*.csv (必須)
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
            title="4-6.設計データの配置"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text mb={4}>
              入手したデータを下記のフォルダに配置してください。
            </Text>
            <FileSystemNode item={directoryData3} />
          </SectionBox>
          <SectionBox
            id="section4_7"
            title="4-7.MDデータの分解"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text mb={4}>
              08_hsfデータ変換に入れた
              <Icon as={FaFolder} color="gray.600" mx={1} />
              MDを分解します
            </Text>
            <FileSystemNode item={directoryData4} />
            <Text mt={4}>※実行完了まで時間がかかります</Text>
            <Text>
              ※これは自分が作成したアプリでは無いのでエラー対応はできません
            </Text>
            <Text>
              ※エラーが発生した場合はMDデータを手入力する必要があります
            </Text>
          </SectionBox>
          <SectionBox
            id="section4_8"
            title="4-8.生産準備+にSUBを関連づける"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text mb={4}>
              社内図の標準(最初)のサブ形態を利用したい事は稀だと思いますが、
              その場合は下記の操作が必要です
            </Text>
            <Box
              bg="gray.300"
              color="black"
              w="60%"
              p={1}
              mt={4}
              fontSize="14px"
            >
              [製品品番]のSUBのファイル名を製品品番毎に入力
            </Box>
            <Image
              mb={4}
              src="/images/0008/製品品番にSUBの入力.png"
              width="60%"
              alt="製品品番にSUBの入力.png"
            />
            <Text mt={4}>以上で社内図の設計データの準備は完了です。</Text>
          </SectionBox>
        </Box>
        <SectionBox
          id="section5"
          title="5.必要データのインポート"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>4.で入手したデータを生産準備+にインポートしていきます</Text>
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
          title="5-1.PVSWのインポート"
          sectionRefs={sectionRefs}
          sections={sections}
          size="sm"
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            ・[PVSW_RLTF]を作成。00_PVSWからPVSWのデータを読み込みます。
            <br />
            ・フィールドが<span style={{ color: "#92CCFF" }}>■</span>
            水色の箇所が使用するデータです。
            <br />
            ・[PVSW_RLTF]が既にある場合は末尾に連番を付けた新しいシートを作成します。
          </Text>
        </SectionBox>
        <SectionBox
          id="section5_2"
          title="5-2.RLTFのインポート"
          sectionRefs={sectionRefs}
          sections={sections}
          size="sm"
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            ・[製品品番]で指定したRLTFから電線情報を取得します。
            <br />
            ・フィールドが<span style={{ color: "#FFCCFF" }}>■</span>
            ピンク色の箇所が使用するデータです。
            <br />
            ・PVSWとRLTFの値が異なる場合はそのセルにコメントを追加します。
            コメントがRLTFの値です。
            異なる場合は社内図を正として修正を行ってください。
          </Text>
        </SectionBox>
        <SectionBox
          id="section5_3"
          title="5-3.[PVSW_RLTF]の最適化"
          sectionRefs={sectionRefs}
          sections={sections}
          size="sm"
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>・電線条件が同じ場合は同じ行にまとめて見やすくします。</Text>
        </SectionBox>
        <SectionBox
          id="section6"
          title="6.手入力シートの作成"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            [PVSW_RLTF]のデータと用意したデータで手入力シートを作成します。
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
            title="6-1.端末一覧"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              [PVSW_RLTF]を基に[端末一覧]を作成。
              <br />
              端末サブナンバー/成型角度/成型方向を手入力する為に使用。
              <br />
              同シート名がある場合はそのシートに増えた情報を追加します。
            </Text>
            <OptionalBox colorMode={colorMode}>
              <Flex alignItems="center">
                <Icon as={IoIosCheckboxOutline} boxSize={5} mt={0.5} />
                <Text ml={1}>07_SUBからサブNo.を取得</Text>
              </Flex>
              <Text ml={7}>
                チェックを入れると、初期(標準)のサブNo.を取得します。
              </Text>
            </OptionalBox>
          </SectionBox>
          <SectionBox
            id="section6_2"
            title="6-2.部品リスト"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              RLTF-A.txtを基に[部品リスト]を作成。
              <br />
              端末に付属する部品品番を手入力する為に使用。
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
                どちらかを選択。
                <br />
                生産準備+のサーバーに部品品番の詳細情報が無い場合に情報を取得するブラウザを選択。
                Edgeはバージョンによってはエラー停止する事があります。
              </Text>
              <Flex alignItems="center" mt={2}>
                <Icon as={IoIosCheckboxOutline} boxSize={5} mt={0.5} />
                <Text ml={1}>08_MDから端末No.を取得</Text>
              </Flex>
              <Text ml={4}>
                チェックを入れると、MDから部品品番に付属する端末No.を取得します。
                MDが正しく分解されていない場合は[PVSW_RLTF]と[CAV一覧]から端末No.を取得します。
              </Text>
              <Flex alignItems="center" mt={2}>
                <Icon as={IoIosCheckboxOutline} boxSize={5} mt={0.5} />
                <Text ml={1}>部材詳細の再取得</Text>
              </Flex>
              <Text ml={4}>
                チェックを入れると、生産準備+のサーバーに部品品番の詳細情報がある場合でも取得しなおします。
                通常は必要ありません。取得する詳細情報をあたらしく追加した場合に使用します。
              </Text>
            </OptionalBox>
          </SectionBox>
          <SectionBox
            id="section6_3"
            title="6-3.CAV一覧"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              [PVSW_RLTF]を基に[CAV一覧]を作成。
              <br />
              空栓(詰栓)の情報を入力する為に使用。
              <br />
              ※部材詳細.txtから空栓の色を取得
              <br />
              MDがある場合はMDからデータを取得
            </Text>
          </SectionBox>
          <SectionBox
            id="section6_4"
            title="6-4.ポイント一覧"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              [PVSW_RLTF]を基に[ポイント一覧]を作成。
              <br />
              空栓(詰栓)の情報を入力する為に使用。
              <br />
              ※部材詳細.txtから極数(CAV数)を取得。
            </Text>
          </SectionBox>
          <SectionBox
            id="section6_5"
            title="6-5.治具"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              [製品品番]の結きの値を基に作成します。
              <br />
              治具の座標を手入力する為に使用します。
            </Text>
          </SectionBox>
          <SectionBox
            id="section6_6"
            title="6-6.通知書"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text>
              [製品品番]の結きの値で作成。
              <br />
              マル即/設計変更通知書/部品変更通知書や修正履歴を入力するのに使用します。
            </Text>
          </SectionBox>
        </Box>
        <SectionBox
          id="section99"
          title="99.まとめ"
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
              以上で生産準備+の使い方の説明は終わりです。
              <br />
              練習(上級)では生産準備+の動作を変更するアイデアを提案するコツを紹介します。
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
        <Box h="0.01vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
