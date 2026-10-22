"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
  VStack,
  HStack,
  useToast,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import type { ScheduleProject } from "./GanttSummary";
import { toHalfWidthNumber, makeHalfWidthOnInput } from "./toHalfWidthNumber";
import SelectableTextField, { uniqueSortedOptions } from "./SelectableTextField";

const DEFAULT_CATEGORIES = ["自宅"];

export default function EntryForm({
  userId,
  projects,
  existingCategories,
  onSaved,
}: {
  userId: string;
  projects: ScheduleProject[];
  existingCategories: string[];
  onSaved: () => void;
}) {
  const toast = useToast();
  const [projectId, setProjectId] = useState<string>(
    projects[0]?.id ? String(projects[0].id) : ""
  );
  const [workDate, setWorkDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [category, setCategory] = useState<string>(
    existingCategories[0] || DEFAULT_CATEGORIES[0]
  );
  const [customCategory, setCustomCategory] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState<string>("1");
  const [transportationFee, setTransportationFee] = useState<string>("0");
  const [transportationFeeTouched, setTransportationFeeTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) =>
        (a.invoice_number || "").localeCompare(b.invoice_number || "")
      ),
    [projects]
  );

  const clientNameOptions = useMemo(
    () => uniqueSortedOptions(projects.map((p) => p.client_name)),
    [projects]
  );
  const deliveryPlaceOptions = useMemo(
    () => uniqueSortedOptions(projects.map((p) => p.delivery_place)),
    [projects]
  );

  const [editingPlan, setEditingPlan] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planStart, setPlanStart] = useState("");
  const [planEnd, setPlanEnd] = useState("");
  const [planHourlyRate, setPlanHourlyRate] = useState("");
  const [planBudgetLimit, setPlanBudgetLimit] = useState("");
  const [planClientName, setPlanClientName] = useState("");
  const [planDeliveryPlace, setPlanDeliveryPlace] = useState("");

  const selectedProject = projects.find((p) => String(p.id) === projectId);

  useEffect(() => {
    if (!projectId && projects[0]) {
      setProjectId(String(projects[0].id));
    }
  }, [projectId, projects]);

  useEffect(() => {
    if (selectedProject && !transportationFeeTouched) {
      setTransportationFee(
        category === "自宅" ? "0" : String(selectedProject.hourly_rate * 2)
      );
    }
  }, [selectedProject, category, transportationFeeTouched]);

  const categoryOptions = useMemo(() => {
    const set = new Set([...DEFAULT_CATEGORIES, ...existingCategories]);
    return Array.from(set);
  }, [existingCategories]);

  const startEditPlan = () => {
    if (!selectedProject) return;
    setPlanName(selectedProject.name);
    setPlanStart(selectedProject.planned_start || "");
    setPlanEnd(selectedProject.planned_end || "");
    setPlanHourlyRate(String(selectedProject.hourly_rate));
    setPlanBudgetLimit(String(selectedProject.budget_limit));
    setPlanClientName(selectedProject.client_name || "");
    setPlanDeliveryPlace(selectedProject.delivery_place || "");
    setEditingPlan(true);
  };

  const handleSavePlan = async () => {
    if (!selectedProject) return;
    if (!planName.trim()) {
      toast({ status: "warning", title: "プロジェクト名を入力してください" });
      return;
    }
    const hourlyRateNum = Number(planHourlyRate);
    const budgetLimitNum = Number(planBudgetLimit);
    if (!(hourlyRateNum > 0) || !(budgetLimitNum > 0)) {
      toast({ status: "warning", title: "時給・上限額は0より大きい値を入力してください" });
      return;
    }
    const { error } = await supabase
      .from("schedule_projects")
      .update({
        name: planName.trim(),
        planned_start: planStart || null,
        planned_end: planEnd || null,
        hourly_rate: hourlyRateNum,
        budget_limit: budgetLimitNum,
        client_name: planClientName.trim() || null,
        delivery_place: planDeliveryPlace.trim() || null,
      })
      .eq("id", selectedProject.id);
    if (error) {
      toast({ status: "error", title: "予定の更新に失敗しました", description: error.message });
      return;
    }
    toast({ status: "success", title: "プロジェクト情報を更新しました" });
    setEditingPlan(false);
    onSaved();
  };

  const handleSubmit = async () => {
    const effectiveCategory = category === "__custom__" ? customCategory.trim() : category;
    if (!projectId || !workDate || !effectiveCategory || !description.trim() || !hours) {
      toast({ status: "warning", title: "未入力の項目があります" });
      return;
    }
    const hoursNum = Number(hours);
    if (!(hoursNum > 0)) {
      toast({ status: "warning", title: "工数は0より大きい値を入力してください" });
      return;
    }
    const transportationFeeNum = Number(transportationFee);
    if (!(transportationFeeNum >= 0)) {
      toast({ status: "warning", title: "交通費は0以上の値を入力してください" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("schedule_entries").insert({
      project_id: Number(projectId),
      work_date: workDate,
      category: effectiveCategory,
      description: description.trim(),
      hours: hoursNum,
      transportation_fee: transportationFeeNum,
      user_id: userId,
    });
    setSaving(false);

    if (error) {
      toast({ status: "error", title: "登録に失敗しました", description: error.message });
      return;
    }

    toast({ status: "success", title: "実績を登録しました" });
    setTransportationFeeTouched(false);
    setHours("1");
    setDescription("");
    setCategory("自宅");
    setCustomCategory("");
    onSaved();
  };

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      mb={4}
    >
      <VStack align="stretch" spacing={3}>
        <FormControl>
          <FormLabel fontSize="13px">プロジェクト</FormLabel>
          <VStack align="stretch" spacing={2}>
            <HStack>
              <Select
                size="sm"
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  setEditingPlan(false);
                }}
              >
                {sortedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.invoice_number ? `${p.invoice_number} ${p.name}` : p.name}
                  </option>
                ))}
              </Select>
              {selectedProject?.invoice_number && (
                <Box
                  fontSize="11px"
                  fontWeight="600"
                  color="white"
                  bg="custom.theme.light.900"
                  px="6px"
                  py="4px"
                  borderRadius="sm"
                  whiteSpace="nowrap"
                >
                  {selectedProject.invoice_number}
                </Box>
              )}
            </HStack>
            {sortedProjects.length === 0 && (
              <Box fontSize="12px" color="gray.500">
                プロジェクトがありません。「見積」タブで新規作成してください
              </Box>
            )}
            {selectedProject && !editingPlan && (
              <HStack fontSize="12px" color="gray.500">
                <Box>
                  取引先：{selectedProject.client_name || "未設定"}
                  ／納入場所：{selectedProject.delivery_place || "未設定"}
                  ／予定：
                  {selectedProject.planned_start && selectedProject.planned_end
                    ? `${selectedProject.planned_start} 〜 ${selectedProject.planned_end}`
                    : "未設定"}
                  ／時給：{selectedProject.hourly_rate.toLocaleString()}円（税抜）
                  ／上限：{selectedProject.budget_limit.toLocaleString()}円
                </Box>
                <Button size="xs" variant="link" onClick={startEditPlan}>
                  編集
                </Button>
              </HStack>
            )}
            {selectedProject && editingPlan && (
              <VStack align="stretch" spacing={2}>
                <Box>
                  <FormLabel fontSize="11px" mb={0.5}>
                    プロジェクト名
                  </FormLabel>
                  <Input
                    size="sm"
                    placeholder="プロジェクト名"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                  />
                </Box>
                <HStack align="flex-start">
                  <SelectableTextField
                    label="取引先名（請求書の宛先）"
                    placeholder="例: 四国部品(株)徳島工場"
                    value={planClientName}
                    options={clientNameOptions}
                    onChange={setPlanClientName}
                  />
                  <SelectableTextField
                    label="納入場所"
                    placeholder="例: 四国部品(株)徳島工場"
                    value={planDeliveryPlace}
                    options={deliveryPlaceOptions}
                    onChange={setPlanDeliveryPlace}
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
                      value={planStart}
                      onChange={(e) => setPlanStart(e.target.value)}
                    />
                  </Box>
                  <Box flex={1}>
                    <FormLabel fontSize="11px" mb={0.5}>
                      終了予定日
                    </FormLabel>
                    <Input
                      size="sm"
                      type="date"
                      value={planEnd}
                      onChange={(e) => setPlanEnd(e.target.value)}
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
                      value={planHourlyRate}
                      min={1}
                      onChange={(v) => setPlanHourlyRate(toHalfWidthNumber(v))}
                    >
                      <NumberInputField
                        onFocus={(e) => e.target.select()}
                        onInput={makeHalfWidthOnInput(setPlanHourlyRate)}
                      />
                    </NumberInput>
                  </Box>
                  <Box flex={1}>
                    <FormLabel fontSize="11px" mb={0.5}>
                      上限額（税込・円）
                    </FormLabel>
                    <NumberInput
                      size="sm"
                      value={planBudgetLimit}
                      min={1}
                      onChange={(v) => setPlanBudgetLimit(toHalfWidthNumber(v))}
                    >
                      <NumberInputField
                        onFocus={(e) => e.target.select()}
                        onInput={makeHalfWidthOnInput(setPlanBudgetLimit)}
                      />
                    </NumberInput>
                  </Box>
                </HStack>
                <HStack>
                  <Button size="sm" onClick={handleSavePlan}>
                    保存
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingPlan(false)}>
                    キャンセル
                  </Button>
                </HStack>
              </VStack>
            )}
          </VStack>
        </FormControl>

        <HStack spacing={3}>
          <FormControl>
            <FormLabel fontSize="13px">日付</FormLabel>
            <Input
              size="sm"
              type="date"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="13px">工数（H）</FormLabel>
            <NumberInput
              size="sm"
              value={hours}
              min={0.5}
              step={0.5}
              onChange={(v) => setHours(toHalfWidthNumber(v))}
            >
              <NumberInputField
                onFocus={(e) => e.target.select()}
                onInput={makeHalfWidthOnInput(setHours)}
              />
            </NumberInput>
          </FormControl>
        </HStack>

        <HStack spacing={3} align="flex-start">
          <FormControl>
            <FormLabel fontSize="13px">カテゴリ</FormLabel>
            <Select
              size="sm"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setTransportationFeeTouched(false);
              }}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="__custom__">＋新しいカテゴリ</option>
            </Select>
            {category === "__custom__" && (
              <Input
                mt={2}
                size="sm"
                placeholder="新しいカテゴリ名"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            )}
          </FormControl>
          <FormControl>
            <FormLabel fontSize="13px">交通費（円）</FormLabel>
            <NumberInput
              size="sm"
              value={transportationFee}
              min={0}
              onChange={(v) => {
                setTransportationFee(toHalfWidthNumber(v));
                setTransportationFeeTouched(true);
              }}
            >
              <NumberInputField
                onFocus={(e) => e.target.select()}
                onInput={(e) => {
                  const converted = toHalfWidthNumber(e.currentTarget.value);
                  if (converted !== e.currentTarget.value) {
                    e.currentTarget.value = converted;
                    setTransportationFee(converted);
                    setTransportationFeeTouched(true);
                  }
                }}
              />
            </NumberInput>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel fontSize="13px">作業内容</FormLabel>
          <Textarea
            size="sm"
            placeholder="例: 先ハメ誘導SSCの設計を考える"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </FormControl>

        <Button colorScheme="blue" size="sm" onClick={handleSubmit} isLoading={saving}>
          登録
        </Button>
      </VStack>
    </Box>
  );
}
