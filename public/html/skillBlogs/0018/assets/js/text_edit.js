// 文字の編集: 右の欄の「文字を編集」で、見出し・文・写真の説明などをその場で書き換えて、index.html に保存する
// 保存の仕方: フォルダ(G:\ai\sjp_presentation)を選んでもらい(最初の 1 回。次からは許可だけ)、index.html を読み直して、
//   書き換えた所だけを元の文字と入れ替えて書く。書く前に今の index.html を index_<更新日時>.html として残す
// 編集できるのは、元の index.html にある物と同じ所だけ(スクリプトが後から足した目次・見本・時間などは編集しない)
// 文字の大きさ: 編集中に文字を押すと、上に「A− 〇px A+ 元の大きさ」が出る。<span class="tefs" style="font-size: 〇px"> で包んで保存する
//   文字を選んでいれば選んだ所だけ、選んでいなければその所の文字まるごと
// 太字: 同じ道具の「B」(Ctrl+B)で 太字にする/しない。ブラウザの太字(<b>)を使う
(function () {
  var SEL = "h1, h2, h3, h4, p, figcaption, li, dt, dd, th, td, .reachhd, .livehd b, .livehd span, .how, .lb, .reachend";
  var DB = "sjpDeckEdit", STORE = "h";
  var on = false, pairs = [], dir = null;
  var btn = document.createElement("button");
  btn.id = "textEdit";
  btn.textContent = "文字を編集";
  var saveBtn = document.createElement("button");
  saveBtn.id = "textSave";
  saveBtn.textContent = "保存";
  saveBtn.style.display = "none";
  var note = document.createElement("small");
  note.id = "textEditMsg";
  var tools = document.querySelector("aside .tools");
  var small = tools.querySelector("small");
  tools.insertBefore(btn, small);
  tools.insertBefore(saveBtn, small);
  tools.appendChild(note);
  var st = document.createElement("style");
  st.textContent =
    "body.textEditing [data-te] { outline: 1px dashed #74c0fc; outline-offset: 2px; cursor: text; }" +
    " body.textEditing [data-te]:focus { outline: 2px solid #1c7ed6; background: #e7f5ff; }" +
    " body.textEditing [data-te].teChanged { background: #fff9db; }" +
    // ダークモード: 薄い色の背景だと白い文字が読めないので、暗い青・暗い黄にする。選んだ文字も見える色に
    " :root[data-theme=dark] body.textEditing [data-te]:focus { background: #16324f; }" +
    " :root[data-theme=dark] body.textEditing [data-te].teChanged { background: #4a3c0a; }" +
    " body.textEditing [data-te]::selection, body.textEditing [data-te] *::selection { background: #1c7ed6; color: #fff; }" +
    " #textEdit.on { background: #1c7ed6; color: #fff; border-color: #1c7ed6; }" +
    " #textEditMsg { display: block; white-space: pre-wrap; }" +
    " #textEditMsg.ng { color: #c92a2a; }" +
    // 文字の大きさの道具(編集中の文字の上に出す)
    " #teSize { position: fixed; z-index: 9999; display: none; align-items: center; gap: 4px; padding: 4px 6px; border-radius: 8px; background: #1c7ed6; color: #fff; font: 700 13px/1 sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,.3); }" +
    " #teSize button { font: inherit; padding: 4px 8px; border: 0; border-radius: 5px; background: rgba(255,255,255,.18); color: #fff; cursor: pointer; }" +
    " #teSize button:hover { background: rgba(255,255,255,.35); }" +
    " #teSize > b { min-width: 44px; text-align: center; }" +
    " #teSize button[data-b] { min-width: 30px; font-size: 15px; }" +
    " #teSize button[data-b].on { background: #fff; color: #1c7ed6; }";
  document.head.appendChild(st);

  function msg(t, ng) { note.textContent = t; note.className = ng ? "ng" : ""; }
  // ---- 文字の大きさ ----
  var fsBar = document.createElement("div"), cur = null;
  fsBar.id = "teSize";
  fsBar.innerHTML = '<button type="button" data-d="-2" title="小さく(Alt+↓)">A−</button><b></b><button type="button" data-d="2" title="大きく(Alt+↑)">A+</button><button type="button" data-d="0" title="元の大きさに戻す(選んだ所だけ、または全部)">元の大きさ</button><button type="button" data-b="1" title="太字にする/しない(Ctrl+B)"><b>B</b></button>';
  document.body.appendChild(fsBar);
  // 大きさを付ける span: 文字だけの所は p.e そのもの、それ以外は中身をまるごと包んだ span.tefs
  function fsWrap(p, make) {
    if (p.text) return p.e;
    var w = p.e.children.length === 1 && p.e.firstElementChild.classList.contains("tefs") && norm(p.e.firstElementChild.textContent) === norm(p.e.textContent) ? p.e.firstElementChild : null;
    if (!w && make) {
      w = document.createElement("span");
      w.className = "tefs";
      while (p.e.firstChild) w.appendChild(p.e.firstChild);
      p.e.appendChild(w);
    }
    return w;
  }
  // 今の所(p.e)の中で選んでいる範囲。選んでいなければ null
  function selIn(p) {
    var s = getSelection();
    if (!s.rangeCount || s.isCollapsed) return null;
    var r = s.getRangeAt(0);
    return p.e.contains(r.commonAncestorContainer) ? r : null;
  }
  // 範囲が 1 つの span.tefs の中身ぴったり(または中)なら、その span
  function selTefs(p, r) {
    var n = r.commonAncestorContainer;
    if (n.nodeType === 3) n = n.parentElement;
    var t = n.closest(".tefs");
    return t && p.e.contains(t) && t !== p.e && norm(t.textContent) === norm(r.toString()) ? t : null;
  }
  function fsNow(p) {
    var r = selIn(p), el;
    if (r) { el = r.startContainer; if (el.nodeType === 3) el = el.parentElement; }
    else el = fsWrap(p) || p.e;
    return Math.round(parseFloat(getComputedStyle(el).fontSize));
  }
  function fsShow() {
    if (!cur || !on) { fsBar.style.display = "none"; return; }
    fsBar.querySelector(":scope > b").textContent = fsNow(cur) + "px";
    var bb = fsBar.querySelector("[data-b]"), bon = false;
    try { bon = document.queryCommandState("bold"); } catch (e) {}
    bb.classList.toggle("on", bon);
    fsBar.style.display = "flex";
    var r = cur.e.getBoundingClientRect(), bh = fsBar.offsetHeight;
    fsBar.style.left = Math.max(4, Math.min(r.left, innerWidth - fsBar.offsetWidth - 4)) + "px";
    fsBar.style.top = (r.top - bh - 6 < 4 ? r.bottom + 6 : r.top - bh - 6) + "px";
  }
  // 太字にする/しない。選んでいなければその所の文字まるごと(選んでから太字にして、元のカーソルの位置に戻す)
  function bold(p) {
    var s = getSelection(), keep = s.rangeCount ? s.getRangeAt(0).cloneRange() : null, all = !selIn(p);
    if (all) { var r = document.createRange(); r.selectNodeContents(fsWrap(p) || p.e); s.removeAllRanges(); s.addRange(r); }
    document.execCommand("styleWithCSS", false, false);
    document.execCommand("bold");
    if (all && keep) { s.removeAllRanges(); s.addRange(keep); }
    p.e.classList.toggle("teChanged", now(p) !== p.old);
    fsShow();
  }
  function unwrap(w) { var pa = w.parentNode; while (w.firstChild) pa.insertBefore(w.firstChild, w); pa.removeChild(w); pa.normalize(); }
  function fsSet(p, d) {
    var r = selIn(p);
    if (r) {   // 選んだ所だけ
      var t = selTefs(p, r);
      if (!d) { if (t) unwrap(t); }
      else {
        var n0 = Math.max(8, fsNow(p) + d);
        if (!t) {
          t = document.createElement("span");
          t.className = "tefs";
          var fr = r.extractContents();
          [].forEach.call(fr.querySelectorAll(".tefs"), unwrap);   // 中に有った大きさは外す(重ねない)
          t.appendChild(fr);
          r.insertNode(t);
          [].forEach.call(t.parentNode.childNodes, function (c) { if (c.nodeType === 3 && c.nodeValue === "") c.remove(); });
        }
        t.style.fontSize = n0 + "px";
        var s = getSelection(), r2 = document.createRange();
        r2.selectNodeContents(t); s.removeAllRanges(); s.addRange(r2);
      }
      p.e.classList.toggle("teChanged", now(p) !== p.old);
      fsShow();
      return;
    }
    if (!d) {   // 元の大きさ: 包みを外す
      var w = fsWrap(p);
      if (p.text) p.e.style.fontSize = "";
      else if (w) { while (w.firstChild) p.e.insertBefore(w.firstChild, w); w.remove(); }
    } else {
      var n = Math.max(8, fsNow(p) + d);
      fsWrap(p, true).style.fontSize = n + "px";
    }
    p.e.classList.toggle("teChanged", now(p) !== p.old);
    fsShow();
  }
  fsBar.addEventListener("mousedown", function (ev) { ev.preventDefault(); });   // 押しても文字から focus を外さない
  fsBar.addEventListener("click", function (ev) {
    var b = ev.target.closest("button");
    if (b && cur) { if (b.hasAttribute("data-b")) bold(cur); else fsSet(cur, +b.getAttribute("data-d")); }
  });
  document.addEventListener("focusin", function (ev) {
    var t = ev.target.closest && ev.target.closest("[data-te]");
    if (!t) return;
    cur = pairs.filter(function (x) { return x.e === t; })[0] || null;
    fsShow();
  });
  addEventListener("scroll", fsShow, true);
  document.addEventListener("selectionchange", function () { if (cur) fsShow(); });
  addEventListener("resize", fsShow);
  // フォルダの許可を覚えておく(IndexedDB)
  function idb(mode, fn) {
    return new Promise(function (ok, ng) {
      var r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(STORE); };
      r.onerror = function () { ng(r.error); };
      r.onsuccess = function () {
        try {
          var tx = r.result.transaction(STORE, mode), q = fn(tx.objectStore(STORE));
          tx.oncomplete = function () { ok(q && q.result); };
          tx.onerror = function () { ng(tx.error); };
        } catch (e) { ng(e); }
      };
    });
  }
  async function getDir() {
    if (!window.showDirectoryPicker) throw new Error("このブラウザはフォルダに書き込めません(Chrome か Edge で開いてください)");
    if (!dir) { try { dir = await idb("readonly", function (s) { return s.get("dir"); }); } catch (e) { dir = null; } }
    if (dir && (await dir.requestPermission({ mode: "readwrite" })) !== "granted") dir = null;
    if (!dir) {
      dir = await window.showDirectoryPicker({ id: "sjpDeck", mode: "readwrite" });
      try { await idb("readwrite", function (s) { return s.put(dir, "dir"); }); } catch (e) {}
    }
    var f;
    try { f = await dir.getFileHandle("index.html"); } catch (e) { dir = null; throw new Error("選んだフォルダに index.html がありません。G:\\ai\\sjp_presentation を選んでください"); }
    return f;
  }
  // index.html を書く。前の版を残す(名前は index.html の更新日時)。残した名前を返す
  async function writeIndex(fh, file, src, out) {
    var d = new Date(file.lastModified), z = function (n) { return ("0" + n).slice(-2); };
    var bk = "index_" + d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate()) + "_" + z(d.getHours()) + z(d.getMinutes()) + z(d.getSeconds()) + ".html";
    var exists = true;
    try { await dir.getFileHandle(bk); } catch (e) { exists = false; }
    if (!exists) { var bw = await (await dir.getFileHandle(bk, { create: true })).createWritable(); await bw.write(src); await bw.close(); }
    var w = await fh.createWritable();
    await w.write(out);
    await w.close();
    return bk;
  }
  // 必要時間の保存(flow_clock.js)からも使う
  window.sjpDeckFile = { getDir: getDir, writeIndex: writeIndex };
  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  // 文字の入っている節。節の外(ここまでで出来る事・ポイント点滅の見本 等)は、その手前の節に入れる
  // (保存の時は 節の id="…" から次の <section までを探すので、手前の節の後ろに続く節の外の物も見つかる)
  function secOf(root, e) {
    var s = e.closest("section[id]");
    if (s) return s;
    var all = root.querySelectorAll("article section[id]"), last = null;
    for (var i = 0; i < all.length; i++) { if (all[i].compareDocumentPosition(e) & 4) last = all[i]; else break; }
    return last;
  }
  // 編集できる物: SEL のうち、中に他の SEL を持たない物。節(id の有る section)と、節の中の順番で、元と今を合わせる
  function cands(root) {
    var out = [], seen = {};
    [].forEach.call(root.querySelectorAll("article"), function (a) {
      [].forEach.call(a.querySelectorAll(SEL), function (e) {
        // 中に文字の飾り(a b strong em span br small sub sup code)以外の物(ボタン・画像・svg 等)が有る物は編集しない(消してしまうので)
        if (e.querySelector(SEL) || e.querySelector(":not(a):not(b):not(strong):not(em):not(span):not(br):not(small):not(sub):not(sup):not(code)") || !norm(e.textContent) || e.closest("[data-t], #sumLead, #sumTable, .live .liveframe, iframe, script, textarea, template, .flowtag, .ptanim, .sscanim")) return;
        // 見出しの様に中身が <a> 1 つだけの物は、<a> の中を編集する(リンクを消さない)
        var only = e.children.length === 1 && e.firstElementChild.tagName === "A" && norm(e.firstElementChild.textContent) === norm(e.textContent);
        if (only) e = e.firstElementChild;
        var sec = secOf(root, e), k = (sec ? sec.id : "-") + "/" + e.tagName;
        seen[k] = (seen[k] || 0) + 1;
        out.push({ e: e, key: k + "/" + seen[k] });
      });
    });
    return out;
  }
  // 上の cands に入らなかった文字(中にボタン等が有る文の、文字の所)。節ごとに「同じ文字の何回目か」で、元と今を合わせる
  // (節の中の通し番号で合わせると、ページの方に文字が 1 つ増えただけで後ろが全部ずれて編集できなくなるので)
  // .ptanim・.sscanim は Excel の動き(表のセル)なので編集しない(セルに点線の枠が出てしまう)
  var SKIP = "[data-t], #sumLead, #sumTable, .live .liveframe, iframe, script, style, textarea, template, button, svg, pre, select, option, .flowin, .flowtag, #flowClock, .ptanim, .sscanim";
  function texts(root, cs) {
    var out = [], seen = {}, inC = function (n) { return cs.some(function (c) { return c.e.contains(n); }); };
    // 節の外の文字(ポイント点滅の見本 等)は手前の節に入れる(secOf)
    [].forEach.call(root.querySelectorAll("article"), function (art) {
      var w = root.createTreeWalker(art, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) {
        var s = n.nodeValue.trim(), pe = n.parentElement, sec;
        if (!s || pe.closest(SKIP) || inC(n) || !(sec = secOf(root, pe))) continue;
        var sk = sec.id + "/T/" + s;
        seen[sk] = (seen[sk] || 0) + 1;
        out.push({ n: n, s: s, key: sk + "/" + seen[sk] });
      }
    });
    return out;
  }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\u00a0/g, "&nbsp;"); }
  // 編集で書く中身(文字だけの所は文字を、それ以外は中の HTML)
  function now(p) {
    if (!p.text) return p.e.innerHTML;
    var t = p.e.innerHTML;
    return p.e.style.fontSize ? '<span class="tefs" style="font-size: ' + p.e.style.fontSize + '">' + t + "</span>" : t;
  }
  // ファイルの中で、節(id="節" から次の <section まで)の中の old の場所を全部返す
  // whole: 要素の中身まるごと(前が > 後ろが <)の所だけ数える(「ここまで」が「ここまでで出来る事」の中で見つかる等を外す)
  function places(src, sec, old, whole) {
    // 節の始めのタグ(<section … >)の中は探さない(data-title に同じ文字が有るので)
    var a = sec === "-" ? 0 : src.indexOf('id="' + sec + '"'), pos = [];
    if (a < 0 || old === "") return pos;
    if (sec !== "-") a = src.indexOf(">", a) + 1;
    var b = src.indexOf("<section", a + 1);
    if (b < 0) b = src.length;
    for (var i = src.indexOf(old, a); i >= 0 && i + old.length <= b; i = src.indexOf(old, i + 1)) {
      if (whole && (src.charAt(i - 1) !== ">" || src.charAt(i + old.length) !== "<")) continue;
      pos.push(i);
    }
    return pos;
  }
  async function start() {
    var fh = await getDir(), src = await (await fh.getFile()).text();
    var raw = new DOMParser().parseFromString(src, "text/html");
    var rmap = {}, same = {};
    // 同じ節の中で同じ中身の物が何番目か(保存の時に、ファイルの中のどれを入れ替えるか決める)
    cands(raw).forEach(function (c) {
      var sk = c.key.split("/")[0] + "\n" + c.e.innerHTML;
      same[sk] = (same[sk] || 0) + 1;
      rmap[c.key] = { e: c.e, nth: same[sk] - 1, total: 0, sk: sk };
    });
    Object.keys(rmap).forEach(function (k) { rmap[k].total = same[rmap[k].sk]; });
    pairs = [];
    var rc = cands(raw), lc = cands(document), ok = {};
    lc.forEach(function (c) {
      var r = rmap[c.key];
      if (!r || norm(r.e.textContent) !== norm(c.e.textContent)) return;
      // ファイルの書き方が読み直した形と違う物(タグの途中で改行している等)は、保存できないので編集しない(中の文字だけを下の文字だけの所で編集する)
      if (places(src, c.key.split("/")[0], r.e.innerHTML, true).length !== r.total) return;
      ok[c.key] = true;
      c.e.setAttribute("data-te", "");
      c.e.contentEditable = "true";
      pairs.push({ e: c.e, old: r.e.innerHTML, sec: c.key.split("/")[0], nth: r.nth, total: r.total });
    });
    // 文字だけの所: 今のページでは span で包んで編集する(終わる時に元の文字に戻す)。ファイルの中で節に 1 か所だけの物
    var rt = {};
    var isOk = function (c) { return ok[c.key]; };
    texts(raw, rc.filter(isOk)).forEach(function (x) { rt[x.key] = x.s; });
    texts(document, lc.filter(isOk)).forEach(function (x) {
      var sec = x.key.split("/")[0], old = esc(x.s), pe = x.n.parentElement;
      // 前に大きさを付けて保存した文字(span.tefs の中に文字だけ)は、その span ごと編集する
      if (pe.classList.contains("tefs") && pe.childNodes.length === 1 && !pairs.some(function (q) { return q.e.contains(pe); })) {
        var o2 = '<span class="tefs" style="' + pe.getAttribute("style") + '">' + old + "</span>";
        if (rt[x.key] !== x.s || places(src, sec, o2).length !== 1) return;
        pe.setAttribute("data-te", "");
        pe.contentEditable = "true";
        pairs.push({ e: pe, old: o2, sec: sec, nth: 0, total: 1, text: true });
        return;
      }
      if (rt[x.key] !== x.s || places(src, sec, old).length !== 1) return;
      var v = x.n.nodeValue, i = v.indexOf(x.s), sp = document.createElement("span");
      sp.textContent = x.s;
      var pa = x.n.parentNode;
      if (i > 0) pa.insertBefore(document.createTextNode(v.slice(0, i)), x.n);
      pa.insertBefore(sp, x.n);
      if (i + x.s.length < v.length) pa.insertBefore(document.createTextNode(v.slice(i + x.s.length)), x.n);
      pa.removeChild(x.n);
      sp.setAttribute("data-te", "");
      sp.contentEditable = "true";
      pairs.push({ e: sp, old: old, sec: sec, nth: 0, total: 1, text: true });
    });
    // 目次などと同じ並び(ページの上から)にする(Tab で次へ の順番)
    pairs.sort(function (a, b) { return a.e.compareDocumentPosition(b.e) & 4 ? -1 : 1; });
    on = true;
    document.body.classList.add("textEditing");
    btn.classList.add("on");
    btn.textContent = "編集を終わる";
    saveBtn.style.display = "";
    msg("文字を押して書き換えます(" + pairs.length + " か所)。Enter で改行、Tab で次へ(Shift+Tab で前へ)。大きさは上に出る A− / A+(Alt+↓ / Alt+↑)。文字を選ぶと選んだ所だけ。書き換えた所は黄色。最後に「保存」");
  }
  function stop() {
    pairs.forEach(function (p) {
      if (p.text) {
        var tn = document.createTextNode(p.e.textContent), pa = p.e.parentNode;
        if (p.e.style.fontSize) { p.e.removeAttribute("data-te"); p.e.removeAttribute("contenteditable"); p.e.classList.remove("teChanged"); p.e.className = "tefs"; return; }
        if (p.e.children.length) { unwrap(p.e); return; }
        pa.replaceChild(tn, p.e); pa.normalize(); return;
      }
      p.e.removeAttribute("data-te"); p.e.removeAttribute("contenteditable"); p.e.classList.remove("teChanged");
    });
    on = false; cur = null; fsShow();
    document.body.classList.remove("textEditing");
    btn.classList.remove("on");
    btn.textContent = "文字を編集";
    saveBtn.style.display = "none";
  }
  function changed() { return pairs.filter(function (p) { return now(p) !== p.old; }); }
  async function save() {
    var ch = changed();
    if (!ch.length) { msg("書き換えた所はありません"); return; }
    var fh = await getDir(), file = await fh.getFile(), src = await file.text();
    // 書き換えた所を、ファイルの中の元の文字と入れ替える。探すのはその節の中(id="節" から次の <section まで)だけで、
    // 節の中の同じ中身の物の何番目かで決める。数が合わない(開いた後にファイルが変わった等)物は書かない
    var miss = [], reps = [];
    ch.forEach(function (p) {
      var pos = places(src, p.sec, p.old, !p.text);
      if (pos.length !== p.total) { p.miss = true; miss.push(norm(p.e.textContent).slice(0, 20)); return; }
      p.miss = false;
      reps.push({ i: pos[p.nth], n: p.old.length, s: now(p) });
      // 節の見出し(h2)を直した時は、目次に出す data-title も同じ文字にする
      var h = p.e.closest("h2"), sec = h && h.closest("section[id]");
      if (sec && sec.id === p.sec && sec.querySelector("h2") === h && norm(h.textContent)) {
        var a2 = src.lastIndexOf("<section", src.indexOf('id="' + p.sec + '"')), b2 = src.indexOf(">", a2), tag = src.slice(a2, b2);
        var m = /data-title="[^"]*"/.exec(tag);
        if (m) reps.push({ i: a2 + m.index, n: m[0].length, s: 'data-title="' + norm(h.textContent).replace(/&/g, "&amp;").replace(/"/g, "&quot;") + '"' });
        sec.setAttribute("data-title", norm(h.textContent));
      }
    });
    reps.sort(function (x, y) { return y.i - x.i; });
    var out = src;
    reps.forEach(function (r) { out = out.slice(0, r.i) + r.s + out.slice(r.i + r.n); });
    var done = ch.length - miss.length;
    if (!done) { msg("保存できませんでした(元の文字がファイルの中で見つからない): " + miss.join(" / "), true); return; }
    var bk = await writeIndex(fh, file, src, out);
    // 保存した所は、今の中身を元にする(同じ節の数え方は変わらない様に、保存の後は一度終わって開き直すのが確か)
    ch.forEach(function (p) { if (!p.miss) { p.old = now(p); p.e.classList.remove("teChanged"); } });
    stop();
    await start();
    msg(done + " か所を保存しました(前の版: " + bk + ")" + (miss.length ? "\n保存できなかった所: " + miss.join(" / ") : ""), miss.length > 0);
  }
  btn.addEventListener("click", function () {
    if (on) { if (changed().length && !confirm("保存していない書き換えがあります。保存しないで終わりますか？")) return; stop(); return; }
    start().catch(function (e) { msg(e.name === "AbortError" ? "フォルダを選ばなかったので、やめました" : e.message, true); });
  });
  saveBtn.addEventListener("click", function () { save().catch(function (e) { msg("保存できませんでした: " + e.message, true); }); });
  document.addEventListener("input", function (ev) {
    var t = ev.target.closest && ev.target.closest("[data-te]");
    if (!t) return;
    var p = pairs.filter(function (x) { return x.e === t; })[0];
    if (p) t.classList.toggle("teChanged", now(p) !== p.old);
  });
  // Enter は改行(<br>)。Tab で次の所へ、Shift+Tab で前の所へ。貼り付けは文字だけ
  document.addEventListener("keydown", function (ev) {
    var t = ev.target.closest && ev.target.closest("[data-te]");
    if (t && ev.altKey && (ev.key === "ArrowUp" || ev.key === "ArrowDown")) {
      ev.preventDefault();
      var q = pairs.filter(function (x) { return x.e === t; })[0];
      if (q) fsSet(q, ev.key === "ArrowUp" ? 2 : -2);
      return;
    }
    if (!t || ev.isComposing) return;
    if (ev.key === "Enter") {
      ev.preventDefault();
      document.execCommand("insertLineBreak");
      var q2 = pairs.filter(function (x) { return x.e === t; })[0];
      if (q2) t.classList.toggle("teChanged", now(q2) !== q2.old);
      return;
    }
    if (ev.key !== "Tab") return;
    ev.preventDefault();
    var i = pairs.map(function (x) { return x.e; }).indexOf(t), n = pairs[i + (ev.shiftKey ? -1 : 1)];
    if (n) n.e.focus(); else t.blur();
  });
  document.addEventListener("paste", function (ev) {
    var t = ev.target.closest && ev.target.closest("[data-te]");
    if (!t) return;
    ev.preventDefault();
    document.execCommand("insertText", false, (ev.clipboardData.getData("text/plain") || "").replace(/\s*\n\s*/g, " "));
  });
  addEventListener("beforeunload", function (ev) { if (on && changed().length) { ev.preventDefault(); ev.returnValue = ""; } });
})();
