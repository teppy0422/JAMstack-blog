"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  ListItem,
  Divider,
  AvatarGroup,
  Avatar,
  useColorMode,
  UnorderedList,
  OrderedList,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

import Content from "@/components/content";
import SectionBox from "../../components/SectionBox";
import Frame from "../../components/frame";
import { CustomBadge } from "@/components/ui/CustomBadge";
import ExternalLink from "../../components/ExternalLink";

import { useUserContext } from "@/contexts/useUserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import CodeBlock from "@/components/CodeBlock";

const ARDUINO_CODE = `#include <Keyboard.h>

const int LEFT_BUTTON  = 2;
const int RIGHT_BUTTON = 4;

const unsigned long DEBOUNCE_TIME = 30;

bool leftStableState = HIGH;
bool leftLastReading = HIGH;
unsigned long leftLastChangeTime = 0;

bool rightStableState = HIGH;
bool rightLastReading = HIGH;
unsigned long rightLastChangeTime = 0;

void setup() {
  pinMode(LEFT_BUTTON, INPUT);
  pinMode(RIGHT_BUTTON, INPUT);

  Keyboard.begin();
}

void loop() {

  handleButton(
    LEFT_BUTTON,
    leftLastReading,
    leftStableState,
    leftLastChangeTime,
    KEY_LEFT_ARROW
  );

  handleButton(
    RIGHT_BUTTON,
    rightLastReading,
    rightStableState,
    rightLastChangeTime,
    KEY_RIGHT_ARROW
  );
}

void handleButton(
  int pin,
  bool &lastReading,
  bool &stableState,
  unsigned long &lastChangeTime,
  uint8_t key
) {
  bool reading = digitalRead(pin);

  if (reading != lastReading) {
    lastChangeTime = millis();
    lastReading = reading;
  }

  if ((millis() - lastChangeTime) >= DEBOUNCE_TIME) {

    if (reading != stableState) {

      bool previousState = stableState;

      stableState = reading;

      // ボタンを離した瞬間に1回送信
      if (previousState == LOW && stableState == HIGH) {

        Keyboard.press(key);
        delay(10);
        Keyboard.release(key);
      }
    }
  }
}`;

