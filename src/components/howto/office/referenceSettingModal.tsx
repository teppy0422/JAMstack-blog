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
} from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import HowToModal from "../HowToModal";

const kbdStyle = {
  border: "1px solid",
  fontSize: "16px",
  bg: "white",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};

const ReferenceSettingModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { language } = useLanguage();

  const color = "blue.400";

  const title = getMessage({
    ja: "参照設定の確認方法",
    us: "How to check reference settings in Excel",
    cn: "如何检查 Excel 中的引用设置",
    language,
  });

  const body = (
    <List spacing={4} styleType="decimal">
      <ListItem>
        {getMessage({
          ja: "Excel/ACCESSの対象ファイルを開きます。",
          us: "Open the target file in Excel/ACCESS.",
          cn: "在 Excel/ACCESS 中打开目标文件",
          language,
        })}
      </ListItem>
      <ListItem>
        {getMessage({
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
      </ListItem>
      <ListItem>
        {getMessage({
          ja: "[ツール] → [参照設定]をクリック",
          us: "Click [Tools] → [Browse Settings]",
          cn: "单击 [工具] → [浏览设置]。",
          language,
        })}
      </ListItem>
      <ListItem>
        {getMessage({
          ja: "下図が表示されるので参照不可になっている項目を確認する",
          us: "Check the items that cannot be referred to in the chart below.",
          cn: "显示下图，并检查不可用的项目以供参考。",
          language,
        })}
        <Box textAlign="center" mt={2}>
          <Image src="/images/howTo/unReference.webp" w="90%" mx="auto" />
        </Box>
      </ListItem>
      <ListItem>
        {getMessage({
          ja: "参照不可がある場合は、参照不可を解除する操作が必要になります",
          us: "If the reference is disabled, the operation to remove the disablement must be performed.",
          cn: "如果存在禁止取消引用，则需要进行操作才能取消引用。",
          language,
        })}
      </ListItem>
    </List>
  );

  return (
    <>
      <Box
        as="span"
        onClick={onOpen}
        display="inline-flex"
        alignItems="center"
        cursor="pointer"
        textDecoration="none"
        borderBottom="2px solid"
        color={color}
        borderColor={color}
      >
        {getMessage({
          ja: "参照設定の確認",
          us: "Check Excel reference settings",
          cn: "检查 Excel 参考设置。",
          language,
        })}
        <Icon as={FaRegEdit} mx={1} />
      </Box>

      <HowToModal isOpen={isOpen} onClose={onClose} title={title} body={body} />
    </>
  );
};

export default ReferenceSettingModal;
