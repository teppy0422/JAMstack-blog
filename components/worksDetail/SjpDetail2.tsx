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
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";
import SjpChart01 from "../worksDetail/SjpChart01";

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
      <Stack direction="row" mt={3}>
        <Badge colorScheme="green">Excel-vba</Badge>
      </Stack>
      <Stack
        direction={["column", "row"]}
        spacing="16px"
        className={styles.simple}
      >
        <Box w="320px" p={3} className={styles.side}>
          <Text className={styles.borderText}>簡単な説明</Text>
          <Text
            className={styles.text}
            style={{ fontSize: "14px", marginTop: "20px" }}
          >
            メーカーから送られてくるテキストデータを読み込んで、生産に必要な画像データを自動作成するシステムを作成。
            従来は手動で作成していたので時間がかかり、深夜残業が多く離職の原因になっていた。
            他の工場でも使う事を想定して作成。
          </Text>
          <Text className={styles.borderText}>特記</Text>
          <Text className={styles.text} style={{ fontSize: "14px" }}>
            エクセルのブックにバージョンアップ機能を追加
          </Text>
        </Box>
        <VStack w={["320px", "448px", "640px", "880px"]}>
          <HStack my={3} bg="gray.50">
            <Box boxShadow="lg" className={styles.pic}>
              <Image
                onClick={(e) => changeImage(e)}
                src="/images/sjp_menu.png"
                boxSize="80px"
                objectFit="cover"
              />
            </Box>
            <Box boxShadow="lg" className={styles.pic}>
              <Image
                onClick={(e) => changeImage(e)}
                src="/images/sjp_terminal_520.png"
                boxSize="80px"
                objectFit="cover"
              />
            </Box>
            <Box boxShadow="lg" className={styles.pic}>
              <Image
                onClick={(e) => changeImage(e)}
                src="/images/sjp_pannel.png"
                boxSize="80px"
                objectFit="cover"
              />
            </Box>
          </HStack>
          <Box boxShadow="lg">
            <Image
              id="mainImage"
              className={styles.mainImage}
              my={0}
              src="/images/sjp_menu.png"
              w="100%"
              objectFit="contain"
            />
          </Box>
        </VStack>
      </Stack>
    </Container>
  );
}
//クリックで画像を変える
function changeImage(e) {
  // 親要素をから複数の子要素を取得
  let parent = e.currentTarget.parentNode;
  let children = parent.children[0];
  let changeSrc = children.src;

  //取得するクラス名が分からん
  // document.querySelector(".css-sim8z3").setAttribute("src", changeSrc);

  let myid = document.getElementById("mainImage");
  myid.setAttribute("src", changeSrc);
}
