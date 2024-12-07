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
  Center,
  Flex,
  Icon,
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { LuPanelRightOpen } from "react-icons/lu";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import ModalWork from "../../components/modalWork";
import ImageCard from "../../components/imageCard";
import Detail01 from "../../components/worksDetail/01";
import Detail01talk from "../../components/worksDetail/01_talk";
import Detail02 from "../../components/worksDetail/02";
import Detail02talk from "../../components/worksDetail/02_talk";
import Detail03 from "../../components/worksDetail/03";
import { useUserData } from "../../hooks/useUserData";
import { useUserInfo } from "../../hooks/useUserId";
import { useReadCount } from "../../hooks/useReadCount";

import styles from "../../styles/home.module.scss";
import "@fontsource/noto-sans-jp";

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
  const readByCount = useReadCount(userId);

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
  //現在のパスを取得
  const [currentPath, setCurrentPath] = useState("");
  const [accordionIndex, setAccordionIndex] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
      // 現在のパスに基づいて開くべきアコーディオンのインデックスを設定
      if (
        window.location.pathname.includes("/skillBlogs/0001") ||
        window.location.pathname.includes("/skillBlogs/0002")
      ) {
        setAccordionIndex([0]);
      } else if (window.location.pathname.includes("/skillBlogs/0003")) {
        setAccordionIndex([1]);
      } else {
        setAccordionIndex([]);
      }
    }
  }, []);
  const skillCards = [
    {
      title: "生産準備+",
      subTitle: "画像を自動で作る",
      eyeCatchPath: "/images/sjp_menu.png",
      detail: <Detail01 />,
      detailTalk: <Detail01talk />,
      rate: 5,
      users: 341,
      skillTags: [
        {
          skillName: "EXCEL",
          skillColor: "green",
        },
      ],
      titleTalk: "詳細(茶番劇1話)を見る",
    },
    {
      title: "導通検査+",
      subTitle: "WEB技術の基礎",
      eyeCatchPath: "/images/sjp_kensarireki_YCC.png",
      detail: <Detail02 />,
      detailTalk: <Detail02talk />,
      rate: 5,
      users: 120,
      skillTags: [
        {
          skillName: "EXCEL",
          skillColor: "green",
        },
        {
          skillName: "HTML",
          skillColor: "orange",
        },
        {
          skillName: "CSS",
          skillColor: "blue",
        },
        {
          skillName: "JavaScript",
          skillColor: "yellow",
        },
      ],
      titleTalk: "詳細(茶番劇2話)を見る",
    },
    {
      title: "作業誘導+",
      subTitle: "マイコン",
      eyeCatchPath: "/images/detail_03_title.png",
      detail: <Detail03 />,
      detailTalk: <Center>Comming soon. maybe</Center>,
      rate: 5,
      users: 8,
      skillTags: [
        {
          skillName: "EXCEL",
          skillColor: "green",
        },
        {
          skillName: "HTML",
          skillColor: "orange",
        },
        {
          skillName: "CSS",
          skillColor: "blue",
        },
        {
          skillName: "JavaScript",
          skillColor: "yellow",
        },
        {
          skillName: "VB.net",
          skillColor: "purple",
        },
        {
          skillName: "Arduino",
          skillColor: "teal",
        },
      ],
      titleTalk: "詳細(茶番劇3話)を見る",
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
            改善活動の参考事例集
          </Heading>
          <CustomBadge text="参考" />
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
          title="1.はじめに"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box ml={4}>
            <Text>
              現場の意見と相談しながらどのように改善していくかを試行錯誤した経験をまとめていきます。
              改善を進める人の参考になれば幸いです。
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title="2.生産準備+を使った業務改善"
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box ml={4}>
            <Text>実際の進め方をデフォルメしています。娘は居ません。</Text>
            <Box
              mt={4}
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
            >
              {skillCards.map((item, index) => {
                return (
                  <Box display={"inline-block"} key={index} textAlign="center">
                    <ModalWork title={item.title} detail={item.detail} m={0}>
                      <ImageCard
                        title={item.title}
                        subTitle={item.subTitle}
                        eyeCatchPath={item.eyeCatchPath}
                        rate={item.rate}
                        users={item.users}
                        skillTags={item.skillTags}
                      />
                    </ModalWork>
                    <ModalWork title={item.title} detail={item.detailTalk}>
                      <Box className={styles.cardList}>
                        <Box className={styles.balloon} boxShadow="md">
                          {item.titleTalk}
                        </Box>
                      </Box>
                    </ModalWork>
                  </Box>
                );
              })}
            </Box>
          </Box>
          <Text textAlign="center">---作成途中---</Text>
        </SectionBox>
        <SectionBox
          id="section3"
          title="3.まとめ"
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
                fontWeight: "bold",
              }}
            ></Text>
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
