"use client";

import React from "react";
import Content from "../../../../components/content";
import Link from "next/link";
import {
  Image,
  Text,
  Box,
  SimpleGrid,
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils"; // FocusableElement をインポート
import { SiSemanticuireact } from "react-icons/si";
import { MdSettings, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import NextImage from "next/image";
import { FileSystemNode } from "../../../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import { SjpIcon } from "../../../../components/icons";
import styles from "@/styles/home.module.scss";

import Hippo_001_wrap from "../../../../components/3d/hippo_001_wrap";

import CustomLinkBox from "../../../../components/customLinkBox";
import CustomPopver from "../../../../components/popver";
import Sidebar from "../../../../components/sidebar";

import { useUserContext } from "@/contexts/useUserContext";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "../../../../components/getMessage";

export default function About() {
  const { colorMode } = useColorMode();
  const { currentUserId, currentUserName } = useUserContext();
  const { language, setLanguage } = useLanguage();
  return (
    <>
      <Sidebar isDrawer={false} />
      <Content isCustomHeader={true}>
        <div
          className={styles.me}
          style={{ paddingTop: "10px", fontFamily: "Noto Sans JP" }}
        >
          <Box textAlign="center" mb={8}>
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <SjpIcon
                size={48}
                title="Sjp+"
                color={colorMode === "light" ? "#000" : "#FFF"}
              />
              <Text fontSize="2xl" mb={2} fontWeight={600}>
                {getMessage({
                  ja: "その他のライブラリ",
                  us: "Other Libraries",
                  cn: "其他图书馆",
                  language,
                })}
              </Text>
            </HStack>
            <Box fontSize="lg" fontWeight={400}>
              {getMessage({
                ja: "以下からダウンロードしてください",
                us: "Please download below",
                cn: "请在下方下载",
                language,
              })}
            </Box>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
            spacing={5}
            mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
          >
            <CustomLinkBox
              dateTime="2024-12-01T17:04:00+0900"
              description1={getMessage({
                ja: "Officeの参照設定で参照不可になる",
                us: `'Office's reference setting makes it unreferenced.`,
                cn: "办公室参考设置使其没有参考。",
                language,
              })}
              description2={getMessage({
                ja: "このファイルを任意の場所に保存する",
                us: "Save this file to any location.",
                cn: "将此文件保存在任何位置。",
                language,
              })}
              descriptionIN=""
              linkHref="/download/Library_/MSCOMM32.OCX"
              inCharge=""
              isLatest={true}
              userName={currentUserName ?? ""}
            />
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
