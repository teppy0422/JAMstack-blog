"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import SheetMusic, { SheetMusicRef } from "../components/SheetMusic";
import PianoKeyboard from "../components/PianoKeyboard";
import { border, useColorMode } from "@chakra-ui/react";
import Header from "@/components/header";
import { useTheme } from "@chakra-ui/react";
import { RiCodeSLine, RiCodeSSlashFill } from "react-icons/ri";
import { TiPrinter } from "react-icons/ti";
import { FaRegFile } from "react-icons/fa6";
import { IoPlayOutline, IoPlaySkipBackOutline, IoSettingsOutline, IoExpandOutline, IoContractOutline } from "react-icons/io5";

import "./score.css";
import {
  saveScore,
  getAllScores,
  deleteScore,
  isValidMusicXML,
  type StoredScore,
} from "../lib/scoreDB";
import { famousSayings } from "./famousSayings";
import { findMusicTerm, type MusicTerm } from "./musicTerms";
import { MdDeleteOutline } from "react-icons/md";
import { useMidi } from "../hooks/useMidi";
import {
  MidiConfig,
  defaultMidiConfig,
  midiPresets,
  MidiPresetName,
} from "../lib/midiConfig";

const sampleScores = [
  { id: "twinkle", name: "きらきら星", path: "/scores/twinkle.musicxml" },
  {
    id: "autumn-leaves",
    name: "Autumn Leaves",
    path: "/scores/Autumn_Leaves.musicxml",
  },
  {
    id: "bounce",
    name: "Billie's Bounce",
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
  const [currentQuote, setCurrentQuote] = useState<{
    quote: string;
    author: string;
  } | null>(null);
  const [musicTermModal, setMusicTermModal] = useState<MusicTerm | null>(null);
  const [midiConfig, setMidiConfig] = useState<MidiConfig>(defaultMidiConfig);
  const [midiEnabled, setMidiEnabled] = useState(true);
  const [wrongNotes, setWrongNotes] = useState<number[]>([]);
  const [showMidiSettings, setShowMidiSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sheetMusicRef = useRef<SheetMusicRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const loadingStartTimeRef = useRef<number>(0);
  const { colorMode } = useColorMode();

  // localStorage からMIDI設定をロード
  useEffect(() => {
    try {
      const saved = localStorage.getItem("midiConfig");
      if (saved) {
        const parsed = JSON.parse(saved);
        setMidiConfig({ ...defaultMidiConfig, ...parsed });
      }
    } catch (e) {
      console.warn("Failed to load midiConfig from localStorage:", e);
    }
  }, []);

  // MIDI設定変更ヘルパー（stateとlocalStorageを同時に更新）
  const updateMidiConfig = useCallback((update: Partial<MidiConfig>) => {
    setMidiConfig((prev) => {
      const next = { ...prev, ...update };
      localStorage.setItem("midiConfig", JSON.stringify(next));
      return next;
    });
  }, []);

  // プリセット適用
  const applyPreset = useCallback((presetName: MidiPresetName) => {
    const preset = midiPresets[presetName];
    setMidiConfig(preset);
    localStorage.setItem("midiConfig", JSON.stringify(preset));
  }, []);

  // 現在の設定がどのプリセットに一致するか検出
  const detectPreset = useCallback((config: MidiConfig): MidiPresetName | null => {
    for (const [name, preset] of Object.entries(midiPresets) as [MidiPresetName, MidiConfig][]) {
      const match = (Object.keys(preset) as (keyof MidiConfig)[]).every(
        (key) => config[key] === preset[key],
      );
      if (match) return name;
    }
    return null;
  }, []);

  const currentPreset = detectPreset(midiConfig);

  // 現在の音符からMIDI番号の配列を計算
  const noteToMidi = (step: string, octave: number, alter: number): number => {
    const stepToSemitone: Record<string, number> = {
      C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
    };
    const semitone = stepToSemitone[step.toUpperCase()] || 0;
    return (octave + 1) * 12 + semitone + (alter || 0);
  };

  const expectedMidiNotes = currentNotes
    .filter((n) => n.step && typeof n.octave === "number")
    .filter((n) => midiConfig.staffFilter === "both" || n.staff === midiConfig.staffFilter)
    .map((n) => noteToMidi(n.step, n.octave, n.alter));

  // MIDI判定成功時: カーソルを進めて間違い表示をクリア
  // 休符・タイ（音符が空）の位置は自動スキップ
  const handleMidiMatch = useCallback(() => {
    setWrongNotes([]);
    sheetMusicRef.current?.next();

    // 次の位置が休符/タイなら自動スキップ（最大100回で安全制限）
    let skipCount = 0;
    const maxSkips = 100;
    while (skipCount < maxSkips) {
      const ref = sheetMusicRef.current;
      if (!ref || ref.isEndReached()) break;
      const notes = ref.getCurrentNotes();
      if (notes.length > 0) break;
      ref.next();
      skipCount++;
    }
  }, []);

  // MIDI判定失敗時: 間違い鍵盤を赤く表示
  const handleMidiMismatch = useCallback((wrong: number[]) => {
    setWrongNotes(wrong);
  }, []);

  // MIDI接続
  const { connectionStatus: midiConnectionStatus, deviceName: midiDeviceName } =
    useMidi({
      config: midiConfig,
      expectedMidiNotes,
      onMatch: handleMidiMatch,
      onMismatch: handleMidiMismatch,
      enabled: midiEnabled && !!selectedScore && !isLoading,
    });

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
      loadingStartTimeRef.current = Date.now();
      const randomIndex = Math.floor(Math.random() * famousSayings.length);
      setCurrentQuote(famousSayings[randomIndex]);
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
    setCurrentNotes(notes);
  }, []);

  const handleRangeChange = useCallback((minMidi: number, maxMidi: number) => {
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
    // 最低2秒間はローディングを表示
    const elapsed = Date.now() - loadingStartTimeRef.current;
    const minLoadingTime = 2000;
    if (elapsed < minLoadingTime) {
      await new Promise((resolve) =>
        setTimeout(resolve, minLoadingTime - elapsed),
      );
    }
    setIsLoading(false);
  }, []);

  const handleNext = () => {
    setWrongNotes([]);
    sheetMusicRef.current?.next();
  };

  const handlePrevious = () => {
    setWrongNotes([]);
    sheetMusicRef.current?.previous();
  };

  const handleReset = () => {
    setWrongNotes([]);
    sheetMusicRef.current?.reset();
  };

  const handleZoomPreset = async (presetZoom: number) => {
    setZoom(presetZoom);
    localStorage.setItem("lastZoomLevel", presetZoom.toString());

    // スクロール位置を保存
    const scrollTop = mainRef.current?.scrollTop || 0;
    const scrollLeft = mainRef.current?.scrollLeft || 0;

    sheetMusicRef.current?.hideCursor();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      await sheetMusicRef.current?.setZoom(presetZoom);
    } finally {
      setIsLoading(false);
      sheetMusicRef.current?.showCursor();
      // スクロール位置を復元
      if (mainRef.current) {
        mainRef.current.scrollTop = scrollTop;
        mainRef.current.scrollLeft = scrollLeft;
      }
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
    } catch (error) {
      console.error("Failed to delete score:", error);
      alert("楽譜の削除に失敗しました");
    }
  };

  // Handle music term click
  const handleMusicTermClick = useCallback((term: string) => {
    const foundTerm = findMusicTerm(term);
    if (foundTerm) {
      setMusicTermModal(foundTerm);
    }
  }, []);

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

  // Handle fullscreen toggle
  const handleFullscreenToggle = useCallback(() => {
    if (!pageContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      pageContainerRef.current.requestFullscreen();
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const theme = useTheme();
  const bgColor =
    colorMode === "dark"
      ? theme.colors.custom.theme.dark[900]
      : theme.colors.custom.theme.light[100];
  const borderColor =
    colorMode === "dark"
      ? theme.colors.custom.theme.light[200]
      : theme.colors.custom.theme.dark[400];
  const frColor =
    colorMode === "dark"
      ? theme.colors.custom.theme.light[50]
      : theme.colors.custom.theme.dark[500];
  const highlightColor =
    colorMode === "dark"
      ? theme.colors.custom.theme.orange[500]
      : theme.colors.custom.pianoHighlight;
  return (
    <div
      ref={pageContainerRef}
      style={{ backgroundColor: bgColor, height: "100vh", overflow: "hidden" }}
    >
      {/* ヘッダー背景用の固定レイヤー（LiquidGlassの後ろに表示） */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "42px",
          backgroundColor: bgColor,
          zIndex: 1999, // LiquidGlassのzIndex(2000)より下
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 42px)",
          marginTop: "42px",
          backgroundColor: bgColor,
          position: "relative",
          borderTop: ".5px solid",
          borderTopColor: borderColor,
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
        <Header />
        {/* コントロール部分 */}
        <div
          className="no-print"
          style={{
            padding: "5px 10px",
            borderBottom: ".5px solid",
            borderBottomColor: borderColor,
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <label
              htmlFor="score-select"
              style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            >
              <img
                src="/images/illust/hippo/hippo_speaker.svg"
                style={{
                  height: "32px",
                  filter:
                    colorMode === "dark"
                      ? "invert(58%) sepia(50%) saturate(350%) hue-rotate(320deg) brightness(105%)"
                      : "none",
                }}
              />
            </label>
            <select
              id="score-select"
              value={selectedScoreId || ""}
              onChange={(e) => handleScoreChange(e.target.value)}
              style={{
                padding: "8px 8px",
                fontSize: "16px",
                borderRadius: "4px",
                borderWidth: ".5px",
                borderColor: borderColor,
                minWidth: "200px",
                backgroundColor: bgColor,
                outline: "none", // フォーカス時の青い枠を無効化
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
                      <option
                        key={`user-${score.id}`}
                        value={`user-${score.id}`}
                      >
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
                height: "36px",
                width: "26px",
                fontSize: "16px",
                borderRadius: "4px",
                borderWidth: ".5px",
                borderColor: borderColor,
                backgroundColor: isLoading ? "#f0f0f0" : bgColor,
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                whiteSpace: "nowrap",
                justifyContent: "center",
              }}
              title="ファイルを選択してアップロード"
            >
              <FaRegFile />
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
                  height: "36px",
                  width: "26px",
                  fontSize: "24px",
                  borderRadius: "4px",
                  borderWidth: "1px",
                  borderColor: borderColor,
                  color: "#ff4444",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.5 : 1,
                  justifyContent: "center",
                }}
                title="この楽譜を削除"
              >
                <MdDeleteOutline />
              </button>
            )}
          </div>
          <div
            style={{
              width: ".5px",
              height: "24px",
              backgroundColor: borderColor,
              margin: "0 3px",
            }}
          />
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
                      color: frColor,
                      // backgroundColor:
                      //   zoom === presetZoom ? highlightColor : "transparent",
                      borderRadius: "4px",
                      borderWidth: ".5px",
                      borderColor: zoom === presetZoom ? borderColor : frColor,
                      backgroundColor:
                        zoom === presetZoom && colorMode === "dark"
                          ? `${highlightColor}70`
                          : zoom === presetZoom && colorMode === "light"
                            ? `${highlightColor}40`
                            : "transparent",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.5 : 1,
                      fontWeight: "bold",
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
                  <button
                    onClick={handleChordToggle}
                    disabled={isLoading}
                    style={{
                      height: "40px",
                      width: "36px",
                      fontSize: "14px",
                      borderRadius: "4px",
                      borderWidth: ".5px",
                      borderColor: borderColor,
                      color: frColor,
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.5 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      whiteSpace: "nowrap",
                      justifyContent: "center",
                    }}
                    title={showChords ? "コード非表示" : "コード表示"}
                  >
                    {showChords ? <RiCodeSLine /> : <RiCodeSSlashFill />}
                  </button>
                  <button
                    onClick={handlePrint}
                    disabled={isLoading}
                    style={{
                      height: "40px",
                      width: "36px",
                      fontSize: "24px",
                      borderRadius: "4px",
                      borderWidth: ".5px",
                      borderColor: borderColor,
                      color: frColor,
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.5 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      whiteSpace: "nowrap",
                      justifyContent: "center",
                    }}
                    title="印刷 / PDF保存"
                  >
                    <TiPrinter />
                  </button>
                </>
              )}
              <div
                style={{
                  width: ".5px",
                  height: "24px",
                  backgroundColor: borderColor,
                  margin: "0 3px",
                }}
              />
              <button
                onClick={handleReset}
                disabled={isLoading}
                style={{
                  height: "40px",
                  width: "24px",
                  fontSize: "16px",
                  borderRadius: "4px",
                  borderWidth: ".5px",
                  borderColor: borderColor,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  color: frColor,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <IoPlaySkipBackOutline />
              </button>
              <button
                onClick={handlePrevious}
                disabled={isLoading}
                style={{
                  height: "40px",
                  width: "32px",
                  fontSize: "16px",
                  borderRadius: "4px",
                  borderWidth: ".5px",
                  borderColor: borderColor,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  color: frColor,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <IoPlayOutline style={{ transform: "rotate(180deg)" }} />
              </button>
              <button
                onClick={handleNext}
                disabled={isLoading}
                style={{
                  height: "40px",
                  width: "32px",
                  fontSize: "16px",
                  borderRadius: "4px",
                  borderWidth: ".5px",
                  borderColor: borderColor,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  color: frColor,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <IoPlayOutline />
              </button>
              <div
                style={{
                  width: ".5px",
                  height: "24px",
                  backgroundColor: borderColor,
                  margin: "0 3px",
                }}
              />
              {/* MIDI接続状態ドット + 設定ボタン */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor:
                      midiConnectionStatus === "connected"
                        ? "#4CAF50"
                        : midiConnectionStatus === "unsupported"
                          ? "#FF9800"
                          : "#999",
                  }}
                  title={
                    midiConnectionStatus === "connected"
                      ? `MIDI接続中: ${midiDeviceName}`
                      : midiConnectionStatus === "unsupported"
                        ? "MIDI非対応ブラウザ"
                        : midiConnectionStatus === "connecting"
                          ? "MIDI接続中..."
                          : "MIDI未接続"
                  }
                />
                <button
                  onClick={() => setShowMidiSettings(true)}
                  disabled={isLoading}
                  style={{
                    height: "40px",
                    width: "32px",
                    fontSize: "18px",
                    borderRadius: "4px",
                    borderWidth: ".5px",
                    borderColor: borderColor,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    color: frColor,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.5 : 1,
                  }}
                  title="MIDI設定"
                >
                  <IoSettingsOutline />
                </button>
                <button
                  onClick={handleFullscreenToggle}
                  disabled={isLoading}
                  style={{
                    height: "40px",
                    width: "32px",
                    fontSize: "18px",
                    borderRadius: "4px",
                    borderWidth: ".5px",
                    borderColor: borderColor,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    color: frColor,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.5 : 1,
                  }}
                  title={isFullscreen ? "全画面解除" : "全画面"}
                >
                  {isFullscreen ? <IoContractOutline /> : <IoExpandOutline />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 楽譜表示エリア */}
        <main
          ref={mainRef}
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
                zIndex: 10, // Ensure it's above the sheet music
              }}
            >
              <div className="loading-hippo-container">
                <img
                  src="/images/illust/hippo/hippo_beat4.svg"
                  alt="Loading..."
                  className="loading-hippo hippo-1"
                  style={{
                    filter: colorMode === "dark" ? "invert(1)" : "none",
                  }}
                />
                <img
                  src="/images/illust/hippo/hippo_beat8.svg"
                  alt="Loading..."
                  className="loading-hippo hippo-2"
                  style={{
                    filter: colorMode === "dark" ? "invert(1)" : "none",
                  }}
                />
                <img
                  src="/images/illust/hippo/hippo_beat16.svg"
                  alt="Loading..."
                  className="loading-hippo hippo-3"
                  style={{
                    filter: colorMode === "dark" ? "invert(1)" : "none",
                  }}
                />
              </div>
              {currentQuote && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    padding: "0 20px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "1.1em",
                      color: frColor,
                      margin: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {currentQuote.quote}
                  </p>
                  <p
                    style={{
                      fontSize: "0.9em",
                      color: frColor,
                      fontStyle: "italic",
                      marginTop: "8px",
                    }}
                  >
                    – {currentQuote.author}
                  </p>
                </div>
              )}
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
              onMusicTermClick={handleMusicTermClick}
              style={{ visibility: isLoading ? "hidden" : "visible" }}
              showChords={showChords}
              darkMode={colorMode === "dark"}
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
            height: "16vh",
            minHeight: "120px",
            padding: "0 0 0 0",
            backgroundColor: "#f5f5f5",
          }}
        >
          {selectedScore ? (
            <PianoKeyboard
              notes={
                midiConfig.staffFilter === "both"
                  ? currentNotes
                  : currentNotes.filter((n) => n.staff === midiConfig.staffFilter)
              }
              minMidi={keyboardRange?.min}
              maxMidi={keyboardRange?.max}
              wrongNotes={wrongNotes}
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

        {/* MIDI設定モーダル */}
        {showMidiSettings && (
          <div
            onClick={() => setShowMidiSettings(false)}
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
                maxWidth: "420px",
                width: "90%",
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "20px",
                  color: frColor,
                }}
              >
                MIDI設定
              </h3>

              {/* 接続状態バナー */}
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor:
                    midiConnectionStatus === "connected"
                      ? colorMode === "dark" ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)"
                      : colorMode === "dark" ? "rgba(153, 153, 153, 0.2)" : "rgba(153, 153, 153, 0.1)",
                  marginBottom: "16px",
                  fontSize: "13px",
                  color: frColor,
                }}
              >
                {midiConnectionStatus === "connected"
                  ? `接続中: ${midiDeviceName}`
                  : midiConnectionStatus === "unsupported"
                    ? "このブラウザはWeb MIDI APIに対応していません"
                    : midiConnectionStatus === "connecting"
                      ? "MIDI接続中..."
                      : "MIDIデバイス未接続"}
              </div>

              {/* プリセットボタン */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {(["practice", "exact"] as MidiPresetName[]).map((presetName) => (
                  <button
                    key={presetName}
                    onClick={() => applyPreset(presetName)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontSize: "13px",
                      borderRadius: "6px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: currentPreset === presetName ? highlightColor : borderColor,
                      backgroundColor:
                        currentPreset === presetName
                          ? colorMode === "dark" ? `${highlightColor}40` : `${highlightColor}20`
                          : "transparent",
                      color: frColor,
                      cursor: "pointer",
                      fontWeight: currentPreset === presetName ? "bold" : "normal",
                    }}
                  >
                    {presetName === "practice" ? "練習モード" : "完全一致モード"}
                  </button>
                ))}
              </div>

              {/* 判定方式 */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", color: frColor, marginBottom: "6px", fontWeight: "bold" }}>
                  判定方式
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {([
                    { value: "any" as const, label: "何でもOK" },
                    { value: "contains" as const, label: "含む" },
                    { value: "exact" as const, label: "完全一致" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateMidiConfig({ matchMode: opt.value })}
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: midiConfig.matchMode === opt.value ? highlightColor : borderColor,
                        backgroundColor:
                          midiConfig.matchMode === opt.value
                            ? colorMode === "dark" ? `${highlightColor}40` : `${highlightColor}20`
                            : "transparent",
                        color: frColor,
                        cursor: "pointer",
                        fontWeight: midiConfig.matchMode === opt.value ? "bold" : "normal",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 和音判定の時間窓 */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", color: frColor, marginBottom: "6px", fontWeight: "bold" }}>
                  和音判定の時間窓
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[30, 50, 80, 100].map((ms) => (
                    <button
                      key={ms}
                      onClick={() => updateMidiConfig({ chordTimeWindow: ms })}
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: midiConfig.chordTimeWindow === ms ? highlightColor : borderColor,
                        backgroundColor:
                          midiConfig.chordTimeWindow === ms
                            ? colorMode === "dark" ? `${highlightColor}40` : `${highlightColor}20`
                            : "transparent",
                        color: frColor,
                        cursor: "pointer",
                        fontWeight: midiConfig.chordTimeWindow === ms ? "bold" : "normal",
                      }}
                    >
                      {ms}ms
                    </button>
                  ))}
                </div>
              </div>

              {/* 判定対象（譜表フィルタ） */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", color: frColor, marginBottom: "6px", fontWeight: "bold" }}>
                  判定対象
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {([
                    { value: "both" as const, label: "両手" },
                    { value: 1 as const, label: "右手のみ" },
                    { value: 2 as const, label: "左手のみ" },
                  ]).map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() => updateMidiConfig({ staffFilter: opt.value })}
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: midiConfig.staffFilter === opt.value ? highlightColor : borderColor,
                        backgroundColor:
                          midiConfig.staffFilter === opt.value
                            ? colorMode === "dark" ? `${highlightColor}40` : `${highlightColor}20`
                            : "transparent",
                        color: frColor,
                        cursor: "pointer",
                        fontWeight: midiConfig.staffFilter === opt.value ? "bold" : "normal",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* トグルスイッチ群 */}
              {([
                { key: "skipRests" as const, label: "休符の自動スキップ" },
                { key: "showWrongNotes" as const, label: "間違い音の表示" },
                { key: "octaveIgnore" as const, label: "オクターブ無視モード" },
                { key: "velocitySensitivity" as const, label: "ベロシティ感度" },
              ]).map((opt) => (
                <div
                  key={opt.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    padding: "4px 0",
                  }}
                >
                  <span style={{ fontSize: "13px", color: frColor }}>{opt.label}</span>
                  <button
                    onClick={() => updateMidiConfig({ [opt.key]: !midiConfig[opt.key] })}
                    style={{
                      width: "44px",
                      height: "24px",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: midiConfig[opt.key] ? highlightColor : "#ccc",
                      position: "relative",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        position: "absolute",
                        top: "2px",
                        left: midiConfig[opt.key] ? "22px" : "2px",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      }}
                    />
                  </button>
                </div>
              ))}

              {/* ベロシティ閾値スライダー（ベロシティ感度ON時のみ） */}
              {midiConfig.velocitySensitivity && (
                <div style={{ marginBottom: "16px", paddingLeft: "8px" }}>
                  <div style={{ fontSize: "12px", color: frColor, marginBottom: "6px" }}>
                    ベロシティ閾値: {midiConfig.velocityThreshold}
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={127}
                    value={midiConfig.velocityThreshold}
                    onChange={(e) => updateMidiConfig({ velocityThreshold: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: highlightColor }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#999" }}>
                    <span>1 (超敏感)</span>
                    <span>127 (最強のみ)</span>
                  </div>
                </div>
              )}

              {/* 間違い表示のクリア */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", color: frColor, marginBottom: "6px", fontWeight: "bold" }}>
                  間違い表示のクリア
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {([
                    { value: "nextNoteOn" as const, label: "次の音入力時" },
                    { value: "timeout" as const, label: "一定時間後" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateMidiConfig({ wrongNoteResetOn: opt.value })}
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: midiConfig.wrongNoteResetOn === opt.value ? highlightColor : borderColor,
                        backgroundColor:
                          midiConfig.wrongNoteResetOn === opt.value
                            ? colorMode === "dark" ? `${highlightColor}40` : `${highlightColor}20`
                            : "transparent",
                        color: frColor,
                        cursor: "pointer",
                        fontWeight: midiConfig.wrongNoteResetOn === opt.value ? "bold" : "normal",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* クリアまでの時間（一定時間後選択時のみ） */}
              {midiConfig.wrongNoteResetOn === "timeout" && (
                <div style={{ marginBottom: "16px", paddingLeft: "8px" }}>
                  <div style={{ fontSize: "12px", color: frColor, marginBottom: "6px" }}>
                    クリアまでの時間
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[500, 1000, 2000].map((ms) => (
                      <button
                        key={ms}
                        onClick={() => updateMidiConfig({ wrongNoteTimeout: ms })}
                        style={{
                          flex: 1,
                          padding: "6px 8px",
                          fontSize: "12px",
                          borderRadius: "4px",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: midiConfig.wrongNoteTimeout === ms ? highlightColor : borderColor,
                          backgroundColor:
                            midiConfig.wrongNoteTimeout === ms
                              ? colorMode === "dark" ? `${highlightColor}40` : `${highlightColor}20`
                              : "transparent",
                          color: frColor,
                          cursor: "pointer",
                          fontWeight: midiConfig.wrongNoteTimeout === ms ? "bold" : "normal",
                        }}
                      >
                        {ms}ms
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 閉じるボタン */}
              <button
                onClick={() => setShowMidiSettings(false)}
                style={{
                  marginTop: "8px",
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

        {/* 楽語説明モーダル */}
        {musicTermModal && (
          <div
            className="music-term-modal-overlay"
            onClick={() => setMusicTermModal(null)}
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
              className="music-term-modal"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: bgColor,
                borderRadius: "12px",
                padding: "24px",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "24px",
                  color: frColor,
                  paddingBottom: "8px",
                }}
              >
                {musicTermModal.name || musicTermModal.term}
              </h3>
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: highlightColor,
                }}
              >
                {musicTermModal.meaning}
              </p>
              {musicTermModal.description && (
                <p
                  style={{
                    margin: "0",
                    fontSize: "14px",
                    color: frColor,
                    lineHeight: "1.6",
                  }}
                >
                  {musicTermModal.description}
                </p>
              )}
              <button
                onClick={() => setMusicTermModal(null)}
                style={{
                  marginTop: "16px",
                  padding: "8px 24px",
                  fontSize: "14px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: highlightColor,
                  color: colorMode === "dark" ? bgColor : bgColor,
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
    </div>
  );
}
