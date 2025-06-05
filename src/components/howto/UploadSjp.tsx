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
} from "@chakra-ui/react";
import { MdHelpOutline } from "react-icons/md";
import { FocusableElement } from "@chakra-ui/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

export default function UploadSjp() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<FocusableElement>(null);
  const { language } = useLanguage();

  return (
    <>
      <Box onClick={onOpen} cursor="pointer">
        アップロードの手順
      </Box>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            {getMessage({
              ja: "アップロードの手順",
              us: "Upload Procedure",
              cn: "上传程序",
            })}
          </AlertDialogHeader>
          <AlertDialogCloseButton _focus={{ boxShadow: "none" }} />
          <AlertDialogBody p={4}>
            <Box
              fontFamily={getMessage({
                ja: "Noto Sans JP",
                us: "Noto Sans,Noto Sans JP",
                cn: "Noto Sans SC,Noto Sans JP",
              })}
              fontWeight={400}
            >
              <Box as="p" textAlign="center" mb={4}>
                {"1." +
                  getMessage({
                    ja: "ダウンロードしたエクセルブックを開く",
                    us: "Open the downloaded Excel book.",
                    cn: "打开下载的 Excel 电子书。",
                  })}
                <br />
                {"2." +
                  getMessage({
                    ja: "Menuを開いてVerupを押す",
                    us: "Open Menu and press Verup.",
                    cn: "打开菜单并按下 Verup。",
                  })}
                <br />
                {"3." +
                  getMessage({
                    ja: "",
                    us: "Click [このVerのアップロード] while holding down ",
                    cn: "按住 ",
                  })}
                <span>
                  <Kbd>Shift</Kbd>
                </span>
                {getMessage({
                  ja: "を押しながら[このVerのアップロード]をクリック",
                  us: "",
                  cn: " 单击 [上传此 Ver]",
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
              <Box as="p" textAlign="center" mb={1}>
                {getMessage({
                  ja: "以上で全ての生産準備+からこのバージョンへの更新が可能になります",
                  us: "This is all you need to do to update from Production Preparation+ to this version!",
                  cn: "这将使所有生产准备+ 更新到该版本",
                })}
              </Box>
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button colorScheme="red" ml={3} onClick={onClose}>
              OK
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
