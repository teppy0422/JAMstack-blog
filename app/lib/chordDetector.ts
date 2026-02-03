/**
 * MusicXMLから左手パターンを分析してコードを自動検出し、
 * harmony要素を追加するモジュール
 */

// コード構成音の定義
const CHORD_PATTERNS: {
  [key: string]: { intervals: number[]; kind: string; kindText: string };
} = {
  major: { intervals: [0, 4, 7], kind: "major", kindText: "major" },
  minor: { intervals: [0, 3, 7], kind: "minor", kindText: "minor" },
  dominant7: { intervals: [0, 4, 7, 10], kind: "dominant", kindText: "7" },
  major7: { intervals: [0, 4, 7, 11], kind: "major-seventh", kindText: "maj7" },
  minor7: { intervals: [0, 3, 7, 10], kind: "minor-seventh", kindText: "m7" },
  dim: { intervals: [0, 3, 6], kind: "diminished", kindText: "dim" },
  aug: { intervals: [0, 4, 8], kind: "augmented", kindText: "aug" },
  sus4: { intervals: [0, 5, 7], kind: "suspended-fourth", kindText: "sus4" },
  sus2: { intervals: [0, 2, 7], kind: "suspended-second", kindText: "sus2" },
};

// 音名からMIDI番号への変換
const NOTE_TO_SEMITONE: { [key: string]: number } = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

// MIDIから音名への変換
const SEMITONE_TO_NOTE = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface NoteInfo {
  step: string;
  alter: number;
  octave: number;
  midi: number;
  duration: number;
  voice: number;
  staff: number;
}

interface MeasureNotes {
  measureNumber: number;
  notes: NoteInfo[];
  divisions: number;
  beats: number;
}

interface DetectedChord {
  measureNumber: number;
  beat: number; // 1-indexed
  root: string;
  kind: string;
  kindText: string;
  bass?: string;
}

/**
 * MusicXMLにharmony要素が既に存在するかチェック
 */
export function hasChordSymbols(xmlContent: string): boolean {
  return xmlContent.includes("<harmony");
}

/**
 * MusicXMLから音符情報を抽出
 */
function extractNotesFromMeasure(measureXml: string, divisions: number): MeasureNotes {
  const notes: NoteInfo[] = [];
  let currentDivisions = divisions;

  // divisions の更新をチェック
  const divisionsMatch = measureXml.match(/<divisions>(\d+)<\/divisions>/);
  if (divisionsMatch) {
    currentDivisions = parseInt(divisionsMatch[1]);
  }

  // time signature を取得
  const beatsMatch = measureXml.match(/<beats>(\d+)<\/beats>/);
  const beats = beatsMatch ? parseInt(beatsMatch[1]) : 4;

  // 小節番号を取得
  const measureNumMatch = measureXml.match(/<measure[^>]*number="(\d+)"/);
  const measureNumber = measureNumMatch ? parseInt(measureNumMatch[1]) : 0;

  // 音符を抽出（chord タグがある場合は同時発音）
  const noteRegex = /<note[^>]*>([\s\S]*?)<\/note>/g;
  let match;
  let cumulativeDuration = 0;
  let lastWasChord = false;

  while ((match = noteRegex.exec(measureXml)) !== null) {
    const noteContent = match[1];

    // 休符はスキップ
    if (noteContent.includes("<rest")) {
      const durationMatch = noteContent.match(/<duration>(\d+)<\/duration>/);
      if (durationMatch && !noteContent.includes("<chord/>")) {
        cumulativeDuration += parseInt(durationMatch[1]);
      }
      continue;
    }

    // chordタグの確認
    const isChord = noteContent.includes("<chord/>");

    // ピッチ情報を取得
    const stepMatch = noteContent.match(/<step>([A-G])<\/step>/);
    const octaveMatch = noteContent.match(/<octave>(\d+)<\/octave>/);
    const alterMatch = noteContent.match(/<alter>(-?\d+)<\/alter>/);
    const durationMatch = noteContent.match(/<duration>(\d+)<\/duration>/);
    const voiceMatch = noteContent.match(/<voice>(\d+)<\/voice>/);
    const staffMatch = noteContent.match(/<staff>(\d+)<\/staff>/);

    if (stepMatch && octaveMatch) {
      const step = stepMatch[1];
      const octave = parseInt(octaveMatch[1]);
      const alter = alterMatch ? parseInt(alterMatch[1]) : 0;
      const duration = durationMatch ? parseInt(durationMatch[1]) : currentDivisions;
      const voice = voiceMatch ? parseInt(voiceMatch[1]) : 1;
      const staff = staffMatch ? parseInt(staffMatch[1]) : 1;

      // MIDIノート番号を計算
      const midi = (octave + 1) * 12 + NOTE_TO_SEMITONE[step] + alter;

      notes.push({
        step,
        alter,
        octave,
        midi,
        duration,
        voice,
        staff,
      });

      // chordタグがない場合のみdurationを加算
      if (!isChord) {
        cumulativeDuration += duration;
      }
    }

    lastWasChord = isChord;
  }

  return {
    measureNumber,
    notes,
    divisions: currentDivisions,
    beats,
  };
}

