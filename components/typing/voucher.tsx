import React, { useRef, forwardRef, useImperativeHandle } from "react";
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

let voucher = (pops, ref) => {
  const property = {
    totalCost: pops.totalCost,
    missedCount: pops.missedCount,
    typePerSocund: pops.typePerSocund,
    gameReplay: pops.gameReplay,
    voucherCloseRef: pops.voucherCloseRef,
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

  // 親コンポーネントの ref.current から実行できる関数を定義したオブジェクトを返す
  useImperativeHandle(ref, () => ({
    clickChildOpen() {
      voucherOpenRef.current.click();
    },
  }));

  const handleClick = async () => {
    const data = {
      course: "高級",
      result: property.typePerSocund,
      name: session.user.name,
    };
    await fetch("/api/typing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // 本文のデータ型は "Content-Type" ヘッダーと一致させる必要があります
    });
    // return response.json();
  };

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
            {session ? (
              <Button mr={2} onClick={handleClick}>
                登録
              </Button>
            ) : (
              <Button mr={2} disabled>
                登録
              </Button>
            )}
            <Button mr={2} onClick={onClose} ref={voucherCloseRef}>
              閉じる
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
voucher = forwardRef(voucher);
export default voucher;
