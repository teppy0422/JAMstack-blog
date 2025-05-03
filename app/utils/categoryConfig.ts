export const CATEGORY_CONFIG = {
  おつまみ: { bg: "#f56464", color: "#fff", order: 1 },
  刺身: { bg: "#4199e0", color: "#fff", order: 2 },
  焼き物: { bg: "#ed8937", color: "#fff", order: 3 },
  揚げ物: { bg: "#edca4c", color: "#333", order: 4 },
  鍋もの: { bg: "#4a5568", color: "#fff", order: 8 }, // gray.600
  ご飯もの: { bg: "#f6ad55", color: "#333", order: 5 }, // orange.400
  煮物: { bg: "#fbd38d", color: "#333", order: 6 }, // orange.200
  やさい: { bg: "#49ba78", color: "#fff", order: 7 },
  アルコール: { bg: "#a07aeb", color: "#fff", order: 9 },
  ドリンク: { bg: "#2a6bb0", color: "#fff", order: 10 },
  デザート: { bg: "#fd94c6", color: "#fff", order: 11 }, // pink.500
  その他: { bg: "#888", color: "#fff", order: 12 },
} as const;

export const NUTRIENTS_CONFIG_ = {
  カロリー: { unit: "kcal", average: 2400, max: 2500, color: "#f56464" }, // 赤
  タンパク質: { unit: "g", average: 55, max: 150, color: "#4199e0" }, // 青
  脂質: { unit: "g", average: 600, max: 85, color: "#ed8937" }, // オレンジ
  炭水化物: { unit: "g", average: 1200, max: 450, color: "#edca4c" }, // 黄色
  植物繊維: { unit: "g", average: 20, max: 60, color: "#49ba78" }, // 緑
  カルシウム: { unit: "mg", average: 750, max: 2500, color: "#4a5568" }, // グレー
  鉄: { unit: "mg", average: 9, max: 45, color: "#a07aeb" }, // 紫
  ビタミンA: { unit: "μgRAE", average: 800, max: 2500, color: "#fd94c6" }, // ピンク
  ビタミンB群: { unit: "mg", average: 4, max: 60, color: "#fbd38d" }, // 薄いオレンジ
  ビタミンC: { unit: "mg", average: 100, max: 2000, color: "#2a6bb0" }, // 濃い青
  ビタミンD: { unit: "μg", average: 9.5, max: 100, color: "#888" }, // 灰色
  カリウム: { unit: "mg", average: 2800, max: 3500, color: "#f6ad55" }, // 明るいオレンジ
  ナトリウム: { unit: "g", average: 5, max: 7.5, color: "#99ba78" }, // 緑
};

export const searchCategoryBg = (searchTerm: string): string[] => {
  return Object.entries(CATEGORY_CONFIG)
    .filter(([category]) => category.includes(searchTerm))
    .map(([, config]) => config.bg);
};

export const searchCategoryColor = (searchTerm: string): string[] => {
  return Object.entries(CATEGORY_CONFIG)
    .filter(([category]) => category.includes(searchTerm))
    .map(([, config]) => config.color);
};
