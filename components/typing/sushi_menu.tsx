import React, { useState, useEffect } from "react";
import { Box, Text, Center, StylesProvider } from "@chakra-ui/react";
import styles from "./keyboard.module.scss";

const sushi_menu = ({ count, voucherRef, session }) => {
  const [netaCount, setNetaCount] = useState(0);
  useEffect(() => {
    setNetaCount(count);
  }, [count]);
  const netaList = [
    { name: "漬け物" },
    { name: "梅干" },
    { name: "たまご" },
    { name: "いか" },
    { name: "鰯" },
    { name: "鉄火巻き" },
    { name: "甘えび" },
    { name: "えび" },
    { name: "サーモン" },
    { name: "イクラ" },
    { name: "大トロ" },
    { name: "さんま" },
  ];
  const displayedNetaList = netaList.slice(0, netaCount);

  return (
    <Center h="200px">
      {displayedNetaList.map((neta, index) => {
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
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
            fontSize="24px"
            p="8px"
            onClick={() => {
              if (voucherRef && voucherRef.current) {
                voucherRef.current.clickChildOpen(index + 1, session, false);
              } else {
                console.error("voucherRef is not defined or current is null");
              }
            }}
          >
            {neta.name}
          </Text>
        );
      })}
    </Center>
  );
};
export default sushi_menu;
