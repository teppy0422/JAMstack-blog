// lib/sendMail.ts
export async function sendMail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/send-system-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, text }),
    });

    if (!res.ok) {
      console.error("送信失敗:", await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error("送信エラー:", err);
    return false;
  }
}
