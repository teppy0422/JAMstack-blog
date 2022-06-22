import React, { useEffect, useState, useRef } from "react";
import styles from "../../styles/home.module.scss";
import { Center, VStack, Box, Button, Grid, GridItem } from "@chakra-ui/react";

import Content from "../../components/content";
import ResponseCache from "next/dist/server/response-cache";
import { type } from "os";
import { now } from "lodash";

import { getRomaji, getHiragana } from "../../libs/romaji.js";

import Sushi_ootoro_wrap from "../../components/3d/sushi_ootoro_wrap";

const typing = () => {
  const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
  const [inputText, setInputText] = useState(""); //入力文字
  const [inputTextTemp, setInputTextTemp] = useState("");
  const [Q_Texts, setQ_Texts] = useState(""); //問題文
  const [A_romaji, setA_romaji] = useState(""); //答えローマ字
  const [correctCount, setCorrectCount] = useState(0);
  const renderFlgRef = useRef(false); //useEffectが初回走らせないフラグ
  const [timerID, setTimerID] = useState("");
  // 非同期処理
  function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
      .then((response) => response.json())
      .then((data) => data.content);
  }
  function soundMissed() {
    const missed = document.getElementById("missed");
    missed.volume = 0.5;
    missed.pause();
    missed.currentTime = 0;
    missed.play();
  }

  //入力毎のイベント
  useEffect(() => {
    if (renderFlgRef.current) {
      const sentenceArray = document
        .getElementById("type-display-hiragana")
        .querySelectorAll("span");

      const temp = getRomaji(Q_Texts.substring(0, 2));
      console.log("A_romaji: " + temp);

      // inputTextTempA = inputTextTempA + inputText.charAt(inputText.length - 1);
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
              console.log("sentenceArray.length: " + sentenceArray.length);
              console.log(index);
              if (index === sentenceArray.length - 1) {
                complete = true;
              }
            }
          });
          if (complete === true) {
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
        soundMissed();
      }
      console.log({ matchCount });

      // 処理を中断
      const test = true;
      if (test) {
        return;
      }

      switch (temp) {
        // 初回
        case "":
          console.log("");
          break;
        //入力候補がない場合
        case "notMore":
          console.log("notMore");
          document.getElementById("type-input").value = "";
          break;
        //入力候補がある場合
        case "More":
          console.log("More");
          break;
        //マッチした場合
        default:
          console.log("default");
          // 入力文字が正しい場合
          if (Q_Text.substr(0, temp.length) === temp) {
            setQ_Text(Q_Text.substr(temp.length));
            setCorrectCount(correctCount + temp.length);
            document.getElementById("type-input").value = "";
            sentenceArray.forEach((spans, index) => {
              if (index <= correctCount + temp.length - 1) {
                spans.style.color = "red";
                console.log("index: " + index);
                console.log("spans.length: " + spans.count);
              }
            });
          }
          break;
      }
      console.log("Q_Text: " + Q_Text.substr(temp.length));
      console.log("correctCount: " + correctCount + temp.length);

      // 処理を中断
      if (test) {
        return;
      }

      const inputTextSp = inputText.split("");
      console.log(inputTextSp);

      sentenceArray.forEach((spans, index) => {
        const inputTextTemp = inputTextSp[index];
        const correctText = spans.innerText.toUpperCase();
        if (inputTextTemp != null) {
          if (inputTextTemp !== undefined) {
            inputTextTemp = inputTextTemp.toUpperCase();
          }

          if (correctText == inputTextTemp) {
            console.log("correct");
            spans.style.color = "red";
            count = count + 1;
            console.log({ count });
          } else {
            spans.style.color = "black";
          }
        }
      });
    } else {
      //レンダー初回時だけ実行
      renderFlgRef.current = true;
      TimeUp();
      document.getElementById("type-input").focus();
    }
  }, [inputText]);

  // ランダムな文章を取得して表示
  async function RenderNextSentence() {
    const typeDisplay = document.getElementById("type-display");
    const typeDisplayHiragana = document.getElementById(
      "type-display-hiragana"
    );
    const typeDisplayRomaji = document.getElementById("type-display-romaji");
    const typeInput = document.getElementById("type-input");
    // console.log(typeInput);

    const Q = [
      ["トマト", "とまと"],
      ["ジャコウ猫", "じゃこうねこ"],
      ["しゃっくり", "しゃっくり"],
      ["ウィスキー", "うぃすきー"],
      ["とんかつ", "とんかつ"],
      ["もんじゃ焼き", "もんじゃやき"],
      ["カバ", "かば"],
      ["岡本の椅子", "おかもとのいす"],
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

    setCorrectCount(0);
  }

  // タイマー
  let startTime;
  let originTime = 60;

  function StartTimer() {
    const timer = document.getElementById("timer");
    timer.innerText = originTime;
    startTime = new Date();
    clearInterval(timerID);
    console.log({ timerID });
    const timerID_ = setInterval(() => {
      timer.innerText = originTime - getTimerTime();
      if (timer.innerText <= 0) TimeUp();
    }, 500);
    setTimerID(timerID_);
    console.log({ timerID });
  }

  function TimeUp() {
    RenderNextSentence();
    StartTimer();
  }

  function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
  }

  //マウント時に一回だけ実行
  useEffect(() => {}, []);

  const audioRef = useRef(null); // ref経由でaudio要素利用
  const spectrumRef = useRef(null); // ref経由でcanvas要素利用(スペクトラムアナライザ用)
  return (
    <Content>
      <audio controls id="missed">
        <source
          src="https://soundeffect-lab.info/sound/button/mp3/beep4.mp3"
          type="audio/mp3"
        />
      </audio>
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
          <GridItem pl="2" bg="pink.200" area={"nav"} id="totalTimer">
            総合残り時間
          </GridItem>
          <GridItem pl="2" bg="green.200" area={"main"}>
            トータル金額
          </GridItem>
          <GridItem pl="2" bg="yellow.200" area={"footer"}>
            ネタ名と金額
          </GridItem>
          <GridItem pl="2" area={"header"} id="timer" className={styles.timer}>
            <Center>timer</Center>
          </GridItem>
        </Grid>

        <Sushi_ootoro_wrap />
        <Box className={styles.container}>
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
            onChange={(e) => {
              setInputText(e.target.value);
            }}
          ></textarea>
        </Box>
      </VStack>
    </Content>
  );
};

export default typing;
