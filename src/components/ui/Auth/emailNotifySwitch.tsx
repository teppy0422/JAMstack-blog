import { useState, useEffect, useRef } from "react";
import { Switch, useToast, Box } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import CustomToast from "@/components/ui/CustomToast";
import getMessage from "@/utils/getMessage";
import { useLanguage } from "@/contexts/LanguageContext";

export function EmailNotifySwitch({ userId }: { userId: string }) {
  const [isNotifyEnabled, setIsNotifyEnabled] = useState(false);
  const [isEmailActive, setIsEmailActive] = useState(true);
  const { language } = useLanguage();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const toast = useToast();

  useEffect(() => {
    // 初回マウント時にフォーカスを外す
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [][userId]);

  // 初期データ取得
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("table_users")
        .select("is_email_notify, is_email_active")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("取得失敗:", error);
        return;
      }
      setIsNotifyEnabled(data.is_email_notify);
      setIsEmailActive(data.is_email_active);
    };
    fetchData();
  }, [userId]);

  // スイッチ切り替え処理
  const handleToggle = async () => {
    const newValue = !isNotifyEnabled;
    if (newValue && !isEmailActive) {
      // オンにしようとしたが、無効なメール
      toast({
        position: "bottom",
        duration: 3000,
        isClosable: true,
        render: ({ onClose }) => (
          <CustomToast
            onClose={onClose}
            title={getMessage({
              ja: "通知不可",
              us: "notifiable",
              cn: "通知不可",
              language,
            })}
            description={
              <>
                <Box>
                  {getMessage({
                    ja: "このメールアドレスは存在しない為、通知をオンに出来ません。",
                    us: "Notifications cannot be turned on because this email address does not exist.",
                    cn: "由于该电子邮件地址不存在，因此无法打开通知。",
                    language,
                  })}
                </Box>
              </>
            }
          />
        ),
      });
      // 一旦表示上 true になるので、1秒後に false に戻す
      setIsNotifyEnabled(true);
      setTimeout(() => {
        setIsNotifyEnabled(false);
      }, 1000);
      return;
    }

    // 通知設定を更新
    const { error } = await supabase
      .from("table_users")
      .update({ is_email_notify: newValue })
      .eq("id", userId);
    if (error) {
      toast({
        position: "bottom",
        duration: 3000,
        isClosable: true,
        render: ({ onClose }) => (
          <CustomToast
            onClose={onClose}
            title={getMessage({
              ja: "更新失敗",
              us: "Failed to update",
              cn: "更新失敗",
              language,
            })}
            description={
              <>
                <Box>
                  {getMessage({
                    ja: "通知設定の更新に失敗しました。",
                    us: "Failed to update notification settings.",
                    cn: "更新通知设置失败。",
                    language,
                  })}
                </Box>
              </>
            }
          />
        ),
      });
    } else {
      setIsNotifyEnabled(newValue);
    }
  };

  return (
    <Switch
      id="email-alerts"
      size="sm"
      isChecked={isNotifyEnabled}
      onChange={handleToggle}
      userSelect="none"
      _focus={{ boxShadow: "none", outline: "none" }}
      _focusVisible={{ boxShadow: "none", outline: "none" }}
      isFocusable={false} // ← これでTabやフォーカス制御を無効化
      ref={inputRef}
      sx={{
        input: {
          boxShadow: "none !important",
        },
        "input:focus": {
          boxShadow: "none !important",
          outline: "none !important",
        },
        "input:focus-visible": {
          boxShadow: "none !important",
          outline: "none !important",
        },
        "*": {
          userSelect: "none !important",
          WebkitUserSelect: "none !important",
          WebkitTapHighlightColor: "transparent",
        },
        WebkitTapHighlightColor: "transparent",
      }}
    />
  );
}

export default EmailNotifySwitch;
