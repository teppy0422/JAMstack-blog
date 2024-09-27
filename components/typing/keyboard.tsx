import React, { useImperativeHandle, forwardRef, useRef } from "react";

import { Box, useColorMode, Center } from "@chakra-ui/react";

import styles from "./keyboard.module.scss";
const keyValues1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const keyValues2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"];
const keyValues3 = ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"];

let keyboard = (pops, ref) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const keyboardRef = useRef(null);
  // 親コンポーネントの ref.current から実行できる関数を定義したオブジェクトを返す
  useImperativeHandle(ref, () => ({
    Open() {
      if (keyboardRef.current) {
        (keyboardRef.current as HTMLElement).style.visibility = "visible";
      }
    },
    Close() {
      if (keyboardRef.current) {
        (keyboardRef.current as HTMLElement).style.visibility = "hidden";
      }
    },
  }));
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
      <Box
        className={styles.key4}
        ref={keyboardRef}
        w="160px"
        h={8}
        m={1}
        mt={3}
        fontSize="14px"
        color="#000"
      >
        <Box color="#ccc" className={styles.keyG}>
          GAMESTART
        </Box>
        <Box color="#333" className={styles.keyS}>
          SPACE
        </Box>
      </Box>
    </Box>
  );
};
export default forwardRef(keyboard) as React.ForwardRefExoticComponent<any>;
