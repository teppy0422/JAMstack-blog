import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/home.module.scss";
import {
  Center,
  VStack,
  Box,
  Button,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import Content from "../../components/content";
import ResponseCache from "next/dist/server/response-cache";
import { type } from "os";
import { now } from "lodash";

import { getRomaji, getHiragana } from "../../libs/romaji.js";

import Sushi_tamago_wrap from "../../components/3d/sushi_tamago_wrap2";

const typing = () => {
  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="80%"
      backdropBlur="2px"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen2, onOpen2, onClose2 } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayTwo />);

  const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
  const [inputText, setInputText] = useState(""); //入力文字
  const [Q_Texts, setQ_Texts] = useState(""); //問題文
  const [correctCount, setCorrectCount] = useState(0);
  const renderFlgRef = useRef(false); //useEffectを初回走らせないフラグ
  const timerIDref = useRef(""); //タイマーリセット用のID
  const totalTimerIDref = useRef(""); //トータルタイマーリセット用のID
  const [totalTime, setTotalTime] = useState(100); //トータルタイムの値
  const totalTimeRef = useRef(null); //トータルタイム
  const [missedCount, setMissedCount] = useState(0); //タイプミス回数
  const [totalCost, setTotalCost] = useState(0); //トータル金額
  const [cost, setCost] = useState(0); //金額
  const inputTextRef = useRef(null); //入力欄
  const voucherOpenRef = useRef(null); //伝票を開くボタン
  const voucherCloseRef = useRef(null); //伝票を閉じるボタン
  const startMenuRef = useRef(null); //スタートメニュー

  const sound_BGM = useRef(null); //BGM

  // 非同期処理
  function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
      .then((response) => response.json())
      .then((data) => data.content);
  }
  function sound(id) {
    const sound = document.getElementById(id);
    sound.volume = 0.6;
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

  useEffect(() => {
    if (totalTime <= 15) {
      sound_BGM.current.playbackRate = 1.25;
    }
    if (totalTime <= 10) {
      sound_BGM.current.playbackRate = 1.5;
    }
  }, [totalTime]);

  // 入力方法変更
  function keypress_ivent(e) {
    console.log("keypress: " + e.key);
    return false;
  }
  function keyup_ivent(e) {
    console.log("keyup: " + e.key);
    return false;
  }

  //入力毎のイベント
  useEffect(() => {
    if (renderFlgRef.current) {
      const sentenceArray = document
        .getElementById("type-display-hiragana")
        .querySelectorAll("span");

      const temp = getRomaji(Q_Texts.substring(0, 2));
      console.log("A_romaji: " + temp);

      const inputTextTempA = inputText;
      console.log({ inputTextTempA });

      const matchCount = 0;
      const complete = false;
      //正否チェック
      for (let key in temp) {
        //完全に一致
        if (temp[key] === inputTextTempA) {
          console.log("完全に一致");
          const tempp = getHiragana(inputTextTempA);
          setQ_Texts(Q_Texts.substring(tempp.length));
          setCorrectCount(correctCount + tempp.length);
          matchCount = 1;
          //文字色を変える
          sentenceArray.forEach((spans, index) => {
            if (index <= correctCount + tempp.length - 1) {
              spans.style.color = "red";
              if (index === sentenceArray.length - 1) {
                complete = true;
              }
            }
          });
          if (complete === true) {
            setTotalCost(Number(totalCost) + Number(cost));
            sound("success");
            TimeUp();
          }
          document.getElementById("type-input").value = "";
          break;
        }
        //部分一致
        if (temp[key].startsWith(inputTextTempA, 0)) {
          matchCount = matchCount + 1;
          break;
        }
      }
      //一致しない
      if (matchCount === 0) {
        document.getElementById("type-input").value = "";
        sound("missed");
        setMissedCount(missedCount + 1);
      }
      console.log({ matchCount });
    } else {
      //レンダー初回時だけ実行
      console.log("初回だけ");
      renderFlgRef.current = true;
      //入力イベント
      // document.addEventListener("keypress", keypress_ivent);
      // document.addEventListener("keyup", keyup_ivent);
      //全てのロードが終わったら
      window.addEventListener("load", loadEnd);
    }
  }, [inputText]);

  function loadEnd() {
    startMenuRef.current.style.display = "block";
  }

  // ランダムな文章を取得して表示
  async function RenderNextSentence() {
    const cost = document.getElementById("cost");
    const typeDisplay = document.getElementById("type-display");
    const typeDisplayHiragana = document.getElementById(
      "type-display-hiragana"
    );
    const typeDisplayRomaji = document.getElementById("type-display-romaji");

    const Q = [
      ["トマト", "とまと", "100"],
      ["ジャコウ猫", "じゃこうねこ", "200"],
      ["しゃっくり", "しゃっくり", "200"],
      ["ウィスキー", "うぃすきー", "200"],
      ["とんかつ", "とんかつ", "100"],
      ["もんじゃ焼き", "もんじゃやき", "200"],
      ["カバ", "かば", "100"],
      ["岡本の椅子", "おかもとのいす", "200"],
      ["直島がおすすめ", "なおしまがおすすめ", "200"],
      ["彷彿させる", "ほうふつさせる", "200"],
      ["真夏のホラーゲーム", "まなつのほらーげーむ", "300"],
      ["沢田マンション", "さわだまんしょん", "250"],
      ["よろしくお願いします", "よろしくおねがいします", "150"],
      ["この機能は使えない", "このきのうはつかえない", "150"],
      ["タイピングの練習", "たいぴんぐのれんしゅう", "200"],
      ["ウィンナーは水で焼く", "うぃんなーはみずでやく", "250"],
    ];
    let Q_No = Math.floor(Math.random() * Q.length); //問題をランダムで出題する

    typeDisplay.innerText = "";
    typeDisplayHiragana.innerText = "";
    typeDisplayRomaji.innerText = "";
    // 文章を一文字ずつ分解してspanタグを生成
    let oneText = Q[Q_No][0].split("");
    oneText.forEach((character) => {
      const characterSpan = document.createElement("span");
      characterSpan.innerText = character;
      // console.log(characterSpan);
      typeDisplay.appendChild(characterSpan);
    });
    // 文章を一文字ずつ分解してspanタグを生成_ひらがな
    let oneTextHiragana = Q[Q_No][1].split("");
    oneTextHiragana.forEach((character) => {
      const characterSpan = document.createElement("span");
      characterSpan.innerText = character;
      // console.log(characterSpan);
      typeDisplayHiragana.appendChild(characterSpan);
    });
    // 問題のセット
    setQ_Texts(Q[Q_No][1]);
    // コストのセット
    setCost(Q[Q_No][2]);

    setCorrectCount(0);
  }

  // タイマー_ワード毎
  let startTime;
  let itemTime = 10;
  function StartTimer() {
    const timer = document.getElementById("timer");
    timer.innerText = itemTime;
    startTime = new Date();
    clearInterval(timerIDref.current);
    console.log(timerIDref.current);
    const timerID_ = setInterval(() => {
      timer.innerText = itemTime - getTimerTime(startTime);
      if (timer.innerText <= 0) TimeUp();
    }, 500);
    timerIDref.current = timerID_;
    console.log(timerIDref.current);
  }
  function TimeUp() {
    RenderNextSentence();
    StartTimer();
  }
  function getTimerTime(t) {
    return Math.floor((new Date() - t) / 1000);
  }

  //タイマー_トータル
  function StartTotalTimer() {
    let totalStartTime;
    let totalTime_origin = 30;
    sound_BGM.current.pause();
    sound_BGM.current.currentTime = 0;
    sound_BGM.current.playbackRate = 1;
    sound_BGM.current.volume = 0.1;
    sound_BGM.current.play();

    // totalTimeRef.current.innerText = totalTime_origin;
    setTotalTime(totalTime_origin);
    totalStartTime = new Date();
    clearInterval(totalTimerIDref.current);
    const totalTimerID_ = setInterval(() => {
      setTotalTime(totalTime_origin - getTimerTime(totalStartTime));
      console.log("totalTime: " + totalTimeRef.current.innerText);
      if (totalTimeRef.current.innerText <= 0) {
        clearInterval(totalTimerIDref.current);
        gameOver();
      }
    }, 500);
    totalTimerIDref.current = totalTimerID_;
    console.log("初回のstartotaltime?:" + totalTimerID_);
  }
  //ゲームオーバー
  function gameOver() {
    document.getElementById("type-input").disabled = true;
    clearInterval(timerIDref.current);
    clearInterval(totalTimerIDref.current);
    voucherOpenRef.current.click();
    sound_BGM.current.pause();
    sound("finish");
  }
  //リプレイ
  function gameReplay() {
    document.getElementById("type-input").disabled = false;
    inputTextRef.current.value = "";
    inputTextRef.current.focus();
    setMissedCount(0);
    setTotalCost(0);
    StartTotalTimer();
    TimeUp();
  }
  //マウント時に一回だけ実行
  useEffect(() => {}, []);

  return (
    <Content style={{ position: "relative" }}>
      <VStack className={styles.typing}>
        <Grid
          templateAreas={`"nav main"
                  "nav footer"
                  "header header"`}
          gridTemplateRows={"64px 1fr 40px"}
          w="100%"
          h="80px"
          gap="1"
          color="blackAlpha.700"
          fontWeight="bold"
        >
          <GridItem pl="2" bg="pink.200" area={"nav"}>
            <StatGroup>
              <Stat>
                <StatLabel>残り時間</StatLabel>
                <StatNumber ref={totalTimeRef}>{totalTime}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23.36%
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>タイプミス</StatLabel>
                <StatNumber>{missedCount}</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  9.05%
                </StatHelpText>
              </Stat>
            </StatGroup>
          </GridItem>
          <GridItem pl="2" bg="green.200" area={"main"} id="totalCost">
            <StatGroup>
              <Stat>
                <StatLabel>トータル金額</StatLabel>
                <StatNumber
                  mr={1.5}
                  style={{ textAlign: "right", fontSize: "24px" }}
                >
                  {totalCost}円
                </StatNumber>
              </Stat>
            </StatGroup>
          </GridItem>
          <GridItem area={"footer"} style={{ position: "relative" }}>
            <Progress colorScheme="green" hasStripe value={64} h="24px" />
            <Text
              style={{ position: "absolute", top: "0", left: "8px" }}
              color="white.800"
              fontSize="14px"
            >
              特別なナニカ
            </Text>
          </GridItem>
          <GridItem pl="2" area={"header"} id="timer" className={styles.timer}>
            <Center>timer</Center>
          </GridItem>
        </Grid>

        <Sushi_tamago_wrap />

        <Center id="cost" className={styles.cost}>
          {cost}
        </Center>

        <Box className={styles.container} w="100%">
          <Center className={styles.typeDisplay} id="type-display"></Center>
          <Center
            className={styles.typeDisplayHiragana}
            id="type-display-hiragana"
          ></Center>
          <div
            className={styles.typeDisplayRomaji}
            id="type-display-romaji"
          ></div>
          <textarea
            className={styles.typeInput}
            id="type-input"
            ref={inputTextRef}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          ></textarea>
        </Box>
      </VStack>
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
            <Center>{totalCost}円</Center>
            <Center>ミス:{missedCount}回</Center>
          </ModalBody>
          <ModalFooter py={4}>
            <Button
              mr={2}
              onClick={(e) => {
                voucherCloseRef.current.click();
                setTimeout(gameReplay, 500);
              }}
            >
              もう一度プレイする
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

      <Tabs
        defaultIndex={2}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          display: "none",
        }}
        colorScheme="white"
        bgColor="white"
        borderRadius={6}
        p={8}
        ref={startMenuRef}
      >
        <TabList>
          <Tab>自宅</Tab>
          <Tab>村の寿司屋</Tab>
          <Tab>高級店</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Center>制限時間:60秒</Center>
            <Center> ランキング登録不可能</Center>
            <Center>まだ作ってないよ</Center>
          </TabPanel>
          <TabPanel>
            <Center>制限時間:80秒</Center>
            <Center> ランキング登録不可能</Center>
            <Center>まだ作ってないよ</Center>
          </TabPanel>
          <TabPanel>
            <Center>制限時間:100秒</Center>
            <Center> ランキング登録可能</Center>
            <Center>
              <Button
                mt={6}
                p={3}
                onClick={(e) => {
                  gameReplay();
                  startMenuRef.current.style.display = "none";
                }}
              >
                START
                <br />
                [Enter]
              </Button>
            </Center>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <audio
        controls
        id="missed"
        style={{ display: "inline-block", width: "100px" }}
      >
        <source
          src="https://soundeffect-lab.info/sound/button/mp3/beep4.mp3"
          type="audio/mp3"
        />
      </audio>
      <audio
        controls
        id="success"
        style={{ display: "inline-block", width: "100px" }}
      >
        <source
          src="https://soundeffect-lab.info/sound/button/mp3/decision40.mp3"
          type="audio/mp3"
        />
      </audio>
      <audio
        controls
        id="finish"
        style={{ display: "inline-block", width: "100px" }}
      >
        <source
          src="https://soundeffect-lab.info/sound/anime/mp3/roll-finish1.mp3"
          type="audio/mp3"
        />
      </audio>
      <audio
        controls
        id="bgm"
        ref={sound_BGM}
        style={{ display: "inline-block", width: "100px" }}
      >
        <source
          src="https://music.storyinvention.com/wp-content/uploads/kutsurogi-koto.mp3"
          type="audio/mp3"
        />
      </audio>
    </Content>
  );
};

export default typing;
