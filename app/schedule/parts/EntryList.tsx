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
  IconButton,
  useToast,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { supabase } from "@/utils/supabase/client";
import type { ScheduleEntry, ScheduleProject } from "./GanttSummary";
import { toHalfWidthNumber, makeHalfWidthOnInput } from "./toHalfWidthNumber";

export default function EntryList({
  entries,
  projects,
  onChanged,
}: {
  entries: ScheduleEntry[];
  projects: ScheduleProject[];
  onChanged: () => void;
}) {
  const toast = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editTransportationFee, setEditTransportationFee] = useState("");

  const projectName = (id: number) =>
    projects.find((p) => p.id === id)?.name || "-";
  const projectInvoiceNumber = (id: number) =>
    projects.find((p) => p.id === id)?.invoice_number || "-";

  const sorted = [...entries].sort((a, b) =>
    b.work_date.localeCompare(a.work_date)
  );

  const startEdit = (entry: ScheduleEntry) => {
    setEditingId(entry.id);
    setEditDescription(entry.description);
    setEditHours(String(entry.hours));
    setEditTransportationFee(String(entry.transportation_fee || 0));
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    const hoursNum = Number(editHours);
    const transportationFeeNum = Number(editTransportationFee);
    if (!(hoursNum > 0) || !editDescription.trim() || !(transportationFeeNum >= 0)) {
      toast({ status: "warning", title: "入力内容を確認してください" });
      return;
    }
    const { error } = await supabase
      .from("schedule_entries")
      .update({
        description: editDescription.trim(),
        hours: hoursNum,
        transportation_fee: transportationFeeNum,
      })
      .eq("id", id);
    if (error) {
      toast({ status: "error", title: "更新に失敗しました", description: error.message });
      return;
    }
    setEditingId(null);
    onChanged();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("この実績を削除しますか？")) return;
    const { error } = await supabase.from("schedule_entries").delete().eq("id", id);
    if (error) {
      toast({ status: "error", title: "削除に失敗しました", description: error.message });
      return;
    }
    onChanged();
  };

  if (sorted.length === 0) {
    return (
      <Box fontSize="13px" color="gray.500" py={4} textAlign="center">
        実績データがありません
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th whiteSpace="nowrap">日付</Th>
            <Th whiteSpace="nowrap">請求番号</Th>
            <Th whiteSpace="nowrap">プロジェクト</Th>
            <Th whiteSpace="nowrap">カテゴリ</Th>
            <Th whiteSpace="nowrap">作業内容</Th>
            <Th whiteSpace="nowrap" isNumeric>工数</Th>
            <Th whiteSpace="nowrap" isNumeric>交通費</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {sorted.map((entry) => (
            <Tr key={entry.id}>
              <Td whiteSpace="nowrap" fontSize="12px">
                {entry.work_date}
              </Td>
              <Td whiteSpace="nowrap" fontSize="12px">
                {projectInvoiceNumber(entry.project_id)}
              </Td>
              <Td whiteSpace="nowrap" fontSize="12px">{projectName(entry.project_id)}</Td>
              <Td whiteSpace="nowrap" fontSize="12px">{entry.category}</Td>
              <Td fontSize="12px">
                {editingId === entry.id ? (
                  <Input
                    size="xs"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                ) : (
                  entry.description
                )}
              </Td>
              <Td isNumeric fontSize="12px">
                {editingId === entry.id ? (
                  <NumberInput
                    size="xs"
                    value={editHours}
                    min={0.5}
                    step={0.5}
                    onChange={(v) => setEditHours(toHalfWidthNumber(v))}
                  >
                    <NumberInputField
                      onFocus={(e) => e.target.select()}
                      onInput={makeHalfWidthOnInput(setEditHours)}
                    />
                  </NumberInput>
                ) : (
                  `${entry.hours}H`
                )}
              </Td>
              <Td isNumeric fontSize="12px">
                {editingId === entry.id ? (
                  <NumberInput
                    size="xs"
                    value={editTransportationFee}
                    min={0}
                    onChange={(v) => setEditTransportationFee(toHalfWidthNumber(v))}
                  >
                    <NumberInputField
                      onFocus={(e) => e.target.select()}
                      onInput={makeHalfWidthOnInput(setEditTransportationFee)}
                    />
                  </NumberInput>
                ) : (
                  `¥${Number(entry.transportation_fee || 0).toLocaleString()}`
                )}
              </Td>
              <Td>
                {editingId === entry.id ? (
                  <>
                    <IconButton
                      aria-label="保存"
                      icon={<CheckIcon />}
                      size="xs"
                      mr={1}
                      onClick={() => saveEdit(entry.id)}
                    />
                    <IconButton
                      aria-label="キャンセル"
                      icon={<CloseIcon />}
                      size="xs"
                      onClick={cancelEdit}
                    />
                  </>
                ) : (
                  <>
                    <IconButton
                      aria-label="編集"
                      icon={<EditIcon />}
                      size="xs"
                      mr={1}
                      onClick={() => startEdit(entry)}
                    />
                    <IconButton
                      aria-label="削除"
                      icon={<DeleteIcon />}
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(entry.id)}
                    />
                  </>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
