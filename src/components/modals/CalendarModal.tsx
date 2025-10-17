//src/components/modals/CalendarModal.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Stack,
  Text,
  Avatar,
  useDisclosure,
  Flex,
  useColorMode,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import "@fontsource/noto-sans-jp";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useLanguage } from "@/contexts/LanguageContext";
import { useUserContext } from "@/contexts/useUserContext";
import getMessage from "@/utils/getMessage";
import { getBoxShadow } from "@chakra-ui/react/dist/types/popper/utils";
import { AnimationImage } from "@/components/ui/CustomImage";

import {
  ProjectLists,
  getProjectOptionsColor,
} from "@/components/ui/CustomBadge";
import CustomModal from "@/components/ui/CustomModal";
import CalendarView from "@/components/CalendarView";

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
export const CalendarDisplay = ({
  externalIsOpen,
  externalOnOpen,
  externalOnClose,
  hideStatusBox = false,
}: {
  externalIsOpen?: boolean;
  externalOnOpen?: () => void;
  externalOnClose?: () => void;
  hideStatusBox?: boolean;
} = {}) => {
  const [status, setStatus] = useState<"online" | "offline" | "loading">(
    "loading"
  );
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/calendarStatus");
        const data = await res.json();
        setStatus(data.status === "online" ? "online" : "offline");
      } catch (err) {
        console.error("ステータスの取得に失敗しました", err);
        setStatus("offline");
      }
    };
    fetchStatus();
    // 例: 300秒ごとにステータスを更新する
    const interval = setInterval(fetchStatus, 300_000);
    return () => clearInterval(interval);
  }, []);

  const { colorMode } = useColorMode();
  const {
    isOpen: internalIsOpen,
    onOpen: internalOnOpen,
    onClose: internalOnClose,
  } = useDisclosure();

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const onOpen = externalOnOpen || internalOnOpen;
  const onClose = externalOnClose || internalOnClose;

  return (
    <>
      {!hideStatusBox && (
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
          right="4px"
          borderRadius="md"
        >
          <Stack spacing={1}>
            <Box
            p={0.5}
            maxWidth="89px"
            border="1px solid"
            borderColor={
              colorMode === "light"
                ? "custom.theme.light.800"
                : "custom.theme.dark.200"
            }
            borderRadius="md"
            bgGradient={`linear(to-r, ${getActivityColor(
              status
            )}20, ${getActivityColor(status)}10)`}
            backdropFilter="blur(10px)"
            boxShadow="sm"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "md",
              transition: "all 0.2s",
              filter: "none",
            }}
            cursor="pointer"
            onClick={() => onOpen()}
            sx={{
              filter: status === "online" ? "none" : "grayscale(100%)",
              transition: "all 0.3s ease",
            }}
          >
            <Flex textAlign="left" align="center" gap={1}>
              <Avatar
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                boxSize="20px"
                borderColor=""
              />
              <Box
                p={0.5}
                maxH="20.5px"
                w="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {status === "loading" ? (
                  <Spinner size="xs" />
                ) : (
                  <Text
                    fontSize="11px"
                    fontWeight="600"
                    color={
                      colorMode === "light"
                        ? "custom.theme.light.850"
                        : "custom.theme.dark.200"
                    }
                  >
                    {status === "online" ? "オンライン" : "オフライン"}
                  </Text>
                )}
              </Box>
            </Flex>
          </Box>
        </Stack>
      </Box>
      )}
      <CustomModal
        title="日程"
        isOpen={isOpen}
        onClose={onClose}
        modalSize="2xl"
        macCloseButtonHandlers={[onClose]}
        footer={<></>}
      >
        <>
          <CalendarView />
        </>
      </CustomModal>
    </>
  );
};
