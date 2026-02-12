"use client";

import {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import StaffNoteSVG from "./StaffNoteSVG";
import {
  generateRandomNote,
  NATURAL_STEPS,
  type StaffNote,
} from "../lib/noteUtils";
import { supabase } from "@/utils/supabase/client";

import Highcharts from "highcharts/highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsAccessibility from "highcharts/modules/accessibility";
import AnnotationsFactory from "highcharts/modules/annotations";

if (typeof window !== "undefined") {
  AnnotationsFactory(Highcharts);
  highchartsAccessibility(Highcharts);
}

export interface SightReadingFlashcardRef {
  /** MIDI経由で正解した時に呼ばれる */
  handleCorrectAnswer: () => void;
}

type ClefMode = "treble" | "bass" | "both";
type PracticeMode = "free" | "exam";
type ExamPhase = "setup" | "playing" | "result";

interface ExamQuestionResult {
  midi: number;
  clef: "treble" | "bass";
  correct: boolean;
  responseMs: number;
}

interface WeakNote {
  midi: number;
  clef: string;
  miss_count: number;
  total_count: number;
  avg_response_ms: number;
}

interface SightReadingFlashcardProps {
  onExpectedNotesChange: (midiNotes: number[]) => void;
  wrongNotes: number[];
  onWrongNotesReset: () => void;
  darkMode: boolean;
  highlightColor: string;
  borderColor: string;
  frColor: string;
  bgColor: string;
  userId?: string | null;
}

const SightReadingFlashcard = forwardRef<
  SightReadingFlashcardRef,
  SightReadingFlashcardProps
>(function SightReadingFlashcard(
  {
    onExpectedNotesChange,
    wrongNotes,
    onWrongNotesReset,
    darkMode,
    highlightColor,
    borderColor,
    frColor,
    bgColor,
    userId,
  },
  ref,
) {
  const [clefMode, setClefMode] = useState<ClefMode>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("sightReadingClefMode") as ClefMode) || "treble"
      );
    }
    return "treble";
  });
  const [currentNote, setCurrentNote] = useState<StaffNote | null>(null);
  const currentNoteRef = useRef<StaffNote | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [feedbackState, setFeedbackState] = useState<
    "none" | "correct" | "incorrect"
  >("none");
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // モード関連
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("free");
  const [examPhase, setExamPhase] = useState<ExamPhase>("setup");
  const [examQuestionCount, setExamQuestionCount] = useState(10);
  const [examCurrentIndex, setExamCurrentIndex] = useState(0);
  const [examResults, setExamResults] = useState<ExamQuestionResult[]>([]);
  const questionStartTimeRef = useRef<number>(0);
  const examStartTimeRef = useRef<number>(0);
  const [examElapsedMs, setExamElapsedMs] = useState(0);
  const [weakNotes, setWeakNotes] = useState<WeakNote[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 履歴グラフ
  const [showHistory, setShowHistory] = useState(false);
  const [historyChartOptions, setHistoryChartOptions] = useState<object>({});
  const [isCompareMode, setIsCompareMode] = useState(false);

  // 現在の音部記号を決定（"both"モードでは交互）
  const getClef = useCallback((): "treble" | "bass" => {
    if (clefMode === "both") {
      return Math.random() < 0.5 ? "treble" : "bass";
    }
    return clefMode;
  }, [clefMode]);

  // 苦手データに基づく重み付きランダム音符生成
  const generateWeightedNote = useCallback(
    (clef: "treble" | "bass", prevMidi?: number): StaffNote => {
      if (weakNotes.length === 0) {
        return generateRandomNote(clef, false, prevMidi);
      }

      // 対象clefの苦手データを取得
      const relevant = weakNotes.filter(
        (w) => w.clef === clef && w.total_count > 0,
      );
      if (relevant.length === 0) {
        return generateRandomNote(clef, false, prevMidi);
      }

      // ミス率を計算して重みにする
      const minMidi = clef === "treble" ? 60 : 36;
      const maxMidi = clef === "treble" ? 84 : 60;
      const isBlackKey = (m: number) => [1, 3, 6, 8, 10].includes(m % 12);
      const naturals: number[] = [];
      for (let m = minMidi; m <= maxMidi; m++) {
        if (!isBlackKey(m)) naturals.push(m);
      }

      // 各音の重みを計算（苦手なほど重い）
      const weights = naturals.map((midi) => {
        const weak = relevant.find((w) => w.midi === midi);
        if (!weak) return 1; // データなし = 基本重み1
        const missRate = weak.miss_count / weak.total_count;
        return 1 + missRate * 3; // ミス率50%なら重み2.5倍
      });

      // 前回と同じ音を除外
      const candidates =
        prevMidi !== undefined
          ? naturals.map((m, i) => ({
              midi: m,
              weight: m === prevMidi ? 0 : weights[i],
            }))
          : naturals.map((m, i) => ({ midi: m, weight: weights[i] }));

      const totalWeight = candidates.reduce((s, c) => s + c.weight, 0);
      let r = Math.random() * totalWeight;
      let chosen = candidates[0].midi;
      for (const c of candidates) {
        r -= c.weight;
        if (r <= 0) {
          chosen = c.midi;
          break;
        }
      }

      const semitone = chosen % 12;
      const octave = Math.floor(chosen / 12) - 1;
      const SEMITONE_TO_STEP: Record<number, string> = {
        0: "C",
        2: "D",
        4: "E",
        5: "F",
        7: "G",
        9: "A",
        11: "B",
      };
      const step = SEMITONE_TO_STEP[semitone] || "C";
      return { step, octave, alter: 0, midi: chosen, clef };
    },
    [weakNotes],
  );

  // 次の音符を生成（前回と同じ音を避ける）
  const nextNote = useCallback(() => {
    const clef = getClef();
    const isExam = practiceMode === "exam" && examPhase === "playing";
    const note = isExam
      ? generateWeightedNote(clef, currentNoteRef.current?.midi)
      : generateRandomNote(clef, false, currentNoteRef.current?.midi);
    setCurrentNote(note);
    currentNoteRef.current = note;
    setAnimKey((k) => k + 1);
    setFeedbackState("none");
    onExpectedNotesChange([note.midi]);
    onWrongNotesReset();
    if (isExam) {
      questionStartTimeRef.current = Date.now();
    }
  }, [
    getClef,
    practiceMode,
    examPhase,
    generateWeightedNote,
    onExpectedNotesChange,
    onWrongNotesReset,
  ]);

  // 初回マウント時に音符を生成
  useEffect(() => {
    nextNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 苦手データをDBからロード
  useEffect(() => {
    if (!userId) return;
    const loadWeakNotes = async () => {
      const { data, error } = await supabase
        .from("sight_reading_weak_notes")
        .select("*")
        .eq("user_id", userId);
      if (!error && data) {
        setWeakNotes(data);
      }
    };
    loadWeakNotes();
  }, [userId]);

  // clefMode変更時にlocalStorageに保存 & 新しい音符を生成
  const handleClefModeChange = useCallback(
    (mode: ClefMode) => {
      setClefMode(mode);
      localStorage.setItem("sightReadingClefMode", mode);
      const clef =
        mode === "both" ? (Math.random() < 0.5 ? "treble" : "bass") : mode;
      const note = generateRandomNote(
        clef,
        false,
        currentNoteRef.current?.midi,
      );
      setCurrentNote(note);
      currentNoteRef.current = note;
      setAnimKey((k) => k + 1);
      setFeedbackState("none");
      setStats({ correct: 0, total: 0 });
      onExpectedNotesChange([note.midi]);
      onWrongNotesReset();
    },
    [onExpectedNotesChange, onWrongNotesReset],
  );

  // フィードバック後に次へ進む
  const advanceAfterFeedback = useCallback(() => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      // 試験モード: 問題数チェック
      if (practiceMode === "exam" && examPhase === "playing") {
        const nextIdx = examCurrentIndex + 1;
        if (nextIdx >= examQuestionCount) {
          setExamElapsedMs(Date.now() - examStartTimeRef.current);
          setExamPhase("result");
          feedbackTimerRef.current = null;
          return;
        }
        setExamCurrentIndex(nextIdx);
      }
      nextNote();
      feedbackTimerRef.current = null;
    }, 800);
  }, [nextNote, practiceMode, examPhase, examCurrentIndex, examQuestionCount]);

  // 正解処理
  const handleCorrect = useCallback(() => {
    if (feedbackState !== "none") return;
    setFeedbackState("correct");
    setStats((prev) => ({
      correct: prev.correct + 1,
      total: prev.total + 1,
    }));
    // 試験モード: 結果を記録
    if (practiceMode === "exam" && examPhase === "playing" && currentNote) {
      const responseMs = Date.now() - questionStartTimeRef.current;
      setExamResults((prev) => [
        ...prev,
        {
          midi: currentNote.midi,
          clef: currentNote.clef,
          correct: true,
          responseMs,
        },
      ]);
    }
    advanceAfterFeedback();
  }, [
    feedbackState,
    advanceAfterFeedback,
    practiceMode,
    examPhase,
    currentNote,
  ]);

  // 不正解処理
  const handleIncorrect = useCallback(() => {
    if (feedbackState !== "none") return;
    setFeedbackState("incorrect");
    setStats((prev) => ({ ...prev, total: prev.total + 1 }));
    // 試験モード: 結果を記録
    if (practiceMode === "exam" && examPhase === "playing" && currentNote) {
      const responseMs = Date.now() - questionStartTimeRef.current;
      setExamResults((prev) => [
        ...prev,
        {
          midi: currentNote.midi,
          clef: currentNote.clef,
          correct: false,
          responseMs,
        },
      ]);
    }
    advanceAfterFeedback();
  }, [
    feedbackState,
    advanceAfterFeedback,
    practiceMode,
    examPhase,
    currentNote,
  ]);

  // ボタンで回答
  const handleButtonAnswer = useCallback(
    (step: string) => {
      if (!currentNote || feedbackState !== "none") return;
      if (step === currentNote.step) {
        handleCorrect();
      } else {
        handleIncorrect();
      }
    },
    [currentNote, feedbackState, handleCorrect, handleIncorrect],
  );

  // MIDI経由の正解
  useImperativeHandle(
    ref,
    () => ({
      handleCorrectAnswer: () => {
        handleCorrect();
      },
    }),
    [handleCorrect],
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  // 試験開始
  const startExam = useCallback(() => {
    setExamPhase("playing");
    setExamCurrentIndex(0);
    setExamResults([]);
    setStats({ correct: 0, total: 0 });
    setSaveSuccess(false);
    examStartTimeRef.current = Date.now();
    const clef = getClef();
    const note = generateWeightedNote(clef, undefined);
    setCurrentNote(note);
    currentNoteRef.current = note;
    setAnimKey((k) => k + 1);
    setFeedbackState("none");
    onExpectedNotesChange([note.midi]);
    onWrongNotesReset();
    questionStartTimeRef.current = Date.now();
  }, [getClef, generateWeightedNote, onExpectedNotesChange, onWrongNotesReset]);

  // 試験結果をDBに保存
  const saveExamResult = useCallback(async () => {
    if (!userId || examResults.length === 0) return;
    setIsSaving(true);
    try {
      const correctResults = examResults.filter((r) => r.correct);
      const correctCount = correctResults.length;
      const accuracy = (correctCount / examResults.length) * 100;
      // 経過時間/正解数 → グラフで 60000/avg_response_ms = 正解数/分 となる
      const avgResponseMs =
        correctCount > 0 && examElapsedMs > 0
          ? examElapsedMs / correctCount
          : examResults.reduce((s, r) => s + r.responseMs, 0) /
            examResults.length;

      // 試験結果を保存
      const { error: resultError } = await supabase
        .from("sight_reading_results")
        .insert([
          {
            user_id: userId,
            clef_mode: clefMode,
            total_questions: examResults.length,
            correct_count: correctCount,
            accuracy: Math.round(accuracy * 10) / 10,
            avg_response_ms: Math.round(avgResponseMs),
          },
        ]);
      if (resultError) {
        console.error("Error saving exam result:", resultError);
        setIsSaving(false);
        return;
      }

      // 苦手データを更新（音符ごとに集計してUPSERT）
      const noteMap = new Map<
        string,
        {
          midi: number;
          clef: string;
          misses: number;
          total: number;
          totalMs: number;
        }
      >();
      for (const r of examResults) {
        const key = `${r.midi}-${r.clef}`;
        const existing = noteMap.get(key) || {
          midi: r.midi,
          clef: r.clef,
          misses: 0,
          total: 0,
          totalMs: 0,
        };
        existing.total++;
        existing.totalMs += r.responseMs;
        if (!r.correct) existing.misses++;
        noteMap.set(key, existing);
      }

      for (const entry of noteMap.values()) {
        // 既存データを取得
        const { data: existing } = await supabase
          .from("sight_reading_weak_notes")
          .select("*")
          .eq("user_id", userId)
          .eq("midi", entry.midi)
          .eq("clef", entry.clef)
          .single();

        if (existing) {
          const newTotalCount = existing.total_count + entry.total;
          const newMissCount = existing.miss_count + entry.misses;
          const newAvgMs =
            (existing.avg_response_ms * existing.total_count + entry.totalMs) /
            newTotalCount;
          await supabase
            .from("sight_reading_weak_notes")
            .update({
              miss_count: newMissCount,
              total_count: newTotalCount,
              avg_response_ms: Math.round(newAvgMs),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("sight_reading_weak_notes").insert([
            {
              user_id: userId,
              midi: entry.midi,
              clef: entry.clef,
              miss_count: entry.misses,
              total_count: entry.total,
              avg_response_ms: Math.round(entry.totalMs / entry.total),
            },
          ]);
        }
      }

      // 苦手データをリロード
      const { data: refreshed } = await supabase
        .from("sight_reading_weak_notes")
        .select("*")
        .eq("user_id", userId);
      if (refreshed) setWeakNotes(refreshed);

      setSaveSuccess(true);
    } catch (e) {
      console.error("Error saving exam data:", e);
    } finally {
      setIsSaving(false);
    }
  }, [userId, examResults, clefMode, examElapsedMs]);

  // 履歴グラフデータを取得して描画
  const loadHistory = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("sight_reading_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) {
      setHistoryChartOptions({});
      setIsCompareMode(false);
      setShowHistory(true);
      return;
    }

    // 1分間に読める数 = 60000 / avg_response_ms
    const readsPerMin = data.map((d: { avg_response_ms: number }) =>
      d.avg_response_ms > 0
        ? Math.round((60000 / d.avg_response_ms) * 10) / 10
        : 0,
    );
    // ミス率 = 100 - accuracy
    const missRates = data.map(
      (d: { accuracy: number }) => Math.round((100 - d.accuracy) * 10) / 10,
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
      (d: { created_at: string; avg_response_ms: number }, i: number) => {
        const dd = new Date(d.created_at);
        const md = `${dd.getMonth() + 1}/${dd.getDate()}`;
        if (md !== prevDate) {
          const rpm =
            d.avg_response_ms > 0
              ? Math.round((60000 / d.avg_response_ms) * 10) / 10
              : 0;
          dateLabels.push({
            point: { xAxis: 0, yAxis: 0, x: i, y: rpm },
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
      yAxis: [
        {
          min: 0,
          gridLineColor: gridColor,
          lineColor: gridColor,
          lineWidth: 1,
          title: { text: "" },
          labels: {
            format: "{value} /分",
            style: { color: textColor, fontSize: "14px" },
          },
        },
        {
          min: 0,
          max: 100,
          title: { text: "" },
          labels: {
            format: "{value}%",
            style: { color: "#aB96f1" },
          },
          opposite: true,
          gridLineWidth: 0,
        },
      ],
      tooltip: { shared: true },
      series: [
        {
          name: "ミス率",
          yAxis: 1,
          legendIndex: 1,
          type: "spline", // Changed from "column" to "spline"
          data: missRates.map((m: number, i: number) => ({
            y: m,
            id: ids[i],
          })),
          tooltip: { valueSuffix: "%" },
          color: "#dBc6f1",
          marker: { symbol: "circle" }, // Add marker for line graph
        },
        {
          name: "読み/分",
          legendIndex: 0,
          type: "spline",
          data: readsPerMin.map((r: number, i: number) => ({
            y: r,
            id: ids[i],
          })),
          tooltip: { valueSuffix: " /分" },
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
  }, [userId, darkMode]);

  // 履歴アイテムを削除
  const deleteHistoryItem = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("sight_reading_results")
        .delete()
        .eq("id", id);
      if (!error) {
        loadHistory();
      }
    },
    [loadHistory],
  );

  // 全ユーザー比較グラフを読み込み
  const loadComparison = useCallback(async () => {
    // 全ユーザーの結果を取得（フィルタなし）
    const { data, error } = await supabase
      .from("sight_reading_results")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      setHistoryChartOptions({});
      setIsCompareMode(true);
      setShowHistory(true);
      return;
    }

    // データに含まれるユーザーIDを抽出
    const uniqueUserIds = [...new Set(data.map((d) => d.user_id))];

    // ユーザー名をDBから取得
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

    // ユーザーごとにデータをグループ化
    const userMap = new Map<string, { name: string; results: typeof data }>();
    for (const uid of uniqueUserIds) {
      userMap.set(uid, {
        name: userNameMap.get(uid) || uid.slice(0, 8),
        results: [],
      });
    }
    for (const row of data) {
      const entry = userMap.get(row.user_id);
      if (entry) entry.results.push(row);
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

    // 全ユーザーの最大回数を求めてカテゴリを生成
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
        name: `${val.name}`,
        type: "spline",
        yAxis: 0,
        data: val.results.map((r: { avg_response_ms: number }) =>
          r.avg_response_ms > 0
            ? Math.round((60000 / r.avg_response_ms) * 10) / 10
            : 0,
        ),
        tooltip: { valueSuffix: " /分" },
        color,
        lineWidth: isCurrent ? 3 : 1.5,
        marker: { symbol: "circle", radius: isCurrent ? 4 : 3 },
        dashStyle: isCurrent ? "Solid" : "ShortDash",
      });
      series.push({
        name: `${val.name} (ミス率)`,
        type: "spline",
        yAxis: 1,
        data: val.results.map(
          (r: { accuracy: number }) => Math.round((100 - r.accuracy) * 10) / 10,
        ),
        tooltip: { valueSuffix: "%" },
        color: isCurrent ? "#e74c3c" : "#e8a0a0",
        lineWidth: isCurrent ? 2 : 1,
        marker: { symbol: "diamond", radius: isCurrent ? 3 : 2 },
        dashStyle: "ShortDot",
        visible: false,
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
        style: { color: textColor, fontSize: "18px", fontFamily: "inherit" },
      },
      xAxis: {
        categories,
        labels: {
          style: { color: textColor, fontSize: "12px", fontFamily: "inherit" },
        },
        lineColor: textColor,
        lineWidth: 1,
        title: { text: "回数", style: { color: textColor } },
      },
      yAxis: [
        {
          min: 0,
          gridLineColor: gridColor,
          lineColor: gridColor,
          lineWidth: 1,
          title: { text: "" },
          labels: {
            format: "{value}/M ",
            style: {
              color: textColor,
              fontSize: "12px",
              fontFamily: "inherit",
            },
          },
          tickInterval: 5,
        },
        {
          min: 0,
          max: 100,
          title: { text: "" },
          labels: {
            format: "{value}%",
            style: {
              color: "#aB96f1",
              fontSize: "12px",
              fontFamily: "inherit",
            },
          },
          opposite: true,
          lineWidth: 0, // 線の表示を消す
          tickInterval: 5,
        },
      ],
      tooltip: { shared: true },
      legend: {
        enabled: false, // Hide legend by default as requested
        itemStyle: {
          color: textColor,
          fontSize: "12px",
          fontFamily: "inherit",
        },
      },
      series,
    });
    setIsCompareMode(true);
    setShowHistory(true);
  }, [userId, darkMode]);

  const accuracy =
    stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  // 試験結果の集計
  const examCorrectCount = examResults.filter((r) => r.correct).length;
  const examAccuracy =
    examResults.length > 0
      ? Math.round((examCorrectCount / examResults.length) * 100)
      : 0;
  const examCorrectResults = examResults.filter((r) => r.correct);
  const examAvgMs =
    examCorrectResults.length > 0
      ? Math.round(
          examCorrectResults.reduce((s, r) => s + r.responseMs, 0) /
            examCorrectResults.length,
        )
      : 0;
  // 譜読み速度 = 正解数 / 経過時間(分)
  const examReadsPerMin =
    examElapsedMs > 0 && examCorrectCount > 0
      ? Math.round((examCorrectCount / (examElapsedMs / 60000)) * 10) / 10
      : 0;

  // 共通のボタンスタイル
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "20px",
        gap: "16px",
        perspective: "600px",
      }}
    >
      <style>{`
        @keyframes cardFlipIn {
          0% {
            opacity: 0;
            transform: rotateY(-90deg) scale(0.9);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: rotateY(0deg) scale(1);
          }
        }
      `}</style>

      {/* モード切替 + 音部記号セレクタ */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* 自由/試験モード切替 */}
        <button
          onClick={() => {
            setPracticeMode("free");
            setExamPhase("setup");
            setStats({ correct: 0, total: 0 });
            nextNote();
          }}
          style={modeButtonStyle(practiceMode === "free")}
        >
          自由モード
        </button>
        <button
          onClick={() => {
            setPracticeMode("exam");
            setExamPhase("setup");
            setSaveSuccess(false);
          }}
          style={modeButtonStyle(practiceMode === "exam")}
        >
          試験モード
        </button>

        <div
          style={{
            width: "1px",
            height: "24px",
            backgroundColor: borderColor,
            margin: "0 4px",
            alignSelf: "center",
          }}
        />

        {/* 音部記号セレクタ */}
        {(
          [
            { value: "treble" as const, label: "ト音記号" },
            { value: "bass" as const, label: "ヘ音記号" },
            { value: "both" as const, label: "両方" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleClefModeChange(opt.value)}
            disabled={practiceMode === "exam" && examPhase === "playing"}
            style={{
              ...modeButtonStyle(clefMode === opt.value),
              opacity:
                practiceMode === "exam" && examPhase === "playing" ? 0.5 : 1,
              cursor:
                practiceMode === "exam" && examPhase === "playing"
                  ? "default"
                  : "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}

        {/* 履歴ボタン */}
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
      {practiceMode === "free" && (
        <>
          <div
            key={animKey}
            style={{
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              justifyContent: "center",
              animation: "cardFlipIn 0.35s ease-out",
              borderRadius: "12px",
              padding: "4px",
              boxShadow:
                feedbackState === "correct"
                  ? "0 0 16px 4px rgba(76, 175, 80, 0.5)"
                  : feedbackState === "incorrect"
                    ? "0 0 16px 4px rgba(255, 68, 68, 0.5)"
                    : "none",
              transition: "box-shadow 0.3s",
            }}
          >
            {currentNote && (
              <StaffNoteSVG
                note={currentNote}
                feedbackState={feedbackState}
                showNoteName={feedbackState !== "none"}
                darkMode={darkMode}
              />
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {NATURAL_STEPS.map((step) => (
              <button
                key={step}
                onClick={() => handleButtonAnswer(step)}
                disabled={feedbackState !== "none"}
                style={{
                  width: "48px",
                  height: "48px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  borderWidth: "1.5px",
                  borderStyle: "solid",
                  borderColor:
                    feedbackState !== "none" && currentNote?.step === step
                      ? feedbackState === "correct"
                        ? "#4CAF50"
                        : "#FF4444"
                      : borderColor,
                  backgroundColor:
                    feedbackState !== "none" && currentNote?.step === step
                      ? feedbackState === "correct"
                        ? darkMode
                          ? "rgba(76, 175, 80, 0.3)"
                          : "rgba(76, 175, 80, 0.15)"
                        : darkMode
                          ? "rgba(255, 68, 68, 0.3)"
                          : "rgba(255, 68, 68, 0.15)"
                      : "transparent",
                  color: frColor,
                  cursor: feedbackState !== "none" ? "default" : "pointer",
                  opacity: feedbackState !== "none" ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {step}
              </button>
            ))}
          </div>

          {stats.total > 0 && (
            <div
              style={{
                fontSize: "14px",
                color: frColor,
                opacity: 0.7,
                marginTop: "8px",
              }}
            >
              正解: {stats.correct}/{stats.total} ({accuracy}%)
            </div>
          )}
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
          <div style={{ fontSize: "18px", fontWeight: "bold", color: frColor }}>
            試験モード
          </div>
          <div style={{ fontSize: "14px", color: frColor, opacity: 0.8 }}>
            問題数を選択してください
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {[10, 20].map((count) => (
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
      {practiceMode === "exam" && examPhase === "playing" && (
        <>
          {/* 進捗表示 */}
          <div
            style={{
              fontSize: "14px",
              color: frColor,
              fontWeight: "bold",
            }}
          >
            {examCurrentIndex + 1} / {examQuestionCount}
          </div>

          <div
            key={animKey}
            style={{
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              justifyContent: "center",
              animation: "cardFlipIn 0.35s ease-out",
              borderRadius: "12px",
              padding: "4px",
              boxShadow:
                feedbackState === "correct"
                  ? "0 0 16px 4px rgba(76, 175, 80, 0.5)"
                  : feedbackState === "incorrect"
                    ? "0 0 16px 4px rgba(255, 68, 68, 0.5)"
                    : "none",
              transition: "box-shadow 0.3s",
            }}
          >
            {currentNote && (
              <StaffNoteSVG
                note={currentNote}
                feedbackState={feedbackState}
                showNoteName={feedbackState !== "none"}
                darkMode={darkMode}
              />
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {NATURAL_STEPS.map((step) => (
              <button
                key={step}
                onClick={() => handleButtonAnswer(step)}
                disabled={feedbackState !== "none"}
                style={{
                  width: "48px",
                  height: "48px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  borderWidth: "1.5px",
                  borderStyle: "solid",
                  borderColor:
                    feedbackState !== "none" && currentNote?.step === step
                      ? feedbackState === "correct"
                        ? "#4CAF50"
                        : "#FF4444"
                      : borderColor,
                  backgroundColor:
                    feedbackState !== "none" && currentNote?.step === step
                      ? feedbackState === "correct"
                        ? darkMode
                          ? "rgba(76, 175, 80, 0.3)"
                          : "rgba(76, 175, 80, 0.15)"
                        : darkMode
                          ? "rgba(255, 68, 68, 0.3)"
                          : "rgba(255, 68, 68, 0.15)"
                      : "transparent",
                  color: frColor,
                  cursor: feedbackState !== "none" ? "default" : "pointer",
                  opacity: feedbackState !== "none" ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {step}
              </button>
            ))}
          </div>

          {/* プログレスバー */}
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "4px",
              backgroundColor: darkMode
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((examCurrentIndex + 1) / examQuestionCount) * 100}%`,
                height: "100%",
                backgroundColor: highlightColor,
                transition: "width 0.3s",
              }}
            />
          </div>
        </>
      )}

      {/* === 試験モード: 結果画面 === */}
      {practiceMode === "exam" && examPhase === "result" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: "bold", color: frColor }}>
            結果
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              gap: "8px 24px",
              fontSize: "16px",
              color: frColor,
            }}
          >
            <div style={{ opacity: 0.7 }}>正解率:</div>
            <div style={{ fontWeight: "bold" }}>
              {examCorrectCount}/{examResults.length} ({examAccuracy}%)
            </div>
            <div style={{ opacity: 0.7 }}>平均回答時間:</div>
            <div style={{ fontWeight: "bold" }}>
              {examAvgMs < 1000
                ? `${examAvgMs}ms`
                : `${(examAvgMs / 1000).toFixed(1)}秒`}
            </div>
            <div style={{ opacity: 0.7 }}>譜読み速度:</div>
            <div style={{ fontWeight: "bold" }}>{examReadsPerMin}回/分</div>
            <div style={{ opacity: 0.7 }}>総経過時間:</div>
            <div style={{ fontWeight: "bold" }}>
              {examElapsedMs < 60000
                ? `${(examElapsedMs / 1000).toFixed(1)}秒`
                : `${Math.floor(examElapsedMs / 60000)}分${Math.round((examElapsedMs % 60000) / 1000)}秒`}
            </div>
            <div style={{ opacity: 0.7 }}>音部記号:</div>
            <div style={{ fontWeight: "bold" }}>
              {clefMode === "treble"
                ? "ト音記号"
                : clefMode === "bass"
                  ? "ヘ音記号"
                  : "両方"}
            </div>
          </div>

          {/* 評価 */}
          <div
            style={{
              fontSize: "14px",
              color:
                examAccuracy >= 90
                  ? "#4CAF50"
                  : examAccuracy >= 70
                    ? highlightColor
                    : "#FF4444",
              fontWeight: "bold",
            }}
          >
            {examAccuracy >= 90 && examAvgMs < 2000
              ? "素晴らしい！上級者レベルです"
              : examAccuracy >= 90
                ? "正解率は優秀！速度を上げましょう"
                : examAccuracy >= 70
                  ? "良い調子！継続して練習しましょう"
                  : "苦手な音符を重点的に練習しましょう"}
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
                {isCompareMode ? "ユーザー比較" : "譜読み練習 履歴"}
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

SightReadingFlashcard.displayName = "SightReadingFlashcard";

export default SightReadingFlashcard;
