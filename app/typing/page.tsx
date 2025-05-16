"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@//utils/supabase/client";

import { NextSeo } from "next-seo";
import styles from "@/styles/home.module.scss";
import {
  Center,
  VStack,
  HStack,
  Box,
  Button,
  Grid,
  GridItem,
  Text,
  Tooltip,
  useColorMode,
  Divider,
  Flex,
  Spacer,
  Progress,
} from "@chakra-ui/react";
import { IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";

import Snowfall from "react-snowfall";

import Content from "../../components/content";
import { isMobileDevice, isIOSDevice } from "@/utils/device.js";
import {
  getRomaji,
  getHiragana,
  getRomaji2,
  getInputCandidate,
  changeColor,
  getRomajiForecast,
  makeSpan,
} from "./parts/romaji.js";

import { Voucher, VoucherRef } from "./parts/voucher";
import Ranking from "./parts/ranking";
import { getQuiz } from "./parts/romaji_quiz.js";
import Sushi_menu from "./parts/sushi_menu";

import Keyboard from "./parts/keyboard";
import GraphTemp from "./parts/graphTemp";
// import { useContext } from "react";

// import { myContext } from "../_app";
import { useLanguage } from "../../src/contexts/LanguageContext";
import getMessage from "../../components/getMessage";
import { useUserContext } from "@/contexts/useUserContext";

import ControllableAudioPlayer, {
  ControllableAudioPlayerHandle,
} from "@/components/ControllableAudioPlayer";
import { is } from "cheerio/dist/commonjs/api/traversing";
import { interval } from "date-fns";

const TypingPage = () => {
  const [session, setSession] = useState(null);
  const [userID, setUserID] = useState(null);
  // デバイスの種類を検出
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const graphTempRef = useRef(null); //履歴グラフ

  const { colorMode } = useColorMode();
  const { language, setLanguage } = useLanguage();
  const {
    currentUserId,
    currentUserPictureUrl,
    currentUserEmail,
    currentUserCreatedAt,
    getUserById,
    isLoading,
  } = useUserContext();
  const userData = currentUserId ? getUserById(currentUserId) : null;

  const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
  const inputText = useRef(""); //入力文字
  const Q_Texts = useRef(""); //問題文
  const Q_cost = useRef(0); //問題文の値段
  const correctCount = useRef(0); //ひらがなの正解文字数
  const [typeDisplayRomaji_0, setTypeDisplayRomaji_0] = useState("");
  const [typeDisplayRomaji_1, setTypeDisplayRomaji_1] = useState("");
  const [typeDisplayRomaji_2, setTypeDisplayRomaji_2] = useState("");
  const renderFlgRef = useRef(false); //useEffectを初回走らせないフラグ
  const timerIDref = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimerIDref = useRef(""); //トータルタイマーリセット用のID
  const [totalTime, setTotalTime] = useState(50); //トータルタイムの値
  const totalTimeRef = useRef(null); //トータルタイム
  const [itemTime, setItemTime] = useState(15);
  const [missedCount, setMissedCount] = useState(0); //タイプミス回数
  const totalCost = useRef(0); //トータル金額
  const [cost, setCost] = useState(0); //金額
  const inputTextRef = useRef(null); //入力欄

  const voucherRef = useRef<VoucherRef>(null); //伝票

  const totalTime_origin = useRef(50); //トータルタイムの値
  const typeCountRef = useRef(0); //タイプ数
  const [typePerSocund, setTypePerSocund] = useState(0); //タイプ速度の値

  const gameMode = useRef("menu"); //モードの状態
  const Q_used = useRef(""); //出題済みの問題の番号
  const suggestKeyRef = useRef(""); //入力候補の着色用

  // const myState = useContext(myContext);
  const keyboardRef = useRef<{
    Open: () => void;
    Close: () => void;
  } | null>(null);
  const voucherCloseRef = useRef(null);

  // タイプ数を監視して雪のエフェクトを制御
  const [snowflakeCount, setSnowflakeCount] = useState(0);
  const [snowSpeed, setSnowSpeed] = useState<[number, number]>([0.5, 2]);
  const [snowWind, setSnowWind] = useState<[number, number]>([0.4, 0.5]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // BGM
  const audioBgmRef = useRef<ControllableAudioPlayerHandle>(null);
  const [isBgmOn, setIsBgmOn] = useState(true);
  const toggleBgm = () => {
    if (isBgmOn) {
      audioBgmRef.current?.setVolume(0);
    } else {
      audioBgmRef.current?.setVolume(0.3);
    }
    setIsBgmOn(!isBgmOn);
  };

  // SE
  const audioMissedRef = useRef<ControllableAudioPlayerHandle>(null);
  const audioSuccessRef = useRef<ControllableAudioPlayerHandle>(null);
  const audioFinishRef = useRef<ControllableAudioPlayerHandle>(null);

  const [clearedProblemsCount, setClearedProblemsCount] = useState(0); // 初期値を0に設定
  const clearedProblemsCountRef = useRef(clearedProblemsCount);

  function clearProblem() {
    setClearedProblemsCount((prevCount) => {
      const newCount = prevCount + 1;
      return newCount;
    });
  }
  useEffect(() => {
    clearedProblemsCountRef.current = clearedProblemsCount;
  }, [clearedProblemsCount]);

  useEffect(() => {
    //レンダー初回時だけ実行
    renderFlgRef.current = true;
    //入力イベントをオン
    document.addEventListener("keypress", keypress_ivent);
    document.addEventListener("keyup", keyup_ivent);
    // デバイス確認
    setIsMobile(isMobileDevice());
    setIsIOS(isIOSDevice());
  }, []);
  //ページ遷移時にイベントとかをオフ
  useEffect(() => {
    // イベント登録
    document.addEventListener("keypress", keypress_ivent);
    document.addEventListener("keyup", keyup_ivent);

    return () => {
      // アンマウント時にクリーンアップ
      document.removeEventListener("keypress", keypress_ivent);
      document.removeEventListener("keyup", keyup_ivent);
      if (timerIDref.current) clearInterval(timerIDref.current);
      if (totalTimerIDref.current) clearInterval(totalTimerIDref.current);
      audioBgmRef.current?.stop();
      gameMode.current = "menu";
    };
  }, []);

  // 非同期処理
  function GetRandomSentence() {
    return fetch(RANDOM_SENTENCE_URL_API)
      .then((response) => response.json())
      .then((data) => data.content);
  }

  // レンダー時に実行
  useEffect(() => {
    if (totalTime <= 15) {
      audioBgmRef.current?.setPlaybackRate(1.1);
    }
    if (totalTime <= 10) {
      audioBgmRef.current?.setPlaybackRate(1.2);
    }
  }, [totalTime]);

  // キーアップイベント
  function keyup_ivent(e) {
    clearSuggest();
    let nextType = document.getElementById(suggestKeyRef.current);
    if (nextType !== null) {
      nextType.style.background = "red";
    }
    return false;
  }
  function clearSuggest() {
    const id = [
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
      "i",
      "o",
      "p",
      "a",
      "s",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      ";",
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      ",",
      ".",
      "/",
    ];
    {
      id.map((item, index) => {
        const key = document.getElementById(item);
        if (key !== null) {
          key.style.background = "none";
        }
      });
    }
  }
  // キーダウンイベント
  function keypress_ivent(e) {
    e.preventDefault();
    let eKey = e.key.toLowerCase();
    const typeDisplayRomaji = document.getElementById("type-display-romaji");
    //入力したキーを着色
    const inputKeyID = document.getElementById(eKey);
    if (inputKeyID !== null) {
      inputKeyID.style.background = "pink";
    }
    switch (gameMode.current) {
      case "menu":
        if (e.code === "Space") {
          gameReplay();
        }
        break;
      case "play":
        //スペースキーはカウントしない
        if (eKey === " ") {
          return false;
        }
        const temp = getRomaji(Q_Texts.current.substring(0, 3));
        inputText.current = inputText.current + eKey;
        const inputTextTempA = inputText.current;
        let matchCount = 0;
        let complete = false;
        //temp[key]は正解が入った配列
        for (let key in temp) {
          //部分一致
          if (temp[key].startsWith(inputTextTempA, 0)) {
            //入力候補の更新
            const newTemp = getInputCandidate(inputTextTempA, temp);
            //文章を一文字ずつ分解してspanタグを生成_ローマ字_1
            makeSpan(newTemp[0], typeDisplayRomaji);
            //色を変更
            changeColor(
              "type-display-romaji",
              inputTextTempA.length,
              colorMode
            );
            //入力文字オーバーの更新_ひらがな
            const inputSuggestHiragana = getHiragana(newTemp[0]);
            const inputSuggestOver = Q_Texts.current.substring(
              inputSuggestHiragana.length
            );
            setTypeDisplayRomaji_2(getRomajiForecast(inputSuggestOver));

            suggestKeyRef.current = newTemp[0].charAt(inputTextTempA.length);
            //正解のキータイプ数
            typeCountRef.current = typeCountRef.current + 1;
            setSnowflakeCount(typeCountRef.current * 20);
            setSnowSpeed([
              typeCountRef.current * 0.01,
              typeCountRef.current * 0.02,
            ]);
            setSnowWind([
              typeCountRef.current * 0.005,
              typeCountRef.current * 0.01,
            ]);
            matchCount = matchCount + 1;
          }
          //一文字が一致
          if (temp[key] === inputTextTempA) {
            const tempHiragana = getHiragana(inputTextTempA);
            Q_Texts.current = Q_Texts.current.substring(tempHiragana.length);

            correctCount.current = correctCount.current + tempHiragana.length;
            matchCount = 1;
            //文字色を変える_ひらがな
            let last = changeColor(
              "type-display-hiragana",
              correctCount.current,
              colorMode
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
              audioSuccessRef.current?.play();
              totalCost.current = totalCost.current + Q_cost.current;
              clearProblem();
              TimeUp();
            } else {
              // 次の文字の正解を表示
              const nextWord = getRomaji(Q_Texts.current.substring(0, 3));
              makeSpan(nextWord[0], typeDisplayRomaji);
              setTypeDisplayRomaji_2(getRomajiForecast(Q_Texts.current));

              // 入力アシストの表示
              suggestKeyRef.current = nextWord[0].charAt(0);

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
          audioMissedRef.current?.play();
          setMissedCount((missedCount) => missedCount + 1);
          setMissedCount((missedCount) => {
            return missedCount;
          });
          changeColor("type-display-romaji", 0, colorMode);
          // 入力アシストの表示
          suggestKeyRef.current = temp[0].charAt(0);
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

    const inputSuggest = getRomaji(Q_Texts.current.substring(0, 3));
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
    // 入力アシストの表示
    suggestKeyRef.current = inputSuggest[0].charAt(0);
  }

  function StartTimer() {
    const timer = document.getElementById("timer");
    if (!timer) return;
    timer.innerText = String(itemTime);
    const startTime = new Date();
    if (timerIDref.current !== null) {
      clearInterval(timerIDref.current);
    }

    const timerID_ = setInterval(() => {
      const remaining = itemTime - getTimerTime(startTime);
      timer.innerText = String(remaining);
      if (remaining <= 0) {
        clearInterval(timerID_);
        TimeUp();
      }
    }, 500);

    timerIDref.current = timerID_;
  }

  function TimeUp() {
    clearSuggest();
    RenderNextSentence();
    StartTimer();
  }

  function getTimerTime(t: Date): number {
    return Math.floor((new Date().getTime() - t.getTime()) / 1000);
  }

  //タイマー_トータル
  function StartTotalTimer() {
    keyboardRef.current?.Close();
    let totalStartTime;
    if (isBgmOn) {
      audioBgmRef.current?.setPlaybackRate(1);
      audioBgmRef.current?.play();
    }

    setTotalTime(totalTime_origin.current);
    totalStartTime = new Date();
    clearInterval(totalTimerIDref.current);

    const totalTimerID_ = setInterval(() => {
      setTotalTime(totalTime_origin.current - getTimerTime(totalStartTime));
      if (totalTimeRef.current === null) return;
      const totalTimeInt = parseInt(
        (totalTimeRef.current as HTMLElement).innerText
      );

      if (totalTimeInt <= 0) {
        clearInterval(totalTimerIDref.current);
        gameOver(clearedProblemsCount);
      }
    }, 200);
    if (totalTimeRef.current !== null) {
      totalTimerIDref.current = String(totalTimerID_);
    }
  }
  //ゲームオーバー
  function gameOver(clearedProblemsCount) {
    audioFinishRef.current?.play();
    audioBgmRef.current?.stop();
    keyboardRef.current?.Open();
    if (timerIDref.current !== null) {
      clearInterval(timerIDref.current);
    }
    clearInterval(totalTimerIDref.current);
    setTypePerSocund(
      Math.floor((typeCountRef.current / totalTime_origin.current) * 60)
    );
    if (voucherRef.current !== null) {
      voucherRef.current.clickChildOpen(
        clearedProblemsCountRef.current,
        session,
        true
      );
    }
    setSnowWind([0, 0.1]);
    setSnowSpeed([0.1, 0.2]);
    stopSnowfall(typeCountRef.current * 20);
    gameMode.current = "menu";
  }
  //リプレイ
  function gameReplay() {
    setTypePerSocund(0);
    setMissedCount(0);
    StartTotalTimer();
    TimeUp();
    // setSnowflakeCount(0);
    inputText.current = "";
    typeCountRef.current = 0;
    totalCost.current = 0;
    setClearedProblemsCount(0);
    gameMode.current = "play";
    Q_used.current = "";
  }
  const stopSnowfall = (count) => {
    typeCountRef.current = count;
    setSnowflakeCount(count);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (typeCountRef.current <= 0) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = null;
        setSnowflakeCount(0);
      } else {
        typeCountRef.current -= 15;
        setSnowflakeCount(typeCountRef.current);
      }
    }, 100);
  };

  return (
    <>
      {/* <NextSeo
        defaultTitle="teppy-Blog"
        description="afadadフォリオ"
        openGraph={{
          type: "website",
          title: "teppy-Blog",
          description: "typing_line_test",
          site_name: "teppy-Blog",
          url: "https://www.teppy.link/typing",
          images: [
            {
              url: "https://www.teppy.link/typing",
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
      /> */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 1299,
          pointerEvents: "none",
        }}
      >
        <Snowfall
          snowflakeCount={snowflakeCount}
          wind={snowWind}
          speed={snowSpeed}
        />
      </div>
      <Content isCustomHeader={true}>
        {isMobile || isIOS ? (
          <Box
            style={{
              fontFamily: getMessage({
                ja: "Noto Sans JP",
                us: "Noto Sans JP",
                cn: "Noto Sans SC",
                language,
              }),
            }}
          >
            <Text fontSize="xl" color="red">
              {getMessage({
                ja: "このページはキーボードが必要です",
                us: "This page requires a keyboard",
                cn: "此页面需要键盘。",
                language,
              })}
              <br />
              {getMessage({
                ja: "キーボードのあるデバイスでアクセスしてください",
                us: "Please access with a device that has a keyboard",
                cn: "使用带键盘的设备访问。",
                language,
              })}
            </Text>
          </Box>
        ) : (
          <>
            <VStack className={styles.typing} h="620px">
              {/* 下の降雪 */}
              <Box
                className={`${styles.snowTarget}`}
                id="line"
                style={{
                  position: "absolute",
                  top: "618px",
                  left: "0%",
                  height: "2px",
                  width: "50%",
                  zIndex: 1000,
                }}
              />
              <Box
                className={`${styles.snowTarget}`}
                id="line"
                style={{
                  position: "absolute",
                  top: "618px",
                  left: "50%",
                  height: "2px",
                  width: "50%",
                  zIndex: 1000,
                }}
              />
              <Box
                className={
                  colorMode === "light" ? styles.backLight : styles.backDark
                }
                w="100%"
                style={{
                  fontFamily: getMessage({
                    ja: "Noto Sans JP",
                    us: "Noto Sans JP",
                    cn: "Noto Sans SC",
                    language,
                  }),
                }}
              >
                <Center mt={2}>
                  <Grid
                    templateColumns="repeat(3, 1fr)"
                    gap={[1, 2, 4, 6]}
                    w={["100%", "90%", "80%", "70%"]}
                    h="14"
                    mt={10}
                    className={styles.navi}
                  >
                    <GridItem w="100%" h="14" colSpan={1}>
                      <Text fontSize="13px" pl="10px">
                        {getMessage({
                          ja: "残り時間",
                          us: "Time Remaining",
                          cn: "剩余时间",
                          language,
                        })}
                      </Text>
                      <Center>
                        <Divider
                          w="90%"
                          style={{
                            ...(colorMode === "light"
                              ? { borderColor: "black" }
                              : { borderColor: "white" }),
                            transform: "translateX(0rem)",
                          }}
                          className={`${styles.snowTarget}`}
                          id="line"
                        />
                      </Center>
                      <Box h="33px" position="relative">
                        <Progress
                          hasStripe
                          value={totalTime}
                          h="100%"
                          colorScheme="green"
                          backgroundColor="transparent"
                          style={{ opacity: "0.7" }}
                          mx="10px"
                          max={totalTime_origin.current}
                        />
                        <Text
                          position="absolute"
                          top="0"
                          right="4px"
                          fontSize="18px"
                          fontWeight="bold"
                          textAlign="right"
                          mr="12px"
                          mt="4px"
                          ref={totalTimeRef}
                        >
                          {totalTime}
                        </Text>
                      </Box>
                    </GridItem>
                    <GridItem w="100%" h="14" colSpan={1}>
                      <Text fontSize="13px" pl="10px">
                        {getMessage({
                          ja: "タイプミス",
                          us: "typo",
                          cn: "讹字",
                          language,
                        })}
                      </Text>
                      <Center>
                        <Divider
                          w="90%"
                          style={{
                            ...(colorMode === "light"
                              ? { borderColor: "black" }
                              : { borderColor: "white" }),
                            transform: "translateX(0rem)",
                          }}
                          className={`${styles.snowTarget}`}
                          id="line"
                        />
                      </Center>
                      <Text
                        fontSize="18px"
                        fontWeight="bold"
                        textAlign="right"
                        mr="12px"
                        mt="4px"
                      >
                        {missedCount}
                      </Text>
                    </GridItem>
                    <GridItem w="100%" h="14" colSpan={1}>
                      <Text fontSize="13px" pl="10px">
                        {getMessage({
                          ja: "金額",
                          us: "Amount",
                          cn: "金額",
                          language,
                        })}
                      </Text>
                      <Center>
                        <Divider
                          w="90%"
                          style={{
                            ...(colorMode === "light"
                              ? { borderColor: "black" }
                              : { borderColor: "white" }),
                            transform: "translateX(0rem)",
                          }}
                          className={`${styles.snowTarget}`}
                          id="line"
                        />
                      </Center>
                      <Text
                        fontSize="18px"
                        fontWeight="bold"
                        textAlign="right"
                        mr="12px"
                        mt="4px"
                      >
                        {getMessage({
                          ja: "¥ ",
                          us: "$ ",
                          cn: "¥ ",
                          language,
                        })}
                        {totalCost.current}
                      </Text>
                    </GridItem>
                  </Grid>
                </Center>

                <Box position="absolute" top="10px" right="10px">
                  <Button
                    className={`${styles.snowTarget}`}
                    transform="translateX(0rem)"
                    onClick={toggleBgm}
                    _focus={{ _focus: "none" }}
                    background="transparent"
                    border="1px solid"
                    _hover={{ backgroundColor: "transparent" }}
                    p="0"
                    m="0"
                    w="8"
                    h="8"
                  >
                    {isBgmOn ? (
                      <IoVolumeHighOutline size="22" />
                    ) : (
                      <IoVolumeMuteOutline size="22" />
                    )}
                  </Button>
                </Box>

                <Center>
                  <Flex w={["100%", "90%", "80%", "70%"]} h="40px">
                    <GraphTemp
                      ref={graphTempRef}
                      totalCost={totalCost.current}
                      missedCount={missedCount}
                      typePerSocund={typePerSocund}
                      times={totalTime_origin.current}
                      userID={currentUserId}
                      visible={true}
                    />
                    <Spacer />
                    <Text mt="4px" id="timer">
                      {getMessage({
                        ja: "[SPACE]でスタート",
                        us: "Start with [SPACE].",
                        cn: "从 [SPACE] 开始。",
                        language,
                      })}
                    </Text>
                    <Spacer />
                    <Ranking user={userData} />
                  </Flex>
                </Center>

                <Sushi_menu
                  count={clearedProblemsCount}
                  voucherRef={voucherRef}
                  session={session}
                  snowflakeCount={snowflakeCount}
                />
                <Center className={styles.cost}>
                  {getMessage({
                    ja: "¥ ",
                    us: "$ ",
                    cn: "¥ ",
                    language,
                  })}
                  {Q_cost.current}
                </Center>

                <Box className={styles.question} w="100%">
                  <Center className={styles.typeDisplay} id="type-display">
                    　
                  </Center>
                  <Center
                    className={styles.typeDisplayHiragana}
                    id="type-display-hiragana"
                  >
                    　
                  </Center>
                  <Center mb="4px">
                    <p className={styles.typeDisplayRomaji}>
                      <span style={{ color: "red" }}>
                        {typeDisplayRomaji_0}
                      </span>
                    </p>
                    <Text
                      className={styles.typeDisplayRomaji}
                      style={{ border: "solid 1px", borderRadius: "3px" }}
                      borderColor={
                        colorMode === "light"
                          ? styles.backLight
                          : styles.backDark
                      }
                      px="1.5"
                      id="type-display-romaji"
                    >
                      　
                    </Text>
                    <p className={styles.typeDisplayRomaji}>
                      {typeDisplayRomaji_2}
                    </p>
                  </Center>
                  <Keyboard ref={keyboardRef} />
                </Box>
              </Box>
            </VStack>
            {/* <Text textAlign="center" mt={4}>
              ホームポジションから学ぶモードが必要なら連絡下さい
            </Text> */}
            <Box position="fixed" zIndex="10001">
              <Voucher
                ref={voucherRef}
                totalCost={totalCost.current}
                missedCount={missedCount}
                typePerSocund={typePerSocund}
                time={totalTime_origin.current}
                user={userData}
              />
            </Box>
          </>
        )}

        {/* <HStack mt={4}>
          <Button onClick={() => audioFinishRef.current?.play()}>再生</Button>
          <Button onClick={() => audioFinishRef.current?.stop()}>停止</Button>
          <Button onClick={() => audioFinishRef.current?.setVolume(0.2)}>
            音量20%
          </Button>
          <Button onClick={() => audioFinishRef.current?.setPlaybackRate(2)}>
            倍速
          </Button>
          <Button onClick={() => audioFinishRef.current?.setPlaybackRate(0.5)}>
            半速
          </Button>
        </HStack> */}
        <ControllableAudioPlayer
          ref={audioBgmRef}
          src="https://music.storyinvention.com/wp-content/uploads/kutsurogi-koto.mp3"
          initialVolume={0.3}
          initialPlaybackRate={1.0}
        />
        <ControllableAudioPlayer
          ref={audioMissedRef}
          src="/sound/missed2.mp3"
          initialVolume={0.9}
          initialPlaybackRate={1.0}
        />
        <ControllableAudioPlayer
          ref={audioSuccessRef}
          src="/sound/success.mp3"
          initialVolume={1.0}
          initialPlaybackRate={1.0}
        />
        <ControllableAudioPlayer
          ref={audioFinishRef}
          src="/sound/finish.mp3"
          initialVolume={0.8}
          initialPlaybackRate={1.0}
        />
      </Content>
    </>
  );
};
export default TypingPage;
