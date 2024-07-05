import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

export default function BBSPage() {
  const [data, setData] = useState<any>(null); // 型を明示的に指定

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/bbs"); // APIエンドポイントを指定
      const jsonData = await response.json();
      setData(jsonData);
    };
    fetchData();
  }, []);

  return (
    <Box p={5}>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre> // JSONデータを整形して表示
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
}
