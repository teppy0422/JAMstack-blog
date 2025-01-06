import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Stack,
  Text,
  useBreakpointValue,
  Checkbox,
  Avatar,
  Divider,
  Accordion,
  AccordionItem,
  AccordionIcon,
  AccordionButton,
  AccordionPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Flex,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Tooltip,
} from "@chakra-ui/react";
import { supabase } from "../utils/supabase/client";
import "@fontsource/noto-sans-jp";
import { TodoIcon } from "../components/icons";

import { useLanguage } from "../context/LanguageContext";
import getMessage from "./getMessage";

const BBSTodoList = () => {
  const [todos, setTodos] = useState<
    {
      id: number;
      mainTitle: string;
      title: string;
      value: string;
      complete: boolean;
      details: {
        id: number;
        value: string;
        title: string;
        user_picture: string;
        created_at: string;
        progress: number;
        complete_at: string;
        status: string;
        userName: string;
        user_mainCompany: string;
        user_company: string;
        running: boolean;
      }[];
    }[]
  >([]);
  const [selectedTodo, setSelectedTodo] = useState<{
    id: number;
    mainTitle: string;
    title: string;
    value: string[];
    complete: boolean;
    valueStatus: number[];
    details: {
      id: number;
      value: string;
      title: string;
      user_picture: string;
      created_at: string;
      progress: number;
      complete_at: string;
      status: string;
      userName: string;
      user_mainCompany: string;
      user_company: string;
      running: boolean;
    }[];
  } | null>(null);
  const [newTodo, setNewTodo] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    console.log("Selected Todo:", selectedTodo);
  }, [selectedTodo]);

  useEffect(() => {
    if (selectedTodo) {
      console.log("Selected Todo Value:", selectedTodo.value);
    }
  }, [selectedTodo]);

  const fetchTodos = async () => {
    const { data: todosData, error: todosError } = await supabase
      .from("todo_chat")
      .select("*");

    if (todosError) {
      console.error("Error fetching todos:", todosError);
      return;
    }

    const { data: detailsData, error: detailsError } = await supabase
      .from("todo_chat_detail")
      .select("*");

    if (detailsError) {
      console.error("Error fetching todo details:", detailsError);
      return;
    }

    console.log("Details Data:", detailsData);

    const todosWithDetails = todosData.map((todo) => {
      const details = detailsData.filter(
        (detail) => detail.chat_id === todo.id
      );
      return { ...todo, details };
    });

    setTodos(todosWithDetails);
  };

  const handleTodoClick = (todos) => {
    setSelectedTodo(todos);
    onOpen();
  };

  const updateTodo = async (todo) => {
    const { error } = await supabase
      .from("todo_chat")
      .update({ value: todo.value, complete: todo.complete })
      .eq("id", todo.id);
    if (error) console.error("Error updating todo:", error);
    else fetchTodos();
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      const { error } = await supabase
        .from("todo_chat")
        .insert([{ value: newTodo, complete: false }]);
      if (error) console.error("Error adding todo:", error);
      else {
        setNewTodo("");
        fetchTodos();
      }
    }
  };
  const maxWidth = useBreakpointValue({
    base: "0px",
    xl: "190px",
    "2xl": "300px",
    "3xl": "500px",
  });

  const renderDetailsTable = (details) => {
    return (
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th py={0} px={1}></Th>
            <Th py={0} px={1}>
              {getMessage({
                ja: "進捗",
                us: "prog",
                cn: "进展",
                language,
              })}
            </Th>
            <Th py={0} px={1}>
              {getMessage({
                ja: "状態",
                us: "stat",
                cn: "国",
                language,
              })}
            </Th>
            <Th py={0} px={1}>
              {getMessage({
                ja: "担当",
                us: "staff",
                cn: "代管",
                language,
              })}
            </Th>
            <Th py={0} px={1}>
              {getMessage({
                ja: "状況",
                us: "situation",
                cn: "情势",
                language,
              })}
            </Th>
            <Th py={0} px={1}>
              {getMessage({
                ja: "内容",
                us: "element",
                cn: "内容",
                language,
              })}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {details.map((detail) => (
            <Tr key={detail.id}>
              <Td w="20px" p={0}>
                {detail.running === true ? (
                  <TodoIcon
                    size={20}
                    title="Sjp+"
                    dur="2s"
                    color={colorMode === "light" ? "#000" : "#FFF"}
                  />
                ) : null}
              </Td>
              <Td p={1} w="10px">
                <Box
                  p={0}
                  width="56px"
                  height="18px"
                  bg="gray.200"
                  overflow="visible"
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    position="absolute"
                    left={0}
                    p={0}
                    width={`${detail.progress}%`}
                    bg="green.400"
                    height="100%"
                  />
                  <Text
                    position="relative"
                    zIndex={1}
                    color="white"
                    textShadow="0 0 2px black, 0 0 2px black"
                    fontSize={12}
                    textAlign="left"
                    width="100%"
                    pl={1}
                  >
                    {detail.progress}
                  </Text>
                </Box>
              </Td>
              <Td p={1} w="10px">
                <Badge colorScheme="red" width="4rem" textAlign="center">
                  {detail.status}
                </Badge>
              </Td>
              <Td p={1} w="10px">
                <Tooltip
                  label={
                    <>
                      <Text>{detail.user_mainCompany}</Text>
                      <Text>{detail.user_company}</Text>
                      <Text>{detail.userName}</Text>
                    </>
                  }
                  aria-label="ユーザー情報"
                  placement="top"
                  hasArrow
                >
                  <Avatar src={detail.user_picture} size="xs" mr={1} />
                </Tooltip>
              </Td>
              <Td p={1} fontSize={11} whiteSpace="nowrap" w="2em">
                <Tooltip
                  label={
                    <>
                      <Text>
                        着手: {new Date(detail.created_at).toLocaleString()}
                      </Text>
                      <Text>
                        完了:
                        {detail.complete_at
                          ? new Date(detail.complete_at).toLocaleString()
                          : ""}
                      </Text>
                    </>
                  }
                  aria-label="日付情報"
                  hasArrow
                >
                  <Box as="span" cursor="default">
                    {detail.progress === 100
                      ? (() => {
                          const createdAt = new Date(detail.created_at);
                          const completedAt = new Date(detail.complete_at);
                          const diffTime = Math.abs(
                            completedAt.getTime() - createdAt.getTime()
                          );
                          const diffDays = Math.floor(
                            diffTime / (1000 * 60 * 60 * 24)
                          );
                          const diffHours = Math.floor(
                            (diffTime / (1000 * 60 * 60)) % 24
                          );
                          const totalDays = diffDays + diffHours / 24;
                          return `${totalDays.toFixed(1)}日`;
                        })()
                      : (() => {
                          const createdAt = new Date(detail.created_at);
                          const now = new Date();
                          const diffTime = Math.abs(
                            now.getTime() - createdAt.getTime()
                          );
                          const diffDays = Math.floor(
                            diffTime / (1000 * 60 * 60 * 24)
                          );
                          const diffHours = Math.floor(
                            (diffTime / (1000 * 60 * 60)) % 24
                          );
                          const totalDays = diffDays + diffHours / 24;
                          return `${totalDays.toFixed(1)}日`;
                        })()}
                  </Box>
                </Tooltip>
              </Td>
              <Td p={1} fontSize="12px">
                {detail.title}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  const groupedDetails = selectedTodo?.details
    .sort((a, b) => {
      if (a.progress !== b.progress) {
        return a.progress - b.progress;
      }
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    })
    .reduce(
      (
        acc: {
          id: number;
          value: string;
          title: string;
          user_picture: string;
          created_at: string;
          progress: number;
          complete_at: string;
          status: string;
          userName: string;
          user_mainCompany: string;
          user_company: string;
        }[][],
        detail
      ) => {
        if (detail.progress === 0) {
          acc[0].push(detail);
        } else if (detail.progress < 100) {
          acc[1].push(detail);
        } else {
          acc[2].push(detail);
        }
        return acc;
      },
      [[], [], []]
    );

  return (
    <Box
      display={{ base: "none", xl: "block" }}
      position="fixed"
      maxWidth={maxWidth}
      h="80vh"
      bg="white.200"
      p="0"
      top="60px"
      right="8px"
      textAlign="left"
      zIndex="1100"
      fontSize={15}
    >
      {/* <Input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="新しいタスクを追加"
      />
      <Button onClick={addTodo}>追加</Button> */}
      <Text
        border="1px solid"
        textAlign="center"
        color={colorMode === "light" ? "black" : "white"}
        fontWeight={400}
        mb={2}
        onClick={() => {
          console.log(todos);
          onOpen();
        }}
        cursor="pointer"
        px={2}
        _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.700" }} // マウスオーバー時の背景色
      >
        各システムの対応状況
      </Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="auto" maxWidth="80%">
          <ModalHeader fontSize={18} p={1} px={2} pr={10}>
            各システムの対応状況
          </ModalHeader>
          <ModalCloseButton _focus={{ _focus: "none" }} top={0} right={0} />
          <Flex align="center" pl={1}>
            <TodoIcon
              size={20}
              title="Sjp+"
              dur="0s"
              color={colorMode === "light" ? "#000" : "#FFF"}
            />
            <Text p={1} fontSize={14} fontWeight={400}>
              : 現在対応中
            </Text>
          </Flex>
          <ModalBody fontWeight={400} px={0} py={2}>
            <Stack spacing={0}>
              {todos.map((todo) => {
                const sortedDetails = todo.details.sort(
                  (a, b) => a.progress - b.progress
                );
                const groupedDetails = {
                  0: sortedDetails.filter((detail) => detail.progress === 0),
                  1: sortedDetails.filter(
                    (detail) => detail.progress > 0 && detail.progress < 100
                  ),
                  100: sortedDetails.filter(
                    (detail) => detail.progress === 100
                  ),
                };

                const hasProgressInRange = groupedDetails[1].length > 0;

                return (
                  <Accordion
                    key={todo.id}
                    allowMultiple
                    defaultIndex={hasProgressInRange ? [0] : []}
                    p={0}
                  >
                    <AccordionItem border="none">
                      <AccordionButton p={0}>
                        <Box
                          flex="1"
                          textAlign="left"
                          p={0}
                          pl={2}
                          fontSize={13}
                          bg={colorMode === "light" ? "#444" : "white"}
                          color={colorMode === "light" ? "white" : "#222"}
                        >
                          {todo.title}
                        </Box>
                        <AccordionIcon
                          bg={colorMode === "light" ? "#444" : "white"}
                          color={colorMode === "light" ? "white" : "#222"}
                        />
                      </AccordionButton>
                      <AccordionPanel p={0}>
                        {groupedDetails[0].length > 0 && (
                          <Accordion allowMultiple defaultIndex={[1]}>
                            <AccordionItem>
                              <AccordionButton p={0} pl={4}>
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  p={0}
                                  fontSize={11}
                                  fontWeight={600}
                                >
                                  未着手 ({groupedDetails[0].length})
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel p={1}>
                                {renderDetailsTable(groupedDetails[0])}
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        )}
                        {groupedDetails[1].length > 0 && (
                          <Accordion allowMultiple defaultIndex={[0]}>
                            <AccordionItem>
                              <AccordionButton p={0} pl={4}>
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  p={0}
                                  fontSize={11}
                                  fontWeight={600}
                                >
                                  取組中 ({groupedDetails[1].length})
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel p={1}>
                                {renderDetailsTable(groupedDetails[1])}
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        )}
                        {groupedDetails[100].length > 0 && (
                          <Accordion allowMultiple defaultIndex={[1]}>
                            <AccordionItem>
                              <AccordionButton p={0} pl={4}>
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  p={0}
                                  fontSize={11}
                                  fontWeight={600}
                                >
                                  完了済 ({groupedDetails[100].length})
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel p={1}>
                                {renderDetailsTable(groupedDetails[100])}
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BBSTodoList;
