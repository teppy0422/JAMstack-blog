"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Stack,
  Box,
  Heading,
  Input,
  Button,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { supabase } from "../../utils/supabase/client";
import Link from "next/link";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";

export default function Threads() {
  const [threads, setThreads] = useState<any[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch("/api/ip");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };
    fetchIpAddress();
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    setLoading(true); // 追加
    const { data } = await supabase.from("threads").select("*");
    if (data) {
      setThreads(data);
    }
    setLoading(false); // 追加
  };

  const createThread = async () => {
    setLoading(true);
    await supabase.from("threads").insert([{ title: newThreadTitle }]);
    setNewThreadTitle("");
    await fetchThreads();
    setLoading(false);
  };

  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <Heading size="md" mb="4">
          スレッド一覧
        </Heading>
        {ipAddress}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Heading size="md" pr={2}>
              Loading...
            </Heading>
            <Spinner size="md" />
          </Box>
        ) : (
          threads.map((thread) => (
            <Stack spacing="6" mb="4" key={thread.id}>
              <Card>
                <Link href={`/thread/${thread.id}`}>
                  <CardBody>
                    <Box>
                      <Heading size="sm">{thread.title}</Heading>
                    </Box>
                  </CardBody>
                </Link>
              </Card>
            </Stack>
          ))
        )}
        <Divider />
        <Stack spacing="4" mt="4" direction="row" justify="flex-end">
          <Input
            type="text"
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            placeholder="新規スレッドのタイトル"
            size="md"
            bg="white"
            _focus={{ borderColor: "gray.400" }} // フォーカス時のボーダー色を変更
          />
          <Button onClick={createThread} colorScheme="teal" width="5em">
            新規作成
          </Button>
        </Stack>
      </Content>
    </>
  );
}
