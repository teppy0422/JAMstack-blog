"use client";

import { useState, useRef } from "react";
import SheetMusic, { SheetMusicRef } from "../components/SheetMusic";
import PianoKeyboard from "../components/PianoKeyboard";

const availableScores = [
  { id: "twinkle", name: "きらきら星", path: "/scores/twinkle.musicxml" },
  {
    id: "bounce",
    name: "枯葉",
    path: "/scores/Billie's_Bounce.musicxml",
  },
  {
    id: "mery",
    name: "人生のメリーゴーランド",
    path: "/scores/merry-go-round-of-life.musicxml",
  },
  // 将来的に他の楽譜を追加可能
];

interface Note {
  step: string;
  octave: number;
  alter: number;
}

export default function ScorePage() {
  const [selectedScore, setSelectedScore] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
  const [keyboardRange, setKeyboardRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const sheetMusicRef = useRef<SheetMusicRef>(null);

  const handleNotesChange = (notes: Note[]) => {
    console.log("handleNotesChange called with:", notes);
    setCurrentNotes(notes);
  };

  const handleRangeChange = (minMidi: number, maxMidi: number) => {
    console.log("handleRangeChange called with:", minMidi, maxMidi);
    setKeyboardRange({ min: minMidi, max: maxMidi });
  };

  const handleScoreChange = (path: string) => {
    setSelectedScore(path);
    setCurrentNotes([]);
    setKeyboardRange(null);
  };

  const handleNext = () => {
    sheetMusicRef.current?.next();
  };

  const handlePrevious = () => {
    sheetMusicRef.current?.previous();
  };

  const handleReset = () => {
    sheetMusicRef.current?.reset();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          padding: "15px 20px",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <h1 style={{ fontSize: "24px", margin: 0 }}>Web楽譜追従アプリ</h1>
          <img
            src="/images/illust/hippo/hippo_speaker.svg"
            alt="Hippo"
            style={{ width: "48px", height: "48px", objectFit: "contain" }}
          />
        </div>
      </header>

      {/* コントロール部分 */}
      <div
        style={{
          padding: "15px 20px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label
            htmlFor="score-select"
            style={{ marginRight: "10px", fontWeight: "bold" }}
          >
            楽譜:
          </label>
          <select
            id="score-select"
            value={selectedScore || ""}
            onChange={(e) => handleScoreChange(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- 選択してください --</option>
            {availableScores.map((score) => (
              <option key={score.id} value={score.path}>
                {score.name}
              </option>
            ))}
          </select>
        </div>

        {selectedScore && (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleReset}
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              ⏮ 最初に戻る
            </button>
            <button
              onClick={handlePrevious}
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              ⬅ 前へ
            </button>
            <button
              onClick={handleNext}
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              次へ ➡
            </button>
          </div>
        )}
      </div>

      {/* 楽譜表示エリア */}
      <main
        style={{
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {selectedScore ? (
          <SheetMusic
            ref={sheetMusicRef}
            musicXmlPath={selectedScore}
            onNotesChange={handleNotesChange}
            onRangeChange={handleRangeChange}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#666",
            }}
          >
            楽譜を選択してください
          </div>
        )}
      </main>

      {/* 鍵盤ガイド表示エリア */}
      <footer
        style={{
          height: "20vh",
          minHeight: "120px",
          borderTop: "2px solid #333",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        {selectedScore ? (
          <PianoKeyboard
            notes={currentNotes}
            minMidi={keyboardRange?.min}
            maxMidi={keyboardRange?.max}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#999",
              fontSize: "14px",
            }}
          >
            {selectedScore
              ? "楽譜をクリックまたはカーソルを進めてください"
              : "鍵盤ガイド"}
          </div>
        )}
      </footer>
    </div>
  );
}
