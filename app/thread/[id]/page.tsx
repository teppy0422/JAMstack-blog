"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  FaUpload,
  FaPaperclip,
  FaDownload,
  FaPaperPlane,
} from "react-icons/fa";
import { supabase } from "../../../utils/supabase/client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Box,
  Flex,
  Heading,
  Stack,
  Card,
  CardBody,
  Input,
  Button,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Image,
  Divider,
  Text,
  Spinner,
  useColorMode,
  Avatar,
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
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false); // ズームインの状態を管理
  const { colorMode, toggleColorMode } = useColorMode(); //ダークモード
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //ログイン有無
  const [userId, setUserId] = useState<string | null>(null);

  // ... existing code ...
  const { isOpen, onOpen, onClose } = useDisclosure();
  // ユーザーIDを取得する関数
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      console.log(user?.id);
    };
    fetchUserId();
  }, []);
  //ログイン状態の確認
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, []);

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
    let originalFileName: string = "";
    if (selectedFile) {
      const filePath = await uploadFile(selectedFile);
      if (filePath) {
        const { data } = supabase.storage
          .from("uploads")
          .getPublicUrl(filePath);
        fileUrl = data?.publicUrl ?? "";
        originalFileName = selectedFile.name; // 元のファイル名を保存
        console.log("Public URL:", fileUrl);
      }
    }
    if (!newPostContent.trim() && !fileUrl) {
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("posts").insert([
      {
        thread_id: id,
        content: newPostContent,
        ip_address: ipAddress,
        file_url: fileUrl,
        original_file_name: originalFileName,
        user_uid: user?.id, // ログインしているユーザーのUIDを追加
      },
    ]);
    if (error) {
      console.error("Error creating post:", error.message);
    } else {
      setNewPostContent("");
      setSelectedFile(null);
      setSelectedFileName(null);
      scrollToBottom();
    }
  };
  //ファイルをアップロードする関数
  const uploadFile = async (file: File) => {
    const encodedFileName = encodeFileName(file.name);
    console.log("encodedFileName:", encodedFileName);

    // まずファイルが存在するか確認
    const { data: existingFile, error: checkError } = await supabase.storage
      .from("uploads")
      .list("public", { search: encodedFileName });

    if (checkError) {
      console.error("Error checking file existence:", checkError.message);
      return null;
    }

    let uploadResponse;
    if (existingFile && existingFile.length > 0) {
      // ファイルが存在する場合は更新
      uploadResponse = await supabase.storage
        .from("uploads")
        .update(`public/${encodedFileName}`, file);
    } else {
      // ファイルが存在しない場合は新規アップロード
      uploadResponse = await supabase.storage
        .from("uploads")
        .upload(`public/${encodedFileName}`, file);
    }

    const { data, error } = uploadResponse;
    if (error) {
      console.error("Error uploading file:", error.message);
      return null;
    }
    console.log("File uploaded:", data.path);
    return data.path;
  };
  const encodeFileName = (fileName: string) => {
    const now = new Date();
    const yyyymmddhhnnss = now
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14);
    const extension = fileName.split(".").pop();
    return `${yyyymmddhhnnss}.${extension}`;
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("aaa:", file.type);
      setSelectedFile(file); // 選択されたファイルを設定
      setSelectedFileName(file.name); // ファイル名を設定
    }
  };

  //添付ファイルをキャンセルする関数
  const handleFileRemove = () => {
    setSelectedFile(null);
    setSelectedFileName(null);
  };
  //添付ファイルを選択するボタンをクリック
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  //ファイルをダウンロードする関数
  const handleDownload = async (url: string, originalFileName: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", originalFileName || "download");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };
  //日付をフォーマットする関数
  const formatDate = (
    dateString: string,
    prevDateString?: string,
    isTimeOnly?: boolean
  ) => {
    const date = new Date(dateString);
    const prevDate = prevDateString ? new Date(prevDateString) : null;
    if (isTimeOnly) {
      return format(date, "H:mm", { locale: ja });
    }
    if (prevDate) {
      const isSameYear = date.getFullYear() === prevDate.getFullYear();
      const isSameMonth = isSameYear && date.getMonth() === prevDate.getMonth();
      const isSameDay = isSameMonth && date.getDate() === prevDate.getDate();

      if (isSameMonth) {
        return format(date, "M/d", { locale: ja }).replace(/ /g, "\n");
      }
    }
    return format(date, "yyyy M/d", { locale: ja }).replace(/ /g, "\n");
  };

  //アバター作成
  const getAvatarProps = (post_userID: any, userId: any, isReturn: boolean) => {
    if (isReturn) {
      return (
        <Avatar
          size="sm"
          {...(post_userID === "6cc1f82e-30a5-449b-a2fe-bc6ddf93a7c0"
            ? { name: "自分", src: "https://bit.ly/dan-abramov" }
            : {
                src: "https://bit.ly/broken-link",
              })}
          ml={0}
        />
      );
    }
  };
  //投稿時刻の表示
  const getTimeStamp = (
    time_stamp: string,
    isRight: boolean,
    isReturn: boolean
  ) => {
    if (isReturn) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          fontSize="13px"
          color="gray.500"
          whiteSpace="pre-wrap" // 改行を適用するために変更
          textAlign="center"
          mr={isRight ? "-2" : "0"} // メッセージとの間にマージンを追加
          ml={isRight ? "0" : "-2"}
          mb="1.5"
          alignSelf={isRight ? "flex-start" : "flex-end"} // 追加
          lineHeight="1" // 行間を短くするために追加
        >
          {time_stamp}
        </Box>
      );
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <Content isCustomHeader={true}>
      <Heading size="md" mb="1" ml="1">
        {threadTitle}
      </Heading>
      <Box ml="1">{ipAddress}</Box>
      <Stack spacing="2" mb="4" style={{ padding: "0px" }}>
        {posts
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          ) // created_atでソート

          .map((post, index, sortedPosts) => {
            const prevPost = posts[index - 1];
            const prevDateString = prevPost ? prevPost.created_at : undefined;
            const isNewDay =
              index === 0 || // 一番最初の投稿の場合
              (prevDateString &&
                new Date(post.created_at).toDateString() !==
                  new Date(prevDateString).toDateString());
            return (
              <>
                {/* 日付の区切り線 */}
                {isNewDay && (
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    mb="1.5"
                  >
                    <Divider borderColor="gray.500" />
                    <Text
                      fontSize="15px"
                      color="gray.500"
                      whiteSpace="pre-wrap"
                      textAlign="center"
                      mx="2"
                      lineHeight="1.2"
                    >
                      {formatDate(post.created_at, prevDateString, false)}
                    </Text>
                    <Divider borderColor="gray.500" />
                  </Flex>
                )}

                <Flex
                  key={post.id}
                  justifyContent={
                    post.user_uid === userId ? "flex-end" : "flex-start"
                  } // IPアドレスに基づいて位置を調整
                  maxWidth="100%" // メッセージの最大幅を設定
                >
                  {getTimeStamp(
                    formatDate(post.created_at, prevDateString, true),
                    false,
                    post.user_uid === userId
                  )}
                  {getAvatarProps(
                    post.user_uid,
                    userId,
                    post.user_uid !== userId
                  )}
                  <Card
                    style={{
                      backgroundColor:
                        post.user_uid === userId ? "#DCF8C6" : "#FFFFFF", // 自分のメッセージは緑、他人のメッセージは白
                      borderRadius: "10px",
                      padding: "0px",
                      margin:
                        post.user_uid === userId ? "0 12px 0 4px" : "0 12px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 影を追加
                    }}
                  >
                    <CardBody px="10px" py="10px">
                      <Box
                        color="black"
                        dangerouslySetInnerHTML={{
                          __html: post.content.replace(/\n/g, "<br />"),
                        }}
                      />
                      {post.file_url && (
                        <>
                          {post.file_url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                            <Image
                              src={post.file_url}
                              alt="Uploaded image"
                              cursor="pointer"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "300px",
                                marginTop: "1px",
                              }} // 最大サイズを指定
                              onClick={() => {
                                setSelectedImageUrl(post.file_url);
                                setFileModalOpen(true);
                              }}
                            />
                          ) : (
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleDownload(
                                  post.file_url,
                                  post.original_file_name
                                );
                              }}
                              variant="solid"
                              mt="10px"
                              leftIcon={<FaDownload />}
                              bg="white"
                              color="black"
                            >
                              ダウンロード
                            </Button>
                          )}
                        </>
                      )}
                    </CardBody>
                    {/* 吹き出し */}
                    <Box
                      style={{
                        position: "absolute",
                        top: "5px",
                        left: post.user_uid === userId ? "auto" : "-10px",
                        right: post.user_uid === userId ? "-10px" : "auto",
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth:
                          post.user_uid === userId
                            ? "5px 0 10px 15px"
                            : "5px 15px 10px 0",
                        borderColor:
                          post.user_uid === userId
                            ? "transparent transparent transparent #DCF8C6"
                            : "transparent #FFFFFF transparent transparent",
                      }}
                    />
                  </Card>
                  {getTimeStamp(
                    formatDate(post.created_at, prevDateString, true),
                    false,
                    post.user_uid !== userId
                  )}
                  {getAvatarProps(
                    post.user_uid,
                    userId,
                    post.user_uid === userId
                  )}
                </Flex>
              </>
            );
          })}
      </Stack>

      <Stack spacing="4" mt="4" direction="row" justify="flex-end" mb="4">
        <Tooltip
          label="添付ファイルを選択"
          aria-label="添付ファイルを選択"
          cursor="pointer"
        >
          <Button
            onClick={handleButtonClick}
            position="relative"
            display="inline-block"
            cursor="pointer"
            p="0"
          >
            <IconButton
              aria-label="Upload file"
              icon={<FaUpload />}
              colorScheme={colorMode === "light" ? "purple" : "yellow"}
              zIndex="0"
            />
            <Input
              type="file"
              accept="image/*,.xlsm,.xlsx,.xls,.csv,.txt,.zip,.pdf,.doc,.docx,.7z,.gif" // 画像ファイルとExcelファイルとかを許可
              ref={fileInputRef}
              onChange={handleFileChange}
              position="absolute"
              top="0"
              left="0"
              opacity="0"
              width="100%"
              height="100%"
              zIndex="1"
              title=""
              aria-label="Upload file" // ここにaria-labelを追加
              name=""
              display="none"
            />
          </Button>
        </Tooltip>
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
          placeholder="メッセージを入力 (Shift+Enterで送信)"
          paddingTop={2}
          size="md"
          color="black"
          bg="white"
          resize="none"
          borderRadius="5px"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
            target.style.overflow = "hidden";
          }}
          _placeholder={{ color: "gray.500" }} // placeholderの文字色を指定
        />
        <IconButton
          onClick={() => {
            setIsSubmitting(true); //post開始
            createPost();
            setNewPostContent(""); //クリア
            const textarea = document.querySelector("textarea");
            if (textarea) {
              textarea.style.height = "41px"; // 高さを初期状態に戻す
            }
            setIsSubmitting(false); //post終了
          }}
          icon={
            isSubmitting ? (
              <Spinner
                size="36px"
                color={colorMode === "light" ? "purple" : "yellow"}
              />
            ) : (
              <FaPaperPlane
                color={colorMode === "light" ? "purple" : "yellow"}
                style={{ transform: "rotate(45deg)" }}
                size="36px"
              />
            )
          }
          bg="none"
          top={-1}
          left={-2}
          isDisabled={!newPostContent.trim() && !selectedFile} // テキストが空で、添付ファイルが無い場合はボタンを無効化
          aria-label="送信"
        />
        <audio ref={audioRef} src="/sound/notification.mp3" />
      </Stack>
      {selectedFileName && (
        <Tooltip
          label="添付をキャンセルします"
          aria-label="添付をキャンセルします"
        >
          <Box
            display="inline-flex"
            alignItems="center"
            mt="2"
            p="2"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            bg="gray.50"
            width="auto"
            cursor="pointer"
            onClick={handleFileRemove} // クリックイベントを追加
          >
            <FaPaperclip style={{ marginRight: "8px" }} />
            <Box>{selectedFileName}</Box>
          </Box>
        </Tooltip>
      )}
      <Modal isOpen={fileModalOpen} onClose={() => setFileModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          {/* <ModalCloseButton position="absolute" top="10px" right="-10px" /> */}
          <ModalBody
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={0}
            onClick={() => setIsZoomed(!isZoomed)} // クリックでズームイン/アウトを切り替え
          >
            {selectedImageUrl && (
              <Image
                src={selectedImageUrl}
                alt="Uploaded image"
                maxW={isZoomed ? "99vw" : "80vw"} // ズームイン時は制限なし
                maxH={isZoomed ? "99vh" : "80vh"} // ズームイン時は制限なし
                objectFit="contain" // 画像がモーダルの範囲内に収まるようにする
                cursor={isZoomed ? "zoom-out" : "zoom-in"} // ズームイン/アウトのカーソルを設定
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Content>
  );
}
