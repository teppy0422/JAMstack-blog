// app/api/qr-login/request/route.ts
// [スマホ] QRのコードと、スマホで生成した秘密値を送ってログインをリクエストする。
import { NextRequest } from "next/server";
import {
  QR_REQUEST_TTL_SECONDS,
  openQrPayload,
  sha256,
} from "@/lib/qrLoginCrypto";
import { TABLE, json, supabaseAdmin } from "@/lib/qrLoginServer";

const MAX_REQUESTS_PER_QR = 5;

export async function POST(req: NextRequest) {
  try {
    const { code, secret } = await req.json();
    if (
      typeof code !== "string" ||
      code.length > 2000 ||
      typeof secret !== "string" ||
      secret.length < 32 ||
      secret.length > 200
    ) {
      return json({ error: "invalid" }, 400);
    }
    const payload = openQrPayload(code);
    if (!payload) return json({ error: "invalid" }, 400);
    if (payload.exp * 1000 < Date.now()) return json({ error: "expired" }, 410);

    // 1つのQRからのリクエスト数を制限
    const { count } = await supabaseAdmin
      .from(TABLE)
      .select("id", { count: "exact", head: true })
      .eq("nonce", payload.n);
    if ((count ?? 0) >= MAX_REQUESTS_PER_QR) {
      return json({ error: "too_many" }, 429);
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert({
        nonce: payload.n,
        user_id: payload.u,
        secret_hash: sha256(secret),
        user_agent: (req.headers.get("user-agent") || "").slice(0, 300),
        expires_at: new Date(
          Date.now() + QR_REQUEST_TTL_SECONDS * 1000
        ).toISOString(),
      })
      .select("id")
      .single();
    if (error || !data) {
      console.error("qr-login request insert error:", error?.message);
      return json({ error: "Internal server error" }, 500);
    }
    return json({ requestId: data.id });
  } catch (e: any) {
    console.error("qr-login request error:", e);
    return json({ error: "Internal server error" }, 500);
  }
}
