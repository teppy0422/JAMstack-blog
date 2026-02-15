"use client";

import {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import StaffChordSVG from "./StaffChordSVG";
import {
  generateRandomChord,
  generateChord,
  PRACTICE_CHORDS,
  NATURAL_STEPS,
  type ChordQuestion,
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

export interface ChordPracticeFlashcardRef {
  handleCorrectAnswer: () => void;
  handleIncorrectAnswer: () => void;
}

type ClefMode = "treble" | "bass" | "both";
type PracticeMode = "learn" | "quality" | "exam";

// 基本モード用: C〜Bの7つのメジャーコード
const LEARN_ROOT_MIDIS: { step: string; midi: number }[] = NATURAL_STEPS.map(
  (step) => {
    const STEP_MIDI: Record<string, number> = {
      C: 60,
      D: 62,
      E: 64,
      F: 65,
      G: 67,
      A: 69,
      B: 71,
    };
    return { step, midi: STEP_MIDI[step] };
  },
);
const LEARN_CHORD_DEF = PRACTICE_CHORDS[0]; // major
const LEARN_TOTAL = LEARN_ROOT_MIDIS.length; // 7

// 品質モード用: コードクオリティの学習順序
// Maj → min → dim → aug → Maj7 → m7 → 7
const QUALITY_CHORD_DEFS = [
  PRACTICE_CHORDS[0], // major
  PRACTICE_CHORDS[1], // minor
  PRACTICE_CHORDS[2], // dim
  PRACTICE_CHORDS[3], // aug
  PRACTICE_CHORDS[4], // maj7
  PRACTICE_CHORDS[5], // m7
  PRACTICE_CHORDS[6], // 7
];
const QUALITY_DESCRIPTIONS: Record<
  string,
  { rule: string; character: string; reading: string }
> = {
  major: {
    rule: "基準のコード（1 - 3 - 5）",
    character: "明るく安定した響き",
    reading: "メジャー",
  },
  minor: {
    rule: "3度が半音下がる（1 - b3 - 5）",
    character: "暗く悲しげな響き",
    reading: "マイナー",
  },
  dim: {
    rule: "3度と5度が半音下がる（1 - b3 - b5）",
    character: "不安定で緊張感のある響き",
    reading: "ディミニッシュ",
  },
  aug: {
    rule: "5度が半音上がる（1 - 3 - #5）",
    character: "浮遊感のある不思議な響き",
    reading: "オーギュメント",
  },
  maj7: {
    rule: "Majに長7度を追加（1 - 3 - 5 - 7）",
    character: "おしゃれで柔らかい響き",
    reading: "メジャーセブンス",
  },
  m7: {
    rule: "minに短7度を追加（1 - b3 - 5 - b7）",
    character: "哀愁がありつつ落ち着いた響き",
    reading: "マイナーセブンス",
  },
  "7": {
    rule: "Majに短7度を追加（1 - 3 - 5 - b7）",
    character: "次のコードへ進みたくなる響き",
    reading: "セブンス",
  },
};
// 品質モード: ルート7個 × クオリティ7種 = 49ステップ
const QUALITY_TOTAL = LEARN_ROOT_MIDIS.length * QUALITY_CHORD_DEFS.length; // 49

type ExamPhase = "setup" | "playing" | "result";

interface ChordExamQuestionResult {
  rootMidi: number;
  chordType: string;
  clef: "treble" | "bass";
  correct: boolean;
  responseMs: number;
}

interface WeakChord {
  root_midi: number;
  chord_type: string;
  clef: string;
  miss_count: number;
  total_count: number;
  avg_response_ms: number;
}

interface ChordPracticeFlashcardProps {
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

const ChordPracticeFlashcard = forwardRef<
  ChordPracticeFlashcardRef,
  ChordPracticeFlashcardProps
>(function ChordPracticeFlashcard(
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
        (localStorage.getItem("chordPracticeClefMode") as ClefMode) || "treble"
      );
    }
    return "treble";
  });
  const [currentChord, setCurrentChord] = useState<ChordQuestion | null>(null);
  const currentChordRef = useRef<ChordQuestion | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [feedbackState, setFeedbackState] = useState<
    "none" | "correct" | "incorrect"
  >("none");
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 基本モード関連
  const [learnIndex, setLearnIndex] = useState(0);

  // 品質モード関連
  const [qualityIndex, setQualityIndex] = useState(0);

  // モード関連
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("learn");
  const [examPhase, setExamPhase] = useState<ExamPhase>("setup");
  const [examQuestionCount, setExamQuestionCount] = useState(10);
  const [examCurrentIndex, setExamCurrentIndex] = useState(0);
  const [examResults, setExamResults] = useState<ChordExamQuestionResult[]>([]);
  const questionStartTimeRef = useRef<number>(0);
  const examStartTimeRef = useRef<number>(0);
  const [examElapsedMs, setExamElapsedMs] = useState(0);
  const [weakChords, setWeakChords] = useState<WeakChord[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 履歴グラフ
  const [showHistory, setShowHistory] = useState(false);
  const [historyChartOptions, setHistoryChartOptions] = useState<object>({});
  const [isCompareMode, setIsCompareMode] = useState(false);

  const getClef = useCallback((): "treble" | "bass" => {
    if (clefMode === "both") {
      return Math.random() < 0.5 ? "treble" : "bass";
    }
    return clefMode;
  }, [clefMode]);

  // 次の和音を生成
  const nextChord = useCallback(() => {
    const clef = getClef();
    const chord = generateRandomChord(
      clef,
      PRACTICE_CHORDS,
      currentChordRef.current?.root.midi,
    );
    setCurrentChord(chord);
    currentChordRef.current = chord;
    setAnimKey((k) => k + 1);
    setFeedbackState("none");
    onExpectedNotesChange(chord.midiNotes);
    onWrongNotesReset();
    if (practiceMode === "exam" && examPhase === "playing") {
      questionStartTimeRef.current = Date.now();
    }
  }, [
    getClef,
    practiceMode,
    examPhase,
    onExpectedNotesChange,
    onWrongNotesReset,
  ]);

  // 初回マウント
  useEffect(() => {
    if (practiceMode === "learn") {
      goToLearnIndex(0);
    } else {
      nextChord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 苦手データをDBからロード
  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("chord_practice_weak_chords")
        .select("*")
        .eq("user_id", userId);
      if (!error && data) setWeakChords(data);
    };
    load();
  }, [userId]);

  const handleClefModeChange = useCallback(
    (mode: ClefMode) => {
      setClefMode(mode);
      localStorage.setItem("chordPracticeClefMode", mode);
      const clef =
        mode === "both" ? (Math.random() < 0.5 ? "treble" : "bass") : mode;
      const chord = generateRandomChord(
        clef,
        PRACTICE_CHORDS,
        currentChordRef.current?.root.midi,
      );
      setCurrentChord(chord);
      currentChordRef.current = chord;
      setAnimKey((k) => k + 1);
      setFeedbackState("none");
      setStats({ correct: 0, total: 0 });
      onExpectedNotesChange(chord.midiNotes);
      onWrongNotesReset();
    },
    [onExpectedNotesChange, onWrongNotesReset],
  );

  // 基本モード: インデックスからメジャーコードを生成
  const getLearnChord = useCallback(
    (index: number): ChordQuestion => {
      const root = LEARN_ROOT_MIDIS[index];
      return generateChord(
        root.midi,
        LEARN_CHORD_DEF,
        clefMode === "bass" ? "bass" : "treble",
      );
    },
    [clefMode],
  );

  const goToLearnIndex = useCallback(
    (index: number) => {
      const wrapped = ((index % LEARN_TOTAL) + LEARN_TOTAL) % LEARN_TOTAL;
      setLearnIndex(wrapped);
      const chord = getLearnChord(wrapped);
      setCurrentChord(chord);
      currentChordRef.current = chord;
      setAnimKey((k) => k + 1);
      setFeedbackState("none");
      onExpectedNotesChange(chord.midiNotes);
      onWrongNotesReset();
    },
    [getLearnChord, onExpectedNotesChange, onWrongNotesReset],
  );

  // 品質モード: インデックスからコードを生成
  const getQualityChord = useCallback(
    (index: number): ChordQuestion => {
      const rootIdx = Math.floor(index / QUALITY_CHORD_DEFS.length);
      const qualIdx = index % QUALITY_CHORD_DEFS.length;
      const root = LEARN_ROOT_MIDIS[rootIdx];
      const chordDef = QUALITY_CHORD_DEFS[qualIdx];
      return generateChord(
        root.midi,
        chordDef,
        clefMode === "bass" ? "bass" : "treble",
      );
    },
    [clefMode],
  );

  const goToQualityIndex = useCallback(
    (index: number) => {
      const wrapped = ((index % QUALITY_TOTAL) + QUALITY_TOTAL) % QUALITY_TOTAL;
      setQualityIndex(wrapped);
      const chord = getQualityChord(wrapped);
      setCurrentChord(chord);
      currentChordRef.current = chord;
      setAnimKey((k) => k + 1);
      setFeedbackState("none");
      onExpectedNotesChange(chord.midiNotes);
      onWrongNotesReset();
    },
    [getQualityChord, onExpectedNotesChange, onWrongNotesReset],
  );

  // フィードバック後に次へ
  const advanceAfterFeedback = useCallback(() => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      if (practiceMode === "learn") {
        goToLearnIndex(learnIndex + 1);
        feedbackTimerRef.current = null;
        return;
      }
      if (practiceMode === "quality") {
        goToQualityIndex(qualityIndex + 1);
        feedbackTimerRef.current = null;
        return;
      }
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
      nextChord();
      feedbackTimerRef.current = null;
    }, 800);
  }, [
    nextChord,
    practiceMode,
    examPhase,
    examCurrentIndex,
    examQuestionCount,
    goToLearnIndex,
    learnIndex,
    goToQualityIndex,
    qualityIndex,
  ]);

  // 正解
  const handleCorrect = useCallback(() => {
    if (feedbackState !== "none") return;
    setFeedbackState("correct");
    setStats((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    if (practiceMode === "exam" && examPhase === "playing" && currentChord) {
      const responseMs = Date.now() - questionStartTimeRef.current;
      setExamResults((prev) => [
        ...prev,
        {
          rootMidi: currentChord.root.midi,
          chordType: currentChord.chordType,
          clef: currentChord.clef,
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
    currentChord,
  ]);

  // 不正解
  const handleIncorrect = useCallback(() => {
    if (feedbackState !== "none") return;
    setFeedbackState("incorrect");
    setStats((prev) => ({ ...prev, total: prev.total + 1 }));
    if (practiceMode === "exam" && examPhase === "playing" && currentChord) {
      const responseMs = Date.now() - questionStartTimeRef.current;
      setExamResults((prev) => [
        ...prev,
        {
          rootMidi: currentChord.root.midi,
          chordType: currentChord.chordType,
          clef: currentChord.clef,
          correct: false,
          responseMs,
        },
      ]);
    }
    // 基本・品質モードでは不正解時に進まず、同じ問題をやり直す
    if (practiceMode === "learn" || practiceMode === "quality") {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = setTimeout(() => {
        setFeedbackState("none");
        onWrongNotesReset();
        feedbackTimerRef.current = null;
      }, 800);
      return;
    }
    advanceAfterFeedback();
  }, [
    feedbackState,
    advanceAfterFeedback,
    practiceMode,
    examPhase,
    currentChord,
  ]);

  // MIDI経由
  useImperativeHandle(
    ref,
    () => ({
      handleCorrectAnswer: () => handleCorrect(),
      handleIncorrectAnswer: () => handleIncorrect(),
    }),
    [handleCorrect, handleIncorrect],
  );

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
    const chord = generateRandomChord(clef, PRACTICE_CHORDS, undefined);
    setCurrentChord(chord);
    currentChordRef.current = chord;
    setAnimKey((k) => k + 1);
    setFeedbackState("none");
    onExpectedNotesChange(chord.midiNotes);
    onWrongNotesReset();
    questionStartTimeRef.current = Date.now();
  }, [getClef, onExpectedNotesChange, onWrongNotesReset]);

  // 試験結果をDBに保存
  const saveExamResult = useCallback(async () => {
    if (!userId || examResults.length === 0) return;
    setIsSaving(true);
    try {
      const correctCount = examResults.filter((r) => r.correct).length;
      const accuracy = (correctCount / examResults.length) * 100;
      const avgResponseMs =
        correctCount > 0 && examElapsedMs > 0
          ? examElapsedMs / correctCount
          : examResults.reduce((s, r) => s + r.responseMs, 0) /
            examResults.length;

      const { error: resultError } = await supabase
        .from("chord_practice_results")
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
        console.error("Error saving chord exam result:", resultError);
        setIsSaving(false);
        return;
      }

      // 苦手データ更新
      const chordMap = new Map<
        string,
        {
          rootMidi: number;
          chordType: string;
          clef: string;
          misses: number;
          total: number;
          totalMs: number;
        }
      >();
      for (const r of examResults) {
        const key = `${r.rootMidi}-${r.chordType}-${r.clef}`;
        const existing = chordMap.get(key) || {
          rootMidi: r.rootMidi,
          chordType: r.chordType,
          clef: r.clef,
          misses: 0,
          total: 0,
          totalMs: 0,
        };
        existing.total++;
        existing.totalMs += r.responseMs;
        if (!r.correct) existing.misses++;
        chordMap.set(key, existing);
      }

      for (const entry of chordMap.values()) {
        const { data: existing } = await supabase
          .from("chord_practice_weak_chords")
          .select("*")
          .eq("user_id", userId)
          .eq("root_midi", entry.rootMidi)
          .eq("chord_type", entry.chordType)
          .eq("clef", entry.clef)
          .single();

        if (existing) {
          const newTotal = existing.total_count + entry.total;
          const newMiss = existing.miss_count + entry.misses;
          const newAvgMs =
            (existing.avg_response_ms * existing.total_count + entry.totalMs) /
            newTotal;
          await supabase
            .from("chord_practice_weak_chords")
            .update({
              miss_count: newMiss,
              total_count: newTotal,
              avg_response_ms: Math.round(newAvgMs),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("chord_practice_weak_chords").insert([
            {
              user_id: userId,
              root_midi: entry.rootMidi,
              chord_type: entry.chordType,
              clef: entry.clef,
              miss_count: entry.misses,
              total_count: entry.total,
              avg_response_ms: Math.round(entry.totalMs / entry.total),
            },
          ]);
        }
      }

      const { data: refreshed } = await supabase
        .from("chord_practice_weak_chords")
        .select("*")
        .eq("user_id", userId);
      if (refreshed) setWeakChords(refreshed);

      setSaveSuccess(true);
    } catch (e) {
      console.error("Error saving chord exam data:", e);
    } finally {
      setIsSaving(false);
    }
  }, [userId, examResults, clefMode, examElapsedMs]);

  // 履歴グラフ
  const loadHistory = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("chord_practice_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) {
      setHistoryChartOptions({});
      setIsCompareMode(false);
      setShowHistory(true);
      return;
    }

    const readsPerMin = data.map((d: { avg_response_ms: number }) =>
      d.avg_response_ms > 0
        ? Math.round((60000 / d.avg_response_ms) * 10) / 10
        : 0,
    );
    const missRates = data.map(
      (d: { accuracy: number }) => Math.round((100 - d.accuracy) * 10) / 10,
    );
    const categories = data.map((_: unknown, i: number) => String(i + 1));
    const ids = data.map((d: { id: string }) => d.id);

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
          labels: { format: "{value}%", style: { color: "#aB96f1" } },
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
          type: "spline",
          data: missRates.map((m: number, i: number) => ({ y: m, id: ids[i] })),
          tooltip: { valueSuffix: "%" },
          color: "#dBc6f1",
          marker: { symbol: "circle" },
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
                if (id) deleteHistoryItem(id);
              },
            },
          },
        },
      },
    });
    setIsCompareMode(false);
    setShowHistory(true);
  }, [userId, darkMode]);

  const deleteHistoryItem = useCallback(
    async (id: string) => {
      const { error } = await supabase
        .from("chord_practice_results")
        .delete()
        .eq("id", id);
      if (!error) loadHistory();
    },
    [loadHistory],
  );

  // 全ユーザー比較
  const loadComparison = useCallback(async () => {
    const { data, error } = await supabase
      .from("chord_practice_results")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      setHistoryChartOptions({});
      setIsCompareMode(true);
      setShowHistory(true);
      return;
    }

    const uniqueUserIds = [...new Set(data.map((d) => d.user_id))];
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
          lineWidth: 0,
          tickInterval: 5,
        },
      ],
      tooltip: { shared: true },
      legend: {
        enabled: false,
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
  const examReadsPerMin =
    examElapsedMs > 0 && examCorrectCount > 0
      ? Math.round((examCorrectCount / (examElapsedMs / 60000)) * 10) / 10
      : 0;

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

  // ── JSX ──

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

      {/* モード切替 + 音部記号セレクタ */}
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
            setPracticeMode("learn");
            goToLearnIndex(0);
            setStats({ correct: 0, total: 0 });
          }}
          style={modeButtonStyle(practiceMode === "learn")}
        >
          基本
        </button>
        <button
          onClick={() => {
            setPracticeMode("quality");
            goToQualityIndex(0);
            setStats({ correct: 0, total: 0 });
          }}
          style={modeButtonStyle(practiceMode === "quality")}
        >
          品質
        </button>
        <button
          onClick={() => {
            setPracticeMode("exam");
            setExamPhase("setup");
            setSaveSuccess(false);
          }}
          style={modeButtonStyle(practiceMode === "exam")}
        >
          試験
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
            disabled={
              (practiceMode === "exam" && examPhase === "playing") ||
              practiceMode === "learn" ||
              practiceMode === "quality"
            }
            style={{
              ...modeButtonStyle(clefMode === opt.value),
              opacity:
                (practiceMode === "exam" && examPhase === "playing") ||
                practiceMode === "learn" ||
                practiceMode === "quality"
                  ? 0.5
                  : 1,
              cursor:
                (practiceMode === "exam" && examPhase === "playing") ||
                practiceMode === "learn" ||
                practiceMode === "quality"
                  ? "default"
                  : "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}

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

      {/* === 基本モード === */}
      {practiceMode === "learn" &&
        currentChord &&
        (() => {
          const rootStep = LEARN_ROOT_MIDIS[learnIndex].step;

          return (
            <>
              {/* コード名 */}
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color:
                    feedbackState === "correct"
                      ? "#4CAF50"
                      : feedbackState === "incorrect"
                        ? "#FF4444"
                        : frColor,
                  transition: "color 0.2s",
                }}
              >
                {rootStep}
              </div>

              {/* 五線譜 */}
              <div
                key={animKey}
                style={{
                  width: "100%",
                  maxWidth: "400px",
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
                <StaffChordSVG
                  notes={currentChord.notes}
                  feedbackState={feedbackState}
                  darkMode={darkMode}
                />
              </div>

              {/* ナビゲーション + スタッツ */}
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <button
                  onClick={() => goToLearnIndex(learnIndex - 1)}
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
                  &lt; 前へ
                </button>
                <div style={{ fontSize: "13px", color: frColor, opacity: 0.6 }}>
                  {learnIndex + 1} / {LEARN_TOTAL}
                </div>
                <button
                  onClick={() => goToLearnIndex(learnIndex + 1)}
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
                  次へ &gt;
                </button>
              </div>
              {stats.total > 0 && (
                <div style={{ fontSize: "14px", color: frColor, opacity: 0.7 }}>
                  正解: {stats.correct}/{stats.total} ({accuracy}%)
                </div>
              )}
            </>
          );
        })()}

      {/* === 品質モード === */}
      {practiceMode === "quality" &&
        currentChord &&
        (() => {
          const rootIdx = Math.floor(qualityIndex / QUALITY_CHORD_DEFS.length);
          const qualIdx = qualityIndex % QUALITY_CHORD_DEFS.length;
          const rootStep = LEARN_ROOT_MIDIS[rootIdx].step;
          const chordDef = QUALITY_CHORD_DEFS[qualIdx];
          const desc = QUALITY_DESCRIPTIONS[chordDef.type];

          return (
            <>
              {/* コード名 */}
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  color:
                    feedbackState === "correct"
                      ? "#4CAF50"
                      : feedbackState === "incorrect"
                        ? "#FF4444"
                        : frColor,
                  transition: "color 0.2s",
                }}
              >
                {currentChord.chordLabel}
                {desc && (
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "normal",
                      opacity: 0.6,
                    }}
                  >
                    {desc.reading}
                  </div>
                )}
              </div>

              {/* 解説 */}
              {desc && (
                <div
                  style={{
                    fontSize: "14px",
                    color: frColor,
                    opacity: 0.8,
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  <div>{desc.rule}</div>
                  <div style={{ fontSize: "13px", opacity: 0.7 }}>
                    {desc.character}
                  </div>
                </div>
              )}

              {/* 五線譜 */}
              <div
                key={animKey}
                style={{
                  width: "100%",
                  maxWidth: "400px",
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
                <StaffChordSVG
                  notes={currentChord.notes}
                  feedbackState={feedbackState}
                  darkMode={darkMode}
                />
              </div>

              {/* ナビゲーション */}
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <button
                  onClick={() => goToQualityIndex(qualityIndex - 1)}
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
                  &lt; 前へ
                </button>
                <div style={{ fontSize: "13px", color: frColor, opacity: 0.6 }}>
                  {rootStep}: {qualIdx + 1}/{QUALITY_CHORD_DEFS.length}
                </div>
                <button
                  onClick={() => goToQualityIndex(qualityIndex + 1)}
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
                  次へ &gt;
                </button>
              </div>
              {stats.total > 0 && (
                <div style={{ fontSize: "14px", color: frColor, opacity: 0.7 }}>
                  正解: {stats.correct}/{stats.total} ({accuracy}%)
                </div>
              )}
            </>
          );
        })()}

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
          <div style={{ fontSize: "14px", color: frColor, fontWeight: "bold" }}>
            {examCurrentIndex + 1} / {examQuestionCount}
          </div>

          {/* コード名 */}
          {currentChord && (
            <div
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                color:
                  feedbackState === "correct"
                    ? "#4CAF50"
                    : feedbackState === "incorrect"
                      ? "#FF4444"
                      : frColor,
                transition: "color 0.2s",
              }}
            >
              {currentChord.chordLabel}
            </div>
          )}

          <div
            key={animKey}
            style={{
              width: "100%",
              maxWidth: "400px",
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
            {currentChord && (
              <StaffChordSVG
                notes={currentChord.notes}
                feedbackState={feedbackState}
                darkMode={darkMode}
              />
            )}
          </div>
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
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: "bold", color: frColor }}>
            結果
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              fontSize: "16px",
              color: frColor,
            }}
          >
            <div>
              正解率: <strong>{examAccuracy}%</strong>
            </div>
            <div>
              {examCorrectCount}/{examResults.length}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              fontSize: "14px",
              color: frColor,
              opacity: 0.8,
            }}
          >
            <div>平均応答: {examAvgMs}ms</div>
            <div>速度: {examReadsPerMin}/分</div>
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
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                {isSaving
                  ? "保存中..."
                  : saveSuccess
                    ? "保存済み"
                    : "結果を保存"}
              </button>
            )}
            <button
              onClick={() => {
                setExamPhase("setup");
                setSaveSuccess(false);
              }}
              style={modeButtonStyle(false)}
            >
              もう一度
            </button>
          </div>
        </div>
      )}

      {/* === 履歴グラフ === */}
      {showHistory && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowHistory(false)}
        >
          <div
            style={{
              backgroundColor: darkMode ? "#1a1a2e" : "#fff",
              borderRadius: "12px",
              padding: "20px",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={loadHistory}
                  style={modeButtonStyle(!isCompareMode)}
                >
                  自分
                </button>
                <button
                  onClick={loadComparison}
                  style={modeButtonStyle(isCompareMode)}
                >
                  比較
                </button>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: frColor,
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
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
                  color: frColor,
                  padding: "40px",
                  opacity: 0.6,
                }}
              >
                データがありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default ChordPracticeFlashcard;
