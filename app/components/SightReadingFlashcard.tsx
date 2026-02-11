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

export interface SightReadingFlashcardRef {
  /** MIDI経由で正解した時に呼ばれる */
  handleCorrectAnswer: () => void;
}

type ClefMode = "treble" | "bass" | "both";

interface SightReadingFlashcardProps {
  onExpectedNotesChange: (midiNotes: number[]) => void;
  wrongNotes: number[];
  onWrongNotesReset: () => void;
  darkMode: boolean;
  highlightColor: string;
  borderColor: string;
  frColor: string;
  bgColor: string;
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
  },
  ref,
) {
  const [clefMode, setClefMode] = useState<ClefMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sightReadingClefMode") as ClefMode) || "treble";
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

  // 現在の音部記号を決定（"both"モードでは交互）
  const getClef = useCallback((): "treble" | "bass" => {
    if (clefMode === "both") {
      return Math.random() < 0.5 ? "treble" : "bass";
    }
    return clefMode;
  }, [clefMode]);

  // 次の音符を生成（前回と同じ音を避ける）
  const nextNote = useCallback(() => {
    const clef = getClef();
    const note = generateRandomNote(clef, false, currentNoteRef.current?.midi);
    setCurrentNote(note);
    currentNoteRef.current = note;
    setAnimKey((k) => k + 1);
    setFeedbackState("none");
    onExpectedNotesChange([note.midi]);
    onWrongNotesReset();
  }, [getClef, onExpectedNotesChange, onWrongNotesReset]);

  // 初回マウント時に音符を生成
  useEffect(() => {
    nextNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // clefMode変更時にlocalStorageに保存 & 新しい音符を生成
  const handleClefModeChange = useCallback(
    (mode: ClefMode) => {
      setClefMode(mode);
      localStorage.setItem("sightReadingClefMode", mode);
      // 新しい音符を即座に生成
      const clef =
        mode === "both" ? (Math.random() < 0.5 ? "treble" : "bass") : mode;
      const note = generateRandomNote(clef, false, currentNoteRef.current?.midi);
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
      nextNote();
      feedbackTimerRef.current = null;
    }, 1000);
  }, [nextNote]);

  // 正解処理
  const handleCorrect = useCallback(() => {
    if (feedbackState !== "none") return; // 既にフィードバック中
    setFeedbackState("correct");
    setStats((prev) => ({
      correct: prev.correct + 1,
      total: prev.total + 1,
    }));
    advanceAfterFeedback();
  }, [feedbackState, advanceAfterFeedback]);

  // 不正解処理
  const handleIncorrect = useCallback(() => {
    if (feedbackState !== "none") return;
    setFeedbackState("incorrect");
    setStats((prev) => ({ ...prev, total: prev.total + 1 }));
    advanceAfterFeedback();
  }, [feedbackState, advanceAfterFeedback]);

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

  // MIDI経由の正解（page.tsxのhandleMidiMatchから呼ばれる）
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

  const accuracy =
    stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

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
      {/* カードアニメーション用キーフレーム */}
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
      {/* 音部記号セレクタ */}
      <div style={{ display: "flex", gap: "6px" }}>
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
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              borderRadius: "6px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor:
                clefMode === opt.value ? highlightColor : borderColor,
              backgroundColor:
                clefMode === opt.value
                  ? darkMode
                    ? `${highlightColor}40`
                    : `${highlightColor}20`
                  : "transparent",
              color: frColor,
              cursor: "pointer",
              fontWeight: clefMode === opt.value ? "bold" : "normal",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 五線譜表示（カードアニメーション） */}
      <div
        key={animKey}
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          justifyContent: "center",
          animation: "cardFlipIn 0.35s ease-out",
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

      {/* フィードバック表示 */}
      <div
        style={{
          height: "28px",
          fontSize: "18px",
          fontWeight: "bold",
          color:
            feedbackState === "correct"
              ? "#4CAF50"
              : feedbackState === "incorrect"
                ? "#FF4444"
                : "transparent",
          transition: "color 0.2s",
        }}
      >
        {feedbackState === "correct" && "正解!"}
        {feedbackState === "incorrect" &&
          currentNote &&
          `不正解 → ${currentNote.step}${currentNote.alter === 1 ? "♯" : currentNote.alter === -1 ? "♭" : ""}${currentNote.octave}`}
      </div>

      {/* 回答ボタン */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
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

      {/* 統計 */}
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
    </div>
  );
});

SightReadingFlashcard.displayName = "SightReadingFlashcard";

export default SightReadingFlashcard;
