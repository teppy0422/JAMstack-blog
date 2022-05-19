import { Text, Box, Container, Image, Stack, Badge } from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";
import SjpChart01 from "../worksDetail/SjpChart01";

export default function SjpDetail_talk() {
  return (
    <Container
      w={["100%", "95%", "90%", "80%"]}
      m={[0, 1, 2, "30px"]}
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
      <Text className={styles.subTitle}>なぜ画像が必要なのか？</Text>
      <Text className={styles.text}>
        娘「どうして画像が必要なの？」 <br />
        わい「それがな、ちょっと見てみ。これがメーカーから渡される図面や」
      </Text>
      <Image
        src="/images/insert_picture.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Text className={styles.text}>
        娘「うわぁー記号と数字ばかりだね」
        <br />
        わい「そうなんや、情報量は多いんやけどな」
        <br />
        娘「この
        <Badge colorScheme="blue">L</Badge>
        ってどういう意味なの？」
        <br />
        わい「その記号は
        <Badge colorScheme="blue">青色の電線</Badge>
        って意味やで」
        <br />
        娘「青は
        <Badge colorScheme="blue">BLUE</Badge>だからBじゃないの？」
        <br />
        わい「黒が
        <Badge colorScheme="gray">BLACK</Badge>
        で同じBになるから、2番目の
        <Badge colorScheme="blue">L</Badge>になったんやな」
        <br />
        娘「・・・」
        <br />
        娘「専門家じゃないと作業できないね」
        <br />
        わい「だから誰でも作業が出来るように次のような画像を作るんやで」
      </Text>
      <Image
        src="/images/insert_picture_before.png"
        w={["100%", "90%", "80%", "80%"]}
        my={3}
      />
      <Text className={styles.text}>
        娘「わぁこれがあれば私でも作業できるね」 <br />
        娘「でも作る人が大変そう。。」
        <br />
        わい「そうなんや、1枚を作るのに30分くらい掛かるんやけどな。これを2ヶ月で300枚くらい作る必要があるんやで」
        <br />
        娘「そんなに！」
        <br />
        わい「しかもミスは許されないから大変なんや」
        <br />
        娘「ミスがあったらどうなるの？」
        <br />
        わい「検査の時に見つかるんやけどな、見つかった時には大量の不良品が出来てるんや」
        <br />
        娘「不良品は捨てるの？」
        <br />
        わい「そんなもったいない事はせんよ。みんなで仲良く残業して手直しやな」
        <br />
        娘「ミスした人がかわいそう」
        <br />
        わい「せやろ？だからこれを自動作成するようにしたんや」
        <br />
        娘「わーい」
      </Text>
      <Text className={styles.subTitle}>エクセルで作る</Text>
      <Text className={styles.text}>
        娘「エクセルで作る事にしたの？」
        <br />
        わい「そうやで」
        <br />
        娘「エクセルって印刷したらズレるし画像の扱いは向いてないんじゃないの？」
        <br />
        わい「よく知ってるな」
        <br />
        娘「うん、昨日ともだちとその話で盛り上がったよ」
        <br />
        わい「どんな会話や。。」
        <br />
        わい「とにかく会社ではエクセルが正義なんや」
        <br />
        わい「それにな、画像形式にしたら後から変更が難しくなるんや」
        <br />
        娘「エクセルのオートシェイプなら後から誰でも編集が出来るって事？」
        <br />
        わい「そ、そういう事やな」
        <br />
        わい「とりあえずこういうイメージやな」
      </Text>
      <Image src="/images/sjp_flow_01.png" my={3} />
      <Text className={styles.subTitle}>2週間後</Text>
      <Text className={styles.text}>
        娘「パパー出来た？」
        <br />
        わい「できたで、見てくれるか？」
        <br />
        娘「みるみるー」
      </Text>
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
