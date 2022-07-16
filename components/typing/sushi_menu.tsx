import React from "react";
import { Box, Text, Center, StylesProvider } from "@chakra-ui/react";
import styles from "./keyboard.module.scss";

export default function sushi_menu() {
  const netaList = [
    { name: "大トロ" },
    { name: "さんま" },
    { name: "えび" },
    { name: "甘えび" },
    { name: "サーモン" },
    { name: "鉄火巻き" },
    { name: "鰯" },
    { name: "いか" },
    { name: "たまご" },
  ];
  return (
    <Center h="200px">
      {netaList.map((item, index) => {
        console.log(item.name);
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
