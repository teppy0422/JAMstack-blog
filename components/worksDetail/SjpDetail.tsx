import { Text, Box, Container } from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";

export default function SjpDetail() {
  return (
    <Container width="100%">
      <Box className={styles.workDetail}>
        <Text className={styles.subTitle}>改善前</Text>
        <Text>
          メーカーから次のような図面が渡されます。
          電線の色/サイズ/接続先が記載されています。
        </Text>
        <NextImage
          src="/images/insert_picture.png"
          width={848}
          height={420}
          layout="responsive"
        ></NextImage>
        <Text>
          分かりづらいのでこのままでは作業できません。次のような画像を作成して誰でも分かるようにする必要があります。エクセルで作成していました。
        </Text>
        <NextImage
          src="/images/insert_picture_before.png"
          width={290}
          height={296.5}
          layout="responsive"
        ></NextImage>
        <Text className={styles.subTitle}>問題点</Text>
        <Text>
          ・何千パターンも必要で作るのに時間が掛かりすぎる。→残業/休日出勤多すぎ!!
          <br />
          ・ミスがあると不良品が大量生産される。→メーカークレーム!!
        </Text>
        <Text className={styles.subTitle}>改善後</Text>
        <Text>エクセルで自動作成するシステムを作成。</Text>
        <NextImage
          src="/images/sjp_menu.png"
          width={496}
          height={383}
          layout="responsive"
        ></NextImage>
      </Box>
    </Container>
  );
}
