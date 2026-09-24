"use client";

import { Box, Heading, Text, VStack, useColorMode } from "@chakra-ui/react";
import type { ScheduleProject } from "./GanttSummary";
import type { Invoice, InvoiceLineItem } from "./invoiceTypes";
import InvoiceListTab from "./InvoiceListTab";

export default function PaymentTab({
  projects,
  invoices,
  lineItemsByInvoice,
  loading,
  onChanged,
}: {
  projects: ScheduleProject[];
  invoices: Invoice[];
  lineItemsByInvoice: Record<number, InvoiceLineItem[]>;
  loading: boolean;
  onChanged: () => void;
}) {
  const { colorMode } = useColorMode();
  const color =
    colorMode === "light" ? "custom.theme.light.900" : "custom.theme.dark.100";

  const paidInvoices = invoices.filter((i) => i.is_paid);

  return (
    <VStack align="stretch" spacing={4}>
      <Box>
        <Heading size="sm" mb={2} color={color}>
          入金済み請求書
        </Heading>
        {loading ? (
          <Text fontSize="13px" color="gray.500">
            読み込み中...
          </Text>
        ) : (
          <InvoiceListTab
            invoices={paidInvoices}
            lineItemsByInvoice={lineItemsByInvoice}
            projects={projects}
            onChanged={onChanged}
            showRevert={false}
            emptyMessage="入金済みの請求書がありません"
          />
        )}
      </Box>
    </VStack>
  );
}
