// app/storybook/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "えほん",
  themeColor: "#FF69B4",
  icons: {
    icon: "/images/ico/storybook-cover.png",
    apple: "/images/ico/storybook-cover.png",
  },
  manifest: "/manifest-storybook.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function StorybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
