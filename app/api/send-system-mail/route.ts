// app/api/send-system-mail/route.ts
import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text, html } = await request.json();

    const response = await sgMail.send({
      to,
      from: "noreply@teppy.link",
      replyTo: "teppy422@au.com",
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("SendGrid error:", error?.response?.body || error.message);

    return NextResponse.json(
      {
        error:
          error?.response?.body?.errors?.[0]?.message ||
          "メール送信に失敗しました",
        errors: error?.response?.body?.errors || [],
      },
      { status: 500 }
    );
  }
}
