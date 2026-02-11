"use client";

import { midiToStaffPosition, type StaffNote } from "../lib/noteUtils";

interface StaffNoteSVGProps {
  note: StaffNote;
  feedbackState?: "none" | "correct" | "incorrect";
  showNoteName?: boolean;
  darkMode?: boolean;
}

/**
 * VexFlowのoutline文字列をSVG pathのd属性に変換する
 * VexFlow format: m=moveTo, l=lineTo, q=quadratic, b=bezier（座標はスペース区切り）
 * scaleYは反転（楽譜座標系→SVG座標系）
 */
function vexOutlineToSvgPath(
  outline: string,
  originX: number,
  originY: number,
  scaleX: number,
  scaleY: number,
): string {
  const tokens = outline.split(" ");
  let i = 0;
  const parts: string[] = [];

  function nextX() {
    return originX + Number(tokens[i++]) * scaleX;
  }
  function nextY() {
    return originY + Number(tokens[i++]) * scaleY;
  }

  while (i < tokens.length) {
    const cmd = tokens[i++];
    switch (cmd) {
      case "m":
        parts.push(`M${nextX()} ${nextY()}`);
        break;
      case "l":
        parts.push(`L${nextX()} ${nextY()}`);
        break;
      case "q": {
        const qx1 = nextX(),
          qy1 = nextY();
        const qx = nextX(),
          qy = nextY();
        parts.push(`Q${qx1} ${qy1} ${qx} ${qy}`);
        break;
      }
      case "b": {
        // VexFlow: b ctrl1x ctrl1y ctrl2x ctrl2y endx endy
        // but processOutline reads: endx endy ctrl1x ctrl1y ctrl2x ctrl2y
        // Actually looking at glyph.js: x=nextX() y=nextY() then b(nextX(),nextY(),nextX(),nextY(),x,y)
        // So: first pair is END point, next two pairs are control points
        // Wait, re-reading: outlineFns.b(nextX(), nextY(), nextX(), nextY(), x, y)
        // where x,y were read first. So the call is b(cp1x, cp1y, cp2x, cp2y, endX, endY)
        // with endX,endY = first pair read.
        // NO: x = nextX(); y = nextY(); outlineFns.b(nextX(), nextY(), nextX(), nextY(), x, y);
        // So b is called with: (arg1=3rdVal, arg2=4thVal, arg3=5thVal, arg4=6thVal, arg5=1stVal, arg6=2ndVal)
        // In canvas: ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        // So: cp1=3rd,4th cp2=5th,6th end=1st,2nd
        const endX = nextX(),
          endY = nextY();
        const cp1x = nextX(),
          cp1y = nextY();
        const cp2x = nextX(),
          cp2y = nextY();
        parts.push(`C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${endX} ${endY}`);
        break;
      }
      default:
        break;
    }
  }
  return parts.join(" ");
}

// VexFlow glyph outlines（from vexflow/src/fonts/vexflow_font.js）
// resolution = 1000

