"use client";

import { Box, Heading, Text, VStack, Divider, useColorMode } from "@chakra-ui/react";
import type { ScheduleEntry, ScheduleProject } from "./GanttSummary";
import type { Invoice, InvoiceLineItem } from "./invoiceTypes";
import InvoiceCreateForm from "./InvoiceCreateForm";
import InvoiceListTab from "./InvoiceListTab";

export default function InvoiceTab({
  userId,
  projects,
  entries,
  invoices,
  lineItemsByInvoice,
  loading,
  onChanged,
}: {
  userId: string;
  projects: ScheduleProject[];
  entries: ScheduleEntry[];
  invoices: Invoice[];
  lineItemsByInvoice: Record<number, InvoiceLineItem[]>;
  loading: boolean;
  onChanged: () => void;
}) {
  const { colorMode } = useColorMode();
  const color =
    colorMode === "light" ? "custom.theme.light.900" : "custom.theme.dark.100";

  const unpaidInvoices = invoices.filter((i) => !i.is_paid);

  return (
    <VStack align="stretch" spacing={4}>
      <Box>
        <Heading size="sm" mb={2} color={color}>
          請求書を作成
        </Heading>
        <InvoiceCreateForm
          userId={userId}
          projects={projects}
          entries={entries}
          onCreated={onChanged}
        />
      </Box>

      <Divider />

      <Box>
        <Heading size="sm" mb={2} color={color}>
          発行済み請求書
        </Heading>
        {loading ? (
          <Text fontSize="13px" color="gray.500">
            読み込み中...
          </Text>
        ) : (
          <InvoiceListTab
            invoices={unpaidInvoices}
            lineItemsByInvoice={lineItemsByInvoice}
            projects={projects}
            onChanged={onChanged}
            showRevert
            emptyMessage="発行済みの請求書がありません"
          />
        )}
      </Box>
    </VStack>
  );
}
