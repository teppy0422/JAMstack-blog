"use client";

import { useRef, useState } from "react";
import { Box, Heading, Text, VStack, Divider, useColorMode } from "@chakra-ui/react";
import type { ScheduleProject } from "./GanttSummary";
import EstimateForm from "./EstimateForm";
import EstimateListTab from "./EstimateListTab";

export default function EstimateTab({
  userId,
  projects,
  loading,
  onChanged,
}: {
  userId: string;
  projects: ScheduleProject[];
  loading: boolean;
  onChanged: () => void;
}) {
  const { colorMode } = useColorMode();
  const color =
    colorMode === "light" ? "custom.theme.light.900" : "custom.theme.dark.100";
  const [projectId, setProjectId] = useState<string>("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleEdit = (id: number) => {
    setProjectId(String(id));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Box ref={formRef}>
        <Heading size="sm" mb={2} color={color}>
          見積
        </Heading>
        <EstimateForm
          userId={userId}
          projects={projects}
          projectId={projectId}
          onProjectIdChange={setProjectId}
          onSaved={onChanged}
        />
      </Box>

      <Divider />

      <Box>
        <Heading size="sm" mb={2} color={color}>
          保存済み見積
        </Heading>
        {loading ? (
          <Text fontSize="13px" color="gray.500">
            読み込み中...
          </Text>
        ) : (
          <EstimateListTab projects={projects} onEdit={handleEdit} onChanged={onChanged} />
        )}
      </Box>
    </VStack>
  );
}
