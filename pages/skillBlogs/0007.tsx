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
import { useUserData } from "../../hooks/useUserData";
import { useUserInfo } from "../../hooks/useUserId";
import { useReadCount } from "../../hooks/useReadCount";

import "@fontsource/noto-sans-jp";

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
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

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
            <Text>開発</Text> <Spacer />
            <Flex justifyContent="flex-end">
              <Text>
                <Icon as={CustomIcon} mr={0} />
                {readByCount}
              </Text>
            </Flex>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            生産準備+の練習(初級)
          </Heading>
          <CustomBadge text="生準+" />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            更新日:2024-11-19
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
            <Text fontWeight="bold"></Text>
            <Text>
              開発に着手してから{calculateElapsedTime()}
              が経過しています。多くの機能を追加した結果、文章での理解が難しいものになってしまいました。
              その為、まず最初に実際に操作して何となく理解する事を推奨しています。とりあえず以下の手順通りにやってみてください。
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.練習用の生産準備+の入手"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>ダウンロードして使えるように準備をします。</Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              2-1.ダウンロードの実行
            </Text>
            <DownloadLink
              text="ダウンロードする"
              href="/images/0007/003_練習用.zip"
            />
            <Text fontWeight="400" my={4}>
              2-2.ダウンロードフォルダを開く
            </Text>
            <Text>
              ダウンロードが完了したら下図が表示されるので赤枠の辺りをクリックします
              <br />
              ※Edgeの場合
            </Text>
            <Image src="/images/0007/0001.png" alt="0001.png" w="60%" />
            <Text
              onClick={() => handleOpen("chrome")}
              cursor="pointer"
              color="blue.500"
            >
              ※Chromeの場合
            </Text>
            <Modal isOpen={activeDrawer === "chrome"} onClose={handleClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Chromeの場合</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Image src="/images/0007/0004.png" alt="0004.png" />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleClose}>
                    閉じる
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Text fontWeight="400" my={4}>
              2-3.ダウンロードしたファイル(003_練習用.zip)の展開
            </Text>
            <Image src="/images/0007/0002.png" alt="0002.png" w="65%" />
            <Text my={4}>
              ダウンロードした.zipを右クリックして「すべて展開」をクリック
            </Text>
            <Text fontWeight="400" my={4}>
              2-4.展開されたフォルダのエクセルファイルを開く
            </Text>

            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Image src="/images/0007/0003.png" alt="0003.png" w="70%" />
              <Box bg="gray.300" color="black" w="70%" p={1}>
                このエクエルファイルが生産準備+の本体です
              </Box>
            </Flex>
          </Box>
        </SectionBox>
        <SectionBox
          id="section3"
          title="3.必要データのインポート"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>必要なファイルをインポートしていきます</Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              3-1.[MENU]を開く
            </Text>
            <Image src="/images/0007/0005.png" alt="0002.png" />
            <Text fontWeight="400" my={4}>
              3-2.必要ファイルのインポートを行う
            </Text>

            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <video width="90%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0006.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
              <Box bg="gray.300" color="black" w="90%" p={1} mb={6}>
                入力→01_インポート→RTTFのサブを使用にチェック→全て実行
                <br />
                動画と同じようにやってみてください
              </Box>
              <video width="60%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0007.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
              <Box bg="gray.300" color="black" w="60%" p={1}>
                画面左下に進捗状況が表示されます
              </Box>
            </Flex>
          </Box>
        </SectionBox>
        <SectionBox
          id="section4"
          title="4.シートの作成"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>再度、MENUを開いて下図のように操作してください</Text>
          <Box m={3}>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <video width="65%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0008.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
              <Box bg="gray.300" color="black" w="65%" p={1} mb={6}>
                入力→02_手入力シート作成→すべて実行をクリック
              </Box>
            </Flex>
            <Text>
              この操作によって複数のシートが作成されます。
              このシートは不足したデータを補う為に入力する為に使用します。※今回は初級なので入力は省きます。
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section5"
          title="5.成果物の作成"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>[MENU]を開いて下図のように操作してください</Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              5-1.サブ図の作成
            </Text>

            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0009.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
              <Box bg="gray.300" color="black" w="70%" p={1} mb={6}>
                40-50_ハメ図 → サブ図 → 製品品番を選択 → 作成
              </Box>
              <Text>約30秒後に作成されます</Text>
            </Flex>
            <Text fontWeight="400" my={4}>
              5-2.配策誘導ナビの作成
            </Text>

            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <video width="50%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0010.mp4" type="video/mp4" />
                お使いのブラウザは動画タグをサポートしていません。
              </video>
              <Box bg="gray.300" color="black" w="50%" p={1} mb={6}>
                50_配策図 → 実行
              </Box>
              <Text>
                約120秒後に配策誘導ナビが作成されます。
                <br />
                ※これはブラウザやブラウザコントロールで表示できます。
              </Text>
            </Flex>
          </Box>
        </SectionBox>
        <SectionBox
          id="section6"
          title="6.まとめ"
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
              なんとなく作成までの流れが分かったかと思います。
              <br />
              このように基本はクリックで進めていきます。
              <br />
              <br />
              しかし実際には存在しないデータは手入力が必要です。
              次の練習(中級)で手入力を経験してみてください。
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
