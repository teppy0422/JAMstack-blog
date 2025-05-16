"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Button, IconButton, useColorMode } from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const Home = () => {
  const { colorMode } = useColorMode();
  const { language, setLanguage } = useLanguage();

  const [dimensions, setDimensions] = useState({
    width: "1024px",
    height: "768px",
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [message, setMessage] = useState("");

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
                  "]からの全ての行き先です\nハメ図は行き先の端末Noを表示\n" +
                  "-以下の方法でアクセス可能です-\n1.画面上の端末Noをタップして表示された画面の右上をタップ\n2.右上に端末-を入力\n",
                us:
                  "All destinations from terminal [" +
                  fileName.replace("-", "") +
                  "].\nHame diagram shows the terminal No. of the destination\n" +
                  "-It can be accessed in the following ways-\n1. Tap the device No. on the screen and tap the upper right corner of the displayed screen.\n2. Enter terminal - in the upper right corner",
                cn:
                  "从终点站[" +
                  fileName.replace("-", "") +
                  "]出发的所有目的地\n装图 显示目的终端编号\n" +
                  "-可以通过以下方式访问它-\n1.点击屏幕上的设备编号，然后点击显示屏幕的右上角\n在右上角输入[终端-]",
                language,
              })
            );
          } else if (fileName.length === 4) {
            setMessage(
              getMessage({
                ja:
                  "構成[" +
                  fileName +
                  "]のサブのハメ図/後ハメ電線が表示されています\n" +
                  "-以下の方法でアクセス可能です-\n" +
                  "1.画面上の電線をタップ\n2.QRリーダーでエフを読み込む\n3.右上に構成ナンバー4桁を入力\n",
                us:
                  "Pre/Post Fitting of the sub to which the composition [" +
                  fileName +
                  "] belongs are displayed.\n" +
                  "-It can be accessed in the following ways-\n" +
                  "1. Tap an electric wire on the screen\n" +
                  "2. Read the Instruction with a QR reader\n" +
                  "3. Enter the 4-digit conposition in the upper right corner.",
                cn:
                  "如图所示为配置[" +
                  fileName +
                  "]的子框架图/后框架导线\n" +
                  "-可以通过以下方式访问它-\n" +
                  "1.点击屏幕上的电线\n" +
                  "2.使用 QR 阅读器阅读说明\n" +
                  "3.\n输入右上角的四位配置编号",
                language,
              })
            );
          } else {
            setMessage(
              "端末No[" +
                fileName +
                "]のハメ図、電線をクリックすると構成Noのページに移動します\n" +
                "-以下の方法でアクセス可能です-\n" +
                "1.画面上の端末Noをタップ\n2.QRリーダーで端末Noを読み込む\n3.右上に端末ナンバーを入力\n"
            );
          }
        }
      }
    };
    const intervalId = setInterval(checkIframeSrc, 1000); // 1秒ごとにチェック
    return () => clearInterval(intervalId);
  }, [language]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg={colorMode === "light" ? "#f2e9df" : "black"}
    >
      <Box p={2} textAlign="center">
        <Text fontSize="xl" fontWeight={600}>
          {"56." +
            getMessage({
              ja: "配策誘導ナビ",
              language,
            }) +
            "Ver3.1"}
        </Text>
        <Text>
          {getMessage({
            ja: "要素をタップ/クリックで画面が変わります",
            us: "Tap/Click on an element to change the screen",
            cn: "轻敲/点击元素可更改屏幕",
            language,
          })}
          <br />
          {getMessage({
            ja: "実際に操作してみてください",
            us: "Try to actually operate it!",
            cn: "实际操作",
            language,
          })}
        </Text>
        {/* <IconButton
          icon={<FaSyncAlt />}
          onClick={toggleDimensions}
          aria-label="画面の向きを変える"
          height="1em"
          color="purple"
        />
        画面の向きを変更 */}
      </Box>
      <Box
        width={dimensions.width}
        height={dimensions.height}
        border="16px solid #333"
        borderRadius="36px"
        boxShadow="0 0 10px rgba(0, 0, 0, 0.5)"
        overflow="hidden"
        position="relative"
        bg="white"
      >
        <iframe
          ref={iframeRef}
          src="/html/Sjp/56v3.1/index.html"
          style={{ width: "100%", height: "100%", border: "none" }}
        ></iframe>
      </Box>
      <Box p={2} textAlign="center">
        <Text whiteSpace="pre-line">{message}</Text>
        <Text fontSize="xs" pb={0} pt={1}>
          {getMessage({
            ja: "トップページに戻るには最上部の電線情報をタップ",
            us: "To return to the top page, tap the wire information at the top of the page.",
            cn: "要返回首页，请点击最上面的电线信息。",
            language,
          })}
        </Text>
      </Box>
    </Box>
  );
};

export default Home;