/**
 * 音符群からコードを検出
 */
function detectChordFromNotes(notes: NoteInfo[], divisions: number, beats: number): DetectedChord[] {
  const chords: DetectedChord[] = [];

  if (notes.length === 0) return chords;

  // 左手（staff=2 または voice >= 5）の音符をフィルタ
  const bassNotes = notes.filter((n) => n.staff === 2 || n.voice >= 5);

  if (bassNotes.length === 0) return chords;

  // 拍ごとにグループ化（1拍 = divisions）
  const beatsPerMeasure = beats;
  const durationPerBeat = divisions;

  // 各拍の開始時点の音符を収集
  for (let beat = 1; beat <= beatsPerMeasure; beat += 2) {
    // 2拍ごとに分析（半小節単位）
    const beatStartDuration = (beat - 1) * durationPerBeat;
    const beatEndDuration = (beat + 1) * durationPerBeat;

    // この拍範囲内で最も低い音をベース音とみなす
    const notesInBeat = bassNotes.filter((n, idx) => {
      // 簡易的に位置を推定（音符の出現順）
      return true; // 全ての音符を考慮
    });

    if (notesInBeat.length === 0) continue;

    // ユニークなピッチクラスを収集
    const pitchClasses = new Set<number>();
    let lowestMidi = Infinity;
    let lowestNote: NoteInfo | null = null;

    for (const note of notesInBeat) {
      pitchClasses.add(note.midi % 12);
      if (note.midi < lowestMidi) {
        lowestMidi = note.midi;
        lowestNote = note;
      }
    }

    if (!lowestNote || pitchClasses.size < 2) continue;

    // ベース音（最低音）からコードを推測
    const bassRoot = lowestMidi % 12;
    const intervals = Array.from(pitchClasses).map((pc) => (pc - bassRoot + 12) % 12);
    intervals.sort((a, b) => a - b);

    // コードパターンとマッチング
    let bestMatch: { pattern: string; score: number } | null = null;

    for (const [patternName, pattern] of Object.entries(CHORD_PATTERNS)) {
      let score = 0;
      for (const interval of pattern.intervals) {
        if (intervals.includes(interval)) {
          score++;
        }
      }
      // より多くの構成音がマッチするパターンを選択
      if (score >= 2 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { pattern: patternName, score };
      }
    }

    if (bestMatch) {
      const pattern = CHORD_PATTERNS[bestMatch.pattern];
      const rootNote = SEMITONE_TO_NOTE[bassRoot];

      // 既に同じ拍にコードが検出されていなければ追加
      const existingChord = chords.find((c) => c.beat === beat);
      if (!existingChord) {
        chords.push({
          measureNumber: 0, // 後で設定
          beat,
          root: rootNote,
          kind: pattern.kind,
          kindText: pattern.kindText,
        });
      }
    }
  }

  return chords;
}

/**
 * harmony要素のXMLを生成
 */
function createHarmonyXml(chord: DetectedChord): string {
  let rootStep = chord.root;
  let rootAlter = "";

  if (chord.root.includes("#")) {
    rootStep = chord.root.replace("#", "");
    rootAlter = "\n        <root-alter>1</root-alter>";
  } else if (chord.root.includes("b")) {
    rootStep = chord.root.replace("b", "");
    rootAlter = "\n        <root-alter>-1</root-alter>";
  }

  let bassXml = "";
  if (chord.bass) {
    let bassStep = chord.bass;
    let bassAlter = "";
    if (chord.bass.includes("#")) {
      bassStep = chord.bass.replace("#", "");
      bassAlter = "\n        <bass-alter>1</bass-alter>";
    }
    bassXml = `
      <bass>
        <bass-step>${bassStep}</bass-step>${bassAlter}
      </bass>`;
  }

  return `      <harmony default-y="40">
        <root>
          <root-step>${rootStep}</root-step>${rootAlter}
        </root>
        <kind text="${chord.kindText}">${chord.kind}</kind>${bassXml}
      </harmony>
`;
}

