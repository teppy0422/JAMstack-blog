import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { Flex } from "@chakra-ui/react";
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
  const handleSignUp = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      console.log("User signed up:", data);
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
      setError(error.message);
      console.error("Error signing in:", error.message);
    } else {
      console.log("User signed in:", data);
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
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignOut} disabled={loading}>
            {loading ? "Loading..." : "Sign Out"}
          </button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Flex justify="space-between">
            <button onClick={handleSignUp} disabled={loading}>
              {loading ? "Loading..." : "Sign Up"}
            </button>
            <button onClick={handleSignIn} disabled={loading}>
              {loading ? "Loading..." : "Sign In"}
            </button>
          </Flex>
          <button onClick={handleGoogleLogin}>Googleでログイン</button>

          {/* <button onClick={() => signIn("google")} disabled={loading}>
            {loading ? "Loading..." : "Sign in with Google"}
          </button> */}
        </div>
      )}
    </div>
  );
}
