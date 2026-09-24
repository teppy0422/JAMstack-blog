"use client";

import { Box, Text, VStack, HStack, Tooltip, useColorMode } from "@chakra-ui/react";
import {
  eachDayOfInterval,
  parseISO,
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
  invoice_id: number | null;
};

export type ScheduleProject = {
  id: number;
  name: string;
  invoice_number: string | null;
  client_name: string | null;
  delivery_place: string | null;
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

const FIXED_CATEGORY_COLORS: Record<string, string> = {
  工場内: "purple.500",
  自宅: "green.400",
};
const FALLBACK_CATEGORY_COLORS = [
  "blue.400",
  "orange.400",
  "pink.400",
  "teal.400",
];

function getCategoryColor(category: string, fallbackIndex: number) {
  return (
    FIXED_CATEGORY_COLORS[category] ??
    FALLBACK_CATEGORY_COLORS[fallbackIndex % FALLBACK_CATEGORY_COLORS.length]
  );
}

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
  const allPlannedStartDates = projectsWithData
    .filter((p) => p.planned_start)
    .map((p) => parseISO(p.planned_start!));
  const allPlannedDates = projectsWithData.flatMap((p) =>
    p.planned_start && p.planned_end
      ? [parseISO(p.planned_start), parseISO(p.planned_end)]
      : []
  );
  const allKnownDates = [...allEntryDates, ...allPlannedDates];

  const rangeStartBasisDates =
    allPlannedStartDates.length > 0 ? allPlannedStartDates : allEntryDates;
  const rangeStart = startOfDay(
    new Date(Math.min(...rangeStartBasisDates.map((d) => d.getTime())))
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
      <HStack
        pb={2}
        spacing={4}
        fontSize="11px"
        color={color}
        position="sticky"
        left="0px"
        w="fit-content"
      >
        <HStack spacing="4px">
          <Box w="20px" h="10px" bg="gray.400" opacity={0.6} borderRadius="sm" />
          <Text>予定期間</Text>
        </HStack>
        <HStack spacing="4px">
          <Box w="20px" h="10px" bg={FIXED_CATEGORY_COLORS["工場内"]} borderRadius="sm" />
          <Text>工場内</Text>
        </HStack>
        <HStack spacing="4px">
          <Box w="20px" h="10px" bg={FIXED_CATEGORY_COLORS["自宅"]} borderRadius="sm" />
          <Text>自宅</Text>
        </HStack>
      </HStack>
      <Box position="relative" w={`${totalWidth}px`} minW="100%">
        {/* 年ラベル */}
        <Box position="relative" h="16px">
          {allDates.map((date, idx) => {
            const isYearStart = idx === 0 || isFirstDayOfMonth(date) && format(date, "M") === "1";
            if (!isYearStart) return null;
            const left = getOffsetPixels(allDates, format(date, "yyyy-MM-dd"));
            return (
              <Box
                key={idx}
                position="absolute"
                left={`${left}px`}
                fontSize="xs"
                fontWeight="700"
                color={color}
                whiteSpace="nowrap"
              >
                {format(date, "yyyy年")}
              </Box>
            );
          })}
        </Box>

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
                {idx === 0 ? format(date, "M月d日") : format(date, "M月")}
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
              top="32px"
              left={`${left}px`}
              width={`${DAY_WIDTH}px`}
              h="4px"
              bg="red.400"
              zIndex={1}
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

              const projectLabelLeft = hasPlan
                ? getOffsetPixels(allDates, project.planned_start!)
                : projectEntries.length > 0
                ? getOffsetPixels(
                    allDates,
                    [...projectEntries].sort((a, b) =>
                      a.work_date.localeCompare(b.work_date)
                    )[0].work_date
                  )
                : 0;

              return (
                <Box key={project.id} mb="10px">
                  <Box position="relative" h="22px" mb="4px">
                    <HStack
                      spacing={2}
                      position="sticky"
                      left="0px"
                      w="fit-content"
                      ml={`${projectLabelLeft}px`}
                      zIndex={2}
                    >
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
                        whiteSpace="nowrap"
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
                            ¥{totalAmount.toLocaleString()}
                          </Text>
                        </Tooltip>
                      )}
                    </HStack>
                  </Box>
                  {hasPlan && (
                    <Box position="relative" h="10px">
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
                      const fallbackIndex = bars
                        .slice(0, idx)
                        .filter((b) => !FIXED_CATEGORY_COLORS[b.category]).length;
                      const barColor = getCategoryColor(bar.category, fallbackIndex);

                      const barRight = Math.max(
                        ...bar.entries.map((entry) => {
                          const left = getOffsetPixels(allDates, entry.work_date);
                          const width = Math.min(
                            Math.max(Number(entry.hours) * PX_PER_HOUR, 4),
                            MAX_BAR_WIDTH
                          );
                          return left + 1 + width;
                        })
                      );
                      const barLeft = Math.min(
                        ...bar.entries.map((entry) =>
                          getOffsetPixels(allDates, entry.work_date)
                        )
                      );

                      return (
                        <Box key={bar.category} position="relative" h="14px">
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
                          <Box
                            position="absolute"
                            left={`${barLeft}px`}
                            right="0px"
                            top="0px"
                            h="14px"
                            pointerEvents="none"
                          >
                            <Box
                              position="sticky"
                              left="0px"
                              w="4px"
                              h="14px"
                              display="flex"
                              alignItems="center"
                              zIndex={2}
                            >
                              <Box
                                w="4px"
                                h="10px"
                                bg={barColor}
                                borderRadius="sm"
                                flexShrink={0}
                              />
                            </Box>
                          </Box>
                          <Box
                            position="absolute"
                            left={`${barRight + 2}px`}
                            right="0px"
                            top="0px"
                            h="14px"
                            pointerEvents="none"
                          >
                            <Box
                              position="sticky"
                              left="7px"
                              w="fit-content"
                              h="14px"
                              display="flex"
                              alignItems="center"
                              zIndex={2}
                            >
                              <Text
                                fontSize="11px"
                                color={color}
                                whiteSpace="nowrap"
                                lineHeight="1"
                              >
                                {bar.totalHours}H
                              </Text>
                            </Box>
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
