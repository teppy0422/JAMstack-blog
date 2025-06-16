"use client";
import {
  useDisclosure,
  Text,
  IconButton,
  Flex,
  Box,
  Image,
} from "@chakra-ui/react";
import { useLanguage } from "@/contexts/LanguageContext";
import ModalButton from "@/components/ui/ModalButton";
import getMessage from "@/utils/getMessage";
import CustomModal from "../ui/CustomModal";

export default function SAveForChrome() {
  const { language } = useLanguage();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ModalButton
        label={getMessage({
          ja: "※Chromeの場合",
          us: "*In case of Chrome",
          cn: "*如果使用 Chrome 浏览器。",
          language,
        })}
        onClick={onOpen}
      />
      <CustomModal
        title={getMessage({
          ja: "Chromeでのダウンロード方法",
          us: "How to download in Chrome",
          cn: "如何在 Chrome 浏览器中下载",
          language,
        })}
        isOpen={isOpen}
        onClose={onClose}
        modalSize="sm"
        macCloseButtonHandlers={[onClose]}
        footer={<></>}
      >
        <Flex
          py={4}
          alignItems="center"
          justifyContent="center"
          bg="custom.system.500"
        >
          <Image src="/images/0007/0004.png" alt="0004.png" />
        </Flex>
      </CustomModal>
    </>
  );
}
