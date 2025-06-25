"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";

export default function VoiceTestPage2() {
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [joined, setJoined] = useState(false);

  // シグナリング
  useEffect(() => {
    fetch("/api/socket").then(() => {
      socket.connect();
    });

    socket.on("offer", async ({ senderId, sdp }) => {
      if (!peerRef.current) createPeer();
      const peer = peerRef.current!;
      await peer.setRemoteDescription(new RTCSessionDescription(sdp));
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      if (localAudioRef.current) localAudioRef.current.srcObject = stream;
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", { senderId: socket.id, sdp: answer });
      setJoined(true);
    });

    socket.on("answer", async ({ senderId, sdp }) => {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
    });

    socket.on("ice-candidate", async ({ senderId, candidate }) => {
      if (!peerRef.current) return;
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("ICE candidate error", e);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Peer作成
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
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        remoteAudioRef.current.play().catch(() => {});
      }
    };

    return peer;
  };

  // 通話開始
  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (localAudioRef.current) localAudioRef.current.srcObject = stream;
    const peer = createPeer();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("offer", { senderId: socket.id, sdp: offer });
    setJoined(true);
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>🎤 シンプル音声通話テスト</h2>
      {!joined ? (
        <button onClick={startCall}>通話開始</button>
      ) : (
        <p>通話中です。もう一つの端末でも通話開始してください。</p>
      )}
      <div style={{ marginTop: 24 }}>
        <audio ref={localAudioRef} autoPlay muted />
        <audio ref={remoteAudioRef} autoPlay />
      </div>
    </div>
  );
}
