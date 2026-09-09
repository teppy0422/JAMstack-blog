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
  pinMode(LEFT_BUTTON, INPUT_PULLUP);
  pinMode(RIGHT_BUTTON, INPUT_PULLUP);

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
      name: "タクトスイッチまたは外部ボタン",
      qty: "2",
      note: "左右操作用",
      url: "",
    },
    {
      name: "0.1μF コンデンサ",
      qty: "2",
      note: "スイッチのノイズ・チャタリング対策",
      url: "",
    },
    {
      name: "10kΩ 抵抗",
      qty: "2",
      note: "入力信号を安定させるため",
      url: "",
    },
    {
      name: "リセット用タクトスイッチ",
      qty: "1",
      note: "書き込み時のリセット操作用",
      url: "",
    },
    {
      name: "配線材",
      qty: "適量",
      note: "配線用",
      url: "",
    },
    {
      name: "ネジ式端子台（5.08mmピッチ 2Pin）",
      qty: "適量",
      note: "ボタンや配線を基板にネジ止めで着脱しやすくする",
      url: "https://www.amazon.co.jp/dp/B08B85SHLL",
    },
    {
      name: "USBケーブル",
      qty: "1",
      note: "PC接続・書き込み用",
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
            :2026-09-04
          </Text>

          <Text mt={4} lineHeight={1.8}>
            {getMessage({
              ja: "この記事では、ATmega32U4というチップを搭載した「Pro Micro互換ボード」というマイコン（小さなコンピューター基板）を使って、物理的なボタンを押すとPCに矢印キー（←→）が送信される「USBキーボードインターフェイス」を自作する方法を、電子工作が初めての方にも分かるように説明します。",
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
              ja: "今回使用するのは、ATmega32U4というチップを搭載した「Pro Micro互換ボード」です。",
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
          <Text mt={3}>
            {getMessage({ ja: "今回使用したボードはこちらです。", language })}
          </Text>
          <Box mt={1}>
            <ExternalLink
              href="https://www.amazon.co.jp/dp/B0DMNBJHT7"
              text="使用したATmega32U4 Pro Micro互換ボード"
            />
          </Box>
        </SectionBox>

        {/* 2. できること */}
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "この装置でできること",
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
                ja: "左ボタン → PCに「←（左矢印キー）」を送信",
                language,
              })}
            </ListItem>
            <ListItem>
              {getMessage({
                ja: "右ボタン → PCに「→（右矢印キー）」を送信",
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
              ja: "そのため、Webページのページ送り、プレゼンテーションのスライド操作、動画の早送り・巻き戻しなど、さまざまな用途に使用できます。",
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
                  <Th isNumeric>{getMessage({ ja: "数量", language })}</Th>
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
          <Text mt={3} fontSize="sm" color="gray.500">
            {getMessage({
              ja: "※「0.1μF」は「マイクロファラッド」と読みます。コンデンサの容量（電気をためられる量）を表す単位です。",
              language,
            })}
          </Text>
          <Text mt={1} fontSize="xs" color="gray.500">
            {getMessage({
              ja: "※部品名をクリックすると、購入したサイトが別タブで開きます。",
              language,
            })}
          </Text>
        </SectionBox>

        {/* 4. 回路について */}
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "回路について",
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
              ja: "今回使用するArduinoのコードでは、pinModeにINPUT_PULLUPを指定しています。これはArduinoの内部にすでに用意されているプルアップ抵抗（ピンの電圧をHIGHに保つための抵抗）を使う設定です。",
              language,
            })}
          </Text>
          <Box
            mt={3}
            p={3}
            borderRadius="md"
            bg={colorMode === "light" ? "yellow.50" : "yellow.900"}
            border="1px solid"
            borderColor={colorMode === "light" ? "yellow.300" : "yellow.600"}
          >
            <Text fontWeight="bold">
              {getMessage({ ja: "⚠ 重要な注意点", language })}
            </Text>
            <Text mt={2}>
              {getMessage({
                ja: "INPUT_PULLUPを使っている状態で、外部に10kΩのプルアップ抵抗を単純に追加すると、内部プルアップと外部プルアップが二重にかかってしまいます。今回のように配線を長くしたい場合や、入力をより安定させたい場合に外部抵抗＋コンデンサ方式へ変更するときは、必ずコードのpinModeもINPUT（内部プルアップを使わない設定）に変更してください。",
                language,
              })}
            </Text>
          </Box>
          <Text mt={4} fontWeight="bold">
            {getMessage({
              ja: "各部品の役割（初心者向け）",
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
                ja: "0.1μFコンデンサ：ボタンを押した瞬間・離した瞬間に発生する微小なノイズ（チャタリング）を電気的に吸収し、信号を滑らかにする役割があります。",
                language,
              })}
            </ListItem>
          </UnorderedList>

          <Divider
            my={4}
            borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
          />

          <Text fontWeight="bold" fontSize="lg">
            {getMessage({ ja: "左ボタン（D2ピン）", language })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "Arduinoの2番ピン（D2）を使用します。今回は外部抵抗＋コンデンサ方式で配線する場合の接続イメージは以下の通りです。",
              language,
            })}
          </Text>
          <Box mt={2} pl={4}>
            <UnorderedList spacing={1}>
              <ListItem>
                {getMessage({
                  ja: "D2ピン ─┬─ 10kΩ抵抗 ─ 5V（外部プルアップ）",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "D2ピン ─┴─ ボタン ─ GND",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "D2ピンとGNDの間に0.1μFコンデンサを接続（ノイズ対策）",
                  language,
                })}
              </ListItem>
            </UnorderedList>
          </Box>
          <Box
            mt={3}
            p={3}
            borderRadius="md"
            bg={colorMode === "light" ? "blue.50" : "blue.900"}
            border="1px solid"
            borderColor={colorMode === "light" ? "blue.200" : "blue.700"}
          >
            <Text fontSize="sm">
              {getMessage({
                ja: "※このページ後半で紹介するArduinoコードは、シンプルさを優先してINPUT_PULLUP（内部プルアップのみ使用）を前提に書かれています。配線を短く済ませたい初心者の方は、外部の10kΩ抵抗とコンデンサを省略し、ボタンとGNDだけをD2・D4ピンに接続する形でも動作します。配線を長くする、あるいはノイズが気になる環境で外部抵抗＋コンデンサ方式を使う場合は、コード内のpinMode(LEFT_BUTTON, INPUT_PULLUP)をpinMode(LEFT_BUTTON, INPUT)に、pinMode(RIGHT_BUTTON, INPUT_PULLUP)をpinMode(RIGHT_BUTTON, INPUT)に書き換えてください。",
                language,
              })}
            </Text>
          </Box>

          <Divider
            my={4}
            borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
          />

          <Text fontWeight="bold" fontSize="lg">
            {getMessage({ ja: "右ボタン（D4ピン）", language })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "Arduinoの4番ピン（D4）を使用します。考え方は左ボタンと全く同じです。",
              language,
            })}
          </Text>
          <Box mt={2} pl={4}>
            <UnorderedList spacing={1}>
              <ListItem>
                {getMessage({
                  ja: "D4ピン ─┬─ 10kΩ抵抗 ─ 5V（外部プルアップ）",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "D4ピン ─┴─ ボタン ─ GND",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "D4ピンとGNDの間に0.1μFコンデンサを接続（ノイズ対策）",
                  language,
                })}
              </ListItem>
            </UnorderedList>
          </Box>
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
              ja: "左ボタン（D2）・右ボタン（D4）それぞれについて、外部抵抗＋コンデンサ方式で配線する場合の回路図です。電気の流れが分かるように、記号で表しています。",
              language,
            })}
          </Text>
          <Box
            mt={4}
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
            bg={colorMode === "light" ? "white" : "gray.800"}
            overflowX="auto"
          >
            <figure style={{ margin: 0 }}>
              <svg
                viewBox="0 0 660 385"
                role="img"
                aria-label="左ボタンD2・右ボタンD4それぞれについて、5Vから10kΩ抵抗を介してArduinoの入力ピンへ接続し、そのピンからネジ式端子台を経由してボタンへ、ボタンから再び端子台を経由してGNDへ接続する。ピンとGNDの間には0.1マイクロファラッドのコンデンサを並列に接続するプルアップ回路の回路図。"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "700px",
                  color: colorMode === "light" ? "#1a202c" : "#e2e8f0",
                  fontFamily: "monospace",
                }}
              >
                <defs>
                  <marker
                    id="circuit-arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
                  </marker>
                </defs>

                {/* ---- 左ボタン回路 (D2) ---- */}
                <g stroke="currentColor" strokeWidth="1.6" fill="none">
                  {/* 5V rail */}
                  <line x1="40" y1="40" x2="220" y2="40" />
                  {/* 5V to resistor */}
                  <line x1="120" y1="40" x2="120" y2="80" />
                  {/* resistor body (zigzag) */}
                  <polyline points="120,80 108,90 132,100 108,110 132,120 120,130" />
                  {/* resistor to node */}
                  <line x1="120" y1="130" x2="120" y2="170" />
                  {/* node to pin box (right) */}
                  <line
                    x1="120"
                    y1="170"
                    x2="220"
                    y2="170"
                    markerEnd="url(#circuit-arrow)"
                  />
                  {/* node down to terminal block */}
                  <line x1="120" y1="170" x2="120" y2="196" />
                  {/* terminal block to button */}
                  <line x1="105" y1="212" x2="105" y2="220" />
                  <line x1="135" y1="212" x2="135" y2="220" />
                  {/* button symbol */}
                  <line x1="85" y1="220" x2="155" y2="220" />
                  <line x1="85" y1="240" x2="155" y2="240" />
                  <line x1="105" y1="240" x2="105" y2="250" />
                  <line x1="135" y1="240" x2="135" y2="250" />
                  {/* button to terminal block 2 */}
                  <line x1="105" y1="250" x2="105" y2="258" />
                  <line x1="135" y1="250" x2="135" y2="258" />
                  {/* terminal block 2 to node2 */}
                  <line x1="120" y1="274" x2="120" y2="290" />
                  {/* node2 to capacitor (right, below pin box) */}
                  <line x1="120" y1="290" x2="220" y2="290" />
                  <line x1="220" y1="270" x2="220" y2="310" />
                  <line x1="200" y1="278" x2="200" y2="302" />
                  <line x1="220" y1="290" x2="245" y2="290" />
                  {/* GND rail */}
                  <line x1="40" y1="330" x2="220" y2="330" />
                  <line x1="120" y1="290" x2="120" y2="330" />
                </g>
                {/* left terminal blocks (screw terminal) */}
                <g stroke="currentColor" strokeWidth="1.4" fill="none">
                  <rect x="90" y="196" width="60" height="16" rx="2" />
                  <circle cx="105" cy="204" r="3.2" />
                  <circle cx="135" cy="204" r="3.2" />
                  <rect x="90" y="258" width="60" height="16" rx="2" />
                  <circle cx="105" cy="266" r="3.2" />
                  <circle cx="135" cy="266" r="3.2" />
                </g>
                {/* ground hatch */}
                <g stroke="currentColor" strokeWidth="1.6">
                  <line x1="40" y1="330" x2="40" y2="346" />
                  <line x1="30" y1="346" x2="50" y2="346" />
                  <line x1="34" y1="352" x2="46" y2="352" />
                  <line x1="38" y1="358" x2="42" y2="358" />
                </g>
                <text x="15" y="44" fontSize="13">5V</text>
                <text x="10" y="334" fontSize="13">GND</text>
                <text x="60" y="95" fontSize="12">10kΩ</text>
                <text x="165" y="208" fontSize="10">端子台</text>
                <text x="60" y="235" fontSize="12">SW</text>
                <text x="165" y="270" fontSize="10">端子台</text>
                <text x="70" y="145" fontSize="11">左ボタン</text>
                <rect
                  x="245"
                  y="150"
                  width="90"
                  height="40"
                  rx="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <text x="290" y="175" fontSize="13" textAnchor="middle">
                  D2
                </text>
                <rect
                  x="245"
                  y="270"
                  width="90"
                  height="40"
                  rx="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <text x="290" y="295" fontSize="12" textAnchor="middle">
                  0.1μF
                </text>

                {/* ---- 右ボタン回路 (D4), mirrored layout offset ---- */}
                <g stroke="currentColor" strokeWidth="1.6" fill="none">
                  <line x1="440" y1="40" x2="620" y2="40" />
                  <line x1="540" y1="40" x2="540" y2="80" />
                  <polyline points="540,80 528,90 552,100 528,110 552,120 540,130" />
                  <line x1="540" y1="130" x2="540" y2="170" />
                  <line
                    x1="540"
                    y1="170"
                    x2="440"
                    y2="170"
                    markerEnd="url(#circuit-arrow)"
                  />
                  <line x1="540" y1="170" x2="540" y2="196" />
                  <line x1="525" y1="212" x2="525" y2="220" />
                  <line x1="555" y1="212" x2="555" y2="220" />
                  <line x1="505" y1="220" x2="575" y2="220" />
                  <line x1="505" y1="240" x2="575" y2="240" />
                  <line x1="525" y1="240" x2="525" y2="250" />
                  <line x1="555" y1="240" x2="555" y2="250" />
                  <line x1="525" y1="250" x2="525" y2="258" />
                  <line x1="555" y1="250" x2="555" y2="258" />
                  <line x1="540" y1="274" x2="540" y2="290" />
                  <line x1="540" y1="290" x2="440" y2="290" />
                  <line x1="440" y1="270" x2="440" y2="310" />
                  <line x1="460" y1="278" x2="460" y2="302" />
                  <line x1="440" y1="290" x2="415" y2="290" />
                  <line x1="440" y1="330" x2="620" y2="330" />
                  <line x1="540" y1="290" x2="540" y2="330" />
                </g>
                {/* right terminal blocks (screw terminal) */}
                <g stroke="currentColor" strokeWidth="1.4" fill="none">
                  <rect x="510" y="196" width="60" height="16" rx="2" />
                  <circle cx="525" cy="204" r="3.2" />
                  <circle cx="555" cy="204" r="3.2" />
                  <rect x="510" y="258" width="60" height="16" rx="2" />
                  <circle cx="525" cy="266" r="3.2" />
                  <circle cx="555" cy="266" r="3.2" />
                </g>
                <g stroke="currentColor" strokeWidth="1.6">
                  <line x1="620" y1="330" x2="620" y2="346" />
                  <line x1="610" y1="346" x2="630" y2="346" />
                  <line x1="614" y1="352" x2="626" y2="352" />
                  <line x1="618" y1="358" x2="622" y2="358" />
                </g>
                <text x="595" y="44" fontSize="13">5V</text>
                <text x="590" y="334" fontSize="13">GND</text>
                <text x="565" y="95" fontSize="12">10kΩ</text>
                <text x="425" y="208" fontSize="10">端子台</text>
                <text x="565" y="235" fontSize="12">SW</text>
                <text x="425" y="270" fontSize="10">端子台</text>
                <text x="590" y="145" fontSize="11">右ボタン</text>
                <rect
                  x="325"
                  y="150"
                  width="90"
                  height="40"
                  rx="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <text x="370" y="175" fontSize="13" textAnchor="middle">
                  D4
                </text>
                <rect
                  x="325"
                  y="270"
                  width="90"
                  height="40"
                  rx="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <text x="370" y="295" fontSize="12" textAnchor="middle">
                  0.1μF
                </text>

                {/* Arduino board outline linking both pin/cap boxes */}
                <rect
                  x="235"
                  y="130"
                  width="190"
                  height="200"
                  rx="6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <text x="330" y="365" fontSize="12" textAnchor="middle">
                  Pro Micro（ATmega32U4）本体
                </text>
              </svg>
              <figcaption
                style={{
                  fontSize: "12px",
                  color: colorMode === "light" ? "#718096" : "#a0aec0",
                  marginTop: "8px",
                }}
              >
                {getMessage({
                  ja: "左右それぞれのボタン回路。5V→10kΩ抵抗→ピン(D2/D4)の経路でプルアップし、ピンからネジ式端子台を経由してボタンへ、ボタンから再び端子台を経由してGNDへ落とす。ピン-GND間には0.1μFコンデンサを並列に入れてノイズを吸収する。",
                  language,
                })}
              </figcaption>
            </figure>
          </Box>
          <Text mt={3} fontSize="sm" color="gray.500">
            {getMessage({
              ja: "※内部プルアップ（INPUT_PULLUP）のみを使うシンプルな配線にする場合は、5Vライン・10kΩ抵抗・0.1μFコンデンサを省略し、ピンとボタン、ボタンとGNDだけを接続してください。",
              language,
            })}
          </Text>
        </SectionBox>

        {/* 6. 配線図 */}
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "配線図",
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
              ja: "実際に部品を配置したときのイメージです。基板は「3.使用する部品」で紹介したソルダブルブレッドボード（はんだ付けできるプリント基板）を使用します。中央にPro Micro互換ボードを配置し、左右のボタン回路をネジ式端子台で接続します。",
              language,
            })}
          </Text>
          <Box
            mt={4}
            p={3}
            borderRadius="md"
            border="1px solid"
            borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
            bg={colorMode === "light" ? "white" : "gray.800"}
            overflowX="auto"
          >
            <figure style={{ margin: 0 }}>
              <svg
                viewBox="-10 -60 780 460"
                role="img"
                aria-label="ソルダブルブレッドボード（上下に赤と青の電源ライン、中央に5穴グループの縦ストリップが並ぶ、中央に部品を差す溝がある基板）の中央にPro Micro互換ボードを縦向きに配置し、短辺にあるUSBコネクタが基板の外へ上向きに突き出してケーブルでPCへつながる。左側にD2ピン用のネジ式端子台・10kΩ抵抗・0.1マイクロファラッドコンデンサ・左ボタンを、右側にD4ピン用の同じ部品構成と右ボタンを配置する。Pro Microの下端のRESETピンとGNDピンからリセット用タクトスイッチへ接続する配線図。"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "700px",
                  color: colorMode === "light" ? "#1a202c" : "#e2e8f0",
                  fontFamily: "monospace",
                }}
              >
                {/* ---- ソルダブルブレッドボード（プリント基板）---- */}
                <rect
                  x="30"
                  y="30"
                  width="700"
                  height="340"
                  rx="6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <text x="46" y="20" fontSize="12">
                  {getMessage({
                    ja: "ソルダブルブレッドボード（プリント基板）",
                    language,
                  })}
                </text>

                {/* 上側 電源ライン（赤=+ / 青=-）穴の列 */}
                <g>
                  {Array.from({ length: 44 }).map((_, i) => (
                    <React.Fragment key={`top-rail-${i}`}>
                      <circle
                        cx={46 + i * 16}
                        cy={44}
                        r="2"
                        fill="currentColor"
                        opacity={colorMode === "light" ? 0.55 : 0.6}
                      />
                      <circle
                        cx={46 + i * 16}
                        cy={54}
                        r="2"
                        fill="currentColor"
                        opacity={colorMode === "light" ? 0.35 : 0.4}
                      />
                    </React.Fragment>
                  ))}
                </g>
                <text x="46" y="66" fontSize="9" opacity={0.7}>
                  + / − {getMessage({ ja: "電源ライン", language })}
                </text>

                {/* 中央の穴グループ（5穴×多数の縦ストリップ）上半分 */}
                <g opacity={colorMode === "light" ? 0.45 : 0.5}>
                  {Array.from({ length: 42 }).map((_, col) =>
                    Array.from({ length: 5 }).map((_, row) => (
                      <circle
                        key={`upper-${col}-${row}`}
                        cx={48 + col * 16}
                        cy={86 + row * 8}
                        r="1.6"
                        fill="currentColor"
                      />
                    ))
                  )}
                </g>

                {/* 中央の溝（部品を差す境目） */}
                <line
                  x1="30"
                  y1="200"
                  x2="730"
                  y2="200"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                  opacity={0.5}
                />

                {/* 中央の穴グループ 下半分 */}
                <g opacity={colorMode === "light" ? 0.45 : 0.5}>
                  {Array.from({ length: 42 }).map((_, col) =>
                    Array.from({ length: 5 }).map((_, row) => (
                      <circle
                        key={`lower-${col}-${row}`}
                        cx={48 + col * 16}
                        cy={222 + row * 8}
                        r="1.6"
                        fill="currentColor"
                      />
                    ))
                  )}
                </g>

                {/* 下側 電源ライン 穴の列 */}
                <g>
                  {Array.from({ length: 44 }).map((_, i) => (
                    <React.Fragment key={`bottom-rail-${i}`}>
                      <circle
                        cx={46 + i * 16}
                        cy={344}
                        r="2"
                        fill="currentColor"
                        opacity={colorMode === "light" ? 0.35 : 0.4}
                      />
                      <circle
                        cx={46 + i * 16}
                        cy={354}
                        r="2"
                        fill="currentColor"
                        opacity={colorMode === "light" ? 0.55 : 0.6}
                      />
                    </React.Fragment>
                  ))}
                </g>
                <text x="46" y="368" fontSize="9" opacity={0.7}>
                  − / + {getMessage({ ja: "電源ライン", language })}
                </text>

                {/* ---- Pro Micro board (center, opaque so it sits over the holes) ---- */}
                {/* board silhouette: narrow rectangle, long edge vertical, seated inside the breadboard */}
                <rect
                  x="345"
                  y="70"
                  width="70"
                  height="150"
                  rx="4"
                  fill={colorMode === "light" ? "white" : "#1a202c"}
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <text
                  x="380"
                  y="150"
                  fontSize="11.5"
                  textAnchor="middle"
                  transform="rotate(-90 380 150)"
                >
                  Pro Micro（ATmega32U4）
                </text>

                {/* Micro USB connector: tab protruding OUT of the breadboard's top edge */}
                <rect
                  x="366"
                  y="8"
                  width="28"
                  height="24"
                  rx="2"
                  fill={colorMode === "light" ? "white" : "#1a202c"}
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <line
                  x1="366"
                  y1="20"
                  x2="345"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
                <line
                  x1="394"
                  y1="20"
                  x2="415"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
                <text x="430" y="24" fontSize="9.5">
                  {getMessage({ ja: "USBコネクタ", language })}
                </text>
                <text x="430" y="37" fontSize="9" opacity={0.75}>
                  {getMessage({ ja: "（基板の外へ突き出す）", language })}
                </text>
                <line
                  x1="380"
                  y1="8"
                  x2="380"
                  y2="-16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <text x="380" y="-24" fontSize="11" textAnchor="middle">
                  {getMessage({ ja: "USBケーブルでPCへ", language })}
                </text>

                {/* pin header rows on both long edges, protruding into the board's holes */}
                {[100, 130].map((y, i) => (
                  <React.Fragment key={`pm-pin-l-${i}`}>
                    <line
                      x1="337"
                      y1={y}
                      x2="345"
                      y2={y}
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <circle cx="337" cy={y} r="2" fill="currentColor" />
                  </React.Fragment>
                ))}
                {[100, 130].map((y, i) => (
                  <React.Fragment key={`pm-pin-r-${i}`}>
                    <line
                      x1="415"
                      y1={y}
                      x2="423"
                      y2={y}
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <circle cx="423" cy={y} r="2" fill="currentColor" />
                  </React.Fragment>
                ))}

                {/* Pin labels on Pro Micro left/right edges (using pin header rows) */}
                <line x1="337" y1="100" x2="260" y2="100" stroke="currentColor" strokeWidth="1.4" />
                <text x="255" y="104" fontSize="11" textAnchor="end">D2</text>
                <line x1="337" y1="130" x2="260" y2="130" stroke="currentColor" strokeWidth="1.4" />
                <text x="255" y="134" fontSize="11" textAnchor="end">GND</text>

                <line x1="423" y1="100" x2="500" y2="100" stroke="currentColor" strokeWidth="1.4" />
                <text x="505" y="104" fontSize="11">D4</text>
                <line x1="423" y1="130" x2="500" y2="130" stroke="currentColor" strokeWidth="1.4" />
                <text x="505" y="134" fontSize="11">GND</text>

                {/* RESET / GND pin header on the bottom short edge */}
                <line x1="365" y1="220" x2="365" y2="228" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="365" cy="228" r="2" fill="currentColor" />
                <line x1="395" y1="220" x2="395" y2="228" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="395" cy="228" r="2" fill="currentColor" />
                <text
                  x="120"
                  y="300"
                  fontSize="9.5"
                  opacity={0.75}
                >
                  {getMessage({
                    ja: "※ピンヘッダーで基板の穴に差し込んで固定",
                    language,
                  })}
                </text>

                {/* ---- 左回路ブロック ---- */}
                <g stroke="currentColor" strokeWidth="1.4" fill="none">
                  <line x1="260" y1="100" x2="215" y2="100" />
                  <line x1="260" y1="130" x2="215" y2="130" />
                </g>
                {/* 左側 ネジ式端子台（4極: D2 / GND 用） */}
                <rect
                  x="175"
                  y="88"
                  width="40"
                  height="55"
                  rx="3"
                  fill={colorMode === "light" ? "white" : "#1a202c"}
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="195" cy="100" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="195" cy="130" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
                <text x="195" y="157" fontSize="9.5" textAnchor="middle">
                  {getMessage({ ja: "端子台", language })}
                </text>

                <g stroke="currentColor" strokeWidth="1.4" fill="none">
                  <line x1="175" y1="100" x2="150" y2="100" />
                  <line x1="175" y1="130" x2="150" y2="130" />
                </g>
                <rect
                  x="90"
                  y="80"
                  width="60"
                  height="70"
                  rx="4"
                  fill={colorMode === "light" ? "white" : "#1a202c"}
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <text x="120" y="74" fontSize="9.5" textAnchor="middle">
                  {getMessage({ ja: "抵抗+コンデンサ", language })}
                </text>
                <text x="120" y="105" fontSize="10" textAnchor="middle">10kΩ</text>
                <text x="120" y="120" fontSize="10" textAnchor="middle">0.1μF</text>
                <line x1="90" y1="130" x2="60" y2="130" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="55" cy="130" r="12" fill={colorMode === "light" ? "white" : "#1a202c"} stroke="currentColor" strokeWidth="1.6" />
                <text x="55" y="134" fontSize="9" textAnchor="middle">SW</text>
                <text x="55" y="160" fontSize="11" textAnchor="middle">
                  {getMessage({ ja: "左ボタン", language })}
                </text>

                {/* ---- 右回路ブロック ---- */}
                <g stroke="currentColor" strokeWidth="1.4" fill="none">
                  <line x1="500" y1="100" x2="545" y2="100" />
                  <line x1="500" y1="130" x2="545" y2="130" />
                </g>
                <rect
                  x="545"
                  y="88"
                  width="40"
                  height="55"
                  rx="3"
                  fill={colorMode === "light" ? "white" : "#1a202c"}
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <circle cx="565" cy="100" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="565" cy="130" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
                <text x="565" y="157" fontSize="9.5" textAnchor="middle">
                  {getMessage({ ja: "端子台", language })}
                </text>

                <g stroke="currentColor" strokeWidth="1.4" fill="none">
                  <line x1="585" y1="100" x2="610" y2="100" />
                  <line x1="585" y1="130" x2="610" y2="130" />
                </g>
                <rect
                  x="610"
                  y="80"
                  width="60"
                  height="70"
                  rx="4"
                  fill={colorMode === "light" ? "white" : "#1a202c"}
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <text x="640" y="74" fontSize="9.5" textAnchor="middle">
                  {getMessage({ ja: "抵抗+コンデンサ", language })}
                </text>
                <text x="640" y="105" fontSize="10" textAnchor="middle">10kΩ</text>
                <text x="640" y="120" fontSize="10" textAnchor="middle">0.1μF</text>
                <line x1="670" y1="130" x2="700" y2="130" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="705" cy="130" r="12" fill={colorMode === "light" ? "white" : "#1a202c"} stroke="currentColor" strokeWidth="1.6" />
                <text x="705" y="134" fontSize="9" textAnchor="middle">SW</text>
                <text x="705" y="160" fontSize="11" textAnchor="middle">
                  {getMessage({ ja: "右ボタン", language })}
                </text>

                {/* Reset switch, connected from the board's bottom edge */}
                <line x1="365" y1="228" x2="365" y2="250" stroke="currentColor" strokeWidth="1.4" />
                <line x1="395" y1="228" x2="395" y2="250" stroke="currentColor" strokeWidth="1.4" />
                <circle cx="380" cy="260" r="14" fill={colorMode === "light" ? "white" : "#1a202c"} stroke="currentColor" strokeWidth="1.6" />
                <line x1="365" y1="250" x2="371" y2="256" stroke="currentColor" strokeWidth="1.4" />
                <line x1="395" y1="250" x2="389" y2="256" stroke="currentColor" strokeWidth="1.4" />
                <text x="380" y="286" fontSize="11" textAnchor="middle">
                  {getMessage({ ja: "リセットスイッチ", language })}
                </text>
              </svg>
              <figcaption
                style={{
                  fontSize: "12px",
                  color: colorMode === "light" ? "#718096" : "#a0aec0",
                  marginTop: "8px",
                }}
              >
                {getMessage({
                  ja: "ソルダブルブレッドボード上でのおおまかな部品配置。中央にPro Microを縦向きに置き、上端のUSBコネクタは基板の外へ突き出してPCへつながる。左右対称にネジ式端子台・抵抗＋コンデンサ・ボタンをまとめ、Pro Micro下端のRESET/GNDピンからリセットスイッチへ接続する。",
                  language,
                })}
              </figcaption>
            </figure>
          </Box>
          <Text mt={3} fontSize="sm" color="gray.500">
            {getMessage({
              ja: "※ネジ式端子台を使うと、ボタンや配線材を基板にはんだ付けせずネジ止めだけで着脱できるようになり、配線のやり直しがしやすくなります。",
              language,
            })}
          </Text>
        </SectionBox>

        {/* 7. リセットスイッチ */}
        <SectionBox
          id="section7"
          title={
            "7." +
            getMessage({
              ja: "リセットスイッチについて",
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
              ja: "このPro Micro互換ボードでは、スケッチ（プログラム）を書き込むときに、ボードをUSBブートローダーモード（書き込み受付状態）にするため、RESETボタンを短時間に2回押す操作が必要になる場合があります。",
              language,
            })}
          </Text>
          <Text mt={3}>
            {getMessage({
              ja: "ボードに付属のRESETボタンが押しにくい場合は、外部から押しやすいように、リセット用のタクトスイッチを配線しておくと便利です。",
              language,
            })}
          </Text>
          <Text mt={3} fontWeight="bold">
            {getMessage({ ja: "接続方法", language })}
          </Text>
          <Text mt={1}>
            {getMessage({
              ja: "RESETピンとGNDピンの2つを、タクトスイッチで一時的に接続するだけです。スイッチを押すとRESETとGNDが接続され、マイコンがリセットされます。",
              language,
            })}
          </Text>
          <Box
            mt={3}
            p={3}
            borderRadius="md"
            bg={colorMode === "light" ? "green.50" : "green.900"}
            border="1px solid"
            borderColor={colorMode === "light" ? "green.200" : "green.700"}
          >
            <Text fontWeight="bold">
              {getMessage({ ja: "書き込みに失敗する場合", language })}
            </Text>
            <Text mt={2}>
              {getMessage({
                ja: "Arduino IDEでの書き込みが失敗する場合は、RESETスイッチを素早く2回（ダブルクリックのように）押してから、書き込みを開始してみてください。ボードがブートローダーモードに入り、書き込みができるようになることがあります。",
                language,
              })}
            </Text>
          </Box>
          <Text mt={3} fontSize="sm" color="gray.500">
            {getMessage({
              ja: "※この「RESET2回押し」の操作は、すべてのPro Micro互換ボードで必ず必要というわけではありません。ボードやブートローダーの種類によって動作が異なるため、まずは通常の書き込みを試し、失敗した場合の対処法として覚えておいてください。",
              language,
            })}
          </Text>
        </SectionBox>

        {/* 8. Arduino IDEの準備 */}
        <SectionBox
          id="section8"
          title={
            "8." +
            getMessage({
              ja: "Arduino IDEの準備",
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
              {getMessage({
                ja: "Arduino IDE（公式サイトから無料でダウンロードできる開発ソフト）をインストールします。",
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
                ja: "ATmega32U4を搭載したボードとして認識させます（詳しくは次項参照）。",
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
                ja: "「書き込みボタン（→アイコン）」をクリックして、コードをボードに書き込みます。",
                language,
              })}
            </ListItem>
          </OrderedList>

          <Text mt={4}>
            {getMessage({
              ja: "購入した互換ボードによって、Arduino IDE上での認識名や設定項目が「Arduino Micro」「Arduino Leonardo」「Pro Micro」など異なる場合があります。書き込みに失敗した場合は、以下のポイントを確認してください。",
              language,
            })}
          </Text>

          <Text mt={4} fontWeight="bold">
            {getMessage({ ja: "書き込みに失敗した場合の確認ポイント", language })}
          </Text>
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
            "9." +
            getMessage({
              ja: "使用するArduinoコード",
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
              ja: "以下のコードをArduino IDEに貼り付けて、ボードに書き込んでください。左ボタン（D2）を離すと左矢印キー、右ボタン（D4）を離すと右矢印キーがPCに送信されます。",
              language,
            })}
          </Text>
          <Text mt={2} fontSize="sm" color="gray.500">
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
            "10." +
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
