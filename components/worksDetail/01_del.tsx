import { Text, Box, Container, Image, Stack, Badge } from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";
import SjpChart01 from "./01_chart_1";

export default function SjpDetail() {
  return (
    <Container
      w={["100%", "95%", "90%", "80%"]}
      m="auto"
      className={styles.workDetail}
    >
      <Stack direction="row">
        <Badge colorScheme="green">Excel-vba</Badge>
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
        メーカーから図面が渡される図面には。 電線の色/サイズ/接続先が記載。
      </Text>
      <Image
        src="/images/insert_picture.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Text>
        分かり辛く作業効率が悪いので、下図をエクセルで作成して誰でも分かるようにしていました。
      </Text>
      <Image
        src="/images/insert_picture_before.png"
        w={["100%", "90%", "80%", "80%"]}
        my={3}
      />
      <Text className={styles.subTitle}>問題点</Text>
      <Text>
        ・何千パターンも必要で作るのに時間が掛かりすぎる。→残業/休日出勤多すぎ!!
        <br />
        ・ミスがあると不良品が大量生産される。→メーカークレーム!!
      </Text>
      <Text className={styles.subTitle}>改善後</Text>
      <Text>エクセルで自動作成するシステムを作成。</Text>
      <Image src="/images/sjp_flow_01.png" my={3} />
      <Text fontWeight={700} fontSize="20px">
        メニュー画面
      </Text>
      <Text>誰でも操作できる画面を用意。</Text>
      <Image
        src="/images/sjp_menu.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Text fontWeight={700} fontSize="20px">
        成果物
      </Text>

      <Text>
        作成後に変更できるようにオートシェイプを採用。約3秒で1つの画像を作成。
      </Text>
      <Image
        src="/images/sjp_terminal_520.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />

      <Text className={styles.subTitle}>効果</Text>
      <Text>画像作成時間を大幅に短縮。</Text>
      <SjpChart01 />

      <Text className={styles.subTitle}>講演会</Text>
      <Text>
        この取り組みが評価されて他会社でも使用できるように説明会を開きました。
      </Text>
      <Image
        src="/images/sjp_pannel.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <br />
      <Text>この自動作成した画像を他の取り組みで使っていきます。</Text>
    </Container>
  );
}
