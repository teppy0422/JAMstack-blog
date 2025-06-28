"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import {
  Box,
  Text,
  Button,
  IconButton,
  useColorMode,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import CustomModal from "@/components/ui/CustomModal";
import CustomModalTab from "../../parts/CustomModalTab";

import CompositionModal from "./modals/CompositionModal";
import TerminalModal from "./modals/TerminalModal";
import TerminalModalForcus, {
  TerminalModalFocus,
} from "./modals/TerminalModalFocus";

export const Modal56: React.FC = () => {
  const { language } = useLanguage();
  const { colorMode } = useColorMode();

  const [dimensions, setDimensions] = useState({
    width: "1024px",
    height: "768px",
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState<ReactNode>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toggleDimensions = () => {
    setDimensions((prev) => ({
      width: prev.height,
      height: prev.width,
    }));
  };

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth > 1024 ? "1024px" : `${window.innerWidth}px`,
        height: window.innerHeight > 768 ? "768px" : `${window.innerHeight}px`,
      });
    };
    updateDimensions(); // 初期サイズを設定
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const checkIframeSrc = () => {
      if (iframeRef.current) {
        const iframeWindow = iframeRef.current.contentWindow;
        if (iframeWindow) {
          const currentPath = iframeWindow.location.pathname;
          const fileName = currentPath
            .substring(currentPath.lastIndexOf("/") + 1)
            .replace(".html", "");
          if (fileName === "index") {
            setMessage(
              getMessage({
                ja: "トップページです\n配策するサブナンバーをタップしてみてください",
                us: "Top page.\nTap the sub-number you want to distribute.",
                cn: "首页\n点选要分发的子号码",
                language,
              })
            );
          } else if (fileName.includes("-")) {
            setMessage(
              getMessage({
                ja:
                  "端末[" +
                  fileName.replace("-", "") +
                  "]からの全ての行き先です\nハメ図には行き先の端末Noを表示\n",
                us:
                  "All destinations from terminal [" +
                  fileName.replace("-", ""),
                cn:
                  "从终点站[" + fileName.replace("-", "") + "]出发的所有目的地",
                language,
              })
            );
          } else if (fileName.length === 4) {
            setMessage(
              getMessage({
                ja:
                  "構成[" +
                  fileName +
                  "]のサブのハメ図/後ハメ電線が表示されています\n",
                us:
                  "Pre/Post Fitting of the sub to which the composition [" +
                  fileName +
                  "] belongs are displayed.\n",
                cn: "如图所示为配置[" + fileName + "]的子框架图/后框架导线\n",
                language,
              })
            );
            setModal(<CompositionModal />);
          } else {
            setMessage(
              "端末No[" +
                fileName +
                "]のハメ図、電線をタップすると構成Noのページに移動します\n"
            );
            setModal(<TerminalModal />);
          }
        }
      }
    };
    const intervalId = setInterval(checkIframeSrc, 1000); // 1秒ごとにチェック
    return () => clearInterval(intervalId);
  }, [language]);

  return (
    <>
      <CustomModalTab
        path="./tabs/56/"
        text={
          "56." +
          getMessage({
            ja: "配策誘導ナビ",
            language,
          })
        }
        media="html"
        onOpen={onOpen}
      />
      <CustomModal
        title={
          "56." +
          getMessage({
            ja: "配策誘導ナビ",
            language,
          }) +
          "Ver3.1"
        }
        isOpen={isOpen}
        onClose={onClose}
        modalSize={{ base: "sm", md: "2xl", lg: "4xl" }}
        macCloseButtonHandlers={[onClose]}
        footer={
          <>
            <Flex direction="column" align="center" w="100%">
              <Text fontSize="xs" pb={0} pt={1} textAlign="center">
                {getMessage({
                  ja: "トップページに戻るには最上部の電線情報をタップ",
                  us: "To return to the top page, tap the wire information at the top of the page.",
                  cn: "要返回首页，请点击最上面的电线信息。",
                  language,
                })}
              </Text>
            </Flex>
          </>
        }
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="70vh"
          width="100%"
          bg="custom.system.700"
          color="#ddd"
        >
          <Box textAlign="center" p={2} fontSize="13px">
            <Text whiteSpace="pre-line">{message}</Text>
          </Box>
          <Box
            // width={dimensions.width}
            // height={dimensions.height}
            w="100%"
            h="70vh"
            // border="16px solid #333"
            // borderRadius="18px"
            boxShadow="0 0 10px rgba(0, 0, 0, 0.5)"
            overflow="hidden"
            position="relative"
            bg="white"
          >
            <iframe
              ref={iframeRef}
              src="/html/Sjp/56v3.1/index.html"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </Box>
          <Box
          // border="0.5px solid"
          // borderColor="custom.system.200"
          >
            <Flex
              direction="row"
              gap={2}
              p={2}
              textAlign="center"
              fontSize="13px"
            >
              <CompositionModal />
              <TerminalModal />
              <TerminalModalFocus />
            </Flex>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default Modal56;
