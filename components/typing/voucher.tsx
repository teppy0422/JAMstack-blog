import React, { useRef } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Center,
  Tooltip,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import { useSession, signIn, signOut } from "next-auth/react";

const voucher = (pops) => {
  const property = {
    totalCost: pops.totalCost,
    missedCount: pops.missedCount,
    typePerSocund: pops.typePerSocund,
    gameReplay: pops.gameReplay,
  };
  const voucherOpenRef = useRef(null); //伝票を開くボタン
  const voucherCloseRef = useRef(null); //伝票を開くボタン
  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="80%"
      backdropBlur="2px"
    />
  );
  const [overlay, setOverlay] = React.useState(<OverlayTwo />);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  return (
    <>
      <Button
        ml="4"
        onClick={() => {
          setOverlay(<OverlayTwo />);
          onOpen();
        }}
        ref={voucherOpenRef}
      >
        伝票を見る
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>終了</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="22px">
            {session ? (
              <Center fontSize={["0px", "16px", "16px", "16px"]}>
                {session.user.name}
              </Center>
            ) : (
              <Center>ログインしていません</Center>
            )}
            <Center>{property.totalCost}円</Center>
            <Center>ミス:{property.missedCount}回</Center>
            <Tooltip hasArrow label="1分間の入力キー数" bg="gray.600">
              <Center>タイプ速度:{property.typePerSocund}/KPM</Center>
            </Tooltip>
          </ModalBody>
          <ModalFooter py={4}>
            <Button
              mr={2}
              onClick={(e) => {
                voucherCloseRef.current.click();
                setTimeout(property.gameReplay, 500);
              }}
            >
              もう一度プレイ[SPACE]
            </Button>
            <Button mr={2} onClick={onClose}>
              ランキング登録
            </Button>
            <Button mr={2} onClick={onClose} ref={voucherCloseRef}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default voucher;