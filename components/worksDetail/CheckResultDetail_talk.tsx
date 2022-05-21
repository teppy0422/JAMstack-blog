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

export default function CheckResultDetail_talk() {
  return (
    <Container
      w={["100%", "95%", "90%", "80%"]}
      m="auto"
      className={styles.workDetail}
    >
      <Stack direction="row" mt={3}>
        <Badge colorScheme="green">Excel-vba</Badge>
        <Badge colorScheme="orange">html</Badge>
        <Badge colorScheme="blue">css</Badge>
        <Badge colorScheme="yellow">javascript</Badge>
      </Stack>
      <Text className={styles.subTitle}>Model Case</Text>
      <Box style={{ position: "relative" }}>
        <Image src="/images/check_image.png" w={["80%", "80%", "70%", "70%"]} />
        <Text
          position="absolute"
          top={0}
          m={3}
          p={1}
          fontWeight={500}
          fontSize="18px"
          backgroundColor="rgba(255, 255, 255, .8)"
        >
          接続検査の不具合表示
        </Text>
      </Box>
      <Text className={styles.subTitle}>取り組む内容を決める</Text>
      <Text className={styles.text}>
        娘「とことこ」
        <br />
        娘「ねぇパパ、WEB技術を使えそうな問題は見つかった？」
        <br />
        わい「それよりお風呂入る時間やで」
        <br />
        娘「...」
        <br />
        わい「あ、そういえばな、自社開発の検査システム画面がWEBっぽいんや」
        <br />
        娘「どうしてWEBっぽいって思うの？」
        <br />
        わい「検査結果がエラーの時、こんな画面が表示されるんや」
        <br />
      </Text>
      <Image
        src="/images/check_404.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Text className={styles.text}>
        娘「す、すごい、WEBっぽい」
        <br />
        わい「見た事あるなーと思ってたらサイト検索でたまに見る画面だったんや」
        <br />
        娘「この画面はHttpリクエストに対してページが無かった時のものだね」
        <br />
        娘「で、このシステムに何か問題があるの？」
        <br />
        わい「エラーが発生しても4桁の番号が表示されるだけなんや」
        <br />
        娘「それが問題なの」
        <br />
        わい「そうや、番号だけだとどこがエラーなのか分からないやろ？」
        <br />
        わい「こんな画面なんや」
        <br />
        <Image
          src="/images/check_YCC_error.png"
          w={["80%", "80%", "70%", "70%"]}
          my={3}
        />
        わい「これは10番と33番が正しく繋がってないという意味やな」
        <br />
        娘「わかんない」
        <br />
        わい「だから大きい図面(4m)を広げて番号を探すけど時間が掛かるんや」
        <br />
        娘「番号は何番まであるの？」
        <br />
        わい「製品の大きさにもよるけど1000番くらいまでやな」
        <br />
        娘「わー、大変そう」
        <br />
        わい「そうなんや、だからエラーの時に不具合箇所が表示できたらと思ったんや」
        <Text className={styles.subTitle}>目的の背景</Text>
        娘「それは誰かの為になるの？」
        <br />
        わい「不具合箇所を探すのに時間が掛かれば残業になるんや」
        <br />
        わい「その結果、不良を出した人が暗に責められるんや」
        <br />
        娘「かわいそう」
        <br />
        娘「不具合箇所がすぐに分かれば問題は解決できるってこと？」
        <br />
        わい「そうやで、でもな、その画面を表示させる方法が分からんのや」
        <br />
        娘「それは簡単だよ」
        <br />
        わい「な、なんやてー」
        <Text className={styles.subTitle}>作り方</Text>
        娘「いままでの話をまとめるとね、こういう事だと思うの」
        <Image
          src="/images/check_flow_2.png"
          w={["90%", "90%", "80%", "80%"]}
          my={3}
        />
        わい「つまりどういう事？」
        <br />
        娘「WEBページを作成したらエラー時に表示されるって事ね」
        <br />
        わい「そ、そうか」
        <br />
        わい「でもそうなると一つの製品で1000ページも作る事になるで」
        <br />
        娘「パパの得意なEXCEL-vbaで自動作成すればいいと思うの」
        <br />
        わい「自動作成できるの？」
        <br />
        娘「うん、EXCEL-vbaはテキストファイルを作成できるよね？」
        <br />
        わい「できるで」
        <br />
        娘「WEBページはテキストファイルがあれば作れるよ」
        <br />
        わい「そうなんか、じゃあ、お風呂入ってからWEBページの作り方を教えてくれるか」
        <br />
        娘「うん、すぐにお風呂入ってくるねー」
        <br />
        わい（こういう流れだと素直にお風呂行くんだよなー）
        <Text className={styles.subTitle}>1週間後...</Text>
        娘「パパー、できたー？」
        <br />
        わい「できたやで、こんな感じで作ったんや」
        <br />
        わい（娘ちゃんに教えてもらった通りにしただけやけどな）
        <Image
          src="/images/check_flow.png"
          w={["100%", "100%", "90%", "90%"]}
          my={3}
        />
        娘「これでWEBの基本が出来るようになったね」
        <br />
        わい「ありがとうやで」
        <br />
        娘「で、どんな表示画面になったの？」
        <br />
        わい「こんな感じや」
        <br />
        <Image
          src="/images/check_302.gif"
          w={["80%", "80%", "70%", "70%"]}
          my={3}
        />
        娘「点滅してるねー」
        <br />
        娘「この場合はエラー番号が1337って事？」
        <br />
        わい「そうや、この場所の配線が間違えてるって事やな」
        <br />
        娘「すぐに不具合箇所が分かるね」
        <br />
        わい「娘ちゃんのおかげやで」
        <br />
        娘「えへへ」
        <br />
        わい「ところでな、上の方の娘ちゃんが書いた図でマイコンってあったけどあれば何なん？」
        <br />
        娘「あれはマイクロコンピューターの略だよ」
        <br />
        娘「パソコン程、動きは速くないけど安定感と安いのが魅力なの」
        <br />
        わい「む、娘ちゃんは機械のプログラミングもできるの？」
        <br />
        娘「うん、基本的な部品なら使えるよー」
        <br />
        わい「じゃあ、また必要な時に教えてくれるか」
        <br />
        娘「はーい」
        <br />
        わい（なんなんやこの娘ちゃんは...）
        <Text className={styles.subTitle}>実際の使用動画</Text>
        <video
          src="/images/check_movie.mp4"
          muted
          loop
          autoPlay
          playsInline
        ></video>
      </Text>

      <Text className={styles.subTitle}>次回..</Text>
      <Text>マイコンが必要な問題を探すワイ</Text>
    </Container>
  );
}
