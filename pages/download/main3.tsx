import React from "react";
import Content from "../../components/content";
import Link from "next/link";
import {
  Image,
  Text,
  Box,
  SimpleGrid,
  Badge,
  Kbd,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useColorMode,
  HStack,
} from "@chakra-ui/react";

import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート

import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import { JdssIcon } from "../../components/icons";
import NextImage from "next/image";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート

import styles from "../../styles/home.module.scss";

import CustomLinkBox from "../../components/customLinkBox";
import CustomPopver from "../../components/popver";
import Sidebar from "../../components/sidebar"; // Sidebar コンポーネントをインポート

export default function About() {
  const { colorMode } = useColorMode();
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <div
          className={styles.me}
          style={{ paddingTop: "10px", fontFamily: "Noto Sans JP" }}
        >
          <Box textAlign="center" mb={8}>
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <JdssIcon
                size={48}
                title="JDSS+"
                color={colorMode === "light" ? "#800080" : "#FFF"} // カラーモードに応じて色を設定
              />
              <Text fontSize="2xl">順立生産システム+</Text>
            </HStack>
            <Text fontSize="sm" mb={2}>
              main3.CB/PLC
            </Text>
            <Box fontSize="lg">
              以下からダウンロードしてください
              <br />
              ダウンロードした.zipは必ず展開(解凍)してください
              <br />
              ファイルを閲覧するにはOMRONのCX-Programmerが必要です
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="auto"
                mt={2}
              ></Box>
            </Box>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
            spacing={5}
            mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
          >
            <CustomLinkBox
              dateTime="2024-03-13T00:35:00+0900"
              description1=""
              description2="内部タイマーの調整"
              descriptionIN=""
              linkHref="/files/download/Jdss/main3_17.zip"
              inCharge="徳島,Win10zip"
              isLatest={true}
            />
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
