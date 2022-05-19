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

export default function SjpDetail_talk() {
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
        で同じBになるから、2文字目の
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
        娘「でも、作る人が大変そう。。」
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
        娘「え、不良品は捨てちゃうの？」
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
        娘「
        <Badge colorScheme="green">エクセル</Badge>で作る事にしたの？」
        <br />
        わい「そうやで」
        <br />
        娘「<Badge colorScheme="green">エクセル</Badge>
        って印刷したらズレるし画像の扱いは向いてないんじゃないの？」
        <br />
        わい「よく知ってるね」
        <br />
        娘「うん、昨日ともだちとその話で盛り上がったよ」
        <br />
        わい「どんな会話や。。」
        <br />
        わい「とにかく会社では<Badge colorScheme="green">エクセル</Badge>
        を使える人が多いからな、それに合わせるんや」
        <br />
        わい「それにな、画像形式にしたら後から変更が難しくなるんや」
        <br />
        娘「<Badge colorScheme="green">エクセル</Badge>
        のオートシェイプなら後から誰でも編集が出来るって事？」
        <br />
        わい「そ、そういう事やな」
        <br />
        わい「とりあえずこういうイメージやな」
      </Text>
      <Image src="/images/sjp_flow_01.png" my={3} />
      <Text className={styles.subTitle}>2週間後..</Text>
      <Text className={styles.text}>
        娘「パパー出来た？」
        <br />
        わい「できたで、見てくれるか？」
        <br />
        娘「みるみるー」
        <br />
        わい「ほい！」
      </Text>
      <video
        src="/images/sjp_movie_02.mp4"
        muted
        loop
        autoPlay
        playsInline
      ></video>
      <Text className={styles.text}>
        娘「やったー、自動で作成できたね」
        <br />
        娘「ズレる問題はどうやって解決したの？」
        <br />
        わい「取得値 = x とすると出力時に 0.747x<sup>1.0006</sup> にするんや」
        <br />
        娘「ズレるのが等倍じゃないから気付きにくいんだね」
        <br />
        わい「パパも2時間ほどハマったで」
        <br />
        娘「あとは操作メニューを作ったら使ってもらえるね」
        <br />
        わい「せやで、みんな待ってるから今日中に仕上げるやで」
        <br />
        わい（どうして操作メニューって言葉を知ってるんや..）
        <br />
        娘「わくわく」
      </Text>
      <Text className={styles.subTitle}>完成品</Text>

      <video
        src="/images/sjp_movie_01.mp4"
        muted
        loop
        autoPlay
        playsInline
      ></video>

      <Text className={styles.subTitle}>作成した画像</Text>

      <Image
        src="/images/sjp_terminal_520.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Text className={styles.subTitle}>半年後..</Text>
      <Text className={styles.text}>
        娘「ねぇパパ、そういえば画像の自動作成はどうなったの？」
        <br />
        わい「ああ、いまちょうど効果の確認をグラフにしてたんや」
        <br />
        娘「みたいみたい」
        <br />
        わい「こんな感じや」
        <SjpChart01 />
        娘「わぁーすごいすごい」
        <br />
        娘「残業も無くなったんだね」
        <br />
        わい「そうやで、小さいお子さんがいる人には特に評判が良いよ」
        <br />
        娘「遅くまで預かってくれる保育園はこの辺りにないもんね」
        <br />
        わい「そうなんや、あっても倍率が高いしな」
        <br />
        娘「そういうニーズともマッチした取り組みだったんだね」
        <br />
        娘「ご褒美にオムライス作るねー」
        <br />
        わい「わーい」
        <br />
        わい（ニーズって言葉を誰が教えたんや..）
      </Text>
      <Text className={styles.subTitle}>１年後..</Text>
      <Text className={styles.text}>
        娘「パパ、なにしてるの？」
        <br />
        わい「あのプログラムを他の工場でも使えるように変更してるんや」
        <br />
        娘「たのしそー」
        <br />
        娘「でもどうして変更が必要なの？」
        <br />
        わい「他の工場に配った後で、わいが追加した新しい機能を簡単に使えるようにするんや」
        <br />
        娘「バージョンアップ機能って事？」
        <br />
        わい「そうや、最近の子供はよく知ってるな」
        <br />
        わい「スマホアプリみたいにボタン一つで更新できたら便利やろ」
        <br />
        娘「いいね。他の工場の残業問題も解決できそうだね」
        <br />
        わい「できるだけ多くの人に使ってもらいたいからね」
        <br />
        娘「私にできることあるかなー」
        <br />
        わい「オムライス」
        <br />
        娘「はーい」
      </Text>

      <video src="/images/sjp_select_ver.mp4" autoPlay muted loop playsInline />
      <Text className={styles.subTitle}>2年後..</Text>
      <Text>取り組みが評価されて国内で講演会を開きました。</Text>
      <Image
        src="/images/sjp_pannel.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Text className={styles.subTitle}>その後..</Text>
      <Text className={styles.text}>
        娘「ねぇパパ」
        <br />
        娘「あのプログラムはWEB技術と組み合わせたらもっと色んな会社の問題を解決できるんじゃないかな？」
        <br />
        わい「WEB技術？」
        <br />
        娘「うん、HTMLとかCSSとかそういうの」
        <br />
        わい「なんやそれ。。というか何で知ってるん」
        <br />
        娘「さいきん友達とWEB技術ごっこをやってるからね」
        <br />
        わい「なんちゅう幼稚園児や」
        <br />
        わい「でも、わい、そんなのやった事ないし」
        <br />
        娘「大丈夫、わたしがおしえてあげるー」
        <br />
        わい「そ、そうか、じゃあ教えてもらおうかな」
        <br />
        娘「たのしみー」
      </Text>

      <Text className={styles.subTitle}>結果..</Text>
      <Text>娘に流されてWEB技術を学ぶ事になりました</Text>
    </Container>
  );
}
