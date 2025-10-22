// app/bbs/page.tsx
"use client";

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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalCloseButton,
} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar";
import Content from "@/components/content";
import { Global } from "@emotion/react";
import { supabase } from "@/utils/supabase/client";
import { UnreadProvider } from "@/contexts/UnreadContext";

import SidebarBBS from "./parts/bbsSidebar";
import { ScrollText } from "@/components/ui/CustomText";
import { ProjectLists, CategoryLists } from "@/components/ui/CustomBadge";
import { AnimationImage } from "@/components/ui/CustomImage";
import { CalendarDisplay } from "@/components/modals/CalendarModal";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import { useUserContext } from "@/contexts/useUserContext";
import NewThreadModal from "./parts/NewThreadModal";

export default function BBS() {
  const {
    currentUserId,
    currentUserName,
    currentUserCompany,
    currentUserMainCompany,
  } = useUserContext();

  const { colorMode, toggleColorMode } = useColorMode();
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [clickedProject, setClickedProject] = useState<string | null>(null); // クリックされたバッジの状態を追加
  const [clickedCategory, setClickedCategory] = useState<string | null>(null); // クリックされたバッジの状態を追加
  const [reloadSidebar, setReloadSidebar] = useState<boolean>(false); // リロード用の状態

  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ProjectMessage, setProjectMessage] = useState<string>("");
  const [CategoryMessage, setCategoryMessage] = useState<string>("");
  const [TitleMessage, setTitleMessage] = useState<string>("");
  const [CompleteMessage, setCompleteMessage] = useState<boolean>(false);

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
    if (!clickedProject) {
      setProjectMessage("※選択して下さい");
    }
    if (!clickedCategory) {
      setCategoryMessage("※選択して下さい");
    }
    if (!newThreadTitle) {
      setTitleMessage("※入力して下さい");
    }
    if (!clickedProject || !clickedCategory || !newThreadTitle) {
      return;
    }
    setLoading(true);
    await supabase.from("threads").insert([
      {
        projectName: clickedProject,
        category: clickedCategory,
        title: newThreadTitle,
        company: currentUserCompany,
        mainCompany: currentUserMainCompany,
        user_uid: currentUserId,
      },
    ]);
    setNewThreadTitle("");
    setClickedProject(null);
    setClickedCategory(null);
    await fetchThreads();
    setLoading(false);
    setCompleteMessage(true);
    setTimeout(() => {
      setCompleteMessage(false);
      onClose();
      setReloadSidebar((prev) => !prev);
    }, 3000);
  };
  const { language, setLanguage } = useLanguage();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleProjectClick = (clickedProject: string | null) => {
    setClickedProject(clickedProject);
    if (clickedProject) {
      setProjectMessage("");
    }
    inputRef.current?.focus();
  };
  const handleCategoryClick = (clickedCategory: string | null) => {
    setClickedCategory(clickedCategory);
    if (clickedCategory) {
      setCategoryMessage("");
    }
    inputRef.current?.focus();
  };
  return (
    <UnreadProvider>
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
      <Sidebar isDrawer={false} />
      <Content>
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
          <Heading
            as="h3"
            fontSize="24px"
            mb={2}
            textAlign="center"
            position="relative"
          >
            <HStack
              w="100%"
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Text>
                {getMessage({
                  ja: "問い合わせ",
                  us: "Inquiry",
                  cn: "询问",
                  language,
                })}
              </Text>
              {/* <AiOutlineWechat size={30} /> */}
              <Box as="span" position="relative" width="20px">
                <AnimationImage
                  src="/images/illust/obj/obj_001.svg"
                  width="50px"
                  left="0px"
                  bottom="-15px"
                  animation="kinoco_nyoki 1s forwards 1s"
                />
              </Box>
            </HStack>
          </Heading>

          <Stack spacing="4" mb={4} direction="row" justify="center">
            <Box
              width={{
                base: "90%",
                sm: "60%",
                md: "60%",
                lg: "60%",
                xl: "60%",
              }}
              textAlign="center"
            >
              <Box mb={4}>
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
              </Box>
              <Text textAlign="left" colorScheme="gray" fontSize="sm">
                状態が分かりやすいように内容毎にスレッドを分けてください。
                新しいスレッドを追加する場合は[新しく追加]を押して作成してください。
                <br />
                未完了のスレッドは確認をお願いします。
              </Text>
            </Box>
          </Stack>
          <SidebarBBS isMain={true} reload={reloadSidebar} />
          <NewThreadModal />
        </Container>
        <CalendarDisplay />
      </Content>
    </UnreadProvider>
  );
}
