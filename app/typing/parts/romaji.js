import { SimpleGrid } from "@chakra-ui/react";

const data = {
  " ": "　",
  "!": "！",
  '"': "”",
  "#": "＃",
  $: "＄",
  "%": "％",
  "&": "＆",
  "'": "’",
  "(": "（",
  ")": "）",
  "*": "＊",
  "+": "＋",
  ",": "、",
  "-": "ー",
  ".": "。",
  "/": "・",
  ":": "：",
  ";": "；",
  "<": "＜",
  "=": "＝",
  ">": "＞",
  "?": "？",
  "@": "＠",
  "[": "「",
  "\\": "￥",
  "]": "」",
  "^": "＾",
  _: "＿",
  "`": "‘",
  "{": "｛",
  "|": "｜",
  "}": "｝",
  "~": "～",
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  kkya: "っきゃ",
  kkyu: "っきゅ",
  kkyo: "っきょ",
  jja: "っじゃ",
  jju: "っじゅ",
  jjo: "っじょ",
  qqa: "っくぁ",
  qqi: "っくぃ",
  qqu: "っくぅ",
  qqwu: "っくぅ",
  qqe: "っくぇ",
  qqo: "っくぉ",
  ggya: "っぎゃ",
  ggyi: "っぎぃ",
  ggyu: "っぎゅ",
  ggye: "っぎぇ",
  ggyo: "っぎょ",
  ggwa: "っぐぁ",
  ggwi: "っぐぃ",
  ggwu: "っぐぅ",
  ggwe: "っぐぇ",
  ggwo: "っぐぉ",
  ssha: "っしゃ",
  sshu: "っしゅ",
  sshe: "っしぇ",
  ssho: "っしょ",
  ssya: "っしゃ",
  ssyu: "っしゅ",
  ssye: "っしぇ",
  ssyo: "っしょ",
  sswa: "っすぁ",
  sswi: "っすぃ",
  sswu: "っすぅ",
  sswe: "っすぇ",
  sswo: "っすぉ",
  jja: "っじゃ",
  zzya: "っじゃ",
  zzyi: "っじぃ",
  jju: "っじゅ",
  zzyu: "っじゅ",
  jje: "っじぇ",
  zzye: "っじぇ",
  jjo: "っじょ",
  zzyo: "っじょ",
  ccha: "っちゃ",
  ttya: "っちゃ",
  ccya: "っちゃ",
  ttyi: "っちぃ",
  cchu: "っちゅ",
  ttyu: "っちゅ",
  ccyu: "っちゅ",
  cche: "っちぇ",
  ttye: "っちぇ",
  ccho: "っちょ",
  ccyo: "っちょ",
  ttyo: "っちょ",
  ttha: "ってゃ",
  tthi: "ってぃ",
  tthu: "ってゅ",
  tthe: "ってぇ",
  ttho: "ってょ",
  ttwa: "っとぁ",
  ttwi: "っとぃ",
  ttwu: "っとぅ",
  ttwe: "っとぇ",
  ttwo: "っとぉ",
  ddya: "っぢゃ",
  ddyi: "っぢぃ",
  ddyu: "っぢゅ",
  ddye: "っぢぇ",
  ddyo: "っぢょ",
  ddha: "っでゃ",
  ddhi: "っでぃ",
  ddhu: "っでゅ",
  ddhe: "っでぇ",
  ddho: "っでょ",
  ddwa: "っどぁ",
  ddwi: "っどぃ",
  ddwu: "っどぅ",
  ddwe: "っどぇ",
  ddwo: "っどぉ",
  hhya: "っひゃ",
  hhyi: "っひぃ",
  hhyu: "っひゅ",
  hhye: "っひぇ",
  hhyo: "っひょ",
  ffa: "っふぁ",
  ffi: "っふぃ",
  ffyu: "っふゅ",
  ffe: "っふぇ",
  ffo: "っふぉ",
  bbya: "っびゃ",
  bbyi: "っびぃ",
  bbyu: "っびゅ",
  bbye: "っびぇ",
  bbyo: "っびょ",
  ppya: "っぴゃ",
  ppyi: "っぴぃ",
  ppyu: "っぴゅ",
  ppye: "っぴぇ",
  ppyo: "っぴょ",
  mmya: "っみゃ",
  mmyi: "っみぃ",
  mmyu: "っみゅ",
  mmye: "っみぇ",
  mmyo: "っみょ",
  rrya: "っりゃ",
  rryi: "っりぃ",
  rryu: "っりゅ",
  rrye: "っりぇ",
  rryo: "っりょ",
  wwha: "っうぁ",
  wwi: "っうぃ",
  wwe: "っうぇ",
  wwho: "っうぉ",
  bya: "びゃ",
  bye: "びぇ",
  byi: "びぃ",
  byo: "びょ",
  byu: "びゅ",
  cha: "ちゃ",
  che: "ちぇ",
  cho: "ちょ",
  chu: "ちゅ",
  cya: "ちゃ",
  cye: "ちぇ",
  cyi: "ちぃ",
  cyo: "ちょ",
  cyu: "ちゅ",
  dha: "でゃ",
  dhe: "でぇ",
  dhi: "でぃ",
  dho: "でょ",
  dhu: "でゅ",
  dwa: "どぁ",
  dwe: "どぇ",
  dwi: "どぃ",
  dwo: "どぉ",
  dwu: "どぅ",
  dya: "ぢゃ",
  dye: "ぢぇ",
  dyi: "ぢぃ",
  dyo: "ぢょ",
  dyu: "ぢゅ",
  fa: "ふぁ",
  fe: "ふぇ",
  fi: "ふぃ",
  fo: "ふぉ",
  fwa: "ふぁ",
  fwe: "ふぇ",
  fwi: "ふぃ",
  fwo: "ふぉ",
  fwu: "ふぅ",
  fya: "ふゃ",
  fye: "ふぇ",
  fyi: "ふぃ",
  fyo: "ふょ",
  fyu: "ふゅ",
  gwa: "ぐぁ",
  gwe: "ぐぇ",
  gwi: "ぐぃ",
  gwo: "ぐぉ",
  gwu: "ぐぅ",
  gya: "ぎゃ",
  gye: "ぎぇ",
  gyi: "ぎぃ",
  gyo: "ぎょ",
  gyu: "ぎゅ",
  hya: "ひゃ",
  hye: "ひぇ",
  hyi: "ひぃ",
  hyo: "ひょ",
  hyu: "ひゅ",
  ja: "じゃ",
  je: "じぇ",
  jo: "じょ",
  ju: "じゅ",
  jya: "じゃ",
  jye: "じぇ",
  jyi: "じぃ",
  jyo: "じょ",
  jyu: "じゅ",
  zya: "じゃ",
  zye: "じぇ",
  zyi: "じぃ",
  zyo: "じょ",
  zyu: "じゅ",
  kka: "っか",
  kki: "っき",
  kku: "っく",
  kke: "っけ",
  kko: "っこ",
  kwa: "くぁ",
  kya: "きゃ",
  kye: "きぇ",
  kyi: "きぃ",
  kyo: "きょ",
  kyu: "きゅ",
  mya: "みゃ",
  mye: "みぇ",
  myi: "みぃ",
  myo: "みょ",
  myu: "みゅ",
  nya: "にゃ",
  nye: "にぇ",
  nyi: "にぃ",
  nyo: "にょ",
  nyu: "にゅ",
  ppa: "っぱ",
  ppi: "っぴ",
  ppu: "っぷ",
  ppe: "っぺ",
  ppo: "っぽ",
  ssa: "っさ",
  ssi: "っし",
  ssu: "っす",
  sse: "っせ",
  sso: "っそ",
  tta: "った",
  tti: "っち",
  ttu: "っつ",
  tte: "って",
  tto: "っと",
  pya: "ぴゃ",
  pye: "ぴぇ",
  pyi: "ぴぃ",
  pyo: "ぴょ",
  pyu: "ぴゅ",
  qa: "くぁ",
  qe: "くぇ",
  qi: "くぃ",
  qo: "くぉ",
  qwa: "くぁ",
  qwe: "くぇ",
  qwi: "くぃ",
  qwo: "くぉ",
  qwu: "くぅ",
  qya: "くゃ",
  qye: "くぇ",
  qyi: "くぃ",
  qyo: "くょ",
  qyu: "くゅ",
  rya: "りゃ",
  rye: "りぇ",
  ryi: "りぃ",
  ryo: "りょ",
  ryu: "りゅ",
  sha: "しゃ",
  she: "しぇ",
  sho: "しょ",
  shu: "しゅ",
  sya: "しゃ",
  sye: "しぇ",
  syi: "しぃ",
  syo: "しょ",
  syu: "しゅ",
  swa: "すぁ",
  swe: "すぇ",
  swi: "すぃ",
  swo: "すぉ",
  swu: "すぅ",
  tha: "てゃ",
  the: "てぇ",
  thi: "てぃ",
  tho: "てょ",
  thu: "てゅ",
  tsa: "つぁ",
  tse: "つぇ",
  tsi: "つぃ",
  tso: "つぉ",
  twa: "とぁ",
  twe: "とぇ",
  twi: "とぃ",
  two: "とぉ",
  twu: "とぅ",
  tya: "ちゃ",
  tye: "ちぇ",
  tyi: "ちぃ",
  tyo: "ちょ",
  tyu: "ちゅ",
  va: "ゔぁ",
  ve: "ゔぇ",
  vi: "ゔぃ",
  vo: "ゔぉ",
  vya: "ゔゃ",
  vye: "ゔぇ",
  vyi: "ゔぃ",
  vyo: "ゔょ",
  vyu: "ゔゅ",
  we: "うぇ",
  wha: "うぁ",
  whe: "うぇ",
  whi: "うぃ",
  who: "うぉ",
  wi: "うぃ",
  a: "あ",
  ba: "ば",
  be: "べ",
  bi: "び",
  bo: "ぼ",
  bu: "ぶ",
  ti: "ち",
  chi: "ち",
  da: "だ",
  de: "で",
  di: "ぢ",
  do: "ど",
  du: "づ",
  e: "え",
  fu: "ふ",
  ga: "が",
  ge: "げ",
  gi: "ぎ",
  go: "ご",
  gu: "ぐ",
  ha: "は",
  he: "へ",
  hi: "ひ",
  ho: "ほ",
  hu: "ふ",
  i: "い",
  ji: "じ",
  ka: "か",
  ki: "き",
  ku: "く",
  ke: "け",
  ko: "こ",
  la: "ぁ",
  le: "ぇ",
  li: "ぃ",
  lka: "ヵ",
  lke: "ヶ",
  lo: "ぉ",
  lu: "ぅ",
  lwa: "ゎ",
  lya: "ゃ",
  lye: "ぇ",
  lyi: "ぃ",
  lyo: "ょ",
  lyu: "ゅ",
  ma: "ま",
  me: "め",
  mi: "み",
  mo: "も",
  mu: "む",
  na: "な",
  ne: "ね",
  ni: "に",
  nn: "ん",
  no: "の",
  nu: "ぬ",
  o: "お",
  pa: "ぱ",
  pe: "ぺ",
  pi: "ぴ",
  po: "ぽ",
  pu: "ぷ",
  qu: "く",
  ra: "ら",
  re: "れ",
  ri: "り",
  ro: "ろ",
  ru: "る",
  sa: "さ",
  se: "せ",
  si: "し",
  shi: "し",
  so: "そ",
  su: "す",
  ta: "た",
  te: "て",
  to: "と",
  tu: "つ",
  tsu: "つ",
  u: "う",
  vu: "ゔ",
  wa: "わ",
  whu: "う",
  wo: "を",
  u: "う",
  xa: "ぁ",
  xe: "ぇ",
  xi: "ぃ",
  xka: "ヵ",
  xke: "ヶ",
  xn: "ん",
  xo: "ぉ",
  xu: "ぅ",
  xwa: "ゎ",
  xya: "ゃ",
  xye: "ぇ",
  xyi: "ぃ",
  xyo: "ょ",
  xyu: "ゅ",
  ya: "や",
  ye: "いぇ",
  yi: "い",
  yo: "よ",
  yu: "ゆ",
  za: "ざ",
  ze: "ぜ",
  zi: "じ",
  zo: "ぞ",
  zu: "ず",
  ltu: "っ",
  ltsu: "っ",
  xtu: "っ",
  xtsu: "っ",
  wye: "ゑ",
  wyi: "ゐ",
};
export const getRomaji = (text) => {
  const arr = new Array();
  //三文字の場合
  for (let key in data) {
    if (data[key] === text) {
      arr.push(key);
    }
  }
  //二文字の場合
  for (let key in data) {
    if (data[key] === text.substring(0, 2)) {
      arr.push(key);
    }
  }
  //一文字の場合
  for (let key in data) {
    if (data[key] === text.substring(0, 1)) {
      arr.push(key);
    }
  }
  return arr;
  // let valueText = "";
  // let count = 0;
  // if (text === "") {
  //   return "";
  // }
  // for (let key in data) {
  //   // console.log("key:" + key + " value:" + data[key]);
  //   if (key === text) {
  //     valueText = data[key];
  //     return valueText;
  //   }
  //   if (key.startsWith(text)) {
  //     count = count + 1;
  //   }
  // }
  // console.log(count);
  // if (count === 0) {
  //   return "notMore";
  // } else {
  //   return "More";
  // }
};

