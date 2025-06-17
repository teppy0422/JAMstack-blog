import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  Progress,
  Center,
  HStack,
  VStack,
  Card,
  Image,
  Stack,
  CardBody,
  Heading,
  Text,
  Avatar,
  Grid,
  useColorMode,
  AspectRatio,
} from "@chakra-ui/react";
import { useUserContext } from "@/contexts/useUserContext";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import getMessage from "../../../src/utils/getMessage";
import { isMobile } from "react-device-detect";
import { AnimatePresence, motion } from "framer-motion";
import { ControlBar } from "./ControlBar";

import TopNavbar from "./TopNavbar";
import YouTubeList from "./YouTubeList";

import { VideoMeta } from "@/types/video-meta";
import { allVideos } from "../movies/allVideos";

interface YouTubeFrameProps {
  initialVideoId?: string;
  isModal?: boolean;
}
const YouTubeFrame: React.FC<YouTubeFrameProps> = ({
  initialVideoId,
  isModal,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const { language, setLanguage } = useLanguage();
  const initialVideo =
    allVideos.find((v) => v.id === initialVideoId) || allVideos[0];
  const [currentVideo, setCurrentVideo] = useState<VideoMeta>(initialVideo);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const { colorMode } = useColorMode();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    console.log("currentSrc changed:", currentVideo);
  }, [currentVideo]);

  const {
    currentUserId,
    currentUserPictureUrl,
    currentUserEmail,
    currentUserCreatedAt,
    getUserById,
    isLoading,
  } = useUserContext();

  const togglePlayPause = () => {
    const video = document.querySelector<HTMLVideoElement>(".box1");
    if (video) {
      if (video.paused) {
        video.play().catch((error) => console.error("Play error:", error));
      } else {
        video.pause();
      }
    }
  };
  const toggleVolume = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = 1; // Set volume to 100%
      } else {
        videoRef.current.volume = 0; // Set volume to 0%k
      }
      setIsMuted(!isMuted);
    }
  };
  const rewindPlay = () => {
    const video = document.querySelector<HTMLVideoElement>(".box1");
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  const handleToggleText = () => {
    setShowFullText(!showFullText);
  };

  useEffect(() => {
    const video = document.querySelector<HTMLVideoElement>(".box1");
    const progressBar = document.getElementById("progress-bar");
    const progressContainer = document.getElementById("progress-container");

    if (!video || !progressBar || !progressContainer) return;

    const updateProgressBar = () => {
      const percentage = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${percentage}%`;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft")
        video.currentTime = Math.max(0, video.currentTime - 5);
      if (e.code === "ArrowRight")
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      }
    };

    video.addEventListener("timeupdate", updateProgressBar);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      video.removeEventListener("timeupdate", updateProgressBar);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentVideo.src]);

  const text =
    typeof currentVideo.textContent === "string"
      ? currentVideo.textContent
      : currentVideo.textContent?.[language] || "";
  const truncatedText = text
    .split("\n")
    .reduce((acc, line) => {
      if (acc.length + line.length <= 50) {
        return acc + line + "\n";
      }
      return acc;
    }, "")
    .trim();

  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleMouseEnter = () => {
    setVisible(true);
  };
  const handleMouseLeave = () => {
    setVisible(false);
  };
  const handleTouch = () => {
    if (isMobile) {
      setVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, 5000); // 5秒後に非表示
    }
  };
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // 現在からの期間
  function getPastText(dateString: string): string {
    const now = new Date();
    const target = new Date(dateString);
    const diffMs = now.getTime() - target.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 30) {
      return `${diffDays}日前`;
    }
    const diffMonths = Math.floor(diffDays / 30); // おおよそで月数を計算
    if (diffMonths < 12) {
      return `${diffMonths}ヶ月前`;
    }
    const diffYears = Math.floor(diffMonths / 12);
    if (diffYears < 10) {
      return `${diffYears}年前`;
    }
    return "10年前以上前";
  }

  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const handleProgressMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = videoRef.current;
    const progressContainer = e.currentTarget;
    if (!video) return;
    const rect = progressContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = offsetX / rect.width;
    const time = percent * video.duration;
    setHoverTime(time);
    setHoverX(offsetX);
  };

  const handleProgressLeave = () => {
    setHoverTime(null);
    setHoverX(null);
  };

  const handleProgressClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = videoRef.current;
    const progressContainer = e.currentTarget;
    if (!video) return;
    const rect = progressContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percent = offsetX / rect.width;
    const time = percent * video.duration;
    video.currentTime = time;
    video.play();
  };

  const MotionHStack = motion(HStack);

  return (
    <>
      <Box bg="custom.system.100">
        <TopNavbar />
        <Box
          m="0"
          h={isModal ? undefined : "90vh"}
          overflowY="auto"
          overflowX="hidden"
          bg="custom.system.800"
          color="#ddd"
        >
          <Grid
            mt={0}
            p={1}
            maxHeight="90vh"
            fontFamily={getMessage({
              ja: "Noto Sans JP",
              us: "Noto Sans,Noto Sans JP",
              cn: "Noto Sans SC",
              language,
            })}
            templateColumns={{ base: "1fr", lg: "5fr 2.5fr" }}
            gap={3}
          >
            <VStack flex="5">
              <Box
                border="0.5px solid "
                borderColor="custom.system.300"
                borderRadius="0px"
                width="100%"
                margin="0 auto"
                overflow="hidden"
                position="relative"
                boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              >
                <AspectRatio ratio={16 / 9} maxW="800px" mx="auto">
                  {currentVideo.src.includes("youtube.com") ||
                  currentVideo.src.includes("youtu.be") ? (
                    <iframe
                      title="YouTube video"
                      src={
                        currentVideo.src.includes("watch?v=")
                          ? currentVideo.src.replace("watch?v=", "embed/") +
                            "?rel=0&modestbranding=1"
                          : currentVideo.src.replace(
                              "youtu.be/",
                              "www.youtube.com/embed/"
                            ) + "?rel=0&modestbranding=1"
                      }
                      rel="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    />
                  ) : (
                    <video
                      className="box1"
                      key={currentVideo.src}
                      src={currentVideo.src}
                      autoPlay={currentVideo.autoPlay}
                      ref={videoRef}
                      onClick={togglePlayPause}
                      onTimeUpdate={() => {
                        if (videoRef.current) {
                          setCurrentTime(videoRef.current.currentTime);
                        }
                      }}
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          setDuration(videoRef.current.duration);
                        }
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  )}
                </AspectRatio>
                {!currentVideo.src.includes("youtube.com") &&
                  !currentVideo.src.includes("youtu.be") && (
                    <>
                      <Box
                        id="progress-container"
                        position="absolute"
                        zIndex={10}
                        bottom="0"
                        left="0"
                        width="100%"
                        height="4px"
                        backgroundColor="#777"
                        cursor="pointer"
                      >
                        {/* 実際の赤い進捗バー */}
                        <Box
                          id="progress-bar"
                          height="100%"
                          width={`${
                            duration > 0 ? (currentTime / duration) * 100 : 0
                          }%`}
                          backgroundColor="red"
                          transition="width 0.1s linear"
                        />

                        {/* 操作用の透明な大きなレイヤー */}
                        <Box
                          position="absolute"
                          top="-10px" // 上に6px広げる
                          left="0"
                          width="100%"
                          height="14px" // 合計：上6px + progress 4px + 下6px のイメージ
                          cursor="pointer"
                          onMouseMove={handleProgressMove}
                          onMouseLeave={handleProgressLeave}
                          onClick={handleProgressClick}
                          zIndex={20}
                        />

                        {/* ツールチップ */}
                        {hoverTime !== null && hoverX !== null && (
                          <Box
                            position="absolute"
                            left={`${hoverX}px`}
                            bottom="20px"
                            transform="translateX(-50%)"
                            px={2}
                            py={1}
                            bg="rgba(0,0,0,0.8)"
                            color="white"
                            fontSize="12px"
                            borderRadius="md"
                            pointerEvents="none"
                            whiteSpace="nowrap"
                          >
                            {formatTime(hoverTime)}
                          </Box>
                        )}
                      </Box>

                      <Center
                        id="pause-overlay"
                        position="absolute"
                        zIndex={5}
                        top="0"
                        width="100%"
                        height="100%"
                        bg="rgba(0, 0, 0, 0.3)"
                        color="white"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        onClick={togglePlayPause}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleTouch}
                        transition="all 0.3s ease-in-out"
                      >
                        <AnimatePresence>
                          {visible && (
                            <ControlBar
                              rewindPlay={rewindPlay}
                              toggleVolume={toggleVolume}
                              isMuted={isMuted}
                            />
                          )}
                        </AnimatePresence>
                        <Text
                          opacity={visible ? 1 : 0}
                          transition="all 0.3s ease-in-out"
                          position="absolute"
                          zIndex={20}
                          bottom="8px"
                          right="6px"
                          fontSize="11px"
                          color="white"
                          bg="rgba(0,0,0,0.5)"
                          px={1.5}
                          py={1}
                          borderRadius="md"
                        >
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </Text>
                      </Center>
                    </>
                  )}
              </Box>
              <Box width="100%" textAlign="left" ml="10px">
                <Text textAlign="left" fontSize="16px" fontWeight={600} ml={2}>
                  {typeof currentVideo.title === "string"
                    ? currentVideo.title
                    : currentVideo.title.ja}
                </Text>
                <HStack align="center" my={2} ml={1}>
                  <Avatar
                    size="sm"
                    src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                  />
                  <Text fontSize="16px">kataoka</Text>
                </HStack>
                <Card
                  w="100%"
                  p={2}
                  onClick={handleToggleText}
                  bg="custom.system.500"
                  color="#ddd"
                  cursor="pointer"
                  fontSize={13}
                >
                  <Box fontWeight={500}>
                    {currentVideo.date + "  " + getPastText(currentVideo.date)}
                  </Box>
                  <Text whiteSpace="pre-wrap" textAlign="left">
                    {showFullText ? text : `${truncatedText}...`}
                    <Box as="span" fontSize={11} ml={3}>
                      {showFullText
                        ? ""
                        : getMessage({
                            ja: "もっと読む",
                            us: "Read more",
                            cn: "更多信息",
                            language,
                          })}
                    </Box>
                  </Text>
                </Card>
              </Box>
            </VStack>
            <VStack flex="2">
              <Card
                border="0.5px solid"
                borderColor="custom.system.100"
                maxH="80vh"
                width="100%"
                bg="transparent"
                mb="20px"
                overflow="hidden"
              >
                <Box
                  width="100%"
                  color="#ddd"
                  fontWeight="600"
                  bg="custom.system.400"
                  textAlign="center"
                  verticalAlign="middle"
                >
                  <Heading fontSize="12px" mx={3} my={1}>
                    {getMessage({
                      ja: "その他の動画",
                      us: "PlayList",
                      cn: "播放列表",
                      language,
                    })}
                  </Heading>
                </Box>
                <Flex direction="column" overflowY="auto" py="4px">
                  <YouTubeList
                    allVideos={allVideos}
                    currentId={currentVideo.id}
                    onSelectVideo={(video: VideoMeta) => setCurrentVideo(video)}
                    isModal={isModal}
                  />
                </Flex>
              </Card>
            </VStack>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default YouTubeFrame;
