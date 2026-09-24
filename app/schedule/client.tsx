"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorMode,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useUserContext } from "@/contexts/useUserContext";
import { supabase } from "@/utils/supabase/client";
import Content from "@/components/content";
import GanttSummary, { ScheduleEntry, ScheduleProject } from "./parts/GanttSummary";
import EntryForm from "./parts/EntryForm";
import EntryList from "./parts/EntryList";
import InvoiceTab from "./parts/InvoiceTab";
import PaymentTab from "./parts/PaymentTab";
import type { Invoice, InvoiceLineItem } from "./parts/invoiceTypes";

export default function ScheduleBlogPage() {
  const { colorMode } = useColorMode();
  const { currentUserId, currentUserCompany, isLoading } = useUserContext();
  const [projects, setProjects] = useState<ScheduleProject[]>([]);
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [lineItemsByInvoice, setLineItemsByInvoice] = useState<
    Record<number, InvoiceLineItem[]>
  >({});
  const [loadingData, setLoadingData] = useState(true);

  const isDev = currentUserCompany === "開発";

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    const [{ data: projectData }, { data: entryData }, { data: invoiceData }] =
      await Promise.all([
        supabase.from("schedule_projects").select("*").order("id"),
        supabase.from("schedule_entries").select("*").order("work_date"),
        supabase.from("invoices").select("*").order("issue_date", { ascending: false }),
      ]);
    setProjects(projectData || []);
    setEntries(entryData || []);
    setInvoices(invoiceData || []);

    if (invoiceData && invoiceData.length > 0) {
      const invoiceIds = invoiceData.map((i) => i.id);
      const { data: lineData } = await supabase
        .from("invoice_line_items")
        .select("*")
        .in("invoice_id", invoiceIds);
      const grouped: Record<number, InvoiceLineItem[]> = {};
      for (const item of lineData || []) {
        if (!grouped[item.invoice_id]) grouped[item.invoice_id] = [];
        grouped[item.invoice_id].push(item);
      }
      setLineItemsByInvoice(grouped);
    } else {
      setLineItemsByInvoice({});
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchData();
    }
  }, [currentUserId, fetchData]);

  const color =
    colorMode === "light" ? "custom.theme.light.900" : "custom.theme.dark.100";

  const existingCategories = Array.from(new Set(entries.map((e) => e.category)));
  const unbilledEntries = entries.filter((e) => !e.invoice_id);

  if (isLoading) {
    return null;
  }

  return (
    <Content maxWidth="900px">
      <Box py={6}>
        <Heading size="md" mb={4} color={color}>
          スケジュール実績管理
        </Heading>

        {!currentUserId ? (
          <Text fontSize="14px" color="gray.500" py={12} textAlign="center">
            閲覧するにはログインが必要です
            <br />
            右上のアイコンからログインしてください
          </Text>
        ) : (
          <>
            <Box mb={6}>
              {loadingData ? (
                <Text fontSize="13px" color="gray.500">
                  読み込み中...
                </Text>
              ) : (
                <GanttSummary projects={projects} entries={entries} showBudget={isDev} />
              )}
            </Box>

            {isDev ? (
              <Tabs size="sm" colorScheme="blue">
                <TabList>
                  <Tab>実績を登録</Tab>
                  <Tab>請求</Tab>
                  <Tab>入金</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Heading size="sm" mb={2} color={color}>
                          実績を登録
                        </Heading>
                        <EntryForm
                          userId={currentUserId}
                          projects={projects}
                          existingCategories={existingCategories}
                          onSaved={fetchData}
                        />
                      </Box>

                      <Box>
                        <Heading size="sm" mb={2} color={color}>
                          実績一覧
                        </Heading>
                        <EntryList
                          entries={unbilledEntries}
                          projects={projects}
                          onChanged={fetchData}
                        />
                      </Box>
                    </VStack>
                  </TabPanel>
                  <TabPanel px={0}>
                    <InvoiceTab
                      userId={currentUserId}
                      projects={projects}
                      entries={unbilledEntries}
                      invoices={invoices}
                      lineItemsByInvoice={lineItemsByInvoice}
                      loading={loadingData}
                      onChanged={fetchData}
                    />
                  </TabPanel>
                  <TabPanel px={0}>
                    <PaymentTab
                      projects={projects}
                      invoices={invoices}
                      lineItemsByInvoice={lineItemsByInvoice}
                      loading={loadingData}
                      onChanged={fetchData}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              <Text fontSize="12px" color="gray.500" mt={4}>
                スケジュールの登録・編集は開発担当のみ行えます
              </Text>
            )}
          </>
        )}
      </Box>
    </Content>
  );
}
