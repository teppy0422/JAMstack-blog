import React, { useContext } from "react";
import { useLanguage, LanguageProvider } from "../src/contexts/LanguageContext";

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
    部材一覧: { us: "Parts List", cn: "物料清单" },
    "部材一覧+": { us: "Parts List+", cn: "物料清单+" },
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
      us: "Harness Placement Guide",
      cn: "线束安装引导",
    },
    "誘導ナビ.net": {
      us: "GuidanceNavi.net",
      cn: "GuidanceNavi.net",
    },
    ポイント点滅: { us: "Point Blinking", cn: "点闪烁" },
    検査履歴システム: { us: "Inspection History System", cn: "检查记录系统" },
    先ハメ: { us: "Pre-Fitting", cn: "先装" },
    先ハメ誘導: { us: "Pre-Fitting Guidance", cn: "先装引导" },
    後ハメ: { us: "Post-Fitting", cn: "后装" },
    後ハメ誘導: { us: "Post-Fitting  Guidance", cn: "后装引导" },
    ハメ図: { us: "Fittingfigure", cn: "装图" },
    竿レイアウト: { us: "Rod layout", cn: "杆件布局" },
    サブ図: { us: "Subfigure", cn: "子图" },
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
    新機能: { us: "new feature", cn: "新功能" },
    王さん: { us: "Ms.ou", cn: "王女士" },
    不具合: { us: "undesirable", cn: "不具合" },
    桑原さん: { us: "Ms.kuwahara", cn: "桑原女士" },
    秋山さん: { us: "Ms.akiyama", cn: "秋山女士" },
    小崎さん: { us: "Ms.kosaki", cn: "小崎女士" },
    Win10zip: { us: "Win10zip", cn: "Win10zip" },
    山田さん: { us: "Ms.yamada", cn: "山田女士" },
    小松さん: { us: "Mr.komatsu", cn: "小松先生" },
    緒方さん: { us: "Mr.ogata", cn: "緒方先生" },
    書き直し: { us: "rewrite", cn: "重拟" },
    更新: { us: "update", cn: "更新" },
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
