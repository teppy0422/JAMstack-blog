var v = document.getElementById("video");
let myDuration;
let TimeArrayNumber = new Array();
let TimeArrayVariant = new Array();
let VoiceArray = new Array();
let progressBar = document.getElementById("progressBar");
let progressBar2 = document.getElementById("progressBar2");
let is_play = false;
let nowNumber = -1;
let bakNumber = -2;
let on_audio = false;
let sw_audio = false;
let on_music = true;
let myRate = 1;

function fullscreen() {
  const rootElement = document.documentElement;
  const mode_full = document.getElementById("mode_full");
  if (document.fullscreenElement) {
    document.exitFullscreen();
    mode_full.class = "fas fa-compress-arrows-alt";
  } else {
    rootElement.requestFullscreen();
    mode_full.class = "fas fa-expand-arrows-alt";
  }
}
v.addEventListener(
  "play",
  function () {
    is_play = true;
  },
  false
);
v.addEventListener(
  "pause",
  function () {
    is_play = false;
  },
  false
);
v.addEventListener("loadedmetadata", function () {
  getTimeArray();
  determine_browser();
});
function determine_browser() {
  var userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1) {
    on_audio = false; //IE
    document.getElementById("microphone").style.color = "#aaaaaa";
    let element = document.querySelector("i");
    //element.classList.replace('fas fa-microphone fa-lg faa-vertical animated-hover', 'fas fa-microphone-slash fa-lg faa-vertical animated-hover ');
  } else if (userAgent.indexOf("edge") != -1) {
    console.log("Edgeをお使いですね");
  } else if (userAgent.indexOf("chrome") != -1) {
    on_audio = true; //chrome
  } else if (userAgent.indexOf("safari") != -1) {
    console.log("Safariをお使いですね");
  } else if (userAgent.indexOf("firefox") != -1) {
    console.log("FireFoxをお使いですね");
  } else if (userAgent.indexOf("opera") != -1) {
    console.log("Operaをお使いですね");
  } else {
    console.log("そんなブラウザは知らん");
  }
}
function getDuration() {
  //動画の長さ（秒）を表示
  myDuration = v.duration;
  document.getElementById("nagasa").innerHTML = myDuration.toFixed(0);
  setTimeout("getDuration()", 1000);
}
function playVideo() {
  document.getElementById("play").style.display = "none";
  document.getElementById("pause").style.display = "block";
  document.getElementById("video-placeholder").style.display = "none";

  getTimeArray();
  //再生完了の表示をクリア
  document.getElementById("kanryou").innerHTML = "";
  //動画を再生
  v.play();
  //現在の再生位置（秒）を表示
  v.addEventListener(
    "timeupdate",
    function () {
      searchTimeArray();
      if (nowNumber != bakNumber) {
        reNewNowText(nowNumber);
        bakNumber = nowNumber;
      }
      document.getElementById("ichi").innerHTML = v.currentTime.toFixed(0);
      let progressPercent = (v.currentTime / myDuration) * 100;
      progressBar.style.width = progressPercent + "%";
      progressBar2.style.width = progressPercent + "%";
    },
    false
  );
  //再生完了を知らせる
  v.addEventListener(
    "ended",
    function () {
      progressBar.style.backgroundColor = "#333333";
      is_play = false;
      // document.getElementById("kanryou").innerHTML = "動画の再生が完了しました。";
    },
    false
  );
}
function clickMicrophone() {
  if (on_audio == true) {
    if (sw_audio == true) {
      sw_audio = false;
      document.getElementById("microphone").style.color = "#aaaaaa";
    } else {
      sw_audio = true;
      document.getElementById("microphone").style.color = "#55c500";
    }
  }
}
function videoTouch() {
  if (is_play == true) {
    pauseVideo();
  } else {
    playVideo();
  }
}
function pauseVideo() {
  document.getElementById("play").style.display = "block";
  document.getElementById("pause").style.display = "none";
  //動画を一時停止
  v.pause();
}
function rateUp() {
  //速度を上げる
  // v.volume = v.volume + 0.25;
  v.playbackRate = v.playbackRate + 0.05;
  myRate = v.playbackRate.toFixed(2);
  document.getElementById("rate").innerHTML = (myRate * 100).toFixed(0);
}
function rateDown() {
  //速度を下げる
  // v.volume = v.volume - 0.25;
  v.playbackRate = v.playbackRate - 0.05;
  myRate = v.playbackRate.toFixed(2);
  document.getElementById("rate").innerHTML = (myRate * 100).toFixed(0);
}
function rateSet(myRate) {
  v.playbackRate = myRate;
  myRate = myRate;
  document.getElementById("rate").innerHTML = myRate * 100;
}
function skip(mySecond) {
  //再生位置に移動
  v.currentTime = mySecond;
  playVideo();
}
function getTimeArray() {
  //要素を配列に入れる
  let tbl = document.getElementById("targetTable"); //テーブルのコントロールを取得
  for (var i = 0; i < tbl.children[1].children.length; i++) {
    //tbl.children[0]はthead tbl.children[1]はtbody
    let row = tbl.children[1].children[i]; //i番目のtrを取得
    // console.log(row.cells[0].getElementsByTagName("tr")[0]); //各行のコードのコントロールの値を出力
    // console.log(row.cells[1].getElementsByTagName("input")[0].value); //各行の名称のコントロールの値を出力
    let str0 = row.outerHTML.indexOf("(") + 1;
    let str1 = row.outerHTML.indexOf(")");
    let str = row.outerHTML.substring(str0, str1);
    TimeArrayNumber[i] = str;
    //.voiceがある場合配列に入れる
    let row2 = tbl.children[1].children[i].children[0].querySelector(".voice");
    if (row2 != null) {
      VoiceArray[i] = row2.textContent;
    }
  }
  // TimeArrayNumber.reverse();
  TimeArrayVariant = tbl;
  getDuration();
}
function searchTimeArray() {
  //今のNumberを配列から取得
  for (let i = TimeArrayNumber.length - 1; i >= 0; i--) {
    if (TimeArrayNumber[i] < v.currentTime && !TimeArrayNumber[i] == "") {
      nowNumber = i;
      break;
    }
  }
}
function reNewNowText(i) {
  if (i > 1) {
    TimeArrayVariant.children[1].children[i - 1].scrollIntoView({
      behavior: "smooth",
    });
    // document.getElementById("nowText").innerHTML =
    //   TimeArrayVariant.children[1].children[i].children[0].innerHTML;
  }
  // let aaa = TimeArrayVariant.children[1].children[i-1].scrollHeight;
  // window.scroll(aaa-1,0)
  if (on_audio == true && sw_audio == true) {
    if (VoiceArray[i] != null) {
      PlayVoice(VoiceArray[i]);
    }
    audioSpeak(TimeArrayVariant.children[1].children[i].children[0].innerText);
  }
  // document.getElementById("targetTable").children[1].children[i].children[0].style.backgroundColor="#FF0000"
}
function audioSpeak(txt) {
  const synth = new SpeechSynthesisUtterance(); // 設定を入れるオブジェクト
  // synth.voice = voices[0];
  synth.text = txt; // 話す内容
  synth.lang = "ja-JP"; // 言語
  synth.rate = 0.7; // 速さ
  synth.pitch = 0.8; // 高さ
  synth.volume = 1.0; // 音量
  window.speechSynthesis.speak(synth); // 話す
}

