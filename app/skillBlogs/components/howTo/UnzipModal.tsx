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

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import { unzip } from "lodash";

const kbdStyle = {
  border: "1px solid",
  fontSize: "16px",
  bg: "white",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};
const UnzipModal: React.FC = () => {
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
          ja: "展開(解凍)",
          us: "Expansion (decompression)",
          cn: "部署（解冻）",
          language,
        })}
        <Icon as={FaRegEdit} mx={1} />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {getMessage({
              ja: "ファイルの展開(解凍)方法",
              us: "How to extract (unzip) files",
              cn: "如何解压缩文件",
              language,
            })}
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody>
            <Text mb={4}>
              {"1. " +
                getMessage({
                  ja: "ファイルサイズを小さくしたり、セキュリティの都合でダウンロードファイルの多くは圧縮(.zip)されているので、まずは展開(解凍)する必要があります。",
                  us: "Many of the downloaded files are compressed (.zip) to reduce file size and for security reasons, so they must first be decompressed (unzipped).",
                  cn: "许多下载文件都经过压缩（.zip），以减小文件大小并保证安全，因此您需要先将其展开（解压缩）。",
                  language,
                })}
            </Text>

            <Text mb={4}>
              {"2. " +
                getMessage({
                  ja: "ダウンロードしたzipファイルを右クリックして、「すべて展開」を選びます。",
                  us: "Right-click on the downloaded zip file and select 'Extract All'.",
                  cn: "右键单击下载的压缩文件，选择 「全部解压缩」。",
                  language,
                })}
            </Text>

            {/* 右クリックメニューの画像イメージ */}
            <Box mb={4} textAlign="center" w="100%">
              <Image
                src="/images/howTo/unzip-rightclick.webp"
                alt="右クリックで「すべて展開」を選ぶ"
                mx="auto"
              />
              <Text fontSize="sm" mt={2}>
                {"*" +
                  getMessage({
                    ja: "Windowsでの右クリックメニュー",
                    us: "Right-click menu in Windows",
                    cn: "Windows 中的右键菜单",
                    language,
                  })}
              </Text>
            </Box>

            <Text mb={4}>
              {"3. " +
                getMessage({
                  ja: "「展開先のフォルダーを選んでください」そのまま「展開」をクリックします。",
                  us: 'Please select a folder to expand to" Click "Expand" as it is.',
                  cn: '请选择要部署到的文件夹"，然后点击 "部署"。',
                  language,
                })}
            </Text>
            <Text mb={4}>
              {"4. " +
                getMessage({
                  ja: "展開が終わると、新しいフォルダーが作られ、その中にファイルが入っています。",
                  us: "When the expansion is finished, a new folder is created, containing the files.",
                  cn: "部署完成后，会创建一个包含文件的新文件夹。",
                  language,
                })}
            </Text>
            <Box mb={4} textAlign="center" w="100%">
              <Image
                src="/images/howTo/unzip-folder.webp"
                alt="展開後のフォルダ"
                mx="auto"
              />
              <Text fontSize="sm" mt={2}>
                {"*" +
                  getMessage({
                    ja: "展開後のフォルダーの中身",
                    us: "Contents of the folder after expansion",
                    cn: "部署后文件夹的内容。",
                    language,
                  })}
              </Text>
            </Box>
            <Text>
              {"5." +
                getMessage({
                  ja: "このフォルダの中身が、実際に使うファイルになります。.zipファイルは削除して構いません。",
                  us: "The contents of this folder will be the actual files to be used. You may delete the .zip file.",
                  cn: "该文件夹中的内容是要使用的实际文件。您可以删除 .zip 文件。",
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

export default UnzipModal;
