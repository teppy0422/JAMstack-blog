// app/api/qr-login/status/route.ts
// [スマホ] 自分のリクエストが承認されたか確認する。秘密値が一致した場合のみ応答し、
// 承認済みならログイン用トークンを1回だけ渡す(渡したらDBから消す)。
import { NextRequest } from "next/server";
import { sha256 } from "@/lib/qrLoginCrypto";
import { TABLE, json, supabaseAdmin } from "@/lib/qrLoginServer";

export async function POST(req: NextRequest) {
  try {
    const { requestId, secret } = await req.json();
    if (typeof requestId !== "string" || typeof secret !== "string") {
      return json({ error: "invalid" }, 400);
    }
    const { data: row } = await supabaseAdmin
      .from(TABLE)
      .select("id, status, secret_hash, token_hash, expires_at")
      .eq("id", requestId)
      .maybeSingle();
    if (!row || row.secret_hash !== sha256(secret)) {
      return json({ error: "not_found" }, 404);
    }

    if (row.status === "approved" && row.token_hash) {
      // 受け取りは1回だけ(同時アクセスでも片方しか取れないよう status で条件付け)
      const { data: consumed } = await supabaseAdmin
        .from(TABLE)
        .update({ status: "consumed", token_hash: null })
        .eq("id", requestId)
        .eq("status", "approved")
        .select("id");
      if (!consumed?.length) return json({ status: "consumed" });
      return json({ status: "approved", tokenHash: row.token_hash });
    }
    if (row.status === "pending" && new Date(row.expires_at).getTime() < Date.now()) {
      return json({ status: "expired" });
    }
    return json({ status: row.status }); // pending / denied / consumed
  } catch (e: any) {
    console.error("qr-login status error:", e);
    return json({ error: "Internal server error" }, 500);
  }
}
