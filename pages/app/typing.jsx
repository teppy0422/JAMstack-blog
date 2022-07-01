import React, { useEffect, useState, useRef } from "react";
import { DefaultSeo } from "next-seo";
import styles from "../../styles/home.module.scss";
import {
  Center,
  VStack,
  Box,
  Button,
  Grid,
  GridItem,
  Text,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";

import Content from "../../components/content";
import ResponseCache from "next/dist/server/response-cache";

import {
  getRomaji,
  getHiragana,
  getRomaji2,
  getInputCandidate,
  changeColor,
  getRomajiForecast,
  makeSpan,
} from "../../libs/romaji.js";

import Voucher from "../../components/typing/voucher";
import Menu from "../../components/typing/menu";

import { getQuiz } from "../../libs/romaji_quiz.js";
import Sushi_tamago_wrap from "../../components/3d/sushi_tamago_wrap2";

import Keyboard from "../../components/typing/kyeboard";

export const typing = () => {
  const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
  const inputText = useRef(""); //入力文字
  const Q_Texts = useRef(""); //問題文
  const Q_cost = useRef(0); //問題文の値段
  const correctCount = useRef(0); //ひらがなの正解文字数
  const [typeDisplayRomaji_0, setTypeDisplayRomaji_0] = useState("");
  const [typeDisplayRomaji_1, setTypeDisplayRomaji_1] = useState("");
  const [typeDisplayRomaji_2, setTypeDisplayRomaji_2] = useState("");
  const renderFlgRef = useRef(false); //useEffectを初回走らせないフラグ
  const timerIDref = useRef(""); //タイマーリセット用のID
  const totalTimerIDref = useRef(""); //トータルタイマーリセット用のID
  const [totalTime, setTotalTime] = useState(30); //トータルタイムの値
  const totalTimeRef = useRef(null); //トータルタイム
  const [missedCount, setMissedCount] = useState(0); //タイプミス回数
  const totalCost = useRef(0); //トータル金額
  const [cost, setCost] = useState(0); //金額
  const inputTextRef = useRef(null); //入力欄
  const menuRef = useRef(null); //menu
  const voucherRef = useRef(null); //伝票

  const totalTime_origin = useRef(30); //トータルタイムの値
  const typeCountRef = useRef(0); //タイプ数
  const [typePerSocund, setTypePerSocund] = useState("0"); //タイプ速度の値
  const sound_BGM = useRef(null); //BGM
  const mode = useRef("menu"); //モードの状態
  const Q_used = useRef(""); //出題済みの問題の番号

  //マウント時に一回だけ実行
  useEffect(() => {
    //レンダー初回時だけ実行
    console.log("初回だけ");
    // renderFlgRef.current = true;
    //入力イベント
    document.addEventListener("keypress", keypress_ivent);
    document.addEventListener("keyup", keyup_ivent);
  }, []);

  const { colorMode, toggleColorMode } = useColorMode();
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

  // レンダー時に実行
  useEffect(() => {
    if (totalTime <= 15) {
      sound_BGM.current.playbackRate = 1.25;
    }
    if (totalTime <= 10) {
      sound_BGM.current.playbackRate = 1.5;
    }
  }, [totalTime]);

  // キーアップイベント
  function keyup_ivent(e) {
    const keyUpID = document.getElementById(e.key);
    if (keyUpID !== null) {
      keyUpID.style.background = null;
    }
    return false;
  }

  // キーダウンイベント
  function keypress_ivent(e) {
    const typeDisplayRomaji = document.getElementById("type-display-romaji");
    console.log("keypress: " + e.key);
    //入力したキーを着色
    const inputKeyID = document.getElementById(e.key);
    console.log(inputKeyID);
    if (inputKeyID !== null) {
      document.getElementById(e.key).style.background = "pink";
    }
    switch (mode.current) {
      case "menu":
        if (e.code === "Space") {
          gameReplay();
          menuRef.current.style.display = "none";
        }
        break;
      case "play":
        const temp = getRomaji(Q_Texts.current.substring(0, 2));

        inputText.current = inputText.current + e.key;
        const inputTextTempA = inputText.current;
        const matchCount = 0;
        const complete = false;
        //temp[key]は正解が入った配列
        for (let key in temp) {
          //部分一致
          if (temp[key].startsWith(inputTextTempA, 0)) {
            //入力候補の更新
            const newTemp = getInputCandidate(inputTextTempA, temp);
            //文章を一文字ずつ分解してspanタグを生成_ローマ字_1
            makeSpan(newTemp[0], typeDisplayRomaji);
            //色を変更
            changeColor("type-display-romaji", inputTextTempA.length);
            //入力文字オーバーの更新
            const inputSuggestHiragana = getHiragana(newTemp[0]);
            const inputSuggestOver = Q_Texts.current.substring(
              inputSuggestHiragana.length
            );
            setTypeDisplayRomaji_2(getRomajiForecast(inputSuggestOver));

            //KPMを求めるカウント
            typeCountRef.current = typeCountRef.current + 1;
            matchCount = matchCount + 1;
          }
          //完全に一致
          if (temp[key] === inputTextTempA) {
            console.log("完全に一致");
            const tempHiragana = getHiragana(inputTextTempA);
            Q_Texts.current = Q_Texts.current.substring(tempHiragana.length);

            correctCount.current = correctCount.current + tempHiragana.length;
            matchCount = 1;
            //文字色を変える_ひらがな
            const last = changeColor(
              "type-display-hiragana",
              correctCount.current
            );
            if (last === 0) {
              complete = true;
            }
            //これのせいで更新が遅い気がする
            setTypeDisplayRomaji_0(
              (typeDisplayRomaji_0) => typeDisplayRomaji_0 + temp[key]
            );
            setTypeDisplayRomaji_0((typeDisplayRomaji_0) => {
              return typeDisplayRomaji_0;
            });

            //一つの文章が終了
            if (complete === true) {
              totalCost.current = totalCost.current + Q_cost.current;
              sound("success");
              TimeUp();
            } else {
              // 次の文字の正解を表示
              const nextWord = getRomaji(Q_Texts.current.substring(0, 2));
              makeSpan(nextWord[0], typeDisplayRomaji);
              setTypeDisplayRomaji_2(getRomajiForecast(Q_Texts.current));

              //入力文字オーバーの更新
              const inputSuggestHiragana = getHiragana(nextWord[0]);
              const inputSuggestOver = Q_Texts.current.substring(
                inputSuggestHiragana.length
              );
              setTypeDisplayRomaji_2(getRomajiForecast(inputSuggestOver));
            }
            inputText.current = "";
            break;
          }
        }
        //もう一致しない
        if (matchCount === 0) {
          inputText.current = "";
          sound("missed");
          setMissedCount((missedCount) => missedCount + 1);
          setMissedCount((missedCount) => {
            return missedCount;
          });
          changeColor("type-display-romaji", 0);
        }
        break;
    }
    return false;
  }

  // 問題文を作成
  async function RenderNextSentence() {
    const typeDisplay = document.getElementById("type-display");
    const typeDisplayHiragana = document.getElementById(
      "type-display-hiragana"
    );
    const typeDisplayRomaji = document.getElementById("type-display-romaji");

    const quiz = getQuiz(Q_used.current);
    Q_used.current = Q_used.current + quiz[1] + ",";

    // 文章を一文字ずつ分解してspanタグを生成
    makeSpan(quiz[0][0], typeDisplay);
    // 文章を一文字ずつ分解してspanタグを生成_ひらがな
    makeSpan(quiz[0][1], typeDisplayHiragana);
    // 問題のセット
    Q_Texts.current = quiz[0][1];
    // 入力候補
    setTypeDisplayRomaji_0("");

    const inputSuggest = getRomaji(Q_Texts.current.substring(0, 2));
    makeSpan(inputSuggest[0], typeDisplayRomaji);

    //ひらがなから入力候補を除いた入力候補
    const inputSuggestHiragana = getHiragana(inputSuggest[0]);
    const inputSuggestOver = Q_Texts.current.substring(
      inputSuggestHiragana.length
    );
    setTypeDisplayRomaji_2(getRomajiForecast(inputSuggestOver));
    // コストのセット
    Q_cost.current = Number(quiz[0][2]);
    correctCount.current = 0;
  }

  // タイマー_ワード毎
  let startTime;
  let itemTime = 10;
  function StartTimer() {
    const timer = document.getElementById("timer");
    timer.innerText = itemTime;
    startTime = new Date();
    clearInterval(timerIDref.current);
    const timerID_ = setInterval(() => {
      timer.innerText = itemTime - getTimerTime(startTime);
      if (timer.innerText <= 0) TimeUp();
    }, 500);
    timerIDref.current = timerID_;
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
    sound_BGM.current.pause();
    sound_BGM.current.currentTime = 0;
    sound_BGM.current.playbackRate = 1;
    sound_BGM.current.volume = 0.1;
    sound_BGM.current.play();

    setTotalTime(totalTime_origin.current);
    totalStartTime = new Date();
    clearInterval(totalTimerIDref.current);
    const totalTimerID_ = setInterval(() => {
      setTotalTime(totalTime_origin.current - getTimerTime(totalStartTime));
      if (totalTimeRef.current.innerText <= 0) {
        clearInterval(totalTimerIDref.current);
        gameOver();
      }
    }, 500);
    totalTimerIDref.current = totalTimerID_;
  }
  //ゲームオーバー
  function gameOver() {
    clearInterval(timerIDref.current);
    clearInterval(totalTimerIDref.current);
    setTypePerSocund((typeCountRef.current / totalTime_origin.current) * 60);
    sound_BGM.current.pause();
    sound("finish");
    mode.current = "menu";
    voucherRef.current.clickChildOpen();
  }
  //リプレイ
  function gameReplay() {
    setTypePerSocund(0);
    setMissedCount(0);
    StartTotalTimer();
    TimeUp();
    inputText.current = "";
    typeCountRef.current = 0;
    totalCost.current = 0;
    mode.current = "play";
  }
  return (
    <>
      <DefaultSeo
        defaultTitle="teppy-Blog"
        description="afadadフォリオ"
        openGraph={{
          type: "website",
          title: "teppy-Blog",
          description: "typing_line_test",
          site_name: "teppy-Blog",
          url: "https://www.teppy.link/app/typing",
          images: [
            {
              url: "https://www.teppy.link/app/typing",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
              type: "image/jpeg",
            },
          ],
        }}
        twitter={{
          handle: "@",
          site: "@",
          cardType: "summary_large_image",
        }}
      />
      <Box ref={menuRef} style={{ display: "none" }}>
        <Menu
          gameReplay={() => {
            gameReplay();
          }}
        />
      </Box>
      <Content style={{ position: "relative" }}>
        <VStack className={styles.typing}>
          <Box
            className={
              colorMode === "light" ? styles.backLight : styles.backDark
            }
            w="100%"
          >
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
              <GridItem pl="2" bg="green.200" area={"main"}>
                <StatGroup>
                  <Stat>
                    <StatLabel>トータル金額</StatLabel>
                    <StatNumber
                      mr={1.5}
                      style={{ textAlign: "right", fontSize: "24px" }}
                    >
                      {totalCost.current}円
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
              <GridItem
                pl="2"
                area={"header"}
                id="timer"
                className={styles.timer}
              >
                <Center>作成中..</Center>
              </GridItem>
            </Grid>

            <Sushi_tamago_wrap />

            <Center className={styles.cost}>{Q_cost.current}</Center>

            <Box className={styles.question} w="100%">
              <Center className={styles.typeDisplay} id="type-display"></Center>
              <Center
                className={styles.typeDisplayHiragana}
                id="type-display-hiragana"
              ></Center>
              <Center>
                <p className={styles.typeDisplayRomaji}>
                  <span style={{ color: "red" }}>{typeDisplayRomaji_0}</span>
                </p>
                <Text
                  className={styles.typeDisplayRomaji}
                  id="type-display-romaji"
                ></Text>
                <p className={styles.typeDisplayRomaji}>
                  {typeDisplayRomaji_2}
                </p>
              </Center>
              <Keyboard />
            </Box>
          </Box>
        </VStack>
        <Voucher
          ref={voucherRef}
          totalCost={totalCost.current}
          missedCount={missedCount}
          typePerSocund={typePerSocund}
          gameReplay={() => {
            gameReplay();
          }}
        />
        <>
          <Button
            onClick={() => {
              voucherRef.current.clickChildOpen();
            }}
          >
            test
          </Button>
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
              // src="https://soundeffect-lab.info/sound/anime/mp3/roll-finish1.mp3"
              src="https://soundeffect-lab.info/sound/anime/mp3/drum-japanese-kaka1.mp3"
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
              // src="https://wwww.teppy.link/sound/%E6%B4%A5%E8%BB%BD%E4%B8%89%E5%91%B3%E7%B7%9A%E4%B9%B1%E8%88%9E.mp3"
              type="audio/mp3"
            />
          </audio>
        </>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h1>
              <i className={styles.fa}></i>結果
            </h1>
            <h3>{totalCost.current}円</h3>
            <h3>ミス:{missedCount}回</h3>
            <Tooltip hasArrow label="1分間の入力キー数" bg="gray.600">
              <h3>タイプ速度:{typePerSocund}/KPM</h3>
            </Tooltip>

            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
          </div>
        </div>
      </Content>
    </>
  );
};

export default typing;
