import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let ip =
    req.headers.get("x-forwarded-for") ||
    req.ip ||
    (req as any).connection?.remoteAddress;

  // "::ffff:" を除外
  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  return NextResponse.json({ ip });
}
