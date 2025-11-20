import { useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  useColorMode,
  VStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { milestones } from "../data/childrenData";

type Props = {
  childId: string;
};

export default function MilestonesView({ childId }: Props) {
  const { colorMode } = useColorMode();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const childMilestones = milestones
    .filter((milestone) => milestone.childId === childId)
    .sort((a, b) => new Date(b.milestoneDate).getTime() - new Date(a.milestoneDate).getTime());

  if (childMilestones.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">マイルストーンがありません</Text>
      </Box>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ファイルが動画かどうかを判定
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  // 動画モーダルを開く
  const openVideoModal = (url: string) => {
    setModalVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  // 動画モーダルを閉じる
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setModalVideoUrl("");
  };

  // 動画終了時の処理
  const handleVideoEnded = () => {
    closeVideoModal();
  };

  return (
    <VStack spacing={4} align="stretch">
      {childMilestones.map((milestone, index) => (
        <Box
          key={milestone.id}
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          bg={colorMode === "light" ? "white" : "gray.800"}
          shadow="sm"
          position="relative"
        >
          <Flex gap={4} direction={{ base: "column", md: "row" }}>
            {/* タイムラインドット */}
            <Box
              position="absolute"
              left="-20px"
              top="20px"
              width="10px"
              height="10px"
              borderRadius="full"
              bg="blue.500"
              border="3px solid"
              borderColor={colorMode === "light" ? "white" : "gray.800"}
              display={{ base: "none", md: "block" }}
            />

            {/* 写真・動画 */}
            {milestone.photoUrl && (
              <Box flexShrink={0}>
                {isVideo(milestone.photoUrl) ? (
                  <Box
                    width="150px"
                    height="150px"
                    borderRadius="md"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => openVideoModal(milestone.photoUrl!)}
                    position="relative"
                    _hover={{ opacity: 0.8 }}
                    transition="opacity 0.2s"
                  >
                    <video
                      src={milestone.photoUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      fontSize="40px"
                      color="white"
                      bg="rgba(0,0,0,0.5)"
                      borderRadius="full"
                      width="50px"
                      height="50px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      ▶
                    </Box>
                  </Box>
                ) : (
                  <Image
                    src={milestone.photoUrl}
                    alt={milestone.title}
                    width="150px"
                    height="150px"
                    objectFit="cover"
                    borderRadius="md"
                    fallbackSrc="https://via.placeholder.com/150?text=No+Image"
                  />
                )}
              </Box>
            )}

            {/* 詳細情報 */}
            <VStack align="stretch" flex={1} spacing={2}>
              <Flex gap={2} alignItems="center">
                <Badge colorScheme="blue" fontSize="sm">
                  {formatDate(milestone.milestoneDate)}
                </Badge>
              </Flex>

              <Text fontSize="lg" fontWeight="bold">
                {milestone.title}
              </Text>

              {milestone.description && (
                <Text color={colorMode === "light" ? "gray.700" : "gray.300"}>
                  {milestone.description}
                </Text>
              )}
            </VStack>
          </Flex>
        </Box>
      ))}

      {/* 動画再生モーダル */}
      <Modal isOpen={isVideoModalOpen} onClose={closeVideoModal} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="black">
          <ModalCloseButton color="white" />
          <ModalBody p={0}>
            <video
              ref={videoRef}
              src={modalVideoUrl}
              controls
              autoPlay
              onEnded={handleVideoEnded}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
