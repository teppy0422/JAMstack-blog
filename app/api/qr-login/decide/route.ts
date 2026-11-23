// app/api/qr-login/decide/route.ts
// [PC] スマホからのリクエストを許可/拒否する。許可したときだけログイン用トークンを発行する。
import { NextRequest } from "next/server";
import { TABLE, getCaller, json, supabaseAdmin } from "@/lib/qrLoginServer";

export async function POST(req: NextRequest) {
  try {
    const user = await getCaller(req);
    if (!user?.email) return json({ error: "Unauthorized" }, 401);
    const { requestId, approve } = await req.json();
    if (typeof requestId !== "string" || typeof approve !== "boolean") {
      return json({ error: "invalid" }, 400);
    }

    const { data: row } = await supabaseAdmin
      .from(TABLE)
      .select("id, user_id, status, expires_at")
      .eq("id", requestId)
      .maybeSingle();
    if (!row || row.user_id !== user.id) return json({ error: "not_found" }, 404);
    if (row.status !== "pending") return json({ error: "already_decided" }, 409);
    if (new Date(row.expires_at).getTime() < Date.now()) {
      return json({ error: "expired" }, 410);
    }

    if (!approve) {
      await supabaseAdmin
        .from(TABLE)
        .update({ status: "denied" })
        .eq("id", requestId)
        .eq("status", "pending");
      return json({ success: true, status: "denied" });
    }

    // メールは送信されない(ログイン用トークンを生成するだけ)
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: user.email,
    });
    const hashedToken = data?.properties?.hashed_token;
    if (error || !hashedToken) {
      console.error("qr-login generateLink error:", error?.message);
      return json({ error: "Failed to create login token" }, 500);
    }

    const { data: updated } = await supabaseAdmin
      .from(TABLE)
      .update({ status: "approved", token_hash: hashedToken })
      .eq("id", requestId)
      .eq("status", "pending")
      .select("id");
    if (!updated?.length) return json({ error: "already_decided" }, 409);
    return json({ success: true, status: "approved" });
  } catch (e: any) {
    console.error("qr-login decide error:", e);
    return json({ error: "Internal server error" }, 500);
  }
}
