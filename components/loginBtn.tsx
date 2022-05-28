import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@chakra-ui/react";
import styles from "../styles/home.module.scss";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div id="login" style={{ display: "none" }}>
        Signed in as {session.user.email} <br />
        <Button colorScheme="pink" h={7} onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }
  return (
    <div id="login" style={{ display: "none" }}>
      Not signed in <br />
      <Button colorScheme="pink" h={7} onClick={() => signIn()}>
        Sign in
      </Button>
    </div>
  );
}
