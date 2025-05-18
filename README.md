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

#### 2025/05/16. README.md に履歴を残す

pages/skillBlogs/0000.tsx を app/skillBlogs/pages.tsx に移動
silleBlogs を全て移動

privacy と terms を移動
pages/BBS.tsx を移動

##### metadata を各ページに記載

illust/

##### pages/api/auth/を app に移動は Edge と supabase が対応してないから断念して残しておく

contexts に移動済み

#### 05/17.

components を src に移動開始
youtube の menu を編集
youtube の遷移先を修正
ipad を components に移動
getMessage を utils に移動

デプロイ 0001

skillBlogs のトップリンクを修正
posterImage を order/parts に移動

デプロイ 0002

youtube のデザイン修正
modal サイズの調整
youtube のデザイン修正

デプロイ

sidebar のリンク変更 BBS -> bbs

デプロイ 0003

過去の header を削除してリネーム
season を移動
不要っぽい components を削除
pmponents を全て@に移動

デプロイ 0004

components/common を追加して移動

コピー

CustomCloseButton を押したら Modal が閉じるように修正
ダウンロードページのファイル名と更新日の取得を更新

#### chakra-v3 に更新

useColorMode が使えない ->自作コンテキストに変更
Dvider が
Motion が
Modal が
Progress が
extendTheme が
Modal が Dialog
Accordion
npx @chakra-ui/cli snippet add tooltip

#### 予定

全てのリンクをクリックして動作確認
