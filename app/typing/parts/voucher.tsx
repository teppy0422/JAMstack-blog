"use client";

import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import dynamic from "next/dynamic";

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
import { supabase } from "@/utils/supabase/client";

// import { useSession, signIn, signOut } from "next-auth/react";
import GraphTemp, { GraphTempHandle } from "./graphTemp";

import styles from "@/styles/home.module.scss";
import { RGBADepthPacking } from "three";
const SushiTamagoWrap3 = dynamic(
  () => import("../../../components/3d/sushi_tamago_wrap3"),
  {
    ssr: false,
  }
);
import Sushi_tamago_wrap3 from "../../../components/3d/sushi_tamago_wrap3";

import Gari from "../../../components/3d/sushi_gari";
import Tukemono from "../../../components/3d/sushi_tukemono";
import Umeboshi from "../../../components/3d/sushi_umeboshi";
import Tamago from "../../../components/3d/sushi_tamago";
import Ika from "../../../components/3d/sushi_ika";
import Iwashi from "../../../components/3d/sushi_iwashi";
import Tekka from "../../../components/3d/sushi_tekka";
import Amaebi from "../../../components/3d/sushi_amaebi";
import Samon from "../../../components/3d/sushi_samon";
import Ebi from "../../../components/3d/sushi_ebi";
import Ootoro from "../../../components/3d/sushi_ootoro";
import SanmaYaki from "../../../components/3d/sushi_sanma_yaki";
import Ikura from "../../../components/3d/sushi_ikura";

import getMessage from "../../../components/getMessage";
// import { AppContext } from "../../pages/_app";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import { UserData } from "@/contexts/useUserContext";
export interface VoucherProps {
  totalCost: number;
  missedCount: number;
  typePerSocund: number;
  gameReplay?: () => void;
  time: number;
  user: UserData | null;
  flag?: boolean;
}

