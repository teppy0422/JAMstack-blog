"use client";

import NextAuth from "next-auth";
import { useState, useContext } from "react";

import { useSession, signIn, signOut } from "next-auth/react";
import { supabase } from "@/utils/supabase/client";
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
import { IoIosMail } from "react-icons/io";
import { FaLine } from "react-icons/fa6";
import { IoMoonOutline } from "react-icons/io5";
import StudioIcon from "../../public/images/etc/studio.svg";

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
import { IoTicketOutline } from "react-icons/io5";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "@/styles/home.module.scss";
import React, { useEffect } from "react";
import { WiDaySunny, WiCloudyGusts, WiRainMix } from "react-icons/wi";

import { SunderText, ScrollText } from "./ui/CustomText";
import { AnimationImage } from "./ui/CustomImage";

import Auth from "@/components/Auth";
import { Global } from "@emotion/react";

import { useLanguage } from "../contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import Sidebar from "./sidebar";
import { CustomAvatar } from "./ui/CustomAvatar";
import { CustomModalCloseButton } from "./ui/CustomModalCloseButton";
import { CustomSwitchColorModeButton } from "./ui/CustomSwitchButton";

import { useUserContext } from "@/contexts/useUserContext";

import "@fontsource/dela-gothic-one";

export default function Header() {
  const { language, setLanguage } = useLanguage();

  const { data: session } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    currentUserId,
    currentUserName,
    currentUserCompany,
    currentUserMainCompany,
    currentUserPictureUrl,
    currentUserEmail,
    currentUserCreatedAt,
  } = useUserContext();

  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [weatherIcon, setWeatherIcon] = useState(<FaSun />);
  useEffect(() => {
    const fetchWeather = async () => {
      const icon = await getWeatherIcon();
      setWeatherIcon(icon);
    };
    fetchWeather();
  }, []);

  // 警告メッセージ(一日一回だけ表示)
  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // 今日の日付を取得
    const lastShownDate = localStorage.getItem("lastShownDate");
    // const lastShownDate = "";
    if (lastShownDate !== today) {
      setAlertModalOpen(true); // 初回ロード時にモーダルを表示
      localStorage.setItem("lastShownDate", today); // 今日の日付を記録
    }
  }, []);
  // 警告メッセージ(回転)
  useEffect(() => {
    const fetchElement = () => {
      const path = document.getElementById("rotating-path");
      if (!path) {
        console.error("Element with id 'scaling-path' not found");
        return;
      }
      let angle = 0;
      let animationFrameId: number;
      const rotate = () => {
        if (path) {
          angle = (angle + 0.1) % 360; // Adjust the increment for speed
          path.setAttribute("transform", `rotate(${angle} 128.4 227.5)`); // Set the correct center
        }
        animationFrameId = requestAnimationFrame(rotate);
      };
      rotate();
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    };
    const timeoutId = setTimeout(fetchElement, 100);
    return () => clearTimeout(timeoutId);
  }, []);
  // 警告メッセージ(スケールが大小するアニメーション_内側)
  useEffect(() => {
    const fetchElement = () => {
      const path = document.getElementById("scaling-path");
      if (!path) {
        console.error("Element with id 'scaling-path' not found");
        return;
      }
      let direction = 1; // 1 for increasing, -1 for decreasing
      let animationFrameId: number;
      const duration = 1000;
      const maxScale = 1.15;
      const minScale = 1.1;
      let scale = minScale;
      const scaleIncrement = (maxScale - minScale) / (duration / 16.67); // Adjust for 60fps
      const scaleAnimation = () => {
        if (scale >= maxScale) direction = -1;
        if (scale <= minScale) direction = 1;
        scale += direction * scaleIncrement;
        // Calculate the center of the viewBox
        const centerX = 70.9 + 115 / 2;
        const centerY = 170 + 115 / 2;
        // Apply scale with translation to keep the center
        path.setAttribute(
          "transform",
          `translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`
        );
        animationFrameId = requestAnimationFrame(scaleAnimation);
      };
      scaleAnimation();
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    };
    const timeoutId = setTimeout(fetchElement, 100);
    return () => clearTimeout(timeoutId);
  }, []);
  // 警告メッセージ(スケールが大小するアニメーション_外側)
  useEffect(() => {
    const fetchElement = () => {
      const path = document.getElementById("scaling-path2");
      if (!path) {
        console.error("Element with id 'scaling-path' not found");
        return;
      }
      let direction = -1; // 1 for increasing, -1 for decreasing
      let animationFrameId: number;
      const duration = 1000;
      const maxScale = 1.25;
      const minScale = 1.2;
      let scale = minScale;
      const scaleIncrement = (maxScale - minScale) / (duration / 16.67); // Adjust for 60fps
      const scaleAnimation = () => {
        if (scale >= maxScale) direction = -1;
        if (scale <= minScale) direction = 1;
        scale += direction * scaleIncrement;
        // Calculate the center of the viewBox
        const centerX = 70.9 + 115 / 2;
        const centerY = 170 + 115 / 2;
        // Apply scale with translation to keep the center
        path.setAttribute(
          "transform",
          `translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`
        );
        animationFrameId = requestAnimationFrame(scaleAnimation);
      };
      scaleAnimation();
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    };
    const timeoutId = setTimeout(fetchElement, 100);
    return () => clearTimeout(timeoutId);
  }, []);
  // 警告メッセージ(モグラの動作)
  useEffect(() => {
    const fetchElement = () => {
      const img = document.getElementById("moving-hippo_017_a");
      if (!img) {
        console.error("Element with id 'moving-hippo' not found");
        return;
      }
      let positionX = 6;
      let positionY = 10;
      let direction = -1; // 1 for moving to (6, 10), -1 for moving back to (0, 0)
      const duration = 2000; // 2 seconds for each half of the cycle
      const maxPositionX = 6; // Maximum x position
      const maxPositionY = 10; // Maximum y position
      const incrementX = (maxPositionX * 2) / (duration / 16.67); // Adjust for 60fps
      const incrementY = (maxPositionY * 2) / (duration / 16.67);
      const moveAnimation = () => {
        if (
          direction === 1 &&
          positionX >= maxPositionX &&
          positionY >= maxPositionY
        ) {
          direction = -1;
        } else if (direction === -1 && positionX <= 0 && positionY <= 0) {
          direction = 1;
        }
        positionX += direction * incrementX;
        positionY += direction * incrementY;

        img.style.transform = `translate(${positionX}px, ${positionY}px)`;

        requestAnimationFrame(moveAnimation);
      };
      moveAnimation();
    };
    // Use setTimeout to ensure the element is available
    const timeoutId = setTimeout(fetchElement, 100);
    return () => clearTimeout(timeoutId);
  }, []);

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
      <div
        className="no-print-page"
        style={{ zIndex: "2000", position: "relative" }}
      >
        <header id="navTop" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
          <VStack>
            <Flex className={`${myClass} ${styles.headerNav}`} maxWidth="100vw">
              <Center>
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
                  ml="6px"
                  zIndex="1101"
                  opacity="0.85"
                  borderColor={colorMode === "light" ? "black" : "white"}
                  borderWidth="1px"
                  fontSize="sm"
                  size="sm"
                />
              </Center>
              <Center
                flex="1"
                style={{ gap: "2px" }}
                className={styles.logoAndText}
              >
                <Flex alignItems="center" gap="2px">
                  <Box display={{ base: "none", sm: "block" }}>
                    <svg
                      viewBox="-15,80,60,60"
                      className={styles.logo}
                      style={{ backgroundColor: "#333" }}
                    >
                      <path d="M10.729923,127.85275 c -2.8633203,-0.64195 -5.7809833,-2.2546 -7.6029793,-4.20232 -2.71948803,-2.90714 -4.03868803,-5.85986 -4.03868803,-9.03966 v -1.63491 l 1.365844,-0.16177 c 1.99806403,-0.23664 3.63172803,-1.15354 4.79294703,-2.69006 1.416664,-1.87453 2.557995,-4.29711 2.680002,-5.68854 0.05742,-0.65485 0.116243,-1.27993 0.13072,-1.38907 0.01448,-0.10914 0.540492,-0.19843 1.168924,-0.19843 2.0168213,0 3.8262033,-0.71348 5.0793843,-2.00291 0.626531,-0.64465 1.22157,-1.17209 1.322309,-1.17209 0.100739,0 0.768508,0.52627 1.48393,1.1695 1.613961,1.45109 3.292081,2.28077 5.054902,2.4992 l 1.353886,0.16775 0.300673,1.45521 c 0.817552,3.95682 4.011102,7.4686 7.34721,8.07933 0.978188,0.17908 0.992161,0.19896 0.990332,1.40897 -0.0026,1.69332 -0.907536,5.31392 -1.745599,6.9837 -1.648468,3.28448 -3.341526,4.48453 -8.306713,5.88785 -3.154913,0.89168 -8.623521,1.1456 -11.377084,0.52825 z M -2.8744683,110.96968 c -2.068338,-2.71173 -2.065755,-6.83028 0.0065,-10.4246 0.821618,-1.425067 1.559682,-1.930427 2.81935,-1.930427 2.610953,0 5.486838,2.949917 5.486838,5.628087 0,1.9649 -3.025031,6.13924 -5.14763,7.10339 -1.620182,0.73594 -2.386117,0.64484 -3.165094,-0.37645 z m 33.5631303,-0.0131 c -1.95025,-0.91771 -3.270954,-2.20007 -4.12491,-4.00514 -0.842209,-1.78025 -0.990759,-3.66914 -0.381249,-4.8478 0.530283,-1.02546 3.150325,-3.433097 3.956024,-3.635307 0.926526,-0.23255 2.531523,0.58905 3.245194,1.661197 0.757531,1.13805 1.73592,4.84205 1.762241,6.67153 0.01418,0.98634 -0.190682,1.99385 -0.621916,3.05839 -0.600583,1.48259 -0.704279,1.59213 -1.569122,1.65764 -0.553715,0.0419 -1.464892,-0.18342 -2.266262,-0.56051 z M 7.0882384,101.31584 c -1.035009,-0.32423 -4.73509,-3.432897 -5.081547,-4.269317 -0.287893,-0.69504 -0.252685,-0.95229 0.281998,-2.06042 0.89808,-1.86129 2.87534,-3.67722 4.548861,-4.17772 2.5152843,-0.75224 4.1391416,-0.77729 5.4643836,-0.0843 1.715155,0.89691 2.26628,1.78687 2.255764,3.64261 -0.01088,1.92048 -1.522894,5.19857 -2.872703,6.228117 -0.924537,0.70518 -3.4052206,1.09428 -4.5967566,0.72101 z m 12.7698106,-0.28025 c -1.575126,-0.96741 -2.987823,-2.800307 -3.188203,-4.136527 -0.246361,-1.64286 0.05068,-4.02385 0.626547,-5.02229 0.910045,-1.57784 3.253803,-2.12464 6.082514,-1.41907 2.154079,0.53729 5.342684,4.36722 5.342684,6.41726 0,0.91637 -2.284579,3.247797 -3.986139,4.067897 -1.536861,0.74071 -3.753749,0.78286 -4.877403,0.0927 z" />
                    </svg>
                  </Box>
                  <NextLink href="/" legacyBehavior>
                    <Link _focus={{ _focus: "none" }}>
                      <Box
                        justifyContent="center"
                        display="flex"
                        alignItems="center"
                        color={colorMode === "light" ? "#333" : "#F89173"}
                        w="130px"
                        minW="36px"
                        mr="0"
                        ml="0"
                        bottom="4px"
                      >
                        <StudioIcon />
                      </Box>
                    </Link>
                  </NextLink>
                  <Center
                    onClick={onOpen}
                    cursor="pointer"
                    _hover={{ bg: "transparent" }}
                    bg="transparent"
                    h="24px"
                    maxH="24px"
                  >
                    <IconButton
                      icon={<ImQrcode style={{ fontSize: "24px" }} />}
                      _hover={{ bg: "transparent" }}
                      bg="transparent"
                      p="0"
                      height="100%"
                      width="100%"
                      aria-label="QR Code Icon"
                    />
                  </Center>
                </Flex>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent
                    bg={
                      colorMode === "light"
                        ? "custom.theme.light.500"
                        : "custom.theme.dark.500"
                    }
                  >
                    <ModalHeader py={2} textAlign="center" color="#000">
                      {getMessage({
                        ja: "QR Code",
                        us: "QR Code",
                        cn: "QR 码",
                      })}
                    </ModalHeader>
                    <CustomModalCloseButton
                      onClose={onClose}
                      colorMode={colorMode}
                      top="-4px"
                      right="-4px"
                      outline={
                        colorMode === "light" ? "4px solid" : "6px solid"
                      }
                      outlineColor={
                        colorMode === "light"
                          ? "custom.theme.light.500"
                          : "custom.theme.dark.500"
                      }
                    />
                    <ModalBody>
                      <Flex mt="4" alignItems="center" justifyContent="center">
                        <Box bg="white" p="5px">
                          {typeof window !== "undefined" && (
                            <QRCode value={window.location.href} size={80} />
                          )}
                        </Box>
                      </Flex>
                    </ModalBody>
                    <ModalFooter>
                      <Text fontSize="12px" fontWeight={400} color="#000">
                        {getMessage({
                          ja: "スマホで読み込む事でこのページにアクセスできます",
                          us: "You can access this page by loading it with your phone",
                          cn: "您可以通过手机阅读本页面",
                        })}
                      </Text>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Center>
              <Center>
                <CustomSwitchColorModeButton />
              </Center>
              <Center w="54px">
                <Box
                  onClick={() =>
                    session?.user ? signOut() : setLoginModalOpen(true)
                  }
                  cursor="pointer"
                >
                  <CustomAvatar
                    src={currentUserPictureUrl ?? undefined}
                    boxSize="34px"
                  />
                </Box>
              </Center>
            </Flex>
          </VStack>
        </header>
      </div>
      {/* 告知モーダル */}
      <Modal isOpen={isAlertModalOpen} onClose={() => setAlertModalOpen(false)}>
        <ModalOverlay />
        <ModalContent
          overflow="hidden"
          bg={
            colorMode === "light"
              ? "rgba(240, 228, 218, 0.8)"
              : "rgba(51, 51, 51, 0.8)"
          }
          backdropFilter="blur(10px)"
          style={{
            WebkitBackdropFilter: "blur(10px)", // Safari対応
          }}
        >
          <Box
            p={0} // パディングを設定
            filter={colorMode === "light" ? "" : "invert(1)"} // 白黒を入れ替えるフィルターを適用
          >
            <ModalHeader></ModalHeader>
            <ModalBody py={0} px={3}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center" // 垂直方向の中央寄せ
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="550px"
                  height="550px"
                  position="relative"
                >
                  <svg
                    width="400"
                    height="400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="70.9 170 115 115"
                    style={{ transform: "scale(1.9) rotate(18deg)" }}
                  >
                    <path
                      d="m 100.75502,265.1916 c -2.16308,-1.10542 -3.495995,-3.10693 -5.129849,-7.703 -2.17034,-6.10521 -2.672624,-6.82025 -7.240335,-10.30721 -3.464822,-2.645 -4.955033,-4.20358 -5.725751,-5.98841 -0.901572,-2.08788 -0.788166,-3.52146 0.711847,-8.99849 0.808263,-2.95123 1.304931,-5.26354 1.32251,-6.15715 0.01682,-0.85486 -0.517511,-3.34681 -1.327075,-6.18909 -2.368648,-8.3161 -1.878074,-9.82593 4.926281,-15.16153 2.325605,-1.82361 4.222617,-3.52557 4.711482,-4.22705 0.511028,-0.73327 1.468359,-2.89591 2.549152,-5.75859 2.005777,-5.3127 2.756667,-6.53915 4.713278,-7.69833 1.67262,-0.99096 3.79434,-1.37594 8.15213,-1.47923 5.74494,-0.13618 6.57159,-0.41942 11.91598,-4.08295 6.46761,-4.43348 8.51988,-4.39608 15.33151,0.27939 4.72345,3.24215 6.09207,3.70486 11.27986,3.8136 8.79102,0.18428 10.44075,1.29311 13.11462,8.81477 2.17033,6.1052 2.67262,6.82025 7.24033,10.3072 3.46482,2.64502 4.95503,4.20359 5.72574,5.98843 0.90158,2.08787 0.78817,3.52145 -0.71184,8.99847 -0.80826,2.95124 -1.30493,5.26355 -1.32251,6.15716 -0.0168,0.85485 0.51751,3.3468 1.32707,6.18909 2.36616,8.3073 1.87387,9.80901 -4.98223,15.19816 -2.27387,1.78734 -4.17056,3.49455 -4.65552,4.19042 -0.51103,0.73328 -1.46836,2.89592 -2.54915,5.75859 -2.00578,5.31269 -2.75667,6.53914 -4.71328,7.69834 -1.67262,0.99094 -3.79434,1.37594 -8.15213,1.47922 -5.74075,0.13607 -6.57387,0.42099 -11.89289,4.06712 -6.52163,4.47051 -8.52093,4.43654 -15.35547,-0.26092 -4.76078,-3.27214 -6.01383,-3.68538 -11.68428,-3.85324 -4.01838,-0.11896 -6.35848,-0.45078 -7.57947,-1.07475 z"
                      fill="#222"
                      stroke="#000"
                      stroke-width="0.3"
                    />
                  </svg>
                  <svg
                    width="400"
                    height="400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="70.9 170 115 115"
                    style={{
                      position: "absolute",
                      transform: "scale(1.8) rotate(18deg)",
                    }}
                  >
                    <path
                      d="m 100.75502,265.1916 c -2.16308,-1.10542 -3.495995,-3.10693 -5.129849,-7.703 -2.17034,-6.10521 -2.672624,-6.82025 -7.240335,-10.30721 -3.464822,-2.645 -4.955033,-4.20358 -5.725751,-5.98841 -0.901572,-2.08788 -0.788166,-3.52146 0.711847,-8.99849 0.808263,-2.95123 1.304931,-5.26354 1.32251,-6.15715 0.01682,-0.85486 -0.517511,-3.34681 -1.327075,-6.18909 -2.368648,-8.3161 -1.878074,-9.82593 4.926281,-15.16153 2.325605,-1.82361 4.222617,-3.52557 4.711482,-4.22705 0.511028,-0.73327 1.468359,-2.89591 2.549152,-5.75859 2.005777,-5.3127 2.756667,-6.53915 4.713278,-7.69833 1.67262,-0.99096 3.79434,-1.37594 8.15213,-1.47923 5.74494,-0.13618 6.57159,-0.41942 11.91598,-4.08295 6.46761,-4.43348 8.51988,-4.39608 15.33151,0.27939 4.72345,3.24215 6.09207,3.70486 11.27986,3.8136 8.79102,0.18428 10.44075,1.29311 13.11462,8.81477 2.17033,6.1052 2.67262,6.82025 7.24033,10.3072 3.46482,2.64502 4.95503,4.20359 5.72574,5.98843 0.90158,2.08787 0.78817,3.52145 -0.71184,8.99847 -0.80826,2.95124 -1.30493,5.26355 -1.32251,6.15716 -0.0168,0.85485 0.51751,3.3468 1.32707,6.18909 2.36616,8.3073 1.87387,9.80901 -4.98223,15.19816 -2.27387,1.78734 -4.17056,3.49455 -4.65552,4.19042 -0.51103,0.73328 -1.46836,2.89592 -2.54915,5.75859 -2.00578,5.31269 -2.75667,6.53914 -4.71328,7.69834 -1.67262,0.99094 -3.79434,1.37594 -8.15213,1.47922 -5.74075,0.13607 -6.57387,0.42099 -11.89289,4.06712 -6.52163,4.47051 -8.52093,4.43654 -15.35547,-0.26092 -4.76078,-3.27214 -6.01383,-3.68538 -11.68428,-3.85324 -4.01838,-0.11896 -6.35848,-0.45078 -7.57947,-1.07475 z"
                      fill="#82d9d0"
                      stroke="#000"
                      stroke-width="0.3"
                    />
                  </svg>
                  <svg
                    width="400"
                    height="400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="70.9 170 115 115"
                    style={{
                      position: "absolute",
                      transform: "scale(1.74) rotate(18deg)",
                    }}
                  >
                    <path
                      d="m 100.75502,265.1916 c -2.16308,-1.10542 -3.495995,-3.10693 -5.129849,-7.703 -2.17034,-6.10521 -2.672624,-6.82025 -7.240335,-10.30721 -3.464822,-2.645 -4.955033,-4.20358 -5.725751,-5.98841 -0.901572,-2.08788 -0.788166,-3.52146 0.711847,-8.99849 0.808263,-2.95123 1.304931,-5.26354 1.32251,-6.15715 0.01682,-0.85486 -0.517511,-3.34681 -1.327075,-6.18909 -2.368648,-8.3161 -1.878074,-9.82593 4.926281,-15.16153 2.325605,-1.82361 4.222617,-3.52557 4.711482,-4.22705 0.511028,-0.73327 1.468359,-2.89591 2.549152,-5.75859 2.005777,-5.3127 2.756667,-6.53915 4.713278,-7.69833 1.67262,-0.99096 3.79434,-1.37594 8.15213,-1.47923 5.74494,-0.13618 6.57159,-0.41942 11.91598,-4.08295 6.46761,-4.43348 8.51988,-4.39608 15.33151,0.27939 4.72345,3.24215 6.09207,3.70486 11.27986,3.8136 8.79102,0.18428 10.44075,1.29311 13.11462,8.81477 2.17033,6.1052 2.67262,6.82025 7.24033,10.3072 3.46482,2.64502 4.95503,4.20359 5.72574,5.98843 0.90158,2.08787 0.78817,3.52145 -0.71184,8.99847 -0.80826,2.95124 -1.30493,5.26355 -1.32251,6.15716 -0.0168,0.85485 0.51751,3.3468 1.32707,6.18909 2.36616,8.3073 1.87387,9.80901 -4.98223,15.19816 -2.27387,1.78734 -4.17056,3.49455 -4.65552,4.19042 -0.51103,0.73328 -1.46836,2.89592 -2.54915,5.75859 -2.00578,5.31269 -2.75667,6.53914 -4.71328,7.69834 -1.67262,0.99094 -3.79434,1.37594 -8.15213,1.47922 -5.74075,0.13607 -6.57387,0.42099 -11.89289,4.06712 -6.52163,4.47051 -8.52093,4.43654 -15.35547,-0.26092 -4.76078,-3.27214 -6.01383,-3.68538 -11.68428,-3.85324 -4.01838,-0.11896 -6.35848,-0.45078 -7.57947,-1.07475 z"
                      fill="#FF5833"
                      stroke="#000"
                      stroke-width="0.3"
                    />
                  </svg>
                  <svg
                    width="450"
                    height="500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="70.9 170 115 115"
                    style={{ position: "absolute" }}
                  >
                    <path
                      id="scaling-path2"
                      d="m 100.75502,265.1916 c -2.16308,-1.10542 -3.495995,-3.10693 -5.129849,-7.703 -2.17034,-6.10521 -2.672624,-6.82025 -7.240335,-10.30721 -3.464822,-2.645 -4.955033,-4.20358 -5.725751,-5.98841 -0.901572,-2.08788 -0.788166,-3.52146 0.711847,-8.99849 0.808263,-2.95123 1.304931,-5.26354 1.32251,-6.15715 0.01682,-0.85486 -0.517511,-3.34681 -1.327075,-6.18909 -2.368648,-8.3161 -1.878074,-9.82593 4.926281,-15.16153 2.325605,-1.82361 4.222617,-3.52557 4.711482,-4.22705 0.511028,-0.73327 1.468359,-2.89591 2.549152,-5.75859 2.005777,-5.3127 2.756667,-6.53915 4.713278,-7.69833 1.67262,-0.99096 3.79434,-1.37594 8.15213,-1.47923 5.74494,-0.13618 6.57159,-0.41942 11.91598,-4.08295 6.46761,-4.43348 8.51988,-4.39608 15.33151,0.27939 4.72345,3.24215 6.09207,3.70486 11.27986,3.8136 8.79102,0.18428 10.44075,1.29311 13.11462,8.81477 2.17033,6.1052 2.67262,6.82025 7.24033,10.3072 3.46482,2.64502 4.95503,4.20359 5.72574,5.98843 0.90158,2.08787 0.78817,3.52145 -0.71184,8.99847 -0.80826,2.95124 -1.30493,5.26355 -1.32251,6.15716 -0.0168,0.85485 0.51751,3.3468 1.32707,6.18909 2.36616,8.3073 1.87387,9.80901 -4.98223,15.19816 -2.27387,1.78734 -4.17056,3.49455 -4.65552,4.19042 -0.51103,0.73328 -1.46836,2.89592 -2.54915,5.75859 -2.00578,5.31269 -2.75667,6.53914 -4.71328,7.69834 -1.67262,0.99094 -3.79434,1.37594 -8.15213,1.47922 -5.74075,0.13607 -6.57387,0.42099 -11.89289,4.06712 -6.52163,4.47051 -8.52093,4.43654 -15.35547,-0.26092 -4.76078,-3.27214 -6.01383,-3.68538 -11.68428,-3.85324 -4.01838,-0.11896 -6.35848,-0.45078 -7.57947,-1.07475 z"
                      fill="#F2e9df"
                      stroke="#000"
                      strokeWidth="0.5"
                    />
                  </svg>
                  <AnimationImage
                    src="/images/illust/hippo/hippo_005_a.png"
                    width="110px"
                    top="30px"
                    right="70px"
                    rotate="20deg"
                    animation="nyoki 5s forwards"
                  />
                  <svg
                    width="450"
                    height="500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="70.9 170 115 115"
                    style={{ position: "absolute" }}
                  >
                    <path
                      id="scaling-path"
                      d="m 100.75502,265.1916 c -2.16308,-1.10542 -3.495995,-3.10693 -5.129849,-7.703 -2.17034,-6.10521 -2.672624,-6.82025 -7.240335,-10.30721 -3.464822,-2.645 -4.955033,-4.20358 -5.725751,-5.98841 -0.901572,-2.08788 -0.788166,-3.52146 0.711847,-8.99849 0.808263,-2.95123 1.304931,-5.26354 1.32251,-6.15715 0.01682,-0.85486 -0.517511,-3.34681 -1.327075,-6.18909 -2.368648,-8.3161 -1.878074,-9.82593 4.926281,-15.16153 2.325605,-1.82361 4.222617,-3.52557 4.711482,-4.22705 0.511028,-0.73327 1.468359,-2.89591 2.549152,-5.75859 2.005777,-5.3127 2.756667,-6.53915 4.713278,-7.69833 1.67262,-0.99096 3.79434,-1.37594 8.15213,-1.47923 5.74494,-0.13618 6.57159,-0.41942 11.91598,-4.08295 6.46761,-4.43348 8.51988,-4.39608 15.33151,0.27939 4.72345,3.24215 6.09207,3.70486 11.27986,3.8136 8.79102,0.18428 10.44075,1.29311 13.11462,8.81477 2.17033,6.1052 2.67262,6.82025 7.24033,10.3072 3.46482,2.64502 4.95503,4.20359 5.72574,5.98843 0.90158,2.08787 0.78817,3.52145 -0.71184,8.99847 -0.80826,2.95124 -1.30493,5.26355 -1.32251,6.15716 -0.0168,0.85485 0.51751,3.3468 1.32707,6.18909 2.36616,8.3073 1.87387,9.80901 -4.98223,15.19816 -2.27387,1.78734 -4.17056,3.49455 -4.65552,4.19042 -0.51103,0.73328 -1.46836,2.89592 -2.54915,5.75859 -2.00578,5.31269 -2.75667,6.53914 -4.71328,7.69834 -1.67262,0.99094 -3.79434,1.37594 -8.15213,1.47922 -5.74075,0.13607 -6.57387,0.42099 -11.89289,4.06712 -6.52163,4.47051 -8.52093,4.43654 -15.35547,-0.26092 -4.76078,-3.27214 -6.01383,-3.68538 -11.68428,-3.85324 -4.01838,-0.11896 -6.35848,-0.45078 -7.57947,-1.07475 z"
                      fill="#946641"
                      stroke="#000"
                      strokeWidth="0.5"
                    />
                  </svg>
                  <Box
                    id="moving-hippo_017_a"
                    width="70px"
                    position="absolute"
                    top="0px"
                    left="0px"
                  >
                    <AnimationImage
                      src="/images/illust/hippo/hippo_017_a.png"
                      width="70px"
                      top="34px"
                      left="162px"
                      rotate="-18deg"
                      animation="nyoki_mole 5s forwards"
                    />
                  </Box>
                  <svg
                    id="rotating-svg"
                    width="450"
                    height="400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="70.9 170 115 115"
                    style={{ position: "absolute", zIndex: 101 }}
                  >
                    <path
                      id="rotating-path"
                      d="m 100.75502,265.1916 c -2.16308,-1.10542 -3.495995,-3.10693 -5.129849,-7.703 -2.17034,-6.10521 -2.672624,-6.82025 -7.240335,-10.30721 -3.464822,-2.645 -4.955033,-4.20358 -5.725751,-5.98841 -0.901572,-2.08788 -0.788166,-3.52146 0.711847,-8.99849 0.808263,-2.95123 1.304931,-5.26354 1.32251,-6.15715 0.01682,-0.85486 -0.517511,-3.34681 -1.327075,-6.18909 -2.368648,-8.3161 -1.878074,-9.82593 4.926281,-15.16153 2.325605,-1.82361 4.222617,-3.52557 4.711482,-4.22705 0.511028,-0.73327 1.468359,-2.89591 2.549152,-5.75859 2.005777,-5.3127 2.756667,-6.53915 4.713278,-7.69833 1.67262,-0.99096 3.79434,-1.37594 8.15213,-1.47923 5.74494,-0.13618 6.57159,-0.41942 11.91598,-4.08295 6.46761,-4.43348 8.51988,-4.39608 15.33151,0.27939 4.72345,3.24215 6.09207,3.70486 11.27986,3.8136 8.79102,0.18428 10.44075,1.29311 13.11462,8.81477 2.17033,6.1052 2.67262,6.82025 7.24033,10.3072 3.46482,2.64502 4.95503,4.20359 5.72574,5.98843 0.90158,2.08787 0.78817,3.52145 -0.71184,8.99847 -0.80826,2.95124 -1.30493,5.26355 -1.32251,6.15716 -0.0168,0.85485 0.51751,3.3468 1.32707,6.18909 2.36616,8.3073 1.87387,9.80901 -4.98223,15.19816 -2.27387,1.78734 -4.17056,3.49455 -4.65552,4.19042 -0.51103,0.73328 -1.46836,2.89592 -2.54915,5.75859 -2.00578,5.31269 -2.75667,6.53914 -4.71328,7.69834 -1.67262,0.99094 -3.79434,1.37594 -8.15213,1.47922 -5.74075,0.13607 -6.57387,0.42099 -11.89289,4.06712 -6.52163,4.47051 -8.52093,4.43654 -15.35547,-0.26092 -4.76078,-3.27214 -6.01383,-3.68538 -11.68428,-3.85324 -4.01838,-0.11896 -6.35848,-0.45078 -7.57947,-1.07475 z"
                      // fill="#FFF"
                      fill="#ddd"
                      stroke="#000"
                      stroke-width="3"
                    ></path>
                  </svg>
                  <AnimationImage
                    src="/images/illust/hippo/hippo_020.svg"
                    width="152px"
                    bottom="0px"
                    animation="nyoki_rabit 5s forwards, moveAndRotate 5s infinite 5s"
                  />
                  <AnimationImage
                    src="/images/illust/hippo/hippo_008.png"
                    width="32px"
                    left="80px"
                    bottom="73px"
                    animation="nyoki_rabit 5s forwards, rabitJump 10s infinite 7s"
                  />
                  <Box
                    position="fixed"
                    zIndex={100}
                    top="0"
                    left="0"
                    bg="#111"
                    w="100%"
                    h="100%"
                    style={{
                      animation: "feedOut 2s forwards",
                    }}
                  />
                  <style jsx>{`
                    @keyframes feedOut {
                      0% {
                        opacity: 0.9;
                      }
                      80% {
                        opacity: 0.8;
                      }
                      100% {
                        opacity: 0;
                        display: none;
                      }
                    }
                  `}</style>
                  <Box
                    position="absolute"
                    zIndex={101}
                    textAlign="center"
                    m={0}
                    p={0}
                    top="90px"
                  >
                    <SunderText colorMode={colorMode} text="更新内容" />
                    <Text
                      fontSize="md"
                      fontWeight="400"
                      color={colorMode === "light" ? "#000" : "#000"}
                      mt={-3}
                      mb={1}
                      display="inline-block"
                    >
                      ・3/10 チャット内容を分類
                      <br />
                      ・3/13 チャット追加機能の追加
                      <br />
                      ・3/20 開発メンバーの状態表示を追加
                      <br />
                      <br />
                      ・5/8 注文システムの公開
                      <br />
                      ・5/8 タイピングをアプリ一覧に移動
                      <br />
                      ・5/18 より現代的なフォルダ構成に変更
                    </Text>
                  </Box>
                </Box>
                <Text
                  fontSize="sm"
                  color={colorMode === "light" ? "#000" : "#FFF"}
                  p={1}
                  mt={6}
                  mb={0}
                  fontWeight={400}
                >
                  このサイトが停止した場合の連絡はLINEまたはメールでお願いします。
                  ファイルのやり取りが難しくなりますが、その時に考えます。
                </Text>
                <Text
                  fontSize="sm"
                  color={colorMode === "light" ? "#000" : "#FFF"}
                  p={1}
                  mb={0.5}
                  fontWeight={400}
                >
                  {/* 2026年初旬の再開を予定しています。 */}
                  {/* 再開時期は未定です */}
                </Text>
                <Box as="span" fontSize="sm" fontWeight={400} zIndex={100}>
                  <Box display="flex" alignItems="center">
                    <IoIosMail
                      style={{
                        marginTop: "3px",
                        marginRight: "2px",
                        fontSize: "19px",
                      }}
                      color="gray"
                    />
                    teppy422@au.com
                    <FaLine
                      style={{
                        marginTop: "4px",
                        marginLeft: "10px",
                        marginRight: "3px",
                        fontSize: "16px",
                      }}
                      color="gray"
                    />
                    teppy0422
                  </Box>
                </Box>
                <Box
                  as="button"
                  onClick={() => setAlertModalOpen(false)} // モーダルを閉じる関数を呼び出す
                  position="absolute"
                  bottom="0"
                  _focus={{ boxShadow: "none" }}
                  fontFamily="Dela Gothic One"
                  color="#82d9d0"
                  // color="transparent"
                  bg="#211c1c"
                  fontSize="18px"
                  // borderTop="solid 1px #000"
                  cursor="pointer"
                  overflow="hidden" // ボックスからはみ出さないようにする
                  w="100%"
                >
                  <ScrollText colorMode={colorMode} text="CLOSE&nbsp;" />
                </Box>
                <AnimationImage
                  src="/images/illust/hippo/hippo_a001_lyingDown.png"
                  width="92px"
                  right="2px"
                  bottom="24px"
                  animation="dropBounce 5s forwards"
                />
              </Box>
            </ModalBody>
            <ModalFooter>
              {/* <Button colorScheme="blue" onClick={() => setAlertModalOpen(false)}>
              閉じる
            </Button> */}
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
      {/* ログインモーダル */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)}>
        <ModalOverlay />
        <ModalContent
          bg={
            colorMode === "light"
              ? "custom.theme.light.500"
              : "custom.theme.dark.500"
          }
          borderColor={
            colorMode === "light"
              ? "custom.theme.light.100"
              : "custom.theme.light.100"
          }
          borderWidth="0.5px"
          px={0}
        >
          <CustomModalCloseButton
            colorMode={colorMode}
            onClose={() => setLoginModalOpen(false)}
            outline={colorMode === "light" ? "4px solid" : "6px solid"}
            outlineColor={
              colorMode === "light"
                ? "custom.theme.light.500"
                : "custom.theme.dark.500"
            }
            top="-4px"
            right="-4px"
          />
          <ModalBody
            mb={2}
            bg={
              colorMode === "light"
                ? "custom.theme.light.500"
                : "custom.theme.dark.500"
            }
          >
            <Auth
              userData={{
                userName: currentUserName,
                userCompany: currentUserCompany,
                pictureUrl: currentUserPictureUrl,
                userMainCompany: currentUserMainCompany,
                userEmail: currentUserEmail,
                created_at: currentUserCreatedAt,
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose}>
        <DrawerOverlay zIndex={1100}>
          <DrawerContent
            w={["75%", "100%", "100%"]}
            maxW="200px"
            bg={
              colorMode === "light"
                ? "rgba(240, 228, 218, 0.8)"
                : "rgba(51, 51, 51, 0.8)"
            }
            backdropFilter="blur(10px)"
            style={{
              WebkitBackdropFilter: "blur(10px)", // Safari対応
            }}
          >
            <DrawerHeader color={colorMode === "light" ? "#000" : "#FFF"}>
              MENU
            </DrawerHeader>
            <Divider borderColor={colorMode === "light" ? "#a69689" : "#fff"} />
            <DrawerBody>
              <Sidebar isDrawer={true} />
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
    // const response = await fetch(
    //   "https://www.jma.go.jp/bosai/forecast/data/forecast/360000.json"
    // );
    // const data = await response.json();

    // 天気情報を解析して適切なアイコンを選択
    // const weather = data[0].timeSeries[0].areas[0].weathers[0];
    const weather = "晴";
    if (weather.includes("くもり") && weather.includes("雨")) {
      return <WiRainMix />; // 雨のちくもりのアイコン
    } else if (weather.includes("雨")) {
      return <BsCloudRain />;
    } else if (weather.includes("くもり")) {
      return <BsCloud />;
    } else if (weather.includes("晴")) {
      return <FaSun />;
    } else {
      return <FaSun />; // デフォルトのアイコン
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return <FaSun />; // エラー時のデフォルトアイコン
  }
};
