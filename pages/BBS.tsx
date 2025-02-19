import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  Divider,
  Flex,
  Icon,
  Progress,
  Badge,
  HStack,
  Button,
  useColorMode,
  Stack,
  Input,
} from "@chakra-ui/react";
import {
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineCheckBox,
  MdEditRoad,
} from "react-icons/md";
import Sidebar from "../components/sidebar";
import Content from "../components/content";
import { Global } from "@emotion/react";
import { useUserInfo } from "../hooks/useUserId";
import { useUserData } from "../hooks/useUserData";
import SidebarBBS from "../components/sidebarBBS";
import { supabase } from "../utils/supabase/client";

import { useLanguage } from "../context/LanguageContext";
import getMessage from "../components/getMessage";
// import { AppContext } from "./_app";

interface RoadmapItem {
  year?: string;
  month?: string;
  titleColor?: string;
  main?: string;
  mainDetail?: string[];
  items?: { text: string; completed: boolean }[];
  result?: string;
  possibility?: number;
  duration?: number;
  category?: string[];
  idea?: string[];
}

function getBadgeForCategory(category: string): JSX.Element {
  let colorScheme: string;
  switch (category) {
    case "生産準備+":
      colorScheme = "green";
      break;
    case "順立生産システム":
      colorScheme = "purple";
      break;
    case "部材一覧+":
      colorScheme = "yellow";
      break;
    default:
      colorScheme = "red";
  }

  return (
    <Badge
      variant="outline"
      colorScheme={colorScheme}
      mr={2}
      p={0.5}
      px={1}
      mb={1}
    >
      {category}
    </Badge>
  );
}

const BBS = () => {
  const roadmapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const { colorMode, toggleColorMode } = useColorMode();
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<any[]>([]);

  const [years, setYears] = useState<number[]>([]);
  let previousYear: string | undefined;

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

  const { language, setLanguage } = useLanguage();

  return (
    <>
      <Global
        styles={{
          "@media print": {
            ".print-only": {
              display: "block !important",
            },
          },
          ".print-only": {
            display: "none",
          },
        }}
      />
      <Sidebar />
      <Content isCustomHeader={true}>
        <Text ml={4} className="print-only">
          {getMessage({
            ja: "※別紙1",
            us: "*Attachment 1",
            cn: "*附录1.",
            language,
          })}
        </Text>
        <Container
          maxW="container.lg"
          py={8}
          fontFamily={getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans,Noto Sans JP",
            cn: "Noto Sans SC,Noto Sans JP",
            language,
          })}
          fontWeight={400}
        >
          <Heading as="h3" fontSize="24px" mb={8} textAlign="center">
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <Text>
                {getMessage({
                  ja: "問い合わせ",
                  us: "Inquiry",
                  cn: "询问",
                  language,
                })}
              </Text>
              <MdEditRoad size={30} />
            </HStack>
          </Heading>
          <Badge variant="solid" colorScheme="green" ml={2}>
            {getMessage({
              ja: "使用者",
              us: "user",
              cn: "使用者",
              language,
            })}
          </Badge>
          <Badge variant="solid" colorScheme="purple" ml={2}>
            {getMessage({
              ja: "管理者",
              us: "administrator",
              cn: "管理者",
              language,
            })}
          </Badge>
          <Badge variant="solid" colorScheme="red" ml={2}>
            {getMessage({
              ja: "開発者",
              us: "developer",
              cn: "开发人员",
              language,
            })}
          </Badge>
          <Box mb={8} p={4} borderRadius="md">
            <Text textAlign="left" colorScheme="gray"></Text>
          </Box>
          <SidebarBBS isMain={true} />

          <Divider mt={2} border="solid 1px gray" />
          <Text>作成中...</Text>
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
        </Container>
      </Content>
    </>
  );
};

export default BBS;
