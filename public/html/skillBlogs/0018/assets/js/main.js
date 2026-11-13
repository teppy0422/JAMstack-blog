// ---- 必要時間(分)。null = まだ入れていない(画面では「要入力」)。basis = 何あたりの時間か ----
var TIMES = {
  imp: {
    name: "2-1.データの取り込み",
    before: null,
    after: null,
    basis: "1 製品あたり",
  },
  cav: {
    name: "2-3.コネクタ座標の登録",
    before: null,
    after: null,
    basis: "1 品番あたり",
  },
  jig: {
    name: "2-6.治具座標の登録",
    before: null,
    after: null,
    basis: "1 治具あたり",
  },
  sub: {
    name: "2-8.サブ立案",
    before: null,
    after: null,
    basis: "1 治具あたり",
  },
  hame: {
    name: "2-4.ハメ図・サブ図の作成",
    before: null,
    after: null,
    basis: "1 製品あたり",
  },
  ssc: {
    name: "3-2.先ハメ誘導",
    before: null,
    after: null,
    basis: "1 サブあたり",
  },
  navi: {
    name: "2-7.配索誘導",
    before: null,
    after: null,
    basis: "1 製品あたり",
  },
  verup: {
    name: "4-1.バージョンアップ",
    before: 10,
    after: null,
    basis: "1 冊あたり",
  },
};
var KEY = "sjpBlogTimes";
// index.html に保存した時間(<script id="sjpTimes">。「入力を終わる」で flow_clock.js が書く)。この上にブラウザの中の保存していない分を重ねる
try {
  var fd = JSON.parse(document.getElementById("sjpTimes").textContent || "{}").times || {};
  Object.keys(fd).forEach(function (k) {
    if (TIMES[k])
      ["before", "after", "basis"].forEach(function (f) {
        if (f in fd[k]) TIMES[k][f] = fd[k][f];
      });
  });
} catch (e) {}
try {
  var sv = JSON.parse(localStorage.getItem(KEY) || "{}");
  Object.keys(sv).forEach(function (k) {
    if (TIMES[k])
      ["before", "after", "basis"].forEach(function (f) {
        if (f in sv[k]) TIMES[k][f] = sv[k][f];
      });
  });
} catch (e) {}
function save() {
  try {
    var o = {};
    Object.keys(TIMES).forEach(function (k) {
      o[k] = {
        before: TIMES[k].before,
        after: TIMES[k].after,
        basis: TIMES[k].basis,
      };
    });
    localStorage.setItem(KEY, JSON.stringify(o));
  } catch (e) {}
}
function has(v) {
  return typeof v === "number" && isFinite(v);
}
function fmt(v) {
  return has(v) ? (Math.round(v * 10) / 10).toLocaleString("ja-JP") : "";
}
function render() {
  [].forEach.call(document.querySelectorAll("[data-t]"), function (el) {
    if (document.activeElement === el) return;
    var p = el.getAttribute("data-t").split("."),
      v = TIMES[p[0]][p[1]];
    el.textContent = has(v) ? fmt(v) : "要入力";
    el.classList.toggle("empty", !has(v));
    el.nextElementSibling.style.display = has(v) ? "" : "none";
  });
  [].forEach.call(
    document.querySelectorAll("[data-gain]"),
    function (el) {
      var t = TIMES[el.getAttribute("data-gain")],
        b = t.before,
        a = t.after;
      if (!has(b) || !has(a) || b <= 0) {
        el.innerHTML = "<span>" + t.basis + "</span>";
        return;
      }
      var m = Math.max(b, a),
        cut = Math.round(((b - a) / b) * 100);
      el.innerHTML =
        '<div class="bars"><div class="bar b" style="width:' +
        (b / m) * 100 +
        '%"></div><div class="bar a" style="width:' +
        (a / m) * 100 +
        '%"></div></div>' +
        '<span class="big">' +
        (cut >= 0 ? "−" + cut + "%" : "+" + -cut + "%") +
        "</span><span>" +
        t.basis +
        "<br>" +
        fmt(b - a) +
        " 分の短縮</span>";
    },
  );
  var rows =
      "<tr><th>機能</th><th>単位</th><th>変更前</th><th>変更後</th><th>短縮</th><th>削減</th></tr>",
    tb = 0,
    ta = 0,
    all = true;
  Object.keys(TIMES).forEach(function (k) {
    var t = TIMES[k],
      ok = has(t.before) && has(t.after);
    if (ok) {
      tb += t.before;
      ta += t.after;
    } else all = false;
    var cut =
      ok && t.before > 0
        ? Math.round(((t.before - t.after) / t.before) * 100)
        : null;
    rows +=
      "<tr><td>" +
      t.name +
      '</td><td style="font-size:12px;color:var(--soft)">' +
      t.basis +
      "</td>" +
      '<td class="' +
      (has(t.before) ? "" : "na") +
      '">' +
      (has(t.before) ? fmt(t.before) + " 分" : "要入力") +
      "</td>" +
      '<td class="' +
      (has(t.after) ? "af" : "na") +
      '">' +
      (has(t.after) ? fmt(t.after) + " 分" : "要入力") +
      "</td>" +
      '<td class="cut">' +
      (ok ? fmt(t.before - t.after) + " 分" : "") +
      '</td><td class="cut">' +
      (cut !== null ? cut + "%" : "") +
      "</td></tr>";
  });
  var tc = tb > 0 ? Math.round(((tb - ta) / tb) * 100) : null;
  rows +=
    '<tr class="total"><td>合計' +
    (all
      ? ""
      : '<span style="font-size:12px;color:var(--warn);font-weight:400"> (入力済みだけ)</span>') +
    "</td><td></td><td>" +
    (tb ? fmt(tb) + " 分" : "") +
    '</td><td class="af">' +
    (tb ? fmt(ta) + " 分" : "") +
    '</td><td class="cut">' +
    (tb ? fmt(tb - ta) + " 分" : "") +
    '</td><td class="cut">' +
    (tc !== null ? tc + "%" : "") +
    "</td></tr>";
  // 6.必要時間のまとめ は消したので、表が無い時は何もしない
  if (!document.getElementById("sumTable")) return;
  document.getElementById("sumTable").innerHTML = rows;
  document.getElementById("sumLead").textContent =
    "機能ごとの必要時間(変更前 → 変更後)です。時間はそれぞれの「単位」あたりで、単位の違う物も足しているので、合計は目安です。" +
    (all ? "" : " まだ入っていない所があります。");
}
// 目次(右)。見ている節を太字に
var secs = [].slice.call(document.querySelectorAll(".sec")),
  toc = document.getElementById("toc");
// 「ここまでで出来る事」の枠(.reachzone)の中の節は、本文と同じ [ の線でまとめる(.canbox)
var tocBox = null, tocZone = null;
secs.forEach(function (s) {
  var a = document.createElement("a");
  a.href = "#" + s.id;
  a.textContent = s.getAttribute("data-title");
  if (s.classList.contains("sm")) a.className = "sub";
  if (s.classList.contains("st")) a.className = "stage";
  if (s.classList.contains("sm") && s.closest(".subs") && s.closest(".subs").querySelector(".sec.st")) a.className = "sub sub2";
  var z = s.closest(".reachzone");
  if (!z) { tocBox = tocZone = null; toc.appendChild(a); return; }
  if (z !== tocZone) {
    tocZone = z; tocBox = document.createElement("div"); tocBox.className = "canbox";
    tocBox.innerHTML = '<span class="canhd">ここまでで出来る事</span>';
    toc.appendChild(tocBox);
  }
  a.className = "can"; tocBox.appendChild(a);
});
function onScroll() {
  var cur = secs[0];
  secs.forEach(function (s) {
    if (s.getBoundingClientRect().top < 120) cur = s;
  });
  [].forEach.call(toc.querySelectorAll("a"), function (a) {
    a.classList.toggle("on", a.getAttribute("href") === "#" + cur.id);
  });
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();
// 右から説明
function openDr(k) {
  var t = document.getElementById("dr-" + k);
  if (!t) return;
  document.getElementById("drbody").innerHTML = t.innerHTML;
  document.getElementById("drawer").classList.add("on");
  document.getElementById("shade").classList.add("on");
}
function closeDr() {
  document.getElementById("drawer").classList.remove("on");
  document.getElementById("shade").classList.remove("on");
  document.getElementById("drbody").innerHTML = "";
}
[].forEach.call(document.querySelectorAll(".dr"), function (e) {
  e.addEventListener("click", function () {
    openDr(e.getAttribute("data-dr"));
  });
});
document.getElementById("shade").onclick = closeDr;
document.querySelector("#drawer .x").onclick = closeDr;
addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeDr();
});
// 必要時間の入力
function toggleEdit() {
  var on = !document.body.classList.contains("editing");
  document.body.classList.toggle("editing", on);
  document.getElementById("edit").classList.toggle("on", on);
  document.getElementById("edit").textContent = on
    ? "入力を終わる"
    : "必要時間を入力";
  [].forEach.call(document.querySelectorAll("[data-t]"), function (el) {
    el.contentEditable = on ? "true" : "false";
  });
  if (!on && document.activeElement) document.activeElement.blur();
}
document.getElementById("edit").onclick = toggleEdit;
document.getElementById("pins").onclick = function () {
  var on = document.body.classList.toggle("nopins");
  this.textContent = on ? "画面の番号を出す" : "画面の番号を隠す";
};
document.getElementById("print").onclick = function () {
  window.print();
};
[].forEach.call(document.querySelectorAll("[data-t]"), function (el) {
  el.addEventListener("focus", function () {
    if (el.classList.contains("empty")) el.textContent = "";
    el.classList.remove("empty");
    var r = document.createRange();
    r.selectNodeContents(el);
    var s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
  });
  el.addEventListener("blur", function () {
    var p = el.getAttribute("data-t").split("."),
      txt = el.textContent
        .replace(/[０-９．]/g, function (c) {
          return String.fromCharCode(c.charCodeAt(0) - 0xfee0);
        })
        .replace(/[^\d.]/g, "");
    TIMES[p[0]][p[1]] = txt === "" ? null : +txt;
    save();
    render();
  });
  el.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      var list = [].slice.call(document.querySelectorAll("[data-t]")),
        i = list.indexOf(el);
      el.blur();
      if (list[i + 1]) list[i + 1].focus();
    } else if (e.key === "Escape") el.blur();
  });
});
// 操作できる見本: 覆いを押すと操作を始める
[].forEach.call(document.querySelectorAll(".live"), function (lv) {
  var fr = lv.querySelector("iframe");
  var focusIn = function () {
    try {
      fr.contentWindow.focus();
    } catch (e) {}
  };
  // 中のページは押した時の決まった動きを止める(ドラッグの為)ので、入力先が中に移らない。押したら中へ移す(Delete・矢印・A など)
  // 中でページが変わる時(配索誘導ナビのヘッダーを押してサブ一覧へ 等)、新しいページの scrollIntoView や focus で
  // 資料の画面までスクロールしてしまう。ページが変わる間(読み込み後 1 秒まで)は 資料の位置を元に戻す。
  // 自分でスクロールした時(ホイール・キー・タッチ・押す)と、資料のボタンで開いた時(lv.sjpNoLock)はやめる
  var lock = null;
  window.addEventListener("scroll", function () {
    if (!lock || Date.now() >= lock.t || Math.abs(window.scrollY - lock.y) <= 1) return;
    // html の scroll-behavior: smooth だと戻すのが遅れるので、その間だけ止める(Chrome 109 でも動く書き方)
    var de = document.documentElement, sb = de.style.scrollBehavior;
    de.style.scrollBehavior = "auto"; window.scrollTo(0, lock.y); de.style.scrollBehavior = sb;
  });
  ["wheel", "keydown", "touchstart", "mousedown"].forEach(function (ev) {
    window.addEventListener(ev, function () { lock = null; }, true);
  });
  var hook = function () {
    try {
      fr.contentDocument.addEventListener("mousedown", focusIn, true);
      fr.contentWindow.addEventListener("pagehide", function () {
        if (lv.sjpNoLock && Date.now() < lv.sjpNoLock) return;
        lock = { y: window.scrollY, t: Date.now() + 5000 };
      });
    } catch (e) {}
  };
  if (fr.contentDocument && fr.contentDocument.readyState === "complete")
    hook();
  fr.addEventListener("load", function () {
    if (lock) lock.t = Math.min(lock.t, Date.now() + 1000);
    hook();
  });
  // 中のページが自分で入力欄に入力先を移す(配索誘導ナビは QR の為に 0.5 秒ごとに検索欄へ戻す)と、資料の入力中でも入力先を取られて、その枠まで画面が飛ぶ。
  // 中のページの focus() は、入力先がもう この枠の中に有る時(操作している時)だけ効かせる。ページが読み直されても付け直す
  var guard = function () {
    try {
      var P = fr.contentWindow.HTMLElement.prototype;
      if (P.sjpFocusGuard) return;
      var f = P.focus;
      P.focus = function () {
        if (document.activeElement !== fr) return;
        // 操作中でも、中のページが入力先を移した時に 資料の画面が その枠までスクロールしない様にする
        return f.call(this, { preventScroll: true });
      };
      P.sjpFocusGuard = true;
    } catch (e) {}
  };
  guard();
  setInterval(guard, 100);
  lv.querySelector(".livecover").addEventListener("click", function () {
    lv.classList.add("on");
    focusIn();
  });
});
// モーダル: data-modal の言葉を押すと開く。× か 外側 か Esc で閉じる
function openModal() {
  document.getElementById("modal").classList.add("on");
}
function closeModal() {
  var m = document.getElementById("modal");
  if (m) m.classList.remove("on");
}
[].forEach.call(document.querySelectorAll("[data-modal]"), function (e) {
  e.addEventListener("click", openModal);
});
// (コネクタ登録状況はモーダルをやめて本文に出したので、#modal が無い時は何もしない)
if (document.getElementById("modal")) {
  document
    .querySelector("#modal .mx")
    .addEventListener("click", closeModal);
  document.getElementById("modal").addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });
}
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});
// 目次の幅: 境目をドラッグで変える(0～600px。0 で目次を隠す)。ダブルクリックで元(240px)。ブラウザに覚える
(function () {
  var sp = document.querySelector(".tocsplit"),
    root = document.documentElement,
    KEYW = "sjpBlogTocW";
  var setW = function (w) {
    w = Math.max(0, Math.min(600, Math.round(w)));
    root.style.setProperty("--tocw", w + "px");
    // 狭い時は目次の文字を枠からはみ出させない。0 の時は目次を隠す(境目は残すのでドラッグで戻せる)
    root.classList.toggle("tocnarrow", w < 160);
    root.classList.toggle("tochidden", w === 0);
    return w;
  };
  try {
    var w0 = localStorage.getItem(KEYW);
    if (w0 !== null && w0 !== "" && !isNaN(+w0)) setW(+w0);
  } catch (e) {}
  sp.addEventListener("mousedown", function (e) {
    e.preventDefault();
    sp.classList.add("drag");
    document.body.classList.add("resizing");
    var move = function (ev) {
      setW(document.documentElement.clientWidth - ev.clientX - 16 - 7);
    };
    var up = function () {
      sp.classList.remove("drag");
      document.body.classList.remove("resizing");
      removeEventListener("mousemove", move);
      removeEventListener("mouseup", up);
      try {
        localStorage.setItem(
          KEYW,
          parseInt(getComputedStyle(root).getPropertyValue("--tocw"), 10),
        );
      } catch (e) {}
    };
    addEventListener("mousemove", move);
    addEventListener("mouseup", up);
  });
  sp.addEventListener("dblclick", function () {
    root.style.removeProperty("--tocw");
    root.classList.remove("tocnarrow", "tochidden");
    try {
      localStorage.removeItem(KEYW);
    } catch (e) {}
  });
})();
// 略図だけの見本: 「略図から読む」= 中の Ctrl+Shift+E と同じ(確認してから置く)
[].forEach.call(document.querySelectorAll(".liveemf"), function (b) {
  b.addEventListener("click", function () {
    var lv = b.closest(".live"),
      w = lv.querySelector("iframe").contentWindow;
    lv.classList.add("on");
    try {
      w.focus();
      w.demoEmfRead();
    } catch (e) {}
  });
});
render();

