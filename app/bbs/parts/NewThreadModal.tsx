"use client";
import { useEffect, useRef, useState } from "react";
import {
  useDisclosure,
  Text,
  IconButton,
  Flex,
  Box,
  Center,
  Badge,
  Divider,
  Stack,
  Input,
  Button,
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import {
  HomeIcon,
  CheckBoxIcon,
  CheckBoxOutlineBlankIcon,
} from "@/components/ui/icons";
import { RiChatNewFill } from "react-icons/ri";

import { supabase } from "@/utils/supabase/client";

import QRCode from "qrcode.react";
import getMessage from "@/utils/getMessage";
import { useUserContext } from "@/contexts/useUserContext";
import { ProjectLists, CategoryLists } from "@/components/ui/CustomBadge";
import { ScrollText } from "@/components/ui/CustomText";

import CustomModal from "@/components/ui/CustomModal";
import { GetColor } from "@/components/CustomColor";

export default function NewThreadModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    currentUserId,
    currentUserName,
    currentUserCompany,
    currentUserMainCompany,
  } = useUserContext();
  const [ProjectMessage, setProjectMessage] = useState<string>("");
  const [CategoryMessage, setCategoryMessage] = useState<string>("");
  const [TitleMessage, setTitleMessage] = useState<string>("");
  const [CompleteMessage, setCompleteMessage] = useState<boolean>(false);
  const { colorMode } = useColorMode();
  const [clickedProject, setClickedProject] = useState<string | null>(null); // クリックされたバッジの状態を追加
  const [clickedCategory, setClickedCategory] = useState<string | null>(null); // クリックされたバッジの状態を追加
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<any[]>([]);
  const [reloadSidebar, setReloadSidebar] = useState<boolean>(false); // リロード用の状態

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
  return (
    <>
      <Flex
        onClick={onOpen}
        align="center"
        gap="1px"
        userSelect="none"
        cursor="pointer"
        my={1}
        _active={{
          bg: "#c0c0c0",
        }}
      >
        <Box width="0px" />
        <RiChatNewFill
          size="18px"
          color={
            colorMode === "light"
              ? "custom.theme.light.900"
              : "custom.theme.dark.100"
          }
        />
        <Box display="inline-flex" alignItems="center" justifyContent="center">
          <Box
            as="span"
            fontSize="13px"
            lineHeight="1"
            display="flex"
            alignItems="center"
            ml="1px"
          >
            新しく追加
          </Box>
        </Box>
      </Flex>
      <CustomModal
        title="新規スレッドの追加"
        isOpen={isOpen}
        onClose={onClose}
        modalSize="sm"
        macCloseButtonHandlers={[onClose]}
        footer={
          <Text fontSize="12px" fontWeight={400} color="#ddd">
            適当で構いません。あとで簡単に変更できます。
          </Text>
        }
      >
        <Box bg="custom.theme.dark.600" py={2} px={2} color="#ccc">
          <Badge
            variant="outline"
            mr={2}
            userSelect="none"
            color="#bbb"
            borderColor="#ccc"
            fontSize="11px"
          >
            {currentUserMainCompany}
          </Badge>
          <Badge
            variant="outline"
            mr={2}
            userSelect="none"
            color="#bbb"
            borderColor="#ccc"
            fontSize="11px"
          >
            {currentUserCompany}
          </Badge>
          <Badge
            variant="outline"
            mr={2}
            userSelect="none"
            color="#bbb"
            borderColor="#ccc"
            fontSize="11px"
          >
            {currentUserName}
          </Badge>
          <Text mt={3} userSelect="none" fontSize="14px">
            対象のプロジェクトを選択
          </Text>
          <Box w="100%" h="0.5px" bg="custom.system.100" mb={2} />
          <Box as="span" fontSize="sm" fontWeight={400} color="red">
            {ProjectMessage}
          </Box>
          <ProjectLists
            colorMode={colorMode}
            onProjectClick={handleProjectClick}
          />
          <Text mt={4} userSelect="none" fontSize="14px">
            分類
          </Text>
          <Box w="100%" h="0.5px" bg="custom.system.100" mb={2} />
          <Box as="span" fontSize="sm" fontWeight={400} color="red">
            {CategoryMessage}
          </Box>
          <CategoryLists
            colorMode={colorMode}
            onCategoryClick={handleCategoryClick}
            userMainCompany={currentUserMainCompany}
          />
          <Text mt={4} userSelect="none" fontSize="14px">
            タイトル
          </Text>
          <Box w="100%" h="0.5px" bg="custom.system.100" mb={2} />
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
              _placeholder={{ color: "custom.system.100" }}
              size="sm"
              color="#000"
              border="none"
              borderRadius={0}
              mb={0}
              px={0}
              boxShadow="none"
              borderBottom="1px solid"
              borderBottomColor="custom.system.100"
              _focus={{
                boxShadow: "none",
                borderBottomColor: "#ddd",
                caretColor: "#ddd",
              }}
              _hover={{ borderBottomColor: "#ddd" }}
            />
            <Button
              onClick={createThread}
              bg="#ccc"
              size="sm"
              outline="1px solid black"
              fontSize="13px"
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
        </Box>
      </CustomModal>
    </>
  );
}
