import { Center, Button } from "@chakra-ui/react";
export default function imageCardOmit(pops) {
  const property = {
    name: pops.name,
  };
  return (
    <>
      <Center>
        <Button>簡易版を見る</Button>
        <Button>詳しく見る(茶番劇)</Button>
      </Center>
    </>
  );
}