// 4-2: 先ハメ誘導ナビの 2nd ディスプレイの枠。SSC が 2nd を開いた(この枠に読み込んだ)時に出す
[].forEach.call(document.querySelectorAll(".ssc2nd iframe"), function (fr) {
  fr.addEventListener("load", function () {
    var blank = false;
    try {
      blank = fr.contentWindow.location.href === "about:blank";
    } catch (e) {}
    if (!blank) fr.parentNode.hidden = false;
  });
});
// クリックで再生・もう一度クリックで止める動画(.vidclick)。最後まで行ったら止まって「クリックで再生」に戻る。下のバーは再生位置(押すとそこへ飛ぶ)
[].forEach.call(document.querySelectorAll(".vidclick"), function (w) {
  var v = w.querySelector("video"), bar = w.querySelector(".vidbar"), fill = bar && bar.querySelector("i");
  if (!v) return;
  w.addEventListener("click", function (e) {
    if (bar && bar.contains(e.target)) return;
    if (v.paused) { if (v.ended) v.currentTime = 0; v.play(); } else v.pause();
  });
  v.addEventListener("play", function () { w.classList.add("playing"); });
  v.addEventListener("pause", function () { w.classList.remove("playing"); });
  v.addEventListener("ended", function () { w.classList.remove("playing"); });
  function draw() { if (fill && v.duration) fill.style.width = (v.currentTime / v.duration) * 100 + "%"; }
  v.addEventListener("timeupdate", draw);
  v.addEventListener("seeked", draw);
  // timeupdate は 4 回/秒くらいなので、再生中は毎フレーム描く(バーを滑らかに)
  v.addEventListener("play", function loop() { draw(); if (!v.paused) requestAnimationFrame(function () { loop(); }); });
  if (bar) bar.addEventListener("click", function (e) {
    var r = bar.getBoundingClientRect();
    if (v.duration) { v.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * v.duration; draw(); }
  });
});
// 2-7 配索誘導ナビの下のボタン(.navijump の data-navi="0038"): 上の見本でそのページを開く(index.html と同じフォルダ)
[].forEach.call(document.querySelectorAll(".navijump"), function (bx) {
  var lv = document.getElementById(bx.getAttribute("data-live")), fr = lv && lv.querySelector("iframe");
  if (!fr) return;
  var base = fr.getAttribute("src").replace(/[^\/]*$/, "");
  bx.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-navi]");
    if (!b) return;
    // 押してもスクロールしない(上の見本の中身だけ変える。ページが変わる間の位置も 上の lock で元に戻す)
    fr.src = base + b.getAttribute("data-navi") + ".html";
    lv.classList.add("on");
    [].forEach.call(bx.querySelectorAll("button"), function (x) { x.classList.toggle("on", x === b); });
  });
});
// 2-1: フォルダの画像の行(.needpt data-n)から、ファイル一覧の同じ番号(.neednum data-n)へ線を引く。大きさが変わったら引き直す
[].forEach.call(document.querySelectorAll(".needwrap.needlink"), function (w) {
  var NS = "http://www.w3.org/2000/svg", sv = document.createElementNS(NS, "svg");
  sv.setAttribute("class", "needlinksvg");
  w.appendChild(sv);
  function draw() {
    var o = w.getBoundingClientRect(), h = "";
    [].forEach.call(w.querySelectorAll(".needpt"), function (p) {
      // data-n="1,2" の様に 2 つ以上の時は、1 本の線を [ の形で分けて それぞれの番号へ
      var bs = p.getAttribute("data-n").split(",").map(function (n) {
        // 行き先は 画像の上の番号(.neednum)か、右の説明の行(li。番号は li の左の丸)
        return w.querySelector('.neednum[data-n="' + n + '"], .needlist li[data-n="' + n + '"]');
      }).filter(Boolean);
      if (!bs.length) return;
      var a = p.getBoundingClientRect(), x1 = a.left - o.left + 4, y1 = a.top - o.top;
      var ys = bs.map(function (b) {
        var r = b.getBoundingClientRect();
        if (b.tagName === "LI") return r.top + parseFloat(getComputedStyle(b).fontSize) * 0.2 + 13 - o.top;
        return r.top + r.height / 2 - o.top;
      });
      var x2 = bs[0].getBoundingClientRect().left - o.left;
      h += '<circle cx="' + x1 + '" cy="' + y1 + '" r="3"></circle>';
      if (bs.length === 1) {
        var m = (x1 + x2) / 2, y2 = ys[0];
        h += '<path d="M' + x1 + " " + y1 + " C" + m + " " + y1 + " " + m + " " + y2 + " " + x2 + " " + y2 + '"></path>';
        return;
      }
      var top = Math.min.apply(null, ys), bot = Math.max.apply(null, ys), ym = (top + bot) / 2, xb = x2 - 14, mm = (x1 + xb) / 2;
      h += '<path d="M' + x1 + " " + y1 + " C" + mm + " " + y1 + " " + mm + " " + ym + " " + xb + " " + ym + '"></path>';
      h += '<path d="M' + x2 + " " + top + " H" + xb + " V" + bot + " H" + x2 + '"></path>';
    });
    sv.innerHTML = h;
  }
  draw();
  window.addEventListener("load", draw);
  if (window.ResizeObserver) new ResizeObserver(draw).observe(w);
});