/**
 * MusicXMLにコードを追加（メイン関数）
 */
export function addChordsToMusicXml(xmlContent: string): string {
  // 既にコードがある場合はそのまま返す
  if (hasChordSymbols(xmlContent)) {
    console.log("Chord symbols already exist in the MusicXML");
    return xmlContent;
  }

  let result = xmlContent;
  let globalDivisions = 12; // デフォルト値

  // 各小節を処理
  const measureRegex = /(<measure[^>]*number="(\d+)"[^>]*>)([\s\S]*?)(<\/measure>)/g;
  const measuresData: { measureNumber: number; notes: MeasureNotes; chords: DetectedChord[] }[] =
    [];

  let match;
  while ((match = measureRegex.exec(xmlContent)) !== null) {
    const measureNumber = parseInt(match[2]);
    const measureBody = match[3];

    // divisions を更新
    const divisionsMatch = measureBody.match(/<divisions>(\d+)<\/divisions>/);
    if (divisionsMatch) {
      globalDivisions = parseInt(divisionsMatch[1]);
    }

    const measureNotes = extractNotesFromMeasure(match[0], globalDivisions);
    const detectedChords = detectChordFromNotes(
      measureNotes.notes,
      measureNotes.divisions,
      measureNotes.beats
    );

    // 小節番号を設定
    for (const chord of detectedChords) {
      chord.measureNumber = measureNumber;
    }

    if (detectedChords.length > 0) {
      measuresData.push({
        measureNumber,
        notes: measureNotes,
        chords: detectedChords,
      });
    }
  }

  console.log(`Detected ${measuresData.length} measures with chords`);

  // 後ろから処理することでインデックスがずれない
  for (let i = measuresData.length - 1; i >= 0; i--) {
    const { measureNumber, chords } = measuresData[i];

    // 小節を見つける
    const measurePattern = new RegExp(
      `(<measure[^>]*number="${measureNumber}"[^>]*>)([\\s\\S]*?)(</measure>)`,
      "g"
    );

    result = result.replace(measurePattern, (fullMatch, measureStart, measureBody, measureEnd) => {
      let newBody = measureBody;

      // 1拍目のコードを小節の先頭に追加
      const beat1Chord = chords.find((c) => c.beat === 1);
      if (beat1Chord) {
        const harmonyXml = createHarmonyXml(beat1Chord);
        newBody = "\n" + harmonyXml + newBody;
      }

      // 3拍目のコードを適切な位置に挿入
      const beat3Chord = chords.find((c) => c.beat === 3);
      if (beat3Chord) {
        // 簡易的に：小節の中間付近に挿入
        // duration累積が半分を超えた最初のnoteの前に挿入
        const harmonyXml = createHarmonyXml(beat3Chord);

        // backupタグを探して、その後の最初のnoteの前に挿入
        const backupMatch = newBody.match(/(<backup>[\s\S]*?<\/backup>)/);
        if (backupMatch) {
          const backupEnd = newBody.indexOf(backupMatch[0]) + backupMatch[0].length;
          const afterBackup = newBody.substring(backupEnd);
          const firstNoteMatch = afterBackup.match(/(<note[^>]*>)/);
          if (firstNoteMatch) {
            const insertPos = backupEnd + afterBackup.indexOf(firstNoteMatch[0]);
            // 3拍目の位置（duration累積が24以上）の音符を探す
            // 簡易実装：backupの後の4番目のnote付近
            let noteCount = 0;
            let searchPos = backupEnd;
            const noteRegex = /<note[^>]*>/g;
            let noteMatch;
            const bodyAfterBackup = newBody.substring(backupEnd);
            noteRegex.lastIndex = 0;

            while ((noteMatch = noteRegex.exec(bodyAfterBackup)) !== null) {
              noteCount++;
              if (noteCount === 5) {
                // 5番目のnote（3拍目開始）の前に挿入
                const actualInsertPos = backupEnd + noteMatch.index;
                newBody =
                  newBody.substring(0, actualInsertPos) +
                  harmonyXml +
                  newBody.substring(actualInsertPos);
                break;
              }
            }
          }
        }
      }

      return measureStart + newBody + measureEnd;
    });
  }

  return result;
}

/**
 * MusicXMLからharmony要素を削除（表示OFF用ではなく、必要に応じて）
 */
export function removeChordsFromMusicXml(xmlContent: string): string {
  // harmony要素を削除
  return xmlContent.replace(/\s*<harmony[^>]*>[\s\S]*?<\/harmony>\s*/g, "\n");
}
