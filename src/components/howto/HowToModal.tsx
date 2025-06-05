import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

type HowToModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
  size?: string;
};
const HowToModal: React.FC<HowToModalProps> = ({
  isOpen,
  onClose,
  title,
  body,
  footer,
  size = "md",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent>
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalCloseButton _focus={{ boxShadow: "none" }} />
        <ModalBody mb={4} mx={2}>
          {body}
        </ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};

export default HowToModal;
