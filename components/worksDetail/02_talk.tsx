import {
  Text,
  Box,
  Container,
  Image,
  Stack,
  Badge,
  AspectRatio,
  Center,
} from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "@/styles/home.module.scss";
import SjpChart01 from "./01_chart_1";
import Talk from "./talk";

import { useLanguage } from "../../src/contexts/LanguageContext";
import getMessage from "../../components/getMessage";

export default function CheckResultDetail_talk() {
  const { language, setLanguage } = useLanguage();

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
          {getMessage({
            ja: "接続検査の不具合表示",
            us: "Failure indication for connection inspection",
            cn: "连接测试的故障指示",
            language,
          })}
        </Badge>
      </Box>
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "取り組む内容を決める",
          us: "Decide what to work on",
          cn: "决定你想做什么",
          language,
        })}
      </Text>
      <Talk
        say={getMessage({
          ja: "娘「ねぇパパ、WEB技術を使えそうな問題は見つかった?」",
          us: "Dau.「Hey Dad, did you find any problems that could use web technologies?」",
          cn: "女儿「爸爸，你找到可以使用网络技术的问题了吗？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「それよりお風呂入る時間やで」",
          us: "Ya「It's time to take a bath instead」",
          cn: "我「现在是洗澡时间」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「...」",
          us: "Dau.「...」",
          cn: "女儿「...」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「あ、そういえばな、自社開発の検査システム画面がWEBっぽいんや」",
          us: "Ya「Oh, by the way, our in-house inspection system screen looks like a web page」",
          cn: "我「哦，顺便说一下，我们的自家开发的检查系统界面看起来像网页」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「どうしてWEBっぽいって思うの？」",
          us: "Dau.「Why do you think it looks like a web page?」",
          cn: "女儿「你为什么觉得它看起来像网页？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「検査結果がNGの時、こんな画面が表示されるんや」",
          us: "Ya「When the inspection result is NG, this kind of screen is displayed」",
          cn: "我「当检查结果为NG时，会显示这样的画面」",
          language,
        })}
      />
      <Image
        src="/images/check_404.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Talk
        say={getMessage({
          ja: "わい「検査結果がNGの時、こんな画面が表示されるんや」",
          us: "Ya「When the inspection result is NG, this kind of screen is displayed」",
          cn: "我「当检查结果为NG时，会显示这样的画面」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「す、すごい、WEBっぽい」",
          us: "Dau.「Wow, it looks like the web」",
          cn: "女儿「哇，看起来像网页」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「見た事あるなーと思ってたらWEB検索で見かける画面だったんや」",
          us: "Ya「I thought I had seen it before, and it turned out to be a screen I saw in a web search」",
          cn: "我「我想我以前见过，结果是我在网络搜索中看到的画面」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「この画面はページが無かった時のものだね」",
          us: "Dau.「This screen is for when a page is not found」",
          cn: "女儿「这个画面是当页面不存在时的」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「で、このシステムに何か問題があるの？」",
          us: "Dau.「So, is there any problem with this system?」",
          cn: "女儿「那么，这个系统有什么问题吗？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「NGが発生しても4桁の番号とこの画面が表示されるだけなんや」",
          us: "Ya「Even if NG occurs, only a four-digit number and this screen are displayed」",
          cn: "我「即使发生NG，也只显示四位数的号码和这个画面」",
          language,
        })}
      />
      <Image
        src="/images/detail_02_404andYCC.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Talk
        say={getMessage({
          ja: "娘「どこがNGなのか分からないね」",
          us: "Dau.「I can't tell where the NG is」",
          cn: "女儿「我不知道哪里是NG」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「これは10番と33番が正しく繋がってないという意味なんやけどな」",
          us: "Ya「This means that numbers 10 and 33 are not connected correctly」",
          cn: "我「这意味着10号和33号没有正确连接」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「どこの部品なのかは番号から図面で探すんや」",
          us: "Ya「You find out which part it is by looking it up in the drawing by number」",
          cn: "我「你可以通过图纸上的编号找到是哪部分」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「前に見てたあの長い図面？」",
          us: "Dau.「The long drawing we saw before?」",
          cn: "女儿「我们之前看到的那张长图纸？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「そうや長さ6メートルとかあるやつや」",
          us: "Ya「Yes, the one that's about 6 meters long」",
          cn: "我「是的，那张大约6米长的」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「間違い探しみたい、楽しそー」",
          us: "Dau.「It's like a spot-the-difference game, sounds fun」",
          cn: "女儿「就像找不同游戏，听起来很有趣」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「間違い探しに時間が掛かったら残業や」",
          us: "Ya「If it takes time to find the mistakes, it's overtime」",
          cn: "我「如果找错误花时间，那就是加班」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「わー、大変そう」",
          us: "Dau.「Wow, that sounds tough」",
          cn: "女儿「哇，听起来很辛苦」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「うん、だからNGの時に不具合箇所が表示できたらと思ったんや」",
          us: "Ya「Yes, that's why I thought it would be good if the defect location could be displayed when there's an NG」",
          cn: "我「是的，所以我想如果在NG时能显示缺陷位置就好了」",
          language,
        })}
      />
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "目的を考える",
          us: "Think about your objectives",
          cn: "想想你的目标",
          language,
        })}
      </Text>
      <Talk
        say={getMessage({
          ja: "娘「問題は残業だけ？」",
          us: "Dau.「Is overtime the only issue?」",
          cn: "女儿「加班是唯一的问题吗？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「うーん、まとめるとこんな感じだと思ったやで」",
          us: "Ya「Hmm, I thought it would be like this when summarized」",
          cn: "我「嗯，总结起来就是这样」",
          language,
        })}
      />
      <Box className={styles.quote}>
        {"1." +
          getMessage({
            ja: "NGが出る",
            us: "get an NG",
            cn: "得到一个NG",
            language,
          })}
        <br />
        ↓<br />
        {"2." +
          getMessage({
            ja: "探すのに時間が掛かる",
            us: "It takes time to find them.",
            cn: "找到它们需要时间",
            language,
          })}
        <br />
        ↓
        <br />
        {"3." +
          getMessage({
            ja: "残業になる",
            us: "You'll be working overtime.",
            cn: "加班",
            language,
          })}
        <br />
        ↓
        <br />
        {"4." +
          getMessage({
            ja: "不良を出した人が暗に責められる",
            us: "The person who defects is implicitly blamed.",
            cn: "叛逃者会受到隐性指责",
            language,
          })}
      </Box>
      <Talk
        say={getMessage({
          ja: "娘「暗に責められるって？」",
          us: "Dau.「What do you mean by being implicitly blamed?」",
          cn: "女儿「你说的暗中责备是什么意思？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「手作業だから不良が出るのは仕方ないって事はみんな分かってるんや」",
          us: "Ya「Everyone understands that defects are inevitable because it's manual work」",
          cn: "我「大家都知道因为是手工操作，所以缺陷是不可避免的」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「でも分かっててもそれが原因で残業になったら不満が出るんや」",
          us: "Ya「But even if they understand, dissatisfaction arises if it causes overtime」",
          cn: "我「但即使他们理解，如果这导致加班，还是会有不满」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「人間の性ってやつだね」",
          us: "Dau.「That's human nature, isn't it?」",
          cn: "女儿「这就是人性，对吧？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「これが現実なんや」",
          us: "Ya「This is the reality」",
          cn: "我「这就是现实」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「目的をまとめたらこうや」",
          us: "Ya「When summarizing the objectives, it looks like this」",
          cn: "我「总结目标时，就是这样」",
          language,
        })}
      />
      <Box className={styles.quote}>
        {"・" +
          getMessage({
            ja: "会社の残業を減らす",
            us: "Reduce company overtime",
            cn: "减少公司加班",
            language,
          })}
        <br />
        <br />
        {"・" +
          getMessage({
            ja: "現場の不満を減らす",
            us: "Reduce frustration in the field",
            cn: "减少现场挫折感",
            language,
          })}
      </Box>
      <Talk
        say={getMessage({
          ja: "娘「あとは作るだけだね」",
          us: "Dau.「All that's left is to make it」",
          cn: "女儿「剩下的就是制作了」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「でもな、その画面を表示させる方法が分からんのや」",
          us: "Ya「But I don't know how to display that screen」",
          cn: "我「但我不知道如何显示那个画面」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「それは簡単だよ」",
          us: "Dau.「That's easy」",
          cn: "女儿「那很简单」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「な、なんやてー」",
          us: "Ya「W-What did you say?」",
          cn: "我「你说什么？」",
          language,
        })}
      />
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "作り方",
          us: "way of making",
          cn: "如何建造",
          language,
        })}
      </Text>
      <Talk
        say={getMessage({
          ja: "娘「いままでの話をまとめると、こういう事だと思うの」",
          us: "Dau.「Summarizing what we've talked about, I think it's like this」",
          cn: "女儿「总结我们谈过的内容，我想是这样的」",
          language,
        })}
      />
      <Image
        src="/images/check_flow_2.png"
        w={["90%", "90%", "80%", "80%"]}
        my={3}
      />
      <Talk
        say={getMessage({
          ja: "わい「つまり、どういう事や？」",
          us: "Ya「So, what does that mean?」",
          cn: "我「那么，这是什么意思？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「WEBページを作ったらエラー時に表示されるって事ね」",
          us: "Dau.「It means that if you create a web page, it will be displayed in case of an error」",
          cn: "女儿「这意味着如果你创建一个网页，它将在出错时显示」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「そ、そうか」",
          us: "Ya「I see」",
          cn: "我「我明白了」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「でもそうなると一つの製品で1000ページも作る事になるで」",
          us: "Ya「But that would mean creating 1000 pages for one product」",
          cn: "我「但这意味着要为一个产品创建1000个页面」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「パパの得意なEXCEL-vbaで自動作成すればいいと思うの」",
          us: "Dau.「I think you can automatically create them with your favorite Excel VBA」",
          cn: "女儿「我想你可以用你擅长的Excel VBA自动创建它们」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「自動作成できるの？」",
          us: "Ya「Can it be created automatically?」",
          cn: "我「可以自动创建吗？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「うん、EXCEL-vbaはテキストファイルを作成できるよね？」",
          us: "Dau.「Yes, Excel VBA can create text files, right?」",
          cn: "女儿「是的，Excel VBA可以创建文本文件，对吧？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「できるで」",
          us: "Ya「Yes, it can」",
          cn: "我「是的，可以」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「WEBページはテキストファイルで出来てるの」",
          us: "Dau.「Web pages are made of text files」",
          cn: "女儿「网页是由文本文件组成的」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「そうなんか、じゃあ、お風呂入ってからWEBページの作り方を教えてくれるか」",
          us: "Ya「Is that so? Then, can you teach me how to make a web page after I take a bath?」",
          cn: "我「是这样吗？那么，我洗完澡后你能教我如何制作网页吗？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「うん、すぐにお風呂入ってくるねー」",
          us: "Dau.「Yes, I'll go take a bath right away」",
          cn: "女儿「好的，我马上去洗澡」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "（こういう流れだと素直にお風呂行くんだよなー）",
          us: "Ya（In this flow, she goes to the bath obediently）",
          cn: "我（在这种情况下，她会乖乖去洗澡）",
          language,
        })}
      />
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "1週間後...",
          us: "One week later...",
          cn: "一周后",
          language,
        })}
      </Text>
      <Talk
        say={getMessage({
          ja: "娘「パパー、できたー？」",
          us: "Dau.「Dad, is it done?」",
          cn: "女儿「爸爸，做好了吗？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「できたやで、こんな感じで作ったんや」",
          us: "Ya「It's done, I made it like this」",
          cn: "我「做好了，我是这样做的」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「第1話で作った画像を出力してWEB技術で表示/点滅させたんや」",
          us: "Ya「I output the image created in episode 1 and displayed/flashed it using web technology」",
          cn: "我「我输出了在第1集创建的图像，并使用网络技术显示/闪烁它」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「Excel-vbaのテキスト出力だとShift-JISで文字化けになるからUTF-8にしたんや」",
          us: "Ya「Excel VBA's text output causes garbled characters in Shift-JIS, so I changed it to UTF-8」",
          cn: "我「Excel VBA的文本输出在Shift-JIS中会导致字符乱码，所以我改成了UTF-8」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "（娘ちゃんに教えてもらった通りにしただけやけどな）",
          us: "Ya（I just did as my daughter taught me）",
          cn: "我（我只是按照女儿教我的做的）",
          language,
        })}
      />
      <Image
        src="/images/check_flow.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Talk
        say={getMessage({
          ja: "娘「WEBの基本通り作った感じだね」",
          us: "Dau.「It looks like you made it according to the basics of the web」",
          cn: "女儿「看起来你是按照网络的基本原理制作的」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「ありがとうやで」",
          us: "Ya「Thank you」",
          cn: "我「谢谢你」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「で、どんな表示画面を作ったの？」",
          us: "Dau.「So, what kind of display screen did you make?」",
          cn: "女儿「那么，你制作了什么样的显示屏？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「こんな感じや」",
          us: "Ya「It's like this」",
          cn: "我「就是这样」",
          language,
        })}
      />
      <Image
        src="/images/check_302.gif"
        w={["80%", "80%", "70%", "70%"]}
        my={3}
      />
      <Talk
        say={getMessage({
          ja: "娘「あ、点滅してるねー」",
          us: "Dau.「Oh, it's flashing」",
          cn: "女儿「哦，它在闪烁」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「この場合はエラー番号が1337って事？」",
          us: "Dau.「In this case, does it mean the error number is 1337?」",
          cn: "女儿「在这种情况下，是不是意味着错误编号是1337？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「そうや、点滅箇所の配線が間違えてるって事やな」",
          us: "Ya「Yes, it means the wiring at the flashing point is wrong」",
          cn: "我「是的，这意味着闪烁点的接线是错误的」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「すぐに不具合箇所が分かるね」",
          us: "Dau.「You can immediately see where the defect is」",
          cn: "女儿「你可以立即看到缺陷在哪里」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「娘ちゃんのおかげやで」",
          us: "Ya「It's thanks to you」",
          cn: "我「多亏了你」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「えへへ」",
          us: "Dau.「Hehe」",
          cn: "女儿「嘿嘿」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「WEB技術は分かった？」",
          us: "Dau.「Did you understand web technology?」",
          cn: "女儿「你了解网络技术了吗？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「何となく分かった気がする」",
          us: "Ya「I feel like I kind of understand it」",
          cn: "我「我觉得我有点明白了」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「やったね」",
          us: "Dau.「You did it」",
          cn: "女儿「你做到了」",
          language,
        })}
      />
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "実際の使用動画",
          us: "Actual use video",
          cn: "实际使用视频",
          language,
        })}
      </Text>
      <video
        src="/images/check_movie.mp4"
        muted
        loop
        autoPlay
        playsInline
      ></video>
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "次回予告",
          us: "written reply to a letter",
          cn: "次回予告",
          language,
        })}
      </Text>
      <Talk
        say={getMessage({
          ja: "わい「ところでな、上の方の娘ちゃんが書いた図でマイコンってあったけどあれは何なん？」",
          us: "Ya「By the way, in the diagram my daughter drew above, there was something called a microcontroller, what is that?」",
          cn: "我「顺便说一下，在上面我女儿画的图中，有一个叫做微控制器的东西，那是什么？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「あれはマイクロコンピューターの略だよ」",
          us: "Dau.「That's short for microcomputer」",
          cn: "女儿「那是微型计算机的缩写」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「シンプルで安いのが魅力なの」",
          us: "Dau.「Its simplicity and low cost are its attractions」",
          cn: "女儿「它的简单和低成本是它的魅力」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「む、娘ちゃんは機械のプログラミングもできるの？」",
          us: "Ya「Hmm, can you also program machines, my daughter?」",
          cn: "我「嗯，我的女儿，你也会编程机器吗？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「うん、基本的な部品なら使えるよー」",
          us: "Dau.「Yes, I can use basic components」",
          cn: "女儿「是的，我可以使用基本组件」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "わい「じゃあ、また必要な時に教えてくれるか」",
          us: "Ya「Then, can you teach me again when necessary?」",
          cn: "我「那么，必要时你能再教我吗？」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "娘「はーい」",
          us: "Dau.「Okay」",
          cn: "女儿「好的」",
          language,
        })}
      />
      <Talk
        say={getMessage({
          ja: "（なんなんやこの娘ちゃんは...）",
          us: "Ya（What is this daughter of mine...）",
          cn: "我（这女儿是怎么回事...）",
          language,
        })}
      />
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "次回..",
          us: "revert sth.",
          cn: "次回..",
          language,
        })}
      </Text>
      <Text>
        {getMessage({
          ja: "マイコンが必要な案件を探すワイ",
          us: "Ya looking for a project that requires a microcontroller.",
          cn: "我找到一个需要微控制器的项目",
          language,
        })}
      </Text>
      <Center h="100px" color="gray" className={styles.borderText}>
        {getMessage({
          ja: "つづく",
          us: "continue",
          cn: "继续",
          language,
        })}
      </Center>
    </Container>
  );
}
