"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import {
  getSavedAccounts,
  removeSavedAccount,
  updateSavedAccountProfile,
  type SavedAccount,
} from "@/components/ui/Auth/Auth";
import { CustomAvatar } from "@/components/ui/CustomAvatar";

interface AccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  currentUserId: string | null;
  darkMode: boolean;
  highlightColor: string;
  borderColor: string;
  frColor: string;
  bgColor: string;
}

export default function AccountSwitcher({
  isOpen,
  onClose,
  onOpenLogin,
  currentUserId,
  darkMode,
  highlightColor,
  borderColor,
  frColor,
  bgColor,
}: AccountSwitcherProps) {
  const [switching, setSwitching] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCurrentMenu, setShowCurrentMenu] = useState(false);

  const accounts = getSavedAccounts();

  const handleSwitch = useCallback(
    async (account: SavedAccount) => {
      if (account.userId === currentUserId) {
        // 現在のアカウント → サブメニュー表示
        setShowCurrentMenu((prev) => !prev);
        return;
      }
      setSwitching(account.email);
      setError(null);
      try {
        await supabase.auth.signOut();
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: account.email,
            password: atob(account.password),
          });
        if (signInError) {
          setError("切替失敗: パスワードが変更された可能性があります");
          removeSavedAccount(account.email);
          setSwitching(null);
          return;
        }
        if (data?.user) {
          const { data: profileData } = await supabase
            .from("table_users")
            .select("user_metadata, picture_url")
            .eq("id", data.user.id)
            .single();
          if (profileData) {
            updateSavedAccountProfile(
              data.user.id,
              profileData.user_metadata?.name,
              profileData.picture_url,
            );
          }
        }
        window.location.reload();
      } catch (e) {
        setError("切替に失敗しました");
        setSwitching(null);
      }
    },
    [currentUserId],
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent, email: string) => {
      e.stopPropagation();
      removeSavedAccount(email);
      setError(null);
      onClose();
    },
    [onClose],
  );

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.reload();
  }, []);

  const handleNewLogin = useCallback(async () => {
    onClose();
    // ログイン済みの場合、先にsignOutしてからフォームを開く
    if (currentUserId) {
      await supabase.auth.signOut();
    }
    onOpenLogin();
  }, [currentUserId, onClose, onOpenLogin]);

  const handleUserSettings = useCallback(() => {
    onClose();
    onOpenLogin(); // ログイン済みならユーザー情報カードが表示される
  }, [onClose, onOpenLogin]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        zIndex: 1000,
        paddingTop: "50px",
        paddingRight: "10px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: bgColor,
          borderRadius: "12px",
          padding: "16px",
          minWidth: "240px",
          maxWidth: "320px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          border: `1px solid ${borderColor}`,
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: frColor,
            marginBottom: "12px",
          }}
        >
          アカウント切替
        </div>

        {error && (
          <div
            style={{
              fontSize: "12px",
              color: "#FF4444",
              marginBottom: "8px",
              padding: "6px 8px",
              backgroundColor: darkMode
                ? "rgba(255, 68, 68, 0.15)"
                : "rgba(255, 68, 68, 0.1)",
              borderRadius: "6px",
            }}
          >
            {error}
          </div>
        )}

        {/* 記憶済みアカウント一覧 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {accounts.map((account) => {
            const isCurrent = account.userId === currentUserId;
            const isSwitching = switching === account.email;
            return (
              <div key={account.email}>
                <div
                  onClick={() => !isSwitching && handleSwitch(account)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    cursor: isSwitching ? "wait" : "pointer",
                    backgroundColor: isCurrent
                      ? darkMode
                        ? `${highlightColor}30`
                        : `${highlightColor}15`
                      : "transparent",
                    border: isCurrent
                      ? `1px solid ${highlightColor}`
                      : "1px solid transparent",
                    opacity: isSwitching ? 0.6 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  <CustomAvatar
                    src={account.pictureUrl ?? undefined}
                    boxSize="36px"
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: isCurrent ? "bold" : "normal",
                        color: frColor,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {account.name || account.email.split("@")[0]}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: frColor,
                        opacity: 0.6,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {account.email}
                    </div>
                  </div>
                  {isCurrent && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: highlightColor,
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {showCurrentMenu ? "▲" : "▼"}
                    </div>
                  )}
                  {!isCurrent && (
                    <button
                      onClick={(e) => handleRemove(e, account.email)}
                      style={{
                        fontSize: "16px",
                        color: frColor,
                        opacity: 0.4,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0 4px",
                        lineHeight: 1,
                      }}
                      title="記憶を解除"
                    >
                      ×
                    </button>
                  )}
                  {isSwitching && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: frColor,
                        opacity: 0.7,
                      }}
                    >
                      切替中...
                    </div>
                  )}
                </div>

                {/* 現在のアカウントのサブメニュー */}
                {isCurrent && showCurrentMenu && (
                  <div
                    style={{
                      marginTop: "4px",
                      marginLeft: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <button
                      onClick={handleUserSettings}
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        fontSize: "12px",
                        color: frColor,
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      ユーザー設定
                    </button>
                    <button
                      onClick={handleSignOut}
                      style={{
                        width: "100%",
                        padding: "6px 10px",
                        fontSize: "12px",
                        color: "#FF4444",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 区切り線 */}
        <div
          style={{
            height: "1px",
            backgroundColor: borderColor,
            margin: "10px 0",
          }}
        />

        {/* 新規ログイン */}
        <button
          onClick={handleNewLogin}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "13px",
            color: frColor,
            backgroundColor: "transparent",
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ＋ 新規ログイン
        </button>
      </div>
    </div>
  );
}
