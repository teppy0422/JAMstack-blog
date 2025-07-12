{
getMessage({
ja:'',
us:'',
cn:'',
},language)
}

# Markdown の基本書き方ガイド

Markdown は、シンプルな記法で文書を記述できるマークアップ言語です。ここでは基本的な構文を紹介します。

## 見出し

# 見出し 1

## 見出し 2

### 見出し 3

_イタリック_
**太字**
~~打ち消し線~~

- アイテム 1
- アイテム 2
  - サブアイテム

1. 最初の項目
2. 次の項目

[リンクテキスト](https://google.com)

![画像の代替テキスト](https://google.com)

[SendGrid](https://app.sendgrid.com/email_activity?_gl=1*10mbfns*_gcl_au*MTgyMzcxNTA5Ni4xNzUwMzMwNTY4*_ga*MTIzNTgzODU3Ny4xNzUwMzMwNTY4*_ga_8W5LR442LD*czE3NTAzNTAyMjkkbzMkZzEkdDE3NTAzNTYxMzgkajYwJGwwJGgw&filters=%22%22&isAndOperator=true&page=1)

> これは引用です。

これは `console.log` を使った例です。

```js
function hello() {
  console.log("Hello, Markdown!");
}
```

| 名前 | 年齢 | 職業       |
| ---- | ---- | ---------- |
| 山田 | 30   | エンジニア |
| 鈴木 | 25   | デザイナー |

#### ngrok で localhost を https にする

1.https://dashboard.ngrok.com にアクセスしてアカウントを作成（無料）

2.ダッシュボードに表示されている「Auth Token」をコピー

3.ngrok config add-authtoken <ここにトークン貼る>

4.ngrok http 3000

5.表示される Forwarding ではじまるアドレスで接続する

npm run dev -- --hostname 0.0.0.0
ngrok http 3000

ダウンロードした.zip ファイルを AAA して下さい

Please AAA the .zip file you downloaded

AAA 下载的 .zip 文件。

<FaReplyIcon
      size="18px"
      fill="custom.theme.light.900"
      stroke="currentColor"
    />

端末識別子は「板の上」に重ならず配置される
各端末の位置は線長から推測する
板は x と y で表現される。z は無い。
端末は電線で接続されている
電線は他の端末を跨がない（物理的に接触・交差しない）
電線は分岐点を経由することがある
電線に曲線は存在しない。必ず直線とする。
分岐点は黒い点で表現する
