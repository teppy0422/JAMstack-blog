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
  Text,
  Box,
  SimpleGrid,
  Flex,
  Spacer,
  Badge,
  VStack,
  Divider,
} from "@chakra-ui/react";

import { useSession, signIn, signOut } from "next-auth/react";
import GraphTemp from "../../components/typing/graphTemp";

import styles from "../../styles/home.module.scss";
import { RGBADepthPacking } from "three";

import Sushi_tamago_wrap3 from "../../components/3d/sushi_tamago_wrap3";

let voucher = (pops, ref) => {
  const property = {
    totalCost: pops.totalCost,
    missedCount: pops.missedCount,
    typePerSocund: pops.typePerSocund,
    gameReplay: pops.gameReplay,
    voucherCloseRef: pops.voucherCloseRef,
    time: pops.time,
  };
  const graphTempRef = useRef(null); //履歴グラフ
  const voucherOpenRef = useRef(null); //伝票を開くボタン
  const voucherCloseRef = useRef(null); //伝票を開くボタン
  const voucherPostRef = useRef(null); //登録ボタン

  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="90%"
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
      userId: session.user.email,
      course: "高級",
      result: Number(property.typePerSocund),
      name: session.user.name,
      image: session.user.image,
      time: Number(property.time),
      missed: Number(property.missedCount),
      cost: Number(property.totalCost),
    };

    await fetch("/api/typing/post", {
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
      <Text
        p="0"
        _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
        onClick={() => {
          setOverlay(<OverlayTwo />);
          onOpen();
        }}
        ref={voucherOpenRef}
      >
        伝票を見る
      </Text>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent
          color="#000"
          style={{
            backgroundColor: "rgba(191,191,220,0.7",
            border: "1px rgba(255, 255, 255, 0.4) solid",
            borderBottom: "1px rgba(40, 40, 40, 0.35) solid",
            borderRight: "1px rgba(40, 40, 40, 0.35) solid",
            boxShadow: "rgba(0, 0, 0, 0.3) 2px 8px 8px",
          }}
        >
          <ModalHeader>タイピング速度は「たまご」でした</ModalHeader>
          <ModalCloseButton _focus={{ _focus: "none" }} />
          <ModalBody fontSize="22px">
            <Flex>
              <Box w={["260px"]} position="relative">
                <Center position="absolute" top={["-100px"]} left={["-180px"]}>
                  <Sushi_tamago_wrap3 />
                </Center>
              </Box>
              <Spacer />
              <VStack textAlign="right" w={["150px"]} fontSize="16px">
                <Text variant="solid">{property.typePerSocund}/KPM</Text>
                <Divider style={{ marginTop: "2px" }} borderColor="#000" />
                <Box>ミス:{property.missedCount}回</Box>
                <Divider style={{ marginTop: "2px" }} borderColor="#000" />
                <Box>{property.totalCost}円</Box>
                <Divider style={{ marginTop: "2px" }} borderColor="#000" />
              </VStack>
            </Flex>
          </ModalBody>
          <ModalFooter py={4}>
            <Button
              display="none"
              mr={2}
              _focus={{ _focus: "none" }}
              onClick={(e) => {
                voucherCloseRef.current.click();
                setTimeout(property.gameReplay, 500);
              }}
            >
              もう一度プレイ[SPACE]
            </Button>
            {session ? (
              <>
                <Button
                  mr={2}
                  ref={voucherPostRef}
                  onClick={(e) => {
                    handleClick().then((value) => {
                      graphTempRef.current.childClick();
                    });
                    voucherPostRef.current.setAttribute("disabled", "");
                  }}
                  _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
                >
                  登録
                </Button>
                <div style={{ display: "none" }}>
                  <GraphTemp
                    ref={graphTempRef}
                    totalCost={property.totalCost}
                    missedCount={property.missedCount}
                    typePerSocund={property.typePerSocund}
                    times={property.time}
                  />
                </div>
              </>
            ) : (
              <>
                <Button mr={2} disabled>
                  登録
                </Button>
              </>
            )}
            <Button
              mr={2}
              onClick={onClose}
              ref={voucherCloseRef}
              _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
            >
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
