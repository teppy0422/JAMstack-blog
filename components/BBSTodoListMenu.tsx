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
  Icon,
} from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { MdBusiness } from "react-icons/md";
import { useColorMode } from "@chakra-ui/react";
import { supabase } from "../utils/supabase/client";
import useFetchUserData from "../hooks/useFetchUserData";
import useFetchTodos from "../hooks/useFetchTodos";
const TodoListMenu = ({
  id,
  postId,
  userName,
  userId,
}: {
  id?: string;
  postId?: string | null;
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
            thread_id: id,
            post_id: postId,
          },
        ]);
        if (error) {
          console.error("Error inserting data for user:", userName, error);
        }
      }
    } // 入力欄をクリア
    setNewTodo("");
  };
  const { colorMode } = useColorMode();
  const maxWidth = useBreakpointValue({
    base: "0px",
    xl: "190px",
    "2xl": "300px",
    "3xl": "500px",
  });
  return (
    <>
      <Box bg={colorMode === "dark" ? "white" : "white"} p={1} m={1}>
        <Stack direction="column" spacing={0}>
          {userData
            .filter((user) => user.user_mainCompany !== "開発")
            .map((user) => (
              <Checkbox
                value={user.user_metadata?.name}
                my={0}
                colorScheme="gray"
                borderColor="black"
              >
                <span style={{ color: "black" }}>
                  {user.user_metadata?.name}
                </span>
                <span style={{ display: "none" }}>{user.id}</span>
                <span style={{ display: "none" }}>{user.user_mainCompany}</span>
                <span style={{ display: "none" }}>{user.user_company}</span>
              </Checkbox>
            ))}
        </Stack>
        <Input
          fontSize="sm"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder=""
          my="2"
          py={1}
          color="black"
          border="1px solid black"
          focusBorderColor="gray"
          _focus={{ borderColor: "black" }}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={addTodo}
            bg="transparent"
            p={2}
            border="1px solid black"
          >
            <Stack
              alignItems="center"
              spacing="1"
              maxWidth={1.5}
              color="gray.900"
            >
              <Icon as={MdAdd} boxSize={5} />
              <Text fontSize="0.5rem" lineHeight="1" p={0} m={0}>
                追加
              </Text>
            </Stack>
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TodoListMenu;
