"use client";

import React from "react";
import Content from "@/components/content";
import Link from "next/link";
import {
  Image,
  Text,
  Box,
  SimpleGrid,
  useColorMode,
  HStack,
} from "@chakra-ui/react";

import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート

import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import { JdssIcon } from "@/components/icons";
import NextImage from "next/image";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート

import styles from "@/styles/home.module.scss";

import CustomLinkBox from "../../parts/customLinkBox";
import CustomPopver from "@/components/ui/popver";
import Sidebar from "@/components/sidebar"; // Sidebar コンポーネントをインポート

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
              <JdssIcon
                size={48}
                title="JDSS+"
                color={colorMode === "light" ? "#800080" : "#FFF"} // カラーモードに応じて色を設定
              />
              <Text fontSize="2xl" fontWeight={600}>
                {getMessage({
                  ja: "順立生産システム+",
                })}
              </Text>
            </HStack>
            <Text fontSize="sm" mb={2} fontWeight={300}>
              main3.CB/PLC
            </Text>
            <Box fontSize="lg" fontWeight={400}>
              {getMessage({
                ja: "以下からダウンロードしてください",
                us: "Please download below",
                cn: "请在下方下载。",
              })}
              <br />
              {getMessage({
                ja: "ダウンロードした.zipは必ず展開(解凍)してください",
                us: "Be sure to extract (unzip) the .zip file you downloaded.",
                cn: "请务必解压缩下载的 .zip 文件。",
              })}
              <br />
              {getMessage({
                ja: "ファイルを閲覧するにはOMRONのCX-Programmerが必要です",
                us: `'OMRON's CX-Programmer is required to view the files`,
                cn: "需要使用 OMRON CX-Programmer 查看文件",
              })}
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
              description2={getMessage({
                ja: "内部タイマーの調整",
                us: "Adjustment of internal timer",
                cn: "调整内部计时器",
              })}
              descriptionIN=""
              linkHref="/download/Jdss/main3/main3_17.zip"
              inCharge="徳島,Win10zip"
              isLatest={true}
              userName={currentUserName ?? ""}
            />
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
