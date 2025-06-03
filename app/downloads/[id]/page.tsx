import Ui from "../client";
import { Text } from "@chakra-ui/react";

export default function AppDetailPage({ params }: { params: { id: string } }) {
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
