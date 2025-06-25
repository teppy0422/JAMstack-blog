"use client";
import DailyIframe from "@daily-co/daily-js";
import { useRef, useState } from "react";
import VoiceDailyModal from "@/components/modals/VoiceDailyModal";

export default function DailyVoiceCall() {
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
        userName: "bon",
      });

      callFrameRef.current = callFrame;
      setCallStarted(true);
    }
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h2>📞 音声通話（Daily）</h2>
        <button onClick={startCall} disabled={callStarted}>
          {callStarted ? "通話中…" : "通話を開始"}
        </button>
        <div id="daily-container" style={{ marginTop: "20px" }} />
      </div>
    </>
  );
}
