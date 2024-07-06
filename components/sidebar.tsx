import { Box, VStack, Link, MenuItem, Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

function Sidebar() {
  const [currentPath, setCurrentPath] = useState("");

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
    <Box
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
          <Button {...buttonStyle("/directoryLayout")}>ディレクトリ構成</Button>
        </NextLink>
        <NextLink href="/download" passHref legacyBehavior>
          <Button {...buttonStyle("/download")}>ダウンロード</Button>
        </NextLink>
        <NextLink href="/BBS" passHref legacyBehavior>
          <Button {...buttonStyle("/BBS")}>不具合報告</Button>
        </NextLink>
      </VStack>
    </Box>
  );
}

export default Sidebar;
