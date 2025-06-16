import React, { useState } from "react";
import {
  useDisclosure,
  Box,
  Icon,
  Text,
  Image,
  List,
  ListItem,
  Kbd,
  Flex,
  Button,
} from "@chakra-ui/react";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

import CustomModal from "@/components/ui/CustomModal";
import ModalButton from "@/components/ui/ModalButton";
import { Key } from "@/components/ui/Key";

const kbdStyle = {
  border: "1px solid",
  fontSize: "13px",
  bg: "#ddd",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};

const ExtesModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { language } = useLanguage();
  const images = [
    "/images/0008/extes2.jpg",
    "/images/0008/extes3.jpg",
    "/images/0008/extes4.jpg",
    "/images/0008/extes5.jpg",
  ];
  const [index, setIndex] = useState(0);
  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };
  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <ModalButton
        label={getMessage({
          ja: "EXTESの設定変更",
          us: "EXTES settings",
          cn: "EXTES 设置",
          language,
        })}
        onClick={onOpen}
      />
      <CustomModal
        title={getMessage({
          ja: "EXTESの設定変更",
          us: "EXTES settings",
          cn: "EXTES 设置",
          language,
        })}
        isOpen={isOpen}
        onClose={onClose}
        modalSize="md"
        macCloseButtonHandlers={[onClose]}
        footer={
          <>
            <Text>
              変更後は必ず<Key>OK</Key>を押して閉じてください
            </Text>
          </>
        }
      >
        <>
          <Box bg="custom.system.500" p={4} maxH="70vh" overflowY="auto">
            <Box
              borderRadius="md"
              p={4}
              border="1px solid #4c4b49"
              color="#ccc"
              py={3}
              fontSize="13px"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="12px">
                  {getMessage({
                    ja: "EXTESを起動してプロパティで下記と同じように設定します",
                    us: "Start EXTES and set the same as below in the properties",
                    cn: "启动 EXTES 并在属性中设置如下。",
                    language,
                  })}
                </Text>
              </Flex>
              <Box h="1px" w="100%" bg="#4c4b49" my={2} />
              <Flex direction="column" gap={4}>
                <Box>
                  <Image
                    src={images[index]}
                    alt={`Image ${index + 1}`}
                    objectFit="cover"
                  />

                  <Flex justify="space-between" align="center" mt={4} w="100%">
                    <Button
                      fontSize="13px"
                      h="22px"
                      px="4px"
                      onClick={handlePrev}
                    >
                      ← 戻る
                    </Button>
                    <Box>
                      {index + 1}/{images.length}
                    </Box>
                    <Button
                      fontSize="13px"
                      h="22px"
                      px="4px"
                      onClick={handleNext}
                    >
                      進む →
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Box>
        </>
      </CustomModal>
    </>
  );
};

export default ExtesModal;
