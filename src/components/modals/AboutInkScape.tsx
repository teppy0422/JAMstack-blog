"use client";
import {
  useDisclosure,
  Text,
  IconButton,
  Flex,
  Box,
  HStack,
  Icon,
  Spacer,
  Tooltip,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import { FaQuestion } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import CustomModal from "@/components/ui/CustomModal";
import ModalButton from "@/components/ui/ModalButton";
import { deflate } from "zlib";

export function AboutInkScape() {
  const { language, setLanguage } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <ModalButton label="InkScape" onClick={onOpen} />
      <CustomModal
        title={getMessage({
          ja: "InkScapeとは",
          us: "What is InkScape?",
          cn: "什么是 InkScape？",
          language,
        })}
        isOpen={isOpen}
        onClose={onClose}
        modalSize="sm"
        macCloseButtonHandlers={[onClose]}
        footer={<></>}
      >
        <Box bg="custom.system.500" p={4}>
          <Text fontWeight="bold" fontSize="12px" color="#ccc" mx={2}>
            {getMessage({
              ja: "コンピュータで絵を描くための無料のソフトです。特に「ベクターグラフィックス」という方法で絵を描けます。",
              us: "a free software for drawing pictures on your computer. In particular, you can draw pictures using the [vector graphics] method.",
              cn: "一款在电脑上绘制图片的免费软件。特别是，它允许您使用一种称为 [vector graphics]的方法来绘制图片。",
              language,
            })}
          </Text>
          <Box
            borderRadius="md"
            p={4}
            border="1px solid #4c4b49"
            color="#ccc"
            py={3}
            fontSize="13px"
            mt={3}
          >
            <Text fontWeight="bold" fontSize="12px">
              {"1. " +
                getMessage({
                  ja: "ベクターグラフィックスって何？",
                  us: "What is vector graphics?",
                  cn: "vector graphics 是什么？",
                  language,
                })}
            </Text>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />
            <Text>
              {getMessage({
                ja: "拡大してもきれい ",
                us: "Beautiful even when enlarged ",
                cn: "放大后非常漂亮 ",
                language,
              })}
              :
              {getMessage({
                ja: " 普通の写真や画像は、拡大するとぼやけてしまいます。でも、ベクターグラフィックスは、どんなに拡大しても線がくっきりしています。これは、絵が線や形で表現されているからです。",
                us: " Ordinary photos and images become blurred when enlarged. However, in vector graphics, lines are clear no matter how much they are enlarged. This is because the picture is represented by lines and shapes.",
                cn: " 普通照片和图像放大后会变得模糊不清。但对于矢量图形，无论放大多少，线条都很清晰。这是因为图片是用线条和形状来表示的。",
                language,
              })}
            </Text>
          </Box>
          <Box
            borderRadius="md"
            p={4}
            border="1px solid #4c4b49"
            color="#ccc"
            py={3}
            fontSize="13px"
            mt={4}
          >
            <Text fontWeight="bold" fontSize="12px">
              {"2. " +
                getMessage({
                  ja: "注意点",
                  us: "point of attention",
                  cn: "注意点",
                  language,
                })}
            </Text>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />
            <Text>
              {getMessage({
                ja: "一般的な会社ではソフトのインストール許可申請が必要です。許可が降りてからインストールを行なってください。",
                us: "Normal companies require an application for permission to install the software. Please install the software only after permission is granted.",
                cn: "在普通公司，安装软件需要申请许可。只有在获得许可后才能进行安装。",
                language,
              })}
            </Text>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
}

export default AboutInkScape;
