"use client";

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

interface SheetMusicProps {
  musicXmlPath: string;
  onNotesChange?: (
    notes: Array<{ step: string; octave: number; alter: number; staff?: number }>,
  ) => void;
  onRangeChange?: (minMidi: number, maxMidi: number) => void;
}

export interface SheetMusicRef {
  next: () => void;
  previous: () => void;
  reset: () => void;
  getNotesAtPosition: (
    x: number,
    y: number,
  ) => Array<{ step: string; octave: number; alter: number; staff?: number }>;
}

const SheetMusic = forwardRef<SheetMusicRef, SheetMusicProps>(
  ({ musicXmlPath, onNotesChange, onRangeChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    const osmdRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
        const currentTimestamp = iterator.currentTimeStamp || iterator.CurrentTimeStamp;

        console.log("Current timestamp:", currentTimestamp?.RealValue);
        console.log("Current measure:", currentMeasure?.MeasureNumber);
        console.log("Iterator keys:", Object.keys(iterator));

        if (currentMeasure && currentTimestamp) {
          // Iterate through all staffs and voices in the current measure
          for (const staffEntry of currentMeasure.staffLinkedExpressions || []) {
            for (const voiceEntry of staffEntry) {
              if (voiceEntry?.Timestamp?.RealValue === currentTimestamp.RealValue) {
                if (voiceEntry?.Notes) {
                  console.log("Found voiceEntry with notes:", voiceEntry.Notes.length);
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
                      const noteData = { step, octave, alter: pitch.Alter || 0 };
                      console.log("Adding note:", noteData, "halfTone:", pitch.halfTone);
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
          console.log("Trying to get all currently sounding notes from music sheet");

          try {
            const musicSheet = iterator.musicSheet;
            const currentMeasure = iterator.CurrentMeasure;
            if (musicSheet?.SourceMeasures && currentMeasure) {
              console.log("SourceMeasures count:", musicSheet.SourceMeasures.length);

              // Get the measure number from CurrentMeasure
              const measureIndex = iterator.currentMeasureIndex;
              // Get the current source measure
              const sourceMeasure = musicSheet.SourceMeasures[measureIndex];
              if (sourceMeasure) {
                console.log("Found source measure index:", measureIndex);

                // Get the absolute timestamp at the start of the current measure
                const measureStartTimestamp = (sourceMeasure as any).AbsoluteTimestamp?.RealValue || 0;
                console.log("Measure start timestamp:", measureStartTimestamp, "current timestamp:", currentTimestamp.RealValue);

                // Iterate through all staff entries in this measure
                for (const staffEntry of sourceMeasure.VerticalSourceStaffEntryContainers || []) {
                  for (const sourceStaffEntry of staffEntry.StaffEntries || []) {
                    if (!sourceStaffEntry) continue;
                    const entryTimestamp = sourceStaffEntry.Timestamp;
                    const voiceEntries = sourceStaffEntry.VoiceEntries;
                    const staffNumber = (sourceStaffEntry as any).ParentStaff?.idInMusicSheet;

                    if (voiceEntries && entryTimestamp) {
                      // Check if this entry is currently sounding
                      for (const voiceEntry of voiceEntries) {
                        if (voiceEntry?.Notes) {
                          const duration = voiceEntry.Notes[0]?.Length?.RealValue || 0;
                          // Convert measure-relative timestamp to absolute timestamp
                          const entryStart = measureStartTimestamp + entryTimestamp.RealValue;

                          // Only detect notes that START at current timestamp, not sustained notes
                          // Use tolerance for floating point comparison
                          const tolerance = 0.001;
                          if (Math.abs(entryStart - currentTimestamp.RealValue) < tolerance) {
                            console.log("Found note starting at timestamp:", entryStart, "current:", currentTimestamp.RealValue, "duration:", duration, "staff:", staffNumber);

                            for (const note of voiceEntry.Notes) {
                              const noteAny = note as any;
                              let pitch: any = null;
                              if (noteAny.Pitch) {
                                pitch = noteAny.Pitch;
                              } else if (noteAny.sourceNote?.Pitch) {
                                pitch = noteAny.sourceNote.Pitch;
                              }
                              if (pitch) {
                                console.log("Pitch object:", pitch);
                                console.log("Pitch keys:", Object.keys(pitch));

                                // Use halfTone to calculate everything
                                // halfTone in OSMD is the actual MIDI note number
                                const halfTone = pitch.halfTone;
                                if (typeof halfTone === 'number') {
                                  // MIDI to note conversion
                                  const noteNames = ["C", "D", "E", "F", "G", "A", "B"];
                                  const semitoneToNote = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]; // C, C#, D, D#, E, F, F#, G, G#, A, A#, B
                                  const semitoneToAlter = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]; // 0=natural, 1=sharp

                                  const octave = Math.floor(halfTone / 12) - 1;
                                  const semitone = halfTone % 12;
                                  const noteIndex = semitoneToNote[semitone];
                                  const step = noteNames[noteIndex];
                                  const alter = semitoneToAlter[semitone];

                                  const noteData = { step, octave, alter, staff: staffNumber };
                                  console.log("halfTone:", halfTone, "→ MIDI note:", step + (alter === 1 ? "#" : ""), octave, "staff:", staffNumber);
                                  console.log("Adding sounding note:", noteData);
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
            console.error("Error getting sounding notes from music sheet:", err);
          }
        }

        // Access the graphic measures which contain all staffs
        const graphicalMeasure = iterator.CurrentMeasure;

        // Try to get all voices under cursor from all staffs
        if (notes.length === 0) {
          console.log("Trying to get notes from graphical measure");

          if (graphicalMeasure?.staffEntries) {
            console.log("Found staffEntries:", graphicalMeasure.staffEntries.length);

            for (const staffEntry of graphicalMeasure.staffEntries) {
              // Check if this staff entry is at the current timestamp
              const staffTimestamp = (staffEntry as any)?.timestamp;
              console.log("StaffEntry timestamp:", staffTimestamp?.RealValue, "vs current:", currentTimestamp?.RealValue);

              if (staffTimestamp?.RealValue === currentTimestamp?.RealValue) {
                if (staffEntry?.graphicalVoiceEntries) {
                  for (const graphicalVoiceEntry of staffEntry.graphicalVoiceEntries) {
                    const voiceEntry = (graphicalVoiceEntry as any)?.parentVoiceEntry;

                    if (voiceEntry?.Notes) {
                      console.log("Found voice with notes:", voiceEntry.Notes.length);

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
                          const step = fundamentalNote !== undefined ? noteNames[fundamentalNote] : "C";
                          const octave = pitch.octave !== undefined ? pitch.octave : 4;
                          const alter = pitch.accidental || 0;
                          const staffNumber = (staffEntry as any)?.parentStaffEntry?.ParentStaff?.idInMusicSheet;
                          const noteData = { step, octave, alter, staff: staffNumber };
                          console.log("Adding note from staff:", noteData);
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
          console.log("Trying to find all sounding notes (including sustained notes)");

          if (graphicalMeasure?.staffEntries) {
            for (const staffEntry of graphicalMeasure.staffEntries) {
              const entryTimestamp = (staffEntry as any)?.timestamp;
              const entryEndTimestamp = (staffEntry as any)?.endTimestamp;

              // Check if this entry started at or before current time and hasn't ended yet
              if (entryTimestamp && currentTimestamp) {
                const starts = entryTimestamp.RealValue <= currentTimestamp.RealValue;
                const notEnded = !entryEndTimestamp || entryEndTimestamp.RealValue > currentTimestamp.RealValue;

                console.log("Entry timestamp:", entryTimestamp.RealValue, "Current:", currentTimestamp.RealValue, "Starts:", starts, "NotEnded:", notEnded);

                if (starts && notEnded) {
                  if (staffEntry?.graphicalVoiceEntries) {
                    for (const graphicalVoiceEntry of staffEntry.graphicalVoiceEntries) {
                      const voiceEntry = (graphicalVoiceEntry as any)?.parentVoiceEntry;

                      if (voiceEntry?.Notes) {
                        console.log("Found sustained voice with notes:", voiceEntry.Notes.length);

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
                            const step = fundamentalNote !== undefined ? noteNames[fundamentalNote] : "C";
                            const octave = pitch.octave !== undefined ? pitch.octave : 4;
                            const alter = pitch.accidental || 0;
                            const staffNumber = (staffEntry as any)?.parentStaffEntry?.ParentStaff?.idInMusicSheet;
                            const noteData = { step, octave, alter, staff: staffNumber };
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
          console.log("Final fallback: using CurrentVoiceEntries");
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
                  const step = fundamentalNote !== undefined ? noteNames[fundamentalNote] : "C";
                  const octave = pitch.octave !== undefined ? pitch.octave : 4;
                  const alter = pitch.accidental || 0;
                  const staffNumber = (voiceEntry as any)?.ParentStaffEntry?.ParentStaff?.idInMusicSheet;
                  const noteData = { step, octave, alter, staff: staffNumber };
                  notes.push(noteData);
                }
              }
            }
          }
        }

        console.log("Final notes:", notes);
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
          onNotesChange?.(getCurrentNotes());
          // Update custom cursor position
          if ((osmdRef.current as any).updateCustomCursor) {
            (osmdRef.current as any).updateCustomCursor();
          }
        }
      },
      previous: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.previous();
          onNotesChange?.(getCurrentNotes());
          // Update custom cursor position
          if ((osmdRef.current as any).updateCustomCursor) {
            (osmdRef.current as any).updateCustomCursor();
          }
        }
      },
      reset: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.reset();
          onNotesChange?.(getCurrentNotes());
          // Update custom cursor position
          if ((osmdRef.current as any).updateCustomCursor) {
            (osmdRef.current as any).updateCustomCursor();
          }
        }
      },
      getNotesAtPosition,
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
            drawingParameters: "compacttight",
          });
          osmdRef.current = osmd;
          await osmd.load(musicXmlPath);
          if (!mounted) return;
          osmd.render();
          if (osmd.cursor) {
            osmd.cursor.show();
            osmd.cursor.hidden = false;

            setTimeout(() => {
              const cursorElement = (osmd.cursor as any).cursorElement;
              console.log("Setting up custom cursor...");

              if (cursorElement && containerRef.current && parentRef.current) {
                // Hide the default cursor image
                cursorElement.style.opacity = "0";

                // Get cursor position
                const cursorRect = cursorElement.getBoundingClientRect();
                const parentRect = parentRef.current.getBoundingClientRect();

                // Find all staves that overlap with the cursor
                const allStaves = containerRef.current.querySelectorAll('[class*="vf-stave"]');
                console.log("Found staves:", allStaves.length);

                const overlappingStaves: DOMRect[] = [];

                // Calculate cursor center point
                const cursorCenterY = (cursorRect.top + cursorRect.bottom) / 2;

                allStaves.forEach((stave) => {
                  const staveRect = stave.getBoundingClientRect();

                  // Horizontal: cursor should be within or near the stave
                  const horizontalTolerance = 50;
                  const horizontalOverlap =
                    cursorRect.left >= staveRect.left - horizontalTolerance &&
                    cursorRect.left <= staveRect.right;

                  // Vertical: check if cursor center point is within stave bounds
                  const verticalTolerance = 50;
                  const verticalOverlap =
                    cursorCenterY >= staveRect.top - verticalTolerance &&
                    cursorCenterY <= staveRect.bottom + verticalTolerance;

                  if (horizontalOverlap && verticalOverlap) {
                    overlappingStaves.push(staveRect);
                    console.log("Matching stave:", {
                      staveTop: staveRect.top,
                      staveBottom: staveRect.bottom,
                      cursorCenterY,
                    });
                  }
                });

                console.log("Overlapping staves:", overlappingStaves.length);

                let measureTop = cursorRect.top;
                let measureHeight = cursorRect.height;

                if (overlappingStaves.length > 0) {
                  // Find the topmost and bottommost staves
                  const topMost = Math.min(...overlappingStaves.map(r => r.top));
                  const bottomMost = Math.max(...overlappingStaves.map(r => r.bottom));
                  measureTop = topMost;
                  measureHeight = bottomMost - topMost;
                }

                // Calculate position relative to parent
                const cursorLeft = cursorRect.left - parentRect.left;
                const cursorTop = measureTop - parentRect.top;

                console.log("Cursor position:", { top: cursorTop, left: cursorLeft, height: measureHeight });

                // Create a custom red cursor line
                const customCursor = document.createElement("div");
                customCursor.id = "custom-cursor";
                customCursor.style.position = "absolute";
                customCursor.style.backgroundColor = "red";
                customCursor.style.width = "3px";
                customCursor.style.height = measureHeight + "px";
                customCursor.style.top = cursorTop + "px";
                customCursor.style.left = cursorLeft + "px";
                customCursor.style.zIndex = "1000";
                customCursor.style.pointerEvents = "none";

                // Add the custom cursor to the parent
                parentRef.current.appendChild(customCursor);
                console.log("Appended custom cursor to parent");

                // Update custom cursor position whenever the default cursor moves
                const updateCustomCursor = () => {
                  if (customCursor && cursorElement && containerRef.current && parentRef.current) {
                    const updatedCursorRect = cursorElement.getBoundingClientRect();
                    const updatedParentRect = parentRef.current.getBoundingClientRect();

                    // Find all staves that overlap with the cursor
                    const updatedAllStaves = containerRef.current.querySelectorAll('[class*="vf-stave"]');

                    // Calculate cursor center point
                    const updatedCursorCenterY = (updatedCursorRect.top + updatedCursorRect.bottom) / 2;

                    const updatedOverlappingStaves: DOMRect[] = [];
                    updatedAllStaves.forEach((stave) => {
                      const staveRect = stave.getBoundingClientRect();

                      const horizontalTolerance = 50;
                      const horizontalOverlap =
                        updatedCursorRect.left >= staveRect.left - horizontalTolerance &&
                        updatedCursorRect.left <= staveRect.right;

                      // Vertical: check if cursor center point is within stave bounds
                      const verticalTolerance = 50;
                      const verticalOverlap =
                        updatedCursorCenterY >= staveRect.top - verticalTolerance &&
                        updatedCursorCenterY <= staveRect.bottom + verticalTolerance;

                      if (horizontalOverlap && verticalOverlap) {
                        updatedOverlappingStaves.push(staveRect);
                      }
                    });

                    let updatedMeasureTop = updatedCursorRect.top;
                    let updatedMeasureHeight = updatedCursorRect.height;

                    if (updatedOverlappingStaves.length > 0) {
                      const topMost = Math.min(...updatedOverlappingStaves.map(r => r.top));
                      const bottomMost = Math.max(...updatedOverlappingStaves.map(r => r.bottom));
                      updatedMeasureTop = topMost;
                      updatedMeasureHeight = bottomMost - topMost;
                    }

                    const updatedLeft = updatedCursorRect.left - updatedParentRect.left;
                    const updatedTop = updatedMeasureTop - updatedParentRect.top;

                    customCursor.style.top = updatedTop + "px";
                    customCursor.style.left = updatedLeft + "px";
                    customCursor.style.height = updatedMeasureHeight + "px";

                    console.log("Updated custom cursor position:", { top: updatedTop, left: updatedLeft, height: updatedMeasureHeight });
                  }
                };

                // Store the update function so we can call it on cursor movement
                (osmdRef.current as any).updateCustomCursor = updateCustomCursor;
              } else {
                console.error("Cannot create custom cursor - missing element or container");
              }
            }, 200);

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
                      console.log("VoiceEntries count:", voice.VoiceEntries?.length);
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
                              const midi = (octave + 1) * 12 + semitone + (pitch.Alter || 0);
                              console.log("Found note with halfTone:", pitch.halfTone, "-> MIDI:", midi);
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
                  // Adjust minMidi to start from C (semitone 0)
                  const minSemitone = minMidi % 12;
                  if (minSemitone !== 0) {
                    minMidi = minMidi - minSemitone;
                  }

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
          }
          setIsLoading(false);
        } catch (err) {
          console.error("Error loading music:", err);
          if (mounted) {
            let errorMessage = "楽譜の読み込みに失敗しました";
            if (err instanceof Error) {
              if (err.message.includes("Cannot read properties of undefined")) {
                errorMessage = "この楽譜は複雑すぎるため表示できません。より小さなMusicXMLファイルをお試しください。";
              } else {
                errorMessage = err.message;
              }
            }
            setError(errorMessage);
            setIsLoading(false);
          }
        }
      };
      loadOSMD();
      return () => {
        mounted = false;
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        osmdRef.current = null;
      };
    }, [musicXmlPath]);

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
        }}
      >
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
          style={{ width: "100%", height: "100%", cursor: "pointer" }}
          onClick={handleClick}
        />
      </div>
    );
  },
);

SheetMusic.displayName = "SheetMusic";

export default SheetMusic;
