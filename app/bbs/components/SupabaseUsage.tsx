"use client";

import { useEffect, useState } from "react";
import { Box, Flex, Text, Progress, useColorMode } from "@chakra-ui/react";

export default function SupabaseUsage() {
  const { colorMode } = useColorMode();
  const [storageUsed, setStorageUsed] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // 無料枠の制限（GB）
  const STORAGE_LIMIT = 1; // 1GB
  const DB_LIMIT = 0.5; // 500MB

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      // APIルート経由でStorage使用量を取得
      const res = await fetch("/api/storage-usage");

      if (!res.ok) {
        throw new Error("Failed to fetch storage usage");
      }

      const data = await res.json();
      console.log("Storage使用量:", data);

      if (data.totalBytes !== undefined) {
        setStorageUsed(data.totalBytes);
      }
    } catch (error) {
      console.error("Error fetching usage:", error);
    } finally {
      setLoading(false);
    }
  };

  // バイトをGBに変換
  const bytesToGB = (bytes: number) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(3);
  };

  // 使用率を計算
  const usagePercent =
    (storageUsed / (STORAGE_LIMIT * 1024 * 1024 * 1024)) * 100;
  const remainingGB = STORAGE_LIMIT - parseFloat(bytesToGB(storageUsed));

  if (loading) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        bg={colorMode === "light" ? "gray.50" : "gray.800"}
      >
        <Text fontSize="sm">読み込み中...</Text>
      </Box>
    );
  }

  return (
    <Box p={0} w="240px" mx="auto">
      <Flex direction="column" gap={1}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="xs" fontWeight="bold" color="gray.500">
            Supabase
          </Text>
          <Text fontSize="xs" color="gray.500">
            {bytesToGB(storageUsed)} / {STORAGE_LIMIT} GB
          </Text>
        </Flex>

        <Progress
          value={usagePercent}
          size="xs"
          colorScheme="gray"
          borderRadius="md"
        />
      </Flex>
    </Box>
  );
}
