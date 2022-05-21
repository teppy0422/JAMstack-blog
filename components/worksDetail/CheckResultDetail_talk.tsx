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
import Talk from "../worksDetail/talk";
export default function CheckResultDetail_talk() {
  return (
    <Container
      w={["100%", "95%", "90%", "80%"]}
      m="auto"
      className={styles.workDetail}
    >
      <Box mt={3}>
        <Badge m={1} colorScheme="green">
          Excel-vba
        </Badge>
        <Badge m={1} colorScheme="orange">
          html
        </Badge>
        <Badge m={1} colorScheme="blue">
          css
        </Badge>
        <Badge m={1} colorScheme="yellow">
          javascript
        </Badge>
      </Box>
      <Text className={styles.subTitle}>Model Case</Text>
      <Box style={{ position: "relative" }}>
        <Image src="/images/check_image.png" w={["80%", "80%", "70%", "70%"]} />
        <Badge
          backgroundColor="rgba(255,255,255,0.4)"
          position="absolute"
          top={0}
          m={3}
          p={1}
          fontWeight={600}
          fontSize="18px"
        >
          接続検査の不具合表示
        </Badge>
      </Box>
      <Text className={styles.subTitle}>取り組む内容を決める</Text>
      <Talk say="娘「とことこ」" />
      <Talk say="娘「ねぇパパ、WEB技術を使えそうな問題は見つかった?" />
      <Talk say="わい「それよりお風呂入る時間やで」" />
      <Talk say="娘「...」" />
      <Talk say="わい「あ、そういえばな、自社開発の検査システム画面がWEBっぽいんや」" />
      <Talk say="娘「どうしてWEBっぽいって思うの？」" />
      <Talk say="わい「検査結果がNGの時、こんな画面が表示されるんや」" />
      <Image
        src="/images/check_404.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Talk say="娘「す、すごい、WEBっぽい」" />
      <Talk say="わい「見た事あるなーと思ってたらWEB検索で見かける画面だったんや」" />
      <Talk say="娘「この画面はページが無かった時のものだね」" />
      <Talk say="娘「で、このシステムに何か問題があるの？」" />
      <Talk say="わい「NGが発生しても4桁の番号とこの画面が表示されるだけなんや」" />
      <Image
        src="/images/detail_02_404andYCC.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Talk say="娘「どこがNGなのか分からないね」" />
      <Talk say="わい「これは10番と33番が正しく繋がってないという意味なんやけどな」" />
      <Talk say="わい「どこの部品なのかは番号から図面で探すんや」" />
      <Talk say="娘「前に見てたあの長い図面？」" />
      <Talk say="わい「そうや長さ6メートルとかあるやつや」" />
      <Talk say="娘「間違い探しみたい、楽しそー」" />
      <Talk say="わい「間違い探しに時間が掛かったら残業や」" />
      <Talk say="娘「わー、大変そう」" />
      <Talk say="わい「うん、だからNGの時に不具合箇所が表示できたらと思ったんや」" />
      <Text className={styles.subTitle}>目的を考える</Text>
      <Talk say="娘「問題は残業だけ？」" />
      <Talk say="わい「うーん、まとめるとこんな感じだと思ったやで」" />
      <Box className={styles.quote}>
        1.NGが出る <br />
        ↓<br />
        2.探すのに時間が掛かる
        <br />
        ↓
        <br />
        3.残業になる
        <br />
        ↓
        <br />
        4.不良を出した人が暗に責められる
      </Box>
      <Talk say="娘「暗に責められるって？」" />
      <Talk say="わい「手作業だから不良が出るのは仕方ないって事はみんな分かってるんや」" />
      <Talk say="わい「でも分かってても残業になったら不満が出るんや」" />
      <Talk say="娘「人間の性ってやつだね」" />
      <Talk say="わい「これが現実なんや」" />
      <Talk say="わい「目的をまとめたらこうや」" />
      <Box className={styles.quote}>
        ・会社の残業を減らす
        <br />
        <br />
        ・現場の不満を減らす
      </Box>
      <Talk say="娘「あとは作るだけだね」" />
      <Talk say="🐤「でもな、その画面を表示させる方法が分からんのや」" />
      <Talk say="娘「それは簡単だよ」" />
      <Talk say="わい「な、なんやてー」" />
      <Text className={styles.subTitle}>作り方</Text>
      <Talk say="娘「いままでの話をまとめると、こういう事だと思うの」" />
      <Image
        src="/images/check_flow_2.png"
        w={["90%", "90%", "80%", "80%"]}
        my={3}
      />
      <Talk say="" />
      <Talk say="" />
      <Talk say="" />
      <Talk say="" />
      <Talk say="" />
      <Talk say="" />
      <Talk say="" />
      <Talk say="" />
      <Talk say="" />
      <Talk say="" />
      わい「つまり、どういう事や？」
      <br />
      娘「WEBページを作ったらエラー時に表示されるって事ね」
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
      わい「第1話で作った画像を出力してWEB技術で表示/点滅させたんや」
      <br />
      わい（娘ちゃんに教えてもらった通りにしただけやけどな）
      <Image
        src="/images/check_flow.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      娘「WEBの基本通り作った感じだね」
      <br />
      わい「ありがとうやで」
      <br />
      娘「で、どんな表示画面を作ったの？」
      <br />
      わい「こんな感じや」
      <br />
      <Image
        src="/images/check_302.gif"
        w={["80%", "80%", "70%", "70%"]}
        my={3}
      />
      娘「あ、点滅してるねー」
      <br />
      娘「この場合はエラー番号が1337って事？」
      <br />
      わい「そうや、点滅箇所の配線が間違えてるって事やな」
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
      娘「そんなに速くないけど安定感と安いのが魅力なの」
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
      <Text className={styles.subTitle}>次回..</Text>
      <Text>マイコンが必要な問題を探すワイ</Text>
    </Container>
  );
}
