// app/storybook/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "受注",
  themeColor: "#73c7c7",
  icons: {
    icon: "/images/ico/orderAdmin-cover.png",
    apple: "/images/ico/orderAdmin-cover.png",
  },
  manifest: "/manifest-orderAdmin.json",
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
