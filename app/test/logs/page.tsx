// app/logs/page.tsx
"use client";

import {
  Box,
  Heading,
  Text,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Log = {
  id: string;
  created_at: string;
  fullname: string;
  project: string;
  ver: string;
  ip: string;
  err: string;
  description: string;
  procedure: string;
  line: string;
};

export default function LogsPage() {
  const [logsByProject, setLogsByProject] = useState<Record<string, Log[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else if (data) {
        const grouped = data.reduce((acc: Record<string, Log[]>, log: Log) => {
          if (!acc[log.project]) acc[log.project] = [];
          acc[log.project].push(log);
          return acc;
        }, {});
        setLogsByProject(grouped);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Box p={8}>
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          エラー: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Heading mb={6}>エラーログ一覧</Heading>
      <Stack spacing={12}>
        {Object.entries(logsByProject).map(([project, logs]) => (
          <Box key={project}>
            <Heading size="md" mb={4}>
              プロジェクト: {project}
            </Heading>
            <Table size="sm" variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>日時</Th>
                  <Th>名前</Th>
                  <Th>バージョン</Th>
                  <Th>IP</Th>
                  <Th>エラー</Th>
                  <Th>説明</Th>
                  <Th>プロシージャ</Th>
                  <Th>行</Th>
                </Tr>
              </Thead>
              <Tbody>
                {logs.map((log) => (
                  <Tr key={log.id}>
                    <Td>{new Date(log.created_at).toLocaleString()}</Td>
                    <Td>{log.fullname}</Td>
                    <Td>{log.ver}</Td>
                    <Td>{log.ip}</Td>
                    <Td>{log.err}</Td>
                    <Td>{log.description}</Td>
                    <Td>{log.procedure}</Td>
                    <Td>{log.line}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Divider mt={6} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
