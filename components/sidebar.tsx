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
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HamburgerIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

function Sidebar() {
  const [currentPath, setCurrentPath] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const buttonStyle = (path) => ({
    p: "2",
    w: "full",
    _hover: { bg: "gray.300" },
    colorScheme: currentPath === path ? "red" : "gray", // 現在のパスと一致する場合は赤色テーマ、そうでなければ灰色テーマ
  });

  return (
    <>
      <Box
        display={{ base: "none", md: "block" }}
        position="fixed"
        w={["100px", "100px", "150px", "200px"]}
        h="100vh"
        bg="white.200"
        p="5"
        top="0"
        left="0"
        textAlign="left"
      >
        <VStack spacing="4" align="stretch">
          <Box height="66px"></Box>
          <NextLink href="/directoryLayout" passHref legacyBehavior>
            <Button {...buttonStyle("/directoryLayout")}>
              ディレクトリ構成
            </Button>
          </NextLink>
          <NextLink href="/download" passHref legacyBehavior>
            <Button {...buttonStyle("/download")}>ダウンロード</Button>
          </NextLink>
          <NextLink href="/BBS" passHref legacyBehavior>
            <Button {...buttonStyle("/BBS")}>不具合報告</Button>
          </NextLink>
        </VStack>
      </Box>

      <IconButton
        display={{ base: "block", md: "none" }}
        icon={<HamburgerIcon />}
        aria-label="Open Menu"
        onClick={onOpen}
        position="fixed"
        top="4em"
        left="10px"
        zIndex="1000" // アイコンが他の要素の後ろに隠れないようにする
        opacity="0.85"
      />

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>メニュー</DrawerHeader>
            <DrawerBody>
              <VStack spacing="4" align="stretch">
                <NextLink href="/directoryLayout" passHref legacyBehavior>
                  <Button
                    {...buttonStyle("/directoryLayout")}
                    onClick={onClose}
                  >
                    ディレクトリ構成
                  </Button>
                </NextLink>
                <NextLink href="/download" passHref legacyBehavior>
                  <Button {...buttonStyle("/download")} onClick={onClose}>
                    ダウンロード
                  </Button>
                </NextLink>
                <NextLink href="/BBS" passHref legacyBehavior>
                  <Button {...buttonStyle("/BBS")} onClick={onClose}>
                    不具合報告
                  </Button>
                </NextLink>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}

export default Sidebar;
