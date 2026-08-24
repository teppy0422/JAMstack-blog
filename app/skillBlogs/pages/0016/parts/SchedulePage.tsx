import { useState, useRef } from "react";
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
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";

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
import { delay } from "lodash";

// プロジェクトの期間設定
const projectStart = startOfDay(parseISO("2025-07-11"));
const projectEnd = startOfDay(parseISO("2025-12-31"));

// allDates は local の 0時基準にしておく
const allDates = eachDayOfInterval({
  start: startOfDay(projectStart),
  end: startOfDay(projectEnd),
});

// 固定幅設定
const DAY_WIDTH = 10; // 1日あたり20px
const totalWidth = allDates.length * DAY_WIDTH;

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
        title: "アプリ初期開発",
        plannedStart: "2025-07-21",
        plannedEnd: "2025-07-25",
        actualStart: "2025-07-15",
        actualEnd: "2025-08-01",
      },
      {
        title: "入力機器の動作確認",
        plannedStart: "2025-07-28",
        plannedEnd: "2025-08-01",
        actualStart: "2025-08-04",
        actualEnd: "2025-08-08",
      },
      {
        title: "電子回路開発",
        plannedStart: "2025-08-04",
        plannedEnd: "2025-08-08",
        actualStart: "2025-08-11",
        actualEnd: "2025-08-15",
      },
      {
        title: "作業実績の保存と出力",
        plannedStart: "2025-08-11",
        plannedEnd: "2025-08-15",
        actualStart: "2025-08-18",
        actualEnd: "2025-08-22",
      },
      {
        title: "本番環境の構成に変更",
        plannedStart: "2025-08-18",
        plannedEnd: "2025-08-22",
        actualStart: "2025-08-25",
        actualEnd: "2025-09-05",
      },
      {
        title: "データの整合確認",
        plannedStart: "2025-08-25",
        plannedEnd: "2025-09-05",
        actualStart: "2025-09-08",
      },
      {
        title: "圧着カウント機器をプレスに装着テスト",
        plannedStart: "2025-09-08",
        plannedEnd: "2025-09-12",
      },
      {
        title: "CFMの自動切替",
        plannedStart: "2025-09-15",
        plannedEnd: "2025-09-26",
      },
      {
        title: "規格表の自動取得テスト",
        plannedStart: "2025-09-29",
        plannedEnd: "2025-10-10",
      },
      {
        title: "1台設置",
        plannedStart: "2025-10-13",
        plannedEnd: "2025-10-17",
      },
      {
        title: "運用テスト(現場意見で修正)",
        plannedStart: "2025-10-20",
        plannedEnd: "2025-11-14",
      },
      {
        title: "運用開始",
        plannedStart: "2025-11-17",
        plannedEnd: "2025-12-31",
      },
      {
        title: "不具合時の対応資料の作成",
        plannedStart: "2025-12-01",
        plannedEnd: "2025-12-05",
      },
      {
        title: "保守資料の作成",
        plannedStart: "2025-12-08",
        plannedEnd: "2025-12-12",
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
        actualStart: "2025-08-01",
        actualEnd: "2025-08-01",
      },
      {
        title: "残り必要台数分",
        plannedStart: "2025-11-17",
        plannedEnd: "2025-11-21",
      },
    ],
  },
  {
    title: "3.四国部品",
    details: [
      {
        title: "機材借用/既存データ入手",
        plannedStart: "2025-07-21",
        plannedEnd: "2025-07-25",
        actualStart: "2025-08-06",
        actualEnd: "2025-08-06",
      },
      {
        title: "データ運用の相談",
        plannedStart: "2025-10-06",
        plannedEnd: "2025-10-10",
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
  {
    start: "2025-12-27",
    end: "2025-12-31",
    label: "正月休み",
  },
];
// 日数差の計算（マイナス防止）
function getDaysBetween(startStr: string, endStr: string) {
  const start = startOfDay(parseISO(startStr));
  const end = addDays(startOfDay(parseISO(endStr)), 1);
  return differenceInCalendarDays(end, start); // 誤差なくカレンダー日数
}

// 開始位置のピクセル取得
function getOffsetPixels(dateStr: string) {
  const targetDate = startOfDay(parseISO(dateStr)); // ISOからローカル0時へ
  const index = allDates.findIndex((d) => isSameDay(d, targetDate));
  return index * DAY_WIDTH;
}

// 幅のピクセル取得
function getWidthPixels(startStr: string, endStr: string) {
  return getDaysBetween(startStr, endStr) * DAY_WIDTH;
}

export default function ScheduleWithGrid() {
  const { colorMode } = useColorMode();
  const resultantColor = "purple.500";
  const delayColor = "red.500";
  const scheduleColor = "gray.400";
  const inProcessColor = "green.400";
  const specialColor = "#F97316";
  const stickyColor = "blue.500"; // 固定時の色

  const color =
    colorMode === "light" ? "custom.theme.light.900" : "custom.theme.dark.100";

  // 固定されているタスクのキーを管理
  const [stickyTasks, setStickyTasks] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const taskRefs = useRef<
    Map<string, { element: HTMLElement; originalLeft: number }>
  >(new Map());

  // スクロールイベントで固定状態を監視
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const newStickyTasks = new Set<string>();

    taskRefs.current.forEach(({ element, originalLeft }, taskKey) => {
      // 要素の元の位置がスクロールで画面外になっている場合は固定状態
      if (scrollLeft > originalLeft) {
        newStickyTasks.add(taskKey);
      }
    });

    setStickyTasks(newStickyTasks);
  };

  const createTaskRef =
    (taskKey: string, originalLeft: number) => (node: HTMLElement | null) => {
      if (node) {
        taskRefs.current.set(taskKey, { element: node, originalLeft });
      } else {
        taskRefs.current.delete(taskKey);
      }
    };

  return (
    <Box py={0}>
      {/* ラベルの説明 */}
      <Box pt={2} pb={2} display="flex" alignItems="center" gap={1}>
        <Box bg={scheduleColor} w="30px" h="6px" />
        <Box fontSize="12px">予定</Box>
        <Box bg={resultantColor} w="30px" h="6px" />
        <Box fontSize="12px">完了済み</Box>
        <Box bg={inProcessColor} w="30px" h="6px" />
        <Box fontSize="12px">取組中</Box>
        <Box bg={delayColor} w="30px" h="6px" />
        <Box fontSize="12px">遅延</Box>
      </Box>

      {/* グリッド全体 */}
      <Box
        overflowX="auto"
        w="100%"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <Box
          position="relative"
          w={`${totalWidth}px`}
          minW="100%"
          h="100%"
          pt="0px"
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
              const leftPixels = getOffsetPixels(format(date, "yyyy-MM-dd")); // 日付文字列から計算
              return (
                <Box
                  key={idx}
                  position="absolute"
                  top="22px"
                  left={`${leftPixels}px`}
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
          <Box position="relative" h="0px">
            {holidayRanges.map((holiday, idx) => {
              const left = getOffsetPixels(holiday.start);
              const width = getWidthPixels(holiday.start, holiday.end);
              return (
                <Box
                  key={idx}
                  position="absolute"
                  zIndex={1000}
                  top="22px"
                  left={`${left}px`}
                  minWidth={`${width}px`}
                  display="flex"
                  alignItems="center"
                  textAlign="center"
                  justifyContent="center"
                  fontSize="11px"
                  color={specialColor}
                  fontWeight="bold"
                  px="4px"
                  borderBottom="2px solid"
                  borderBottomColor={specialColor}
                  whiteSpace="nowrap"
                >
                  {holiday.label}
                </Box>
              );
            })}
          </Box>
          {/* グリッド背景 */}
          <Box
            position="absolute"
            top="40px"
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
                  format(date, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");
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
            pt="40px"
          >
            {/* 月曜の日付（祝日でない） */}
            <Box position="relative" h="16px">
              {allDates.map((date, idx) => {
                const formattedDate = format(date, "yyyy-MM-dd");
                const left = getOffsetPixels(format(date, "yyyy-MM-dd"));
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
                      left={`${left}px`}
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
                    position="sticky"
                    left="1px"
                    zIndex={10}
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
                        !detail.actualEnd &&
                        actualStart &&
                        actualStart <= today;
                      // 完了の判断
                      const isCompleted = !!detail.actualEnd;
                      // 遅延の判断
                      const isDelay =
                        !isCompleted && parseISO(detail.plannedEnd) < today;

                      // 遅延日数の計算
                      const delayDays = isDelay
                        ? differenceInCalendarDays(
                            today,
                            parseISO(detail.plannedEnd)
                          )
                        : 0;

                      // タスクの一意のキー
                      const taskKey = `${stepIdx}-${idx}`;
                      const isSticky = stickyTasks.has(taskKey);
                      const originalLeft = getOffsetPixels(detail.plannedStart);
                      const tempColor = isInProgress
                        ? inProcessColor
                        : isDelay
                        ? delayColor
                        : resultantColor;

                      return (
                        <Box
                          key={idx}
                          position="relative"
                          w="100%"
                          h="30px"
                          mb="4px"
                        >
                          {/* タイトル */}
                          <Box
                            ref={createTaskRef(taskKey, originalLeft)}
                            position="sticky"
                            top="-16px"
                            left="1px"
                            marginLeft={`${originalLeft}px`}
                            display="flex"
                            alignItems="center"
                            zIndex={2}
                            width="fit-content"
                          >
                            <Box
                              h="1em"
                              w="3px"
                              bg={
                                isSticky
                                  ? tempColor
                                  : isInProgress
                                  ? inProcessColor
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
                            {isDelay && (
                              <>
                                <WarningIcon
                                  color={delayColor}
                                  boxSize={3}
                                  mt="1px"
                                  ml="2px"
                                />
                                <Text
                                  fontSize="11px"
                                  color={delayColor}
                                  fontWeight="bold"
                                  ml="2px"
                                >
                                  +{delayDays}日
                                </Text>
                              </>
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
                                left={`${getOffsetPixels(
                                  detail.plannedStart
                                )}px`}
                                width={`${getWidthPixels(
                                  detail.plannedStart,
                                  detail.plannedEnd
                                )}px`}
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
                                  left={`${getOffsetPixels(
                                    String(detail.actualStart)
                                  )}px`}
                                  width={`${getWidthPixels(
                                    String(detail.actualStart),
                                    actualEndStr
                                  )}px`}
                                  top="6px"
                                  height="6px"
                                  bg={
                                    isInProgress
                                      ? inProcessColor
                                      : resultantColor
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
    </Box>
  );
}
