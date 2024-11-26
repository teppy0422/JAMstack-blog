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
} from "@chakra-ui/react";

interface ImageSliderModalProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

const ImageSliderModal: React.FC<ImageSliderModalProps> = ({
  images,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>EXTESの設定変更</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            src={images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={handlePrev} mr={3}>
            戻る
          </Button>
          <Button onClick={handleNext}>進む</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImageSliderModal;
