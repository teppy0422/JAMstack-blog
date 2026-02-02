"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SheetMusic, { SheetMusicRef } from "../components/SheetMusic";
import PianoKeyboard from "../components/PianoKeyboard";
import "./score.css";

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
  {
    id: "summer",
    name: "summer",
    path: "/scores/summer-jiu-shi-rang.musicxml",
  },
  {
    id: "sample",
    name: "sample",
    path: "/scores/BrahWiMeSample.musicxml",
  },
  // 将来的に他の楽譜を追加可能
];

interface Note {
  step: string;
  octave: number;
  alter: number;
  staff?: number;
}

export default function ScorePage() {
  const [selectedScore, setSelectedScore] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
  const [keyboardRange, setKeyboardRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const sheetMusicRef = useRef<SheetMusicRef>(null);

  // Memoize handleScoreChange to avoid unnecessary re-renders and issues with useEffect dependency
  const handleScoreChange = useCallback((path: string) => {
    setIsLoading(true); // Set loading to true when a score is selected
    setSelectedScore(path);
    setCurrentNotes([]);
    setKeyboardRange(null);
    if (path) {
      const selected = availableScores.find((score) => score.path === path);
      if (selected) {
        localStorage.setItem("lastOpenedScoreId", selected.id);
      }
    } else {
      localStorage.removeItem("lastOpenedScoreId");
    }
  }, []); // Dependencies are stable (setSelectedScore, setCurrentNotes, setKeyboardRange)

  useEffect(() => {
    const lastOpenedScoreId = localStorage.getItem("lastOpenedScoreId");
    if (lastOpenedScoreId) {
      const scoreToLoad = availableScores.find(
        (score) => score.id === lastOpenedScoreId,
      );
      if (scoreToLoad) {
        handleScoreChange(scoreToLoad.path);
      }
    }
  }, [handleScoreChange]); // Add handleScoreChange to dependency array

  const handleNotesChange = useCallback((notes: Note[]) => {
    console.log("handleNotesChange called with:", notes);
    setCurrentNotes(notes);
  }, []);

  const handleRangeChange = useCallback((minMidi: number, maxMidi: number) => {
    console.log("handleRangeChange called with:", minMidi, maxMidi);
    setKeyboardRange({ min: minMidi, max: maxMidi });
  }, []);

  const handleSheetMusicLoad = useCallback(() => {
    setIsLoading(false); // Set loading to false when SheetMusic reports it's done
  }, []);

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
          position: "relative", // Added for positioning loading overlay
        }}
      >
        {isLoading && ( // Show loading animation when isLoading is true
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white overlay
              zIndex: 10, // Ensure it's above the sheet music
            }}
          >
            <div className="loading-hippo-container">
              <img
                src="/images/illust/hippo/hippo_beat.png"
                alt="Loading..."
                className="loading-hippo hippo-1"
              />
              <img
                src="/images/illust/hippo/hippo_beat.png"
                alt="Loading..."
                className="loading-hippo hippo-2"
              />
              <img
                src="/images/illust/hippo/hippo_beat.png"
                alt="Loading..."
                className="loading-hippo hippo-3"
              />
            </div>
            <p className="skeleton-text">Loading...</p>
          </div>
        )}
        {selectedScore ? (
          <SheetMusic
            ref={sheetMusicRef}
            musicXmlPath={selectedScore}
            onNotesChange={handleNotesChange}
            onRangeChange={handleRangeChange}
            onLoad={handleSheetMusicLoad} // Pass the onLoad handler
            style={{ visibility: isLoading ? "hidden" : "visible" }} // Hide SheetMusic content while loading
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
