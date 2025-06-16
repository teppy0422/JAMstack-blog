import React from "react";
import {
  useDisclosure,
  Box,
  Icon,
  Text,
  Image,
  List,
  ListItem,
  Flex,
} from "@chakra-ui/react";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

import CustomModal from "@/components/ui/CustomModal";
import ModalButton from "@/components/ui/ModalButton";
import ImageWithHighlight from "@/components/ImageWidthHighlight";

const FontInstallModal: React.FC = () => {
  const { language } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ModalButton
        label={getMessage({
          ja: "フォントのインストール",
          us: "Installing Fonts",
          cn: "安装字体",
          language,
        })}
        onClick={onOpen}
      />
      <CustomModal
        title={getMessage({
          ja: "フォントのインストール手順",
          us: "Font Installation Procedure",
          cn: "字体安装程序",
          language,
        })}
        isOpen={isOpen}
        onClose={onClose}
        modalSize="md"
        macCloseButtonHandlers={[onClose]}
        footer={
          <>
            <Text fontWeight="bold" fontSize="12px">
              {getMessage({
                ja: "インストールするとそのPCで使用できるようになります。",
                us: "Once the font is installed, it can be used on that PC.",
                cn: "一旦安装了字体，就可以在该电脑上使用。",
                language,
              })}
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
              <Flex direction="column" gap={4}>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"1." +
                    getMessage({
                      ja: "フォントファイル(.ttfや.otf)をダブルクリックします。",
                      us: "Double-click on the font file (.ttf or .otf).",
                      cn: "双击字体文件（.ttf 或 .otf）。",
                      language,
                    })}
                </Box>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"2." +
                    getMessage({
                      ja: "下図が表示されるのでインストールをクリック。",
                      us: "Click Install when the figure below appears.",
                      cn: '显示下图时单击 "安装"。',
                      language,
                    })}
                  <Box textAlign="center" mt={2}>
                    <ImageWithHighlight
                      src="/images/howTo/font-install.webp"
                      mb={0}
                      label="※フォントのインストール画面"
                      highlights={[
                        {
                          top: "18.5%",
                          left: "13.5%",
                          w: "13.5%",
                          h: "15%",
                          animation: "blink",
                          borderRadius: "3px",
                          bg: "repeating-linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 4px, transparent 4px, transparent 6px)",
                        },
                      ]}
                    />
                  </Box>
                </Box>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"3." +
                    getMessage({
                      ja: "フォントを使用したいアプリケーションを再起動すると使えるようになります。",
                      us: "Restart the application you wish to use and it will be available.",
                      cn: "重新启动要使用的应用程序，它就可以使用了。",
                      language,
                    })}
                </Box>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"※ " +
                    getMessage({
                      ja: "フォントが正しく表示されない場合は、PCを再起動してください。",
                      us: "If the fonts do not display properly, restart your PC.",
                      cn: "如果字体显示不正确，请重新启动电脑。",
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

export default FontInstallModal;
