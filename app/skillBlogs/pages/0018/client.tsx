"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, useColorMode } from "@chakra-ui/react";

import Frame from "../../components/frame";

// 記事本体は public/html/skillBlogs/0018/ の静的HTML。iframeで表示し、
// 見出し(section[data-title])を読み取って右の目次に出す
const ARTICLE_SRC = "/html/skillBlogs/0018/index.html";
// 目次を隠したかどうかをこのブラウザに覚えておくキー
const HIDE_NAV_KEY = "skillBlogs0018HideNav";
// 記事(theme.js)がテーマを覚えるキー。iframeは同じオリジンなので読み込み前に書けば反映される
const ARTICLE_THEME_KEY = "sjpBlogTheme";
// URLで開き方を指定できる。例: /skillBlogs/pages/0018/?toc=hide&theme=dark
//   toc=hide  … 目次を隠した(最大化した)状態で開く。toc=show で表示した状態
//   theme=dark … ダークモードで開く。theme=light でライトモード
//   guest=1    … ログインしていなくても記事を表示する
const NAV_BUTTON_ID = "navToggle";
// 左右に目次がある時(開いた本) / 目次を隠した時(閉じた本)
const ICON_SHOWN =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16"/></svg>';
const ICON_HIDDEN =
  '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/></svg>';
// 左右の目次が出る画面幅(Chakraのlg)。これより狭いと目次は元から出ないので、最大化中以外はボタンを隠す
const NAV_MEDIA_QUERY = "(min-width: 62em)";
// 最大化中に iframe 内のスクロールバーを消すスタイル
const HIDE_SCROLLBAR_STYLE_ID = "navHideScrollbar";
const HIDE_SCROLLBAR_CSS =
  "html, body { scrollbar-width: none; } html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }";
// サイトのヘッダー(zIndex 2000)より手前に出す
const MAXIMIZED_Z_INDEX = 2050;

export default function BlogPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  // sections は ref なので、読み取り後に再描画して目次へ反映させる
  const [, setTocVersion] = useState(0);
  const [hideNav, setHideNav] = useState(false);
  const [allowGuest, setAllowGuest] = useState(false);
  const { setColorMode } = useColorMode();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toc = params.get("toc");
    if (toc === "hide" || toc === "show") {
      setHideNav(toc === "hide");
    } else {
      try {
        setHideNav(localStorage.getItem(HIDE_NAV_KEY) === "1");
      } catch (e) {}
    }
    setAllowGuest(params.get("guest") === "1");
    const theme = params.get("theme");
    if (theme === "dark" || theme === "light") {
      setColorMode(theme);
      try {
        localStorage.setItem(ARTICLE_THEME_KEY, theme);
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleNav = () => {
    setHideNav((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(HIDE_NAV_KEY, next ? "1" : "0");
      } catch (e) {}
      return next;
    });
  };

  // 記事のヘッダー(iframe内)の「パスワードを入れて編集のボタンを出す」の左にボタンを差し込む
  const insertNavButton = (doc: Document) => {
    const lockBox = doc.getElementById("lockBox");
    const lock = doc.getElementById("lock");
    const header = lock?.parentElement;
    if (!lock || !header || doc.getElementById(NAV_BUTTON_ID)) return;
    const btn = doc.createElement("button");
    btn.type = "button";
    btn.id = NAV_BUTTON_ID;
    btn.className = "themebtn";
    btn.addEventListener("click", toggleNav);
    header.insertBefore(btn, lockBox ?? lock);
    // 右寄せの起点をこのボタンに移し、鍵の枠・鍵ボタンは他のボタンと同じ間隔で並べる
    btn.style.marginLeft = "auto";
    if (lockBox) lockBox.style.marginLeft = "-10px";
    lock.style.marginLeft = "-10px";
    updateNavButton(doc);
  };

  const updateNavButton = (doc: Document | null | undefined, hidden = hideNav) => {
    const btn = doc?.getElementById(NAV_BUTTON_ID);
    if (!btn) return;
    btn.innerHTML = hidden ? ICON_HIDDEN : ICON_SHOWN;
    btn.title = hidden ? "目次を表示" : "目次を隠す";
    btn.setAttribute("aria-label", btn.title);
    // 最大化中は戻せるよう、画面幅に関係なく出す
    btn.style.display = hidden || window.matchMedia(NAV_MEDIA_QUERY).matches ? "flex" : "none";

    let style = doc?.getElementById(HIDE_SCROLLBAR_STYLE_ID) as HTMLStyleElement | null;
    if (!style && doc) {
      style = doc.createElement("style");
      style.id = HIDE_SCROLLBAR_STYLE_ID;
      style.textContent = HIDE_SCROLLBAR_CSS;
      doc.head.appendChild(style);
    }
    if (style) style.disabled = !hidden;
  };

  // 最大化中は外側のページをスクロールさせない(外側のスクロールバーも消える)
  useEffect(() => {
    if (!hideNav) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hideNav]);

  useEffect(() => {
    const update = () => updateNavButton(iframeRef.current?.contentDocument, hideNav);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideNav]);

  const handleLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    insertNavButton(doc);
    sections.current = Array.from(
      doc.querySelectorAll<HTMLElement>("section[id][data-title]")
    ).map((el) => ({ id: el.id, title: el.dataset.title || el.id }));
    setTocVersion((v) => v + 1);
  };

  const scrollToSection = (id: string) => {
    const target = iframeRef.current?.contentDocument?.getElementById(id);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Frame
      sections={sections}
      sectionRefs={sectionRefs}
      onSectionClick={scrollToSection}
      isThrough={allowGuest}
      hideMenu={hideNav}
      hideToc={hideNav}
      hideReactions={hideNav}
      hideFooter={hideNav}
    >
      <Box
        {...(hideNav
          ? { position: "fixed", inset: 0, w: "100vw", h: "100dvh", zIndex: MAXIMIZED_Z_INDEX }
          : { position: "relative", w: "100%", h: "calc(100vh - 120px)", borderRadius: "md" })}
        overflow="hidden"
      >
        <iframe
          ref={iframeRef}
          src={ARTICLE_SRC}
          title="生産準備+とは"
          onLoad={handleLoad}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </Box>
    </Frame>
  );
}
