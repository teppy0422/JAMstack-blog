import { useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { MdBusiness, MdChat } from "react-icons/md";
import { useCustomToast } from "../components/customToast";
import { GetColor } from "../components/CustomColor";

import {
  Box,
  VStack,
  useDisclosure,
  useColorMode,
  Divider,
  useBreakpointValue,
  Icon,
  HStack,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { supabase } from "../utils/supabase/client-js";
import { MdCheckBox } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";

import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { useUserData } from "../hooks/useUserData";
import { useUserInfo } from "../hooks/useUserId";

import getMessage from "../components/getMessage";
import { useLanguage } from "../context/LanguageContext";

// import { AppContext } from "../pages/_app";

const SidebarBBS: React.FC<{ isMain?: boolean; reload?: boolean }> = ({
  isMain,
  reload,
}) => {
  const { language, setLanguage } = useLanguage();

  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPath, setCurrentPath] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [threads, setThreads] = useState<
    {
      id: string;
      title: string;
      company: string;
      mainCompany: string;
      projectName: string;
      category: string;
      completed_at: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState("");
  const [newThreads, setNewThreads] = useState<string[]>([]);
  const { data: session } = useSession();
  const [showCompleted, setShowCompleted] = useState(false);
  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

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
  // reloadが変更されたときに再読み込みの処理を行う
  useEffect(() => {
    console.log("SidebarBBS reloaded");
    fetchThreads();
  }, [reload]);

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
    setLoading(true);
    const { data } = await supabase.from("threads").select("*");
    if (data) {
      // 並び替え
      data.sort((a, b) => {
        if (a.company !== b.company) {
          return a.company.localeCompare(b.company);
        }
        if (a.projectName !== b.projectName) {
          return a.projectName.localeCompare(b.projectName);
        }
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
      setThreads(data);
    }
    setLoading(false);
  };

  const [usersData2, setUsersData2] = useState<any[]>([]); // ユーザー情報の状態
  useEffect(() => {
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
    };
    fetchUsers2();
  }, []);

  const menuItem = (
    path_,
    projectName,
    category,
    title,
    useColorMode,
    threadId,
    isDifferentCompany,
    isSameProjectName,
    isCurrentPage,
    completed_at,
    created_at,
    isSameCategory,
    user_uid
  ) => {
    const isNew = newThreads.includes(threadId);
    const user = usersData2.find((user) => user.id === user_uid);

    return (
      <>
        {!isSameProjectName && projectName && (
          <>
            <HStack whiteSpace="nowrap" spacing={0} mt={0}>
              <Box as="span" bg={GetColor(projectName)} bottom="0">
                <Box
                  userSelect="none"
                  cursor="default"
                  fontSize={9}
                  bg={GetColor(projectName)}
                  color="#FFF"
                  borderRadius={0}
                  pl={1.5}
                  pr={1}
                  // py={0.5}
                  my={0}
                >
                  {projectName}
                </Box>
              </Box>
            </HStack>
          </>
        )}
        {!isSameCategory && category !== null && (
          <Flex align="center" whiteSpace="nowrap" h={3.5}>
            <Box h={3.5} w={1} bg={GetColor(projectName)} mr={0.5} />
            <Box
              userSelect="none"
              cursor="default"
              fontSize={9}
              bg={colorMode === "light" ? "transparent" : "white"}
              border={
                colorMode === "light"
                  ? "1px solid " + GetColor(category)
                  : "#000"
              }
              color={GetColor(category)}
              borderRadius={3}
              px={1}
              mt={1}
            >
              {category}
            </Box>
          </Flex>
        )}
        <Box display="flex" alignItems="center" key={threadId}>
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
                    getMessage({
                      ja: "閲覧できません",
                      us: "Cannot view",
                      cn: "无法查看",
                      language,
                    }),
                    getMessage({
                      ja: "閲覧できるのは同じ会社のみです",
                      us: "Only the same company can view",
                      cn: "只有同一家公司可以查看",
                      language,
                    }),
                    "error"
                  );
                }
              }}
              position="relative"
              _hover={{
                bg: colorMode === "light" ? "rgba(255,255,255,0.5)" : "#000",
                width: "100%",
              }}
              bg={
                isCurrentPage &&
                (colorMode === "light" ? "rgba(255,255,255,0.5)" : "#000")
              }
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
              <HStack spacing={0} wrap="nowrap" overflow="hidden">
                <Box
                  position="relative"
                  h={6}
                  w={1}
                  mr={0.5}
                  bg={projectName && GetColor(projectName)}
                  flexShrink={0} // Boxが縮小されないようにする
                />
                {user && (
                  <Avatar
                    boxSize="16px"
                    zIndex="5"
                    loading="lazy"
                    src={user?.picture_url}
                    mr={0.5}
                  />
                )}
                <Box fontSize={isMain ? "md" : "sm"} isTruncated>
                  {getMessage({
                    ja: title,
                    language,
                  })}
                  {projectName && showCompleted && (
                    <>
                      <Box
                        as="span"
                        display="inline-block"
                        fontSize={11}
                        ml={0.5}
                      >
                        {completed_at ? (
                          <>
                            <Box
                              as="span"
                              border={
                                colorMode === "light"
                                  ? "1px solid gray"
                                  : "1px solid gray"
                              }
                              color={colorMode === "light" ? "gray" : "gray"}
                              bg={colorMode === "light" ? "transparent" : ""}
                              px={1}
                            >
                              <FormattedDate date={completed_at} />
                              <DateDifference
                                startDate={created_at}
                                endDate={completed_at}
                              />
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box
                              as="span"
                              border={
                                colorMode === "light"
                                  ? "1px solid red"
                                  : "1px solid pink"
                              }
                              color={colorMode === "light" ? "red" : "pink"}
                              bg={colorMode === "light" ? "transparent" : ""}
                              px={1}
                            >
                              <FormattedDate date={created_at} />
                              <DateDifference
                                startDate={created_at}
                                endDate={Date()}
                              />
                            </Box>
                          </>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              </HStack>
              {/* 未読数の表示 */}
              {unreadCountsByThread[threadId] > 0 && (
                <Box
                  as="span"
                  bg="red"
                  position="absolute"
                  right="0px"
                  bottom="3px"
                  h="50%"
                  px={unreadCountsByThread[threadId] > 99 ? 0.5 : 1}
                  borderRadius="50%"
                  border={
                    colorMode === "light"
                      ? "1px solid #f0e5da"
                      : "1px solid #000"
                  }
                  // opacity="0.8"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight={400}
                  fontSize={unreadCountsByThread[threadId] > 99 ? 6 : 9}
                >
                  {unreadCountsByThread[threadId] || 0}
                </Box>
              )}
            </Box>
          </NextLink>
        </Box>
      </>
    );
  };
  const maxWidth = isMain
    ? "100%"
    : useBreakpointValue({
        base: "0px",
        xl: "180px",
        "2xl": "300px",
        "3xl": "400px",
      });
  let previousMainCompany = "";
  let previousProjectName = "";
  let previousCategory = "";

  interface DateDifferenceProps {
    startDate: string;
    endDate: string;
  }
  const DateDifference: React.FC<DateDifferenceProps> = ({
    startDate,
    endDate,
  }) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return <span>({dayDifference.toFixed(1)}日)</span>;
  };

  interface FormattedDateProps {
    date: string;
  }
  const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
    if (!date) return null;
    const formattedDate = new Date(date)
      .toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
    return <span>{formattedDate}</span>;
  };

  return (
    <>
      {isMain && (
        <>
          <Box display="flex" justifyContent="center">
            <Box textAlign="center">
              <Flex
                align="center"
                gap="2px"
                onClick={toggleShowCompleted}
                userSelect="none"
              >
                {showCompleted ? (
                  <>
                    <MdCheckBox size="18px" />
                  </>
                ) : (
                  <>
                    <MdCheckBoxOutlineBlank size="18px" />
                  </>
                )}
                <Box as="button">完了済みを表示</Box>
              </Flex>
            </Box>
          </Box>
        </>
      )}
      <Box
        display={isMain ? "block" : { base: "none", xl: "block" }}
        position={isMain ? "static" : "fixed"}
        // w={{ base: "0px", xl: "180px", "2xl": "300px", "3xl": "400px" }}
        // maxWidth={{ base: "0px", xl: "180px", "2xl": "300px", "3xl": "400px" }}
        w={maxWidth}
        maxWidth={maxWidth}
        h={isMain ? "" : "80vh"}
        bg="white.200"
        p="0"
        top="60px"
        left="0"
        textAlign="left"
        zIndex="1100"
        fontSize={15}
        fontFamily={getMessage({
          ja: "Noto Sans JP",
          us: "Noto Sans,Noto Sans JP",
          cn: "Noto Sans SC,Noto Sans JP",
          language,
        })}
        fontWeight={400}
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
                  {getMessage({
                    ja: threads[0].mainCompany,
                    language,
                  })}
                  <Divider
                    borderColor={colorMode === "light" ? "black" : "white"}
                  />
                </Box>
              )}
              {company !== "開発" && ( // "開発" でない場合のみ表示
                <Box fontWeight="bold" pl={3} textAlign="left">
                  <Icon as={MdBusiness} boxSize={4} mr={0.5} mt={2} />
                  {getMessage({
                    ja: company,
                    language,
                  })}
                </Box>
              )}
              {threads
                .filter(
                  (thread) => showCompleted || thread.completed_at === null
                )
                .map(
                  (thread: {
                    id: string;
                    title: string;
                    company: string;
                    mainCompany: string;
                    projectName: string;
                    category: string;
                    completed_at: string;
                    created_at: string;
                    user_uid: string;
                  }) => {
                    const isCurrentPage =
                      currentPath === `/thread/${thread.id}/`;
                    const isDifferentCompany =
                      thread.mainCompany !== "開発" &&
                      userMainCompany !== "開発" &&
                      thread.mainCompany !== userMainCompany;
                    previousMainCompany = thread.mainCompany;

                    const currentProjectName = String(
                      thread.company + thread.projectName
                    );
                    const isSameProjectName =
                      currentProjectName === previousProjectName;
                    previousProjectName = currentProjectName;

                    const currentCategory = String(
                      thread.company + thread.projectName + thread.category
                    );
                    const isSameCategory = currentCategory === previousCategory;
                    previousCategory = currentCategory;

                    return (
                      <Box ml={isMain ? "5" : "1"}>
                        {/* {isCurrentPage ? (
                        <Box as="span" mr={-0.5}>
                          &gt;
                        </Box>
                      ) : (
                        <Box as="span" mr={2}></Box>
                        )} */}
                        {menuItem(
                          `/thread/${thread.id}`,
                          thread.projectName,
                          thread.category,
                          thread.title,
                          true,
                          thread.id,
                          isDifferentCompany,
                          isSameProjectName,
                          isCurrentPage,
                          thread.completed_at,
                          thread.created_at,
                          isSameCategory,
                          thread.user_uid
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
};

export default SidebarBBS;
