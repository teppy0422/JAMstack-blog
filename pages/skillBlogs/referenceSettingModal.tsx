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

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

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
  const { language, setLanguage } = useLanguage();

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
        {getMessage({
          ja: "エクセル参照設定の確認",
          us: "Check Excel reference settings",
          cn: "检查 Excel 参考设置。",
          language,
        })}
        <Icon as={FaRegEdit} mx={1} />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {getMessage({
              ja: "エクセルの参照設定の確認方法",
              us: "How to check reference settings in Excel",
              cn: "如何检查 Excel 中的引用设置",
              language,
            })}
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody>
            <Text>
              {"1. " +
                getMessage({
                  ja: "Excel/ACCESSの対象ファイルを開きます。",
                  us: "Open the target file in Excel/ACCESS.",
                  cn: "在 Excel/ACCESS 中打开目标文件",
                  language,
                })}
            </Text>
            <Text>
              {"2." +
                getMessage({
                  ja: "",
                  us: "Press ",
                  cn: "按 ",
                  language,
                })}
              <Kbd {...kbdStyle}>ALT</Kbd>+<Kbd {...kbdStyle}>F11</Kbd>
              {getMessage({
                ja: "を押してVBAを開く",
                us: " to open VBA.",
                cn: " 打开 VBA。",
                language,
              })}
            </Text>
            <Text>
              {"3. " +
                getMessage({
                  ja: "[ツール] → [参照設定]をクリック",
                  us: "Click [Tools] → [Browse Settings]",
                  cn: "单击 [工具] → [浏览设置]。",
                  language,
                })}
            </Text>
            <Text>
              {"4. " +
                getMessage({
                  ja: "下図が表示されるので参照不可になっている項目を確認する",
                  us: "Check the items that cannot be referred to in the chart below.",
                  cn: "显示下图，并检查不可用的项目以供参考。",
                  language,
                })}
            </Text>
            <Image src="/images/0010/unReference.png" w="90%" mt={2} />
            <Text mt={2}>
              {getMessage({
                ja: "参照不可がある場合は、参照不可を解除する操作が必要になります",
                us: "If the reference is disabled, the operation to remove the disablement must be performed.",
                cn: "如果存在禁止取消引用，则需要进行操作才能取消引用。",
                language,
              })}
            </Text>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default referenceSettingModal;
