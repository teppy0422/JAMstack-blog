// app/storybook/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "受注",
  themeColor: "#FF69B4",
  icons: {
    icon: "/images/ico/orderAdmin-cover.png",
    apple: "/images/ico/orderAdmin-cover.png",
  },
  manifest: "/public/manifest-orderAdmin.json",
};

export default function StorybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
