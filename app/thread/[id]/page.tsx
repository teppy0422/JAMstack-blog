"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  FaPaperclip,
  FaDownload,
  FaPaperPlane,
  FaTimes,
  FaTrashAlt,
  FaReply,
  FaArrowDown,
  FaCheck,
} from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { BsSend } from "react-icons/bs";
import { supabase } from "../../../utils/supabase/client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import "@fontsource/noto-sans-jp";
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
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Icon,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import Content from "../../../components/content";
import SidebarBBS from "../../../components/sidebarBBS";

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
  //PCとスマホ
  //長押し
  const [isLongPress, setIsLongPress] = useState(false);
  const [longPressPostId, setLongPressPostId] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<"delete" | "reply" | null>(
    null
  );
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // スマートフォンかどうかを判別
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  // 現在のユーザーIDを取得する関数
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        console.log("userログインしたよ", user);
        setUserId(user.id);
        console.log("userId", userId);
      } else {
        console.error("User is not logged in.aaaaaaaaaaaaaaaaa");
        setUserId(null);
      }
    };
    fetchUserId();
  }, []);
  //既読チェック
  const masterUserId = "6cc1f82e-30a5-449b-a2fe-bc6ddf93a7c0"; // 任意のユーザーID
  useEffect(() => {
    const handleScroll = () => {
      const postsElements = document.querySelectorAll(".post"); // 投稿要素を取得
      postsElements.forEach((postElement) => {
        const postId = postElement.getAttribute("data-post-id"); // 投稿IDを取得
        const isInViewport = isElementInViewport(postElement); // ビューポート内にあるか確認
        if (isInViewport) {
          const postUserId = postElement.getAttribute("data-user-id"); // 投稿のユーザーIDを取得
          if (postUserId !== userId) {
            if (postId && userId) {
              markAsRead(postId, userId); // 既読をマーク
            }
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [userId]);
  const markAsRead = async (postId: string, userId: string) => {
    // 現在のread_byの値を取得
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("read_by")
      .eq("id", postId)
      .single();
    if (fetchError) {
      return;
    }
    // userIdが既に存在する場合は何もしない
    if (post.read_by?.includes(userId)) {
      return; // 既に登録されている場合は処理を終了
    } else {
    }
    // read_byにuserIdを追加
    const updatedReadBy = [...(post.read_by || []), userId];
    // 更新を実行
    const { error } = await supabase
      .from("posts")
      .update({ read_by: updatedReadBy }) // 更新する配列を指定
      .eq("id", postId);
    if (error) {
      console.error("Error marking post as read:", error.message);
    } else {
      console.log("post marked as read:", postId);
    }
  };
  const isElementInViewport = (el: Element) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
  // 長押しイベント
  const [longPressTimeout, setLongPressTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const handleLongPressStart = (postId: string) => {
    const timeout = setTimeout(() => {
      setIsLongPress(true);
      setLongPressPostId(postId);
    }, 333);
    clearTimeout(longPressTimeout!); // 追加: タイマーをクリア
    setLongPressTimeout(timeout);
  };
  const handleLongPressEnd = () => {
    setIsLongPress(false);
    setLongPressPostId(null);
  };
  const handleMouseEnter = (buttonType: "delete" | "reply") => {
    setHoveredButton(buttonType);
  };
  const handleMouseUp = () => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout); // タイマーをクリア
    }
  };
  const handleMouseLeave = () => {
    // handleLongPressEnd(); // 長押しを終了
    setHoveredButton(null);
  };
  //postの削除
  const handleDeletePost = async (postId: string) => {
    // 削除する投稿を取得
    const postToDelete = posts.find((post) => post.id === postId);
    if (postToDelete) {
      const fileUrl = postToDelete.file_url; // file_urlを取得
      // ストレージからファイルを削除
      if (fileUrl) {
        const filePath = fileUrl
          .split("/storage/v1/object/public/uploads/")
          .pop(); // public以下のパスを取得
        // fullPathの設定を修正
        const fullPath = filePath; // publicを含まないパスを指定
        const { error: deleteFileError } = await supabase.storage
          .from("uploads")
          .remove([fullPath]); // 修正: publicを含まないパスを指定
        if (deleteFileError) {
          console.error(
            "Error deleting file from storage:",
            deleteFileError.message
          );
          alert(deleteFileError.message);
        } else {
          // alert("ファイルが正常に削除されました。" + fullPath);
        }
      }
    }
    // 投稿を削除;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      console.error("Error deleting post:", error.message);
    } else {
      // 削除成功時に要素を非表示にする
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, isDeleting: true } : post
        )
      );
      // 1秒後に要素を完全に削除
      setTimeout(() => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      }, 1000);
    }
  };
  // ユーザー情報を検索する関数
  const getUserById = (id: string) => {
    const user = usersData2.find((user) => user.id === id); // IDでユーザーを検索
    if (user) {
      return {
        displayName: user.user_metadata?.name,
        userCompany: user.user_company,
      };
    }
    return null;
  };
  //ユーザー名を取得
  //postのリプライ
  const [replyToPostId, setReplyToPostId] = useState<string | null>(null); // リプライ対象の投稿ID
  const [replyPostContent, setReplyPostContent] = useState<string>(""); // リプライ対象の投稿内容
  const [replyPostUserId, setReplyPostUserId] = useState<string | null>(null); // リプライ対象のユーザーID
  const [replyPostFileUrl, setReplyPostFileUrl] = useState<string | null>(null); // リプライ対象のファイルURL
  const [replyPostId, setReplyPostId] = useState<string | null>(null); // replyPostIdを新たに作成
  const [replyPostUserDisplayName, setReplyPostUserDisplayName] = useState<
    string | null
  >(null); // 追加: リプライ対象のユーザー表示名を管理する状態
  const [replyPostUserCompany, setReplyPostUserCompany] = useState<
    string | null
  >(null); // 追加: リプライ対象のユーザー会社を管理する状態
  //リプライ情報を取得
  const handleReplyPost = async (postId: string) => {
    const post = posts.find((p) => p.id === postId); // 対象の投稿を取得
    if (post) {
      setReplyPostContent(post.content); // 投稿内容を設定
      setReplyPostUserId(post.user_uid); // ユーザーIDを設定
      setReplyPostFileUrl(post.file_url); // ファイルURLを設定
      // displayNameとuser_companyを取得
      const userDisplayNameData = await fetchUserFromTable(post.user_uid); // post.user_uidを引数に渡す
      const displayName = userDisplayNameData?.displayName; // nullチェックを追加
      const userCompany = userDisplayNameData?.userCompany; // nullチェックを追加
      setReplyPostUserDisplayName(displayName as string | null); // displayNameを状態に設定
      setReplyPostUserCompany(userCompany as string | null); // userCompanyを状態に設定
    }
    setReplyToPostId(postId); // リプライ対象投稿IDを設定
    // フォーカスを入力フィールドに当てる
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.focus(); // フォーカスを設定
    }
  };
  //newユーザー情報
  const [usersData2, setUsersData2] = useState<any[]>([]); // ユーザー情報の状態
  const [targetUser, setTargetUser] = useState<any | null>(null); // 特定のユーザー情報の状態
  const [postUserIds, setPostUserIds] = useState<string[]>([]);

  useEffect(() => {
    console.log("fetchUsers2-1"); // 追加: 実行確認用のログ
    const fetchUsers2 = async () => {
      // table_usersからすべてのデータを取得
      const { data: usersData, error: usersError } = await supabase
        .from("table_users")
        .select("*"); // すべての情報を取得
      if (usersError) {
        console.log(
          "Error fetching users from table_users:",
          usersError.message
        );
        return;
      }
      // 取得したデータを状態にセット
      setUsersData2(usersData || []);
      // 取得したデータ内容をコンソールに出力
      console.log("userData2取得したよーーー:", usersData);
    };
    fetchUsers2();
  }, []);
  // 特定のユーザーIDでユーザー情報を取得する関数
  const [postUserId, setPostUserId] = useState("");
  const [postAvatarUrl, setPostAvatarUrl] = useState("");
  const getUserById2 = (userId: string) => {
    const user = usersData2.find((user) => user.id === userId); // ユーザーIDで検索
    // setTargetUser(user || null); // 特定のユーザー情報を状態にセット
    // setPostAvatarUrl(user.picture_url);
  };
  //ユーザー情報
  let postCount = 0;
  const [userInfo, setUserInfo] = useState<any[]>([]); // ユーザー情報の配列
  const fetchUserInfo = async (userId: string) => {
    if (!userId) {
      console.error("User ID is not provided;;;;;;", userId);
      return null;
    }
    const existingUser = userInfo.find((user) => user.id === userId); // userInfoから既存のユーザーを検索
    if (existingUser) {
      return existingUser; // 既存のユーザー情報を返す
    }
    const fetchedUser = await fetchUserFromTable(userId); // Supabaseからユーザー情報を取得
    if (fetchedUser) {
      setUserInfo((prev) => [...prev, { id: userId, ...fetchedUser }]); // userInfoに追加
    }
    return fetchedUser; // 取得したユーザー情報を返す
  };
  const fetchAndSetUserInfo = async (post_userID: any) => {
    if (!post_userID) {
      return;
    }
    const userInfo = await fetchUserInfo(post_userID); // ユーザー情報を取得
    if (userInfo) {
      setUserInfo((prev) => [...prev, userInfo]); // ここでuserInfoを状態に追加
    } else {
      console.error(`User with ID ${post_userID} not found`); // ユーザーが見つからない場合のエラーログ
      // ここでデフォルトのユーザー情報を設定することも検討できます
      setUserInfo((prev) => [
        ...prev,
        { id: post_userID, displayName: "Unknown User" },
      ]);
    }
  };
  const fetchUserFromTable = async (userId: string) => {
    const { data, error } = await supabase
      .from("table_users") // 新しいテーブル名を指定
      .select("user_metadata->name, user_company,picture_url") // displayNameとuser_companyを取得
      .eq("id", userId) // 引数のuserIdでフィルタリング
      .single();
    if (error) {
      console.error("Error fetching user display name:", error.message);
      return null;
    }
    return {
      displayName: data.name || null, // user_metadataを直接参照
      userCompany: data.user_company || null, // user_companyを返す
      userPicture: data.picture_url || null,
    };
  };
  //スクロール位置がボトムにあるかを管理する状態
  const [isAtBottom, setIsAtBottom] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsAtBottom(
        window.scrollY + window.innerHeight >= document.body.scrollHeight - 50
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // 現在のユーザーIDを取得する関数
  const getCurrentUserId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id;
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    if (isAtBottom && blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null; // クリア後にnullに設定
      console.log("Interval cleared because isAtBottom is true");
    }
  }, [isAtBottom]);
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
            const originalTitle = document.title;
            const blinkInterval = setInterval(() => {
              document.title =
                document.title === "新しい投稿があります！"
                  ? originalTitle
                  : "新しい投稿があります！";
            }, 1000);
            setTimeout(() => {
              clearInterval(blinkInterval);
              document.title = originalTitle;
            }, 10000); // 5秒後に点滅を停止
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
        //リプライの内容
        reply_post_id: replyToPostId,
        reply_content: replyPostContent,
        reply_user_id: replyPostUserId,
        reply_file_url: replyPostFileUrl,
      },
    ]);
    if (error) {
      console.error("Error creating post:", error.message);
    } else {
      setNewPostContent("");
      setSelectedFile(null);
      setSelectedFileName(null);
      setReplyToPostId(null); // 追加: リプライ対象の投稿IDをリセット
      setReplyPostContent(""); // 追加: リプライ内容をリセット
      setReplyPostUserId(null); // 追加: リプライ対象のユーザーIDをリセット
      setReplyPostFileUrl(null); // 追加: リプライ対象のファイルURLをリセット
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // デバッグ情報を追加
    const userName = getUserById(user?.id ?? "");

    if (userName === null) {
      alert("ダウンロードするにはログインと管理者によるマスター登録が必要です");
      return;
    }
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
        return `${format(date, "M/d", { locale: ja })} (${format(date, "E", {
          locale: ja,
        })})`;
      }
    }
    return `${format(date, "yyyy M/d", { locale: ja })} (${format(date, "E", {
      locale: ja,
    })})`;
  };
  //リプライの名前を取得
  useEffect(() => {
    const fetchDisplayName = async (id_) => {
      let user = userInfo.find((user) => user.id === id_); // ユーザー情報を取得
      if (!user) {
        user = await fetchAndSetUserInfo(id_); // ユーザー情報を取得して状態に保存
      }
      setReplyPostUserDisplayName(user?.displayName || "不明"); // displayNameがundefinedの場合のデフォルト値
    };
    fetchDisplayName(replyPostUserId);
  }, [replyPostUserId, userInfo]); // 依存関係に追加

  //アバター
  const getAvatarProps = (
    post_userID: any,
    isReturn: boolean,
    size: string
  ) => {
    if (isReturn) {
      // getUserById2(post_userID);
      const user = usersData2.find((user) => user.id === post_userID);
      return (
        <Avatar
          size={size}
          ml={size === "xs" ? "1" : "0"}
          zIndex="5"
          loading="lazy"
          // name={user ? user.displayName : "ユーザー名"} // 修正: userからdisplayNameを取得
          src={user?.picture_url ? user.picture_url : undefined} // 修正: userからuserPictureを取得
        />
      );
    }
  };
  //投稿時刻の表示
  const getTimeStamp = (
    time_stamp: string,
    isRight: boolean,
    isReturn: boolean,
    read_by: string[]
  ) => {
    if (isReturn) {
      const readByCount = read_by?.length || 0; // 要素の数を取得、存在しない場合は0を設定
      const hasMasterUserId = read_by?.includes(masterUserId) || false; // masterUserIdが含まれているか確認
      return (
        <Box
          display="flex"
          flexDirection="column"
          fontSize="13px"
          color="gray.500"
          whiteSpace="pre-wrap" // 改行を適用するために変更
          textAlign="center"
          mr={isRight ? "-2" : "0.5"} // メッセージとの間にマージンを追加
          ml={isRight ? "0" : "-2"}
          mb="1"
          alignSelf="flex-end" // 追加
          lineHeight="1" // 行間を短くするために追加
        >
          <Flex
            alignItems="center"
            justifyContent={isRight ? "flex-start" : "flex-end"}
          >
            {!isRight && hasMasterUserId ? (
              <Icon as={FaCheck} color="green.500" />
            ) : null}
            {readByCount > 0 && ( // readByCountが0でない場合に表示
              <Box
                display="flex"
                justifyContent={isRight ? "flex-start" : "flex-end"}
                alignItems="center"
                minWidth="14px" // アイコンのサイズ
                paddingX="2px"
                height="14px" // イコンのサイズ
                color="gray.500" // 既読か未読かで色を変更
                fontSize="12px"
                fontWeight="bold"
                ml="0"
              >
                {readByCount}
              </Box>
            )}
            {isRight && hasMasterUserId ? (
              <Icon as={FaCheck} color="green.500" />
            ) : null}
          </Flex>
          {time_stamp}
        </Box>
      );
    }
  };
  //リンクをクリックした時にページがリロードされないようにする
  useEffect(() => {
    console.log("useEffect called"); // useEffectが呼ばれているか確認

    const handleLinkClick = (event) => {
      console.log("Event listener added");
      console.log("event:", event);
      console.log("event.target:", event.target);
      if (event.target.classList.contains("external-link")) {
        console.log("Link clicked:", event.target.href);
      }
    };

    // すべての外部リンクにイベントリスナーを追加
    const links = document.querySelectorAll(".external-link");
    console.log("Links found:", links); // 取得したリンクをログに出力
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    return () => {
      // クリーンアップ時にイベントリスナーを削除
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, [posts]); // 依存配列を空にする

  if (!isClient) {
    return null;
  }
  return (
    <div
      style={{
        height: "100vh",
        scrollbarWidth: "none",
        touchAction: "pan-y", // タッチアクションを設定
      }}
    >
      <style jsx>{`
        /* Firefox */
        div {
          scrollbar-width: none; /* Firefox */
        }
        /* Webkit */
        div::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
      `}</style>
      <Stack // inputForm
        position="fixed"
        zIndex="2000"
        spacing={0}
        bottom="0"
        right="0"
        left="0"
        borderRadius="0px"
        px="20px"
        py="10px"
        bg={colorMode === "light" ? "white" : "gray.900"}
      >
        {!isAtBottom ? ( // 最下部でない場合にアイコンを表示
          <Box
            onClick={(e) => {
              e.preventDefault();
              scrollToBottom();
            }}
            position="absolute"
            top="-40px"
            right="8px"
            aria-label="Your Icon"
            cursor="pointer"
            bg={colorMode === "light" ? "white" : "gray.900"}
            color={colorMode === "light" ? "gray.900" : "gray"}
            borderRadius="10%"
            width="32px"
            height="32px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Icon size="28px" as={FaArrowDown} />
          </Box>
        ) : null}
        {replyToPostId && (
          <Stack
            fontSize="sm"
            p="0px"
            mx="0px"
            pb="10px"
            direction="row"
            alignItems="flex-start"
            borderRadius="0px"
            animation="slideIn 0.3s ease-out" // アニメーションを適用
          >
            {getAvatarProps(replyPostUserId, true, "sm")}
            <Stack ml="1">
              <Flex alignItems="center" mb="0">
                <Text fontWeight="bold" m="0" lineHeight="0.5" mr="1">
                  {replyPostUserDisplayName}
                </Text>
                <Text
                  fontSize="xs"
                  color="gray.600"
                  fontStyle="italic"
                  lineHeight="0.5"
                >
                  -{replyPostUserCompany}-
                </Text>
              </Flex>
              <Text
                m="0"
                lineHeight="1"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                position="relative"
                maxWidth="80vw"
                fontSize="xs"
              >
                {replyPostContent}
              </Text>
            </Stack>
            <Stack>
              {replyPostFileUrl &&
              replyPostFileUrl.match(/\.(jpeg|jpg|gif|png|bmp|webp)$/i) ? ( // 画像ファイルの拡張子をチェック
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="flex-start"
                  ml="2"
                >
                  <Image
                    src={replyPostFileUrl}
                    alt="Reply attached image"
                    loading="lazy"
                    maxW="100%" // 最大幅を100%に設定
                    maxH="40px" // 最大高さを50pxに設定
                    objectFit="contain" // 画像が枠内に収まるようにする
                    m="0"
                    p="0"
                  />
                </Box>
              ) : (
                replyPostFileUrl && ( // nullチェックを追加
                  <Box display="flex" alignItems="center" ml="2">
                    <FaPaperclip />
                    <Text ml="1">{replyPostFileUrl.split("/").pop()}</Text>
                  </Box>
                )
              )}
            </Stack>
            <IconButton
              aria-label="Close reply"
              icon={<FaTimes />} // ×アイコンを表示
              onClick={() => {
                setReplyToPostId(null); // リプライを閉じる
                setReplyPostContent(""); // リプライ内容をリセット
                setReplyPostUserId(null); // リプライ対象のユーザーIDをリセット
                setReplyPostFileUrl(null); // リプライ対象のファイルURLをリセット
              }}
              position="absolute"
              variant="ghost" // ボタンのスタイルを設定
              size="sm" // ボタンのサイズを設定
              ml="2" // ボタンとリプライ情報の間にマージンを追加
              top="1"
              right="1"
              _hover={{ backgroundColor: "transparent" }}
            />
          </Stack>
        )}
        <Stack spacing="4" mt="0" direction="row" justify="flex-end" mb="0">
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
                icon={<ImAttachment />}
                colorScheme={colorMode === "light" ? "purple" : "yellow"}
                zIndex="0"
              />
              <Input
                type="file"
                accept="image/*,.xlsm,.xlsx,.xls,.csv,.txt,.zip,.pdf,.doc,.docx,.7z,.gif,.mp4" // 画像ファイルとExcelファイルとかを許可
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
            _focus={{
              borderColor: colorMode === "light" ? "gray.900" : "gray.200",
            }} // 追加: フォーカス時の枠線の色を指定
            _focusVisible={{
              borderColor: colorMode === "light" ? "gray.900" : "gray.200",
            }} // 追加: フォーカスが可視状態の時の枠線の色を指定
            fontFamily="Noto Sans JP"
            fontWeight="200"
            as="textarea"
            type="text"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            onKeyDown={(e) =>
              handleKeyDown(
                e as unknown as React.KeyboardEvent<HTMLTextAreaElement>
              )
            }
            placeholder="メッセージを入力 (Shift+Enterで送信)"
            paddingTop={2}
            size="md"
            color={colorMode === "light" ? "black" : "white"}
            bg={colorMode === "light" ? "gray.50" : "gray.800"}
            borderColor={colorMode === "light" ? "gray.200" : "gray.800"}
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
              if (isSubmitting) return;
              setIsSubmitting(true); //post開始
              createPost();
              setNewPostContent(""); //クリア
              const textarea = document.querySelector("textarea");
              if (textarea) {
                textarea.style.height = "28px"; // 高さを初期状態に戻す
              }
              setIsSubmitting(false); //post終了
            }}
            icon={
              isSubmitting ? (
                <Spinner
                  size="28px"
                  color={colorMode === "light" ? "purple" : "yellow"}
                />
              ) : (
                <BsSend
                  color={colorMode === "light" ? "purple" : "yellow"}
                  style={{ transform: "rotate(0deg)" }}
                  size="28px"
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
              mt="1"
              px="2"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
              cursor="pointer"
              onClick={handleFileRemove}
              width="fit-content"
              color="gray.900"
            >
              <FaPaperclip style={{ marginRight: "6px" }} />
              <Text>{selectedFileName}</Text>
            </Box>
          </Tooltip>
        )}
      </Stack>
      <Modal isOpen={fileModalOpen} onClose={() => setFileModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          {/* <ModalCloseButton position="absolute" top="10px" right="-10px" /> */}
          <ModalBody
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={0}
            onClick={() => {
              if (!isLongPress) {
                setIsZoomed(!isZoomed); // クリックでズームイン/アウトを切り替え
              }
            }}
          >
            {selectedImageUrl &&
              (selectedImageUrl.match(/\.mp4$/) ? (
                <video
                  src={selectedImageUrl}
                  autoPlay
                  loop
                  muted
                  style={{
                    maxWidth: isZoomed ? "99vw" : "80vw", // ズームイン時は制限なし
                    maxHeight: isZoomed ? "99vh" : "80vh", // ズームイン時は制限なし
                    objectFit: "contain", // 動画がモーダルの範囲内に収まるようにする
                    cursor: isZoomed ? "zoom-out" : "zoom-in", // ズームイン/アウトのカーソルを設定
                  }}
                />
              ) : (
                <Image
                  src={selectedImageUrl}
                  alt="Uploaded image"
                  loading="lazy"
                  maxW={isZoomed ? "99vw" : "80vw"} // ズームイン時は制限なし
                  maxH={isZoomed ? "99vh" : "80vh"} // ズームイン時は制限なし
                  objectFit="contain" // 画像がモーダルの範囲内に収まるようにする
                  cursor={isZoomed ? "zoom-out" : "zoom-in"} // ズームイン/アウトのカーソルを設定
                />
              ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      <SidebarBBS />
      <Content isCustomHeader={true}>
        <Heading size="md" mb="1" ml="1">
          {threadTitle}
        </Heading>
        <Box ml="1">{ipAddress}</Box>
        <Stack spacing="2" style={{ padding: "0px", flexDirection: "column" }}>
          {posts
            .sort(
              // created_atでソート
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            )
            .map((post, index) => {
              // console.log(post[index]);
              // console.log(index, post.id);
              // console.log(targetUser?.user_uid);
              // getUserById2(post.user_uid);
              const prevPost = posts[index - 1];
              const prevDateString = prevPost ? prevPost.created_at : undefined;
              const isNewDay =
                index === 0 || // 一番最初の投稿の場合
                (prevDateString &&
                  new Date(post.created_at).toDateString() !==
                    new Date(prevDateString).toDateString());
              // :で囲んだ文字はタイトル
              if (post.content.match(/:(.*?):/)) {
                return (
                  <React.Fragment key={`${post.created_at}-${index}`}>
                    {/* Fragmentにkeyを設定 */}
                    {isNewDay && (
                      <Flex
                        key={`${post.created_at}-${index}`} // ここにkeyを設定
                        alignItems="center"
                        justifyContent="center"
                        width="100%"
                        mb="1.5"
                      >
                        <Divider borderColor="gray.500" />
                        <Text
                          fontSize="15px"
                          color="gray.500"
                          whiteSpace="nowrap" // 改行を防ぐ
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
                      alignItems="center"
                      justifyContent="center"
                      width="100%"
                      mb="1.5"
                      color="red"
                    >
                      <Divider
                        borderColor={colorMode === "light" ? "red" : "pink"}
                      />
                      <Tag
                        colorScheme="red"
                        minWidth="fit-content"
                        maxWidth="100%"
                        display="inline-flex"
                        variant="outline"
                        mt="1em"
                        mb="1em"
                      >
                        <TagLeftIcon
                          as={ChatIcon}
                          color={colorMode === "light" ? "red" : "pink"}
                        />
                        <TagLabel
                          textAlign="center"
                          whiteSpace="nowrap"
                          width="auto"
                          maxWidth="80vw"
                          display="inline"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          color={colorMode === "light" ? "red" : "pink"}
                        >
                          {post.content.match(/:(.*?):/)[1]}
                        </TagLabel>
                        <TagRightIcon
                          as={ChatIcon}
                          color={colorMode === "light" ? "red" : "pink"}
                        />
                      </Tag>
                      <Divider
                        borderColor={colorMode === "light" ? "red" : "pink"}
                      />
                    </Flex>
                  </React.Fragment>
                );
              }
              return (
                <div className="post">
                  {isNewDay && ( //日付の区切り線
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
                        whiteSpace="nowrap" // 改行を防ぐ
                        textAlign="center"
                        mx="2"
                        lineHeight="1.2"
                      >
                        {formatDate(post.created_at, prevDateString, false)}
                      </Text>
                      <Divider borderColor="gray.500" />
                    </Flex>
                  )}
                  <Flex //post内容
                    className="post"
                    data-post-id={post.id}
                    data-user-id={post.user_uid}
                    key={post.id}
                    style={{
                      height: post.isDeleting ? 0 : "auto", // 高さを0にする
                      opacity: post.isDeleting ? 0 : 1,
                      overflow: "visible", // 内容がはみ出さないようにする
                      transition: "max-height 1s ease, opacity 1s ease", // 高さと不透明度のトランジション
                    }}
                    justifyContent={
                      post.user_uid === userId ? "flex-end" : "flex-start"
                    }
                    maxWidth="98vw"
                    pr={post.user_uid === userId ? "0px" : "10px"}
                    pl={post.user_uid === userId ? "10px" : "0px"}
                    onMouseDown={() => handleLongPressStart(post.id)} // 長押し開始
                    onMouseUp={handleMouseUp} // マウスアップで長押し終了
                    onMouseLeave={handleMouseLeave} // マウスが要素から離れたときに長押しを終了
                    onClick={(e) => {
                      if (isLongPress && longPressPostId === post.id) {
                        e.stopPropagation();
                      }
                    }}
                  >
                    {isLongPress && longPressPostId === post.id && (
                      <>
                        <Box //オーバーレイ
                          position="fixed"
                          top="0"
                          left="0"
                          width="100%"
                          height="100%"
                          bg="rgba(0, 0, 0, 0.5)" // 半透明の黒
                          zIndex="9" // メニューより下に表示
                          onClick={handleLongPressEnd} // 長押しを終了
                        />
                        <Box //リプライとか削除のメニュー
                          position="absolute"
                          zIndex="10"
                          bg="white"
                          borderRadius="5px"
                          boxShadow="md"
                          onClick={(e) => e.stopPropagation()} // クリックイベントの伝播を防ぐ
                          width="auto"
                          height="auto"
                        >
                          <Button //削除ボタン
                            onClick={() => handleDeletePost(longPressPostId!)}
                            onMouseEnter={() => handleMouseEnter("delete")}
                            onMouseLeave={handleMouseLeave}
                            borderRight="1px"
                            borderColor="gray.500"
                            borderRadius="0"
                            bg="transparent"
                            _hover={{ backgroundColor: "transparent" }}
                            width="3rem"
                            isDisabled={
                              !(
                                userId && // userIdが存在する場合のみ
                                (post.user_uid === userId ||
                                  userId ===
                                    "6cc1f82e-30a5-449b-a2fe-bc6ddf93a7c0")
                              )
                            }
                          >
                            <Stack
                              alignItems="center"
                              spacing="1"
                              maxWidth={1.5}
                              color="gray.900"
                            >
                              <Icon as={FaTrashAlt} boxSize={5} />
                              <Text fontSize="0.5rem" lineHeight="1">
                                削除
                              </Text>
                            </Stack>
                          </Button>
                          <Button //リプライボタン
                            onClick={() => {
                              handleReplyPost(longPressPostId!);
                              handleLongPressEnd();
                            }}
                            onMouseEnter={() => {
                              handleMouseEnter("reply");
                            }}
                            onMouseLeave={handleMouseLeave}
                            borderRadius="1px"
                            bg="transparent"
                            _hover={{ backgroundColor: "transparent" }}
                            width="3rem"
                          >
                            <Stack
                              alignItems="center"
                              spacing="1"
                              maxWidth={1.5}
                              color="gray.900"
                            >
                              <Icon as={FaReply} boxSize={5} />
                              <Text
                                fontSize="0.5rem"
                                lineHeight="1"
                                p={0}
                                m={0}
                              >
                                リプライ
                              </Text>
                            </Stack>
                          </Button>
                        </Box>
                      </>
                    )}
                    {getTimeStamp(
                      formatDate(post.created_at, prevDateString, true),
                      false,
                      post.user_uid === userId,
                      post.read_by
                    )}
                    {getAvatarProps(
                      post.user_uid,
                      post.user_uid !== userId,
                      "sm"
                    )}
                    <Card
                      id={post.id}
                      style={{
                        backgroundColor:
                          post.user_uid === userId ? "#DCF8C6" : "#FFFFFF", // 自分のメッセージは緑、他人のメッセージは白
                        borderRadius: "10px",
                        maxWidth: "86vw",
                        padding: "0px",
                        margin:
                          post.user_uid === userId
                            ? "0 12px 0 2px"
                            : "0 2px 0 12px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 影を追加
                      }}
                    >
                      {post.reply_post_id && ( //ポストにリプライを含む場合
                        <CardBody
                          px="0"
                          py="0"
                          cursor="pointer"
                          onClick={() => {
                            //リプライをクリックしたらポストにスクロール
                            const postElement = document.getElementById(
                              post.reply_post_id
                            ); // post.idに基づいて要素を取得
                            if (postElement) {
                              postElement.scrollIntoView({
                                behavior: "smooth",
                              });
                              // スクロール位置をさらに調整
                              const offset = 80; // 調整したいオフセット値
                              const elementPosition =
                                postElement.getBoundingClientRect().top; // 要素の位置を取得
                              const offsetPosition =
                                elementPosition + window.scrollY - offset; // オフセットを考慮した位置を計算
                              window.scrollTo({
                                top: offsetPosition,
                                behavior: "smooth", // スムーズにスクロール
                              });
                              // スクロールが完了した後にアニメーションを適用
                              setTimeout(() => {
                                postElement.classList.add("shake"); // アニメーションを追加
                                setTimeout(() => {
                                  postElement.classList.remove("shake"); // アニメーションを削除
                                }, 500); // アニメーションの持続時間と一致させる
                              }, 500); // スクロールのアニメーションが完了するまで待つ
                            } else {
                              console.error(
                                `Element with ID ${post.id} not found`
                              ); // デバッグ用
                            }
                          }}
                        >
                          <Flex alignItems="center">
                            {getAvatarProps(post.reply_user_id, true, "xs")}
                            <Stack mx={2} spacing={0} maxW="90%">
                              <Flex alignItems="center" mb="0" lineHeight="1.4">
                                <Text
                                  color="black"
                                  fontSize="12px" // ユーザーネームのフォントサイズを調整
                                  fontWeight="bold" // ユーザーネームを太字に設定
                                  mr="1" // ユーザーネームと会社名の間にマージンを追加
                                >
                                  {getUserById(post.reply_user_id)
                                    ?.displayName || "未登録"}
                                </Text>
                                <Text fontSize="10px" color="gray.500">
                                  -
                                  {getUserById(post.reply_user_id)
                                    ?.userCompany || "未登録"}
                                  -
                                </Text>
                              </Flex>
                              <Text
                                color="black"
                                fontSize="10px"
                                noOfLines={1} // 1行まで表示
                                isTruncated // 改行が必要な場合は...を表示
                                whiteSpace="nowrap"
                                lineHeight="1.4"
                              >
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: post.reply_content
                                      .replace(/\n/g, "<br />")
                                      .replace(
                                        /(http[s]?:\/\/[^\s]+)/g,
                                        '<a href="$1" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;" class="external-link">$1</a>'
                                      ),
                                  }}
                                />
                              </Text>
                            </Stack>
                            {post.reply_file_url && ( // 追加: reply_file_urlが存在する場合
                              <Box
                                my="0.5"
                                display="flex"
                                alignItems="center"
                                mr="2"
                              >
                                {post.reply_file_url.match(
                                  /\.(jpeg|jpg|gif|png|bmp|webp|mp4)$/i
                                ) ? (
                                  <Image
                                    src={post.reply_file_url}
                                    alt="Reply attached file"
                                    loading="lazy"
                                    maxW="100%" // 最大幅を100%に設定
                                    maxH="40px"
                                    objectFit="contain" // 画像が枠内に収まるようにする
                                  />
                                ) : (
                                  <>
                                    <IconButton
                                      icon={<FaPaperclip />}
                                      aria-label="添付ファイル"
                                      bg="transparent"
                                      p={0}
                                      m={0}
                                      minWidth={0}
                                      onMouseLeave={(e) => {
                                        const tooltip =
                                          e.currentTarget.dataset.tooltip; // データ属性から取得
                                        if (tooltip) {
                                          const tooltipElement =
                                            document.getElementById(tooltip); // IDから要素を取得
                                          if (tooltipElement) {
                                            tooltipElement.remove(); // 要素を削除
                                            delete e.currentTarget.dataset
                                              .tooltip; // データ属性を削除
                                          }
                                        }
                                      }}
                                      onMouseOver={(e) => {
                                        const existingTooltip =
                                          e.currentTarget.dataset.tooltip; // 既存のツールチップIDを取得
                                        if (!existingTooltip) {
                                          // 既存のツールチップがない場合のみ作成
                                          const tooltip =
                                            document.createElement("span");
                                          tooltip.innerText =
                                            post.reply_file_url
                                              .split("/")
                                              .pop() || "ファイル名";
                                          tooltip.id = `tooltip-${post.id}`; // 一意のIDを設定
                                          tooltip.style.position = "absolute";
                                          tooltip.style.backgroundColor =
                                            "white";
                                          tooltip.style.border =
                                            "1px solid gray";
                                          tooltip.style.padding = "5px";
                                          tooltip.style.zIndex = "1000";
                                          e.currentTarget.appendChild(tooltip);
                                          e.currentTarget.dataset.tooltip =
                                            tooltip.id; // データ属性にIDを保存
                                        }
                                      }}
                                    />
                                  </>
                                )}
                              </Box>
                            )}
                          </Flex>
                          <Divider borderColor="gray.400" />
                        </CardBody>
                      )}
                      <CardBody px="10px" py="8px">
                        <Box
                          fontFamily="Noto Sans JP"
                          fontWeight="200"
                          color="black"
                          dangerouslySetInnerHTML={{
                            __html: post.content
                              .replace(/\n/g, "<br />")
                              .replace(
                                /(http[s]?:\/\/[^\s]+)/g,
                                '<a href="$1" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;" class="external-link">$1</a>'
                              ),
                          }}
                        />
                        {post.file_url && (
                          <>
                            {post.file_url.match(
                              /\.(jpeg|jpg|gif|png|mp4|bmp|webp)$/i
                            ) ? (
                              post.file_url.endsWith(".mp4") ? (
                                <video
                                  src={post.file_url}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline // モバイルデバイスで全画面表示を防ぐ
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    marginTop: "1px",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    if (!isMobile) {
                                      setSelectedImageUrl(post.file_url);
                                      setFileModalOpen(true);
                                    }
                                  }}
                                />
                              ) : (
                                <Image
                                  src={post.file_url}
                                  alt="Uploaded image"
                                  cursor="pointer"
                                  loading="lazy"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "300px",
                                    marginTop: "1px",
                                  }}
                                  onClick={(e) => {
                                    if (!isLongPress) {
                                      setSelectedImageUrl(post.file_url);
                                      setFileModalOpen(true);
                                    }
                                  }}
                                  onTouchStart={(e) => {
                                    touchStartRef.current = {
                                      x: e.touches[0].clientX,
                                      y: e.touches[0].clientY,
                                    }; // タッチ開始位置を記録
                                    setIsLongPress(false); // タッチ開始時に長押し状態をリセット
                                  }}
                                  onTouchMove={(e) => {
                                    if (touchStartRef.current) {
                                      const dx =
                                        e.touches[0].clientX -
                                        touchStartRef.current.x;
                                      const dy =
                                        e.touches[0].clientY -
                                        touchStartRef.current.y;
                                      const distance = Math.sqrt(
                                        dx * dx + dy * dy
                                      );
                                      if (distance > 10) {
                                        // 10px以上移動したらスクロールとみなす
                                        setIsLongPress(true); // スクロール中は長押しとみなす
                                      }
                                    }
                                  }}
                                  onTouchEnd={() => {
                                    if (!isLongPress) {
                                      setSelectedImageUrl(post.file_url);
                                      setFileModalOpen(true);
                                    }
                                    touchStartRef.current = null; // タッチ終了時にリセット
                                  }}
                                />
                              )
                            ) : (
                              <Box>
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDownload(
                                      post.file_url,
                                      post.original_file_name
                                    );
                                  }}
                                  variant="solid"
                                  mt="5px"
                                  px="5px"
                                  leftIcon={<FaDownload />}
                                  bg="white"
                                  justifyContent="flex-start"
                                  textAlign="left"
                                  color="black"
                                  maxWidth="100%"
                                  overflow="hidden"
                                  textOverflow="ellipsis"
                                  display="block"
                                >
                                  {post.original_file_name}
                                </Button>
                              </Box>
                            )}
                          </>
                        )}
                      </CardBody>
                      <Box // 吹き出しの三角
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
                          zIndex: 1,
                        }}
                      />
                    </Card>
                    {getTimeStamp(
                      formatDate(post.created_at, prevDateString, true),
                      true,
                      post.user_uid !== userId,
                      post.read_by
                    )}
                  </Flex>
                </div>
              );
            })}
        </Stack>
        <Box mb="53px" />
      </Content>
    </div>
  );
}