var mode; // ストップウォッチのモード	RUN/STOP
var startTime; // スタートした時刻
var nowTime; // ストップした時刻
var addTime; // 経過時間（ストップウォッチ再開時に加算する）
var millisec; // 1000分の1秒
var sec100; // 100分の1秒
var sec; // 秒
var min; // 分
var hour; // 時
var gmt; // タイムゾーンのオフセット値 例）GMT+0900 なら 標準時より9時間後をさしているので-9する
var timerId; // タイマー
/*
 * 定数
 */
var RUN = 1; // 動作中
var STOP = 0; // 停止中
document.onkeydown = keydown;
function keydown() {
  switch (event.key) {
    case " ": //nothing
      videoTouch();
      break;
    case "0": //0
    case "1": //1
    case "2": //2
    case "3": //3
    case "4": //4
    case "5": //5
    case "6": //6
    case "7": //7
    case "8": //8
    case "9": //9
      gotoSG(event.key);
      break;
    case "+": //ok 再生速度をもとに戻す
      v.playbackRate = myRate;
      document.getElementById("rate").innerHTML = (myRate * 100).toFixed(0);
      break;
    case ";":
    case "ArrowLeft": //,キーボード用←
      skip(v.currentTime - 5);
      break;
    case "<":
    case "ArrowRight": //,キーボード用→
      skip(v.currentTime + 5);
      break;
    case "^":
    case "ArrowUp": //,キーボード用↑
      rateUp();
      // var myID = 'arrow-up';
      // var div = document.getElementById(myID);
      // div.classList.add('neutemp');
      // async_Wait_remove(0.15,myID,'neutemp');
      break;
    case ">":
    case "ArrowDown": //,キーボード用↓
      rateDown();
      // var myID = 'arrow-down';
      // var div = document.getElementById(myID);
      // div.classList.add('neutemp');
      // async_Wait_remove(0.15,myID,'neutemp');
      break;
    case "?": //|←←
      break;
    case '"': //■
      pauseVideo();
      break;
    case "A": //→/||
      videoTouch();
      break;
    case "B": //→→| 早送り
      v.playbackRate = 5;
      document.getElementById("rate").innerHTML = (500).toFixed(0);
      break;
    case "C": //Source 最初から再生_タイマースタートorストップ
      if (document.getElementById("dialog").style.display == "block") {
        document.getElementById("yes").click();
      } else {
      }
      break;
    case "D": //Exit
      myClose("dialog");
    default:
      break;
  }
}
/*
 * ストップウォッチのリセット
 */
