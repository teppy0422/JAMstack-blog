"use client";
import DailyIframe from "@daily-co/daily-js";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useDisclosure,
  Box,
  Tooltip,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import getMessage from "@/utils/getMessage";
import CustomModal from "@/components/ui/CustomModal";
import { PhoneIcon } from "@/components/ui/icons";
import { OldPhoneBodyIcon, OldPhoneHeadIcon } from "@/components/ui/icons";
import { Customized } from "recharts";

type VoiceDailyModalProps = {
  currentUserName: string | null;
};
export default function VoiceDailyModal({
  currentUserName,
}: VoiceDailyModalProps) {
  const { language } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();

  const callFrameRef = useRef<any>(null);
  const [callStarted, setCallStarted] = useState(false);

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
  const leaveCall = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave();
      callFrameRef.current.destroy();
      callFrameRef.current = null;
      setCallStarted(false);
      console.log("📴 通話を切断しました");
    }
  };
  const handleModalClose = () => {
    leaveCall();
    onClose(); // Chakra UI の useDisclosure 用
  };
  return (
    <>
      <Box
        onClick={onOpen}
        cursor="pointer"
        _hover={{ opacity: "0.85", transform: "scale(1.1)" }}
        transition="all 0.3 ease-in-out"
      >
        <PhoneIcon
          size="26px"
          fill={
            colorMode === "light"
              ? "custom.theme.light.900"
              : "custom.theme.dark.100"
          }
        />
      </Box>
      <CustomModal
        title={getMessage({
          ja: "音声通話",
          us: "Voice Calls",
          cn: "音声通話",
          language,
        })}
        isOpen={isOpen}
        onClose={handleModalClose}
        modalSize="sm"
        macCloseButtonHandlers={[handleModalClose]}
        footer={
          <>
            {getMessage({
              ja: "-テスト中-",
              us: "-Testing-",
              cn: "-被测-",
              language,
            })}
          </>
        }
      >
        <>
          {currentUserName && !callStarted ? (
            <Text fontSize="11px" textAlign="center" mt="10px">
              {getMessage({
                ja: "初回はマイクの使用許可を求められます",
                us: "You will be asked for permission to use the microphone for the first time.",
                cn: "您将被要求允许首次使用麦克风。",
                language,
              })}
              <br />
              {getMessage({
                ja: "許可(Allow)を押して下さい",
                us: "Press 'Allow'",
                cn: "按允许。",
                language,
              })}
            </Text>
          ) : (
            <Text fontSize="11px" textAlign="center" mt="10px">
              利用にはログインと管理者認証が必要です
            </Text>
          )}
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            p="20px"
            mt="20px"
          >
            {currentUserName && (
              <Tooltip
                label={
                  !callStarted
                    ? getMessage({
                        ja: "通話を開始",
                        us: "Start Call",
                        cn: "开始通话",
                        language,
                      })
                    : getMessage({
                        ja: "終了",
                        us: "End Call",
                        cn: "结束",
                        language,
                      })
                }
                placement="top"
                hasArrow
              >
                <Box
                  position="relative"
                  role="group" // ← グループとして子に hover 状態を伝える
                  cursor="pointer"
                  onClick={!callStarted ? startCall : leaveCall}
                >
                  <OldPhoneBodyIcon
                    size="32px"
                    fill={colorMode === "light" ? "#444" : "#ddd"}
                  />
                  {!callStarted && (
                    <Box
                      position="absolute"
                      top="0px"
                      transition="transform 0.3s ease-in-out infinity" // アニメーション指定
                      _groupHover={{ transform: "rotate(-10deg)" }} // 親に hover されたときに回転
                      transformOrigin="left top" // 回転の軸を設定
                    >
                      <OldPhoneHeadIcon
                        size="32px"
                        fill={colorMode === "light" ? "#444" : "#ddd"}
                      />
                    </Box>
                  )}
                </Box>
              </Tooltip>
            )}
            <Box id="daily-container" style={{ marginTop: "20px" }} />
          </Box>
        </>
      </CustomModal>
    </>
  );
}
