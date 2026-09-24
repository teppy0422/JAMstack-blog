"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Heading, Text, VStack, Divider, useColorMode } from "@chakra-ui/react";
import { useUserContext } from "@/contexts/useUserContext";
import { supabase } from "@/utils/supabase/client";
import Content from "@/components/content";
import GanttSummary, { ScheduleEntry, ScheduleProject } from "./parts/GanttSummary";
import EntryForm from "./parts/EntryForm";
import EntryList from "./parts/EntryList";

export default function ScheduleBlogPage() {
  const { colorMode } = useColorMode();
  const { currentUserId, currentUserCompany, isLoading } = useUserContext();
  const [projects, setProjects] = useState<ScheduleProject[]>([]);
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const isDev = currentUserCompany === "開発";

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    const [{ data: projectData }, { data: entryData }] = await Promise.all([
      supabase.from("schedule_projects").select("*").order("id"),
      supabase.from("schedule_entries").select("*").order("work_date"),
    ]);
    setProjects(projectData || []);
    setEntries(entryData || []);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchData();
    }
  }, [currentUserId, fetchData]);

  const color =
    colorMode === "light" ? "custom.theme.light.900" : "custom.theme.dark.100";

  const existingCategories = Array.from(new Set(entries.map((e) => e.category)));

  if (isLoading) {
    return null;
  }

  return (
    <Content maxWidth="900px">
      <Box py={6}>
        <Heading size="md" mb={4} color={color}>
          スケジュール実績管理
        </Heading>

        {!currentUserId ? (
          <Text fontSize="14px" color="gray.500" py={12} textAlign="center">
            閲覧するにはログインが必要です
            <br />
            右上のアイコンからログインしてください
          </Text>
        ) : (
          <>
            <Box mb={6}>
              {loadingData ? (
                <Text fontSize="13px" color="gray.500">
                  読み込み中...
                </Text>
              ) : (
                <GanttSummary projects={projects} entries={entries} showBudget={isDev} />
              )}
            </Box>

            {isDev ? (
              <VStack align="stretch" spacing={4}>
                <Divider />
                <Box>
                  <Heading size="sm" mb={2} color={color}>
                    実績を登録
                  </Heading>
                  <EntryForm
                    userId={currentUserId}
                    projects={projects}
                    existingCategories={existingCategories}
                    onSaved={fetchData}
                  />
                </Box>

                <Box>
                  <Heading size="sm" mb={2} color={color}>
                    実績一覧
                  </Heading>
                  <EntryList entries={entries} projects={projects} onChanged={fetchData} />
                </Box>
              </VStack>
            ) : (
              <Text fontSize="12px" color="gray.500" mt={4}>
                スケジュールの登録・編集は開発担当のみ行えます
              </Text>
            )}
          </>
        )}
      </Box>
    </Content>
  );
}
