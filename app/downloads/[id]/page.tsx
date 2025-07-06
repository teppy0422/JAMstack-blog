import Ui from "../client";
import { Text } from "@chakra-ui/react";
import { Metadata } from "next";

type Props = {
  params: { id: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  return {
    title: `DOWNLOADS - ${id}`,
    description: `${id} のダウンロード`,
    openGraph: {
      images: [
        {
          url: "/images/illust/hippo/hippo_007_pixcel.gif",
          width: 1200,
          height: 630,
          alt: `DOWNLOADS ${id} のサムネイル`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/images/illust/hippo/hippo_007_pixcel.gif"],
    },
  };
}
export default function AppDetailPage({ params }: Props) {
  const id = params.id;
  return (
    <>
      <Text ml={4} className="print-only">
        ※別紙3
      </Text>
      <Ui filterId={id} />
    </>
  );
}
