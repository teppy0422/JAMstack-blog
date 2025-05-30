import "@/styles/globals.css"; // グローバルCSS
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "STUDIO+",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* 必要ならここに <meta> などを入れる */}
        <link rel="manifest" href="/public/manifest.json" />
        <meta name="theme-color" content="#F17EFB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Your App Name" />
        <link rel="apple-touch-icon" href="/images/hippo_000_foot.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
