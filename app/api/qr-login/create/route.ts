// app/api/qr-login/create/route.ts
// [PC] ログイン中のユーザー本人用に、スマホログイン用QRのコード(2分間有効)を発行する。
// QRにはログイン用トークンを含めない。スマホから来たリクエストをPCで承認して初めてログインできる。
import { NextRequest } from "next/server";
import {
  QR_LOGIN_TTL_SECONDS,
  createNonce,
  sealQrPayload,
} from "@/lib/qrLoginCrypto";
import { TABLE, getCaller, json, supabaseAdmin } from "@/lib/qrLoginServer";

export async function POST(req: NextRequest) {
  try {
    const user = await getCaller(req);
    if (!user?.email) return json({ error: "Unauthorized" }, 401);

    // 古いリクエストの掃除(1日以上前に期限切れのもの)
    await supabaseAdmin
      .from(TABLE)
      .delete()
      .lt("expires_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString());

    const nonce = createNonce();
    const exp = Math.floor(Date.now() / 1000) + QR_LOGIN_TTL_SECONDS;
    const code = sealQrPayload({ n: nonce, u: user.id, exp });
    return json({ code, nonce, expiresAt: exp * 1000 });
  } catch (e: any) {
    console.error("qr-login create error:", e);
    return json({ error: "Internal server error" }, 500);
  }
}
