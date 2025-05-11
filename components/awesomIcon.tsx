import React, { useEffect } from "react";
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
import styles from "@/styles/home.module.scss";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

const icon = ({
  link,
  awesome,
  size = "1x", // デフォルトパラメータを使用
}: {
  link: string;
  awesome: any;
  size?: SizeProp;
}) => {
  return (
    <NextLink href={link} passHref legacyBehavior>
      <Link
        _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
        as="div"
      >
        <FontAwesomeIcon
          icon={awesome}
          className={styles.githubIcon}
          size={size}
        />
      </Link>
    </NextLink>
  );
};
export default icon;
