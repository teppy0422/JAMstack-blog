"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import Content from "../../components/content";

export default function BBSPage() {
  const [data, setData] = useState<any[]>([]); // 型を明示的に指定
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ip, setIp] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/BBS"); // APIエンドポイントを指定
      if (!response.ok) {
        console.error("Failed to fetch data:", response.statusText);
        return;
      }
      const jsonData = await response.json();
      setData(jsonData);
    };
    fetchData();
    // IPアドレスを取得
    const fetchIp = async () => {
      const response = await fetch("/api/ip");
      const json = await response.json();
      setIp(json.ip);
    };
    fetchIp();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = { title, content };
    // ここで新しい投稿をAPIに送信する処理を追加
    // 例: await fetch("/api/BBS", { method: "POST", body: JSON.stringify(newPost) });

    // 新しい投稿をローカルに追加
    setData([...data, newPost]);
    setTitle("");
    setContent("");
  };

  return (
    <Content isCustomHeader={true}>
      <Box p={5}>
        <Heading as="h1" mb={5}>
          掲示板
        </Heading>{" "}
        <Text mb={5}>IpAddress: {ip}</Text>
        <VStack spacing={4} align="stretch">
          {data.length > 0 ? (
            data.map((post, index) => (
              <Box key={index} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{post.title}</Heading>
                <Text mt={4}>{post.content}</Text>
              </Box>
            ))
          ) : (
            <Text>Loading...</Text>
          )}
        </VStack>
        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4}>
            新しい投稿
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="title" mb={4}>
              <FormLabel>タイトル</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id="content" mb={4}>
              <FormLabel>内容</FormLabel>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </FormControl>
            <Button type="submit" colorScheme="teal">
              投稿
            </Button>
          </form>
        </Box>
      </Box>
    </Content>
  );
}
