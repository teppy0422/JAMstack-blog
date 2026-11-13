// ここまでの時間(上のヘッダー): 準備・作成の手順(下の steps)ごとに「実働」(生産準備+ を操作する本当に要る時間)と
// 「待ち」(メールの返事待ち・プログラムの実行中など)を入れておき、スクロールした所までの合計を出す。
// 時間は「必要時間を入力」の時に各節の見出しの下に出る枠で入れる(分)。このブラウザに保存
(function () {
  var KEYF = "sjpBlogFlow";
  // 手順 = 「2.作り方」から「3.運用」の前までの小さい節(.sec.sm)と、data-flow の付いた節
  var g0 = document.getElementById("g_prep"), g1 = document.getElementById("g_ops");
  if (!g0 || !g1) return;
  var steps = [].slice.call(document.querySelectorAll(".sec.sm")).filter(function (s) {
    return s.hasAttribute("data-flow") || ((g0.compareDocumentPosition(s) & 4) && (s.compareDocumentPosition(g1) & 4));
  });
  if (!steps.length) return;
  // index.html に保存した時間(<script id="sjpTimes">)。ブラウザの中に保存していない分が有ればそちらを使う
  var FLOW = {};
  try { FLOW = JSON.parse(document.getElementById("sjpTimes").textContent || "{}").flow || {}; } catch (e) {}
  try { var ls = localStorage.getItem(KEYF); if (ls) FLOW = JSON.parse(ls) || {}; } catch (e) {}
  function keep() { try { localStorage.setItem(KEYF, JSON.stringify(FLOW)); } catch (e) {} }
  // 毎回は無い手順: 1 個あたりの時間 × 個数 で数える(個数の初めの値は count)
  var PER = {
    s2_2: { unit: "1 個あたり", count: 2, note: "登録が無いコネクタがある時だけ(通常 1-2 個)" },
  };
  function num(v) { return typeof v === "number" && isFinite(v) ? v : null; }
  function cnt(id) { var c = num(FLOW[id] && FLOW[id].count); return c === null ? PER[id].count : c; }
  function val(id, f) { var v = num(FLOW[id] && FLOW[id][f]) || 0; return PER[id] ? v * cnt(id) : v; }

  // 各節の見出しの下の入力枠(「必要時間を入力」の時だけ見える)
  steps.forEach(function (s) {
    var d = document.createElement("div"), per = PER[s.id];
    d.className = "flowin";
    d.innerHTML = '<b>この手順の時間' + (per ? "(" + per.unit + ")" : "") + '</b><label>実働 <input type="number" min="0" step="1" data-f="work"> 分</label>' +
      '<label>待ち <input type="number" min="0" step="1" data-f="wait"> 分</label>' +
      (per ? '<label>× 個数 <input type="number" min="0" step="1" data-f="count"> 個</label>' : "") +
      '<small>' + (per ? per.note + "。" : "") + '待ち = メールの返事待ち・プログラムの実行中など</small>';
    [].forEach.call(d.querySelectorAll("input"), function (inp) {
      var f = inp.getAttribute("data-f"), v = f === "count" ? cnt(s.id) : FLOW[s.id] && FLOW[s.id][f];
      inp.value = typeof v === "number" ? v : "";
      inp.addEventListener("input", function () {
        var t = inp.value.trim();
        FLOW[s.id] = FLOW[s.id] || {};
        FLOW[s.id][f] = t === "" ? null : Math.max(0, +t);
        keep();
        drawTags();
        update();
      });
      inp.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        e.preventDefault();
        var all = [].slice.call(document.querySelectorAll(".flowin input")), i = all.indexOf(inp);
        if (all[i + 1]) all[i + 1].focus();
      });
    });
    // 見出しの下に、この手順の必要時間(実働・待ち時間含む)。時間が入っていない手順は出さない。入力枠はそのすぐ下
    var tag = document.createElement("div"), h = s.querySelector("h2");
    tag.className = "flowtag";
    tag.setAttribute("data-step", s.id);
    if (h) h.parentNode.insertBefore(tag, h.nextSibling); else s.insertBefore(tag, s.firstChild);
    tag.parentNode.insertBefore(d, tag.nextSibling);
  });
  function drawTags() {
    steps.forEach(function (s) {
      var tag = s.querySelector(".flowtag"), w = val(s.id, "work"), t = w + val(s.id, "wait"), per = PER[s.id];
      if (!tag) return;
      tag.style.display = w || t ? "" : "none";
      var unit = per ? '<span class="ftper">(1 個 ' + hm(num(FLOW[s.id] && FLOW[s.id].work) || 0) + " × " + cnt(s.id) + " 個)</span>" : "";
      tag.innerHTML = '<span class="ftw">実働 <b>' + hm(w) + "</b></span>" + unit +
        '<span class="ftt">待ち時間含む <b>' + hm(t) + "</b></span>";
    });
  }

  // 上のヘッダー(更新日の右)に出す。上の段 = 合計の時間、下の段 = 進み具合のバー(枠の幅いっぱい)
  var box = document.createElement("div");
  box.id = "flowClock";
  box.innerHTML = '<div class="fctop"><span class="fchd">ここまでの時間/治具1台</span>' +
    '<span class="fcrow work"><span>実働</span><b data-k="work">0 分</b></span>' +
    '<span class="fcrow wait"><span>待ち時間含む</span><b data-k="wait">0 分</b></span></div>' +
    '<div class="fcbar"><i class="w"></i><i class="t"></i></div>';
  var hd = document.querySelector(".pghd"), dt = hd && hd.querySelector(".date");
  if (hd) hd.insertBefore(box, dt ? dt.nextSibling : hd.firstChild.nextSibling);
  else document.body.appendChild(box);
  var elW = box.querySelector('[data-k="work"]'), elT = box.querySelector('[data-k="wait"]'),
    barW = box.querySelector(".fcbar .w"), barT = box.querySelector(".fcbar .t");

  function hm(m) {
    m = Math.round(m);
    if (m < 60) return m + " 分";
    return Math.floor(m / 60) + " 時間" + (m % 60 ? " " + (m % 60) + " 分" : "");
  }
  // 上のヘッダーの下端の線を、節がどこまで過ぎたか(0～1)で足す。節の見出しが画面の上(ヘッダーのすぐ下)まで来たら その節を数え始める
  var hdEl = document.querySelector(".pghd");
  var target = { work: 0, wait: 0 }, shown = { work: 0, wait: 0 }, total = { work: 0, wait: 0 }, raf = 0;
  function update() {
    var line = hdEl ? hdEl.getBoundingClientRect().bottom : 0, cur = null;
    target.work = target.wait = total.work = total.wait = 0;
    steps.forEach(function (s) {
      var r = s.getBoundingClientRect(), k = r.bottom <= line ? 1 : r.top >= line ? 0 : (line - r.top) / Math.max(1, r.height);
      if (k > 0) cur = s;
      ["work", "wait"].forEach(function (f) { target[f] += val(s.id, f) * k; total[f] += val(s.id, f); });
    });
    box.classList.toggle("on", !!cur);
    if (!raf) raf = requestAnimationFrame(step);
  }
  // 数字は少しずつ追いかける(スクロールに合わせて増えていく様に見せる)
  function step() {
    raf = 0;
    var moving = false;
    ["work", "wait"].forEach(function (f) {
      var d = target[f] - shown[f];
      shown[f] = Math.abs(d) < 0.05 ? target[f] : shown[f] + d * 0.2;
      if (shown[f] !== target[f]) moving = true;
    });
    elW.textContent = hm(shown.work);
    elT.textContent = hm(shown.work + shown.wait); // 実働 + 待ち
    var all = Math.max(1, total.work + total.wait);
    barW.style.width = (shown.work / all) * 100 + "%";
    barT.style.width = (shown.wait / all) * 100 + "%";
    if (moving) raf = requestAnimationFrame(step);
  }
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  drawTags();
  update();

  // 「入力を終わる」で、必要時間(変更前・変更後)と実働・待ちを index.html の <script id="sjpTimes"> に書く(別の PC でも同じ時間が出る様に)
  // 書けたらブラウザの中の分は消す(次からは index.html の時間を使う)。書けなかった時はブラウザの中に残る
  var editBtn = document.getElementById("edit"), note = document.createElement("small");
  note.id = "timeSaveMsg";
  note.style.cssText = "display: block; white-space: pre-wrap;";
  editBtn.parentNode.insertBefore(note, editBtn.nextSibling);
  function tmsg(t, ng) { note.textContent = t; note.style.color = ng ? "#c92a2a" : ""; }
  function data() {
    var times = {};
    Object.keys(TIMES).forEach(function (k) { times[k] = { before: TIMES[k].before, after: TIMES[k].after, basis: TIMES[k].basis }; });
    return { times: times, flow: FLOW };
  }
  // ブラウザの中にまだ index.html に書いていない分が有る時は、変えなくても次の「入力を終わる」で書く
  var saved = JSON.stringify(data());
  try { if (localStorage.getItem(KEYF) || localStorage.getItem("sjpBlogTimes")) saved = ""; } catch (e) {}
  async function saveTimes() {
    var now = JSON.stringify(data());
    if (now === saved) return;
    if (!window.sjpDeckFile) throw new Error("保存の仕組み(text_edit.js)が読めていません");
    tmsg("index.html に保存しています…");
    var fh = await window.sjpDeckFile.getDir(), file = await fh.getFile(), src = await file.text();
    var A = '<script id="sjpTimes" type="application/json">', a = src.indexOf(A), b = a < 0 ? -1 : src.indexOf("</script>", a);
    if (a < 0 || b < 0 || src.indexOf(A, a + 1) >= 0) throw new Error("index.html の中に時間を書く所(sjpTimes)が見つかりません");
    var out = src.slice(0, a + A.length) + now.replace(/</g, "\\u003c") + src.slice(b);
    var bk = await window.sjpDeckFile.writeIndex(fh, file, src, out);
    saved = now;
    try { localStorage.removeItem(KEYF); localStorage.removeItem("sjpBlogTimes"); } catch (e) {}
    tmsg("時間を index.html に保存しました(前の版: " + bk + ")");
  }
  editBtn.addEventListener("click", function () {
    // main.js の onclick の後に動く。入力を終わった時だけ保存する
    if (document.body.classList.contains("editing")) { tmsg(""); return; }
    saveTimes().catch(function (e) {
      tmsg((e.name === "AbortError" ? "フォルダを選ばなかったので" : e.message) + "\n時間はこのブラウザの中にだけ残っています。もう一度「必要時間を入力」→「入力を終わる」で保存できます", true);
    });
  });
})();
