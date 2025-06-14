"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Image,
  useDisclosure,
  Flex,
  Text,
  Spacer,
} from "@chakra-ui/react";

import CustomModalTab from "../../../parts/CustomModalTab";
import CustomModal from "@/components/ui/CustomModal";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import ImageWithHighlight from "@/components/ImageWidthHighlight";
import { SectionHeader } from "./ui";

export function CompositionModal() {
  const { language } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CustomModalTab path="/" text="電線の経路" media="html" onOpen={onOpen} />
      <CustomModal
        title={getMessage({
          ja: "構成Noページへのアクセス方法",
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
          <SectionHeader title="⚫︎タッチパネル/クリック">
            <Box>
              <Text>
                {getMessage({
                  ja: "画面上の電線をタップ/クリック",
                  us: "Tap/click on the wires on the screen",
                  cn: "点击屏幕上的电线。",
                  language,
                })}
              </Text>
              <ImageWithHighlight
                src="/images/56/accessComp01_bottom.webp"
                mb={0}
                label=""
                highlights={[
                  {
                    top: "46.3%",
                    left: "81.3%",
                    w: "3.4%",
                    h: "19%",
                    label: "タップ",
                    labelTop: "50%",
                    labelLeft: "250%",
                    bg: "rgba(255,0,0,0.1)",
                    borderRadius: "5px",
                    animation: "blink",
                  },
                  {
                    top: "49%",
                    left: "7.8%",
                    w: "5%",
                    h: "24%",
                    label: "タップ",
                    labelTop: "50%",
                    labelLeft: "200%",
                    bg: "rgba(255,0,0,0.1)",
                    borderRadius: "full",
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
            <Box w="300px">
              <Text>
                {getMessage({
                  ja: "エフを読み込む",
                  us: "Load the Efu",
                  cn: "载荷 Efu.",
                  language,
                })}
              </Text>
              <ImageWithHighlight
                src="/images/56/efu_wire.webp"
                label=""
                mt={0}
                mb={0}
                highlights={[
                  {
                    top: "52%",
                    left: "61.5%",
                    w: "13%",
                    h: "28%",
                    bg: "repeating-linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 4px, transparent 4px, transparent 6px)",
                    borderRadius: "5px",
                    animation: "blink",
                  },
                ]}
              />
            </Box>
            <Flex direction="column" alignItems="center">
              <Box h="1px" w="100%" bg="#4c4b49" />
              <Text>
                {"※" +
                  getMessage({
                    ja: "QRリーダーはAmazonで5000-7000円",
                    us: "QR reader is 30-45 dollar on Amazon",
                    cn: "QR 阅读器在亚马逊上的售价为 5000-7000 美元。",
                    language,
                  })}
              </Text>
              <Image
                mt={2}
                maxH="60px"
                borderRadius="sm"
                src="/images/56/qrReader.webp"
              />
            </Flex>
          </SectionHeader>
          <SectionHeader
            title={
              "⚫︎" + getMessage({ ja: "キーボード", us: "", cn: "", language })
            }
          >
            <Box>
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="12px"></Text>
              </Flex>
              <Text>
                {getMessage({
                  ja: "構成ナンバー4桁を入力",
                  us: "Enter the 4-digit configuration number",
                  cn: "输入 4 位配置编号。",
                  language,
                })}
              </Text>
              <Box h="120px" overflow="hidden">
                <ImageWithHighlight
                  src="/images/56/accessComp01.webp"
                  mb={0}
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

export default CompositionModal;
