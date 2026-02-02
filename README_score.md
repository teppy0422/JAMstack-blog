# Web楽譜追従アプリ 仕様書

## 1. 目的

- MusicXML形式の楽譜をWebブラウザで表示
- 実際の演奏入力（MIDI）に応じて楽譜上の現在位置を自動ハイライト
- ハイライト方式は OpenSheetMusicDisplay（OSMD）のカーソル方式
- 次に弾くピアノ鍵盤を画面下部に表示
- Pythonは使用せず、Web（Next.js）のみで完結
- 最終的に MacBook / Androidタブレットでピアノの上に置いて使用

## 2. 技術スタック

- フレームワーク: Next.js（App Router）
- 言語: TypeScript
- 楽譜描画: OpenSheetMusicDisplay (OSMD)
- 入力: Web MIDI API
- 実行環境: Chrome（Mac / Android）

## 3. 基本方針

- OSMDは必ずクライアントサイドで実行
- SSRではOSMDを読み込まない (`use client` または `dynamic import { ssr: false }` を使用)
- カーソル方式のみを採用
  - 音高一致・音符単位の塗りつぶしは行わない
  - `osmd.cursor.next()` による進行のみ

## 4. ディレクトリ構成（例）

app/
├─ page.tsx
├─ score/
│ └─ page.tsx // 楽譜表示ページ
└─ components/
├─ SheetMusic.tsx // OSMD描画コンポーネント
└─ MidiListener.tsx // MIDI入力処理
public/
└─ scores/
└─ sample.musicxml

## 5. OSMD楽譜表示仕様

- バックエンド: SVG
- ページ形式: Endless（スクロール型）
- 自動リサイズ: 有効
- 初期化例:
  new OpenSheetMusicDisplay(container, {
  autoResize: true,
  backend: "svg",
  drawingParameters: "compacttight",
  pageFormat: "Endless"
  });
- 楽譜ロード: `/public/scores/*.musicxml`
- 初回ロード後に `render()` を必ず実行

## 6. カーソル仕様

- OSMD標準カーソルを使用
- 初期表示時にカーソルを表示: `osmd.cursor.show()`
- MIDI入力トリガーでカーソル進行: `osmd.cursor.next()`
- 小節単位・拍単位の厳密制御は行わない

## 7. MIDI入力仕様

- API: Web MIDI API
- 対応デバイス: USB / Bluetooth MIDIキーボード、電子ピアノ（例: KORG SV-2S）
- 動作仕様:
  - 任意の Note On イベントでカーソルを1つ進める
  - 音高・チャンネル・ベロシティは無視
  - 和音・ミスタッチがあっても必ず1ステップ進行
- 実装例:
  navigator.requestMIDIAccess().then(access => {
  for (const input of access.inputs.values()) {
  input.onmidimessage = (e) => {
  const [status, note, velocity] = e.data;
  const isNoteOn = (status & 0xf0) === 0x90 && velocity > 0;
  if (isNoteOn) {
  osmd.cursor.next();
  }
  };
  }
  });
- KORG SV-2S からの接続:
  - USB端子で直接MacBook / Androidに接続可能
  - USB OTG対応のAndroidタブレットならUSBケーブル1本で接続
  - DINタイプMIDI端子も使用可能（MIDI OUT → USB-MIDIインターフェイス → PC/Android）

## 8. 鍵盤ガイド表示仕様

- 表示位置: 画面下部固定（高さ 15〜25%）
- 表示内容:
  - カーソル位置の次に弾く音符の鍵盤を可視化
  - 白鍵・黒鍵を矩形で表現
  - 音高対応（C4, D#4など）
- 色ルール:
  - 次に弾く鍵盤: 強調色（青 / 緑）
  - 和音: 複数鍵盤同時表示
  - 非対象: 通常色（白 / 黒）
