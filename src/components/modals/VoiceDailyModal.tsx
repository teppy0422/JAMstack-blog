"use client";
import DailyIframe from "@daily-co/daily-js";
import { useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Center,
} from "@chakra-ui/react";
import getMessage from "@/utils/getMessage";
import CustomModal from "@/components/ui/CustomModal";
import ModalButton from "@/components/ui/ModalButton";
import { PhoneIcon } from "@/components/ui/icons";

type VoiceDailyModalProps = {
  currentUserName: string | null;
};
export default function VoiceDailyModal({
  currentUserName,
}: VoiceDailyModalProps) {
  const callFrameRef = useRef<any>(null);
  const [callStarted, setCallStarted] = useState(false);

  const { language, setLanguage } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const roomUrl = "https://teppy.daily.co/teppy-room";

  const startCall = () => {
    if (!callFrameRef.current) {
      const container = document.getElementById("daily-container");
      if (!container) {
        console.error("❌ daily-container が見つかりません");
        return;
      }
      // ✅ parentElementは第1引数
      const callFrame = DailyIframe.createFrame(container, {
        iframeStyle: {
          width: "100%",
          height: "400px",
          border: "1px solid #ccc",
          borderRadius: "12px",
        },
        showLeaveButton: true,
      });
      // ✅ URLは別でjoinで指定
      callFrame.join({
        url: roomUrl,
        videoSource: false,
        audioSource: true,
        userName: currentUserName ?? undefined,
      });
      callFrameRef.current = callFrame;
      setCallStarted(true);
    }
  };

  return (
    <>
      <Box onClick={onOpen} cursor="pointer">
        <PhoneIcon size="30px" />
      </Box>
      <CustomModal
        title={
          "📞 " +
          getMessage({
            ja: "音声通話",
            us: "Voice Calls",
            cn: "音声通話",
            language,
          })
        }
        isOpen={isOpen}
        onClose={onClose}
        modalSize="sm"
        macCloseButtonHandlers={[onClose]}
        footer={<>作成途中</>}
      >
        <Box style={{ padding: "20px" }}>
          <Box as="button" onClick={startCall} disabled={callStarted}>
            {callStarted ? "通話中…" : "通話を開始"}
          </Box>
          <Box id="daily-container" style={{ marginTop: "20px" }} />
        </Box>
      </CustomModal>
    </>
  );
}
