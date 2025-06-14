import React from "react";
import {
  Box,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
  Kbd,
  Text,
} from "@chakra-ui/react";
import { MdHelpOutline } from "react-icons/md";
import { FocusableElement } from "@chakra-ui/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import CustomModal from "@/components/ui/CustomModal";
import { Key } from "@/components/ui/Key";

export default function UploadSjp() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<FocusableElement>(null);
  const { language } = useLanguage();

  return (
    <>
      <Box onClick={onOpen} cursor="pointer">
        アップロードの手順
      </Box>
      <CustomModal
        title={getMessage({
          ja: "アップロードの手順",
          us: "Upload Procedure",
          cn: "上传程序",
          language,
        })}
        isOpen={isOpen}
        onClose={onClose}
        modalSize="md"
        macCloseButtonHandlers={[onClose]}
        footer={
          <Text fontSize="12px" fontWeight={400} color="#ddd">
            {getMessage({
              ja: "これで全ての生産準備+からのバージョンアップが可能になります",
              us: "This is all you need to do to update from Production Preparation+ to this version!",
              cn: "这将使所有生产准备+ 更新到该版本",
              language,
            })}
          </Text>
        }
      >
        <Box
          fontFamily={getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans,Noto Sans JP",
            cn: "Noto Sans SC,Noto Sans JP",
            language,
          })}
          fontSize="14px"
          fontWeight={400}
          py={1}
          color="#ddd"
          bg="custom.system.500"
        >
          <Box as="p" textAlign="center" mb={4}>
            {"1." +
              getMessage({
                ja: "ダウンロードしたエクセルブックを開く",
                us: "Open the downloaded Excel book.",
                cn: "打开下载的 Excel 电子书。",
                language,
              })}
            <br />
            {"2." +
              getMessage({
                ja: "Menuを開いてVerupを押す",
                us: "Open Menu and press Verup.",
                cn: "打开菜单并按下 Verup。",
                language,
              })}
            <br />
            {"3." +
              getMessage({
                ja: "",
                us: "Click [このVerのアップロード] while holding down ",
                cn: "按住 ",
                language,
              })}
            <span>
              <Key baseColor="gray">Shift</Key>
            </span>
            {getMessage({
              ja: "を押しながら[このVerのアップロード]をクリック",
              us: "",
              cn: " 单击 [上传此 Ver]",
              language,
            })}
          </Box>
          <Box textAlign="center" mb={4}>
            <video
              src="/images/sjpUpload.mp4"
              autoPlay
              muted
              loop
              width="100%"
            />
          </Box>
        </Box>
      </CustomModal>
    </>
  );
}