- 実装イメージ:
  const cursor = osmd.cursor;
  const notes = cursor.Iterator.CurrentVoiceEntries;
  const pitches = notes.flatMap(v =>
  v.notes.map(n => ({
  step: n.sourceNote.Pitch.Step,
  octave: n.sourceNote.Pitch.Octave,
  alter: n.sourceNote.Pitch.Alter
  }))
  );
- 音符→MIDI番号変換:
  midi = (octave + 1) \* 12 + semitone

## 9. UI/UX

- 横画面固定
- タップ操作を極力減らす
- 高コントラスト（白背景＋黒譜面）
- カーソル色は薄い黄色 or 水色
- ズーム調整機能あり
- フルスクリーン利用を前提

## 10. 非対応項目

- マイク音声からの音高解析
- PDF / PNG 楽譜の直接読み込み
- 音符単位の精密なハイライト
- テンポ推定・DTW・HMM等の高度なスコアフォロー
- 指番号・左右手色分け
- 装飾音表示・アルペジオ分解
- Python / サーバーサイド処理

## 11. 開発優先順位

1. ✅ MusicXMLをOSMDで表示
2. ✅ カーソルの手動制御
3. ⬜ MIDI入力でカーソルが進む
4. ✅ 次に弾く鍵盤ガイド表示
5. ⬜ タブレットでの視認性調整

## 12. 完成の定義

- ✅ MusicXMLを選択して表示できる
- ⬜ ピアノ（MIDI）を弾くとカーソルが進む
- ✅ カーソル位置に応じて鍵盤ガイドが更新される
- ⬜ MacBook / Androidタブレットで安定動作
- ✅ Python不要・Webのみで完結

---

## 実装状況（2026年1月）

### 完了した機能

- MusicXML表示（twinkle.musicxml, Billie's_Bounce.musicxml, merry-go-round-of-life.musicxml）
- 楽譜選択ドロップダウン
- 手動カーソル操作（次へ/前へ/リセット）ボタン
- 現在位置の音符をハイライト表示（赤色）
- ピアノ鍵盤ガイドの表示（現在位置の音符を表示）
- 音符情報の抽出とMIDI番号への変換
- 鍵盤範囲の自動調整（楽譜の音域に合わせて表示範囲を自動設定）
- ヘッダーにカバアイコン表示
- OSMDカーソルの可視化（緑色半透明カーソル）

### 技術的な実装詳細

#### OpenSheetMusicDisplay (OSMD)

- 公式GitHub: https://github.com/opensheetmusicdisplay/opensheetmusicdisplay
- デモページ: https://opensheetmusicdisplay.github.io/demo/
- バージョン: v1.9.4
- カーソルAPI: `osmd.cursor.show()`, `osmd.cursor.next()`, `osmd.cursor.previous()`, `osmd.cursor.reset()`, `osmd.cursor.update()`

#### ファイル構成

```
app/
├── score/
│   ├── page.tsx                    # メインページ（楽譜選択とコントロール）
│   └── score.css                   # OSMDカーソルのスタイル定義
└── components/
    ├── SheetMusic.tsx              # 楽譜表示コンポーネント（OSMD使用）
    └── PianoKeyboard.tsx           # ピアノ鍵盤表示コンポーネント

public/
└── scores/
    ├── twinkle.musicxml                    # きらきら星
    ├── Billie's_Bounce.musicxml            # 枯葉
    └── merry-go-round-of-life.musicxml     # 人生のメリーゴーランド
```

実装の工夫点:

- **水平方向**: カーソルと重なる音符をすべて抽出
- **垂直方向**: 最も近い音符を基準に、一定範囲内（80px）の音符のみをグループ化
  - これにより2段譜（グランドスタッフ）で高音部と低音部が同時に選択されないように制御
  - 和音は同じ段内であれば複数同時にハイライト可能

コード例:

```typescript
const highlightCurrentNotes = () => {
  clearHighlights();

  const cursorRect = cursorElement.getBoundingClientRect();
  const noteheads = containerRef.current.querySelectorAll(
    '[class*="vf-notehead"]',
  );

  // 1. 水平方向でカーソルと重なる音符を抽出
  const horizontalCandidates = [];
  noteheads.forEach((notehead) => {
    const noteRect = notehead.getBoundingClientRect();
    const noteCenterX = noteRect.left + noteRect.width / 2;
    if (noteCenterX >= cursorRect.left && noteCenterX <= cursorRect.right) {
      horizontalCandidates.push({ element: notehead, rect: noteRect });
    }
  });

  // 2. 垂直方向で最も近い音符を基準として選択
  let anchorCandidate = horizontalCandidates[0];
  let minVerticalDistance = Math.abs(anchorCandidate.rect.top - cursorRect.top);

  for (let i = 1; i < horizontalCandidates.length; i++) {
    const distance = Math.abs(
      horizontalCandidates[i].rect.top - cursorRect.top,
    );
    if (distance < minVerticalDistance) {
      minVerticalDistance = distance;
      anchorCandidate = horizontalCandidates[i];
    }
  }

  // 3. 基準音符から一定範囲内の音符のみをハイライト
  const anchorTop = anchorCandidate.rect.top;
  const verticalClusterTolerance = 80;

  horizontalCandidates.forEach((candidate) => {
    if (Math.abs(candidate.rect.top - anchorTop) < verticalClusterTolerance) {
      highlightNoteAndStem(candidate.element);
    }
  });
};
```

#### 音符データ取得

OSMDの内部構造から音符情報を抽出。複数のフォールバック方式を実装:

```typescript
const getCurrentNotes = () => {
  const notes = [];

  // 方法1: SourceMeasures から取得（最も確実）
  const musicSheet = iterator.musicSheet;
  if (musicSheet?.SourceMeasures) {
    const sourceMeasure =
      musicSheet.SourceMeasures[iterator.currentMeasureIndex];
    for (const staffEntry of sourceMeasure.VerticalSourceStaffEntryContainers) {
      for (const sourceStaffEntry of staffEntry.StaffEntries) {
        const entryTimestamp = sourceStaffEntry.Timestamp;
        const voiceEntries = sourceStaffEntry.VoiceEntries;

        // 重要: 持続音の問題を解決
        // entryStart === currentTimestamp で完全一致のみ検出
        // これにより全音符などが毎拍検出される問題を解消
        if (entryStart === currentTimestamp.RealValue) {
          for (const note of voiceEntry.Notes) {
            const pitch = note.Pitch;
            const semitone = pitch.halfTone % 12;
            const octave = Math.floor(pitch.halfTone / 12);
            notes.push({ step, octave, alter: pitch.Alter || 0 });
          }
        }
      }
    }
  }

  // 方法2: graphicalMeasure から取得（フォールバック）
  if (notes.length === 0 && graphicalMeasure?.staffEntries) {
    // ...
  }

  // 方法3: CurrentVoiceEntries から取得（最終フォールバック）
  if (notes.length === 0 && iterator.CurrentVoiceEntries) {
    // ...
  }

  return notes;
};
```

**重要な修正点:**

- **持続音の問題を解決**: `entryStart === currentTimestamp` で完全一致のみ検出
  - 修正前: `entryStart <= currentTimestamp && currentTimestamp < entryEnd`
  - 問題: 全音符などの持続音が毎拍検出されていた
  - 解決: タイムスタンプが完全一致する音符のみを検出することで、音符の開始時のみハイライト

#### MIDI番号の計算

OSMDの `halfTone` 値から正しいMIDI番号への変換:

```typescript
// MIDI番号 = (オクターブ + 1) × 12 + 半音位置 + 臨時記号
const semitone = pitch.halfTone % 12;
const octave = Math.floor(pitch.halfTone / 12);
const midi = (octave + 1) * 12 + semitone + (pitch.Alter || 0);
```

例:

