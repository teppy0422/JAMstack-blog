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
import getMessage from "@/utils/getMessage";

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
              ja: "配線ミスがあった場合、間違い箇所と正常な状態が分かる画像を自動表示させました。それまではエラー番号(0-2000番)を図面から探していました。",
              us: "In the event of a wiring error, an image showing the wrong part and the normal state is automatically displayed. Until then, the error number (0-2000) was searched from the drawing.",
              cn: "如果出现接线错误，则会自动显示错误部件和正常状态的图像。在此之前，必须从图纸中查找错误编号（0-2000）。",
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
              ja: "Windows7でも点滅箇所がズレないようJavaScriptで点滅させる事に苦労しました。",
              us: "Even in Windows 7, we had trouble making the blinking points blink with JavaScript so that they would not be misaligned.",
              cn: "即使在 Windows 7 中，也很难通过 JavaScript 使闪烁点闪烁，从而使其不会移动。",
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
              my={0}
              src="/images/check_302.gif"
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
