import React, { useEffect, useState } from "react";
import styles from "../../styles/home.module.scss";
import { Center, VStack, Box } from "@chakra-ui/react";

import Content from "../../components/content";
import ResponseCache from "next/dist/server/response-cache";
import { type } from "os";

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
    const typeValue = inputText.split("");
    // console.log(typeValue);
    sentenceArray.forEach((characterSpan, index) => {
      const textType = characterSpan.innerText.toUpperCase();
      const correctType = typeValue[index];

      if (correctType !== undefined) {
        correctType = correctType.toUpperCase();
      }

      console.log(correctType);

      if (textType == correctType) {
        console.log("correct");
        characterSpan.style.color = "red";
      } else {
        characterSpan.style.color = "black";
      }
    });
  }, [inputText]);

  // ランダムな文章を取得して表示
  async function RenderNextSentence() {
    const typeDisplay = document.getElementById("type-display");
    const typeInput = document.getElementById("type-input");

    const sentence = await GetRandomSentence();
    console.log(sentence);
    // typeDisplay.innerText = sentence;
    // 文章を一文字ずつ分解してspanタグを生成
    let oneText = sentence.split("");
    console.log(oneText);
    oneText.forEach((character) => {
      const characterSpan = document.createElement("span");
      characterSpan.innerText = character;
      console.log(characterSpan);
      typeDisplay.appendChild(characterSpan);
      characterSpan.classList.add("correct");
    });
    // テキストボックスの値を削除
    typeInput.innerText = "";
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
