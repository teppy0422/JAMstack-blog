import { useSession, signIn, signOut } from "next-auth/react";
import {
  Button,
  Box,
  Avatar,
  Center,
  StylesProvider,
  Tooltip,
  Circle,
  useColorModeValue,
} from "@chakra-ui/react";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Styles from "../styles/home.module.scss";

export default function Component() {
  const { data: session } = useSession();

  const bg = useColorModeValue("tomato", "pink");
  const color = useColorModeValue("#F4ECE4", "gray.700");
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
        <Tooltip
          label="ログイン"
          aria-label="A tooltip"
          hasArrow
          defaultIsOpen={true}
          fontSize="12px"
          arrowSize={6}
          gutter={2}
          top="12px"
        >
          <Circle
            onClick={() => signIn()}
            className={Styles.loginAvatar}
            bg={bg}
            color={color}
            size="40px"
          >
            <FontAwesomeIcon icon={faUser} className={Styles.githubIcon} />
          </Circle>
        </Tooltip>
      )}
    </>
  );
}
