"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import type { ScheduleProject } from "./GanttSummary";
import { toHalfWidthNumber, makeHalfWidthOnInput } from "./toHalfWidthNumber";
import SelectableTextField, { uniqueSortedOptions } from "./SelectableTextField";

export default function ProjectCreateForm({
  userId,
  projects,
  onCreated,
  onCancel,
}: {
  userId: string;
  projects: ScheduleProject[];
  onCreated: (projectId: number) => void;
  onCancel: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [deliveryPlace, setDeliveryPlace] = useState("");
  const [plannedStart, setPlannedStart] = useState("");
  const [plannedEnd, setPlannedEnd] = useState("");
  const [hourlyRate, setHourlyRate] = useState("2000");
  const [budgetLimit, setBudgetLimit] = useState("200000");
  const [saving, setSaving] = useState(false);

  const clientNameOptions = useMemo(
    () => uniqueSortedOptions(projects.map((p) => p.client_name)),
    [projects]
  );
  const deliveryPlaceOptions = useMemo(
    () => uniqueSortedOptions(projects.map((p) => p.delivery_place)),
    [projects]
  );

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({ status: "warning", title: "プロジェクト名を入力してください" });
      return;
    }
    const hourlyRateNum = Number(hourlyRate);
    const budgetLimitNum = Number(budgetLimit);
    if (!(hourlyRateNum > 0) || !(budgetLimitNum > 0)) {
      toast({ status: "warning", title: "時給・上限額は0より大きい値を入力してください" });
      return;
    }

    setSaving(true);
    const { data: existingInvoiceNumbers } = await supabase
      .from("schedule_projects")
      .select("invoice_number")
      .not("invoice_number", "is", null);
    const maxNumber = (existingInvoiceNumbers || []).reduce((max, p) => {
      const match = p.invoice_number?.match(/^S(\d+)$/);
      const num = match ? Number(match[1]) : 0;
      return Math.max(max, num);
    }, 0);
    const nextInvoiceNumber = `S${String(maxNumber + 1).padStart(4, "0")}`;

    const { data, error } = await supabase
      .from("schedule_projects")
      .insert({
        name: name.trim(),
        client_name: clientName.trim() || null,
        delivery_place: deliveryPlace.trim() || null,
        created_by: userId,
        planned_start: plannedStart || null,
        planned_end: plannedEnd || null,
        hourly_rate: hourlyRateNum,
        budget_limit: budgetLimitNum,
        invoice_number: nextInvoiceNumber,
      })
      .select();
    setSaving(false);
    if (error || !data?.[0]) {
      toast({ status: "error", title: "プロジェクト作成に失敗しました", description: error?.message });
      return;
    }
    toast({ status: "success", title: "プロジェクトを作成しました" });
    onCreated(data[0].id);
  };

  return (
    <VStack align="stretch" spacing={2}>
      <Input
        size="sm"
        placeholder="新しいプロジェクト名"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <HStack align="flex-start">
        <SelectableTextField
          label="取引先名（請求書の宛先）"
          placeholder="例: 四国部品(株)徳島工場"
          value={clientName}
          options={clientNameOptions}
          onChange={setClientName}
        />
        <SelectableTextField
          label="納入場所"
          placeholder="例: 四国部品(株)徳島工場"
          value={deliveryPlace}
          options={deliveryPlaceOptions}
          onChange={setDeliveryPlace}
        />
      </HStack>
      <HStack>
        <Box flex={1}>
          <FormLabel fontSize="11px" mb={0.5}>
            開始予定日
          </FormLabel>
          <Input
            size="sm"
            type="date"
            value={plannedStart}
            onChange={(e) => setPlannedStart(e.target.value)}
          />
        </Box>
        <Box flex={1}>
          <FormLabel fontSize="11px" mb={0.5}>
            終了予定日
          </FormLabel>
          <Input
            size="sm"
            type="date"
            value={plannedEnd}
            onChange={(e) => setPlannedEnd(e.target.value)}
          />
        </Box>
      </HStack>
      <HStack>
        <Box flex={1}>
          <FormLabel fontSize="11px" mb={0.5}>
            時給（税抜・円）
          </FormLabel>
          <NumberInput
            size="sm"
            value={hourlyRate}
            min={1}
            onChange={(v) => setHourlyRate(toHalfWidthNumber(v))}
          >
            <NumberInputField
              onFocus={(e) => e.target.select()}
              onInput={makeHalfWidthOnInput(setHourlyRate)}
            />
          </NumberInput>
        </Box>
        <Box flex={1}>
          <FormLabel fontSize="11px" mb={0.5}>
            上限額（税込・円）
          </FormLabel>
          <NumberInput
            size="sm"
            value={budgetLimit}
            min={1}
            onChange={(v) => setBudgetLimit(toHalfWidthNumber(v))}
          >
            <NumberInputField
              onFocus={(e) => e.target.select()}
              onInput={makeHalfWidthOnInput(setBudgetLimit)}
            />
          </NumberInput>
        </Box>
      </HStack>
      <HStack>
        <Button size="sm" onClick={handleCreate} isLoading={saving}>
          作成
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          キャンセル
        </Button>
      </HStack>
    </VStack>
  );
}
