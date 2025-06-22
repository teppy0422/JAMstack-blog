// lib/sendMail.ts
export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    const res = await fetch("/api/send-system-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, text, html }),
    });

    const data = await res.json();
    if (!res.ok || data.error || data.errors) {
      return {
        success: false,
        errorMessage:
          data.error ||
          data.errors?.[0]?.message ||
          "不明なエラーが発生しました",
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      errorMessage: err.message ?? "送信処理中に例外が発生しました",
    };
  }
}
