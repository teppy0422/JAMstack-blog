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
} from "@chakra-ui/react";

import Content from "../../components/content";
import ResponseCache from "next/dist/server/response-cache";
import { type } from "os";
import { now } from "lodash";

import { getRomaji, getHiragana } from "../../libs/romaji.js";

import Sushi_ootoro_wrap from "../../components/3d/sushi_ootoro_wrap";

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
  const [totalCost, setTotalCost] = useState(0); //トータル金額
  const [cost, setCost] = useState(0); //金額
  const inputTextRef = useRef(null); //入力欄
  const voucherOpenRef = useRef(null); //伝票を開くボタン
  const voucherCloseRef = useRef(null); //伝票を閉じるボタン

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
      }
      console.log({ matchCount });
    } else {
      //レンダー初回時だけ実行
      renderFlgRef.current = true;
      TimeUp();
      document.getElementById("type-input").focus();
      StartTotalTimer();
      console.log("初回だけ");
    }
  }, [inputText]);

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
    sound_BGM.current.currentTime = 0;
    sound_BGM.current.volume = 0.5;
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

    setTotalCost(0);
    StartTotalTimer();
    TimeUp();
  }
  //マウント時に一回だけ実行
  useEffect(() => {}, []);

  return (
    <Content>
      <VStack className={styles.typing}>
        <Grid
          templateAreas={`"nav main"
                  "nav footer"
                  "header header"`}
          gridTemplateRows={"40px 1fr 40px"}
          w="100%"
          h="80px"
          gap="1"
          color="blackAlpha.700"
          fontWeight="bold"
        >
          <GridItem pl="2" bg="pink.200" area={"nav"} ref={totalTimeRef}>
            {totalTime}
          </GridItem>
          <GridItem pl="2" bg="green.200" area={"main"} id="totalCost">
            トータル金額: {totalCost} 円
          </GridItem>
          <GridItem pl="2" bg="yellow.200" area={"footer"}>
            最高金額との比率
          </GridItem>
          <GridItem pl="2" area={"header"} id="timer" className={styles.timer}>
            <Center>timer</Center>
          </GridItem>
        </Grid>

        <Sushi_ootoro_wrap />

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
          <ModalBody>
            <Text>{totalCost}円</Text>
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
        <source src="http://www.hmix.net/music/n/n42.mp3" type="audio/mp3" />
      </audio>
    </Content>
  );
};

export default typing;
