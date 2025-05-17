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
  calc,
} from "@chakra-ui/react";
import Image from "next/image";

import ImageCard from "../../app/skillBlogs/components/imageCard";
import styles from "@/styles/home.module.scss";

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
        <ModalContent
          className={styles.modalContent}
          marginTop={["5rem", "5rem", "4rem", "4rem"]} //スマホの時はアドレスバーがあるから注意
          maxWidth={["100%", "95%", "90%", "85%"]}
          maxHeight={["98%", "95%", "90%", "90%"]}
          mx={[0, 0, 4, 2]}
        >
          <ModalHeader p={2}>{property.imagetitle}</ModalHeader>
          <Divider />
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody m={0} p={0}>
            {property.detail}
          </ModalBody>
          <ModalFooter p={2}>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