const VEXFLOW_GLYPHS = {
  // ト音記号 (v83)
  trebleClef: {
    outline:
      "m 488 1499 b 495 1500 490 1500 492 1500 b 541 1465 507 1500 521 1490 b 679 1078 622 1372 679 1210 b 677 1050 679 1068 677 1060 b 477 642 668 893 604 764 l 443 609 l 431 596 l 431 592 l 438 562 l 449 508 l 460 458 b 481 355 475 390 481 355 b 481 355 481 355 481 355 b 490 356 481 355 485 355 b 528 358 495 356 511 358 b 558 356 540 358 552 356 b 839 95 699 338 808 237 b 847 22 845 72 847 47 b 631 -303 847 -113 766 -242 b 620 -309 623 -308 620 -309 l 620 -310 b 631 -359 620 -310 626 -333 l 646 -435 l 660 -496 b 672 -588 668 -535 672 -563 b 664 -653 672 -610 669 -630 b 383 -875 630 -792 509 -875 b 201 -810 321 -875 257 -855 b 129 -680 151 -768 129 -730 b 274 -530 129 -592 200 -530 b 351 -553 300 -530 326 -538 b 412 -669 393 -582 412 -626 b 287 -805 412 -735 366 -800 l 279 -805 l 285 -809 b 383 -830 318 -823 351 -830 b 586 -718 464 -830 540 -789 b 626 -584 612 -678 626 -631 b 619 -528 626 -566 623 -548 b 612 -495 619 -526 616 -510 b 577 -324 590 -387 577 -324 b 577 -324 577 -324 577 -324 b 568 -326 575 -324 571 -324 b 528 -334 558 -328 537 -333 b 465 -338 506 -337 485 -338 b 24 -11 269 -338 87 -206 b -1 145 8 41 -1 93 b 96 442 -1 249 32 351 b 322 714 166 541 236 626 l 352 745 l 345 782 l 332 843 l 315 921 b 303 984 310 950 304 978 b 295 1082 298 1017 295 1049 b 413 1426 295 1208 336 1329 b 488 1499 436 1456 477 1496 m 549 1301 b 541 1301 547 1301 544 1301 b 411 1207 500 1301 447 1263 b 355 1004 374 1152 355 1079 b 359 942 355 984 356 963 b 371 881 362 927 363 917 l 385 818 b 392 782 389 799 392 784 l 392 782 b 434 828 393 782 424 816 b 607 1165 534 941 594 1060 b 608 1193 608 1175 608 1183 b 597 1270 608 1224 604 1254 b 549 1301 589 1286 571 1299 m 398 528 b 393 555 396 542 393 553 b 392 555 393 555 393 555 b 317 470 390 555 347 505 b 190 298 266 408 212 334 b 127 70 148 227 127 148 b 155 -77 127 19 137 -30 b 468 -303 209 -216 333 -303 b 519 -299 484 -303 502 -302 b 568 -284 541 -295 568 -287 l 568 -284 b 563 -263 568 -284 566 -274 l 534 -120 l 511 -13 l 496 61 l 480 133 b 469 187 472 176 469 187 b 468 188 469 187 469 188 b 416 162 462 188 430 172 b 337 13 364 126 337 69 b 413 -124 337 -40 363 -93 b 428 -144 424 -131 428 -137 b 428 -149 428 -145 428 -148 b 409 -166 426 -161 419 -166 b 394 -162 405 -166 400 -165 b 240 77 302 -122 240 -27 l 240 77 b 430 342 240 197 315 301 l 436 344 l 426 394 l 398 528 m 548 194 b 526 195 540 195 532 195 b 519 195 524 195 521 195 l 514 195 l 518 177 l 539 79 l 552 15 l 566 -48 l 594 -187 l 605 -240 b 612 -266 609 -254 611 -266 b 612 -266 612 -266 612 -266 b 641 -248 613 -266 630 -256 b 744 -98 692 -212 730 -156 b 751 -40 749 -79 751 -59 b 548 194 751 76 665 181",
    xMin: -1.359375,
    xMax: 847.96875,
  },
  // ヘ音記号 (v79)
  bassClef: {
    outline:
      "m 307 349 b 332 351 315 351 323 351 b 443 340 367 351 408 347 b 741 47 607 306 720 195 b 744 0 743 31 744 16 b 660 -303 744 -90 713 -206 b 28 -755 534 -531 304 -695 b 14 -756 23 -755 19 -756 b -1 -741 4 -756 -1 -750 b 21 -720 -1 -731 1 -728 b 567 -56 337 -601 548 -344 b 568 -11 568 -41 568 -24 b 442 285 568 129 525 233 b 325 319 406 308 367 319 b 93 177 232 319 137 266 b 84 154 91 170 84 155 b 84 154 84 154 84 154 b 88 156 84 154 85 155 b 159 177 110 170 134 177 b 257 134 194 177 231 162 b 294 41 281 108 294 73 b 171 -97 294 -24 246 -90 b 156 -98 166 -97 161 -98 b 6 74 73 -98 6 -22 b 6 80 6 76 6 79 b 307 349 10 223 141 340 m 839 215 b 845 216 841 216 842 216 b 862 213 852 216 860 215 b 899 163 887 206 899 184 b 872 117 899 145 890 127 b 847 111 865 112 856 111 b 808 130 833 111 818 117 b 796 162 800 140 796 151 b 839 215 796 187 812 212 m 839 -112 b 845 -112 841 -112 842 -112 b 862 -115 852 -112 860 -113 b 899 -165 887 -122 899 -144 b 872 -210 899 -183 890 -201 b 847 -217 865 -215 856 -217 b 808 -198 833 -217 818 -210 b 796 -165 800 -188 796 -177 b 839 -112 796 -140 812 -116",
    xMin: -1.359375,
    xMax: 899.703125,
  },
  // 四分音符ヘッド (vb)
  noteheadBlack: {
    outline:
      "m 262 186 b 273 186 266 186 272 186 b 274 186 273 186 274 186 b 285 186 274 186 280 186 b 428 48 375 181 428 122 b 386 -68 428 12 416 -29 b 155 -187 329 -145 236 -187 b 12 -111 92 -187 38 -162 b 0 -51 4 -91 0 -72 b 262 186 0 58 122 179",
    xMin: 0,
    xMax: 428.75,
  },
  // シャープ (v18)
  accidentalSharp: {
    outline:
      "m 217 535 b 225 537 220 537 221 537 b 245 524 235 537 242 533 l 246 521 l 247 390 l 247 258 l 273 265 b 306 270 288 269 299 270 b 322 259 315 270 319 267 b 323 208 323 256 323 233 b 322 158 323 184 323 159 b 288 140 318 148 315 147 b 247 130 254 131 247 130 b 247 65 247 130 247 104 b 247 20 247 51 247 36 l 247 -88 l 273 -81 b 306 -76 289 -77 299 -76 b 318 -81 311 -76 315 -77 b 323 -123 323 -87 323 -86 l 323 -138 l 323 -154 b 318 -195 323 -191 323 -190 b 269 -210 314 -199 315 -199 b 249 -216 259 -213 250 -216 l 247 -216 l 247 -349 l 246 -483 l 245 -487 b 225 -499 242 -495 234 -499 b 206 -487 219 -499 210 -495 l 205 -483 l 205 -355 l 205 -227 l 204 -227 l 181 -233 l 138 -244 b 117 -249 127 -247 117 -249 b 115 -385 115 -249 115 -256 l 115 -523 l 114 -526 b 95 -538 110 -534 102 -538 b 74 -526 87 -538 78 -534 l 73 -523 l 73 -391 b 72 -260 73 -269 73 -260 b 72 -260 72 -260 72 -260 b 19 -273 61 -263 23 -273 b 0 -260 10 -273 4 -267 b 0 -209 0 -256 0 -256 l 0 -162 l 1 -158 b 61 -134 5 -148 5 -148 l 73 -131 l 73 -22 b 72 86 73 79 73 86 b 72 86 72 86 72 86 b 19 74 61 83 23 74 b 0 86 10 74 4 79 b 0 137 0 90 0 90 l 0 184 l 1 188 b 61 212 5 198 5 198 l 73 215 l 73 348 l 73 481 l 74 485 b 95 498 78 492 87 498 b 103 495 98 498 100 496 b 114 485 107 494 111 489 l 115 481 l 115 353 l 115 226 l 121 226 b 159 235 123 227 141 231 l 198 247 l 205 248 l 205 384 l 205 521 l 206 524 b 217 535 209 528 212 533 m 205 9 b 205 119 205 70 205 119 l 205 119 b 182 113 204 119 194 116 l 138 102 b 117 97 127 99 117 97 b 115 -12 115 97 115 91 l 115 -122 l 121 -120 b 159 -111 123 -119 141 -115 l 198 -101 l 205 -98 l 205 9",
    xMin: 0,
    xMax: 323.9375,
  },
  // フラット (v44)
  accidentalFlat: {
    outline:
      "m -8 631 b -1 632 -6 632 -4 632 b 19 620 8 632 16 628 b 20 383 20 616 20 616 l 20 148 l 21 151 b 137 199 59 183 99 199 b 182 191 152 199 167 197 b 251 84 227 176 251 134 b 228 0 251 58 243 29 b 100 -142 206 -40 178 -72 l 23 -215 b 0 -229 9 -229 6 -229 b -20 -216 -9 -229 -17 -224 l -21 -212 l -21 201 l -21 616 l -20 620 b -8 631 -17 624 -13 630 m 110 131 b 96 133 106 133 100 133 b 89 133 93 133 91 133 b 24 87 63 129 40 113 l 20 80 l 20 -37 l 20 -156 l 23 -152 b 144 81 96 -72 144 20 l 144 83 b 110 131 144 113 134 126",
    xMin: -21.78125,
    xMax: 251.8125,
  },
};