export interface VoucherRef {
  clickChildOpen: (
    clearedProblemsCount: number,
    session: unknown,
    flag: boolean
  ) => void;
}
export const Voucher = forwardRef<VoucherRef, VoucherProps>((props, ref) => {
  // const { language, setLanguage } = useContext(AppContext);
  const { language, setLanguage } = useLanguage();

  const {
    totalCost,
    missedCount,
    typePerSocund,
    gameReplay,
    time,
    user,
    flag,
  } = props;
  const graphTempRef = useRef<GraphTempHandle>(null); // ✅ 修正
  const voucherOpenRef = useRef(null); //伝票を開くボタン
  const voucherCloseRef = useRef<HTMLButtonElement | null>(null); //伝票を閉じるボタン
  const voucherPostRef = useRef<HTMLButtonElement | null>(null); //登録ボタン
  const sushiRef = useRef<JSX.Element | null>(null);
  const sushiCommentRef = useRef(""); //寿司なまえ
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
  const [isFlagTrue, setIsFlagTrue] = useState(false); // flagの状態を追加

  const Sushi = [
    {
      path: <Gari />,
      text: getMessage({
        ja: "ガリ",
        us: "Pickled ginger",
        cn: "腌姜",
        language,
      }),
    },
    {
      path: <Tukemono />,
      text: getMessage({
        ja: "つけもの",
        us: "Tsukemono",
        cn: "Tsukemono",
        language,
      }),
    },
    {
      path: <Umeboshi />,
      text: getMessage({
        ja: "梅干",
        us: "Dried plum",
        cn: "梅干",
        language,
      }),
    },
    {
      path: <Tamago />,
      text: getMessage({
        ja: "たまご",
        us: "Roasted eggs",
        cn: "烤蛋",
        language,
      }),
    },
    {
      path: <Ika />,
      text: getMessage({
        ja: "イカ",
        us: "Squid",
        cn: "烏賊",
        language,
      }),
    },
    {
      path: <Iwashi />,
      text: getMessage({
        ja: "鰯",
        us: "Sardine",
        cn: "鰯",
        language,
      }),
    },
    {
      path: <Tekka />,
      text: getMessage({
        ja: "鉄火巻き",
        us: "Tuna roll",
        cn: "铁火卷",
        language,
      }),
    },
    {
      path: <Amaebi />,
      text: getMessage({
        ja: "甘エビ",
        us: "Sweet Shrimp",
        cn: "甜虾",
        language,
      }),
    },
    {
      path: <Ebi />,
      text: getMessage({
        ja: "エビ",
        us: "Shrimp",
        cn: "虾",
        language,
      }),
    },
    {
      path: <Samon />,
      text: getMessage({
        ja: "サーモン",
        us: "Salmon",
        cn: "三文鱼",
        language,
      }),
    },
    {
      path: <Ikura />,
      text: getMessage({
        ja: "イクラ",
        us: "Salmon Roe",
        cn: "鲑鱼卵",
        language,
      }),
    },
    {
      path: <Ootoro />,
      text: getMessage({
        ja: "大トロ",
        us: "Fatty Tuna",
        cn: "大肥金枪鱼",
        language,
      }),
    },
    {
      path: <SanmaYaki />,
      text: getMessage({
        ja: "さんま焼き",
        us: "Grilled Pacific Saury",
        cn: "烤秋刀鱼",
        language,
      }),
    },
  ];
  // 親コンポーネントの ref.current から実行できる関数を定義したオブジェクトを返す
  useImperativeHandle(ref, () => ({
    clickChildOpen(clearedProblemsCount, sesstion, flag) {
      sushiCommentRef.current = Sushi[clearedProblemsCount].text;
      sushiRef.current = Sushi[clearedProblemsCount].path;
      setIsFlagTrue(flag); // flagの値を状態に設定
      console.log("flag", flag);
      console.log("isFlagTrue", isFlagTrue);
      onOpen(); // モーダルを開く
    },
  }));
  //DBに登録
  const handleClick = async () => {
    if (!user) return; // セッションが存在しない場合は処理を終了
    const data = {
      user_id: user.id,
      course: "高級",
      result: typePerSocund,
      name: "",
      missed: missedCount,
      cost: totalCost,
    };
    const { error } = await supabase.from("typing_results").insert([data]);
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully");
    }
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
        {/* 伝票を見る */}
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
          <ModalHeader>
            {getMessage({
              ja: "タイピング速度は",
              us: "Typing speed is",
              cn: "打字速度为 ",
              language,
            })}
            「{sushiCommentRef.current}」
            {getMessage({
              ja: "でした",
              us: "",
              cn: "",
              language,
            })}
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody fontSize="22px">
            <Flex>
              <Box w={["260px"]} position="relative">
                <Center
                  position="absolute"
                  top={["-50px", "-80px", "-90px", "-100px"]}
                  left={["-80px", "-120px", "-160px", "-180px"]}
                >
                  <Sushi_tamago_wrap3 path={sushiRef.current} />
                </Center>
              </Box>
              <Spacer />
              <VStack textAlign="right" w={["150px"]} fontSize="16px">
                <Text variant="solid">{typePerSocund}/KPM</Text>
                <Divider style={{ marginTop: "2px" }} borderColor="#000" />
                <Box>
                  {getMessage({
                    ja: "ミス",
                    us: "missed",
                    cn: "失去的",
                    language,
                  })}
                  :{missedCount}
                </Box>
                <Divider style={{ marginTop: "2px" }} borderColor="#000" />
                <Box>
                  {getMessage({
                    ja: "¥ ",
                    us: "$ ",
                    cn: "¥ ",
                    language,
                  })}
                  {totalCost}
                </Box>
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
                // voucherCloseRefがHTMLButtonElementであることを確認する
                if (voucherCloseRef.current instanceof HTMLButtonElement) {
                  voucherCloseRef.current.click();
                }
                // setTimeout(property.gameReplay, 500);
              }}
            >
              {getMessage({
                ja: "もう一度プレイ[SPACE]",
                us: "Play again [SPACE]",
                cn: "再次播放 [SPACE]",
                language,
              })}
            </Button>
            {user && isFlagTrue ? (
              <>
                <Button
                  mr={2}
                  ref={voucherPostRef}
                  _focus={{ _focus: "none" }}
                  onClick={(e) => {
                    handleClick().then((value) => {
                      onClose();
                      if (
                        graphTempRef.current &&
                        "click" in graphTempRef.current
                      ) {
                        (graphTempRef.current as { click: Function }).click();
                      }
                    });
                    if (voucherPostRef.current) {
                      voucherPostRef.current.setAttribute("disabled", "");
                    }
                  }}
                >
                  {getMessage({
                    ja: "登録",
                    us: "Registration",
                    cn: "注册",
                    language,
                  })}
                </Button>
                <div style={{ display: "none" }}>
                  <GraphTemp
                    ref={graphTempRef}
                    totalCost={totalCost}
                    missedCount={missedCount}
                    typePerSocund={typePerSocund}
                    times={time}
                    userID={user.id}
                    visible={true}
                  />
                </div>
              </>
            ) : (
              <>
                <Button
                  mr={2}
                  disabled
                  _focus={{ _focus: "none" }}
                  style={{ cursor: "not-allowed", opacity: 0.5 }}
                >
                  {getMessage({
                    ja: "登録",
                    us: "Registration",
                    cn: "注册",
                    language,
                  })}
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
