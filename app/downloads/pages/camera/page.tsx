"use client";

import React from "react";
import Content from "@/components/content";
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
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート
import { SiSemanticuireact } from "react-icons/si";
import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import NextImage from "next/image";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import { FaCameraRetro } from "react-icons/fa";
import { SjpIcon } from "@/components/icons";
import styles from "@/styles/home.module.scss";

import CustomLinkBox from "../../parts/customLinkBox";
import CustomPopver from "@/components/ui/popver";
import Sidebar from "@/components/sidebar";

import { useUserContext } from "@/contexts/useUserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

export default function About() {
  const { colorMode } = useColorMode();
  const { currentUserId, currentUserName } = useUserContext();
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <Sidebar isDrawer={false} />
      <Content>
        <div
          className={styles.me}
          style={{ paddingTop: "10px", fontFamily: "Noto Sans JP" }}
        >
          <Box textAlign="center" mb={8}>
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <FaCameraRetro size={24} />
              <Text fontSize="2xl" mb={2} fontWeight={600}>
                CAMERA+
              </Text>
            </HStack>
            <Box fontSize="lg" fontWeight={400}>
              {getMessage({
                ja: "通常は生産準備+がインストールを行うので必要ありません",
                us: "Usually not necessary as Production Preparation+ does the installation",
                cn: "通常不需要，因为 Production Readiness+ 会进行安装。",
              })}
              <br />
              {getMessage({
                ja: "編集が必要な場合にダウンロードしてください",
                us: "Download if you need to edit",
                cn: "如果需要编辑，请下载。",
              })}
              <br />
              {getMessage({
                ja: "ダウンロードしたファイルは展開(解凍)してから開いてください",
                us: "Please extract (unzip) the downloaded file before opening it.",
                cn: "打开下载文件前，请先解压缩。",
              })}
              <br />

              {getMessage({
                ja: "編集する際はVisualStudioで.solを開いてください",
                us: "Please open the .sol file in VisualStudio for editing",
                cn: "要编辑，请在 VisualStudio 中打开 .sol",
              })}
            </Box>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
            spacing={5}
            mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
          >
            <CustomLinkBox
              dateTime="2020-12-09T21:56:00+0900"
              description1="撮影環境が異なる場合、コネクタ写真の色が異なる。コネクタ写真の登録が面倒"
              description2="撮影するとコネクタ品番を付けて写真を生産準備+に渡す"
              descriptionIN=""
              linkHref="/download/Camera/camera1.0.0.4_.zip"
              inCharge="徳島,補給品,Win10zip"
              isLatest={true}
              userName={currentUserName ?? ""}
            />
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
