"use client";

import React from "react";
import Content from "../../../../components/content";
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
import { FileSystemNode } from "../../../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import { SjpIcon } from "../../../../components/icons";
import styles from "@/styles/home.module.scss";

import CustomLinkBox from "../../../../components/customLinkBox";
import CustomPopver from "../../../../components/popver";
import Sidebar from "../../../../components/sidebar"; // Sidebar コンポーネントをインポート

import { useUserContext } from "../../../../context/useUserContext";
import { useLanguage } from "../../../../context/LanguageContext";
import getMessage from "../../../../components/getMessage";

function TransitionExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<FocusableElement>(null); // 型を明示的に指定
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <Box onClick={onOpen} cursor="pointer">
        <MdHelpOutline />
      </Box>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>
            {getMessage({
              ja: "アップロードの手順",
              us: "Upload Procedure",
              cn: "上传程序",
              language,
            })}
          </AlertDialogHeader>
          <AlertDialogCloseButton _focus={{ boxShadow: "none" }} />
          <AlertDialogBody p={4}>
            <Box
              fontFamily={getMessage({
                ja: "Noto Sans JP",
                us: "Noto Sans,Noto Sans JP",
                cn: "Noto Sans SC,Noto Sans JP",
                language,
              })}
              fontWeight={400}
            >
              <Box as="p" textAlign="center" mb={4}>
                {"1." +
                  getMessage({
                    ja: "ダウンロードしたエクセルブックを開く",
                    us: "Open the downloaded Excel book.",
                    cn: "打开下载的 Excel 电子书。",
                    language,
                  })}
                <br />
                {"2." +
                  getMessage({
                    ja: "[Ver]のVerupを押す",
                    us: "Press Verup under [Ver]",
                    cn: "按 [Ver] 中的 Verup",
                    language,
                  })}
                <br />
                {"3." +
                  getMessage({
                    ja: "",
                    us: "Click [このVerのアップロード] while holding down ",
                    cn: "按住 ",
                    language,
                  })}
                <span>
                  <Kbd>Shift</Kbd>
                </span>
                {getMessage({
                  ja: "を押しながら[このVerのアップロード]をクリック",
                  us: "",
                  cn: " 单击 [上传此 Ver]",
                  language,
                })}
              </Box>
              <Box as="p" textAlign="center" mb={1}>
                {getMessage({
                  ja: "以上で全ての部材一覧+からこのバージョンへの更新が可能になります",
                  us: "This is all you need to do to update from Parts List+ to this version!",
                  cn: "这将使所有物料清单+ 更新到该版本",
                  language,
                })}
              </Box>
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="red" ml={3} onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

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
                color={colorMode === "light" ? "#81d8d0" : "#FFF"} // カラーモードに応じて色を設定
              />
              <Text fontSize="2xl" mb={2} fontWeight={600}>
                {getMessage({
                  ja: "部材一覧+",
                  language,
                })}
              </Text>
            </HStack>
            <Box fontSize="lg" fontWeight={400}>
              {getMessage({
                ja: "以下からダウンロードしてください",
                us: "Please download below",
                cn: "请在下方下载。",
                language,
              })}
              <br />
              {getMessage({
                ja: "通常は最新版",
                us: "Usually select the latest version ",
                cn: "通常选择最新版本 ",
                language,
              })}
              <Badge colorScheme="teal" margin={1}>
                LATEST
              </Badge>
              {getMessage({
                ja: "を選択します",
                us: ".",
                cn: "。",
                language,
              })}
              <br />
              {getMessage({
                ja: "最新版には以前の更新が全て含まれています",
                us: "The latest version includes all previous updates",
                cn: "最新版本包括之前的所有更新",
                language,
              })}
              <br />
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="auto"
                mt={2}
              >
                <Box fontSize="sm" mr={1}>
                  {getMessage({
                    ja: "アップロードの手順",
                    us: "Upload Procedure",
                    cn: "上传程序",
                    language,
                  })}
                </Box>
                <TransitionExample />
              </Box>
            </Box>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
            spacing={5}
            mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
          >
            <CustomLinkBox
              dateTime="2025-01-23T18:37:00+0900"
              description1=""
              description2={getMessage({
                ja: "製品品番の点数が146を超える場合に警告。新規アップロード",
                us: "Warning when the number of product part numbers exceeds 146. New Upload",
                cn: "如果产品部件号超过 146 个，则发出警告。新上传",
                language,
              })}
              descriptionIN=""
              linkHref="/download/bip/Bip2.200.15_.zip"
              inCharge="徳島"
              isLatest={true}
              userName={currentUserName ?? ""}
            />
          </SimpleGrid>
        </div>
      </Content>
    </>
  );
}
