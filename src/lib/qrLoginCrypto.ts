// QRログイン用の暗号化(サーバー専用)
// QRには {nonce, userId, exp} を AES-256-GCM で暗号化したものを載せる(改ざん・偽造不可)。
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

// QRを小さく(=読み取りやすく)するため、JSONではなくバイナリで詰める
// 平文: nonce(12バイト) + userId(UUID 16バイト) + exp(UInt32 4バイト) = 32バイト
// 暗号文: iv(12) + tag(16) + 平文(32) = 60バイト → base64urlで80文字
const NONCE_BYTES = 12;

export const createNonce = () =>
  crypto.randomBytes(NONCE_BYTES).toString("base64url");

const uuidToBytes = (uuid: string) => Buffer.from(uuid.replace(/-/g, ""), "hex");
const bytesToUuid = (b: Buffer) => {
  const h = b.toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};

export function sealQrPayload(payload: QrPayload): string {
  const nonce = Buffer.from(payload.n, "base64url");
  const uid = uuidToBytes(payload.u);
  if (nonce.length !== NONCE_BYTES || uid.length !== 16) {
    throw new Error("invalid QR payload");
  }
  const exp = Buffer.alloc(4);
  exp.writeUInt32BE(payload.exp);
  const plain = Buffer.concat([nonce, uid, exp]);

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const ct = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64url");
}

export function openQrPayload(code: string): QrPayload | null {
  try {
    const buf = Buffer.from(code, "base64url");
    if (buf.length !== 12 + 16 + NONCE_BYTES + 16 + 4) return null;
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ct = buf.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(ct), decipher.final()]);
    return {
      n: plain.subarray(0, NONCE_BYTES).toString("base64url"),
      u: bytesToUuid(plain.subarray(NONCE_BYTES, NONCE_BYTES + 16)),
      exp: plain.readUInt32BE(NONCE_BYTES + 16),
    };
  } catch {
    return null;
  }
}

export const sha256 = (s: string) =>
  crypto.createHash("sha256").update(s).digest("hex");
