import { useSession, signIn, signOut } from "next-auth/react";
import {
  Button,
  Box,
  Avatar,
  Center,
  StylesProvider,
  Tooltip,
} from "@chakra-ui/react";
import Styles from "../styles/home.module.scss";

export default function Component() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <Tooltip label="ログアウト" aria-label="A tooltip">
          <Avatar
            onClick={() => signOut()}
            boxSize="42px"
            src={session.user.image}
            className={Styles.loginAvatar}
          />
        </Tooltip>
      ) : (
        <Tooltip label="ログイン" aria-label="A tooltip">
          <Avatar
            onClick={() => signIn()}
            boxSize="42px"
            src="https://bit.ly/broken-link"
            className={Styles.loginAvatar}
          ></Avatar>
        </Tooltip>
      )}
    </>
  );
}
