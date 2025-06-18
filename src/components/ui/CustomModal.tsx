// components/CustomModal.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  ResponsiveValue,
  ModalProps,
} from "@chakra-ui/react";
import { motion, useDragControls } from "framer-motion";
import { ReactNode } from "react";
import MacCloseButton from "./MacCloseButton";

const MotionModalContent = motion(ModalContent);

type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  modalSize?: ModalProps["size"]; // ←ここを修正
  macCloseButtonHandlers: (() => void)[];
  children?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  marginTop?: string;
};
export function CustomModal({
  isOpen,
  onClose,
  modalSize = "md",
  macCloseButtonHandlers,
  children,
  footer,
  title,
  marginTop = "64px",
}: CustomModalProps) {
  const dragControls = useDragControls();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
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
        style={{ cursor: "default", marginTop: marginTop, zIndex: 99999 }}
      >
        <Box
          onPointerDown={(e) => dragControls.start(e)}
          bg="custom.system.500"
          p="0"
          userSelect="none"
        >
          <MacCloseButton
            onClickHandlers={macCloseButtonHandlers}
            title={title}
          />
        </Box>

        <ModalBody p={0} m={0}>
          {children}
        </ModalBody>

        {footer && (
          <>
            <Box h="1px" bg="#4c4b49" w="100%" />
            <ModalFooter bg="#2c2b29" fontSize="12px" color="#ccc" p="9px">
              {footer}
            </ModalFooter>
          </>
        )}
      </MotionModalContent>
    </Modal>
  );
}

export default CustomModal;
