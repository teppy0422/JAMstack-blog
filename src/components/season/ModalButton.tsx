// components/CustomModal.tsx
import React from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ColorMode,
} from "@chakra-ui/react";

import { CustomModalCloseButton } from "../ui/CustomModalCloseButton";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  title: string; // モーダルのタイトル
  body: React.ReactNode; // モーダルの内容
  colorMode: ColorMode;
  bgImage: string;
}
const ModalButton: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onOpen,
  title,
  body,
  colorMode,
  bgImage,
}) => {
  return (
    <>
      <Box
        position="absolute"
        display={{
          base: "none",
          sm: "block",
          md: "block",
          lg: "block",
          xl: "block",
        }}
        top="-27px"
        left="8px"
      >
        <Box
          onClick={onOpen}
          cursor="pointer"
          fontSize="11px"
          borderRadius="5px"
          border="1px solid"
          borderColor={
            colorMode === "light"
              ? "custom.theme.light.850"
              : "custom.theme.dark.100"
          }
          color={
            colorMode === "light"
              ? "custom.theme.light.850"
              : "custom.theme.dark.100"
          }
          px="4px"
          py="2px"
          _hover={{
            bg:
              colorMode === "light"
                ? "custom.theme.light.850"
                : "custom.theme.dark.100",
            color: colorMode === "light" ? "white" : "black",
            borderColor:
              colorMode === "light"
                ? "custom.theme.light.850"
                : "custom.theme.dark.100",
            transition: "all 0.2s ease-in-out",
          }}
        >
          {title}
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          // filter="invert(1)" // 白黒を入れ替えるフィルターを適用
          filter="grayscale(80%)" // グレースケールフィルターを適用
          bg={
            colorMode === "light"
              ? "custom.theme.dark.400"
              : "custom.theme.dark.400"
          }
        >
          <CustomModalCloseButton
            colorMode={colorMode}
            top="-4px"
            right="-4px"
            outline="4px solid"
            outlineColor={
              colorMode === "light"
                ? "custom.theme.dark.800"
                : "custom.theme.dark.800"
            }
          />
          <Box
            bgImage={bgImage}
            filter="brightness(0.8) contrast(1.5) saturate(1)" // 色調整のフィルターを追加
            bgSize="cover" // 画像をカバーするように設定
            bgPosition="center" // 画像の位置を中央に設定
            overflow="hidden"
            borderRadius="md"
          >
            <ModalBody>{body}</ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalButton;
