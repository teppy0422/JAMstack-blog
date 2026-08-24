export const metadata = {
  title: "切断工程直接作業支援システムの使い方",
  description: "切断工程直接作業支援システム",
  openGraph: {
    images: [
      {
        url: "/images/illust/hippo/hippo_019.png",
        width: 1200,
        height: 630,
        alt: "切断工程直接作業支援システムのサムネイル",
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