// コネクタ写真の共用の図(.shareflow): クリックで動きを 開始/停止。止まっている時は他と同じ覆い「クリックで再生」
//   .sf-v: 上にサーバー、下に工場。工場A がアップ → サーバー → 他の工場が使う、次は工場B … を順に繰り返す
document.querySelectorAll(".shareflow").forEach(function (sf) {
  var h = document.createElement("div");
  h.className = "livecover sf-cover";
  h.textContent = "クリックで再生";
  sf.appendChild(h);
  if (!sf.classList.contains("sf-v")) {
    sf.addEventListener("click", function () { sf.classList.toggle("sf-play"); });
    return;
  }
  var stage = sf.querySelector(".sf-stage"), srv = sf.querySelector(".sf-srv"), lines = sf.querySelector(".sf-lines");
  var facs = [].slice.call(sf.querySelectorAll(".sf-fac"));
  var cam = '<svg viewBox="0 0 24 24"><path d="M3 7h4l2-3h6l2 3h4v13H3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
  // data-ver があればバージョンアップの図: 飛ぶ印は「Ver 番号」、工場が 1 つアップする度に番号を 1 つ上げる
  var ver = sf.getAttribute("data-ver"), upT = sf.getAttribute("data-up") || "撮影してアップ", getT = sf.getAttribute("data-get") || "そのまま使える", vNo = 0;
  function vtxt(t) {
    if (!ver) return t;
    var p = ver.split("."); p[p.length - 1] = +p[p.length - 1] + vNo;
    return t.replace("{v}", p.join("."));
  }
  var run = 0, timers = [];
  function pt(el, top) {
    var s = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: (top ? r.top : r.bottom) - s.top };
  }
  function drawLines() {
    var a = pt(srv, false);
    lines.innerHTML = facs.map(function (f) {
      var b = pt(f, true), m = (a.y + b.y) / 2;
      return '<path d="M' + a.x + ' ' + a.y + ' C' + a.x + ' ' + m + ' ' + b.x + ' ' + m + ' ' + b.x + ' ' + b.y + '"/>';
    }).join("");
  }
  function wait(ms) { return new Promise(function (ok) { timers.push(setTimeout(ok, ms)); }); }
  // 写真のマークを from → to へ飛ばす(色は 撮影 = 橙 → 共用 = 青 → 使う = 緑)
  function fly(from, to, c1, c2) {
    var p = document.createElement("div");
    p.className = ver ? "sf-pkt sf-pver" : "sf-pkt";
    p.innerHTML = ver ? vtxt("Ver {v}") : cam;
    stage.appendChild(p);
    var hw = p.offsetWidth / 2, hh = p.offsetHeight / 2;
    var mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
    var an = p.animate([
      { transform: "translate(" + (from.x - hw) + "px," + (from.y - hh) + "px)", background: c1, opacity: 0 },
      { transform: "translate(" + (mid.x - hw) + "px," + (mid.y - hh) + "px)", background: c1, opacity: 1, offset: 0.4 },
      { transform: "translate(" + (to.x - hw) + "px," + (to.y - hh) + "px)", background: c2, opacity: 1 }
    ], { duration: 1100, easing: "ease-in-out", fill: "forwards" });
    return an.finished.then(function () { p.remove(); }, function () { p.remove(); });
  }
  function clear() {
    facs.forEach(function (f) { f.classList.remove("up", "get"); f.querySelector(".sf-st").textContent = ""; });
    srv.classList.remove("hit");
    [].forEach.call(lines.querySelectorAll("path"), function (l) { l.setAttribute("class", ""); });
  }
  function loop(id) {
    var css = getComputedStyle(sf), cO = css.getPropertyValue("--sf-o"), cA = css.getPropertyValue("--sf-a"), cG = css.getPropertyValue("--sf-g");
    var k = 0;
    function phase() {
      if (id !== run) return;
      drawLines(); clear();
      var up = facs[k], paths = lines.querySelectorAll("path");
      up.classList.add("up"); up.querySelector(".sf-st").textContent = vtxt(upT);
      paths[k].setAttribute("class", "on");
      wait(500).then(function () {
        if (id !== run) return;
        return fly(pt(up, true), pt(srv, false), cO, cA);
      }).then(function () {
        if (id !== run) return;
        srv.classList.add("hit");
        return wait(450);
      }).then(function () {
        if (id !== run) return;
        srv.classList.remove("hit");
        return Promise.all(facs.map(function (f, j) {
          if (j === k) return null;
          paths[j].setAttribute("class", "get");
          return fly(pt(srv, false), pt(f, true), cA, cG).then(function () {
            if (id !== run) return;
            f.classList.add("get"); f.querySelector(".sf-st").textContent = vtxt(getT);
          });
        }));
      }).then(function () {
        if (id !== run) return;
        return wait(1600);
      }).then(function () {
        if (id !== run) return;
        k = (k + 1) % facs.length; vNo++;
        phase();
      });
    }
    phase();
  }
  function stop() {
    run++;
    timers.forEach(clearTimeout); timers = [];
    [].forEach.call(stage.querySelectorAll(".sf-pkt"), function (p) { p.getAnimations().forEach(function (a) { a.cancel(); }); p.remove(); });
    clear();
  }
  drawLines();
  window.addEventListener("load", drawLines);
  if (window.ResizeObserver) new ResizeObserver(drawLines).observe(stage);
  sf.addEventListener("click", function () {
    if (sf.classList.toggle("sf-play")) { stop(); vNo = 0; loop(run); } else stop();
  });
});

// 2-5 ポイント一覧への入力の動き(.ptanim): Excel の連番を再現。端末ごとに
//   先頭(Cav1)に数字を打つ → Ctrl を押しながら右下の ■ を下へ引っぱる(数字が付いて来る) → 離すと連番が入る → 次の端末へスクロール
// 終わったら「何回の操作で何点」を出して「クリックで再生」に戻る。再生中にクリックで止めて最初に戻す
document.querySelectorAll(".ptanim").forEach(function (w) {
  var box = w.querySelector(".pt-scroll"), step = w.querySelector(".pt-step"), step0 = step.innerHTML;
  function mk(cls, html) { var d = document.createElement("div"); d.className = cls; if (html) d.innerHTML = html; return d; }
  var sel = mk("pt-sel"), tip = mk("pt-tip"), key = mk("pt-key", "Ctrl"),
    mouse = mk("pt-mouse", '<svg viewBox="0 0 22 22"><path d="M3 2v16l4.5-4 3 6.5 2.6-1.2-3-6.4H16z" fill="#fff" stroke="#000" stroke-width="1.3" stroke-linejoin="round"/></svg>'),
    cover = mk("livecover pt-cover");
  cover.textContent = "クリックで再生";
  box.appendChild(sel); box.appendChild(tip); box.appendChild(mouse); w.appendChild(key); w.appendChild(cover);
  // 端末ごとのまとまり(tr の data-g)
  var groups = [];
  [].forEach.call(box.querySelectorAll("tbody tr"), function (tr) {
    var g = +tr.getAttribute("data-g");
    if (!groups[g]) { groups[g] = []; groups[g].start = +tr.getAttribute("data-start") || 0; tr.classList.add("gtop"); }
    groups[g].push(tr.querySelector("td.pt"));
  });
  var all = [].slice.call(box.querySelectorAll("td.pt, td.w2")), timers = [], headH = 50;
  var v0 = +w.getAttribute("data-start") || 1, ops = 0;
  function later(ms, f) { timers.push(setTimeout(f, ms)); }
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    all.forEach(function (c) { c.textContent = ""; c.classList.remove("fillin"); });
    sel.style.display = tip.style.display = mouse.style.display = key.style.display = "none";
    box.scrollTop = 0; step.innerHTML = step0;
  }
  function selTo(a, b) { // a〜b のセルを選んだ枠
    sel.style.display = "block";
    sel.style.left = a.offsetLeft - 1 + "px"; sel.style.top = a.offsetTop - 1 + "px";
    sel.style.width = a.offsetWidth - 1 + "px"; sel.style.height = b.offsetTop + b.offsetHeight - a.offsetTop - 1 + "px";
  }
  function mouseAt(x, y, drag) { mouse.style.display = "block"; mouse.classList.toggle("drag", !!drag); mouse.style.left = x + "px"; mouse.style.top = y + "px"; }
  function scrollTo(y, ms, done) { // なめらかにスクロール
    var y0 = box.scrollTop, t0 = performance.now();
    y = Math.max(0, Math.min(y, box.scrollHeight - box.clientHeight));
    (function f(now) { var k = Math.min(1, (now - t0) / ms); box.scrollTop = y0 + (y - y0) * (1 - Math.pow(1 - k, 3)); if (k < 1) requestAnimationFrame(f); else done(); })(t0);
  }
  function typeIn(c, v, done) { var n = 0; (function f() { c.textContent = v.slice(0, ++n); if (n < v.length) later(110, f); else later(250, done); })(); }
  function termNo(c) { return c.parentNode.children[3].textContent; }
  function block(g, v, done) {
    var cells = groups[g], a = cells[0];
    step.innerHTML = "端末 " + termNo(a) + " : Cav1 に <b>" + v + "</b> を入力";
    scrollTo(a.offsetTop - headH - 2 * a.offsetHeight, 600, function () {
      mouseAt(a.offsetLeft + a.offsetWidth / 2, a.offsetTop + 4);
      later(500, function () {
        selTo(a, a);
        typeIn(a, String(v), function () {
          ops++;
          var hx = a.offsetLeft + a.offsetWidth - 4;
          mouseAt(hx, a.offsetTop + a.offsetHeight - 4); // 右下の ■ へ
          step.innerHTML = "<b>Ctrl</b> を押しながら ■ を Cav" + cells.length + " まで下へ";
          later(550, function () {
            key.style.display = "block";
            var k = 0;
            later(300, function drag() {
              k++;
              var c = cells[k], y = c.offsetTop + c.offsetHeight - 4;
              selTo(a, c); mouseAt(hx, y, true);
              tip.style.display = "block"; tip.textContent = v + k;
              tip.style.left = hx + 16 + "px"; tip.style.top = y + 6 + "px";
              var under = c.offsetTop + c.offsetHeight - (box.scrollTop + box.clientHeight) + 3 * c.offsetHeight;
              if (under > 0) box.scrollTop += under; // 下の端まで来たら付いて行く
              if (k < cells.length - 1) later(70, drag);
              else later(250, function () { // 離す
                tip.style.display = key.style.display = "none";
                cells.forEach(function (c, i) { if (i) { c.textContent = v + i; c.classList.add("fillin"); } });
                step.innerHTML = "端末 " + termNo(a) + " : <b>" + cells.length + "</b> 点 入力完了";
                later(900, function () { done(v + cells.length); });
              });
            });
          });
        });
      });
    });
  }
  function run(g, v) {
    if (g >= groups.length) {
      var pts = groups.reduce(function (s, c) { return s + c.length; }, 0);
      sel.style.display = mouse.style.display = "none";
      step.innerHTML = "ポイントナンバーは連番なので<b>短時間</b>で入力が完了";
      later(4000, function () { w.classList.remove("play"); });
      return;
    }
    block(g, groups[g].start || v, function (nv) { run(g + 1, nv); }); // 端末の 1 行目に data-start があればその番号から
  }
  w.addEventListener("click", function () {
    var playing = w.classList.contains("play");
    reset();
    if (playing) { w.classList.remove("play"); return; }
    w.classList.add("play"); ops = 0;
    later(300, function () { run(0, v0); });
  });
});

// 3-1 SSC作業番号の入力の動き(.sscanim): 電線がある cav は最初 0。
//   誘導端末に 20 → 端末並びを Tab で右へ → 品番ごとに 0 の上へ作業番号を打つ(Enter で B が付く)
// 終わったら「何か所」を出して「クリックで再生」に戻る。再生中にクリックで止めて最初に戻す
document.querySelectorAll(".sscanim").forEach(function (w) {
  var box = w.querySelector(".ss-box"), step = w.querySelector(".pt-step"), step0 = step.innerHTML;
  function mk(cls, html) { var d = document.createElement("div"); d.className = cls; if (html) d.innerHTML = html; return d; }
  var sel = mk("pt-sel"), key = mk("pt-key"),
    mouse = mk("pt-mouse", '<svg viewBox="0 0 22 22"><path d="M3 2v16l4.5-4 3 6.5 2.6-1.2-3-6.4H16z" fill="#fff" stroke="#000" stroke-width="1.3" stroke-linejoin="round"/></svg>'),
    cover = mk("livecover pt-cover");
  cover.textContent = "クリックで再生";
  box.appendChild(sel); box.appendChild(mouse); w.appendChild(key); w.appendChild(cover);
  var guide = box.querySelector("td.g"), order = [].slice.call(box.querySelectorAll("td.o")),
    cols = [[].slice.call(box.querySelectorAll("td.k1")), [].slice.call(box.querySelectorAll("td.k2"))],
    all = [].slice.call(box.querySelectorAll("td[data-v]")), timers = [], n = 0;
  function later(ms, f) { timers.push(setTimeout(f, ms)); }
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    all.forEach(function (c) { c.textContent = /\bk[12]\b/.test(c.className) ? "0" : ""; c.classList.remove("fillin"); });
    sel.style.display = mouse.style.display = key.style.display = "none"; step.innerHTML = step0;
  }
  function selAt(c) {
    sel.style.display = "block";
    sel.style.left = c.offsetLeft - 1 + "px"; sel.style.top = c.offsetTop - 1 + "px";
    sel.style.width = c.offsetWidth - 1 + "px"; sel.style.height = c.offsetHeight - 1 + "px";
  }
  function mouseAt(c) { mouse.style.display = "block"; mouse.style.left = c.offsetLeft + c.offsetWidth / 2 + "px"; mouse.style.top = c.offsetTop + 6 + "px"; }
  function typeIn(c, v, done) { var k = 0; (function f() { c.textContent = v.slice(0, ++k); if (k < v.length) later(110, f); else later(160, done); })(); }
  function press(name, c, done) { // Enter / Tab で確定
    key.textContent = name; key.style.display = "block"; c.classList.add("fillin"); n++;
    var b = c.nextElementSibling; if (name === "Enter" && b && b.getAttribute("data-v")) { b.textContent = "B"; b.classList.add("fillin"); }
    later(160, function () { key.style.display = "none"; done(); });
  }
  function seq(list, name, msg, done) { // list のセルに順に打つ
    var i = 0;
    mouseAt(list[0]);
    later(550, function next() {
      if (i >= list.length) return done();
      var c = list[i]; selAt(c); step.innerHTML = msg;
      typeIn(c, c.getAttribute("data-v"), function () { press(name, c, function () { i++; later(80, next); }); });
    });
  }
  w.addEventListener("click", function () {
    var playing = w.classList.contains("play");
    reset();
    if (playing) { w.classList.remove("play"); return; }
    w.classList.add("play"); n = 0;
    later(300, function () {
      seq([guide], "Enter", "誘導端末に <b>20</b> を入力", function () {
        seq(order, "Tab", "<b>端末並び</b> を左から入力", function () {
          seq(cols[0], "Enter", "品番 <b>315</b> : 0 の上に作業番号を入力", function () {
            seq(cols[1], "Enter", "品番 <b>435</b> : 0 の上に作業番号を入力", function () {
              sel.style.display = mouse.style.display = "none";
              step.innerHTML = step0;
              later(4000, function () { w.classList.remove("play"); });
            });
          });
        });
      });
    });
  });
});

