import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { Flex, Box, Text, Button, Input } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    // クリーンアップ
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
  // サインアップ関数
  const [confirmPassword, setConfirmPassword] = useState<string>(""); // 確認用パスワードの状態を追加
  const handleSignUp = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      setMessage("パスワードが一致しません。"); // パスワード不一致のメッセージを設定
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Error signing up:", error.message);
      setMessage("新規登録に失敗しました: " + error.message); // エラーメッセージを設定
    } else {
      console.log("User signed up:", data);
      setMessage("認証用のメールを送信しました。ログインが可能になります。"); // 成功メッセージを設定
    }
    setLoading(false);
  };
  // サインイン関数
  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error signing in:", error.message);
      setMessage("パスワードが違います:D"); // エラーメッセージを設定
    } else {
      console.log("User signed in:", data);
      setMessage(null); // 成功時にはメッセージをリセット
      // ユーザーがログインした後にtable_usersを確認
      const userId = data.user.id; // ユーザーIDを取得
      const { data: userData, error: userError } = await supabase
        .from("table_users")
        .select("id")
        .eq("id", userId)
        .single();
      if (userError) {
        // ユーザーが存在しない場合、新しいユーザーを追加
        const { error: insertError } = await supabase
          .from("table_users")
          .insert([
            {
              id: userId,
              user_metadata: { name: data.user.user_metadata.name },
              user_company: null,
            },
          ]);
        if (insertError) {
          console.error("Error adding new user:", insertError.message);
        }
      }
      // サインイン後にページをリロード
      window.location.reload();
    }
    setLoading(false);
  };
  // ログアウト関数
  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("User signed out");
      setUser(null);
    }
    window.location.reload(); // 追加: ページをリロード
    setLoading(false);
  };
  // グーグルログイン関数
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/api/auth/callback", // ここでリダイレクトURIを指定
      },
    });
    if (error) console.error("Error during Google login:", error.message);
  };
  //入力時の説明文
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null); // メッセージ用の状態を追加

  return (
    <>
      {user ? (
        <Box textAlign="center">
          <Text fontSize="lg" mb={4}>
            {user.email}
          </Text>
          <Button
            onClick={handleSignOut}
            isLoading={loading}
            colorScheme="teal"
            width="full"
          >
            ログアウト
          </Button>
        </Box>
      ) : (
        <>
          {message && ( // メッセージがある場合に表示
            <Text fontSize="sm" color="green.500" mb={4}>
              {message}
            </Text>
          )}
          <Text
            fontSize="sm"
            color={
              isEmailFocused || isPasswordFocused ? "gray.500" : "transparent"
            }
            mb={2}
          >
            {isEmailFocused
              ? "受信可能なメールアドレスを入力してください"
              : "パスワードは管理者側でも分かりません。メモしておいてください"}
          </Text>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb={3}
            onFocus={() => setIsEmailFocused(true)} // フォーカス時に状態を更新
            onBlur={() => setIsEmailFocused(false)} // フォーカスが外れた時に状態をリセット
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={4}
            onFocus={() => setIsPasswordFocused(true)} // フォーカス時に状態を更新
            onBlur={() => setIsPasswordFocused(false)} // フォーカスが外れた時に状態をリセット
          />
          <Flex justify="space-between" mb={4}>
            <Button
              onClick={handleSignUp}
              isLoading={loading}
              colorScheme="blue"
              width="48%"
            >
              新規登録
            </Button>
            <Button
              onClick={handleSignIn}
              isLoading={loading}
              colorScheme="blue"
              width="48%"
            >
              ログイン
            </Button>
          </Flex>
          {/* <Button onClick={handleGoogleLogin} colorScheme="red" width="full">
              Googleでログイン
            </Button> */}
        </>
      )}
    </>
  );
}