function resetStopWatch() {
  mode = STOP;
  addTime = 0;
  millisec = sec100 = sec = min = hour = 0;
  gmt = new Date().getTimezoneOffset() / 60; // 戻り値は分のため60で割る
  document.getElementById("timerLabel").innerHTML = "";
}

var strTime = "";
// ダイアログ
var dialog = document.getElementById("dialog");
const dialog_result = document.getElementById("dialog_result");
const dialog_resultStr = document.getElementById("dialog_resultStr");
const dialog_SG_selectbox = document.getElementById("dialog_SG_selectbox");
let dialog_user_name = document.getElementById("dialog_user_name");
let dialog_user_nameStr = document.getElementById("dialog_user_nameStr");
const myTitle = document.getElementById("myTitle");
const dialog_myTitle = document.getElementById("dialog_myTitle");
const dialog_target_value = document.getElementById("dialog_target_value");
var yes = document.getElementById("yes");
var no = document.getElementById("no");
no.addEventListener("click", function () {
  dialog.style.display = "none";
});
/*
 * ボタン処理
 */
function getDir(place, n) {
  return place.pathname.replace(
    new RegExp("(?:\\/+[^\\/]*){0," + ((n || 0) + 1) + "}$"),
    "/"
  );
}
/*
 * 時間表示
 */
function drawTime() {
  strTime = sec + min * 60 + hour * 3600;

  // var strSec100, strSec, strMin, strHour;
  // 数値を文字に変換及び2桁表示設定
  // strSec100 = "" + sec100;
  // if ( strSec100.length < 2){
  // 	strSec100 = "0" + strSec100;
  // }
  // strSec = "" + sec;
  // if ( strSec.length < 2){
  // 	strSec = "0" + strSec;
  // }
  // strMin = "" + min;
  // if ( strMin.length < 2){
  // 	strMin = "0" + strMin;
  // }
  // strHour = "" + hour;
  // if ( strHour.length < 2){
  // 	strHour = "0" + strHour;
  // }
  // // 表示形式を設定
  // strTime = strHour + ":" + strMin + ":" + strSec + "." + strSec100;
  document.getElementById("timerLabel").innerHTML = strTime;
}

/*
 * 時間計測
 */
function runStopWatch() {
  // スタートからの差分をとる
  nowTime = new Date().getTime();
  diff = new Date(nowTime - startTime);
  // ミリ秒、100分の1秒、秒、分、時を設定
  millisec = diff.getMilliseconds();
  sec100 = Math.floor(millisec / 10);
  sec = diff.getSeconds();
  min = diff.getMinutes();
  hour = diff.getHours() + gmt; // タイムゾーンのオフセットを考慮する

  drawTime(); // 時間表示
  timerId = setTimeout(runStopWatch, 500);
}
/*
 * 実行時の処理
 */
window.onload = function () {
  resetStopWatch();
};
function gotoSG(SG) {
  document.getElementById(SG).click();
}
var audioElem = new Audio();
function PlayVoice(VoicePath) {
  audioElem.src = VoicePath;
  audioElem.play();
}
function StopVoice() {
  audioElem.pause();
}
function mySubmit(idName, myPHP) {
  let myForm = document.getElementById(idName);
  myForm.formAction = myPHP;
  myForm.action = myPHP;
  myForm.submit();
}
function myClose(myID) {
  let temp = document.getElementById(myID);
  temp.style.display = "none";
}
function myOpen(myID) {
  let temp = document.getElementById(myID);
  temp.style.display = "block";
}
function newTab(address) {
  window_A = window.open(address, "graph");
}
function setItemSG(myID) {
  var item = document.getElementById(myID).value;
  localStorage.setItem("SG", item);
}
function getItemSG() {
  var item = localStorage.getItem("SG");
  var arrayTemp = document.getElementById("SG_selectbox");
  for (var i = 0; i < arrayTemp.length; i++) {
    if (item == arrayTemp[i].value) {
      arrayTemp.options[i].selected = true;
    }
  }
}

var bed = false;
var running = true;
var training_mode = bed;
var hour_;
var running_counter;
var running_time;
var running_hour = 0,
  running_min = 0,
  running_sec = 0;
var total_time_set_counter;
let total_time_temp;
let running_start_flag = false;
const dialog_total_time = document.getElementById("dialog_total_time");

