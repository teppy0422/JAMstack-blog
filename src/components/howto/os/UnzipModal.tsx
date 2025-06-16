import React from "react";
import {
  useDisclosure,
  Box,
  Icon,
  Text,
  Image,
  Flex,
  Spacer,
  List,
  ListItem,
  useColorMode,
} from "@chakra-ui/react";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import CustomModal from "@/components/ui/CustomModal";
import ModalButton from "@/components/ui/ModalButton";

const UnzipModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { language } = useLanguage();
  const { colorMode } = useColorMode();

  return (
    <>
      <ModalButton
        label={getMessage({
          ja: "展開(解凍)",
          us: "Expansion (decompression)",
          cn: "部署（解冻）",
          language,
        })}
        onClick={onOpen}
      />
      <CustomModal
        title={getMessage({
          ja: "ファイルの展開(解凍)方法",
          us: "How to extract (unzip) files",
          cn: "如何解压缩文件",
          language,
        })}
        isOpen={isOpen}
        onClose={onClose}
        modalSize="sm"
        macCloseButtonHandlers={[onClose]}
        footer={<></>}
      >
        <>
          <Box bg="custom.system.500" p={4}>
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
                    ja: "ファイルサイズを小さくしたり、セキュリティの都合でダウンロードファイルの多くは圧縮(.zip)されているので、まずは展開(解凍)する必要があります。",
                    us: "Many of the downloaded files are compressed (.zip) to reduce file size and for security reasons, so they must first be decompressed (unzipped).",
                    cn: "许多下载文件都经过压缩（.zip），以减小文件大小并保证安全，因此您需要先将其展开（解压缩）。",
                    language,
                  })}
                </Text>
              </Flex>
              <Box h="1px" w="100%" bg="#4c4b49" my={2} />
              <Flex direction="column" gap={4}>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"1." +
                    getMessage({
                      ja: "ダウンロードしたzipファイルを右クリックして、「すべて展開」をクリック。",
                      us: "Right-click on the downloaded zip file and select 'Extract All'.",
                      cn: "右键单击下载的压缩文件，选择 「全部解压缩」。",
                      language,
                    })}
                  <Box textAlign="center" mt={2}>
                    <Image
                      src="/images/howTo/unzip-rightclick.webp"
                      alt="右クリックで「すべて展開」を選ぶ"
                      mx="auto"
                    />
                    <Text fontSize="11px" mt={0}>
                      {"※" +
                        getMessage({
                          ja: "Windowsでの右クリックメニュー",
                          us: "Right-click menu in Windows",
                          cn: "Windows 中的右键菜单",
                          language,
                        })}
                    </Text>
                  </Box>
                </Box>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"2." +
                    getMessage({
                      ja: "そのまま「展開」をクリックします。",
                      us: 'Please select a folder to expand to" Click "Expand" as it is.',
                      cn: '请选择要部署到的文件夹"，然后点击 "部署"。',
                      language,
                    })}
                </Box>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"3." +
                    getMessage({
                      ja: "展開が終わると、新しいフォルダーが作られ、その中にファイルが入っています。",
                      us: "When the expansion is finished, a new folder is created, containing the files.",
                      cn: "部署完成后，会创建一个包含文件的新文件夹。",
                      language,
                    })}
                  <Box textAlign="center" mt={2}>
                    <Image
                      src="/images/howTo/unzip-folder.webp"
                      alt="展開後のフォルダ"
                      mx="auto"
                    />
                    <Text fontSize="11px" mt={0}>
                      {"※" +
                        getMessage({
                          ja: "展開後のフォルダーの中身",
                          us: "Contents of the folder after expansion",
                          cn: "部署后文件夹的内容。",
                          language,
                        })}
                    </Text>
                  </Box>
                </Box>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"4." +
                    getMessage({
                      ja: "このフォルダの中身が、実際に使うファイルになります。.zipファイルは削除して構いません。",
                      us: "The contents of this folder will be the actual files to be used. You may delete the .zip file.",
                      cn: "该文件夹中的内容是要使用的实际文件。您可以删除 .zip 文件。",
                      language,
                    })}
                </Box>
              </Flex>
            </Box>
          </Box>
        </>
      </CustomModal>
    </>
  );
};

export default UnzipModal;
