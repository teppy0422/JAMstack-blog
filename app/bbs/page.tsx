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
import { StatusDisplay } from "@/components/NowStatus";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import { useUserContext } from "@/contexts/useUserContext";

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
    console.log("clickedProject: ", clickedProject);
    setClickedProject(clickedProject);
    if (clickedProject) {
      setProjectMessage("");
    }
    inputRef.current?.focus();
  };
  const handleCategoryClick = (clickedCategory: string | null) => {
    console.log("clickedCategory: ", clickedCategory);
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
          })}
        </Text>
        <Container
          maxW="container.lg"
          py={8}
          fontFamily={getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans,Noto Sans JP",
            cn: "Noto Sans SC,Noto Sans JP",
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
                  })}
                </Badge>
                <Badge variant="solid" colorScheme="purple" ml={2}>
                  {getMessage({
                    ja: "管理者",
                    us: "administrator",
                    cn: "管理者",
                  })}
                </Badge>
                <Badge variant="solid" colorScheme="red" ml={2}>
                  {getMessage({
                    ja: "開発者",
                    us: "developer",
                    cn: "开发人员",
                  })}
                </Badge>
              </Box>
              <Text textAlign="left" colorScheme="gray" fontSize="sm">
                完了していない項目が分かりづらいので内容毎にスレッドを分けました。
                新しく追加する場合は[追加]を押して作成してから問い合わせしてください。
                <br />
                従来のものは手作業で分類しました。未完了のスレッドは確認をお願いします。
              </Text>
            </Box>
          </Stack>

          <SidebarBBS isMain={true} reload={reloadSidebar} />
          <HStack
            spacing={2}
            alignItems="center"
            justifyContent="center"
            mt={8}
          >
            <Button
              onClick={onOpen}
              color="#000"
              outline="1px solid black"
              px={2}
            >
              新しく追加
            </Button>
          </HStack>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader pb={0} userSelect="none">
                新しいスレッドを追加
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pt={0}>
                <Badge variant="outline" mr={2} userSelect="none">
                  {currentUserMainCompany}
                </Badge>
                <Badge variant="outline" mr={2} userSelect="none">
                  {currentUserCompany}
                </Badge>
                <Badge variant="outline" mr={2} userSelect="none">
                  {currentUserName}
                </Badge>
                <Text mt={3} userSelect="none">
                  対象のプロジェクトを選択
                </Text>
                <Divider border="1.4px solid #888" />
                <Box as="span" fontSize="sm" fontWeight={400} color="red">
                  {ProjectMessage}
                </Box>
                <ProjectLists
                  colorMode={colorMode}
                  onProjectClick={handleProjectClick}
                />
                <Text mt={4} userSelect="none">
                  分類
                </Text>
                <Divider border="1.4px solid #888" />
                <Box as="span" fontSize="sm" fontWeight={400} color="red">
                  {CategoryMessage}
                </Box>
                <CategoryLists
                  colorMode={colorMode}
                  onCategoryClick={handleCategoryClick}
                  userMainCompany={currentUserMainCompany}
                />
                <Text mt={4} userSelect="none">
                  内容(変更可能なので適当で構いません)
                </Text>
                <Divider border="1.4px solid #888" />
                <Box as="span" fontSize="sm" fontWeight={400} color="red">
                  {TitleMessage}
                </Box>
                <Stack spacing="4" mt={6} direction="row" justify="flex-end">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    placeholder="ハメ図に治具座標を表示したい : 等"
                    size="sm"
                    color="#000"
                    border="none"
                    borderRadius={0}
                    mb={0}
                    px={0}
                    boxShadow="none"
                    borderBottom="1px solid #333"
                    _focus={{ boxShadow: "none", borderBottomColor: "#000" }}
                    _hover={{ borderBottomColor: "#000" }}
                  />
                  <Button
                    onClick={createThread}
                    colorScheme="gray"
                    px={3}
                    top="-8px"
                    outline="1px solid black"
                  >
                    追加
                  </Button>
                </Stack>
                <HStack
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                  mt={4}
                >
                  {CompleteMessage && (
                    <Box
                      as="button"
                      position="absolute"
                      bottom="8px"
                      _focus={{ boxShadow: "none" }}
                      fontFamily="Noto Sans JP"
                      color="#82d9d0"
                      // color="transparent"
                      bg="#211c1c"
                      fontSize="18px"
                      // borderTop="solid 1px #000"
                      cursor="pointer"
                      overflow="hidden" // ボックスからはみ出さないようにする
                      w="100%"
                    >
                      <ScrollText colorMode={colorMode} text="追加完了&nbsp;" />
                    </Box>
                  )}
                </HStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Container>
        <StatusDisplay />
      </Content>
    </UnreadProvider>
  );
}
