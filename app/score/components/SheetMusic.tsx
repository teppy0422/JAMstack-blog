"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import React from "react"; // Import React for React.CSSProperties
import { isMusicTerm } from "../lib/musicTerms";
import { useTheme } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { getScoreColors } from "../lib/colors";
import type { PlaybackEvent } from "../lib/usePlayback";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

interface SheetMusicProps {
  musicXmlPath: string;
  musicXmlContent?: string; // Optional: direct XML content instead of path
  onNotesChange?: (
    notes: Array<{
      step: string;
      octave: number;
      alter: number;
      staff?: number;
    }>,
  ) => void;
  onRangeChange?: (minMidi: number, maxMidi: number) => void;
  onLoad?: () => void;
  onMusicTermClick?: (term: string) => void; // Callback when a music term is clicked
  style?: React.CSSProperties;
  showChords?: boolean; // Whether to display chord symbols
  darkMode?: boolean; // Dark mode for score colors
}

export interface SheetMusicRef {
  next: () => void;
  previous: () => void;
  reset: () => void;
  setZoom: (zoom: number) => Promise<void>;
  hideCursor: () => void;
  showCursor: () => void;
  getNotesAtPosition: (
    x: number,
    y: number,
  ) => Array<{ step: string; octave: number; alter: number; staff?: number }>;
  setChordVisibility: (visible: boolean) => Promise<void>;
  jumpToTimestamp: (measureIndex: number, timestampInMeasure: number) => void;
  /** 現在のカーソル位置の音符を取得 */
  getCurrentNotes: () => Array<{
    step: string;
    octave: number;
    alter: number;
    staff?: number;
  }>;
  /** カーソルが終端に達しているか */
  isEndReached: () => boolean;
  /** 全音符を抽出（再生用） */
  extractAllNotes: () => PlaybackEvent[];
  /** 現在のカーソル位置の絶対時間（秒）を取得 */
  getCurrentTimeSeconds: () => number;
}

