"use client";
import {
  useDisclosure,
  Text,
  IconButton,
  Flex,
  Box,
  HStack,
  Icon,
  Spacer,
  Tooltip,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FaQuestion } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import CustomModal from "@/components/ui/CustomModal";

export default function ChatFeatureMoal() {
  const { language, setLanguage } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Box onClick={onOpen}>
        <HStack
          as="span"
          style={{ whiteSpace: "nowrap" }}
          cursor="pointer"
          onClick={onOpen}
          spacing={1}
          display="inline"
        >
          <Icon size="28px" as={FaQuestion} />
        </HStack>
      </Box>
      <CustomModal
        title="機能の一覧"
        isOpen={isOpen}
        onClose={onClose}
        modalSize="sm"
        macCloseButtonHandlers={[onClose]}
        footer={
          <Text fontSize="12px" fontWeight={400} color="#ddd">
            機能の追加アイデアがあれば連絡ください。
          </Text>
        }
      >
        <Box bg="custom.system.500" p={4}>
          <Box
            borderRadius="md"
            p={4}
            border="1px solid #4c4b49"
            color="#ccc"
            py={3}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontSize="12px">
                {getMessage({
                  ja: "メッセージ長押しで機能が使えます",
                  us: "Click and hold to use the following functions",
                  cn: "点击并按住可使用以下功能",
                  language,
                })}
              </Text>
            </Flex>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontSize="13px">
                1.リプライ
              </Text>
              <Spacer />
              <Text fontSize="13px">投稿を参照する</Text>
            </Flex>
            <Spacer h="10px" />
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="bold" fontSize="13px">
                2.削除
              </Text>
              <Spacer />
              <Text fontSize="13px">投稿を削除する</Text>
            </Flex>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
}