// 3-3 コネクタの 3D 表示(.stlview data-src="xxx.stl"): バイナリ STL を WebGL で描く。ゆっくり回り、左ドラッグで回す・ホイールで拡大縮小・右ドラッグで移動。ダブルクリックで元に戻す
document.querySelectorAll(".stlview").forEach(function (w) {
  var cv = document.createElement("canvas"); w.appendChild(cv);
  // 3D のすぐ下に、見ている位置(カメラ)からコネクタまでの距離の目安を出す
  var dRow = document.createElement("div"); dRow.className = "stldist"; w.parentNode.insertBefore(dRow, w.nextSibling);
  // 左右の端に 戻る/進む の丸ボタン: 4-2 の先ハメ誘導ナビに ← / → キーを送る(2ndディスプレイと 3D の画面も一緒に変わる)
  function navBtn(key, label, path) {
    var b = document.createElement("button"); b.type = "button"; b.className = "stlnav"; b.title = label; b.setAttribute("aria-label", label);
    b.innerHTML = '<span aria-hidden="true"></span>';   // 実物の押しボタン(矢印なし): 濃い灰色の枠 + 乳白色のキャップ
    b.addEventListener("click", function () {
      var f = document.querySelector('.liveframe iframe[src*="assets/ssc/"]'), d;
      try { d = f && f.contentDocument; } catch (e) { d = null; }
      if (d) d.dispatchEvent(new KeyboardEvent("keydown", { key: key, bubbles: true }));
    });
    return b;
  }
  var dEl = document.createElement("span"); dEl.className = "stldt";
  dRow.appendChild(navBtn("ArrowLeft", "戻る", "M15 5l-7 7 7 7")); dRow.appendChild(dEl); dRow.appendChild(navBtn("ArrowRight", "進む", "M9 5l7 7-7 7"));
  var gl = cv.getContext("webgl", { antialias: true });
  if (!gl) { w.textContent = "このブラウザでは 3D を表示できません"; return; }
  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  var pg = gl.createProgram();
  gl.attachShader(pg, sh(gl.VERTEX_SHADER,
    "attribute vec3 p;attribute vec3 n;uniform mat4 m;uniform mat4 pr;varying vec3 vn;" +
    "void main(){vn=mat3(m)*n;gl_Position=pr*(m*vec4(p,1.0));}"));
  gl.attachShader(pg, sh(gl.FRAGMENT_SHADER,
    "precision mediump float;varying vec3 vn;void main(){vec3 n=normalize(vn);" +
    "float d=max(dot(n,normalize(vec3(0.4,0.6,1.0))),0.0)*0.75+abs(n.z)*0.1+0.2;" +
    "gl_FragColor=vec4(vec3(0.93,0.93,0.9)*d,1.0);}"));
  gl.linkProgram(pg); gl.useProgram(pg);
  // 基準の向き: data-view="rx,ry,dist,panX,panY"。そこから画面の縦の線を軸に回す(spin)・横の線を軸に傾ける(tilt)
  // モデルの上で P キーを押すと今の向きを "rx,ry,dist,panX,panY,spin,tilt" でコピーする
  var V0 = (w.getAttribute("data-view") || "-0.5,0.6,3.2,0,0").split(",").map(Number);
  var rx = V0[0], ry = V0[1], auto = true, cnt = 0, R = 1, dist = V0[2], panX = V0[3], panY = V0[4], FOV = 0.35, PK = 4, hover = false, spin = V0[5] || 0, tilt = V0[6] || 0;
  // file:// では fetch で読めないので、assets/model/model_data.js(window.SJP_MODEL)に入れた物を使う
  var MD = window.SJP_MODEL || {}, src0 = w.getAttribute("data-src");
  var getBuf = MD[src0] ? Promise.resolve(Uint8Array.from(atob(MD[src0]), function (c) { return c.charCodeAt(0); }).buffer) : fetch(src0).then(function (r) { return r.arrayBuffer(); });
  getBuf.then(function (buf) {
    var dv = new DataView(buf), nt = dv.getUint32(80, true), P = new Float32Array(nt * 9), N = new Float32Array(nt * 9);
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    for (var t = 0; t < nt; t++) {
      var o = 84 + t * 50, v = [];
      for (var k = 0; k < 9; k++) { v[k] = dv.getFloat32(o + 12 + k * 4, true); var a = k % 3; if (v[k] < mn[a]) mn[a] = v[k]; if (v[k] > mx[a]) mx[a] = v[k]; }
      // 法線は頂点から計算する(STL の法線が 0 のこともあるため)
      var ux = v[3] - v[0], uy = v[4] - v[1], uz = v[5] - v[2], wx = v[6] - v[0], wy = v[7] - v[1], wz = v[8] - v[2];
      var nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx, l = Math.hypot(nx, ny, nz) || 1;
      for (k = 0; k < 9; k++) { P[t * 9 + k] = v[k]; N[t * 9 + k] = [nx, ny, nz][k % 3] / l; }
    }
    var c = [0, 1, 2].map(function (a) { return (mn[a] + mx[a]) / 2; });
    R = Math.hypot(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]) / 2 || 1;
    for (t = 0; t < P.length; t++) P[t] = (P[t] - c[t % 3]) / R;
    mdl = { p: buf3(P), n: buf3(N) }; cnt = nt * 3; C = c;
    buildDisp();
    requestAnimationFrame(draw);
  });
  function buf3(data) { var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); return b; }
  function bindAttr(prog, name, b, size) { var loc = gl.getAttribLocation(prog, name); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0); return loc; }
  var mdl = null, C = [0, 0, 0];
  // ---- 2ndディスプレイ(厚さ 8mm)。コネクタ受けの窓の板の裏(166 × 105mm の面)に当てて置き、画面は窓から正面(05~20° の枠の側)を向く ----
  //   モデルは 30° 傾いているので、板の向き s = (0,-0.866,0.5)、縦 t = (0,0.5,0.866)。外形 165 × 102mm(コネクタ受けに合わせて 100 → 102mm)、画面 162.3 × 85.9mm(左右の縁は 5.4 → 1.35mm に細くした)
  var D = { x0: 58, x1: 223, s0: 36, s1: 44, t0: -17.25, t1: 84.75, aw: 162.3, ah: 85.9 };
  var showDisp = false, dispK = 0, disp = null;
  var showModel = false;   // コネクタ受けの 3D モデル(STL)。右の手順(②)のボタンで 出す/消す
  // ---- コネクタ(#111 のプラスチック)。形はコネクタ受けの溝(s=60 の切り口を 0.4mm 内側へ)、厚みは s 50～78mm ----
  //   穴は端末 20 の 109 個(2ndディスプレイと同じ位置)。穴から下のディスプレイの点滅が見える
  //   形は assets/model/conn_20.json(scratchpad の conn_geom.py で作る)
  //   上の面は無地(右の筒と同じ黒)で、端末 20 の 109 個の穴だけ抜く(穴の中には壁を立てる)。範囲 = TB
  var CN = null, showConn = false, connK = 0, conn = null, ctex = gl.createTexture();
  var TB = { x0: 57.9, x1: 228.1, t0: -14.54, t1: 62.58 };
  (MD["assets/model/conn_20.json"] ? Promise.resolve(MD["assets/model/conn_20.json"]) : fetch("assets/model/conn_20.json").then(function (r) { return r.json(); })).then(function (j) { CN = j; connTex(); if (mdl) buildConn(); });
  function connTex() {
    var cc = document.createElement("canvas"), kx = 1000 / (TB.x1 - TB.x0);
    cc.width = 1000; cc.height = Math.round((TB.t1 - TB.t0) * kx);
    var g = cc.getContext("2d");
    g.fillStyle = "#4a4f57"; g.fillRect(0, 0, cc.width, cc.height);   // 上の面: 濃いグレー(黒だと形が見えにくいので明るめ)
    CN.holes.forEach(function (h) { g.clearRect((h[0] - TB.x0) * kx, (TB.t1 - h[3]) * kx, (h[2] - h[0]) * kx, (h[3] - h[1]) * kx); });
    gl.bindTexture(gl.TEXTURE_2D, ctex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cc);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  var pg2 = gl.createProgram();
  gl.attachShader(pg2, sh(gl.VERTEX_SHADER,
    "attribute vec3 p;attribute vec3 n;attribute vec2 uv;uniform mat4 m;uniform mat4 pr;uniform vec3 off;varying vec3 vn;varying vec2 vu;" +
    "void main(){vn=mat3(m)*n;vu=uv;gl_Position=pr*(m*vec4(p+off,1.0));}"));
  gl.attachShader(pg2, sh(gl.FRAGMENT_SHADER,
    "precision mediump float;varying vec3 vn;varying vec2 vu;uniform sampler2D tx;uniform float mode;uniform vec3 col;void main(){" +
    "vec3 L=normalize(vec3(0.4,0.6,1.0));vec3 n=normalize(vn);" +
    "if(mode<0.5){float d=max(dot(n,L),0.0)*0.75+0.25;gl_FragColor=vec4(col*d,1.0);return;}" +
    "if(mode<1.5){gl_FragColor=texture2D(tx,vu);return;}" +
    "vec3 base=col;if(mode<2.5){vec4 tc=texture2D(tx,vu);if(tc.a<0.5)discard;base=tc.rgb;}" +
    "else if(mode>4.5){if(texture2D(tx,vu).a<0.5)discard;}" +
    "if(!gl_FrontFacing)n=-n;float df=max(dot(n,L),0.0)*0.7+0.3;vec3 H=normalize(L+vec3(0.0,0.0,1.0));" +
    "float sp=pow(max(dot(n,H),0.0),12.0)*0.06;gl_FragColor=vec4(base*df+vec3(sp),1.0);}"));
  gl.linkProgram(pg2);
  // 画面の絵: 黒い縁 + 2ndディスプレイの画面(assets/model/2nd_screen.png)。点滅する穴は絵の上で光らせる
  var scr = document.createElement("canvas"); scr.width = 825; scr.height = Math.round(825 * (D.t1 - D.t0) / 165);
  var sc = scr.getContext("2d"), simg = new Image(), tex = gl.createTexture(), texAt = 0;
  var HOLE = { x: 534 / 1024, y: 302 / 600, w: 16 / 1024 };
  simg.src = MD["assets/model/2nd_screen.png"] || "assets/model/2nd_screen.png";   // data: なら file:// でも絵に写せる
  function paintScreen(now) {
    var k = scr.width / 165, ax = (165 - D.aw) / 2 * k, ay = (D.t1 - D.t0 - D.ah) / 2 * k, aw = D.aw * k, ah = D.ah * k;
    // 前の縁(フレーム)はシルバー: 斜めに薄く明るさを変えて金属っぽく見せる
    var fg = sc.createLinearGradient(0, 0, scr.width, scr.height);
    fg.addColorStop(0, "#d9dce0"); fg.addColorStop(0.45, "#aeb3b9"); fg.addColorStop(0.55, "#c4c8cd"); fg.addColorStop(1, "#9a9fa6");
    sc.fillStyle = fg; sc.fillRect(0, 0, scr.width, scr.height);
    sc.fillStyle = "#000"; sc.fillRect(ax, ay, aw, ah);
    if (paintLive(ax, ay, aw, ah)) return upTex();
    if (simg.complete && simg.naturalWidth) sc.drawImage(simg, ax, ay, aw, ah);
    var hx = ax + HOLE.x * aw, hy = ay + HOLE.y * ah, hw = HOLE.w * aw, ph = (now % 1000) / 1000;
    sc.fillStyle = "rgba(57,255,20," + (0.35 + 0.65 * Math.abs(Math.cos(ph * Math.PI))) + ")";
    sc.fillRect(hx - hw / 2, hy - hw / 2, hw, hw);
    sc.strokeStyle = "rgba(57,255,20," + (1 - ph) + ")"; sc.lineWidth = 2;
    sc.beginPath(); sc.arc(hx, hy, hw * (0.8 + ph * 2.5), 0, Math.PI * 2); sc.stroke();
    upTex();
  }
  // 上の 2ndディスプレイ(4-2 の .ssc2nd iframe)の今の画面を写す: 背景・画像(contain)・十字線・穴・輪を、見た目の位置と濃さ(点滅中の opacity)のまま描く
  var limg = {};
  function paintLive(ax, ay, aw, ah) {
    var f = document.querySelector(".ssc2nd iframe"), lw, ld;
    try { lw = f && f.contentWindow; ld = lw && lw.document; } catch (e) { return false; }
    if (!ld || !ld.body || !lw.innerWidth) return false;
    var VW = lw.innerWidth, VH = lw.innerHeight, k = Math.min(aw / VW, ah / VH), ox = ax + (aw - VW * k) / 2, oy = ay + (ah - VH * k) / 2;
    // 2nd の画面を実寸で置く。校正のデフォルト値(PX_PER_MM・OFFSET_X_PX・OFFSET_Y_PX)の時に、端末の画像の中心 = コネクタの絵の中心になる位置で固定する
    //   画像に合わせて毎回置き直すと校正の値を変えても見た目が変わらないので、画像ではなく 2nd の画面そのものを置く(校正の値を変えるとずれて見える)
    var dpx = lw.DEFAULT_PX_PER_MM, ddx = lw.DEFAULT_OFFSET_X_PX || 0, ddy = lw.DEFAULT_OFFSET_Y_PX || 0;
    if (CN && typeof dpx === "number" && dpx > 0) {
      var kk = scr.width / 165, I = CN.img;
      k = kk / dpx;
      ox = ((I.x0 + I.x1) / 2 - D.x0) * kk - (VW / 2 + ddx) * k;
      oy = (D.t1 - (I.t0 + I.t1) / 2) * kk - (VH / 2 + ddy) * k;
    }
    sc.save(); sc.beginPath(); sc.rect(ax, ay, aw, ah); sc.clip();
    sc.fillStyle = lw.getComputedStyle(ld.body).backgroundColor || "#000"; sc.fillRect(ax, ay, aw, ah);
    function op(e) { var o = 1; for (; e && e !== ld.body; e = e.parentNode) { var c = lw.getComputedStyle(e); if (c.display === "none" || c.visibility === "hidden") return 0; o *= parseFloat(c.opacity); } return o; }
    function clear(c) { return !c || c === "transparent" || /rgba\(.*,\s*0\)$/.test(c); }
    [].forEach.call(ld.body.querySelectorAll("*"), function (e) {
      if (e.tagName === "SCRIPT" || e.tagName === "svg") return;
      var r = e.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var c = lw.getComputedStyle(e), o = op(e);
      if (o <= 0.01) return;
      var x = ox + r.left * k, y = oy + r.top * k, w2 = r.width * k, h2 = r.height * k;
      sc.globalAlpha = o;
      // 設定の「画像の明るさ」などは CSS の filter(brightness など)で掛かっているので、親から順に重ねて同じだけ掛ける
      var fl = [];
      for (var pe = e; pe && pe !== ld.body; pe = pe.parentNode) { var pf = lw.getComputedStyle(pe).filter; if (pf && pf !== "none") fl.unshift(pf); }
      sc.filter = fl.length ? fl.join(" ") : "none";
      if (e.tagName === "circle") {
        if (clear(c.stroke) || c.stroke === "none") return;
        sc.strokeStyle = c.stroke; sc.lineWidth = Math.max(1, parseFloat(c.strokeWidth) * k);
        sc.beginPath(); sc.ellipse(x + w2 / 2, y + h2 / 2, w2 / 2, h2 / 2, 0, 0, Math.PI * 2); sc.stroke();
        return;
      }
      var bi = /url\("?([^")]+)"?\)/.exec(c.backgroundImage);
      if (bi) {
        var im = limg[bi[1]];
        if (!im) { im = limg[bi[1]] = new Image(); im.src = bi[1]; }
        if (im.complete && im.naturalWidth) {
          var iw = im.naturalWidth, ih = im.naturalHeight, s2 = c.backgroundSize === "contain" ? Math.min(w2 / iw, h2 / ih) : 0;
          if (s2) sc.drawImage(im, x + (w2 - iw * s2) / 2, y + (h2 - ih * s2) / 2, iw * s2, ih * s2); else sc.drawImage(im, x, y, w2, h2);
        }
      }
      if (!clear(c.backgroundColor)) {
        // 点滅の形状: 角の丸み(border-radius)の四角を、clip-path(バツ・星の polygon)で切り抜いて塗る
        sc.save();
        var cp = /^polygon\((.*)\)$/.exec(c.clipPath || "");
        if (cp) {
          sc.beginPath();
          cp[1].split(",").forEach(function (q, i) {
            var v = q.trim().split(/\s+/), px2 = x + parseFloat(v[0]) / 100 * w2, py2 = y + parseFloat(v[1]) / 100 * h2;
            if (i) sc.lineTo(px2, py2); else sc.moveTo(px2, py2);
          });
          sc.closePath(); sc.clip();
        }
        var br = c.borderRadius || "0", rx = 0, ry = 0, bv = parseFloat(br) || 0;
        if (/%/.test(br)) { rx = w2 * bv / 100; ry = h2 * bv / 100; } else { rx = ry = bv * k; }
        rx = Math.min(rx, w2 / 2); ry = Math.min(ry, h2 / 2);
        sc.fillStyle = c.backgroundColor;
        sc.beginPath();
        if (rx > 0.5 && ry > 0.5 && sc.roundRect) sc.roundRect(x, y, w2, h2, [{ x: rx, y: ry }]); else sc.rect(x, y, w2, h2);
        sc.fill();
        sc.restore();
      }
    });
    sc.restore(); sc.globalAlpha = 1; sc.filter = "none";
    return true;
  }
  function upTex() {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scr);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  function buildDisp() {
    function pt(x, s, t) { return [(x - C[0]) / R, (-0.866025 * s + 0.5 * t - C[1]) / R, (0.5 * s + 0.866025 * t - C[2]) / R]; }
    var p = [], n = [], u = [], scrP = [], scrN = [], scrU = [];
    function quad(a, b, c2, d, nn, uvs, toP, toN, toU) { [a, b, c2, a, c2, d].forEach(function (v, i) { toP.push.apply(toP, v); toN.push.apply(toN, nn); toU.push.apply(toU, uvs[[0, 1, 2, 0, 2, 3][i]]); }); }
    var x0 = D.x0, x1 = D.x1, s0 = D.s0, s1 = D.s1, t0 = D.t0, t1 = D.t1, uv0 = [[0, 0], [0, 0], [0, 0], [0, 0]];
    // 画面(s1 の面): 左 = x0、上 = t1
    quad(pt(x0, s1, t0), pt(x1, s1, t0), pt(x1, s1, t1), pt(x0, s1, t1), [0, -0.866, 0.5], [[0, 1], [1, 1], [1, 0], [0, 0]], scrP, scrN, scrU);
    quad(pt(x0, s0, t0), pt(x0, s0, t1), pt(x1, s0, t1), pt(x1, s0, t0), [0, 0.866, -0.5], uv0, p, n, u);   // 裏
    quad(pt(x0, s0, t1), pt(x0, s1, t1), pt(x1, s1, t1), pt(x1, s0, t1), [0, 0.5, 0.866], uv0, p, n, u);   // 上
    quad(pt(x0, s0, t0), pt(x1, s0, t0), pt(x1, s1, t0), pt(x0, s1, t0), [0, -0.5, -0.866], uv0, p, n, u); // 下
    quad(pt(x0, s0, t0), pt(x0, s1, t0), pt(x0, s1, t1), pt(x0, s0, t1), [-1, 0, 0], uv0, p, n, u);        // 左
    quad(pt(x1, s0, t0), pt(x1, s0, t1), pt(x1, s1, t1), pt(x1, s1, t0), [1, 0, 0], uv0, p, n, u);         // 右
    function b2(a) { var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a), gl.STATIC_DRAW); return b; }
    disp = { body: { p: b2(p), n: b2(n), u: b2(u), cnt: p.length / 3 }, scr: { p: b2(scrP), n: b2(scrN), u: b2(scrU), cnt: scrP.length / 3 } };
    if (CN) buildConn();
  }
  // コネクタの形を作る: ふた 2 枚(上 = 電線の側、下 = ディスプレイの側。穴は絵で抜く)、外の壁、穴の中の壁
  function buildConn() {
    function pt(x, s, t) { return [(x - C[0]) / R, (-0.866025 * s + 0.5 * t - C[1]) / R, (0.5 * s + 0.866025 * t - C[2]) / R]; }
    var I = CN.img, s0 = CN.s0, s1 = CN.s1, NS = [0, -0.866025, 0.5], NT = [0, 0.5, 0.866025];
    function uv(x, t) { return [(x - TB.x0) / (TB.x1 - TB.x0), (TB.t1 - t) / (TB.t1 - TB.t0)]; }
    function nrm(dx, dt) { return [dx, NT[1] * dt, NT[2] * dt]; }   // x と t の向きの法線を 3D に
    var cap = { p: [], n: [], u: [] }, capB = { p: [], n: [], u: [] }, wall = { p: [], n: [], u: [] };
    function push(o, v, nn, u2) { o.p.push.apply(o.p, v); o.n.push.apply(o.n, nn); o.u.push.apply(o.u, u2); }
    var poly = CN.poly, tr = CN.tris;
    for (var i = 0; i < tr.length; i += 3) {
      [0, 1, 2].forEach(function (k) { var v = poly[tr[i + k]]; push(cap, pt(v[0], s1, v[1]), NS, uv(v[0], v[1])); });
      [2, 1, 0].forEach(function (k) { var v = poly[tr[i + k]]; push(capB, pt(v[0], s0, v[1]), [0, 0.866025, -0.5], uv(v[0], v[1])); });
    }
    function wallQ(a, b2, nn) {   // a → b2 の辺を s0～s1 まで立てる
      [[a, s0], [b2, s0], [b2, s1], [a, s0], [b2, s1], [a, s1]].forEach(function (q) { push(wall, pt(q[0][0], q[1], q[0][1]), nn, [0, 0]); });
    }
    for (i = 0; i < poly.length; i++) {   // 外の壁(左回りなので右が外)
      var a = poly[i], c = poly[(i + 1) % poly.length], dx = c[0] - a[0], dt = c[1] - a[1], L = Math.hypot(dx, dt) || 1;
      wallQ(a, c, nrm(dt / L, -dx / L));
    }
    // 右の筒: ウケの丸いへこみ(円の中心 t=23.48、s=92.14、半径 23.06)に乗る半割りのパイプ。厚み 2mm、円の下半分
    //   本体の右(x 224)から 252 まで + 先のツバ(252～255、外へ 2mm 張り出す)。写真で本体から約 30mm 出ている
    var TC = 23.48, SC = 92.14, TR = 23.06 - 0.4, TW = 2, NA = 32;
    function arc(r) { var o = []; for (var k = 0; k <= NA; k++) { var an = Math.PI + Math.PI * k / NA; o.push([TC + r * Math.cos(an), SC + r * Math.sin(an)]); } return o; }
    function pts(v, x) { return pt(x, v[1], v[0]); }
    function n3(nt, ns) { return [0, NT[1] * nt + NS[1] * ns, NT[2] * nt + NS[2] * ns]; }
    function quad(p0, p1, p2, p3, nn) { [p0, p1, p2, p0, p2, p3].forEach(function (v) { push(wall, v, nn, [0, 0]); }); }
    function shell(ro, ri, tx0, tx1) {
      var ao = arc(ro), ai = arc(ri);
      for (var k = 0; k < NA; k++) {
        // 両端の面(外の円と内の円の間の帯)
        quad(pts(ao[k], tx0), pts(ao[k + 1], tx0), pts(ai[k + 1], tx0), pts(ai[k], tx0), [-1, 0, 0]);
        quad(pts(ao[k], tx1), pts(ai[k], tx1), pts(ai[k + 1], tx1), pts(ao[k + 1], tx1), [1, 0, 0]);
        // 外の丸い面(法線は外へ)と 内の丸い面(法線は円の中心へ)
        var mt = (ao[k][0] + ao[k + 1][0]) / 2 - TC, ms = (ao[k][1] + ao[k + 1][1]) / 2 - SC, ml = Math.hypot(mt, ms);
        quad(pts(ao[k], tx0), pts(ao[k + 1], tx0), pts(ao[k + 1], tx1), pts(ao[k], tx1), n3(mt / ml, ms / ml));
        mt = (ai[k][0] + ai[k + 1][0]) / 2 - TC; ms = (ai[k][1] + ai[k + 1][1]) / 2 - SC; ml = Math.hypot(mt, ms);
        quad(pts(ai[k], tx0), pts(ai[k], tx1), pts(ai[k + 1], tx1), pts(ai[k + 1], tx0), n3(-mt / ml, -ms / ml));
      }
      [[ao[0], ai[0]], [ao[NA], ai[NA]]].forEach(function (e) {   // 半割りの上の縁(2 か所)
        quad(pts(e[0], tx0), pts(e[1], tx0), pts(e[1], tx1), pts(e[0], tx1), n3(0, 1));
      });
    }
    shell(TR, TR - TW, 224, 252);
    shell(TR + 2, TR - TW, 252, 255);
    CN.holes.forEach(function (h) {   // 穴の中の壁(法線は穴の中心へ)
      var p00 = [h[0], h[1]], p10 = [h[2], h[1]], p11 = [h[2], h[3]], p01 = [h[0], h[3]];
      wallQ(p00, p10, nrm(0, 1)); wallQ(p10, p11, nrm(-1, 0)); wallQ(p11, p01, nrm(0, -1)); wallQ(p01, p00, nrm(1, 0));
    });
    function b2(a2) { var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a2), gl.STATIC_DRAW); return b; }
    function bb(o) { return { p: b2(o.p), n: b2(o.n), u: b2(o.u), cnt: o.p.length / 3 }; }
    conn = { cap: bb(cap), capB: bb(capB), wall: bb(wall) };
  }
  // 右の手順(③)のボタンで 置く/外す。置く時は上から差し込む様に滑らせる
  var bwrap = w.closest(".stlsteps") || w.parentNode;
  // 右の手順の欄の高さを 3D の表示の高さに合わせる(手順は CSS で等間隔に並ぶ)。文字が収まらない時は欄が伸びる
  var steps = w.closest(".stlsteps") && bwrap.querySelector(".needlist");
  if (steps) {
    var fitSteps = function () { steps.style.minHeight = w.offsetHeight + "px"; };
    fitSteps();
    if (window.ResizeObserver) new ResizeObserver(fitSteps).observe(w); else addEventListener("resize", fitSteps);
  }
  // 右の手順(②)のボタンで コネクタ受けの 3D モデルを 出す/消す
  var mbtn = bwrap.querySelector(".stlmodel");
  if (mbtn) mbtn.addEventListener("click", function () {
    showModel = !showModel;
    mbtn.textContent = showModel ? "外す" : "セット";
    mbtn.setAttribute("aria-pressed", showModel ? "true" : "false");
  });
  var dbtn = bwrap.querySelector(".stl2nd:not(.stlconn):not(.stlmodel)");
  if (dbtn) dbtn.addEventListener("click", function () {
    showDisp = !showDisp;
    dbtn.textContent = showDisp ? "外す" : "セット";
    dbtn.setAttribute("aria-pressed", showDisp ? "true" : "false");
  });
  // 右の手順(⑤)のボタンで コネクタをセット/外す。セットする時は手前(枠の側)から差し込む様に滑らせる
  var cbtn = bwrap.querySelector(".stlconn");
  if (cbtn) cbtn.addEventListener("click", function () {
    showConn = !showConn;
    cbtn.textContent = showConn ? "外す" : "セット";
    cbtn.setAttribute("aria-pressed", showConn ? "true" : "false");
  });
  function mul(a, b) { var r = []; for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) { var s = 0; for (var k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k]; r[i * 4 + j] = s; } return r; }
  function draw() {
    var dpr = window.devicePixelRatio || 1, W = w.clientWidth, H = w.clientHeight;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    if (auto) spin += 0.006;
    gl.viewport(0, 0, cv.width, cv.height); gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    var mX = [1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1], mY = [cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1];
    var ct = Math.cos(tilt), st = Math.sin(tilt), cs = Math.cos(spin), ss = Math.sin(spin);
    var tX = [1, 0, 0, 0, 0, ct, st, 0, 0, -st, ct, 0, 0, 0, 0, 1], sY = [cs, 0, -ss, 0, 0, 1, 0, 0, ss, 0, cs, 0, 0, 0, 0, 1];
    // パースを弱める: カメラを PK 倍遠くに置いて、画角を 1/PK に絞る(見える大きさは同じ、遠近の差は 1/PK)
    var m = mul(tX, mul(sY, mul(mX, mY))); m[12] = panX; m[13] = panY; m[14] = -dist * PK;
    var asp = cv.width / (cv.height || 1), f = PK / Math.tan(FOV), nr = dist * PK / 50, fr = dist * PK + 10;
    var pr = [f / asp, 0, 0, 0, 0, f, 0, 0, 0, 0, (fr + nr) / (nr - fr), -1, 0, 0, 2 * fr * nr / (nr - fr), 0];
    if (showModel) {
      gl.useProgram(pg);
      var lp = bindAttr(pg, "p", mdl.p, 3), ln = bindAttr(pg, "n", mdl.n, 3);
      gl.uniformMatrix4fv(gl.getUniformLocation(pg, "m"), false, new Float32Array(m));
      gl.uniformMatrix4fv(gl.getUniformLocation(pg, "pr"), false, new Float32Array(pr));
      gl.drawArrays(gl.TRIANGLES, 0, cnt);
      gl.disableVertexAttribArray(lp); gl.disableVertexAttribArray(ln);
    }
    dispK += ((showDisp ? 1 : 0) - dispK) * 0.12;
    connK += ((showConn ? 1 : 0) - connK) * 0.12;
    // 箱を 1 つ描く: off = 滑らせる量(向き × mm)、col = 無地の面の色、t = 絵を貼る面のテクスチャ
    function box(parts, dir, mm, col, t) {
      gl.uniform3f(gl.getUniformLocation(pg2, "off"), dir[0] * mm / R, dir[1] * mm / R, dir[2] * mm / R);
      gl.uniform3f(gl.getUniformLocation(pg2, "col"), col[0], col[1], col[2]);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t); gl.uniform1i(gl.getUniformLocation(pg2, "tx"), 0);
      parts.forEach(function (q) {
        if (q[2]) gl.uniform3f(gl.getUniformLocation(pg2, "col"), col[0] * q[2], col[1] * q[2], col[2] * q[2]);
        if (q[3]) gl.bindTexture(gl.TEXTURE_2D, q[3]);   // この部品だけ別の絵(使った後は元の絵に戻す)
        var a1 = bindAttr(pg2, "p", q[0].p, 3), a2 = bindAttr(pg2, "n", q[0].n, 3), a3 = bindAttr(pg2, "uv", q[0].u, 2);
        gl.uniform1f(gl.getUniformLocation(pg2, "mode"), q[1]);
        gl.drawArrays(gl.TRIANGLES, 0, q[0].cnt);
        gl.disableVertexAttribArray(a1); gl.disableVertexAttribArray(a2); gl.disableVertexAttribArray(a3);
        if (q[3]) gl.bindTexture(gl.TEXTURE_2D, t);
      });
    }
    if ((disp && dispK > 0.01) || (conn && connK > 0.01)) {
      gl.useProgram(pg2);
      gl.uniformMatrix4fv(gl.getUniformLocation(pg2, "m"), false, new Float32Array(m));
      gl.uniformMatrix4fv(gl.getUniformLocation(pg2, "pr"), false, new Float32Array(pr));
    }
    if (disp && dispK > 0.01) {
      var now = performance.now();
      if (now - texAt > 40) { paintScreen(now); texAt = now; }
      box([[disp.body, 0], [disp.scr, 1]], [0, 0.5, 0.866], (1 - dispK) * 110, [0.74, 0.76, 0.79], tex);   // 上から差し込む(シルバーの箱 + 光る画面)
    }
    showDist(m);
    if (conn && connK > 0.01) {
      box([[conn.cap, 2], [conn.capB, 2], [conn.wall, 3]], [0, -0.866, 0.5], (1 - connK) * 90, [0.29, 0.31, 0.34], ctex); // 手前から差し込む(#4a4f57 のプラスチック。黒だと形が見えにくいので明るめ)
    }
    requestAnimationFrame(draw);
  }
  // コネクタ(セットする位置)の真ん中を、今の向き・拡大で目の位置から測る(モデルの単位 × R = mm)
  var distTxt = "";
  function showDist(m) {
    var q = [0, 0, 0];
    if (CN) {
      var I = CN.img, x = (I.x0 + I.x1) / 2, s = (CN.s0 + CN.s1) / 2, t = (I.t0 + I.t1) / 2;
      q = [(x - C[0]) / R, (-0.866025 * s + 0.5 * t - C[1]) / R, (0.5 * s + 0.866025 * t - C[2]) / R];
    }
    var ex = m[0] * q[0] + m[4] * q[1] + m[8] * q[2] + m[12], ey = m[1] * q[0] + m[5] * q[1] + m[9] * q[2] + m[13], ez = m[2] * q[0] + m[6] * q[1] + m[10] * q[2] + m[14];
    var mm = Math.round(Math.hypot(ex, ey, ez) * R / 2 / 10) * 10;   // 表示は半分の値にする(パースを弱めた分、カメラを遠くに置いているため)
    var s2 = "コネクタまでの距離 約 <b>" + (mm >= 1000 ? (mm / 1000).toFixed(2) + " m" : mm + " mm") + "</b>";
    if (s2 !== distTxt) { distTxt = s2; dEl.innerHTML = s2; }
  }
  function wpp() { return 2 * dist * Math.tan(FOV) / (w.clientHeight || 1); } // 1px が何単位か(モデルの中心の深さで)
  var drag = null;
  cv.addEventListener("pointerdown", function (e) { drag = [e.clientX, e.clientY, e.button === 2]; auto = false; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - drag[0], dy = e.clientY - drag[1];
    if (drag[2]) { panX += dx * wpp(); panY -= dy * wpp(); } // 右ドラッグ: 移動
    else { spin += dx * 0.01; tilt += dy * 0.01; tilt = Math.max(-1.55, Math.min(1.55, tilt)); }
    drag[0] = e.clientX; drag[1] = e.clientY;
  });
  cv.addEventListener("pointerup", function () { drag = null; });
  cv.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  cv.addEventListener("wheel", function (e) { // ホイール: マウスの位置を中心に拡大縮小
    e.preventDefault(); auto = false;
    var b = cv.getBoundingClientRect(), ox = e.clientX - b.left - b.width / 2, oy = e.clientY - b.top - b.height / 2, w0 = wpp();
    dist = Math.max(0.4, Math.min(15, dist * Math.exp(e.deltaY * 0.0015)));
    var w1 = wpp(); panX += ox * (w1 - w0); panY -= oy * (w1 - w0);
  }, { passive: false });
  cv.addEventListener("dblclick", function () { spin = V0[5] || 0; tilt = V0[6] || 0; dist = V0[2]; panX = V0[3]; panY = V0[4]; auto = true; });
  cv.addEventListener("pointerenter", function () { hover = true; });
  cv.addEventListener("pointerleave", function () { hover = false; });
  document.addEventListener("keydown", function (e) {
    if (!hover || (e.key !== "p" && e.key !== "P")) return;
    var r2 = function (v) { return Math.round(v * 1000) / 1000; };
    var s = [r2(rx), r2(ry), r2(dist), r2(panX), r2(panY), r2(spin % (2 * Math.PI)), r2(tilt)].join(",");
    var cap = w.parentNode.querySelector("figcaption"), old = cap && cap.textContent;
    function msg(m) { if (!cap) return; cap.textContent = m; setTimeout(function () { cap.textContent = old; }, 2500); }
    if (navigator.clipboard) navigator.clipboard.writeText(s).then(function () { msg("今の向きをコピーしました: " + s); }, function () { msg("今の向き: " + s); });
    else msg("今の向き: " + s);
  });
});

