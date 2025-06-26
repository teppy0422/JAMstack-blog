"use client";

import { Box, chakra } from "@chakra-ui/react";
import { ReactNode } from "react";

type LiquidGlassProps = {
  children: ReactNode;
};

export default function LiquidGlass({ children }: LiquidGlassProps) {
  return (
    <Box position="fixed" top="0" left="0" w="100vw">
      <Box position="relative" overflow="hidden">
        {/* SVGフィルター定義（非表示） */}
        <svg style={{ display: "none" }}>
          <filter
            id="glass-distortion"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves="1"
              seed="3"
              result="turbulence"
            />
            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
              <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
              <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
            <feSpecularLighting
              in="softMap"
              surfaceScale="5"
              specularConstant="1"
              specularExponent="100"
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>
            <feComposite
              in="specLight"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="litImage"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softMap"
              scale="150"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>

        {/* ガラス効果レイヤー */}
        <Box
          position="absolute"
          inset={0}
          zIndex={0}
          backdropFilter="blur(3px)"
          sx={{ filter: "url(#glass-distortion)" }}
          isolation="isolate"
        />

        {/* Tintレイヤー */}
        <Box
          position="absolute"
          inset={0}
          zIndex={1}
          bg="rgba(255, 255, 255, 0.25)"
        />

        {/* Shineレイヤー */}
        <Box
          position="absolute"
          inset={0}
          zIndex={2}
          boxShadow="inset 1px 1px 1px 0 rgba(255,255,255,0.5),
                   inset -0.5px -0.5px 0.5px 0.5px rgba(255,255,255,0.5)"
        />

        {/* 実際のコンテンツ */}
        <Box position="relative" zIndex={3} fontWeight="semibold">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
