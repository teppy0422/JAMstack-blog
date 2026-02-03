"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import React from "react"; // Import React for React.CSSProperties

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
  style?: React.CSSProperties;
  showChords?: boolean; // Whether to display chord symbols
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
}

const SheetMusic = forwardRef<SheetMusicRef, SheetMusicProps>(
  (
    {
      musicXmlPath,
      musicXmlContent,
      onNotesChange,
      onRangeChange,
      onLoad,
      style,
      showChords = true,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const osmdRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
          onNotesChange?.(getCurrentNotes());
        }
      },
      previous: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.previous();
          osmdRef.current.cursor.update(); // Update visual position after movement
          onNotesChange?.(getCurrentNotes());
        }
      },
      reset: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.reset();
          osmdRef.current.cursor.update(); // Update visual position after reset
          onNotesChange?.(getCurrentNotes());
        }
      },
      hideCursor: () => {
        if (osmdRef.current?.cursor) {
          const cursorElement = (osmdRef.current.cursor as any).cursorElement;
          if (cursorElement) {
            cursorElement.classList.add("cursor-hidden");
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
            cursorElement.style.backgroundColor = "#33e02f";
            cursorElement.style.opacity = "0.5";
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
                const cursorElement = (osmdRef.current.cursor as any).cursorElement;
                if (cursorElement) {
                  cursorElement.classList.add("osmdCursor");
                  cursorElement.style.backgroundColor = "#33e02f";
                  cursorElement.style.opacity = "0.5";
                  cursorElement.style.width = "10px";
                  cursorElement.style.display = "block";
                  cursorElement.style.visibility = "visible";
                  console.log("Cursor styles re-applied after zoom");
                }
              }
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
              console.log("Chord visibility changed, render complete");
              if (osmdRef.current?.cursor) {
                osmdRef.current.cursor.show();
                osmdRef.current.cursor.reset();
                const cursorElement = (osmdRef.current.cursor as any).cursorElement;
                if (cursorElement) {
                  cursorElement.classList.add("osmdCursor");
                  cursorElement.style.backgroundColor = "#33e02f";
                  cursorElement.style.opacity = "0.5";
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
    }));

    useEffect(() => {
      let mounted = true;
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
          const osmd = new OpenSheetMusicDisplay(containerRef.current, {
            autoResize: true,
            backend: "svg",
            drawingParameters: "default", // Use default instead of compacttight
            disableCursor: false, // Explicitly enable cursor
            followCursor: true, // Auto-scroll when cursor moves to new system
          });

          // Enable/disable chord symbols BEFORE loading the MusicXML
          if (osmd.EngravingRules) {
            osmd.EngravingRules.RenderChordSymbols = showChords;
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
              
                          // 念のため直接スタイルも設定
                          cursorElement.style.backgroundColor = "#33e02f";
                          cursorElement.style.opacity = "0.5";
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
    }, [musicXmlPath, musicXmlContent, onNotesChange, onRangeChange, onLoad]);

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
                >        {isLoading && (
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
          style={{ width: "100%", height: "100%", cursor: "pointer" }}
          onClick={handleClick}
        />
      </div>
    );
  },
);

SheetMusic.displayName = "SheetMusic";

export default SheetMusic;
