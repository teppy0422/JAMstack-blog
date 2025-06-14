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
import CustomModalTab from "../../parts/CustomModalTab";

import CustomArrow from "@/components/ui/CustomArrow";

export function ModalYps() {
  const { language, setLanguage } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <CustomModalTab
        path="/"
        text={getMessage({
          ja: "導入比較",
          us: "Comparison",
          cn: "对比",
          language,
        })}
        media="html"
        onOpen={onOpen}
      />
      <CustomModal
        title="導入比較"
        isOpen={isOpen}
        onClose={onClose}
        modalSize="md"
        macCloseButtonHandlers={[onClose]}
        footer={
          <Text fontSize="12px" fontWeight={400} color="#ddd">
            機能の追加アイデアがあれば連絡ください
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
            <Flex position="relative" fontSize="12px">
              <Box w="50%" pr={2}>
                <Text textAlign="center">導入前</Text>
              </Box>
              <Box
                position="absolute"
                left="50%"
                top="0"
                bottom="0"
                w="0.5px"
                bg="custom.system.200"
                transform="translateX(-0.5px)"
              />
              <Box w="50%" pl={2}>
                <Text textAlign="center">導入後</Text>
              </Box>
            </Flex>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />
            <Flex position="relative" fontSize="12px">
              <Box w="50%" pr={2} my={4}>
                <Flex
                  direction="column"
                  display="flex"
                  textAlign="center"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box border="1px solid" borderColor="custom.system.100" p={2}>
                    誘導ポイント設定一覧表
                  </Box>
                  <CustomArrow
                    h="50px"
                    text="手入力"
                    textTop="30%"
                    textLeft="120%"
                  />
                  <Box border="1px solid" borderColor="custom.system.100" p={2}>
                    インラインクリップ
                    <br />
                    設定一覧表
                  </Box>
                  <CustomArrow
                    h="50px"
                    text="転送"
                    textTop="30%"
                    textLeft="120%"
                  />
                  <Box border="1px solid" borderColor="custom.system.100" p={2}>
                    YIC
                  </Box>
                  <CustomArrow
                    h="50px"
                    text="手入力の再確認"
                    textTop="30%"
                    textLeft="120%"
                  />
                  <Box border="1px solid" borderColor="custom.system.100" p={2}>
                    YICのLED点灯
                  </Box>
                </Flex>
              </Box>
              <Box
                position="absolute"
                left="50%"
                top="0"
                bottom="0"
                w="0.5px"
                bg="custom.system.200"
                transform="translateX(-0.5px)"
              />
              <Box w="50%" pl={2} my={4}>
                <Flex
                  direction="column"
                  display="flex"
                  textAlign="center"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box border="1px solid" borderColor="custom.system.100" p={2}>
                    誘導ポイント設定一覧表
                  </Box>
                  <CustomArrow
                    h="166px"
                    text="転送"
                    textTop="45%"
                    textLeft="120%"
                  />
                  <Box border="1px solid" borderColor="custom.system.100" p={2}>
                    YIC
                  </Box>
                </Flex>
              </Box>
            </Flex>
            <Box h="1px" w="100%" bg="#4c4b49" mt={2} />

            <Box
              textAlign="center"
              bg="custom.system.400"
              fontSize="12px"
              mb={2}
            >
              要点
            </Box>
            <Flex direction="column" fontSize="12px" gap={1} p={1}>
              <Text>1.手入力のコスト減</Text>
              <Text>2.手入力の再確認のコスト減</Text>
              <Text>3.更新ファイルが2→1個になって管理コスト減</Text>
            </Flex>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
}
export default ModalYps;
