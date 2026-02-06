"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import React from "react"; // Import React for React.CSSProperties
import { isMusicTerm } from "../score/musicTerms";
import { useTheme } from "@chakra-ui/react";
import { border, useColorMode } from "@chakra-ui/react";

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
  getCurrentNotes: () => Array<{ step: string; octave: number; alter: number; staff?: number }>;
  /** カーソルが終端に達しているか */
  isEndReached: () => boolean;
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
    const osmdRef = useRef<any>(null);
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
    // Store position map in a ref so it can be updated after zoom changes
    const positionToTimestampMapRef = useRef<
      Array<{
        x: number;
        y: number;
        measureIndex: number;
        timestamp: number;
      }>
    >([]);

    // Store onMusicTermClick in ref for use in setupClickHandlers
    const onMusicTermClickRef = useRef(onMusicTermClick);
    onMusicTermClickRef.current = onMusicTermClick;

    // Store onNotesChange in ref for use in setupClickHandlers
    const onNotesChangeRef = useRef(onNotesChange);
    onNotesChangeRef.current = onNotesChange;

    // Fix chord symbol text (e.g., "maj7" -> "Maj7") after OSMD renders
    // OSMD may render "maj7" in lowercase, but the standard notation uses "Maj7"
    const fixChordSymbolText = () => {
      if (!containerRef.current) return;
      const textElements = containerRef.current.querySelectorAll("text");
      textElements.forEach((textEl) => {
        const content = textEl.textContent;
        if (content && /maj/i.test(content)) {
          // Replace "maj" with "Maj" (case-sensitive: only fix lowercase "maj")
          const fixed = content.replace(/maj/g, "Maj");
          if (fixed !== content) {
            textEl.textContent = fixed;
            console.log("Fixed chord symbol:", content, "->", fixed);
          }
        }
      });
    };

    // Function to build position-to-timestamp map for note click functionality
    const buildPositionToTimestampMap = () => {
      const map: Array<{
        x: number;
        y: number;
        measureIndex: number;
        timestamp: number;
      }> = [];

      if (osmdRef.current?.cursor && containerRef.current) {
        const cursor = osmdRef.current.cursor;

        // Save current scroll position
        const scrollContainer = containerRef.current.closest("main");
        const savedScrollTop = scrollContainer?.scrollTop || 0;

        // Temporarily disable follow cursor to prevent scrolling during map building
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
              measureIndex: cursor.Iterator.currentMeasureIndex,
              timestamp: cursor.Iterator.currentTimeStamp?.RealValue || 0,
            });
          }
          cursor.next();
        }

        // Reset cursor to beginning
        cursor.reset();
        cursor.update();

        // Restore follow cursor setting
        osmdRef.current.FollowCursor = originalFollowCursor;

        // Restore scroll position
        if (scrollContainer) {
          scrollContainer.scrollTop = savedScrollTop;
        }

        console.log("Built positionToTimestampMap with", map.length, "entries");
      }

      positionToTimestampMapRef.current = map;
      return map;
    };

    // Function to setup note click handlers (called after render and zoom changes)
    const setupNoteClickHandlers = () => {
      if (!containerRef.current || !osmdRef.current?.cursor) return;

      const staveNoteElements =
        containerRef.current.querySelectorAll(".vf-stavenote");
      console.log(
        "Setting up click handlers for",
        staveNoteElements.length,
        "vf-stavenote elements",
      );

      // Get cursor height for click area
      const cursorElement = (osmdRef.current.cursor as any).cursorElement;
      const cursorHeight = cursorElement
        ? cursorElement.getBoundingClientRect().height
        : 100;

      staveNoteElements.forEach((element) => {
        const noteElement = element as SVGGraphicsElement;

        // Get all path elements within the note for hover effect
        const paths = noteElement.querySelectorAll("path");

        // Get bounding box for the note
        const bbox = noteElement.getBBox();

        // Create a transparent rectangle overlay for easier clicking
        // Width: same as note, Height: same as cursor highlight
        const svgNS = "http://www.w3.org/2000/svg";
        const rectOverlay = document.createElementNS(svgNS, "rect");

        // Calculate the center Y of the note and extend to cursor height
        const noteCenterY = bbox.y + bbox.height / 2;
        const overlayHeight = cursorHeight;
        const overlayY = noteCenterY - overlayHeight / 2;

        rectOverlay.setAttribute("x", String(bbox.x));
        rectOverlay.setAttribute("y", String(overlayY));
        rectOverlay.setAttribute("width", String(bbox.width));
        rectOverlay.setAttribute("height", String(overlayHeight));
        rectOverlay.setAttribute("fill", "transparent");
        rectOverlay.setAttribute("style", "cursor: pointer;");

        // Add click handler
        rectOverlay.addEventListener("click", (e) => {
          e.stopPropagation();

          // Get the X,Y position of the clicked note using screen coordinates (same as map)
          const noteRect = noteElement.getBoundingClientRect();
          const currentContainerRect =
            containerRef.current?.getBoundingClientRect();
          if (!currentContainerRect) return;
          const noteX =
            noteRect.left - currentContainerRect.left + noteRect.width / 2;
          const noteY =
            noteRect.top - currentContainerRect.top + noteRect.height / 2;

          console.log("Note clicked at X:", noteX, "Y:", noteY);

          // Find the closest timestamp in the map using both X and Y coordinates
          const positionMap = positionToTimestampMapRef.current;
          let closest = positionMap[0];
          let minDist = Infinity;

          for (const entry of positionMap) {
            // Calculate 2D distance
            const distX = Math.abs(entry.x - noteX);
            const distY = Math.abs(entry.y - noteY);
            const dist = Math.sqrt(distX * distX + distY * distY);
            if (dist < minDist) {
              minDist = dist;
              closest = entry;
            }
          }

          if (closest) {
            console.log(
              "Jumping to measure:",
              closest.measureIndex,
              "timestamp:",
              closest.timestamp,
            );

            // Jump cursor to the position
            if (osmdRef.current?.cursor) {
              const cursor = osmdRef.current.cursor;
              const startTime = performance.now();

              cursor.reset();
              let stepCount = 0;
              const maxSteps = 10000;

              while (!cursor.Iterator.EndReached && stepCount < maxSteps) {
                const currentMeasureIndex = cursor.Iterator.currentMeasureIndex;
                const currentTimestamp =
                  cursor.Iterator.currentTimeStamp?.RealValue || 0;

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
              // ダークモード時はオーバーレイを同期
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

              const endTime = performance.now();
              console.log(
                `Cursor jump completed in ${(endTime - startTime).toFixed(2)}ms, steps: ${stepCount}`,
              );
            }
          }
        });
        // Append the rectangle overlay to the note group
        noteElement.appendChild(rectOverlay);
      });
    };

    const applyCursorStyles = () => {
      const osmd = osmdRef.current;
      if (!osmd || !osmd.cursor) {
        return;
      }
      const cursorElement = (osmd.cursor as any).cursorElement;
      if (cursorElement) {
        console.log("--- DEBUGGING CURSOR STYLES (Applying) ---");
        console.log("Cursor Element exists:", cursorElement);
        console.log("Cursor Element Parent:", cursorElement.parentNode);
        console.log(
          "Cursor Element Bounding Rect (before forced style):",
          cursorElement.getBoundingClientRect(),
        );

        // Apply demo-like styling directly to the cursor image element
        cursorElement.style.backgroundColor = "#FFD700"; // Demo yellow
        cursorElement.style.opacity = "0.4"; // Semi-transparent
        cursorElement.style.zIndex = "1000"; // Bring to front
        // Reverted: Do not manipulate src or backgroundImage here. Let OSMD manage it.

        console.log(
          "Cursor Element forced background-color:",
          cursorElement.style.backgroundColor,
        );
        console.log(
          "Cursor Element forced opacity:",
          cursorElement.style.opacity,
        );
        console.log(
          "Cursor Element forced z-index:",
          cursorElement.style.zIndex,
        );
        console.log(
          "Cursor Element Computed Style (after forced style):",
          getComputedStyle(cursorElement),
        );
      } else {
        console.log("Cursor Element does NOT exist when applying styles.");
      }
      console.log("OSMD Cursor is hidden:", osmd.cursor.hidden);
      console.log("--- END DEBUGGING CURSOR STYLES ---");
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

        const notes: Array<{ step: string; octave: number; alter: number }> =
          [];

        // Get all voices at current timestep, not just CurrentVoiceEntries
        const currentMeasure = iterator.CurrentMeasure;
        const currentTimestamp =
          iterator.currentTimeStamp || iterator.CurrentTimeStamp;

        if (currentMeasure && currentTimestamp) {
          // Iterate through all staffs and voices in the current measure
          for (const staffEntry of currentMeasure.staffLinkedExpressions ||
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
                      console.log(
                        "Adding note:",
                        noteData,
                        "halfTone:",
                        pitch.halfTone,
                      );
                      notes.push(noteData);
                    }
                  }
                }
              }
            }
          }
        }

        // Try to get all currently sounding notes from the music sheet
        if (notes.length === 0 && currentTimestamp) {
          try {
            const musicSheet = iterator.musicSheet;
            const currentMeasure = iterator.CurrentMeasure;
            if (musicSheet?.SourceMeasures && currentMeasure) {
              const measureIndex = iterator.currentMeasureIndex;
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
                    const staffNumber = (sourceStaffEntry as any).ParentStaff
                      ?.idInMusicSheet;

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
                                // Use halfTone to calculate everything
                                // halfTone in OSMD is the actual MIDI note number
                                const halfTone = pitch.halfTone;
                                if (typeof halfTone === "number") {
                                  // MIDI to note conversion
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
                                  ]; // C, C#, D, D#, E, F, F#, G, G#, A, A#, B
                                  const semitoneToAlter = [
                                    0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
                                  ]; // 0=natural, 1=sharp

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

        // Access the graphic measures which contain all staffs
        const graphicalMeasure = iterator.CurrentMeasure;

        // Try to get all voices under cursor from all staffs
        if (notes.length === 0) {
          console.log("Trying to get notes from graphical measure");

          if (graphicalMeasure?.staffEntries) {
            for (const staffEntry of graphicalMeasure.staffEntries) {
              // Check if this staff entry is at the current timestamp
              const staffTimestamp = (staffEntry as any)?.timestamp;
              console.log(
                "StaffEntry timestamp:",
                staffTimestamp?.RealValue,
                "vs current:",
                currentTimestamp?.RealValue,
              );

              if (staffTimestamp?.RealValue === currentTimestamp?.RealValue) {
                if (staffEntry?.graphicalVoiceEntries) {
                  for (const graphicalVoiceEntry of staffEntry.graphicalVoiceEntries) {
                    const voiceEntry = (graphicalVoiceEntry as any)
                      ?.parentVoiceEntry;

                    if (voiceEntry?.Notes) {
                      console.log(
                        "Found voice with notes:",
                        voiceEntry.Notes.length,
                      );

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
                          const staffNumber = (staffEntry as any)
                            ?.parentStaffEntry?.ParentStaff?.idInMusicSheet;
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

        // Try checking all staff entries that overlap with current time (not just exact timestamp)
        if (notes.length === 0 && currentMeasure && currentTimestamp) {
          console.log(
            "Trying to find all sounding notes (including sustained notes)",
          );

          if (graphicalMeasure?.staffEntries) {
            for (const staffEntry of graphicalMeasure.staffEntries) {
              const entryTimestamp = (staffEntry as any)?.timestamp;
              const entryEndTimestamp = (staffEntry as any)?.endTimestamp;

              // Check if this entry started at or before current time and hasn't ended yet
              if (entryTimestamp && currentTimestamp) {
                const starts =
                  entryTimestamp.RealValue <= currentTimestamp.RealValue;
                const notEnded =
                  !entryEndTimestamp ||
                  entryEndTimestamp.RealValue > currentTimestamp.RealValue;

                console.log(
                  "Entry timestamp:",
                  entryTimestamp.RealValue,
                  "Current:",
                  currentTimestamp.RealValue,
                  "Starts:",
                  starts,
                  "NotEnded:",
                  notEnded,
                );

                if (starts && notEnded) {
                  if (staffEntry?.graphicalVoiceEntries) {
                    for (const graphicalVoiceEntry of staffEntry.graphicalVoiceEntries) {
                      const voiceEntry = (graphicalVoiceEntry as any)
                        ?.parentVoiceEntry;

                      if (voiceEntry?.Notes) {
                        console.log(
                          "Found sustained voice with notes:",
                          voiceEntry.Notes.length,
                        );

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
                            const noteNames = [
                              "C",
                              "D",
                              "E",
                              "F",
                              "G",
                              "A",
                              "B",
                            ];
                            const step =
                              fundamentalNote !== undefined
                                ? noteNames[fundamentalNote]
                                : "C";
                            const octave =
                              pitch.octave !== undefined ? pitch.octave : 4;
                            const alter = pitch.accidental || 0;
                            const staffNumber = (staffEntry as any)
                              ?.parentStaffEntry?.ParentStaff?.idInMusicSheet;
                            const noteData = {
                              step,
                              octave,
                              alter,
                              staff: staffNumber,
                            };
                            console.log("Adding sustained note:", noteData);
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
        if (notes.length === 0 && iterator.CurrentVoiceEntries) {
          for (const voiceEntry of iterator.CurrentVoiceEntries) {
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
                  const staffNumber = (voiceEntry as any)?.ParentStaffEntry
                    ?.ParentStaff?.idInMusicSheet;
                  const noteData = { step, octave, alter, staff: staffNumber };
                  notes.push(noteData);
                }
              }
            }
          }
        }
        return notes;
      } catch (err) {
        console.error("Error getting current notes:", err);
        return [];
      }
    };

    const getNotesAtPosition = (_x: number, _y: number) => {
      return getCurrentNotes();
    };

    useImperativeHandle(ref, () => ({
      next: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.next();
          osmdRef.current.cursor.update(); // Update visual position after movement
          // ダークモード時はオーバーレイを同期
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
          osmdRef.current.cursor.update(); // Update visual position after movement
          // ダークモード時はオーバーレイを同期
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
          osmdRef.current.cursor.update(); // Update visual position after reset
          // ダークモード時はオーバーレイを同期
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
      hideCursor: () => {
        if (osmdRef.current?.cursor) {
          const cursorElement = (osmdRef.current.cursor as any).cursorElement;
          if (cursorElement) {
            cursorElement.classList.add("cursor-hidden");
            // ダークモード時はオーバーレイも非表示にする
            if (darkMode) {
              const cursorOverlay = cursorElement.parentElement?.querySelector(
                ".cursor-overlay-orange",
              ) as HTMLDivElement;
              if (cursorOverlay) {
                cursorOverlay.style.display = "none";
              }
            }
            console.log("Cursor hidden with class");
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
              // ダークモード時はオーバーレイを同期（IMGのスタイルをコピー）
              const parentForOverlay =
                cursorElement.parentElement || containerRef.current;
              let cursorOverlay = parentForOverlay?.querySelector(
                ".cursor-overlay-orange",
              ) as HTMLDivElement;
              // オーバーレイが存在しない場合は新規作成
              if (!cursorOverlay && parentForOverlay) {
                cursorOverlay = document.createElement("div");
                cursorOverlay.className = "cursor-overlay-orange";
                parentForOverlay.appendChild(cursorOverlay);
                console.log("Created new cursor overlay in showCursor");
              }
              if (cursorOverlay) {
                cursorOverlay.style.cssText = cursorElement.style.cssText;
                cursorOverlay.style.height =
                  cursorElement.getAttribute("height") + "px";
                cursorOverlay.style.width =
                  cursorElement.getAttribute("width") + "px";
                cursorOverlay.style.backgroundColor = "#F89173";
                cursorOverlay.style.opacity = "0.5";
                cursorOverlay.style.pointerEvents = "none";
                cursorOverlay.style.zIndex = "-1";
                cursorOverlay.style.display = "block";
              }
            } else {
              cursorElement.style.opacity = "0.5";
            }
            cursorElement.style.width = "10px";
            cursorElement.style.display = "block";
            cursorElement.style.visibility = "visible";
          }
          console.log("Cursor shown");
        }
      },
      setZoom: async (zoom: number) => {
        console.log("setZoom called with:", zoom);
        if (osmdRef.current) {
          console.log("osmdRef.current exists, setting Zoom to:", zoom);

          osmdRef.current.Zoom = zoom;
          console.log("Calling render...");

          // Wrap render in Promise to wait for completion
          await new Promise<void>((resolve) => {
            osmdRef.current.render();
            // Use setTimeout to ensure render is complete
            setTimeout(() => {
              console.log("Render complete");

              // Re-apply cursor styles after render
              if (osmdRef.current.cursor) {
                const cursorElement = (osmdRef.current.cursor as any)
                  .cursorElement;
                if (cursorElement) {
                  cursorElement.classList.add("osmdCursor");
                  cursorElement.classList.remove("cursor-dark", "cursor-light");
                  cursorElement.classList.add(
                    darkMode ? "cursor-dark" : "cursor-light",
                  );
                  if (darkMode) {
                    // ダークモード時はオーバーレイを同期（IMGのスタイルをコピー）
                    const parentForOverlay =
                      cursorElement.parentElement || containerRef.current;
                    let cursorOverlay = parentForOverlay?.querySelector(
                      ".cursor-overlay-orange",
                    ) as HTMLDivElement;
                    // オーバーレイが存在しない場合は新規作成
                    if (!cursorOverlay && parentForOverlay) {
                      cursorOverlay = document.createElement("div");
                      cursorOverlay.className = "cursor-overlay-orange";
                      parentForOverlay.appendChild(cursorOverlay);
                      console.log("Created new cursor overlay after zoom");
                    }
                    if (cursorOverlay) {
                      cursorOverlay.style.cssText = cursorElement.style.cssText;
                      cursorOverlay.style.height =
                        cursorElement.getAttribute("height") + "px";
                      cursorOverlay.style.width =
                        cursorElement.getAttribute("width") + "px";
                      cursorOverlay.style.backgroundColor = highlightColor;
                      cursorOverlay.style.opacity = "0.4";
                      cursorOverlay.style.pointerEvents = "none";
                      cursorOverlay.style.zIndex = "-1";
                      cursorOverlay.style.display = "block";
                    }
                  } else {
                    cursorElement.style.opacity = "0.5";
                  }
                  cursorElement.style.width = "10px";
                  cursorElement.style.display = "block";
                  cursorElement.style.visibility = "visible";
                  console.log("Cursor styles re-applied after zoom");
                }
              }

              // Fix chord symbols after zoom re-render
              fixChordSymbolText();

              // Rebuild position-to-timestamp map and click handlers after zoom change
              buildPositionToTimestampMap();
              setupNoteClickHandlers();
              console.log("Position map and click handlers rebuilt after zoom");

              resolve();
            }, 100);
          });
        } else {
          console.log("osmdRef.current is null!");
        }
      },
      getNotesAtPosition,
      setChordVisibility: async (visible: boolean) => {
        console.log("setChordVisibility called with:", visible);
        if (osmdRef.current) {
          // Set the rule before re-rendering
          if (osmdRef.current.EngravingRules) {
            osmdRef.current.EngravingRules.RenderChordSymbols = visible;
            console.log("RenderChordSymbols set to:", visible);
          }

          // Need to reload the music XML for chord visibility changes to take effect
          try {
            if (musicXmlContent) {
              await osmdRef.current.load(musicXmlContent);
            } else if (musicXmlPath) {
              await osmdRef.current.load(musicXmlPath);
            }
            osmdRef.current.render();
            // Re-apply cursor styles after render
            setTimeout(() => {
              fixChordSymbolText();
              console.log("Chord visibility changed, render complete");
              if (osmdRef.current?.cursor) {
                osmdRef.current.cursor.show();
                osmdRef.current.cursor.reset();
                const cursorElement = (osmdRef.current.cursor as any)
                  .cursorElement;
                if (cursorElement) {
                  cursorElement.classList.add("osmdCursor");
                  cursorElement.classList.remove("cursor-dark", "cursor-light");
                  cursorElement.classList.add(
                    darkMode ? "cursor-dark" : "cursor-light",
                  );
                  if (darkMode) {
                    // ダークモード時はオーバーレイを同期（IMGのスタイルをコピー）
                    const parentForOverlay =
                      cursorElement.parentElement || containerRef.current;
                    let cursorOverlay = parentForOverlay?.querySelector(
                      ".cursor-overlay-orange",
                    ) as HTMLDivElement;
                    // オーバーレイが存在しない場合は新規作成
                    if (!cursorOverlay && parentForOverlay) {
                      cursorOverlay = document.createElement("div");
                      cursorOverlay.className = "cursor-overlay-orange";
                      parentForOverlay.appendChild(cursorOverlay);
                      console.log(
                        "Created new cursor overlay after chord visibility change",
                      );
                    }
                    if (cursorOverlay) {
                      cursorOverlay.style.cssText = cursorElement.style.cssText;
                      cursorOverlay.style.height =
                        cursorElement.getAttribute("height") + "px";
                      cursorOverlay.style.width =
                        cursorElement.getAttribute("width") + "px";
                      cursorOverlay.style.backgroundColor = "#F89173";
                      cursorOverlay.style.opacity = "0.7";
                      cursorOverlay.style.pointerEvents = "none";
                      cursorOverlay.style.zIndex = "-1";
                      cursorOverlay.style.display = "block";
                    }
                  } else {
                    cursorElement.style.opacity = "0.5";
                  }
                  cursorElement.style.width = "10px";
                  cursorElement.style.display = "block";
                  cursorElement.style.visibility = "visible";
                }
              }
            }, 100);
          } catch (error) {
            console.error("Error reloading for chord visibility:", error);
          }
        }
      },
      jumpToTimestamp: (measureIndex: number, timestampInMeasure: number) => {
        console.log(
          "jumpToTimestamp called:",
          measureIndex,
          timestampInMeasure,
        );
        const startTime = performance.now();

        if (!osmdRef.current?.cursor) {
          console.log("No cursor available");
          return;
        }

        const cursor = osmdRef.current.cursor;
        cursor.reset();

        let stepCount = 0;
        const maxSteps = 10000; // Safety limit

        while (!cursor.Iterator.EndReached && stepCount < maxSteps) {
          const currentMeasureIndex = cursor.Iterator.currentMeasureIndex;
          const currentTimestamp =
            cursor.Iterator.currentTimeStamp?.RealValue || 0;

          // Check if we've reached the target position
          if (
            currentMeasureIndex === measureIndex &&
            Math.abs(currentTimestamp - timestampInMeasure) < 0.001
          ) {
            break;
          }

          // If we've passed the target measure, stop
          if (currentMeasureIndex > measureIndex) {
            // Go back one step
            cursor.previous();
            break;
          }

          cursor.next();
          stepCount++;
        }

        cursor.update();
        // ダークモード時はオーバーレイを同期
        if (darkMode) {
          const cursorElement = (cursor as any).cursorElement;
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

        const endTime = performance.now();
        console.log(
          `jumpToTimestamp completed in ${(endTime - startTime).toFixed(2)}ms, steps: ${stepCount}`,
        );
      },
      getCurrentNotes: () => {
        return getCurrentNotes();
      },
      isEndReached: () => {
        return osmdRef.current?.cursor?.Iterator?.EndReached ?? true;
      },
    }));

    useEffect(() => {
      let mounted = true;
      console.log("useEffect triggered, darkMode:", darkMode);
      const loadOSMD = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const { OpenSheetMusicDisplay } =
            await import("opensheetmusicdisplay");
          if (!mounted || !containerRef.current) return;
          if (osmdRef.current) {
            containerRef.current.innerHTML = "";
          }
          // ダークモード時はオレンジ色、ライトモード時は緑色のカーソル
          const cursorColor = darkMode ? "#F89173" : "#33e02f";
          const cursorAlpha = darkMode ? 0.5 : 0.5;

          const osmd = new OpenSheetMusicDisplay(containerRef.current, {
            autoResize: true,
            backend: "svg",
            drawingParameters: "default", // Use default instead of compacttight
            disableCursor: false, // Explicitly enable cursor
            followCursor: true, // Auto-scroll when cursor moves to new system
            cursorsOptions: [
              { type: 0, color: cursorColor, alpha: cursorAlpha, follow: true },
            ],
          });

          // Enable/disable chord symbols BEFORE loading the MusicXML
          if (osmd.EngravingRules) {
            osmd.EngravingRules.RenderChordSymbols = showChords;

            // Apply dark mode colors
            if (darkMode) {
              const darkColor = "#d0d0d0";
              osmd.EngravingRules.DefaultColorNotehead = darkColor;
              osmd.EngravingRules.DefaultColorStem = darkColor;
              osmd.EngravingRules.DefaultColorRest = darkColor;
              osmd.EngravingRules.DefaultColorLabel = darkColor;
              osmd.EngravingRules.DefaultColorTitle = darkColor;
              osmd.EngravingRules.DefaultColorMusic = darkColor;
              osmd.EngravingRules.LedgerLineColorDefault = darkColor; // 加線の色
              console.log("Dark mode colors applied to OSMD");
            }
          }

          osmdRef.current = osmd;

          // Load from either XML content or file path
          if (musicXmlContent) {
            // Load from direct XML content
            await osmd.load(musicXmlContent);
          } else {
            // Load from file path
            await osmd.load(musicXmlPath);
          }

          if (!mounted) return;

          osmd.render();

          // Initialize cursor after rendering (like the demo does)
          console.log("=== CURSOR INITIALIZATION ===");
          console.log("osmd.cursor exists:", !!osmd.cursor);

          if (osmd.cursor) {
            console.log(
              "Cursor hidden status before show():",
              osmd.cursor.hidden,
            );
            osmd.cursor.show();
            console.log(
              "Cursor hidden status after show():",
              osmd.cursor.hidden,
            );
            osmd.cursor.reset();
            osmd.cursor.update(); // Calculate initial cursor position

            // デフォルトのカーソル要素にスタイルを適用する
            const cursorElement = (osmd.cursor as any).cursorElement;
            console.log("cursorElement exists:", !!cursorElement);

            if (cursorElement) {
              console.log("Cursor element found:", cursorElement);
              console.log("Cursor element tagName:", cursorElement.tagName);

              // カーソル要素の現在の状態を詳しく確認
              const rect = cursorElement.getBoundingClientRect();
              const computedStyle = window.getComputedStyle(cursorElement);

              console.log("カーソル要素の詳細情報:");
              console.log("- display:", computedStyle.display);
              console.log("- visibility:", computedStyle.visibility);
              console.log("- opacity:", computedStyle.opacity);
              console.log("- width:", computedStyle.width);
              console.log("- height:", computedStyle.height);
              console.log("- position:", computedStyle.position);
              console.log("- left:", computedStyle.left);
              console.log("- top:", computedStyle.top);
              console.log("- backgroundColor:", computedStyle.backgroundColor);
              console.log("- BoundingRect:", rect);

              // CSSクラスを追加（デモと同じスタイル）
              cursorElement.classList.add("osmdCursor");
              // ダークモード/ライトモード用クラスを切り替え
              cursorElement.classList.remove("cursor-dark", "cursor-light");
              cursorElement.classList.add(
                darkMode ? "cursor-dark" : "cursor-light",
              );
              console.log(
                "Cursor class set:",
                darkMode ? "cursor-dark" : "cursor-light",
              );

              // ダークモード時はIMG要素を完全に隠してDIVオーバーレイでオレンジを表示
              if (darkMode) {
                console.log("Dark mode: creating cursor overlay");
                console.log(
                  "cursorElement.parentElement:",
                  cursorElement.parentElement,
                );

                // parentElementがない場合はcontainerRefを使う
                const parentForOverlay =
                  cursorElement.parentElement || containerRef.current;
                console.log("parentForOverlay:", parentForOverlay);

                if (!parentForOverlay) {
                  console.error("No parent element found for cursor overlay!");
                  return;
                }

                // オレンジ色のDIVオーバーレイを作成
                let cursorOverlay = parentForOverlay.querySelector(
                  ".cursor-overlay-orange",
                ) as HTMLDivElement;
                console.log("Existing cursorOverlay:", cursorOverlay);

                if (!cursorOverlay) {
                  cursorOverlay = document.createElement("div");
                  cursorOverlay.className = "cursor-overlay-orange";
                  cursorOverlay.style.pointerEvents = "none";
                  parentForOverlay.appendChild(cursorOverlay);
                  console.log("Created new cursor overlay:", cursorOverlay);
                }

                // IMGのstyle属性を完全にコピーしてオレンジ背景を追加
                const syncOverlay = () => {
                  if (cursorOverlay && cursorElement) {
                    // IMGのstyle属性をコピー
                    cursorOverlay.style.cssText = cursorElement.style.cssText;
                    // height属性もコピー
                    cursorOverlay.style.height =
                      cursorElement.getAttribute("height") + "px";
                    cursorOverlay.style.width =
                      cursorElement.getAttribute("width") + "px";
                    // オレンジ背景と透明度を設定
                    cursorOverlay.style.backgroundColor = "#F89173";
                    cursorOverlay.style.opacity = "0.7";
                    cursorOverlay.style.pointerEvents = "none";
                    // z-indexを正の値に上書き（IMGのz-index: -1を上書きして前面に表示）
                    cursorOverlay.style.zIndex = "-1";
                    // 表示状態を設定（IMGがdisplay:noneでもDIVは表示する、ただしhideCursor時は非表示）
                    if (cursorElement.classList.contains("cursor-hidden")) {
                      cursorOverlay.style.display = "none";
                    } else {
                      cursorOverlay.style.display = "block";
                    }
                  }
                };

                // MutationObserverでIMG要素のstyle変更を監視してオーバーレイを同期
                const cursorObserver = new MutationObserver(() => {
                  syncOverlay();
                });
                cursorObserver.observe(cursorElement, {
                  attributes: true,
                  attributeFilter: ["style", "height", "width"],
                });

                // 初回同期
                syncOverlay();
                console.log("Cursor overlay created for dark mode");
              } else {
                cursorElement.style.opacity = "0.5";
                // ライトモード時はオーバーレイを非表示
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
              // スタイル適用後の状態も確認
              setTimeout(() => {
                const newRect = cursorElement.getBoundingClientRect();
                const newStyle = window.getComputedStyle(cursorElement);
                console.log("スタイル適用後:");
                console.log("- display:", newStyle.display);
                console.log("- width:", newStyle.width);
                console.log("- backgroundColor:", newStyle.backgroundColor);
                console.log("- opacity:", newStyle.opacity);
                console.log("- BoundingRect:", newRect);
              }, 100);

              console.log("✅ Cursor styled");
            } else {
              console.log("ERROR: cursorElement is null or undefined");
            }
          } else {
            console.log("ERROR: osmd.cursor is null or undefined");
          }
          console.log("=== END CURSOR INITIALIZATION ===");

          // Calculate the range of all notes in the score
          if (onRangeChange) {
            try {
              const sheet = (osmd as any).sheet;
              let minMidi = Infinity;
              let maxMidi = -Infinity;

              // Iterate through all parts, measures, and voices to find all notes
              if (sheet?.Instruments) {
                console.log("Instruments count:", sheet.Instruments.length);
                for (const instrument of sheet.Instruments) {
                  console.log("Voices count:", instrument.Voices?.length);
                  for (const voice of instrument.Voices) {
                    console.log(
                      "VoiceEntries count:",
                      voice.VoiceEntries?.length,
                    );
                    for (const voiceEntry of voice.VoiceEntries) {
                      if (voiceEntry?.Notes) {
                        for (const note of voiceEntry.Notes) {
                          const noteAny = note as any;
                          let pitch: any = null;
                          if (noteAny.Pitch) {
                            pitch = noteAny.Pitch;
                          } else if (noteAny.sourceNote?.Pitch) {
                            pitch = noteAny.sourceNote.Pitch;
                          }
                          if (pitch?.halfTone !== undefined) {
                            // Convert to MIDI using same logic as getCurrentNotes
                            const semitone = pitch.halfTone % 12;
                            const octave = Math.floor(pitch.halfTone / 12);
                            const midi =
                              (octave + 1) * 12 + semitone + (pitch.Alter || 0);
                            console.log(
                              "Found note with halfTone:",
                              pitch.halfTone,
                              "-> MIDI:",
                              midi,
                            );
                            minMidi = Math.min(minMidi, midi);
                            maxMidi = Math.max(maxMidi, midi);
                          }
                        }
                      }
                    }
                  }
                }
              }

              console.log("Raw range before adjustment:", minMidi, maxMidi);

              if (minMidi !== Infinity && maxMidi !== -Infinity) {
                // Adjust minMidi to start from C (semitone 0) and extend 1 octave lower
                const minSemitone = minMidi % 12;
                if (minSemitone !== 0) {
                  minMidi = minMidi - minSemitone;
                }
                minMidi = minMidi - 12; // Extend 1 octave lower

                // Adjust maxMidi to end at B (semitone 11)
                // Extend to include the highest note by finding the next B at or after maxMidi
                const maxSemitone = maxMidi % 12;
                if (maxSemitone !== 11) {
                  // Extend to the next B after the highest note
                  maxMidi = maxMidi + (11 - maxSemitone);
                }

                console.log("Range detected:", minMidi, maxMidi);
                onRangeChange(minMidi, maxMidi);
              }
            } catch (err) {
              console.error("Error calculating note range:", err);
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
              console.log("Found vf-text elements:", textElements.length);
              textElements.forEach((element) => {
                // Get text from the inner <text> element
                const textEl = element.querySelector("text");
                const text =
                  textEl?.textContent?.trim() || element.textContent?.trim();
                console.log("vf-text element text:", text);
                // Only add click handler if the term exists in the dictionary
                if (text && isMusicTerm(text)) {
                  // For SVG elements, use setAttribute for styling
                  element.setAttribute("style", "cursor: pointer;");
                  element.classList.add("music-term-clickable");
                  // ダークモード時はdark-modeクラスを追加（CSSでホバー色をオレンジにする）
                  if (darkMode) {
                    element.classList.add("dark-mode");
                  }
                  // Also style the inner text element
                  if (textEl) {
                    textEl.setAttribute(
                      "style",
                      (textEl.getAttribute("style") || "") +
                        "; cursor: pointer;",
                    );
                  }
                  element.addEventListener("click", (e) => {
                    e.stopPropagation();
                    console.log("Music term clicked:", text);
                    onMusicTermClick(text);
                  });
                }
              });

              // Handle clef elements (音部記号)
              const clefElements =
                containerRef.current.querySelectorAll(".vf-clef");
              console.log("Found vf-clef elements:", clefElements.length);
              clefElements.forEach((element) => {
                const pathEl = element.querySelector("path");
                if (pathEl) {
                  const d = pathEl.getAttribute("d") || "";
                  // Count M commands in the path
                  const mCount = (d.match(/M/g) || []).length;

                  let clefType: string;
                  if (d.length > 5000) {
                    // ト音記号: very long path (complex treble clef shape)
                    clefType = "__treble-clef__";
                  } else if (mCount >= 3) {
                    // ヘ音記号: 3 M commands (body + 2 dots)
                    clefType = "__bass-clef__";
                  } else {
                    // ハ音記号: everything else
                    clefType = "__alto-clef__";
                  }

                  console.log(
                    "Clef detected:",
                    clefType,
                    "d.length:",
                    d.length,
                    "mCount:",
                    mCount,
                  );

                  // Get bounding box for rectangular click area
                  const bbox = (element as SVGGraphicsElement).getBBox();

                  // Create a transparent rectangle overlay for easier clicking
                  const svgNS = "http://www.w3.org/2000/svg";
                  const rectOverlay = document.createElementNS(svgNS, "rect");
                  rectOverlay.setAttribute("x", String(bbox.x));
                  rectOverlay.setAttribute("y", String(bbox.y));
                  rectOverlay.setAttribute("width", String(bbox.width));
                  rectOverlay.setAttribute("height", String(bbox.height));
                  rectOverlay.setAttribute("fill", "transparent");
                  rectOverlay.setAttribute("style", "cursor: pointer;");

                  // Add click handler to the rectangle overlay
                  rectOverlay.addEventListener("click", (e) => {
                    e.stopPropagation();
                    console.log("Clef clicked:", clefType);
                    onMusicTermClick(clefType);
                  });

                  // Add hover effect to change path fill color
                  rectOverlay.addEventListener("mouseenter", () => {
                    pathEl.style.fill = highlightColor;
                  });
                  rectOverlay.addEventListener("mouseleave", () => {
                    pathEl.style.fill = "";
                  });

                  // Append the rectangle to the clef group
                  element.appendChild(rectOverlay);

                  // Also keep cursor style on original element for visual feedback
                  element.setAttribute("style", "cursor: pointer;");
                }
              });

              // Handle time signature elements (拍子記号)
              const timeSignatureElements =
                containerRef.current.querySelectorAll(".vf-timesignature");
              console.log(
                "Found vf-timesignature elements:",
                timeSignatureElements.length,
              );
              timeSignatureElements.forEach((element) => {
                const pathElements = element.querySelectorAll("path");
                if (pathElements.length >= 2) {
                  // 拍子記号は通常2つのpath要素（分子と分母）で構成される
                  // path要素の数から拍子を推測
                  // 4/4などの一般的な拍子を識別
                  const bbox = (element as SVGGraphicsElement).getBBox();

                  // 拍子記号の種類を判定（pathの数とサイズから推測）
                  // 実際の値はOSMDのデータから取得できないため、一般的な4/4として扱う
                  // より正確な判定が必要な場合はMusicXMLを解析する必要がある
                  let timeSignatureType = "__time-4/4__"; // デフォルト

                  // Create a transparent rectangle overlay for easier clicking
                  const svgNS = "http://www.w3.org/2000/svg";
                  const rectOverlay = document.createElementNS(svgNS, "rect");
                  rectOverlay.setAttribute("x", String(bbox.x));
                  rectOverlay.setAttribute("y", String(bbox.y));
                  rectOverlay.setAttribute("width", String(bbox.width));
                  rectOverlay.setAttribute("height", String(bbox.height));
                  rectOverlay.setAttribute("fill", "transparent");
                  rectOverlay.setAttribute("style", "cursor: pointer;");

                  // Add click handler to the rectangle overlay
                  rectOverlay.addEventListener("click", (e) => {
                    e.stopPropagation();
                    console.log("Time signature clicked:", timeSignatureType);
                    onMusicTermClick(timeSignatureType);
                  });

                  // Add hover effect to change path fill color
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

                  // Append the rectangle to the time signature group
                  element.appendChild(rectOverlay);

                  // Also keep cursor style on original element for visual feedback
                  element.setAttribute("style", "cursor: pointer;");
                }
              });

              // Handle note clicks for cursor jump
              // Build the initial position-to-timestamp map and setup click handlers
              buildPositionToTimestampMap();
              setupNoteClickHandlers();
            }
          }, 200);

          setIsLoading(false);
          onLoad?.(); // Call onLoad when loading and rendering are complete
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
            onLoad?.(); // Also call onLoad on error to ensure parent can react
          }
        }
      };
      loadOSMD();
      return () => {
        mounted = false;
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        // Remove the custom red line cursor when the component unmounts or musicXmlPath changes
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
          ...style, // Apply passed style prop
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
