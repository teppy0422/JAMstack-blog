"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

import { supabase } from "@/utils/supabase/client";

import { DefaultSeo } from "next-seo";
import styles from "@/styles/home.module.scss";
import {
  Center,
  VStack,
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

import Voucher from "./parts/voucher.jsx";
import Menu from "./parts/menu";
import Ranking from "./parts/ranking.jsx";
import { getQuiz } from "./parts/romaji_quiz.js";
import Sushi_menu from "./parts/sushi_menu";

import Keyboard from "./parts/keyboard";
// import GraphTemp from "./parts/graphTemp.jsx";

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

export default function Typing() {
  const [session, setSession] = useState(null);
  const [userID, setUserID] = useState(null);
  // デバイスの種類を検出
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const graphTempRef = useRef(null); //履歴グラフ

  const { colorMode } = useColorMode();
  const { language, setLanguage } = useLanguage();

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
  const [totalTime, setTotalTime] = useState(50); //トータルタイムの値
  const totalTimeRef = useRef(null); //トータルタイム
  const [missedCount, setMissedCount] = useState(0); //タイプミス回数
  const totalCost = useRef(0); //トータル金額
  const [cost, setCost] = useState(0); //金額
  const inputTextRef = useRef(null); //入力欄
  const menuRef = useRef(null); //menu
  const voucherRef = useRef(null); //伝票

  const totalTime_origin = useRef(50); //トータルタイムの値
  const typeCountRef = useRef(0); //タイプ数
  const [typePerSocund, setTypePerSocund] = useState(0); //タイプ速度の値
  const sound_BGM = useRef(null); //BGM
  const gameMode = useRef("menu"); //モードの状態
  const Q_used = useRef(""); //出題済みの問題の番号
  const suggestKeyRef = useRef(""); //入力候補の着色用

  const pathname = usePathname();

  const keyboardRef = useRef(null);
  const voucherCloseRef = useRef(null);

  // タイプ数を監視して雪のエフェクトを制御
  const [snowflakeCount, setSnowflakeCount] = useState(0);
  const [snowSpeed, setSnowSpeed] = useState([0.5, 2]);
  const [snowWind, setSnowWind] = useState([0.4, 0.5]);
  const intervalRef = useRef(null); // intervalを保持するためのref

  // BGMの管理
  const [isBgmOn, setIsBgmOn] = useState(true); // BGMの状態を管理するステート
  const toggleBgm = () => {
    if (isBgmOn) {
      sound_BGM.current.muted = true;
    } else {
      sound_BGM.current.muted = false;
    }
    setIsBgmOn(!isBgmOn);
  };

  const [clearedProblemsCount, setClearedProblemsCount] = useState(0); // 初期値を0に設定
  const clearedProblemsCountRef = useRef(clearedProblemsCount);
  function clearProblem() {
    setClearedProblemsCount((prevCount) => {
      const newCount = prevCount + 1;
      console.log("Updated clearedProblemsCount inside setState:", newCount); // デバッグ用ログ
      return newCount;
    });
  }

  useEffect(() => {
    clearedProblemsCountRef.current = clearedProblemsCount;
  }, [clearedProblemsCount]);

  useEffect(() => {
    //レンダー初回時だけ実行
    console.log("初回だけ");
    // renderFlgRef.current = true;
    //入力イベントをオン
    document.addEventListener("keypress", keypress_ivent);
    document.addEventListener("keyup", keyup_ivent);
    // デバイス確認
    setIsMobile(isMobileDevice());
    setIsIOS(isIOSDevice());
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        console.log("Fetching user session..."); // デバッグ用ログ
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
        } else {
          console.log("User fetched successfully:", user); // デバッグ用ログ
          setSession(user);
          setUserID(user.id);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };
    fetchSession();
  }, []);

  //ページ遷移時にイベントとかをオフ
  const router = useRouter();
  const pageChangeHandler = () => {
    document.removeEventListener("keypress", keypress_ivent);
    document.removeEventListener("keyup", keyup_ivent);
    clearInterval(timerIDref.current);
    clearInterval(totalTimerIDref.current);
    sound_BGM.current.pause();
    gameMode.current = "menu";
  };
  // useEffect(() => {
  //   router.events.on("routeChangeStart", pageChangeHandler);
  //   return () => {
  //     router.events.off("routeChangeStart", pageChangeHandler);
  //   };
  // }, []);
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
      sound_BGM.current.playbackRate = 1.1;
    }
    if (totalTime <= 10) {
      sound_BGM.current.playbackRate = 1.2;
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
        document.getElementById(item).style.background = null;
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
      document.getElementById(eKey).style.background = "pink";
    }
    switch (gameMode.current) {
      case "menu":
        if (e.code === "Space") {
          gameReplay();
          menuRef.current.style.display = "none";
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
              sound("success");
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
          sound("missed");
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

  let itemTime = 15;
  function StartTimer() {
    const timer = document.getElementById("timer");
    timer.innerText = itemTime;
    let startTime = new Date();
    clearInterval(timerIDref.current);
    const timerID_ = setInterval(() => {
      timer.innerText = itemTime - getTimerTime(startTime);
      if (timer.innerText <= 0) TimeUp();
    }, 500);
    timerIDref.current = timerID_;
  }
  function TimeUp() {
    clearSuggest();
    RenderNextSentence();
    StartTimer();
  }

  function getTimerTime(t) {
    return Math.floor((new Date() - t) / 1000);
  }

  //タイマー_トータル
  function StartTotalTimer() {
    keyboardRef.current.Close();
    let totalStartTime;
    sound_BGM.current.pause();
    sound_BGM.current.currentTime = 0;
    sound_BGM.current.playbackRate = 1;
    sound_BGM.current.volume = 0.08;
    sound_BGM.current.play();

    setTotalTime(totalTime_origin.current);
    totalStartTime = new Date();
    clearInterval(totalTimerIDref.current);

    const totalTimerID_ = setInterval(() => {
      setTotalTime(totalTime_origin.current - getTimerTime(totalStartTime));
      if (totalTimeRef.current.innerText <= 0) {
        clearInterval(totalTimerIDref.current);
        gameOver(clearedProblemsCount);
      }
    }, 200);
    totalTimerIDref.current = totalTimerID_;
  }
  //ゲームオーバー
  function gameOver(clearedProblemsCount) {
    keyboardRef.current.Open();
    clearInterval(timerIDref.current);
    clearInterval(totalTimerIDref.current);
    setTypePerSocund(
      Math.floor((typeCountRef.current / totalTime_origin.current) * 60)
    );
    voucherRef.current.clickChildOpen(
      clearedProblemsCountRef.current,
      session,
      true
    );
    sound_BGM.current.pause();
    sound("finish");
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
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setSnowflakeCount(0);
      } else {
        typeCountRef.current -= 15;
        setSnowflakeCount(typeCountRef.current);
      }
    }, 100);
  };
  // ランキング更新
  useEffect(() => {
    const handleGameOver = () => {
      // 新しいランキングデータを取得して設定する
      const newRanking = getNewRankingData(); // データを取得する関数
      setRanking(newRanking);
    };
    // gameoverイベントをリッスン
    window.addEventListener("gameover", handleGameOver);
    // クリーンアップ
    return () => {
      window.removeEventListener("gameover", handleGameOver);
    };
  }, []);
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
      <Box ref={menuRef} style={{ display: "none" }}>
        <Menu
          gameReplay={() => {
            gameReplay();
          }}
        />
      </Box>
      <Content
        isCustomHeader={true}
        style={{
          fontFamily: getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans JP",
            cn: "Noto Sans SC",
            language,
          }),
        }}
      >
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
                  zIndex: 10000,
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
                  zIndex: 10000,
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
                    {/* <GraphTemp
                      ref={graphTempRef}
                      totalCost={totalCost.current}
                      missedCount={missedCount}
                      typePerSocund={typePerSocund}
                      times={totalTime_origin.current}
                      user={session}
                      userID={userID}
                      visible={true}
                    /> */}
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

                    <Ranking user={session} />
                  </Flex>
                </Center>

                <Sushi_menu
                  count={clearedProblemsCount}
                  // count={12}
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
                user={session}
              />
            </Box>
          </>
        )}
        <Flex display="none">
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
        </Flex>
      </Content>
    </>
  );
}
