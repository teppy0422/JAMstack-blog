"use client";

import { Box, Text, VStack, HStack, Tooltip, useColorMode } from "@chakra-ui/react";
import {
  eachDayOfInterval,
  parseISO,
  startOfWeek,
  isFirstDayOfMonth,
  isSameDay,
  startOfDay,
  isMonday,
  format,
} from "date-fns";

export type ScheduleEntry = {
  id: number;
  project_id: number;
  work_date: string;
  category: string;
  description: string;
  hours: number;
  transportation_fee: number;
  user_id: string;
};

export type ScheduleProject = {
  id: number;
  name: string;
  invoice_number: string | null;
  planned_start: string | null;
  planned_end: string | null;
  hourly_rate: number;
  budget_limit: number;
};

const TAX_RATE = 0.1;

export function calcProjectAmount(
  totalHours: number,
  hourlyRate: number,
  totalTransportationFee: number = 0
) {
  const subtotal = totalHours * hourlyRate + totalTransportationFee;
  const total = Math.round(subtotal * (1 + TAX_RATE));
  return { subtotal, total };
}

const DAY_WIDTH = 14;
const HOURS_PER_DAY_WIDTH = 18;
const PX_PER_HOUR = DAY_WIDTH / HOURS_PER_DAY_WIDTH;
const MAX_BAR_WIDTH = DAY_WIDTH;

const CATEGORY_COLORS = [
  "purple.500",
  "green.400",
  "blue.400",
  "orange.400",
  "pink.400",
  "teal.400",
];

function getOffsetPixels(allDates: Date[], dateStr: string) {
  const targetDate = startOfDay(parseISO(dateStr));
  const index = allDates.findIndex((d) => isSameDay(d, targetDate));
  return index >= 0 ? index * DAY_WIDTH : 0;
}

function getWidthPixels(allDates: Date[], startStr: string, endStr: string) {
  const startLeft = getOffsetPixels(allDates, startStr);
  const endLeft = getOffsetPixels(allDates, endStr);
  return Math.max(endLeft - startLeft + DAY_WIDTH, DAY_WIDTH);
}

type CategoryBar = {
  category: string;
  totalHours: number;
  firstDate: string;
  lastDate: string;
  entries: ScheduleEntry[];
};

function buildCategoryBars(entries: ScheduleEntry[]): CategoryBar[] {
  const byCategory = new Map<string, ScheduleEntry[]>();
  for (const e of entries) {
    const list = byCategory.get(e.category) || [];
    list.push(e);
    byCategory.set(e.category, list);
  }
  return Array.from(byCategory.entries()).map(([category, list]) => {
    const dates = list.map((e) => e.work_date).sort();
    return {
      category,
      totalHours: list.reduce((sum, e) => sum + Number(e.hours), 0),
      firstDate: dates[0],
      lastDate: dates[dates.length - 1],
      entries: list,
    };
  });
}

