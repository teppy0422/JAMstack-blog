// QRログイン用の暗号化(サーバー専用)
// QRには {n: nonce, u: userId, exp} を AES-256-GCM で暗号化したものを載せる(改ざん・偽造不可)。
// 鍵は SUPABASE_SERVICE_ROLE_KEY から派生させる(QR_LOGIN_SECRET があればそちらを優先)。
import crypto from "crypto";

export const QR_LOGIN_TTL_SECONDS = 120; // QRの有効期限
export const QR_REQUEST_TTL_SECONDS = 180; // スマホからのリクエストを承認できる期限

function getKey(): Buffer {
  const secret =
    process.env.QR_LOGIN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("QR login secret is not configured");
  return crypto.createHash("sha256").update(`qr-login:${secret}`).digest();
}

export type QrPayload = { n: string; u: string; exp: number };

export function sealQrPayload(payload: QrPayload): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const ct = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64url");
}

export function openQrPayload(code: string): QrPayload | null {
  try {
    const buf = Buffer.from(code, "base64url");
    if (buf.length < 29) return null;
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ct = buf.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(ct), decipher.final()]).toString(
      "utf8"
    );
    const p = JSON.parse(json);
    if (
      typeof p?.n !== "string" ||
      typeof p?.u !== "string" ||
      typeof p?.exp !== "number"
    ) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

export const sha256 = (s: string) =>
  crypto.createHash("sha256").update(s).digest("hex");

export const randomToken = (bytes = 24) =>
  crypto.randomBytes(bytes).toString("base64url");
