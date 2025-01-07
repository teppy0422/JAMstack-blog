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
import { useLanguage } from "../../context/LanguageContext";
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
      <Stack direction="row" mt={3}>
        <Badge colorScheme="green">Excel-vba</Badge>
      </Stack>
      <Stack direction={["column", "row"]} spacing="16px">
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
              ja: "メーカーから送られてくるテキストデータを読み込んで、生産に必要な画像データを自動作成するシステムを作成。従来は手動で作成していたので時間がかかり、深夜残業が多く離職の原因になっていた。他の工場でも使う事を想定して作成。",
              us: "Created a system that reads text data sent from manufacturers and automatically creates image data needed for production. Previously, the data was created manually, which was time-consuming and resulted in a lot of late-night overtime work, which was a cause of employee turnover. The system was created with the assumption that it would be used at other factories as well.",
              cn: "我们创建了一个系统，用于读取制造商发送的文本数据，并自动创建生产所需的图像数据。在此之前，这些数据都是手工创建的，不仅耗时，而且需要在深夜加班，这也是造成人员流失的一个原因。创建该系统的前提是，其他工厂也将使用该系统。",
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
              ja: "エクセルのブックにバージョンアップ機能を追加",
              us: "Upgrade function added to Excel book.",
              cn: "Excel 电子书中增加了版本功能。",
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
              cursor="pointer"
            >
              <Image src="/images/sjp_menu.png" />
            </Box>
            <Box
              boxShadow="lg"
              className={styles.pic}
              onClick={(e) => changeImage(e)}
              boxSize="80px"
              overflow="hidden"
              cursor="pointer"
            >
              <Image src="/images/sjp_terminal_520.png" />
            </Box>
            <Box
              boxShadow="lg"
              className={styles.pic}
              onClick={(e) => changeImage(e)}
              boxSize="80px"
              overflow="hidden"
              cursor="pointer"
            >
              <Image src="/images/sjp_pannel.png" />
            </Box>
          </HStack>
          <Box boxShadow="dark-lg" id="mainImage">
            <Image
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
  //取得するクラス名が分からん
  let myid = document.getElementById("mainImage");

  if (myid) {
    myid.innerHTML = e.currentTarget.innerHTML;
  }
}
