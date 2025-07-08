"use client";

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ErrorLog = {
  id: number;
  created_at: string;
  fullname: string | null;
  project: string | null;
  ver: string | null;
  ip: string | null;
  err: string | null;
  description: string | null;
  procedure: string | null;
  line: string | null;
};

type AggregatedLog = {
  date: string;
  times: string[];
  project: string | null;
  ver: string | null;
  description: string | null;
  procedure: string | null;
  line: string | null;
  count: number;
};

type Props = {
  project?: string;
};

export default function ErrorLogsView({ project }: Props) {
  const { colorMode } = useColorMode();
  const [logs, setLogs] = useState<AggregatedLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      let query = supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (project) {
        query = query.eq("project", project);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching error logs:", error.message);
        setLoading(false);
        return;
      }

      const grouped = new Map<string, AggregatedLog>();

      for (const log of data as ErrorLog[]) {
        const dateObj = new Date(log.created_at);
        const dateStr = dateObj.toISOString().slice(0, 10);
        const timeStr = dateObj.toLocaleTimeString();

        const key = [
          dateStr,
          log.project,
          log.ver,
          log.description,
          log.procedure,
          log.line,
        ].join("|");

        if (!grouped.has(key)) {
          grouped.set(key, {
            date: dateStr,
            times: [timeStr],
            project: log.project,
            ver: log.ver,
            description: log.description,
            procedure: log.procedure,
            line: log.line,
            count: 1,
          });
        } else {
          const existing = grouped.get(key)!;
          existing.count++;
          existing.times.push(timeStr);
        }
      }

      setLogs(Array.from(grouped.values()));
      setLoading(false);
    };

    fetchLogs();
  }, [project]);

  return (
    <Accordion allowMultiple mt={0} borderColor="transparent" w="100%">
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton p="0" pl="7px">
              <Flex flex="1" textAlign="left" alignItems="center" fontSize="xs">
                <Box
                  fontSize={isExpanded ? "sm" : "xs"}
                  py="1px"
                  px="0"
                  transition="all 0.3s ease-in-out"
                >
                  エラーログ
                </Box>
                <AccordionIcon
                  ml={2}
                  transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
                  transition="transform 0.2s ease-in-out"
                />
              </Flex>
            </AccordionButton>
            <AccordionPanel pt={0} px={2} pb={2}>
              {loading ? (
                <Spinner />
              ) : (
                <TableContainer>
                  <Table
                    size="sm"
                    sx={{
                      th: {
                        fontSize: "12px",
                        p: "0",
                        borderBottom: "0.5px solid",
                        borderColor:
                          colorMode === "light"
                            ? "custom.theme.light.900"
                            : "custom.theme.dark.300",
                        color:
                          colorMode === "light"
                            ? "custom.theme.light.850"
                            : "custom.theme.dark.300",
                      },
                      td: {
                        fontSize: "12px",
                        py: "1",
                        px: "0",
                        border: "none",
                        borderColor:
                          colorMode === "light"
                            ? "custom.theme.light.900"
                            : "custom.theme.dark.200",
                        color:
                          colorMode === "light"
                            ? "custom.theme.light.900"
                            : "custom.theme.dark.100",
                      },
                    }}
                  >
                    <Thead>
                      <Tr>
                        <Th>日付</Th>
                        {!project && <Th>プロジェクト</Th>}
                        <Th>バージョン</Th>
                        <Th>詳細</Th>
                        <Th>プロシージャ</Th>
                        <Th>行</Th>
                        <Th isNumeric>回数</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {logs.map((log, idx) => {
                        const showDate =
                          idx === 0 || log.date !== logs[idx - 1].date;

                        return (
                          <>
                            <Tr key={idx}>
                              <Td>{showDate ? <Box>{log.date}</Box> : ""}</Td>
                              {!project && <Td>{log.project || ""}</Td>}
                              <Td>{log.ver || ""}</Td>
                              <Td>{log.description || ""}</Td>
                              <Td>{log.procedure || ""}</Td>
                              <Td>{log.line || ""}</Td>
                              <Td isNumeric>{log.count}</Td>
                            </Tr>
                            <Tr p={0}>
                              {showDate && <Td p="0 !important" />}
                              <Td colSpan={showDate ? 5 : 6} p="0 !important">
                                <Box
                                  w="100%"
                                  h="0.5px"
                                  p={0}
                                  bg={
                                    colorMode === "light"
                                      ? "custom.theme.light.900"
                                      : "custom.theme.dark.300"
                                  }
                                />
                              </Td>
                            </Tr>
                          </>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
}
