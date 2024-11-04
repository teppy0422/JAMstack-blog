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
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HamburgerIcon, ChevronRightIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

function Sidebar() {
  const [currentPath, setCurrentPath] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

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

  const menuItem = (path_, label, useColorMode) => {
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
          {currentPath === `${path_}/` && (
            <ChevronRightIcon
              position="absolute"
              left="-10px"
              top="50%"
              transform="translateY(-50%)"
              color="currentColor"
            />
          )}
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
            {label}
          </Box>
        </Box>
      </NextLink>
    );
  };

  return (
    <>
      <Box
        display={{ base: "none", xl: "block" }}
        position="fixed"
        w={["100px", "100px", "150px", "200px"]}
        h="100vh"
        bg="white.200"
        p="5"
        top="60px"
        left="0"
        textAlign="left"
        zIndex="1100"
      >
        <VStack spacing="2" align="stretch">
          {menuItem("/roadMap", "ロードマップ", true)}
          {menuItem("/objectLayout", "プログラム解説", true)}
          {menuItem("/app/typing", "タイピング練習", true)}
          {menuItem("/download", "ダウンロード", true)}
          {menuItem("/BBS", "問い合わせ", true)}
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
