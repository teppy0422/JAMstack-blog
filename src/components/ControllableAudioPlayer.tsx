"use client";

import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";

export interface ControllableAudioPlayerHandle {
  setVolume: (vol: number) => void;
  setPlaybackRate: (rate: number) => void;
  stop: () => void;
  play: () => void;
}

interface Props {
  src: string;
  initialVolume?: number;
  initialPlaybackRate?: number;
}

const ControllableAudioPlayer = forwardRef<
  ControllableAudioPlayerHandle,
  Props
>(({ src, initialVolume = 0.5, initialPlaybackRate = 1.0 }, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = initialVolume;
    audio.playbackRate = initialPlaybackRate;
  }, [initialVolume, initialPlaybackRate]);

  useImperativeHandle(ref, () => ({
    setVolume: (vol: number) => {
      if (audioRef.current) {
        audioRef.current.volume = Math.max(0, Math.min(1, vol));
      }
    },
    setPlaybackRate: (rate: number) => {
      if (audioRef.current) {
        audioRef.current.playbackRate = Math.max(0.1, rate);
      }
    },
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    },
    play: () => {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((e) => {
          console.warn("Play failed:", e);
        });
      }
    },
  }));

  return <audio ref={audioRef} src={src} preload="auto" />;
});

ControllableAudioPlayer.displayName = "ControllableAudioPlayer";

export default ControllableAudioPlayer;
