import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "譜読み練習",
  themeColor: "#1a1a2e",
  icons: {
    icon: "/images/ico/score-icon-192.png",
    apple: "/images/ico/score-icon-192.png",
  },
  manifest: "/manifest-score.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function ScoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
