"use client";

import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

import Content from "@/components/content";
import TopNavbar from "./parts/TopNavbar";
import YouTubeFrame from "./parts/YouTubeFrame";
import YouTubeList from "./parts/YouTubeList";
import { allVideos } from "./movies/allVideos";
import { VideoMeta } from "@/types/video-meta";

export default function YouTubePage() {
  // 最初の動画を初期値に
  const [currentVideo, setCurrentVideo] = useState<VideoMeta>(allVideos[0]);

  return (
    <Content maxWidth="100vw">
      <Box bg="custom.system.900" color="#ddd">
        {/* <TopNavbar /> */}
        {/* 動画プレイヤー */}
        <YouTubeFrame initialVideoId={currentVideo.id} />
      </Box>
    </Content>
  );
}
