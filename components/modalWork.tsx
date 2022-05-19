import {
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Container,
  StylesProvider,
  Divider,
} from "@chakra-ui/react";
import Image from "next/image";

import ImageCard from "./imageCard";
import styles from "../styles/home.module.scss";

export default function ModalWork(pops) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const property = {
    imagetitle: pops.title,
    detail: pops.detail,
  };
  return (
    <>
      <a onClick={onOpen} style={{ cursor: "pointer" }}>
        {pops.children}
      </a>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="70%"
          backdropBlur="4px"
        />
        <ModalContent>
          <ModalHeader>{property.imagetitle}</ModalHeader>
          <Divider />
          <ModalCloseButton />
          <ModalBody m={0} p={0}>
            {property.detail}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