export default function GanttSummary({
  projects,
  entries,
  showBudget = false,
}: {
  projects: ScheduleProject[];
  entries: ScheduleEntry[];
  showBudget?: boolean;
}) {
  const { colorMode } = useColorMode();
  const color =
    colorMode === "light" ? "custom.theme.light.900" : "custom.theme.dark.100";

  const projectsWithData = projects.filter(
    (p) =>
      entries.some((e) => e.project_id === p.id) ||
      (p.planned_start && p.planned_end)
  );

  if (projectsWithData.length === 0) {
    return (
      <Box py={6} textAlign="center" fontSize="13px" color="gray.500">
        まだ予定・実績データがありません
      </Box>
    );
  }

  const allEntryDates = entries.map((e) => parseISO(e.work_date));
  const allPlannedDates = projectsWithData.flatMap((p) =>
    p.planned_start && p.planned_end
      ? [parseISO(p.planned_start), parseISO(p.planned_end)]
      : []
  );
  const allKnownDates = [...allEntryDates, ...allPlannedDates];

  const rangeStart = startOfWeek(
    new Date(Math.min(...allKnownDates.map((d) => d.getTime())))
  );
  const rangeEndRaw = new Date(Math.max(...allKnownDates.map((d) => d.getTime())));
  const rangeEnd = new Date(rangeEndRaw.getTime() + 1000 * 60 * 60 * 24 * 3);

  const allDates = eachDayOfInterval({
    start: startOfDay(rangeStart),
    end: startOfDay(rangeEnd),
  });
  const totalWidth = allDates.length * DAY_WIDTH;

  return (
    <Box
      overflowX="auto"
      w="100%"
      sx={{
        "&::-webkit-scrollbar": {
          height: "2px",
        },
      }}
    >
      <HStack pb={2} spacing={4} fontSize="11px" color={color}>
        <HStack spacing="4px">
          <Box w="20px" h="10px" bg="gray.400" opacity={0.6} borderRadius="sm" />
          <Text>予定期間</Text>
        </HStack>
        <HStack spacing="4px">
          <Box w="20px" h="10px" bg="purple.500" borderRadius="sm" />
          <Text>実績（カテゴリ別工数）</Text>
        </HStack>
      </HStack>
      <Box position="relative" w={`${totalWidth}px`} minW="100%">
        {/* 月ラベル */}
        <Box position="relative" h="20px">
          {allDates.map((date, idx) => {
            const isMonthStart = isFirstDayOfMonth(date);
            if (idx !== 0 && !isMonthStart) return null;
            const left = getOffsetPixels(allDates, format(date, "yyyy-MM-dd"));
            return (
              <Box
                key={idx}
                position="absolute"
                left={`${left}px`}
                fontSize="xs"
                fontWeight="600"
                color={color}
                whiteSpace="nowrap"
              >
                {idx === 0 ? format(date, "yyyy年M月d日") : format(date, "M月")}
              </Box>
            );
          })}
        </Box>

        {/* 今日マーカー */}
        {(() => {
          const todayStr = format(new Date(), "yyyy-MM-dd");
          const isTodayInRange = allDates.some(
            (d) => format(d, "yyyy-MM-dd") === todayStr
          );
          if (!isTodayInRange) return null;
          const left = getOffsetPixels(allDates, todayStr);
          return (
            <Box
              position="absolute"
              top="20px"
              left={`${left}px`}
              width={`${DAY_WIDTH}px`}
              h="4px"
              bg="red.400"
            />
          );
        })()}

        {/* グリッド背景（VStackと同じセルに重ねて高さを自動追従させる） */}
        <Box display="grid" gridTemplateAreas="'stack'" w="100%">
          <HStack
            spacing={0}
            gridArea="stack"
            alignSelf="stretch"
            h="100%"
            zIndex={0}
          >
            {allDates.map((date, idx) => {
              const dayOfWeek = date.getDay();
              const isMonthStart = isFirstDayOfMonth(date);
              let bgColor = "transparent";
              if (dayOfWeek === 0) bgColor = "#F8d4d4";
              else if (dayOfWeek === 6) bgColor = "#cFdBff";

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
                  minW={`${DAY_WIDTH}px`}
                  h="100%"
                  borderLeft={isMonthStart ? "1.5px solid" : "1px solid"}
                  borderLeftColor={blc}
                  bg={bgColor}
                />
              );
            })}
          </HStack>

          <VStack
            align="stretch"
            spacing={0}
            gridArea="stack"
            zIndex={1}
            pt="6px"
          >
            {/* 月曜の日付ラベル */}
            <Box position="relative" h="16px">
              {allDates.map((date, idx) => {
                if (!isMonday(date)) return null;
                const left = getOffsetPixels(allDates, format(date, "yyyy-MM-dd"));
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
              })}
            </Box>
            {projectsWithData.map((project) => {
              const projectEntries = entries.filter((e) => e.project_id === project.id);
              const bars = buildCategoryBars(projectEntries);
              const hasPlan = !!(project.planned_start && project.planned_end);
              const totalHours = projectEntries.reduce(
                (sum, e) => sum + Number(e.hours),
                0
              );
              const totalTransportationFee = projectEntries.reduce(
                (sum, e) => sum + Number(e.transportation_fee || 0),
                0
              );
              const { total: totalAmount } = calcProjectAmount(
                totalHours,
                project.hourly_rate,
                totalTransportationFee
              );
              const budgetRatio =
                project.budget_limit > 0 ? totalAmount / project.budget_limit : 0;
              const budgetColor =
                budgetRatio >= 1
                  ? "red.500"
                  : budgetRatio >= 0.8
                  ? "orange.400"
                  : "green.500";

              return (
                <Box key={project.id} mb="10px">
                  <HStack spacing={2} mb="4px" position="sticky" left="1px" zIndex={2}>
                    <Text
                      fontSize="13px"
                      fontWeight="700"
                      px="4px"
                      py="2px"
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
                      {project.invoice_number && (
                        <Text as="span" fontWeight="400" opacity={0.7} mr="4px">
                          {project.invoice_number}
                        </Text>
                      )}
                      {project.name}
                    </Text>
                    {showBudget && (
                      <Tooltip
                        hasArrow
                        label={`実績${totalHours}H × ${project.hourly_rate}円/H（税抜）＋交通費${totalTransportationFee.toLocaleString()}円＝税込 ${totalAmount.toLocaleString()}円 ／ 上限 ${project.budget_limit.toLocaleString()}円`}
                      >
                        <Text
                          fontSize="12px"
                          fontWeight="700"
                          color="white"
                          bg={budgetColor}
                          px="6px"
                          py="1px"
                          borderRadius="sm"
                          whiteSpace="nowrap"
                        >
                          ¥{totalAmount.toLocaleString()} / ¥
                          {project.budget_limit.toLocaleString()}
                        </Text>
                      </Tooltip>
                    )}
                  </HStack>
                  {hasPlan && (
                    <Box position="relative" h="16px">
                      <Tooltip
                        hasArrow
                        label={`予定：${project.planned_start}〜${project.planned_end}`}
                      >
                        <Box
                          position="absolute"
                          left={`${getOffsetPixels(allDates, project.planned_start!)}px`}
                          width={`${getWidthPixels(
                            allDates,
                            project.planned_start!,
                            project.planned_end!
                          )}px`}
                          top="0px"
                          height="10px"
                          bg="gray.400"
                          opacity={0.6}
                          borderRadius="sm"
                        />
                      </Tooltip>
                    </Box>
                  )}
                  <VStack align="stretch" spacing={0}>
                    {bars.map((bar, idx) => {
                      const barColor = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

                      const labelLeft = getOffsetPixels(allDates, bar.firstDate);

                      return (
                        <Box key={bar.category}>
                          <Box position="relative" h="14px">
                            <Text
                              position="absolute"
                              left={`${labelLeft + 2}px`}
                              display="inline-block"
                              fontSize="11px"
                              color={color}
                              bg={
                                colorMode === "light"
                                  ? "custom.theme.light.500"
                                  : "custom.theme.dark.900"
                              }
                              pl="0"
                              pr="2px"
                              whiteSpace="nowrap"
                            >
                              {bar.category}（{bar.totalHours}H）
                            </Text>
                          </Box>
                          <Box position="relative" h="14px">
                            {bar.entries.map((entry) => {
                              const left = getOffsetPixels(allDates, entry.work_date);
                              const width = Math.min(
                                Math.max(Number(entry.hours) * PX_PER_HOUR, 4),
                                MAX_BAR_WIDTH
                              );
                              return (
                                <Tooltip
                                  key={entry.id}
                                  hasArrow
                                  label={`${bar.category}：${entry.work_date}（${entry.hours}H）${entry.description}${
                                    Number(entry.transportation_fee) > 0
                                      ? `／交通費${Number(entry.transportation_fee).toLocaleString()}円`
                                      : ""
                                  }`}
                                >
                                  <Box
                                    position="absolute"
                                    left={`${left + 1}px`}
                                    width={`${width}px`}
                                    top="0px"
                                    height="14px"
                                    bg={barColor}
                                    borderRadius="sm"
                                  />
                                </Tooltip>
                              );
                            })}
                          </Box>
                        </Box>
                      );
                    })}
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
