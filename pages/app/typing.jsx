import React, { useEffect, useState } from "react";
import styles from "../../styles/home.module.scss";
import { Center, VStack, Box } from "@chakra-ui/react";

import Content from "../../components/content";
import ResponseCache from "next/dist/server/response-cache";
import { type } from "os";
import { now } from "lodash";

import { romaji } from "../../libs/romaji.js";

const typing = () => {
  const [inputText, setInputText] = useState("");
  const [inputTextTemp, setInputTextTemp] = useState("");
  const [Q_Text, setQ_Text] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
  let inputTextTempA = "";
  // 非同期処理
  function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
      .then((response) => response.json())
      .then((data) => data.content);
  }

  //入力毎のイベント
  useEffect(() => {
    const sentenceArray = document
      .getElementById("type-display-hiragana")
      .querySelectorAll("span");

    console.log({ inputText });

    inputTextTempA = inputTextTempA + inputText.charAt(inputText.length - 1);

    console.log({ inputTextTempA });

    var temp = romaji(inputText);

    console.log({ temp });

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
            // console.log(index);
            if (index <= correctCount + temp.length - 1) {
              spans.style.color = "red";
            }
          });
        }
        break;
    }
    console.log("Q_Text: " + Q_Text.substr(temp.length));
    console.log("correctCount: " + correctCount + temp.length);

    // 処理を中断
    const test = true;
    if (test) {
      return;
    }

    console.log("return");

    const inputTextSp = inputText.split("");
    console.log(inputTextSp);

    sentenceArray.forEach((spans, index) => {
      const inputTextTemp = inputTextSp[index];
      const correctText = spans.innerText.toUpperCase();
      if (inputTextTemp != null) {
        if (inputTextTemp !== undefined) {
          inputTextTemp = inputTextTemp.toUpperCase();
        }

        // console.log(inputTextTemp);

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
  }, [inputText]);

  // ランダムな文章を取得して表示
  async function RenderNextSentence() {
    const typeDisplay = document.getElementById("type-display");
    const typeDisplayHiragana = document.getElementById(
      "type-display-hiragana"
    );
    const typeInput = document.getElementById("type-input");
    // console.log(typeInput);

    const Q = [
      [
        "他者と比較するのではなく、過去の自分と比較する",
        "たしゃとひかくするのではなく、かこのじぶんとひかくする",
      ],
      [
        "祝福は苦悩の仮面をかぶって訪れる",
        "しゅくふくはくのうのかめんをかぶっておとずれる",
      ],
      [
        "自分はいま幸福かと自分の胸に問うてみれば、とたんに幸福ではなくなってしまう",
        "じぶんはいまこうふくかとじぶんのむねにとうてみれば、とたんにこうふくではなくなってしまう",
      ],
      [
        "常識とは１８歳までに身に付けた偏見のコレクションのことを言う",
        "じょうしきとは１８さいまでにみにつけたへんけんのこれくしょんのことをいう",
      ],
      [
        "偉大な功績はどれも、かつては不可能だと考えられていた",
        "いだいなこうせきはどれも、かつてはふかのうだとかんがえられていた",
      ],
      [
        "あなたが転んでしまったことに関心はない。そこから立ち上がることに関心があるのだ",
        "あなたがころんでしまったことにかんしんはない、そこからたちあげることにかんしんがあるのだ",
      ],
      [
        "成功する方法は、たった一つだ。成功するまで、失敗し続けることだ",
        "せいこうするほうほうは、たったひとつだ。せいこうするまで、しっぱいしつづけることだ",
      ],
      [
        "人は他人から教わるのはきらいだけど，他人から学ぶのは好き",
        "ひとはたにんからおそわるのはきらいだけど、たにんからまなぶのはすき",
      ],
      [
        "根本的な才能とは、自分に何かが出来ると信じることだ",
        "こんぽんてきなさいのうとは、じぶんになにかができるとしんじることだ",
      ],
      [
        "自分の今行っていること、行ったことを心から楽しめる者は幸福である",
        "じぶんのいまおこなっていること、おこなったことをこころからたのしめるものはこうふくである",
      ],
      [
        "老いとは好奇心を失うことである",
        "おいとはこうきしんをうしなうことである",
      ],
      [
        "物事を難しく複雑にしているのは、自分自身なのかもしれない",
        "ものごとをむつかしくふくざつにしているのは、じぶんじしんなのかもしれない",
      ],
      [
        "なれなかった自分になるのに、遅すぎることはない",
        "なれなかったじぶんになるのに、おそすぎることはない",
      ],
      ["やってはいけないことをやってみる", "やってはいけないことをやってみる"],
      [
        "中途半端にやると他人のマネになる。とことんやると他人がマネできないものになる",
        "ちゅうとはんぱにやるとたにんのまねになる。とこんやるとたにんがまねできないものになる",
      ],
    ];
    // console.log(Q);
    let Q_No = Math.floor(Math.random() * Q.length); //問題をランダムで出題する

    // console.log(Q[Q_No][0]);
    // console.log(Q[Q_No][1]);

    typeDisplay.innerText = "";
    typeDisplayHiragana.innerText = "";
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
    setQ_Text(Q[Q_No][1]);
    // テキストボックスの値を削除
    typeInput.value = "";

    StartTimer();
  }

  let startTime;
  let originTime = 300;
  function StartTimer() {
    const timer = document.getElementById("timer");
    timer.innerText = originTime;
    startTime = new Date();
    // console.log(startTime);
    setInterval(() => {
      timer.innerText = originTime - getTimerTime();
      if (timer.innerText <= 0) TimeUp();
    }, 500);
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
          <div
            className={styles.typeDisplayHiragana}
            id="type-display-hiragana"
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
