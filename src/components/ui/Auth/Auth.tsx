import { useState, useEffect, useRef, useContext } from "react";
import { supabase } from "@/utils/supabase/client";
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
  Icon,
  Tooltip,
  useColorMode,
  Image as ChakraImage,
  Grid,
  GridItem,
  HStack,
  Spacer,
  VStack,
  Switch,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { MdBusiness, MdEmail, MdHistory } from "react-icons/md";

import { useLanguage } from "@/contexts/LanguageContext";
import { CustomAvatar } from "../CustomAvatar";
import EmailNotifySwitch from "./emailNotifySwitch";

import getMessage from "@/utils/getMessage";

interface AuthProps {
  userData: {
    pictureUrl: string | undefined;
    userName: string | null;
    userCompany: string | null;
    userMainCompany: string | null;
    userEmail: string | null;
    created_at: string | null;
    is_email_active?: boolean;
    is_email_notify?: boolean;
  };
}
export default function Auth({ userData }: AuthProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signup");
  const { colorMode } = useColorMode();

  const { language, setLanguage } = useLanguage();

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
      setError(
        getMessage({
          ja: "パスワードは6文字以上である必要があります",
          us: "Password must be at least 6 characters",
          cn: "密码长度至少为 6 个字符",
          language,
        })
      );
      return;
    }
    if (password !== confirmPassword) {
      setError(
        getMessage({
          ja: "パスワードが一致しません",
          us: "Password does not match",
          cn: "密码不匹配",
          language,
        })
      );
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    const identities = data.user?.identities;
    if (identities?.length === 0) {
      setError(
        getMessage({
          ja: "登録済みのメールアドレスです",
          us: "Registered email address.",
          cn: "注册电子邮件地址",
          language,
        })
      );
      return;
    }
    console.log(data);
    if (error) {
      if (error.message === "Email rate limit exceeded") {
        setMessage(
          getMessage({
            ja: "メール送信の制限を超えました。しばらく待ってから再試行してください。",
            us: "You have exceeded the limit for sending e-mail. Please wait a moment and try again.",
            cn: "已超过发送电子邮件的限制。请稍候再试",
            language,
          })
        );
      } else {
        console.error("Error signing up:", error.message);
        setMessage(
          getMessage({
            ja: "新規登録に失敗しました: ",
            us: "New registration failed: ",
            cn: "新注册失败: ",
            language,
          }) + error.message
        ); // エラーメッセージを設定
      }
    } else {
      console.log("User signed up:", data);
      setMessage(
        getMessage({
          ja: "認証用のメールを送信しました。受信したメールで認証を行ってください。認証後にログインが可能になります。",
          us: "An email for authentication has been sent. Please use the email you received to authenticate. You will be able to log in after authentication.",
          cn: "已发送验证电子邮件。请使用收到的电子邮件进行验证。验证后，您就可以登录了",
          language,
        })
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
      setMessage(
        getMessage({
          ja: "パスワードが違います:D",
          us: "Wrong password:D",
          cn: "密码错误:D",
          language,
        })
      ); // エラーメッセージを設定
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
        redirectTo: window.location.href, // 現在のページにリダイレクト
      },
    });
    if (error) console.error("Error during Google login:", error.message);
  };
  //入力時の説明文
  const [isEmailFocused, setIsEmailFocused] = useState<boolean>(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null); // メッセージ用の状態を追加
  //ユーザーアイコンの変更
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ファイル入力の参照を作成
  const handleAvatarClick = () => {
    fileInputRef.current?.click(); // クリックでファイル入力をトリガー
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // ファイルを最適化
      const optimizedFile = await optimizeImage(file);
      // Supabaseにファイルをアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars") // アップロード先のバケット名
        .upload(`public/${optimizedFile.name}`, optimizedFile); // ファイル名を指定してアップロード
      if (uploadError) {
        console.error("Error uploading file:", uploadError.message);
        return;
      }
      // アップロードしたファイルのURLを取得
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(`public/${file.name}`);
      if (!urlData?.publicUrl) {
        console.error("URL取得エラー"); // エラーをログに出力
        return; // エラーが発生した場合は処理を中断
      }
      const oldPictureUrl = userData.pictureUrl; // 古いURLを取得
      const publicURL = urlData.publicUrl;
      // Supabaseのtable_usersを更新
      const { error: updateError } = await supabase
        .from("table_users")
        .update({ picture_url: publicURL }) // picture_urlを更新
        .eq("id", user.id); // ユーザーIDでフィルタリング
      if (updateError) {
        console.error("Error updating picture_url:", updateError.message);
      } else {
        // pictureUrlを更新
        setUser({ ...user, picture_url: publicURL });
        userData.pictureUrl = publicURL;
        // 古いURLのファイルを削除
        if (oldPictureUrl) {
          const oldFileName = oldPictureUrl.split("/").pop(); // 古いファイル名を取得
          await supabase.storage
            .from("avatars")
            .remove([`public/${oldFileName}`]); // 古いファイルを削除
        }
        console.log("プロフィール画像を更新しました");
        window.location.reload();
      }
    }
  };
  // 画像最適化関数の追加
  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 200; // 最大幅
          const MAX_HEIGHT = 200; // 最大高さ
          let width = img.width;
          let height = img.height;

          // アスペクト比を維持しながらリサイズ
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // WebP形式で保存
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // ファイル名の拡張子を.webpに変更
                const newFileName = file.name.replace(/\.[^/.]+$/, ".webp");
                resolve(new File([blob], newFileName, { type: "image/webp" }));
              } else {
                resolve(file); // 最適化できなかった場合は元のファイルを返す
              }
            },
            "image/webp",
            0.8
          ); // 品質を0.8に設定
        };
      };
      reader.readAsDataURL(file);
    });
  };
  const updateLanguage = (newLanguage) => {
    console.log("Updating language to:", newLanguage);
    setLanguage(newLanguage);
  };
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月は0から始まるため +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const calculateDaysSince = (dateString: string | null) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const today = new Date();
    const timeDiff = today.getTime() - date.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24)); // ミリ秒を日数に変換
  };

  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("perspective(1000px)");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 5; // 上に近いと手前に傾く
    const rotateY = ((x - centerX) / centerX) * -5; // 右に近いと手前に傾く

    setTransform(
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
    );
  };
  const resetTransform = () => {
    setTransform("perspective(1000px)");
  };
  return (
    <Box
      fontFamily={getMessage({
        ja: "Noto Sans JP",
        us: "Noto Sans JP",
        cn: "Noto Sans SC",
        language,
      })}
      color="#ccc"
      bg="custom.system.800"
      m={0}
      p={0}
    >
      {user ? (
        <>
          <Box textAlign="center" mb={4}>
            <Box display="flex" justifyContent="center" alignItems="center" />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }} // ファイル入力を非表示
              onChange={handleFileChange} // ファイル選択時の処理
            />
          </Box>
        </>
      ) : (
        <>
          <Tabs>
            <TabPanels p={0} color="#ccc">
              <TabPanel p={0}>
                <Tabs p={0}>
                  <TabList>
                    <Tab
                      fontSize="13px"
                      _selected={{
                        color: "custom.theme.red.400",
                        borderBottom: "2px solid",
                        borderBottomColor: "custom.theme.red.400",
                      }}
                    >
                      {getMessage({
                        ja: "ログイン",
                        us: "Login",
                        cn: "登录",
                        language,
                      })}
                    </Tab>
                    <Tab
                      fontSize="13px"
                      _selected={{
                        color: "custom.theme.red.400",
                        borderBottom: "2px solid",
                        borderBottomColor: "custom.theme.red.400",
                      }}
                    >
                      {getMessage({
                        ja: "新規登録",
                        us: "Sign Up",
                        cn: "新注册",
                        language,
                      })}
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Text fontSize="10px" mb={0.3} ml={1} textAlign="left">
                        {getMessage({
                          ja: "メールアドレス",
                          us: "Email Address",
                          cn: "电子邮件地址",
                          language,
                        })}
                      </Text>
                      <Input
                        type="email"
                        placeholder={getMessage({
                          ja: "Email",
                          us: "Email address",
                          cn: "电子邮件地址",
                          language,
                        })}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        mb={2}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        _focus={{
                          borderColor: "custom.theme.red.300",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      />
                      <Text fontSize="10px" mb={0.3} ml={1} textAlign="left">
                        {getMessage({
                          ja: "パスワード",
                          us: "Password",
                          cn: "密码",
                          language,
                        })}
                      </Text>
                      <Input
                        type="password"
                        placeholder={getMessage({
                          ja: "パスワード",
                          us: "Password",
                          cn: "密码",
                          language,
                        })}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        mb={4}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        _focus={{
                          borderColor: "custom.theme.red.300",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      />
                      <Flex w="100%" justify="center">
                        <Button
                          onClick={handleSignIn}
                          isLoading={loading}
                          fontSize="14px"
                          h="2rem"
                          px="6px"
                          py="8px"
                          lineHeight="1"
                          borderRadius="md"
                          bgGradient="linear(to-b, #f0f0f3, #dcdcdc)" // 明るめグラデーション
                          boxShadow="inset 0 0 0 1px rgba(255, 255, 255, 0.6), 0 1px 2px rgba(0, 0, 0, 0.2)"
                          border="1px solid #b0b0b0"
                          color="black"
                          _hover={{
                            bgGradient: "linear(to-b, #e5e5e5, #cfcfcf)",
                            boxShadow:
                              "inset 0 0 0 1px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.3)",
                          }}
                          _active={{
                            transform: "translateY(1px)",
                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
                          }}
                        >
                          {getMessage({
                            ja: "ログイン",
                            us: "Login",
                            cn: "登录",
                            language,
                          })}
                        </Button>
                      </Flex>
                    </TabPanel>
                    <TabPanel>
                      <Text fontSize="sm" mb={4}>
                        {getMessage({
                          ja: "新規登録の流れ:",
                          us: "New Registration Process",
                          cn: "新的注册程序",
                          language,
                        })}
                      </Text>
                      <Text fontSize="sm" mb={2}>
                        1.
                        {getMessage({
                          ja: " メールアドレスと",
                          us: " Please enter Email address and",
                          cn: " 电子邮件地址和",
                          language,
                        })}
                        <span style={{ color: "#F56565" }}>
                          {getMessage({
                            ja: "パスワード(6文字以上)",
                            us: " Password (at least 6 characters).",
                            cn: "密码（至少 6 个字符）",
                            language,
                          })}
                        </span>
                        {getMessage({
                          ja: "を 入力してください。",
                          us: "",
                          cn: "输入",
                          language,
                        })}
                      </Text>
                      <Text fontSize="sm" mb={2}>
                        2.
                        {getMessage({
                          ja: " 「新規登録」をクリックします。",
                          us: " Click on [Sign Up].",
                          cn: " 点击 [新注册]",
                          language,
                        })}
                      </Text>
                      <Text fontSize="sm" mb={2}>
                        3.
                        {getMessage({
                          ja: " 受信したメールを確認し、認証を行ってください",
                          us: " Please check the email you received and authenticate.",
                          cn: " 检查收到的电子邮件并进行验证",
                          language,
                        })}
                      </Text>
                      <Text fontSize="sm" mb={2}>
                        4.
                        {getMessage({
                          ja: " 認証後、ログインが可能になります。",
                          us: " After authentication, you will be able to log in.",
                          cn: " 通过验证后即可登录",
                          language,
                        })}
                      </Text>
                      <Text fontSize="10px" mb={0.3} ml={1} textAlign="left">
                        {getMessage({
                          ja: " メールアドレス",
                          us: " Email Address",
                          cn: " 电子邮件地址",
                          language,
                        })}
                      </Text>
                      <Input
                        type="email"
                        placeholder={getMessage({
                          ja: "Email",
                          us: "Email address",
                          cn: "电子邮件地址",
                          language,
                        })}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        mb={2}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        _focus={{
                          borderColor: "custom.theme.red.300",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      />
                      <Text fontSize="10px" mb={0.3} ml={1} textAlign="left">
                        {getMessage({
                          ja: "パスワード",
                          us: "Password",
                          cn: "密码",
                          language,
                        })}
                      </Text>
                      <Input
                        type="password"
                        placeholder={getMessage({
                          ja: "パスワード(6文字以上)",
                          us: "Password (6+ words)",
                          cn: "密码(6文字以上)",
                          language,
                        })}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        mb={2}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        _focus={{
                          borderColor: "custom.theme.red.300",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      />
                      <Text fontSize="10px" mb={0.3} ml={1} textAlign="left">
                        {getMessage({
                          ja: "パスワード(確認)",
                          us: "Password (Confirm)",
                          cn: "密码（确认）",
                          language,
                        })}
                      </Text>
                      <Input
                        type="password"
                        placeholder={getMessage({
                          ja: "Password",
                          us: "Password",
                          cn: "密码",
                          language,
                        })}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        mb={3}
                        onFocus={() => setIsConfirmPasswordFocused(true)}
                        onBlur={() => setIsConfirmPasswordFocused(false)}
                        _focus={{
                          borderColor: "custom.theme.red.300",
                          outline: "none",
                          boxShadow: "none",
                        }}
                      />
                      <Button
                        onClick={handleSignUp}
                        isLoading={loading}
                        colorScheme="blue"
                        width="full"
                      >
                        {getMessage({
                          ja: "新規登録",
                          us: "Sign Up",
                          cn: "新注册",
                          language,
                        })}
                      </Button>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </TabPanel>
              <TabPanel>
                <Button
                  onClick={handleGoogleLogin} // Googleログイン関数を呼び出す
                  colorScheme="gray" // ボタンの色を設定
                  width="full"
                  leftIcon={
                    <img
                      src="/images/google_icon-icons.com_62736.png"
                      alt="Google Icon"
                      style={{ width: "20px", height: "20px" }}
                    />
                  }
                >
                  Googleでログイン
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
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
        </>
      )}
      {user && (
        <Grid
          templateColumns={{ base: "1fr", sm: "3.5fr 6.5fr" }}
          gap={4}
          mx={4}
        >
          <GridItem>
            <Flex
              // minH="100vh"
              align="center"
              justify="center"
              bgGradient="linear(to-br, custom.theme.light.500, purple.600)"
              p={0}
              m={0}
              borderRadius="md"
            >
              <Box
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetTransform}
                transform={transform}
                transition="transform 0.1s ease"
                bg="whiteAlpha.200"
                backdropFilter="blur(16px)"
                border="1px solid"
                borderColor="whiteAlpha.300"
                borderRadius="md"
                boxShadow="lg"
                py={2}
                px={4}
                w="100%"
                m={0}
                textAlign="left"
                sx={{
                  transformStyle: "preserve-3d",
                }}
              >
                <ChakraImage
                  src={userData.pictureUrl}
                  alt="Profile"
                  h="152px"
                  w="152px"
                  objectFit="cover" // ← この行を追加
                  border="1px solid white"
                  mx="auto"
                  mb={3}
                />
                <Text fontSize="xl" fontWeight="bold" color="white">
                  {userData.userName || "No Name"}
                </Text>
                <Text fontSize="12px" fontWeight="bold" color="white">
                  {formatDate(userData.created_at)} (
                  {calculateDaysSince(userData.created_at)}日)
                </Text>
                <Text mt={4} fontSize="13px" color="whiteAlpha.900">
                  {getMessage({ ja: userData.userMainCompany || "", language })}
                  : {getMessage({ ja: userData.userCompany || "", language })}
                </Text>
              </Box>
            </Flex>
          </GridItem>
          <GridItem>
            <Box
              bg="#2c2b29"
              p={4}
              borderRadius="md"
              border="1px solid #4c4b49"
              color="#ccc"
              mb={4}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="14px">
                  E-mail
                </Text>
                <Text fontSize="13px">{userData.userEmail}</Text>
              </Flex>
              <Box h="1px" w="100%" bg="#4c4b49" my={2} />
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="13px">
                  {getMessage({
                    ja: "通知の設定",
                    us: "Notification Settings",
                    cn: "通知设置",
                    language,
                  })}
                </Text>
                <EmailNotifySwitch userId={user.id} />
              </Flex>
            </Box>
            <Box
              bg="#2c2b29"
              p={4}
              borderRadius="md"
              border="1px solid #4c4b49"
              color="#ccc"
              mb={4}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="14px">
                  {getMessage({
                    ja: "言語選択",
                    us: "Language",
                    cn: "语言选择",
                    language,
                  })}
                </Text>
                <HStack>
                  <Tooltip label={<Box>日本語</Box>} aria-label="ja">
                    <img
                      src="/images/land/jp.svg"
                      alt="日本語"
                      style={{
                        width: "32px",
                        height: "24px",
                        margin: "0px",
                        padding: "0px",
                        border: "solid 1px",
                        marginRight: "10px",
                        cursor: "pointer",
                        opacity: language !== "ja" ? 0.3 : 1,
                      }}
                      onClick={() => updateLanguage("ja")}
                    />
                  </Tooltip>
                  <Tooltip
                    label={<Box>American English</Box>}
                    aria-label="English"
                  >
                    <img
                      src="/images/land/um.svg"
                      alt="英語"
                      style={{
                        width: "32px",
                        height: "24px",
                        margin: "0px",
                        padding: "0px",
                        border: "solid 1px",
                        marginRight: "10px",
                        cursor: "pointer",
                        opacity: language !== "us" ? 0.3 : 1,
                      }}
                      onClick={() => updateLanguage("us")}
                    />
                  </Tooltip>
                  <Tooltip label={<Box>简体中文</Box>} aria-label="cn">
                    <img
                      src="/images/land/cn.svg"
                      alt="簡体字中国語"
                      style={{
                        width: "32px",
                        height: "24px",
                        margin: "0px",
                        padding: "0px",
                        border: "solid 1px",
                        marginRight: "10px",
                        cursor: "pointer",
                        opacity: language !== "cn" ? 0.3 : 1,
                      }}
                      onClick={() => updateLanguage("cn")}
                    />
                  </Tooltip>
                </HStack>
              </Flex>
              <Box h="1px" w="100%" bg="#4c4b49" my={2} />
              <Text fontSize="12px" mx="auto" textAlign="left">
                {getMessage({
                  ja: "画像の翻訳は日本語以外は未対応です。",
                  us: "Translation of images is not yet available except for Japanese",
                  cn: "除日语外，尚未提供图像翻译。",
                  language,
                })}
                {getMessage({
                  ja: "必要であれば対応するので連絡ください。",
                  us: "Please contact me if you need assistance.",
                  cn: "如有必要，请联系我们寻求帮助。",
                  language,
                })}
              </Text>
            </Box>
            <Spacer h="10px" />
            <Box
              bg="#2c2b29"
              p={4}
              borderRadius="md"
              // border="1px solid #4c4b49"
              color="#ccc"
              mb={4}
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Box display="flex" justifyContent="center">
                  <Tooltip
                    label={getMessage({
                      ja: "ユーザーアイコンを変更",
                      us: "Change user icon",
                      cn: "更改用户图标",
                      language,
                    })}
                    aria-label={getMessage({
                      ja: "ユーザーアイコンを変更",
                      us: "Change user icon",
                      cn: "更改用户图标",
                      language,
                    })}
                    hasArrow
                    placement="top"
                  >
                    <Box
                      onClick={handleAvatarClick} // クリックで画像選択
                      cursor="pointer"
                      _hover={{ opacity: 0.8 }}
                    >
                      <Box mx="auto" px={2} height="1.8em" fontSize="12px">
                        {getMessage({
                          ja: "アイコン変更",
                          us: "Icon Change",
                          cn: "图标更改",
                          language,
                        })}
                      </Box>
                    </Box>
                  </Tooltip>
                </Box>
                <Box h="1rem" width="1px" bg="#4c4b49" />
                <Box display="flex" justifyContent="center">
                  <Box
                    onClick={handleSignOut}
                    mx="auto"
                    px={2}
                    height="1.8em"
                    fontSize="12px"
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                  >
                    {getMessage({
                      ja: "ログアウト",
                      us: "Logout",
                      cn: "注销",
                      language,
                    })}
                  </Box>
                </Box>
              </Flex>
            </Box>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
}