- C4 (中央のド) = (4 + 1) × 12 + 0 = 60
- A4 (ラ) = (4 + 1) × 12 + 9 = 69
- C#5 = (5 + 1) × 12 + 0 + 1 = 73

**重要な修正点:**

- **範囲計算の問題を解決**: OSMDの `halfTone` 値を直接MIDI番号として使用していた問題を修正
  - 修正前: `minMidi = pitch.halfTone` （誤り）
  - 修正後: 上記の正しい変換式を使用

#### 鍵盤範囲の自動調整

楽譜全体をスキャンして音域を検出し、表示範囲を自動調整:

```typescript
// 楽譜全体から最高音と最低音を検出
let minMidi = Infinity;
let maxMidi = -Infinity;

for (const instrument of sheet.Instruments) {
  for (const voice of instrument.Voices) {
    for (const voiceEntry of voice.VoiceEntries) {
      if (voiceEntry?.Notes) {
        for (const note of voiceEntry.Notes) {
          const pitch = note.Pitch;
          if (pitch?.halfTone !== undefined) {
            const semitone = pitch.halfTone % 12;
            const octave = Math.floor(pitch.halfTone / 12);
            const midi = (octave + 1) * 12 + semitone + (pitch.Alter || 0);
            minMidi = Math.min(minMidi, midi);
            maxMidi = Math.max(maxMidi, midi);
          }
        }
      }
    }
  }
}

// 最低音をCから開始、最高音をBで終了するように調整
const minSemitone = minMidi % 12;
if (minSemitone !== 0) {
  minMidi = minMidi - minSemitone;
}

const maxSemitone = maxMidi % 12;
if (maxSemitone !== 11) {
  maxMidi = maxMidi + (11 - maxSemitone);
}
```

この調整により:

- 最低音がC以外の場合、1つ下のCまで範囲を拡張
- 最高音がB以外の場合、次のBまで範囲を拡張
- 結果として常にC〜Bのオクターブ境界で範囲が決定される

#### OSMDカーソルの可視化

OSMDのデフォルトカーソルは1px幅のIMG要素でほぼ見えないため、CSSで可視化:

**実装方法:**

1. `app/score/score.css` でカーソルスタイルを定義:
   ```css
   .osmdCursor {
     background-color: #33e02f !important;  /* 緑色 */
     opacity: 0.5 !important;                /* 半透明 */
     width: 30px !important;                 /* 幅30px */
     display: block !important;
     visibility: visible !important;
     aspect-ratio: none !important;          /* アスペクト比の自動計算を無効化 */
     height: attr(height px) !important;     /* HTML属性のheightを読み取る */
   }
   ```

2. `SheetMusic.tsx` でカーソル要素にクラスを追加:
   ```typescript
   const cursorElement = (osmd.cursor as any).cursorElement;
   if (cursorElement) {
     cursorElement.classList.add("osmdCursor");
   }
   ```

**技術的ポイント:**

- `height: attr(height px)` を使用してHTML属性の高さ値をCSSで読み取る
  - OSMDが動的に設定する `<img height="251" width="30" ...>` の高さを利用
  - これにより各段の高さに自動対応
- `aspect-ratio: none` で画像のアスペクト比計算を無効化
  - これがないとwidth指定時に高さが1pxになってしまう

**参考:**
- OSMD公式デモ: https://opensheetmusicdisplay.github.io/demo/ の「Cursor」セクション
- カーソルは初期状態で非表示なので `osmd.cursor.show()` で表示する必要がある

**重要な知見: OSMD要素のスタイル制御はCSSクラスが最も確実**

OSMD要素の見た目を動的に変更する際は、JavaScriptのインラインスタイルよりもCSSクラスの追加/削除が有効:

```css
/* カーソルを非表示にするクラス */
.osmdCursor.cursor-hidden {
  display: none !important;
}
```

```typescript
// JavaScript側での制御
cursorElement.classList.add("cursor-hidden");    // 非表示
cursorElement.classList.remove("cursor-hidden"); // 表示
```

