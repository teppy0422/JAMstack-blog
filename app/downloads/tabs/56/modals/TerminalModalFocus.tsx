"use client";

import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";
import {
  Box,
  Image,
  useDisclosure,
  Flex,
  Text,
  Spacer,
  OrderedList,
  ListItem,
  Grid,
} from "@chakra-ui/react";

import IpadFrame from "@/components/ipad";
import CustomModalTab from "../../../parts/CustomModalTab";
import CustomModal from "@/components/ui/CustomModal";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import ImageWithHighlight from "@/components/ImageWidthHighlight";

import { SectionHeader } from "./ui";

export function TerminalModalFocus() {
  const { language } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CustomModalTab
        path="/"
        text="端末からの経路"
        media="html"
        onOpen={onOpen}
      />
      <CustomModal
        title={getMessage({
          ja: "端末からの経路ページへのアクセス方法",
          us: "How to access the Configuration No. page",
          cn: "如何访问配置编号页面",
          language,
        })}
        isOpen={isOpen}
        onClose={onClose}
        modalSize="xl"
        macCloseButtonHandlers={[onClose]}
        marginTop="140px"
        footer={<></>}
      >
        <Flex
          direction="column"
          bg="custom.system.700"
          gap={4}
          p={4}
          overflowY="auto"
          maxHeight="600px"
        >
          <SectionHeader
            title={
              "⚫︎" +
              getMessage({
                ja: "タッチパネル/マウス",
                us: "Click and hold to use the following functions",
                cn: "点击并按住可使用以下功能",
                language,
              })
            }
          >
            <Box>
              <Text>1.画面上の端末Noをタップ/クリック</Text>
              <ImageWithHighlight
                src="/images/56/wireZoom.webp"
                label=""
                mb={0}
                highlights={[
                  {
                    top: "19%",
                    left: "89%",
                    w: "3%",
                    h: "7%",
                    label: "タップ",
                    labelTop: "-400%",
                    labelLeft: "50%",
                    bg: "rgba(255,0,0,0.1)",
                    borderRadius: "4px",
                    animation: "blink",
                  },
                  {
                    top: "10%",
                    left: "49.5%",
                    w: "3.8%",
                    h: "8%",
                    label: "タップ",
                    labelTop: "50%",
                    labelLeft: "240%",
                    bg: "rgba(255,0,0,0.1)",
                    borderRadius: "4px",
                    animation: "blink",
                  },
                ]}
              />
            </Box>
            <Box>
              <Text>2.ここをタップ/クリック</Text>
              <Box w="200px">
                <ImageWithHighlight
                  src="/images/56/terminal.webp"
                  label=""
                  mb={0}
                  highlights={[
                    {
                      top: "3.1%",
                      left: "71.5%",
                      w: "29%",
                      h: "8%",
                      label: "タップ",
                      labelTop: "50%",
                      labelLeft: "150%",
                      bg: "rgba(255,0,0,0.1)",
                      borderRadius: "5px",
                      animation: "blink",
                    },
                  ]}
                />
              </Box>
            </Box>
          </SectionHeader>
          <SectionHeader
            title={
              "⚫︎" +
              getMessage({
                ja: "QRリーダー",
                us: "Click and hold to use the following functions",
                cn: "点击并按住可使用以下功能",
                language,
              })
            }
          >
            <Box>
              <Text>1.モード切り替えQRを読み込む</Text>
              <Box />
            </Box>
            <Box>
              <Text>2.端末QRシールを読み込む</Text>
              <Box w="200px">
                <ImageWithHighlight
                  src="/images/56/qrSealon.webp"
                  label=""
                  mb={0}
                  highlights={[
                    {
                      top: "18.5%",
                      left: "9.5%",
                      w: "16%",
                      h: "16%",
                      label: "読み込む",
                      labelTop: "50%",
                      labelLeft: "200%",
                      bg: "rgba(255,0,0,0.1)",
                      borderRadius: "full",
                      animation: "blink",
                    },
                  ]}
                />
              </Box>
            </Box>
            <Text w="60%" fontSize="12px" textAlign="center">
              ※端末QRシールは生産準備+から出力したデータをTEPRAで印刷する事で簡単に作成可能です。
            </Text>
          </SectionHeader>
          <SectionHeader
            title={
              "⚫︎" +
              getMessage({
                ja: "キーボード",
                us: "Click and hold to use the following functions",
                cn: "点击并按住可使用以下功能",
                language,
              })
            }
          >
            <Box>
              <Text>
                端末ナンバーの末尾に-を追加して入力 ※端末⑦の場合は[7-]
              </Text>
              <Box h="110px" overflow="hidden">
                <ImageWithHighlight
                  src="/images/56/accessComp01.webp"
                  label=""
                  highlights={[
                    {
                      top: "0.3%",
                      left: "81.5%",
                      w: "12.5%",
                      h: "4.5%",
                      label: "入力",
                      labelTop: "50%",
                      labelLeft: "50%",
                      bg: "repeating-linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 4px, transparent 4px, transparent 6px)",
                      borderRadius: "5px",
                      animation: "blink",
                    },
                  ]}
                />
              </Box>
            </Box>
          </SectionHeader>
        </Flex>
      </CustomModal>
    </>
  );
}
export default TerminalModalFocus;
