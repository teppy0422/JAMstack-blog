"use client";

import { useEffect, useState } from "react";
import { Box, Flex, Text, Progress } from "@chakra-ui/react";

export default function VercelUsage() {
  const [sizeUsed, setSizeUsed] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Vercelの無料枠制限（GB） - Hobby plan
  const SIZE_LIMIT = 6; // 6GB per deployment

  useEffect(() => {
    fetchSize();
  }, []);

  const fetchSize = async () => {
    try {
      const res = await fetch("/vercel-size.json");

      if (!res.ok) {
        throw new Error("Failed to fetch vercel size");
      }

      const data = await res.json();
      console.log("Vercel size:", data);

      if (data.totalBytes !== undefined) {
        setSizeUsed(data.totalBytes);
      }
    } catch (error) {
      console.error("Error fetching vercel size:", error);
    } finally {
      setLoading(false);
    }
  };

  // バイトをGBに変換
  const bytesToGB = (bytes: number) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(3);
  };

  // 使用率を計算
  const usagePercent = (sizeUsed / (SIZE_LIMIT * 1024 * 1024 * 1024)) * 100;

  if (loading) {
    return null;
  }

  return (
    <Box p={0} w="240px" mx="auto">
      <Flex direction="column" gap={1}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="xs" fontWeight="bold" color="gray.500">
            Vercel
          </Text>
          <Text fontSize="xs" color="gray.500">
            {bytesToGB(sizeUsed)} / {SIZE_LIMIT} GB
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