function running_count() {
  // スタートからの差分をとる
  nowTime = new Date().getTime();
  diff = (nowTime - training_startTime) / 1000; //ms→s
  running_time = diff;

  running_hour = Math.floor(diff / 3600);
  let diff_temp = diff % 3600;
  running_min = Math.floor(diff_temp / 60);
  running_sec = Math.floor(diff_temp % 60);

  str_hour = time_trim(running_hour);
  str_min = time_trim(running_min);
  str_sec = time_trim(running_sec);
  running_time_str = str_hour + ":" + str_min + ":" + str_sec;
  document.getElementById("runningLabel").innerText = running_time_str;
  running_counter = setTimeout(running_count, 1000);
  dialog_total_time.value = running_time;
}
// 表示用に整える
function time_trim(value) {
  str_ = "" + value;
  if (str_.length < 2) {
    str_ = "0" + str_;
  }
  return str_;
}
var getRate;
// DBからtotal_time_tempをとってくる(無かったら新規作成)
function total_time_get() {
  if (login_check() == true) {
    var fd = new FormData();
    var SG_selectbox_sp = document
      .getElementById("SG_selectbox")
      .value.split(",");
    fd.append("myTitle", myTitle.value + "-" + SG_selectbox_sp[0]);
    fd.append("user_name", user_name);
    fd.append("rate", rate);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var getValue = xhr.responseText.split(",");
        total_time_temp = getValue[0];
        getRate = getValue[1] / 100;
        if (getRate == 0) {
          getRate = 0.7;
        }
        //ここに描写処理
        console.log(total_time_temp);
        console.log(getRate);
        document.getElementById("runningLabel").innerText = total_time_temp;
        rateSet(getRate);
      }
    };
  } else {
    getRate = 1;
    rateSet(getRate);
  }
}
// DBにtotal_time_tempを保存
function total_time_set() {
  if (login_check() == true) {
    var fd = new FormData();
    var SG_selectbox_sp = document
      .getElementById("SG_selectbox")
      .value.split(",");
    fd.append("myTitle", myTitle.value + "-" + SG_selectbox_sp[0]);
    fd.append("user_name", user_name);
    fd.append("total_time_temp", running_time);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "php/update_total_time_temp.php");
    xhr.send(fd);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        total_time_temp = xhr.responseText;
        console.log(total_time_temp);
      }
    };
  }
}
// DBにgetRateを保存
function getRate_set() {
  if (login_check() == true) {
    var fd = new FormData();
    var SG_selectbox_sp = document
      .getElementById("SG_selectbox")
      .value.split(",");
    fd.append("myTitle", myTitle.value + "-" + SG_selectbox_sp[0]);
    fd.append("user_name", user_name);
    fd.append("getRate", getRate * 100);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "php/update_getRate.php");
    xhr.send(fd);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        total_time_temp = xhr.responseText;
        console.log(total_time_temp);
      }
    };
  }
}
// DBにresultを保存
function result_insert() {
  if (login_check() == true) {
    var fd = new FormData();
    var SG_selectbox_sp = document
      .getElementById("SG_selectbox")
      .value.split(",");
    fd.append("myTitle", myTitle.value + "-" + SG_selectbox_sp[0]);
    fd.append("user_name", user_name);
    fd.append("total_time", running_time);
    fd.append("dialog_target_value", dialog_target_value.value);
    fd.append("target_temp", dialog_target_value.value * (1 / v.playbackRate));
    fd.append("result", dialog_result.value);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "php/insert.php");
    xhr.send(fd);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        total_time_temp = xhr.responseText;
        console.log(total_time_temp);
      }
    };
    var target_value = dialog_target_value.value * (1 / getRate);
    if (target_value > dialog_result.value) {
      getRate = getRate + 0.05;
      getRate = Math.floor(getRate * 100) / 100;
      rateSet(getRate);
      getRate_set();
    }
  }
  myClose("dialog");
  document.getElementById("insert_gif").style.display = "block";
  setTimeout(gif_none, 3000);
}
function gif_none() {
  document.getElementById("insert_gif").style.display = "none";
}
function set_led() {
  var SG_selectbox_sp = document
    .getElementById("SG_selectbox")
    .value.split(",");

  var fd = new FormData();
  var rate = document.getElementById("rate").innerText;
  fd.append("isRun", "1");
  fd.append("speed", rate);
  fd.append("target", SG_selectbox_sp[1]);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "php/write_led.php");
  xhr.send(fd);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      total_time_temp = xhr.responseText;
      console.log(total_time_temp);
    }
  };
  setTimeout("set_led_delete()", 5000);
}

function set_led_delete() {
  var fd = new FormData();

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "php/write_led_delete.php");
  xhr.send(fd);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      total_time_temp = xhr.responseText;
      console.log(total_time_temp);
    }
  };
}
