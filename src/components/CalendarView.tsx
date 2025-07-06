// components/CalendarView.tsx
"use client";

import {
  ChakraProvider,
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
  SimpleGrid,
  Flex,
  Checkbox,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID!;
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY!;

interface Event {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  description?: string;
}

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix: (number | null)[][] = [];
  let week: (number | null)[] = [];

  let startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  for (let i = 0; i < startDay; i++) week.push(null);

  for (let date = 1; date <= lastDay.getDate(); date++) {
    week.push(date);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }

  return matrix;
}

export default function CalendarView() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideWeekend, setHideWeekend] = useState(true);

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const { year, month } = currentDate;
  const todayStr = today.toISOString().slice(0, 10);

  const changeMonth = (offset: number) => {
    const newDate = new Date(year, month + offset, 1);
    setCurrentDate({ year: newDate.getFullYear(), month: newDate.getMonth() });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const start = new Date(year, month, 1).toISOString();
        const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`;
        const response = await fetch(url);
        const data = await response.json();
        setEvents(data.items || []);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [year, month]);

  const monthMatrix = getMonthMatrix(year, month);

  const eventsByDate: { [date: string]: Event[] } = {};
  events.forEach((event) => {
    const dateStr = event.start.dateTime || event.start.date || "";
    const date = dateStr.slice(0, 10);
    if (!eventsByDate[date]) eventsByDate[date] = [];
    eventsByDate[date].push(event);
  });

  const weekDays = ["月", "火", "水", "木", "金", "土", "日"];

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>予定を読み込み中...</Text>
      </Box>
    );
  }

  return (
    <Box p={5} bg="custom.system.800" color="custom.system.50">
      <Flex justify="center" align="center" mb={3} gap={3}>
        <Box>
          <Text fontSize="xs" cursor="pointer" onClick={() => changeMonth(-1)}>
            ← 前月
          </Text>
        </Box>
        <Heading fontSize="18px" flex="none" textAlign="center" minW="120px">
          {year}年{month + 1}月
        </Heading>
        <Box>
          <Text fontSize="xs" cursor="pointer" onClick={() => changeMonth(1)}>
            次月 →
          </Text>
        </Box>
      </Flex>
      <Checkbox
        size="sm"
        colorScheme="orange"
        isChecked={hideWeekend}
        onChange={(e) => setHideWeekend(e.target.checked)}
      >
        土日を表示しない
      </Checkbox>

      <SimpleGrid columns={hideWeekend ? 5 : 7} spacing={1} mb={0}>
        {weekDays.map((d, idx) =>
          hideWeekend && (idx === 5 || idx === 6) ? null : (
            <Box key={d} textAlign="center" fontSize="12px" fontWeight="bold">
              {d}
            </Box>
          )
        )}
      </SimpleGrid>

      <VStack spacing={1} align="stretch">
        {monthMatrix.map((week, i) => (
          <SimpleGrid columns={hideWeekend ? 5 : 7} spacing={1} key={i}>
            {week.map((date, j) => {
              if (hideWeekend && (j === 5 || j === 6)) return null;

              const dateStr =
                date !== null
                  ? `${year}-${String(month + 1).padStart(2, "0")}-${String(
                      date
                    ).padStart(2, "0")}`
                  : "";

              const isToday = dateStr === todayStr;

              // 現在時刻の「時+分/60」
              const now = new Date();
              // このセルの日付文字列 yyyy-mm-dd
              const cellDateStr = `${year}-${String(month + 1).padStart(
                2,
                "0"
              )}-${String(date).padStart(2, "0")}`;
              const cellDate = new Date(cellDateStr + "T00:00:00");
              const positionPercent =
                ((now.getHours() + now.getMinutes() / 60) / 24) * 100;

              return (
                <>
                  <Box
                    key={j}
                    minH="80px"
                    borderWidth="1px"
                    borderRadius="md"
                    p={0}
                    bg={date ? "transparent" : "custom.system.500"}
                    opacity={date ? 1 : 0}
                    position="relative"
                    borderColor={
                      isToday
                        ? "custom.theme.orange.500"
                        : "custom.theme.dark.300"
                    }
                    transition="transform 0.2s ease, box-shadow 0.2s ease"
                    role="group"
                    sx={
                      eventsByDate[dateStr]?.length
                        ? {
                            _hover: {
                              transform: "scale(1.8)",
                              transformOrigin:
                                j === 0
                                  ? "left"
                                  : j === 6 || (hideWeekend && j === 4)
                                  ? "right"
                                  : "center",
                              zIndex: 100,
                              boxShadow: "lg",
                              bg: "custom.system.800",
                            },
                          }
                        : {}
                    }
                  >
                    {isToday && (
                      <Box
                        position="absolute"
                        zIndex="1"
                        width="0.5px"
                        height="100%"
                        bg="custom.theme.orange.500"
                        left={`${positionPercent}%`}
                        opacity="0.5"
                      />
                    )}
                    {eventsByDate[dateStr]?.length && (
                      <Box
                        position="absolute"
                        left="33.3%"
                        w="36.7%"
                        h="100%"
                        // bg="custom.system.700"
                        borderStart="0.1px solid"
                        borderStartColor="custom.system.300"
                        borderEnd="0.1px solid"
                        borderEndColor="custom.system.300"
                      />
                    )}
                    <Box ml={1} fontSize="14px">
                      {date || ""}
                    </Box>
                    {date &&
                      eventsByDate[dateStr] &&
                      eventsByDate[dateStr].map((event) => {
                        const hasTime = !!event.start.dateTime;
                        let bar: React.ReactNode = null;

                        if (hasTime) {
                          const start = new Date(event.start.dateTime!);
                          const end = new Date(event.end.dateTime!);
                          const startHour =
                            start.getHours() + start.getMinutes() / 60;
                          const endHour =
                            end.getHours() + end.getMinutes() / 60;
                          const left = `${(startHour / 24) * 100}%`;
                          const width = `${
                            ((endHour - startHour) / 24) * 100
                          }%`;

                          bar = (
                            <Box
                              position="absolute"
                              top="-0.5px"
                              left={left}
                              width={width}
                              height="2px"
                              bg="custom.theme.orange.500"
                              opacity="1"
                            />
                          );
                        }

                        return (
                          <Box key={event.id} position="relative">
                            <Box
                              fontSize="10px"
                              borderTop="0.1px solid"
                              borderColor="custom.system.100"
                              textIndent="0.5em"
                              px={0}
                              py={0.5}
                              overflow="hidden"
                              whiteSpace="nowrap"
                              textOverflow="ellipsis"
                              color={
                                hasTime &&
                                new Date(event.start.dateTime!) <= new Date() &&
                                new Date() <= new Date(event.end.dateTime!)
                                  ? "custom.theme.orange.500"
                                  : undefined
                              }
                            >
                              <Tooltip
                                label={
                                  <Box fontSize="xs" whiteSpace="pre-line">
                                    <Text fontWeight="bold">
                                      {event.summary}
                                    </Text>
                                    {event.start.dateTime &&
                                    event.end.dateTime ? (
                                      <Text>
                                        {format(
                                          new Date(event.start.dateTime),
                                          "HH:mm"
                                        )}{" "}
                                        -{" "}
                                        {format(
                                          new Date(event.end.dateTime),
                                          "HH:mm"
                                        )}
                                      </Text>
                                    ) : (
                                      <Text>終日</Text>
                                    )}
                                    {event.description && (
                                      <Text fontSize="11px">
                                        {event.description}
                                      </Text>
                                    )}
                                  </Box>
                                }
                                bg="custom.system.600"
                                color="white"
                                placement="top"
                                openDelay={200}
                                closeOnClick={false}
                                border="0.5px solid"
                                borderColor="custom.system.50"
                              >
                                <Text
                                  _groupHover={{
                                    fontSize: "6px",
                                    transformOrigin: "top left",
                                  }}
                                  textAlign="left"
                                  overflow="hidden"
                                  whiteSpace="nowrap"
                                  textOverflow="ellipsis"
                                  cursor="pointer"
                                >
                                  {event.summary}
                                </Text>
                              </Tooltip>
                              <Box role="group">
                                <Text
                                  display="none"
                                  fontSize="5.5px"
                                  _groupHover={{
                                    display: "block",
                                  }}
                                >
                                  {event.start.dateTime &&
                                  event.end.dateTime ? (
                                    <Text>
                                      {format(
                                        new Date(event.start.dateTime),
                                        "HH:mm"
                                      )}{" "}
                                      -{" "}
                                      {format(
                                        new Date(event.end.dateTime),
                                        "HH:mm"
                                      )}
                                    </Text>
                                  ) : (
                                    <Text>終日</Text>
                                  )}
                                </Text>
                              </Box>
                            </Box>
                            {bar}
                          </Box>
                        );
                      })}
                  </Box>
                </>
              );
            })}
          </SimpleGrid>
        ))}
      </VStack>
    </Box>
  );
}
