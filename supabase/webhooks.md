# Supabase Database Webhooks

Supabase ダッシュボード（Database → Webhooks）でだけ設定しているもの。コードからは見えないので、ここに控えておく。

## bbs_notify_new_post

BBS に投稿があったら、スレッド作成者（通知 ON の人）と管理者にメールで知らせる。

| 項目 | 値 |
|---|---|
| Table | `posts` |
| Events | Insert のみ |
| Type | HTTP Request（POST） |
| URL | `https://www.teppy.link/api/notify-new-post/`（`www` 付き・末尾 `/` 付き。転送が入ると失敗する） |
| Timeout | 5000 ms |
| HTTP Headers | `Content-type: application/json`、`x-webhook-secret: <BBS_WEBHOOK_SECRET の値>` |

- 受け側: [app/api/notify-new-post/route.ts](../app/api/notify-new-post/route.ts)
- 合言葉 `BBS_WEBHOOK_SECRET` は `.env.local` と Vercel（Production）に入っている。変えるときは Supabase の Webhook も合わせて変更する。
- 送信に失敗しても再送されない。結果は Vercel のログ（`notify-new-post:` で検索）で確認できる。
- 投稿をまとめて取り込むときは、メールが大量に送られるので一時的に Webhook を無効にする（Resend 無料プランは 1 日 100 通まで）。
- ローカルと本番は同じ Supabase なので、localhost で投稿しても本番の API からメールが送られる。
