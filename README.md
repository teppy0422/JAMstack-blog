:2025-05-16:
README.md に履歴を残す

pages/skillBlogs/0000.tsx を app/skillBlogs/pages.tsx に移動
silleBlogs を全て移動

privacy と terms を移動
pages/BBS.tsx を移動

##### pages/api/auth/を app に移動は Edge と supabase が対応してないから断念して残しておく

contexts に移動済み

:2025-05-17:
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

npx @chakra-ui/cli snippet add tooltip

skillBlogs/0010/にサムネとかディスクリプションを設定する構造を追加
skillBlosg の readBy の UI とか変更
Open ReadyByIcon when setIsBottom is called in called in skillBlogs.
change design heart icon in skillBlogs.
Review decision to scroll to the bottom in bbs/.
Review the height at the bottom of skillBlogs/.
Fix position of open/close icon in bbs preview.
Click on a firefly to view the description page.
:2025-06-10:
Fix design of threadTitle in BBS.
Review Stiky date label.
-deploy 0006-
:2025-06-11:
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
:2025-06-16:
Change youtube as a whole
-deploy 0010-
:2025-06-17:
-deploy 0011-
Add AspectRatio to YouTubeFrame
Support YouTube Play in YouTubeFrame
Add playback time to youtube
Add icon if youtube.com to youtube
Changed control to animate when mousing over video
Fix youtube progress bar
-deploy 0012-
:2025-06-18:
Added Play and Pause button animation to youtube page.
Change Visible youtube's icon if thumbnail of included youtube.com
-deploy 0013-
:2025-06-19:
Add icons to Mac-style 3-color buttons
Added Screen for unauthenticated and not logged in
Changed header icon when not logged in.
Login information design changed to Liquid Glass.
-deploy 0014-
:2025-06-23:
CustomModalize the login user icon.
SendMail successfully with test/page.tsx
SendMail embedded in bbs/[id]/page.tsx
-commit 0015-
Added html format to SendMail
-deploy 0015-
Re-create CustomToast and rewrite toast
-deploy 0017-
:2025-06-24:
Modalize alert
-deploy 0018-
:2025-06-26:
Fix get-email
install ngrok to allow https connections even on localhost
npm install @daily-co/daily-js
Install daily Add voice chat
-deploy 0019-
:2025-06-27:
-deploy 0020-
change Adobe font setting from head to layout
-deploy 0021-
Correct header balance and design
Added Tanabata animation
-deploy 0022-
:2025-06-28:
Added Yps1.03
Fixed SkillBolgs 0010
Deploy 0023
:2025-07-01:
!Yps is old verstion
Add Firework Animation
Deploy 0024
:2025-07-02:
Added app/api/version
deploy 0025
:2025-07-04:
deploy 0026
:2025-07-05:
Change Dates to Google Calendar
deploy 0027
:2025-07-06:
Add stocking date to order
deploy 0028
:2025-07-07:
Do not cache the latest Download links
deploy 0029
Added log-error to update error log
deploy 0030
:2025-07-08:
Added yps1.13
deploy 0031
Change Api path
deploy 0032
Added yps1.17
deploy 0033
:2025-07-09:
Added error log and execution history to download page
deploy 0034
:2025-07-10:
Fixed a bug that caused the last update date of the download page to be today in production.
deploy 0036
:2025-07-12:
Design modification of alert(this modal)
deploy 0037
Fixed copying process of code and added title
deploy 0038
:2025-07-21:
Add SkillGlog/0015 for new project
:2025-07-24:
deploy 0039
:2025-07-28:
Updated skillBlogs/0015
deploy 0040
:2025-08-04:
Migration of development environment from windows to mac
Change skillBlogs/pages/0015
deploy 0041
deploy 0042
Change skillBlogs/pages/0015
deploy 0043
version up node
deploy 0044
redeploy vercel
upload sjp3.101.26
deploy 0045
Add a check to see if new articles have been published in microcms
deploy 0046
blogs/で google map リンクの場合のアイコンを修正
deploy 0047
blogs/で google map の埋め込みに対応+レスポンシブ
deploy 0048

#### Doing Now

switch アイコンの向きを変える
react-icons を利用しない

ui をまとめる input とか button とか toast とか
サブ自動立案

#### What's Next

ダッシュボードの作成
Changed our approach to this activity to customModal.

I think the screen is not refreshing with the add new button.
if is is useState, rendering will occur each time, so change it to useRef.

Add metadata to each page
Update to chakra-v3
1.useColorMode が使えない ->自作コンテキストに変更
2.Dvider が
3.Motion が
4.Modal が
5.Progress が
6.extendTheme が
7.Modal が Dialog
8.Accordion

#### Wait and See

supabase 過去の日程のテーブル削除
order/のサムネ変更が反映されないから様子見

voicechat の api 消費がヤバい

##### metadata を各ページに記載

illust/
order/
orderAdmin/
skillBlogs/

| Excel の種類 |        動作の安定性        | Windows 10 対応 | Windows 11 対応 |
| :----------: | :------------------------: | :-------------: | :-------------: |
|   32bit 版   |  メモリ制限で動作が不安定  |      対応       |      対応       |
|   64bit 版   | 大量の画像でも安定して動作 |     未対応      |     未対応      |

### 解説

- **32bit 版 Excel** は、扱えるメモリが最大で約 2GB までに制限されています。  
  そのため、オートシェイプや画像、グラフなどを多く扱うファイルでは動作が重くなったり、途中でフリーズ・強制終了することがあります。

- **64bit 版 Excel** は、このメモリ制限がほぼなく、大きなファイルや複雑な処理にも余裕があります。  
  特に、画像を大量に扱う **「生産準備＋」** のようなアプリでは、処理速度・安定性の両方で明確に有利です。

### まとめ

- Excel VBA で画像やオブジェクトを多く扱うなら、**64bit 版の Excel を強くおすすめ**します。
- ただし、古いアドインや API 宣言を使う VBA は、64bit 対応コード（`PtrSafe`宣言など）に修正が必要になる場合があります。
