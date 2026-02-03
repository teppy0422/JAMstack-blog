"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SheetMusic, { SheetMusicRef } from "../components/SheetMusic";
import PianoKeyboard from "../components/PianoKeyboard";
import "./score.css";
import {
  saveScore,
  getAllScores,
  deleteScore,
  isValidMusicXML,
  type StoredScore,
} from "../lib/scoreDB";

const sampleScores = [
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
    id: "summer-chords",
    name: "summer (コード付き)",
    path: "/scores/summer-jiu-shi-rang-with-chords.musicxml",
  },
  {
    id: "sample",
    name: "sample",
    path: "/scores/BrahWiMeSample.musicxml",
  },
];

interface Note {
  step: string;
  octave: number;
  alter: number;
  staff?: number;
}

interface ScoreItem {
  id: string;
  name: string;
  path?: string; // For sample scores (URL path)
  dbId?: number; // For user scores (IndexedDB ID)
  isUserScore: boolean;
}

export default function ScorePage() {
  const [selectedScore, setSelectedScore] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
  const [keyboardRange, setKeyboardRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [userScores, setUserScores] = useState<StoredScore[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedScoreId, setSelectedScoreId] = useState<string | null>(null);
  const [selectedScoreContent, setSelectedScoreContent] = useState<
    string | null
  >(null);
  const [showChords, setShowChords] = useState(false);
  const sheetMusicRef = useRef<SheetMusicRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user scores from IndexedDB on mount
  useEffect(() => {
    const loadUserScores = async () => {
      try {
        const scores = await getAllScores();
        setUserScores(scores);
      } catch (error) {
        console.error("Failed to load user scores:", error);
      }
    };
    loadUserScores();
  }, []);

  // Combine sample and user scores
  const allScores: ScoreItem[] = [
    ...sampleScores.map((s) => ({
      id: s.id,
      name: s.name,
      path: s.path,
      isUserScore: false,
    })),
    ...userScores.map((s) => ({
      id: `user-${s.id}`,
      name: s.name,
      dbId: s.id,
      isUserScore: true,
    })),
  ];

  const handleScoreChange = useCallback(
    async (scoreId: string) => {
      setIsLoading(true);
      setCurrentNotes([]);
      setKeyboardRange(null);
      setSelectedScoreId(scoreId);
      // Restore chord visibility from cache
      const cachedShowChords =
        localStorage.getItem("lastShowChords") === "true";
      setShowChords(cachedShowChords);

      if (!scoreId) {
        setSelectedScore(null);
        setSelectedScoreContent(null);
        localStorage.removeItem("lastOpenedScoreId");
        setIsLoading(false);
        return;
      }

      // Find the score
      const score = allScores.find((s) => s.id === scoreId);
      if (!score) {
        setIsLoading(false);
        return;
      }

      // Save to localStorage
      localStorage.setItem("lastOpenedScoreId", scoreId);

      if (score.isUserScore && score.dbId) {
        // Load from IndexedDB
        try {
          const storedScore = userScores.find((s) => s.id === score.dbId);
          if (storedScore) {
            setSelectedScoreContent(storedScore.xmlContent);
            setSelectedScore(`indexeddb:${score.dbId}`);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Failed to load score from IndexedDB:", error);
          alert("楽譜の読み込みに失敗しました");
          setIsLoading(false);
        }
      } else if (score.path) {
        // Load from public folder
        setSelectedScore(score.path);
        setSelectedScoreContent(null);
      } else {
        setIsLoading(false);
      }
    },
    [allScores, userScores],
  );

  useEffect(() => {
    const lastOpenedScoreId = localStorage.getItem("lastOpenedScoreId");
    const lastZoomLevel = localStorage.getItem("lastZoomLevel");
    const lastShowChords = localStorage.getItem("lastShowChords");

    // Only run once on mount and when userScores changes
    if (lastOpenedScoreId && userScores.length >= 0) {
      const scoreToLoad = allScores.find((s) => s.id === lastOpenedScoreId);
      if (scoreToLoad && !selectedScoreId) {
        handleScoreChange(lastOpenedScoreId);
      }
    }

    if (lastZoomLevel) {
      const zoomValue = parseFloat(lastZoomLevel);
      if (!isNaN(zoomValue) && zoomValue >= 0.5 && zoomValue <= 1.75) {
        setZoom(zoomValue);
      }
    }

    if (lastShowChords === "true") {
      setShowChords(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userScores.length]);

  const handleNotesChange = useCallback((notes: Note[]) => {
    console.log("handleNotesChange called with:", notes);
    setCurrentNotes(notes);
  }, []);

  const handleRangeChange = useCallback((minMidi: number, maxMidi: number) => {
    console.log("handleRangeChange called with:", minMidi, maxMidi);
    setKeyboardRange({ min: minMidi, max: maxMidi });
  }, []);

  const handleSheetMusicLoad = useCallback(async () => {
    // Apply cached zoom level after sheet music loads
    const cachedZoom = localStorage.getItem("lastZoomLevel");
    if (cachedZoom) {
      const zoomValue = parseFloat(cachedZoom);
      if (
        !isNaN(zoomValue) &&
        zoomValue !== 1.0 &&
        zoomValue >= 0.5 &&
        zoomValue <= 1.75
      ) {
        await sheetMusicRef.current?.setZoom(zoomValue);
      }
    }
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

  const handleZoomPreset = async (presetZoom: number) => {
    console.log("handleZoomPreset called with:", presetZoom);
    setZoom(presetZoom);
    localStorage.setItem("lastZoomLevel", presetZoom.toString());

    sheetMusicRef.current?.hideCursor();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      await sheetMusicRef.current?.setZoom(presetZoom);
    } finally {
      setIsLoading(false);
      sheetMusicRef.current?.showCursor();
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".musicxml") && !file.name.endsWith(".xml")) {
      alert("MusicXMLファイル (.musicxml または .xml) を選択してください");
      return;
    }

    try {
      const content = await file.text();

      if (!isValidMusicXML(content)) {
        alert("無効なMusicXMLファイルです");
        return;
      }

      // Extract name from filename (remove extension)
      const name = file.name.replace(/\.(musicxml|xml)$/, "");

      // Save to IndexedDB
      const id = await saveScore(name, content);

      // Reload user scores
      const scores = await getAllScores();
      setUserScores(scores);

      // Auto-select the newly uploaded score
      await handleScoreChange(`user-${id}`);

      console.log("Score uploaded successfully:", name);
    } catch (error) {
      console.error("Failed to upload score:", error);
      alert("楽譜のアップロードに失敗しました");
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  // Handle delete user score
  const handleDeleteScore = async (dbId: number) => {
    if (!confirm("この楽譜を削除しますか？")) {
      return;
    }

    try {
      await deleteScore(dbId);

      // Reload user scores
      const scores = await getAllScores();
      setUserScores(scores);

      // If deleted score was selected, clear selection
      if (selectedScoreId === `user-${dbId}`) {
        setSelectedScore(null);
        setSelectedScoreContent(null);
        setSelectedScoreId(null);
        localStorage.removeItem("lastOpenedScoreId");
      }

      console.log("Score deleted successfully");
    } catch (error) {
      console.error("Failed to delete score:", error);
      alert("楽譜の削除に失敗しました");
    }
  };

  // Handle chord visibility toggle
  const handleChordToggle = async () => {
    if (!selectedScoreId) {
      return;
    }

    const newShowChords = !showChords;
    setShowChords(newShowChords);
    localStorage.setItem("lastShowChords", newShowChords.toString());

    setIsLoading(true);
    sheetMusicRef.current?.hideCursor();
    try {
      await sheetMusicRef.current?.setChordVisibility(newShowChords);
      // Re-apply zoom after chord visibility change (which reloads the MusicXML)
      if (zoom !== 1.0) {
        await sheetMusicRef.current?.setZoom(zoom);
      }
    } finally {
      setIsLoading(false);
      sheetMusicRef.current?.showCursor();
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#ffffff",
        position: "relative",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag and drop overlay */}
      {isDragging && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(51, 224, 47, 0.2)",
            border: "4px dashed #33e02f",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px 50px",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#33e02f",
            }}
          >
            📁 ここにMusicXMLファイルをドロップ
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".musicxml,.xml"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
      {/* ヘッダー */}
      <header
        className="no-print"
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
        className="no-print"
        style={{
          padding: "15px 20px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <label
            htmlFor="score-select"
            style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
          >
            楽譜:
          </label>
          <select
            id="score-select"
            value={selectedScoreId || ""}
            onChange={(e) => handleScoreChange(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "200px",
            }}
          >
            <option value="">-- 選択してください --</option>

            {/* Sample scores section */}
            {sampleScores.length > 0 && (
              <>
                <optgroup label="サンプル楽譜">
                  {sampleScores.map((score) => (
                    <option key={score.id} value={score.id}>
                      {score.name}
                    </option>
                  ))}
                </optgroup>
              </>
            )}

            {/* User scores section */}
            {userScores.length > 0 && (
              <>
                <optgroup label="マイ楽譜">
                  {userScores.map((score) => (
                    <option key={`user-${score.id}`} value={`user-${score.id}`}>
                      {score.name}
                    </option>
                  ))}
                </optgroup>
              </>
            )}
          </select>

          {/* File selection button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            style={{
              padding: "6px 14px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: isLoading ? "#f0f0f0" : "#fff",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              gap: "5px",
              whiteSpace: "nowrap",
            }}
            title="ファイルを選択してアップロード"
          >
            📁
          </button>

          {/* Delete button for user scores */}
          {selectedScoreId?.startsWith("user-") && (
            <button
              onClick={() => {
                const dbId = parseInt(selectedScoreId.replace("user-", ""));
                handleDeleteScore(dbId);
              }}
              disabled={isLoading}
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ff4444",
                backgroundColor: isLoading ? "#f0f0f0" : "#fff",
                color: "#ff4444",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
              }}
              title="この楽譜を削除"
            >
              🗑️
            </button>
          )}
        </div>

        {selectedScore && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {/* Zoom preset buttons - 2 rows x 3 columns */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "3px",
              }}
            >
              {[0.5, 0.75, 1.0, 1.25, 1.5, 1.75].map((presetZoom) => (
                <button
                  key={presetZoom}
                  onClick={() => handleZoomPreset(presetZoom)}
                  disabled={isLoading}
                  style={{
                    padding: "0px 8px",
                    fontSize: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      zoom === presetZoom
                        ? "#d0d0d0"
                        : isLoading
                          ? "#f0f0f0"
                          : "#fff",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.5 : 1,
                    fontWeight: zoom === presetZoom ? "bold" : "normal",
                  }}
                  title={`${Math.round(presetZoom * 100)}%`}
                >
                  {Math.round(presetZoom * 100)}%
                </button>
              ))}
            </div>

            {/* Chord toggle button - for all scores */}
            {selectedScoreId && (
              <>
                <div
                  style={{
                    width: "1px",
                    height: "24px",
                    backgroundColor: "#ccc",
                    margin: "0 5px",
                  }}
                />
                <button
                  onClick={handleChordToggle}
                  disabled={isLoading}
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: showChords ? "2px solid #4CAF50" : "1px solid #ccc",
                    backgroundColor: showChords
                      ? "#e8f5e9"
                      : isLoading
                        ? "#f0f0f0"
                        : "#fff",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    whiteSpace: "nowrap",
                  }}
                  title={showChords ? "コード非表示" : "コード表示"}
                >
                  {showChords ? "🎵 コード ON" : "🎵 コード OFF"}
                </button>
                <button
                  onClick={handlePrint}
                  disabled={isLoading}
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: isLoading ? "#f0f0f0" : "#fff",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    whiteSpace: "nowrap",
                  }}
                  title="印刷 / PDF保存"
                >
                  🖨️
                </button>
              </>
            )}

            <div
              style={{
                width: "1px",
                height: "24px",
                backgroundColor: "#ccc",
                margin: "0 5px",
              }}
            />
            <button
              onClick={handleReset}
              disabled={isLoading}
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: isLoading ? "#f0f0f0" : "#fff",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              ⏮
            </button>
            <button
              onClick={handlePrevious}
              disabled={isLoading}
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: isLoading ? "#f0f0f0" : "#fff",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              ⬅
            </button>
            <button
              onClick={handleNext}
              disabled={isLoading}
              style={{
                padding: "8px 16px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: isLoading ? "#f0f0f0" : "#fff",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              ➡
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
                src="/images/illust/hippo/hippo_beat4.svg"
                alt="Loading..."
                className="loading-hippo hippo-1"
              />
              <img
                src="/images/illust/hippo/hippo_beat8.svg"
                alt="Loading..."
                className="loading-hippo hippo-2"
              />
              <img
                src="/images/illust/hippo/hippo_beat16.svg"
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
            musicXmlContent={selectedScoreContent || undefined}
            onNotesChange={handleNotesChange}
            onRangeChange={handleRangeChange}
            onLoad={handleSheetMusicLoad}
            style={{ visibility: isLoading ? "hidden" : "visible" }}
            showChords={showChords}
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
          ></div>
        )}
      </main>

      {/* 鍵盤ガイド表示エリア */}
      <footer
        className="no-print"
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
