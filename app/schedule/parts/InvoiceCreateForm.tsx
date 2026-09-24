"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import type { ScheduleEntry, ScheduleProject } from "./GanttSummary";
import type { Invoice, InvoiceLineItem } from "./invoiceTypes";
import { generateInvoicePdf } from "./generateInvoicePdf";

const TAX_RATE = 0.1;

type DraftLine = {
  key: string;
  work_date: string;
  section_label: string;
  description: string;
  hours: string;
  unit_price: string;
  remarks: string;
  source_entry_id: number | null;
};

const TRANSPORTATION_FEE_HOURS = 2;

function buildDraftLinesFromEntries(
  entries: ScheduleEntry[],
  hourlyRate: number
): DraftLine[] {
  const sorted = [...entries].sort((a, b) =>
    a.work_date.localeCompare(b.work_date)
  );
  const lines: DraftLine[] = [];
  for (const e of sorted) {
    lines.push({
      key: `entry-${e.id}`,
      work_date: e.work_date,
      section_label: e.category,
      description: e.description,
      hours: String(e.hours),
      unit_price: String(hourlyRate),
      remarks: "",
      source_entry_id: e.id,
    });
    if (Number(e.transportation_fee) > 0) {
      lines.push({
        key: `entry-${e.id}-fee`,
        work_date: e.work_date,
        section_label: "",
        description: "交通費",
        hours: String(TRANSPORTATION_FEE_HOURS),
        unit_price: String(hourlyRate),
        remarks: "",
        source_entry_id: e.id,
      });
    }
  }
  return lines;
}

