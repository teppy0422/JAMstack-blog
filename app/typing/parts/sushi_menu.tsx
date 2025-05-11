import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Center, StylesProvider } from "@chakra-ui/react";
import styles from "./keyboard.module.scss";

const sushi_menu = ({ count, voucherRef, session, snowflakeCount }) => {
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
  useEffect(() => {
    const snowflakes = document.querySelectorAll(`.${styles.snowflake}`);
    snowflakes.forEach((snowflake) => snowflake.remove());
  }, []);
  const displayedNetaList = netaList.slice(0, netaCount);
  const textRef = useRef<HTMLDivElement>(null);
  const [prevSnowflakeCount, setPrevSnowflakeCount] = useState(snowflakeCount);
  const [isIncreasing, setIsIncreasing] = useState(true); // 降雪が増えているか減っているかを管理
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const snowflakeCountRef = useRef(snowflakeCount);
  const isIncreasingRef = useRef(isIncreasing);

  // intervalRefの更新
  useEffect(() => {
    snowflakeCountRef.current = snowflakeCount;
  }, [snowflakeCount]);
  useEffect(() => {
    isIncreasingRef.current = isIncreasing;
  }, [isIncreasing]);

  useEffect(() => {
    if (
      snowflakeCountRef.current >= prevSnowflakeCount &&
      snowflakeCountRef.current > 0
    ) {
      if (isIncreasing !== true && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsIncreasing(true);
    } else {
      if (isIncreasing !== false && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsIncreasing(false);
    }
    if (!intervalRef.current && snowflakeCountRef.current > 0) {
      intervalRef.current = setInterval(() => {
        const currentSnowflakeCount = snowflakeCountRef.current; // 最新のsnowflakeCountを参照
        const currentIsIncreasing = isIncreasingRef.current; // 最新のisIncreasingを参照

        if (currentIsIncreasing) {
          // 積雪を追加
          if (currentSnowflakeCount > 1000) {
            const snowflakes = document.querySelectorAll(
              `.${styles.snowTarget}`
            );
            snowflakes.forEach((snowflake) => {
              for (let i = 0; i < currentSnowflakeCount / 2500; i++) {
                if (
                  snowflake.className.includes("keyboard") &&
                  Math.random() < 0.3
                ) {
                  continue;
                }
                const newSnowflake = document.createElement("div");
                newSnowflake.className = styles.snowflake;
                const position =
                  snowflake.id === "line"
                    ? "top"
                    : Math.random() < 0.5
                    ? "left"
                    : "top";
                if (position === "left") {
                  newSnowflake.style.left = `${Math.random() * 2 - 2}%`;
                  newSnowflake.style.top = `${Math.random() * 95 - 2}%`;
                } else {
                  newSnowflake.style.left = `${Math.random() * 97}%`;
                  newSnowflake.style.top = `${Math.random() * 2 - 1}%`;
                }
                newSnowflake.style.width = `${Math.random() * 3 + 2}px`;
                newSnowflake.style.height = `${
                  parseFloat(newSnowflake.style.width) * 0.8
                }px`;
                newSnowflake.style.opacity = `${Math.random() * 0.5 + 0.3}`;
                snowflake.appendChild(newSnowflake);
              }
            });
          }
        } else {
          // 積雪を削除
          const snowflakes = Array.from(
            document.querySelectorAll(`.${styles.snowflake}`)
          );
          // 配列をシャッフル
          for (let i = snowflakes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [snowflakes[i], snowflakes[j]] = [snowflakes[j], snowflakes[i]];
          }
          let index = 0;
          for (let i = 0; i < 40 && index < snowflakes.length; i++) {
            snowflakes[index].remove();
            index++;
          }
        }
      }, 1000);
    }
    setPrevSnowflakeCount(snowflakeCount);
  }, [snowflakeCount]);
  return (
    <Center h="200px">
      {displayedNetaList.map((neta, index) => {
        return (
          <div className={styles.sushiMenu}>
            <Text
              ref={textRef}
              className={`${styles.board} ${styles.snowTarget}`} // 複数のクラスを適用
              style={{
                writingMode: "vertical-rl",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 600,
                borderRadius: "6px",
                height: "120px",
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
          </div>
        );
      })}
    </Center>
  );
};
export default sushi_menu;
