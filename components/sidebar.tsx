import {
  Box,
  VStack,
  Link,
  MenuItem,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  useColorMode,
  Divider,
  Flex,
  Image,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HamburgerIcon, ChevronRightIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useContext } from "react";
import { PiGithubLogoFill } from "react-icons/pi";
import { MdEditRoad } from "react-icons/md";
import { FaKeyboard, FaRoad } from "react-icons/fa";
import { IoTicketOutline, IoTicketSharp } from "react-icons/io5";
import { AiOutlineWechat } from "react-icons/ai";
import { IoApps } from "react-icons/io5";

import { useLanguage } from "../context/LanguageContext";
import getMessage from "../components/getMessage";
import { AnimationImage } from "../components/CustomImage";

function Sidebar({ isDrawer }: { isDrawer: boolean }) {
  const [currentPath, setCurrentPath] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const buttonStyle = (path) => ({
    p: "2",
    w: "full",
    _hover: { bg: "gray.900" },
    cursor: "pointer",
    colorScheme: currentPath === path ? "red" : "gray", // 現在のパスと一致する場合は赤色テーマ、そうでなければ灰色テーマ
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
          color={colorMode === "light" ? "black" : "white"}
        >
          {currentPath === `${path_}/` && (
            <ChevronRightIcon
              position="absolute"
              left="-10px"
              top="50%"
              transform="translateY(-50%)"
              color={colorMode === "light" ? "#000" : "#FFF"}
            />
          )}
          <Box
            as="span"
            position="relative"
            color={colorMode === "light" ? "#000" : "white"}
            _after={{
              content: '""',
              position: "absolute",
              width: "0",
              height: "1px",
              bottom: "-2px",
              left: "0",
              bg: "transparent",
              transition: "width 0.1s",
              color: colorMode === "light" ? "white" : "white",
            }}
          >
            <Flex alignItems="center" gap="4px">
              <Box
                as="span"
                px="3px"
                _hover={{
                  bg: colorMode === "light" ? "#fff" : "#0F0",
                  borderRadius: "5px",
                }}
              >
                {label}
              </Box>
              {icons_}
            </Flex>
          </Box>
        </Box>
      </NextLink>
    );
  };

  return (
    <>
      <Box
        display={{ base: isDrawer ? "block" : "none", xl: "block" }}
        position="fixed"
        w={["100px", "100px", "150px", "200px"]}
        h="100vh"
        bg="white.200"
        p="5"
        top="60px"
        left="0"
        textAlign="left"
        zIndex="1100"
        fontWeight={400}
      >
        <VStack spacing="1" fontSize={14} w="200px">
          {menuItem(
            "/roadMap",
            getMessage({
              ja: "ロードマップ",
              us: "Road Map",
              cn: "路线图",
              language,
            }),
            true,
            <FaRoad size={21} />
          )}
          {menuItem(
            "/skillBlogs/0000",
            getMessage({
              ja: "技術ブログ",
              us: "Skills Blog",
              cn: "技术博客",
              language,
            }),
            true,
            <>
              <Box position="relative" w="20px">
                <AnimationImage
                  src="/images/illust/hippo/hippo_016.svg"
                  width="20px"
                  sealSize="0"
                  left="0px"
                  bottom="-12px"
                />
              </Box>
            </>
          )}

          {menuItem(
            "/download",
            getMessage({
              ja: "ダウンロード",
              us: "Download",
              cn: "下载",
              language,
            }),
            true,
            <>
              <Box position="relative" w="24px">
                <AnimationImage
                  src="/images/illust/hippo/hippo_007_pixcel.png"
                  width="24px"
                  sealSize="0"
                  left="-4px"
                  bottom="-12px"
                />
              </Box>
            </>
          )}
          {menuItem(
            "/BBS",
            getMessage({
              ja: "問い合わせ",
              us: "Inquiry",
              cn: "询问",
              language,
            }),
            true,
            <AiOutlineWechat size={22} />
          )}
          {menuItem(
            "/appList",
            getMessage({
              ja: "WEBアプリ一覧",
              us: "List of WEB Apps",
              cn: "網路應用程式清單",
              language,
            }),
            true,
            <IoApps size={21} />
          )}
        </VStack>
      </Box>
      <IconButton
        display={{ base: "none", xl: "none" }}
        icon={<HamburgerIcon />}
        bg="white.1"
        aria-label="Open Menu"
        onClick={onOpen}
        position="fixed"
        top="60px"
        left="10px"
        zIndex="1101" // アイコンが他の要素の後ろに隠れないようにする
        opacity="0.85"
        borderColor={colorMode === "light" ? "black" : "white"}
        borderWidth="1px"
      />
    </>
  );
}

export default Sidebar;
