"use client";

import { Button, useColorMode } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa6";
import {
  SECTION2_PURPOSE,
  SECTION2_TARGET,
  SECTION2_ISSUES,
  SECTION2_FEATURES,
  SECTION2_INTERFACE,
  SECTION2_SYSTEM,
} from "./section2Content";

export default function SystemOverviewPdfSection() {
  const { colorMode } = useColorMode();

  const handlePrint = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    const issuesHtml = SECTION2_ISSUES.map(
      (item) =>
        `<tr>
          <td style="font-weight:600; color:#666; white-space:nowrap; padding:3px 12px 3px 0;">${item.label}</td>
          <td style="padding:3px 0;">${item.text}</td>
        </tr>`,
    ).join("");

    const featuresHtml = SECTION2_FEATURES.map(
      (item) =>
        `<div style="margin-bottom:10px; padding-left:12px;">
          <p style="font-weight:bold; margin:0 0 3px;">${item.title}</p>
          <p style="color:#444; margin:0;">${item.text}</p>
        </div>`,
    ).join("");

    const interfaceHtml = SECTION2_INTERFACE.map(
      (item) =>
        `<tr>
          <td style="font-weight:600; color:#666; white-space:nowrap; padding:3px 12px 3px 0;">${item.label}</td>
          <td style="padding:3px 0;">${item.text}</td>
        </tr>`,
    ).join("");

    const systemHtml = SECTION2_SYSTEM.map(
      (item) =>
        `<tr>
          <td style="font-weight:600; color:#666; white-space:nowrap; padding:3px 12px 3px 0;">${item.label}</td>
          <td style="padding:3px 0;">${item.text}</td>
        </tr>`,
    ).join("");

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>システム概要書_${dateStr}</title>
<style>
  @page { size: A4; margin: 20mm 25mm; }
  * { box-sizing: border-box; }
  body { font-family: "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif; font-size: 11px; margin: 0; color: #111; line-height: 1.7; }
  h1 { text-align: center; font-size: 18px; font-weight: bold; letter-spacing: 0.2em; margin: 0 0 20px; }
  h2 { font-size: 13px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 3px; margin: 20px 0 10px; }
  p { margin: 3px 0; font-size: 11px; }
  table { border-collapse: collapse; width: 100%; }
</style></head>
<body>
<h1>システム概要書</h1>

<h2>2.1 目的</h2>
<p>${SECTION2_PURPOSE}</p>

<h2>2.2 対象工程</h2>
<p>${SECTION2_TARGET}</p>

<h2>2.3 解決する課題</h2>
<table>${issuesHtml}</table>

<h2>2.4 主要機能</h2>
${featuresHtml}

<h2>2.5 操作インターフェース</h2>
<table>${interfaceHtml}</table>

<h2>2.6 システム構成</h2>
<table>${systemHtml}</table>

</body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 300);
  };

  return (
    <Button
      size="xs"
      leftIcon={<FaDownload />}
      variant="outline"
      borderColor={
        colorMode === "light" ? "custom.theme.dark.300" : "custom.theme.light.800"
      }
      color={
        colorMode === "light" ? "custom.theme.dark.300" : "custom.theme.light.800"
      }
      onClick={handlePrint}
    >
      PDF
    </Button>
  );
}
