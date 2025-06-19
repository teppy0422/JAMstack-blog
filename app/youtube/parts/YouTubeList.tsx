"use client";

import { Box, Heading, VStack, Flex } from "@chakra-ui/react";
import { useLanguage } from "@/contexts/LanguageContext";

import getMessage from "@/utils/getMessage";
import { GetMessageLocalize } from "@/utils/getMessageLocalize";
import ThumnailCard from "./ThumnailCard";
import { VideoMeta } from "@/types/video-meta";
type Props = {
  allVideos: VideoMeta[];
  currentId: string;
  onSelectVideo: (video: VideoMeta) => void;
  isModal?: boolean;
};
export default function YouTubeList({
  allVideos,
  currentId,
  onSelectVideo,
  isModal = false,
}: Props) {
  const { language } = useLanguage();
  return (
    <>
      <Flex
        direction="column"
        overflowY="auto"
        maxH={isModal ? "41vh" : "85vh"}
        minH="0"
        bg="custom.system.900"
        p={0}
        m={0}
      >
        <Box flex="1" overflowY="auto" py={1} m={0}>
          {allVideos.map((video) => (
            <>
              <ThumnailCard
                key={video.id}
                title={
                  typeof video.title === "string"
                    ? video.title
                    : GetMessageLocalize(video.title, language)
                }
                name={
                  video.name
                    ? typeof video.name === "string"
                      ? `${video.id}.${video.name}`
                      : `${video.id}.${GetMessageLocalize(
                          video.name,
                          language
                        )}`
                    : video.id
                }
                src={video.src}
                thumbnail={video.thumbnail}
                time={video.time}
                isActive={currentId === video.id}
                onClick={() => onSelectVideo(video)}
              />
            </>
          ))}
        </Box>
      </Flex>
    </>
  );
}
