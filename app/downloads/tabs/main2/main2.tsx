"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa";
import YouTubePlayer from "@/components/youtube";

import CustomModal from "@/components/ui/CustomModal";
import CustomModalTab from "../../parts/CustomModalTab";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const ModalMain2: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [dimensions, setDimensions] = useState({
    width: "1024px",
    height: "768px",
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [message, setMessage] = useState("");
  const { language } = useLanguage();

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
    <>
      <CustomModalTab
        path="/"
        text={getMessage({
          ja: "MAIN2.SSC",
          us: "MAIN2.SSC",
          cn: "MAIN2.SSC",
          language,
        })}
        media="movie"
        onOpen={onOpen}
      />
      <CustomModal
        title=""
        isOpen={isOpen}
        onClose={onClose}
        modalSize={{ base: "sm", md: "lg", lg: "2xl" }} // ←ここを修正
        macCloseButtonHandlers={[onClose]}
        footer={<></>}
      >
        <YouTubePlayer
          title={
            getMessage({
              ja: "順立生産システム",
              language,
            }) + "_main2(SSC)"
          }
          src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018151459.mp4"
          textContent={getMessage({
            ja: `SSCで使う場合の例です

一貫工程は全員が同じ製品を順番に作成する為、生産指示は一度で良い筈です。
それをコンセプトにYSSやCBやPLCなどにも対応しました`,
            us: `Here is an example for use in SSC

In an integrated process, everyone creates the same product in sequence, so production instructions should be given only once.
Based on this concept, YSS, CB, PLC, etc. are also supported.`,
            cn: `用于 SSC 的示例。

在集成流程中，每个人都按顺序生产相同的产品，因此只需下达一次生产指令。
基于这一概念，还支持 YSS、CB 和 PLC。
`,
            language,
          })}
          date="2024/1/20"
          autoPlay={false}
        />
      </CustomModal>
    </>
  );
};

export default ModalMain2;