const ZoomableImage: React.FC<{
  src: string;
  alt: string;
  invertOnDark?: boolean;
}> = ({ src, alt, invertOnDark }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const filter =
    invertOnDark && colorMode === "dark" ? "invert(1)" : undefined;

  return (
    <>
      <Image
        src={src}
        alt={alt}
        borderRadius="md"
        w="auto"
        h="100%"
        maxW="100%"
        objectFit="contain"
        cursor="zoom-in"
        onClick={onOpen}
        transition="transform 0.15s ease"
        _hover={{ transform: "scale(1.02)" }}
        filter={filter}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton
            color="white"
            bg="blackAlpha.600"
            borderRadius="full"
            _hover={{ bg: "blackAlpha.800" }}
          />
          <ModalBody
            p={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={src}
              alt={alt}
              maxH="90vh"
              maxW="100%"
              objectFit="contain"
              borderRadius="md"
              cursor="zoom-out"
              onClick={onClose}
              filter={filter}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const BlogPage: React.FC = () => {
  const {
    currentUserId,
    currentUserName,
    isLoading: isLoadingContext,
  } = useUserContext();

  const { language } = useLanguage();
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  useEffect(() => {
    if (language) {
      setIsLanguageLoaded(true);
    }
  }, [language]);

  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const { colorMode } = useColorMode();

  if (!isLanguageLoaded) {
  }

  const partList = [
    {
      name: "ATmega32U4 Pro Micro互換ボード",
      qty: "1",
      note: "USBキーボードとして動作するマイコン",
      url: "https://www.amazon.co.jp/dp/B0DMNBJHT7",
    },
    {
      name: "ユニバーサル基板（ソルダブルブレッドボード）",
      qty: "1",
      note: "部品をはんだ付けして固定するための基板",
      url: "https://www.amazon.co.jp/dp/B07ZV8FWM4",
    },
    {
      name: "タクトスイッチ",
      qty: "1",
      note: "書き込み時のリセット用",
      url: "https://www.amazon.co.jp/Youmile-GR-YM-096-100%E5%80%8B%E3%82%BF%E3%82%AF%E3%83%88%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%B9%E3%82%A4%E3%83%83%E3%83%812%E3%83%94%E3%83%B3DIP-6x6x5mm-PCB%E3%83%A2%E3%83%BC%E3%83%A1%E3%83%B3%E3%82%BF%E3%83%AA%E3%82%BF%E3%82%AF%E3%82%BF%E3%82%A4%E3%83%AB%E3%82%BF%E3%82%AF%E3%83%88%E3%83%97%E3%83%83%E3%82%B7%E3%83%A5%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81/dp/B084X8LKTJ/ref=sr_1_2?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=3B1CH4MKP977J&dib=eyJ2IjoiMSJ9.xEgKtdD4Cy4TRvl_zmGOEpAX6dmGWItUNpBXCyO9tiPDsmsmKDqcAxwir4vHm6kq7KzX1asQEK0O1Rvs2qWUi0nJMznwnNfpDyeaj1_YQGSVRCChCFvKVq4u7j861-MMKKnLRPiTLY4gKzmt8nFq-Z_EWlsneCO6f91pvSVTfXX3apM0cq3a-SoXRPHOBn-ncdm4HHlbEVWgO668WcZnRgkHztbTA4c8iOvXUcCVv8EsZsvZfGsDtjS1f7epVUmbBwaSsBQxLbW6FSPZpbeJ4UqplA5A8YIZGrdgpLhF-JA.5I6TEAL5Z275ibNysb4xHSgJgYiav8YkdXiZ8ZrxuCk&dib_tag=se&keywords=amazon+%E3%82%BF%E3%82%AF%E3%83%88+%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81+2%E3%83%94%E3%83%B3&qid=1789276253&sprefix=amazon+%E3%82%BF%E3%82%AF%E3%83%88+%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81+2%E3%83%94%E3%83%B3%2Caps%2C215&sr=8-2&ufe=app_do%3Aamzn1.fos.d8e7ee72-073f-4b97-8ec0-59c18d6dfebe",
    },
    {
      name: "0.1μF コンデンサ",
      qty: "2",
      note: "スイッチのノイズ・チャタリング対策",
      url: "https://akizukidenshi.com/catalog/g/g110147/",
    },
    {
      name: "10kΩ 抵抗",
      qty: "2",
      note: "入力信号を安定させるため",
      url: "https://akizukidenshi.com/catalog/g/g125103/",
    },
    {
      name: "ターミナルブロック 2Pin",
      qty: "2",
      note: "ボタンへの配線の固定用",
      url: "https://www.amazon.co.jp/dp/B08B85SHLL",
    },
    {
      name: "分割ロングピンソケット 42P",
      qty: "1",
      note: "マイコン取り付け用",
      url: "https://akizukidenshi.com/catalog/g/g105779/",
    },
    {
      name: "USBケーブル(AtoC)",
      qty: "1",
      note: "書き込み用※CtoCはマイコンが対応してないので注意",
      url: "https://www.amazon.co.jp/Anker-USB-IF%E8%AA%8D%E8%A8%BC-%E9%AB%98%E8%80%90%E4%B9%85%E3%83%8A%E3%82%A4%E3%83%AD%E3%83%B3%E7%B4%A0%E6%9D%90%E6%8E%A1%E7%94%A8-iPhone-Galaxy/dp/B0F6V25HTL/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=DACOB867DX5W&dib=eyJ2IjoiMSJ9.RParLelQx809srnmG2AUfqesiAtVLFMLkwZEVbZJUuawzAzvnstP4DQYf-uYiFd-6xu2rrgeb0_yryfvxmLCjOSRSNf5xj2JttGFM8v5FVa1nq_w6sMaaPXY8BzPNh9XUB8GT9lafGTCo3FpeQOUVn7YGmHjebQEAnO39ilEfZIfuQysmj2TJIlNVOh9HnG8vt9Pg3kAb0nH9zwDrzAGOhDq4kSbAo_gnPR_Uql0JGxWPMqPqP_ojSaTlJ05qOGDmySQ-PkH0IkwifoSwh02Sf1vSsTeKyENqFLy8fY_jpI.Kz39Eys9IZ_P-r9Wcyn31ytiOVyLtTHR0AfJSrAHhCA&dib_tag=se&keywords=usb-c&qid=1789277855&refinements=p_n_g-101014941094111%3A23322626051%2Cp_123%3A3271&rnid=23341432051&sprefix=usb-%2Caps%2C428&sr=8-1&ufe=app_do%3Aamzn1.fos.35785624-70c4-44ae-a5c3-3f044f475d63&th=1",
    },
    {
      name: "スズメッキ線5m",
      qty: "1",
      note: "φ0.4mm",
      url: "https://www.amazon.co.jp/ELPA-HK-SM04H-%E3%82%B9%E3%82%BA%E3%83%A1%E3%83%83%E3%82%AD%E7%B7%9A-%CF%860-4mm/dp/B00BECS36Q/ref=sr_1_1_pp?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=1Q09VST6H69XX&dib=eyJ2IjoiMSJ9.tBwicBkilykhd-c3iH33bmhEB97ukmCmT49J3ria_XJVpZi6lV3hyRIMRJpCLe7weD7eeLd-0PAMtpP1nV_npGKAjy7VxoUvq0k2miep06_vse5k-G-PJkLamiavqs3dMkgKyHqzWTIvKo2zU3GDCWY25_InzjmgBkJj5MdPgq00XYUvjFnvFi1CowBdxRubotfJ_8GJWr1D255DWP5IdCH7TbIFt5gB5vbgf_HZADj9nJPmjFB-GAvSsJ3mGEQBrfJ6pxNUG9tsiSMtnDwuZ5nZ8led4pIWDnJtjNssFWU.Mld6l7TC_mN05wgloZXrtj5mY0cVSjRq9IDBOEBYuOo&dib_tag=se&keywords=%E3%81%99%E3%81%9A%E3%82%81%E3%81%A3%E3%81%8D%E7%B7%9A&qid=1789278926&sprefix=%E3%81%99%E3%81%9A%E3%82%81%E3%81%A3%E3%81%8D%E7%B7%9A%2Caps%2C287&sr=8-1&ufe=app_do%3Aamzn1.fos.d8e7ee72-073f-4b97-8ec0-59c18d6dfebe&th=1",
    },
    {
      name: "配線",
      qty: "-",
      note: "0.3spくらい※品種D02とか077",
      url: "",
    },
  ];

  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs} isThrough>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                borderWidth={1}
              />
            </AvatarGroup>
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>
              {getMessage({
                ja: "開発",
                language,
              })}
            </Text>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "自作USBキーボードインターフェイスの作り方",
              us: "",
              cn: "",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "Arduino",
              us: "",
              cn: "",
              language,
            })}
          />

          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            {getMessage({
              ja: "更新日",
              language,
            })}
            :2026-09-13
          </Text>

          <Text mt={4} lineHeight={1.8}>
            {getMessage({
              ja: "ここではATmega32U4というチップを搭載した「Pro Micro互換ボード」というマイコンを使って、物理的なボタンを押すとPCに矢印キー（←→）が送信される「USBキーボードインターフェイス」を自作する方法を解説します。プログラムを書き換えると簡単に別のキーに変更できます。",
              language,
            })}
          </Text>
        </Box>

        {/* 1. 使用するもの */}
        <SectionBox
          id="section1"
          title={
            "1." +
            getMessage({
              ja: "使用するマイコンボード",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text mt={3}>
            {getMessage({
              ja: "ATmega32U4というチップを搭載したマイコンボードなら何でもOKです。",
              language,
            })}
          </Text>
          <Text mt={2} fontWeight="bold">
            {getMessage({ ja: "特徴", language })}
          </Text>
          <UnorderedList spacing={1} mt={1}>
            <ListItem>
              {getMessage({ ja: "USBでPCに接続できる", language })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "Arduino IDEを使ってプログラム（スケッチ）を書き込める",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "Keyboard.hというライブラリを使って、PCに対してキーボード入力を送信できる",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "左矢印キーや右矢印キーなどを、本物のUSBキーボードと同じようにPCへ送信できる",
                language,
              })}
            </ListItem>
          </UnorderedList>
        </SectionBox>

        {/* 2. できること */}
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "今回作るもの",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text mt={3}>
            {getMessage({
              ja: "物理ボタンを2つ接続し、以下のように動作させます。",
              language,
            })}
          </Text>
          <UnorderedList spacing={1} mt={2}>
            <ListItem>
              {getMessage({
                ja: "左ボタンを押して離す → PCに「←（左矢印キー）」を送信",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "右ボタンを押して離す → PCに「→（右矢印キー）」を送信",
                language,
              })}
            </ListItem>
          </UnorderedList>
          <Text mt={3}>
            {getMessage({
              ja: "ポイントは、「ボタンを押している間」ではなく「ボタンを離した瞬間」に1回だけキー入力を送信することです。押しっぱなしにしても、キーが連打されることはありません。",
              language,
            })}
          </Text>
          <Text mt={3}>
            {getMessage({
              ja: "Webページのページ送り、プレゼンテーションのスライド操作、動画の早送り・巻き戻しなど、さまざまな用途に使用できます。",
              language,
            })}
          </Text>
        </SectionBox>

        {/* 3. 使用する部品 */}
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "使用する部品",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box mt={3} overflowX="auto">
            <Table size="sm" variant="simple">
              <Thead>
                <Tr bg={colorMode === "light" ? "gray.100" : "gray.600"}>
                  <Th>{getMessage({ ja: "部品", language })}</Th>
                  <Th isNumeric>{getMessage({ ja: "数", language })}</Th>
                  <Th>{getMessage({ ja: "用途", language })}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {partList.map((p) => (
                  <Tr key={p.name}>
                    <Td fontSize="sm">
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            textDecoration: "underline",
                            color:
                              colorMode === "light" ? "#3182ce" : "#90cdf4",
                          }}
                        >
                          {p.name}
                        </a>
                      ) : (
                        p.name
                      )}
                    </Td>
                    <Td isNumeric fontSize="sm">
                      {p.qty}
                    </Td>
                    <Td fontSize="sm">{p.note}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </SectionBox>

        {/* 4. 回路について */}
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "回路設計について",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text mt={3}>
            {getMessage({
              ja: "Arduinoにはpinの電圧を安定してHIGH（5V側）に保つ「内部プルアップ抵抗」がチップ内に用意されており、pinModeにINPUT_PULLUPを指定するだけでこれを使うこともできます。ただし今回は配線を長くしたい場合にも安定して動作するように、内部プルアップは使わず、外部に10kΩ抵抗を追加する「外部プルアップ」方式で回路を組みます。",
              language,
            })}
          </Text>
          <Text mt={4} fontWeight="bold">
            {getMessage({
              ja: "各部品の役割",
              language,
            })}
          </Text>
          <UnorderedList spacing={2} mt={2}>
            <ListItem>
              {getMessage({
                ja: "10kΩ抵抗：ボタンを押していないときに、ピンの電圧を安定してHIGH（5V側）に保つための抵抗です。抵抗がないと、ピンの電圧がふらついて誤動作の原因になります。",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "0.1μFコンデンサ：ボタンを押した瞬間・離した瞬間に発生する微小なノイズや周囲のモーターノイズを電気的に吸収し、誤動作を防ぎます。",
                language,
              })}
            </ListItem>
          </UnorderedList>
        </SectionBox>

        {/* 5. 回路図 */}
        <SectionBox
          id="section5"
          title={
            "5." +
            getMessage({
              ja: "回路図",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text mt={3}>
            {getMessage({
              ja: '下図のように接続してください。交線に⚫︎があれば繋がっています。"D2"はデジタル2番という意味でボードには"2"と表記されてる事が多いです。',
              language,
            })}
          </Text>
          <HStack
            mt={4}
            spacing={4}
            align="stretch"
            flexWrap="wrap"
            justify="center"
            h={{ base: "auto", md: "480px" }}
          >
            <Box h="100%">
              <ZoomableImage
                src="/images/0017/circuitDiagram.webp"
                alt="Pro Micro互換ボードを中心に、左のD2ピンとD4ピンからそれぞれ10kΩ抵抗・0.1μFコンデンサを介してスイッチ(SW)へ、右のGND・RST・VCCからもスイッチや配線へつながる回路図。"
                invertOnDark
              />
            </Box>
          </HStack>
        </SectionBox>

        {/* 6. 実体配線図 */}
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "実体配線図",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text mt={3}>
            {getMessage({
              ja: "実際に部品を配置したときの写真です。黄色の箇所をハンダ付けしてください。画像はクリックすると拡大表示できます。",
              language,
            })}
          </Text>
          <HStack
            mt={4}
            spacing={4}
            align="stretch"
            flexWrap="wrap"
            justify="center"
            h={{ base: "auto", md: "480px" }}
          >
            <Box h="100%">
              <ZoomableImage
                src="/images/0017/board-0.webp"
                alt="ソルダブルブレッドボードの中央にPro Micro（USB-C版）を配置し、その左側にネジ式端子台、抵抗2本とコンデンサ2個、赤いタクトスイッチを配線した実体配線図の写真。端子台からは緑・赤・白・黒の4本の配線が外部へ伸びている。"
              />
            </Box>
            <Box h="100%">
              <ZoomableImage
                src="/images/0017/board-1.webp"
                alt="ソルダブルブレッドボードの裏面（はんだ面）の写真。金色にはんだ付けされたパッドと、黄色いジャンパー線で基板裏側の配線をつないでいる様子が写っている。"
              />
            </Box>
          </HStack>
        </SectionBox>
        {/* 8. Arduino IDEの準備 */}
        <SectionBox
          id="section8"
          title={
            "7." +
            getMessage({
              ja: "Arduino IDEの接続テスト",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <OrderedList spacing={2} mt={3}>
            <ListItem>
              Arduino IDE（
              <ExternalLink
                href="https://www.arduino.cc/en/software"
                text={getMessage({ ja: "公式サイト", language })}
              />
              {getMessage({
                ja: "から無料でダウンロードできる開発ソフト）をインストールします。",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "Pro Micro互換ボードをUSBケーブルでPCに接続します。",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "Arduino IDEの「ツール」メニューから「ボード」を選択します。",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "ATmega32U4を搭載したボードとして認識させます。",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "「ツール」→「シリアルポート」から、接続したボードのポートを選択します。",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: '「書き込ボタン（→アイコン）」をクリックして、ボードに書き込みます。成功すると"書込み完了"のメッセージが表示されます。',
                language,
              })}<br/>
              {getMessage({
                ja: " ※ここで書込みエラーが出る場合は以下を試してみてください。",
                language,
              })}<br/>

            </ListItem>
          </OrderedList>
          <Text mt={4} ml={4} fontWeight="bold">1.
            {getMessage({
              ja: '書込みボタンを押して"書込み中"が表示されたらすぐにRESETスイッチを素早く2回押してください',
              language,
            })}
          </Text>
          <Text mt={4} ml={4} fontWeight="bold">2.
            {getMessage({
              ja: "SparkFunのボード定義を追加する",
              language,
            })}
          </Text>
          <Text mt={2} ml={8}>
            {getMessage({
              ja: "「SparkFun Pro Micro」を選択肢に出すには、あらかじめボードマネージャーにSparkFunのボード定義を追加しておく必要があります。手順は以下の通りです。",
              language,
            })}
          </Text>
          <UnorderedList spacing={2} mt={2} ml={12}>
            <ListItem>
              {getMessage({
                ja: "Arduino IDEの「ファイル」→「環境設定」（Macでは「Arduino IDE」→「Settings」）を開きます。",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "「追加のボードマネージャーのURL」欄に、次のURLを貼り付けます。",
                language,
              })}
            </ListItem>
            <Box mt={2}ml={0}>
              <CodeBlock code="https://raw.githubusercontent.com/sparkfun/Arduino_Boards/main/IDE_Board_Manager/package_sparkfun_index.json" />
            </Box>
            <ListItem>
              {getMessage({
                ja: "「ツール」→「ボード」→「ボードマネージャー」を開き、検索欄に「sparkfun」と入力します。",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "「SparkFun AVR Boards」を選択してインストールします。インストールが完了すると、「ツール」→「ボード」の一覧に「SparkFun AVR Boards」というグループが追加され、その中に「SparkFun Pro Micro」が表示されます。",
                language,
              })}
            </ListItem>
          </UnorderedList>
          <Text mt={3} fontSize="sm" ml={8}>
            {getMessage({
              ja: "※購入したボードがArduino公式の「Arduino Micro」や「Arduino Leonardo」として認識される場合は、この追加インストールは不要です。まずは購入ページの説明を確認し、対応するボード名が分からない場合や、標準のボード一覧に見当たらない場合にこの手順を試してください。",
              language,
            })}
          </Text>

          <Text mt={4} fontWeight="bold">
            {getMessage({ ja: "書込みに失敗した場合の確認ポイント", language })}
          </Text>
          <Divider
            mt={1}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <UnorderedList spacing={2} mt={2}>
            <ListItem>
              <Text as="span" fontWeight="semibold">
                {getMessage({ ja: "ボード設定：", language })}
              </Text>
              {getMessage({
                ja: "「ツール」→「ボード」で、購入したボードに近い種類（Arduino Leonardo、Arduino Micro、SparkFun Pro Microなど）を選びます。パッケージや販売ページの説明を確認するとわかりやすいです。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Text as="span" fontWeight="semibold">
                {getMessage({ ja: "Processor設定：", language })}
              </Text>
              {getMessage({
                ja: "「Pro Micro」を選んだ場合は、「Processor」の項目で「ATmega32U4」を選択します。似た名前の項目を間違えないよう注意してください。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Text as="span" fontWeight="semibold">
                {getMessage({ ja: "5V/16MHz か 3.3V/8MHz かの違い：", language })}
              </Text>
              {getMessage({
                ja: "Pro Micro互換ボードには動作電圧が5V/16MHzのものと3.3V/8MHzのものがあります。この設定を間違えると書き込みに失敗したり、動作が不安定になったりします。購入ページの仕様欄やボード上の印字を確認し、正しい方を選んでください。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Text as="span" fontWeight="semibold">
                {getMessage({ ja: "COMポート／USBポート：", language })}
              </Text>
              {getMessage({
                ja: "「ツール」→「シリアルポート」に、接続したボードのポート（Windowsなら「COM3」など）が表示されているか確認します。表示されない場合は、USBケーブルやドライバの問題が考えられます。",
                language,
              })}
            </ListItem>
            <ListItem>
              <Text as="span" fontWeight="semibold">
                {getMessage({ ja: "RESETを2回押す操作：", language })}
              </Text>
              {getMessage({
                ja: "書き込み開始の直前にRESETボタンを素早く2回押すと、ボードが書き込み待ち状態になり、成功しやすくなる場合があります。",
                language,
              })}
            </ListItem>
          </UnorderedList>
        </SectionBox>

        {/* 9. Arduinoコード */}
        <SectionBox
          id="section9"
          title={
            "8." +
            getMessage({
              ja: "Arduinoコードの書込み",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text mt={3}>
            {getMessage({
              ja: "以下のコードをArduino IDEに貼り付けて、ボードに書き込んでください。左ボタン（D2）を離すと左矢印キー、右ボタン（D4）を離すと右矢印キーがPCに送信されます。「4.回路について」で説明した外部10kΩプルアップ抵抗を使う配線に合わせて、pinModeはINPUTにしてあります。",
              language,
            })}
          </Text>
          <Text mt={2} fontSize="sm">
            {getMessage({
              ja: "コード内のDEBOUNCE_TIME（30ミリ秒）は、ボタンのチャタリング（電気的な細かい振動）を無視するための待ち時間です。ボタンの反応が悪いと感じる場合は値を小さく、逆に誤反応が多い場合は値を大きくして調整してください。",
              language,
            })}
          </Text>
          <Box mt={3}>
            <CodeBlock code={ARDUINO_CODE} title="USB_ArrowKeyboard.ino" />
          </Box>
        </SectionBox>

        {/* 10. まとめ */}
        <SectionBox
          id="section10"
          title={
            "9." +
            getMessage({
              ja: "まとめ",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text mt={3} lineHeight={1.8}>
            {getMessage({
              ja: "ATmega32U4搭載のPro Micro互換ボードを使うことで、市販のキーボードを分解することなく、自分専用の物理ボタン式ショートカットデバイスを作ることができます。今回紹介した左右矢印キーだけでなく、Keyboard.hライブラリを使えば他のキーやショートカットキーの組み合わせにも応用できますので、ぜひ自分の用途に合わせてカスタマイズしてみてください。",
              language,
            })}
          </Text>
        </SectionBox>
      </Frame>
    </>
  );
};

export default BlogPage;
