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
  Spacer,
  InputGroup,
  InputRightElement,
  IconButton,
  Input,
  useColorMode,
} from "@chakra-ui/react";
import { useUserContext } from "@/contexts/useUserContext";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import getMessage from "../../../src/utils/getMessage";
import { isMobile } from "react-device-detect";

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
    const pauseOverlay = document.getElementById("pause-overlay");

    if (!video || !progressBar || !progressContainer || !pauseOverlay) return;

    const updateProgressBar = () => {
      const percentage = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${percentage}%`;
    };

    const handleProgressClick = (e: MouseEvent) => {
      const rect = progressContainer.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newTime =
        (offsetX / progressContainer.offsetWidth) * video.duration;
      video.currentTime = newTime;
      video.play();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft")
        video.currentTime = Math.max(0, video.currentTime - 5);
      if (e.code === "ArrowRight")
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
      if (e.code === "Space") {
        e.preventDefault(); // ページスクロール防止
        togglePlayPause();
      }
    };

    video.addEventListener("timeupdate", updateProgressBar);
    progressContainer.addEventListener("click", handleProgressClick);
    document.addEventListener("keydown", handleKeyDown);

    video.addEventListener(
      "pause",
      () => (pauseOverlay.style.display = "flex")
    );
    video.addEventListener("play", () => (pauseOverlay.style.display = "none"));

    return () => {
      video.removeEventListener("timeupdate", updateProgressBar);
      progressContainer.removeEventListener("click", handleProgressClick);
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
    if (!isMobile) {
      setVisible(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isMobile) {
      setVisible(false);
    }
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
  return (
    <>
      <TopNavbar />
      <Box
        // maxH="60vh"
        h="100vh"
        overflowY="auto"
        overflowX="hidden"
        bg="custom.system.800"
        color="#ddd"
      >
        <Grid
          mt={0}
          p={1}
          // overflowY="auto"
          maxHeight="90vh"
          fontFamily={getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans,Noto Sans JP",
            cn: "Noto Sans SC",
            language,
          })}
          templateColumns={{ base: "1fr", lg: "5fr 2fr" }}
          gap={3}
        >
          <VStack flex="5">
            <Box
              border="0.5px solid "
              borderColor="custom.system.300"
              borderRadius="0px"
              width="100%"
              // maxWidth="800px"
              margin="0 auto"
              overflow="hidden"
              position="relative"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
              cursor="pointer"
            >
              <video
                className="box1"
                key={currentVideo.src}
                src={currentVideo.src}
                autoPlay={currentVideo.autoPlay}
                ref={videoRef}
                onClick={togglePlayPause}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              />
              <Box
                id="progress-container"
                position="absolute"
                bottom="0"
                left="0"
                width="100%"
                backgroundColor="#777"
                height="4px"
                cursor="pointer"
              >
                <Progress
                  id="progress-bar"
                  size="xs"
                  backgroundColor="red"
                  value={0}
                  style={{
                    width: "0%",
                    height: "100%",
                  }}
                />
              </Box>
              <Center
                id="pause-overlay"
                position="absolute"
                top="0"
                width="100%"
                height="100%"
                bg="rgba(0, 0, 0, 0.3)"
                color="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                cursor="pointer"
                onClick={togglePlayPause}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouch}
              >
                <HStack
                  position="absolute"
                  bottom={0}
                  left="0"
                  spacing={6}
                  m={4}
                  opacity={visible ? 1 : 0}
                  pointerEvents={visible ? "auto" : "none"}
                  transition="opacity 0.5s ease"
                >
                  <Box
                    as="svg"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                    xmlns="http://www.w3.org/2000/svg"
                    _hover={{ fill: "red", stroke: "red" }} // マウスオーバーで色を青に変更
                    onClick={rewindPlay} // クリックで先頭に戻る
                    cursor="pointer"
                  >
                    <path d="M19.496 4.136l-12 7a1 1 0 0 0 0 1.728l12 7a1 1 0 0 0 1.504 -.864v-14a1 1 0 0 0 -1.504 -.864z"></path>
                    <path d="M4 4a1 1 0 0 1 .993 .883l.007 .117v14a1 1 0 0 1 -1.993 .117l-.007 -.117v-14a1 1 0 0 1 1 -1z"></path>
                  </Box>
                  <Box
                    as="svg"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                    xmlns="http://www.w3.org/2000/svg"
                    _hover={{ fill: "red", stroke: "red" }} // マウスオーバーで色を赤に変更
                  >
                    <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z"></path>
                  </Box>
                  <Box
                    as="svg"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                    xmlns="http://www.w3.org/2000/svg"
                    _hover={{ fill: "red", stroke: "red" }} // マウスオーバーで色を青に変更
                    // onClick={handleRewind} // クリックで先頭に戻る
                    cursor="pointer"
                  >
                    <path d="M3 5v14a1 1 0 0 0 1.504 .864l12 -7a1 1 0 0 0 0 -1.728l-12 -7a1 1 0 0 0 -1.504 .864z"></path>
                    <path d="M20 4a1 1 0 0 1 .993 .883l.007 .117v14a1 1 0 0 1 -1.993 .117l-.007 -.117v-14a1 1 0 0 1 1 -1z"></path>
                  </Box>
                  <Box
                    as="svg"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="24px"
                    width="24px"
                    xmlns="http://www.w3.org/2000/svg"
                    _hover={{ fill: "red", stroke: "red" }} // マウスオーバーで色を青に変更
                    cursor="pointer"
                    onClick={toggleVolume} // クリックでボリュームを切り替える
                  >
                    {isMuted ? (
                      <path d="m7.727 6.313-4.02-4.02-1.414 1.414 18 18 1.414-1.414-2.02-2.02A9.578 9.578 0 0 0 21.999 12c0-4.091-2.472-7.453-5.999-9v2c2.387 1.386 3.999 4.047 3.999 7a8.13 8.13 0 0 1-1.671 4.914l-1.286-1.286C17.644 14.536 18 13.19 18 12c0-1.771-.775-3.9-2-5v7.586l-2-2V2.132L7.727 6.313zM4 17h2.697L14 21.868v-3.747L3.102 7.223A1.995 1.995 0 0 0 2 9v6c0 1.103.897 2 2 2z"></path>
                    ) : (
                      <>
                        <path d="M16 21c3.527-1.547 5.999-4.909 5.999-9S19.527 4.547 16 3v2c2.387 1.386 3.999 4.047 3.999 7S18.387 17.614 16 19v2z"></path>
                        <path d="M16 7v10c1.225-1.1 2-3.229 2-5s-.775-3.9-2-5zM4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z"></path>
                      </>
                    )}
                  </Box>
                </HStack>
              </Center>
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
                />
              </Flex>
            </Card>
          </VStack>
        </Grid>
      </Box>
    </>
  );
};

export default YouTubeFrame;