// 3-3 購入したディスプレイ: リンクのクリックで商品カードのモーダル(Amazon は枠の中に出せない)。×・外側・Esc で閉じる
document.querySelectorAll(".buyopen").forEach(function (a) {
  var m = document.querySelector(".buymodal");
  if (!m) return;
  function close() { m.hidden = true; }
  a.addEventListener("click", function (e) { e.preventDefault(); m.hidden = false; });
  m.addEventListener("click", function (e) { if (e.target === m || e.target.classList.contains("bm-x")) close(); });
  m.querySelector(".bm-go").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !m.hidden) close(); });
});

// コネクタ登録状況(本文の .cavinline): 枠の高さを中身(ページの body)の高さに合わせる(下に空きを作らない)
[].forEach.call(document.querySelectorAll(".cavinline iframe"), function (f) {
  function fit() {
    var d;
    try { d = f.contentDocument; } catch (e) { return; }
    if (!d || !d.body) return;
    var h = Math.ceil(d.body.getBoundingClientRect().height);
    if (h > 50) f.style.height = h + "px";
  }
  f.addEventListener("load", function () { fit(); setTimeout(fit, 300); });
  addEventListener("resize", fit);
  fit();
});

// 4.導入の効果 の 導入前の図(.beforeanim): 回路マトリクスを手で作り、それを基に各成果物を手で作る。
//   マル即(設計変更)が来るたびに、手で作った物を全部手で直す(5 回)。右下の工数が 840H まで増える
//   止まっている時は元の図(全部できた所)と「クリックで再生」。再生中にクリックで止める
document.querySelectorAll(".beforeanim").forEach(function (w) {
  var NS = "http://www.w3.org/2000/svg";
  // 箱: [id, x, y, 幅, 高さ, 文字, 手入力か]
  var B = [["shanai", 20, 32, 104, 32, "社内図", 0], ["maru", 20, 80, 104, 32, "マル即", 0], ["mat", 180, 56, 272, 32, "回路マトリクス", 1],
    ["sub", 180, 122, 80, 30, "サブ図", 1], ["pt", 290, 122, 110, 30, "ポイント図", 1], ["hame", 180, 186, 80, 30, "後ハメ図", 1],
    ["sao", 290, 186, 140, 30, "竿レイアウト図", 1], ["wire", 20, 258, 104, 32, "電線データ", 0], ["cut", 298, 256, 154, 32, "自動機切断データ", 1]];
  var F = [[8, 14, 128, 112, "主管工場"], [8, 240, 128, 64, "電線明細"]];
  var A = { m: "M136 72H178", s: "M220 88V120", p: "M345 88V120", sa: "M412 88V184", h: "M220 152V184", c1: "M442 88V254", c2: "M360 216V254", w: "M124 274H296" };
  var svg = '<svg viewBox="0 0 460 312" class="ba-svg"><defs><marker id="baAr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fff"/></marker></defs>';
  F.forEach(function (f) {
    svg += '<rect x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="' + f[3] + '" class="ba-frame"/>' +
      '<rect x="' + (f[0] + 22) + '" y="' + (f[1] - 10) + '" width="' + (f[2] - 44) + '" height="20" fill="#333"/>' +
      '<text x="' + (f[0] + f[2] / 2) + '" y="' + (f[1] + 6) + '" class="ba-ft">' + f[4] + '</text>';
  });
  Object.keys(A).forEach(function (k) { svg += '<path id="baA_' + k + '" d="' + A[k] + '" class="ba-ar" marker-end="url(#baAr)"/>'; });
  B.forEach(function (b) {
    svg += '<g class="ba-bx' + (b[6] ? " pink" : "") + '" data-id="' + b[0] + '">' +
      '<rect x="' + b[1] + '" y="' + b[2] + '" width="' + b[3] + '" height="' + b[4] + '" class="ba-bg"/>' +
      (b[6] ? '<rect x="' + b[1] + '" y="' + b[2] + '" width="' + b[3] + '" height="' + b[4] + '" class="ba-fill"/>' : "") +
      '<rect x="' + b[1] + '" y="' + b[2] + '" width="' + b[3] + '" height="' + b[4] + '" class="ba-ln"/>' +
      '<text x="' + (b[1] + b[3] / 2) + '" y="' + (b[2] + b[4] / 2 + 6) + '" class="ba-tx">' + b[5] + '</text></g>';
  });
  svg += '<rect x="12" y="158" width="13" height="13" fill="#ff99ff"/><text x="31" y="170" class="ba-lg">= 手入力で作成</text>';
  svg += '<circle class="ba-pkt" r="5" cx="-20" cy="-20"/></svg>';
  w.innerHTML = svg + '<div class="ba-bar"><span class="ba-step">回路マトリクスを手で作り、それを基に各成果物を作成</span><span class="ba-h">工数 <b>0</b> H</span></div>';
  var cover = document.createElement("div");
  cover.className = "livecover ba-cover";
  cover.textContent = "クリックで再生";
  w.appendChild(cover);
  var step = w.querySelector(".ba-step"), step0 = step.textContent, hb = w.querySelector(".ba-h b"), pkt = w.querySelector(".ba-pkt");
  function bx(id) { return w.querySelector('.ba-bx[data-id="' + id + '"]'); }
  var pinks = ["mat", "sub", "pt", "hame", "sao", "cut"];
  var run = 0, hours = 0, anims = [];
  function sleep(ms, id) { return new Promise(function (ok) { setTimeout(function () { ok(id === run); }, ms); }); }
  function setH(v) { hours = v; hb.textContent = Math.round(v); }
  // 箱を手で作る: ピンクが左から右へ伸びる(その間 工数が増える)
  function make(id, ms, dh, rid) {
    var g = bx(id), f = g.querySelector(".ba-fill"), h0 = hours, t0 = performance.now();
    g.classList.remove("ng"); g.classList.add("typing");
    var an = f.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: ms, fill: "forwards", easing: "linear" });
    anims.push(an);
    return new Promise(function (ok) {
      (function tick() {
        if (rid !== run) { ok(false); return; }
        var k = Math.min(1, (performance.now() - t0) / ms);
        setH(h0 + dh * k);
        if (k < 1) requestAnimationFrame(tick);
        else { g.classList.remove("typing"); g.classList.add("done"); ok(true); }
      })();
    });
  }
  function empty(id) {
    var g = bx(id), f = g.querySelector(".ba-fill");
    f.getAnimations().forEach(function (a) { a.cancel(); });
    var an = f.animate([{ transform: "scaleX(0)" }], { duration: 1, fill: "forwards" });
    anims.push(an);
    g.classList.remove("done");
  }
  function arrow(k, on) { w.querySelector("#baA_" + k).classList.toggle("on", on); }
  // 丸を矢印に沿って動かす
  function fly(k, ms, rid) {
    var p = w.querySelector("#baA_" + k), L = p.getTotalLength(), t0 = performance.now();
    arrow(k, true);
    return new Promise(function (ok) {
      (function tick() {
        if (rid !== run) { ok(false); return; }
        var t = Math.min(1, (performance.now() - t0) / ms), q = p.getPointAtLength(L * t);
        pkt.setAttribute("cx", q.x); pkt.setAttribute("cy", q.y);
        if (t < 1) requestAnimationFrame(tick); else { pkt.setAttribute("cx", -20); ok(true); }
      })();
    });
  }
  function reset(full) {
    anims.forEach(function (a) { a.cancel(); }); anims = [];
    [].forEach.call(w.querySelectorAll(".ba-bx"), function (g) { g.classList.remove("typing", "ng", "hot", "done"); });
    [].forEach.call(w.querySelectorAll(".ba-ar"), function (p) { p.classList.remove("on"); });
    pkt.setAttribute("cx", -20);
    if (!full) pinks.forEach(empty);
    setH(full ? 840 : 0);   // 止まっている時(全部できた図)は最後の工数を出しておく
    step.innerHTML = step0;
  }
  var PER = 140;   // 1 回作る(直す)工数。最初に作る + マル即 5 回 = 6 × 140 = 840H
  async function play(id) {
    reset(false);
    step.innerHTML = "主管工場から 社内図・マル即 が届く";
    if (!(await fly("m", 900, id))) return;
    step.innerHTML = "<b>回路マトリクス</b>を手で入力";
    if (!(await make("mat", 1600, PER * 0.35, id))) return;
    step.innerHTML = "回路マトリクスを見ながら、各成果物を<b>手で作成</b>";
    arrow("s", true); arrow("p", true);
    if (!(await Promise.all([make("sub", 900, PER * 0.12, id), make("pt", 900, PER * 0.12, id)]))[0]) return;
    arrow("h", true); arrow("sa", true);
    if (!(await Promise.all([make("hame", 900, PER * 0.12, id), make("sao", 900, PER * 0.12, id)]))[0]) return;
    arrow("c1", true); arrow("c2", true);
    var fw = fly("w", 800, id);
    if (!(await make("cut", 900, PER * 0.17, id))) return;
    await fw;
    if (!(await sleep(700, id))) return;
    for (var n = 1; n <= 5; n++) {
      var sp = n === 1 ? 1 : 0.55;   // 2 回目からは速く
      step.innerHTML = "<b>マル即(設計変更) " + n + " 回目</b>: 手で作った物を<b>全部手で直す</b>";
      bx("maru").classList.add("hot");
      if (!(await fly("m", 600 * sp, id))) return;
      bx("maru").classList.remove("hot");
      pinks.forEach(function (k) { empty(k); bx(k).classList.add("ng"); });
      if (!(await sleep(450 * sp, id))) return;
      for (var j = 0; j < pinks.length; j++) {
        if (!(await make(pinks[j], 420 * sp, PER / pinks.length, id))) return;
      }
      if (!(await sleep(350 * sp, id))) return;
    }
    setH(840);
    step.innerHTML = "77 点 × 5 回 = <b>385 ファイル</b>を手で修正";
    if (!(await sleep(4500, id))) return;
    stop();
  }
  function stop() {
    run++;
    w.classList.remove("ba-play");
    reset(true);
  }
  w.addEventListener("click", function () {
    if (w.classList.contains("ba-play")) { stop(); return; }
    run++;
    w.classList.add("ba-play");
    play(run);
  });
  reset(true);
});

