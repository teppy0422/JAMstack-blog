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
      <head>{/* 必要ならここに <meta> などを入れる */}</head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
