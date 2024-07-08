"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
  const { id } = useParams() as { id: string };
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && id) {
      fetchPosts();

      const channel = supabase
        .channel(`public:posts:thread_id=eq.${id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "posts",
            filter: `thread_id=eq.${id}`,
          },
          (payload) => {
            setPosts((prevPosts) => [...prevPosts, payload.new]);
            if (audioRef.current) {
              audioRef.current.play();
            }
            // タブのタイトルを点滅させる
            let originalTitle = document.title;
            let blinkInterval = setInterval(() => {
              document.title =
                document.title === "新しい投稿があります！"
                  ? originalTitle
                  : "新しい投稿があります！";
            }, 1000);
            setTimeout(() => {
              clearInterval(blinkInterval);
              document.title = originalTitle;
            }, 5000); // 5秒後に点滅を停止
            // デスクトップ通知を表示
            if (Notification.permission === "granted") {
              new Notification("新しい投稿があります！");
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  new Notification("新しい投稿があります！");
                }
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isClient, id]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("thread_id", id);
    setPosts(data || []);
  };

  const createPost = async () => {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;

    const { error } = await supabase
      .from("posts")
      .insert([
        { thread_id: id, content: newPostContent, ip_address: ipAddress },
      ]);

    if (error) {
      console.error("Error creating post:", error);
    } else {
      setNewPostContent("");
      // fetchPosts() を呼び出さない
    }
  };

  if (!isClient) {
    return null;
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
      <Stack spacing="4" mt="4" direction="row" justify="flex-end">
        <Input
          _focus={{ _focus: "none" }}
          as="textarea"
          type="text"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="新規投稿内容"
          paddingTop={2}
          size="md"
          rows={3}
          bg="white"
          resize="none"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
            target.style.overflow = "hidden";
          }}
        />
        <Button
          onClick={() => {
            createPost();
            setNewPostContent("");
            const textarea = document.querySelector("textarea");
            if (textarea) {
              textarea.style.height = "auto"; // 高さを初期状態に戻す
            }
          }}
          colorScheme="teal"
          width="auto"
        >
          投稿
        </Button>
        <audio ref={audioRef} src="/sound/notification.mp3" />
      </Stack>
    </Content>
  );
}
