"use client";

import { useEffect, useRef, useState } from "react";
import socket from "../lib/socket";

export default function VoicePage() {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pc = useRef(null);

  const [localVolume, setLocalVolume] = useState(0);
  const [remoteVolume, setRemoteVolume] = useState(0);
  const [callStarted, setCallStarted] = useState(false);

  useEffect(() => {
    fetch("/api/socket");

    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    let localAnalyser, remoteAnalyser;
    let localAnimationId, remoteAnimationId;

    const initAnalyser = (stream, setVolume, isRemote = false) => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const update = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume(Math.min(avg, 100)); // スケーリング
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
      remoteRef.current.srcObject = remoteStream;

      // remoteのAnalyserは、track受信後に初期化する必要あり
      remoteAnalyser = initAnalyser(remoteStream, setRemoteVolume, true);
    };

    pc.current.onicecandidate = (e) => {
      if (e.candidate) socket.emit("candidate", e.candidate);
    };

    socket.on("offer", async (offer) => {
      await pc.current?.setRemoteDescription(offer);
      const answer = await pc.current?.createAnswer();
      if (answer) {
        await pc.current?.setLocalDescription(answer);
        socket.emit("answer", answer);
      }
      setCallStarted(true);
    });

    socket.on("answer", async (answer) => {
      await pc.current.setRemoteDescription(answer);
      setCallStarted(true);
    });

    socket.on("candidate", async (candidate) => {
      try {
        await pc.current.addIceCandidate(candidate);
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
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (localRef.current) {
        localRef.current.srcObject = stream;
      }

      // addTrack
      stream
        .getTracks()
        .forEach((track) => pc.current?.addTrack(track, stream));

      // 音量バー初期化
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
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

      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket.emit("offer", offer);
      setCallStarted(true);
    } catch (err) {
      console.error("❌ マイク取得失敗", err);
      alert(
        "マイクが許可されていないか、iOS Safariの制限によりブロックされました。"
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔊 音声通話テスト</h2>
      <audio ref={localRef} autoPlay />
      <audio ref={remoteRef} autoPlay />

      <br />
      <button onClick={startCall} disabled={callStarted}>
        📞 {callStarted ? "通話中…" : "通話を開始"}
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
