import React, { useRef, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  background,
  useColorMode,
} from "@chakra-ui/react";

import { CustomCloseButton } from "../../components/custom/CustomCloseButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalPath: string;
}
const ResponsiveModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  modalPath,
}) => {
  const { colorMode } = useColorMode();
  const clearFileSelection = () => {};
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow="none" // 影なし
        bg="transparent"
      >
        <ModalBody
          m="0"
          p="0"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            position="relative"
            w={{ base: "400px", sm: "500px", md: "760px", lg: "1000px" }}
            h={{ base: "700px", sm: "700px", md: "700px", lg: "800px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <iframe
              src={modalPath}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                backgroundColor: "transparent",
              }}
              title="Embedded Content"
            />
            <CustomCloseButton
              colorMode={colorMode}
              onClick={clearFileSelection}
              top="-0px"
              right="-0px"
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ResponsiveModal;
