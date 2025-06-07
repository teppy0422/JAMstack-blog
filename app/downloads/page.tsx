import React from "react";
import fs from "fs";
import path from "path";

import Ui from "./client";
import { Text } from "@chakra-ui/react";

export const metadata = {
  title: "DOWNLOADS",
  description: "各アプリのダウンロードと簡単な説明をまとめたページ",
  openGraph: {
    images: [
      {
        url: "/images/illust/hippo/hippo_007_pixcel.gif",
        width: 1200,
        height: 630,
        alt: "DOWNLOADSのサムネイル",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/illust/hippo/hippo_007_pixcel.gif"],
  },
};
const Downloads = async () => {
  return (
    <>
      <Text ml={4} className="print-only">
        ※別紙3
      </Text>
      <Ui />
    </>
  );
};
export default Downloads;
