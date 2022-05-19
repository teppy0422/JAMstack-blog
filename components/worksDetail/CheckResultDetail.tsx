import {
  Text,
  Box,
  Container,
  Image,
  Stack,
  Badge,
  AspectRatio,
} from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";
import SjpChart01 from "../worksDetail/SjpChart01";

export default function SjpDetail() {
  return (
    <Container
      w={["100%", "95%", "90%", "80%"]}
      m="auto"
      className={styles.workDetail}
    >
      <Stack direction="row">
        <Badge colorScheme="green">Excel-vba</Badge>
        <Badge colorScheme="orange">HTML</Badge>
        <Badge colorScheme="blue">CSS</Badge>
        <Badge colorScheme="yellow"> JavaScript</Badge>
      </Stack>
      <Text className={styles.subTitle}>Model Case</Text>
      <Box style={{ position: "relative" }}>
        <Image
          src="/images/img_wireharness.png"
          w={["100%", "100%", "90%", "90%"]}
        />
        <Text
          position="absolute"
          top={0}
          m={3}
          p={1}
          fontWeight={500}
          fontSize="18px"
          backgroundColor="rgba(255, 255, 255, .8)"
        >
          部品に電線を接続していく工場の場合
        </Text>
      </Box>
      <Text className={styles.subTitle}>改善前</Text>
      <Text>
        配線が間違っていると検査機がエラー番号を表示します。その番号を図面から探して正しい配線を調べるのが手間でした。
      </Text>
      <Text className={styles.subTitle}>改善後</Text>
      <Text>エクセルでエラー時に表示する画面を自動作成。</Text>
      <Image src="/images/check_flow.png" my={3} />
      <Text className={styles.subTitle}>成果物</Text>
      <Text>古いPC(IE6)で動作させるのに苦労しました。</Text>
      <Image
        src="/images/check_302.gif"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Image
        src="/images/check_401.gif"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Text className={styles.subTitle}>実際の使用動画</Text>
      <video
        src="/images/check_movie.mp4"
        muted
        loop
        autoPlay
        playsInline
      ></video>
      <Text className={styles.subTitle}>効果</Text>
      <Text>画像作成時間を大幅に短縮。</Text>
      <SjpChart01 />
      <br />
    </Container>
  );
}
