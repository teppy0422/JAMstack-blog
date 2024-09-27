import React from "react";
import { Box, Text, Center, StylesProvider } from "@chakra-ui/react";
import styles from "./keyboard.module.scss";

export default function sushi_menu() {
  const netaList = [
    { name: "たまご" },
    { name: "えび" },
    { name: "鉄火巻き" },
    { name: "鰯" },
    { name: "甘えび" },
    { name: "いか" },
    { name: "さんま" },
    { name: "サーモン" },
    { name: "大トロ" },
  ];
  return (
    <Center h="200px">
      {netaList.map((item, index) => {
        return (
          <Text
            className={styles.board}
            style={{
              writingMode: "vertical-rl",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 600,
              borderRadius: "6px",
              height: "120px",
              backgroundColor: "red",
              color: "#001111",
            }}
            fontSize="24px"
            p="8px"
          >
            {item.name}
          </Text>
        );
      })}
    </Center>
  );
}
