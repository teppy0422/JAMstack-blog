import React, { useContext } from "react";
import { useLanguage, LanguageProvider } from "../context/LanguageContext";

type MessageDisplayProps = {
  ja: string;
  us?: string;
  cn?: string;
  language: string;
};

const getMessage = ({ ja, us, cn, language }: MessageDisplayProps): string => {
  const translations = {
    お使いのブラウザは動画タグをサポートしていません: {
      us: "Your browser does not support video tags",
      cn: "您的浏览器不支持视频标记",
    },
    更新日: { us: "renewal date", cn: "更新日" },
    はじめに: { us: "Introduction", cn: "介绍" },
    開発: { us: "Development", cn: "发展" },
    高知: { us: "Kochi", cn: "高知" },
    徳島: { us: "Tokushima", cn: "徳島" },
    本社: { us: "Head office", cn: "总部" },
    生産準備: { us: "Production Preparation", cn: "生产准备" },
    "生産準備+": { us: "Production Preparation+", cn: "生产准备+" },
    生準: { us: "Prod Prep", cn: "生准" },
    "生準+": { us: "Prod Prep+", cn: "生准+" },
    先ハメ誘導ナビ: {
      us: "first insert navigation system",
      cn: "首次插入导航系统",
    },
    順立生産システム: {
      us: "Sequential Production System",
      cn: "顺序生产系统",
    },
    "順立生産システム+": {
      us: "Sequential Production System+",
      cn: "顺序生产系统+",
    },
    誘導ポイント設定一覧表: {
      us: "Induction point setting list",
      cn: "感应点设置列表",
    },
    "誘導ポイント設定一覧表+": {
      us: "Induction point setting list+",
      cn: "感应点设置列表+",
    },
    配策誘導ナビ: {
      us: "Guidance Navigation",
      cn: "布局引导导航系统",
    },
    "誘導ナビ.net": {
      us: "GuidanceNavi.net",
      cn: "GuidanceNavi.net",
    },
    検査履歴システム: { us: "Inspection History System", cn: "检查记录系统" },
    作業工数: {
      us: "Person-hours",
      cn: "作業工数",
    },
    導通検査: { us: "continuity check", cn: "连续性检查" },
    開発履歴: { us: "Development History", cn: "发展历程" },
    生産効率化: { us: "Production Efficiency", cn: "生产效率" },
    相談: { us: "Consultation", cn: "协商" },
    SB: { us: "SB", cn: "SB" },
    UK: { us: "UK", cn: "UK" },
    まとめ: { us: "Summary", cn: "总结" },
    作成途中: { us: "on the way", cn: "作成途中" },
  };

  const {
    us: translatedUs = "untranslated:(" + ja + ")",
    cn: translatedCn = "未翻译:(" + ja + ")",
  } = translations[ja] || { us, cn };

  switch (language) {
    case "ja":
      return ja;
    case "us":
      return translatedUs;
    case "cn":
      return translatedCn;
    default:
      return ja; // デフォルトは日本語
  }
};

export default getMessage;
