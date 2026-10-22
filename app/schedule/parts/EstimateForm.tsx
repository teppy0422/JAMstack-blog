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
  Text,
  useToast,
} from "@chakra-ui/react";
import { supabase } from "@/utils/supabase/client";
import type { ScheduleProject } from "./GanttSummary";
import ProjectCreateForm from "./ProjectCreateForm";
import { toHalfWidthNumber, makeHalfWidthOnInput } from "./toHalfWidthNumber";

const TAX_RATE = 0.1;

const today = () => new Date().toISOString().slice(0, 10);

// 見積の概略はプロジェクトの draft_* 列に保存し、請求タブで同じ請求番号を選ぶと引き継がれる。
// 見積は任意なので、未入力のまま請求タブで請求書を作成してもよい
export default function EstimateForm({
  userId,
  projects,
  projectId,
  onProjectIdChange,
  onSaved,
}: {
  userId: string;
  projects: ScheduleProject[];
  projectId: string;
  onProjectIdChange: (projectId: string) => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [newProjectMode, setNewProjectMode] = useState(false);
  const [issueDate, setIssueDate] = useState<string>(today());
  const [subjectTitle, setSubjectTitle] = useState("");
  const [subjectDetail, setSubjectDetail] = useState("");
  const [responderName, setResponderName] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) =>
        (a.invoice_number || "").localeCompare(b.invoice_number || "")
      ),
    [projects]
  );

  const selectedProject = projects.find((p) => String(p.id) === projectId);

  useEffect(() => {
    const stillValid = sortedProjects.some((p) => String(p.id) === projectId);
    if (!stillValid) {
      onProjectIdChange(sortedProjects[0]?.id ? String(sortedProjects[0].id) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedProjects]);

  useEffect(() => {
    if (!selectedProject) return;
    setIssueDate(selectedProject.draft_issue_date ?? today());
    setSubjectTitle(selectedProject.draft_subject_title ?? "");
    setSubjectDetail(selectedProject.draft_subject_detail ?? "");
    setResponderName(selectedProject.draft_responder_name ?? "");
    setNotes(selectedProject.draft_notes ?? "");
    setAmount(selectedProject.estimate_amount != null ? String(selectedProject.estimate_amount) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject?.id, selectedProject?.draft_issue_date, selectedProject?.estimate_amount]);

  useEffect(() => {
    setNewProjectMode(false);
  }, [projectId]);

  const subtotal = Number(amount) || 0;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  const overBudget = !!selectedProject && total > selectedProject.budget_limit;

  const handleSave = async () => {
    if (!selectedProject) {
      toast({ status: "warning", title: "請求番号を選択してください" });
      return;
    }
    if (amount !== "" && !(Number(amount) >= 0)) {
      toast({ status: "warning", title: "見積金額は0以上の値を入力してください" });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("schedule_projects")
      .update({
        draft_issue_date: issueDate || null,
        draft_subject_title: subjectTitle.trim() || null,
        draft_subject_detail: subjectDetail.trim() || null,
        draft_responder_name: responderName.trim() || null,
        draft_notes: notes.trim() || null,
        estimate_amount: amount === "" ? null : Number(amount),
      })
      .eq("id", selectedProject.id);
    setSaving(false);
    if (error) {
      toast({ status: "error", title: "見積の保存に失敗しました", description: error.message });
      return;
    }
    toast({ status: "success", title: "見積を保存しました" });
    onSaved();
  };

  return (
    <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={4} mb={4}>
      <VStack align="stretch" spacing={3}>
        <FormControl>
          <FormLabel fontSize="13px">プロジェクト</FormLabel>
          {newProjectMode ? (
            <ProjectCreateForm
              userId={userId}
              projects={projects}
              onCreated={(id) => {
                setNewProjectMode(false);
                onProjectIdChange(String(id));
                onSaved();
              }}
              onCancel={() => setNewProjectMode(false)}
            />
          ) : (
            <HStack>
              <Select
                size="sm"
                value={projectId}
                onChange={(e) => onProjectIdChange(e.target.value)}
              >
                {sortedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.invoice_number ? `${p.invoice_number} ${p.name}` : p.name}
                  </option>
                ))}
              </Select>
              <Button size="sm" variant="outline" onClick={() => setNewProjectMode(true)}>
                ＋新規
              </Button>
            </HStack>
          )}
        </FormControl>

        {!newProjectMode && selectedProject && (
          <>
            <FormControl>
              <FormLabel fontSize="13px">発行日</FormLabel>
              <Input
                size="sm"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </FormControl>

            <VStack align="stretch" spacing={3}>
              <FormControl>
                <FormLabel fontSize="13px">案件名（見出し）</FormLabel>
                <Input
                  size="sm"
                  placeholder={`未入力時: ${selectedProject.name}`}
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

            <FormControl>
              <FormLabel fontSize="13px">見積金額（税抜・円）</FormLabel>
              <NumberInput
                size="sm"
                value={amount}
                min={0}
                onChange={(v) => setAmount(toHalfWidthNumber(v))}
              >
                <NumberInputField
                  placeholder="例: 180000"
                  onFocus={(e) => e.target.select()}
                  onInput={makeHalfWidthOnInput(setAmount)}
                />
              </NumberInput>
            </FormControl>

            <HStack justify="flex-end" fontSize="13px" spacing={6}>
              <Text>小計：{subtotal.toLocaleString()}円</Text>
              <Text>消費税：{tax.toLocaleString()}円</Text>
              <Text fontWeight="700" color={overBudget ? "red.500" : undefined}>
                総合計：{total.toLocaleString()}円 ／ 上限：
                {selectedProject.budget_limit.toLocaleString()}円
              </Text>
            </HStack>

            {overBudget && (
              <Text fontSize="12px" color="red.500" textAlign="right">
                見積金額が上限額を超えています
              </Text>
            )}

            <Text fontSize="12px" color="gray.500">
              金額以外の保存した内容は、請求タブで同じ請求番号を選ぶと引き継がれます（請求タブで上書き可能）。見積は省略しても請求書を作成できます
            </Text>

            <HStack>
              <Button colorScheme="blue" size="sm" onClick={handleSave} isLoading={saving}>
                見積を保存
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Box>
  );
}
