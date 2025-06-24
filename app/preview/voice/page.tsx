"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";

export default function VoiceTestPage() {
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [joined, setJoined] = useState(false);
  const [localOfferReady, setLocalOfferReady] = useState(false); // offer準備完了フラグ

  useEffect(() => {
    socket.connect();

    // offer を受け取ったときの処理（callee）
    socket.on("offer", async (data) => {
      const peer = createPeer();
      await peer.setRemoteDescription(new RTCSessionDescription(data));

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", answer);
      setJoined(true);
    });

    // answer を受け取ったときの処理（caller）
    socket.on("answer", async (data) => {
      // offer の setLocalDescription が終わっていない場合は待つ
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

      try {
        await peerRef.current?.setRemoteDescription(
          new RTCSessionDescription(data)
        );
      } catch (e) {
        console.error("Failed to set remote description", e);
      }
    });

    // ICE candidate を受け取ったとき
    socket.on("ice-candidate", async (candidate) => {
      try {
        await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding ice candidate", e);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [localOfferReady]);

  const createPeer = () => {
    const peer = new RTCPeerConnection();
    peerRef.current = peer;

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", e.candidate);
      }
    };

    peer.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
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

    const peer = createPeer();

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    setLocalOfferReady(true);
    socket.emit("offer", offer);
    setJoined(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎤 音声通話テスト</h1>
      {!joined ? (
        <button onClick={startCall}>音声通話を開始</button>
      ) : (
        <p>通話中です...</p>
      )}
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}
