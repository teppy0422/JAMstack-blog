// 子供の情報
export type Child = {
  id: string;
  name: string;
  birthdate: string; // YYYY-MM-DD
  gender: "male" | "female" | "other";
  avatarUrl: string;
  colorScheme: string; // Chakra UIのカラースキーム
};

// 成長記録
export type GrowthRecord = {
  id: string;
  childId: string;
  recordDate: string; // YYYY-MM-DD
  heightCm?: number;
  weightKg?: number;
  notes?: string;
  photoUrl?: string;
};

// マイルストーン
export type Milestone = {
  id: string;
  childId: string;
  milestoneDate: string; // YYYY-MM-DD
  title: string;
  description?: string;
  photoUrl?: string;
};
