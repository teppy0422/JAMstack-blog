import {
  Text,
  Box,
  Container,
  Image,
  Stack,
  Badge,
  AspectRatio,
  Center,
  list,
  ListItem,
  UnorderedList,
  OrderedList,
} from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "@/styles/home.module.scss";
import SjpChart01 from "./01_chart_1";
import Talk from "./talk";

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

export default function SjpDetail_talk() {
  const { language, setLanguage } = useLanguage();

  function BlueLabel({ text, color }: { text: string; color: string }) {
    return (
      <Box as="span" bg={color} color="white" px={1} mx={1} py={0}>
        {text}
      </Box>
    );
  }
  return (
    <Container
      w={["100%", "95%", "90%", "80%"]}
      m="auto"
      className={styles.workDetail}
    >
      <Stack direction="row" mt={3}>
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
          {getMessage({
            ja: "部品に電線を接続していく工場の場合",
            us: "For a factory that connects wires to components",
            cn: "用于将电线连接到组件的植物",
            language,
          })}
        </Text>
      </Box>
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "なぜ画像が必要なのか？",
          us: "Why need images?",
          cn: "我们为什么需要图像？",
          language,
        })}
      </Text>
      <Talk
        say={getMessage({
          ja: "娘「どうして画像が必要なの？」",
          us: "Dau.「Why do you need images?」",
          cn: "女儿「你要照片干什么？」",
          language,
        })}
      />
      <br />
      <Talk
        say={getMessage({
          ja: "わい「それがな、ちょっと見てみ。これがメーカーから渡される図面や」",
          us: "Ya「Well, let's take a look at it. These are the drawings given to us by the manufacturer.」",
          cn: "我「就是这样，看一看。这些是制造商给我们的图纸，...」",
          language,
        })}
      />
      <Image
        src="/images/insert_picture.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Talk
        say={getMessage({
          ja: "娘「うわぁー記号と数字ばかりだね」",
          us: "Dau.「Wow, all those symbols and numbers.」",
          cn: "女儿「哇，这么多符号和数字。」",
          language,
        })}
      />
      <br />
      <Talk
        say={getMessage({
          ja: "わい「そうなんや、情報量は多いんやけどな」",
          us: "Ya「Yeah, I know, it's a lot of information.」",
          cn: "我「是的，我知道，信息量很大。」",
          language,
        })}
      />
      <br />
      {getMessage({
        ja: "娘「この",
        us: "Dau.「What does this ",
        cn: "女儿「这个 ",
        language,
      })}
      <BlueLabel text="L" color="blue.500" />
      {getMessage({
        ja: "ってどういう意味なの？」",
        us: " mean?」",
        cn: " 是什么意思？」",
        language,
      })}
      <br />
      {getMessage({
        ja: "わい「その記号は ",
        us: "Ya「That symbol means ",
        cn: "我「意思是 ",
        language,
      })}
      <BlueLabel
        text={getMessage({
          ja: "青色の電線",
          us: "blue wire.",
          cn: "蓝线",
          language,
        })}
        color="blue.500"
      />
      {getMessage({
        ja: " って意味やで」",
        us: "」",
        cn: " 」",
        language,
      })}
      <br />
      {getMessage({
        ja: "娘「青は",
        us: "Dau.「Blue is ",
        cn: "女儿「蓝色是 ",
        language,
      })}
      <BlueLabel text="Blue" color="blue.500" />
      {getMessage({
        ja: "だからBじゃないの？」",
        us: ", so why not B?」",
        cn: "，为什么不是 B？」",
        language,
      })}
      <br />
      {getMessage({
        ja: "わい「黒が",
        us: "Ya「Black is ",
        cn: "我「黑色是",
        language,
      })}
      <BlueLabel text="Black" color="blue.500" />
      {getMessage({
        ja: "で同じBになるから、2文字目の",
        us: "and it's the same B. That's why you got the second letter",
        cn: "也是 B，所以是第二个字母 ",
        language,
      })}
      <BlueLabel text="L" color="blue.500" />
      {getMessage({
        ja: "になったんやな」",
        us: "」",
        cn: "」",
        language,
      })}
      <br />
      {getMessage({
        ja: "娘「・・・」",
        us: "Dau.「...」",
        cn: "女儿「......」",
        language,
      })}
      <br />
      {getMessage({
        ja: "娘「勉強しないと作業できないね」",
        us: "Dau.「I'll have to study it to work on it.」",
        cn: "女儿「如果不研究它，我就无法开展工作。」",
        language,
      })}
      <br />
      {getMessage({
        ja: "わい「だから誰でも作業出来るように次のような画像を作るんやで」",
        us: "Ya「That's why we're going to create the following image so that anyone can work on it.」",
        cn: "我「因此，我们制作了下面这张图片，任何人都可以在上面工作。」",
        language,
      })}
      <Image
        src="/images/insert_picture_before.png"
        w={["100%", "90%", "80%", "80%"]}
        my={3}
      />
      <Text className={styles.text}>
        {getMessage({
          ja: "娘「わぁこれがあれば私でも作業できるね」",
          us: "Dau.「Wow, even I could work with this.」",
          cn: "女儿「哇，我可以用这个工作。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「でも、作る人が大変そう」",
          us: "Dau.「But it looks like a lot of work for the people who make it.」",
          cn: "女儿「但对于制作者来说，这似乎是一项艰巨的工作。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「そうなんや、1枚を作るのに30分くらい掛かるんやけどな。これを2ヶ月で300枚くらい作る必要があるんやで」",
          us: "Ya「Yes, it takes about 30 minutes to make one sheet. I need to make about 300 sheets in two months.」",
          cn: "我「是的，我做一张大约需要半个小时。我需要在两个月内制作大约 300 张。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「そんなに！」",
          us: "Dau.「So much!」",
          cn: "女儿「太多了」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「しかもミスは許されないから大変なんや」",
          us: "Ya「And it's hard because there's no room for error.」",
          cn: "我「这是一项艰苦的工作，因为没有犯错的余地。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「ミスがあったらどうなるの？」",
          us: "Dau.「What happens if there is a mistake?」",
          cn: "女儿「如果出错了怎么办？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「検査の時に見つかるんやけどな、見つかった時には大量の不良品が出来てるんや」",
          us: "Ya「They are found during inspections, and when they are found, a large number of defective products are produced.」",
          cn: "我「它们是在检查过程中发现的，一旦发现，就会生产出大量有缺陷的产品。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「え、不良品は捨てちゃうの？」",
          us: "Dau.「Oh, you throw away defective products?」",
          cn: "女儿「什么，你会扔掉有缺陷的产品吗？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「そんなもったいない事はせんよ。みんなで仲良く残業して手直しやな」",
          us: "Ya「We don't waste like that. We all work overtime together to fix it.」",
          cn: "我「我们不会那样浪费。我们会一起加班来修复它。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「ミスした人がかわいそう」",
          us: "Dau.「I feel sorry for the person who made the mistake.」",
          cn: "女儿「我为犯错的人感到难过。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「せやろ？だからこれを自動作成するようにしたんや」",
          us: "Ya「Right? That's why we automated this process.」",
          cn: "我「对吧？这就是为什么我们自动化了这个过程。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「わーい」",
          us: "Dau.「Yay」",
          cn: "女儿「耶」",
          language,
        })}
      </Text>
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "Excelで作る",
          us: "Create in Excel",
          cn: "在 Excel 中创建。",
          language,
        })}
      </Text>
      <Text className={styles.text}>
        {getMessage({
          ja: "娘「",
          us: "Dau.「Did you decide to make it in",
          cn: "女儿「你决定用",
          language,
        })}
        <BlueLabel text="Excel" color="green.500" />
        {getMessage({
          ja: "で作る事にしたの？」",
          us: "?」",
          cn: "制作吗？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「そうやで」",
          us: "Ya「That's right」",
          cn: "我「是的」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「",
          us: "Dau.「Isn't",
          cn: "女儿「",
          language,
        })}
        <BlueLabel text="Excel" color="green.500" />
        {getMessage({
          ja: "って印刷したらズレるし画像の扱いは向いてないんじゃないの？」",
          us: "not suitable for handling images because of the misalignment when printed?」",
          cn: "不是不适合处理图像，因为打印时会出现错位吗？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「よく知ってるね」",
          us: "Ya「You know a lot」",
          cn: "我「你知道的很多」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「うん、昨日ともだちとその話で盛り上がったよ」",
          us: "Dau.「Yeah, I got excited talking about it with my friends yesterday」",
          cn: "女儿「是的，昨天和朋友们谈论这个话题时很兴奋」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「どんな会話や。。」",
          us: "Ya「What kind of conversation is that...」",
          cn: "我「那是什么样的对话...」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「とにかく会社では",
          us: "Ya「Anyway, many people in my company can use",
          cn: "我「总之，公司里很多人都会使用",
          language,
        })}
        <BlueLabel text="Excel" color="green.500" />
        {getMessage({
          ja: "を使える人が多いから、それに合わせるんや」",
          us: ", so I have to adapt to that.」",
          cn: "，所以你必须适应这一点。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「それにな、画像形式にしたら後から変更が難しくなるんや」",
          us: "Ya「Also, if it's in image format, it becomes difficult to change later」",
          cn: "我「而且，如果是图像格式，之后更改会很困难」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「",
          us: "Dau.「If it's an",
          cn: "女儿「这是否意味着，有了",
          language,
        })}
        <BlueLabel text="Excel" color="green.500" />
        {getMessage({
          ja: "のオートシェイプなら後から誰でも編集が出来るって事？」",
          us: "autoshape, does that mean anyone can edit it later?」",
          cn: "自动形状，任何人以后都可以对其进行编辑？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「そ、そういう事やな」",
          us: "Ya「Yes, that's right」",
          cn: "我「是的，就是这样」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「とりあえずこういうイメージやな」",
          us: "Ya「This is the image for now」",
          cn: "我「这就是目前的想法」",
          language,
        })}
      </Text>
      <Image src="/images/sjp_flow_01.png" my={3} />
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "2週間後..",
          us: "Two weeks later...",
          cn: "两周后...",
          language,
        })}
      </Text>
      <Text className={styles.text}>
        {getMessage({
          ja: "娘「パパー出来た？」",
          us: "Dau.「Dad, is it done?」",
          cn: "女儿「爸爸，做好了吗？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「できたで、見てくれるか？」",
          us: "Ya「It's done, can you take a look?」",
          cn: "我「做好了，你能看看吗？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「みるみるー」",
          us: "Dau.「I'll look, I'll look」",
          cn: "女儿「我看看，我看看」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「ほい！」",
          us: "Ya「Here you go!」",
          cn: "我「给你！」",
          language,
        })}
      </Text>
      <video
        src="/images/sjp_movie_02.mp4"
        muted
        loop
        autoPlay
        playsInline
      ></video>
      <Text className={styles.text}>
        {getMessage({
          ja: "娘「やったー、自動で作成できたね」",
          us: "Dau.「Yay, we were able to create it automatically」",
          cn: "女儿「太好了，我们可以自动创建了」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「ズレる問題はどうやって解決したの？」",
          us: "Dau.「How did you solve the misalignment issue?」",
          cn: "女儿「你是怎么解决错位问题的？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「取得値 = x とすると出力時に ",
          us: "Ya「If we set the value to be retrieved = x, the output will be ",
          cn: "我「如果获取值 = x，输出应为 ",
          language,
        })}
        0.747x<sup>1.0006</sup>
        {getMessage({
          ja: "にするんや」",
          us: ".」",
          cn: "。」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「ズレるのが等倍じゃないから気付きにくいんだね」",
          us: "Dau.「It's hard to notice because the misalignment isn't uniform」",
          cn: "女儿「因为错位不是等倍的，所以很难注意到」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「パパも2時間ほどハマったで」",
          us: "Ya「Dad also got stuck for about 2 hours」",
          cn: "我「爸爸也卡了大约2个小时」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「あとは操作メニューを作ったら使ってもらえるね」",
          us: "Dau.「Once we make the operation menu, people can use it」",
          cn: "女儿「只要制作操作菜单，就可以使用了」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「せやで、みんな待ってるから今日中に仕上げるやで」",
          us: "Ya「That's right, everyone is waiting, so I'll finish it today」",
          cn: "我「是的，大家都在等，所以我今天会完成」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい（どうして操作メニューって言葉を知ってるんや..）",
          us: "Ya（How does she know the term 'operation menu'..）",
          cn: "我（她怎么知道“操作菜单”这个词..）",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「わくわく」",
          us: "Dau.「Excited」",
          cn: "女儿「兴奋」",
          language,
        })}
      </Text>
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "ここまでで出来たプログラム",
          us: "Programs created so far",
          cn: "迄今已制定的计划",
          language,
        })}
      </Text>

      <video
        src="/images/sjp_movie_01.mp4"
        muted
        loop
        autoPlay
        playsInline
      ></video>

      <Text className={styles.subTitle}>
        {getMessage({
          ja: "作成した画像",
          us: "Image created",
          cn: "创建图片",
          language,
        })}
      </Text>

      <Image
        src="/images/sjp_terminal_520.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "半年後..",
          us: "Six months later...",
          cn: "半年後..",
          language,
        })}
      </Text>
      <Text className={styles.text}>
        {getMessage({
          ja: "娘「ねぇパパ、そういえば画像の自動作成はどうなったの？」",
          us: "Dau.「Hey Dad, by the way, how's the automatic image creation going?」",
          cn: "女儿「爸爸，顺便问一下，图像的自动创建怎么样了？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「ああ、いまちょうど効果の確認をグラフにしてたんや」",
          us: "Ya「Oh, I was just graphing the effect confirmation」",
          cn: "我「哦，我刚刚在做效果确认的图表」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「みたいみたい」",
          us: "Dau.「I want to see, I want to see」",
          cn: "女儿「我想看，我想看」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「こんな感じや」",
          us: "Ya「It's like this」",
          cn: "我「就是这样」",
          language,
        })}
        <SjpChart01 />
        {getMessage({
          ja: "娘「わぁーすごいすごい」",
          us: "Dau.「Wow, amazing, amazing」",
          cn: "女儿「哇，太棒了，太棒了」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「残業も無くなったんだね」",
          us: "Dau.「Overtime is gone too, right?」",
          cn: "女儿「加班也没了，对吧？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「そうやで、小さいお子さんがいる人には特に評判が良いよ」",
          us: "Ya「That's right, it's especially well-received by those with small children」",
          cn: "我「是的，特别是有小孩的人对此评价很高」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「遅くまで預かってくれる保育園はこの辺りにないもんね」",
          us: "Dau.「There aren't any daycare centers around here that stay open late, right?」",
          cn: "女儿「这附近没有开到很晚的托儿所，对吧？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「そうなんや、あっても倍率が高いしな」",
          us: "Ya「That's right, and even if there are, the competition is high」",
          cn: "我「是的，即使有，竞争也很激烈」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「そういうニーズともマッチした取り組みだったんだね」",
          us: "Dau.「It was an initiative that matched those needs, right?」",
          cn: "女儿「这是一项符合这些需求的举措，对吧？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「ご褒美にオムライス作るねー」",
          us: "Dau.「I'll make omelet rice as a reward」",
          cn: "女儿「我会做蛋包饭作为奖励」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「わーい」",
          us: "Ya「Yay」",
          cn: "我「耶」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい（ニーズって言葉を誰が教えたんや..）",
          us: "Ya（Who taught her the word 'needs'..）",
          cn: "我（是谁教她“需求”这个词的..）",
          language,
        })}
      </Text>
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "1年後..",
          us: "One year later...",
          cn: "1年後..",
          language,
        })}
      </Text>
      <Text className={styles.text}>
        {getMessage({
          ja: "娘「パパ、なにしてるの？」",
          us: "Dau.「Dad, what are you doing?」",
          cn: "女儿「爸爸，你在做什么？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「あのプログラムを他の工場でも使えるように変更してるんや」",
          us: "Ya「I'm modifying that program so it can be used in other factories」",
          cn: "我「我正在修改那个程序，以便在其他工厂使用」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「たのしそー」",
          us: "Dau.「Sounds fun」",
          cn: "女儿「听起来很有趣」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「でもどうして変更が必要なの？」",
          us: "Dau.「But why is the change necessary?」",
          cn: "女儿「但为什么需要更改呢？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「他の工場に配った後で、わいが追加した新しい機能を簡単に使えるようにするんや」",
          us: "Ya「After distributing it to other factories, I want to make it easy to use the new features I added」",
          cn: "我「在分发到其他工厂后，我想让他们可以轻松使用我添加的新功能」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「バージョンアップ機能って事？」",
          us: "Dau.「You mean a version upgrade feature?」",
          cn: "女儿「你是说版本升级功能吗？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「そうや、最近の子供はよく知ってるな」",
          us: "Ya「That's right, kids these days know a lot」",
          cn: "我「是的，现在的孩子知道很多」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「スマホアプリみたいにボタン一つで更新できたら便利やろ」",
          us: "Ya「It would be convenient if it could be updated with one button like a smartphone app」",
          cn: "我「如果能像智能手机应用程序一样一键更新，那就方便了」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「いいね。他の工場の残業問題も解決できそうだね」",
          us: "Dau.「That's great. It might also solve the overtime issues in other factories」",
          cn: "女儿「那太好了。也许还能解决其他工厂的加班问题」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「できるだけ多くの人に使ってもらいたいからね」",
          us: "Ya「I want as many people as possible to use it」",
          cn: "我「我希望尽可能多的人使用它」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「私にできることあるかなー」",
          us: "Dau.「Is there anything I can do?」",
          cn: "女儿「有什么我可以做的吗？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「オムライス」",
          us: "Ya「Omelet rice」",
          cn: "我「蛋包饭」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「はーい」",
          us: "Dau.「Okay」",
          cn: "女儿「好的」",
          language,
        })}
      </Text>

      <video src="/images/sjp_select_ver.mp4" autoPlay muted loop playsInline />
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "2年後..",
          us: "Two years later...",
          cn: "2年後..",
          language,
        })}
      </Text>
      <Text>
        {getMessage({
          ja: "取り組みが評価されて国内で講演会を開きました",
          us: "Lectures in Japan in recognition of our efforts",
          cn: "在全国举办讲座，表彰这一举措。",
          language,
        })}
      </Text>
      <Image
        src="/images/sjp_pannel.png"
        w={["100%", "100%", "90%", "90%"]}
        my={3}
      />
      <Text className={styles.subTitle}>
        {getMessage({
          ja: "その後..",
          us: "After that...",
          cn: "之后...",
          language,
        })}
      </Text>
      <Text className={styles.text}>
        {getMessage({
          ja: "娘「ねぇパパ」",
          us: "Dau.「Hey Dad」",
          cn: "女儿「爸爸」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「あのプログラムとWEB技術で会社の他の問題も解決できないかな？」",
          us: "Dau.「Can't we solve other company issues with that program and web technologies?」",
          cn: "女儿「我们不能用那个程序和网络技术解决公司的其他问题吗？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「WEB技術？」",
          us: "Ya「Web technologies?」",
          cn: "我「网络技术？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「うん、HTMLとかCSSとかそういうの」",
          us: "Dau.「Yeah, like HTML and CSS and stuff」",
          cn: "女儿「是的，像HTML和CSS之类的」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「なんやそれ。。というか何で知ってるん」",
          us: "Ya「What's that... and how do you know about it?」",
          cn: "我「那是什么...你怎么知道的？」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「さいきん友達とWEB技術ごっこをやってるからね」",
          us: "Dau.「Because I've been playing web technology games with my friends lately」",
          cn: "女儿「因为我最近和朋友们玩网络技术游戏」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「なんちゅう幼稚園児や」",
          us: "Ya「What kind of kindergarten kid are you」",
          cn: "我「你是个什么样的幼儿园小孩」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「でも、わい、そんなのやった事ないし」",
          us: "Ya「But I've never done anything like that」",
          cn: "我「但我从来没有做过那样的事」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「大丈夫、わたしがおしえてあげるー」",
          us: "Dau.「It's okay, I'll teach you」",
          cn: "女儿「没关系，我会教你」",
          language,
        })}
        <br />
        {getMessage({
          ja: "わい「そ、そうか、じゃあ教えてもらおうかな」",
          us: "Ya「Oh, really? Then maybe I'll let you teach me」",
          cn: "我「哦，真的吗？那也许我会让你教我」",
          language,
        })}
        <br />
        {getMessage({
          ja: "娘「たのしみー」",
          us: "Dau.「I'm excited」",
          cn: "女儿「我很期待」",
          language,
        })}
      </Text>

      <Text className={styles.subTitle}>
        {getMessage({
          ja: "結果..",
          us: "Result.",
          cn: "结果",
          language,
        })}
      </Text>
      <Text>
        {getMessage({
          ja: "娘に流されてWEB技術を学ぶ事になりました。",
          us: "My daughter swept me off my feet to learn web technology.",
          cn: "我被女儿的热情所感染，开始学习网络技术。",
          language,
        })}
        <br />
        {getMessage({
          ja: "2週間以内に題材を探したいと思います。",
          us: "I would like to find a subject matter within the next two weeks.",
          cn: "我希望在两周内找到对象。",
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
