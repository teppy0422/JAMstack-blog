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
  const [ipAddress, setIpAddress] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && id) {
      const fetchIpAddress = async () => {
        const ipResponse = await fetch("/api/ip");
        const ipData = await ipResponse.json();
        setIpAddress(ipData.ip);
      };
      const fetchThreadTitle = async () => {
        const { data } = await supabase
          .from("threads")
          .select("title")
          .eq("id", id)
          .single();
        setThreadTitle(data?.title || ""); // スレッドタイトルを設定
      };
      fetchIpAddress();
      fetchThreadTitle();
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

  //投稿を表示
  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("thread_id", id);
    setPosts(data || []);
  };
  // 投稿する
  const createPost = async () => {
    let fileUrl: string = "";
    if (selectedFile) {
      const filePath = await uploadFile(selectedFile);
      if (filePath) {
        const { data } = supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);
        fileUrl = data?.publicUrl ?? "";
        console.log("Public URL:", fileUrl); // 取得したパブリックURLをログ出力
      }
    }

    const { error } = await supabase.from("posts").insert([
      {
        thread_id: id,
        content: newPostContent,
        ip_address: ipAddress,
        file_url: fileUrl,
      },
    ]);

    if (error) {
      console.error("Error creating post:", error);
    } else {
      setNewPostContent("");
      setSelectedFile(null);
      scrollToBottom();
    }
  };
  //ボトムにスクロール
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      createPost();
      setNewPostContent("");
      const textarea = e.target as HTMLTextAreaElement;
      textarea.style.height = "auto"; // 高さを初期状態に戻す
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  //ファイルをアップロードする関数
  const uploadFile = async (file: File) => {
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(`public/${file.name}`, file);
    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }
    console.log("File uploaded:", data.path); // アップロードされたファイルパスをログ出力
    return data.path;
  };

  if (!isClient) {
    return null;
  }

  return (
    <Content isCustomHeader={true}>
      <Heading size="md" mb="4">
        {threadTitle}
      </Heading>
      <Box>{ipAddress}</Box>
      <Stack spacing="2" mb="4" style={{ padding: "0px" }}>
        {posts.map((post) => (
          <Box
            key={post.id}
            alignSelf={
              post.ip_address === ipAddress ? "flex-end" : "flex-start"
            } // IPアドレスに基づいて位置を調整
            maxWidth="90%" // メッセージの最大幅を設定
          >
            <Card
              key={post.id}
              style={{
                backgroundColor:
                  post.ip_address === ipAddress ? "#DCF8C6" : "#FFFFFF", // 自分のメッセージは緑、他人のメッセージは白
                borderRadius: "10px",
                padding: "0px",
                position: "relative",
                margin: "1px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 影を追加
              }}
            >
              <CardBody px="10px" py="5px">
                <Box>{post.content}</Box>
                {post.file_url && (
                  <>
                    {post.file_url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <img
                        src={post.file_url}
                        alt="Uploaded image"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          marginTop: "1px",
                        }} // 最大サイズを指定
                      />
                    ) : (
                      <a
                        href={post.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "block", marginTop: "10px" }} // リンクのスタイルを調整
                      >
                        ダウンロードファイル
                      </a>
                    )}
                  </>
                )}
              </CardBody>
              <Box
                style={{
                  position: "absolute",
                  top: "10px",
                  left: post.ip_address === ipAddress ? "auto" : "-10px",
                  right: post.ip_address === ipAddress ? "-10px" : "auto",
                  width: 0,
                  height: 0,
                  borderStyle: "solid",
                  borderWidth:
                    post.ip_address === ipAddress
                      ? "2px 0 10px 10px"
                      : "2px 10px 10px 0",
                  borderColor:
                    post.ip_address === ipAddress
                      ? "transparent transparent transparent #DCF8C6"
                      : "transparent #FFFFFF transparent transparent",
                }}
              />
            </Card>
          </Box>
        ))}
      </Stack>
      <Stack spacing="4" mt="4" direction="row" justify="flex-end">
        <Input
          _focus={{ _focus: "none" }}
          as="textarea"
          type="text"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            handleKeyDown(
              e as unknown as React.KeyboardEvent<HTMLTextAreaElement>
            )
          } // 型を明示的に指定
          placeholder="新規投稿内容 （Shift+Enterで投稿）"
          paddingTop={2}
          size="md"
          color="black"
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
      <Input
        type="file"
        accept="image/*,.xlsm,.xlsx,.xls,.csv,.txt" // 画像ファイルとExcelファイルとかを許可
        onChange={handleFileChange}
        bg="white"
        color="black"
      />
    </Content>
  );
}
