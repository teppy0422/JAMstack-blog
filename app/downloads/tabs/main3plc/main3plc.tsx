"use client";

import React from "react";
import { Box, Text, Button, IconButton, useDisclosure } from "@chakra-ui/react";

import YouTubePlayer from "@/components/youtube";
import CustomModal from "@/components/ui/CustomModal";
import CustomModalTab from "../../parts/CustomModalTab";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const ModalMain3plc: React.FC = () => {
  const { language } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CustomModalTab
        path="/"
        text={getMessage({
          ja: "MAIN3.PLC",
          us: "MAIN3.PLC",
          cn: "MAIN3.PLC",
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
            }) + "_main3(PLC)"
          }
          date="2021/3/24"
          autoPlay={true}
          src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018151928.mp4"
          textContent={getMessage({
            ja: `PLCなどの外部デバイスにシリアル送信を行なって製品品番に応じた動作を行います。\n動画のように忘れん棒に部品セットを行う場合はロボットアームの方が良いかもしれません。`,
            us: `Serial transmission to external devices such as PLCs for operation according to product part number

                A robot arm may be better for setting parts on a forget-me-not as shown in the video.`,
            cn: `串行传输到 PLC 等外部设备，以便根据产品部件号进行操作。

                如视频所示，机械臂可能更适合在勿忘我上设置零件。`,
            language,
          })}
        />
      </CustomModal>
    </>
  );
};

export default ModalMain3plc;
