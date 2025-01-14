import React, { useEffect, useState, useRef } from "react";
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

import { useLanguage } from "../context/LanguageContext";
import getMessage from "../components/getMessage";

interface YouTubePlayerProps {
  src: string;
  title: string;
  textContent: string;
  date: string;
  autoPlay: boolean;
}
const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  src,
  title,
  textContent,
  date,
  autoPlay,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const { language, setLanguage } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

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
        videoRef.current.volume = 0; // Set volume to 0%
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

    if (video && progressBar && progressContainer && pauseOverlay) {
      const updateProgressBar = () => {
        const percentage = (video.currentTime / video.duration) * 100;
        progressBar.style.width = percentage + "%";
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
        switch (e.code) {
          case "ArrowLeft":
            video.currentTime = Math.max(0, video.currentTime - 5);
            break;
          case "ArrowRight":
            video.currentTime = Math.min(video.duration, video.currentTime + 5);
            break;
          case "Space":
            togglePlayPause();
            break;
        }
      };

      video.addEventListener("timeupdate", updateProgressBar);
      // video.addEventListener("click", togglePlayPause);
      progressContainer.addEventListener("click", handleProgressClick);
      document.addEventListener("keydown", handleKeyDown);

      video.addEventListener("pause", () => {
        pauseOverlay.style.display = "flex";
      });
      video.addEventListener("play", () => {
        pauseOverlay.style.display = "none";
      });

      // クリーンアップ関数
      // return () => {
      //   video.removeEventListener("timeupdate", updateProgressBar);
      //   video.removeEventListener("click", togglePlayPause);
      //   progressContainer.removeEventListener("click", handleProgressClick);
      //   document.removeEventListener("keydown", handleKeyDown);
      // };
    }
  }, []);

  const truncatedText = textContent
    .split("\n")
    .reduce((acc, line) => {
      if (acc.length + line.length <= 50) {
        return acc + line + "\n";
      }
      return acc;
    }, "")
    .trim();

  return (
    <HStack
      align="start"
      mt={3}
      p={3}
      overflowY="auto" // 縦方向にスクロール可能にする
      maxHeight="90vh"
      fontFamily={getMessage({
        ja: "Noto Sans JP",
        us: "Noto Sans,Noto Sans JP",
        cn: "Noto Sans SC",
        language,
      })}
    >
      <VStack flex="5">
        <Box
          border="1px solid "
          borderRadius="6px"
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
            ref={videoRef}
            onClick={togglePlayPause}
            {...(autoPlay ? { autoPlay: true, loop: true } : {})}
            src={src}
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
          >
            <HStack position="absolute" bottom={0} left="0" spacing={6} m={4}>
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
                // onClick={handleRewind} // クリックで先頭に戻る
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
        <Box width="100%" textAlign="left">
          <Text fontSize={18} fontWeight={600}>
            {title}
          </Text>
          <HStack align="start" my={2}>
            <Avatar
              size="sm"
              src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
            />
            <Text>kataoka</Text>
          </HStack>
          <Card
            w="100%"
            p={2}
            onClick={handleToggleText}
            bg="rgba(0,0,0,0.07)"
            cursor="pointer"
          >
            <Box fontWeight={500} fontSize={14}>
              {date}
            </Box>
            <Text whiteSpace="pre-wrap">
              {showFullText ? textContent : `${truncatedText}...`}
              <Box as="span" style={{ fontSize: "14px" }}>
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
          border="1px solid"
          borderColor="#888"
          height="80vh"
          bg="transparent"
        >
          <Box width="100%" bg="rgba(255, 255, 255, 0.3)">
            <Heading size="sm" m={3}>
              {getMessage({
                ja: "再生リスト",
                us: "PlayList",
                cn: "播放列表",
                language,
              })}
            </Heading>
          </Box>
          <Box
            overflowY="auto" // 縦方向にスクロール可能にする
            // maxHeight="200px"
          >
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="0"
              border="0px"
              bg="transparent"
              // bg="rgba(0,0,0,0.1)"
              boxShadow={0}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "50%", sm: "100px" }}
                maxH={{ base: "80px", sm: "60px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
                borderRadius="8px"
                mt="8px"
                mb="4px"
                ml="10px"
              />
              <Stack>
                <CardBody maxH={{ base: "80px", sm: "60px" }} p={2} pl={3}>
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Heading
                      size="xs"
                      overflow="hidden"
                      display="-webkit-box"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // 2行まで表示
                      }}
                    >
                      TEST
                    </Heading>
                    <Text py="1" fontSize={12} bottom="0" position="absolute">
                      kataoka
                    </Text>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="0"
              border="0px"
              // bg="transparent"
              bg="rgba(0,0,0,0.1)"
              boxShadow={0}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "50%", sm: "100px" }}
                maxH={{ base: "80px", sm: "60px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
                borderRadius="8px"
                mt="8px"
                mb="4px"
                ml="10px"
              />
              <Stack>
                <CardBody maxH={{ base: "80px", sm: "60px" }} p={2} pl={3}>
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Heading
                      size="xs"
                      overflow="hidden"
                      display="-webkit-box"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // 2行まで表示
                      }}
                    >
                      順立生産システムの使い方_SSC
                    </Heading>
                    <Text py="1" fontSize={12} bottom="0" position="absolute">
                      kataoka
                    </Text>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="0"
              border="0px"
              bg="transparent"
              // bg="rgba(0,0,0,0.1)"
              boxShadow={0}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "50%", sm: "100px" }}
                maxH={{ base: "80px", sm: "60px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
                borderRadius="8px"
                mt="8px"
                mb="4px"
                ml="10px"
              />
              <Stack>
                <CardBody maxH={{ base: "80px", sm: "60px" }} p={2} pl={3}>
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Heading
                      size="xs"
                      overflow="hidden"
                      display="-webkit-box"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // 2行まで表示
                      }}
                    >
                      順立生産システムの使い方_SSC
                    </Heading>
                    <Text py="1" fontSize={12} bottom="0" position="absolute">
                      kataoka
                    </Text>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="0"
              border="0px"
              bg="transparent"
              // bg="rgba(0,0,0,0.1)"
              boxShadow={0}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "50%", sm: "100px" }}
                maxH={{ base: "80px", sm: "60px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
                borderRadius="8px"
                mt="8px"
                mb="4px"
                ml="10px"
              />
              <Stack>
                <CardBody maxH={{ base: "80px", sm: "60px" }} p={2} pl={3}>
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Heading
                      size="xs"
                      overflow="hidden"
                      display="-webkit-box"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // 2行まで表示
                      }}
                    >
                      順立生産システムの使い方_SSC
                    </Heading>
                    <Text py="1" fontSize={12} bottom="0" position="absolute">
                      kataoka
                    </Text>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="0"
              border="0px"
              bg="transparent"
              // bg="rgba(0,0,0,0.1)"
              boxShadow={0}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "50%", sm: "100px" }}
                maxH={{ base: "80px", sm: "60px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
                borderRadius="8px"
                mt="8px"
                mb="4px"
                ml="10px"
              />
              <Stack>
                <CardBody maxH={{ base: "80px", sm: "60px" }} p={2} pl={3}>
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Heading
                      size="xs"
                      overflow="hidden"
                      display="-webkit-box"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // 2行まで表示
                      }}
                    >
                      順立生産システムの使い方_SSC
                    </Heading>
                    <Text py="1" fontSize={12} bottom="0" position="absolute">
                      kataoka
                    </Text>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="0"
              border="0px"
              bg="transparent"
              // bg="rgba(0,0,0,0.1)"
              boxShadow={0}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "50%", sm: "100px" }}
                maxH={{ base: "80px", sm: "60px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
                borderRadius="8px"
                mt="8px"
                mb="4px"
                ml="10px"
              />
              <Stack>
                <CardBody maxH={{ base: "80px", sm: "60px" }} p={2} pl={3}>
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Heading
                      size="xs"
                      overflow="hidden"
                      display="-webkit-box"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // 2行まで表示
                      }}
                    >
                      順立生産システムの使い方_SSC
                    </Heading>
                    <Text py="1" fontSize={12} bottom="0" position="absolute">
                      kataoka
                    </Text>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="0"
              border="0px"
              bg="transparent"
              // bg="rgba(0,0,0,0.1)"
              boxShadow={0}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "50%", sm: "100px" }}
                maxH={{ base: "80px", sm: "60px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
                borderRadius="8px"
                mt="8px"
                mb="4px"
                ml="10px"
              />
              <Stack>
                <CardBody maxH={{ base: "80px", sm: "60px" }} p={2} pl={3}>
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Heading
                      size="xs"
                      overflow="hidden"
                      display="-webkit-box"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // 2行まで表示
                      }}
                    >
                      順立生産システムの使い方_SSC
                    </Heading>
                    <Text py="1" fontSize={12} bottom="0" position="absolute">
                      kataoka
                    </Text>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="0"
              border="0px"
              bg="transparent"
              // bg="rgba(0,0,0,0.1)"
              boxShadow={0}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "50%", sm: "100px" }}
                maxH={{ base: "80px", sm: "60px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
                borderRadius="8px"
                mt="8px"
                mb="4px"
                ml="10px"
              />
              <Stack>
                <CardBody maxH={{ base: "80px", sm: "60px" }} p={2} pl={3}>
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Heading
                      size="xs"
                      overflow="hidden"
                      display="-webkit-box"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // 2行まで表示
                      }}
                    >
                      順立生産システムの使い方_SSC
                    </Heading>
                    <Text py="1" fontSize={12} bottom="0" position="absolute">
                      kataoka
                    </Text>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
            <Card
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
              borderRadius="0"
              border="0px"
              bg="transparent"
              // bg="rgba(0,0,0,0.1)"
              boxShadow={0}
            >
              <Image
                objectFit="cover"
                maxW={{ base: "50%", sm: "100px" }}
                maxH={{ base: "80px", sm: "60px" }}
                src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                alt="Caffe Latte"
                borderRadius="8px"
                mt="8px"
                mb="4px"
                ml="10px"
              />
              <Stack>
                <CardBody maxH={{ base: "80px", sm: "60px" }} p={2} pl={3}>
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Heading
                      size="xs"
                      overflow="hidden"
                      display="-webkit-box"
                      style={{
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2, // 2行まで表示
                      }}
                    >
                      順立生産システムの使い方_SSC
                    </Heading>
                    <Text py="1" fontSize={12} bottom="0" position="absolute">
                      kataoka
                    </Text>
                  </Flex>
                </CardBody>
              </Stack>
            </Card>
          </Box>
        </Card>
      </VStack>
    </HStack>
  );
};

export default YouTubePlayer;
