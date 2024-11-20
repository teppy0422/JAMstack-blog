import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Button, IconButton } from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa";

const Home = () => {
  const [dimensions, setDimensions] = useState({
    width: "924px",
    height: "608px",
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
      bg="transparent"
    >
      <Box
        width={dimensions.width}
        height={dimensions.height}
        border="8px solid #333"
        borderRadius="18px"
        boxShadow="0 0 20px rgba(0, 0, 0, 0.5)"
        overflow="hidden"
        position="relative"
      >
        <iframe
          ref={iframeRef}
          src="/files/download/Sjp/56v3.1/0202.html"
          style={{ width: "100%", height: "100%", border: "none" }}
        ></iframe>
      </Box>
    </Box>
  );
};

export default Home;
