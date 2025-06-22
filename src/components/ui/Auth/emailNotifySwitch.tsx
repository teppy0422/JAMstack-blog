import { useState, useEffect } from "react";
import { Switch, useToast } from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
// ↑ 適切なパスに合わせて修正してください

export function EmailNotifySwitch({ userId }: { userId: string }) {
  const [isNotifyEnabled, setIsNotifyEnabled] = useState(false);
  const [isEmailActive, setIsEmailActive] = useState(true);
  const toast = useToast();

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
        title: "通知不可",
        description: "このメールアドレスは存在しない為、通知は不可能です。",
        status: "warning",
        duration: 4000,
        isClosable: true,
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
        title: "更新失敗",
        description: "通知設定の更新に失敗しました。",
        status: "error",
        duration: 4000,
        isClosable: true,
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
      sx={{
        "input:focus": {
          outline: "none",
          boxShadow: "none",
        },
        "input:focus-visible": {
          outline: "none",
          boxShadow: "none",
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
