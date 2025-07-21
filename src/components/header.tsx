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
  Spacer,
  HStack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { IoIosMail } from "react-icons/io";
import { FaLine } from "react-icons/fa6";
import { IoMoonOutline } from "react-icons/io5";
import StudioIcon from "/public/images/etc/studio.svg";

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

import Auth from "@/components/ui/Auth/Auth";
import { Global } from "@emotion/react";

import { useLanguage } from "../contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import Sidebar from "./sidebar";
import { CustomAvatar } from "./ui/CustomAvatar";
import { CustomModalCloseButton } from "./ui/CustomModalCloseButton";
import MacCloseButton from "./ui/MacCloseButton";
import { CustomSwitchColorModeButton } from "./ui/CustomSwitchButton";
import QrModal from "./modals/QrModal";

import { useUserContext } from "@/contexts/useUserContext";
import LiquidGlass from "@/components/LiquidGlass";
import { CustomModal } from "@/components/ui/CustomModal";

import "@fontsource/dela-gothic-one";
import VoiceDailyModal from "@/components/modals/VoiceDailyModal";

import AlertModal from "@/components/modals/Alert";
import { HippoFootPrintIcon, MenuIcon } from "@/components/ui/icons";

export default function Header() {
  const { language, setLanguage } = useLanguage();

  const { data: session } = useSession();
  const { colorMode } = useColorMode();
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
    currentUserIsEmailActive,
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

  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
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
          path.setAttribute("transform", `rotate(${angle} 250 250)`); // Set the correct center
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
  }, [isAlertModalOpen]);
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
  }, [isAlertModalOpen]);
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
  }, [isAlertModalOpen]);
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
  }, [isAlertModalOpen]);

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
      <Box
        className="no-print-page"
        style={{ zIndex: "2000", position: "relative" }}
      >
        <LiquidGlass colorMode={colorMode}>
          <Flex
            as="header"
            id="navTop"
            w="100%"
            maxW="100vw"
            h="42px"
            px={2}
            align="center"
            justify="space-between"
            position="relative"
            overflowX="hidden"
          >
            <HStack spacing={2}>
              <Box
                zIndex="1101"
                onClick={onMenuOpen}
                className={`${styles.snowTarget}`}
                borderRadius="6px"
                border="1px solid"
                borderColor={
                  colorMode === "light"
                    ? "custom.theme.light.900"
                    : "custom.theme.dark.200"
                }
                p="7px"
                cursor="pointer"
                _hover={{ opacity: "0.8", transform: "scale(1.1)" }}
              >
                <MenuIcon
                  size="16px"
                  fill={
                    colorMode === "light"
                      ? "custom.theme.light.900"
                      : "custom.theme.dark.200"
                  }
                />
              </Box>
            </HStack>

            <Box
              position="absolute"
              left="50%"
              transform="translateX(-50%)"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Box
                display={{ base: "none", sm: "block" }}
                sx={{ transform: "rotate(-18deg)" }}
                cursor="pointer"
                onClick={() => setAlertModalOpen(true)}
                _hover={{ transform: "scale(1.1)" }}
                transition="all 0.3s ease-in-out"
              >
                <HippoFootPrintIcon
                  size="32px"
                  fill={
                    colorMode === "light"
                      ? "custom.theme.light.900"
                      : "custom.theme.dark.100"
                  }
                />
              </Box>
              <Box display={{ base: "none", sm: "block" }}>
                <NextLink href="/" legacyBehavior>
                  <Link _focus={{ _focus: "none" }}>
                    <Box
                      justifyContent="center"
                      display="flex"
                      alignItems="center"
                      color={
                        colorMode === "light"
                          ? "custom.theme.light.900"
                          : "custom.theme.orange.400"
                      }
                      w="130px"
                      minW="36px"
                      mr="0"
                      ml="0"
                      bottom="4px"
                      _hover={{ opacity: "0.9", transform: "scale(1.1)" }}
                    >
                      <StudioIcon />
                    </Box>
                  </Link>
                </NextLink>
              </Box>
              <Center h="24px" maxH="24px">
                <QrModal />
              </Center>
            </Box>

            <HStack spacing={2}>
              <VoiceDailyModal currentUserName={currentUserName} />
              <CustomSwitchColorModeButton />
              <Box
                onClick={() =>
                  session?.user ? signOut() : setLoginModalOpen(true)
                }
                cursor="pointer"
                _hover={{ transform: "scale(1.1)" }}
              >
                <CustomAvatar
                  src={currentUserPictureUrl ?? undefined}
                  boxSize="34px"
                />
              </Box>
            </HStack>
          </Flex>
        </LiquidGlass>
      </Box>
      {/* 告知モーダル */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />

      {/* ログインモーダル */}
      <CustomModal
        title=""
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        modalSize="lg"
        macCloseButtonHandlers={[() => setLoginModalOpen(false)]}
        footer={<></>}
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
      </CustomModal>

      <Drawer isOpen={isMenuOpen} placement="left" onClose={onMenuClose}>
        <DrawerOverlay zIndex={2100}>
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
