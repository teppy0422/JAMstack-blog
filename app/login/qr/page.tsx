"use client";
// スマホでQRコードを読み取ったときに開くページ。
// ログインをリクエストし、PCで「許可」されたらログインする。
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Spinner, Text, VStack } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

type Status =
  | "requesting"
  | "waiting"
  | "success"
  | "denied"
  | "expired"
  | "invalid"
  | "error";

const POLL_INTERVAL_MS = 2000;
const MAX_WAIT_MS = 200 * 1000; // サーバー側の承認期限(180秒)より少し長く待つ
const STORAGE_KEY = "qrLoginRequest";

// スマホだけが知る秘密値(これがないと承認後のトークンを受け取れない)
function createSecret(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function QrLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [status, setStatus] = useState<Status>("requesting");
  const started = useRef(false);
  const cancelled = useRef(false);

  useEffect(() => {
    // StrictMode(開発時)では マウント→アンマウント→再マウント が起きるため、
    // 再マウント時にキャンセルを解除し、処理自体は1回だけ実行する
    cancelled.current = false;
    if (started.current) {
      return () => {
        cancelled.current = true;
      };
    }
    started.current = true;

    const run = async () => {
      const code = new URLSearchParams(window.location.search).get("c");
      // 履歴にコードを残さない
      window.history.replaceState(null, "", window.location.pathname);

      // リクエスト作成(ページ再読み込み時は前回のリクエストを引き継ぐ)
      let req: { requestId: string; secret: string; startedAt: number } | null =
        null;
      if (code) {
        const secret = createSecret();
        try {
          const res = await fetch("/api/qr-login/request/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, secret }),
          });
          if (res.status === 410) return setStatus("expired");
          if (!res.ok) return setStatus("invalid");
          const { requestId } = await res.json();
          req = { requestId, secret, startedAt: Date.now() };
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(req));
        } catch (e) {
          console.error("QR login request error:", e);
          return setStatus("error");
        }
      } else {
        try {
          req = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
        } catch {
          req = null;
        }
        if (!req) return setStatus("invalid");
      }

      setStatus("waiting");

      // PCでの承認を待つ
      while (!cancelled.current) {
        if (Date.now() - req.startedAt > MAX_WAIT_MS) {
          sessionStorage.removeItem(STORAGE_KEY);
          return setStatus("expired");
        }
        try {
          const res = await fetch("/api/qr-login/status/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestId: req.requestId,
              secret: req.secret,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.status === "approved" && data.tokenHash) {
              sessionStorage.removeItem(STORAGE_KEY);
              const { error } = await supabase.auth.verifyOtp({
                token_hash: data.tokenHash,
                type: "magiclink",
              });
              if (error) {
                console.error("QR login verifyOtp error:", error.message);
                return setStatus("error");
              }
              setStatus("success");
              // ユーザー情報(UserContext)は読み込み時にしか取得されないため、
              // ページを再読み込みして新しいアカウントを反映させる
              setTimeout(() => window.location.replace("/"), 1200);
              return;
            }
            if (data.status === "denied") {
              sessionStorage.removeItem(STORAGE_KEY);
              return setStatus("denied");
            }
            if (data.status === "expired" || data.status === "consumed") {
              sessionStorage.removeItem(STORAGE_KEY);
              return setStatus("expired");
            }
          } else if (res.status === 404) {
            sessionStorage.removeItem(STORAGE_KEY);
            return setStatus("invalid");
          }
        } catch (e) {
          // 一時的な通信エラーは待機を続ける
          console.error("QR login status error:", e);
        }
        await sleep(POLL_INTERVAL_MS);
      }
    };
    run();
    return () => {
      cancelled.current = true;
    };
  }, [router]);

  const messages: Record<
    Exclude<Status, "requesting" | "waiting">,
    { ja: string; us: string; cn: string }
  > = {
    success: {
      ja: "ログインしました。トップページへ移動します…",
      us: "Logged in. Redirecting to the top page…",
      cn: "已登录。正在跳转到首页…",
    },
    denied: {
      ja: "PCでログインが拒否されました。",
      us: "The login was denied on the PC.",
      cn: "电脑上拒绝了登录。",
    },
    expired: {
      ja: "有効期限が切れました。PCでQRを再発行してください。",
      us: "This request has expired. Please reissue the QR code on your PC.",
      cn: "请求已过期。请在电脑上重新生成二维码。",
    },
    invalid: {
      ja: "このQRコードは無効です。PCでQRを再発行してください。",
      us: "This QR code is invalid. Please reissue it on your PC.",
      cn: "此二维码无效。请在电脑上重新生成。",
    },
    error: {
      ja: "ログインに失敗しました。PCでQRを再発行して、もう一度お試しください。",
      us: "Login failed. Please reissue the QR code on your PC and try again.",
      cn: "登录失败。请在电脑上重新生成二维码后重试。",
    },
  };

  return (
    <Box
      minH="70vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
    >
      <VStack spacing={4} maxW="360px" textAlign="center">
        {status === "requesting" || status === "waiting" ? (
          <>
            <Spinner size="lg" />
            <Text fontWeight="bold">
              {status === "requesting"
                ? getMessage({
                    ja: "リクエストを送信しています…",
                    us: "Sending request…",
                    cn: "正在发送请求…",
                    language,
                  })
                : getMessage({
                    ja: "PCの画面で「許可」を押してください",
                    us: 'Press "Allow" on your PC screen',
                    cn: "请在电脑屏幕上点击“允许”",
                    language,
                  })}
            </Text>
            {status === "waiting" && (
              <Text fontSize="sm" color="gray.500">
                {getMessage({
                  ja: "許可されると自動でログインします。このページは開いたままにしてください。",
                  us: "You will be logged in automatically once approved. Keep this page open.",
                  cn: "允许后将自动登录。请保持此页面打开。",
                  language,
                })}
              </Text>
            )}
          </>
        ) : (
          <>
            <Text
              color={status === "success" ? "green.500" : "red.500"}
              fontWeight="bold"
            >
              {getMessage({ ...messages[status], language })}
            </Text>
            {status !== "success" && (
              <Button size="sm" onClick={() => router.replace("/")}>
                {getMessage({
                  ja: "トップページへ",
                  us: "Go to top page",
                  cn: "前往首页",
                  language,
                })}
              </Button>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
}
