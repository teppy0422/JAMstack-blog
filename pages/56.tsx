import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Button, IconButton } from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa";

const Home = () => {
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
              "トップページです\n配策するサブナンバーをタップしてみてください"
            );
          } else if (fileName.includes("-")) {
            setMessage(
              fileName +
                ".html\n端末[" +
                fileName.replace("-", " ") +
                "]からの全ての行き先を表示しています\nハメ図は行き先の端末Noを表示\n\n" +
                "以下の方法でアクセス可能です\n1.画面上の端末Noをタップして表示された画面の右上をタップ\n2.右上に端末-を入力\n\n" +
                "トップページに戻るには最上部の電線情報をタップ"
            );
          } else if (fileName.length === 4) {
            setMessage(
              fileName +
                ".html\n構成[" +
                fileName +
                "]の経路を表示中です\nこのサブの端末と後ハメ電線が表示されています\n\n以下の方法でアクセス可能です\n1.画面上の電線をタップ\n2.QRリーダーでエフを読み込む\n3.右上に構成ナンバー4桁を入力\n\n" +
                "トップページに戻るには最上部の電線情報をタップ"
            );
          } else {
            setMessage(
              fileName +
                ".html\n端末No[" +
                fileName +
                "]のページです\n電線をクリックで構成Noのページに移動します\n\n" +
                "以下の方法でアクセス可能です\n1.画面上の端末Noをタップ\n2.QRリーダーで端末Noを読み込む\n3.右上に端末ナンバーを入力\n\n" +
                "トップページに戻るには最上部の電線情報をタップ"
            );
          }
        }
      }
    };
    const intervalId = setInterval(checkIframeSrc, 1000); // 1秒ごとにチェック
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="gray.100"
    >
      <Box bg="gray.100" p={4} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" fontFamily="Noto Serif JP">
          56_配策誘導ナビVer3.1
        </Text>
        <Text fontFamily="Noto Serif JP">
          iPad等のタブレットでの使用をイメージしてみました
          <br />
          要素をタップで画面が変わります
          <br />
          実際にタップ/クリックして動作確認してみてください
        </Text>
        <IconButton
          icon={<FaSyncAlt />}
          onClick={toggleDimensions}
          aria-label="画面の向きを変える"
          height="1em"
        />
        画面の向きを変更
      </Box>
      <Box
        width={dimensions.width}
        height={dimensions.height}
        border="16px solid #333"
        borderRadius="36px"
        boxShadow="0 0 20px rgba(0, 0, 0, 0.5)"
        overflow="hidden"
        position="relative"
        bg="white"
      >
        <iframe
          ref={iframeRef}
          src="/files/56/index.html"
          style={{ width: "100%", height: "100%", border: "none" }}
        ></iframe>
      </Box>
      <Box bg="gray.100" p={4} textAlign="center">
        <Text whiteSpace="pre-line" fontFamily="Noto Serif JP">
          {message}
        </Text>
      </Box>
      <Box textAlign="center" mt={4}></Box>
    </Box>
  );
};

export default Home;
