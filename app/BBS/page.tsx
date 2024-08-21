"use client";

import { useEffect, useState } from "react";
import { MdChat } from "react-icons/md"; // 追加

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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
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
  //新規スレッド作成
  const createThread = async () => {
    setLoading(true);
    await supabase.from("threads").insert([{ title: newThreadTitle }]);
    setNewThreadTitle("");
    await fetchThreads();
    setLoading(false);
  };
  // スレッドを会社ごとにグループ化
  const groupedThreads = threads.reduce((acc, thread) => {
    if (!acc[thread.company]) {
      acc[thread.company] = []; // 会社名がまだない場合は新しい配列を作成
    }
    acc[thread.company].push(thread); // スレッドを会社名の配列に追加
    return acc;
  }, {});
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
          <Accordion
            allowMultiple
            defaultIndex={Object.keys(groupedThreads).map((_, index) => index)}
          >
            {Object.keys(groupedThreads)
              .sort((a, b) => {
                if (a === "開発") return -1; // "開発" を最初に
                if (b === "開発") return 1;
                return 0; // その他はそのまま
              })
              .map((company) => (
                <AccordionItem key={company} borderTop="1px solid gray" my={2}>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        <Heading size="md">{company}</Heading>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {groupedThreads[company].map(
                      (
                        thread // スレッドを表示
                      ) => (
                        <Link href={`/thread/${thread.id}`}>
                          <Box
                            _hover={{
                              textDecoration: "underline",
                              textDecorationThickness: "1px",
                              textUnderlineOffset: "3px",
                            }}
                            py={1}
                          >
                            <Icon as={MdChat} boxSize={4} mr={1} />
                            {thread.title}
                          </Box>
                        </Link>
                      )
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
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