const VEXFLOW_RESOLUTION = 1000;

/**
 * VexFlowグリフをSVGパスに変換するヘルパー
 * point: フォントサイズ（pt相当）
 */
function getGlyphPath(
  glyph: { outline: string },
  x: number,
  y: number,
  point: number,
): string {
  const scale = (point * 72.0) / (VEXFLOW_RESOLUTION * 100.0);
  return vexOutlineToSvgPath(glyph.outline, x, y, scale, -scale);
}

/**
 * 五線譜上に1つの音符を表示するSVGコンポーネント
 * 音部記号・音符・臨時記号にVexFlowのグリフを使用
 */
export default function StaffNoteSVG({
  note,
  feedbackState = "none",
  showNoteName = false,
  darkMode = false,
}: StaffNoteSVGProps) {
  const staffPosition = midiToStaffPosition(note.midi, note.clef);

  // SVG座標系
  const svgWidth = 240;
  const svgHeight = 160;
  const staffTop = 45; // 上第1線のy座標
  const lineSpacing = 14; // 線間の距離
  const staffLines = [0, 1, 2, 3, 4]; // 5本の線（上から0-4）

  // 各線のy座標（上から下へ）
  const lineY = (lineIndex: number) => staffTop + lineIndex * lineSpacing;

  // 下第1線のy座標 = lineY(4) = staffTop + 4 * lineSpacing
  const bottomLineY = lineY(4);

  // staffPosition=0が下第1線、1ステップ上がるごとにlineSpacing/2だけ上へ
  const noteY = bottomLineY - staffPosition * (lineSpacing / 2);

  // 音符のx位置
  const noteX = 155;

  // 音符の色
  const lineColor = darkMode ? "#d0d0d0" : "#333";
  const noteColor =
    feedbackState === "correct"
      ? "#4CAF50"
      : feedbackState === "incorrect"
        ? "#FF4444"
        : darkMode
          ? "#d0d0d0"
          : "#333";

  // 加線（レジャーライン）の計算
  const ledgerLines: number[] = [];
  if (staffPosition <= -2) {
    for (let pos = -2; pos >= staffPosition; pos -= 2) {
      ledgerLines.push(bottomLineY - pos * (lineSpacing / 2));
    }
  }
  if (staffPosition === 0) {
    ledgerLines.push(bottomLineY);
  }
  if (staffPosition >= 10) {
    for (let pos = 10; pos <= staffPosition; pos += 2) {
      ledgerLines.push(bottomLineY - pos * (lineSpacing / 2));
    }
  }

  // VexFlowグリフのパス生成
  // ト音記号: point=38で第3線（B4）中心あたりに配置
  const trebleClefPath = getGlyphPath(
    VEXFLOW_GLYPHS.trebleClef,
    38,
    lineY(3),
    57,
  );
  // ヘ音記号: point=32で第2線（D3）あたり
  const bassClefPath = getGlyphPath(VEXFLOW_GLYPHS.bassClef, 38, lineY(1), 57);

  // 音符ヘッドのサイズ（point）
  // noteheadBlackの座標範囲は373単位。線間(14px)にフィットさせるにはpoint≈52が必要
  const notePoint = 52;
  const noteScale = (notePoint * 72.0) / (VEXFLOW_RESOLUTION * 100.0);
  // ノートヘッドの端の位置（ステム接続用）
  const noteXOffset = -7; // originXのオフセット（ノートヘッドを中央寄せ）
  const noteRightEdge = noteXOffset + 428 * noteScale - 2; // ノートヘッド右端から2px内側
  const noteLeftEdge = noteXOffset + 1; // ノートヘッド左端から2px内側
  const noteheadPath = getGlyphPath(
    VEXFLOW_GLYPHS.noteheadBlack,
    noteX + noteXOffset,
    noteY,
    notePoint,
  );

  // 臨時記号のパス
  const accidentalPath =
    note.alter === 1
      ? getGlyphPath(VEXFLOW_GLYPHS.accidentalSharp, noteX - 20, noteY, 22)
      : note.alter === -1
        ? getGlyphPath(VEXFLOW_GLYPHS.accidentalFlat, noteX - 18, noteY, 22)
        : null;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      style={{ maxWidth: "400px", maxHeight: "280px" }}
    >
      {/* 五線 */}
      {staffLines.map((i) => (
        <line
          key={`line-${i}`}
          x1={30}
          y1={lineY(i)}
          x2={svgWidth - 15}
          y2={lineY(i)}
          stroke={lineColor}
          strokeWidth={1}
        />
      ))}

      {/* 音部記号（VexFlowグリフ） */}
      <path
        d={note.clef === "treble" ? trebleClefPath : bassClefPath}
        fill={lineColor}
      />

      {/* 加線（レジャーライン） */}
      {ledgerLines.map((y, i) => (
        <line
          key={`ledger-${i}`}
          x1={noteX - 18}
          y1={y}
          x2={noteX + 18}
          y2={y}
          stroke={lineColor}
          strokeWidth={1}
        />
      ))}

      {/* 音符ヘッド（VexFlowグリフ） */}
      <path
        d={noteheadPath}
        fill={noteColor}
        style={{ transition: "fill 0.2s" }}
      />

      {/* 符幹（ステム） */}
      {staffPosition <= 4 ? (
        <line
          x1={noteX + noteRightEdge}
          y1={noteY}
          x2={noteX + noteRightEdge}
          y2={noteY - 40}
          stroke={noteColor}
          strokeWidth={1.5}
          style={{ transition: "stroke 0.2s" }}
        />
      ) : (
        <line
          x1={noteX + noteLeftEdge}
          y1={noteY}
          x2={noteX + noteLeftEdge}
          y2={noteY + 40}
          stroke={noteColor}
          strokeWidth={1.5}
          style={{ transition: "stroke 0.2s" }}
        />
      )}

      {/* 臨時記号（VexFlowグリフ） */}
      {accidentalPath && (
        <path
          d={accidentalPath}
          fill={noteColor}
          style={{ transition: "fill 0.2s" }}
        />
      )}

      {/* 音名表示（フィードバック時） */}
      {showNoteName && (
        <text
          x={noteX}
          y={svgHeight - 8}
          fontSize="16"
          fontWeight="bold"
          fill={noteColor}
          textAnchor="middle"
          style={{ transition: "fill 0.2s" }}
        >
          {note.step}
          {note.alter === 1 ? "♯" : note.alter === -1 ? "♭" : ""}
          {note.octave}
        </text>
      )}
    </svg>
  );
}
