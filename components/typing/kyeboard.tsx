import React from "react";

import { Box, useColorMode } from "@chakra-ui/react";

import styles from "./keyboard.module.scss";
const keyValues1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const keyValues2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"];
const keyValues3 = ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"];

const keyboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box className={styles.keyboard} id="keyboard">
      <Box className={styles.keys1}>
        {keyValues1.map((k, index) => {
          return (
            <Box
              className={styles.key1}
              w={8}
              h={8}
              m={1}
              fontSize="18px"
              key={index}
              id={k}
              borderColor={
                colorMode === "light" ? styles.backLight : styles.backDark
              }
            >
              {k}
            </Box>
          );
        })}
      </Box>
      <Box className={styles.keys2} m={0}>
        {keyValues2.map((k, index) => {
          return (
            <Box
              className={styles.key2}
              w={8}
              h={8}
              m={1}
              fontSize="18px"
              key={index}
              id={k}
            >
              {k}
            </Box>
          );
        })}
      </Box>
      <Box className={styles.keys3} m={0}>
        {keyValues3.map((k, index) => {
          return (
            <Box
              className={styles.key3}
              w={8}
              h={8}
              m={1}
              fontSize="18px"
              key={index}
              id={k}
            >
              {k}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default keyboard;
