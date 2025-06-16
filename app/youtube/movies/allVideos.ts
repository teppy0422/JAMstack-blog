import { VideoMeta } from "@/types/video-meta";

export const allVideos: VideoMeta[] = [
  {
    id: "70_2",
    title: {
      ja: "検査履歴システムでポイント点滅を使用",
      us: "Use point flashing in inspection history system",
      cn: "在检测历史系统中使用点闪烁。",
    },
    autoPlay: true,
    date: "2011/2/22",
    name: {
      ja: "",
    },
    textContent: {
      ja: `生産準備+で作成したポイント点滅画像を検査履歴システムに入れる事で製品品番専用のポイント点滅画像を簡単に表示できます。`,
      us: `By inserting the point blinking image created with the "Point Blinking Image" into the inspection history system, a point blinking image dedicated to the product part number can be easily displayed.`,
      cn: `通过将系统创建的点闪烁图像插入检测历史系统，可轻松显示产品部件号。`,
    },
    src: "/images/70/70poster.mp4",
    thumbnail: "/images/thumbnail/70poster.webp",
  },
  {
    id: "41",
    title: {
      ja: "先ハメ誘導を使った作業",
      us: "Work with Pre-Fitting Guidance",
      cn: "使用先装引导",
    },
    autoPlay: true,
    date: "2021/3/24",
    name: {
      ja: "先ハメ誘導",
    },
    textContent: {
      ja: `先ハメ初心者でも最適な順番で作業が行えます。\n製造指示書にサブナンバーと作業順を印刷してその順番で作業を行います。\n\n※先ハメ順を都度考える補給品工程で特に有効です\n※生産準備+で自動立案したサブ形態のみ対応`,
      us: `Even beginners can work in the best order.
                Sub-numbers and work order are printed on the manufacturing instructions and the work is performed in that order.

                This is especially effective in the supply process where the first frame order is considered on a case-by-case basis.
                Only the sub forms automatically drafted by Production Preparation+ are supported.`,
      cn: `即使是初学者也能按照最佳顺序工作。
                在生产说明书上打印子编号和工作顺序，然后按此顺序工作。

                *在供应过程中尤其有效，可根据具体情况考虑第一个框架订单。
                *仅与 Production Preparation+ 自动编制的子表格兼容。`,
    },
    src: "https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018145058.mp4",
    thumbnail: "/images/thumbnail/41.png",
  },
  {
    id: "56.net",
    date: "2018/7/22",
    autoPlay: true,
    title: {
      ja: "ディスプレイ移動",
      us: "Display Movement",
      cn: "显示屏移动",
    },
    name: {
      ja: "順立生産システム",
    },
    textContent: {
      ja: `配策時にディスプレイが見えやすい位置に移動します。
          
治具が横に長くディスプレイが見えない位置になる事があるので作成しました。
56.配策誘導ナビで作成した座標データを基に移動します。

Arduinoとステッピングモーターで移動させています。`,
      us: `The display is moved to a position where it is easy to see it when it is placed.
The jig is long horizontally and the display is sometimes not visible, so it was created.

Moves based on the coordinate data created by the "Layout Guidance Navigation" function.

It is moved by Arduino and stepping motors.`,
      cn: `在展开时移动到显示屏容易看到的位置。
这是因为夹具水平方向较长，而显示屏有时处于无法看到的位置。

根据 56 创建的坐标数据移动。

通过 Arduino 和步进电机移动。`,
    },
    src: "https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018150130.mp4",
    thumbnail: "/images/thumbnail/56.net.png",
  },
  {
    id: "jdss_main2",
    date: "2024/1/20",
    autoPlay: false,
    title: { ja: "main2(SSC)" },
    name: {
      ja: "順立生産システム",
    },
    textContent: {
      ja: `SSCで使う場合の例です

一貫工程は全員が同じ製品を順番に作成する為、生産指示は一度で良い筈です。
それをコンセプトにYSSやCBやPLCなどにも対応しました`,
      us: `Here is an example for use in SSC

In an integrated process, everyone creates the same product in sequence, so production instructions should be given only once.
Based on this concept, YSS, CB, PLC, etc. are also supported.`,
      cn: `用于 SSC 的示例。

在集成流程中，每个人都按顺序生产相同的产品，因此只需下达一次生产指令。
基于这一概念，还支持 YSS、CB 和 PLC。
`,
    },
    src: "https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018151459.mp4",
    thumbnail: "/images/thumbnail/main2.png",
  },
  {
    id: "jdss_main3_plc",
    date: "2024/3/24",
    autoPlay: true,
    title: { ja: "main3(PLC)" },
    name: {
      ja: "順立生産システム",
    },
    textContent: {
      ja: `PLCなどの外部デバイスにシリアル送信を行なって製品品番に応じた動作を行います。\n動画のように忘れん棒に部品セットを行う場合はロボットアームの方が良いかもしれません。`,
      us: `Serial transmission to external devices such as PLCs for operation according to product part number

                A robot arm may be better for setting parts on a forget-me-not as shown in the video.`,
      cn: `串行传输到 PLC 等外部设备，以便根据产品部件号进行操作。

                如视频所示，机械臂可能更适合在勿忘我上设置零件。`,
    },
    src: "https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018151928.mp4",
    thumbnail: "/images/thumbnail/main3.png",
  },
];
