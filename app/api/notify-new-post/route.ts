// app/api/notify-new-post/route.ts
// BBSに新着投稿があったとき、スレッド作成者(通知ON)と管理者にメール通知する。
// Supabase の Database Webhook(posts の INSERT)から呼ばれる。
// ブラウザ側に依存しないので、古い画面のまま投稿されても必ず通知される。
// 認証: ヘッダー x-webhook-secret が環境変数 BBS_WEBHOOK_SECRET と一致すること。
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { bbsNotifEmailHtml } from "@/lib/templates/bbsNotifEmailHtml";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_USER_ID = "6cc1f82e-30a5-449b-a2fe-bc6ddf93a7c0";
const MAIL_FROM = process.env.MAIL_FROM || "BBS <noreply@teppy.link>";
const SITE_URL = "https://www.teppy.link";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

async function sendWithResend(to: string, subject: string, text: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: MAIL_FROM, to: [to], subject, text, html }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }
}

async function getEmail(uid: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(uid);
  if (error) return null;
  return data.user?.email ?? null;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY is not set" }, { status: 500 });
    }

    // Webhookの合言葉を確認
    const expected = process.env.BBS_WEBHOOK_SECRET;
    const given = req.headers.get("x-webhook-secret") || "";
    if (!expected) {
      return NextResponse.json({ error: "BBS_WEBHOOK_SECRET is not set" }, { status: 500 });
    }
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Supabase Webhook の形式: { type: "INSERT", table: "posts", record: {...} }
    const body = await req.json();
    if (body?.type !== "INSERT" || body?.table !== "posts" || !body?.record?.id) {
      return NextResponse.json({ skipped: "not a posts INSERT" });
    }
    const postId = body.record.id;

    const { data: post, error: postError } = await supabaseAdmin
      .from("posts")
      .select("id, thread_id, content, user_uid, file_url")
      .eq("id", postId)
      .single();
    if (postError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const callerId = post.user_uid; // 投稿者

    const { data: thread } = await supabaseAdmin
      .from("threads")
      .select("id, title, user_uid")
      .eq("id", post.thread_id)
      .single();
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const { data: sender } = await supabaseAdmin
      .from("table_users")
      .select("picture_url")
      .eq("id", callerId)
      .maybeSingle();

    const threadTitle = thread.title || "";
    const bodyText = post.content || (post.file_url ? "(添付ファイル)" : "");
    const threadUrl = `${SITE_URL}/bbs/thread/${thread.id}`;
    const subject = `📨 BBSの${threadTitle}に新着メッセージ`;
    const text = `${threadTitle} に新着メッセージ\n${bodyText}\n\n${threadUrl}`;
    const html = bbsNotifEmailHtml({
      threadTitle: escapeHtml(threadTitle),
      inputValue: escapeHtml(bodyText).replace(/\n/g, "<br>"),
      threadUrl,
      senderAvatarUrl: escapeHtml(sender?.picture_url ?? ""),
    });

    // 宛先を決定(重複・自分宛ては除外)
    const recipients = new Set<string>();

    // スレッド作成者: 通知ONかつ自分の投稿でない場合
    if (thread.user_uid && thread.user_uid !== callerId) {
      const { data: owner } = await supabaseAdmin
        .from("table_users")
        .select("is_email_notify")
        .eq("id", thread.user_uid)
        .maybeSingle();
      if (owner?.is_email_notify) recipients.add(thread.user_uid);
    }
    // 管理者: 常に通知(管理者自身の投稿は除く)
    if (callerId !== ADMIN_USER_ID) recipients.add(ADMIN_USER_ID);

    const results: { uid: string; ok: boolean; error?: string }[] = [];
    for (const uid of recipients) {
      const email = await getEmail(uid);
      if (!email) {
        results.push({ uid, ok: false, error: "email not found" });
        continue;
      }
      try {
        await sendWithResend(email, subject, text, html);
        results.push({ uid, ok: true });
      } catch (e: any) {
        console.error("notify-new-post send error:", uid, e.message);
        results.push({ uid, ok: false, error: e.message });
      }
    }

    const failed = results.filter((r) => !r.ok);
    // 後から調べられるように結果を記録(メールアドレスは出さない)
    console.log(
      "notify-new-post:",
      JSON.stringify({ postId, threadId: thread.id, poster: callerId, results })
    );
    return NextResponse.json(
      { success: failed.length === 0, sent: results.length - failed.length, failed },
      { status: failed.length ? 502 : 200 }
    );
  } catch (e: any) {
    console.error("notify-new-post error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
