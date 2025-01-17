import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Button, IconButton } from "@chakra-ui/react";
import { FaSyncAlt } from "react-icons/fa";
import IpadFrame from "../../components/ipad";
import YouTubePlayer from "../../components/youtube";

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

const Home = () => {
  const [dimensions, setDimensions] = useState({
    width: "1024px",
    height: "768px",
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [message, setMessage] = useState("");
  const { language, setLanguage } = useLanguage();

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
    <IpadFrame>
      <YouTubePlayer
        title={
          getMessage({
            ja: "順立生産システム",
            language,
          }) + "_SSC"
        }
        src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018151459.mp4"
        textContent={getMessage({
          ja: `SSCで使う場合の例です


            一貫工程は全員が同じ製品を順番に作成する為、生産指示は一度で良い筈です。
            それをコンセプトにYSSやCBやPLCなどにも対応しました
                      `,
          us: `Here is an example for use in SSC


In an integrated process, everyone creates the same product in sequence, so production instructions should be given only once.
Based on this concept, YSS, CB, PLC, etc. are also supported.
            `,
          cn: `用于 SSC 的示例。


在集成流程中，每个人都按顺序生产相同的产品，因此只需下达一次生产指令。
基于这一概念，还支持 YSS、CB 和 PLC。
`,
          language,
        })}
        date="2024/1/20"
        autoPlay={false}
      />
    </IpadFrame>
  );
};

export default Home;
