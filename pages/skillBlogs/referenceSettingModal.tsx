import React from "react";
import { useDisclosure, useColorMode } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Icon,
  Kbd,
  Image,
} from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
//Kbdのスタイル
const kbdStyle = {
  border: "1px solid",
  fontSize: "16px",
  bg: "white",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};
const referenceSettingModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const color = colorMode === "light" ? "blue.500" : "blue.200";
  return (
    <>
      <Box
        as="span"
        onClick={onOpen}
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
        エクセル参照設定の確認 <Icon as={FaRegEdit} mx={1} />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>エクセルの参照設定確認方法</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>1. Excel/ACCESSの対象ファイルを開きます。</Text>
            <Text>
              2. <Kbd {...kbdStyle}>ALT</Kbd>+<Kbd {...kbdStyle}>F11</Kbd>
              を押してVBAを開く
            </Text>
            <Text>3. [ツール] → [参照設定]をクリック</Text>
            <Text>
              4. 下図が表示されるので参照不可になっている項目を確認する
            </Text>
            <Image src="/images/0010/unReference.png" w="90%" mt={2} />
            <Text mt={2}>
              参照不可がある場合は参照不可を解除する操作が必要になります
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default referenceSettingModal;
