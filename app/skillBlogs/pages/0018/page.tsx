"use client";

import React, { useRef } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Divider,
  Avatar,
  Code,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import SectionBox from "../../components/SectionBox";
import Frame from "../../components/frame";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Code
    display="block"
    whiteSpace="pre"
    p={3}
    my={2}
    borderRadius="6px"
    fontSize="sm"
    overflowX="auto"
  >
    {children}
  </Code>
);

const BlogPage: React.FC = () => {
  const { language } = useLanguage();
  const { colorMode } = useColorMode();
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const borderColor = colorMode === "light" ? "black" : "white";

  return (
    <Frame sections={sections} sectionRefs={sectionRefs}>
      <Box w="100%">
        <HStack spacing={2} align="center" mb={1} ml={1}>
          <Avatar
            size="xs"
            src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
            borderWidth={1}
          />
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
            ja: "マイコンの使い方",
            us: "How to use the microcomputer",
            cn: "微机的使用方法",
            language,
          })}
        </Heading>
        <Text fontSize="sm" color={colorMode === "light" ? "gray.800" : "white"} mt={1}>
          {getMessage({ ja: "更新日", language })}:2026-08-24
        </Text>
        <Text fontSize="sm" mt={4}>
          {getMessage({
            ja: "Arduino Pro MicroがPCに認識されない場合の書き込み手順",
            language,
          })}
        </Text>
      </Box>

      <SectionBox
        id="section0"
        title={"0." + getMessage({ ja: "Arduino IDEを準備する", language })}
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>
            {getMessage({
              ja: "Arduino IDEをまだインストールしていない場合は、まずArduino公式サイトからArduino IDEをダウンロードしてインストールする。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "Arduino IDEをインストールしただけでは、SparkFun Pro Microがボード一覧に表示されない場合がある。その場合は、SparkFunのボード定義（SparkFun AVR Boards）を追加でインストールする。",
              language,
            })}
          </Text>

          <Heading size="sm" mt={4} mb={1}>
            {getMessage({ ja: "SparkFun Pro Microを追加する", language })}
          </Heading>
          <Text>
            {getMessage({
              ja: "Arduino IDEで、以下を開く。",
              language,
            })}
          </Text>
          <CodeBlock>{`Arduino IDE
↓
設定（Preferences）
↓
Additional Boards Manager URLs`}</CodeBlock>

          <Text>
            {getMessage({ ja: "以下のURLを追加する。", language })}
          </Text>
          <CodeBlock>{`https://raw.githubusercontent.com/sparkfun/Arduino_Boards/main/IDE_Board_Manager/package_sparkfun_index.json`}</CodeBlock>

          <Text>
            {getMessage({
              ja: "複数のURLがすでに登録されている場合は、既存のURLを消さずに別の行へ追加する。",
              language,
            })}
          </Text>

          <Text mt={2}>{getMessage({ ja: "その後、", language })}</Text>
          <CodeBlock>{`ツール
↓
ボード
↓
ボードマネージャ`}</CodeBlock>

          <Text>
            {getMessage({ ja: "を開き、検索欄に", language })}
          </Text>
          <CodeBlock>{`SparkFun`}</CodeBlock>
          <Text>{getMessage({ ja: "と入力する。", language })}</Text>
          <Text mt={2}>
            {getMessage({
              ja: "表示されたSparkFun AVR Boardsをインストールする。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "インストールが完了すると、ボード一覧からSparkFun Pro Microを選択できるようになる。SparkFun公式の手順でも、このボード定義をBoard Managerからインストールする方法が案内されている。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section1"
        title={"1." + getMessage({ ja: "使用しているマイコン", language })}
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>
            {getMessage({
              ja: "使用するボードは、以前使用したものと同じ Arduino Pro Micro系（ATmega32U4）。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "このマイコンはUSBキーボードとしてPCに認識させることができる。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "今回の用途では、PCに接続したときに任意のキーボードのキー入力を送信するマイコンとして使用する。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section2"
        title={"2." + getMessage({ ja: "Arduino IDEの設定", language })}
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>{getMessage({ ja: "Arduino IDEを起動する。", language })}</Text>

          <Heading size="sm" mt={4} mb={1}>
            {getMessage({ ja: "ボード", language })}
          </Heading>
          <Text>{getMessage({ ja: "以下を選択する。", language })}</Text>
          <CodeBlock>{`ツール
↓
ボード
↓
SparkFun Pro Micro`}</CodeBlock>

          <Heading size="sm" mt={4} mb={1}>
            {getMessage({ ja: "プロセッサ", language })}
          </Heading>
          <Text>
            {getMessage({
              ja: "使用しているPro Microが5V / 16MHzタイプの場合、",
              language,
            })}
          </Text>
          <CodeBlock>{`ATmega32U4 (5V, 16MHz)`}</CodeBlock>
          <Text>{getMessage({ ja: "を選択する。", language })}</Text>
          <Text mt={2} fontSize="sm" color="gray.500">
            {getMessage({
              ja: "※3.3V / 8MHzタイプの場合は設定が異なるので、基板の仕様を確認する。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section3"
        title={"3." + getMessage({ ja: "USBケーブルを確認", language })}
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>
            {getMessage({
              ja: "PCとPro MicroをUSBケーブルで接続する。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "ここで重要なのは、データ通信可能なUSBケーブルを使用すること。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "充電専用USBケーブルでは、PCからマイコンを認識できない。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section4"
        title={
          "4." +
          getMessage({ ja: "Pro Microが通常状態で認識されない場合", language })
        }
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>
            {getMessage({
              ja: "Pro Micro（ATmega32U4）は、スケッチの状態によってUSBデバイスとして正常に認識されなくなることがある。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "この場合は、基板上のRSTとGNDを使って強制的にリセットし、短時間だけ存在するブートローダーモードに入れる。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section5"
        title={
          "5." + getMessage({ ja: "RSTとGNDを2回接触させる", language })
        }
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>
            {getMessage({ ja: "基板上のRST、GNDを利用する。", language })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "以下のように素早く2回接触させる。",
              language,
            })}
          </Text>
          <CodeBlock>{`RST ─┐
     ├─ 接触 → 離す
GND ─┘

     ↓

RST ─┐
     ├─ 接触 → 離す
GND ─┘`}</CodeBlock>
          <Text>
            {getMessage({ ja: "つまり、「チョン、チョン」", language })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "と2回RSTをGNDに落とす。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "この操作によって、Pro Microがブートローダーモードに入る。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section6"
        title={"6." + getMessage({ ja: "ブートローダー中のCOMポート", language })}
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>
            {getMessage({
              ja: "RSTを2回操作すると、Pro Microは数秒間だけ別のCOMポートとしてPCに認識されることがある。",
              language,
            })}
          </Text>
          <Text mt={2}>{getMessage({ ja: "例えば、", language })}</Text>
          <CodeBlock>{`通常時
COM5

↓ RSTを2回

ブートローダー
COM7`}</CodeBlock>
          <Text>
            {getMessage({
              ja: "のようにポート番号が変わることがある。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "この短時間だけ出現するCOMポートが書き込みに使用される。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section7"
        title={"7." + getMessage({ ja: "書き込み方法", language })}
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>{getMessage({ ja: "基本的には以下の流れ。", language })}</Text>
          <CodeBlock>{`① Pro MicroをUSB接続
        ↓
② Arduino IDEでスケッチを開く
        ↓
③ ボードを「SparkFun Pro Micro」に設定
        ↓
④ プロセッサを正しく設定
        ↓
⑤ 「アップロード」をクリック
        ↓
⑥ アップロード開始直後にRSTとGNDを2回接触
        ↓
⑦ ブートローダーが起動
        ↓
⑧ Arduino IDEがブートローダーへ書き込み`}</CodeBlock>
          <Text>
            {getMessage({
              ja: "重要なのは、RSTを2回接触させるタイミング。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "ブートローダーは長時間起動しているわけではなく、短時間で通常状態に戻るため、アップロードのタイミングに合わせて操作する。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section8"
        title={
          "8." +
          getMessage({
            ja: "Arduino Pro Microをキーボードとして使用する",
            language,
          })
        }
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>
            {getMessage({
              ja: "Pro MicroはATmega32U4を搭載しているため、Arduinoの",
              language,
            })}
          </Text>
          <CodeBlock>{`#include <Keyboard.h>`}</CodeBlock>
          <Text>
            {getMessage({
              ja: "を使用して、PCにキーボード入力を送信できる。",
              language,
            })}
          </Text>
          <Text mt={2}>{getMessage({ ja: "例えば、", language })}</Text>
          <CodeBlock>{`#include <Keyboard.h>

void setup() {
  Keyboard.begin();
}

void loop() {
  Keyboard.write(KEY_LEFT_ARROW);
  delay(1000);

  Keyboard.write(KEY_RIGHT_ARROW);
  delay(1000);
}`}</CodeBlock>
          <Text>
            {getMessage({
              ja: "とすると、PCに指定したキー入力を送信できる。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "実際の用途では、外部スイッチなどを接続して、スイッチを押したときだけ任意のキーボードのキーを送信する。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section9"
        title={
          "9." +
          getMessage({
            ja: "外部スイッチを安定して読み取るための回路",
            language,
          })
        }
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>
            {getMessage({
              ja: "外部スイッチを接続する場合は、10kΩの外部プルアップ抵抗と0.1μF（100nF）のコンデンサを使用して、入力を安定させる。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({ ja: "基本的な構成は以下の通り。", language })}
          </Text>
          <CodeBlock>{`+5V
 │
10kΩ
 │
 ├──────── Arduinoの入力ピン
 │
 0.1μF
 │
GND`}</CodeBlock>
          <Text>
            {getMessage({
              ja: "スイッチを使用する場合は、入力ピンとGNDの間にスイッチを接続する。",
              language,
            })}
          </Text>
          <CodeBlock>{`+5V
 │
10kΩ
 │
 ├──────── 入力ピン
 │             │
 │          スイッチ
 │             │
 │            GND
 │
0.1μF
 │
GND`}</CodeBlock>
          <Text>
            {getMessage({
              ja: "この構成では、スイッチを押していないときは10kΩによって入力をHIGHに保持し、スイッチを押すと入力がGNDにつながってLOWになる。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "0.1μFのコンデンサは入力の急激な変化を緩和し、スイッチのチャタリングや外部からのノイズによる誤入力を抑える目的で使用する。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "特にスイッチまでの配線が長い場合は、入力信号が外部ノイズの影響を受けやすくなるため、この外部抵抗＋コンデンサの構成が有効。",
              language,
            })}
          </Text>
          <Text mt={2} fontSize="sm" color="gray.500">
            {getMessage({
              ja: "※この構成では外部10kΩプルアップ抵抗を使用するため、Arduinoのinput_pullupを併用する必要はない。入力ピンはinputとして設定する。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section10"
        title={
          "10." + getMessage({ ja: "認識されない場合の確認ポイント", language })
        }
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Heading size="sm" mt={2} mb={1}>
            {getMessage({ ja: "USBケーブル", language })}
          </Heading>
          <Text>{getMessage({ ja: "最初に確認する。", language })}</Text>
          <CodeBlock>{`データ通信対応USBケーブル`}</CodeBlock>
          <Text>{getMessage({ ja: "を使用する。", language })}</Text>
          <Text mt={2}>
            {getMessage({
              ja: "充電専用ケーブルでは認識できない。",
              language,
            })}
          </Text>

          <Heading size="sm" mt={4} mb={1}>
            {getMessage({ ja: "ボード設定", language })}
          </Heading>
          <Text>{getMessage({ ja: "Arduino IDEで、", language })}</Text>
          <CodeBlock>{`SparkFun Pro Micro`}</CodeBlock>
          <Text>
            {getMessage({ ja: "が選択されているか確認する。", language })}
          </Text>
          <Text mt={2}>{getMessage({ ja: "さらに、", language })}</Text>
          <CodeBlock>{`ATmega32U4 (5V, 16MHz)`}</CodeBlock>
          <Text>
            {getMessage({
              ja: "など、実際の基板に合ったプロセッサ設定になっているか確認する。",
              language,
            })}
          </Text>

          <Heading size="sm" mt={4} mb={1}>
            {getMessage({ ja: "COMポート", language })}
          </Heading>
          <Text>
            {getMessage({
              ja: "RSTを2回接触した直後に、WindowsのデバイスマネージャーやArduino IDEのポート一覧を確認する。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "通常時とは異なるCOMポートが一時的に表示される場合がある。",
              language,
            })}
          </Text>

          <Heading size="sm" mt={4} mb={1}>
            {getMessage({ ja: "RSTの操作", language })}
          </Heading>
          <Text>{getMessage({ ja: "RSTとGNDを、", language })}</Text>
          <CodeBlock>{`接触 → 離す → 接触 → 離す`}</CodeBlock>
          <Text>
            {getMessage({ ja: "と短時間に2回行う。", language })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "1回だけではブートローダーに入らない場合がある。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>

      <SectionBox
        id="section11"
        title={"11." + getMessage({ ja: "最も重要なポイント", language })}
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={borderColor} />
        <Box ml={4}>
          <Text>
            {getMessage({
              ja: "Pro Microが「壊れていて認識されない」とは限らない。",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "ATmega32U4搭載ボードでは、USBを担当するプログラムが正常に動作していない場合でも、ブートローダーを起動して再書き込みできる場合がある。",
              language,
            })}
          </Text>
          <Text mt={2}>{getMessage({ ja: "そのため、", language })}</Text>
          <Text mt={2} fontWeight="bold">
            {getMessage({
              ja: "「通常のCOMポートとして認識されない → RSTとGNDを2回接触 → ブートローダー用COMポートが一時的に出現 → そのタイミングで書き込む」",
              language,
            })}
          </Text>
          <Text mt={2}>
            {getMessage({
              ja: "という手順をまず試す。",
              language,
            })}
          </Text>

          <Heading size="sm" mt={4} mb={1}>
            {getMessage({ ja: "今回の作業での基本手順", language })}
          </Heading>
          <Text>
            {getMessage({
              ja: "最終的には以下だけ覚えておけばよい。",
              language,
            })}
          </Text>
          <CodeBlock>{`USB接続
 ↓
Arduino IDE
 ↓
SparkFun Pro Micro
 ↓
ATmega32U4 (5V, 16MHz)
 ↓
アップロード
 ↓
RST → GND を素早く2回
 ↓
ブートローダー起動
 ↓
書き込み`}</CodeBlock>
          <Text mt={2} fontSize="sm" color="gray.500">
            {getMessage({
              ja: "※実際のPro Microの電圧・クロック仕様は、基板の種類によって異なるため、基板に記載された仕様を優先する。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>
    </Frame>
  );
};

export default BlogPage;
