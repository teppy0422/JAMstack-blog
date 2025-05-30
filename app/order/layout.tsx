// app/storybook/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "注文",
  themeColor: "#FF69B4",
  icons: {
    icon: "/images/ico/order-cover.png",
    apple: "/images/ico/order-cover.png",
  },
  manifest: "/public/manifest-order.json",
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
