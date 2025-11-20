import { useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  useColorMode,
  VStack,
  HStack,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { growthRecords } from "../data/childrenData";

type Props = {
  childId: string;
};

export default function GrowthRecordsView({ childId }: Props) {
  const { colorMode } = useColorMode();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const records = growthRecords
    .filter((record) => record.childId === childId)
    .sort(
      (a, b) =>
        new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
    );

  if (records.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">成長記録がありません</Text>
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
    <VStack spacing={6} align="stretch">
      {records.map((record) => (
        <Box
          key={record.id}
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          bg={colorMode === "light" ? "white" : "gray.800"}
          shadow="md"
        >
          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            {/* 写真・動画 */}
            {record.photoUrl && (
              <Box flexShrink={0}>
                {isVideo(record.photoUrl) ? (
                  <Box
                    width="200px"
                    height="200px"
                    borderRadius="md"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => openVideoModal(record.photoUrl!)}
                    position="relative"
                    _hover={{ opacity: 0.8 }}
                    transition="opacity 0.2s"
                  >
                    <video
                      src={record.photoUrl}
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
                      fontSize="48px"
                      color="white"
                      bg="rgba(0,0,0,0.5)"
                      borderRadius="full"
                      width="60px"
                      height="60px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      ▶
                    </Box>
                  </Box>
                ) : (
                  <Image
                    src={record.photoUrl}
                    alt={`${formatDate(record.recordDate)}の記録`}
                    height="200px"
                    objectFit="cover"
                    borderRadius="md"
                    fallbackSrc="https://via.placeholder.com/200?text=No+Image"
                  />
                )}
              </Box>
            )}

            {/* 詳細情報 */}
            <VStack align="stretch" flex={1} spacing={3}>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                {formatDate(record.recordDate)}
              </Text>

              <Divider />

              <HStack spacing={8}>
                {record.heightCm && (
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      身長
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {record.heightCm}
                      <Text as="span" fontSize="md" ml={1}>
                        cm
                      </Text>
                    </Text>
                  </Box>
                )}

                {record.weightKg && (
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      体重
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {record.weightKg}
                      <Text as="span" fontSize="md" ml={1}>
                        kg
                      </Text>
                    </Text>
                  </Box>
                )}
              </HStack>

              {record.notes && (
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    メモ
                  </Text>
                  <Text>{record.notes}</Text>
                </Box>
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
