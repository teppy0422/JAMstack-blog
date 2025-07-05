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
import dynamic from "next/dynamic";

import {
  FaPaperclipIcon,
  FaDownloadIcon,
  FaTimesIcon,
  FaTrashCanHeadIcon,
  FaTrashCanBodyIcon,
  FaReplyIcon,
  FaArrowDownIcon,
  FaCheckIcon,
  FaRedoIcon,
  FaPlusIcon,
  FaMinusIcon,
  FaMicroblogIcon,
  BsFillSendFillIcon,
} from "@/components/ui/icons";

import { supabase } from "@/utils/supabase/client";
import { format } from "date-fns";
import { css, keyframes } from "@emotion/react";
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
  ChakraProvider,
  Center,
  Link,
  AspectRatio,
  HStack,
} from "@chakra-ui/react";
import { theme } from "@/theme/theme";

import { ChatIcon } from "@chakra-ui/icons";
import { CloseIcon } from "@chakra-ui/icons";

import ContentDisplay from "./ContextDisplay";

import { useUserContext } from "@/contexts/useUserContext";

import Content from "@/components/content";
import SidebarBBS from "../../parts/bbsSidebar";
import { CustomToast } from "@/components/ui/CustomToast";
import { getIpAddress } from "@/lib/getIpAddress";
import { GetColor } from "@/components/CustomColor";
import { AnimationImage } from "@/components/ui/CustomImage";
import IconWithDrawer from "./IconWithDrawer";
import SafeHtml from "../../parts/SafeHtml";
import ExternalLinkText from "../../parts/ExternalLinkText";
import UrlPreviewBox from "../../parts/UrlPreviewBox";
import ChatFeatureMoal from "@/components/modals/ChatFeatures";
import { bbsNotifEmailHtml } from "@/lib/templates/bbsNotifEmailHtml";

import "@/styles/home.module.scss";
// import { AppContext } from "../../../pages/_app";

import { useLanguage, LanguageProvider } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

