export const CATEGORY_CONFIG = {
  おつまみ: { bg: "#f56464", color: "#fff", order: 1 },
  刺身: { bg: "#4199e0", color: "#fff", order: 2 },
  焼き物: { bg: "#ed8937", color: "#fff", order: 3 },
  揚げ物: { bg: "#edca4c", color: "#333", order: 4 },
  ご飯もの: { bg: "#f6ad55", color: "#333", order: 5 }, // orange.400
  麺もの: { bg: "#fbd38d", color: "#333", order: 6 }, // orange.200
  サラダ: { bg: "#49ba78", color: "#fff", order: 7 },
  鍋もの: { bg: "#4a5568", color: "#fff", order: 8 }, // gray.600
  アルコール: { bg: "#a07aeb", color: "#fff", order: 9 },
  ドリンク: { bg: "#2a6bb0", color: "#fff", order: 10 },
  デザート: { bg: "#fd94c6", color: "#fff", order: 11 }, // pink.500
  その他: { bg: "#888", color: "#fff", order: 12 },
} as const;

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
