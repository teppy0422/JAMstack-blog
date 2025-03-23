import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { supabase } from "../utils/supabase/client";
import "@fontsource/noto-sans-jp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useLanguage } from "../context/LanguageContext";
import { useUserData } from "../hooks/useUserData";
import { useUserInfo } from "../hooks/useUserId";
import getMessage from "./getMessage";

const activityOptions = [
  { value: "online", label: "オンライン", color: "#815ad6" },
  { value: "coding", label: "コーディング", color: "blue" },
  { value: "visiting", label: "訪問", color: "orange" },
  { value: "absent", label: "オフライン", color: "gray" },
  { value: "sleeping", label: "就寝", color: "gray" },
  { value: "other", label: "その他", color: "#555" },
];

// ステータス表示用の関数
const getActivityColor = (value: string) => {
  const option = activityOptions.find((opt) => opt.value === value);
  return option ? option.color : "transparent";
};

// ステータス表示用コンポーネント
export const StatusDisplay = ({ userId }: { userId: string | null }) => {
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);

  const getUseUserData = (id: string) => {
    const { pictureUrl, userName, userCompany, userMainCompany } =
      useUserData(id);
    return { pictureUrl, userName, userCompany, userMainCompany };
  };

  const [schedules, setSchedules] = useState<
    Array<{
      user_id: string;
      startTime: string;
      endTime: string | null;
      activity: string;
      note: string;
      picture_url: string;
      created_at: string;
    }>
  >([]);
  const [currentStatus, setCurrentStatus] = useState<{
    [key: string]: {
      activity: string;
      note: string;
      picture_url: string;
      created_at: string;
      startTime: string;
      endTime: string | null;
      user_id: string;
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
    }>
  >([]);
  const [userPictures, setUserPictures] = useState<{
    [key: string]: string | null;
  }>({});

  // ステータス表示用の関数
  const getActivityLabel = (value: string) => {
    const option = activityOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  // ユーザーのスケジュールを取得する関数
  const fetchUserSchedules = async (userId: string) => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from("admin_status")
      .select("*")
      .eq("user_id", userId)
      .gte("startTime", new Date(firstDayOfMonth).toISOString())
      .lte("startTime", new Date(lastDayOfMonth).toISOString())
      .order("startTime", { ascending: true });

    if (error) {
      console.error("Error fetching user schedules:", error);
    } else {
      const formattedSchedules = data.map((schedule) => ({
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
      }));
      setUserSchedules(formattedSchedules);
    }
  };

  // スケジュールモーダルを開く関数
  const handleOpenScheduleModal = (userId: string) => {
    setSelectedUserId(userId);
    fetchUserSchedules(userId);
    onScheduleModalOpen();
  };

  // スケジュールを取得する関数
  const fetchSchedules = async () => {
    // 現在の月の最初の日と最後の日を取得（日本時間）
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from("admin_status")
      .select("*")
      .gte("startTime", new Date(firstDayOfMonth).toISOString())
      .lte("startTime", new Date(lastDayOfMonth).toISOString())
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
    const userStatuses = currentSchedules.reduce((acc, schedule) => {
      if (!acc[schedule.user_id]) {
        acc[schedule.user_id] = {
          activity: schedule.activity,
          note: schedule.note,
          picture_url: schedule.picture_url,
          created_at: schedule.created_at,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          user_id: schedule.user_id,
        };
      }
      return acc;
    }, {} as Record<string, { activity: string; note: string; picture_url: string; created_at: string; startTime: string; endTime: string | null; user_id: string }>);

    // オフラインのユーザーを追加
    schedules.forEach((schedule) => {
      if (!userStatuses[schedule.user_id]) {
        userStatuses[schedule.user_id] = {
          activity: "absent",
          note: "オフライン",
          picture_url: schedule.picture_url,
          created_at: schedule.created_at,
          startTime: "",
          endTime: "",
          user_id: schedule.user_id,
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
              placement="top"
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
                }}
                color={{
                  base: colorMode === "light" ? "#000" : "#FFF",
                  sm: colorMode === "light" ? "#000" : "#FFF",
                  md: colorMode === "light" ? "#000" : "#FFF",
                  lg: colorMode === "light" ? "#000" : "#FFF",
                  xl: colorMode === "light" ? "#000" : "#FFF",
                }}
                cursor="pointer"
                onClick={() => handleOpenScheduleModal(userId)}
                sx={{
                  filter:
                    status.activity === "online" ? "none" : "grayscale(100%)",
                  transition: "all 0.3s ease",
                }}
              >
                <Flex textAlign="left" align="center" gap={1}>
                  {/* <Text>{status.user_id}</Text> */}
                  <Avatar
                    src={userPictures[userId] || status.picture_url}
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
        <ModalContent>
          <ModalHeader>
            {selectedUserId && (
              <>
                <Box>
                  <Text fontSize="lg" fontWeight="bold">
                    {userSchedules.length > 0
                      ? "スケジュール一覧"
                      : "スケジュールなし"}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date().toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </Box>
              </>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={1}>
              {userId === selectedUserId && (
                <NowStatus
                  schedules={schedules}
                  onSchedulesUpdate={setSchedules}
                />
              )}
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

                return (
                  <Flex direction="column" key={index}>
                    {showDate && (
                      <Box
                        textAlign="center"
                        flex="1"
                        position="relative"
                        mb={2}
                        w="100%"
                      >
                        <Text
                          fontWeight="medium"
                          bg={colorMode === "light" ? "#FFF" : "#2d3747"}
                          zIndex="2"
                          position="absolute"
                          top="0"
                        >
                          {currentDate}
                        </Text>
                        <Divider
                          position="absolute"
                          w="100%"
                          top="12px"
                          zIndex="1"
                          border="0.5px solid"
                          borderColor="#666"
                        />
                      </Box>
                    )}
                    <Flex
                      direction="row"
                      textAlign="left"
                      justify="left"
                      mt={5}
                      ml={8}
                    >
                      <Stack spacing={0} align="center" position="relative">
                        <Text fontWeight="medium" fontSize="12px">
                          {new Date(schedule.startTime).toLocaleTimeString(
                            "ja-JP",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </Text>
                        <Text>|</Text>
                        <Text fontWeight="medium" fontSize="12px">
                          {schedule.endTime &&
                            new Date(schedule.endTime).toLocaleTimeString(
                              "ja-JP",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                        </Text>
                        <Box
                          w="3px"
                          h="100%"
                          position="absolute"
                          bg={
                            isCurrent
                              ? colorMode === "light"
                                ? "red"
                                : "#F55"
                              : "#ccc"
                          }
                          left="-6px"
                        />
                      </Stack>
                      <Flex direction="column">
                        {schedule.activity !== "other" && (
                          <Box textAlign="center" justifyContent="left" ml={2}>
                            <Text
                              color="white"
                              bg={getActivityColor(schedule.activity)}
                              fontSize="10px"
                              py={0.5}
                              px={1}
                              m={0}
                              borderRadius="5px"
                            >
                              {getActivityLabel(schedule.activity)}
                            </Text>
                          </Box>
                        )}
                        <Box>
                          <Text textAlign="left" ml={2}>
                            {schedule.note}
                          </Text>
                        </Box>
                      </Flex>
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
}: {
  schedules: Array<{
    user_id: string;
    startTime: string;
    endTime: string | null;
    activity: string;
    note: string;
    picture_url: string;
    created_at: string;
  }>;
  onSchedulesUpdate: (
    schedules: Array<{
      user_id: string;
      startTime: string;
      endTime: string | null;
      activity: string;
      note: string;
      picture_url: string;
      created_at: string;
    }>
  ) => void;
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
    }>
  >([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<{
    startTime: string;
    endTime: string | null;
    activity: string;
    note: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    activity: "online",
    note: "",
  });

  let previousDate: string | null = null;

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUserId();
  }, []);

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
    });
    setIsEditModalOpen(true);
  };

  const handleEdit = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      startTime: schedule.startTime,
      endTime: schedule.endTime || "",
      activity: schedule.activity,
      note: schedule.note,
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
        note: formData.note,
        picture_url: pictureUrl || "",
      };
      console.log("pictureUrl:", pictureUrl);

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

  return (
    <Box
      bg="white.200"
      p="0"
      right="8px"
      textAlign="left"
      fontSize={15}
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
        mb={2}
        onClick={onOpen}
        cursor="pointer"
        px={2}
        _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.700" }}
      >
        {getMessage({
          ja: "スケジュール更新",
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
                  minDate={new Date()}
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
                        p={4}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                      >
                        <Flex justify="space-between" align="center" mb={2}>
                          <Text fontWeight="medium">
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
                        <Text>活動内容: {schedule.activity}</Text>
                        {schedule.note && <Text>メモ: {schedule.note}</Text>}
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
