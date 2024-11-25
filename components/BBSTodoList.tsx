import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdBusiness } from "react-icons/md";
import { useColorMode } from "@chakra-ui/react";
import { supabase } from "../utils/supabase/client";
import useFetchUserData from "../hooks/useFetchUserData";
import useFetchTodos from "../hooks/useFetchTodos";
const TodoList = ({
  userName,
  userId,
}: {
  userName?: string;
  userId?: string;
}) => {
  const [newTodo, setNewTodo] = useState("");
  const [userMainCompany, setUserMainCompany] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Map<number, UserData>>(
    new Map()
  );
  const [sortedUserData, setSortedUserData] = useState<UserData[]>([]);
  const [sortedTodos, setSortedTodos] = useState<Todo[]>([]);

  interface UserData {
    user_metadata?: {
      name: string;
    };
    id?: string;
    picture_url?: string;
    user_mainCompany: string;
    user_company?: string;
  }
  const {
    userData,
    error: userDataError,
  }: { userData: UserData[]; error: any } = useFetchUserData();

  interface Todo {
    id: number;
    value: string;
    userId?: string;
    user_mainCompany?: string;
    user_company?: string;
    userName?: string;
    thread_id?: string;
    post_id?: string;
    complete?: boolean;
  }
  const { todos }: { todos: Todo[]; error: any } = useFetchTodos();

  const incompleteTodos = todos.filter((todo) => !todo.complete);

  const addTodo = async () => {
    if (newTodo.trim()) {
      // チェックボックスがオンのユーザーを取得
      const selectedUsers = userData
        .filter(
          (user) =>
            (
              document.querySelector(
                `input[value="${user.user_metadata?.name}"]`
              ) as HTMLInputElement
            )?.checked
        )
        .map((user) => user.user_metadata?.name);
      // Supabaseにデータを登録
      for (const userName of selectedUsers) {
        const user = userData.find(
          (user) => user.user_metadata?.name === userName
        );
        const { error } = await supabase.from("todo_chat").insert([
          {
            userName: userName,
            value: newTodo,
            userId: user?.id,
            user_mainCompany: user?.user_mainCompany,
            user_company: user?.user_company,
          },
        ]);
        if (error) {
          console.error("Error inserting data for user:", userName, error);
        }
      }
    }
  };
  const { colorMode } = useColorMode();
  const masterUserId = "6cc1f82e-30a5-449b-a2fe-bc6ddf93a7c0"; // 任意のユーザーID
  const maxWidth = useBreakpointValue({
    base: "0px",
    xl: "190px",
    "2xl": "300px",
    "3xl": "500px",
  });
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
      <Text
        fontSize="sm"
        mb="0"
        width="100%"
        border="1px solid gray"
        textAlign="center"
        px={1}
        fontWeight={400}
      >
        未完了の内容
      </Text>
      <Stack spacing="0">
        {incompleteTodos.map((todo, index) => {
          const user = userData.find(
            (user: UserData) => user.id === todo.userId
          );
          const previousTodo = incompleteTodos[index - 1];
          const isSameAsPrevious =
            previousTodo &&
            previousTodo.user_mainCompany === todo.user_mainCompany;

          const isSameCompanyAsPrevious =
            previousTodo && previousTodo.user_company === todo.user_company;

          return (
            <Text
              key={index}
              mx={0}
              py={1}
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              title={todo.value}
              cursor="pointer"
              fontFamily="Noto Sans JP"
            >
              {!isSameAsPrevious && todo?.user_mainCompany && (
                <>
                  {todo.user_mainCompany}
                  <Divider
                    borderColor={colorMode === "light" ? "black" : "white"}
                  />
                </>
              )}
              {!isSameCompanyAsPrevious && todo?.user_company && (
                <>
                  <Icon as={MdBusiness} boxSize={4} mr={0.5} mt={0} />
                  {todo.user_company}
                  <br />
                </>
              )}
              <Avatar boxSize="20px" mr={1} src={user?.picture_url} ml={4} />
              <Link href={`/thread/${todo.thread_id}#${todo.post_id}`}>
                {todo.value}
              </Link>
            </Text>
          );
        })}
      </Stack>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton _hover={{ textDecoration: "none" }} p={0} mt={2}>
            <Text
              fontSize="sm"
              mb="0"
              width="100%"
              border="1px solid gray"
              textAlign="center"
              px={1}
              fontWeight={400}
            >
              完了済みの内容
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Stack spacing="0">
              {todos
                .filter((todo) => todo.complete)
                .map((todo, index) => {
                  const user = userData.find(
                    (user: UserData) => user.id === todo.userId
                  );
                  const previousTodo = todos[index - 1];
                  const isSameAsPrevious =
                    previousTodo &&
                    previousTodo.user_mainCompany === todo.user_mainCompany;

                  const isSameCompanyAsPrevious =
                    previousTodo &&
                    previousTodo.user_company === todo.user_company;

                  return (
                    <Text
                      key={index}
                      mx={0}
                      py={1}
                      overflow="hidden"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      title={todo.value}
                      cursor="pointer"
                      fontFamily="Noto Sans JP"
                    >
                      {!isSameAsPrevious && todo?.user_mainCompany && (
                        <>
                          {todo.user_mainCompany}
                          <Divider
                            borderColor={
                              colorMode === "light" ? "black" : "white"
                            }
                          />
                        </>
                      )}
                      {!isSameCompanyAsPrevious && todo?.user_company && (
                        <>
                          <Icon as={MdBusiness} boxSize={4} mr={0.5} mt={0} />
                          {todo.user_company}
                          <br />
                        </>
                      )}
                      <Avatar
                        boxSize="20px"
                        mr={1}
                        src={user?.picture_url}
                        ml={4}
                      />
                      <Link href={`/thread/${todo.thread_id}#${todo.post_id}`}>
                        {todo.value}
                      </Link>
                    </Text>
                  );
                })}
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default TodoList;
