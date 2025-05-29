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

const FontInstallModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const color = colorMode === "light" ? "blue.500" : "blue.200";
  const { language } = useLanguage();

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
          ja: "フォントのインストール",
          us: "Installing Fonts",
          cn: "安装字体",
          language,
        })}
        <Icon as={FaRegEdit} mx={1} />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {getMessage({
              ja: "フォントのインストール手順",
              us: "Font Installation Procedure",
              cn: "字体安装程序",
              language,
            })}
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody>
            <Text mb={4}>
              {getMessage({
                ja: "インストールしたPCで使用可能になります。",
                us: "It will be available on the PC on which it is installed.",
                cn: "它可以在安装了该软件的电脑上使用。",
                language,
              })}
            </Text>
            <Text mb={4}>
              {"1. " +
                getMessage({
                  ja: "フォントファイル(.ttfや.otf)をダブルクリックします。",
                  us: "Double-click on the font file (.ttf or .otf).",
                  cn: "双击字体文件（.ttf 或 .otf）。",
                  language,
                })}
            </Text>

            <Text mb={4}>
              {"2. " +
                getMessage({
                  ja: "下図が表示されるのでインストールをクリック。",
                  us: "Click Install when the figure below appears.",
                  cn: '显示下图时单击 "安装"。',
                  language,
                })}
            </Text>

            <Box mb={4} textAlign="center" w="100%">
              <Image
                src="/images/howTo/font-install.webp"
                alt="フォントのインストール画面"
                mx="auto"
              />
              <Text fontSize="sm" mt={2}>
                {"*" +
                  getMessage({
                    ja: "フォントのインストール画面",
                    us: "Font installation screen",
                    cn: "字体安装屏幕",
                    language,
                  })}
              </Text>
            </Box>

            <Text mb={4}>
              {"*" +
                getMessage({
                  ja: "使用したいアプリケーションを再起動すると使用えるようになります。",
                  us: "Restart the application you wish to use and it will be available.",
                  cn: "重新启动要使用的应用程序，它就可以使用了。",
                  language,
                })}
            </Text>
            <Text>
              {"*" +
                getMessage({
                  ja: "フォントが正しく表示されない場合は、PCを再起動してください。",
                  us: "If the fonts do not display properly, restart your PC.",
                  cn: "如果字体显示不正确，请重新启动电脑。",
                  language,
                })}
            </Text>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  );
};

export default FontInstallModal;
