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
  { value: "other", label: "その他", color: "transparent" },
];
// ステータス表示用コンポーネント
export const StatusDisplay = () => {
  const [currentStatuses, setCurrentStatuses] = useState<
    Array<{
      time: string;
      activity: string;
      note: string;
      created_at: string;
      user_id: string;
      picture_url: string;
    }>
  >([]);
  const { colorMode } = useColorMode();
  const { language } = useLanguage();

  // 現在のステータスを取得する関数
  const fetchCurrentStatuses = async () => {
    const { data, error } = await supabase
      .from("admin_status")
      .select("*")
      .order("user_id", { ascending: true })
      .limit(5);

    if (error) {
      console.error("Error fetching current statuses:", error);
    } else {
      setCurrentStatuses(data || []);
    }
  };

  // 初期ロードとリアルタイム更新の設定
  useEffect(() => {
    fetchCurrentStatuses();
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
          fetchCurrentStatuses();
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  // 時間をフォーマットする関数
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const dayOfWeek = days[date.getDay()];
    // 日付が同じかどうかをチェック
    const isSameDate = date.toDateString() === now.toDateString();
    // 月が同じかどうかをチェック
    const isSameMonth =
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isSameDate) {
      // 今日の場合は時刻のみ表示
      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } else if (isSameMonth) {
      // 同じ月の場合は日付と曜日を表示
      return `${date.getDate()}日(${dayOfWeek}) ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } else {
      // それ以外の場合は月/日と曜日を表示
      return `${date.getMonth() + 1}/${date.getDate()}(${dayOfWeek}) ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
  };

  if (currentStatuses.length === 0) return null;

  return (
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
      right="7px"
      borderRadius="md"
    >
      <Stack spacing={1}>
        {currentStatuses.map((status, index) => (
          <Tooltip label={status.note || ""} hasArrow placement="top">
            <Box
              key={index}
              p={1}
              border="1px solid"
              borderColor={colorMode === "light" ? "#bfb0a4" : "gray.500"}
              borderRadius="md"
              bg={{
                base: colorMode === "light" ? "#FFF" : "#000",
                sm: colorMode === "light" ? "#FFF" : "#000",
                lg: colorMode === "light" ? "#FFF" : "#000",
                xl: "transparent",
              }}
              color={{
                base: colorMode === "light" ? "#000" : "#FFF",
                sm: colorMode === "light" ? "#000" : "#FFF",
                md: colorMode === "light" ? "#000" : "#FFF",
                lg: colorMode === "light" ? "#000" : "#FFF",
                xl: colorMode === "light" ? "#000" : "#FFF",
              }}
              cursor="default"
              sx={{
                filter:
                  status.activity === "online" ? "none" : "grayscale(100%)",
                transition: "filter 0.2s",
                _hover: {
                  filter: "none",
                },
              }}
            >
              <Stack spacing={0}>
                <Flex textAlign="left" align="center" gap={1}>
                  <Avatar src={status.picture_url} boxSize="18px" />
                  {status.time && (
                    <Text fontSize="12px">{formatTime(status.time)}まで</Text>
                  )}
                  <Box
                    fontSize="11px"
                    bg={getActivityColor(status.activity)}
                    px={0.5}
                    borderRadius="4px"
                    color="#FFF"
                  >
                    {getActivityLabel(status.activity)}
                  </Box>
                </Flex>
                <Text fontSize="10px" color="gray.500" mt={0} textAlign="right">
                  {new Date(status.created_at).toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Text>
              </Stack>
            </Box>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
};

// ステータス更新用コンポーネント
export const NowStatus = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const { language } = useLanguage();
  const [status, setStatus] = useState({
    date: new Date(),
    time: null as string | null,
    activity: null as string | null,
    note: "",
    picture_url: "",
    customActivity: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const { pictureUrl } = useUserData(userId || "");

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

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    const time = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
    return { value: time, label: time };
  });

  const handleSubmit = async () => {
    if (!userId || !pictureUrl || !status.activity) return;
    const selectedDate = status.date;
    let timestamp: string | null = null;
    if (status.time) {
      // 時間が選択されている場合
      const [hours, minutes] = status.time.split(":").map(Number);
      timestamp = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        minutes
      ).toISOString();
    }

    const { error } = await supabase.from("admin_status").upsert({
      user_id: userId,
      time: timestamp,
      activity:
        status.activity === "other" ? status.customActivity : status.activity,
      note: status.note,
      picture_url: pictureUrl,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error updating status:", error);
    } else {
      onClose();
      setStatus({
        date: new Date(),
        time: null,
        activity: null,
        note: "",
        picture_url: "",
        customActivity: "",
      });
    }
  };

  return (
    <Box
      display={{
        base: "block",
        sm: "block",
        md: "block",
        lg: "block",
        xl: "block",
        "2xl": "block",
        "3xl": "block",
      }}
      bg="white.200"
      p="0"
      right="8px"
      textAlign="left"
      zIndex="1100"
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
          ja: "管理者の状態更新",
          us: "Admin status update",
          cn: "管理员状态更新。",
          language,
        })}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {getMessage({
              ja: "管理者の状態更新",
              us: "Admin status update",
              cn: "管理员状态更新。",
              language,
            })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>日付</FormLabel>
                <DatePicker
                  selected={status.date}
                  onChange={(date) =>
                    setStatus({ ...status, date: date || new Date() })
                  }
                  dateFormat="yyyy/MM/dd"
                  customInput={
                    <Input
                      bg={colorMode === "light" ? "white" : "gray.700"}
                      color={colorMode === "light" ? "black" : "white"}
                      borderColor={
                        colorMode === "light" ? "gray.200" : "gray.600"
                      }
                      _hover={{ borderColor: "blue.500" }}
                      _focus={{ borderColor: "blue.500" }}
                    />
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>時間</FormLabel>
                <Select
                  value={status.time || ""}
                  onChange={(e) =>
                    setStatus({ ...status, time: e.target.value })
                  }
                  placeholder="時間を選択"
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>活動内容</FormLabel>
                <Stack spacing={2}>
                  <Select
                    value={status.activity || ""}
                    onChange={(e) =>
                      setStatus({ ...status, activity: e.target.value })
                    }
                    placeholder="活動内容を選択"
                  >
                    {activityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {status.activity === "other" && (
                    <Input
                      value={status.customActivity}
                      onChange={(e) =>
                        setStatus({ ...status, customActivity: e.target.value })
                      }
                      placeholder="カスタム活動内容を入力"
                    />
                  )}
                </Stack>
              </FormControl>
              <FormControl>
                <FormLabel>メモ</FormLabel>
                <Textarea
                  value={status.note}
                  onChange={(e) =>
                    setStatus({ ...status, note: e.target.value })
                  }
                  placeholder="追加の詳細を入力"
                  rows={3}
                />
              </FormControl>
              <Button colorScheme="blue" onClick={handleSubmit}>
                更新
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
