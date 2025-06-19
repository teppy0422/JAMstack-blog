// app/api/send-system-mail/route.ts
import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text } = await request.json();

    await sgMail.send({
      to, // 受信者（例: 管理者メールなど）
      from: "noreply@teppy.link", // 認証済みの送信元
      replyTo: "teppy422@au.com",
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SendGrid error", error);
    return NextResponse.json({ error: "Failed to send mail" }, { status: 500 });
  }
}
