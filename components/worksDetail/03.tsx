import {
  Text,
  Box,
  Container,
  Image,
  Stack,
  Badge,
  Grid,
  GridItem,
  HStack,
  VStack,
  Center,
} from "@chakra-ui/react";
import styles from "../../styles/home.module.scss";
import SjpChart01 from "./SjpChart01";

export default function SjpDetail() {
  return (
    <Container
      className={styles.workDetail}
      w={["100%", "100%", "100%", "100%"]}
      bg="gray.50"
      minHeight="80vh"
      maxWidth={["100vw", "90vw", "80vw", "70vw"]}
      m="0 auto"
    >
      <Box mt={3}>
        <Badge m={1} colorScheme="green">
          Excel-vba
        </Badge>
        <Badge m={1} colorScheme="orange">
          HTML
        </Badge>
        <Badge m={1} colorScheme="blue">
          css
        </Badge>
        <Badge m={1} colorScheme="yellow">
          JavaScript
        </Badge>
        <Badge m={1} colorScheme="purple">
          VB.net
        </Badge>
        <Badge m={1} colorScheme="teal">
          Arduino
        </Badge>
      </Box>
      <Stack
        direction={["column", "row"]}
        spacing="16px"
        className={styles.simple}
      >
        <Box
          w={["320px", "340px", "360px", "380px"]}
          p={3}
          className={styles.side}
        >
          <Text className={styles.borderText}>簡単な説明</Text>
          <Text
            className={styles.text}
            style={{ fontSize: "14px", marginTop: "20px" }}
          >
            直感的に作業内容が分かる事を意識して作成しました。作業エリアが広い(横幅6m)為、ディスプレイを自動移動させる事にしました。
            アプリ(VB.net)でWEBブラウザとArduinoをしました。QRリーダーで操作。必要な部品は3DプリンタやNCフライスで作成。
          </Text>
          <Text className={styles.borderText}>特記</Text>
          <Text className={styles.text} style={{ fontSize: "14px" }}>
            この作業が未経験だったので作業者さんに教えてもらいながら一緒に作りました。
          </Text>
        </Box>
        <VStack w={["320px", "448px", "640px", "880px"]}>
          <HStack my={3} bg="gray.50">
            <Box
              boxShadow="lg"
              className={styles.pic}
              onClick={(e) => changeImage(e)}
              boxSize="80px"
              overflow="hidden"
            >
              <Image src="/images/detail_03.gif" w="100%" />
            </Box>
            <Box
              boxShadow="lg"
              className={styles.pic}
              onClick={(e) => changeImage(e)}
              boxSize="80px"
              overflow="hidden"
            >
              <Image src="/images/detail_03_4.png" w="100%" />
            </Box>
            <Box
              boxShadow="lg"
              className={styles.pic}
              onClick={(e) => changeImage(e)}
              boxSize="80px"
              overflow="hidden"
            >
              <Image src="/images/detail_03_3.png" w="100%" />
            </Box>
            <Box
              boxShadow="lg"
              className={styles.pic}
              onClick={(e) => changeImage(e)}
              boxSize="80px"
              overflow="hidden"
            >
              <Image src="/images/detail_03_6.png" w="100%" />
            </Box>
          </HStack>
          <Box boxShadow="dark-lg" id="mainImage">
            <Image
              className={styles.mainImage}
              my={0}
              src="/images/detail_03.gif"
              w="100%"
              objectFit="contain"
            />
          </Box>
        </VStack>
        <Box h={[300, 250, 200, 50]} />
      </Stack>
    </Container>
  );
}
//クリックで画像を変える
function changeImage(e) {
  // 親要素をから複数の子要素を取得
  let parent = e.currentTarget.parentNode;
  let children = parent.children[0];
  //取得するクラス名が分からん
  // document.querySelector(".css-sim8z3").setAttribute("src", changeSrc);
  let myid = document.getElementById("mainImage");

  myid.innerHTML = e.currentTarget.innerHTML;
}
