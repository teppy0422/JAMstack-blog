"use client";

import { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Input,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import type { ScheduleProject } from "./GanttSummary";
import type { Invoice, InvoiceLineItem } from "./invoiceTypes";
import { generateInvoicePdf } from "./generateInvoicePdf";

export default function InvoiceListTab({
  invoices,
  lineItemsByInvoice,
  projects,
  onChanged,
  showRevert = true,
  emptyMessage = "発行済みの請求書がありません",
}: {
  invoices: Invoice[];
  lineItemsByInvoice: Record<number, InvoiceLineItem[]>;
  projects: ScheduleProject[];
  onChanged: () => void;
  showRevert?: boolean;
  emptyMessage?: string;
}) {
  const toast = useToast();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [revertingId, setRevertingId] = useState<number | null>(null);

  const projectInvoiceNumber = (projectId: number) =>
    projects.find((p) => p.id === projectId)?.invoice_number || "-";
  const projectName = (projectId: number) =>
    projects.find((p) => p.id === projectId)?.name || "";

  const sorted = [...invoices].sort((a, b) =>
    b.issue_date.localeCompare(a.issue_date)
  );

  const handleUpdatePayment = async (
    invoiceId: number,
    patch: { payment_due_date?: string | null; is_paid?: boolean }
  ) => {
    const { error } = await supabase.from("invoices").update(patch).eq("id", invoiceId);
    if (error) {
      toast({ status: "error", title: "更新に失敗しました", description: error.message });
      return;
    }
    onChanged();
  };

  const handleRevert = async (invoiceId: number) => {
    if (!confirm("この請求書を取り消し、実績を未請求に戻しますか？")) return;
    setRevertingId(invoiceId);

    const { error: unmarkError } = await supabase
      .from("schedule_entries")
      .update({ invoice_id: null })
      .eq("invoice_id", invoiceId);
    if (unmarkError) {
      setRevertingId(null);
      toast({
        status: "error",
        title: "実績の差し戻しに失敗しました",
        description: unmarkError.message,
      });
      return;
    }

    await supabase.from("invoice_line_items").delete().eq("invoice_id", invoiceId);
    const { error: deleteError } = await supabase.from("invoices").delete().eq("id", invoiceId);
    setRevertingId(null);
    if (deleteError) {
      toast({ status: "error", title: "削除に失敗しました", description: deleteError.message });
      return;
    }
    toast({ status: "success", title: "請求書を取り消しました" });
    onChanged();
  };

  const handleDownloadPdf = async (invoice: Invoice) => {
    setDownloadingId(invoice.id);
    try {
      const invoiceNumber = projectInvoiceNumber(invoice.project_id);
      const lineItems = lineItemsByInvoice[invoice.id] || [];
      const blob = await generateInvoicePdf(
        invoice,
        lineItems,
        invoiceNumber,
        projectName(invoice.project_id)
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `請求書_${invoiceNumber}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e: any) {
      toast({ status: "error", title: "PDF生成に失敗しました", description: e?.message });
    } finally {
      setDownloadingId(null);
    }
  };

  if (sorted.length === 0) {
    return (
      <Box fontSize="13px" color="gray.500" py={4} textAlign="center">
        {emptyMessage}
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th whiteSpace="nowrap">請求番号</Th>
            <Th whiteSpace="nowrap">宛先</Th>
            <Th whiteSpace="nowrap">発行日</Th>
            <Th whiteSpace="nowrap" isNumeric>
              金額
            </Th>
            <Th whiteSpace="nowrap">振込予定日</Th>
            <Th whiteSpace="nowrap">入金済</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {sorted.map((invoice) => (
            <Tr key={invoice.id}>
              <Td whiteSpace="nowrap" fontSize="12px">
                {projectInvoiceNumber(invoice.project_id)}
              </Td>
              <Td whiteSpace="nowrap" fontSize="12px">
                {invoice.client_name}
              </Td>
              <Td whiteSpace="nowrap" fontSize="12px">
                {invoice.issue_date}
              </Td>
              <Td whiteSpace="nowrap" fontSize="12px" isNumeric>
                ¥{invoice.total.toLocaleString()}
              </Td>
              <Td>
                <Input
                  size="xs"
                  type="date"
                  value={invoice.payment_due_date || ""}
                  onChange={(e) =>
                    handleUpdatePayment(invoice.id, {
                      payment_due_date: e.target.value || null,
                    })
                  }
                />
              </Td>
              <Td>
                <Checkbox
                  isChecked={invoice.is_paid}
                  onChange={(e) =>
                    handleUpdatePayment(invoice.id, { is_paid: e.target.checked })
                  }
                />
              </Td>
              <Td whiteSpace="nowrap">
                <Button
                  size="xs"
                  mr={1}
                  isLoading={downloadingId === invoice.id}
                  onClick={() => handleDownloadPdf(invoice)}
                >
                  PDF
                </Button>
                {showRevert && (
                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    isLoading={revertingId === invoice.id}
                    onClick={() => handleRevert(invoice.id)}
                  >
                    戻す
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
