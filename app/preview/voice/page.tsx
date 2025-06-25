"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";

export default function VoiceTestPage() {
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [joined, setJoined] = useState(false);
  const [localOfferReady, setLocalOfferReady] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [speakerLevel, setSpeakerLevel] = useState(0);
  const [remoteAnswerSet, setRemoteAnswerSet] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/socket").then(() => {
      socket.connect();
    });

    socket.on("offer", async (data) => {
      console.log("📩 offer 受信");
      const peer = createPeer();
      await peer.setRemoteDescription(new RTCSessionDescription(data));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      console.log("🎙️ ローカル音声ストリーム取得", stream);

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      setupMicMeter(stream);

      stream.getTracks().forEach((track) => {
        console.log("🎧 トラック追加:", track);
        peer.addTrack(track, stream);
      });

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", answer);
      setJoined(true);
    });
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      if (socket.id) {
        setSocketId(socket.id); // string のときだけセット
      } else {
        setSocketId(null); // 安全に fallback
      }
    });

    socket.on("offer", async ({ senderId, sdp }) => {
      if (senderId === socketId) return;

      const peer = createPeer();
      await peer.setRemoteDescription(new RTCSessionDescription(sdp));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      setupMicMeter(stream);

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", { senderId: socket.id, sdp: answer });
      setJoined(true);
    });

    socket.on("answer", async ({ senderId, sdp }) => {
      if (senderId === socketId) return;
      if (remoteAnswerSet) return;

      if (!localOfferReady) {
        await new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (localOfferReady) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }

      await peerRef.current?.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
      setRemoteAnswerSet(true);
    });

    socket.on("ice-candidate", async ({ senderId, candidate }) => {
      if (senderId === socketId) return;
      try {
        await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding ice candidate", e);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [localOfferReady, socketId]);

  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerRef.current = peer;

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          senderId: socket.id,
          candidate: e.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      const [stream] = event.streams;
      console.log("受信stream", stream, stream?.getAudioTracks());

      if (!stream || stream.getAudioTracks().length === 0) {
        console.warn(
          "受信したストリームが無効、またはオーディオトラックがない"
        );
        return;
      }

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;

        const tryPlay = async () => {
          try {
            await remoteAudioRef.current!.play();
            console.log("✅ 再生開始成功");
          } catch (err) {
            console.warn("⚠️ オーディオ再生失敗:", err);
          }
        };

        tryPlay();
      }

      // 音声レベルの測定
      setupSpeakerMeterFromStream(stream);
    };

    return peer;
  };

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    if (localAudioRef.current) {
      localAudioRef.current.srcObject = stream;
    }

    setupMicMeter(stream);

    const peer = createPeer();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    setLocalOfferReady(true);
    socket.emit("offer", { senderId: socket.id, sdp: offer });
    setJoined(true);
  };

  const setupMicMeter = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      const level = Math.max(...dataArray) / 255;
      setMicLevel(level);
      requestAnimationFrame(update);
    };

    update();
  };

  const setupSpeakerMeterFromStream = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      const level = Math.max(...dataArray) / 255;
      setSpeakerLevel(level);
      requestAnimationFrame(update);
    };

    update();
  };

  const renderBar = (level: number) => (
    <div
      style={{
        width: `${Math.floor(level * 100)}%`,
        height: "10px",
        background: level > 0.2 ? "#4caf50" : "#ccc",
        transition: "width 0.1s linear",
      }}
    />
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎤 音声通話テスト</h1>
      {!joined ? (
        <button onClick={startCall}>音声通話を開始</button>
      ) : (
        <p>通話中です...</p>
      )}

      <div style={{ marginTop: "2rem" }}>
        <p>🎙️ マイク入力:</p>
        {renderBar(micLevel)}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <p>🔈 スピーカー出力:</p>
        {renderBar(speakerLevel)}
      </div>

      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}
