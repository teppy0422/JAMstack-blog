import React, { useState, useEffect } from "react";
import { Box, PlacementWithLogical, Tooltip } from "@chakra-ui/react";

import styled, { keyframes } from "styled-components";

interface AnimationImageProps {
  sealSize?: string;
  src: string;
  width?: string;
  height?: string;
  left?: string;
  top?: string;
  right?: string;
  bottom?: string;
  rotate?: string;
  animation?: string;
  id?: string;
  position?: React.CSSProperties["position"];
  label?: string;
  labelPlacement?: PlacementWithLogical;
  objectFit?: React.CSSProperties["objectFit"];
  transformOrigin?: string;
}
export const AnimationImage: React.FC<AnimationImageProps> = ({
  sealSize = "2",
  src,
  width,
  height,
  left,
  top,
  right,
  bottom,
  rotate,
  animation,
  id,
  position = "absolute",
  label,
  labelPlacement,
  objectFit = "cover",
  transformOrigin,
}) => {
  const numericSealSize = Number(sealSize);
  const isGif = src.endsWith(".gif");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isGif) {
      const img = document.getElementById(id || "") as HTMLImageElement;
      if (img) {
        img.src = src;
        setIsPlaying(true);
      }
    }
  }, [src, id, isGif]);

  return (
    <>
      {/* #outline-filterはpages/_app.tsxに書いてる。ここに書いたらウィンドウ幅が狭くなった時にfloodColorが効かなくなる */}
      <Tooltip
        label={label}
        hasArrow
        placement={labelPlacement}
        paddingY="4px"
        paddingX="5px"
        borderRadius="5px"
      >
        <img
          src={src}
          id={id}
          onClick={() => {
            if (isGif) {
              const img = document.getElementById(id || "") as HTMLImageElement;
              if (img) {
                img.src = src;
                setIsPlaying(true);
              }
            }
          }}
          style={{
            position: position,
            cursor: isGif ? "pointer" : "",
            width: width,
            height: height,
            left: left,
            top: top,
            right: right,
            bottom: bottom,
            rotate: `${rotate}`,
            animation: `${animation}`,
            filter:
              numericSealSize > 0
                ? "url(#outline-filter) drop-shadow(1px 1px 3px rgba(0, 0, 0, 1))"
                : "none",
            objectFit: objectFit,
            transformOrigin: transformOrigin,
          }}
        />
      </Tooltip>
      <svg width="0" height="0">
        <defs>
          <filter
            id="outline-filter"
            filterUnits="objectBoundingBox"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feMorphology
              operator="dilate"
              radius="2"
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
            <feMerge>
              <feMergeNode in="outline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <style jsx>{`
        @keyframes sway {
          0% {
            transform: rotate(0deg) translateX(0px);
          }
          15% {
            transform: rotate(2deg) translateX(1px);
          }
          30% {
            transform: rotate(1deg) translateX(0.5px);
          }
          50% {
            transform: rotate(5deg) translateX(2px);
          }
          70% {
            transform: rotate(2.5deg) translateX(1px);
          }
          100% {
            transform: rotate(0deg) translateX(0px);
          }
        }
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
        @keyframes moveHorizontal {
          0% {
            transform: translateX(0) scaleX(1);
          }
          25% {
            transform: translateX(50%) scaleX(1);
          }
          50% {
            transform: translateX(100%) scaleX(-1);
          }
          75% {
            transform: translateX(50%) scaleX(-1);
          }
          100% {
            transform: translateX(0) scaleX(1);
          }
        }
        @keyframes floatUpDown {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
