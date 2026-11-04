// 4-1 の UI_40: 選んだ内容に合う 写真 → 背景 → 穴の絵 を重ねる(Sjp の hamePreview_m.showHamePreview と同じ並べ方)
// 絵と並べ方は assets/hame_preview(UI_40 で sample にチェックして作成実行した menu\sample_preview の data.txt と img)
(function () {
  var D = {
    bg: {},
    combo: {},
    st: [],
    bgOpts: [],
    holeOpts: [],
    photo: null,
    made: "",
  };
  (window.HP_TXT || "")
    .replace(/\r/g, "")
    .split("\n")
    .forEach(function (ln) {
      var a = ln.split("\t");
      if (a.length < 2) return;
      if (a[0] === "made") D.made = a[1];
      else if (a[0] === "photo") D.photo = a;
      else if (a[0] === "bgOpts") D.bgOpts = a.slice(1);
      else if (a[0] === "holeOpts") D.holeOpts = a.slice(1);
      else if (a[0] === "bg") D.bg[a[1]] = a;
      else if (a[0] === "st") D.st.push(a);
      else if (a[0] === "combo") D.combo[a[1]] = a[2] || "";
    });
  // 上を横の穴に揃える絵(番号)
  var ALIGN_TOP = { 24: true, 37: true };
  function key(opts, sel) {
    return opts
      .map(function (n) {
        var v = sel[n];
        return v > 0 ? v : 0;
      })
      .join(".");
  }
  function px(v) {
    return v.toFixed(2) + "px";
  }
  // g: 外へ広げる px(穴の絵は写真の穴に合う様に 左・上へ 3px ずらして 幅・高さを 6px 大きく)
  // ey, eh: 上へずらす px・高さを足す px(3 行目の穴だけ 写真の穴に合わせる)
  function img(i, x, y, w, h, z, g, ey, eh) {
    g = g || 0;
    ey = ey || 0;
    eh = eh || 0;
    return (
      '<img src="assets/hame_preview/img/' +
      i +
      ".png?" +
      D.made +
      '" style="left:' +
      px(x * z - g) +
      ";top:" +
      px(y * z - g - ey) +
      ";width:" +
      px(w * z + g * 2) +
      ";height:" +
      px(h * z + g * 2 + eh) +
      '" alt="">'
    );
  }
  [].forEach.call(document.querySelectorAll(".ui40"), function (u) {
    var hp = u.querySelector(".hp");
    // 「クリックで操作を始める」(操作できる画面と同じ覆い)。押したら消して操作できる様にする
    var cover = u.querySelector(".ui40cover");
    if (cover) cover.addEventListener("click", function () { u.classList.add("on"); });
    function cb(n) {
      return u.querySelector('select[data-cb="' + n + '"]');
    }
    function show() {
      if (!hp) return;
      var sel = {};
      [].forEach.call(
        u.querySelectorAll("select[data-cb]"),
        function (c) {
          sel[c.getAttribute("data-cb")] = c.selectedIndex;
        },
      );
      var bg = D.bg[key(D.bgOpts, sel)] || D.bg[key(D.bgOpts, {})];
      if (!bg) {
        hp.innerHTML = "";
        return;
      }
      var ids = D.combo[key(D.holeOpts, sel)];
      if (ids === undefined) ids = D.combo[key(D.holeOpts, {})] || "";
      var z = hp.clientWidth / +bg[5],
        bx = +bg[3],
        by = +bg[4],
        h = "";
      if (D.photo)
        h += img(D.photo[1], bx, by, +D.photo[2], +D.photo[3], z);
      h += img(bg[2], 0, 0, +bg[5], +bg[6], z);
      var ts = ids.split(",").map(function (n) {
        return n === "" ? null : D.st[+n];
      });
      // 穴の行(縦の真ん中が 4 より近い物は同じ行)。上から 3 行目の穴は top -2px・height +2px
      var rows = [];
      ts.forEach(function (t) {
        if (!t) return;
        var c = +t[3] + +t[5] / 2;
        if (!rows.some(function (r) { return Math.abs(r - c) < 4; })) rows.push(c);
      });
      rows.sort(function (a, b) { return a - b; });
      ts.forEach(function (t) {
        if (!t) return;
        var y = +t[3],
          c0 = y + +t[5] / 2,
          r3 = rows.length > 2 && Math.abs(rows[2] - c0) < 4;
        // 左上の穴(24.png)は横の穴と上を揃える(同じ行 = 縦の真ん中が近い他の穴の一番上に合わせる)
        if (ALIGN_TOP[t[1]]) {
          var c = y + +t[5] / 2;
          ts.forEach(function (o) {
            if (o && o !== t && Math.abs(+o[3] + +o[5] / 2 - c) < 4) y = Math.min(y, +o[3]);
          });
        }
        h += img(t[1], bx + +t[2], by + y, +t[4], +t[5], z, 3, r3 ? 2 : 0, r3 ? 2 : 0);
      });
      hp.innerHTML = h;
    }
    u.addEventListener("change", show);
    [].forEach.call(u.querySelectorAll("button[data-p]"), function (b) {
      b.addEventListener("click", function () {
        var v = JSON.parse(b.getAttribute("data-p"));
        Object.keys(v).forEach(function (n) {
          if (cb(n)) cb(n).selectedIndex = v[n];
        });
        b.classList.add("hit");
        setTimeout(function () {
          b.classList.remove("hit");
        }, 200);
        show();
      });
    });
    if (window.ResizeObserver) new ResizeObserver(show).observe(u);
    // 初めの選び方は data-init の付いたプリセット(サブ図)を押した時と同じ
    var ini = u.querySelector("button[data-p][data-init]");
    if (ini) {
      var v0 = JSON.parse(ini.getAttribute("data-p"));
      Object.keys(v0).forEach(function (n) {
        if (cb(n)) cb(n).selectedIndex = v0[n];
      });
    }
    show();
  });
})();
