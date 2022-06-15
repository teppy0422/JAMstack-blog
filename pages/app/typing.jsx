import React, { useEffect, useState } from "react";
import styles from "../../styles/home.module.scss";
import { Center, VStack, Box } from "@chakra-ui/react";

import Content from "../../components/content";
import ResponseCache from "next/dist/server/response-cache";
import { type } from "os";
import { now } from "lodash";

const typing = () => {
  const [inputText, setInputText] = useState("");

  const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
  // 非同期処理
  function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
      .then((response) => response.json())
      .then((data) => data.content);
  }
  // inputテキスト入力が合っているかどうかの判定
  useEffect(() => {
    // console.log(inputText);
    const sentenceArray = document
      .getElementById("type-display")
      .querySelectorAll("span");
    // console.log(sentenceArray);
    const inputTextSp = inputText.split("");
    // console.log(inputTextSp);
    sentenceArray.forEach((spans, index) => {
      const inputTextTemp = inputTextSp[index];
      const correctText = spans.innerText.toUpperCase();
      if (inputTextTemp != null) {
        if (inputTextTemp !== undefined) {
          inputTextTemp = inputTextTemp.toUpperCase();
        }

        console.log(inputTextTemp);

        if (correctText == inputTextTemp) {
          console.log("correct");
          spans.style.color = "red";
        } else {
          spans.style.color = "black";
        }
      }
    });
  }, [inputText]);

  // ランダムな文章を取得して表示
  async function RenderNextSentence() {
    const typeDisplay = document.getElementById("type-display");
    const typeInput = document.getElementById("type-input");
    console.log(typeInput);

    const sentence = await GetRandomSentence();
    console.log(sentence);
    // typeDisplay.innerText = sentence;
    // 文章を一文字ずつ分解してspanタグを生成
    let oneText = sentence.split("");
    // console.log(oneText);
    typeDisplay.innerText = "";
    oneText.forEach((character) => {
      const characterSpan = document.createElement("span");
      characterSpan.innerText = character;
      console.log(characterSpan);
      typeDisplay.appendChild(characterSpan);
      // characterSpan.classList.add("correct");
    });
    // テキストボックスの値を削除
    typeInput.value = "";

    StartTimer();
  }

  let startTime;
  let originTime = 10;
  function StartTimer() {
    const timer = document.getElementById("timer");
    timer.innerText = originTime;
    startTime = new Date();
    // console.log(startTime);
    setInterval(() => {
      timer.innerText = originTime - getTimerTime();
      if (timer.innerText <= 0) TimeUp();
    }, 1000);
  }

  function TimeUp() {
    RenderNextSentence();
    StartTimer();
  }

  function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
  }

  //マウント時に一回だけ実行
  useEffect(() => {
    RenderNextSentence();
    document.getElementById("type-input").focus();
  }, []);

  return (
    <Content>
      <VStack className={styles.typing}>
        <div className={styles.timer} id="timer">
          0
        </div>
        <Box className={styles.container}>
          <div className={styles.typeDisplay} id="type-display"></div>
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
