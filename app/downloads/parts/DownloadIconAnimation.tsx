"use client";

import { Box, useColorMode } from "@chakra-ui/react";

export default function DownloadIconAnimation() {
  const { colorMode } = useColorMode();

  return (
    <>
      <Box transform="rotate(270deg)" position="relative" top="-3px">
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          height="28px"
          width="28px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke-miterlimit="10"
            stroke-width="32"
            stroke-dasharray="1350"
            stroke-dashoffset="1350"
            d="M366.05 146a46.7 46.7 0 0 1-2.42-63.42 3.87 3.87 0 0 0-.22-5.26l-44.13-44.18a3.89 3.89 0 0 0-5.5 0l-70.34 70.34a23.62 23.62 0 0 0-5.71 9.24 23.66 23.66 0 0 1-14.95 15 23.7 23.7 0 0 0-9.25 5.71L33.14 313.78a3.89 3.89 0 0 0 0 5.5l44.13 44.13a3.87 3.87 0 0 0 5.26.22 46.69 46.69 0 0 1 65.84 65.84 3.87 3.87 0 0 0 .22 5.26l44.13 44.13a3.89 3.89 0 0 0 5.5 0l180.4-180.39a23.7 23.7 0 0 0 5.71-9.25 23.66 23.66 0 0 1 14.95-15 23.62 23.62 0 0 0 9.24-5.71l70.34-70.34a3.89 3.89 0 0 0 0-5.5l-44.13-44.13a3.87 3.87 0 0 0-5.26-.22 46.7 46.7 0 0 1-63.42-2.32z"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1350"
              to="0"
              dur="3s"
              fill="freeze"
            />
          </path>
          <path
            fill="none"
            stroke-linecap="round"
            stroke-miterlimit="10"
            stroke-width="32"
            stroke-dasharray="10"
            stroke-dashoffset="10"
            d="m250.5 140.44-16.51-16.51m60.53 60.53-11.01-11m55.03 55.03-11-11.01m60.53 60.53-16.51-16.51"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="10"
              begin="4s"
              dur="6s"
              fill="freeze"
            />
          </path>
        </svg>
      </Box>

      <svg
        width="200"
        height="50"
        viewBox="0 0 200 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="textClip">
            <rect x="0" y="0" width="0" height="50">
              <animate
                attributeName="width"
                from="0"
                to="200"
                dur="1s"
                begin="2s"
                fill="freeze"
              />
            </rect>
          </clipPath>
        </defs>
        <text
          x="0"
          y="30"
          fontFamily="'Archivo Black', 'M PLUS Rounded 1c'"
          fontSize="24"
          fill="none"
          stroke={colorMode === "light" ? "Orange" : "white"}
          strokeWidth="2"
          strokeDasharray="200"
          strokeDashoffset="200"
        >
          DOWNLOAD
          <animate
            attributeName="stroke-dashoffset"
            from="200"
            to="0"
            dur="3s"
            fill="freeze"
          />
        </text>
        <text
          x="0"
          y="30"
          fontFamily="'Archivo Black', 'M PLUS Rounded 1c'"
          fontSize="24"
          fill={colorMode === "light" ? "#333" : "#111"}
          clipPath="url(#textClip)"
        >
          DOWNLOAD
        </text>
      </svg>
    </>
  );
}
