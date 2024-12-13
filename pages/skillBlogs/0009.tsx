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
import ReferenceSettingModal from "./referenceSettingModal";
import { useUserData } from "../../hooks/useUserData";
import { useUserInfo } from "../../hooks/useUserId";
import { useReadCount } from "../../hooks/useReadCount";

import "@fontsource/noto-sans-jp";
import { BsFiletypeExe } from "react-icons/bs";
import SjpChart01 from "./chart/chart_0009_01";
import SjpChart02 from "./chart/chart_0009_02";

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
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const { readByCount } = useReadCount(userId);

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
  //64pxまでスクロールしないとサイドバーが表示されないから暫定
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64; // 64pxのオフセット
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100); // 100msの遅延を追加
    } else {
      window.scrollTo(0, 150);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, []);
  //#の位置にスクロールした時のアクティブなセクションを装飾
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-64px 0px -99% 0px", threshold: 0 }
    );
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  //#クリックした時のオフセット
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64; // 64pxのオフセット
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange, false);
    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
    };
  }, []);

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
    name: "任意のフォルダ",
    type: "folder",
    isOpen: true,
    popOver: "※社内間でアクセスできるNASSサーバーに作成がお勧め",
    children: [
      {
        name: "メーカー名Aのフォルダ",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "車種_モデル名のフォルダ",
            type: "folder",
            isOpen: true,
            children: [
              {
                name: "Sjp3.100.89_Gタイプ.xlsm",
                type: "file",
                popOver:
                  "ダウンロードした生産準備+をここに配置。治具タイプを末尾に付ける事をお勧めします。ここではGタイプの治具の場合です。",
              },
            ],
          },
        ],
      },
      {
        name: "メーカー名Bのフォルダ",
        type: "folder",
        isOpen: false,
      },
    ],
  };

  const directoryData2: FileSystemItem = {
    name: "生産準備+があるフォルダ",
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
    name: "生産準備+があるフォルダ",
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
            popOver: "入手したPVSWを全てここに配置",
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
            popOver: "入手したSUBを含むファイルを全てここに配置",
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
            popOver: "入手したMDを含むフォルダを全てここに配置",
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
    name: "生産準備+があるフォルダ",
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
            name: "WH-DataConvert ←1.これを実行すると...",
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
            name: "*MD(分解後) ← 2.この中に展開される",
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

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null; // クライアントサイドでのみ表示する場合はnullを返す
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
            <Text>開発</Text>
            <Spacer />
            <Flex justifyContent="flex-end">
              <Text>
                <Icon as={CustomIcon} mr={0} />
                {readByCount}
              </Text>
            </Flex>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            導入の効果
          </Heading>
          <CustomBadge text="生準+" />
          <CustomBadge text="作成途中" />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            更新日:2024-11-27
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title="1.はじめに"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box>
            <Text>
              生産準備+は相乗的に効果を発揮するので説明が難しいですが、頑張って書いてみます
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.生産準備への効果"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text fontWeight="bold">
            生産準備では新規立上げ/切替時に多くの成果物を作成すると思います。
            しかも必ず発生する設計変更などにより作り直しも必要になってきます。
            その結果、多くの時間が掛かり作成ミスも多くなりがちで不良の原因にもなっていました。
            そこでより効率的に作成/管理できる方法を考えてみました。
          </Text>
          <Text mt={6}>下記の条件で導入効果を見ていきます</Text>
          <VStack justifyContent="center" mt={4} spacing={0}>
            <Box
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
              borderTopRadius={5}
              p={1}
              textAlign="center"
              bg="gray.300"
              w="60%"
            >
              2018年_エンジンメイン(平均約550回路)
            </Box>
            <Box border="1px solid" borderBottomRadius={5} p={2} mb={4} w="60%">
              <Text>・新規立ち上げ</Text>
              <Text>・担当は5名</Text>
              <Text>・20品番/結き治具</Text>
              <Text>・結き治具/検査台は1種類</Text>
              <Text>・作成/更新する必要があるファイル数:77点</Text>
              <Text>・1月出図-7月量確(マル即による変更5回)</Text>
              <Text>・77×5=385ファイルの変更が必要</Text>
            </Box>
          </VStack>
        </SectionBox>
        <Box ml="4">
          <SectionBox
            id="section2_1"
            title="2-1.成果物作成の流れを比較"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold">
              下図のように回路マトリクスを手動で作成、それを基に各成果物を作成していました。
            </Text>
            <VStack justifyContent="center" mt={4} spacing={0}>
              <Box
                bg="gray.300"
                color="black"
                w="90%"
                p={1}
                mt={4}
                borderTopRadius={5}
                border="1px solid"
              >
                生産準備+の導入前
              </Box>
              <Image src="/images/0009/0001.svg" w="90%" />
              <Text w="90%">
                立ち上げ時に作成したファイルをそれぞれ修正していました
              </Text>
            </VStack>
            <HStack justifyContent="center" mt={4}>
              <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
            </HStack>
            <VStack justifyContent="center" spacing={0}>
              <Box
                bg="gray.300"
                color="black"
                w="90%"
                p={1}
                mt={6}
                borderTopRadius={5}
                border="1px solid"
              >
                生産準備+の導入後
              </Box>
              <Image src="/images/0009/0002.svg" w="90%" />
              <Text w="90%">
                導入後は生産準備+のファイル一つから各成果物を作成。
                これにより一つのファイル修正で変更が反映できます。
                <br />
                ※竿レイアウト図はクランプ番号の手入力が必要です。
              </Text>
            </VStack>
          </SectionBox>
          <SectionBox
            id="section2_2"
            title="2-2.工数の推移を比較"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold">
              以上を踏まえて立上げ工数の推移を確認していきます。
            </Text>

            <Text my={6}>
              マル即などによる変更を反映していく必要があります。
              それを踏まえて実際の製品切替を数字を使って見てみましょう。
            </Text>
            <Box
              bg="gray.300"
              color="black"
              w="100%"
              p={1}
              mt={4}
              borderTopRadius={5}
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
            >
              生産準備+の導入前
            </Box>
            <Box border="1px solid">
              <SjpChart01 />
            </Box>
            <Text>
              特定の期間に業務が集中した結果、残業と休出が発生しています。
            </Text>
            <HStack justifyContent="center" mt={4}>
              <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
            </HStack>
            <Box
              bg="gray.300"
              color="black"
              w="100%"
              p={1}
              mt={4}
              borderTopRadius={5}
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
            >
              生産準備+の導入後
            </Box>
            <Box border="1px solid">
              <SjpChart02 />
            </Box>
            <Text>
              一つのファイルを編集して成果物は自動作成する事で大幅に工数が下がっています。
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_3"
            title="2-3.効果の比較まとめ"
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold">
              実際に生産準備を行う人の意見をまとめました。
            </Text>
            <Box
              bg="gray.300"
              color="black"
              w="100%"
              p={1}
              mt={4}
              borderTopRadius={5}
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
            >
              生産準備+の導入前
            </Box>
            <Box
              borderBottom="1px solid"
              borderLeft="1px solid"
              borderRight="1px solid"
              p={3}
            >
              <Text>工数面</Text>
              <Text>
                <Icon as={FaStarHalfAlt} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                切り替え時に工数が集中して掛かる(業務工数の偏りによる残業)
                <br />
                <Icon as={FaStarHalfAlt} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                修正ファイルの数が多く修正が困難(ミス/不良発生の原因)
                <br />
              </Text>
              <Text mt={4}>品質面</Text>
              <Text>
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                手入力のミスによる切替時の不良発生の増加
              </Text>
              <Text mt={4}>生活面</Text>
              <Text>
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                切り替え時に生活が不安定になる(離職の原因)
              </Text>
            </Box>
            <HStack justifyContent="center" mt={4}>
              <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
            </HStack>
            <Box
              bg="gray.300"
              color="black"
              w="100%"
              p={1}
              mt={4}
              borderTopRadius={5}
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
            >
              生産準備+の導入後
            </Box>
            <Box
              borderBottom="1px solid"
              borderLeft="1px solid"
              borderRight="1px solid"
              p={3}
            >
              <Text>工数面</Text>
              <Text>
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                自動化により作成工数が極端に減少
                <br />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                修正ファイルは１個、反映が簡単
                <br />
              </Text>
              <Text mt={4}>品質面</Text>
              <Text>
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStarHalfAlt} color="gray.600" mr={1} />
                自動処理の箇所は入力ミスが発生しません
              </Text>
              <Text mt={4}>生活面</Text>
              <Text>
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                安定した時間に帰宅できる
              </Text>
            </Box>
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
              上記の効果には以下を含んでいません。
              <br />
              <br />
              ・検査履歴システム用ポイント点滅
              <br />
              ・配策誘導ナビ(補給品で特に有効)
              <br />
              ・先ハメ誘導
              <br />
              ・サブ自動立案
              <br />
              <br />
              データがまとまり次第追記します。
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
