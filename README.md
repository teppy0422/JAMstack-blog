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

#### to do now

BBS 通知 html
BBS notification html

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
