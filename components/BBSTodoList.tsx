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

const BBSTodoList = () => {
  const [todos, setTodos] = useState<
    {
      id: number;
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
      }[];
    }[]
  >([]);
  const [selectedTodo, setSelectedTodo] = useState<{
    id: number;
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
    }[];
  } | null>(null);
  const [newTodo, setNewTodo] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const { colorMode, toggleColorMode } = useColorMode();

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

  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
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

  const handleTitleClick = (todo) => {
    setSelectedTodo(todo);
    console.log(todo);
    console.log(todo.value);
    onOpen();
  };

  const handleValueClick = (value) => {
    setSelectedValue(value);
    onOpen();
  };

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
      >
        各システムの対応状況
      </Text>
      <Stack spacing={1}>
        {todos.map((todo) => (
          <Box key={todo.id}>
            <Text
              fontWeight={200}
              fontFamily="Noto Sans JP"
              color={colorMode === "light" ? "black" : "white"}
              onClick={() => handleTodoClick(todo)}
              cursor="pointer"
            >
              {todo.title}
            </Text>
          </Box>
        ))}
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="auto" maxWidth="80%">
          <ModalHeader>{selectedTodo?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontWeight={400} mb={4}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th py={0} px={1}>
                      進捗
                    </Th>
                    <Th py={0} px={1}>
                      状態
                    </Th>
                    <Th py={0} px={1}>
                      担当
                    </Th>
                    <Th py={0} px={1}>
                      Date
                    </Th>
                    <Th py={0} px={1}>
                      Value
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedTodo?.details.map((detail) => (
                    <Tr key={detail.id}>
                      <Td p={1}>
                        <Box
                          p={0}
                          width="56px"
                          height="18px"
                          bg="gray.200"
                          borderRadius="md"
                          overflow="hidden"
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
                            textShadow="0 0 2px black, 0 0 2px black" // 均等に輪郭を追加
                          >
                            {detail.progress}
                          </Text>
                        </Box>
                      </Td>
                      <Td p={1}>
                        <Badge
                          colorScheme="purple"
                          width="4rem"
                          textAlign="center"
                        >
                          {detail.status}
                        </Badge>
                      </Td>
                      <Td p={1}>
                        <Avatar src={detail.user_picture} size="xs" mr={1} />
                      </Td>
                      <Td p={1} fontSize={11}>
                        <Tooltip
                          label={
                            <>
                              <Text>
                                着手:
                                {new Date(detail.created_at).toLocaleString()}
                              </Text>
                              <Text>
                                完了:
                                {detail.complete_at
                                  ? new Date(
                                      detail.complete_at
                                    ).toLocaleString()
                                  : ""}
                              </Text>
                            </>
                          }
                          aria-label="日付情報"
                          hasArrow
                        >
                          <Box as="span" cursor="pointer">
                            {detail.progress === 100
                              ? (() => {
                                  const createdAt = new Date(detail.created_at);
                                  const completedAt = new Date(
                                    detail.complete_at
                                  );
                                  const diffTime = Math.abs(
                                    completedAt.getTime() - createdAt.getTime()
                                  );
                                  const diffDays = Math.floor(
                                    diffTime / (1000 * 60 * 60 * 24)
                                  );
                                  const diffHours = Math.floor(
                                    (diffTime / (1000 * 60 * 60)) % 24
                                  );
                                  if (diffDays > 0) {
                                    return `${diffDays}日${diffHours}時間`;
                                  } else {
                                    return `${diffHours}時間`;
                                  }
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
                                  if (diffDays > 0) {
                                    return `${diffDays}日${diffHours}時間`;
                                  } else {
                                    return `${diffHours}時間`;
                                  }
                                })()}
                          </Box>
                        </Tooltip>
                      </Td>
                      <Td p={1} fontSize={13}>
                        {detail.title}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BBSTodoList;
