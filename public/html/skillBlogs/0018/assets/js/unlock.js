// 右の欄のボタン(必要時間を入力 から 説明 まで)は、パスワードを入れた時だけ出す。入れたことはこのブラウザに覚える
// パスワードの枠は 上のヘッダーの鍵のボタンを押すと出る
(function () {
  var KEY = "sjpBlogUnlock", PASS = "sakura", root = document.documentElement;
  var btn = document.getElementById("lock"), box = document.getElementById("lockBox");
  if (!btn || !box) return;
  var inp = box.querySelector("input");
  // アイコン: 閉じた鍵(隠している) / 開いた鍵(出している)
  var SHUT = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>';
  var OPEN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 7.7-1.5"/></svg>';
  function set(on) {
    root.classList.toggle("unlocked", on);
    btn.innerHTML = on ? OPEN : SHUT;
    btn.title = on ? "編集のボタンを隠す" : "パスワードを入れて編集のボタンを出す";
    btn.setAttribute("aria-label", btn.title);
  }
  function showBox(v) {
    box.hidden = !v;
    inp.value = "";
    inp.classList.remove("ng");
    if (v) inp.focus();
  }
  btn.addEventListener("click", function () {
    if (root.classList.contains("unlocked")) {
      set(false);
      try { localStorage.removeItem(KEY); } catch (e) {}
      return;
    }
    showBox(box.hidden);
  });
  // Enter で確かめる。合えば出す、違えば枠を赤くして揺らす
  function onKey(e) {
    var t = e.target;
    if (e.key === "Escape" && t === inp) { showBox(false); return; }
    if (e.key !== "Enter") return;
    if (t.value === PASS) {
      showBox(false);
      set(true);
      try { localStorage.setItem(KEY, "1"); } catch (e2) {}
    } else {
      t.classList.remove("ng");
      void t.offsetWidth;   // もう一度 揺らすため
      t.classList.add("ng");
      t.select();
    }
  }
  inp.addEventListener("keydown", onKey);
  var on = false;
  try { on = localStorage.getItem(KEY) === "1"; } catch (e) {}
  set(on);
})();
