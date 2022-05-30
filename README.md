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
をコメントアウトしたらリープしなくなった

AuthProvider を...pageprops の最短に移動　 no

.env.local の apikey を"で囲む no

firebase.ts の値を直接書く ok

隠したい値は、環境変数を Vercel に登録  
Vercel > Setting > Env... > Add New > add 　 ok

### Twitter

DeveloperPortal にログインして、進めていったらいい  
詳細は覚えてない

### LINE

LINE Developers にログインして...
!!メールアドレスの使用目的を説明するスクリーンショットが無くて断念

## 問題点

ブラウザにログインしてない場合、error403 になる
