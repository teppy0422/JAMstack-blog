import fs from 'fs';
import path from 'path';

/**
 * Hanon練習曲1-30にコード（harmony要素）を追加するスクリプト
 * 各Exercise内での小節位置に基づいてコードを決定
 */

interface ChordInfo {
  measureRange: [number, number]; // 小節範囲 [開始, 終了]
  beat: number; // 拍（1=小節頭）
  root: string; // ルート音
  kind: string; // コード種類
  kindText: string; // 表示用テキスト
  isSharp?: boolean; // シャープフラグ
}

// Hanon各グループの調とコード情報
// 各Exerciseは異なる小節数を持つ可能性があるため、
// パターンベースのアプローチを使用
const HANON_CHORD_PATTERNS: {
  [key: number]: { tonic: string; isSharp?: boolean; chords: { [key: number]: string } };
} = {
  // Exercise 1-5: C Major
  1: {
    tonic: 'C',
    chords: {
      1: 'C',
      11: 'F',
      16: 'G',
    },
  },
  2: { tonic: 'C', chords: { 1: 'C', 11: 'F', 16: 'G' } },
  3: { tonic: 'C', chords: { 1: 'C', 11: 'F', 16: 'G' } },
  4: { tonic: 'C', chords: { 1: 'C', 11: 'F', 16: 'G' } },
  5: { tonic: 'C', chords: { 1: 'C', 11: 'F', 16: 'G' } },

  // Exercise 6-10: G Major
  6: { tonic: 'G', chords: { 1: 'G', 11: 'C', 16: 'D' } },
  7: { tonic: 'G', chords: { 1: 'G', 11: 'C', 16: 'D' } },
  8: { tonic: 'G', chords: { 1: 'G', 11: 'C', 16: 'D' } },
  9: { tonic: 'G', chords: { 1: 'G', 11: 'C', 16: 'D' } },
  10: { tonic: 'G', chords: { 1: 'G', 11: 'C', 16: 'D' } },

  // Exercise 11-15: D Major
  11: { tonic: 'D', chords: { 1: 'D', 11: 'G', 16: 'A' } },
  12: { tonic: 'D', chords: { 1: 'D', 11: 'G', 16: 'A' } },
  13: { tonic: 'D', chords: { 1: 'D', 11: 'G', 16: 'A' } },
  14: { tonic: 'D', chords: { 1: 'D', 11: 'G', 16: 'A' } },
  15: { tonic: 'D', chords: { 1: 'D', 11: 'G', 16: 'A' } },

  // Exercise 16-20: A Major
  16: { tonic: 'A', chords: { 1: 'A', 11: 'D', 16: 'E' } },
  17: { tonic: 'A', chords: { 1: 'A', 11: 'D', 16: 'E' } },
  18: { tonic: 'A', chords: { 1: 'A', 11: 'D', 16: 'E' } },
  19: { tonic: 'A', chords: { 1: 'A', 11: 'D', 16: 'E' } },
  20: { tonic: 'A', chords: { 1: 'A', 11: 'D', 16: 'E' } },

  // Exercise 21-25: E Major
  21: { tonic: 'E', chords: { 1: 'E', 11: 'A', 16: 'B' } },
  22: { tonic: 'E', chords: { 1: 'E', 11: 'A', 16: 'B' } },
  23: { tonic: 'E', chords: { 1: 'E', 11: 'A', 16: 'B' } },
  24: { tonic: 'E', chords: { 1: 'E', 11: 'A', 16: 'B' } },
  25: { tonic: 'E', chords: { 1: 'E', 11: 'A', 16: 'B' } },

  // Exercise 26-30: B Major
  26: { tonic: 'B', chords: { 1: 'B', 11: 'E', 16: 'F#' }, isSharp: true },
  27: { tonic: 'B', chords: { 1: 'B', 11: 'E', 16: 'F#' }, isSharp: true },
  28: { tonic: 'B', chords: { 1: 'B', 11: 'E', 16: 'F#' }, isSharp: true },
  29: { tonic: 'B', chords: { 1: 'B', 11: 'E', 16: 'F#' }, isSharp: true },
  30: { tonic: 'B', chords: { 1: 'B', 11: 'E', 16: 'F#' }, isSharp: true },
};

function createHarmonyXml(
  root: string,
  kind: string = 'major',
  kindText: string = 'major'
): string {
  let rootStep = root;
  let rootAlter = '';

  if (root === 'F#') {
    rootStep = 'F';
    rootAlter = '\n        <root-alter>1</root-alter>';
  } else if (root === 'Bb') {
    rootStep = 'B';
    rootAlter = '\n        <root-alter>-1</root-alter>';
  }

  return `      <harmony default-y="40">
        <root>
          <root-step>${rootStep}</root-step>${rootAlter}
        </root>
        <kind text="${kindText}">${kind}</kind>
      </harmony>`;
}

export function addHanonChords(xmlContent: string): string {
  // 既にコードがある場合はスキップ
  if (xmlContent.includes('<harmony')) {
    console.log('Chord symbols already exist in the MusicXML');
    return xmlContent;
  }

  let result = xmlContent;
  let currentExercise = 1;
  let lastMeasureNumber = 0;

  // 各小節を処理
  const measureRegex = /(<measure[^>]*number="(\d+)"[^>]*>)([\s\S]*?)(<\/measure>)/g;

  result = result.replace(measureRegex, (fullMatch, measureStart, measureNum, measureBody, measureEnd) => {
    const measureNumber = parseInt(measureNum);

    // Exerciseの判定ロジック
    // 小節番号が1に戻った、または最初の場合、新しいExerciseが開始
    if (measureNumber === 1 && lastMeasureNumber > 0) {
      currentExercise++;
    }
    lastMeasureNumber = measureNumber;

    // パターンからコード情報を取得
    const pattern = HANON_CHORD_PATTERNS[currentExercise];
    if (!pattern) {
      return fullMatch; // Exercise 30を超えた場合
    }

    const exerciseMeasureCount = measureNumber;

    // 小節範囲でのマッピング
    let chordRoot: string | null = null;
    if (exerciseMeasureCount >= 1 && exerciseMeasureCount <= 10) {
      chordRoot = pattern.chords[1];
    } else if (exerciseMeasureCount >= 11 && exerciseMeasureCount <= 15) {
      chordRoot = pattern.chords[11];
    } else if (exerciseMeasureCount >= 16 && exerciseMeasureCount <= 20) {
      chordRoot = pattern.chords[16];
    }

    if (!chordRoot) {
      return fullMatch;
    }

    // harmony要素を作成して小節の先頭に追加
    const harmonyXml = createHarmonyXml(chordRoot);
    const newMeasureBody = '\n' + harmonyXml + measureBody;

    return measureStart + newMeasureBody + measureEnd;
  });

  return result;
}

// メイン処理
const inputFile = '/Users/teppy/docker/testReact/nextjs-blog/public/scores/hanon-ning-suo-ban-lian-xi-qu-1-kara-30.musicxml';
const outputFile = inputFile; // 同じファイルに上書き

try {
  console.log(`Reading file: ${inputFile}`);
  const xmlContent = fs.readFileSync(inputFile, 'utf-8');

  console.log('Adding chords to Hanon exercises...');
  const result = addHanonChords(xmlContent);

  console.log(`Writing file: ${outputFile}`);
  fs.writeFileSync(outputFile, result, 'utf-8');

  console.log('✓ Successfully added chords to Hanon exercises!');
} catch (error) {
  console.error('Error processing file:', error);
  process.exit(1);
}
