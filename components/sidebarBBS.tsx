import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { MdBusiness, MdChat } from "react-icons/md";
import { useCustomToast } from "../components/customToast";

import {
  Box,
  VStack,
  useDisclosure,
  useColorMode,
  Divider,
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { supabase } from "../utils/supabase/client-js";

import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { useUserData } from "../hooks/useUserData";
import { useUserInfo } from "../hooks/useUserId";

function SidebarBBS() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPath, setCurrentPath] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [threads, setThreads] = useState<
    { id: string; title: string; company: string; mainCompany: string }[] // 修正: mainCompanyを追加
  >([]);
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState("");
  const [newThreads, setNewThreads] = useState<string[]>([]);
  const { data: session } = useSession();

  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const showToast = useCustomToast();

  const [unreadCountsByThread, setUnreadCountsByThread] = useState<
    Record<string, number>
  >({});

  //新しい投稿の監視
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userId) {
        console.log("userId is null, waiting for it to be set...");
        return;
      }

      console.log("Fetching unread count...");
      console.log("Current userId:", userId);

      const { data, error } = await supabase
        .from("posts")
        .select("id, read_by, thread_id, user_uid, created_at")
        .gt(
          "created_at",
          new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) {
        console.error("Error fetching unread count:", error);
        return;
      }

      const countsByThread = data.reduce((acc, post) => {
        if (
          (!post.read_by || !post.read_by.includes(userId)) &&
          post.user_uid !== userId
        ) {
          acc[post.thread_id] = (acc[post.thread_id] || 0) + 1;
        }
        return acc;
      }, {});

      console.log("Final counts by thread:", countsByThread);

      setUnreadCountsByThread(countsByThread);
      const totalUnreadCount = Object.values(countsByThread).reduce(
        (sum: number, count: number) => sum + count,
        0
      );

      setUnreadCount(totalUnreadCount as number);
      console.log("Unread counts by thread:", countsByThread);
    };

    fetchUnreadCount();

    const subscription = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          if (!userId) {
            console.log("userId is null, waiting for it to be set...");
            return;
          }
          console.log("Real-time notification received:", payload);
          if (
            (!payload.new.read_by || !payload.new.read_by.includes(userId)) &&
            payload.new.user_uid !== userId
          ) {
            fetchUnreadCount();
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Unsubscribing from channel...");
      subscription.unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const buttonStyle = (path) => ({
    p: "2",
    w: "full",
    _hover: { bg: "gray.900" },
    cursor: "pointer",
    // colorScheme: currentPath === path ? "red" : "gray", //
    color: colorMode === "light" ? "white" : "white",
  });
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
  const menuItem = (
    path_,
    label,
    useColorMode,
    threadId,
    isDifferentCompany
  ) => {
    const isNew = newThreads.includes(threadId);

    return (
      <NextLink
        href={isDifferentCompany ? "#" : path_}
        passHref
        legacyBehavior
        key={path_}
      >
        <Box
          {...buttonStyle(path_)}
          onClick={() => {
            if (isDifferentCompany) {
              showToast(
                "閲覧できません",
                "閲覧できるのは同じ会社のみです",
                "error"
              );
            }
          }}
          position="relative"
          _hover={{
            "& span::after": {
              width: "100%",
              transition: "width 0.2s",
              height: "1px",
            },
          }}
          color={useColorMode && colorMode === "light" ? "black" : "white"}
          maxWidth={maxWidth}
          width={maxWidth}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          py={0}
          pl={0}
          cursor={isDifferentCompany ? "default" : "pointer"}
          opacity={isDifferentCompany ? 0.6 : 1}
        >
          <Box
            as="span"
            position="relative"
            fontFamily="Noto Sans JP"
            fontWeight="200"
            _after={{
              content: '""',
              position: "absolute",
              width: "0",
              height: "1px",
              bottom: "-2px",
              left: "0",
              bg: "currentColor",
              transition: "width 0.1s",
              color: useColorMode
                ? colorMode === "light"
                  ? "black"
                  : "white"
                : "white",
            }}
          >
            {label}
          </Box>
          {/* 未読数の表示 */}
          {unreadCountsByThread[threadId] > 0 && (
            <Box
              as="span"
              backgroundColor="red"
              position="absolute"
              right="0px"
              top="3px"
              h="1.1rem"
              w="1.1rem"
              p={1}
              borderRadius="50%"
              opacity="0.8"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight={400}
              fontSize={unreadCountsByThread[threadId] > 99 ? 10 : 12} // 文字数に応じてフォントサイズを変更
            >
              {unreadCountsByThread[threadId] || 0}
            </Box>
          )}
        </Box>
      </NextLink>
    );
  };
  const maxWidth = useBreakpointValue({
    base: "0px",
    xl: "180px",
    "2xl": "300px",
    "3xl": "400px",
  });
  let previousMainCompany = ""; // ここで変数を定義

  return (
    <>
      <Box
        display={{ base: "none", xl: "block" }}
        position="fixed"
        // w={{ base: "0px", xl: "180px", "2xl": "300px", "3xl": "400px" }}
        // maxWidth={{ base: "0px", xl: "180px", "2xl": "300px", "3xl": "400px" }}
        w={maxWidth}
        maxWidth={maxWidth}
        h="80vh"
        bg="white.200"
        p="0"
        top="60px"
        left="0"
        textAlign="left"
        zIndex="1100"
        fontSize={15}
      >
        <VStack spacing="0" align="stretch">
          {Object.entries(
            threads.reduce((acc, thread) => {
              if (thread.company) {
                acc[thread.company] = acc[thread.company] || [];
                acc[thread.company].push(thread);
              }
              return acc;
            }, {} as Record<string, typeof threads>)
          ).map(([company, threads]) => (
            <>
              {threads[0].mainCompany !== previousMainCompany && (
                <Box fontWeight="bold" pl={3} textAlign="left">
                  {threads[0].mainCompany}
                  <Divider
                    borderColor={colorMode === "light" ? "black" : "white"}
                  />
                </Box>
              )}
              {company !== "開発" && ( // "開発" でない場合のみ表示
                <Box fontWeight="bold" pl={3} textAlign="left">
                  <Icon as={MdBusiness} boxSize={4} mr={0.5} mt={2} />
                  {company}
                </Box>
              )}
              {threads.map(
                (thread: {
                  id: string;
                  title: string;
                  company: string;
                  mainCompany: string;
                }) => {
                  const isCurrentPage = currentPath === `/thread/${thread.id}/`;
                  const isDifferentCompany =
                    thread.mainCompany !== "開発" &&
                    userMainCompany !== "開発" &&
                    thread.mainCompany !== userMainCompany;
                  previousMainCompany = thread.mainCompany; // 追加: 前回のmainCompanyを更新
                  return (
                    <Box
                      display="flex"
                      alignItems="center"
                      ml={5}
                      key={thread.id}
                    >
                      {isCurrentPage ? (
                        <Box as="span" mr={-0.5}>
                          &gt;
                        </Box>
                      ) : (
                        <Box as="span" mr={2}></Box>
                      )}
                      {menuItem(
                        `/thread/${thread.id}`,
                        thread.title,
                        true,
                        thread.id,
                        isDifferentCompany
                      )}
                    </Box>
                  );
                }
              )}
            </>
          ))}
        </VStack>
      </Box>
    </>
  );
}

export default SidebarBBS;
