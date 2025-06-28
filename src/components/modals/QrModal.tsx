"use client";
import {
  useDisclosure,
  Text,
  IconButton,
  Flex,
  Box,
  useColorMode,
} from "@chakra-ui/react";
import QRCode from "qrcode.react";
import getMessage from "@/utils/getMessage";
import CustomModal from "../ui/CustomModal";
import { QrIcon } from "@/components/ui/icons";
import { useLanguage } from "@/contexts/LanguageContext";

export default function QrModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const { language } = useLanguage();
  return (
    <>
      <Box
        onClick={onOpen}
        cursor="pointer"
        _hover={{ opacity: 0.85, transform: "scale(1.1)" }}
      >
        <QrIcon
          size="32px"
          fill={
            colorMode === "light"
              ? "custom.theme.light.900"
              : "custom.theme.dark.100"
          }
        />
      </Box>
      <CustomModal
        title="QR Code"
        isOpen={isOpen}
        onClose={onClose}
        modalSize="sm"
        macCloseButtonHandlers={[onClose]}
        footer={
          <Text fontSize="12px" fontWeight={400} color="#ddd">
            {getMessage({
              ja: "スマホで読み込むとこのページにアクセスできます",
              us: "You can access this page by loading it with your phone",
              cn: "您可以通过手机阅读本页面。",
              language,
            })}
          </Text>
        }
      >
        <Flex
          py={4}
          alignItems="center"
          justifyContent="center"
          bg="custom.system.500"
        >
          <Box bg="white" p="5px">
            {typeof window !== "undefined" && (
              <QRCode value={window.location.href} size={80} />
            )}
          </Box>
        </Flex>
      </CustomModal>
    </>
  );
}
