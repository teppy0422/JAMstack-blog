"use client";

import { Button, useColorMode, useToast } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa6";

interface Props {
  targetId: string;
}

export default function FlowDiagramPdfSection({ targetId }: Props) {
  const { colorMode } = useColorMode();
  const toast = useToast();

  const handleExport = async () => {
    const el = document.getElementById(targetId);
    if (!el) return;

    toast({ title: "PDF生成中...", status: "loading", duration: null, id: "pdf-loading" });

    try {
      const html2canvas = (await import("html2canvas")).default;

      // ズームボタンを一時非表示
      const controls = el.querySelector(".react-flow__controls") as HTMLElement | null;
      if (controls) controls.style.visibility = "hidden";

      // 要素の実際の全体サイズでキャプチャ
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });

      // ズームボタンを元に戻す
      if (controls) controls.style.visibility = "";

      const imgData = canvas.toDataURL("image/png");
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>操作フロー図_${dateStr}</title>
<style>
  @page { size: A4 portrait; margin: 15mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif; background: white; }
  h2 { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
  img {
    width: 100%;
    height: auto;
    max-height: calc(297mm - 30mm - 30px);
    object-fit: contain;
    display: block;
  }
</style></head>
<body>
  <h2>2-1. 手圧着アプリ操作フロー図</h2>
  <img src="${imgData}" />
</body></html>`;

      const win = window.open("", "_blank");
      if (!win) return;
      win.document.open();
      win.document.write(html);
      win.document.close();
      setTimeout(() => { win.focus(); win.print(); }, 500);
    } catch (e) {
      console.error(e);
      toast({ title: "PDF生成に失敗しました", status: "error", duration: 3000 });
    } finally {
      toast.close("pdf-loading");
    }
  };

  return (
    <Button
      size="xs"
      leftIcon={<FaDownload />}
      variant="outline"
      borderColor={colorMode === "light" ? "custom.theme.dark.300" : "custom.theme.light.800"}
      color={colorMode === "light" ? "custom.theme.dark.300" : "custom.theme.light.800"}
      onClick={handleExport}
    >
      PDF
    </Button>
  );
}
