// app/test/page.tsx
"use client";

import { Button, Box, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

export default function TestMailPage() {
  const [sending, setSending] = useState(false);
  const toast = useToast();

  const handleTestSend = async () => {
    setSending(true);

    const res = await fetch("/api/send-system-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "teppy@aol.jp", // ← 受信したいメールアドレス
        subject: "📨 メール送信テスト",
        text: "このメールは App Router からのテスト送信です。",
      }),
    });

    if (res.ok) {
      toast({ title: "送信成功！", status: "success" });
    } else {
      toast({ title: "送信失敗", status: "error" });
    }

    setSending(false);
  };

  return (
    <Box p={10}>
      <Text fontSize="lg" mb={4}>
        📬 メール送信テストページ（App Router）
      </Text>
      <Button colorScheme="blue" isLoading={sending} onClick={handleTestSend}>
        テストメールを送信
      </Button>
    </Box>
  );
}
