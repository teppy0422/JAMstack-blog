"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";

export default function VoiceTestPage() {
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on("offer", async (data) => {
      const peer = createPeer();
      await peer.setRemoteDescription(new RTCSessionDescription(data));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("answer", async (data) => {
      await peerRef.current?.setRemoteDescription(
        new RTCSessionDescription(data)
      );
    });

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
  }, []);

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
