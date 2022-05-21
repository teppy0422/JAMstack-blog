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
      <Stack direction="row" mt={3}>
        <Badge colorScheme="green">Excel-vba</Badge>
        <Badge colorScheme="orange">HTML</Badge>
        <Badge colorScheme="blue">css</Badge>
        <Badge colorScheme="yellow">JavaScript</Badge>
      </Stack>
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
            配線ミスがあった場合、間違い箇所と正常な状態が分かる画像を自動表示させました。それまではエラー番号(0-2000番)を図面から探していました。
          </Text>
          <Text className={styles.borderText}>特記</Text>
          <Text className={styles.text} style={{ fontSize: "14px" }}>
            20年前のPCでも点滅箇所がズレないようJavaScriptで点滅させる事に苦労しました。
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
              <Image src="/images/sjp_kensarireki_YCC.png" w="100%" />
            </Box>
            <Box
              boxShadow="lg"
              className={styles.pic}
              onClick={(e) => changeImage(e)}
              boxSize="80px"
              overflow="hidden"
            >
              <Image src="/images/check_302.gif" w="100%" />
            </Box>
            <Box
              boxShadow="lg"
              className={styles.pic}
              onClick={(e) => changeImage(e)}
              boxSize="80px"
              overflow="hidden"
            >
              <Image src="/images/check_401.gif" w="100%" />
            </Box>
            <Box
              boxShadow="lg"
              className={styles.pic}
              onClick={(e) => changeImage(e)}
              boxSize="80px"
              overflow="hidden"
            >
              <video
                src="/images/check_movie.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </Box>
          </HStack>
          <Box boxShadow="dark-lg" id="mainImage">
            <Image
              className={styles.mainImage}
              my={0}
              src="/images/sjp_kensarireki_YCC.png"
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
