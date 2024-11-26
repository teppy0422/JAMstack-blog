"use client";

import { useEffect, useState } from "react";
import { MdBusiness, MdChat } from "react-icons/md";
import { useCustomToast } from "../../components/customToast";

import {
  Box,
  Heading,
  Divider,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Text,
  Stack,
  Input,
  Button,
  Badge,
} from "@chakra-ui/react";
import { supabase } from "../../utils/supabase/client";
import Link from "next/link";
import Content from "../../components/content";
import Sidebar from "../../components/sidebar";
import { useUserData } from "../../hooks/useUserData";
import { useUserInfo } from "../../hooks/useUserId";

export default function Threads() {
  const [threads, setThreads] = useState<any[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);

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
      setThreads(data);
    }
    setLoading(false);
  };
  //新規スレッド作成
  const createThread = async () => {
    setLoading(true);
    await supabase.from("threads").insert([
      {
        title: newThreadTitle,
        company: userCompany,
        mainCompany: userMainCompany,
      },
    ]);
    setNewThreadTitle("");
    await fetchThreads();
    setLoading(false);
  };
  // スレッドを会社ごとにグループ化
  const groupedThreads = threads.reduce((acc, thread) => {
    if (!acc[thread.mainCompany]) {
      acc[thread.mainCompany] = []; // 会社名がまだない場合は新しい配列を作る
    }
    acc[thread.mainCompany].push(thread); // スレッドを会社名の配列に追加
    return acc;
  }, {});
  const showToast = useCustomToast();

  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <Heading size="md" mb="4">
          問い合わせ
        </Heading>
        <Box fontSize="sm" mb="4" fontWeight={400}>
          ログイン登録した同じ会社のみ閲覧可能です
        </Box>
        {ipAddress}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Heading size="md" pr={2}>
              Loading...
            </Heading>
            <Spinner size="md" />
          </Box>
        ) : (
          <Accordion
            allowMultiple
            defaultIndex={Object.keys(groupedThreads).reduce<number[]>(
              (acc, mainCompany, index) => {
                const isDifferentCompany =
                  mainCompany !== "開発" &&
                  userMainCompany !== "開発" &&
                  mainCompany !== userMainCompany;

                if (!isDifferentCompany) {
                  acc.push(index);
                }
                return acc;
              },
              []
            )}
          >
            {Object.keys(groupedThreads)
              .sort((a, b) => {
                if (a === "開発") return -1; // "開発" を最初に
                if (b === "開発") return 1;
                return 0; // その他はそのまま
              })
              .map((mainCompany) => {
                const isDifferentCompany =
                  mainCompany !== "開発" &&
                  userMainCompany !== "開発" &&
                  mainCompany !== userMainCompany;

                return (
                  <AccordionItem
                    key={mainCompany}
                    borderBottom="1px solid gray"
                    my={0}
                  >
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          <Heading size="md">{mainCompany}</Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={2}>
                      {
                        groupedThreads[mainCompany].reduce(
                          (acc, thread) => {
                            const isThreadDifferentCompany =
                              thread.mainCompany !== "開発" &&
                              userMainCompany !== "開発" &&
                              thread.mainCompany !== userMainCompany; // スレッドの会社が異なるかどうかを判定

                            if (!acc.seenCompanies.has(thread.company)) {
                              acc.seenCompanies.add(thread.company);
                              acc.elements.push(
                                <Box
                                  fontWeight="bold"
                                  pl={0}
                                  textAlign="left"
                                  key={`company-${thread.company}`}
                                >
                                  <Icon as={MdBusiness} boxSize={4} mr={1} />
                                  {thread.company}
                                </Box>
                              );
                            }

                            acc.elements.push(
                              <Box key={thread.id} py={0}>
                                {isThreadDifferentCompany ? (
                                  // アクセスできない場合の表示
                                  <Box
                                    _hover={{
                                      cursor: "default",
                                    }}
                                    color="gray.500" // アクセスできない場合の色を変更
                                    ml={5}
                                    fontFamily="Noto Sans JP"
                                    onClick={() => {
                                      showToast(
                                        "閲覧できません",
                                        "閲覧できるのは同じ会社のみです",
                                        "error"
                                      );
                                    }}
                                  >
                                    {thread.title}
                                  </Box>
                                ) : (
                                  // アクセスできる場合のリンク
                                  <Link href={`/thread/${thread.id}`}>
                                    <Box
                                      _hover={{
                                        textDecoration: "underline",
                                        textDecorationThickness: "1px",
                                        textUnderlineOffset: "3px",
                                      }}
                                      ml={5}
                                      fontFamily="Noto Sans JP"
                                      fontWeight="400"
                                    >
                                      {thread.title}
                                    </Box>
                                  </Link>
                                )}
                              </Box>
                            );
                            return acc;
                          },
                          { seenCompanies: new Set(), elements: [] }
                        ).elements
                      }
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
          </Accordion>
        )}
        <Divider mb={2} />
        <Badge variant="outline" mr={2}>
          {userMainCompany}
        </Badge>
        <Badge variant="outline" mr={2}>
          {userCompany}
        </Badge>
        <Stack spacing="4" mt="2" direction="row" justify="flex-end">
          <Input
            type="text"
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            placeholder="新規スレッドのタイトル"
            size="md"
            bg="white"
            _focus={{ borderColor: "gray.400" }} // フォーカス時のボーダー色を変更
          />
          <Button
            onClick={createThread}
            colorScheme="gray"
            width="5em"
            outline="1px solid black"
          >
            新規作成
          </Button>
        </Stack>
      </Content>
    </>
  );
}
