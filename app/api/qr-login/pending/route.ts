// app/api/qr-login/pending/route.ts
// [PC] 表示中のQRに対して、スマホから承認待ちのリクエストが来ているか確認する。
import { NextRequest } from "next/server";
import {
  TABLE,
  describeDevice,
  getCaller,
  json,
  supabaseAdmin,
} from "@/lib/qrLoginServer";

export async function POST(req: NextRequest) {
  try {
    const user = await getCaller(req);
    if (!user) return json({ error: "Unauthorized" }, 401);
    const { nonce } = await req.json();
    if (typeof nonce !== "string") return json({ error: "invalid" }, 400);

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("id, user_agent, created_at")
      .eq("nonce", nonce)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: true });
    if (error) {
      console.error("qr-login pending error:", error.message);
      return json({ error: "Internal server error" }, 500);
    }
    return json({
      requests: (data ?? []).map((r) => ({
        id: r.id,
        device: describeDevice(r.user_agent),
        createdAt: r.created_at,
      })),
    });
  } catch (e: any) {
    console.error("qr-login pending error:", e);
    return json({ error: "Internal server error" }, 500);
  }
}
