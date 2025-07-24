import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ReactNode } from "react";

type UrlModalButtonProps = {
  url: string;
  label?: ReactNode;
  width?: string;
  height?: string;
};

export const UrlModalButton = ({
  url,
  label = "開く",
  width = "100%",
  height = "600px",
}: UrlModalButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        variant="link"
        colorScheme="blue"
        onClick={onOpen}
        rightIcon={<ExternalLinkIcon />}
      >
        {label}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent maxW={width}>
          <ModalHeader fontSize="md">外部リンク</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <iframe
              src={url}
              style={{
                width: "100%",
                height: height,
                border: "none",
              }}
              title="外部リンク"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