const SheetMusic = forwardRef<SheetMusicRef, SheetMusicProps>(
  (
    {
      musicXmlPath,
      musicXmlContent,
      onNotesChange,
      onRangeChange,
      onLoad,
      onMusicTermClick,
      style,
      showChords = true,
      darkMode = false,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();
    const { colorMode } = useColorMode();

    const highlightColor =
      colorMode === "dark"
        ? theme.colors.custom.theme.orange[500]
        : theme.colors.custom.pianoHighlight;
    const bgColor =
      colorMode === "dark"
        ? theme.colors.custom.theme.dark[900]
        : theme.colors.custom.theme.light[500];
    const sc = getScoreColors(darkMode);
    // Store position map in a ref so it can be updated after zoom changes
    const positionToTimestampMapRef = useRef<
      Array<{
        x: number;
        y: number;
        measureIndex: number;
        timestamp: number;
      }>
    >([]);
    // マップが構築済みかどうか（遅延構築のフラグ）
    const positionMapBuiltRef = useRef(false);

    // Store onMusicTermClick in ref for use in setupClickHandlers
    const onMusicTermClickRef = useRef(onMusicTermClick);
    onMusicTermClickRef.current = onMusicTermClick;

    // Store onNotesChange in ref for use in setupClickHandlers
    const onNotesChangeRef = useRef(onNotesChange);
    onNotesChangeRef.current = onNotesChange;

    // Add new types for parsed MusicXML data
    interface ParsedMusicXmlNote {
      measureIndex: number; // 0-indexed
      timestampInMeasure: number; // RealValue from OSMD, beat-relative
      midi: number;
      duration: number; // Raw duration from MusicXML (in divisions)
      tieStart: boolean;
      tieStop: boolean;
    }

    // Store parsed MusicXML note data
    const parsedMusicXmlNotesRef = useRef<ParsedMusicXmlNote[]>([]);
    const divisionsRef = useRef<number>(0); // Add this new ref

    // Function to parse MusicXML content
    const parseMusicXml = async (xmlContent: string) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

      const parsedNotes: ParsedMusicXmlNote[] = [];
      let divisions = 0;

      // Get divisions from <attributes> inside the first measure (NOT from <defaults>)
      const divisionsElement = xmlDoc.querySelector("part > measure > attributes > divisions");
      if (divisionsElement && divisionsElement.textContent) {
        divisions = parseInt(divisionsElement.textContent, 10);
      }
      if (divisions === 0) {
        console.warn("MusicXML: Could not find divisions or it is 0. Defaulting to 1.");
        divisions = 1; // Fallback
      }
      divisionsRef.current = divisions; // Store divisions in ref

      const parts = xmlDoc.querySelectorAll("part");
      parts.forEach((part) => {
        const measures = part.querySelectorAll("measure");
        measures.forEach((measure, measureNumber0Indexed) => {
          // Check for divisions change within this measure
          const localDivisionsEl = measure.querySelector("attributes > divisions");
          if (localDivisionsEl && localDivisionsEl.textContent) {
            const localDiv = parseInt(localDivisionsEl.textContent, 10);
            if (localDiv > 0) divisions = localDiv;
          }

          let currentMeasureTime = 0; // Time in 'divisions' within the measure

          // Use childNodes to iterate in document order (querySelectorAll may not preserve order for siblings)
          const children = measure.children;
          for (let i = 0; i < children.length; i++) {
            const child = children[i];

            // Handle <forward> and <backup> elements for multi-voice
            if (child.tagName === "forward") {
              const durEl = child.querySelector("duration");
              if (durEl && durEl.textContent) {
                currentMeasureTime += parseInt(durEl.textContent, 10);
              }
              continue;
            }
            if (child.tagName === "backup") {
              const durEl = child.querySelector("duration");
              if (durEl && durEl.textContent) {
                currentMeasureTime -= parseInt(durEl.textContent, 10);
              }
              continue;
            }

            if (child.tagName !== "note") continue;

            const noteElement = child;
            const durationElement = noteElement.querySelector("duration");
            const tieElements = noteElement.querySelectorAll("tie");
            const pitchElement = noteElement.querySelector("pitch");
            const restElement = noteElement.querySelector("rest");
            const chordElement = noteElement.querySelector("chord");

            const noteDuration = durationElement && durationElement.textContent
              ? parseInt(durationElement.textContent, 10) : 0;

            // Record the start time BEFORE advancing
            const noteStartTime = currentMeasureTime;

            // Advance time only for non-chord notes (chord notes share the same start time)
            if (!chordElement) {
              currentMeasureTime += noteDuration;
            }

            // Skip rests
            if (restElement) continue;

            if (pitchElement && noteDuration > 0) {
              const stepElement = pitchElement.querySelector("step");
              const octaveElement = pitchElement.querySelector("octave");
              const alterElement = pitchElement.querySelector("alter");

              if (stepElement && octaveElement) {
                const step = stepElement.textContent;
                const octave = parseInt(octaveElement.textContent!, 10);
                const alter = alterElement ? parseInt(alterElement.textContent!, 10) : 0;

                const stepToSemitone: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
                const midi = (octave + 1) * 12 + (stepToSemitone[step as string] ?? 0) + alter;

                const tieStart = Array.from(tieElements).some(tie => tie.getAttribute("type") === "start");
                const tieStop = Array.from(tieElements).some(tie => tie.getAttribute("type") === "stop");

                parsedNotes.push({
                  measureIndex: measureNumber0Indexed,
                  timestampInMeasure: noteStartTime / divisions,
                  midi,
                  duration: noteDuration,
                  tieStart,
                  tieStop,
                });
              }
            }
          }
        });
      });
      parsedMusicXmlNotesRef.current = parsedNotes;
      return parsedNotes;
    };

    // Fix chord symbol text (e.g., "maj7" -> "Maj7") after OSMD renders
    const fixChordSymbolText = () => {
      if (!containerRef.current) return;
      const textElements = containerRef.current.querySelectorAll("text");
      textElements.forEach((textEl) => {
        const content = textEl.textContent;
        if (!content) return;
        if (/Time stretch/i.test(content) || /Hands shake/i.test(content)) {
          (textEl as SVGElement).style.display = "none";
          return;
        }
        if (/maj/i.test(content)) {
          const fixed = content.replace(/maj/g, "Maj");
          if (fixed !== content) {
            textEl.textContent = fixed;
          }
        }
      });
    };

    // Function to build position-to-timestamp map for note click functionality
    // 重い処理なので最初のクリック時にのみ実行する（遅延構築）
    const buildPositionToTimestampMap = () => {
      const map: Array<{
        x: number;
        y: number;
        measureIndex: number;
        timestamp: number;
      }> = [];

      if (osmdRef.current?.cursor && containerRef.current) {
        const cursor = osmdRef.current.cursor;
        const scrollContainer = containerRef.current.closest("main");
        const savedScrollTop = scrollContainer?.scrollTop || 0;
        const originalFollowCursor = osmdRef.current.FollowCursor;
        osmdRef.current.FollowCursor = false;

        cursor.reset();

        while (!cursor.Iterator.EndReached) {
          const cursorElement = (cursor as any).cursorElement;
          if (cursorElement) {
            const rect = cursorElement.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;

            map.push({
              x,
              y,
              measureIndex: (cursor.Iterator as any).currentMeasureIndex,
              timestamp: (cursor.Iterator as any).currentTimeStamp?.RealValue || 0,
            });
          }
          cursor.next();
        }

        cursor.reset();
        cursor.update();
        osmdRef.current.FollowCursor = originalFollowCursor;
        if (scrollContainer) {
          scrollContainer.scrollTop = savedScrollTop;
        }
      }

      positionToTimestampMapRef.current = map;
      positionMapBuiltRef.current = true;
      return map;
    };

    // Function to setup note click handlers (called after render and zoom changes)
    const setupNoteClickHandlers = () => {
      if (!containerRef.current || !osmdRef.current?.cursor) return;

      const staveNoteElements =
        containerRef.current.querySelectorAll(".vf-stavenote");

      const cursorElement = (osmdRef.current.cursor as any).cursorElement;
      const cursorHeight = cursorElement
        ? cursorElement.getBoundingClientRect().height
        : 100;

      staveNoteElements.forEach((element) => {
        const noteElement = element as SVGGraphicsElement;
        const bbox = noteElement.getBBox();
        const svgNS = "http://www.w3.org/2000/svg";
        const rectOverlay = document.createElementNS(svgNS, "rect");

        const noteCenterY = bbox.y + bbox.height / 2;
        const overlayHeight = cursorHeight;
        const overlayY = noteCenterY - overlayHeight / 2;

        rectOverlay.setAttribute("x", String(bbox.x));
        rectOverlay.setAttribute("y", String(overlayY));
        rectOverlay.setAttribute("width", String(bbox.width));
        rectOverlay.setAttribute("height", String(overlayHeight));
        rectOverlay.setAttribute("fill", "transparent");
        rectOverlay.setAttribute("style", "cursor: pointer;");

        rectOverlay.addEventListener("click", (e) => {
          e.stopPropagation();

          const noteRect = noteElement.getBoundingClientRect();
          const currentContainerRect =
            containerRef.current?.getBoundingClientRect();
          if (!currentContainerRect) return;
          const noteX =
            noteRect.left - currentContainerRect.left + noteRect.width / 2;
          const noteY =
            noteRect.top - currentContainerRect.top + noteRect.height / 2;

          if (positionToTimestampMapRef.current.length === 0) {
            buildPositionToTimestampMap();
          }
          const positionMap = positionToTimestampMapRef.current;
          let closest = positionMap[0];
          let minDist = Infinity;

          for (const entry of positionMap) {
            const distX = Math.abs(entry.x - noteX);
            const distY = Math.abs(entry.y - noteY);
            const dist = Math.sqrt(distX * distX + distY * distY);
            if (dist < minDist) {
              minDist = dist;
              closest = entry;
            }
          }

          if (closest) {
            if (osmdRef.current?.cursor) {
              const cursor = osmdRef.current.cursor;

              cursor.reset();
              let stepCount = 0;
              const maxSteps = 10000;

              while (!cursor.Iterator.EndReached && stepCount < maxSteps) {
                const currentMeasureIndex = (cursor.Iterator as any).currentMeasureIndex;
                const currentTimestamp =
                  (cursor.Iterator as any).currentTimeStamp?.RealValue || 0;

                if (
                  currentMeasureIndex === closest.measureIndex &&
                  Math.abs(currentTimestamp - closest.timestamp) < 0.001
                ) {
                  break;
                }

                if (currentMeasureIndex > closest.measureIndex) {
                  cursor.previous();
                  break;
                }

                cursor.next();
                stepCount++;
              }

              cursor.update();
              if (darkMode) {
                const cursorElement = (cursor as any).cursorElement;
                const cursorOverlay =
                  cursorElement?.parentElement?.querySelector(
                    ".cursor-overlay-orange",
                  ) as HTMLDivElement;
                if (cursorOverlay && cursorElement) {
                  cursorOverlay.style.top = cursorElement.style.top;
                  cursorOverlay.style.left = cursorElement.style.left;
                  cursorOverlay.style.height =
                    cursorElement.getAttribute("height") + "px";
                  cursorOverlay.style.width =
                    cursorElement.getAttribute("width") + "px";
                }
              }
              onNotesChangeRef.current?.(getCurrentNotes());
            }
          }
        });
        noteElement.appendChild(rectOverlay);
      });
    };

    const getCurrentNotes = () => {
      if (!osmdRef.current?.cursor) {
        return [];
      }
      try {
        const cursor = osmdRef.current.cursor;
        const iterator = cursor.Iterator;
        if (!iterator) {
          return [];
        }

        const notes: Array<{
          step: string;
          octave: number;
          alter: number;
          staff?: number;
        }> = [];

        const currentMeasure = iterator.CurrentMeasure;
        const currentTimestamp =
          (iterator as any).currentTimeStamp || (iterator as any).CurrentTimeStamp;

        if (currentMeasure && currentTimestamp) {
          for (const staffEntry of (currentMeasure as any).staffLinkedExpressions ||
            []) {
            for (const voiceEntry of staffEntry) {
              if (
                voiceEntry?.Timestamp?.RealValue === currentTimestamp.RealValue
              ) {
                if (voiceEntry?.Notes) {
                  for (const note of voiceEntry.Notes) {
                    const noteAny = note as any;
                    let pitch: any = null;
                    if (noteAny.Pitch) {
                      pitch = noteAny.Pitch;
                    } else if (noteAny.sourceNote?.Pitch) {
                      pitch = noteAny.sourceNote.Pitch;
                    }
                    if (pitch) {
                      const semitone = pitch.halfTone % 12;
                      const noteNames = [
                        "C",
                        "C#",
                        "D",
                        "D#",
                        "E",
                        "F",
                        "F#",
                        "G",
                        "G#",
                        "A",
                        "A#",
                        "B",
                      ];
                      const step = noteNames[semitone] || "C";
                      const octave =
                        pitch.halfTone !== undefined
                          ? Math.floor(pitch.halfTone / 12)
                          : 4;
                      const noteData = {
                        step,
                        octave,
                        alter: pitch.Alter || 0,
                      };
                      notes.push(noteData);
                    }
                  }
                }
              }
            }
          }
        }

        if (notes.length === 0 && currentTimestamp) {
          try {
            const musicSheet = (iterator as any).musicSheet;
            const currentMeasure = iterator.CurrentMeasure;
            if (musicSheet?.SourceMeasures && currentMeasure) {
              const measureIndex = (iterator as any).currentMeasureIndex;
              const sourceMeasure = musicSheet.SourceMeasures[measureIndex];
              if (sourceMeasure) {
                const measureStartTimestamp =
                  (sourceMeasure as any).AbsoluteTimestamp?.RealValue || 0;

                for (const staffEntry of sourceMeasure.VerticalSourceStaffEntryContainers ||
                  []) {
                  for (const sourceStaffEntry of staffEntry.StaffEntries ||
                    []) {
                    if (!sourceStaffEntry) continue;
                    const entryTimestamp = sourceStaffEntry.Timestamp;
                    const voiceEntries = sourceStaffEntry.VoiceEntries;
                    const staffId = (sourceStaffEntry as any).ParentStaff
                      ?.idInMusicSheet;
                    const staffNumber =
                      typeof staffId === "number" ? staffId + 1 : undefined;

                    if (voiceEntries && entryTimestamp) {
                      for (const voiceEntry of voiceEntries) {
                        if (voiceEntry?.Notes) {
                          const entryStart =
                            measureStartTimestamp + entryTimestamp.RealValue;
                          const tolerance = 0.001;
                          if (
                            Math.abs(entryStart - currentTimestamp.RealValue) <
                            tolerance
                          ) {
                            for (const note of voiceEntry.Notes) {
                              const noteAny = note as any;
                              let pitch: any = null;
                              if (noteAny.Pitch) {
                                pitch = noteAny.Pitch;
                              } else if (noteAny.sourceNote?.Pitch) {
                                pitch = noteAny.sourceNote.Pitch;
                              }
                              if (pitch) {
                                const halfTone = pitch.halfTone;
                                if (typeof halfTone === "number") {
                                  const noteNames = [
                                    "C",
                                    "D",
                                    "E",
                                    "F",
                                    "G",
                                    "A",
                                    "B",
                                  ];
                                  const semitoneToNote = [
                                    0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6,
                                  ];
                                  const semitoneToAlter = [
                                    0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
                                  ];

                                  const octave = Math.floor(halfTone / 12) - 1;
                                  const semitone = halfTone % 12;
                                  const noteIndex = semitoneToNote[semitone];
                                  const step = noteNames[noteIndex];
                                  const alter = semitoneToAlter[semitone];

                                  const noteData = {
                                    step,
                                    octave,
                                    alter,
                                    staff: staffNumber,
                                  };
                                  notes.push(noteData);
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } catch (err) {
            console.error(
              "Error getting sounding notes from music sheet:",
              err,
            );
          }
        }

        const graphicalMeasure = iterator.CurrentMeasure;

        if (notes.length === 0) {
          if ((graphicalMeasure as any)?.staffEntries) {
            for (const staffEntry of (graphicalMeasure as any).staffEntries) {
              const staffTimestamp = (staffEntry as any)?.timestamp;

              if (staffTimestamp?.RealValue === currentTimestamp?.RealValue) {
                if (staffEntry?.graphicalVoiceEntries) {
                  for (const graphicalVoiceEntry of staffEntry.graphicalVoiceEntries) {
                    const voiceEntry = (graphicalVoiceEntry as any)
                      ?.parentVoiceEntry;

                    if (voiceEntry?.Notes) {
                      for (const note of voiceEntry.Notes) {
                        const noteAny = note as any;
                        let pitch: any = null;
                        if (noteAny.Pitch) {
                          pitch = noteAny.Pitch;
                        } else if (noteAny.sourceNote?.Pitch) {
                          pitch = noteAny.sourceNote.Pitch;
                        }
                        if (pitch) {
                          const fundamentalNote = pitch.fundamentalNote;
                          const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
                          const step =
                            fundamentalNote !== undefined
                              ? noteNames[fundamentalNote]
                              : "C";
                          const octave =
                            pitch.octave !== undefined ? pitch.octave : 4;
                          const alter = pitch.accidental || 0;
                          const staffId3 = (staffEntry as any)?.parentStaffEntry
                            ?.ParentStaff?.idInMusicSheet;
                          const staffNumber3 =
                            typeof staffId3 === "number"
                              ? staffId3 + 1
                              : undefined;
                          const noteData = {
                            step,
                            octave,
                            alter,
                            staff: staffNumber3,
                          };
                          notes.push(noteData);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (notes.length === 0 && currentMeasure && currentTimestamp) {
          if ((graphicalMeasure as any)?.staffEntries) {
            for (const staffEntry of (graphicalMeasure as any).staffEntries) {
              const entryTimestamp = (staffEntry as any)?.timestamp;
              const entryEndTimestamp = (staffEntry as any)?.endTimestamp;

              if (entryTimestamp && currentTimestamp) {
                const starts =
                  entryTimestamp.RealValue <= currentTimestamp.RealValue;
                const notEnded =
                  !entryEndTimestamp ||
                  entryEndTimestamp.RealValue > currentTimestamp.RealValue;

                if (starts && notEnded) {
                  if (staffEntry?.graphicalVoiceEntries) {
                    for (const graphicalVoiceEntry of staffEntry.graphicalVoiceEntries) {
                      const voiceEntry = (graphicalVoiceEntry as any)
                        ?.parentVoiceEntry;

                      if (voiceEntry?.Notes) {
                        for (const note of voiceEntry.Notes) {
                          const noteAny = note as any;
                          let pitch: any = null;
                          if (noteAny.Pitch) {
                            pitch = noteAny.Pitch;
                          } else if (noteAny.sourceNote?.Pitch) {
                            pitch = noteAny.sourceNote.Pitch;
                          }
                          if (pitch) {
                            const fundamentalNote = pitch.fundamentalNote;
                            const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
                            const step =
                              fundamentalNote !== undefined
                                ? noteNames[fundamentalNote]
                                : "C";
                            const octave =
                              pitch.octave !== undefined ? pitch.octave : 4;
                            const alter = pitch.accidental || 0;
                            const staffId4 = (staffEntry as any)
                              ?.parentStaffEntry?.ParentStaff?.idInMusicSheet;
                            const staffNumber4 =
                              typeof staffId4 === "number"
                                ? staffId4 + 1
                                : undefined;
                            const noteData = {
                              step,
                              octave,
                              alter,
                              staff: staffNumber4,
                            };
                            notes.push(noteData);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        // Ultimate fallback to CurrentVoiceEntries
        if (notes.length === 0 && (iterator as any).CurrentVoiceEntries) {
          for (const voiceEntry of (iterator as any).CurrentVoiceEntries) {
            if (voiceEntry?.Notes) {
              for (const note of voiceEntry.Notes) {
                const noteAny = note as any;
                let pitch: any = null;
                if (noteAny.Pitch) {
                  pitch = noteAny.Pitch;
                } else if (noteAny.sourceNote?.Pitch) {
                  pitch = noteAny.sourceNote.Pitch;
                }
                if (pitch) {
                  const fundamentalNote = pitch.fundamentalNote;
                  const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
                  const step =
                    fundamentalNote !== undefined
                      ? noteNames[fundamentalNote]
                      : "C";
                  const octave = pitch.octave !== undefined ? pitch.octave : 4;
                  const alter = pitch.accidental || 0;
                  const staffId5 = (voiceEntry as any)?.ParentStaffEntry
                    ?.ParentStaff?.idInMusicSheet;
                  const staffNumber5 =
                    typeof staffId5 === "number" ? staffId5 + 1 : undefined;
                  const noteData = { step, octave, alter, staff: staffNumber5 };
                  notes.push(noteData);
                }
              }
            }
          }
        }
        return notes;
      } catch (error) {
        console.error("Error in getCurrentNotes:", error);
        return [];
      }
    };

    const extractAllNotes = (): PlaybackEvent[] => {
      const events: PlaybackEvent[] = [];
      if (!(osmdRef.current as any)?.sheet) {
        return events;
      }
      const sheet = (osmdRef.current as any).sheet;

      // Extract tempo for BPM calculation
      let bpm = (sheet as any).DefaultTempoInBpm || 120;
      // Try AllInstructions if available
      if ((sheet as any).AllInstructions) {
        const tempoInstruction = (sheet as any).AllInstructions.find(
          (instr: any) => instr.TempoInBpm,
        );
        if (tempoInstruction) {
          bpm = tempoInstruction.TempoInBpm;
        }
      }
      const secondsPerBeat = 60 / bpm;
      // OSMD's RealValue is in whole notes (1.0 = whole note, 0.25 = quarter note)
      // To convert to seconds: RealValue * 4 * secondsPerBeat (4 beats per whole note)
      const secondsPerWholeNote = 4 * secondsPerBeat;

      for (let measureIndex = 0; measureIndex < sheet.SourceMeasures.length; measureIndex++) {
        const sourceMeasure = sheet.SourceMeasures[measureIndex];
        const measureStartAbsTimestamp = (sourceMeasure as any).AbsoluteTimestamp?.RealValue ?? 0;

        for (const verticalContainer of sourceMeasure.VerticalSourceStaffEntryContainers) {
          for (const sourceStaffEntry of verticalContainer.StaffEntries) {
            if (!sourceStaffEntry || !sourceStaffEntry.VoiceEntries) continue;

            const staffId = (sourceStaffEntry as any).ParentStaff?.idInMusicSheet;
            const staff = typeof staffId === "number" ? staffId + 1 : undefined; // 1-based staff number

            for (const voiceEntry of sourceStaffEntry.VoiceEntries) {
              if (!voiceEntry || !voiceEntry.Notes) continue;

              const entryTimestampInMeasure = voiceEntry.Timestamp?.RealValue ?? 0;

              for (const note of voiceEntry.Notes) {
                const noteAny = note as any;
                const pitch = noteAny.Pitch || noteAny.sourceNote?.Pitch;
                if (!pitch || noteAny.IsRest) continue;

                // Skip tied continuation notes
                if (noteAny.NoteTie && noteAny.NoteTie.StartNote !== noteAny) continue;

                // Compute standard MIDI from pitch.halfTone
                // OSMD source-level halfTone = standard MIDI - 12, so add 12
                const halfTone = pitch.halfTone;
                if (typeof halfTone !== "number") continue;
                const midi = halfTone + 12;
                if (midi < 0 || midi > 127) continue;

                // Duration in whole-note units
                let durationWholeNotes: number;

                // タイで繋がれた音の合計 duration を計算
                if (noteAny.NoteTie) {
                  // OSMD の NoteTie.Notes にタイチェーン全体の音符が入っている
                  const tieNotes = noteAny.NoteTie.Notes;
                  if (tieNotes && tieNotes.length > 1) {
                    let totalDuration = 0;
                    for (const tiedNote of tieNotes) {
                      const tn = tiedNote as any;
                      totalDuration += tn.Length?.RealValue ?? tn.NoteDuration?.RealValue ?? 0;
                    }
                    durationWholeNotes = totalDuration;
                  } else {
                    durationWholeNotes = noteAny.Length?.RealValue ?? noteAny.NoteDuration?.RealValue ?? 0.25;
                  }
                } else {
                  // タイなし: parsed MusicXML データから正確な duration を取得
                  const matchedParsedNote = parsedMusicXmlNotesRef.current.find(pNote =>
                    pNote.measureIndex === measureIndex &&
                    Math.abs(pNote.timestampInMeasure - entryTimestampInMeasure) < 0.01 &&
                    pNote.midi === midi
                  );

                  if (matchedParsedNote && divisionsRef.current > 0) {
                    durationWholeNotes = matchedParsedNote.duration / divisionsRef.current / 4;
                  } else {
                    durationWholeNotes = noteAny.Length?.RealValue ?? noteAny.NoteDuration?.RealValue ?? 0.25;
                  }
                }
                const durationSeconds = durationWholeNotes * secondsPerWholeNote;

                events.push({
                  timeSeconds: (measureStartAbsTimestamp + entryTimestampInMeasure) * secondsPerWholeNote,
                  durationSeconds,
                  midiNote: midi,
                  staff,
                  measureIndex,
                  timestampInMeasure: entryTimestampInMeasure,
                });
              }
            }
          }
        }
      }

      events.sort(
        (a, b) => a.timeSeconds - b.timeSeconds || a.midiNote - b.midiNote,
      );
      return events;
    };

    const getNotesAtPosition = (_x: number, _y: number) => {
      return getCurrentNotes();
    };

    useImperativeHandle(ref, () => ({
      next: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.next();
          osmdRef.current.cursor.update();
          if (darkMode) {
            const cursorElement = (osmdRef.current.cursor as any).cursorElement;
            const cursorOverlay = cursorElement?.parentElement?.querySelector(
              ".cursor-overlay-orange",
            ) as HTMLDivElement;
            if (cursorOverlay && cursorElement) {
              cursorOverlay.style.top = cursorElement.style.top;
              cursorOverlay.style.left = cursorElement.style.left;
              cursorOverlay.style.height =
                cursorElement.getAttribute("height") + "px";
              cursorOverlay.style.width =
                cursorElement.getAttribute("width") + "px";
            }
          }
          onNotesChange?.(getCurrentNotes());
        }
      },
      previous: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.previous();
          osmdRef.current.cursor.update();
          if (darkMode) {
            const cursorElement = (osmdRef.current.cursor as any).cursorElement;
            const cursorOverlay = cursorElement?.parentElement?.querySelector(
              ".cursor-overlay-orange",
            ) as HTMLDivElement;
            if (cursorOverlay && cursorElement) {
              cursorOverlay.style.top = cursorElement.style.top;
              cursorOverlay.style.left = cursorElement.style.left;
              cursorOverlay.style.height =
                cursorElement.getAttribute("height") + "px";
              cursorOverlay.style.width =
                cursorElement.getAttribute("width") + "px";
            }
          }
          onNotesChange?.(getCurrentNotes());
        }
      },
      reset: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.reset();
          osmdRef.current.cursor.update();
          if (darkMode) {
            const cursorElement = (osmdRef.current.cursor as any).cursorElement;
            const cursorOverlay = cursorElement?.parentElement?.querySelector(
              ".cursor-overlay-orange",
            ) as HTMLDivElement;
            if (cursorOverlay && cursorElement) {
              cursorOverlay.style.top = cursorElement.style.top;
              cursorOverlay.style.left = cursorElement.style.left;
              cursorOverlay.style.height =
                cursorElement.getAttribute("height") + "px";
              cursorOverlay.style.width =
                cursorElement.getAttribute("width") + "px";
            }
          }
          onNotesChange?.(getCurrentNotes());
        }
      },
      setZoom: async (zoom: number) => {
        if (osmdRef.current) {
          osmdRef.current.Zoom = zoom;
          osmdRef.current.render();
          // ズーム後はマップが無効になるのでリセット（次回クリック時に再構築）
          positionToTimestampMapRef.current = [];
          positionMapBuiltRef.current = false;
        }
      },
      hideCursor: () => {
        if (osmdRef.current?.cursor) {
          const cursorElement = (osmdRef.current.cursor as any).cursorElement;
          if (cursorElement) {
            cursorElement.classList.add("cursor-hidden");
            if (darkMode) {
              const cursorOverlay = cursorElement.parentElement?.querySelector(
                ".cursor-overlay-orange",
              ) as HTMLDivElement;
              if (cursorOverlay) {
                cursorOverlay.style.display = "none";
              }
            }
          }
        }
      },
      showCursor: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.show();
          const cursorElement = (osmdRef.current.cursor as any).cursorElement;
          if (cursorElement) {
            cursorElement.classList.remove("cursor-hidden");
            cursorElement.classList.add("osmdCursor");
            cursorElement.classList.remove("cursor-dark", "cursor-light");
            cursorElement.classList.add(
              darkMode ? "cursor-dark" : "cursor-light",
            );
            if (darkMode) {
              const parentForOverlay =
                cursorElement.parentElement || containerRef.current;

              if (!parentForOverlay) {
                return;
              }

              let cursorOverlay = parentForOverlay.querySelector(
                ".cursor-overlay-orange",
              ) as HTMLDivElement;

              if (!cursorOverlay) {
                cursorOverlay = document.createElement("div");
                cursorOverlay.className = "cursor-overlay-orange";
                cursorOverlay.style.pointerEvents = "none";
                parentForOverlay.appendChild(cursorOverlay);
              }

              const syncOverlay = () => {
                if (cursorOverlay && cursorElement) {
                  cursorOverlay.style.cssText = cursorElement.style.cssText;
                  cursorOverlay.style.height =
                    cursorElement.getAttribute("height") + "px";
                  cursorOverlay.style.width =
                    cursorElement.getAttribute("width") + "px";
                  cursorOverlay.style.backgroundColor = sc.cursorOverlay;
                  cursorOverlay.style.opacity = sc.cursorOverlayOpacity;
                  cursorOverlay.style.pointerEvents = "none";
                  cursorOverlay.style.zIndex = "-1";
                  if (cursorElement.classList.contains("cursor-hidden")) {
                    cursorOverlay.style.display = "none";
                  } else {
                    cursorOverlay.style.display = "block";
                  }
                }
              };

              const cursorObserver = new MutationObserver(() => {
                syncOverlay();
              });
              cursorObserver.observe(cursorElement, {
                attributes: true,
                attributeFilter: ["style", "height", "width"],
              });

              syncOverlay();
            } else {
              cursorElement.style.opacity = sc.cursorOverlayOpacity;
              const cursorOverlay =
                cursorElement.parentElement?.querySelector(
                  ".cursor-overlay-orange",
                ) as HTMLDivElement;
              if (cursorOverlay) {
                cursorOverlay.style.display = "none";
              }
            }
            cursorElement.style.width = "10px";
            cursorElement.style.display = "block";
            cursorElement.style.visibility = "visible";
          }
        }
      },
      getNotesAtPosition: getNotesAtPosition,
      setChordVisibility: async (visible: boolean) => {
        if (osmdRef.current) {
          (osmdRef.current as any).setOptions({
            renderOptions: {
              chordSymbolsVisible: visible,
            },
          });
          osmdRef.current.render();
        }
      },
      jumpToTimestamp: (measureIndex: number, timestampInMeasure: number) => {
        if (osmdRef.current?.cursor) {
          const cursor = osmdRef.current.cursor;
          cursor.reset();
          let stepCount = 0;
          const maxSteps = 10000; // Prevent infinite loop

          while (!cursor.Iterator.EndReached && stepCount < maxSteps) {
            if (
              (cursor.Iterator as any).currentMeasureIndex === measureIndex &&
              Math.abs(
                (cursor.Iterator as any).currentTimeStamp?.RealValue ||
                  0 - timestampInMeasure,
              ) < 0.001
            ) {
              break;
            }
            cursor.next();
            stepCount++;
          }
          cursor.update();
          onNotesChange?.(getCurrentNotes());
        }
      },
      getCurrentNotes: getCurrentNotes,
      isEndReached: () => osmdRef.current?.cursor.Iterator.EndReached || false,
      extractAllNotes: extractAllNotes,
      getCurrentTimeSeconds: () => {
        if (!osmdRef.current?.cursor) return 0;
        const cursor = osmdRef.current.cursor;
        const iterator = cursor.Iterator;
        if (!iterator) return 0;

        const sheet = (osmdRef.current as any).sheet;
        let bpm = sheet?.DefaultTempoInBpm || 120;
        if (sheet?.AllInstructions) {
          const tempoInstruction = sheet.AllInstructions.find(
            (instr: any) => instr.TempoInBpm,
          );
          if (tempoInstruction) {
            bpm = tempoInstruction.TempoInBpm;
          }
        }
        // RealValue is in whole notes; convert to seconds: RealValue * 4 * (60/bpm)
        const secondsPerWholeNote = 4 * (60 / bpm);

        const measureStartAbsTimestamp =
          (iterator.CurrentMeasure as any).AbsoluteTimestamp?.RealValue || 0;
        const currentTimestampInMeasure =
          iterator.currentTimeStamp?.RealValue || 0;

        return (
          (measureStartAbsTimestamp + currentTimestampInMeasure) *
          secondsPerWholeNote
        );
      },
    }));

    useEffect(() => {
      let mounted = true;

      const loadOSMD = async () => {
        setIsLoading(true);
        setError(null);

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        const OSMD = await import("opensheetmusicdisplay").then(
          (m) => m.OpenSheetMusicDisplay,
        );
        const osmd = new OSMD(containerRef.current!, {
          autoResize: true,
          drawTitle: true,
          drawSubtitle: true,
          drawComposer: true,
          drawLyricist: true,
          drawPartNames: true,
          drawMeasureNumbers: true,
          drawMetronomeMarks: true,
          drawPartAbbreviations: true,
          followCursor: false,
          disableCursor: false,
          drawingParameters: "compacttight",
          defaultColorStem: sc.scoreNotehead || undefined,
          defaultColorNotehead: sc.scoreNotehead || undefined,
          defaultColorRest: sc.scoreNotehead || undefined,
          defaultColorLabel: sc.scoreNotehead || undefined,
          defaultColorTitle: sc.scoreTitle || undefined,
          defaultColorBackground: darkMode ? bgColor : undefined,
        } as any);

        osmdRef.current = osmd;

        try {
          let xmlContentToParse = musicXmlContent;
          if (!xmlContentToParse && musicXmlPath) {
            const response = await fetch(musicXmlPath);
            if (!response.ok) {
              throw new Error(
                `Failed to fetch MusicXML from ${musicXmlPath}: ${response.statusText}`,
              );
            }
            xmlContentToParse = await response.text();
          }

          if (xmlContentToParse) {
            // Parse MusicXML for custom duration logic
            await parseMusicXml(xmlContentToParse);
            await osmd.load(xmlContentToParse);
          } else {
            throw new Error("No MusicXML content or path provided.");
          }

          await osmd.render();

          // Set chord visibility
          (osmd as any).setOptions({
            renderOptions: {
              chordSymbolsVisible: showChords,
            },
          });
          osmd.render(); // Re-render to apply chord visibility

          // Initialize cursor AFTER the final render (so DOM elements aren't destroyed by re-render)
          if (osmd.cursor) {
            osmd.cursor.show();
            osmd.cursor.reset();
            osmd.cursor.update();

            const cursorElement = (osmd.cursor as any).cursorElement;

            if (cursorElement) {
              cursorElement.classList.add("osmdCursor");
              cursorElement.classList.remove("cursor-dark", "cursor-light");
              cursorElement.classList.add(
                darkMode ? "cursor-dark" : "cursor-light",
              );

              if (darkMode) {
                const parentForOverlay =
                  cursorElement.parentElement || containerRef.current;

                if (parentForOverlay) {
                  let cursorOverlay = parentForOverlay.querySelector(
                    ".cursor-overlay-orange",
                  ) as HTMLDivElement;

                  if (!cursorOverlay) {
                    cursorOverlay = document.createElement("div");
                    cursorOverlay.className = "cursor-overlay-orange";
                    cursorOverlay.style.pointerEvents = "none";
                    parentForOverlay.appendChild(cursorOverlay);
                  }

                  const syncOverlay = () => {
                    if (cursorOverlay && cursorElement) {
                      cursorOverlay.style.cssText = cursorElement.style.cssText;
                      cursorOverlay.style.height =
                        cursorElement.getAttribute("height") + "px";
                      cursorOverlay.style.width =
                        cursorElement.getAttribute("width") + "px";
                      cursorOverlay.style.backgroundColor = sc.cursorOverlay;
                      cursorOverlay.style.opacity = sc.cursorOverlayOpacity;
                      cursorOverlay.style.pointerEvents = "none";
                      cursorOverlay.style.zIndex = "-1";
                      if (cursorElement.classList.contains("cursor-hidden")) {
                        cursorOverlay.style.display = "none";
                      } else {
                        cursorOverlay.style.display = "block";
                      }
                    }
                  };

                  const cursorObserver = new MutationObserver(() => {
                    syncOverlay();
                  });
                  cursorObserver.observe(cursorElement, {
                    attributes: true,
                    attributeFilter: ["style", "height", "width"],
                  });

                  syncOverlay();
                }
              } else {
                cursorElement.style.opacity = sc.cursorOverlayOpacity;
                const cursorOverlay =
                  cursorElement.parentElement?.querySelector(
                    ".cursor-overlay-orange",
                  ) as HTMLDivElement;
                if (cursorOverlay) {
                  cursorOverlay.style.display = "none";
                }
              }
              cursorElement.style.width = "10px";
              cursorElement.style.display = "block";
              cursorElement.style.visibility = "visible";
            }
          }

          onNotesChange?.(getCurrentNotes());

          // Add click handlers to music term text elements (vf-text) and clef elements (vf-clef)
          // Use setTimeout to ensure OSMD has finished rendering all SVG elements
          setTimeout(() => {
            fixChordSymbolText();
            if (onMusicTermClick && containerRef.current) {
              // Handle text elements (楽語)
              const textElements =
                containerRef.current.querySelectorAll(".vf-text");
              textElements.forEach((element) => {
                const textEl = element.querySelector("text");
                const text =
                  textEl?.textContent?.trim() || element.textContent?.trim();
                if (text && isMusicTerm(text)) {
                  element.setAttribute("style", "cursor: pointer;");
                  element.classList.add("music-term-clickable");
                  if (darkMode) {
                    element.classList.add("dark-mode");
                  }
                  if (textEl) {
                    textEl.setAttribute(
                      "style",
                      (textEl.getAttribute("style") || "") +
                        "; cursor: pointer;",
                    );
                  }
                  element.addEventListener("click", (e) => {
                    e.stopPropagation();
                    onMusicTermClick(text);
                  });
                }
              });

              // Handle clef elements (音部記号)
              const clefElements =
                containerRef.current.querySelectorAll(".vf-clef");
              clefElements.forEach((element) => {
                const pathEl = element.querySelector("path");
                if (pathEl) {
                  const d = pathEl.getAttribute("d") || "";
                  const mCount = (d.match(/M/g) || []).length;

                  let clefType: string;
                  if (d.length > 5000) {
                    clefType = "__treble-clef__";
                  } else if (mCount >= 3) {
                    clefType = "__bass-clef__";
                  } else {
                    clefType = "__alto-clef__";
                  }

                  const bbox = (element as SVGGraphicsElement).getBBox();
                  const svgNS = "http://www.w3.org/2000/svg";
                  const rectOverlay = document.createElementNS(svgNS, "rect");
                  rectOverlay.setAttribute("x", String(bbox.x));
                  rectOverlay.setAttribute("y", String(bbox.y));
                  rectOverlay.setAttribute("width", String(bbox.width));
                  rectOverlay.setAttribute("height", String(bbox.height));
                  rectOverlay.setAttribute("fill", "transparent");
                  rectOverlay.setAttribute("style", "cursor: pointer;");

                  rectOverlay.addEventListener("click", (e) => {
                    e.stopPropagation();
                    onMusicTermClick(clefType);
                  });

                  rectOverlay.addEventListener("mouseenter", () => {
                    pathEl.style.fill = highlightColor;
                  });
                  rectOverlay.addEventListener("mouseleave", () => {
                    pathEl.style.fill = "";
                  });

                  element.appendChild(rectOverlay);
                  element.setAttribute("style", "cursor: pointer;");
                }
              });

              // Handle time signature elements (拍子記号)
              const timeSignatureElements =
                containerRef.current.querySelectorAll(".vf-timesignature");
              timeSignatureElements.forEach((element) => {
                const pathElements = element.querySelectorAll("path");
                if (pathElements.length >= 2) {
                  const bbox = (element as SVGGraphicsElement).getBBox();
                  let timeSignatureType = "__time-4/4__";

                  const svgNS = "http://www.w3.org/2000/svg";
                  const rectOverlay = document.createElementNS(svgNS, "rect");
                  rectOverlay.setAttribute("x", String(bbox.x));
                  rectOverlay.setAttribute("y", String(bbox.y));
                  rectOverlay.setAttribute("width", String(bbox.width));
                  rectOverlay.setAttribute("height", String(bbox.height));
                  rectOverlay.setAttribute("fill", "transparent");
                  rectOverlay.setAttribute("style", "cursor: pointer;");

                  rectOverlay.addEventListener("click", (e) => {
                    e.stopPropagation();
                    onMusicTermClick(timeSignatureType);
                  });

                  rectOverlay.addEventListener("mouseenter", () => {
                    pathElements.forEach((pathEl) => {
                      (pathEl as SVGPathElement).style.fill = highlightColor;
                    });
                  });
                  rectOverlay.addEventListener("mouseleave", () => {
                    pathElements.forEach((pathEl) => {
                      (pathEl as SVGPathElement).style.fill = "";
                    });
                  });

                  element.appendChild(rectOverlay);
                  element.setAttribute("style", "cursor: pointer;");
                }
              });

              setupNoteClickHandlers();
            }
          }, 200);

          setIsLoading(false);
          onLoad?.();
        } catch (err) {
          console.error("Error loading music:", err);
          if (mounted) {
            let errorMessage = "楽譜の読み込みに失敗しました";
            if (err instanceof Error) {
              if (err.message.includes("Cannot read properties of undefined")) {
                errorMessage =
                  "この楽譜は複雑すぎるため表示できません。より小さなMusicXMLファイルをお試しください。";
              } else {
                errorMessage = err.message;
              }
            }
            setError(errorMessage);
            setIsLoading(false);
            onLoad?.();
          }
        }
      };
      loadOSMD();
      return () => {
        mounted = false;
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        const customCursorElement =
          parentRef.current?.querySelector("#custom-cursor");
        if (customCursorElement) {
          customCursorElement.remove();
        }
        osmdRef.current = null;
      };
    }, [
      musicXmlPath,
      musicXmlContent,
      onNotesChange,
      onRangeChange,
      onLoad,
      onMusicTermClick,
      showChords,
      darkMode,
    ]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onNotesChange?.(getNotesAtPosition(x, y));
    };

    if (error) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#d32f2f",
            padding: "20px",
          }}
        >
          エラー: {error}
        </div>
      );
    }

    return (
      <div
        ref={parentRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "20px",
          ...style,
        }}
      >
        {" "}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#666",
            }}
          >
            読み込み中...
          </div>
        )}
        <div
          ref={containerRef}
          style={{ width: "100%", height: "100%" }}
          onClick={handleClick}
        />
      </div>
    );
  },
);

SheetMusic.displayName = "SheetMusic";

export default SheetMusic;