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

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="#f0e5da"
    >
      <Box p={2} textAlign="center" color="gray.800">
        <Text fontSize="2xl" fontWeight="bold" fontFamily="Noto Sans JP">
          41_先ハメ誘導
        </Text>
        <Text fontFamily="Noto Serif JP">
          生産準備+で自動立案したサブ形態のみ対応
        </Text>
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
          src="/files/download/Sjp/41/index.html"
          style={{ width: "100%", height: "100%", border: "none" }}
        ></iframe>
      </Box>
      <Box p={2} textAlign="center">
        <Text fontSize="sm" pb={0} pt={1} color="gray.800">
          先ハメ初心者でも最適な順番で作業が可能
          <br />
          ※先ハメ順を都度考える補給品工程で特に有効です
        </Text>
      </Box>
    </Box>
  );
};

export default Home;
