"use client";

import { Button, useColorMode } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa6";
import {
  SECTION4_ITEMS,
  SECTION4_1_LEGEND,
  SECTION4_1_NOTES,
  SECTION4_2_INTRO,
  SECTION4_2_ITEMS,
} from "./section4Content";

export default function MaintenancePdfSection() {
  const { colorMode } = useColorMode();

  const handlePrint = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    // セクション4
    const sec4Html = SECTION4_ITEMS.map(
      (item) =>
        `<div style="margin-bottom:12px;">
          <p style="font-weight:bold; margin:0 0 4px;">${item.heading}</p>
          ${item.lines.map((l) => `<p style="margin:2px 0;">${l}</p>`).join("")}
        </div>`,
    ).join("");

    // セクション4-1 グラフ（div+%幅で再現）
    const graphHtml = `
      <div style="display:grid; grid-template-columns:80px 1fr; gap:0; margin-bottom:16px;">
        <div></div>
        <div style="position:relative; padding-bottom:4px;">
          <div style="display:grid; grid-template-columns:25% 75%; font-size:10px; color:#666;">
            <span>納品</span>
            <span style="text-align:right;">1年</span>
          </div>
          <span style="position:absolute; left:25%; top:0; font-size:10px; color:#666; transform:translateX(-50%);">3ヶ月</span>
        </div>

        <div style="font-size:10px; font-weight:bold; color:#555; display:flex; align-items:center; padding-right:8px;">初期調整</div>
        <div style="display:grid; grid-template-columns:25% 75%; gap:0;">
          <div style="background:#68D391; height:24px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:10px; color:white; font-weight:bold;">無償</div>
          <div style="height:24px;"></div>
        </div>

        <div style="font-size:10px; font-weight:bold; color:#555; display:flex; align-items:center; padding-right:8px; margin-top:4px;">不具合対応</div>
        <div style="display:grid; grid-template-columns:25% 50% 25%; gap:0; margin-top:4px;">
          <div style="background:#90CDF4; height:24px; border-radius:3px 0 0 3px; display:flex; align-items:center; justify-content:center; font-size:10px; color:white; font-weight:bold;">無償</div>
          <div style="background:#4299E1; height:24px; display:flex; align-items:center; justify-content:center; font-size:10px; color:white; font-weight:bold;">仕様内のみ無償</div>
          <div style="background:#2C5282; height:24px; border-radius:0 3px 3px 0; display:flex; align-items:center; justify-content:center; font-size:10px; color:white; font-weight:bold;">※延長あり→</div>
        </div>
      </div>`;

    const legendHtml = SECTION4_1_LEGEND.map(
      (item) =>
        `<div style="display:flex; align-items:flex-start; gap:6px; margin-bottom:4px;">
          <div style="width:12px; height:12px; background:${item.hex}; border-radius:2px; flex-shrink:0; margin-top:2px;"></div>
          <span style="font-size:10px; color:#555;">${item.label}</span>
        </div>`,
    ).join("");

    const notesHtml = SECTION4_1_NOTES.map(
      (n) => `<p style="font-size:10px; color:#444; margin:4px 0;">${n}</p>`,
    ).join("");

    // セクション4-2
    const sec42Html = SECTION4_2_ITEMS.map(
      (item) =>
        `<div style="margin-bottom:10px;">
          <p style="font-weight:bold; font-size:10px; margin:0 0 3px;">${item.heading}</p>
          ${item.lines.map((l) => `<p style="margin:2px 0;">${l}</p>`).join("")}
        </div>`,
    ).join("");

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>保守・保証説明資料_${dateStr}</title>
<style>
  @page { size: A4; margin: 20mm 25mm; @bottom-right { content: counter(page) " / " counter(pages); font-size: 10px; color: #333; } }
  * { box-sizing: border-box; }
  body { font-family: "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif; font-size: 11px; margin: 0; color: #111; line-height: 1.7; }
  h1 { text-align: center; font-size: 18px; font-weight: bold; letter-spacing: 0.2em; margin: 0 0 20px; }
  h2 { font-size: 13px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 3px; margin: 20px 0 10px; }
  p { margin: 3px 0; font-size: 11px; }
</style></head>
<body>
<h1>保守・保証説明資料</h1>

<h2>4. 保守点検の考え方</h2>
${sec4Html}

<h2>4-1. 保証・サポート範囲</h2>
${graphHtml}
${legendHtml}
${notesHtml}

<h2>4-2. 外部要因による影響について</h2>
<p style="margin-bottom:10px;">${SECTION4_2_INTRO}</p>
<p style="font-weight:bold; margin-bottom:6px;">不具合が発生し得る外部要因</p>
<div style="padding-left:12px;">
${sec42Html}
</div>

</body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
    }, 300);
  };

  return (
    <Button
      size="xs"
      leftIcon={<FaDownload />}
      variant="outline"
      borderColor={
        colorMode === "light"
          ? "custom.theme.dark.300"
          : "custom.theme.light.800"
      }
      color={
        colorMode === "light"
          ? "custom.theme.dark.300"
          : "custom.theme.light.800"
      }
      onClick={handlePrint}
    >
      PDF
    </Button>
  );
}
