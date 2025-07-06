export interface MenuItem {
  id: number;
  brewingDate: Date | null;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  imageUrlSub: string;
  ingredients: { name: string; location: string }[];
  nutrients: string[];
  is_visible: boolean;
  recommendation_level: number;
  estimated_time: number;
  recipe: string;
  created_at: string;
  isSoldOut: boolean;
  user_id: string;
  quantity: number;
  createdAt?: Date | null;
  addedAt?: Date | null;
  hoveredAt?: Date | null;
}

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
  離乳食: { bg: "#fdc4f6", color: "#fff", order: 11 }, // pink.500
  その他: { bg: "#888", color: "#fff", order: 12 },
} as const;

export const NUTRIENTS_CONFIG_ = {
  カロリー: { unit: "kcal", color: "#f56464" }, // 赤
  タンパク質: { unit: "g", color: "#4199e0" }, // 青
  脂質: { unit: "g", color: "#f5a623" }, // 橙
  炭水化物: { unit: "g", color: "#8b572a" }, // 茶
  食物繊維: { unit: "g", color: "#00a86b" }, // 緑

  ビタミンA: { unit: "μgRAE", color: "#ff7f50" },
  ビタミンD: { unit: "μg", color: "#fbc02d" },
  ビタミンC: { unit: "mg", color: "#e57373" },

  カルシウム: { unit: "mg", color: "#7986cb" },
  鉄: { unit: "mg", color: "#ef5350" },
  亜鉛: { unit: "mg", color: "#ffa726" },
  ナトリウム: { unit: "mg", color: "#90a4ae" },
  葉酸: { unit: "μg", color: "#8d6e63" },
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

export const getTotalByName = (name: string, transformedData: any): number => {
  // `transformedData` から `name` が一致するオブジェクトを取得
  const matchingData = transformedData.find((item: any) => item.name === name);
  if (!matchingData) return 0; // 一致するデータがない場合は 0 を返す
  // オブジェクト内の値を合計（`name` プロパティを除外）
  return Object.entries(matchingData)
    .filter(([key]) => key !== "name") // "name" プロパティを除外
    .reduce(
      (sum, [, value]) => sum + (typeof value === "number" ? value : 0),
      0
    ); // 数値のみを合計
};

// visibleDataを指定された形に変換し、数値をaverageで割る
export const transformData = (visibleData: MenuItem[], config: any) => {
  return Object.keys(config).map((nutrient) => {
    const average = config[nutrient].average; // averageを取得
    return {
      name: nutrient,
      ...visibleData.reduce((acc, item) => {
        const nutrientValue = item.nutrients
          .find((n) => n.startsWith(nutrient))
          ?.split(":")[1];
        const value = parseFloat(nutrientValue || "0") * item.quantity; // quantityを考慮
        return {
          ...acc,
          [item.name]: Math.round((value / average) * 100), // averageで割る
        };
      }, {}),
    };
  });
};

// 6か月〜1歳（離乳期後半）
export const NUTRIENTS_CONFIG_6M_1Y = {
  カロリー: {
    average: 550,
    max: 700,
    comment: "成長と活動に必要なエネルギー。母乳・離乳食から",
  },
  タンパク質: {
    average: 9,
    max: 15,
    comment: "体の基本構成成分。豆腐や白身魚で補助",
  },
  脂質: {
    average: 30,
    max: 40,
    comment: "脳の発達とエネルギー供給。母乳中心で良質な脂質",
  },
  炭水化物: {
    average: 95,
    max: 110,
    comment: "エネルギー源。乳糖と補完食から",
  },
  食物繊維: {
    average: 2,
    max: 5,
    comment: "腸内環境を整える。離乳食初期は控えめに",
  },
  ビタミンA: {
    average: 300,
    max: 600,
    comment: "免疫や視力に関与。野菜ペーストで少量ずつ",
  },
  ビタミンD: {
    average: 5,
    max: 25,
    comment: "骨の形成。日光浴や母乳強化で対応",
  },
  ビタミンC: {
    average: 40,
    max: 200,
    comment: "免疫サポート。果物ピューレなどから",
  },
  カルシウム: {
    average: 250,
    max: 600,
    comment: "骨と歯の形成。母乳・粉ミルクが主な供給源",
  },
  鉄: {
    average: 6.5,
    max: 40,
    comment: "離乳期に不足しやすい。レバーや鉄強化食品で補う",
  },
  亜鉛: {
    average: 2.5,
    max: 4,
    comment: "成長や免疫に必要。肉や魚を離乳食で少しずつ",
  },
  ナトリウム: {
    average: 200,
    max: 300,
    comment:
      "塩分控えめが基本。不足すると電解質バランスが崩れ食欲不振、活動の低下。過剰摂取で腎臓への負担、脱水症状、将来的な高血圧と生活習慣病と味覚への悪影響",
  },
};

// 1〜2歳（乳幼児）
export const NUTRIENTS_CONFIG_1_2Y = {
  カロリー: {
    average: 950,
    max: 1200,
    comment: "急速な成長と活動に必要な最低限のエネルギー量",
  },
  タンパク質: {
    average: 15,
    max: 30,
    comment: "筋肉・臓器・免疫系の発達に重要。魚・豆腐などから",
  },
  脂質: {
    average: 30,
    max: 40,
    comment: "脳の発達とエネルギー補給のために不可欠",
  },
  炭水化物: {
    average: 130,
    max: 150,
    comment: "活動エネルギー源。ごはんやパンを主に",
  },
  食物繊維: {
    average: 5,
    max: 10,
    comment: "腸内環境を整えるが、摂りすぎには注意",
  },
  ビタミンA: {
    average: 400,
    max: 600,
    comment: "目や皮膚の健康維持に必須。緑黄色野菜などから",
  },
  ビタミンD: {
    average: 5,
    max: 50,
    comment: "骨の発達に重要。日光と食品の両方で補給",
  },
  ビタミンC: {
    average: 35,
    max: 400,
    comment: "免疫力と鉄の吸収をサポート。果物から取りやすい",
  },
  カルシウム: {
    average: 450,
    max: 1000,
    comment: "骨や歯の形成に重要。乳製品などから十分に",
  },
  鉄: {
    average: 4.5,
    max: 20,
    comment: "脳と体の発達に不可欠。不足に注意",
  },
  亜鉛: {
    average: 3,
    max: 7,
    comment: "味覚や成長に関与。多様な食品からバランスよく",
  },
  ナトリウム: {
    average: 1000,
    max: 1500,
    comment: "不足で食欲不振",
  },
};

// 3〜5歳（幼児）
export const NUTRIENTS_CONFIG_3_5Y = {
  カロリー: {
    average: 1300,
    max: 1500,
    comment: "成長と日常活動に必要なエネルギーを確保",
  },
  タンパク質: {
    average: 20,
    max: 40,
    comment: "身体の成長や免疫機能の維持に重要",
  },
  脂質: {
    average: 40,
    max: 50,
    comment: "少量でも高エネルギー。発達期には必要不可欠",
  },
  炭水化物: {
    average: 180,
    max: 200,
    comment: "脳や身体の主要エネルギー源。主食を中心にバランスよく",
  },
  食物繊維: {
    average: 8,
    max: 12,
    comment: "腸内環境を整える。野菜や果物から摂取を心がける",
  },
  ビタミンA: {
    average: 450,
    max: 700,
    comment: "目や皮膚、免疫機能の発達をサポート",
  },
  ビタミンD: {
    average: 5.5,
    max: 50,
    comment: "骨の形成に必須。日光浴と併せて摂取",
  },
  ビタミンC: {
    average: 45,
    max: 500,
    comment: "免疫力向上と鉄の吸収促進に有効",
  },
  カルシウム: {
    average: 600,
    max: 1200,
    comment: "歯や骨の発達に欠かせない。不足しがちなので意識的に",
  },
  鉄: {
    average: 5.5,
    max: 30,
    comment: "貧血予防と成長促進に重要。吸収の良い食材を選ぶ",
  },
  亜鉛: {
    average: 4,
    max: 12,
    comment: "味覚・免疫・成長など広範囲に関与する必須ミネラル",
  },
  ナトリウム: {
    average: 1200,
    max: 1800,
    comment: "塩分過多を防ぐために加工食品の摂りすぎに注意",
  },
};

// 6〜11歳（小児）
export const NUTRIENTS_CONFIG_6_11Y = {
  カロリー: {
    average: 1700,
    max: 2100,
    comment: "活動量と成長に見合ったエネルギーをしっかり確保",
  },
  タンパク質: {
    average: 30,
    max: 60,
    comment: "筋肉・臓器・酵素など身体の材料として重要",
  },
  脂質: {
    average: 50,
    max: 65,
    comment: "エネルギー源として必要だが、質の良い脂質を心がける",
  },
  炭水化物: {
    average: 220,
    max: 280,
    comment: "脳と体の主要なエネルギー源。過剰摂取は肥満に注意",
  },
  食物繊維: {
    average: 10,
    max: 15,
    comment: "腸内環境の改善や便通の安定に役立つ",
  },
  ビタミンA: {
    average: 600,
    max: 1000,
    comment: "視力の維持や免疫機能のサポートに関与",
  },
  ビタミンD: {
    average: 6,
    max: 60,
    comment: "骨や歯の発育に必要。日光不足に注意",
  },
  ビタミンC: {
    average: 60,
    max: 600,
    comment: "免疫力を高め、風邪予防にも効果的",
  },
  カルシウム: {
    average: 700,
    max: 1300,
    comment: "骨や歯の形成期に欠かせない栄養素",
  },
  鉄: {
    average: 6.5,
    max: 40,
    comment: "成長や貧血予防に重要。吸収率の良い形での摂取が望ましい",
  },
  亜鉛: {
    average: 5,
    max: 15,
    comment: "発育や免疫機能、味覚形成に関与",
  },
  ナトリウム: {
    average: 1300,
    max: 2000,
    comment: "加工食品の摂取が増えがちな時期。塩分の摂りすぎに注意",
  },
};

// 12〜17歳（思春期）
export const NUTRIENTS_CONFIG_12_17Y = {
  カロリー: {
    unit: "kcal",
    average: 2200,
    max: 2800,
    comment: "成長期のエネルギー需要に対応するため高めに設定",
  },
  タンパク質: {
    unit: "g",
    average: 45,
    max: 100,
    comment: "筋肉や臓器の発達に重要。成長促進のために十分な摂取を",
  },
  脂質: {
    unit: "g",
    average: 60,
    max: 75,
    comment: "成長に必要なエネルギー源だが、バランスよく摂取",
  },
  炭水化物: {
    unit: "g",
    average: 280,
    max: 350,
    comment: "学業や部活動など活動量に対応したエネルギー供給源",
  },
  食物繊維: {
    unit: "g",
    average: 13,
    max: 20,
    comment: "腸内環境を整え、将来の生活習慣病予防にもつながる",
  },
  ビタミンA: {
    unit: "μgRAE",
    average: 700,
    max: 1200,
    comment: "細胞分化や視力維持に必要。過剰摂取には注意",
  },
  ビタミンD: {
    unit: "μg",
    average: 7,
    max: 80,
    comment: "骨の成長と発達を支える。日照時間が少ない場合は補給を考慮",
  },
  ビタミンC: {
    unit: "mg",
    average: 80,
    max: 800,
    comment: "免疫力維持や鉄の吸収促進にも関与",
  },
  カルシウム: {
    unit: "mg",
    average: 800,
    max: 1500,
    comment: "骨量のピーク形成期において不可欠な栄養素",
  },
  鉄: {
    unit: "mg",
    average: 10,
    max: 50,
    comment: "急速な成長や月経の影響で不足しやすく、積極的に摂取したい",
  },
  亜鉛: {
    unit: "mg",
    average: 8,
    max: 30,
    comment: "成長ホルモンの働きや免疫機能に関与",
  },
  ナトリウム: {
    unit: "mg",
    average: 1400,
    max: 2300,
    comment: "味の濃い食品の摂取が増える時期。摂りすぎに注意",
  },
};

// 成人（18〜64歳）
export const NUTRIENTS_CONFIG_ADULT = {
  カロリー: {
    average: 2400,
    max: 2700,
    comment: "日常活動や基礎代謝を維持するためのエネルギー量を確保",
  },
  タンパク質: {
    average: 55,
    max: 150,
    comment: "筋肉維持や代謝活動に不可欠。活動量や目的に応じて調整",
  },
  脂質: {
    average: 65,
    max: 80,
    comment: "効率的なエネルギー源。過剰摂取は脂質異常に注意",
  },
  炭水化物: {
    average: 300,
    max: 350,
    comment: "主なエネルギー源として重要。過剰摂取による血糖上昇に留意",
  },
  食物繊維: {
    average: 18,
    max: 25,
    comment: "腸内環境の改善や生活習慣病予防に寄与",
  },
  ビタミンA: {
    average: 850,
    max: 1500,
    comment: "皮膚や粘膜の健康維持、免疫力向上に関与",
  },
  ビタミンD: {
    average: 8.5,
    max: 100,
    comment: "骨や歯の健康、免疫調整に必要。日照不足時は補給を意識",
  },
  ビタミンC: {
    average: 100,
    max: 1000,
    comment: "抗酸化作用でストレスや疲労対策にも有効",
  },
  カルシウム: {
    average: 700,
    max: 2500,
    comment: "骨や歯の形成・維持に重要。若年期から意識した摂取を",
  },
  鉄: {
    average: 7.5,
    max: 55,
    comment: "貧血予防に不可欠。月経のある人では特に注意",
  },
  亜鉛: {
    average: 10,
    max: 40,
    comment: "新陳代謝や免疫維持、味覚に関与",
  },
  ナトリウム: {
    average: 1500,
    max: 2500,
    comment: "過剰摂取により高血圧リスクがあるため、適正量の維持を",
  },
};

// 高齢者（65歳以上）
export const NUTRIENTS_CONFIG_SENIOR = {
  カロリー: {
    average: 2000,
    max: 2200,
    comment: "活動量や筋肉量の低下を考慮しつつ、エネルギー不足を防ぐ",
  },
  タンパク質: {
    average: 60,
    max: 100,
    comment: "筋肉量維持と免疫力低下の防止に重要",
  },
  脂質: {
    average: 55,
    max: 70,
    comment: "エネルギー源として必要だが、動脈硬化や消化機能に配慮",
  },
  炭水化物: {
    average: 250,
    max: 300,
    comment: "主なエネルギー源。血糖管理にも留意",
  },
  食物繊維: {
    average: 17,
    max: 25,
    comment: "便秘予防に有効だが、水分と一緒に摂取を心がける",
  },
  ビタミンA: {
    average: 800,
    max: 1500,
    comment: "視力や粘膜の健康維持に関与。脂溶性ビタミンのため過剰に注意",
  },
  ビタミンD: {
    average: 10,
    max: 100,
    comment: "骨粗鬆症予防に不可欠。日光浴が不足しがちな高齢者は特に重要",
  },
  ビタミンC: {
    average: 100,
    max: 1000,
    comment: "抗酸化作用で老化予防に寄与。食欲低下時も摂りやすい栄養素",
  },
  カルシウム: {
    average: 750,
    max: 2500,
    comment: "骨量維持に必須。吸収率の低下を考慮してやや高めに",
  },
  鉄: {
    average: 7,
    max: 50,
    comment: "貧血予防に必要だが、胃腸への負担や吸収抑制薬との関係に注意",
  },
  亜鉛: {
    average: 9,
    max: 35,
    comment: "味覚低下や免疫機能低下の予防に役立つ",
  },
  ナトリウム: {
    average: 1400,
    max: 2300,
    comment: "高血圧・腎機能に配慮し、控えめを基本に調整",
  },
};

// 妊婦用
export const NUTRIENTS_CONFIG_PREGNANT = {
  カロリー: {
    average: 2500,
    max: 3000,
    comment: "妊娠中期以降、胎児の成長をサポートするため、少し増加",
  },
  タンパク質: {
    average: 70,
    max: 100,
    comment: "胎児の発育に必須。肉、魚、卵などからバランスよく摂取",
  },
  脂質: {
    average: 65,
    max: 90,
    comment: "胎児の脳の発達に必要。良質な脂肪を摂取",
  },
  炭水化物: {
    average: 300,
    max: 350,
    comment: "エネルギー源として重要。全粒穀物や野菜からバランスよく摂取",
  },
  食物繊維: {
    average: 25,
    max: 30,
    comment: "便通の改善と腸内環境の維持に重要。果物や野菜から",
  },
  ビタミンA: {
    average: 800,
    max: 1300,
    comment: "胎児の視力や免疫機能の発達をサポート",
  },
  ビタミンD: {
    average: 10,
    max: 100,
    comment: "骨の形成や免疫機能に重要。日光浴やビタミンD強化食品で摂取",
  },
  ビタミンC: {
    average: 120,
    max: 1000,
    comment: "免疫機能をサポートし、鉄分の吸収を助ける",
  },
  カルシウム: {
    average: 1000,
    max: 2500,
    comment: "胎児の骨や歯の形成に重要。乳製品やカルシウム強化食品から",
  },
  鉄: {
    average: 27,
    max: 45,
    comment: "胎児の血液供給に必要。貧血予防のため、鉄分を意識的に摂取",
  },
  亜鉛: {
    average: 11,
    max: 40,
    comment: "細胞分裂と免疫機能に関与。肉やナッツ類から",
  },
  ナトリウム: {
    average: 1500,
    max: 2300,
    comment: "むくみや高血圧のリスクを避けるため、適度に調整",
  },
  葉酸: {
    average: 400,
    max: 800,
    comment: "神経管閉鎖障害を予防するため、妊娠初期には特に重要",
  },
};

// 抗がん剤治療中
export const NUTRIENTS_CONFIG_4CANCER = {
  カロリー: {
    average: 2500,
    max: 3000,
    comment: "体重減少や体力低下を防ぐために高めに設定",
  },
  タンパク質: {
    average: 75,
    max: 120,
    comment: "筋肉維持・免疫力保持・傷の治癒促進に不可欠",
  },
  脂質: {
    average: 70,
    max: 90,
    comment: "効率よくエネルギーを確保。ただし消化に問題があれば調整",
  },
  炭水化物: {
    average: 300,
    max: 350,
    comment: "主エネルギー源。食欲低下時も摂取しやすい形で",
  },
  食物繊維: {
    average: 20,
    max: 25,
    comment: "便通改善に有効だが、下痢や腸障害がある場合は注意",
  },
  ビタミンA: {
    average: 900,
    max: 1500,
    comment: "粘膜保護と免疫維持を助ける。過剰摂取には注意",
  },
  ビタミンD: {
    average: 10,
    max: 100,
    comment: "骨量維持と免疫機能の調整に重要。日光不足時に特に配慮",
  },
  ビタミンC: {
    average: 150,
    max: 2000,
    comment: "抗酸化作用と免疫向上に有効。過剰摂取により下痢の恐れあり",
  },
  カルシウム: {
    average: 800,
    max: 2500,
    comment: "骨粗鬆症予防に重要。特にステロイド併用時",
  },
  鉄: {
    average: 10,
    max: 45,
    comment: "貧血予防に重要だが、鉄剤との併用や便秘に注意",
  },
  亜鉛: {
    average: 12,
    max: 40,
    comment: "味覚障害や皮膚粘膜の回復支援に役立つ",
  },
  ナトリウム: {
    average: 1500,
    max: 2300,
    comment: "浮腫や高血圧のリスクを考慮しつつ、脱水を防ぐ",
  },
};

// 膵炎
export const NUTRIENTS_CONFIG_PANCREATITIS = {
  カロリー: {
    average: 1800,
    max: 2000,
    comment: "エネルギー不足を防ぎつつ、過剰摂取による膵臓への負担を避ける",
  },
  タンパク質: {
    average: 60,
    max: 80,
    comment: "筋肉維持と回復促進に必要。脂質制限下でもしっかり確保",
  },
  脂質: {
    average: 30,
    max: 40,
    comment: "膵臓に負担をかけないよう、低脂質に制限",
  },
  炭水化物: {
    average: 280,
    max: 320,
    comment: "脂質の代替エネルギー源として重要。血糖コントロールにも注意",
  },
  食物繊維: {
    average: 18,
    max: 22,
    comment: "便通改善に役立つが、消化に負担をかけない種類と量に配慮",
  },
  ビタミンA: {
    average: 800,
    max: 1300,
    comment: "粘膜修復と免疫機能の維持をサポート",
  },
  ビタミンD: {
    average: 10,
    max: 100,
    comment: "脂溶性ビタミンの吸収低下に注意。骨粗鬆症予防にも重要",
  },
  ビタミンC: {
    average: 120,
    max: 1000,
    comment: "抗酸化作用と免疫機能を高める",
  },
  カルシウム: {
    average: 700,
    max: 2500,
    comment: "骨量維持に重要。特にビタミンDと併せて摂取を",
  },
  鉄: {
    average: 8,
    max: 30,
    comment: "貧血予防のために必要。ただし吸収率や出血傾向にも注意",
  },
  亜鉛: {
    average: 10,
    max: 35,
    comment: "味覚障害や粘膜の修復促進に役立つ",
  },
  ナトリウム: {
    average: 1200,
    max: 2000,
    comment: "浮腫や高血圧のリスクを考慮し、控えめに設定",
  },
};
