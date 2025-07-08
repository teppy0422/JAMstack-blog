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
  Heading,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type UsageLogSummary = {
  ym: string;
  app: string;
  action: string;
  ip: string;
  count: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  app?: string; // 特定アプリ指定（省略時は全て）
  showIp?: boolean; // IP列を表示するかどうか
};

export default function UsageLogSummaryView({ app, showIp = false }: Props) {
  const { colorMode } = useColorMode();
  const [logs, setLogs] = useState<UsageLogSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      let query = supabase
        .from("usage_log_summary")
        .select("*")
        .order("ym", { ascending: false });

      if (app) {
        query = query.eq("app", app);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching logs:", error.message);
      } else {
        setLogs(data || []);
      }

      setLoading(false);
    };

    fetchLogs();
  }, [app]);

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
                  実行実績
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
                        <Th>年月</Th>
                        {!app && <Th>アプリ</Th>}
                        <Th>内容</Th>
                        {showIp && <Th>IP</Th>}
                        <Th isNumeric>回数</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {logs.map((log, idx) => {
                        const showYm = idx === 0 || log.ym !== logs[idx - 1].ym;
                        return (
                          <>
                            <Tr key={idx}>
                              <Td>{showYm ? log.ym : ""}</Td>
                              {!app && <Td>{log.app}</Td>}
                              <Td>{log.action}</Td>
                              {showIp && <Td>{log.ip}</Td>}
                              <Td isNumeric>{log.count}</Td>
                            </Tr>
                            <Tr p={0}>
                              {showYm && <Td p="0 !important" />}
                              <Td
                                colSpan={showIp ? (app ? 4 : 5) : app ? 3 : 4}
                                p="0 !important"
                              >
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
