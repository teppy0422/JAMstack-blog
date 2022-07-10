const Q = [
  ["問題がありません", "もんだいがありません", 0],
  ["ジャコウ猫", "じゃこうねこ", 150],
  ["アルミ缶の上にあるミカン", "あるみかんのうえにあるみかん", 300],
  ["最上級のおもてなし", "さいじょうきゅうのおもてなし", 300],
  [
    "フットワークなら誰にも負けない！",
    "ふっとわーくならだれにもまけない！",
    350,
  ],
  [
    "俺の酒が飲めないって言うのか！",
    "おれのさけがのめないっていうのか！",
    ,
    350,
  ],
  ["行列のできるラーメン屋", "ぎょうれつのできるらーめんや", 300],
  ["満月輝く秋の夜空", "まんげつかがやくあきのよぞら", 300],
  ["君の涙、ずっと忘れない", "きみのなみだ、ずっとわすれない", 300],
  ["反省だけならサルでも出来る", "はんせいだけならさるでもできる", 300],
  ["給食デザート争奪戦", "きゅうしょくでざーとそうだつせん", 300],
  ["興味のある分野にだけ強い", "きょうみのあるぶんやにだけつよい", 300],
  ["晴れた青空、輝く星空", "はれたあおぞら、かがやくほしぞら", 300],
  ["春の授業は睡眠学習", "はるのじゅぎょうはすいみんがくしゅう", 350],
  ["ロイヤルストレートフラッシュ", "ろいやるすとれーとふらっしゅ", 300],
  ["ノルマンディ上陸作戦", "のるまんでぃじょうりくさくせん", 350],
  ["サイン、コサイン、タンジェント", "さいん、こさいん、たんじぇんと", 350],
  ["一日の始まりは挨拶から", "いちにちのはじまりはあいさつから", 350],
  ["お客さん、看板ですよ", "おきゃくさん、かんばんですよ", 350],
  ["目玉焼きには何をかける？", "めだまやきにはなにをかける？", 400],
  ["遠慮しないでたくさん食べてね", "えんりょしないでたくさんたべてね", 350],
  ["文化祭実行委員会", "ぶんかさいじっこういいんかい", 350],
  ["もう一度チャンスをください", "もういちどちゃんすをください", 350],
  ["それでも地球は回っている", "それでもちきゅうはまわっている", 300],
  ["超豪華賞品が当たります！", "ちょうごうかしょうひんがあたります！", 400],
  ["絶体絶命の大ピンチ", "ぜったいぜつめいのだいぴんち", 350],
  ["今週の日曜日、ヒマ？", "こんしゅうのにちようび、ひま？", 400],
  ["春の新色新発売", "はるのしんしょくしんはつばい", 350],
  ["桜前線北上中", "さくらぜんせんほくじょうちゅう", 350],
  ["自己紹介をしてください", "じこしょうかいをしてください", 350],
  ["スリジャヤワルダナプラコッテ", "すりじゃやわるだなぷらこって", 300],
  ["今日どこで待ち合わせする？", "きょうどこでまちあわせする？", 350],
  ["痛かったら右手を上げてください", "いたかったらみぎてをあげてください", 350],
  ["嘘ついたら針千本飲ーます", "うそついたらはりせんぼんのーます", 350],
  ["おじいさんは山へ柴刈りに", "おじいさんはやまへしばかりに", 350],
  ["おばあさんは川へ洗濯に", "おばあさんはかわへせんたくに", 350],
  ["雨だ！洗濯物しまって！", "あめだ！せんたくものしまって！", 400],
  ["金の斧ですか銀の斧ですか", "きんのおのですかぎんのおのですか", 350],
  ["口先だけじゃ信用されないよ", "くちさきだけじゃしんようされないよ", 350],
  ["食べてすぐ寝たら牛になりました", "たべてすぐねたらうしになりました", 350],
  ["添付ファイルが付いてないよ", "てんぷふぁいるがついてないよ", 350],
  ["東京特許許可局", "とうきょうとっきょきょかきょく", 350],
  ["隣の客はよく柿食う客だ", "となりのきゃくはよくかきくうきゃくだ", 350],
  ["桃がドンブラコと流れてきました", "ももがどんぶらことながれてきました", 350],
  ["本当に終了していいですか？", "ほんとうにしゅうりょうしていいですか？", 350],
  ["壁に耳あり障子に目あり", "かべにみみありしょうじにめあり", 350],
  ["おやつは戸棚に入っています", "おやつはとだなにはいっています", 350],
  ["コーヒー？それとも紅茶？", "こーひー？それともこうちゃ？", 450],
  ["赤巻紙青巻紙黄巻紙", "あかまきがみあおまきがみきまきがみ", 350],
  ["バナナはおやつに入りますか？", "ばななはおやつにはいりますか？", 350],
  ["昨日のことは覚えていません", "きのうのことはおぼえていません", 350],
  ["タンスの角に小指をぶつけた", "たんすのかどにこゆびをぶつけた", 350],
  ["キャビアはチョウザメの卵", "きゃびあはちょうざめのたまご", 350],
  ["心頭滅却すれば火もまた涼し", "しんとうめっきゃくすればひもまたすずし", 400],
  ["太陽系第三惑星地球", "たいようけいだいさんわくせいちきゅう", 400],
  ["マサチューセッツ工科大学", "まさちゅーせっつこうかだいがく", 350],
  ["再セットアップの必要性", "さいせっとあっぷのひつようせい", 350],
  ["六法全書を丸暗記", "ろっぽうぜんしょをまるあんき", 350],
  [
    "今まで本当にお世話になりました",
    "いままでほんとうにおせわになりました",
    350,
  ],
  ["最優秀新人賞", "さいゆうしゅうしんじんしょう", 300],
  ["最高経営責任者", "さいこうけいえいせきにんしゃ", 300],
  ["新東京国際空港", "しんとうきょうこくさいくうこう", 300],
  ["水酸化ナトリウム水溶液", "すいさんかなとりうむすいようえき", 300],
  ["赤パジャマ青パジャマ黄パジャマ", "あかぱじゃまあおぱじゃまきぱじゃま", 400],
  ["解答欄に記入しなさい", "かいとうらんにきにゅうしなさい", 300],
  ["働かざるもの食うべからず", "はたらかざるものくうべからず", 300],
  ["第一志望は譲れない！", "だいいちしぼうはゆずれない！", 350],
  ["大学入試センター試験", "だいがくにゅうしせんたーしけん", 300],
  ["あらかじめご了承ください", "あらかじめごりょうしょうください", 300],
  ["逆転サヨナラ満塁ホームラン", "ぎゃくてんさよならまんるいほーむらん", 300],
  ["いつまでもあると思うな親と金", "いつまでもあるとおもうなおやとかね", 300],
  ["死して屍ひろうものなし", "ししてしかばねひろうものなし", 300],
  ["子供の頃からの夢でした", "こどものころからのゆめでした", 300],
  ["ゴロゴロするのも予定のうち", "ごろごろするのもよていのうち", 300],
  ["超高級リゾートホテル", "ちょうこうきゅうりぞーとほてる", 300],
  ["そこをまっすぐ行ってください", "そこをまっすぐいってください", 300],
  ["基本的人権の尊重", "きほんてきじんけんのそんちょう", 300],
  ["ボランティアさん大募集！", "ぼらんてぃあさんだいぼしゅう！", 350],
  ["生まれ変わった僕を見てください", "うまれかわったぼくをみてください", 300],
  ["アメリカ連邦捜査局", "あめりかれんぽうそうさきょく", 300],
  ["戦闘を開始してください", "せんとうをかいししてください", 300],
  ["あすの天気予報は雨です", "あすのてんきよほうはあめです", 300],
  ["一世一代の大勝負", "いっせいちだいのおおしょうぶ", 300],
  ["どうしようもないほどの悲しみ", "どうしようもないほどのかなしみ", 300],
  ["テスト期間まであと一週間", "てすときかんまであといっしゅうかん", 300],
  ["誕生日プレゼント、何がいい？", "たんじょうびぷれぜんと、なにがいい？", 300],
  ["ゲルマン民族の大移動", "げるまんみんぞくのだいいどう", 300],
  ["交通ルールを守りましょう", "こうつうるーるをまもりましょう", 300],
  ["あの夕日に向かってダッシュだ", "あのゆうひにむかってだっしゅだ", 300],
  ["珍しく真剣な顔してるね", "めずらしくしんけんなかおしてるね", 300],
  [
    "このあとすぐ！チャンネルはそのまま",
    "このあとすぐ！ちゃんねるはそのまま",
    400,
  ],
  ["ハイドロプレーニング現象", "はいどろぷれーにんぐげんしょう", 300],
  ["もうかりまっか？ぼちぼちでんな", "もうかりまっか？ぼちぼちでんな", 350],
  ["またのお越しをお待ちしております", "またのおこしをおまちしております", 300],
  ["駆け込み乗車はおやめください", "かけこみじょうしゃはおやめください", 350],
  ["時間が経つのは早いもので", "じかんがたつのははやいもので", 300],
  ["新規オープン、今なら半額", "しんきおーぷん、いまならはんがく", 300],
  ["ラーメンのスープ、全部飲む？", "らーめんのすーぷ、ぜんぶのむ？", 350],
  ["昨日の疲れがまだとれない", "きのうのつかれがまだとれない", 300],
  ["口先だけで、中身がない", "くちさきだけで、なかみがない", 300],
  ["もう一度お掛け直し下さい", "もういちどおかけなおしください", 300],
  ["携帯の電源をお切り下さい", "けいたいのでんげんをおきりください", 300],
  ["嘘つきは泥棒の始まり", "うそつきはどろぼうのはじまり", 300],
  ["趣味はお茶とお花とお琴です", "しゅみはおちゃとおはなとおことです", 300],
  ["コンピュータ実習室", "こんぴゅーたじっしゅうしつ", 300],
  ["一週間着信なし", "いっしゅうかんちゃくしんなし", 300],
  ["この一瞬に全てをかける", "このいっしゅんにすべてをかける", 300],
  ["夏休みの宿題は多すぎる", "なつやすみのしゅくだいはおおすぎる", 300],
  ["ここから一歩も通さない！", "ここからいっぽもとおさない！", 300],
  ["豆腐の角に頭をぶつける", "とうふのかどにあたまをぶつける", 300],
  ["納豆の糸と格闘中", "なっとうのいととかくとうちゅう", 300],
  ["期間限定特選スイーツ", "きかんげんていとくせんすいーつ", 300],
  ["天は人の上に人を作らず", "てんはひとのうえにひとをつくらず", 300],
  ["抹茶白玉クリームあんみつ", "まっちゃしらたまくりーむあんみつ", 300],
];

export const getQuiz = (Q_used) => {
  //テスト用
  // return [Q[31], 0];

  //主題済みの問題を除いた一覧を作成
  const sp = Q_used.split(",");
  if (Q.length <= sp.length) {
    return [Q[0], 0];
  }
  while (true) {
    let flg = false;
    const Q_No = Math.floor(Math.random() * Q.length); //問題をランダムで出題する
    for (let key in sp) {
      if (Number(sp[key]) === Q_No) {
        flg = true;
      }
    }
    if (flg === false) {
      return [Q[Q_No], Q_No];
    }
  }
};
