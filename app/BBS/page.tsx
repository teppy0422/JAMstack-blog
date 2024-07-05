"use client";

import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import Content from "../../components/content";

export default function BBSPage() {
  const [data, setData] = useState<any>(null); // 型を明示的に指定

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/BBS"); // APIエンドポイントを指定
      if (!response.ok) {
        console.error("Failed to fetch data:", response.statusText);
        return;
      }
      const jsonData = await response.json();
      setData(jsonData);
    };
    fetchData();
  }, []);

  return (
    <Content isCustomHeader={true}>
      <Box>
        <Box p={5}>
          {data ? (
            <pre>{JSON.stringify(data, null, 2)}</pre> // JSONデータを整形して表示
          ) : (
            <Text>Loading...</Text>
          )}
        </Box>
      </Box>
    </Content>
  );
}
