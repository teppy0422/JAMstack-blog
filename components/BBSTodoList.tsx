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
  }
  const { todos, error: todosError }: { todos: Todo[]; error: any } =
    useFetchTodos();

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
      >
        未完了の内容
      </Text>
      <Stack spacing="0">
        {todos.map((todo, index) => {
          const user = userData.find(
            (user: UserData) => user.id === todo.userId
          );
          const previousTodo = todos[index - 1];
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
              cursor="default"
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
              {/* {todo?.userName && <span>{todo.userName}</span>} */}
              {todo.value}
            </Text>
          );
        })}
      </Stack>
      <Stack spacing="2"></Stack>
      {userId === masterUserId && (
        <>
          <Box
            bg={colorMode === "dark" ? "none" : "none"}
            p={1}
            border="1px solid gray"
          >
            <Stack direction="column" spacing={0}>
              {userData
                .filter((user) => user.user_mainCompany !== "開発")
                .map((user) => (
                  <Checkbox
                    value={user.user_metadata?.name}
                    my={0}
                    colorScheme="gray"
                    borderColor="gray"
                  >
                    {user.user_metadata?.name}
                    <span style={{ display: "none" }}>{user.id}</span>
                    <span style={{ display: "none" }}>
                      {user.user_mainCompany}
                    </span>
                    <span style={{ display: "none" }}>{user.user_company}</span>
                  </Checkbox>
                ))}
            </Stack>
            <Input
              fontSize="sm"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="新しいToDoを追加"
              my="2"
              py={1}
              focusBorderColor="gray"
            />
            <Button onClick={addTodo} colorScheme="gray" p={2}>
              追加
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TodoList;
