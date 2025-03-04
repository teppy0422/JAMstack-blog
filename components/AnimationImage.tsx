import React from "react";
import styled, { keyframes } from "styled-components";

interface AnimationImageProps {
  src: string;
  width: string;
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  translate?: string;
  rotate?: string;
  animation?: string;
}

const AnimationImage: React.FC<AnimationImageProps> = ({
  src,
  width,
  left,
  top,
  right,
  bottom,
  translate,
  rotate,
  animation,
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
        }}
      />
      <style jsx>{`
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

export default AnimationImage;
