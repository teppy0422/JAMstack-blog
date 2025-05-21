import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  Button,
  Stack,
  Text,
  useBreakpointValue,
  Checkbox,
  Avatar,
  Divider,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Flex,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Tooltip,
  Grid,
  Select,
  FormControl,
  FormLabel,
  Textarea,
  Center,
  HStack,
  IconButton,
  Spacer,
  Image,
  ChakraProvider,
} from "@chakra-ui/react";
import { theme } from "@/theme/theme";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { supabase } from "@/utils/supabase/client";
import "@fontsource/noto-sans-jp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useLanguage } from "../contexts/LanguageContext";
import { useUserContext } from "@/contexts/useUserContext";
import getMessage from "@/utils/getMessage";
import { getBoxShadow } from "@chakra-ui/react/dist/types/popper/utils";
import { AnimationImage } from "@/components/ui/CustomImage";

import { CustomModalCloseButton } from "./ui/CustomModalCloseButton";
import {
  ProjectLists,
  getProjectOptionsColor,
} from "@/components/ui/CustomBadge";
import CustomModal from "../../app/skillBlogs/components/customModal";

const activityOptions = [
  { value: "online", label: "オンライン", color: "#815ad6" },
  { value: "coding", label: "コーディング", color: "blue" },
  { value: "visiting", label: "訪問", color: "orange" },
  { value: "absent", label: "オフライン", color: "gray" },
  { value: "sleeping", label: "就寝", color: "gray" },
  { value: "other", label: "その他", color: "#555" },
];
// ステータス表示用の関数
const getActivityLabel = (value: string) => {
  const option = activityOptions.find((opt) => opt.value === value);
  return option ? option.label : value;
};
// ステータス表示用の関数
const getActivityColor = (value: string) => {
  const option = activityOptions.find((opt) => opt.value === value);
  return option ? option.color : "transparent";
};

