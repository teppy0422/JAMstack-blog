"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FaPaperclip,
  FaDownload,
  FaPaperPlane,
  FaTimes,
  FaTrashAlt,
  FaReply,
  FaArrowDown,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaRedo,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { ImAttachment } from "react-icons/im";
import { BsSend } from "react-icons/bs";
import { supabase } from "../../../utils/supabase/client";
import { format } from "date-fns";
import { ja, enUS, zhCN } from "date-fns/locale";
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
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import { MdBusiness } from "react-icons/md";
import { LuPanelRightOpen } from "react-icons/lu";
import { CloseIcon } from "@chakra-ui/icons";

import { useUserContext } from "../../../context/useUserContext";

import Content from "../../../components/content";
import SidebarBBS from "../../../components/sidebarBBS";
import { useCustomToast } from "../../../components/customToast";
import { GetColor } from "../../../components/CustomColor";
import { AnimationImage } from "../../../components/CustomImage";

import IconWithDrawer from "./IconWithDrawer";

// import { AppContext } from "../../../pages/_app";
import {
  useLanguage,
  LanguageProvider,
} from "../../../context/LanguageContext";
import getMessage from "../../../components/getMessage";
import SakuraAnimation from "../../../components/SakuraAnimation";

import { Global } from "@emotion/react";
import "@fontsource/noto-sans-jp";
import { CustomLoading } from "../../../components/CustomText";
import { StatusDisplay } from "../../../components/NowStatus";
import { isatty } from "tty";
import { useUnread } from "../../../context/UnreadContext";
import imageCompression from "browser-image-compression";

let cachedUsers: any[] | null = null;
const now = new Date();

export default function Thread() {
  return (
    <LanguageProvider>
      <ThreadContent />
    </LanguageProvider>
  );
}

