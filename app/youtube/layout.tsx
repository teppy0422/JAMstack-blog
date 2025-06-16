// app/youtube/layout.tsx
import { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";

export default function YouTubeLayout({ children }: { children: ReactNode }) {
  return (
    // <Box height="100vh" bg="custom.system.900" color="#ddd" overflow="hidden">
    <Flex direction="column" height="100%" overflow="hidden">
      {/* 上部ナビゲーションなど共通コンテンツをここに */}
      {/* <TopNavbar /> などを直接置く場合はこちらに */}

      {/* 子コンポーネントがスクロール可能なエリア */}
      <Box flex="1" overflowY="auto" bg="#000">
        {children}
      </Box>
    </Flex>
    // </Box>
  );
}