// ステータス表示用コンポーネント
export const StatusDisplay = () => {
  const [schedules, setSchedules] = useState<
    Array<{
      user_id: string;
      startTime: string;
      endTime: string | null;
      activity: string;
      note: string;
      created_at: string;
      project: string;
    }>
  >([]);
  const [currentStatus, setCurrentStatus] = useState<{
    [key: string]: {
      activity: string;
      note: string;
      created_at: string;
      startTime: string;
      endTime: string | null;
      user_id: string;
      picture_url: string | null;
      project: string;
    };
  } | null>(null);
  const { colorMode } = useColorMode();
  const { language } = useLanguage();
  const {
    isOpen: isScheduleModalOpen,
    onOpen: onScheduleModalOpen,
    onClose,
  } = useDisclosure();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userSchedules, setUserSchedules] = useState<
    Array<{
      startTime: string;
      endTime: string | null;
      activity: string;
      note: string;
      project: string;
    }>
  >([]);

  const { currentUserId, getUserById } = useUserContext();
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  // ユーザーのスケジュールを取得する関数
  const getUserSchedules = async (
    selectedUserId: string | null,
    selectedDate: Date
  ) => {
    const now = new Date();

    // 与えられた日付が所属する週の月曜日と日曜日を計算
    const firstDayOfWeek = new Date(selectedDate);
    const lastDayOfWeek = new Date(selectedDate);

    // 月曜日を計算
    firstDayOfWeek.setDate(
      selectedDate.getDate() -
        (selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 0)
    );
    // 日曜日を計算
    lastDayOfWeek.setDate(
      selectedDate.getDate() +
        (selectedDate.getDay() === 0 ? 0 : 7 - selectedDate.getDay())
    );

    // ここでlastDayOfWeekを23:59:59に設定
    lastDayOfWeek.setHours(23, 59, 59, 999);

    // schedulesから該当ユーザーのデータをフィルタリング
    const userSchedulesData = schedules.filter(
      (schedule) =>
        schedule.user_id === selectedUserId &&
        new Date(schedule.startTime) >= firstDayOfWeek &&
        new Date(schedule.startTime) <= lastDayOfWeek
    );

    const formattedSchedules = userSchedulesData.map((schedule) => ({
      startTime: new Date(schedule.startTime).toLocaleString("ja-JP", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tokyo",
      }),
      endTime: schedule.endTime
        ? new Date(schedule.endTime).toLocaleString("ja-JP", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Tokyo",
          })
        : null,
      activity: schedule.activity,
      note: schedule.note,
      project: schedule.project,
    }));
    setUserSchedules(formattedSchedules);
  };

  // スケジュールモーダルを開く関数
  const handleOpenScheduleModal = (userId: string, targetDate: Date) => {
    // 与えられた日付が所属する週の月曜日を計算
    const mondayDate = new Date(targetDate);
    mondayDate.setDate(
      targetDate.getDate() -
        (targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1)
    );

    setSelectedUserId(userId);
    setTargetDate(mondayDate); // 月曜日の日付を設定
    getUserSchedules(userId, mondayDate);
    onScheduleModalOpen();
  };

  const handlePreviousWeek = () => {
    if (targetDate) {
      // 1週間前の日付を計算
      const previousWeekDate = new Date(targetDate);
      previousWeekDate.setDate(previousWeekDate.getDate() - 7);
      // ユーザーのスケジュールを取得
      getUserSchedules(selectedUserId, previousWeekDate);
      setTargetDate(previousWeekDate); // targetDateを更新
    }
  };
  const handleNextWeek = () => {
    if (targetDate) {
      // 1週間後の日付を計算
      const previousWeekDate = new Date(targetDate);
      previousWeekDate.setDate(previousWeekDate.getDate() + 7);
      // ユーザーのスケジュールを取得
      getUserSchedules(selectedUserId, previousWeekDate);
      setTargetDate(previousWeekDate); // targetDateを更新
    }
  };
  const [isAnimating, setIsAnimating] = useState(false); // アニメーションの状態を管理

  // スケジュールを取得する関数
  const fetchSchedules = async () => {
    // 現在の月の最初の日と最後の日を取得（日本時間）
    // const now = new Date();
    // const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // ここでlastDayOfMonthを23:59:59に設定
    // lastDayOfMonth.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from("admin_status")
      .select("*")
      // .gte("startTime", new Date(firstDayOfMonth).toISOString())
      // .lte("startTime", new Date(lastDayOfMonth).toISOString())
      .order("startTime", { ascending: true });

    if (error) {
      console.error("Error fetching schedules:", error);
    } else {
      setSchedules(data || []);
      calculateCurrentStatus();
    }
  };

  // 現在のステータスを計算する関数
  const calculateCurrentStatus = () => {
    const now = new Date();
    const currentSchedules = schedules.filter((schedule) => {
      const start = new Date(schedule.startTime);
      const end = schedule.endTime ? new Date(schedule.endTime) : null;
      return now >= start && (!end || now <= end);
    });
    // ユーザーIDごとにグループ化
    const userStatuses = currentSchedules.reduce(
      (acc, schedule) => {
        if (!acc[schedule.user_id]) {
          acc[schedule.user_id] = {
            activity: schedule.activity,
            note: schedule.note,
            picture_url: schedule.user_id
              ? getUserById(schedule.user_id)?.picture_url ?? null
              : null,
            created_at: schedule.created_at,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            user_id: schedule.user_id,
            project: schedule.project,
          };
        }
        return acc;
      },
      {} as Record<
        string,
        {
          activity: string;
          note: string;
          picture_url: string | null;
          created_at: string;
          startTime: string;
          endTime: string | null;
          user_id: string;
          project: string;
        }
      >
    );
    // オフラインのユーザーを追加
    schedules.forEach((schedule) => {
      if (!userStatuses[schedule.user_id]) {
        userStatuses[schedule.user_id] = {
          activity: "absent",
          note: "",
          picture_url: schedule.user_id
            ? getUserById(schedule.user_id)?.picture_url ?? null
            : null,
          created_at: schedule.created_at,
          startTime: "",
          endTime: "",
          user_id: schedule.user_id,
          project: schedule.project,
        };
      }
    });
    setCurrentStatus(userStatuses);
  };

  // 初期ロードとリアルタイム更新の設定
  useEffect(() => {
    fetchSchedules();
    const subscription = supabase
      .channel("admin_status_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "admin_status",
        },
        (payload) => {
          fetchSchedules();
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 1分ごとに現在のステータスを更新
  useEffect(() => {
    calculateCurrentStatus();
    const interval = setInterval(calculateCurrentStatus, 60000);
    return () => clearInterval(interval);
  }, [schedules]);

  if (!currentStatus) return null;
  let previousDate = "";

  // 画像が読み込まれたときにアニメーションを開始
  const handleImageLoad = () => {
    setIsAnimating(true);
  };

  return (
    <>
      <Box
        display={{
          base: "block",
          sm: "block",
          md: "block",
          lg: "block",
          xl: "block",
        }}
        position="fixed"
        zIndex={1100}
        top="46px"
        right="1px"
        borderRadius="md"
      >
        <Stack spacing={1}>
          {Object.entries(currentStatus).map(([userId, status]) => (
            <Tooltip
              key={userId}
              label={
                status.note && (
                  <Box fontSize="sm">
                    <>{status.note}</>
                  </Box>
                )
              }
              placement="left"
              hasArrow
            >
              <Box
                p={1}
                minWidth="0"
                border="1px solid"
                borderColor={colorMode === "light" ? "#bfb0a4" : "gray.500"}
                borderRadius="md"
                bgGradient={`linear(to-r, ${getActivityColor(
                  status.activity
                )}20, ${getActivityColor(status.activity)}10)`}
                backdropFilter="blur(10px)"
                boxShadow="sm"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                  transition: "all 0.2s",
                  filter: "none",
                }}
                color={colorMode === "light" ? "#000" : "#FFF"}
                cursor="pointer"
                onClick={() => handleOpenScheduleModal(userId, new Date())}
                sx={{
                  filter:
                    status.activity === "online" ? "none" : "grayscale(100%)",
                  transition: "all 0.3s ease",
                }}
              >
                <Flex textAlign="left" align="center" gap={1}>
                  {/* <Text>{status.user_id}</Text> */}
                  <Avatar
                    src={status.picture_url ?? undefined}
                    boxSize="20px"
                    borderColor={getActivityColor(status.activity)}
                  />
                  <Box
                    fontSize="11px"
                    bg={getActivityColor(status.activity)}
                    px={0.5}
                    py={0}
                    borderRadius="4px"
                    color="white"
                    fontWeight="medium"
                    boxShadow="sm"
                    minWidth="0"
                  >
                    {getActivityLabel(status.activity)}
                  </Box>
                </Flex>
                {status.startTime && (
                  <Text fontSize="11px" color="gray.500" fontStyle="italic">
                    {new Date(status.startTime).toLocaleString("ja-JP", {
                      // month: "numeric",
                      // day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Tokyo",
                    })}
                    {status.endTime &&
                      ` - ${new Date(status.endTime).toLocaleString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Tokyo",
                      })}`}
                  </Text>
                )}
              </Box>
            </Tooltip>
          ))}
        </Stack>
      </Box>
      {/* スケジュール表示用モーダル */}
      <Modal isOpen={isScheduleModalOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
          bg={
            colorMode === "light"
              ? "custom.theme.light.500"
              : "custom.theme.dark.500"
          }
        >
          <ModalHeader py={2} px={3}>
            {selectedUserId && (
              <>
                <Box>
                  <HStack>
                    <Text>日程</Text>
                    <Avatar
                      src={
                        getUserById(selectedUserId)?.picture_url ?? undefined
                      }
                      boxSize="24px"
                    />
                    <Text fontSize="16px" fontWeight="bold">
                      {getUserById(selectedUserId)?.user_metadata.name}
                    </Text>
                    {currentUserId === selectedUserId && (
                      <NowStatus
                        schedules={schedules}
                        onSchedulesUpdate={(newSchedules) => {
                          setSchedules(newSchedules);
                          getUserSchedules(selectedUserId, new Date());
                        }}
                        userId={currentUserId}
                      />
                    )}
                    <Box position="relative" w="400px" h="20px" flex={1}>
                      <Image
                        src="/images/illust/hippo/hippo_014_pixcel.gif"
                        width="28px"
                        position="absolute"
                        left="0"
                        top="0"
                        style={{
                          animation:
                            "zoomUp 3s forwards,moveHorizontal 8s ease-in-out infinite, floatUpDown 8s ease-in-out infinite",
                        }}
                      />
                      <style jsx>{`
                        @keyframes upDown {
                          0% {
                            transform: translateY(-10px);
                          }
                          10% {
                            transform: translateY(-10px);
                          }
                          30% {
                            transform: translateY(calc(100% - 35px));
                          }
                          48% {
                            transform: translateY(calc(100% - 35px));
                          }
                          100% {
                            transform: translateY(-10px);
                          }
                        }
                        @keyframes zoomUp {
                          0% {
                            top: 60px;
                            left: -60px;
                            width: 0;
                          }
                          100% {
                            top: 0;
                            left: 0;
                          }
                        }
                        @keyframes moveHorizontal {
                          0% {
                            left: 0;
                          }
                          50% {
                            left: calc(100% - 58px);
                          }
                          100% {
                            left: 0;
                          }
                        }
                        @keyframes floatUpDown {
                          0% {
                            transform: translateY(-6px) scaleX(1);
                          }
                          12% {
                            transform: translateY(-32px) scaleX(1);
                          }
                          25% {
                            transform: translateY(0px) scaleX(1);
                          }
                          37% {
                            transform: translateY(-12px) scaleX(1);
                          }
                          50% {
                            transform: translateY(-6px) scaleX(1);
                          }
                          50.1% {
                            transform: translateY(-6px) scaleX(-1);
                          }
                          63% {
                            transform: translateY(-32px) scaleX(-1);
                          }
                          75% {
                            transform: translateY(0px) scaleX(-1);
                          }
                          87% {
                            transform: translateY(-12px) scaleX(-1);
                          }
                          100% {
                            transform: translateY(-6px) scaleX(-1);
                          }
                        }
                      `}</style>
                    </Box>
                  </HStack>
                  <Text fontSize="12px" color="gray.500" fontWeight={600}>
                    {new Date().toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) + "更新"}
                  </Text>
                </Box>
              </>
            )}
          </ModalHeader>
          <CustomModalCloseButton
            colorMode={colorMode}
            onClose={onClose}
            top="-4px"
            right="-4px"
            outline={colorMode === "light" ? "4px solid" : "6px solid"}
            outlineColor={
              colorMode === "light"
                ? "custom.theme.light.500"
                : "custom.theme.dark.500"
            }
          />
          {/* <CustomModalCloseButton onClose={onClose} /> */}
          <ModalBody pb={3}>
            <Stack spacing={1}>
              <Center mb={3}>
                {/* 週を戻るアイコン */}
                <IconButton
                  aria-label="Previous week"
                  icon={<MdKeyboardDoubleArrowLeft />}
                  bg="transparent"
                  _hover={{ bg: "transparent", fontSize: "md" }}
                  onClick={() => handlePreviousWeek()}
                  h="18px"
                  w="36px"
                />
                <Box fontWeight={400}>
                  {targetDate &&
                    `${targetDate.getFullYear()}/${
                      targetDate.getMonth() + 1
                    }/${targetDate.getDate()}`}
                  の週
                </Box>
                {/* 週を進めるアイコン */}
                <IconButton
                  aria-label="Next week"
                  icon={<MdKeyboardDoubleArrowRight />}
                  bg="transparent"
                  _hover={{ bg: "transparent", fontSize: "md" }}
                  onClick={() => handleNextWeek()}
                  h="18px"
                  w="36px"
                />
              </Center>
              {userSchedules.map((schedule, index) => {
                const now = new Date();
                const start = schedule.startTime
                  ? new Date(schedule.startTime)
                  : null;
                const end = schedule.endTime
                  ? new Date(schedule.endTime)
                  : null;
                const isCurrent = start && now >= start && (!end || now <= end);

                const date = new Date(schedule.startTime);
                let currentDate = "";

                if (isNaN(date.getTime())) {
                  console.error("Invalid date:", schedule.startTime);
                } else {
                  const options: Intl.DateTimeFormatOptions = {
                    // year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    weekday: "short",
                    timeZone: "Asia/Tokyo",
                  };
                  currentDate = date.toLocaleDateString("ja-JP", options);
                }
                const showDate = currentDate !== previousDate;
                previousDate = currentDate;

                // 今日の日付かどうかを判定
                const isToday =
                  new Date().toDateString() ===
                  new Date(schedule.startTime).toDateString();

                return (
                  <Flex direction="column" key={index}>
                    {showDate && (
                      <Box
                        textAlign="center"
                        flex="1"
                        position="relative"
                        mb={6}
                        w="100%"
                      >
                        <Text
                          bg={
                            colorMode === "light"
                              ? "custom.theme.light.500"
                              : "custom.theme.dark.500"
                          }
                          zIndex="2"
                          position="absolute"
                          top="-4px"
                          fontWeight={isToday ? "bold" : "medium"}
                        >
                          {currentDate}
                        </Text>
                        {isToday && (
                          <Box
                            w="3px"
                            h="1rem"
                            position="absolute"
                            zIndex="3"
                            bg={colorMode === "light" ? "red" : "#F55"}
                            left="-5px"
                          />
                        )}
                        <Divider
                          position="absolute"
                          w="100%"
                          top="8px"
                          zIndex="1"
                          borderWidth={0.1}
                          borderColor="#777"
                        />
                      </Box>
                    )}
                    <Flex
                      direction="row"
                      textAlign="left"
                      justify="left"
                      mt={0}
                      ml={7}
                    >
                      <Stack position="relative" mb={0} align="center" gap="0">
                        <Text fontWeight="medium" fontSize="12px">
                          {new Date(schedule.startTime).toLocaleTimeString(
                            "ja-JP",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </Text>
                        <Box
                          w="1px"
                          h={
                            schedule.endTime
                              ? `${
                                  ((new Date(schedule.endTime).getTime() -
                                    new Date(schedule.startTime).getTime()) /
                                    (1000 * 60 * 30)) *
                                  2
                                }px`
                              : "20px"
                          }
                          bg={colorMode === "light" ? "#000" : "#aaa"}
                          my={0}
                        />
                        <Text fontWeight="medium" fontSize="12px">
                          {schedule.endTime &&
                            new Date(schedule.endTime).toLocaleTimeString(
                              "ja-JP",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                        </Text>
                        <Tooltip
                          label={getActivityLabel(schedule.activity)}
                          placement="left"
                          hasArrow
                        >
                          <Box
                            w="6px"
                            left="-9px"
                            h="100%"
                            position="absolute"
                            bg={getActivityColor(schedule.activity)}
                          />
                        </Tooltip>
                        {isCurrent && (
                          <>
                            {/* <Box h="100%" w="10px" bg="red" /> */}
                            {/* <Box
                              w="3px"
                              h="100%"
                              position="absolute"
                              bg={colorMode === "light" ? "red" : "#F55"}
                              left="-9px"
                            /> */}
                            <Box // Imageを包むBoxを追加
                              position="absolute"
                              zIndex="1000"
                              left="-28px"
                              top="0"
                              height="100%" // Stackの高さ全体を継承
                              style={{
                                animation: isAnimating
                                  ? "upDown 7s ease-in-out infinite"
                                  : "none",
                              }}
                            >
                              <Image
                                src={
                                  "/images/illust/hippo/hippo_023_pixcel.gif"
                                }
                                onLoad={handleImageLoad}
                                width="36px"
                                zIndex="1000"
                              />
                            </Box>
                          </>
                        )}
                      </Stack>
                      <Stack spacing={0} ml={2}>
                        <Flex direction="row" alignItems="center">
                          <Box
                            bg={getProjectOptionsColor(schedule.project)}
                            color="white"
                            fontFamily="Noto Sans Jp"
                            fontWeight={400}
                            fontSize={13}
                            borderRadius={3}
                            lineHeight={1.2}
                            px={1}
                          >
                            <Text
                              display="inline-block"
                              textAlign="left"
                              fontSize="12px"
                              fontWeight="bold"
                              width="fit-content"
                            >
                              {schedule.project}
                            </Text>
                          </Box>
                        </Flex>
                        {/* {getActivityLabel(schedule.activity)} */}
                        {/* </Text> */}
                        <Text
                          display="inline-block"
                          textAlign="left"
                          fontSize="12px"
                          fontWeight="bold"
                          width="fit-content"
                        >
                          {schedule.note}
                        </Text>
                      </Stack>
                    </Flex>
                  </Flex>
                );
              })}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

// ステータス更新用コンポーネント
export const NowStatus = ({
  schedules,
  onSchedulesUpdate,
  userId,
}: {
  schedules: Array<{
    user_id: string;
    startTime: string;
    endTime: string | null;
    activity: string;
    note: string;
    created_at: string;
    project: string;
  }>;
  onSchedulesUpdate: (
    schedules: Array<{
      user_id: string;
      startTime: string;
      endTime: string | null;
      activity: string;
      note: string;
      created_at: string;
      project: string;
    }>
  ) => void;
  userId: string | null;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const { language } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<
    Array<{
      startTime: string;
      endTime: string | null;
      activity: string;
      note: string;
      project: string;
    }>
  >([]);
  const [clickedProject, setClickedProject] = useState<string | null>(null); // クリックされたバッジの状態を追加
  const [ProjectMessage, setProjectMessage] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const handleProjectClick = (clickedProject: string | null) => {
    console.log("clickedProject: ", clickedProject);
    setClickedProject(clickedProject);
    if (clickedProject) {
      setProjectMessage("");
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<{
    startTime: string;
    endTime: string | null;
    activity: string;
    note: string;
    project: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    activity: "online",
    note: "",
    project: "",
  });

  // 選択された日付のスケジュールを取得
  useEffect(() => {
    if (!selectedDate || !userId) return;
    // 選択された日付の開始と終了（日本時間）
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const daySchedules = schedules
      .filter((schedule) => {
        const scheduleDate = new Date(schedule.startTime);
        return (
          scheduleDate >= startOfDay &&
          scheduleDate <= endOfDay &&
          schedule.user_id === userId
        );
      })
      .map((schedule) => ({
        startTime: new Date(schedule.startTime).toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Tokyo",
        }),
        endTime: schedule.endTime
          ? new Date(schedule.endTime).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Tokyo",
            })
          : null,
        activity: schedule.activity,
        note: schedule.note,
        project: schedule.project,
      }));

    setSelectedDaySchedules(daySchedules);
  }, [selectedDate, schedules, userId]);

  const formatDate = (date: Date) => {
    return date
      .toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
      .split(",")[0];
  };

  const renderDayContents = (day: number, date: Date) => {
    if (!userId)
      return (
        <Box position="relative" w="100%" h="100%">
          <Text>{day}</Text>
        </Box>
      );

    const dateStr = formatDate(date);
    const daySchedules = schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.startTime);
      const scheduleDateStr = formatDate(scheduleDate);
      return scheduleDateStr === dateStr && schedule.user_id === userId;
    });

    return (
      <Box>
        <Text>{day}</Text>
        {daySchedules.length > 0 && (
          <Box
            position="absolute"
            bottom="0"
            left="50%"
            transform="translateX(-50%)"
            display="flex"
            gap="2px"
          >
            {daySchedules.map((schedule, index) => (
              <Box
                key={index}
                w="4px"
                h="4px"
                bg={getActivityColor(schedule.activity)}
                borderRadius="full"
              />
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const handleAddNew = () => {
    setFormData({
      startTime: "08:00",
      endTime: "17:00",
      activity: "online",
      note: "",
      project: "",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (schedule: any) => {
    if (!userId || !selectedDate) return;

    try {
      // 選択された日付の開始と終了（日本時間）
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      // スケジュールを再取得して、完全なスケジュール情報を取得
      const { data: schedules, error: fetchError } = await supabase
        .from("admin_status")
        .select("*")
        .eq("user_id", userId)
        .gte("startTime", startOfDay.toISOString())
        .lte("startTime", endOfDay.toISOString())
        .order("startTime", { ascending: true });

      if (fetchError) throw fetchError;

      // 削除対象のスケジュールを特定
      const targetSchedule = schedules.find(
        (s) =>
          new Date(s.startTime).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Tokyo",
          }) === schedule.startTime
      );

      if (!targetSchedule) throw new Error("Schedule not found");

      // 削除を実行
      const { error } = await supabase
        .from("admin_status")
        .delete()
        .eq("id", targetSchedule.id);

      if (error) throw error;

      // 更新されたスケジュールを取得
      const { data: updatedSchedules, error: updateError } = await supabase
        .from("admin_status")
        .select("*")
        .eq("user_id", userId)
        .gte("startTime", startOfDay.toISOString())
        .lte("startTime", endOfDay.toISOString())
        .order("startTime", { ascending: true });

      if (updateError) throw updateError;

      onSchedulesUpdate(updatedSchedules || []);
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("スケジュールの削除に失敗しました。");
    }
  };

  // 30分毎の時刻オプションを生成する関数
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleSubmit = async () => {
    if (!userId || !selectedDate) return;
    try {
      // 開始時間の設定
      const startDateTime = new Date(selectedDate);
      const [startHours, startMinutes] = formData.startTime.split(":");
      startDateTime.setHours(
        parseInt(startHours),
        parseInt(startMinutes),
        0,
        0
      );
      // 終了時間の設定
      let endDateTime: Date | null = null;
      if (formData.endTime) {
        endDateTime = new Date(selectedDate);
        const [endHours, endMinutes] = formData.endTime.split(":");
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
      }
      const scheduleData = {
        user_id: userId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime ? endDateTime.toISOString() : null,
        activity: formData.activity,
        project: clickedProject,
        note: formData.note,
      };
      if (editingSchedule) {
        // 既存のスケジュールを更新
        const { error } = await supabase
          .from("admin_status")
          .update(scheduleData)
          .eq("user_id", userId)
          .eq("startTime", editingSchedule.startTime);
        if (error) throw error;
      } else {
        // 新規スケジュールを追加
        const { error } = await supabase
          .from("admin_status")
          .insert([scheduleData]);
        if (error) throw error;
      }
      // スケジュールを再取得
      const { data, error } = await supabase
        .from("admin_status")
        .select("*")
        .eq("user_id", userId)
        .gte(
          "startTime",
          new Date(selectedDate.setHours(0, 0, 0, 0)).toISOString()
        )
        .lte(
          "startTime",
          new Date(selectedDate.setHours(23, 59, 59, 999)).toISOString()
        )
        .order("startTime", { ascending: true });

      if (error) throw error;

      onSchedulesUpdate(data || []);
      setIsEditModalOpen(false);
      setEditingSchedule(null);
      setFormData({
        startTime: "",
        endTime: "",
        activity: "online",
        note: "",
        project: "",
      });

      // カレンダーを再レンダリングするために日付を更新
      const originalDate = new Date(selectedDate);
      setSelectedDate(originalDate);
    } catch (error) {
      console.error("Error saving schedule:", error);
      // エラーメッセージをユーザーに表示
      alert("スケジュールの保存に失敗しました。時間の形式を確認してください。");
    }
  };

  // 最新のcreated_atを取得
  const latestCreatedAt = schedules.reduce((latest, schedule) => {
    const createdAtDate = new Date(schedule.created_at);
    return createdAtDate > latest ? createdAtDate : latest;
  }, new Date(0)); // 初期値を1970年1月1日に設定

  return (
    <Box
      bg="white.200"
      p="0"
      top="4px"
      right="8px"
      textAlign="left"
      fontSize={14}
      fontFamily={getMessage({
        ja: "Noto Sans JP",
        us: "Noto Sans JP",
        cn: "Noto Sans SC",
        language,
      })}
    >
      <Text
        border="1px solid"
        textAlign="center"
        color={colorMode === "light" ? "black" : "white"}
        fontWeight={400}
        onClick={onOpen}
        cursor="pointer"
        px={2}
        _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.700" }}
      >
        {getMessage({
          ja: "更新",
          us: "Admin status update",
          cn: "管理员状态更新。",
          language,
        })}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {getMessage({
              ja: "スケジュール更新",
              us: "Admin status update",
              cn: "管理员状态更新。",
              language,
            })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={6}>
              <Box>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => date && setSelectedDate(date)}
                  // renderDayContents={renderDayContents}
                  inline
                  dateFormat="yyyy/MM/dd"
                  // minDate={new Date()}
                  highlightDates={
                    schedules
                      .filter((schedule) => schedule.user_id === userId) // user_idが一致するスケジュールのみをフィルタリング
                      .map((schedule) => new Date(schedule.startTime)) // フィルタリングされたスケジュールの日付を取得
                  }
                />
              </Box>
              {selectedDate && (
                <Box
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  <Text fontWeight="bold" mb={4}>
                    {selectedDate.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </Text>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    mb={4}
                    onClick={handleAddNew}
                  >
                    新規追加
                  </Button>
                  <Stack spacing={4}>
                    {selectedDaySchedules.map((schedule, index) => (
                      <Box
                        key={index}
                        p={2}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                      >
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" fontWeight="medium">
                            {schedule.startTime}-{schedule.endTime}
                          </Text>
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(schedule)}
                          >
                            削除
                          </Button>
                        </Flex>
                        <Flex direction="row" alignItems="center">
                          <Text
                            color="white"
                            bg={getActivityColor(schedule.activity)}
                            fontSize="10px"
                            fontWeight="medium"
                            display="inline"
                            py={0.5}
                            px={1}
                            m={0}
                            mr={1}
                            borderRadius="5px"
                          >
                            {getActivityLabel(schedule.activity)}
                          </Text>
                          <Box
                            bg={getProjectOptionsColor(schedule.project)}
                            color="white"
                            fontFamily="Noto Sans Jp"
                            fontWeight={400}
                            fontSize={14}
                            borderRadius={3}
                            px={1}
                          >
                            <Text
                              display="inline-block"
                              textAlign="left"
                              fontSize="12px"
                              fontWeight="bold"
                              width="fit-content"
                            >
                              {schedule.project}
                            </Text>
                          </Box>
                        </Flex>
                        <Text fontSize="sm" fontWeight={400}>
                          {schedule.note}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingSchedule ? "スケジュールの編集" : "新規スケジュールの追加"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>開始時間</FormLabel>
                <Select
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                >
                  <option value="">選択してください</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>終了時間</FormLabel>
                <Select
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                >
                  <option value="">選択してください</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>活動内容</FormLabel>
                <Select
                  value={formData.activity}
                  onChange={(e) =>
                    setFormData({ ...formData, activity: e.target.value })
                  }
                >
                  {activityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <ProjectLists
                  colorMode={colorMode}
                  onProjectClick={handleProjectClick}
                />
              </FormControl>

              <FormControl>
                <FormLabel>メモ</FormLabel>
                <Textarea
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                />
              </FormControl>
              <Button colorScheme="blue" onClick={handleSubmit}>
                保存
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
