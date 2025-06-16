import React from "react";
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
} from "@chakra-ui/react";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

import CustomModal from "@/components/ui/CustomModal";
import ModalButton from "@/components/ui/ModalButton";

const kbdStyle = {
  border: "1px solid",
  fontSize: "13px",
  bg: "#ddd",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};

const ReferenceSettingModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { language } = useLanguage();

  return (
    <>
      <ModalButton
        label={getMessage({
          ja: "参照設定の確認",
          us: "Check Excel reference settings",
          cn: "检查 Excel 参考设置。",
          language,
        })}
        onClick={onOpen}
      />
      <CustomModal
        title={getMessage({
          ja: "参照設定の確認方法",
          us: "How to check reference settings in Excel",
          cn: "如何检查 Excel 中的引用设置",
          language,
        })}
        isOpen={isOpen}
        onClose={onClose}
        modalSize="md"
        macCloseButtonHandlers={[onClose]}
        footer={
          <>
            <Text>
              参照不可がある場合は何らかの方法で対応する必要があります。
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
                    ja: "すでに存在するコードは参照設定で使えるようになります。そのコードがPC内に無い場合は参照不可になります。",
                    us: "Codes that already exist can be used in the reference setting. If the code does not exist in the PC, it will not be available for referencing.",
                    cn: "已存在的代码可用于参考设置。如果代码不在 PC 上，则无法用于参照。",
                    language,
                  })}
                </Text>
              </Flex>
              <Box h="1px" w="100%" bg="#4c4b49" my={2} />
              <Flex direction="column" gap={4}>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"1." +
                    getMessage({
                      ja: "Excel/ACCESSの対象ファイルを開きます。",
                      us: "Open the target file in Excel/ACCESS.",
                      cn: "在 Excel/ACCESS 中打开目标文件",
                      language,
                    })}
                </Box>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"2." +
                    getMessage({
                      ja: "",
                      us: "Press ",
                      cn: "按 ",
                      language,
                    })}
                  <Kbd {...kbdStyle}>ALT</Kbd> + <Kbd {...kbdStyle}>F11</Kbd>
                  {getMessage({
                    ja: "を押してVBAを開く",
                    us: " to open VBA.",
                    cn: " 打开 VBA。",
                    language,
                  })}
                </Box>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"3." +
                    getMessage({
                      ja: "[ツール] → [参照設定]をクリック",
                      us: "Click [Tools] → [Browse Settings]",
                      cn: "单击 [工具] → [浏览设置]。",
                      language,
                    })}
                </Box>
                <Box textIndent="-1em" pl="1em" whiteSpace="pre-wrap">
                  {"4." +
                    getMessage({
                      ja: "下図が表示されるので参照不可になっている項目を確認する",
                      us: "Check the items that cannot be referred to in the chart below.",
                      cn: "显示下图，并检查不可用的项目以供参考。",
                      language,
                    })}
                  <Box textAlign="center" mt={2}>
                    <Image
                      src="/images/howTo/unReference.webp"
                      alt="右クリックで「すべて展開」を選ぶ"
                      mx="auto"
                    />
                    <Text fontSize="11px" mt={0}>
                      {"※" +
                        getMessage({
                          ja: "参照設定",
                          us: "reference configuration",
                          cn: "参考配置",
                          language,
                        })}
                    </Text>
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Box>
        </>
      </CustomModal>
    </>
  );
};

export default ReferenceSettingModal;
