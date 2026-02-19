"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import SheetMusic, { SheetMusicRef } from "./components/SheetMusic";
import PianoKeyboard from "./components/PianoKeyboard";
import { border, useColorMode } from "@chakra-ui/react";
import Header from "@/components/header";
import { useTheme } from "@chakra-ui/react";
import { RiCodeSLine, RiCodeSSlashFill } from "react-icons/ri";
import { TiPrinter } from "react-icons/ti";
import { FaRegFile } from "react-icons/fa6";
import {
  IoPlayOutline,
  IoPlaySkipBackOutline,
  IoPlayCircleOutline,
  IoPauseOutline,
  IoStopOutline,
  IoSettingsOutline,
  IoExpandOutline,
  IoContractOutline,
} from "react-icons/io5";
import QrModal from "@/components/modals/QrModal";

import "./score.css";
import {
  saveScore,
  getAllScores,
  deleteScore,
  isValidMusicXML,
  type StoredScore,
} from "./lib/scoreDB";
import { famousSayings } from "./lib/famousSayings";
import { findMusicTerm, type MusicTerm } from "./lib/musicTerms";
import { MdDeleteOutline } from "react-icons/md";
import { useMidi } from "./lib/useMidi";
import {
  MidiConfig,
  defaultMidiConfig,
  midiPresets,
  MidiPresetName,
} from "./lib/midiConfig";
import { noteToMidi } from "./lib/noteUtils";
import SightReadingFlashcard, {
  type SightReadingFlashcardRef,
} from "./components/SightReadingFlashcard";
import ChordPracticeFlashcard, {
  type ChordPracticeFlashcardRef,
} from "./components/ChordPracticeFlashcard";
import RhythmPracticeFlashcard, {
  type RhythmPracticeFlashcardRef,
} from "./components/RhythmPracticeFlashcard";
import { CustomSwitchColorModeButton } from "@/components/ui/CustomSwitchButton";
import { CustomAvatar } from "@/components/ui/CustomAvatar";
import { useUserContext } from "@/contexts/useUserContext";
import Auth from "@/components/ui/Auth/Auth";
import { CustomModal } from "@/components/ui/CustomModal";
import AccountSwitcher from "./components/AccountSwitcher";
import { usePlayback, type PlaybackEvent } from "./lib/usePlayback";
import FallingNotes from "./components/FallingNotes";

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
    id: "summer-chords",
    name: "summer",
    path: "/scores/summer-jiu-shi-rang-with-chords.musicxml",
  },
  {
    id: "sample",
    name: "sample",
    path: "/scores/BrahWiMeSample.musicxml",
  },
  {
    id: "friend-in-me",
    name: "You've Got a Friend in Me",
    path: "/scores/youve-got-a-friend-in-me.musicxml",
  },
  {
    id: "hanon-1-30",
    name: "hanon1-30",
    path: "/scores/hanon-ning-suo-ban-lian-xi-qu-1-kara-30.musicxml",
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
  const [playbackEvents, setPlaybackEvents] = useState<PlaybackEvent[]>([]);
  const [keyboardMidiTimeIndex, setKeyboardMidiTimeIndex] = useState(0);
  const [appMode, setAppMode] = useState<
    "score" | "keyboard" | "sightreading" | "chordpractice" | "rhythmpractice"
  >("score");

  // マウント後にlocalStorageから復元
  useEffect(() => {
    const saved = localStorage.getItem("scoreAppMode");
    if (
      saved === "score" ||
      saved === "keyboard" ||
      saved === "sightreading" ||
      saved === "chordpractice" ||
      saved === "rhythmpractice"
    ) {
      setAppMode(saved);
    }
  }, []);
  const [sightReadingExpectedNotes, setSightReadingExpectedNotes] = useState<
    number[]
  >([]);
  const sightReadingRef = useRef<SightReadingFlashcardRef>(null);
  const chordPracticeRef = useRef<ChordPracticeFlashcardRef>(null);
  const [chordPracticeExpectedNotes, setChordPracticeExpectedNotes] = useState<
    number[]
  >([]);
  const rhythmPracticeRef = useRef<RhythmPracticeFlashcardRef>(null);
  const sheetMusicRef = useRef<SheetMusicRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const loadingStartTimeRef = useRef<number>(0);
  const { colorMode } = useColorMode();
  const {
    currentUserId,
    currentUserName,
    currentUserCompany,
    currentUserMainCompany,
    currentUserPictureUrl,
    currentUserEmail,
    currentUserCreatedAt,
  } = useUserContext();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isAccountSwitcherOpen, setAccountSwitcherOpen] = useState(false);

  // 古いsw-score.jsの登録解除
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          if (reg.active?.scriptURL.includes("sw-score.js")) {
            reg.unregister();
          }
        }
      });
    }
  }, []);

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
  const detectPreset = useCallback(
    (config: MidiConfig): MidiPresetName | null => {
      for (const [name, preset] of Object.entries(midiPresets) as [
        MidiPresetName,
        MidiConfig,
      ][]) {
        const match = (Object.keys(preset) as (keyof MidiConfig)[]).every(
          (key) => config[key] === preset[key],
        );
        if (match) return name;
      }
      return null;
    },
    [],
  );

  const currentPreset = detectPreset(midiConfig);

  const scoreExpectedMidiNotes = currentNotes
    .filter((n) => n.step && typeof n.octave === "number")
    .filter(
      (n) =>
        midiConfig.staffFilter === "both" || n.staff === midiConfig.staffFilter,
    )
    .map((n) => noteToMidi(n.step, n.octave, n.alter));

  // 鍵盤モード用: playbackEventsをtimeSecondsでグループ化（和音=同時刻の音）
  // 浮動小数点誤差を考慮して近い時間をまとめ、重複MIDIノートを除去
  // staff情報も保持（PianoKeyboardの色分けに使用）
  const keyboardTimePositions = useMemo(() => {
    if (playbackEvents.length === 0) return [];
    const filtered = playbackEvents.filter(
      (e) => midiConfig.staffFilter === "both" || e.staff === midiConfig.staffFilter,
    );
    // timeSecondsでソートしてから、近い時間（0.001秒以内）を同一グループにまとめる
    const sorted = [...filtered].sort((a, b) => a.timeSeconds - b.timeSeconds);
    const groups: { time: number; notes: Map<number, number | undefined> }[] = [];
    for (const e of sorted) {
      const last = groups[groups.length - 1];
      if (last && Math.abs(e.timeSeconds - last.time) < 0.001) {
        if (!last.notes.has(e.midiNote)) {
          last.notes.set(e.midiNote, e.staff);
        }
      } else {
        groups.push({ time: e.timeSeconds, notes: new Map([[e.midiNote, e.staff]]) });
      }
    }
    return groups.map(({ time, notes }) => ({
      time,
      midiNotes: Array.from(notes.keys()),
      midiStaffMap: Object.fromEntries(notes),
    }));
  }, [playbackEvents, midiConfig.staffFilter]);

  // playbackEventsが変わったら（楽譜変更）インデックスをリセット
  useEffect(() => {
    setKeyboardMidiTimeIndex(0);
  }, [playbackEvents]);

  const keyboardMidiTime =
    keyboardTimePositions[Math.min(keyboardMidiTimeIndex, keyboardTimePositions.length - 1)]?.time ?? 0;
  const keyboardMidiExpectedNotes =
    keyboardTimePositions[Math.min(keyboardMidiTimeIndex, keyboardTimePositions.length - 1)]?.midiNotes ?? [];
  const keyboardMidiStaffMap: Record<number, number | undefined> =
    keyboardTimePositions[Math.min(keyboardMidiTimeIndex, keyboardTimePositions.length - 1)]?.midiStaffMap ?? {};

  // MIDI判定成功時: モードに応じて処理を分岐
  const handleMidiMatch = useCallback(() => {
    setWrongNotes([]);
    if (appMode === "rhythmpractice") {
      rhythmPracticeRef.current?.handlePress();
      return;
    }
    if (appMode === "sightreading") {
      sightReadingRef.current?.handleCorrectAnswer();
      return;
    }
    if (appMode === "chordpractice") {
      chordPracticeRef.current?.handleCorrectAnswer();
      return;
    }
    // 鍵盤モード: インデックスを進める
    if (appMode === "keyboard") {
      setKeyboardMidiTimeIndex((prev) =>
        Math.min(prev + 1, keyboardTimePositions.length - 1),
      );
      return;
    }
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
  }, [appMode, keyboardTimePositions.length]);

  // MIDI判定失敗時: 間違い鍵盤を赤く表示 + 譜読みモードでは不正解処理
  const handleMidiMismatch = useCallback(
    (wrong: number[]) => {
      if (appMode === "rhythmpractice") {
        // リズムモードではどんな音でもプレスとして扱う
        rhythmPracticeRef.current?.handlePress();
        return;
      }
      setWrongNotes(wrong);
      if (appMode === "sightreading") {
        sightReadingRef.current?.handleIncorrectAnswer();
      }
      if (appMode === "chordpractice") {
        chordPracticeRef.current?.handleIncorrectAnswer();
      }
    },
    [appMode],
  );

  // MIDI NoteOff: リズム練習でキーリリースを通知
  const handleMidiNoteOff = useCallback(() => {
    if (appMode === "rhythmpractice") {
      rhythmPracticeRef.current?.handleRelease();
    }
  }, [appMode]);

  // 楽譜再生
  const {
    status: playbackStatus,
    currentTime: playbackCurrentTime,
    currentTimeRef: playbackCurrentTimeRef,
    tempo: playbackTempo,
    samplesLoaded,
    play: handlePlayback,
    pause: handlePause,
    stop: handleStopPlayback,
    setTempo: setPlaybackTempo,
  } = usePlayback({
    events: playbackEvents,
    onCursorMove: (measureIndex, timestampInMeasure) => {
      if (appMode === "keyboard") return; // 鍵盤モードではカーソル移動不要
      sheetMusicRef.current?.jumpToTimestamp(measureIndex, timestampInMeasure);
    },
    onPlaybackEnd: () => {
      if (appMode === "keyboard") {
        setKeyboardMidiTimeIndex(0);
        return;
      }
      sheetMusicRef.current?.reset();
    },
    enabled:
      (appMode === "score" || appMode === "keyboard") &&
      !!selectedScore &&
      !isLoading,
  });

  // expectedMidiNotes（playbackStatusに依存するためusePlaybackの後で定義）
  const expectedMidiNotes =
    appMode === "sightreading"
      ? sightReadingExpectedNotes
      : appMode === "chordpractice"
        ? chordPracticeExpectedNotes
        : appMode === "keyboard" && playbackStatus === "stopped"
          ? keyboardMidiExpectedNotes
          : scoreExpectedMidiNotes;

  // MIDI接続（和音練習モードではオクターブ無視+contains判定）
  const effectiveMidiConfig =
    appMode === "chordpractice"
      ? { ...midiConfig, octaveIgnore: true, matchMode: "contains" as const }
      : midiConfig;
  const { connectionStatus: midiConnectionStatus, deviceName: midiDeviceName } =
    useMidi({
      config: effectiveMidiConfig,
      expectedMidiNotes,
      onMatch: handleMidiMatch,
      onMismatch: handleMidiMismatch,
      onNoteOff: handleMidiNoteOff,
      enabled:
        midiEnabled &&
        playbackStatus === "stopped" &&
        (appMode === "sightreading" ||
          appMode === "chordpractice" ||
          appMode === "rhythmpractice" ||
          (!!selectedScore && !isLoading)),
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
    console.log("[onRangeChange]", minMidi, "-", maxMidi);
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

    // 再生用にノートを抽出（重複イベントを除去）
    const rawEvents = sheetMusicRef.current?.extractAllNotes() || [];
    const seen = new Set<string>();
    const events = rawEvents.filter((e) => {
      // timeSeconds の浮動小数点誤差を丸めてキー化
      const key = `${Math.round(e.timeSeconds * 1000)}_${e.midiNote}_${e.staff ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setPlaybackEvents(events);

    // playbackEventsからkeyboardRangeを計算（onRangeChangeのhalfToneはOSMD内部値で不正確なため常にこちらを使う）
    if (events.length > 0) {
      let minM = 127;
      let maxM = 0;
      for (const e of events) {
        if (e.midiNote < minM) minM = e.midiNote;
        if (e.midiNote > maxM) maxM = e.midiNote;
      }
      // オクターブ境界（C〜B）に揃える + 上下に1オクターブ余裕
      const rangeMin = Math.max(0, Math.floor(minM / 12) * 12 - 12);
      const rangeMax = Math.min(127, Math.ceil((maxM + 1) / 12) * 12 + 11);
      setKeyboardRange({ min: rangeMin, max: rangeMax });
    }
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
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => void;
    };
    const el = pageContainerRef.current as HTMLElement & {
      webkitRequestFullscreen?: () => void;
    };
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    } else {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const onFullscreenChange = () => {
      const doc = document as Document & { webkitFullscreenElement?: Element };
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
      // 全画面切り替え後にカーソルを再表示（DOMレイアウト完了を待つ）
      setTimeout(() => {
        sheetMusicRef.current?.showCursor();
      }, 100);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFullscreenChange,
      );
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
      style={{ backgroundColor: bgColor, height: "100dvh", overflow: "hidden" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          marginTop: 0,
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
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* モード切り替え */}
            <select
              value={appMode}
              onChange={(e) => {
                const mode = e.target.value as
                  | "score"
                  | "keyboard"
                  | "sightreading"
                  | "chordpractice"
                  | "rhythmpractice";
                setAppMode(mode);
                localStorage.setItem("scoreAppMode", mode);
              }}
              style={{
                padding: "6px 8px",
                fontSize: "14px",
                borderRadius: "4px",
                borderWidth: ".5px",
                borderColor: borderColor,
                backgroundColor: bgColor,
                outline: "none",
                fontWeight: "bold",
              }}
            >
              <option value="score">楽譜</option>
              <option value="keyboard">鍵盤</option>
              <option value="sightreading">譜読み練習</option>
              <option value="chordpractice">和音練習</option>
              <option value="rhythmpractice">リズム練習</option>
            </select>
            {(appMode === "score" || appMode === "keyboard") && (
              <>
                <label
                  htmlFor="score-select"
                  style={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                >
                  <img
                    src="/images/illust/hippo/hippo_speaker.svg"
                    style={{
                      height: "32px",
                      filter: colorMode === "dark" ? "invert(100%)" : "none",
                    }}
                  />
                </label>
                <select
                  id="score-select"
                  value={selectedScoreId || ""}
                  onChange={(e) => handleScoreChange(e.target.value)}
                  style={{
                    padding: "4px 8px",
                    fontSize: "16px",
                    borderRadius: "4px",
                    borderWidth: ".5px",
                    borderColor: borderColor,
                    flex: 1,
                    minWidth: "120px",
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
                    height: "34px",
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
                      const dbId = parseInt(
                        selectedScoreId.replace("user-", ""),
                      );
                      handleDeleteScore(dbId);
                    }}
                    disabled={isLoading}
                    style={{
                      height: "34px",
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
              </>
            )}
          </div>
          {(appMode === "score" || appMode === "keyboard") && (
            <>
              <div
                style={{
                  width: ".5px",
                  height: "24px",
                  backgroundColor: borderColor,
                  margin: "0 3px",
                }}
              />
              {selectedScore && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  {/* Zoom preset buttons - 楽譜モードのみ */}
                  {appMode === "score" && (
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
                          padding: "1px 8px",
                          fontSize: "10px",
                          color: frColor,
                          // backgroundColor:
                          //   zoom === presetZoom ? highlightColor : "transparent",
                          borderRadius: "4px",
                          borderWidth: ".5px",
                          borderColor:
                            zoom === presetZoom ? borderColor : frColor,
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
                  )}
                  {/* Chord toggle button - 楽譜モードのみ */}
                  {appMode === "score" && selectedScoreId && (
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
                  {/* カーソル操作 - 楽譜モード・鍵盤モード */}
                  {(appMode === "score" || appMode === "keyboard") && (
                  <>
                  <div
                    style={{
                      width: ".5px",
                      height: "24px",
                      backgroundColor: borderColor,
                      margin: "0 3px",
                    }}
                  />
                  <button
                    onClick={() => {
                      if (appMode === "keyboard") {
                        setKeyboardMidiTimeIndex(0);
                      } else {
                        handleReset();
                      }
                    }}
                    disabled={isLoading || playbackStatus === "playing"}
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
                      cursor: isLoading || playbackStatus === "playing" ? "not-allowed" : "pointer",
                      opacity: isLoading || playbackStatus === "playing" ? 0.5 : 1,
                    }}
                  >
                    <IoPlaySkipBackOutline />
                  </button>
                  <button
                    onClick={() => {
                      if (appMode === "keyboard") {
                        setKeyboardMidiTimeIndex((prev) => Math.max(prev - 1, 0));
                      } else {
                        handlePrevious();
                      }
                    }}
                    disabled={isLoading || playbackStatus === "playing"}
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
                      cursor: isLoading || playbackStatus === "playing" ? "not-allowed" : "pointer",
                      opacity: isLoading || playbackStatus === "playing" ? 0.5 : 1,
                    }}
                  >
                    <IoPlayOutline style={{ transform: "rotate(180deg)" }} />
                  </button>
                  <button
                    onClick={() => {
                      if (appMode === "keyboard") {
                        setKeyboardMidiTimeIndex((prev) =>
                          Math.min(prev + 1, keyboardTimePositions.length - 1),
                        );
                      } else {
                        handleNext();
                      }
                    }}
                    disabled={isLoading || playbackStatus === "playing"}
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
                      cursor: isLoading || playbackStatus === "playing" ? "not-allowed" : "pointer",
                      opacity: isLoading || playbackStatus === "playing" ? 0.5 : 1,
                    }}
                  >
                    <IoPlayOutline />
                  </button>
                  </>
                  )}
                  {/* 再生コントロール */}
                  <div
                    style={{
                      width: ".5px",
                      height: "24px",
                      backgroundColor: borderColor,
                      margin: "0 3px",
                    }}
                  />
                  <button
                    onClick={playbackStatus === "playing" ? handlePause : () => {
                      // 鍵盤モードでは常に先頭から再生
                      const startTime = appMode === "keyboard" ? 0 : (sheetMusicRef.current?.getCurrentTimeSeconds() || 0);
                      handlePlayback(startTime);
                    }}
                    disabled={isLoading || playbackEvents.length === 0}
                    style={{
                      height: "40px",
                      width: "32px",
                      fontSize: "18px",
                      borderRadius: "4px",
                      borderWidth: ".5px",
                      borderColor: playbackStatus === "playing" ? highlightColor : borderColor,
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      color: playbackStatus === "playing" ? highlightColor : frColor,
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.5 : 1,
                    }}
                    title={playbackStatus === "playing" ? "一時停止" : samplesLoaded ? "再生" : "再生（初回はピアノ音読み込み）"}
                  >
                    {playbackStatus === "playing" ? <IoPauseOutline /> : <IoPlayCircleOutline />}
                  </button>
                  {playbackStatus !== "stopped" && (
                    <button
                      onClick={handleStopPlayback}
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
                        cursor: "pointer",
                      }}
                      title="停止"
                    >
                      <IoStopOutline />
                    </button>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                    }}
                    title="テンポ"
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: frColor,
                        minWidth: "32px",
                        textAlign: "center",
                        userSelect: "none",
                      }}
                    >
                      x{playbackTempo.toFixed(1)}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                      <button
                        onClick={() => {
                          const next = Math.round((playbackTempo + 0.1) * 10) / 10;
                          if (next <= 1.5) setPlaybackTempo(next);
                        }}
                        disabled={playbackTempo >= 1.5}
                        style={{
                          width: "18px",
                          height: "14px",
                          fontSize: "8px",
                          borderRadius: "2px",
                          borderWidth: ".5px",
                          borderColor: borderColor,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: playbackTempo >= 1.5 ? `${frColor}40` : frColor,
                          cursor: playbackTempo >= 1.5 ? "not-allowed" : "pointer",
                          backgroundColor: "transparent",
                          lineHeight: 1,
                        }}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => {
                          const next = Math.round((playbackTempo - 0.1) * 10) / 10;
                          if (next >= 0.5) setPlaybackTempo(next);
                        }}
                        disabled={playbackTempo <= 0.5}
                        style={{
                          width: "18px",
                          height: "14px",
                          fontSize: "8px",
                          borderRadius: "2px",
                          borderWidth: ".5px",
                          borderColor: borderColor,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: playbackTempo <= 0.5 ? `${frColor}40` : frColor,
                          cursor: playbackTempo <= 0.5 ? "not-allowed" : "pointer",
                          backgroundColor: "transparent",
                          lineHeight: 1,
                        }}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      width: ".5px",
                      height: "24px",
                      backgroundColor: borderColor,
                      margin: "0 3px",
                    }}
                  />
                  {/* MIDI接続状態ドット + 設定ボタン */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginLeft: "auto",
                    }}
                  >
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
                    <QrModal />
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
                      {isFullscreen ? (
                        <IoContractOutline />
                      ) : (
                        <IoExpandOutline />
                      )}
                    </button>
                    <CustomSwitchColorModeButton />
                    <div
                      onClick={() => setAccountSwitcherOpen(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <CustomAvatar
                        src={currentUserPictureUrl ?? undefined}
                        boxSize="30px"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {/* 譜読み/和音/リズムモード時のMIDI接続ドット + 設定 + 全画面 */}
          {(appMode === "sightreading" ||
            appMode === "chordpractice" ||
            appMode === "rhythmpractice") && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginLeft: "auto",
              }}
            >
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
              <QrModal />
              <button
                onClick={() => setShowMidiSettings(true)}
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
                  cursor: "pointer",
                }}
                title="MIDI設定"
              >
                <IoSettingsOutline />
              </button>
              <button
                onClick={handleFullscreenToggle}
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
                  cursor: "pointer",
                }}
                title={isFullscreen ? "全画面解除" : "全画面"}
              >
                {isFullscreen ? <IoContractOutline /> : <IoExpandOutline />}
              </button>
              <CustomSwitchColorModeButton />
              <div
                onClick={() => setAccountSwitcherOpen(true)}
                style={{ cursor: "pointer" }}
              >
                <CustomAvatar
                  src={currentUserPictureUrl ?? undefined}
                  boxSize="30px"
                />
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
          {(appMode === "score" || appMode === "keyboard") &&
            isLoading && ( // Show loading animation when isLoading is true
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
                  backgroundColor: "#1a1a2e",
                }}
              >
                <div className="loading-hippo-container">
                  <img
                    src="/images/illust/hippo/hippo_beat4.svg"
                    alt="Loading..."
                    className="loading-hippo hippo-1"
                    style={{
                      filter: "invert(1)",
                    }}
                  />
                  <img
                    src="/images/illust/hippo/hippo_beat8.svg"
                    alt="Loading..."
                    className="loading-hippo hippo-2"
                    style={{
                      filter: "invert(1)",
                    }}
                  />
                  <img
                    src="/images/illust/hippo/hippo_beat16.svg"
                    alt="Loading..."
                    className="loading-hippo hippo-3"
                    style={{
                      filter: "invert(1)",
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
                        color: "#ffffff",
                        margin: 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {currentQuote.quote}
                    </p>
                    <p
                      style={{
                        fontSize: "0.9em",
                        color: "#ffffff",
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
          {appMode === "rhythmpractice" ? (
            <RhythmPracticeFlashcard
              ref={rhythmPracticeRef}
              darkMode={colorMode === "dark"}
              highlightColor={highlightColor}
              borderColor={borderColor}
              frColor={frColor}
              bgColor={bgColor}
              userId={currentUserId}
            />
          ) : appMode === "chordpractice" ? (
            <ChordPracticeFlashcard
              ref={chordPracticeRef}
              onExpectedNotesChange={setChordPracticeExpectedNotes}
              wrongNotes={wrongNotes}
              onWrongNotesReset={() => setWrongNotes([])}
              darkMode={colorMode === "dark"}
              highlightColor={highlightColor}
              borderColor={borderColor}
              frColor={frColor}
              bgColor={bgColor}
              userId={currentUserId}
            />
          ) : appMode === "sightreading" ? (
            <SightReadingFlashcard
              ref={sightReadingRef}
              onExpectedNotesChange={setSightReadingExpectedNotes}
              wrongNotes={wrongNotes}
              onWrongNotesReset={() => setWrongNotes([])}
              darkMode={colorMode === "dark"}
              highlightColor={highlightColor}
              borderColor={borderColor}
              frColor={frColor}
              bgColor={bgColor}
              userId={currentUserId}
            />
          ) : appMode === "keyboard" && selectedScore ? (
            <>
              {/* SheetMusic を非表示で保持（extractAllNotes / onRangeChange が必要） */}
              <div style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", opacity: 0 }}>
                <SheetMusic
                  ref={sheetMusicRef}
                  musicXmlPath={selectedScore}
                  musicXmlContent={selectedScoreContent || undefined}
                  onNotesChange={handleNotesChange}
                  onRangeChange={handleRangeChange}
                  onLoad={handleSheetMusicLoad}
                  onMusicTermClick={handleMusicTermClick}
                  showChords={false}
                  darkMode={colorMode === "dark"}
                />
              </div>
              <FallingNotes
                events={midiConfig.staffFilter === "both"
                  ? playbackEvents
                  : playbackEvents.filter(e => e.staff === midiConfig.staffFilter)
                }
                currentTime={
                  playbackStatus === "stopped"
                    ? keyboardMidiTime / playbackTempo
                    : playbackCurrentTime
                }
                currentTimeRef={playbackCurrentTimeRef}
                tempo={playbackTempo}
                keyboardRange={keyboardRange}
                darkMode={colorMode === "dark"}
                playbackStatus={playbackStatus}
              />
            </>
          ) : selectedScore ? (
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
            height: "120px",
            padding: "0 0 0 0",
            backgroundColor: "#f5f5f5",
          }}
        >
          {appMode === "rhythmpractice" ? (
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
              MIDI鍵盤 / スペースキー / 画面タップでリズムを入力
            </div>
          ) : appMode === "sightreading" || appMode === "chordpractice" ? (
            <PianoKeyboard
              notes={(appMode === "chordpractice"
                ? chordPracticeExpectedNotes
                : sightReadingExpectedNotes
              ).map((midi) => {
                const semitone = midi % 12;
                const octave = Math.floor(midi / 12) - 1;
                const semitoneToNote = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
                const semitoneToAlter = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
                const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
                const step = noteNames[semitoneToNote[semitone]];
                const alter = semitoneToAlter[semitone];
                return { step, octave, alter };
              })}
              wrongNotes={wrongNotes}
            />
          ) : appMode === "keyboard" && selectedScore ? (
            <PianoKeyboard
              notes={(() => {
                if (playbackStatus === "stopped") {
                  // 停止中: 現在位置の期待ノートだけを表示
                  return keyboardMidiExpectedNotes.map((midi) => {
                    const semitone = midi % 12;
                    const octave = Math.floor(midi / 12) - 1;
                    const semitoneToNote = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
                    const semitoneToAlter = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
                    const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
                    const step = noteNames[semitoneToNote[semitone]];
                    const alter = semitoneToAlter[semitone];
                    return { step, octave, alter, staff: keyboardMidiStaffMap[midi] };
                  });
                }
                // 再生中: 現在鳴っている音を表示
                const scoreTime = playbackCurrentTime * playbackTempo;
                return playbackEvents
                  .filter(
                    (e) =>
                      scoreTime >= e.timeSeconds &&
                      scoreTime < e.timeSeconds + e.durationSeconds,
                  )
                  .filter(
                    (e) =>
                      midiConfig.staffFilter === "both" || e.staff === midiConfig.staffFilter,
                  )
                  .map((e) => {
                    const semitone = e.midiNote % 12;
                    const octave = Math.floor(e.midiNote / 12) - 1;
                    const semitoneToNote = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
                    const semitoneToAlter = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
                    const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
                    const step = noteNames[semitoneToNote[semitone]];
                    const alter = semitoneToAlter[semitone];
                    return { step, octave, alter, staff: e.staff };
                  });
              })()}
              minMidi={keyboardRange?.min}
              maxMidi={keyboardRange?.max}
              wrongNotes={wrongNotes}
            />
          ) : selectedScore ? (
            <PianoKeyboard
              notes={(() => {
                // 再生中: 落下ノートと連動（現在鳴っている音をハイライト）
                if (playbackStatus === "playing") {
                  const scoreTime = playbackCurrentTime * playbackTempo;
                  return playbackEvents
                    .filter(
                      (e) =>
                        scoreTime >= e.timeSeconds &&
                        scoreTime < e.timeSeconds + e.durationSeconds,
                    )
                    .filter(
                      (e) =>
                        midiConfig.staffFilter === "both" || e.staff === midiConfig.staffFilter,
                    )
                    .map((e) => {
                      const semitone = e.midiNote % 12;
                      const octave = Math.floor(e.midiNote / 12) - 1;
                      const semitoneToNote = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
                      const semitoneToAlter = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
                      const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
                      const step = noteNames[semitoneToNote[semitone]];
                      const alter = semitoneToAlter[semitone];
                      return { step, octave, alter, staff: e.staff };
                    });
                }
                // 停止中: カーソル位置の音符を表示
                return midiConfig.staffFilter === "both"
                  ? currentNotes
                  : currentNotes.filter(
                      (n) => n.staff === midiConfig.staffFilter,
                    );
              })()}
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
              鍵盤ガイド
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
                      ? colorMode === "dark"
                        ? "rgba(76, 175, 80, 0.2)"
                        : "rgba(76, 175, 80, 0.1)"
                      : colorMode === "dark"
                        ? "rgba(153, 153, 153, 0.2)"
                        : "rgba(153, 153, 153, 0.1)",
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
              <div
                style={{ display: "flex", gap: "8px", marginBottom: "20px" }}
              >
                {(["practice", "exact"] as MidiPresetName[]).map(
                  (presetName) => (
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
                        borderColor:
                          currentPreset === presetName
                            ? highlightColor
                            : borderColor,
                        backgroundColor:
                          currentPreset === presetName
                            ? colorMode === "dark"
                              ? `${highlightColor}40`
                              : `${highlightColor}20`
                            : "transparent",
                        color: frColor,
                        cursor: "pointer",
                        fontWeight:
                          currentPreset === presetName ? "bold" : "normal",
                      }}
                    >
                      {presetName === "practice"
                        ? "練習モード"
                        : "完全一致モード"}
                    </button>
                  ),
                )}
              </div>

              {/* 判定方式 */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: frColor,
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  判定方式
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[
                    { value: "any" as const, label: "何でもOK" },
                    { value: "contains" as const, label: "含む" },
                    { value: "exact" as const, label: "完全一致" },
                  ].map((opt) => (
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
                        borderColor:
                          midiConfig.matchMode === opt.value
                            ? highlightColor
                            : borderColor,
                        backgroundColor:
                          midiConfig.matchMode === opt.value
                            ? colorMode === "dark"
                              ? `${highlightColor}40`
                              : `${highlightColor}20`
                            : "transparent",
                        color: frColor,
                        cursor: "pointer",
                        fontWeight:
                          midiConfig.matchMode === opt.value
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 和音判定の時間窓 */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: frColor,
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
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
                        borderColor:
                          midiConfig.chordTimeWindow === ms
                            ? highlightColor
                            : borderColor,
                        backgroundColor:
                          midiConfig.chordTimeWindow === ms
                            ? colorMode === "dark"
                              ? `${highlightColor}40`
                              : `${highlightColor}20`
                            : "transparent",
                        color: frColor,
                        cursor: "pointer",
                        fontWeight:
                          midiConfig.chordTimeWindow === ms ? "bold" : "normal",
                      }}
                    >
                      {ms}ms
                    </button>
                  ))}
                </div>
              </div>

              {/* 判定対象（譜表フィルタ） */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: frColor,
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  判定対象
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[
                    { value: "both" as const, label: "両手" },
                    { value: 1 as const, label: "右手のみ" },
                    { value: 2 as const, label: "左手のみ" },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      onClick={() =>
                        updateMidiConfig({ staffFilter: opt.value })
                      }
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor:
                          midiConfig.staffFilter === opt.value
                            ? highlightColor
                            : borderColor,
                        backgroundColor:
                          midiConfig.staffFilter === opt.value
                            ? colorMode === "dark"
                              ? `${highlightColor}40`
                              : `${highlightColor}20`
                            : "transparent",
                        color: frColor,
                        cursor: "pointer",
                        fontWeight:
                          midiConfig.staffFilter === opt.value
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* トグルスイッチ群 */}
              {[
                { key: "skipRests" as const, label: "休符の自動スキップ" },
                { key: "showWrongNotes" as const, label: "間違い音の表示" },
                { key: "octaveIgnore" as const, label: "オクターブ無視モード" },
                {
                  key: "velocitySensitivity" as const,
                  label: "ベロシティ感度",
                },
              ].map((opt) => (
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
                  <span style={{ fontSize: "13px", color: frColor }}>
                    {opt.label}
                  </span>
                  <button
                    onClick={() =>
                      updateMidiConfig({ [opt.key]: !midiConfig[opt.key] })
                    }
                    style={{
                      width: "44px",
                      height: "24px",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: midiConfig[opt.key]
                        ? highlightColor
                        : "#ccc",
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
                  <div
                    style={{
                      fontSize: "12px",
                      color: frColor,
                      marginBottom: "6px",
                    }}
                  >
                    ベロシティ閾値: {midiConfig.velocityThreshold}
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={127}
                    value={midiConfig.velocityThreshold}
                    onChange={(e) =>
                      updateMidiConfig({
                        velocityThreshold: parseInt(e.target.value),
                      })
                    }
                    style={{ width: "100%", accentColor: highlightColor }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "10px",
                      color: "#999",
                    }}
                  >
                    <span>1 (超敏感)</span>
                    <span>127 (最強のみ)</span>
                  </div>
                </div>
              )}

              {/* 間違い表示のクリア */}
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: frColor,
                    marginBottom: "6px",
                    fontWeight: "bold",
                  }}
                >
                  間違い表示のクリア
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[
                    { value: "nextNoteOn" as const, label: "次の音入力時" },
                    { value: "timeout" as const, label: "一定時間後" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        updateMidiConfig({ wrongNoteResetOn: opt.value })
                      }
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        fontSize: "12px",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor:
                          midiConfig.wrongNoteResetOn === opt.value
                            ? highlightColor
                            : borderColor,
                        backgroundColor:
                          midiConfig.wrongNoteResetOn === opt.value
                            ? colorMode === "dark"
                              ? `${highlightColor}40`
                              : `${highlightColor}20`
                            : "transparent",
                        color: frColor,
                        cursor: "pointer",
                        fontWeight:
                          midiConfig.wrongNoteResetOn === opt.value
                            ? "bold"
                            : "normal",
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
                  <div
                    style={{
                      fontSize: "12px",
                      color: frColor,
                      marginBottom: "6px",
                    }}
                  >
                    クリアまでの時間
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {[500, 1000, 2000].map((ms) => (
                      <button
                        key={ms}
                        onClick={() =>
                          updateMidiConfig({ wrongNoteTimeout: ms })
                        }
                        style={{
                          flex: 1,
                          padding: "6px 8px",
                          fontSize: "12px",
                          borderRadius: "4px",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor:
                            midiConfig.wrongNoteTimeout === ms
                              ? highlightColor
                              : borderColor,
                          backgroundColor:
                            midiConfig.wrongNoteTimeout === ms
                              ? colorMode === "dark"
                                ? `${highlightColor}40`
                                : `${highlightColor}20`
                              : "transparent",
                          color: frColor,
                          cursor: "pointer",
                          fontWeight:
                            midiConfig.wrongNoteTimeout === ms
                              ? "bold"
                              : "normal",
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

      {/* アカウント切替ポップアップ */}
      <AccountSwitcher
        isOpen={isAccountSwitcherOpen}
        onClose={() => setAccountSwitcherOpen(false)}
        onOpenLogin={() => setLoginModalOpen(true)}
        currentUserId={currentUserId}
        darkMode={colorMode === "dark"}
        highlightColor={highlightColor}
        borderColor={borderColor}
        frColor={frColor}
        bgColor={bgColor}
      />

      {/* ログインモーダル（全画面対応: portalをpageContainer内に配置） */}
      <CustomModal
        title=""
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        modalSize="lg"
        macCloseButtonHandlers={[() => setLoginModalOpen(false)]}
        footer={<></>}
        portalContainerRef={pageContainerRef}
      >
        <Auth
          userData={{
            userName: currentUserName,
            userCompany: currentUserCompany,
            pictureUrl: currentUserPictureUrl,
            userMainCompany: currentUserMainCompany,
            userEmail: currentUserEmail,
            created_at: currentUserCreatedAt,
          }}
        />
      </CustomModal>
    </div>
  );
}
