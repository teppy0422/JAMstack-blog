// ダークモード・ライトモードの切替(上のヘッダーの右のアイコン)。選んだ方をブラウザに覚える。初めは パソコンの設定(prefers-color-scheme)に合わせる
(function () {
  var KEY = "sjpBlogTheme", root = document.documentElement;
  var btn = document.getElementById("theme");
  if (!btn) return;
  // アイコン: ダークの時は太陽(押すとライト)、ライトの時は月(押すとダーク)
  var SUN = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>';
  var t = null;
  try { t = localStorage.getItem(KEY); } catch (e) {}
  if (t !== "dark" && t !== "light") t = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  function set(v) {
    t = v;
    if (v === "dark") root.setAttribute("data-theme", "dark"); else root.removeAttribute("data-theme");
    btn.innerHTML = v === "dark" ? SUN : MOON;
    btn.title = v === "dark" ? "ライトモードにする" : "ダークモードにする";
    btn.setAttribute("aria-label", btn.title);
  }
  btn.addEventListener("click", function () {
    set(t === "dark" ? "light" : "dark");
    try { localStorage.setItem(KEY, t); } catch (e) {}
  });
  set(t);
})();
