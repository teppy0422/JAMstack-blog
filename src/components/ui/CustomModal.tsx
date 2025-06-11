// components/CustomModal.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
} from "@chakra-ui/react";
import { motion, useDragControls } from "framer-motion";
import { ReactNode } from "react";
import MacCloseButton from "./MacCloseButton";

const MotionModalContent = motion(ModalContent);

type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  modalSize?: string;
  macCloseButtonHandlers: (() => void)[];
  children?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
};
export default function CustomModal({
  isOpen,
  onClose,
  modalSize = "md",
  macCloseButtonHandlers,
  children,
  footer,
  title,
}: CustomModalProps) {
  const dragControls = useDragControls();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={modalSize}>
      <ModalOverlay />
      <MotionModalContent
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{
          left: -1000,
          right: 1000,
          top: -1000,
          bottom: 1000,
        }}
        dragElastic={0.2}
        p={0}
        m={0}
        overflow="hidden"
        style={{ cursor: "default" }}
      >
        <Box onPointerDown={(e) => dragControls.start(e)} bg="#2c2b29" p="0">
          <MacCloseButton
            onClickHandlers={macCloseButtonHandlers}
            title={title}
          />
        </Box>

        <ModalBody bg="#2c2b29">{children}</ModalBody>

        {footer && (
          <>
            <Box h="1px" bg="#4c4b49" w="100%" />
            <ModalFooter bg="#2c2b29">{footer}</ModalFooter>
          </>
        )}
      </MotionModalContent>
    </Modal>
  );
}
