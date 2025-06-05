export const metadata = {
  title: "注文アプリ",
  description: "受注アプリに注文が送信されます。デザインは4パターン。",
  themeColor: "#FF69B4",
  openGraph: {
    images: [
      {
        url: "/images/ico/order-cover.png",
        width: 1200,
        height: 630,
        alt: "orderのサムネイル",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/ico/order-cover.png"],
  },
  icons: {
    icon: "/images/ico/order-cover.png",
    apple: "/images/ico/order-cover.png",
  },
  manifest: "/manifest-order.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

import OrderBlogPage from "./client";

export default function Page() {
  return <OrderBlogPage />;
}
