// スマホでログインするためのQRコード(ユーザーカード内)
// ボタンを押したときだけ発行し、2分で失効。スマホで読み取ると、ここに承認の確認が表示される。
// PCで「許可」したときだけスマホがログインできる。
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/utils/supabase/client";
import getMessage from "@/utils/getMessage";

const POLL_INTERVAL_MS = 2000;
// QRの期限後も、期限直前に読み取られたリクエストを承認できるよう少し待つ(サーバーの承認期限と合わせる)
const REQUEST_GRACE_MS = 180 * 1000;

type PendingRequest = { id: string; device: string; createdAt: string };

async function authFetch(url: string, body?: any) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("not logged in");
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export default function QrLogin({ language }: { language: string }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [nonce, setNonce] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [deciding, setDeciding] = useState<string | null>(null);
  const [result, setResult] = useState<"approved" | "denied" | null>(null);

  const t = (ja: string, us: string, cn: string) =>
    getMessage({ ja, us, cn, language });

  const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));
  const isExpired = !!qrUrl && remaining === 0;

  // 表示中だけ1秒ごとに残り時間を更新
  useEffect(() => {
    if (!qrUrl) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [qrUrl]);

  // スマホからの承認待ちリクエストを定期的に確認
  useEffect(() => {
    if (!nonce) return;
    let stopped = false;
    const poll = async () => {
      if (Date.now() > expiresAt + REQUEST_GRACE_MS) {
        setNonce(null);
        return;
      }
      try {
        const res = await authFetch("/api/qr-login/pending/", { nonce });
        if (res.ok && !stopped) {
          const data = await res.json();
          setRequests(data.requests ?? []);
        }
      } catch (e) {
        console.error("QRログインの確認に失敗:", e);
      }
    };
    poll();
    const timer = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [nonce, expiresAt]);

  const reset = useCallback(() => {
    setQrUrl(null);
    setNonce(null);
    setExpiresAt(0);
    setRequests([]);
  }, []);

  const createQr = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRequests([]);
    try {
      const res = await authFetch("/api/qr-login/create/");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setQrUrl(
        `${window.location.origin}/login/qr/?c=${encodeURIComponent(data.code)}`
      );
      setNonce(data.nonce);
      setExpiresAt(data.expiresAt);
      setNow(Date.now());
    } catch (e) {
      console.error("QRログインの発行に失敗:", e);
      setError(
        t(
          "QRコードを作成できませんでした",
          "Could not create the QR code",
          "无法生成二维码"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const decide = async (requestId: string, approve: boolean) => {
    setDeciding(requestId);
    setError(null);
    try {
      const res = await authFetch("/api/qr-login/decide/", {
        requestId,
        approve,
      });
      if (!res.ok) throw new Error(await res.text());
      if (approve) {
        // 許可したらQRは閉じる(他のリクエストは期限切れで無効になる)
        reset();
        setResult("approved");
      } else {
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        setResult("denied");
      }
    } catch (e) {
      console.error("QRログインの承認処理に失敗:", e);
      setError(
        t(
          "処理できませんでした。QRを再発行してください。",
          "Could not process. Please reissue the QR code.",
          "无法处理。请重新生成二维码。"
        )
      );
    } finally {
      setDeciding(null);
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(language === "us" ? "en-US" : "ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold" fontSize="13px">
          {t("スマホでログイン", "Log in on smartphone", "在手机上登录")}
        </Text>
        {qrUrl && !isExpired ? (
          <Button size="xs" variant="outline" color="#ccc" onClick={reset}>
            {t("閉じる", "Close", "关闭")}
          </Button>
        ) : (
          <Button
            size="xs"
            variant="outline"
            color="#ccc"
            _hover={{ bg: "whiteAlpha.200" }}
            onClick={createQr}
            isLoading={loading}
          >
            {isExpired
              ? t("QRを再発行", "Reissue QR", "重新生成二维码")
              : t("QRを表示", "Show QR", "显示二维码")}
          </Button>
        )}
      </Flex>

      {error && (
        <Text mt={2} fontSize="12px" color="red.300">
          {error}
        </Text>
      )}

      {result === "approved" && (
        <Text mt={2} fontSize="12px" color="green.300">
          {t(
            "許可しました。スマホでログインが完了します。",
            "Approved. Login will complete on your smartphone.",
            "已允许。手机上将完成登录。"
          )}
        </Text>
      )}
      {result === "denied" && requests.length === 0 && (
        <Text mt={2} fontSize="12px" color="orange.300">
          {t(
            "リクエストを拒否しました。",
            "The request was denied.",
            "已拒绝该请求。"
          )}
        </Text>
      )}

      {/* スマホからの承認待ちリクエスト */}
      {requests.map((r) => (
        <Box
          key={r.id}
          mt={3}
          p={3}
          borderRadius="md"
          border="1px solid"
          borderColor="orange.300"
          bg="whiteAlpha.100"
        >
          <Text fontSize="13px" fontWeight="bold" color="white">
            {t(
              "スマホからのログインを許可しますか？",
              "Allow login from this smartphone?",
              "允许此手机登录吗？"
            )}
          </Text>
          <Text fontSize="12px" mt={1}>
            {r.device}（{formatTime(r.createdAt)}）
          </Text>
          <Text fontSize="11px" mt={1} color="orange.200">
            {t(
              "心当たりがない場合は「拒否」を押してください。",
              "If you don't recognize this, press Deny.",
              "如果不是您本人操作，请点击“拒绝”。"
            )}
          </Text>
          <HStack mt={2} justifyContent="flex-end">
            <Button
              size="xs"
              variant="outline"
              color="#ccc"
              onClick={() => decide(r.id, false)}
              isDisabled={!!deciding}
            >
              {t("拒否", "Deny", "拒绝")}
            </Button>
            <Button
              size="xs"
              colorScheme="green"
              onClick={() => decide(r.id, true)}
              isLoading={deciding === r.id}
              isDisabled={!!deciding && deciding !== r.id}
            >
              {t("許可", "Allow", "允许")}
            </Button>
          </HStack>
        </Box>
      ))}

      {qrUrl && (
        <Flex mt={3} direction="column" alignItems="center" gap={2}>
          <Box
            bg="white"
            borderRadius="md"
            lineHeight={0}
            opacity={isExpired ? 0.15 : 1}
            transition="opacity 0.3s"
          >
            {/* includeMargin: 読み取りに必要な白い余白(4マス分)を付ける */}
            <QRCodeSVG value={qrUrl} size={220} level="L" includeMargin />
          </Box>
          <Text fontSize="12px" textAlign="center">
            {isExpired
              ? t(
                  "有効期限が切れました",
                  "This QR code has expired",
                  "二维码已过期"
                )
              : t(
                  `スマホのカメラで読み取ってください（残り ${remaining} 秒）`,
                  `Scan with your phone camera (${remaining}s left)`,
                  `请用手机相机扫描（剩余 ${remaining} 秒）`
                )}
          </Text>
          <Text fontSize="11px" color="whiteAlpha.700" textAlign="center">
            {t(
              "読み取ると、ここに許可の確認が表示されます。",
              "After scanning, an approval prompt will appear here.",
              "扫描后，这里会显示确认提示。"
            )}
          </Text>
        </Flex>
      )}
    </Box>
  );
}
