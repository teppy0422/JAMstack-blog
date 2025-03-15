import React from "react";
import styled, { keyframes } from "styled-components";

interface AnimationImageProps {
  sealSize?: number;
  src: string;
  width: string;
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  translate?: string;
  rotate?: string;
  animation?: string;
  id?: string;
}

export const AnimationImage: React.FC<AnimationImageProps> = ({
  sealSize,
  src,
  width,
  left,
  top,
  right,
  bottom,
  translate,
  rotate,
  animation,
  id,
}) => {
  return (
    <>
      <img
        src={src}
        style={{
          position: "absolute",
          width: width,
          left: left,
          top: top,
          right: right,
          bottom: bottom,
          rotate: `${rotate}`,
          animation: `${animation}`,
          filter:
            sealSize !== undefined && sealSize > 0
              ? "url(#outline-filter) drop-shadow(1px 1px 3px rgba(0, 0, 0, 1))"
              : "none",
        }}
        id={id}
      />
      <svg width="0" height="0">
        <defs>
          <filter id="outline-filter">
            {/* 余白を作成 */}
            <feMorphology
              operator="dilate"
              radius={sealSize}
              in="SourceAlpha"
              result="dilated"
            />
            <feFlood floodColor="white" result="flood" />
            <feComposite
              in="flood"
              in2="dilated"
              operator="in"
              result="outline"
            />
            {/* 黒い線を追加 */}
            <feMorphology
              operator="dilate"
              radius={0}
              in="outline"
              result="expanded"
            />
            <feFlood floodColor="#333" result="blackFlood" />
            <feComposite
              in="blackFlood"
              in2="expanded"
              operator="in"
              result="blackOutline"
            />
            <feMerge>
              <feMergeNode in="blackOutline" />
              <feMergeNode in="outline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <style jsx>{`
        @keyframes nyoki_rabit {
          0% {
            transform: translateY(100px) translateX(0px) scale(0.1);
          }
          80% {
            transform: translateY(100px) translateX(0px) scale(0.1);
          }
          95% {
            transform: translateY(-20px) translateX(0px) scale(1);
          }
          100% {
            transform: translateY(0) translateX(0) scale(1);
          }
        }
        @keyframes nyoki_mole {
          0% {
            transform: translateY(100px) translateX(40px) scale(0.1);
          }
          80% {
            transform: translateY(100px) translateX(40px) scale(0.1);
          }
          95% {
            transform: translateY(-30px) translateX(-18px) scale(1);
          }
          100% {
            transform: translateY(0) translateX(0) scale(1);
          }
        }
        @keyframes nyoki {
          0% {
            transform: translateY(100px) translateX(-30px) scale(0.1);
          }
          80% {
            transform: translateY(100px) translateX(-30px) scale(0.1);
          }
          100% {
            transform: translateY(0) translateX(0) scale(1);
          }
        }
        @keyframes dropBounce {
          0% {
            transform: translateY(-100vh);
          }
          50% {
            transform: translateY(-100vh);
          }
          80% {
            transform: translateY(-100vh);
          }
          90% {
            transform: translateY(0);
          }
          95% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes moveAndRotate {
          0% {
            transform: translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateX(3px) rotate(1deg);
          }
          100% {
            transform: translateX(0px) rotate(0deg);
          }
        }
        @keyframes rabitJump {
          0%,
          20%,
          50%,
          80%,
          90% {
            transform: translateY(0) rotate(0deg);
          }
          93% {
            transform: translateY(-10px) rotate(0deg);
          }
          95% {
            transform: translateY(0) rotate(0deg);
          }
          98% {
            transform: translateY(-6px) rotate(0deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
      `}</style>
    </>
  );
};
