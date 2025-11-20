import React, { useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  useColorMode,
  VStack,
  HStack,
  Divider,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { growthRecords, milestones, children } from "../data/childrenData";
import { GrowthRecord, Milestone } from "../types/growth";

type Props = {
  childIds: string[];
};

type TimelineItem =
  | (GrowthRecord & { type: "growth" })
  | (Milestone & { type: "milestone" });

export default function TimelineView({ childIds }: Props) {
  const { colorMode } = useColorMode();
  const showMultipleChildren = childIds.length > 1;
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [modalVideoUrl, setModalVideoUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const getChildName = (childId: string) => {
    return children.find((c) => c.id === childId)?.name || "";
  };

  const getChildColorScheme = (childId: string) => {
    return children.find((c) => c.id === childId)?.colorScheme || "gray";
  };

  const getChildBirthdate = (childId: string) => {
    return children.find((c) => c.id === childId)?.birthdate || "";
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

  // 年齢計算（繰り上げ形式）
  const calculateAge = (birthdate: string, recordDate: string): string | null => {
    const birth = new Date(birthdate);
    const record = new Date(recordDate);

    // 記録日が誕生日より前の場合はnullを返す
    if (record < birth) {
      return null;
    }

    let years = record.getFullYear() - birth.getFullYear();
    let months = record.getMonth() - birth.getMonth();
    let days = record.getDate() - birth.getDate();

    // 日数がマイナスの場合、月を調整
    if (days < 0) {
      months--;
      const prevMonth = new Date(record.getFullYear(), record.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // 月数がマイナスの場合、年を調整
    if (months < 0) {
      years--;
      months += 12;
    }

    // 日数が15日以上なら月を繰り上げ
    if (days >= 15) {
      months++;
      if (months >= 12) {
        years++;
        months = 0;
      }
    }

    if (years === 0) {
      return `${months}ヶ月`;
    } else if (months === 0) {
      return `${years}歳`;
    } else {
      return `${years}歳${months}ヶ月`;
    }
  };

  // 成長記録とマイルストーンを統合
  const records = growthRecords
    .filter((record) => childIds.includes(record.childId))
    .map((record) => ({ ...record, type: "growth" as const }));

  const childMilestones = milestones
    .filter((milestone) => childIds.includes(milestone.childId))
    .map((milestone) => ({ ...milestone, type: "milestone" as const }));

  // 統合して日付順（昇順）にソート
  const timeline: TimelineItem[] = [...records, ...childMilestones].sort(
    (a, b) => {
      const dateA = a.type === "growth" ? a.recordDate : a.milestoneDate;
      const dateB = b.type === "growth" ? b.recordDate : b.milestoneDate;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    }
  );

  if (timeline.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">記録がありません</Text>
      </Box>
    );
  }

  const formatDate = (dateStr: string, prevDateStr?: string) => {
    const date = new Date(dateStr);
    const prevDate = prevDateStr ? new Date(prevDateStr) : null;
    const locale = ja;

    const dayOfWeek = format(date, "E", { locale });

    if (prevDate) {
      const isSameYear = date.getFullYear() === prevDate.getFullYear();
      const isSameMonth = isSameYear && date.getMonth() === prevDate.getMonth();

      if (isSameMonth) {
        return `${format(date, "M/d", { locale })} (${dayOfWeek})`;
      }
    }
    return `${format(date, "yyyy M/d", { locale })} (${dayOfWeek})`;
  };

  return (
    <VStack spacing={4} align="stretch">
      {timeline.map((item, index) => {
        const isGrowth = item.type === "growth";
        const date = isGrowth ? item.recordDate : item.milestoneDate;
        const prevItem = index > 0 ? timeline[index - 1] : null;
        const prevDate = prevItem
          ? prevItem.type === "growth"
            ? prevItem.recordDate
            : prevItem.milestoneDate
          : undefined;

        // 日付が変わったかチェック
        const currentDate = new Date(date);
        const previousDate = prevDate ? new Date(prevDate) : null;
        const isDateChanged =
          !previousDate ||
          currentDate.getFullYear() !== previousDate.getFullYear() ||
          currentDate.getMonth() !== previousDate.getMonth() ||
          currentDate.getDate() !== previousDate.getDate();

        return (
          <React.Fragment key={item.id}>
            {/* 日付ヘッダー */}
            {isDateChanged && (
              <>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  mb="0"
                >
                  <Divider borderColor="gray.500" />
                  <Text
                    fontSize="15px"
                    color="gray.500"
                    whiteSpace="nowrap"
                    textAlign="center"
                    mx="2"
                    lineHeight="1"
                  >
                    {formatDate(date, prevDate)}
                  </Text>
                  <Divider borderColor="gray.500" />
                </Flex>
                {/* 年齢バッジ */}
                <Flex justifyContent="center" gap={2} mb={0}>
                  {childIds
                    .map((childId) => {
                      const birthdate = getChildBirthdate(childId);
                      const age = calculateAge(birthdate, date);
                      const colorScheme = getChildColorScheme(childId);
                      const name = getChildName(childId);
                      return { childId, age, colorScheme, name };
                    })
                    .filter((item) => item.age !== null)
                    .map((item) => (
                      <Badge
                        key={item.childId}
                        colorScheme={item.colorScheme}
                        fontSize="xs"
                      >
                        {item.age}
                      </Badge>
                    ))}
                </Flex>
              </>
            )}

            {/* カード */}
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bg={colorMode === "light" ? "white" : "gray.800"}
              shadow="md"
            >
              <Flex direction={{ base: "column", md: "row" }} gap={6}>
                {/* 写真・動画 */}
                {item.photoUrl && (
                  <Box flexShrink={0}>
                    {isVideo(item.photoUrl) ? (
                      <Box
                        width="200px"
                        height="200px"
                        borderRadius="md"
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() => openVideoModal(item.photoUrl!)}
                        position="relative"
                        _hover={{ opacity: 0.8 }}
                        transition="opacity 0.2s"
                      >
                        <video
                          src={item.photoUrl}
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
                        src={item.photoUrl}
                        alt="記録写真"
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
                  <Flex gap={2} alignItems="center">
                    <Badge colorScheme={isGrowth ? "green" : "purple"}>
                      {isGrowth ? "成長記録" : "マイルストーン"}
                    </Badge>
                    {showMultipleChildren && (
                      <Text fontSize="sm" fontWeight="bold" color="blue.600">
                        {getChildName(item.childId)}
                      </Text>
                    )}
                  </Flex>

                  {isGrowth ? (
                    <>
                      {/* 成長記録の場合 */}
                      <HStack spacing={8}>
                        {item.heightCm && (
                          <Box>
                            <Text fontSize="sm" color="gray.500">
                              身長
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold">
                              {item.heightCm}
                              <Text as="span" fontSize="md" ml={1}>
                                cm
                              </Text>
                            </Text>
                          </Box>
                        )}

                        {item.weightKg && (
                          <Box>
                            <Text fontSize="sm" color="gray.500">
                              体重
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold">
                              {item.weightKg}
                              <Text as="span" fontSize="md" ml={1}>
                                kg
                              </Text>
                            </Text>
                          </Box>
                        )}
                      </HStack>

                      {item.notes && (
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>
                            メモ
                          </Text>
                          <Text>{item.notes}</Text>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      {/* マイルストーンの場合 */}
                      <Text fontSize="lg" fontWeight="bold">
                        {item.title}
                      </Text>

                      {item.description && (
                        <Text
                          color={
                            colorMode === "light" ? "gray.700" : "gray.300"
                          }
                        >
                          {item.description}
                        </Text>
                      )}
                    </>
                  )}
                </VStack>
              </Flex>
            </Box>
          </React.Fragment>
        );
      })}

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