export default function InvoiceCreateForm({
  userId,
  projects,
  entries,
  onCreated,
}: {
  userId: string;
  projects: ScheduleProject[];
  entries: ScheduleEntry[];
  onCreated: () => void;
}) {
  const toast = useToast();
  const [projectId, setProjectId] = useState<string>("");
  const [issueDate, setIssueDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectDetail, setSubjectDetail] = useState("");
  const [responderName, setResponderName] = useState("");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([]);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const selectedProject = projects.find((p) => String(p.id) === projectId);

  const sortedProjects = useMemo(() => {
    const billableIds = new Set(entries.map((e) => e.project_id));
    return [...projects]
      .filter((p) => billableIds.has(p.id))
      .sort((a, b) => (a.invoice_number || "").localeCompare(b.invoice_number || ""));
  }, [projects, entries]);

  useEffect(() => {
    const stillValid = sortedProjects.some((p) => String(p.id) === projectId);
    if (!stillValid) {
      setProjectId(sortedProjects[0]?.id ? String(sortedProjects[0].id) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedProjects]);

  useEffect(() => {
    if (!selectedProject) {
      setLines([]);
      return;
    }
    const targetEntries = entries.filter((e) => e.project_id === selectedProject.id);
    setLines(buildDraftLinesFromEntries(targetEntries, selectedProject.hourly_rate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, entries]);

  const lineAmount = (l: DraftLine) => {
    const hours = Number(l.hours) || 0;
    const unitPrice = Number(l.unit_price) || 0;
    return hours * unitPrice;
  };

  const { subtotal, tax, total } = useMemo(() => {
    const sub = lines.reduce((sum, l) => sum + lineAmount(l), 0);
    const taxAmount = Math.round(sub * TAX_RATE);
    return { subtotal: sub, tax: taxAmount, total: sub + taxAmount };
  }, [lines]);

  const overBudget = !!selectedProject && total > selectedProject.budget_limit;

  const previewInvoice: Invoice | null = selectedProject
    ? {
        id: 0,
        project_id: selectedProject.id,
        client_name: selectedProject.client_name || selectedProject.name,
        delivery_place: selectedProject.delivery_place ?? null,
        issue_date: issueDate,
        subject_title: subjectTitle.trim() || null,
        subject_detail: subjectDetail.trim() || null,
        responder_name: responderName.trim() || null,
        notes: notes.trim() || null,
        hourly_rate: selectedProject.hourly_rate,
        subtotal,
        tax,
        total,
        payment_due_date: null,
        is_paid: false,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : null;

  const previewLineItems: InvoiceLineItem[] = lines.map((l, idx) => ({
    id: idx,
    invoice_id: previewInvoice?.id ?? 0,
    work_date: l.work_date || null,
    section_label: l.section_label.trim() || null,
    description: l.description.trim(),
    hours: l.hours === "" ? null : Number(l.hours) || 0,
    unit_price: Number(l.unit_price) || 0,
    amount: lineAmount(l),
    remarks: l.remarks.trim() || null,
    sort_order: idx,
    source_entry_id: l.source_entry_id,
  }));

  const handlePreviewPdf = async () => {
    if (!selectedProject || !previewInvoice) {
      toast({ status: "warning", title: "請求番号を選択してください" });
      return;
    }
    if (lines.length === 0) {
      toast({ status: "warning", title: "明細行がありません" });
      return;
    }

    const previewWindow = window.open("", "_blank");
    setPreviewing(true);
    try {
      const blob = await generateInvoicePdf(
        previewInvoice,
        previewLineItems,
        selectedProject.invoice_number || "-",
        selectedProject.name
      );
      const url = URL.createObjectURL(blob);
      if (previewWindow) {
        previewWindow.location.href = url;
      } else {
        toast({
          status: "warning",
          title: "ポップアップがブロックされました",
          description: "ブラウザのポップアップブロックを解除してください",
        });
      }
    } catch (e: any) {
      previewWindow?.close();
      toast({ status: "error", title: "PDF生成に失敗しました", description: e?.message });
    } finally {
      setPreviewing(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProject) {
      toast({ status: "warning", title: "請求番号を選択してください" });
      return;
    }
    if (lines.length === 0) {
      toast({ status: "warning", title: "明細行がありません" });
      return;
    }
    if (!issueDate) {
      toast({ status: "warning", title: "発行日を入力してください" });
      return;
    }
    if (overBudget) {
      toast({
        status: "error",
        title: "上限額を超えています",
        description: `総合計 ${total.toLocaleString()}円 が上限 ${selectedProject.budget_limit.toLocaleString()}円 を超えています。実績を修正してください。`,
      });
      return;
    }

    setSaving(true);

    const invoicePayload = {
      project_id: selectedProject.id,
      client_name: selectedProject.client_name || selectedProject.name,
      delivery_place: selectedProject.delivery_place || null,
      issue_date: issueDate,
      subject_title: subjectTitle.trim() || null,
      subject_detail: subjectDetail.trim() || null,
      responder_name: responderName.trim() || null,
      notes: notes.trim() || null,
      hourly_rate: selectedProject.hourly_rate,
      subtotal,
      tax,
      total,
    };

    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .insert({ ...invoicePayload, created_by: userId })
      .select();

    if (invoiceError || !invoiceData?.[0]) {
      setSaving(false);
      toast({
        status: "error",
        title: "請求書の作成に失敗しました",
        description: invoiceError?.message,
      });
      return;
    }
    const invoiceId = invoiceData[0].id;

    const lineItemsPayload = lines.map((l, idx) => {
      const hours = Number(l.hours) || 0;
      const unitPrice = Number(l.unit_price) || 0;
      return {
        invoice_id: invoiceId,
        work_date: l.work_date || null,
        section_label: l.section_label.trim() || null,
        description: l.description.trim(),
        hours,
        unit_price: unitPrice,
        amount: lineAmount(l),
        remarks: l.remarks.trim() || null,
        sort_order: idx,
        source_entry_id: l.source_entry_id,
      };
    });

    const { error: lineError } = await supabase
      .from("invoice_line_items")
      .insert(lineItemsPayload);

    if (lineError) {
      setSaving(false);
      toast({
        status: "error",
        title: "明細行の保存に失敗しました",
        description: lineError.message,
      });
      return;
    }

    const sourceEntryIds = Array.from(
      new Set(lines.map((l) => l.source_entry_id).filter((id): id is number => id !== null))
    );
    if (sourceEntryIds.length > 0) {
      const { error: markError } = await supabase
        .from("schedule_entries")
        .update({ invoice_id: invoiceId })
        .in("id", sourceEntryIds);
      if (markError) {
        setSaving(false);
        toast({
          status: "error",
          title: "実績への請求書番号の反映に失敗しました",
          description: markError.message,
        });
        return;
      }
    }

    setSaving(false);
    toast({ status: "success", title: "請求書を作成しました" });
    setLines([]);
    setSubjectTitle("");
    setSubjectDetail("");
    setResponderName("");
    setNotes("");
    onCreated();
  };

  if (sortedProjects.length === 0) {
    return (
      <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} mb={4}>
        <Text fontSize="13px" color="gray.500" textAlign="center" py={4}>
          未請求の実績があるプロジェクトがありません
        </Text>
      </Box>
    );
  }

  return (
    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} mb={4}>
      <VStack align="stretch" spacing={3}>
        <HStack spacing={3}>
          <FormControl>
            <FormLabel fontSize="13px">請求番号</FormLabel>
            <Select
              size="sm"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {sortedProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.invoice_number || "-"}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="13px">発行日</FormLabel>
            <Input
              size="sm"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </FormControl>
        </HStack>

        <VStack align="stretch" spacing={3}>
          <FormControl>
            <FormLabel fontSize="13px">案件名（見出し）</FormLabel>
            <Input
              size="sm"
              placeholder={selectedProject ? `未入力時: ${selectedProject.name}` : ""}
              value={subjectTitle}
              onChange={(e) => setSubjectTitle(e.target.value)}
            />
          </FormControl>
          <FormControl pl={6}>
            <FormLabel fontSize="13px">└ 案件名（詳細）</FormLabel>
            <Input
              size="sm"
              placeholder="例: 生産準備+に先ハメ誘導SSCの作成機能追加"
              value={subjectDetail}
              onChange={(e) => setSubjectDetail(e.target.value)}
            />
          </FormControl>
        </VStack>

        <FormControl>
          <FormLabel fontSize="13px">対応者様</FormLabel>
          <Input
            size="sm"
            placeholder="例: 橋本様"
            value={responderName}
            onChange={(e) => setResponderName(e.target.value)}
          />
        </FormControl>

        <Box>
          <Text fontSize="13px" fontWeight="600" mb={2}>
            明細（実績データより自動反映。変更は「実績を登録」タブで行ってください）
          </Text>
          {lines.length === 0 ? (
            <Text fontSize="12px" color="gray.500" py={4} textAlign="center">
              この請求番号に未請求の実績がありません
            </Text>
          ) : (
            <Box overflowX="auto">
              <Table size="sm" sx={{ tableLayout: "fixed", width: "100%", minWidth: "780px" }}>
                <Thead>
                  <Tr>
                    <Th whiteSpace="nowrap" w="100px" px={1}>
                      日付
                    </Th>
                    <Th whiteSpace="nowrap" w="90px" px={1}>
                      見出し
                    </Th>
                    <Th whiteSpace="nowrap" px={1}>
                      作業内容
                    </Th>
                    <Th whiteSpace="nowrap" w="70px" px={1} isNumeric>
                      工数
                    </Th>
                    <Th whiteSpace="nowrap" w="90px" px={1} isNumeric>
                      単価
                    </Th>
                    <Th whiteSpace="nowrap" w="160px" px={1}>
                      備考
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lines.map((l) => (
                    <Tr key={l.key}>
                      <Td px={1} fontSize="12px" whiteSpace="nowrap">
                        {l.work_date}
                      </Td>
                      <Td px={1} fontSize="12px" whiteSpace="nowrap">
                        {l.section_label}
                      </Td>
                      <Td px={1} fontSize="12px">
                        {l.description}
                      </Td>
                      <Td px={1} fontSize="12px" isNumeric>
                        {l.hours}
                      </Td>
                      <Td px={1} fontSize="12px" isNumeric>
                        {l.unit_price}
                      </Td>
                      <Td px={1} fontSize="12px">
                        {l.remarks}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Box>

        <FormControl>
          <FormLabel fontSize="13px">主な取り組み</FormLabel>
          <Textarea
            size="sm"
            placeholder={"例:\n先ハメ誘導SSC\n└クボタの製品で穴位置が分かり辛い端末がある"}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </FormControl>

        <HStack justify="flex-end" fontSize="13px" spacing={6}>
          <Text>小計：{subtotal.toLocaleString()}円</Text>
          <Text>消費税：{tax.toLocaleString()}円</Text>
          <Text fontWeight="700" color={overBudget ? "red.500" : undefined}>
            総合計：{total.toLocaleString()}円
            {selectedProject && ` ／ 上限：${selectedProject.budget_limit.toLocaleString()}円`}
          </Text>
        </HStack>

        {overBudget && (
          <Text fontSize="12px" color="red.500" textAlign="right">
            上限額を超えています。実績を修正してから作成してください。
          </Text>
        )}

        <HStack>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePreviewPdf}
            isLoading={previewing}
          >
            PDFプレビュー
          </Button>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={handleSubmit}
            isLoading={saving}
            isDisabled={overBudget}
          >
            請求書を作成
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
