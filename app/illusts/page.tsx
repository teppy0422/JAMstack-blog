import React from "react";
import IllustsClient from "./illustsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "STUDIO+ イラスト",
  description: "",
  openGraph: {
    title: "STUDIO+ イラスト",
    description: "",
    url: "https:/teppy.link/illusts",
    siteName: "STUDIO+",
    images: [
      {
        url: "https://www.teppy.link/images/illust/hippo/hippo_ct125_r.gif", // .gif 可
        width: 1200, // 推奨：1200
        height: 630, // 推奨：630
        alt: "STUDIO+のイラスト - OGP",
        type: "image/gif", // .gif の場合は明示しておくとよい
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};

export default function Illusts() {
  return <IllustsClient />;
}
