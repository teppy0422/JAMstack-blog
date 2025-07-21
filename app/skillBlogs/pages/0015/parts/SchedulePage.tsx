import {
  Box,
  Text,
  VStack,
  HStack,
  Tooltip,
  Badge,
  Checkbox,
  useColorMode,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

import {
  eachDayOfInterval,
  parseISO,
  startOfWeek,
  isSunday,
  format,
  isFirstDayOfMonth,
  isSameDay,
  startOfDay,
  differenceInCalendarDays,
  addDays,
  isMonday,
} from "date-fns";

// プロジェクトの期間設定
const projectStart = startOfDay(parseISO("2025-07-11"));
const projectEnd = startOfDay(parseISO("2025-09-30"));

// allDates は local の 0時基準にしておく
const allDates = eachDayOfInterval({
  start: startOfDay(projectStart),
  end: startOfDay(projectEnd),
});
// ステップと詳細データ
const steps = [
  {
    title: "1.アプリ作成",
    details: [
      {
        title: "開発環境の準備",
        plannedStart: "2025-07-11",
        plannedEnd: "2025-07-17",
        actualStart: "2025-07-11",
        actualEnd: "2025-07-14",
      },
      {
        title: "アプリの作成/動作テスト",
        plannedStart: "2025-07-18",
        plannedEnd: "2025-07-27",
        actualStart: "2025-07-15",
      },
      {
        title: "実機での動作テスト",
        plannedStart: "2025-07-28",
        plannedEnd: "2025-08-03",
      },
      {
        title: "本番環境での動作テスト",
        plannedStart: "2025-08-04",
        plannedEnd: "2025-08-08",
      },
      {
        title: "追加/修正",
        plannedStart: "2025-08-09",
        plannedEnd: "2025-08-24",
      },
      {
        title: "不具合時の対応資料の作成",
        plannedStart: "2025-08-25",
        plannedEnd: "2025-08-31",
      },
      {
        title: "設置",
        plannedStart: "2025-09-01",
        plannedEnd: "2025-09-05",
      },
      {
        title: "運用テスト",
        plannedStart: "2025-09-08",
        plannedEnd: "2025-09-12",
      },
      {
        title: "運用開始(予備日)",
        plannedStart: "2025-09-15",
        plannedEnd: "2025-09-30",
      },
    ],
  },
  {
    title: "2.購入",
    details: [
      {
        title: "各1台分",
        plannedStart: "2025-07-21",
        plannedEnd: "2025-07-27",
      },
      {
        title: "残り必要台数分",
        plannedStart: "2025-08-25",
        plannedEnd: "2025-08-31",
      },
    ],
  },
  {
    title: "3.四国部品",
    details: [
      {
        title: "機材借用とデータ運用の相談/データ入手",
        plannedStart: "2025-07-21",
        plannedEnd: "2025-07-25",
      },
    ],
  },
];
const holidayRanges = [
  {
    start: "2025-08-09",
    end: "2025-08-17",
    label: "お盆休み",
  },
];
// 日数差の計算（マイナス防止）
function getDaysBetween(startStr: string, endStr: string) {
  const start = startOfDay(parseISO(startStr));
  const end = addDays(startOfDay(parseISO(endStr)), 1);
  return differenceInCalendarDays(end, start); // 誤差なくカレンダー日数
}

// 開始位置の％取得
function getOffsetPercent(dateStr: string) {
  const targetDate = startOfDay(parseISO(dateStr)); // ISOからローカル0時へ
  const index = allDates.findIndex((d) => isSameDay(d, targetDate));
  return (index / allDates.length) * 100;
}

// 幅の％取得
function getWidthPercent(startStr: string, endStr: string) {
  return (getDaysBetween(startStr, endStr) / allDates.length) * 100;
}

export default function ScheduleWithGrid() {
  const { colorMode } = useColorMode();
  const resultantColor = "purple.500";
  const scheduleColor = "gray.400";
  const inProcessColor = "green.400";
  const specialColor = "#F97316";

  const color =
    colorMode === "light" ? "custom.theme.light.900" : "custom.theme.dark.100";
  return (
    <Box py={0}>
      {/* ラベルの説明 */}
      <Box pt={2} pb={5} display="flex" alignItems="center" gap={1}>
        <Box bg={scheduleColor} w="30px" h="6px" />
        <Box fontSize="12px">予定</Box>
        <Box bg={resultantColor} w="30px" h="6px" />
        <Box fontSize="12px">完了済み</Box>
        <Box bg={inProcessColor} w="30px" h="6px" />
        <Box fontSize="12px">取組中</Box>
      </Box>

      {/* グリッド全体 */}
      <Box
        position="relative"
        w="100%"
        h="100%"
        borderRight="1px solid"
        borderRightColor={
          colorMode === "light"
            ? "custom.theme.light.600"
            : "custom.theme.dark.400"
        }
      >
        {/* 月表示（上部ラベル） */}
        <Box position="relative" h="0px">
          {allDates.map((date, idx) => {
            const isMonthStart = isFirstDayOfMonth(date);
            const leftPercent = getOffsetPercent(format(date, "yyyy-MM-dd")); // 日付文字列から計算

            return (
              <Box
                key={idx}
                position="absolute"
                top="-16px"
                left={`${leftPercent}%`}
                fontSize="xs"
                fontWeight="600"
                color={color}
                whiteSpace="nowrap"
                textAlign="left"
              >
                {idx === 0
                  ? `${format(date, "M月d日")}`
                  : isMonthStart
                  ? `${format(date, "M月")}`
                  : ""}
              </Box>
            );
          })}
        </Box>
        {/* 連休とか特別なイベント */}
        <Box position="relative" h="0px" top="-16px">
          {holidayRanges.map((holiday, idx) => {
            const left = getOffsetPercent(holiday.start);
            const width = getWidthPercent(holiday.start, holiday.end);

            return (
              <Box
                key={idx}
                position="absolute"
                zIndex={100}
                left={`${left}%`}
                width={`${width}%`}
                alignItems="center"
                textAlign="center"
                justifyContent="center"
                fontSize="11px"
                color={specialColor}
                fontWeight="bold"
                px="4px"
                borderBottom="2px solid"
                borderBottomColor={specialColor}
              >
                {holiday.label}
              </Box>
            );
          })}
        </Box>
        {/* グリッド背景 */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={0}
          mt="0px"
        >
          <HStack spacing={0} h="100%">
            {allDates.map((date, idx) => {
              const isMonthStart = isFirstDayOfMonth(date);
              const isWeekStart =
                startOfWeek(date).getDate() === date.getDate();
              const isToday =
                format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              const dayOfWeek = date.getDay(); // 0 = 日曜, 6 = 土曜

              let bgColor = "transparent";
              if (dayOfWeek === 0) {
                bgColor = "#F8d4d4"; // 日曜
              } else if (dayOfWeek === 6) {
                bgColor = "#cFdBff"; // 土曜
              }
              let blc =
                colorMode === "light"
                  ? "custom.theme.light.600"
                  : "custom.theme.dark.400";
              if (isMonthStart) {
                blc =
                  colorMode === "light"
                    ? "custom.theme.light.850"
                    : "custom.theme.dark.300";
              } else if (dayOfWeek === 1) {
                blc = "custom.theme.light.800";
              }

              return (
                <Box
                  key={idx}
                  flex="1"
                  height="100%"
                  borderLeft={isMonthStart ? "1.5px solid " : "1px solid"}
                  borderLeftColor={blc && blc}
                  bg={bgColor}
                  borderTop={isToday ? "2px solid" : ""}
                  borderTopColor={isToday ? "custom.theme.light.800" : ""}
                  borderBottom={isToday ? "2px solid" : ""}
                  borderBottomColor={isToday ? "custom.theme.light.800" : ""}
                  backgroundImage={
                    isToday
                      ? `
                    repeating-linear-gradient(
                      45deg,
                      rgba(0, 0, 0, 0.5) 0.5px,
                      rgba(0, 0, 0, 0.5) 0.5px,
                      transparent 0px,
                      transparent 0px
                    ),
                    repeating-linear-gradient(
                      135deg,
                      rgba(0, 0, 0, 0.5) 0.5px,
                      rgba(0, 0, 0, 0.5) 0.5px,
                      transparent 2px,
                      transparent 3px
                    )
                  `
                      : ""
                  }
                  backgroundSize="10px 10px"
                  backgroundBlendMode="multiply"
                />
              );
            })}
          </HStack>
        </Box>

        {/* スケジュール表示本体 */}
        <VStack
          align="stretch"
          spacing={0}
          position="relative"
          zIndex={1}
          pt="0px"
        >
          {/* 月曜の日付（祝日でない） */}
          <Box position="relative" h="16px">
            {allDates.map((date, idx) => {
              const formattedDate = format(date, "yyyy-MM-dd");
              const left = getOffsetPercent(format(date, "yyyy-MM-dd"));
              const holidayStartDates = holidayRanges.map((h) =>
                format(new Date(h.start), "yyyy-MM-dd")
              );
              if (
                !holidayStartDates.includes(formattedDate) &&
                isMonday(date)
              ) {
                return (
                  <Box
                    key={`monday-label-${idx}`}
                    position="absolute"
                    left={`${left}%`}
                    fontSize="11px"
                    fontWeight="bold"
                    color={color}
                    pl="2px"
                  >
                    {format(date, "M/d")}
                  </Box>
                );
              }
              return null;
            })}
          </Box>
          {steps.map((step, stepIdx) => (
            <>
              <Box
                width="100%"
                h="1px"
                bg={
                  colorMode === "light"
                    ? "custom.theme.light.800"
                    : "custom.theme.dark.100"
                }
              />
              <Box key={stepIdx}>
                <Text
                  fontSize="14px"
                  fontWeight="600"
                  px="1px"
                  mb="16px"
                  ml="1px"
                  lineHeight="1.2"
                  bg={
                    colorMode === "light"
                      ? "custom.theme.light.500"
                      : "custom.theme.dark.800"
                  }
                  display="inline-block"
                  border="1px solid"
                  borderColor={
                    colorMode === "light"
                      ? "custom.theme.light.850"
                      : "custom.theme.dark.100"
                  }
                  borderRadius="sm"
                >
                  {step.title}
                </Text>
                <VStack align="stretch" spacing={0}>
                  {step.details.map((detail, idx) => {
                    const today = new Date();
                    const actualStart = detail.actualStart
                      ? parseISO(detail.actualStart)
                      : null;

                    const actualEnd = detail.actualEnd
                      ? parseISO(detail.actualEnd)
                      : actualStart && actualStart <= today
                      ? today
                      : actualStart;

                    const actualEndStr = actualEnd
                      ? format(actualEnd, "yyyy-MM-dd")
                      : undefined;

                    const isInProgress =
                      !detail.actualEnd && actualStart && actualStart <= today;
                    // 完了の判断
                    const isCompleted = !!detail.actualEnd;

                    return (
                      <Box key={idx} position="relative" w="100%" h="30px">
                        {/* タイトル */}
                        <Box
                          position="absolute"
                          top="-16px"
                          left={`calc(${getOffsetPercent(
                            detail.plannedStart
                          )}% + 1px)`}
                          display="flex"
                          alignItems="center"
                          zIndex={2}
                        >
                          <Box
                            h="1em"
                            w="2px"
                            bg={
                              isInProgress
                                ? inProcessColor
                                : isCompleted
                                ? resultantColor
                                : scheduleColor
                            }
                          />
                          <Text
                            fontWeight="medium"
                            bg={
                              colorMode === "light"
                                ? "custom.theme.light.500"
                                : "custom.theme.dark.900"
                            }
                            fontSize="14px"
                            lineHeight="1.1"
                            px="1px"
                          >
                            {detail.title}
                          </Text>
                          {isCompleted && (
                            <CheckCircleIcon
                              color={resultantColor}
                              boxSize={3}
                              mt="1px"
                              ml="2px"
                            />
                          )}
                        </Box>

                        {/* バーとバッジ */}
                        <HStack position="absolute" left="0" right="0">
                          {/* 予定バー */}
                          <Tooltip
                            label={`予定: ${detail.plannedStart}〜${detail.plannedEnd}`}
                            hasArrow
                          >
                            <Box
                              position="absolute"
                              left={`${getOffsetPercent(detail.plannedStart)}%`}
                              width={`${getWidthPercent(
                                detail.plannedStart,
                                detail.plannedEnd
                              )}%`}
                              top="0px"
                              height="6px"
                              bg={scheduleColor}
                              zIndex={1}
                            />
                          </Tooltip>
                          {/* 実績バー */}
                          {actualStart && actualEndStr && (
                            <Tooltip
                              label={`実績: ${detail.actualStart}〜${
                                detail.actualEnd || "今日"
                              }`}
                              hasArrow
                            >
                              <Box
                                position="absolute"
                                left={`${getOffsetPercent(
                                  String(detail.actualStart)
                                )}%`}
                                width={`${getWidthPercent(
                                  String(detail.actualStart),
                                  actualEndStr
                                )}%`}
                                top="6px"
                                height="6px"
                                bg={
                                  isInProgress ? inProcessColor : resultantColor
                                } // ← ここで色を動的に
                                borderRadius="0px"
                                zIndex={1}
                              />
                            </Tooltip>
                          )}
                        </HStack>
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            </>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
