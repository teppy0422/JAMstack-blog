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

skillBlogs のトップリンクを修正
posterImage を order/parts に移動

youtube のデザイン修正
modal サイズの調整
youtube のデザイン修正

sidebar のリンク変更 BBS -> bbs

-deploy0003-

過去の header を削除してリネーム
season を移動
不要っぽい components を削除
pmponents を全て@に移動

-deploy0004-

components/common を追加して移動

CustomCloseButton を押したら Modal が閉じるように修正
ダウンロードページのファイル名と更新日の取得を更新
applList のデザイン修正

-deploy0005-

料亭のフォント修正

toast のカスタム

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

skillBlogs/0010/にサムネとかディスクリプションを設定する構造を追加
skillBlosg の readBy の UI とか変更
Open ReadyByIcon when setIsBottom is called in called in skillBlogs.
change design heart icon in skillBlogs.
Review decision to scroll to the bottom in bbs/.
Review the height at the bottom of skillBlogs/.
Fix position of open/close icon in bbs preview.
Click on a firefly to view the description page.
Fix design of threadTitle in BBS.
Review Stiky date label.
-deploy 0006-
Review design login infomation.
Add three close button.
Fix background color of currentDate.
-deploy 0007-
Try using the modal ui as a template.
-deploy 0008-
NowStatus reflects customModal.
Bussiness card reflects customModal.
CustomModalize the newly add button on bbs.
fixed getMessage.
Change all modals in downloads to customModal.
-deploy 0009-
Change youtube as a whole
-deploy 0010-
-deploy 0011-
Add AspectRatio to YouTubeFrame
Support YouTube Play in YouTubeFrame
Add playback time to youtube
Add icon if youtube.com to youtube
Changed control to animate when mousing over video
Fix youtube progress bar
-deploy 0012-
Added Play and Pause button animation to youtube page.
Change Visible youtube's icon if thumbnail of included youtube.com
-deploy 0013-
Add icons to Mac-style 3-color buttons
Added Screen for unauthenticated and not logged in
Changed header icon when not logged in.
Login information design changed to Liquid Glass.
-deploy 0014-
CustomModalize the login user icon.
SendMail successfully with test/page.tsx
SendMail embedded in bbs/[id]/page.tsx
-commit 0015-
Added html format to SendMail
-deploy 0015-
Re-create CustomToast and rewrite toast
-deploy 0017-
Modalize alert
-deploy 0018-
Fix get-email
install ngrok to allow https connections even on localhost
npm install @daily-co/daily-js
Install daily Add voice chat
-deploy 0019-
-deploy 0020-
change Adobe font setting from head to layout
-deploy 0021-
Correct header balance and design
Added Tanabata animation
-deploy 0022-
Added Yps1.03
Fixed SkillBolgs 0010
Deploy 0023
!Yps is old verstion
Add Firework Animation
Deploy 0024
Added app/api/version
deploy 0025
deploy 0026

#### to do now

switch アイコンの向きを変える
react-icons を利用しない

ui をまとめる input とか button とか toast とか
サブ自動立案

#### to do

Changed our approach to this activity to customModal.

新しく追加ボタンで画面が更新されない気がする

if is is useState, rendering will occur each time, so change it to useRef.

#### confirmation required

order/のサムネ変更が反映されないから様子見

#### comming soon...

全てのリンクをクリックして動作確認

#### ngrok で localhost を https にする

1.https://dashboard.ngrok.com にアクセスしてアカウントを作成（無料）

2.ダッシュボードに表示されている「Auth Token」をコピー

3.ngrok config add-authtoken <ここにトークン貼る>

4.ngrok http 3000

5.表示される Forwarding ではじまるアドレスで接続する

npm run dev -- --hostname 0.0.0.0
ngrok http 3000

端末識別子は「板の上」に重ならず配置される
各端末の位置は線長から推測する
板は x と y で表現される。z は無い。
端末は電線で接続されている
電線は他の端末を跨がない（物理的に接触・交差しない）
電線は分岐点を経由することがある
電線に曲線は存在しない。必ず直線とする。
分岐点は黒い点で表現する
