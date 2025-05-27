import React from "react";
import { useDisclosure, useColorMode } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Icon,
  Kbd,
  Image,
} from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import { unzip } from "lodash";

//Kbdのスタイル
const kbdStyle = {
  border: "1px solid",
  fontSize: "16px",
  bg: "white",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};
const UnzipModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const color = colorMode === "light" ? "blue.500" : "blue.200";
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <Box
        as="span"
        onClick={onOpen}
        style={{
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          textDecoration: "none",
          borderBottom: "2px solid",
        }}
        color={color}
        borderColor={color}
      >
        {getMessage({
          ja: "展開(解凍)",
          us: "",
          cn: "",
          language,
        })}
        <Icon as={FaRegEdit} mx={1} />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {getMessage({
              ja: "ファイルの展開(解凍)方法",
              us: "",
              cn: "",
              language,
            })}
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody>
            <Text mb={4}>
              {"1. " +
                getMessage({
                  ja: "ファイルサイズを小さくしたり、セキュリティの都合でダウンロードファイルの多くは圧縮(.zip)されているので、まずは展開(解凍)する必要があります。",
                  us: "",
                  cn: "",
                  language,
                })}
            </Text>

            <Text mb={4}>
              {"2. " +
                getMessage({
                  ja: "ダウンロードしたzipファイルを右クリックして、「すべて展開」を選びます。",
                  us: "",
                  cn: "",
                  language,
                })}
            </Text>

            {/* 右クリックメニューの画像イメージ */}
            <Box mb={4} textAlign="center" w="100%">
              <Image
                src="/images/howTo/unzip-rightclick.webp"
                alt="右クリックで「すべて展開」を選ぶ"
                mx="auto"
              />
              <Text fontSize="sm" mt={2}>
                ※Windowsでの右クリックメニュー
              </Text>
            </Box>

            <Text mb={4}>
              {"3. " +
                getMessage({
                  ja: "「展開先のフォルダーを選んでください」そのまま「展開」をクリックします。",
                  us: "",
                  cn: "",
                  language,
                })}
            </Text>

            <Text mb={4}>
              {"4. " +
                getMessage({
                  ja: "展開が終わると、新しいフォルダーが作られ、その中にファイルが入っています。",
                  us: "",
                  cn: "",
                  language,
                })}
            </Text>

            <Box mb={4} textAlign="center" w="100%">
              <Image
                src="/images/howTo/unzip-folder.webp"
                alt="展開後のフォルダ"
                mx="auto"
              />
              <Text fontSize="sm" mt={2}>
                ※展開後のフォルダーの中身
              </Text>
            </Box>

            <Text>
              {"5." +
                getMessage({
                  ja: "このフォルダの中身が、実際に使うファイルになります。.zipファイルは削除して構いません。",
                  us: "",
                  cn: "",
                  language,
                })}
            </Text>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UnzipModal;
