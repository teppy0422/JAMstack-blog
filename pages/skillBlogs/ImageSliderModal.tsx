import React, { useState } from "react";
import {
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Icon,
  Box,
  Text,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";

interface ImageSliderModalProps {
  title: string;
  text: string;
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  onModalOpen;
}

const ImageSliderModal: React.FC<ImageSliderModalProps> = ({
  title,
  text,
  images,
  isOpen,
  onClose,
  onModalOpen,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { colorMode } = useColorMode();
  const color = colorMode === "light" ? "blue.500" : "blue.200";

  if (!images || images.length === 0) {
    return null;
  }

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <Box
        as="span"
        onClick={onModalOpen}
        style={{
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          textDecoration: "none",
          borderBottom: "2px solid",
        }}
        color={color}
        borderColor={color}
      >
        EXTESの設定変更
        <Icon as={FaRegEdit} mr={1} />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{text}</Text>
            <Image
              src={images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
            />
          </ModalBody>
          <ModalFooter justifyContent="space-between" display="flex">
            <Button
              onClick={handlePrev}
              mr={3}
              border="1px solid"
              borderColor={colorMode === "light" ? "black" : "white"}
              color={colorMode === "light" ? "black" : "white"}
              backgroundColor="transparent"
            >
              戻る
            </Button>
            <div style={{ flex: 1, textAlign: "center" }}>
              {currentImageIndex + 1}/{images.length}
            </div>
            <Button
              onClick={handleNext}
              ml={3}
              border="1px solid"
              borderColor={colorMode === "light" ? "black" : "white"}
              color={colorMode === "light" ? "black" : "white"}
              backgroundColor="transparent"
            >
              進む
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageSliderModal;
