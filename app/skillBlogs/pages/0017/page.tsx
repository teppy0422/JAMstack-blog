export const metadata = {
  title: "ATmega32U4 Pro MicroでUSBキーボードを自作する方法",
  description:
    "ATmega32U4搭載Pro Micro互換ボードを使い、物理ボタンでPCに左右矢印キーを送信するUSBキーボードインターフェイスの作り方",
  openGraph: {
    images: [
      {
        url: "/images/illust/hippo/hippo_019.png",
        width: 1200,
        height: 630,
        alt: "USBキーボードインターフェイス自作のサムネイル",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/illust/hippo/hippo_019.png"],
  },
};

import BlogPage from "./client";

export default function Page() {
  return <BlogPage />;
}