理由:
- OSMDのCSSルールは `!important` を多用しているため、インラインスタイルでは上書きできない
- CSSクラスで `!important` を使うことで確実に上書き可能
- 状態管理もクラスの有無で明確に判断できる

応用例:
- ローディング中のカーソル非表示
- ズーム変更時の一時的な非表示
- 状態に応じた見た目の切り替え

#### ピアノ鍵盤の表示

現在位置の音符に対応する鍵盤をハイライト表示:

```typescript
// 音符をMIDI番号に変換
const noteToMidi = (step: string, octave: number, alter: number): number => {
  const stepToSemitone = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const semitone = stepToSemitone[step];
  return (octave + 1) * 12 + semitone + alter;
};

// 黒鍵の判定
const isBlackKey = (midi: number): boolean => {
  const semitone = midi % 12;
  return [1, 3, 6, 8, 10].includes(semitone);  // C#, D#, F#, G#, A#
};

// 鍵盤の描画
for (let midi = startMidi; midi <= endMidi; midi++) {
  const isHighlighted = highlightedMidis.includes(midi);
  const isBlack = isBlackKey(midi);

  if (!isBlack) {
    // 白鍵: ハイライト時は緑色 (#4CAF50)
    whiteKeys.push(<div style={{ backgroundColor: isHighlighted ? "#4CAF50" : "#ffffff" }}>
      {isHighlighted && midiToNoteName(midi)}
    </div>);
  } else {
    // 黒鍵: ハイライト時は青色 (#2196F3)
    blackKeys.push(<div style={{ backgroundColor: isHighlighted ? "#2196F3" : "#000" }}>
      {isHighlighted && midiToNoteName(midi)}
    </div>);
  }
}
```

### 解決した主な問題

1. **鍵盤範囲がC4を含まない問題**
   - 原因: OSMDの`halfTone`値を直接MIDI番号として使用
   - 解決: 正しい変換式 `(octave + 1) * 12 + semitone + alter` を実装

2. **最初の小節で持続音が毎拍表示される問題**
   - 原因: 持続音の判定が `entryStart <= currentTimestamp < entryEnd`
   - 解決: `entryStart === currentTimestamp` に変更し、音符開始時のみ検出

3. **2段譜で両手の音符が正しく表示されない問題**
   - 原因: CurrentVoiceEntriesが右手のみを返す
   - 解決: SourceMeasuresから全ボイスを取得する方式に変更

4. **範囲調整の不具合**
   - 原因: `maxMidi = maxOctave * 12 + 11` の計算ミス
   - 解決: `maxMidi = maxMidi + (11 - maxSemitone)` で正しく次のBまで拡張

5. **OSMDカーソルが見えない問題**
   - 原因: デフォルトカーソルは1px幅のIMG要素で視認困難
   - 解決: CSS `attr(height px)` でHTML属性を読み取り、緑色半透明(#33e02f, opacity 0.5)、幅30pxに設定
   - ポイント: `aspect-ratio: none` で画像の自動アスペクト比計算を無効化することで高さが正しく適用される

### 楽譜の追加方法

1. MusicXMLファイルを `public/scores/` に配置
2. `app/score/page.tsx` の `availableScores` 配列に追加:
   ```typescript
   const availableScores = [
     // 既存の楽譜...
     { id: "new-score", name: "表示名", path: "/scores/new-score.musicxml" },
   ];
   ```

### 次のステップ

1. **MIDI入力機能の実装** （最優先）
   - Web MIDI APIを使用
   - Note Onイベントで `osmd.cursor.next()` を呼び出し
   - デバイス選択UI（オプション）

2. **タブレット最適化**
   - レスポンシブデザイン調整
   - タッチ操作の改善
   - フルスクリーン対応

3. **追加機能の検討**
   - 自動スクロール
   - テンポ設定と自動再生
   - メトロノーム機能
   - 練習モード（正しい音を弾いたら次へ進む）
