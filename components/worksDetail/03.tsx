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
import styles from "@/styles/home.module.scss";

import { useLanguage } from "../../src/contexts/LanguageContext";
import getMessage from "../../components/getMessage";

export default function SjpDetail() {
  const { language, setLanguage } = useLanguage();

  return (
    <Container
      className={styles.workDetail}
      w={["100%", "100%", "100%", "100%"]}
      bg="rgba(255,255,255,0.05)"
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
          <Text className={styles.borderText}>
            {getMessage({
              ja: "簡単な説明",
              us: "Brief Description",
              cn: "简要说明",
              language,
            })}
          </Text>
          <Text
            className={styles.text}
            style={{ fontSize: "14px", marginTop: "20px" }}
          >
            {getMessage({
              ja: "直感的に作業内容が分かる事を意識して作成しました。作業エリアが広い(横幅6m)為、ディスプレイを自動移動させる事にしました。アプリ(VB.net)でWEBブラウザとArduinoをしました。QRリーダーで操作。必要な部品は3DプリンタやNCフライスで作成。",
              us: "We created this display with an intuitive understanding of what we were working on. Because the work area is large (6m wide), we decided to move the display automatically. The application (VB.net) was used for the web browser and Arduino, and the QR reader was used for operation. Necessary parts were made by 3D printer and NC milling machine.",
              cn: "它是根据对工作的直观理解而设计的。工作区域很大（6 米宽），因此我们决定自动移动显示屏。应用程序（VB.net）与网络浏览器和 Arduino 一起使用，Arduino 由 QR 阅读器操作。必要的部件是用三维打印机和数控铣床制作的。",
              language,
            })}
          </Text>
          <Text className={styles.borderText}>
            {getMessage({
              ja: "特記",
              us: "special mention",
              cn: "特别提及",
              language,
            })}
          </Text>
          <Text className={styles.text} style={{ fontSize: "14px" }}>
            {getMessage({
              ja: "この作業が未経験だったので作業者さんに教えてもらいながら一緒に作りました。",
              us: "I had no experience with this process, so the workers taught me how to do it and we made it together.",
              cn: "我没有这方面的经验，所以工人们教我，我们一起做。",
              language,
            })}
          </Text>
        </Box>
        <VStack w={["320px", "448px", "640px", "880px"]}>
          <HStack my={3}>
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

  if (myid) {
    myid.innerHTML = e.currentTarget.innerHTML;
  }
}
