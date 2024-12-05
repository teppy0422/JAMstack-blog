import NextAuth from "next-auth";
import { useState, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { supabase } from "../utils/supabase/client";
import NextLink from "next/link";
import QRCode from "qrcode.react";
import {
  Flex,
  Center,
  Text,
  VStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Link,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";

import { IoMoonOutline } from "react-icons/io5";
import {
  FaSun,
  FaEnvelope,
  FaCloudDownloadAlt,
  FaKeyboard,
} from "react-icons/fa";
import { AiOutlineWechat } from "react-icons/ai";
import { BsCloud, BsCloudRain, BsSun } from "react-icons/bs";
import { ImQrcode } from "react-icons/im";
import { PiGithubLogoFill } from "react-icons/pi";
import { MdEditRoad } from "react-icons/md";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/home.module.scss";
import React, { useEffect } from "react";
import { WiDaySunny, WiCloudyGusts, WiRainMix } from "react-icons/wi";

import AwesomIcon from "./awesomIcon";
import Auth from "./Auth"; // Authコンポーネントをインポート
import { useUserData } from "../hooks/useUserData";
import { Global } from "@emotion/react";

export default function Header() {
  const { data: session } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("red.500", "red.200");
  const bg2 = useColorModeValue("#000", "pink");
  const color = useColorModeValue("tomato", "pink");
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setUserId] = useState<string | null>(null); // userIdの状態を追加
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const [weatherIcon, setWeatherIcon] = useState(<FaSun />);

  useEffect(() => {
    const fetchWeather = async () => {
      const icon = await getWeatherIcon();
      setWeatherIcon(icon);
    };
    fetchWeather();
  }, []);

  // loginボタンを隠す
  let keyFlag: boolean = false;
  // const handleKeyDown = (event: KeyboardEvent) => {
  //   // CMDキー(Meta)の場合処理を行う
  //   if (event.key === "Meta") {
  //     const element = document.getElementById("none");
  //     if (element!) {
  //       if (keyFlag === false) {
  //         element.style.display = "block";
  //         keyFlag = true;
  //       } else {
  //         element.style.display = "none";
  //         keyFlag = false;
  //       }
  //     }
  //   }
  // };
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     document.addEventListener("keydown", handleKeyDown, false);
  //   }
  //   return () => {
  //     if (typeof window !== "undefined") {
  //       document.removeEventListener("keydown", handleKeyDown, false);
  //     }
  //   };
  // }, []);
  // ユーザーIDを取得する関数
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log("getしたよーーーーーーーーーー");
      } else {
        console.error("User is not logged in");
      }
    };
    fetchUserId();
  }, []);
  const buttonStyle = (path) => ({
    p: "2",
    w: "full",
    _hover: { bg: "gray.900" },
    cursor: "pointer",
    color: colorMode === "light" ? "white" : "white",
  });
  const menuItem = (path_, label, useColorMode, icons_) => {
    return (
      <NextLink href={path_} passHref legacyBehavior>
        <Box
          {...buttonStyle(path_)}
          onClick={onClose}
          position="relative"
          _hover={{
            "& span::after": {
              width: "100%",
              transition: "width 0.5s",
            },
          }}
          {...(useColorMode
            ? { color: colorMode === "light" ? "black" : "white" }
            : { color: "white" })}
        >
          <Box
            as="span"
            position="relative"
            _after={{
              content: '""',
              position: "absolute",
              width: "0",
              height: "1px",
              bottom: "-2px",
              left: "0",
              bg: "currentColor",
              transition: "width 0.1s",
              color: useColorMode
                ? colorMode === "light"
                  ? "black"
                  : "white"
                : "white",
            }}
          >
            <Flex alignItems="center" gap="3px">
              {label}
              {icons_}
            </Flex>
          </Box>
        </Box>
      </NextLink>
    );
  };
  //table_usersからユーザー情報を取得
  const fetchUserFromTable = async (userId: string) => {
    const { data, error } = await supabase
      .from("table_users") // テーブル名を指定
      .select("*") // 全ての情報を取得
      .eq("id", userId) // userIdでフィルタリング
      .single(); // 一つの行を取得
    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
    return data; // 取得したデータを返す
  };
  //アバター作成
  const getAvatarProps = (
    post_userID: any,
    isReturn: boolean,
    size: string
  ) => {
    if (isReturn) {
      return (
        <Box position="relative" display="inline-block">
          <Avatar
            boxSize={size === "md" ? "40px" : size} // サイズを引数から設定
            zIndex="5"
            src={post_userID || undefined} // picture_urlを使用
          />
        </Box>
      );
    }
  };
  return (
    <>
      <Global
        styles={{
          "@media print": {
            ".no-print-page": {
              display: "none !important",
            },
          },
        }}
      />
      <div className="no-print-page">
        <header id="navTop" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
          <VStack>
            <Flex className={`${myClass} ${styles.headerNav}`} maxWidth="100vw">
              <IconButton
                className={`${styles.snowTarget}`}
                style={{
                  transform: "translateX(0rem)",
                }}
                display={{ base: "block", xl: "block" }}
                icon={<HamburgerIcon />}
                bg="white.1"
                aria-label="Open Menu"
                onClick={onMenuOpen}
                position="fixed"
                top="8px"
                left="10px"
                zIndex="1101"
                opacity="0.85"
                borderColor={colorMode === "light" ? "black" : "white"}
                borderWidth="1px"
              />
              <Center w="64px">
                {/* <LoginBtn /> */}
                <Box style={{ display: "none" }} id="none">
                  <AwesomIcon
                    link="https://github.com/teppy0422/JAMstack-blog"
                    awesome={faGithub}
                  />
                </Box>
              </Center>
              <Text fontSize={["0px", "16px", "16px", "16px"]}>
                {session?.user?.name}
              </Text>
              <Center
                flex="1"
                style={{ gap: "4px" }}
                className={styles.logoAndText}
              >
                <svg
                  viewBox="-15,80,60,60"
                  className={styles.logo}
                  style={{ backgroundColor: "#111" }}
                >
                  <path d="M10.729923,127.85275 c -2.8633203,-0.64195 -5.7809833,-2.2546 -7.6029793,-4.20232 -2.71948803,-2.90714 -4.03868803,-5.85986 -4.03868803,-9.03966 v -1.63491 l 1.365844,-0.16177 c 1.99806403,-0.23664 3.63172803,-1.15354 4.79294703,-2.69006 1.416664,-1.87453 2.557995,-4.29711 2.680002,-5.68854 0.05742,-0.65485 0.116243,-1.27993 0.13072,-1.38907 0.01448,-0.10914 0.540492,-0.19843 1.168924,-0.19843 2.0168213,0 3.8262033,-0.71348 5.0793843,-2.00291 0.626531,-0.64465 1.22157,-1.17209 1.322309,-1.17209 0.100739,0 0.768508,0.52627 1.48393,1.1695 1.613961,1.45109 3.292081,2.28077 5.054902,2.4992 l 1.353886,0.16775 0.300673,1.45521 c 0.817552,3.95682 4.011102,7.4686 7.34721,8.07933 0.978188,0.17908 0.992161,0.19896 0.990332,1.40897 -0.0026,1.69332 -0.907536,5.31392 -1.745599,6.9837 -1.648468,3.28448 -3.341526,4.48453 -8.306713,5.88785 -3.154913,0.89168 -8.623521,1.1456 -11.377084,0.52825 z M -2.8744683,110.96968 c -2.068338,-2.71173 -2.065755,-6.83028 0.0065,-10.4246 0.821618,-1.425067 1.559682,-1.930427 2.81935,-1.930427 2.610953,0 5.486838,2.949917 5.486838,5.628087 0,1.9649 -3.025031,6.13924 -5.14763,7.10339 -1.620182,0.73594 -2.386117,0.64484 -3.165094,-0.37645 z m 33.5631303,-0.0131 c -1.95025,-0.91771 -3.270954,-2.20007 -4.12491,-4.00514 -0.842209,-1.78025 -0.990759,-3.66914 -0.381249,-4.8478 0.530283,-1.02546 3.150325,-3.433097 3.956024,-3.635307 0.926526,-0.23255 2.531523,0.58905 3.245194,1.661197 0.757531,1.13805 1.73592,4.84205 1.762241,6.67153 0.01418,0.98634 -0.190682,1.99385 -0.621916,3.05839 -0.600583,1.48259 -0.704279,1.59213 -1.569122,1.65764 -0.553715,0.0419 -1.464892,-0.18342 -2.266262,-0.56051 z M 7.0882384,101.31584 c -1.035009,-0.32423 -4.73509,-3.432897 -5.081547,-4.269317 -0.287893,-0.69504 -0.252685,-0.95229 0.281998,-2.06042 0.89808,-1.86129 2.87534,-3.67722 4.548861,-4.17772 2.5152843,-0.75224 4.1391416,-0.77729 5.4643836,-0.0843 1.715155,0.89691 2.26628,1.78687 2.255764,3.64261 -0.01088,1.92048 -1.522894,5.19857 -2.872703,6.228117 -0.924537,0.70518 -3.4052206,1.09428 -4.5967566,0.72101 z m 12.7698106,-0.28025 c -1.575126,-0.96741 -2.987823,-2.800307 -3.188203,-4.136527 -0.246361,-1.64286 0.05068,-4.02385 0.626547,-5.02229 0.910045,-1.57784 3.253803,-2.12464 6.082514,-1.41907 2.154079,0.53729 5.342684,4.36722 5.342684,6.41726 0,0.91637 -2.284579,3.247797 -3.986139,4.067897 -1.536861,0.74071 -3.753749,0.78286 -4.877403,0.0927 z" />
                </svg>
                <NextLink href="/roadMap" legacyBehavior>
                  <Link
                    _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
                  >
                    <Text className={styles.logoText}>PLUS+</Text>
                  </Link>
                </NextLink>
                <Box
                  onClick={onOpen}
                  cursor="pointer"
                  _hover={{ bg: "transparent" }}
                  bg="transparent"
                  h="32px"
                  maxH="32px"
                >
                  <IconButton
                    icon={<ImQrcode size="xl" />} // 変更
                    _hover={{ bg: "transparent" }}
                    bg="transparent"
                    p="0"
                    height="100%"
                    width="100%"
                    aria-label="QR Code Icon" // 変更
                  />
                </Box>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>QRコード</ModalHeader>
                    <ModalCloseButton _focus={{ _focus: "none" }} />
                    <ModalBody>
                      <Box mt="4" display="flex" justifyContent="center">
                        {typeof window !== "undefined" && (
                          <QRCode value={window.location.href} size={80} />
                        )}
                      </Box>
                    </ModalBody>
                    <ModalFooter>
                      <Text fontSize="12px" fontWeight={400}>
                        スマホで読み込む事でこのページにアクセスできます
                      </Text>
                      {/* <Button colorScheme="gray" mr={3} onClick={onClose}>
                      閉じる
                    </Button> */}
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Center>
              <Center w="64px">
                <IconButton
                  className={`${styles.modeChange} ${styles.snowTarget}`}
                  style={{
                    transform: "translateX(0rem)",
                  }}
                  _focus={{ _focus: "none" }}
                  aria-label="DarkMode Switch"
                  icon={colorMode === "light" ? weatherIcon : <IoMoonOutline />}
                  fontSize="28px"
                  colorScheme={colorMode === "light" ? "purple" : "yellow"}
                  onClick={function (event) {
                    const icon = event.currentTarget.querySelector("svg");
                    if (icon) {
                      icon.style.transition = "transform 0.8s"; // 回転アニメーションの設定
                      icon.style.transform = "rotate(360deg)"; // 回転させる
                      setTimeout(() => {
                        toggleColorMode(); // 1秒後にカラーモードを切り替える
                        icon.style.transform = ""; // 回転をリセット
                      }, 800);
                    }
                  }}
                />
              </Center>
              <Center w="64px">
                <Box
                  onClick={() =>
                    session?.user ? signOut() : setLoginModalOpen(true)
                  }
                  cursor="pointer"
                >
                  {getAvatarProps(pictureUrl, true, "md")}
                </Box>
              </Center>
            </Flex>
          </VStack>
        </header>
      </div>
      {/* ログインモーダル */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton
            _hover={{
              _hover: "none",
              border: "none",
              backgroundColor: "transparent",
            }}
          />
          <ModalBody>
            <Auth
              userData={{ userName, userCompany, pictureUrl, userMainCompany }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose}>
        <DrawerOverlay>
          <DrawerContent
            w={["75%", "50%", "25%"]}
            maxW="200px"
            bg="rgba(255, 255, 255, 0.4)" // 背景の透明度を設定
            backdropFilter="blur(10px)" // ブラー効果を設定
          >
            <DrawerHeader color="white">MENU</DrawerHeader>
            <DrawerBody>
              <VStack
                spacing="1"
                align="stretch"
                fontWeight={400}
                fontSize={13}
              >
                <>
                  <Divider borderColor="white" />
                  {menuItem(
                    "/roadMap",
                    "ロードマップ",
                    false,
                    <MdEditRoad size={22} />
                  )}
                  <Divider borderColor="white" />
                  {menuItem(
                    "/skillBlogs/0000",
                    "技術ブログ",
                    false,
                    <PiGithubLogoFill size={22} />
                  )}
                  <Divider borderColor="white" />
                  {menuItem(
                    "/app/typing",
                    "タイピング練習",
                    false,
                    <FaKeyboard size={22} />
                  )}
                  <Divider borderColor="white" />
                  {menuItem(
                    "/download",
                    "ダウンロード",
                    false,
                    <FaCloudDownloadAlt size={23} />
                  )}
                  <Divider borderColor="white" />
                  {menuItem(
                    "/BBS",
                    "問い合わせ",
                    false,
                    <AiOutlineWechat size={22} />
                  )}
                  <Divider borderColor="white" />
                </>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

// 天気情報を取得する関数
const getWeatherIcon = async () => {
  try {
    const response = await fetch(
      "https://www.jma.go.jp/bosai/forecast/data/forecast/360000.json"
    );
    const data = await response.json();

    // 天気情報を解析して適切なアイコンを選択
    const weather = data[0].timeSeries[0].areas[0].weathers[0];

    if (weather.includes("くもり") && weather.includes("雨")) {
      return <WiRainMix />; // 雨のちくもりのアイコン
    } else if (weather.includes("雨")) {
      return <BsCloudRain />;
    } else if (weather.includes("くもり")) {
      return <BsCloud />;
    } else if (weather.includes("晴")) {
      return <BsSun />;
    } else {
      return <FaSun />; // デフォルトのアイコン
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return <FaSun />; // エラー時のデフォルトアイコン
  }
};
