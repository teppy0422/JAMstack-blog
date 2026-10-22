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
  Button,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import type { ScheduleProject } from "./GanttSummary";
import { estimateTotals, generateEstimatePdf, hasSavedEstimate } from "./generateEstimatePdf";

export default function EstimateListTab({
  projects,
  onEdit,
  onChanged,
}: {
  projects: ScheduleProject[];
  onEdit: (projectId: number) => void;
  onChanged: () => void;
}) {
  const toast = useToast();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const estimates = projects
    .filter(hasSavedEstimate)
    .sort((a, b) => (a.invoice_number || "").localeCompare(b.invoice_number || ""));

  const totalAmount = estimates.reduce(
    (sum, p) => sum + estimateTotals(p.estimate_amount ?? 0).total,
    0
  );

  const handleDownloadPdf = async (project: ScheduleProject) => {
    setDownloadingId(project.id);
    try {
      const blob = await generateEstimatePdf(project);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `見積書_${project.invoice_number || project.name}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e: any) {
      toast({ status: "error", title: "PDF生成に失敗しました", description: e?.message });
    } finally {
      setDownloadingId(null);
    }
  };

  // 案件名などの draft_* 列は請求タブと共用なので、見積固有の発行日と金額だけを消す
  const handleDelete = async (project: ScheduleProject) => {
    if (!confirm("この見積を一覧から削除しますか？（案件名などの入力内容は残ります）")) return;
    setDeletingId(project.id);
    const { error } = await supabase
      .from("schedule_projects")
      .update({ draft_issue_date: null, estimate_amount: null })
      .eq("id", project.id);
    setDeletingId(null);
    if (error) {
      toast({ status: "error", title: "削除に失敗しました", description: error.message });
      return;
    }
    toast({ status: "success", title: "見積を削除しました" });
    onChanged();
  };

  if (estimates.length === 0) {
    return (
      <Box fontSize="13px" color="gray.500" py={4} textAlign="center">
        保存済みの見積がありません
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th whiteSpace="nowrap">請求番号</Th>
            <Th whiteSpace="nowrap">案件名</Th>
            <Th whiteSpace="nowrap">宛先</Th>
            <Th whiteSpace="nowrap">対応者様</Th>
            <Th whiteSpace="nowrap">発行日</Th>
            <Th whiteSpace="nowrap" isNumeric>
              金額
            </Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {estimates.map((project) => (
            <Tr key={project.id}>
              <Td whiteSpace="nowrap">
                <Box
                  fontSize="11px"
                  fontWeight="600"
                  color="white"
                  bg="custom.theme.light.900"
                  px="6px"
                  py="4px"
                  borderRadius="sm"
                  whiteSpace="nowrap"
                  display="inline-block"
                >
                  {project.invoice_number || "-"}
                </Box>
              </Td>
              <Td fontSize="12px">{project.draft_subject_title || project.name}</Td>
              <Td whiteSpace="nowrap" fontSize="12px">
                {project.client_name || "-"}
              </Td>
              <Td whiteSpace="nowrap" fontSize="12px">
                {project.draft_responder_name || "-"}
              </Td>
              <Td whiteSpace="nowrap" fontSize="12px">
                {project.draft_issue_date || "-"}
              </Td>
              <Td whiteSpace="nowrap" fontSize="12px" isNumeric>
                {project.estimate_amount != null
                  ? `¥${estimateTotals(project.estimate_amount).total.toLocaleString()}`
                  : "-"}
              </Td>
              <Td whiteSpace="nowrap">
                <Button size="xs" mr={1} onClick={() => onEdit(project.id)}>
                  編集
                </Button>
                <Button
                  size="xs"
                  mr={1}
                  isLoading={downloadingId === project.id}
                  onClick={() => handleDownloadPdf(project)}
                >
                  PDF
                </Button>
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  isLoading={deletingId === project.id}
                  onClick={() => handleDelete(project)}
                >
                  削除
                </Button>
              </Td>
            </Tr>
          ))}
          <Tr fontWeight="700">
            <Td colSpan={5} fontSize="12px" textAlign="right">
              見積合計
            </Td>
            <Td isNumeric fontSize="12px">
              ¥{totalAmount.toLocaleString()}
            </Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
}
