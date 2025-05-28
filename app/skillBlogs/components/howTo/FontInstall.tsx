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

const FontInstallModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const color = colorMode === "light" ? "blue.500" : "blue.200";
  const { language } = useLanguage();

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
          ja: "フォントのインストール",
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
              ja: "フォントのインストール方法",
              us: "",
              cn: "",
              language,
            })}
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody>
            <Text mb={4}>インストールするとそのPCで使用可能になります。</Text>
            <Text mb={4}>
              {"1. " +
                getMessage({
                  ja: "フォントファイル(.ttfや.otf)をダブルクリックします。",
                  us: "",
                  cn: "",
                  language,
                })}
            </Text>

            <Text mb={4}>
              {"2. " +
                getMessage({
                  ja: "下図が表示されるのでインストールをクリック。",
                  us: "",
                  cn: "",
                  language,
                })}
            </Text>

            <Box mb={4} textAlign="center" w="100%">
              <Image
                src="/images/howTo/font-install.webp"
                alt="フォントのインストール画面"
                mx="auto"
              />
              <Text fontSize="sm" mt={2}>
                ※フォントのインストール画面
              </Text>
            </Box>

            <Text mb={4}>
              {getMessage({
                ja: "※使用したいアプリケーションを再起動すると使用できるようになります。",
                us: "",
                cn: "",
                language,
              })}
            </Text>

            <Text>
              {getMessage({
                ja: "※フォントが正しく表示されない場合は、PCを再起動してください。",
                us: "",
                cn: "",
                language,
              })}
            </Text>
          </ModalBody>

          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default FontInstallModal;
