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
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "./frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import SkillGraph from "../../components/sillGraph";
import SkillCircle from "../../components/skillCircle";

import styles from "../../styles/home.module.scss";

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
const BlogPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
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
  //アンダーライン付きテキスト_ドロワー
  const UnderlinedTextWithDrawer = ({
    text,
    onOpen,
    isOpen,
    onClose,
    header,
    children,
  }) => {
    const { colorMode } = useColorMode();
    const color = colorMode === "light" ? "blue.500" : "blue.200";
    return (
      <>
        <HStack
          as="span"
          style={{ whiteSpace: "nowrap" }}
          color={color}
          cursor="pointer"
          onClick={onOpen}
          spacing={1}
          borderBottom="2px solid"
          borderColor={color}
          display="inline"
        >
          <Box as="span" display="inline">
            {text}
          </Box>
          <LuPanelRightOpen
            size="20px"
            style={{ marginBottom: "-3px", display: "inline" }}
          />
        </HStack>
        <BasicDrawer isOpen={isOpen} onClose={onClose} header={header}>
          {children}
        </BasicDrawer>
      </>
    );
  };
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
      img: "/images/logo_excel.svg",
    },
    {
      value: 65,
      cirText: "ACCESS-vba\n部品管理\n3年",
      color: "#1f9b60",
      img: "/images/logo_access.svg",
    },
    {
      value: 30,
      cirText: "vb.net\nシリアル通信\nカメラ制御\n半年",
      color: "#9A4F96",
      img: "/images/logo_dotNet.svg",
    },
    {
      value: 60,
      cirText: "HTML\n基本的な使い方\n4年",
      color: "#F1652A",
      img: "/images/logo_html5.svg",
    },
    {
      value: 65,
      cirText: "CSS\n基本的な使い方\n+SCSS\n4年",
      color: "#F1652A",
      img: "/images/logo_css.svg",
    },
    {
      value: 40,
      cirText: "JavaScript\n4年",
      color: "#F1652A",
      img: "/images/logo_javascript.svg",
    },
    {
      value: 40,
      cirText: "Next\nこのサイトで利用\n1年",
      color: "#F1652A",
      img: "/images/logo_next.svg",
    },
    {
      value: 30,
      cirText: "PHP\n半年",
      color: "#4E5B92",
      img: "/images/logo_php.svg",
    },
    {
      value: 20,
      cirText: "Python\n少しだけ",
      color: "#4E5B92",
      img: "/images/logo_python.svg",
    },
    {
      value: 60,
      cirText: "Arduino\n2年",
      color: "#12999F",
      img: "/images/logo_arduino.svg",
    },
    {
      value: 30,
      cirText: "Davinci Resolve\n半年",
      color: "#888888",
      img: "/images/logo_davinci.svg",
    },
    {
      value: 30,
      cirText: "InkScape\n1年",
      color: "#333333",
      img: "/images/logo_inkscape.svg",
    },
  ];
  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box>
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <Avatar
              size="xs"
              src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
            />
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>開発</Text>
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
              現場の使用者と相談しながら更に発展させていくのが好きです。カバも好き。プログラミングは嫌い。
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
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.その他"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            このWEBサイトのソースコード(JAMstack-blog)はGitHubに公開しています
          </Text>
          <Box m={3}>
            <Flex alignItems="left" mb={4}>
              <Link href="https://github.com/teppy0422" isExternal>
                <Flex alignItems="center">
                  <Icon as={FaGithub} w={6} h={6} />
                  <Text ml={2}>GitHub</Text>
                </Flex>
              </Link>
            </Flex>
            <Text>
              このサイトのソースコードはGitHubに公開しています。自由に使って構いません。
              ※チャットやユーザー情報、一部のファイルはsupabase内にあるのでアクセス出来ない事をご了承ください。
              <br />
              <br />
              Next.jsで書いています
              <br />
              CSSフレームワークはChakraUI
              <br />
              データベースはVercel,supabase
              <br />
              ブログはmicroCMS
            </Text>
          </Box>
        </SectionBox>
        <Box height="100vh"></Box>
      </Frame>
    </>
  );
};

export default BlogPage;
