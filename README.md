This is a starter template for [Learn Next.js](https://nextjs.org/learn).

---

## stack

nextjs  
[microCMS](https://blog.microcms.io/)  
[vercel](https://vercel.com/)

---

chakra
highcharts

## 参考

[microCMD サンプル](https://blog.microcms.io/microcms-next-jamstack-blog/)

## グラフ

[highcharts](https://www.highcharts.com/docs/index)

## next-auth

### google

デプロイしたらループ

[firebase v9 の書き方](https://qiita.com/ShotaroHirose59/items/23565641612ebfee596a)

import { AuthProvider } from "../public/framework/context/AuthContext";  
をコメントアウトしたらループしなくなった

AuthProvider を...pageprops の最短に移動　 no  
.env.local の apikey を"で囲む no

firebase.ts の値を直接書く ok

本番で隠したい値は、環境変数を Vercel に登録  
Vercel > Setting > Env... > Add New > add 　 ok

LINE リンクで開いた場合、LINE ブラウザでグーグルログインしてないとエラーになる

### Twitter

DeveloperPortal にログインして、進めていったらいい  
詳細は覚えてない

### LINE

LINE Developers にログインして...
!!メールアドレスの使用目的を説明するスクリーンショットが無くて断念

## 問題点

ブラウザにログインしてない場合、error403 になる

## DataBase

https://zenn.dev/fjsh/articles/733a1334ffc1c8

## Sqlite で動作テスト

開発では動作した  
本番では動作しなかった  
本番向きではないらしい 中止

## Prisma

pscale connect teppy-link main --port 3309

## @prisma/adapter を削除、インストールをする

prisma が開発で動作するようになった  
本番では動作しない

## vercel に env の値を登録

動作しない

## pages/blog.tsx から投稿を追加

デプロイでエラー  
Type error: Property 'sampleBlog' does not exist on type 'PrismaClient<PrismaClientOptions, never, RejectOnNotFound | RejectPerOperation>'.

sampleBlog に統一 ng  
DATABASE_URL='mysql://z8...に変更 ng  
DATABASE_URL='mysql://na...に変更 ng

schema.prisma に@@map("sampleblog")を追記 ok

## 画像検索を追加

https://pixabay.com/api/docs/

## 無限スクロールを追加

npm install react-infinite-scroller

## 画像検索を追加 2

https://www.flickr.com/  
https://syncer.jp/flickr-api-matome

ライセンスについて  
https://relaxing-living-life.com/180/

## Verup

React のバージョンアップ 17.0.2 > 18.1.0  
Next

## three.js

https://gltf.pmnd.rs/  
https://qiita.com/naberyo34/items/181f817ddd38c74dbc76#blender%E3%81%A7%E8%87%AA%E4%BD%9C%E3%81%97%E3%81%9F%E3%83%A2%E3%83%87%E3%83%AB%E3%82%92%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%82%80

https://threejs.org/docs/#examples/en/controls/OrbitControls

## 追加予定

サウンド  
入力判定
ローマ字入力候補を表示  
色を変更  
タイピング速度

結果を登録  
ランキング

## 参考サイト

https://graphicbeats.net/

## magic.link に変更を検討 cancel

https://dashboard.magic.link/

node のバージョン変更  
node v16.14.2 > v17.9.1

prisma/adapter の更新  
v3.14 > v4.0

## nextauth に変更

LINE 認証があるから

nextauth.js を変更
.js > .ts

<SessionProvider session={session}>
↓　
<SessionProvider session={pageProps.session}>

signin を co
debug:true を追加
callback を co

prisma.adpter を co

npx prisma generate
session が怪しい

vercel > setting > general > Node.jsVersion  
16.x > 14.x > 12.x >14.x

prisma の更新。軌道からデプロイまで
404 ページにログインを実装

package.json に追加  
 "migrate:deploy": "prisma migrate deploy"

nextauth.js に追加
"session:{strategy:"database",maxage:30*24*60\*60}

package.json を編集  
 "build": "next build && next export && next-sitemap --config sitemap.config.js",

> "build": "next build && next-sitemap --config sitemap.config.js",

out を削除 ok

node のバージョンを変更  
v17.9.1 > v16.15.1

Vercel node のバージョンを変更  
14.x > 16.x

--ここで保存--

## ログイン情報の取得

typing の一部を component にまとめる  
モーダルを移動  
親コンポーネントから子コンポーネントを実行する処理を追加

っしゅ。に対応 ok

## キーボードコンポーネントの作成

# ゲーム中に別ページに遷移したらイベントが残る

/ページ遷移時の処理  
/イベントリスナーを解除

## 本番環境で実行したら反映されない時がある フィールドの追加など

times がないってエラー <-type が問題?  
本番で登録ができない > times や missed を追加してそれが型エラーになってる？

main-shadow を作り直して push から deploy まで実行

/グラフのコメント  
ダイナミックインポートをやってみる

#############ブログに追加###############

デプロイしたらこういうエラーがでる
Type error: Type '{ userId: string; result: number; course: string; name: string; image: string; times: number; missed: number; }' is not assignable to type '(Without<TypingResultCreateInput, TypingResultUncheckedCreateInput> & TypingResultUncheckedCreateInput) | (Without<...> & TypingResultCreateInput)'.

エラー箇所はこんな感じ
name: String(req.body.name),
31 | image: String(req.body.image),

> 32 | times: Number(req.body.times),

     |           ^

33 | missed: Number(req.body.missed),

prisma/client が vercel にないっぽい

##########そのうち必要になりそう###########

prisma でテーブルのリレーション
https://zenn.dev/kanasugi/articles/e11ba9cdea9911

ESLint の導入
