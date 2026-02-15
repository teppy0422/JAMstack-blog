"use client";

import {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import RhythmNoteSVG from "./RhythmNoteSVG";
import {
  type RhythmPattern,
  type NoteEvent,
  ALL_RHYTHM_PATTERNS,
  getPatternsByDifficulty,
  getRandomPattern,
  judgeFullRhythm,
  countTapNotes,
  isRest,
} from "../lib/rhythmUtils";
import { supabase } from "@/utils/supabase/client";
import Highcharts from "highcharts/highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAccessibility from "highcharts/modules/accessibility";
import AnnotationsFactory from "highcharts/modules/annotations";

if (typeof window !== "undefined") {
  AnnotationsFactory(Highcharts);
  highchartsAccessibility(Highcharts);
}

export interface RhythmPracticeFlashcardRef {
  handlePress: () => void;
  handleRelease: () => void;
}

type PracticeMode = "free" | "exam";

interface RhythmPracticeFlashcardProps {
  darkMode: boolean;
  highlightColor: string;
  borderColor: string;
  frColor: string;
  bgColor: string;
  userId?: string | null;
}

const RhythmPracticeFlashcard = forwardRef<
  RhythmPracticeFlashcardRef,
  RhythmPracticeFlashcardProps
>(function RhythmPracticeFlashcard(
  { darkMode, highlightColor, borderColor, frColor, bgColor, userId },
  ref,
) {
  // モード
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("free");
  // 難易度
  const [difficulty, setDifficulty] = useState(1);
  // 現在のパターン
  const [currentPattern, setCurrentPattern] = useState<RhythmPattern | null>(
    null,
  );
  const currentPatternRef = useRef<RhythmPattern | null>(null);
  const [animKey, setAnimKey] = useState(0);

  // NoteEvent 状態 (press/release ペア)
  const noteEventsRef = useRef<NoteEvent[]>([]);
  const currentPressRef = useRef<number | null>(null);
  const [pressCount, setPressCount] = useState(0);
  const [feedbackState, setFeedbackState] = useState<
    "none" | "listening" | "correct" | "incorrect"
  >("none");
  const [lastScore, setLastScore] = useState<{
    total: number;
    timing: number;
    duration: number;
  } | null>(null);
  const [noteHighlights, setNoteHighlights] = useState<
    ("none" | "active" | "correct" | "incorrect")[]
  >([]);

  // スタッツ
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 試験モード
  const [examPhase, setExamPhase] = useState<"setup" | "playing" | "result">(
    "setup",
  );
  const [examQuestionCount, setExamQuestionCount] = useState(10);
  const [examCurrentIndex, setExamCurrentIndex] = useState(0);
  const [examResults, setExamResults] = useState<
    { patternId: string; score: number }[]
  >([]);

  // DB保存・履歴
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [historyChartOptions, setHistoryChartOptions] = useState<any>({});

  // パターン選択
  const nextPattern = useCallback(() => {
    // 試験モード: 全レベル（先頭休符除外）、自由モード: 選択レベルのみ
    const patterns =
      practiceMode === "exam"
        ? ALL_RHYTHM_PATTERNS.filter((p) => !isRest(p.notes[0]))
        : getPatternsByDifficulty(difficulty, true);
    const pattern = getRandomPattern(
      patterns,
      currentPatternRef.current?.id,
    );
    setCurrentPattern(pattern);
    currentPatternRef.current = pattern;
    setAnimKey((k) => k + 1);
    noteEventsRef.current = [];
    currentPressRef.current = null;
    setPressCount(0);
    setFeedbackState("none");
    setLastScore(null);
    setNoteHighlights(pattern.notes.map(() => "none"));
  }, [difficulty, practiceMode]);

  // 初回
  useEffect(() => {
    nextPattern();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 難易度変更時
  useEffect(() => {
    nextPattern();
    setStats({ correct: 0, total: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  // cleanup
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // キーダウン（NoteOn）処理
  const handlePress = useCallback(() => {
    if (!currentPatternRef.current) return;
    const pattern = currentPatternRef.current;

    if (feedbackState === "correct" || feedbackState === "incorrect") return;
    // 既に押している場合は無視（連打防止）
    if (currentPressRef.current !== null) return;

    const now = performance.now();
    currentPressRef.current = now;

    const newPressCount = noteEventsRef.current.length + 1;
    setPressCount(newPressCount);

    // 最初のプレスでリスニング開始
    if (noteEventsRef.current.length === 0) {
      setFeedbackState("listening");
    }

    // ハイライト: 現在押しているノートをactive
    const expectedTaps = countTapNotes(pattern);
    const hl: ("none" | "active" | "correct" | "incorrect")[] =
      pattern.notes.map(() => "none");
    let tapIdx = 0;
    for (let i = 0; i < pattern.notes.length; i++) {
      if (!isRest(pattern.notes[i])) {
        if (tapIdx < noteEventsRef.current.length) {
          hl[i] = "correct"; // 完了済み
        } else if (tapIdx === noteEventsRef.current.length) {
          hl[i] = "active"; // 現在押している
        }
        tapIdx++;
      }
    }
    setNoteHighlights(hl);
  }, [feedbackState]);

  // キーアップ（NoteOff）処理
  const handleRelease = useCallback(() => {
    if (!currentPatternRef.current) return;
    const pattern = currentPatternRef.current;
    const expectedTaps = countTapNotes(pattern);

    if (feedbackState === "correct" || feedbackState === "incorrect") return;
    // 押していない場合は無視
    if (currentPressRef.current === null) return;

    const now = performance.now();
    const event: NoteEvent = {
      press: currentPressRef.current,
      release: now,
    };
    noteEventsRef.current.push(event);
    currentPressRef.current = null;

    // ハイライトを更新
    const completedCount = noteEventsRef.current.length;
    const hl: ("none" | "active" | "correct" | "incorrect")[] =
      pattern.notes.map(() => "none");
    let tapIdx = 0;
    for (let i = 0; i < pattern.notes.length; i++) {
      if (!isRest(pattern.notes[i])) {
        if (tapIdx < completedCount) {
          hl[i] = "correct"; // 完了済み
        } else if (tapIdx === completedCount) {
          hl[i] = "active"; // 次に押すべき
        }
        tapIdx++;
      }
    }
    setNoteHighlights(hl);

    // 全ノート完了 → 判定
    if (completedCount === expectedTaps) {
      judgeResult(pattern, noteEventsRef.current);
    }
  }, [feedbackState]);

  // 判定実行（タイミング + 音の長さ）
  const judgeResult = useCallback(
    (pattern: RhythmPattern, events: NoteEvent[]) => {
      const result = judgeFullRhythm(pattern, events);

      setLastScore({
        total: Math.round(result.score * 100),
        timing: Math.round(result.timingScore * 100),
        duration: Math.round(result.durationScore * 100),
      });
      const isCorrect = result.score >= 0.6;

      if (isCorrect) {
        setFeedbackState("correct");
        setStats((prev) => ({
          correct: prev.correct + 1,
          total: prev.total + 1,
        }));
      } else {
        setFeedbackState("incorrect");
        setStats((prev) => ({ ...prev, total: prev.total + 1 }));
      }

      // ハイライト更新（タイミングと音長の両方のエラーを考慮）
      const hl: ("none" | "active" | "correct" | "incorrect")[] =
        pattern.notes.map(() => "none");
      let errIdx = 0;
      for (let i = 0; i < pattern.notes.length; i++) {
        if (!isRest(pattern.notes[i])) {
          if (errIdx < result.perNoteTimingErrors.length) {
            const timErr = result.perNoteTimingErrors[errIdx];
            const durErr = result.perNoteDurationErrors[errIdx];
            hl[i] = timErr < 0.1 && durErr < 0.15 ? "correct" : "incorrect";
          }
          errIdx++;
        }
      }
      setNoteHighlights(hl);

      // 試験モード: 結果を記録
      if (practiceMode === "exam" && examPhase === "playing") {
        setExamResults((prev) => [
          ...prev,
          { patternId: pattern.id, score: result.score },
        ]);
      }

      // 次へ進む
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = setTimeout(() => {
        // 自由モードで不正解の場合はやり直し
        if (!isCorrect && practiceMode !== "exam") {
          noteEventsRef.current = [];
          currentPressRef.current = null;
          setPressCount(0);
          setFeedbackState("none");
          setLastScore(null);
          setNoteHighlights(pattern.notes.map(() => "none"));
          feedbackTimerRef.current = null;
          return;
        }

        // 試験モード: 次の問題
        if (practiceMode === "exam" && examPhase === "playing") {
          const nextIdx = examCurrentIndex + 1;
          if (nextIdx >= examQuestionCount) {
            setExamPhase("result");
            feedbackTimerRef.current = null;
            return;
          }
          setExamCurrentIndex(nextIdx);
        }

        nextPattern();
        feedbackTimerRef.current = null;
      }, 1200);
    },
    [practiceMode, examPhase, examCurrentIndex, examQuestionCount, nextPattern],
  );

  // 試験開始
  const startExam = useCallback(() => {
    setExamPhase("playing");
    setExamCurrentIndex(0);
    setExamResults([]);
    setStats({ correct: 0, total: 0 });
    setSaveSuccess(false);
    nextPattern();
  }, [nextPattern]);

  // 試験結果をDBに保存
  const saveExamResult = useCallback(async () => {
    if (!userId || examResults.length === 0) return;
    setIsSaving(true);
    try {
      const avgScore =
        Math.round(
          (examResults.reduce((s, r) => s + r.score, 0) / examResults.length) *
            1000,
        ) / 10;

      const { error } = await supabase
        .from("rhythm_practice_results")
        .insert([
          {
            user_id: userId,
            total_questions: examResults.length,
            avg_score: avgScore,
          },
        ]);
      if (error) {
        console.error("Error saving rhythm exam result:", error);
      } else {
        setSaveSuccess(true);
      }
    } catch (err) {
      console.error("Error saving rhythm exam result:", err);
    }
    setIsSaving(false);
  }, [userId, examResults]);

  // 履歴グラフ
  const loadHistoryRef = useRef<() => void>(() => {});
  const deleteHistoryItem = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("rhythm_practice_results")
        .delete()
        .eq("id", id);
      if (!error) loadHistoryRef.current();
    },
    [],
  );

  const loadHistory = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("rhythm_practice_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) {
      setHistoryChartOptions({});
      setIsCompareMode(false);
      setShowHistory(true);
      return;
    }

    const scores = data.map(
      (d: { avg_score: number }) => Math.round(d.avg_score * 10) / 10,
    );
    const categories = data.map((_: unknown, i: number) => String(i + 1));
    const ids = data.map((d: { id: string }) => d.id);

    // 日付ラベル
    type DateLabel = {
      point: { xAxis: number; yAxis: number; x: number; y: number };
      text: string;
    };
    const dateLabels: DateLabel[] = [];
    let prevDate = "";
    data.forEach(
      (d: { created_at: string; avg_score: number }, i: number) => {
        const dd = new Date(d.created_at);
        const md = `${dd.getMonth() + 1}/${dd.getDate()}`;
        if (md !== prevDate) {
          dateLabels.push({
            point: { xAxis: 0, yAxis: 0, x: i, y: d.avg_score },
            text: md,
          });
          prevDate = md;
        }
      },
    );

    const textColor = darkMode ? "#ffffff" : "#444444";
    const gridColor = darkMode ? "#ffffff" : "#999999";

    setHistoryChartOptions({
      chart: {
        backgroundColor: "none",
        zoomType: "x",
        scrollablePlotArea: { minWidth: 100 },
      },
      credits: { enabled: false },
      annotations: [
        {
          draggable: "",
          labelOptions: {
            style: { fontSize: "1em" },
            y: -20,
            backgroundColor: "rgba(255,255,255,0.8)",
          },
          labels: dateLabels,
        },
      ],
      title: {
        text: "クリックでデータの削除",
        style: { color: textColor, fontSize: "16px" },
      },
      xAxis: {
        categories,
        labels: { style: { color: textColor, fontSize: "13px" } },
        lineColor: textColor,
        lineWidth: 1,
      },
      yAxis: {
        min: 0,
        max: 100,
        gridLineColor: gridColor,
        lineColor: gridColor,
        lineWidth: 1,
        title: { text: "" },
        labels: {
          format: "{value}%",
          style: { color: textColor, fontSize: "14px" },
        },
      },
      tooltip: { valueSuffix: "%" },
      series: [
        {
          name: "平均スコア",
          type: "spline",
          data: scores.map((s: number, i: number) => ({
            y: s,
            id: ids[i],
          })),
          color: textColor,
          marker: { symbol: "circle" },
        },
      ],
      plotOptions: {
        series: {
          cursor: "pointer",
          point: {
            events: {
              click: function (this: { id?: string }) {
                const id = this.id;
                if (id) {
                  deleteHistoryItem(id);
                }
              },
            },
          },
        },
      },
    });
    setIsCompareMode(false);
    setShowHistory(true);
  }, [userId, darkMode, deleteHistoryItem]);
  loadHistoryRef.current = loadHistory;

  // 比較モード（全ユーザー）
  const loadComparison = useCallback(async () => {
    const { data, error } = await supabase
      .from("rhythm_practice_results")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      setHistoryChartOptions({});
      setIsCompareMode(true);
      setShowHistory(true);
      return;
    }

    const uniqueUserIds = [...new Set(data.map((d: { user_id: string }) => d.user_id))];
    const { data: usersData } = await supabase
      .from("table_users")
      .select("id, user_metadata")
      .in("id", uniqueUserIds);

    const userNameMap = new Map<string, string>();
    if (usersData) {
      for (const u of usersData) {
        userNameMap.set(u.id, u.user_metadata?.name || u.id.slice(0, 8));
      }
    }

    const userMap = new Map<string, { name: string; results: typeof data }>();
    for (const uid of uniqueUserIds) {
      userMap.set(uid, {
        name: userNameMap.get(uid) || uid.slice(0, 8),
        results: [],
      });
    }
    for (const row of data) {
      userMap.get(row.user_id)?.results.push(row);
    }

    const textColor = darkMode ? "#ffffff" : "#444444";
    const gridColor = darkMode ? "#ffffff" : "#999999";
    const colors = [
      "#7cb5ec",
      "#f7a35c",
      "#90ed7d",
      "#8085e9",
      "#f15c80",
      "#e4d354",
    ];

    let maxLen = 0;
    userMap.forEach((v) => {
      if (v.results.length > maxLen) maxLen = v.results.length;
    });
    const categories = Array.from({ length: maxLen }, (_, i) => String(i + 1));

    const series: object[] = [];
    let colorIdx = 0;
    userMap.forEach((val, uid) => {
      if (val.results.length === 0) return;
      const color = colors[colorIdx % colors.length];
      const isCurrent = uid === userId;
      series.push({
        name: val.name,
        type: "spline",
        data: val.results.map((r: { avg_score: number }) =>
          Math.round(r.avg_score * 10) / 10,
        ),
        tooltip: { valueSuffix: "%" },
        color,
        lineWidth: isCurrent ? 3 : 1.5,
        marker: { symbol: "circle", radius: isCurrent ? 4 : 3 },
        dashStyle: isCurrent ? "Solid" : "ShortDash",
      });
      colorIdx++;
    });

    setHistoryChartOptions({
      chart: {
        backgroundColor: "none",
        zoomType: "x",
        scrollablePlotArea: { minWidth: 100 },
      },
      credits: { enabled: false },
      title: {
        text: "ユーザー比較",
        style: { color: textColor, fontSize: "18px" },
      },
      xAxis: {
        categories,
        labels: {
          style: { color: textColor, fontSize: "12px" },
        },
        lineColor: textColor,
        lineWidth: 1,
        title: { text: "回数", style: { color: textColor } },
      },
      yAxis: {
        min: 0,
        max: 100,
        gridLineColor: gridColor,
        lineColor: gridColor,
        lineWidth: 1,
        title: { text: "" },
        labels: {
          format: "{value}%",
          style: { color: textColor, fontSize: "14px" },
        },
      },
      tooltip: { shared: true },
      legend: {
        enabled: false,
        itemStyle: {
          color: textColor,
          fontSize: "12px",
        },
      },
      series,
    });
    setIsCompareMode(true);
    setShowHistory(true);
  }, [userId, darkMode]);

  // MIDI入力用
  useImperativeHandle(
    ref,
    () => ({
      handlePress: () => handlePress(),
      handleRelease: () => handleRelease(),
    }),
    [handlePress, handleRelease],
  );

  // キーボードでの press/release
  useEffect(() => {
    const keyPressed = new Set<string>();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (!keyPressed.has(e.code)) {
          keyPressed.add(e.code);
          handlePress();
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        keyPressed.delete(e.code);
        handleRelease();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [handlePress, handleRelease]);

  const accuracy =
    stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  const modeButtonStyle = (active: boolean) => ({
    padding: "6px 14px",
    fontSize: "13px",
    borderRadius: "6px",
    borderWidth: "1px",
    borderStyle: "solid" as const,
    borderColor: active ? highlightColor : borderColor,
    backgroundColor: active
      ? darkMode
        ? `${highlightColor}40`
        : `${highlightColor}20`
      : "transparent",
    color: frColor,
    cursor: "pointer" as const,
    fontWeight: active ? ("bold" as const) : ("normal" as const),
  });

  // 試験結果
  const examAvgScore =
    examResults.length > 0
      ? Math.round(
          (examResults.reduce((s, r) => s + r.score, 0) / examResults.length) *
            100,
        )
      : 0;

  // タップボタンの共通部分
  const renderTapButton = () => (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        handlePress();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        handleRelease();
      }}
      onPointerLeave={(e) => {
        // ボタン外にドラッグした場合もrelease扱い
        if (currentPressRef.current !== null) {
          e.preventDefault();
          handleRelease();
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: "100%",
        maxWidth: "400px",
        height: "80px",
        borderRadius: "16px",
        border: `2px solid ${
          feedbackState === "listening"
            ? highlightColor
            : feedbackState === "correct"
              ? "#4CAF50"
              : feedbackState === "incorrect"
                ? "#FF4444"
                : borderColor
        }`,
        backgroundColor:
          currentPressRef.current !== null
            ? darkMode
              ? `${highlightColor}30`
              : `${highlightColor}15`
            : feedbackState === "listening"
              ? darkMode
                ? `${highlightColor}20`
                : `${highlightColor}10`
              : "transparent",
        color: frColor,
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "border-color 0.2s",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "none",
      }}
    >
      {feedbackState === "none" || feedbackState === "listening" ? (
        <>
          <span style={{ fontSize: "24px" }}>
            {feedbackState === "listening"
              ? currentPressRef.current !== null
                ? "..."
                : "..."
              : "HOLD"}
          </span>
          {feedbackState === "listening" && currentPattern && (
            <span style={{ fontSize: "14px", opacity: 0.7 }}>
              {noteEventsRef.current.length +
                (currentPressRef.current !== null ? 1 : 0)}{" "}
              / {countTapNotes(currentPattern)}
            </span>
          )}
        </>
      ) : (
        <span>
          {feedbackState === "correct"
            ? "OK"
            : practiceMode === "exam"
              ? "MISS"
              : "もう一度"}
        </span>
      )}
    </button>
  );

  // スコア表示の共通部分
  const renderScore = () =>
    lastScore !== null && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2px",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: feedbackState === "correct" ? "#4CAF50" : "#FF4444",
            transition: "color 0.2s",
          }}
        >
          {lastScore.total}%
        </div>
        <div
          style={{
            fontSize: "11px",
            color: frColor,
            opacity: 0.6,
            display: "flex",
            gap: "10px",
          }}
        >
          <span>タイミング: {lastScore.timing}%</span>
          <span>音の長さ: {lastScore.duration}%</span>
        </div>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "20px",
        gap: "8px",
        perspective: "600px",
      }}
    >
      <style>{`
        @keyframes cardFlipIn {
          0% { opacity: 0; transform: rotateY(-90deg) scale(0.9); }
          50% { opacity: 1; }
          100% { opacity: 1; transform: rotateY(0deg) scale(1); }
        }
      `}</style>

      {/* モード切替 + 難易度 */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => {
            setPracticeMode("free");
            nextPattern();
            setStats({ correct: 0, total: 0 });
          }}
          style={modeButtonStyle(practiceMode === "free")}
        >
          自由
        </button>
        <button
          onClick={() => {
            setPracticeMode("exam");
            setExamPhase("setup");
            setStats({ correct: 0, total: 0 });
          }}
          style={modeButtonStyle(practiceMode === "exam")}
        >
          試験
        </button>

        {/* 難易度選択（自由モードのみ） */}
        {practiceMode === "free" && (
          <>
            <div
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: borderColor,
                margin: "0 4px",
                alignSelf: "center",
              }}
            />
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  ...modeButtonStyle(difficulty === d),
                  padding: "6px 10px",
                }}
              >
                Lv{d}
              </button>
            ))}
          </>
        )}

        {userId && (
          <>
            <div
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: borderColor,
                margin: "0 4px",
                alignSelf: "center",
              }}
            />
            <button onClick={loadHistory} style={modeButtonStyle(false)}>
              履歴
            </button>
          </>
        )}
      </div>

      {/* === 自由モード === */}
      {practiceMode === "free" && currentPattern && (
        <>
          {/* パターン名 */}
          <div
            style={{
              fontSize: "16px",
              color: frColor,
              opacity: 0.7,
            }}
          >
            {currentPattern.label}
          </div>

          {/* リズム譜面 */}
          <div
            key={animKey}
            style={{
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              justifyContent: "center",
              animation: "cardFlipIn 0.35s ease-out",
              borderRadius: "12px",
              padding: "2px",
              boxShadow:
                feedbackState === "correct"
                  ? "0 0 16px 4px rgba(76, 175, 80, 0.5)"
                  : feedbackState === "incorrect"
                    ? "0 0 16px 4px rgba(255, 68, 68, 0.5)"
                    : "none",
              transition: "box-shadow 0.3s",
            }}
          >
            <RhythmNoteSVG
              notes={currentPattern.notes}
              highlights={noteHighlights}
              darkMode={darkMode}
              beatsPerMeasure={currentPattern.beatsPerMeasure}
            />
          </div>

          {/* スコア表示 */}
          {renderScore()}

          {/* タップエリア */}
          {renderTapButton()}

          {/* スキップ + スタッツ */}
          <div
            style={{ display: "flex", gap: "12px", alignItems: "center" }}
          >
            <button
              onClick={nextPattern}
              style={{
                padding: "8px 20px",
                fontSize: "14px",
                borderRadius: "6px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: borderColor,
                backgroundColor: "transparent",
                color: frColor,
                cursor: "pointer",
              }}
            >
              スキップ
            </button>
            {stats.total > 0 && (
              <div
                style={{ fontSize: "14px", color: frColor, opacity: 0.7 }}
              >
                正解: {stats.correct}/{stats.total} ({accuracy}%)
              </div>
            )}
          </div>
        </>
      )}

      {/* === 試験モード: セットアップ === */}
      {practiceMode === "exam" && examPhase === "setup" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            padding: "20px",
          }}
        >
          <div
            style={{ fontSize: "18px", fontWeight: "bold", color: frColor }}
          >
            リズム試験
          </div>
          <div
            style={{ fontSize: "14px", color: frColor, opacity: 0.8 }}
          >
            Lv1〜3の全パターンから出題
          </div>

          {/* 問題数 */}
          <div style={{ display: "flex", gap: "12px" }}>
            {[5, 10].map((count) => (
              <button
                key={count}
                onClick={() => setExamQuestionCount(count)}
                style={{
                  ...modeButtonStyle(examQuestionCount === count),
                  padding: "12px 24px",
                  fontSize: "18px",
                }}
              >
                {count}問
              </button>
            ))}
          </div>

          <button
            onClick={startExam}
            style={{
              padding: "12px 40px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              border: "none",
              backgroundColor: highlightColor,
              color: bgColor,
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            開始
          </button>
        </div>
      )}

      {/* === 試験モード: プレイ中 === */}
      {practiceMode === "exam" && examPhase === "playing" && currentPattern && (
        <>
          <div
            style={{ fontSize: "14px", color: frColor, fontWeight: "bold" }}
          >
            {examCurrentIndex + 1} / {examQuestionCount}
          </div>

          <div
            style={{ fontSize: "14px", color: frColor, opacity: 0.7 }}
          >
            Lv{currentPattern.difficulty} - {currentPattern.label}
          </div>

          <div
            key={animKey}
            style={{
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              justifyContent: "center",
              animation: "cardFlipIn 0.35s ease-out",
              borderRadius: "12px",
              padding: "2px",
              boxShadow:
                feedbackState === "correct"
                  ? "0 0 16px 4px rgba(76, 175, 80, 0.5)"
                  : feedbackState === "incorrect"
                    ? "0 0 16px 4px rgba(255, 68, 68, 0.5)"
                    : "none",
              transition: "box-shadow 0.3s",
            }}
          >
            <RhythmNoteSVG
              notes={currentPattern.notes}
              highlights={noteHighlights}
              darkMode={darkMode}
              beatsPerMeasure={currentPattern.beatsPerMeasure}
            />
          </div>

          {renderScore()}
          {renderTapButton()}
        </>
      )}

      {/* === 試験モード: 結果 === */}
      {practiceMode === "exam" && examPhase === "result" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "20px",
            width: "100%",
          }}
        >
          <div
            style={{ fontSize: "20px", fontWeight: "bold", color: frColor }}
          >
            結果
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color:
                examAvgScore >= 80
                  ? "#4CAF50"
                  : examAvgScore >= 50
                    ? highlightColor
                    : "#FF4444",
            }}
          >
            {examAvgScore}%
          </div>
          <div style={{ fontSize: "14px", color: frColor, opacity: 0.7 }}>
            {examResults.length}問
          </div>

          {/* 評価 */}
          <div
            style={{
              fontSize: "14px",
              color:
                examAvgScore >= 80
                  ? "#4CAF50"
                  : examAvgScore >= 50
                    ? highlightColor
                    : "#FF4444",
              fontWeight: "bold",
            }}
          >
            {examAvgScore >= 80
              ? "素晴らしい！リズム感が優れています"
              : examAvgScore >= 50
                ? "良い調子！継続して練習しましょう"
                : "リズムパターンを繰り返し練習しましょう"}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            {userId && (
              <button
                onClick={saveExamResult}
                disabled={isSaving || saveSuccess}
                style={{
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: saveSuccess ? "#4CAF50" : highlightColor,
                  color: bgColor,
                  cursor: isSaving || saveSuccess ? "default" : "pointer",
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                {isSaving ? "保存中..." : saveSuccess ? "保存済み" : "登録"}
              </button>
            )}
            <button
              onClick={() => {
                setExamPhase("setup");
                setSaveSuccess(false);
                setShowHistory(false);
              }}
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                borderRadius: "8px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: borderColor,
                backgroundColor: "transparent",
                color: frColor,
                cursor: "pointer",
              }}
            >
              もう一度
            </button>
          </div>

        </div>
      )}

      {/* === 履歴グラフモーダル === */}
      {showHistory && (
        <div
          onClick={() => setShowHistory(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: bgColor,
              borderRadius: "12px",
              padding: "24px",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "0 0 16px 0",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  color: frColor,
                }}
              >
                {isCompareMode ? "ユーザー比較" : "リズム練習 履歴"}
              </h3>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => {
                    if (isCompareMode) {
                      loadHistory();
                    }
                  }}
                  style={{
                    padding: "4px 12px",
                    fontSize: "12px",
                    borderRadius: "4px",
                    border: `1px solid ${!isCompareMode ? highlightColor : borderColor}`,
                    backgroundColor: !isCompareMode
                      ? darkMode
                        ? `${highlightColor}40`
                        : `${highlightColor}20`
                      : "transparent",
                    color: frColor,
                    cursor: "pointer",
                    fontWeight: !isCompareMode ? "bold" : "normal",
                  }}
                >
                  自分
                </button>
                <button
                  onClick={() => {
                    if (!isCompareMode) {
                      loadComparison();
                    }
                  }}
                  style={{
                    padding: "4px 12px",
                    fontSize: "12px",
                    borderRadius: "4px",
                    border: `1px solid ${isCompareMode ? highlightColor : borderColor}`,
                    backgroundColor: isCompareMode
                      ? darkMode
                        ? `${highlightColor}40`
                        : `${highlightColor}20`
                      : "transparent",
                    color: frColor,
                    cursor: "pointer",
                    fontWeight: isCompareMode ? "bold" : "normal",
                  }}
                >
                  比較
                </button>
              </div>
            </div>
            {Object.keys(historyChartOptions).length > 0 ? (
              <HighchartsReact
                highcharts={Highcharts}
                options={historyChartOptions}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: frColor,
                  opacity: 0.6,
                }}
              >
                {isCompareMode
                  ? "比較データがありません"
                  : "まだ履歴がありません"}
              </div>
            )}
            <button
              onClick={() => setShowHistory(false)}
              style={{
                marginTop: "16px",
                padding: "8px 24px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: highlightColor,
                color: bgColor,
                cursor: "pointer",
                width: "100%",
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default RhythmPracticeFlashcard;