export const getHiragana = (text) => {
  let str = "";
  for (let key in data) {
    if (key === text) {
      str = data[key];
    }
  }
  return str;
};
export const getRomaji2 = (text) => {
  const arr = new Array();
  //二文字の場合
  for (let key in data) {
    if (data[key] === text) {
      arr.push(key);
      arr.push(3);
      return arr;
    }
  }
  //二文字の場合
  for (let key in data) {
    if (data[key] === text.substring(0, 2)) {
      arr.push(key);
      arr.push(2);
      return arr;
    }
  }
  //一文字の場合
  for (let key in data) {
    if (data[key] === text.substring(0, 1)) {
      arr.push(key);
      arr.push(1);
      return arr;
    }
  }
};
export const getInputCandidate = (input, arr) => {
  const newArr = new Array();
  for (let key in arr) {
    if (arr[key].startsWith(input, 0)) {
      newArr.push(arr[key]);
    }
  }
  return newArr;
};

export const changeColor = (id, count, colorMode) => {
  const arr = document.getElementById(id).querySelectorAll("span");
  arr.forEach((spans, index) => {
    if (index < count) {
      spans.style.color = "red";
    } else {
      if (colorMode === "light") {
        spans.style.color = "#000000";
      } else {
        spans.style.color = "#FFFFFF";
      }
    }
  });
  //残りの文字数
  return arr.length - count;
};

//ひらがなをローマ字に変換
export const getRomajiForecast = (text) => {
  let str = "";
  while (text.length !== 0) {
    const hiragana_ = text.substring(0, 3);
    const getRomaji_ = getRomaji2(hiragana_);

    str = str + getRomaji_[0];
    text = text.substring(getRomaji_[1]);
  }
  return str;
};

//文字ごとにspanタグを作成
export const makeSpan = (text, id) => {
  let oneText = text.split("");
  id.innerText = "";
  oneText.forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = character;
    id.appendChild(characterSpan);
  });
};