// 4.導入の効果 の 導入後の図(.afteranim): 生産準備+ のファイル 1 つに入れれば、各成果物は自動で作られる。
//   マル即(設計変更)が来ても、生産準備+ を 1 か所直せば全部に反映(5 回)。右下の工数は 10H で止まる
//   止まっている時は元の図(全部できた所)と「クリックで再生」。再生中にクリックで止める
document.querySelectorAll(".afteranim").forEach(function (w) {
  // 箱: [id, x, y, 幅, 高さ, 文字, 種類(p = 手入力 / a = 自動作成 / 枠 = 元のデータ), 新しく追加]
  var B = [["shanai", 20, 32, 104, 32, "社内図", ""], ["maru", 20, 80, 104, 32, "マル即", ""], ["wire", 20, 258, 104, 32, "電線データ", ""],
    ["sjp", 158, 40, 96, 240, "生産準備+", "p"],
    ["o1", 282, 8, 66, 26, "サブ図", "a"], ["o2", 282, 42, 82, 26, "後ハメ図", "a"], ["o3", 282, 76, 98, 26, "ポイント図", "a"],
    ["o4", 282, 110, 116, 26, "ポイント点滅", "a", 1], ["o5", 282, 144, 172, 26, "チャッカーデータ作成", "a", 1], ["o6", 282, 178, 66, 26, "配策図", "a", 1],
    ["o7", 282, 212, 130, 26, "竿レイアウト図", "p"], ["o8", 282, 274, 146, 26, "自動機切断データ", "a"]];
  var F = [[8, 14, 128, 112, "主管工場"], [8, 240, 128, 64, "電線明細"]];
  var A = { m: "M136 72L156 82", w: "M124 274L156 264", o8: "M347 238V272" };
  // 生産準備+ の右から各成果物へ(曲線)
  ["o1", "o2", "o3", "o4", "o5", "o6", "o7"].forEach(function (k) {
    var b = B.filter(function (x) { return x[0] === k; })[0], y = b[2] + b[4] / 2;
    A[k] = "M254 160C270 160 266 " + y + " 280 " + y;
  });
  var svg = '<svg viewBox="0 0 460 312" class="ba-svg"><defs><marker id="aaAr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#fff"/></marker></defs>';
  F.forEach(function (f) {
    svg += '<rect x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="' + f[3] + '" class="ba-frame"/>' +
      '<rect x="' + (f[0] + 22) + '" y="' + (f[1] - 10) + '" width="' + (f[2] - 44) + '" height="20" fill="#333"/>' +
      '<text x="' + (f[0] + f[2] / 2) + '" y="' + (f[1] + 6) + '" class="ba-ft">' + f[4] + '</text>';
  });
  Object.keys(A).forEach(function (k) { svg += '<path id="aaA_' + k + '" d="' + A[k] + '" class="ba-ar" marker-end="url(#aaAr)"/>'; });
  B.forEach(function (b) {
    var cls = b[6] === "p" ? " pink" : b[6] === "a" ? " auto" : "";
    svg += '<g class="ba-bx' + cls + '" data-id="' + b[0] + '">' +
      '<rect x="' + b[1] + '" y="' + b[2] + '" width="' + b[3] + '" height="' + b[4] + '" class="ba-bg"/>' +
      (b[6] === "p" ? '<rect x="' + b[1] + '" y="' + b[2] + '" width="' + b[3] + '" height="' + b[4] + '" class="ba-fill"/>' : "") +
      '<rect x="' + b[1] + '" y="' + b[2] + '" width="' + b[3] + '" height="' + b[4] + '" class="ba-ln"/>' +
      '<text x="' + (b[1] + b[3] / 2) + '" y="' + (b[2] + b[4] / 2 + 6) + '" class="ba-tx">' + b[5] + '</text>' +
      (b[7] ? '<circle cx="' + (b[1] + b[3]) + '" cy="' + b[2] + '" r="5" class="aa-new"/>' : "") + '</g>';
  });
  svg += '<rect x="12" y="148" width="13" height="13" fill="#ff99ff"/><text x="31" y="160" class="ba-lg">= 手入力で作成</text>' +
    '<rect x="12" y="172" width="13" height="13" fill="#fff"/><text x="31" y="184" class="ba-lg">= 自動作成</text>' +
    '<circle cx="18.5" cy="202.5" r="6" class="aa-new"/><text x="31" y="208" class="ba-lg">= 新しく追加</text>';
  svg += '<circle class="ba-pkt" r="5" cx="-20" cy="-20"/></svg>';
  w.innerHTML = svg + '<div class="ba-bar"><span class="ba-step">生産準備+ のファイル 1 つから各成果物を作る。1 つ直せば全部に反映</span><span class="ba-h">工数 <b>0</b> H</span></div>';
  var cover = document.createElement("div");
  cover.className = "livecover ba-cover";
  cover.textContent = "クリックで再生";
  w.appendChild(cover);
  var step = w.querySelector(".ba-step"), step0 = step.textContent, hb = w.querySelector(".ba-h b"), pkt = w.querySelector(".ba-pkt");
  function bx(id) { return w.querySelector('.ba-bx[data-id="' + id + '"]'); }
  var outs = ["o1", "o2", "o3", "o4", "o5", "o6", "o7", "o8"];
  var run = 0, hours = 0, anims = [];
  function sleep(ms, id) { return new Promise(function (ok) { setTimeout(function () { ok(id === run); }, ms); }); }
  function setH(v) { hours = v; hb.textContent = (Math.round(v * 10) / 10).toString(); }
  // 手で入れる(ピンクが伸びる。その間 工数が増える)
  function make(id, ms, dh, rid) {
    var g = bx(id), f = g.querySelector(".ba-fill"), h0 = hours, t0 = performance.now();
    g.classList.add("typing");
    anims.push(f.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: ms, fill: "forwards", easing: "linear" }));
    return new Promise(function (ok) {
      (function tick() {
        if (rid !== run) { ok(false); return; }
        var k = Math.min(1, (performance.now() - t0) / ms);
        setH(h0 + dh * k);
        if (k < 1) requestAnimationFrame(tick);
        else { g.classList.remove("typing"); g.classList.add("done"); ok(true); }
      })();
    });
  }
  function empty(id) {
    var g = bx(id), f = g.querySelector(".ba-fill");
    if (f) { f.getAnimations().forEach(function (a) { a.cancel(); }); anims.push(f.animate([{ transform: "scaleX(0)" }], { duration: 1, fill: "forwards" })); }
    g.classList.remove("done");
  }
  function arrow(k, on) { w.querySelector("#aaA_" + k).classList.toggle("on", on); }
  function fly(k, ms, rid) {
    var p = w.querySelector("#aaA_" + k), L = p.getTotalLength(), t0 = performance.now();
    arrow(k, true);
    return new Promise(function (ok) {
      (function tick() {
        if (rid !== run) { ok(false); return; }
        var t = Math.min(1, (performance.now() - t0) / ms), q = p.getPointAtLength(L * t);
        pkt.setAttribute("cx", q.x); pkt.setAttribute("cy", q.y);
        if (t < 1) requestAnimationFrame(tick); else { pkt.setAttribute("cx", -20); ok(true); }
      })();
    });
  }
  // 自動で作る: 矢印が光って、箱がぽんと出る(工数は増えない)
  function auto(id, rid) {
    arrow(id, true);
    var g = bx(id);
    g.classList.remove("off"); g.classList.add("pop");
    return sleep(160, rid).then(function (ok) { g.classList.remove("pop"); if (g.classList.contains("pink")) g.classList.add("done"); return ok; });
  }
  function reset(full) {
    anims.forEach(function (a) { a.cancel(); }); anims = [];
    [].forEach.call(w.querySelectorAll(".ba-bx"), function (g) { g.classList.remove("typing", "hot", "done", "off", "pop", "flash"); });
    [].forEach.call(w.querySelectorAll(".ba-ar"), function (p) { p.classList.remove("on"); });
    pkt.setAttribute("cx", -20);
    if (!full) { empty("sjp"); empty("o7"); outs.forEach(function (k) { bx(k).classList.add("off"); }); }
    setH(full ? 10 : 0);   // 止まっている時(全部できた図)は最後の工数を出しておく
    step.innerHTML = step0;
  }
  async function play(id) {
    reset(false);
    step.innerHTML = "主管工場から 社内図・マル即、電線明細から 電線データ が届く";
    var f2 = fly("w", 900, id);
    if (!(await fly("m", 900, id))) return;
    await f2;
    step.innerHTML = "<b>生産準備+</b> のファイル 1 つに入れる";
    if (!(await make("sjp", 1400, 4, id))) return;
    step.innerHTML = "各成果物は<b>自動で作成</b>";
    for (var j = 0; j < outs.length; j++) {
      if (outs[j] === "o7") { arrow("o7", true); bx("o7").classList.remove("off"); if (!(await make("o7", 500, 1, id))) return; continue; }
      if (!(await auto(outs[j], id))) return;
      if (!(await sleep(120, id))) return;
    }
    if (!(await sleep(800, id))) return;
    for (var n = 1; n <= 5; n++) {
      step.innerHTML = "<b>マル即(設計変更) " + n + " 回目</b>: 生産準備+ を<b>1 か所直せば全部に反映</b>";
      bx("maru").classList.add("hot");
      if (!(await fly("m", n === 1 ? 600 : 400, id))) return;
      bx("maru").classList.remove("hot");
      bx("sjp").classList.add("typing");
      var h0 = hours;
      if (!(await sleep(n === 1 ? 500 : 300, id))) return;
      setH(h0 + 1);
      bx("sjp").classList.remove("typing");
      outs.forEach(function (k) { bx(k).classList.add("flash"); });
      if (!(await sleep(500, id))) return;
      outs.forEach(function (k) { bx(k).classList.remove("flash"); });
      if (!(await sleep(n === 1 ? 600 : 350, id))) return;
    }
    setH(10);
    step.innerHTML = "マル即 5 回でも、直すのは<b>生産準備+ だけ</b>";
    if (!(await sleep(4500, id))) return;
    stop();
  }
  function stop() {
    run++;
    w.classList.remove("ba-play");
    reset(true);
  }
  w.addEventListener("click", function () {
    if (w.classList.contains("ba-play")) { stop(); return; }
    run++;
    w.classList.add("ba-play");
    play(run);
  });
  reset(true);
});
