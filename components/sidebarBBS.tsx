import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  VStack,
  useDisclosure,
  useColorMode,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import { supabase } from "../utils/supabase/client-js";

import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import { useUserData } from "../hooks/useUserData";
import { useUserInfo } from "../hooks/useUserId";

function SidebarBBS() {
  const [currentPath, setCurrentPath] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [threads, setThreads] = useState<
    { id: string; title: string; company: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState("");
  const [newThreads, setNewThreads] = useState<string[]>([]);
  const { data: session } = useSession();

  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany } = useUserData(userId);

  //新しい投稿の監視
  useEffect(() => {
    const subscription = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          console.log("New post payload:", payload); // デバッグ用
          setNewThreads((prev) => {
            const updatedThreads = [...prev, payload.new.thread_id];
            console.log("Updated newThreads:", updatedThreads); // デバッグ用
            return updatedThreads;
          });
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const buttonStyle = (path) => ({
    p: "2",
    w: "full",
    _hover: { bg: "gray.900" },
    cursor: "pointer",
    // colorScheme: currentPath === path ? "red" : "gray", // 現在のパスと一致する場合は赤色テーマ、そうでなければ灰色テーマ
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
          onClick={isDifferentCompany ? undefined : onClose} // 会社が異なる場合はクリックイベントを無効にする
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
          py={2}
          pl={3}
          cursor={isDifferentCompany ? "not-allowed" : "pointer"}
          opacity={isDifferentCompany ? 0.6 : 1}
        >
          {isNew && (
            <Box
              as="span"
              backgroundColor="red"
              position="absolute"
              left="0"
              top="0"
              transform="translate(50%, 75%)"
              width="6px"
              height="1em"
            />
          )}
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
              <Box fontWeight="bold" pl={3} textAlign="left">
                <Divider
                  borderColor={colorMode === "light" ? "black" : "white"}
                />
                {company}
              </Box>
              {threads.map(
                (thread: { id: string; title: string; company: string }) => {
                  const isCurrentPage = currentPath === `/thread/${thread.id}`;
                  const isDifferentCompany =
                    thread.company !== "開発" &&
                    userCompany !== "開発" &&
                    thread.company !== userCompany;

                  return (
                    <Box display="flex" alignItems="center">
                      {isCurrentPage && (
                        <Box as="span" mr={2}>
                          &gt;
                        </Box>
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

      {/* <IconButton
        display={{ base: "block", xl: "block" }}
        icon={<HamburgerIcon />}
        bg="white.1"
        aria-label="Open Menu"
        onClick={onOpen}
        position="fixed"
        top="8px"
        left="10px"
        zIndex="1101" // アイコンが他の要素の後ろに隠れないようにする
        opacity="0.85"
        borderColor={colorMode === "light" ? "black" : "white"}
        borderWidth="1px"
      />

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent
            w={["75%", "50%", "25%"]}
            maxW="200px"
            bg="rgba(255, 255, 255, 0.4)" // 背景の透明度を設定
            backdropFilter="blur(10px)" // ブラー効果を設定
          >
            <DrawerHeader color="white">MENU</DrawerHeader>
            <DrawerBody>
              <VStack spacing="2" align="stretch">
                <>
                  <Divider borderColor="white" />
                  {menuItem("/directoryLayout", "ディレクトリ構成", false)}
                  <Divider borderColor="white" />
                  {menuItem("/download", "ダウンロード", false)}
                  <Divider borderColor="white" />
                  {menuItem("/BBS", "不具合報告", false)}
                  <Divider borderColor="white" />
                </>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer> */}
    </>
  );
}

export default SidebarBBS;
