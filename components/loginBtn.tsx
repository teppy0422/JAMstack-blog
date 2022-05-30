import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Box, Avatar, Center, StylesProvider } from "@chakra-ui/react";
import Styles from "../styles/home.module.scss";

export default function Component() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <Avatar
          onClick={() => signOut()}
          boxSize="42px"
          src={session.user.image}
          className={Styles.loginAvatar}
        />
      ) : (
        <Avatar
          onClick={() => signIn()}
          boxSize="42px"
          src="https://bit.ly/broken-link"
          className={Styles.loginAvatar}
        ></Avatar>
      )}
    </>
  );
}
