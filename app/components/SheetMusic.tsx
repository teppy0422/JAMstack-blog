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
    notes: Array<{ step: string; octave: number; alter: number }>,
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
  ) => Array<{ step: string; octave: number; alter: number }>;
}

const SheetMusic = forwardRef<SheetMusicRef, SheetMusicProps>(
  ({ musicXmlPath, onNotesChange, onRangeChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const osmdRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const highlightedNotesRef = useRef<Set<Element>>(new Set());

    const clearHighlights = () => {
      highlightedNotesRef.current.forEach((element) => {
        const className = (element as any).className?.baseVal || "";
        if (className.includes("vf-stem")) {
          const paths = element.querySelectorAll("path");
          paths.forEach((path) => {
            path.setAttribute("stroke", "#000000");
            (path as SVGPathElement).style.stroke = "#000000";
          });
        } else {
          const paths = element.querySelectorAll("path");
          paths.forEach((path) => {
            path.setAttribute("fill", "#000000");
            path.setAttribute("stroke", "#000000");
            (path as SVGPathElement).style.fill = "#000000";
            (path as SVGPathElement).style.stroke = "#000000";
          });
        }
      });
      highlightedNotesRef.current.clear();
    };

    const highlightCurrentNotes = () => {
      if (!osmdRef.current?.cursor || !containerRef.current) {
        return;
      }

      try {
        clearHighlights();

        const cursorElement = osmdRef.current.cursor.cursorElement;
        if (!cursorElement) {
          return;
        }

        const cursorRect = cursorElement.getBoundingClientRect();
        if (cursorRect.width === 0 && cursorRect.height === 0) {
          return; // Don't highlight if cursor isn't ready
        }

        const noteheads = containerRef.current.querySelectorAll(
          '[class*="vf-notehead"]',
        );

        const horizontalCandidates: { element: Element; rect: DOMRect }[] = [];

        // 1. Find all notes that overlap horizontally with the cursor
        noteheads.forEach((notehead) => {
          const className =
            (notehead as any).className?.baseVal ||
            (notehead as any).className ||
            "";
          // Safety check: ensure className is a string
          if (typeof className !== 'string') {
            return;
          }
          if (
            className.includes("vf-clef") ||
            className.includes("vf-timesignature")
          ) {
            return;
          }
          const noteRect = notehead.getBoundingClientRect();
          const noteCenterX = noteRect.left + noteRect.width / 2;
          // Use a small buffer for horizontal check
          if (
            noteCenterX >= cursorRect.left - 0 &&
            noteCenterX <= cursorRect.right + 0
          ) {
            horizontalCandidates.push({ element: notehead, rect: noteRect });
          }
        });

        if (horizontalCandidates.length === 0) {
          return;
        }

        // 2. Find the candidate vertically closest to the cursor
        let anchorCandidate = horizontalCandidates[0];
        let minVerticalDistance = Math.abs(
          anchorCandidate.rect.top - cursorRect.top,
        );

        for (let i = 1; i < horizontalCandidates.length; i++) {
          const distance = Math.abs(
            horizontalCandidates[i].rect.top - cursorRect.top,
          );
          if (distance < minVerticalDistance) {
            minVerticalDistance = distance;
            anchorCandidate = horizontalCandidates[i];
          }
        }

        // 3. Use the anchor to define a vertical cluster
        const anchorTop = anchorCandidate.rect.top;
        const verticalClusterTolerance = 80; // Tolerance to group notes from same staff only (not both treble + bass)

        const finalCandidates: Element[] = [];

        // 4. Filter to include all notes that are vertically clustered around the anchor
        horizontalCandidates.forEach((candidate) => {
          if (
            Math.abs(candidate.rect.top - anchorTop) < verticalClusterTolerance
          ) {
            finalCandidates.push(candidate.element);
          }
        });

        const highlightNoteAndStem = (notehead: Element) => {
          const paths = notehead.querySelectorAll("path");
          paths.forEach((path) => {
            path.setAttribute("fill", "red");
            path.setAttribute("stroke", "red");
            (path as SVGPathElement).style.fill = "red";
            (path as SVGPathElement).style.stroke = "red";
          });
          highlightedNotesRef.current.add(notehead);
          const parent = notehead.parentElement;
          if (parent) {
            const stems = parent.querySelectorAll(".vf-stem path");
            stems.forEach((stem) => {
              stem.setAttribute("stroke", "red");
              (stem as SVGPathElement).style.stroke = "red";
              const stemGroup = stem.parentElement;
              if (stemGroup) {
                highlightedNotesRef.current.add(stemGroup);
              }
            });
          }
        };

        finalCandidates.forEach(highlightNoteAndStem);
      } catch (err) {
        console.error("Error in final highlightCurrentNotes:", err);
      }
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
            if (musicSheet?.SourceMeasures) {
              console.log("SourceMeasures count:", musicSheet.SourceMeasures.length);

              // Get the current source measure
              const sourceMeasure = musicSheet.SourceMeasures[iterator.currentMeasureIndex];
              if (sourceMeasure) {
                console.log("Found source measure:", iterator.currentMeasureIndex);

                // Iterate through all staff entries in this measure
                for (const staffEntry of sourceMeasure.VerticalSourceStaffEntryContainers || []) {
                  for (const sourceStaffEntry of staffEntry.StaffEntries || []) {
                    if (!sourceStaffEntry) continue;
                    const entryTimestamp = sourceStaffEntry.Timestamp;
                    const voiceEntries = sourceStaffEntry.VoiceEntries;

                    if (voiceEntries && entryTimestamp) {
                      // Check if this entry is currently sounding
                      for (const voiceEntry of voiceEntries) {
                        if (voiceEntry?.Notes) {
                          const duration = voiceEntry.Notes[0]?.Length?.RealValue || 0;
                          const entryStart = entryTimestamp.RealValue;

                          // Only detect notes that START at current timestamp, not sustained notes
                          if (entryStart === currentTimestamp.RealValue) {
                            console.log("Found note starting at timestamp:", entryStart, "duration:", duration);

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
                                  "C", "C#", "D", "D#", "E", "F",
                                  "F#", "G", "G#", "A", "A#", "B",
                                ];
                                const step = noteNames[semitone] || "C";
                                const octave = pitch.halfTone !== undefined
                                  ? Math.floor(pitch.halfTone / 12)
                                  : 4;
                                const noteData = { step, octave, alter: pitch.Alter || 0 };
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
          highlightCurrentNotes();
          onNotesChange?.(getCurrentNotes());
        }
      },
      previous: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.previous();
          highlightCurrentNotes();
          onNotesChange?.(getCurrentNotes());
        }
      },
      reset: () => {
        if (osmdRef.current?.cursor) {
          osmdRef.current.cursor.reset();
          highlightCurrentNotes();
          onNotesChange?.(getCurrentNotes());
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

            setTimeout(() => {
              const cursorElement = (osmd.cursor as any).cursorElement;
              if (cursorElement) {
                cursorElement.style.opacity = "0";
              }
              highlightCurrentNotes();
            }, 200);
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