function ThreadContent(): JSX.Element {
  const { language, setLanguage } = useLanguage();
  const { updateUnreadCount } = useUnread();
  const toast = useToast();
  const [expandedUrls, setExpandedUrls] = useState<{ [key: string]: boolean }>(
    {}
  );
  // URL履歴を管理するstate
  const [urlHistory, setUrlHistory] = useState<{ [key: string]: string[] }>({});
  const [currentUrlIndex, setCurrentUrlIndex] = useState<{
    [key: string]: number;
  }>({});
  const [urlTitles, setUrlTitles] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true); // ローディング状態を追加

  // URLの履歴を追加する関数
  const addToHistory = (originalUrl: string, newUrl: string) => {
    setUrlHistory((prev) => {
      const history = prev[originalUrl] || [originalUrl];
      const currentIndex = currentUrlIndex[originalUrl] || 0;
      // 現在のインデックスより後の履歴を削除して新しいURLを追加
      const newHistory = [...history.slice(0, currentIndex + 1), newUrl];
      return { ...prev, [originalUrl]: newHistory };
    });
    setCurrentUrlIndex((prev) => ({
      ...prev,
      [originalUrl]: (prev[originalUrl] || 0) + 1,
    }));
  };

  // ページロード時にlocalStorageからメッセージを取得
  useEffect(() => {
    const savedMessage = localStorage.getItem("savedMessage");
    if (savedMessage) {
      const inputTaget = document.getElementById(
        "inputValue"
      ) as HTMLTextAreaElement;
      if (inputTaget) {
        inputTaget.value = savedMessage;
      }
    }
  }, [isLoading]);
  // メッセージ入力都度にlocalStorageに保存
  const handleInputChange = () => {
    // setInputValue(inputValue);
    const inputValue = document.getElementById(
      "inputValue"
    ) as HTMLTextAreaElement;
    localStorage.setItem("savedMessage", inputValue.value);
  };

  // 戻る処理
  const goBack = (originalUrl: string) => {
    const history = urlHistory[originalUrl];
    const currentIndex = currentUrlIndex[originalUrl];
    if (history && currentIndex > 0) {
      setCurrentUrlIndex((prev) => ({
        ...prev,
        [originalUrl]: currentIndex - 1,
      }));
      return history[currentIndex - 1];
    }
    return null;
  };

  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isClient, setIsClient] = useState(false);
  const audioRef_send = useRef<HTMLAudioElement>(null);
  const audioRef_recieving = useRef<HTMLAudioElement>(null);
  const [ipAddress, setIpAddress] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [threadCategory, setThreadCategory] = useState("");
  const [threadProjectName, setThreadProjectName] = useState("");
  const [threadMainCompany, setThreadMainCompany] = useState("");
  const [threadCompany, setThreadCompany] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false); // ズームインの状態を管理
  const { colorMode, toggleColorMode } = useColorMode();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSakuraActive, setIsSakuraActive] = useState(false);

  //PCとスマホ
  //長押し
  const [isLongPress, setIsLongPress] = useState(false);
  const [longPressPostId, setLongPressPostId] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<"delete" | "reply" | null>(
    null
  );
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = useCustomToast();
  // スマートフォンかどうかを判別
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [hasMore, setHasMore] = useState(true); // 追加: さらに読み込む投稿があるかどうかを管理
  const [loading, setLoading] = useState(false); // 追加: ローディング状態を管理
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); // 初回ロード完了フラグ
  const postsPerPage = 1000; // 1回の取得で読み込む投稿数
  const [unreadPostIds, setUnreadPostIds] = useState<string[]>([]); // 未読の投稿IDを管理
  const [isAtBottom, setIsAtBottom] = useState(false); // ページ最下部にいるかどうか

  const {
    currentUserId,
    currentUserName,
    currentUserMainCompany,
    currentUserCompany,
    getUserById,
    isLoading: isLoadingContext,
  } = useUserContext();

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  //既読チェック
  const masterUserId = "6cc1f82e-30a5-449b-a2fe-bc6ddf93a7c0"; // 任意のユーザーID
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
  //桜ふる判断
  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 2, 27); // 3月27日
    const endDate = new Date(today.getFullYear(), 3, 10); // 4月10日
    setIsSakuraActive(today >= startDate && today <= endDate);
  }, []);

  // isAtBottomがtrueになった時に未読の投稿を既読にする
  useEffect(() => {
    if (isAtBottom && unreadPostIds.length > 0 && currentUserId) {
      const markUnreadPostsAsRead = async () => {
        try {
          // 一括で未読投稿のread_byを取得
          const { data: posts, error: fetchError } = await supabase
            .from("posts")
            .select("id, read_by, content, thread_id, user_uid, created_at")
            .in("id", unreadPostIds);

          if (fetchError) {
            console.error(
              "Error fetching posts markUnreadPostsAsRead:",
              fetchError.message
            );
            return;
          }

          // 更新が必要な投稿をフィルタリング
          // 1. 自分の投稿以外
          // 2. まだread_byに自分のIDが含まれていない投稿
          const postsToUpdate = posts.filter(
            (post) =>
              post.user_uid !== currentUserId &&
              !post.read_by?.includes(currentUserId)
          );

          if (postsToUpdate.length > 0) {
            // 一括で更新を実行
            const { error: updateError } = await supabase.from("posts").upsert(
              postsToUpdate.map((post) => ({
                id: post.id,
                read_by: [...(post.read_by || []), currentUserId],
                content: post.content,
                thread_id: post.thread_id,
                user_uid: post.user_uid,
                created_at: post.created_at,
              }))
            );

            if (updateError) {
              console.error(
                "Error marking posts as read:",
                updateError.message
              );
            }
          }

          // 未読リストをクリア
          setUnreadPostIds([]);
          // 未読数を0に更新
          updateUnreadCount(id, 0);
          // ファビコンをデフォルトにする
          const favicon = document.querySelector(
            "link[rel='icon']"
          ) as HTMLLinkElement;
          const shortcutIcon = document.querySelector(
            "link[rel='shortcut icon']"
          ) as HTMLLinkElement;

          if (favicon) {
            favicon.href = "/images/ico/hippo_000_foot.ico";
          }
          if (shortcutIcon) {
            shortcutIcon.href = "/images/ico/hippo_000_foot.ico";
          }
        } catch (error) {
          console.error("Error in markUnreadPostsAsRead:", error);
        }
      };
      markUnreadPostsAsRead();
    }
  }, [isAtBottom]);

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
        const fullPath = filePath;
        const { error: deleteFileError } = await supabase.storage
          .from("uploads")
          .remove([fullPath]);
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
  //postのリプライ
  const [replyToPostId, setReplyToPostId] = useState<string | null>(null); // リプライ対象の投稿ID
  const [replyPostContent, setReplyPostContent] = useState<string>(""); // リプライ対象の投稿内容
  const [replyPostUserId, setReplyPostUserId] = useState<string | null>(null); // リプライ対象のユーザーID
  const [replyPostFileUrl, setReplyPostFileUrl] = useState<string | null>(null); // リプライ対象のファイルURL
  const [replyPostUserDisplayName, setReplyPostUserDisplayName] = useState<
    string | null
  >(null);
  const [replyPostUserCompany, setReplyPostUserCompany] = useState<
    string | null
  >(null);
  //リプライ情報を取得
  const handleReplyPost = async (postId: string) => {
    const post = posts.find((p) => p.id === postId); // 対象の投稿を取得
    if (post) {
      setReplyPostContent(post.content);
      setReplyPostUserId(post.user_uid);
      setReplyPostFileUrl(post.file_url);

      const userData = getUserById(post.user_uid);
      setReplyPostUserDisplayName(userData?.user_metadata.name ?? null);
      setReplyPostUserCompany(userData?.user_company ?? null);
    }
    setReplyToPostId(postId);
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.focus();
    }
  };
  //スクロール位置がボトムにあるかを管理する状態
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchIpAddress = async () => {
      const ipResponse = await fetch("/api/ip");
      const ipData = await ipResponse.json();
      setIpAddress(ipData.ip);
    };
    const fetchThreadTitle = async () => {
      setIsLoading(true); // ローディング開始
      const { data } = await supabase
        .from("threads")
        .select("*")
        .eq("id", id)
        .single();
      setThreadTitle(data?.title || "");
      setThreadCategory(data?.category || "");
      setThreadProjectName(data?.projectName || "");
      setThreadMainCompany(data?.mainCompany || "");
      setThreadCompany(data?.company || "");
      setIsLoading(false); // ローディング終了
    };
    setIsClient(true);
    fetchIpAddress();
    fetchThreadTitle();
  }, []);

  useEffect(() => {
    if (isClient && id && !isLoadingContext) {
      // 初回データ取得
      fetchAllPosts();

      // リアルタイム購読の設定
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
            // 新しい投稿が追加された場合、未読リストに追加
            if (
              currentUserId &&
              !payload.new.read_by?.includes(currentUserId)
            ) {
              setUnreadPostIds((prev) => [...prev, payload.new.id]);
            }
            // 投稿者が自分でない場合のみ受信音を鳴らす
            if (
              payload.new.user_uid !== currentUserId &&
              audioRef_recieving.current
            ) {
              audioRef_recieving.current.play();
            }

            // faviconを変更して通知を表示
            const originalFavicon = document.querySelector(
              "link[rel='icon']"
            ) as HTMLLinkElement;
            const originalShortcutIcon = document.querySelector(
              "link[rel='shortcut icon']"
            ) as HTMLLinkElement;

            // 通知用のfaviconを設定
            const notificationFavicon = document.createElement("link");
            notificationFavicon.rel = "icon";
            notificationFavicon.type = "image/x-icon";
            notificationFavicon.href = "/images/ico/hippo_000_foot_no.ico";

            // 既存のfaviconを削除
            if (originalFavicon) {
              originalFavicon.remove();
            }
            if (originalShortcutIcon) {
              originalShortcutIcon.remove();
            }
            // 新しいfaviconを追加
            document.head.appendChild(notificationFavicon);

            // デスクトップ通知を表示（iOSのSafari以外の場合のみ）
            if (typeof Notification !== "undefined") {
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
          }
        )
        .subscribe();

      // クリーンアップ
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isClient, id, isLoadingContext]); // threadCategoryは依存配列から除外

  useEffect(() => {
    if (isAtBottom && blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null; // クリア後にnullに設定
      console.log("Interval cleared because isAtBottom is true");
    }
  }, [isAtBottom]);
  //リアルタイムにコンテンツを表示
  useEffect(() => {
    if (isClient && id) {
      fetchAllPosts();
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
            // 新しい投稿が追加された場合、未読リストに追加
            if (
              currentUserId &&
              !payload.new.read_by?.includes(currentUserId)
            ) {
              setUnreadPostIds((prev) => [...prev, payload.new.id]);
            }
            // 投稿者が自分でない場合のみ受信音を鳴らす
            if (
              payload.new.user_uid !== currentUserId &&
              audioRef_recieving.current
            ) {
              audioRef_recieving.current.play();
            }

            // faviconを変更して通知を表示
            const originalFavicon = document.querySelector(
              "link[rel='icon']"
            ) as HTMLLinkElement;
            const originalShortcutIcon = document.querySelector(
              "link[rel='shortcut icon']"
            ) as HTMLLinkElement;

            // 通知用のfaviconを設定
            const notificationFavicon = document.createElement("link");
            notificationFavicon.rel = "icon";
            notificationFavicon.type = "image/x-icon";
            notificationFavicon.href = "/images/ico/hippo_000_foot_no.ico";

            // 既存のfaviconを削除
            if (originalFavicon) {
              originalFavicon.remove();
            }
            if (originalShortcutIcon) {
              originalShortcutIcon.remove();
            }
            // 新しいfaviconを追加
            document.head.appendChild(notificationFavicon);

            // デスクトップ通知を表示（iOSのSafari以外の場合のみ）
            if (typeof Notification !== "undefined") {
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
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isClient, id]);
  //全投稿を取得
  const fetchAllPosts = async (): Promise<void> => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("thread_id", id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching all posts:", error.message);
    } else {
      setPosts(data.reverse());

      // 未読の投稿IDを収集
      if (currentUserId) {
        const unreadIds = data
          .filter(
            (post) =>
              !post.read_by?.includes(currentUserId) &&
              post.user_uid !== currentUserId
          )
          .map((post) => post.id);
        setUnreadPostIds(unreadIds);
      }
    }
    setLoading(false);
  };
  // カテゴリに応じた固定投稿を返す関数
  const getFixedPostsByCategory = (
    category: string,
    createdAt: string | null
  ) => {
    const defaultCreatedAt = createdAt || new Date().toISOString();
    switch (category) {
      case "追加/修正":
        return [
          {
            id: "fixed-post-id-1",
            content:
              "機能追加を依頼する場合は\n新しい機能が分かるものを添付してください",
            created_at: defaultCreatedAt,
            user_uid: masterUserId,
          },
          {
            id: "fixed-post-id-2",
            content: "-ここにサンプルを用意する予定-",
            created_at: defaultCreatedAt,
            user_uid: masterUserId,
          },
        ];
      case "不具合":
        return [
          {
            id: "fixed-post-id-1",
            content: "原因を調べる為に以下の情報が必要です。",
            created_at: defaultCreatedAt,
            user_uid: masterUserId,
          },
          {
            id: "fixed-post-id-2",
            content: "1.エラー箇所\n-ここにサンプルを用意-",
            created_at: defaultCreatedAt,
            user_uid: masterUserId,
          },
          {
            id: "fixed-post-id-3",
            content: "2.エラー内容\n-ここにサンプルを用意-",
            created_at: defaultCreatedAt,
            user_uid: masterUserId,
          },
          {
            id: "fixed-post-id-4",
            content: "3.発生条件\n-ここにサンプルを用意-",
            created_at: defaultCreatedAt,
            user_uid: masterUserId,
          },
        ];
      default:
        return [];
    }
  };
  //投稿を20だけ表示
  const fetchPosts = async (offset = 0) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("thread_id", id)
      .order("created_at", { ascending: false })
      .range(offset, offset + postsPerPage - 1); // オフセットから20件取得

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
      const newPosts = data.reverse(); // 取得した投稿を古い順に並べ替え
      const firstPostTime = newPosts.length > 0 ? newPosts[0].created_at : null;
      const fixedPosts = getFixedPostsByCategory(threadCategory, firstPostTime);
      setPosts((prevPosts) => {
        const existingPostIds = new Set(prevPosts.map((post) => post.id));
        const uniqueNewPosts = newPosts.filter(
          (post) => !existingPostIds.has(post.id)
        );
        return [...fixedPosts, ...uniqueNewPosts, ...prevPosts]; // 固定の投稿を先頭に追加
      });
      setHasMore(newPosts.length === postsPerPage); // 20件取得できた場合はさらに読み込む可能性がある
    }
    setLoading(false);
    window.scrollBy(0, 300);
    // 初回ロードが完了したら下までスクロール
    if (!initialLoadComplete) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      setInitialLoadComplete(true);
    }
  };
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY === 0 && hasMore && !loading) {
  //       fetchPosts(posts.length); // 現在の投稿数をオフセットとして使用
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [posts, hasMore, loading]);
  // 投稿する
  const createPost = async (inputValue: string) => {
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
    const { error } = await supabase.from("posts").insert([
      {
        thread_id: id,
        content: inputValue,
        ip_address: ipAddress,
        file_url: fileUrl,
        original_file_name: originalFileName,
        user_uid: currentUserId, // ログインしているユーザーのUIDを追加
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
      // localStorageからメッセージを削除
      localStorage.removeItem("savedMessage");
      // 送信音を鳴らす
      if (audioRef_send.current) {
        audioRef_send.current.play();
      }
    }
  };
  //ファイルをアップロード
  const uploadFile = async (file: File) => {
    let processedFile = file;

    // 画像ファイルの場合、圧縮を実行
    if (file.type.startsWith("image/")) {
      const options = {
        maxSizeMB: 0.7, // 最大ファイルサイズを0.5MBに制限
        maxWidthOrHeight: 1200, // 最大幅または高さを1200pxに制限
        useWebWorker: true, // Web Workerを使用して圧縮
        fileType: file.type, // 元のファイルタイプを維持
        initialQuality: 0.7, // 初期品質を70%に設定
        alwaysKeepResolution: true, // 解像度を維持
        signal: undefined, // キャンセル用のシグナル
        maxIteration: 10, // 最大圧縮回数
        exifOrientation: -1, // EXIF情報を維持
        onProgress: undefined, // 進捗状況のコールバック
      };

      try {
        processedFile = await imageCompression(file, options);
        console.log("Original size:", file.size / 1024 / 1024, "MB");
        console.log("Compressed size:", processedFile.size / 1024 / 1024, "MB");
      } catch (error) {
        console.error("Error compressing image:", error);
        // 圧縮に失敗した場合は元のファイルを使用
      }
    }

    const encodedFileName = encodeFileName(processedFile.name);
    console.log("encodedFileName:", encodedFileName);
    // まずファイルが存在するか確認
    const { data: existingFile, error: checkError } = (await supabase.storage
      .from("uploads")
      .list("public", { search: encodedFileName })) as {
      data: any[] | null;
      error: any;
    };
    if (checkError) {
      console.error("Error checking file existence:", checkError.message);
      return null;
    }
    let uploadResponse;
    if (existingFile && existingFile.length > 0) {
      // ファイルが存在する場合は更新
      uploadResponse = await supabase.storage
        .from("uploads")
        .update(`public/${encodedFileName}`, processedFile);
    } else {
      // ファイルが存在しない場合は新規アップロード
      uploadResponse = await supabase.storage
        .from("uploads")
        .upload(`public/${encodedFileName}`, processedFile);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        toast({
          title: getMessage({
            ja: "ファイルサイズが30MBを超えています。",
            us: "File size exceeds 30 MB.",
            cn: "文件大小超过 30 MB。",
            language,
          }),
          description:
            `(${(file.size / 1024 / 1024).toFixed(1)}MB)\n` +
            getMessage({
              ja: "以下を試してみてください。\n\n・ファイルを圧縮する\n・生産準備+の場合は画像シートを削除する\n\nそれでも送信できない場合はチャットでご相談ください。",
              us: "Try the following\n\n・Compressing files.\n・Delete image sheet if Production Preparation+.\n\nIf you still cannot send the message, please contact us via chat.",
              cn: "试试以下方法。\n\n・压缩文件\n・生产准备+时删除图像页\n\n如果仍然无法发送信息, 请通过聊天联系我们。",
              language,
            }),
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // 画像ファイルかどうかをチェック
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }

      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setSelectedFileName(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  //ファイルをダウンロード
  const handleDownload = async (url: string, originalFileName: string) => {
    if (!currentUserName) {
      showToast(
        getMessage({
          ja: "ダウンロードできません",
          us: "Cannot download",
          cn: "无法下载",
          language,
        }),
        getMessage({
          ja: "ダウンロードするにはログインと管理者によるマスター登録が必要です",
          us: "Login and master registration by administrator is required to download",
          cn: "若要下载，您需要登录并由管理员注册为主用户",
          language,
        }),
        "error"
      );
      // alert("ダウンロードするにはログインと管理者によるマスター登録が必要です");
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
  //日付をフォーマット
  const formatDate = (
    dateString: string,
    prevDateString?: string,
    isTimeOnly?: boolean
  ) => {
    const date = new Date(dateString);
    const prevDate = prevDateString ? new Date(prevDateString) : null;
    const locale = language === "us" ? enUS : language === "cn" ? zhCN : ja;

    if (isTimeOnly) {
      return format(date, "H:mm", { locale });
    }
    const dayOfWeek = format(date, "E", { locale });
    const translatedDayOfWeek = getMessage({
      ja: dayOfWeek,
      us: dayOfWeek, // 英語の曜日をそのまま使用
      cn: dayOfWeek, // 中国語の曜日をそのまま使用
      language,
    });

    if (prevDate) {
      const isSameYear = date.getFullYear() === prevDate.getFullYear();
      const isSameMonth = isSameYear && date.getMonth() === prevDate.getMonth();
      const isSameDay = isSameMonth && date.getDate() === prevDate.getDate();

      if (isSameMonth) {
        return `${format(date, "M/d", { locale })} (${translatedDayOfWeek})`;
      }
    }
    return `${format(date, "yyyy M/d", { locale })} (${translatedDayOfWeek})`;
  };

  //アバター
  const getAvatarProps = (
    post_userID: any,
    isReturn: boolean,
    size: string
  ) => {
    if (isReturn) {
      const userData = getUserById(post_userID);
      return (
        <Tooltip label={userData?.user_metadata.name} hasArrow placement="top">
          <Avatar
            size={size}
            ml={size === "xs" ? "1" : "0"}
            zIndex="5"
            loading="lazy"
            src={userData?.picture_url ?? undefined}
          />
        </Tooltip>
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
                cursor="default"
              >
                <Tooltip
                  label={
                    read_by &&
                    read_by.length > 0 && (
                      <>
                        {read_by.map(async (reader, index) => {
                          const userData = getUserById(reader);
                          return (
                            <Flex alignItems="center">
                              <Avatar
                                src={userData?.picture_url ?? undefined}
                                boxSize="14px"
                                mr={2}
                              />
                              <Text key={index}>
                                {userData
                                  ? userData.user_metadata.name
                                  : "Unknown User"}
                              </Text>
                            </Flex>
                          );
                        })}
                      </>
                    )
                  }
                  aria-label="Read by users"
                >
                  <span>{readByCount}</span>
                </Tooltip>
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

  if (!isClient) {
    return <></>; // 空のフラグメントを返す
  }
  const handleOpen = (drawerName: string) => {
    setActiveDrawer(drawerName);
    onOpen();
  };
  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
  };

  return (
    <Box
      fontFamily={getMessage({
        ja: "Noto Sans JP",
        us: "Noto Sans,Noto Sans JP",
        cn: "Noto Sans SC,Noto Sans JP",
        language,
      })}
    >
      {isLoading ? (
        <Box
          h="30vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <CustomLoading
            text="LOADING LOADING LOADING "
            radius={40}
            fontSize={11}
            imageUrl="/images/illust/hippo/hippo_014.svg"
            imageSize={40}
            color="#FFF"
          />
        </Box>
      ) : (
        <>
          <audio ref={audioRef_send} src="/sound/notification.mp3" />
          <audio ref={audioRef_recieving} src="/sound/woodAlert.mp3" />
          {isSakuraActive && <SakuraAnimation />}
          <Global
            styles={{
              "@media print": {
                ".no-print-page": {
                  display: "none !important",
                },
                ".print-only": {
                  display: "block !important",
                },
              },
              ".print-only": {
                display: "none",
              },
            }}
          />
          <div
            style={{
              height: "100vh",
              scrollbarWidth: "none",
              touchAction: "pan-y", // タッチアクションを設定
            }}
          >
            <Text ml={4} className="print-only" id="printName">
              ※別紙2
            </Text>
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
              id="inputForm"
              position="fixed"
              zIndex="5001"
              spacing={0}
              bottom="0"
              right="0"
              left="0"
              borderRadius="0px"
              px="8px"
              py="8px"
              bg={colorMode === "light" ? "white" : "gray.900"}
              data-roof-id="sakura"
            >
              {loading && (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  position="fixed"
                  top="48px"
                  left="50%"
                >
                  <Spinner size="sm" />
                </Flex>
              )}
              <Box
                className="no-print-page"
                position="absolute"
                top="-37px"
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
                <IconWithDrawer
                  text=""
                  onOpen={() => handleOpen("機能一覧")}
                  isOpen={isOpen && activeDrawer === "機能一覧"}
                  onClose={handleClose}
                  header={getMessage({
                    ja: "機能一覧",
                    us: "List of Functions",
                    cn: "功能一览",
                    language,
                  })}
                  size="md"
                  children={
                    <Box>
                      <Text fontWeight={400}>
                        {getMessage({
                          ja: "クリック長押しで以下の機能が使えます",
                          us: "Click and hold to use the following functions",
                          cn: "点击并按住可使用以下功能",
                          language,
                        })}
                      </Text>
                      <Text mt={4} fontWeight={600}>
                        {getMessage({
                          ja: "リプライ",
                          us: "Functions",
                          cn: "功能",
                          language,
                        })}
                      </Text>
                      <Text mt={1} ml={4} fontWeight={400}>
                        {getMessage({
                          ja: "投稿を参照",
                          us: "See post",
                          cn: "参见帖子",
                          language,
                        })}
                      </Text>
                      <Text mt={4} fontWeight={600}>
                        {getMessage({
                          ja: "削除",
                          us: "Delete",
                          cn: "删除",
                          language,
                        })}
                      </Text>
                      <Text mt={1} ml={4} fontWeight={400}>
                        {getMessage({
                          ja: "投稿を削除",
                          us: "delete post",
                          cn: "删除帖子",
                          language,
                        })}
                      </Text>
                    </Box>
                  }
                />
              </Box>
              {!isAtBottom && ( // 最下部でない場合にアイコンを表示
                <Box
                  onClick={(e) => {
                    if (unreadPostIds.length > 0) {
                      const firstUnreadId = unreadPostIds[0];
                      const element = document.getElementById(
                        `post-${firstUnreadId}`
                      );
                      if (element) {
                        const offset = 80;
                        const elementPosition =
                          element.getBoundingClientRect().top;
                        const offsetPosition =
                          elementPosition + window.scrollY - offset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth",
                        });
                      }
                    } else {
                      scrollToBottom();
                    }
                  }}
                  className="no-print-page"
                  position="absolute"
                  top="-74px"
                  right="8px"
                  aria-label="Your Icon"
                  cursor="pointer"
                  bg={colorMode === "light" ? "white" : "gray.900"}
                  color={
                    colorMode === "light"
                      ? unreadPostIds.length > 0
                        ? "red"
                        : "gray.900"
                      : "gray"
                  }
                  borderRadius="10%"
                  width="32px"
                  height="32px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Icon size="28px" as={FaArrowDown} />
                </Box>
              )}
              {replyToPostId && (
                <Stack
                  fontSize="sm"
                  p="0px"
                  mx="0px"
                  pb="10px"
                  fontFamily="Noto Sans JP"
                  fontWeight="400"
                  direction="row"
                  alignItems="flex-start"
                  borderRadius="0px"
                  animation="slideIn 0.3s ease-out"
                >
                  {getAvatarProps(replyPostUserId, true, "sm")}
                  <Stack ml="1">
                    <Flex alignItems="center" mb="0">
                      <Text fontWeight="400" m="0" lineHeight="0.5" mr="1">
                        {replyPostUserDisplayName}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="gray.900"
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
                      maxWidth="85vw"
                      fontSize="xs"
                    >
                      {replyPostContent}
                    </Text>
                  </Stack>
                  <Stack>
                    {replyPostFileUrl &&
                    replyPostFileUrl.match(
                      /\.(jpeg|jpg|gif|png|bmp|webp)$/i
                    ) ? ( // 画像ファイルの拡張子をチェック
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
                          <Text ml="1">
                            {replyPostFileUrl.split("/").pop()}
                          </Text>
                        </Box>
                      )
                    )}
                  </Stack>
                  <IconButton
                    aria-label="Close reply"
                    icon={<FaTimes />}
                    onClick={() => {
                      setReplyToPostId(null); // リプライを閉じる
                      setReplyPostContent(""); // リプライ内容をリセット
                      setReplyPostUserId(null); // リプライ対象のユーザーIDをリセット
                      setReplyPostFileUrl(null); // リプライ対象のファイルURLをリセット
                    }}
                    position="absolute"
                    variant="ghost"
                    size="sm"
                    ml="2"
                    top="1"
                    right="1"
                    _hover={{ backgroundColor: "transparent" }}
                  />
                </Stack>
              )}
              <Stack
                spacing="0"
                my="0"
                direction="row"
                justify="flex-end"
                className="no-print-page"
                position="relative"
                data-roof-id="sakura"
              >
                {/* ファイル添付ボタン */}
                <Tooltip
                  position="absolute"
                  left="0"
                  label={getMessage({
                    ja: "添付ファイルを選択",
                    us: "Select Attachment",
                    cn: "选择附件",
                    language,
                  })}
                  cursor="pointer"
                  placement="top"
                  hasArrow
                >
                  <Button
                    onClick={handleButtonClick}
                    position="absolute"
                    cursor="pointer"
                    left="2px"
                    top="0px"
                    p="0"
                    bg="none"
                    _hover={{ bg: "none" }}
                  >
                    <IconButton
                      position="absolute"
                      cursor="pointer"
                      aria-label="Upload file"
                      icon={<FaPlus size="14px" />}
                      bg={colorMode === "light" ? "#f0e4da" : "gray.500"}
                      color={colorMode === "light" ? "#8d7c6f" : "#181a24"}
                      _hover={{
                        bg: colorMode === "light" ? "#8d7c6f" : "gray.400",
                        color: colorMode === "light" ? "#f0e4da" : "#181a24",
                        transition: "all 0.3s ease-in-out",
                      }}
                      borderRadius="50%"
                      w="28px"
                      h="28px"
                      minW="28px"
                      p="0"
                      zIndex="99"
                    />
                    <Input
                      type="file"
                      position="absolute"
                      display="none"
                      accept="image/*,.xlsm,.xlsx,.xls,.csv,.txt,.zip,.pdf,.doc,.docx,.7z,.gif,.mp4"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      top="0"
                      left="0"
                      opacity="0"
                      width="100%"
                      height="100%"
                      zIndex="2"
                      title=""
                      aria-label="Upload file"
                      name=""
                    />
                  </Button>
                </Tooltip>

                <Input
                  position="relative"
                  as="textarea"
                  id="inputValue"
                  minH="40px"
                  resize="none"
                  overflow="hidden"
                  // value={inputValue}
                  onChange={(e) => handleInputChange()} // 修正
                  onKeyDown={(e) => {
                    if (e.shiftKey && e.key === "Enter") {
                      e.preventDefault(); // デフォルトの改行動作を防ぐ
                      const sendButton = document.getElementById("sendButton");
                      if (sendButton) {
                        sendButton.click();
                      }
                    }
                  }}
                  onInput={(e) => {
                    const textarea = e.target as HTMLTextAreaElement;
                    textarea.style.height = "40px";
                    textarea.style.height = `${textarea.scrollHeight}px`;
                  }}
                  _focusVisible={{
                    borderColor: colorMode === "light" ? "#a69689" : "gray.400",
                  }}
                  fontWeight="200"
                  fontSize={isMobile ? "16px" : "15px"} //iphone_safariなら16px以下で自動ズームが働く
                  placeholder={getMessage({
                    ja: "メッセージを入力 (Shift+Enterで送信)",
                    us: "Type your message (Shift+Enter to send)",
                    cn: "输入信息（Shift+Enter 发送）。",
                    language,
                  })}
                  py={2}
                  pl={10}
                  pr={0}
                  size="md"
                  color={colorMode === "light" ? "#4d3c3f" : "white"}
                  bg={colorMode === "light" ? "white" : "gray.800"}
                  borderColor={colorMode === "light" ? "#bfb0a4" : "gray.800"}
                  borderRadius="5px"
                  _placeholder={{
                    color: colorMode === "light" ? "#bfb0a4" : "gray.500",
                  }}
                />
                <Tooltip
                  label={getMessage({
                    ja: "送信",
                    us: "send",
                    cn: "传动",
                    language,
                  })}
                  cursor="pointer"
                  placement="left"
                  hasArrow
                >
                  <IconButton
                    id="sendButton"
                    onClick={() => {
                      if (isSubmitting) return;
                      const inputValue = document.getElementById("inputValue");
                      if (inputValue === null) return;
                      const inputValueElement =
                        inputValue as HTMLTextAreaElement;
                      if (!inputValueElement.value.trim() && !selectedFile) {
                        showToast(
                          getMessage({
                            ja: "送信するものが有りません",
                            us: "Nothing to send",
                            cn: "没什么可发送的。",
                            language,
                          }),
                          getMessage({
                            ja: "メッセージまたはファイル添付が必要です",
                            us: "Message or file attachment required",
                            cn: "需要信息或文件附件",
                            language,
                          }),
                          "error"
                        );
                        return;
                      }
                      console.log(inputValueElement.value);
                      // setNewPostContent(inputValueElement.value);
                      setIsSubmitting(true); //post開始
                      createPost(inputValueElement.value);
                      // setNewPostContent(""); //クリア
                      inputValueElement.value = "";
                      inputValueElement.style.height = "40px"; // 高さを初期状態に戻す
                      setTimeout(() => {
                        setIsSubmitting(false); //post終了
                        if (audioRef_send.current) {
                          audioRef_send.current.play();
                        }
                      }, 2000); // 2秒待機
                    }}
                    icon={
                      isSubmitting ? (
                        <Spinner
                          color={colorMode === "light" ? "#8d7c6f" : "gray.500"}
                        />
                      ) : (
                        <BsSend
                          style={{ transform: "rotate(0deg)" }}
                          size="24px"
                        />
                      )
                    }
                    bg={colorMode === "light" ? "#f0e4da" : "gray.500"}
                    color={colorMode === "light" ? "#8d7c6f" : "#181a24"}
                    _hover={{
                      bg: colorMode === "light" ? "#8d7c6f" : "gray.400",
                      color: colorMode === "light" ? "#f0e4da" : "#181a24",
                      transition: "all 0.3s ease-in-out",
                    }}
                    top={0}
                    right={-1}
                    aria-label="送信"
                  />
                </Tooltip>
              </Stack>
              {selectedFile && (
                <Box mt={2}>
                  {previewUrl ? (
                    <Box position="relative" display="inline-block">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        maxH="64px"
                        maxW="128px"
                        objectFit="contain"
                        borderRadius="md"
                        border="3px solid"
                        borderColor={
                          colorMode === "light" ? "#f0e4da" : "gray.500"
                        }
                      />
                      <IconButton
                        aria-label="Remove file"
                        icon={<CloseIcon boxSize="9px" />}
                        size="xs"
                        position="absolute"
                        borderRadius="50%"
                        border="2px solid"
                        borderColor={
                          colorMode === "light" ? "white" : "#181a24"
                        }
                        top="-4px"
                        right="-4px"
                        onClick={clearFileSelection}
                        bg={colorMode === "light" ? "#f0e4da" : "gray.500"}
                        color={colorMode === "light" ? "#8d7c6f" : "#181a24"}
                        variant="solid"
                        _hover={{
                          bg: colorMode === "light" ? "#8d7c6f" : "gray.400",
                          color: colorMode === "light" ? "#f0e4da" : "#181a24",
                          transition: "all 0.3s ease-in-out",
                        }}
                      />
                    </Box>
                  ) : (
                    <Flex align="center" gap={2}>
                      <Box
                        position="relative"
                        border="1px solid"
                        borderRadius="6px"
                        borderColor={
                          colorMode === "light" ? "#bfb0a4" : "gray.800"
                        }
                        bg={colorMode === "light" ? "#f0e4da" : "gray.500"}
                        color={colorMode === "light" ? "#8d7c6f" : "#181a24"}
                        px="2"
                        py="1"
                      >
                        <Text fontSize="sm">{selectedFileName}</Text>
                        <IconButton
                          position="absolute"
                          aria-label="Remove file"
                          icon={<CloseIcon boxSize="9px" />}
                          size="xs"
                          borderRadius="50%"
                          border="2px solid"
                          borderColor={
                            colorMode === "light" ? "white" : "#181a24"
                          }
                          top="-7px"
                          right="-16px"
                          onClick={clearFileSelection}
                          bg={colorMode === "light" ? "#f0e4da" : "gray.500"}
                          color={colorMode === "light" ? "#8d7c6f" : "#181a24"}
                          variant="solid"
                          _hover={{
                            bg: colorMode === "light" ? "#8d7c6f" : "gray.400",
                            color:
                              colorMode === "light" ? "#f0e4da" : "#181a24",
                            transition: "all 0.3s ease-in-out",
                          }}
                        />
                      </Box>
                    </Flex>
                  )}
                </Box>
              )}
            </Stack>
            <Modal
              isOpen={fileModalOpen}
              onClose={() => setFileModalOpen(false)}
            >
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
                  style={{
                    backgroundColor: "#f2e9df",
                    backgroundImage: `
                    linear-gradient(45deg, #fff 25%, transparent 25%),
                    linear-gradient(135deg, #fff 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #fff 75%),
                    linear-gradient(135deg, transparent 75%, #fff 75%)
                  `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 0, 10px -10px, 0px 10px",
                    backgroundAttachment: "fixed",
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
            <SidebarBBS isMain={false} />
            <Content isCustomHeader={true}>
              <Box
                position="fixed"
                zIndex="1000"
                mb={0}
                ml={0}
                pt={0}
                pb={1}
                px={1}
                top="46px"
                display={{
                  base: "none",
                  sm: "block",
                  md: "block",
                  lg: "block",
                  xl: "block",
                }}
                backdropFilter={
                  colorMode === "light" ? "blur(20px)" : "blur(100px)"
                }
                // bg={{
                //   base: colorMode === "light" ? "#fff" : "#000",
                //   xl: colorMode === "light" ? "#f2e9df" : "#000",
                // }}
                border="1px solid #bfb0a4"
                borderRadius="md"
              >
                <Box as="span" fontSize={11} fontWeight={400} mr={1}>
                  {getMessage({
                    ja: threadCompany,
                    language,
                  })}
                </Box>
                <Box
                  display="inline-block"
                  fontFamily="Noto Sans Jp"
                  fontWeight={400}
                  fontSize={9}
                  borderRadius={3}
                  px={1}
                  mr={1}
                  border="transparent"
                  bg={GetColor(threadProjectName)}
                  color="#FFF"
                >
                  {threadProjectName}
                </Box>
                <Box
                  display="inline-block"
                  fontFamily="Noto Sans Jp"
                  fontWeight={400}
                  fontSize={9}
                  borderRadius={3}
                  px={1}
                  mr={1}
                  border={"1px solid " + GetColor(threadCategory)}
                  bg="transparent"
                  color={GetColor(threadCategory)}
                >
                  {threadCategory}
                </Box>
                <Box display="inline-block" fontSize={10} fontWeight={400}>
                  {ipAddress}
                </Box>
                <Box>
                  <Box
                    fontSize={13}
                    fontWeight={400}
                    style={{
                      letterSpacing: "1px",
                    }}
                  >
                    {getMessage({
                      ja: threadTitle,
                      language,
                    })}
                  </Box>
                </Box>
              </Box>
              <Box height="4.5em" />
              <Stack
                spacing="2"
                style={{ padding: "0px", flexDirection: "column" }}
              >
                {!currentUserName && threadMainCompany !== "開発" ? (
                  <Text color="red" fontWeight="bold">
                    {getMessage({
                      ja: "認証されていません",
                      us: "Not authenticated.",
                      cn: "未经授权。",
                      language,
                    })}
                  </Text>
                ) : threadMainCompany !== currentUserMainCompany &&
                  threadMainCompany !== "開発" &&
                  currentUserMainCompany !== "開発" ? (
                  <Text color="red" fontWeight="bold">
                    {getMessage({
                      ja: "このチャットは ",
                      us: "This chat is only viewable by ",
                      cn: "此聊天只能由 ",
                      language,
                    })}
                    {getMessage({ ja: currentUserMainCompany || "", language })}
                    {getMessage({
                      ja: " のみ閲覧可能です",
                      us: "",
                      cn: " 查看",
                      language,
                    })}
                  </Text>
                ) : (
                  posts
                    .sort(
                      // created_atでソート
                      (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                    )
                    .map((post, index) => {
                      const prevPost = posts[index - 1];
                      const prevDateString = prevPost
                        ? prevPost.created_at
                        : undefined;
                      const isNewDay =
                        index === 0 || // 一番最初の投稿の場合
                        (prevDateString &&
                          new Date(post.created_at).toDateString() !==
                            new Date(prevDateString).toDateString());
                      // :で囲んだ文字はタイトル
                      if (post.content.match(/:(.*?):/)) {
                        return (
                          <React.Fragment key={`${post.created_at}-${index}`}>
                            {isNewDay && (
                              <Flex
                                key={`${post.created_at}-${index}`}
                                alignItems="center"
                                justifyContent="center"
                                width="100%"
                                mb="1.5"
                              >
                                <Divider borderColor="gray.500" />
                                <Text
                                  fontSize="15px"
                                  color="gray.500"
                                  whiteSpace="nowrap"
                                  textAlign="center"
                                  mx="2"
                                  lineHeight="1.2"
                                >
                                  {formatDate(
                                    post.created_at,
                                    prevDateString,
                                    false
                                  )}
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
                                borderColor={
                                  colorMode === "light" ? "red" : "pink"
                                }
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
                                borderColor={
                                  colorMode === "light" ? "red" : "pink"
                                }
                              />
                            </Flex>
                          </React.Fragment>
                        );
                      }
                      return (
                        <>
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
                                  fontSize="14px"
                                  color="gray.500"
                                  whiteSpace="nowrap"
                                  textAlign="center"
                                  mx="2"
                                  lineHeight="1.2"
                                >
                                  {formatDate(
                                    post.created_at,
                                    prevDateString,
                                    false
                                  )}
                                </Text>
                                <Divider borderColor="gray.500" />
                              </Flex>
                            )}
                            <Flex //post内容
                              className="post"
                              data-post-id={post.id}
                              data-user-id={post.user_uid}
                              key={post.id}
                              id={`post-${post.id}`} // IDを追加
                              style={{
                                height: post.isDeleting ? 0 : "auto",
                                opacity: post.isDeleting ? 0 : 1,
                                overflow: "visible", // 内容がはみ出さないようにする
                                transition:
                                  "max-height 1s ease, opacity 1s ease", // 高さと不透明度のトランジション
                              }}
                              justifyContent={
                                post.user_uid === currentUserId
                                  ? "flex-end"
                                  : "flex-start"
                              }
                              maxWidth="98vw"
                              pr={
                                post.user_uid === currentUserId ? "0px" : "10px"
                              }
                              pl={
                                post.user_uid === currentUserId ? "10px" : "0px"
                              }
                              onMouseDown={() => handleLongPressStart(post.id)} // 長押し開始
                              onMouseUp={handleMouseUp} // マウスアップで長押し終了
                              onMouseLeave={handleMouseLeave} // マウスが要素から離れたときに長押しを終了
                              onClick={(e) => {
                                if (
                                  isLongPress &&
                                  longPressPostId === post.id
                                ) {
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
                                    zIndex="5000" // メニューより下に表示
                                    onClick={handleLongPressEnd} // 長押しを終了
                                  />
                                  <Box //リプライとか削除のメニュー
                                    position="absolute"
                                    zIndex="5010"
                                    bg="white"
                                    borderRadius="5px"
                                    boxShadow="md"
                                    onClick={(e) => e.stopPropagation()} // クリックイベントの伝播を防ぐ
                                    width="auto"
                                    height="auto"
                                  >
                                    <Button //削除ボタン
                                      onClick={() =>
                                        handleDeletePost(longPressPostId!)
                                      }
                                      onMouseEnter={() =>
                                        handleMouseEnter("delete")
                                      }
                                      onMouseLeave={handleMouseLeave}
                                      borderRight="1px"
                                      borderColor="gray.500"
                                      borderRadius="0"
                                      bg="transparent"
                                      _hover={{
                                        backgroundColor: "transparent",
                                      }}
                                      width="3rem"
                                      isDisabled={
                                        !(
                                          currentUserId && // userIdが存在する場合のみ
                                          (post.user_uid === currentUserId ||
                                            currentUserId === masterUserId)
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
                                          {getMessage({
                                            ja: "削除",
                                            us: "Delete",
                                            cn: "删减",
                                            language,
                                          })}
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
                                      borderRight="1px"
                                      borderColor="gray.500"
                                      borderRadius="0"
                                      bg="transparent"
                                      _hover={{
                                        backgroundColor: "transparent",
                                      }}
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
                                          {getMessage({
                                            ja: "リプライ",
                                            us: "reply",
                                            cn: "回复",
                                            language,
                                          })}
                                        </Text>
                                      </Stack>
                                    </Button>
                                  </Box>
                                </>
                              )}
                              {getTimeStamp(
                                formatDate(
                                  post.created_at,
                                  prevDateString,
                                  true
                                ),
                                false,
                                post.user_uid === currentUserId,
                                post.read_by
                              )}
                              {getAvatarProps(
                                post.user_uid,
                                post.user_uid !== currentUserId,
                                "sm"
                              )}
                              <Card
                                id={post.id}
                                style={{
                                  backgroundColor:
                                    post.user_uid === currentUserId
                                      ? "#DCF8C6"
                                      : "#FFFFFF", // 自分のメッセージは緑、他人のメッセージは白
                                  borderRadius: "10px",
                                  maxWidth: "86vw",
                                  padding: "0px",
                                  margin:
                                    post.user_uid === currentUserId
                                      ? "0 12px 0 2px"
                                      : "0 2px 0 12px",
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {post.reply_post_id && ( //ポストにリプライを含む場合
                                  <CardBody
                                    px="0"
                                    py="0"
                                    cursor="pointer"
                                    onClick={async () => {
                                      //リプライをクリックしたらポストにスクロール
                                      const postElement =
                                        document.getElementById(
                                          post.reply_post_id
                                        ); // post.idに基づいて要素を取得
                                      if (postElement) {
                                        postElement.scrollIntoView({
                                          behavior: "smooth",
                                        });
                                        // スクロール位置をさらに調整
                                        const offset = 80; // 調整したいオフセット値
                                        const elementPosition =
                                          postElement.getBoundingClientRect()
                                            .top; // 要素の位置を取得
                                        const offsetPosition =
                                          elementPosition +
                                          window.scrollY -
                                          offset; // オフセットを考慮した位置を計算
                                        window.scrollTo({
                                          top: offsetPosition,
                                          behavior: "smooth", // スムーズにスクロール
                                        });
                                        // スクロールが完了した後にアニメーションを適用
                                        setTimeout(() => {
                                          postElement.classList.add("shake"); // アニメーションを追加
                                          setTimeout(() => {
                                            postElement.classList.remove(
                                              "shake"
                                            ); // アニメーションを削除
                                          }, 500); // アニメーションの持続時間と一致させる
                                        }, 500); // スクロールのアニメーションが完了するまで待つ
                                      } else {
                                        // リプライ先がない場合
                                        await fetchAllPosts();
                                        await new Promise((resolve) =>
                                          setTimeout(resolve, 0)
                                        ); // レンダリングが完了するのを待つ
                                        const postElement =
                                          document.getElementById(post.id);
                                        if (postElement) {
                                          const offset = 80; // 調整したいオフセット値
                                          const elementPosition =
                                            postElement.getBoundingClientRect()
                                              .top; // 要素の位置を取得
                                          const offsetPosition =
                                            elementPosition +
                                            window.scrollY -
                                            offset; // オフセットを考慮した位置を計算
                                          window.scrollTo({
                                            top: offsetPosition,
                                            behavior: "smooth", // スムーズにスクロール
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    <Flex alignItems="center">
                                      {getAvatarProps(
                                        post.reply_user_id,
                                        true,
                                        "xs"
                                      )}
                                      <Stack mx={2} spacing={0} maxW="90%">
                                        <Flex
                                          alignItems="center"
                                          mb="0"
                                          lineHeight="1.4"
                                          fontFamily="Noto Sans JP"
                                          fontWeight="300"
                                        >
                                          <Text
                                            color="black"
                                            fontSize="12px"
                                            mr="1"
                                          >
                                            {getUserById(post.reply_user_id)
                                              ?.user_metadata.name || "未登録"}
                                            {post.replay_user_id}
                                          </Text>
                                        </Flex>
                                        <Text
                                          color="black"
                                          fontFamily="Noto Sans JP"
                                          fontWeight="200"
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
                                              maxW="100%"
                                              maxH="40px"
                                              objectFit="contain"
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
                                                    e.currentTarget.dataset
                                                      .tooltip; // データ属性から取得
                                                  if (tooltip) {
                                                    const tooltipElement =
                                                      document.getElementById(
                                                        tooltip
                                                      ); // IDから要素を取得
                                                    if (tooltipElement) {
                                                      tooltipElement.remove(); // 要素を削除
                                                      delete e.currentTarget
                                                        .dataset.tooltip; // データ属性を削除
                                                    }
                                                  }
                                                }}
                                                onMouseOver={(e) => {
                                                  const existingTooltip =
                                                    e.currentTarget.dataset
                                                      .tooltip; // 既存のツールチップIDを取得
                                                  if (!existingTooltip) {
                                                    // 既存のツールチップがない場合のみ作成
                                                    const tooltip =
                                                      document.createElement(
                                                        "span"
                                                      );
                                                    tooltip.innerText =
                                                      post.reply_file_url
                                                        .split("/")
                                                        .pop() || "ファイル名";
                                                    tooltip.id = `tooltip-${post.id}`; // 一意のIDを設定
                                                    tooltip.style.position =
                                                      "absolute";
                                                    tooltip.style.backgroundColor =
                                                      "white";
                                                    tooltip.style.border =
                                                      "1px solid gray";
                                                    tooltip.style.padding =
                                                      "5px";
                                                    tooltip.style.zIndex =
                                                      "1000";
                                                    e.currentTarget.appendChild(
                                                      tooltip
                                                    );
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
                                <CardBody px="8px" py="5px">
                                  <Box
                                    fontFamily="Noto Sans JP"
                                    fontWeight="200"
                                    color="black"
                                    fontSize="15px"
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: post.content
                                          .replace(/\n/g, "<br />")
                                          .replace(
                                            /(http[s]?:\/\/[^\s]+)/g,
                                            '<a href="$1" class="external-link" style="text-decoration: underline;">$1</a>'
                                          ),
                                      }}
                                    />
                                  </Box>
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
                                            playsInline
                                            style={{
                                              maxWidth: "100%",
                                              maxHeight: "300px",
                                              marginTop: "1px",
                                              cursor: "pointer",
                                            }}
                                            onClick={(e) => {
                                              if (!isMobile) {
                                                setSelectedImageUrl(
                                                  post.file_url
                                                );
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
                                              maxHeight: "240px",
                                              marginTop: "1px",
                                              backgroundColor: "#f2e9df",
                                              backgroundImage: `
                                          linear-gradient(45deg, #fff 25%, transparent 25%),
                                          linear-gradient(135deg, #fff 25%, transparent 25%),
                                          linear-gradient(45deg, transparent 75%, #fff 75%),
                                          linear-gradient(135deg, transparent 75%, #fff 75%)
                                        `,
                                              backgroundSize: "20px 20px",
                                              backgroundPosition:
                                                "0 0, 10px 0, 10px -10px, 0px 10px",
                                              backgroundAttachment: "fixed",
                                            }}
                                            onClick={(e) => {
                                              if (!isLongPress) {
                                                setSelectedImageUrl(
                                                  post.file_url
                                                );
                                                setFileModalOpen(true);
                                              }
                                            }}
                                            onTouchStart={(e) => {
                                              touchStartRef.current = {
                                                x: e.touches[0].clientX,
                                                y: e.touches[0].clientY,
                                              };
                                              setIsLongPress(false);
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
                                                  setIsLongPress(true);
                                                }
                                              }
                                            }}
                                            onTouchEnd={() => {
                                              if (!isLongPress) {
                                                setSelectedImageUrl(
                                                  post.file_url
                                                );
                                                setFileModalOpen(true);
                                              }
                                              touchStartRef.current = null;
                                            }}
                                          />
                                        )
                                      ) : (
                                        <Box>
                                          <Button
                                            onClick={(e) => {
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
                                    left:
                                      post.user_uid === currentUserId
                                        ? "auto"
                                        : "-10px",
                                    right:
                                      post.user_uid === currentUserId
                                        ? "-10px"
                                        : "auto",
                                    width: 0,
                                    height: 0,
                                    borderStyle: "solid",
                                    borderWidth:
                                      post.user_uid === currentUserId
                                        ? "5px 0 10px 15px"
                                        : "5px 15px 10px 0",
                                    borderColor:
                                      post.user_uid === currentUserId
                                        ? "transparent transparent transparent #DCF8C6"
                                        : "transparent #FFFFFF transparent transparent",
                                    zIndex: 1,
                                  }}
                                />
                              </Card>
                              {getTimeStamp(
                                formatDate(
                                  post.created_at,
                                  prevDateString,
                                  true
                                ),
                                true,
                                post.user_uid !== currentUserId,
                                post.read_by
                              )}
                            </Flex>
                            {/* httpの場合はWEBページを表示 */}
                            {(() => {
                              const urls = post.content.match(
                                /(http[s]?:\/\/[^\s]+)/g
                              );
                              if (!urls) return null;
                              const url = urls[0];
                              const isExpanded = expandedUrls[url] || false;
                              return (
                                <Box>
                                  <Box
                                    width={isExpanded ? "94%" : "50%"}
                                    height={isExpanded ? "70vh" : "12vh"}
                                    mt="8px"
                                    transition="all 0.3s ease"
                                    marginLeft={
                                      post.user_uid === currentUserId
                                        ? "auto"
                                        : "44px"
                                    }
                                    marginRight={
                                      post.user_uid === currentUserId
                                        ? "12px"
                                        : "auto"
                                    }
                                    style={{
                                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                      position: "relative",
                                    }}
                                    borderRadius="8px"
                                  >
                                    <Tooltip
                                      label={
                                        isExpanded ? "折りたたむ" : "展開する"
                                      }
                                      placement="top"
                                      hasArrow
                                    >
                                      <Box
                                        display="inline-block"
                                        position="absolute"
                                      >
                                        <Icon
                                          position="absolute"
                                          as={LuPanelRightOpen}
                                          cursor="pointer"
                                          boxSize="18px"
                                          right={
                                            post.user_uid === currentUserId
                                              ? ""
                                              : "-22px"
                                          }
                                          left={
                                            post.user_uid === currentUserId
                                              ? "-22px"
                                              : ""
                                          }
                                          top="6px"
                                          transform={
                                            isExpanded
                                              ? post.user_uid === currentUserId
                                                ? "rotate(180deg)"
                                                : "rotate(0deg)"
                                              : post.user_uid === currentUserId
                                              ? "rotate(0deg)"
                                              : "rotate(180deg)"
                                          }
                                          transition="transform 0.3s ease"
                                          onClick={() => {
                                            setExpandedUrls((prev) => ({
                                              ...prev,
                                              [url]: !prev[url],
                                            }));
                                          }}
                                          _hover={{
                                            transform: isExpanded
                                              ? post.user_uid === currentUserId
                                                ? "rotate(180deg) scale(1.2)"
                                                : "rotate(0deg) scale(1.2)"
                                              : post.user_uid === currentUserId
                                              ? "rotate(0deg) scale(1.2)"
                                              : "rotate(180deg) scale(1.2)",
                                          }}
                                        />
                                      </Box>
                                    </Tooltip>
                                    <Box
                                      position="relative"
                                      height="100%"
                                      borderRadius="8px"
                                      overflow="hidden"
                                    >
                                      <Flex
                                        bg={
                                          post.user_uid === currentUserId
                                            ? "#DCF8C6"
                                            : "#FFFFFF"
                                        }
                                        px={2}
                                        alignItems="center"
                                        borderBottom="1px solid"
                                        borderColor="gray.200"
                                        width="100%"
                                      >
                                        <Box display="flex" alignItems="center">
                                          <IconButton
                                            color="#000"
                                            aria-label="戻る"
                                            icon={<Icon as={FaArrowLeft} />}
                                            size="sm"
                                            variant="ghost"
                                            mr={1}
                                            isDisabled={
                                              !urlHistory[url] ||
                                              currentUrlIndex[url] === 0
                                            }
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const prevUrl = goBack(url);
                                              if (prevUrl) {
                                                const iframe =
                                                  document.querySelector(
                                                    `iframe[data-original-url="${url}"]`
                                                  ) as HTMLIFrameElement;
                                                if (iframe) {
                                                  iframe.src = prevUrl;
                                                }
                                              }
                                            }}
                                          />
                                          <IconButton
                                            aria-label="リロード"
                                            icon={<Icon as={FaRedo} />}
                                            color="#000"
                                            size="sm"
                                            variant="ghost"
                                            mr={2}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              const iframe =
                                                document.querySelector(
                                                  `iframe[data-original-url="${url}"]`
                                                ) as HTMLIFrameElement;
                                              if (iframe) {
                                                iframe.src = iframe.src;
                                              }
                                            }}
                                          />
                                        </Box>
                                        <Box
                                          flex="1"
                                          overflow="hidden"
                                          whiteSpace="nowrap"
                                          textOverflow="ellipsis"
                                          fontSize="xs"
                                          color="#000"
                                          alignContent="center"
                                        >
                                          {urlTitles[url] ||
                                            "ページを読み込み中..."}
                                        </Box>
                                        <Box flex="1" />
                                        <IconButton
                                          color="#000"
                                          aria-label="新しいタブで開く"
                                          icon={<Icon as={FaExternalLinkAlt} />}
                                          size="sm"
                                          variant="ghost"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const currentUrl =
                                              urlHistory[url]?.[
                                                currentUrlIndex[url] || 0
                                              ] || url;
                                            window.open(currentUrl, "_blank");
                                          }}
                                        />
                                      </Flex>
                                      {isExpanded && (
                                        <iframe
                                          src={url}
                                          data-original-url={url}
                                          style={{
                                            position: "relative",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "calc(100% - 20px)",
                                            border: "none",
                                          }}
                                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                                          loading="lazy"
                                          onLoad={(e) => {
                                            const iframe =
                                              e.target as HTMLIFrameElement;
                                            try {
                                              const currentUrl =
                                                iframe.contentWindow?.location
                                                  .href;
                                              if (
                                                currentUrl &&
                                                currentUrl !== url &&
                                                currentUrl !== iframe.src
                                              ) {
                                                addToHistory(url, currentUrl);
                                              }
                                              // まずURLからドメイン名を取得してタイトルの初期値として設定
                                              const domain = new URL(url)
                                                .hostname;
                                              setUrlTitles((prev) => ({
                                                ...prev,
                                                [url]: domain,
                                              }));
                                              // タイトルの取得を試みる
                                              const title =
                                                iframe?.contentWindow?.document
                                                  ?.title ||
                                                iframe?.contentDocument?.title;
                                              if (title) {
                                                setUrlTitles((prev) => ({
                                                  ...prev,
                                                  [url]: title,
                                                }));
                                              }
                                            } catch (error) {
                                              // エラーの場合はドメイン名を表示
                                              try {
                                                const domain = new URL(url)
                                                  .hostname;
                                                setUrlTitles((prev) => ({
                                                  ...prev,
                                                  [url]: domain,
                                                }));
                                              } catch (e) {
                                                setUrlTitles((prev) => ({
                                                  ...prev,
                                                  [url]: url,
                                                }));
                                              }
                                            }
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                </Box>
                              );
                            })()}
                          </div>
                        </>
                      );
                    })
                )}
              </Stack>
              <Box mb="20vh" />
            </Content>
            <StatusDisplay />
          </div>
        </>
      )}
    </Box>
  );
}
