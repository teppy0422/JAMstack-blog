import React from "react";
import NextLink from "next/link";

import {
  Flex,
  Center,
  Text,
  VStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Link,
  Button,
  Box,
} from "@chakra-ui/react";

import { PhoneIcon, AddIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPalette } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/home.module.scss";

const icon = ({ link, awesome }: { link: string; awesome: any }) => {
  return (
    <NextLink href={link} passHref legacyBehavior>
      <Link
        _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
      >
        <FontAwesomeIcon icon={awesome} className={styles.githubIcon} />
      </Link>
    </NextLink>
  );
};

export default icon;
