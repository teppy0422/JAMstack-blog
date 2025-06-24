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
} from "@chakra-ui/react";

import CustomModalTab from "../../../parts/CustomModalTab";
import CustomModal from "@/components/ui/CustomModal";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import ImageWithHighlight from "@/components/ImageWidthHighlight";

import { SectionHeader } from "./ui";

export function TerminalModal() {
  const { language } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CustomModalTab path="/" text="端末" media="html" onOpen={onOpen} />
      <CustomModal
        title={getMessage({
          ja: "端末ページへのアクセス方法",
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
              "⚫︎" + getMessage({ ja: "タッチパネル/クリック", language })
            }
          >
            <Box>
              <Text>
                {getMessage({
                  ja: "画面上の端末Noをタップ/クリック",
                  us: "Tap/click the device No. on the screen",
                  cn: "点击/单击屏幕上的设备编号。",
                  language,
                })}
              </Text>
              <ImageWithHighlight
                src="/images/56/wireZoom.webp"
                label=""
                mt={0}
                mb={0}
                highlights={[
                  {
                    top: "19%",
                    left: "89%",
                    w: "3%",
                    h: "7%",
                    label: getMessage({ ja: "タップ", language }),
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
                    label: getMessage({ ja: "タップ", language }),
                    labelTop: "50%",
                    labelLeft: "240%",
                    bg: "rgba(255,0,0,0.1)",
                    borderRadius: "4px",
                    animation: "blink",
                  },
                ]}
              />
            </Box>
          </SectionHeader>
          <SectionHeader
            title={
              "⚫︎" +
              getMessage({
                ja: "QRリーダー",
                us: "QR Reader",
                cn: "QR Reader",
                language,
              })
            }
          >
            <Box>
              <Text>
                {getMessage({
                  ja: "端末QRシールを読み込む",
                  us: "Read the terminal QR sticker",
                  cn: "阅读终端 QR 贴纸。",
                  language,
                })}
              </Text>
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
              {"※" +
                getMessage({
                  ja: "端末QRシールは生産準備+から出力したデータをTEPRAで印刷する事で簡単に作成可能です。",
                  us: "Terminal QR stickers can be easily created by printing data output from Production Preparation+ with TEPRA.",
                  cn: "通过在 TEPRA 上打印 Production Preparation+ 输出的数据，可以轻松创建终端 QR 贴纸。",
                  language,
                })}
            </Text>
          </SectionHeader>
          <SectionHeader
            title={"⚫︎" + getMessage({ ja: "キーボード", language })}
          >
            <Box>
              <Text>
                {getMessage({
                  ja: "端末ナンバーを入力",
                  us: "Enter terminal number",
                  cn: "输入终端编号。",
                  language,
                })}
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
export default TerminalModal;
