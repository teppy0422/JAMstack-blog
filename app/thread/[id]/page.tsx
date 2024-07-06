"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase/client";
import {
  Box,
  Heading,
  Stack,
  Card,
  CardBody,
  Input,
  Button,
} from "@chakra-ui/react";
import Content from "../../../components/content";

export default function Thread() {
  const router = useRouter();
  const { id } = useParams() as { id: string }; // useParamsを使用してidを取得
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && id) fetchPosts();
  }, [isClient, id]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("thread_id", id);
    setPosts(data || []);
  };

  const createPost = async () => {
    await supabase
      .from("posts")
      .insert([{ thread_id: id, content: newPostContent }]);
    setNewPostContent("");
    fetchPosts();
  };

  if (!isClient) {
    return null; // クライアントサイドでのみレンダリング
  }

  return (
    <Content isCustomHeader={true}>
      <Heading size="md" mb="4">
        スレッド詳細
      </Heading>
      <Stack spacing="6" mb="4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardBody>
              <Box>{post.content}</Box>
            </CardBody>
          </Card>
        ))}
      </Stack>
      <Input
        type="text"
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        placeholder="新規投稿内容"
        size="md"
        bg="white"
        _focus={{ borderColor: "gray.400" }}
      />
      <Button onClick={createPost} colorScheme="teal" width="auto">
        投稿
      </Button>
    </Content>
  );
}
