import { VideoMeta } from "@/types/video-meta";

export const allVideos: VideoMeta[] = [
  {
    id: "42",
    title: {
      ja: "SSC作業誘導を液晶ディスプレイを使って作ってみた",
      us: "I made SSC work guidance with LCD display.",
      cn: "使用液晶显示器进行 SSC 工作指导。",
    },
    autoPlay: true,
    date: "2019/1/31",
    name: {
      ja: "",
    },
    textContent: {
      ja: `配策誘導ナビの延長で同じ仕組みでSSCのハメ作業を誘導する仕組みを作ってみました。
      
コネクタのホルダーは3Dプリンターで作成。プレート全体がスイッチになっていて、引っ張り確認をする事で次の誘導に進みます。
液晶パネルはフレームが無いものを購入してフレームは3Dプリンタで作成しました。小さくて薄いです。
液晶を利用する事でLEDに比べて部品が少なく配線の必要もありません。

他の仕事を優先した為、開発は頓挫しました。`,
      us: `We have created a system to guide the SSC framing process using the same mechanism as an extension of the distribution strategy guidance navigation system.

The connector holder was created using a 3D printer. The whole plate is a switch, and by pulling and confirming, the user can proceed to the next guidance.
The LCD panel was purchased without a frame and the frame was created with a 3D printer. It is small and thin.
By using LCD, there are fewer parts and no need for wiring compared to LED.

The development was abandoned due to prioritizing other work.`,
      cn: `我们创建了一个系统，利用同样的机制指导 SSC 框架制定过程，作为分配战略指导导航系统的延伸。

连接器支架是用 3D 打印机制作的。整个板是一个开关，通过拉动并确认拉动，就可以进行下一步引导。
液晶面板买来时没有框架，框架是用 3D 打印机制作的。它又小又薄。
与 LED 相比，使用 LCD 的部件更少，也无需布线。

因为其他工作优先，所以放弃了开发。`,
    },
    src: "/youtube/videos/42.mp4",
    thumbnail: "/youtube/thumbnail/42.webp",
  },
  {
    id: "56-2",
    title: {
      ja: "配策誘導ナビに移動する機能を追加",
      us: "Added the ability to navigate to the allocation guidance navigation system.",
      cn: "添加了移动到分配引导导航系统的功能。",
    },
    autoPlay: true,
    date: "2018/11/25",
    name: {
      ja: "",
    },
    textContent: {
      ja: `配策誘導ナビを表示するためのアプリケーションをVB.netで作成しました。
      
      WebBrowserライブラリで表示して、マイコン(Arduino UNO)に座標データをシリアル送信しています。
      シリアルを受信したマイコンは値に応じて動作する仕組みです。`,
      us: `We have created an application in VB.net to display a navigation system for guiding the allocation of measures.

      It is displayed by WebBrowser library and sends the coordinate data to microcontroller (Arduino UNO) serially.
      The microcontroller that receives the serial data operates according to the value.`,
      cn: `用 VB.net 创建了一个应用程序，用于显示导航系统，指导措施的分配。

      该程序使用 WebBrowser 库显示，并将坐标数据串行发送到微控制器（Arduino UNO）。
      接收串行数据的微控制器根据数值进行操作。`,
    },
    src: "/youtube/videos/56-2.mp4",
    thumbnail: "/youtube/thumbnail/56-2.webp",
  },
  {
    id: "56-1",
    title: {
      ja: "配策誘導ナビの作成.Ver1",
      us: "Creation of a navigation system for guiding the allocation of measures.Ver1",
      cn: "创建措施分配引导导航系统.Ver 1",
    },
    autoPlay: true,
    date: "2018/10/22",
    name: {
      ja: "",
    },
    textContent: {
      ja: `生産準備+で配策経路を表示する配策誘導ナビを作成しました。

Excelから.htmlとか.cssを作成する仕様です。
最大4枚の画像を重ねてjavascriptで点滅させているだけの簡単なWEBページです。
ApacheなどのWEB環境が無い状況でも使えるようにしました。`,
      us: `We have created a layout guidance navigation system that displays the layout route in Production Preparation+.

The specification is to create .html or .css from Excel.
It is a simple web page with up to 4 images stacked on top of each other and blinking with javascript.
It can be used even in situations where there is no web environment such as Apache.`,
      cn: `已创建了一个布局指导导航系统，用于在生产准备+ 中显示布局路线。

其规格是通过 Excel 创建 .html 或 .css。
这是一个简单的网页，最多可叠加四张图片，并使用 javascript 闪烁。
即使在没有 Apache 等网络环境的情况下也可使用。`,
    },
    src: "/youtube/videos/56-1.mp4",
    thumbnail: "/youtube/thumbnail/56-1.webp",
  },
  {
    id: "70_2",
    title: {
      ja: "検査履歴システムでポイント点滅を使用",
      us: "Use point flashing in inspection history system",
      cn: "在检测历史系统中使用点闪烁。",
    },
    autoPlay: true,
    date: "2018/8/11",
    name: {
      ja: "",
    },
    textContent: {
      ja: `生産準備+で作成したポイント点滅画像を検査履歴システムに入れる事で製品品番専用のポイント点滅画像を簡単に表示できます。`,
      us: `By inserting the point blinking image created with the "Point Blinking Image" into the inspection history system, a point blinking image dedicated to the product part number can be easily displayed.`,
      cn: `通过将系统创建的点闪烁图像插入检测历史系统，可轻松显示产品部件号。`,
    },
    src: "/youtube/videos/70poster.mp4",
    thumbnail: "/youtube/thumbnail/70poster.webp",
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
    thumbnail: "/youtube/thumbnail/41.png",
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
    thumbnail: "/youtube/thumbnail/56.net.png",
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
    thumbnail: "/youtube/thumbnail/main2.png",
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
    thumbnail: "/youtube/thumbnail/main3.png",
  },
];
