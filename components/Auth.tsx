import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import {
  Flex,
  Box,
  Text,
  Button,
  Input,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
interface AuthProps {
  userData: {
    pictureUrl: string | null;
    userName: string | null;
    userCompany: string | null;
  };
}
export default function Auth({ userData }: AuthProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signup");
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState<boolean>(false);

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
    if (password.length < 6) {
      setError("パスワードは6文字以上である必要があります。");
      return;
    }
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    const identities = data.user?.identities;
    if (identities?.length === 0) {
      setError("登録済みのメールアドレスです。");
      return;
    }
    console.log(data);
    if (error) {
      console.error("Error signing up:", error.message);
      setMessage("新規登録に失敗しました: " + error.message); // エラーメッセージを設定
    } else {
      console.log("User signed up:", data);
      setMessage(
        "認証用のメールを送信しました。受信メールを確認して認証を行ってください。認証後にログインが可能になります。"
      ); // 成功メッセージを設定
      setActiveTab("signin");
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
    <Box>
      {user ? (
        <>
          <Box textAlign="center" mb={4}>
            <Text fontSize="xl" fontWeight="bold">
              -ここは作成中-
            </Text>
            <Text fontSize="lg">Welcome {userData.userName || "Guest"}</Text>
            <Text fontSize="md" color="gray.500">
              {userData.userCompany || ""}
            </Text>
            <Avatar src={userData.pictureUrl || undefined} size="lg" mt={2} />{" "}
            {/* サイズとマージンを追加 */}
          </Box>
          <Button onClick={handleSignOut} colorScheme="red" width="full">
            ログアウト
          </Button>{" "}
          {/* ボタンの色と幅を調整 */}
        </>
      ) : (
        <>
          {error && (
            <Text color="red.500" mb={4}>
              {error}
            </Text>
          )}
          {message && (
            <Text fontSize="sm" color="green.500" mb={4}>
              {message}
            </Text>
          )}
          <Tabs
            onChange={(index) =>
              setActiveTab(index === 0 ? "signup" : "signin")
            }
          >
            <TabList>
              <Tab>ログイン</Tab>
              <Tab>新規登録</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  mb={3}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  mb={4}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <Button
                  onClick={handleSignIn}
                  isLoading={loading}
                  colorScheme="blue"
                  width="full"
                >
                  ログイン
                </Button>
              </TabPanel>
              <TabPanel>
                <Text fontSize="sm" mb={4}>
                  新規登録の流れ:
                </Text>
                <Text fontSize="sm" mb={2}>
                  1. メールアドレスとパスワードを入力してください。
                </Text>
                <Text fontSize="sm" mb={2}>
                  2. 「新規登録」ボタンをクリックします。
                </Text>
                <Text fontSize="sm" mb={2}>
                  3. 受信したメールを確認し、認証を行ってください。
                </Text>
                <Text fontSize="sm" mb={2}>
                  4. 認証後、ログインが可能になります。
                </Text>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  mb={3}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  mb={4}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <Input
                  type="password"
                  placeholder="Confirm Password" // 確認用パスワードのプレースホルダー
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  mb={4}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                />
                <Button
                  onClick={handleSignUp}
                  isLoading={loading}
                  colorScheme="blue"
                  width="full"
                >
                  新規登録
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </Box>
  );
}