// 季節ごとのアニメーションを管理するマッピング
const seasonalAnimations = {
  someiyoshino: dynamic(
    () => import("@/components/season/SomeiyoshinoAnimation")
  ),
  hachisuka: dynamic(() => import("@/components/season/HachisukaAnimation")),
  yae: dynamic(() => import("@/components/season/YaeAnimation")),
  firefly: dynamic(() => import("@/components/season/FireflyAnimation")),
  milkyway: dynamic(() => import("@/components/season/MilkyWayAnimation")),
  firework: {
    standard: dynamic(() => import("@/components/season/FireworkAnimation")),
    senkou: dynamic(() => import("@/components/season/SenkouFirework")),
  },
};
import { Global } from "@emotion/react";
import { CustomLoading } from "@/components/ui/CustomLoading";
import { StatusDisplay } from "@/components/modals/NowStatusModal";
import { CalendarDisplay } from "@/components/modals/CalendarModal";
import { isatty } from "tty";
import { useUnread } from "@/contexts/UnreadContext";
import imageCompression from "browser-image-compression";
import { CustomCloseButton } from "../../../../src/components/ui/CustomCloseButton";
import { CustomModalCloseButton } from "../../../../src/components/ui/CustomModalCloseButton";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { sendMail } from "@/lib/sendMail";
import { getUserEmail } from "@/lib/getUserEmail";
import { last } from "lodash";

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
  const { language } = useLanguage();
  const { colorMode } = useColorMode();
  const [isSentNotify, setIsSentNotify] = useState<boolean>(false);

  const { updateUnreadCount } = useUnread();
  const showToast = useToast();
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

  const [content, setContent] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const [threadBlogUrl, setThreadBlogUrl] = useState("");
  const [threadUserId, setThreadUserId] = useState<string | null>(null);

  useEffect(() => {
    if (threadBlogUrl && threadBlogUrl !== currentUrl) {
      const fetchContent = async () => {
        try {
          const response = await fetch(`/blog/${threadBlogUrl}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.text(); // または response.json() など
          setContent(data);
          setCurrentUrl(threadBlogUrl); // 現在のURLを更新
        } catch (error) {
          console.error("Fetch error:", error);
          setContent("<p>Error loading content</p>"); // エラーメッセージを表示
        }
      };
      fetchContent();
    }
  }, [threadBlogUrl, currentUrl]); // 依存配列にthreadBlogUrlとcurrentUrlを追加
  const color = colorMode === "light" ? "" : ""; // カラーモードに応じた色を設定
  const blink = (color: string) => keyframes`
  0% {
    background-color:${color};
        transform: scale(1);
  }
  25% {
    background-color:transparent;
            transform: scale(0.9);
  }
  50% {
    background-color:${color};
            transform: scale(1);
  }
  75% {
    background-color:transparent;
            transform: scale(0.9);
  }
  100%{
    background-color:${color};
            transform: scale(1);
  }
`;
  function renderContentWithLinks(content: string) {
    // URLを検出して分割
    const urlRegex = /(http[s]?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <Text
            as="span"
            key={i}
            color="blue.600"
            textDecoration="underline"
            cursor="pointer"
            onClick={() => window.open(part, "_blank")}
          >
            {part}
          </Text>
        );
      }
      // 改行も反映
      return part.split("\n").map((line, j, arr) =>
        j < arr.length - 1 ? (
          <React.Fragment key={j}>
            {line}
            <br />
          </React.Fragment>
        ) : (
          line
        )
      );
    });
  }
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
  const [selectedFileSize, setSelectedFileSize] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false); // ズームインの状態を管理
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    currentUserCreatedAt,
    getUserById,
    updateUserById,
    isLoading: isLoadingContext,
  } = useUserContext();

  const [email, setEmail] = useState<string | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  // 日付の位置固定
  const [currentDate, setCurrentDate] = useState("");
  const dateRefs = useRef<{ date: string; ref: HTMLDivElement | null }[]>([]);
  const [isSticky, setIsSticky] = useState(false);
  // 日付の表示/非表示
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // スクロール停止後1秒で非表示
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
      const topOffset = 60;
      let latestDate = "";
      for (const item of dateRefs.current.filter(
        (i): i is { date: string; ref: HTMLDivElement } => !!i && !!i.ref
      )) {
        const rect = item.ref.getBoundingClientRect();
        if (rect.top < topOffset) {
          latestDate = item.date;
        }
      }
      // 最初のrefより上にいる場合は currentDate を空にする
      const firstValid = dateRefs.current.find(
        (i): i is { date: string; ref: HTMLDivElement } => !!i && !!i.ref
      );
      if (firstValid) {
        const firstTop = firstValid.ref.getBoundingClientRect().top;
        if (firstTop > topOffset) {
          latestDate = "";
        }
      }
      setCurrentDate(latestDate);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //既読チェック
  const masterUserId = "6cc1f82e-30a5-449b-a2fe-bc6ddf93a7c0";
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
  const [isSomeiyoshinoActive, setIsSomeiyoshinoActive] = useState(false);
  const [isHachisukaActive, setIsHachisukaActive] = useState(false);
  const [isYaeActive, setIsYaeActive] = useState(false);
  const [isFirefly, setIsFirefly] = useState(false);
  const [isMilkyWay, setIsMilkyWay] = useState(false);
  const [isFirework, setIsFirework] = useState(false);

  //season判断
  useEffect(() => {
    const today = new Date();
    const hachisukaStartDate = new Date(today.getFullYear(), 1, 25); // 2月2５日
    const hachisukaEndDate = new Date(today.getFullYear(), 2, 10); // 3月10日
    setIsHachisukaActive(
      today >= hachisukaStartDate && today <= hachisukaEndDate
    );
    const someiyoshinoStartDate = new Date(today.getFullYear(), 2, 27); // 3月27日
    const someiyoshinoEndDate = new Date(today.getFullYear(), 3, 10); // 4月10日
    setIsSomeiyoshinoActive(
      today >= someiyoshinoStartDate && today <= someiyoshinoEndDate
    );
    const YaeStartDate = new Date(today.getFullYear(), 3, 15); // 4月15日
    const YaeEndDate = new Date(today.getFullYear(), 3, 22); // 4月22日
    setIsYaeActive(today >= YaeStartDate && today <= YaeEndDate);

    const FireflyStartDate = new Date(today.getFullYear(), 5, 1); // 6月1日
    const FireflyEndDate = new Date(today.getFullYear(), 5, 16); // 6月16日
    setIsFirefly(today >= FireflyStartDate && today <= FireflyEndDate);

    const MilkyWayDate = new Date(today.getFullYear(), 5, 23); // 6月23日
    const MilkyWayEndDate = new Date(today.getFullYear(), 6, 7); // 7月7日
    setIsMilkyWay(today >= MilkyWayDate && today <= MilkyWayEndDate);

    const FireworkDate = new Date(today.getFullYear(), 7, 10); // 8月10日
    const FireworkEndDate = new Date(today.getFullYear(), 7, 30); // 8月30日
    setIsFirework(today >= FireworkDate && today <= FireworkEndDate);
  }, []);

  // isAtBottomがtrueになった時に未読の投稿を全て既読にする
  useEffect(() => {
    if (!isAtBottom) {
      return;
    }
    console.log("isAtBottom is true");
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
  const [startX, setStartX] = useState<number | null>(null);
  const [isLongPressDisabled, setIsLongPressDisabled] = useState(false);

  const handleLongPressStart = (
    postId: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsLongPressDisabled(false);

    const timeout = setTimeout(() => {
      if (!isLongPressDisabled) {
        setIsLongPress(true);
        setLongPressPostId(postId);
      }
    }, 333);
    clearTimeout(longPressTimeout!);
    setLongPressTimeout(timeout);
  };

  const handleLongPressMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (startX !== null) {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const moveDistance = Math.abs(clientX - startX);

      if (moveDistance > 30) {
        setIsLongPressDisabled(true);
        if (longPressTimeout) {
          clearTimeout(longPressTimeout);
          setLongPressTimeout(null);
        }
      }
    }
  };

  const handleLongPressEnd = () => {
    setIsLongPress(false);
    setLongPressPostId(null);
    setStartX(null);
    setIsLongPressDisabled(false);
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchIpAddress = async () => {
      const ip = await getIpAddress();
      setIpAddress(ip);
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
      setThreadBlogUrl(data?.blog_url);
      setThreadUserId(data?.user_uid);
      setIsLoading(false); // ローディング終了
    };
    setIsClient(true);
    fetchIpAddress();
    fetchThreadTitle();
  }, []);

  const handleFetchEmail = async (uid: string): Promise<string | null> => {
    const email = await getUserEmail(uid);
    return String(email);
  };

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
      // ファイルサイズを取得して投稿データに追加
      const postsWithFileSize = await Promise.all(
        data.map(async (post) => {
          if (post.file_url) {
            try {
              const response = await fetch(post.file_url, { method: "HEAD" });
              if (response.ok) {
                const contentLength = response.headers.get("content-length");
                if (contentLength) {
                  return { ...post, file_size: parseInt(contentLength) };
                }
              }
            } catch (err) {
              console.error("Error fetching file size:", err);
            }
          }
          return post;
        })
      );

      setPosts(postsWithFileSize.reverse());

      // 未読の投稿IDを収集
      if (currentUserId) {
        const unreadIds = postsWithFileSize
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
      .range(offset, offset + postsPerPage - 1);

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
      // ファイルサイズを取得して投稿データに追加
      const newPosts = await Promise.all(
        data.map(async (post) => {
          if (post.file_url) {
            try {
              const response = await fetch(post.file_url, { method: "HEAD" });
              if (response.ok) {
                const contentLength = response.headers.get("content-length");
                if (contentLength) {
                  return { ...post, file_size: parseInt(contentLength) };
                }
              }
            } catch (err) {
              console.error("Error fetching file size:", err);
            }
          }
          return post;
        })
      );

      const firstPostTime = newPosts.length > 0 ? newPosts[0].created_at : null;
      const fixedPosts = getFixedPostsByCategory(threadCategory, firstPostTime);
      setPosts((prevPosts) => {
        const existingPostIds = new Set(prevPosts.map((post) => post.id));
        const uniqueNewPosts = newPosts.filter(
          (post) => !existingPostIds.has(post.id)
        );
        return [...fixedPosts, ...uniqueNewPosts, ...prevPosts];
      });
      setHasMore(newPosts.length === postsPerPage);
    }
    setLoading(false);
    window.scrollBy(0, 300);
    if (!initialLoadComplete) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      setInitialLoadComplete(true);
    }
  };
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
        originalFileName = selectedFile.name;
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
        user_uid: currentUserId,
        reply_post_id: replyToPostId,
        reply_content: replyPostContent,
        reply_user_id: replyPostUserId,
        reply_file_url: replyPostFileUrl,
      },
    ]);
    if (error) {
      console.error("Error creating post:", error.message);
    } else {
      // メール送信
      const is_email_notify = getUserById(threadUserId)?.is_email_notify;
      console.log("is_email_notify", is_email_notify);
      if (is_email_notify) {
        if (!isSentNotify) {
          if (threadUserId !== currentUserId) {
            const threadUrl = `https://teppy.link/bbs/thread/${id}`; // このページのパスを設定

            let lastNotifiedAt = getUserById(threadUserId)?.last_notified_at;
            let hoursDiff = 25;
            const now = new Date();
            if (lastNotifiedAt) {
              const lastNotifiedDate = new Date(lastNotifiedAt);
              const timeDiff = now.getTime() - lastNotifiedDate.getTime();
              hoursDiff = timeDiff / (1000 * 60 * 60);
            }
            console.log("hoursDiff", hoursDiff);
            if (hoursDiff > 24 && threadUserId) {
              // メール送信
              const email = await handleFetchEmail(threadUserId);
              const senderAvatarUrl = getUserById(currentUserId)?.picture_url;
              handleSendMail({
                to: String(email),
                subject: "📨 BBSの" + threadTitle + "に新着メッセージ",
                text: threadTitle + " に新着メッセージ " + inputValue,
                html: bbsNotifEmailHtml({
                  threadTitle,
                  inputValue,
                  threadUrl,
                  senderAvatarUrl: senderAvatarUrl ?? "",
                }),
              });
              // 送信日時を保存
              const { error: updateError } = await supabase
                .from("table_users")
                .update({ last_notified_at: now.toISOString() })
                .eq("id", threadUserId);
              if (updateError) {
                console.error("❌ last_notified_at update error:", updateError);
              }
              setIsSentNotify(true);
              console.log("send Email to ", String(email));
            }
          }
        }
      }
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
  // メールを送信
  const handleSendMail = async ({
    to,
    subject,
    text,
    html,
  }: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) => {
    const { success, errorMessage } = await sendMail({
      to,
      subject,
      text,
      html,
    });

    toast({
      position: "bottom",
      duration: 4000,
      isClosable: true,
      render: ({ onClose }) => (
        <CustomToast
          onClose={onClose}
          title={
            success
              ? getMessage({
                  ja: "通知送信が成功",
                  us: "Successful notification transmission",
                  cn: "通知传送成功。",
                  language,
                })
              : getMessage({
                  ja: "通知送信が失敗",
                  us: "Failed to send notification",
                  cn: "通知传送失败。",
                  language,
                })
          }
          description={
            <>
              <Box>{success ? undefined : errorMessage}</Box>
            </>
          }
        />
      ),
    });
  };

  // ファイルをアップロード
  const uploadFile = async (file: File) => {
    let processedFile = file;

    // 画像ファイルの場合、圧縮を実行
    if (file.type.startsWith("image/")) {
      const options = {
        maxSizeMB: 0.7,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.7,
        alwaysKeepResolution: true,
        signal: undefined,
        maxIteration: 10,
        exifOrientation: -1,
        onProgress: undefined,
      };

      try {
        processedFile = await imageCompression(file, options);
        console.log("Original size:", file.size / 1024 / 1024, "MB");
        console.log("Compressed size:", processedFile.size / 1024 / 1024, "MB");
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
    // 動画ファイルの場合、WebMに変換
    else if (file.type.startsWith("video/")) {
      try {
        const ffmpeg = new FFmpeg();
        await ffmpeg.load();

        const inputFileName = "input." + file.name.split(".").pop();
        const outputFileName = "output.webm";

        await ffmpeg.writeFile(inputFileName, await fetchFile(file));
        await ffmpeg.exec([
          "-i",
          inputFileName,
          "-c:v",
          "libvpx-vp9",
          "-crf",
          "30",
          "-b:v",
          "0",
          "-c:a",
          "libopus",
          outputFileName,
        ]);
        const data = await ffmpeg.readFile(outputFileName);
        processedFile = new File(
          [data],
          file.name.replace(/\.[^/.]+$/, ".webm"),
          {
            type: "video/webm",
          }
        );
        console.log("Original video size:", file.size / 1024 / 1024, "MB");
        console.log(
          "Converted video size:",
          processedFile.size / 1024 / 1024,
          "MB"
        );
      } catch (error) {
        console.error("Error converting video:", error);
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

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`; // バイト
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`; // KB
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`; // MB
    }
  };
  const FileSizeDisplay = ({
    fileUrl,
    fileSize: initialFileSize,
  }: {
    fileUrl: string;
    fileSize?: number;
  }): JSX.Element | null => {
    const [fileSize, setFileSize] = useState<string | null>(null);
    const [fileCache] = useState<Map<string, string>>(new Map());

    useEffect(() => {
      const fetchFileSize = async () => {
        try {
          // キャッシュをチェック
          if (fileCache.has(fileUrl)) {
            setFileSize(fileCache.get(fileUrl) || null);
            return;
          }

          // 初期値がある場合はそれを使用
          if (initialFileSize) {
            const formattedSize = formatFileSize(initialFileSize);
            fileCache.set(fileUrl, formattedSize);
            setFileSize(formattedSize);
            return;
          }

          // ファイルの拡張子を取得
          const fileExtension = fileUrl.split(".").pop()?.toLowerCase();
          const isImage = ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(
            fileExtension || ""
          );

          if (isImage) {
            // 画像ファイルの場合
            const existingImage = document.querySelector(
              `img[src="${fileUrl}"]`
            ) as HTMLImageElement;

            if (existingImage) {
              const sizeInBytes =
                existingImage.width * existingImage.height * 4;
              const formattedSize = formatFileSize(sizeInBytes);
              fileCache.set(fileUrl, formattedSize);
              setFileSize(formattedSize);
              return;
            }

            const img = document.createElement("img");
            img.src = fileUrl;

            img.onload = () => {
              const sizeInBytes = img.width * img.height * 4;
              const formattedSize = formatFileSize(sizeInBytes);
              fileCache.set(fileUrl, formattedSize);
              setFileSize(formattedSize);
            };

            img.onerror = () => {
              fetchFileSizeWithHead();
            };
          } else {
            // すべてのファイルでHEADリクエストを使用
            fetchFileSizeWithHead();
          }
        } catch (err) {
          console.error("Error fetching file size:", err);
          setFileSize(null);
        }
      };

      const fetchFileSizeWithHead = async () => {
        try {
          const response = await fetch(fileUrl, { method: "HEAD" });
          if (response.ok) {
            const contentLength = response.headers.get("content-length");
            if (contentLength) {
              const formattedSize = formatFileSize(parseInt(contentLength));
              fileCache.set(fileUrl, formattedSize);
              setFileSize(formattedSize);
            } else {
              setFileSize(null);
            }
          } else {
            setFileSize(null);
          }
        } catch (err) {
          console.error("Error fetching file size with HEAD request:", err);
          setFileSize(null);
        }
      };

      fetchFileSize();
    }, [fileUrl, initialFileSize]);

    return fileSize ? <>{fileSize}</> : null;
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileSize(formatFileSize(file.size));
    }
    if (file) {
      if (file.size > 30 * 1024 * 1024) {
        toast({
          position: "bottom",
          duration: 4000,
          isClosable: true,
          render: ({ onClose }) => (
            <CustomToast
              onClose={onClose}
              title={getMessage({
                ja: "ファイルサイズが30MBを超えています。",
                us: "File size exceeds 30 MB.",
                cn: "文件大小超过 30 MB。",
                language,
              })}
              description={
                <>
                  <Box whiteSpace="pre-line">
                    {`(${(file.size / 1024 / 1024).toFixed(1)}MB)\n` +
                      getMessage({
                        ja: "以下を試してみてください。\n\n・ファイルを圧縮する\n・生産準備+の場合は画像シートを削除する\n\nそれでも送信できない場合はチャットでご相談ください。",
                        us: "Try the following\n\n・Compressing files.\n・Delete image sheet if Production Preparation+.\n\nIf you still cannot send the message, please contact us via chat.",
                        cn: "试试以下方法。\n\n・压缩文件\n・生产准备+时删除图像页\n\n如果仍然无法发送信息, 请通过聊天联系我们。",
                        language,
                      })}
                  </Box>
                </>
              }
            />
          ),
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
      showToast({
        position: "bottom",
        duration: 4000,
        isClosable: true,
        render: ({ onClose }) => (
          <CustomToast
            onClose={onClose}
            title={getMessage({
              ja: "ダウンロードできません",
              us: "Cannot download",
              cn: "无法下载",
              language,
            })}
            description={
              <>
                <Box>
                  {getMessage({
                    ja: "ダウンロードするにはログインと管理者によるマスター登録が必要です",
                    us: "Login and master registration by administrator is required to download",
                    cn: "若要下载，您需要登录并由管理员注册为主用户",
                    language,
                  })}
                </Box>
              </>
            }
          />
        ),
      });
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
    const translatedDayOfWeek = dayOfWeek;
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
  const calculateDaysSince = (dateString: string | null | undefined) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const today = new Date();
    const timeDiff = today.getTime() - date.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24)); // ミリ秒を日数に変換
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
        <Tooltip
          label={
            userData && (
              <>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Text fontSize="sm">{userData?.user_metadata.name}</Text>
                  <Text fontSize="10px">
                    {calculateDaysSince(userData?.created_at)}日目
                  </Text>
                </Box>
              </>
            )
          }
          hasArrow
          placement="top"
        >
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
          zIndex="1000"
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
          userSelect="none"
        >
          <Flex
            alignItems="center"
            justifyContent={isRight ? "flex-start" : "flex-end"}
          >
            {!isRight && hasMasterUserId ? (
              <FaCheckIcon
                size="13px"
                fill={
                  colorMode === "light"
                    ? "green.500"
                    : "custom.theme.orange.400"
                }
                stroke="currentColor"
              />
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
              <FaCheckIcon
                size="13px"
                fill={
                  colorMode === "light"
                    ? "green.500"
                    : "custom.theme.orange.400"
                }
                stroke="currentColor"
              />
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
              bg={
                colorMode === "light"
                  ? "custom.theme.light.50"
                  : "custom.theme.dark.700"
              }
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
                  zIndex="1003"
                  top="-65px"
                  right="6px"
                  aria-label="Your Icon"
                  cursor="pointer"
                  bg={
                    colorMode === "light" ? "custom.theme.light.50" : "gray.900"
                  }
                  color={
                    colorMode === "light"
                      ? unreadPostIds.length > 0
                        ? "red"
                        : "custom.theme.light.900"
                      : unreadPostIds.length > 0
                      ? "orange"
                      : "custom.theme.dark.300"
                  }
                  _hover={{
                    bg:
                      colorMode === "light"
                        ? "custom.theme.light.700"
                        : "custom.theme.dark.400",
                    color:
                      colorMode === "light" ? "white" : "custom.theme.dark.600",
                    transition: "all 0.2s ease-in-out",
                  }}
                  borderRadius="10%"
                  width="28px"
                  height="28px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <FaArrowDownIcon
                    size="16px"
                    fill={
                      colorMode === "light" ? "custom.theme.light.900" : "gray"
                    }
                    stroke="currentColor"
                  />
                </Box>
              )}

              <Box
                id="question"
                className="no-print-page"
                position="absolute"
                zIndex="1003"
                top="-32px"
                right="6px"
                aria-label="Your Icon"
                cursor="pointer"
                bg={
                  colorMode === "light" ? "custom.theme.light.50" : "gray.900"
                }
                color={
                  colorMode === "light" ? "custom.theme.light.900" : "gray"
                }
                _hover={{
                  bg:
                    colorMode === "light"
                      ? "custom.theme.light.700"
                      : "custom.theme.dark.400",
                  color:
                    colorMode === "light" ? "white" : "custom.theme.dark.600",
                  transition: "all 0.2s ease-in-out",
                }}
                borderRadius="10%"
                width="28px"
                height="28px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <ChatFeatureMoal />
              </Box>
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
                      <Text
                        fontWeight="400"
                        m="0"
                        lineHeight="0.5"
                        mr="1"
                        color={
                          colorMode === "light"
                            ? "custom.theme.light.900"
                            : "red"
                        }
                      >
                        {replyPostUserDisplayName}
                      </Text>
                      <Text
                        fontSize="xs"
                        fontStyle="italic"
                        lineHeight="0.8"
                        color={
                          colorMode === "light"
                            ? "custom.theme.light.900"
                            : "custom.theme.dark.200"
                        }
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
                      color={
                        colorMode === "light"
                          ? "custom.theme.light.900"
                          : "custom.theme.dark.200"
                      }
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
                          <FaPaperclipIcon
                            size="14px"
                            fill={
                              colorMode === "light"
                                ? "custom.theme.light.900"
                                : "custom.theme.dark.100"
                            }
                          />
                          <Text ml="1">
                            {replyPostFileUrl.split("/").pop()}
                          </Text>
                        </Box>
                      )
                    )}
                  </Stack>
                  <Box
                    onClick={() => {
                      setReplyToPostId(null); // リプライを閉じる
                      setReplyPostContent(""); // リプライ内容をリセット
                      setReplyPostUserId(null); // リプライ対象のユーザーIDをリセット
                      setReplyPostFileUrl(null); // リプライ対象のファイルURLをリセット
                    }}
                    color={
                      colorMode === "light"
                        ? "custom.theme.light.900"
                        : "custom.theme.dark.200"
                    }
                    position="absolute"
                    _hover={{ opacity: "0.8" }}
                    ml="2"
                    top="1"
                    right="1"
                    cursor="pointer"
                  >
                    <FaTimesIcon
                      size="16px"
                      fill="currentColor"
                      stroke="currentColor"
                    />
                  </Box>
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
                    <Box
                      position="absolute"
                      cursor="pointer"
                      aria-label="Upload file"
                      bg={
                        colorMode === "light"
                          ? "custom.theme.light.500"
                          : "custom.theme.dark.300"
                      }
                      color={
                        colorMode === "light"
                          ? "custom.theme.light.800"
                          : "custom.theme.dark.700"
                      }
                      _hover={{
                        bg:
                          colorMode === "light"
                            ? "custom.theme.light.800"
                            : "gray.400",
                        color:
                          colorMode === "light"
                            ? "custom.theme.light.500"
                            : "#181a24",
                        transition: "all 0.2s ease-in-out",
                      }}
                      borderRadius="50%"
                      w="28px"
                      h="28px"
                      minW="28px"
                      p="0"
                      zIndex="99"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FaPlusIcon
                        size="14px"
                        fill={
                          colorMode === "light"
                            ? "custom.theme.light.800"
                            : "custom.theme.dark.500"
                        }
                        stroke="currentColor"
                      />
                    </Box>
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
                  id="inputValue"
                  position="relative"
                  as="textarea"
                  minH="40px"
                  resize="none"
                  overflow="hidden"
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
                    borderColor:
                      colorMode === "light"
                        ? "custom.theme.light.850"
                        : "custom.theme.dark.300",
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
                  px={10}
                  size="md"
                  color={
                    colorMode === "light" ? "custom.theme.light.900" : "white"
                  }
                  bg={colorMode === "light" ? "white" : "custom.theme.dark.800"}
                  borderColor={
                    colorMode === "light"
                      ? "custom.theme.light.700"
                      : "custom.theme.dark.400"
                  }
                  borderRadius="5px"
                  _placeholder={{
                    color:
                      colorMode === "light"
                        ? "custom.theme.light.600"
                        : "custom.theme.dark.300",
                  }}
                />
                <Tooltip
                  position="absolute"
                  zIndex="100000"
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
                    bg="none"
                    border="none"
                    position="absolute"
                    zIndex="10000"
                    top="8px"
                    right="12px"
                    color={
                      colorMode === "light"
                        ? "custom.theme.light.800"
                        : "custom.theme.dark.300"
                    }
                    _hover={{
                      color:
                        colorMode === "light"
                          ? "custom.theme.light.850"
                          : "custom.theme.dark.100",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onClick={() => {
                      if (isSubmitting) return;
                      const inputValue = document.getElementById("inputValue");
                      if (inputValue === null) return;
                      const inputValueElement =
                        inputValue as HTMLTextAreaElement;
                      if (!inputValueElement.value.trim() && !selectedFile) {
                        showToast({
                          position: "bottom",
                          duration: 4000,
                          isClosable: true,
                          render: ({ onClose }) => (
                            <CustomToast
                              onClose={onClose}
                              title={getMessage({
                                ja: "送信するものが有りません",
                                us: "Nothing to send",
                                cn: "没什么可发送的。",
                                language,
                              })}
                              description={
                                <>
                                  <Box>
                                    {getMessage({
                                      ja: "メッセージまたはファイル添付が必要です",
                                      us: "Message or file attachment required",
                                      cn: "需要信息或文件附件",
                                      language,
                                    })}
                                  </Box>
                                </>
                              }
                            />
                          ),
                        });
                        return;
                      }
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
                    size="30px"
                    icon={
                      isSubmitting ? (
                        <Spinner />
                      ) : (
                        <BsFillSendFillIcon
                          size="20px"
                          fill={
                            colorMode === "light"
                              ? "custom.theme.light.850"
                              : "custom.theme.dark.300"
                          }
                          stroke="currentColor"
                        />
                      )
                    }
                    aria-label="送信"
                  />
                </Tooltip>
              </Stack>
              {selectedFile && (
                <Box mt={2}>
                  {previewUrl ? (
                    <>
                      <Box position="relative" display="inline-block">
                        <Tooltip label="aaaa" placement="right" hasArrow>
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            maxH="64px"
                            maxW="128px"
                            objectFit="contain"
                            borderRadius="md"
                            border="2px solid"
                            borderColor={
                              colorMode === "light"
                                ? "custom.theme.light.500"
                                : "custom.theme.dark.500"
                            }
                            outline="1px solid"
                            outlineColor={
                              colorMode === "light"
                                ? "custom.theme.light.800"
                                : "custom.theme.dark.100"
                            }
                          />
                        </Tooltip>
                        <CustomCloseButton
                          colorMode={colorMode}
                          onClick={clearFileSelection}
                          top="-4px"
                          right="-6px"
                        />
                        <Box
                          position="absolute"
                          bottom="-1px"
                          left="-1px"
                          py="0"
                          px="3px"
                          borderRadius="5px"
                          border="1px solid"
                          borderColor={
                            colorMode === "light"
                              ? "custom.theme.light.900"
                              : "custom.theme.dark.100"
                          }
                          bg={
                            colorMode === "light"
                              ? "custom.theme.light.500"
                              : "custom.theme.dark.500"
                          }
                          fontSize="12px"
                        >
                          {selectedFileSize}
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Box
                        position="relative"
                        border="1px solid"
                        borderRadius="6px"
                        borderColor={
                          colorMode === "light"
                            ? "custom.theme.light.800"
                            : "custom.theme.dark.100"
                        }
                        color={
                          colorMode === "light"
                            ? "custom.theme.light.850"
                            : "custom.theme.dark.100"
                        }
                        bg={
                          colorMode === "light"
                            ? "custom.theme.light.500"
                            : "custom.theme.dark.500"
                        }
                        px="2px"
                        py="1px"
                        mb="3px"
                      >
                        <Text
                          fontSize="sm"
                          pr="16px"
                          color={
                            colorMode === "light"
                              ? "custom.theme.light.850"
                              : "custom.theme.dark.100"
                          }
                        >
                          {selectedFileName}
                        </Text>
                        <CustomCloseButton
                          colorMode={colorMode}
                          onClick={clearFileSelection}
                          top="-4px"
                          right="-8px"
                        />
                      </Box>
                      <Box
                        py="0"
                        px="3px"
                        borderRadius="5px"
                        border="1px solid"
                        borderColor={
                          colorMode === "light"
                            ? "custom.theme.light.850"
                            : "custom.theme.dark.100"
                        }
                        color={
                          colorMode === "light"
                            ? "custom.theme.light.850"
                            : "custom.theme.dark.100"
                        }
                        bg={
                          colorMode === "light"
                            ? "custom.theme.light.500"
                            : "custom.theme.dark.500"
                        }
                        fontSize="12px"
                      >
                        {selectedFileSize}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Stack>
            <Modal
              isOpen={fileModalOpen}
              onClose={() => setFileModalOpen(false)}
              // size="full"
            >
              <ModalOverlay />
              <ModalContent
                maxW="100vw"
                maxH="100vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <ModalBody
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  w="100%"
                  h="100%"
                  p="0"
                  m="0"
                  style={{
                    backgroundColor: colorMode === "light" ? "#f2e9df" : "#333",
                    backgroundImage:
                      colorMode === "light"
                        ? `
                    linear-gradient(45deg, #fff 25%, transparent 25%),
                    linear-gradient(135deg, #fff 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #fff 75%),
                    linear-gradient(135deg, transparent 75%, #fff 75%)
                    `
                        : `
                      linear-gradient(45deg, #000 25%, transparent 25%),
                      linear-gradient(135deg, #000 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #000 75%),
                      linear-gradient(135deg, transparent 75%, #000 75%)
                  `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 0, 10px -10px, 0px 10px",
                    backgroundAttachment: "fixed",
                  }}
                >
                  {selectedImageUrl && (
                    <TransformWrapper
                      initialScale={1}
                      minScale={1}
                      maxScale={4}
                      centerOnInit={true}
                      wheel={{ step: 0.2 }}
                      doubleClick={{ step: 0.5 }}
                    >
                      {({ zoomIn, zoomOut, resetTransform }) => (
                        <>
                          <TransformComponent
                            wrapperStyle={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            contentStyle={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {selectedImageUrl.match(/\.mp4$/) ? (
                              <video
                                src={selectedImageUrl}
                                autoPlay
                                loop
                                muted
                                style={{
                                  maxWidth: "80vw",
                                  maxHeight: "80vh",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <Image
                                src={selectedImageUrl}
                                alt="Uploaded image"
                                loading="lazy"
                                maxW="80vw"
                                maxH="80vh"
                                objectFit="contain"
                              />
                            )}
                          </TransformComponent>
                          <Box
                            position="absolute"
                            bottom="20px"
                            right="20px"
                            display="flex"
                            gap="10px"
                            zIndex="1000"
                          >
                            <Box
                              onClick={() => zoomIn()}
                              color={
                                colorMode === "light"
                                  ? "custom.theme.light.850"
                                  : "custom.theme.dark.800"
                              }
                              bg="white"
                              border="1px solid"
                              borderColor={
                                colorMode === "light"
                                  ? "custom.theme.light.850"
                                  : "custom.theme.dark.800"
                              }
                              _hover={{
                                bg:
                                  colorMode === "light"
                                    ? "custom.theme.light.100"
                                    : "custom.theme.dark.100",
                                transition: "all 0.2s ease-in-out",
                              }}
                              _focus={{
                                boxShadow: "none",
                              }}
                              cursor="pointer"
                              borderRadius="md"
                              boxSize="32px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <FaPlusIcon
                                size="14px"
                                fill="custom.theme.light.900"
                                stroke="currentColor"
                              />
                            </Box>
                            <Box
                              onClick={() => zoomOut()}
                              color={
                                colorMode === "light"
                                  ? "custom.theme.light.850"
                                  : "custom.theme.dark.800"
                              }
                              bg="white"
                              border="1px solid"
                              borderColor={
                                colorMode === "light"
                                  ? "custom.theme.light.850"
                                  : "custom.theme.dark.800"
                              }
                              _hover={{
                                bg:
                                  colorMode === "light"
                                    ? "custom.theme.light.100"
                                    : "custom.theme.dark.100",
                                transition: "all 0.2s ease-in-out",
                              }}
                              _focus={{
                                boxShadow: "none",
                              }}
                              cursor="pointer"
                              borderRadius="md"
                              boxSize="32px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <FaMinusIcon
                                size="18px"
                                fill="custom.theme.light.900"
                                stroke="currentColor"
                              />
                            </Box>

                            <Box
                              onClick={() => resetTransform()}
                              color={
                                colorMode === "light"
                                  ? "custom.theme.light.850"
                                  : "custom.theme.dark.800"
                              }
                              bg="white"
                              border="1px solid"
                              borderColor={
                                colorMode === "light"
                                  ? "custom.theme.light.850"
                                  : "custom.theme.dark.800"
                              }
                              _hover={{
                                bg:
                                  colorMode === "light"
                                    ? "custom.theme.light.100"
                                    : "custom.theme.dark.100",
                                transition: "all 0.2s ease-in-out",
                              }}
                              _focus={{
                                boxShadow: "none",
                              }}
                              cursor="pointer"
                              borderRadius="md"
                              boxSize="32px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <FaRedoIcon
                                size="16px"
                                fill="custom.theme.light.900"
                                stroke="currentColor"
                              />
                            </Box>
                          </Box>
                        </>
                      )}
                    </TransformWrapper>
                  )}
                </ModalBody>
              </ModalContent>
            </Modal>
            <Modal
              isOpen={isOpen && activeDrawer === "blogModal"}
              onClose={handleClose}
              size="2xl"
            >
              <ModalOverlay />
              <ModalContent
                bg={
                  colorMode === "light"
                    ? "custom.theme.light.500"
                    : "custom.theme.dark.500"
                }
              >
                <ModalHeader fontWeight={400} fontSize="md" py={2} px={4}>
                  <Text>{threadTitle}</Text>
                </ModalHeader>
                <CustomModalCloseButton
                  colorMode={colorMode}
                  onClose={onClose}
                  outline={colorMode === "light" ? "4px solid" : "6px solid"}
                  outlineColor={
                    colorMode === "light"
                      ? "custom.theme.light.500"
                      : "custom.theme.dark.500"
                  }
                  top="-4px"
                  right="-4px"
                />
                <ModalBody h="100%" m={0} p={0}>
                  {/* <iframe
                    src={`/blog/${threadBlogUrl}`}
                    style={{
                      width: "100%",
                      height: "80vh",
                      border: "none",
                    }}
                  /> */}
                  <Box width="100%" height="100%" border="none" m="0" p="0">
                    {/* <AspectRatio ratio={16 / 9}> */}
                    <Box width="100%" height="100%">
                      <ContentDisplay content={content} />
                    </Box>
                    {/* </AspectRatio> */}
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
            <SidebarBBS isMain={false} />
            <Content>
              {isSomeiyoshinoActive && <seasonalAnimations.someiyoshino />}
              {isHachisukaActive && <seasonalAnimations.hachisuka />}
              {isYaeActive && <seasonalAnimations.yae />}
              {isFirefly && <seasonalAnimations.firefly />}
              {isMilkyWay && <seasonalAnimations.milkyway />}
              {isFirework && <seasonalAnimations.firework.senkou />}
              {isFirework && colorMode === "dark" && (
                <seasonalAnimations.firework.standard />
              )}

              <Box
                as="a"
                href="#"
                position="fixed"
                top="46px"
                zIndex="1100"
                opacity={isScrolling ? 1 : 0}
                onClick={(e) => {
                  if (threadBlogUrl) {
                    e.preventDefault();
                    handleOpen("blogModal");
                  }
                }}
                cursor="pointer"
              >
                <Box
                  display={{
                    base: "none",
                    sm: "block",
                    md: "block",
                    lg: "block",
                    xl: "block",
                  }}
                  m={0}
                  pt={0}
                  border="1px solid #bfb0a4"
                  borderRadius="md"
                  backdropFilter="blur(10px)"
                  _hover={{
                    bg: threadBlogUrl
                      ? colorMode === "light"
                        ? "custom.theme.light.50"
                        : "custom.theme.dark.100"
                      : "",
                    transition: "all 0.2s ease-in-out",
                  }}
                  css={
                    threadBlogUrl
                      ? css`
                          animation: ${blink(color)} 2s linear;
                        `
                      : "none"
                  }
                >
                  <Box borderRadius="md" py={0} px={1} fontWeight="600">
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
                      <Flex
                        justifyContent="center"
                        alignItems="center"
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
                        {threadBlogUrl && (
                          <FaMicroblogIcon
                            size="18px"
                            fill={
                              colorMode === "light"
                                ? "custom.theme.light.900"
                                : "custom.theme.dark.100"
                            }
                            stroke="currentColor"
                          />
                        )}
                      </Flex>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                position="sticky"
                zIndex="2001"
                top="44px"
                fontSize="14px"
                textAlign="center"
                opacity={isScrolling ? 1 : 0}
                transition="opacity 0.3s ease"
                pointerEvents="none"
              >
                <Box
                  display="inline-block"
                  backdropFilter="blur(5px)"
                  borderRadius="full"
                  px="4px"
                >
                  <Text
                    display="inline"
                    fontSize="14px"
                    transition="all 0.3s ease-in-out"
                  >
                    {currentDate}
                  </Text>
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
                    {getMessage({
                      ja: currentUserMainCompany || "",
                      language,
                    })}
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
                          <Box className="post" overflowX="hidden">
                            {isNewDay && ( //日付の区切り線
                              <>
                                <Box
                                  ref={(el) => {
                                    dateRefs.current[index] = {
                                      date: formatDate(
                                        post.created_at,
                                        prevDateString,
                                        false
                                      ),
                                      ref: el,
                                    };
                                  }}
                                />
                                <Box
                                  top="40px"
                                  zIndex="10"
                                  py="1"
                                  textAlign="center"
                                >
                                  <HStack>
                                    <Divider borderColor="gray.500" />
                                    <Text
                                      fontSize="13px"
                                      whiteSpace="nowrap"
                                      mx="1"
                                      lineHeight="1.2"
                                      zIndex={1000}
                                      color={
                                        colorMode === "light"
                                          ? "custom.theme.light.900"
                                          : "custom.theme.dark.200"
                                      }
                                    >
                                      {formatDate(
                                        post.created_at,
                                        prevDateString,
                                        false
                                      )}
                                    </Text>
                                    <Divider borderColor="gray.500" />
                                  </HStack>
                                </Box>
                              </>
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
                              onMouseDown={(e) =>
                                handleLongPressStart(post.id, e)
                              } // 長押し開始
                              onMouseUp={handleMouseUp} // マウスアップで長押し終了
                              onMouseLeave={handleMouseLeave} // マウスが要素から離れたときに長押しを終了
                              onMouseMove={handleLongPressMove} // マウス移動を追跡
                              onTouchStart={(e) =>
                                handleLongPressStart(post.id, e)
                              } // タッチ開始
                              onTouchEnd={handleMouseUp} // タッチ終了
                              onTouchMove={handleLongPressMove} // タッチ移動を追跡
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
                                        <Box role="group" position="relative">
                                          <Box position="relative">
                                            <FaTrashCanBodyIcon
                                              size="20px"
                                              fill="custom.theme.light.900"
                                              stroke="currentColor"
                                            />
                                          </Box>
                                          <Box
                                            position="absolute"
                                            top="0px"
                                            transition="transform 0.2s ease"
                                            _groupHover={{
                                              transform: "translateY(-2px)",
                                            }}
                                          >
                                            <FaTrashCanHeadIcon
                                              size="20px"
                                              fill="custom.theme.light.900"
                                              stroke="currentColor"
                                            />
                                          </Box>
                                        </Box>

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
                                        <FaReplyIcon
                                          size="18px"
                                          fill="custom.theme.light.900"
                                          stroke="currentColor"
                                        />
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
                                    zIndex="1000"
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
                                              <Box
                                                position="relative"
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
                                                      "4px";
                                                    tooltip.style.zIndex =
                                                      "1000";

                                                    tooltip.style.right = "0px"; // 親の右端に合わせる
                                                    tooltip.style.bottom =
                                                      "100%"; // 親の上に表示
                                                    tooltip.style.marginBottom =
                                                      "4px"; // 上に少し離す

                                                    e.currentTarget.appendChild(
                                                      tooltip
                                                    );
                                                    e.currentTarget.dataset.tooltip =
                                                      tooltip.id; // データ属性にIDを保存
                                                  }
                                                }}
                                              >
                                                <FaPaperclipIcon
                                                  size="14px"
                                                  fill={
                                                    colorMode === "light"
                                                      ? "custom.theme.light.900"
                                                      : "custom.theme.dark.100"
                                                  }
                                                />
                                              </Box>
                                            </>
                                          )}
                                        </Box>
                                      )}
                                    </Flex>
                                    <Divider borderColor="gray.400" />
                                  </CardBody>
                                )}
                                <CardBody px="8px" py="5px" zIndex="1000">
                                  <Box
                                    fontFamily="Noto Sans JP"
                                    fontWeight="200"
                                    color="black"
                                    fontSize="15px"
                                  >
                                    <ExternalLinkText content={post.content} />
                                  </Box>
                                  {post.file_url && (
                                    <>
                                      {post.file_url.match(
                                        /\.(jpeg|jpg|gif|png|mp4|bmp|webp)$/i
                                      ) ? (
                                        post.file_url.endsWith(".mp4") ? (
                                          <Box position="relative">
                                            <Box
                                              borderRadius="10px"
                                              overflow="hidden"
                                            >
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
                                            </Box>
                                            <Box
                                              position="absolute"
                                              bottom="3px"
                                              left="3px"
                                              py="0"
                                              px="3px"
                                              borderRadius="5px"
                                              border="1px solid"
                                              borderColor={
                                                colorMode === "light"
                                                  ? "custom.theme.light.900"
                                                  : "custom.theme.dark.100"
                                              }
                                              bg={
                                                colorMode === "light"
                                                  ? "custom.theme.light.500"
                                                  : "custom.theme.dark.500"
                                              }
                                              fontSize="12px"
                                            >
                                              <FileSizeDisplay
                                                fileUrl={post.file_url}
                                                fileSize={post.file_size}
                                              />
                                            </Box>
                                            <Box
                                              position="absolute"
                                              zIndex="5"
                                              onClick={(e) => {
                                                handleDownload(
                                                  post.file_url,
                                                  post.original_file_name
                                                );
                                              }}
                                              cursor="pointer"
                                              borderRadius="50%"
                                              color={
                                                colorMode === "light"
                                                  ? "custom.theme.light.900"
                                                  : "custom.theme.dark.800"
                                              }
                                              border="1px solid"
                                              borderColor={
                                                colorMode === "light"
                                                  ? "custom.theme.light.900"
                                                  : "gray.800"
                                              }
                                              outline={
                                                post.content
                                                  ? "2px solid"
                                                  : "3px solid"
                                              }
                                              outlineColor={
                                                post.user_uid === currentUserId
                                                  ? "#dbf7c6"
                                                  : "white"
                                              }
                                              _hover={{
                                                bg:
                                                  colorMode === "light"
                                                    ? "#8d7c6f"
                                                    : "gray.400",
                                                color:
                                                  colorMode === "light"
                                                    ? "#f0e4da"
                                                    : "#181a24",
                                                transition:
                                                  "all 0.3s ease-in-out",
                                              }}
                                              top="-7px"
                                              right="-9px"
                                              p="2px"
                                              mr="3px"
                                              w="26px"
                                              h="26px"
                                              bg={
                                                colorMode === "light"
                                                  ? "#f0e4da"
                                                  : "custom.theme.dark.100"
                                              }
                                              textOverflow="ellipsis"
                                              display="flex" // displayをflexに変更
                                              alignItems="center" // 垂直方向の中央揃え
                                              justifyContent="center" // 水平方向の中央揃え
                                            >
                                              <FaDownloadIcon
                                                size="16px"
                                                fill="currentColor"
                                                stroke="currentColor"
                                              />
                                            </Box>
                                          </Box>
                                        ) : (
                                          <>
                                            <Box
                                              position="relative"
                                              display="inline-block"
                                              mt="8px"
                                              borderRadius="5px"
                                              border="1px solid"
                                              borderColor={
                                                colorMode === "light"
                                                  ? "custom.theme.light.800"
                                                  : "custom.theme.dark.800"
                                              }
                                            >
                                              <Image
                                                src={post.file_url}
                                                alt="Uploaded image"
                                                cursor="pointer"
                                                borderRadius="5px"
                                                loading="lazy"
                                                style={{
                                                  maxWidth: "100%",
                                                  maxHeight: "240px",
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
                                              <Box
                                                position="absolute"
                                                bottom="3px"
                                                left="3px"
                                                py="0"
                                                px="3px"
                                                borderRadius="5px"
                                                border="1px solid"
                                                borderColor={
                                                  colorMode === "light"
                                                    ? "custom.theme.light.900"
                                                    : "custom.theme.dark.100"
                                                }
                                                color={
                                                  colorMode === "light"
                                                    ? "custom.theme.light.900"
                                                    : "custom.theme.dark.100"
                                                }
                                                bg={
                                                  colorMode === "light"
                                                    ? "custom.theme.light.500"
                                                    : "custom.theme.dark.500"
                                                }
                                                fontSize="12px"
                                              >
                                                <FileSizeDisplay
                                                  fileUrl={post.file_url}
                                                  fileSize={post.file_size}
                                                />
                                              </Box>
                                              <Box
                                                position="absolute"
                                                zIndex="5"
                                                onClick={(e) => {
                                                  handleDownload(
                                                    post.file_url,
                                                    post.original_file_name
                                                  );
                                                }}
                                                cursor="pointer"
                                                borderRadius="50%"
                                                color={
                                                  colorMode === "light"
                                                    ? "custom.theme.light.900"
                                                    : "custom.theme.dark.800"
                                                }
                                                border="1px solid"
                                                borderColor={
                                                  colorMode === "light"
                                                    ? "custom.theme.light.900"
                                                    : "gray.800"
                                                }
                                                outline={
                                                  post.content
                                                    ? "2px solid"
                                                    : "3px solid"
                                                }
                                                outlineColor={
                                                  post.user_uid ===
                                                  currentUserId
                                                    ? "#dbf7c6"
                                                    : "white"
                                                }
                                                _hover={{
                                                  bg:
                                                    colorMode === "light"
                                                      ? "#8d7c6f"
                                                      : "gray.400",
                                                  color:
                                                    colorMode === "light"
                                                      ? "#f0e4da"
                                                      : "#181a24",
                                                  transition:
                                                    "all 0.3s ease-in-out",
                                                }}
                                                top="-7px"
                                                right="-9px"
                                                p="2px"
                                                mr="3px"
                                                w="26px"
                                                h="26px"
                                                bg={
                                                  colorMode === "light"
                                                    ? "#f0e4da"
                                                    : "custom.theme.dark.100"
                                                }
                                                textOverflow="ellipsis"
                                                display="flex" // displayをflexに変更
                                                alignItems="center" // 垂直方向の中央揃え
                                                justifyContent="center" // 水平方向の中央揃え
                                              >
                                                <FaDownloadIcon
                                                  size="16px"
                                                  fill="currentColor"
                                                  stroke="currentColor"
                                                />
                                              </Box>
                                            </Box>
                                          </>
                                        )
                                      ) : (
                                        <>
                                          <Box
                                            position="relative"
                                            border="1px solid"
                                            borderRadius="6px"
                                            borderColor={
                                              colorMode === "light"
                                                ? "#bfb0a4"
                                                : "gray.800"
                                            }
                                            color={
                                              colorMode === "light"
                                                ? "#8d7c6f"
                                                : "#181a24"
                                            }
                                            bg={
                                              colorMode === "light"
                                                ? "#f0e4da"
                                                : "custom.theme.dark.100"
                                            }
                                            px="2"
                                            py="1"
                                            mt={post.content ? "6px" : "0px"}
                                          >
                                            <Text
                                              pr="10px"
                                              color={
                                                colorMode === "light"
                                                  ? "custom.theme.light.900"
                                                  : "custom.theme.dark.700"
                                              }
                                            >
                                              {post.original_file_name}
                                            </Text>
                                            <Box
                                              position="absolute"
                                              zIndex="5"
                                              onClick={(e) => {
                                                handleDownload(
                                                  post.file_url,
                                                  post.original_file_name
                                                );
                                              }}
                                              cursor="pointer"
                                              color={
                                                colorMode === "light"
                                                  ? "custom.theme.light.900"
                                                  : "custom.theme.dark.800"
                                              }
                                              borderRadius="50%"
                                              border="1px solid"
                                              borderColor={
                                                colorMode === "light"
                                                  ? "custom.theme.light.900"
                                                  : "gray.800"
                                              }
                                              outline={
                                                post.content
                                                  ? "2px solid"
                                                  : "3px solid"
                                              }
                                              outlineColor={
                                                post.user_uid === currentUserId
                                                  ? "#dbf7c6"
                                                  : "white"
                                              }
                                              _hover={{
                                                bg:
                                                  colorMode === "light"
                                                    ? "#8d7c6f"
                                                    : "gray.400",
                                                color:
                                                  colorMode === "light"
                                                    ? "#f0e4da"
                                                    : "#181a24",
                                                transition:
                                                  "all 0.3s ease-in-out",
                                              }}
                                              top="-7px"
                                              right="-9px"
                                              p="2px"
                                              mr="3px"
                                              w="26px"
                                              h="26px"
                                              bg={
                                                colorMode === "light"
                                                  ? "#f0e4da"
                                                  : "custom.theme.dark.100"
                                              }
                                              textOverflow="ellipsis"
                                              display="flex" // displayをflexに変更
                                              alignItems="center" // 垂直方向の中央揃え
                                              justifyContent="center" // 水平方向の中央揃え
                                            >
                                              <FaDownloadIcon
                                                size="16px"
                                                fill="currentColor"
                                                stroke="currentColor"
                                              />
                                            </Box>
                                          </Box>
                                          <Box
                                            display="inline-block"
                                            bottom="3px"
                                            left="3px"
                                            py="0"
                                            px="3px"
                                            borderRadius="5px"
                                            border="1px solid"
                                            borderColor={
                                              colorMode === "light"
                                                ? "custom.theme.light.900"
                                                : "custom.theme.dark.100"
                                            }
                                            color={
                                              colorMode === "light"
                                                ? "custom.theme.light.900"
                                                : "custom.theme.dark.100"
                                            }
                                            bg={
                                              colorMode === "light"
                                                ? "custom.theme.light.500"
                                                : "custom.theme.dark.500"
                                            }
                                            fontSize="12px"
                                          >
                                            <FileSizeDisplay
                                              fileUrl={post.file_url}
                                              fileSize={post.file_size}
                                            />
                                          </Box>
                                        </>
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
                                <UrlPreviewBox
                                  url={url}
                                  isExpanded={isExpanded}
                                  onToggle={() =>
                                    setExpandedUrls((prev) => ({
                                      ...prev,
                                      [url]: !prev[url],
                                    }))
                                  }
                                  urlHistory={urlHistory}
                                  currentUrlIndex={currentUrlIndex}
                                  urlTitles={urlTitles}
                                  goBack={goBack}
                                  addToHistory={addToHistory}
                                  setUrlTitles={setUrlTitles}
                                  setExpandedUrls={setExpandedUrls}
                                  setCurrentUrlIndex={setCurrentUrlIndex}
                                  colorMode={colorMode}
                                  currentUserId={currentUserId ?? ""}
                                  postUserId={post.user_uid}
                                />
                              );
                            })()}
                          </Box>
                        </>
                      );
                    })
                )}
              </Stack>
              <Box mb="10vh" />
            </Content>
            <CalendarDisplay />
          </div>
        </>
      )}
    </Box>
  );
}
