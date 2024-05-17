import { useSession, signIn, signOut } from "next-auth/react";

export default function Custom404() {
  const { data: session } = useSession();
  return (
    <main className="main">
      <p>ページがありません。</p>
      <>
        {!session && (
          <>
            サインインしてください。 <br />
            <button onClick={() => signIn("google")}>Sign in</button>
          </>
        )}
        {session && (
          <>
            サインイン完了。 email: {session.user.email} <br />
            <button onClick={signOut}>Sign out</button>
          </>
        )}
      </>
    </main>
  );
}
