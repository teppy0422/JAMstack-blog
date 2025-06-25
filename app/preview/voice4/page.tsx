"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket"; // ← ここはlibの位置に応じて調整

export default function VoicePreviewPage() {
  const localRef = useRef<HTMLAudioElement>(null);
  const remoteRef = useRef<HTMLAudioElement>(null);
  const pc = useRef<RTCPeerConnection | null>(null);

  const [localVolume, setLocalVolume] = useState(0);
  const [remoteVolume, setRemoteVolume] = useState(0);
  const [callStarted, setCallStarted] = useState(false);

  useEffect(() => {
    fetch("/api/socket"); // 必須：Socket.ioサーバの初期化

    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    let localAnalyser: AnalyserNode | undefined;
    let remoteAnalyser: AnalyserNode | undefined;
    let localAnimationId: number, remoteAnimationId: number;

    const initAnalyser = (
      stream: MediaStream,
      setVolume: (v: number) => void,
      isRemote = false
    ) => {
      const AudioCtx =
        typeof window.AudioContext !== "undefined"
          ? window.AudioContext
          : (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume(Math.min(avg, 100));
        if (isRemote) {
          remoteAnimationId = requestAnimationFrame(update);
        } else {
          localAnimationId = requestAnimationFrame(update);
        }
      };
      update();
      return analyser;
    };

    pc.current.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteRef.current) remoteRef.current.srcObject = remoteStream;
      remoteAnalyser = initAnalyser(remoteStream, setRemoteVolume, true);
    };

    pc.current.onicecandidate = (e) => {
      if (e.candidate) socket.emit("candidate", e.candidate);
    };

    socket.on("offer", async (offer) => {
      await pc.current?.setRemoteDescription(offer);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (localRef.current) localRef.current.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => pc.current?.addTrack(track, stream));
      const answer = await pc.current?.createAnswer();
      if (answer) {
        await pc.current?.setLocalDescription(answer);
        socket.emit("answer", answer);
      }
      setCallStarted(true);
    });

    socket.on("answer", async (answer) => {
      await pc.current?.setRemoteDescription(answer);
      setCallStarted(true);
    });

    socket.on("candidate", async (candidate) => {
      try {
        await pc.current?.addIceCandidate(candidate);
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      cancelAnimationFrame(localAnimationId);
      cancelAnimationFrame(remoteAnimationId);
      localAnalyser?.disconnect();
      remoteAnalyser?.disconnect();
    };
  }, []);

  const startCall = async () => {
    console.log("📞 startCall clicked");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("🎤 マイク取得成功");

      if (localRef.current) localRef.current.srcObject = stream;
      stream
        .getTracks()
        .forEach((track) => pc.current?.addTrack(track, stream));

      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setLocalVolume(Math.min(avg, 100));
        requestAnimationFrame(tick);
      };
      tick();

      const offer = await pc.current?.createOffer();
      if (offer) {
        await pc.current?.setLocalDescription(offer);
        socket.emit("offer", offer);
        setCallStarted(true); // ← ここでボタンが切り替わる
      }
    } catch (err) {
      console.error("❌ マイク取得失敗", err);
      alert("マイクの許可がされていないか、Safariの制限でブロックされました。");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔊 音声通話プレビュー::</h2>
      <audio ref={localRef} autoPlay muted />
      <audio ref={remoteRef} autoPlay />

      <br />
      <div>https://52d9-119-242-85-23.ngrok-free.app/voice-daily/</div>

      <button
        onClick={() => {
          alert("クリックされた");
          startCall();
        }}
        disabled={callStarted}
      >
        📞 {callStarted ? "通話中…" : "通話を開始_"}
      </button>

      {callStarted && (
        <div style={{ marginTop: 20 }}>
          <div>🎤 自分の音声</div>
          <div style={{ height: "10px", width: "100%", background: "#eee" }}>
            <div
              style={{
                height: "10px",
                width: `${localVolume}%`,
                background: "green",
                transition: "width 0.1s linear",
              }}
            />
          </div>

          <div style={{ marginTop: 10 }}>🎧 相手の音声</div>
          <div style={{ height: "10px", width: "100%", background: "#eee" }}>
            <div
              style={{
                height: "10px",
                width: `${remoteVolume}%`,
                background: "blue",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
