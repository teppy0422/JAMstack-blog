export const metadata = {
  title: "誘導ポイント設定一覧表の使い方",
  description:
    "誘導ポイント設定一覧表の使い方・ダウンロードから設定方法などを解説します。",
  openGraph: {
    images: [
      {
        url: "/images/illust/hippo/hippo_016.png",
        width: 1200,
        height: 630,
        alt: "誘導ポイント設定一覧表のサムネイル",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/illust/hippo/hippo_016.png"],
  },
};

import BlogPage from "./client";

export default function Page() {
  return <BlogPage />;
}
