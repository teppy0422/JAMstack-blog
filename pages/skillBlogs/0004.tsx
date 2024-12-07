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
  Flex,
  Icon,
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";
import { CiBeerMugFull } from "react-icons/ci";
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import SkillGraph from "../../components/sillGraph";
import SkillCircle from "../../components/skillCircle";
import ICT from "./ICT";
import styles from "../../styles/home.module.scss";
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
  const skillCircles = [
    {
      value: 90,
      cirText: "EXCEL-vba\nアプリ制御など\n15年",
      color: "#1f9b60",
      img: "/images/brandIcons/logo_excel.svg",
    },
    {
      value: 65,
      cirText: "ACCESS-vba\n部品管理\n3年",
      color: "#1f9b60",
      img: "/images/brandIcons/logo_access.svg",
    },
    {
      value: 30,
      cirText: "vb.net\nシリアル通信\nカメラ制御\n半年",
      color: "#9A4F96",
      img: "/images/brandIcons/logo_dotNet.svg",
    },
    {
      value: 60,
      cirText: "HTML\n基本的な使い方\n4年",
      color: "#F1652A",
      img: "/images/brandIcons/logo_html5.svg",
    },
    {
      value: 65,
      cirText: "CSS\n基本的な使い方\n+SCSS\n4年",
      color: "#F1652A",
      img: "/images/brandIcons/logo_css.svg",
    },
    {
      value: 40,
      cirText: "JavaScript\n4年",
      color: "#F1652A",
      img: "/images/brandIcons/logo_javascript.svg",
    },
    {
      value: 45,
      cirText: "Next\nこのサイトを作成\n2年",
      color: "#F1652A",
      img: "/images/brandIcons/logo_next.svg",
    },
    {
      value: 30,
      cirText: "PHP\n半年",
      color: "#4E5B92",
      img: "/images/brandIcons/logo_php.svg",
    },
    {
      value: 20,
      cirText: "Python\n少しだけ",
      color: "#4E5B92",
      img: "/images/brandIcons/logo_python.svg",
    },
    {
      value: 60,
      cirText: "Arduino\n2年",
      color: "#12999F",
      img: "/images/brandIcons/logo_arduino.svg",
    },
    {
      value: 30,
      cirText: "Davinci Resolve\n半年",
      color: "#888888",
      img: "/images/brandIcons/logo_davinci.svg",
    },
    {
      value: 30,
      cirText: "InkScape\n1年",
      color: "#333333",
      img: "/images/brandIcons/logo_inkscape.svg",
    },
    {
      value: 30,
      cirText: "Premiere Pro\n半年",
      color: "#00005c",
      img: "/images/brandIcons/logo_Premiere.svg",
    },
  ];
  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <Avatar
              size="xs"
              src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
            />
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
            メンバーリスト
          </Heading>
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            更新日:2024-11-18
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title="1.片岡哲兵"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Flex alignItems="flex-start" mb={4} justifyContent="center">
            <Avatar src="/images/me.jpeg" width={8} height={8} m={2} />
            <Text
              w={["100%", "95%", "90%", "90%"]}
              fontFamily="Noto Sans JP"
              mb={20}
              ml={0}
            >
              高知出身。
              ワイヤーハーネス製造工場で/機械保全/前工程生産分析/後工程生産分析/工務/工作改善チームを経験。
              現場の問題改善を繰り返す内にITや電子工学技術に興味を持ちました。
              工作改善チームではPLC/Arduinoなどのハードウェアを経験させてもらいました。
              その後、ハードウェアとソフトウェアを組み合わせる内にHTML/JavaScript/PHPを経験してWEBアプリを作るに至りました。
              現場の使用者と相談しながら更に発展させていくのが好きです。プログラミングは嫌い。
            </Text>
          </Flex>
          <div data-aos="fade-right" style={{ display: "inline-block" }}>
            <Text className={styles.subTitle}>スキル</Text>
          </div>
          <Flex justifyContent="center">
            <SkillGraph />
          </Flex>

          <Box style={{ textAlign: "center" }} mb={20}>
            {skillCircles.map((item, index) => {
              const aosOffset: number = (index % 5) * 70;
              return (
                <Flex
                  key={index}
                  data-aos="fade-up"
                  data-aos-offset={aosOffset}
                  style={{ display: "inline-block" }}
                >
                  <SkillCircle
                    value={item.value}
                    cirText={item.cirText}
                    color={item.color}
                    timing={index}
                    img={item.img}
                  />
                </Flex>
              );
            })}
          </Box>
          <Flex alignItems="left" m={4} mt={6}>
            <Flex alignItems="center" borderBottom="1px solid">
              <Icon as={CiBeerMugFull} w={6} h={6} />
              <ICT />
            </Flex>
          </Flex>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.このサイトについて"
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
                fontWeight: "100",
              }}
            >
              このWEBサイトは効率良く活動を進めるために作成しました。
              <br />
              たとえば従来のメール連絡だと下記が不都合でした。
              <br />
              1.送信できるファイルサイズが小さい(2MB程度)
              <br />
              2.過去のやりとりの確認がし辛い
              <br />
              <br />
              そこで、LINEのようなリアルタイムチャットを用意しました。
              <br />
              1.管理者が認証したアカウントのみ閲覧可能
              <br />
              2.他社のやりとりは閲覧不可
              <br />
              <br />
              その他、最新のプログラムのダウンロードや使い方を載せていきます。
              <br />
              <br />
              <br />
              このサイトのソースコードはGitHubに公開しています。
              <br />
              レポジトリは JAMstack-blog。 自由に使って構いません。
              <br />
              ※チャット内容/添付ファイル/ユーザー情報/その他一部のファイルはsupabase内にあるのでアクセス出来ない事をご了承ください。
              <br />
              <br />
              Next.js + TypeScriptで書いています
              <br />
              CSSフレームワークはChakraUI
              <br />
              データベースはVercel + supabase
              <br />
              ブログはmicroCMS
            </Text>
            <Flex alignItems="left" m={4} mt={6}>
              <Link href="https://github.com/teppy0422" isExternal>
                <Flex alignItems="center">
                  <Icon as={FaGithub} w={6} h={6} />
                  <Text ml={2}>GitHub</Text>
                </Flex>
              </Link>
            </Flex>
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
