import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../styles/home.module.scss";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className={styles.logoText} id="login" style={{ display: "none" }}>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }
  return (
    <div className={styles.logoText} id="login" style={{ display: "none" }}>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}
