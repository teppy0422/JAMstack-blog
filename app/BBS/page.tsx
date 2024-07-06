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
} from "@chakra-ui/react";
import { supabase } from "../../utils/supabase/client";
import Link from "next/link";
import Content from "../../components/content";

export default function Threads() {
  const [threads, setThreads] = useState<any[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState("");

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    const { data } = await supabase.from("threads").select("*");
    if (data) {
      setThreads(data);
    }
  };

  const createThread = async () => {
    await supabase.from("threads").insert([{ title: newThreadTitle }]);
    setNewThreadTitle("");
    fetchThreads();
  };

  return (
    <>
      <Content isCustomHeader={true}>
        <Heading size="md" mb="4">
          スレッド一覧
        </Heading>
        {threads.map((thread) => (
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
        ))}
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
