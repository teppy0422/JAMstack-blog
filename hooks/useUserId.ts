import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<{
    userId: string | null;
    email: string | null;
  }>({
    userId: null,
    email: null,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserInfo({
          userId: user.id ?? null,
          email: user.email ?? null,
        });
        console.log("ユーザー情報を取得しました:", user.id, user.email);
      } else {
        console.error("ユーザーがログインしていません");
      }
    };
    fetchUserInfo();
  }, []);

  return userInfo;
};
