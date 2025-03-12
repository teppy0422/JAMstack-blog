// components/ColorMapper.tsx
import React from "react";

interface ColorMapperProps {
  text: string;
}
export const GetColor = (text: string): string => {
  const colorMap: Record<string, string> = {
    "生産準備+": "#1f9b60",
    "CAMERA+": "#854c8f",
    "誘導ナビ.net": "#854c8f",
    "部材一覧+": "#1f9b60",
    順立生産システム: "#bd4a55",
    誘導ポイント設定一覧表: "#1f9b60",
    このWEBアプリ: "orange",
    その他: "gray",

    "追加/修正": "blue",
    不具合: "red",
    一般: "gray",
    提案: "purple",
  };

  // デフォルトカラーを設定
  const defaultColor = "#000000";
  return colorMap[text] || defaultColor;
};
