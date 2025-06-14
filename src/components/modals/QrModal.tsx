"use client";
import { useDisclosure, Text, IconButton, Flex, Box } from "@chakra-ui/react";
import QRCode from "qrcode.react";
import { ImQrcode } from "react-icons/im";
import getMessage from "@/utils/getMessage";
import CustomModal from "../ui/CustomModal";

export default function QrModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box onClick={onOpen}>
        <IconButton
          icon={<ImQrcode style={{ fontSize: "24px" }} />}
          _hover={{ bg: "transparent" }}
          bg="transparent"
          p="0"
          height="100%"
          width="100%"
          aria-label="QR Code Icon"
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
            スマホで読み込むとこのページにアクセスできます
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
