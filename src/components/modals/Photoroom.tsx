"use client";
import {
  useDisclosure,
  Text,
  IconButton,
  Flex,
  Box,
  HStack,
  Icon,
  Spacer,
  Tooltip,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import { FaQuestion } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import CustomModal from "@/components/ui/CustomModal";
import ModalButton from "@/components/ui/ModalButton";
import { deflate } from "zlib";

export function Photoroom() {
  const { language, setLanguage } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <ModalButton label="Photoroom" onClick={onOpen} />
      <CustomModal
        title="Photoroom"
        isOpen={isOpen}
        onClose={onClose}
        modalSize="lg"
        macCloseButtonHandlers={[onClose]}
        footer={<></>}
      >
        <Box bg="custom.system.500" p={4}>
          <Box
            borderRadius="md"
            p={4}
            border="1px solid #4c4b49"
            color="#ccc"
            py={3}
            fontSize="13px"
            mt={3}
          >
            <Text fontWeight="bold" fontSize="12px">
              {"1. " +
                getMessage({
                  ja: "使い方",
                  us: "treatment",
                  cn: "待遇",
                  language,
                })}
            </Text>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />
            <video width="100%" height="100%" loop autoPlay muted>
              <source src="/images/0001/howToPhotoroom.mp4" type="video/mp4" />
              {getMessage({
                ja: "お使いのブラウザは動画タグをサポートしていません。",
                us: "Your browser does not support video tags.",
                cn: "您的浏览器不支持视频标记。",
                language,
              })}
            </video>
            {"1." +
              getMessage({
                ja: "上の動画のように加工したい写真をドラッグすると背景が除去されます。",
                us: "Drag the photo you want to process as shown in the video above to remove the background.",
                cn: "拖动要处理的照片，移除背景，如上视频所示。",
                language,
              })}
            <br />
            {"2." +
              getMessage({
                ja: "ダウンロード(標準解像度)してパソコンに保存します。",
                us: "Download (standard resolution) and save to your computer.",
                cn: "下载（标准分辨率）并保存在电脑上。",
                language,
              })}
          </Box>
          <Box
            borderRadius="md"
            p={4}
            border="1px solid #4c4b49"
            color="#ccc"
            py={3}
            fontSize="13px"
            mt={4}
          >
            <Text fontWeight="bold" fontSize="12px">
              {"2. " +
                getMessage({
                  ja: "概略",
                  us: "outline",
                  cn: "概要",
                  language,
                })}
            </Text>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />
            <Text>
              {getMessage({
                ja: "ブラウザ上で動作する画像加工WEBアプリ。2025/6/17現在は無料です。",
                us: "an image processing web application that runs in your browser and is free as of 2024/11/16.",
                cn: "一款图像处理网络应用程序，可在浏览器中运行，自 2024 年 11 月 16 日起免费。",
                language,
              })}
            </Text>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
}

export default Photoroom;
