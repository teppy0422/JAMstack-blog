import { Child, GrowthRecord, Milestone } from "../types/growth";

// 子供のデータ
export const children: Child[] = [
  {
    id: "child-1",
    name: "春",
    birthdate: "2024-07-22",
    gender: "male",
    avatarUrl: "/images/children/haru_13.webp", // 仮パス
    colorScheme: "green", // バッジの色
  },
  {
    id: "child-2",
    name: "花子",
    birthdate: "2026-03-28",
    gender: "female",
    avatarUrl: "/avatars/hanako.jpg", // 仮パス
    colorScheme: "pink", // バッジの色
  },
];

// 成長記録データ
export const growthRecords: GrowthRecord[] = [
  // 太郎の記録
  {
    id: "record-1-1",
    childId: "child-1",
    recordDate: "2024-03-05",
    heightCm: 65.0,
    weightKg: 7.5,
    notes: "はじめての胎動",
  },
  {
    id: "record-1-1",
    childId: "child-1",
    recordDate: "2024-07-29",
    heightCm: 65.0,
    weightKg: 7.5,
    notes: "保育器期間中",
    photoUrl: "/images/children/haru_20240729.webp", // 仮パス
  },
  {
    id: "record-1-2",
    childId: "child-1",
    recordDate: "2025-11-18",
    heightCm: 65.0,
    weightKg: 7.5,
    notes: "6ヶ月健診。順調に成長しています。",
    photoUrl: "/images/children/haru_20251118.webm", // 仮パス
  },

  // 花子の記録
  {
    id: "record-8",
    childId: "child-2",
    recordDate: "2026-08-20",
    heightCm: 48.0,
    weightKg: 3.0,
    notes: "誕生日。かわいい女の子が生まれました。",
    photoUrl: "/children/photos/hanako-birth.jpg", // 仮パス
  },
  {
    id: "record-9",
    childId: "child-2",
    recordDate: "2027-02-20",
    heightCm: 62.0,
    weightKg: 6.8,
    notes: "6ヶ月健診。よく笑う子です。",
  },
  {
    id: "record-10",
    childId: "child-2",
    recordDate: "2027-08-20",
    heightCm: 72.0,
    weightKg: 9.0,
    notes: "1歳の誕生日。初めての一歩。",
    photoUrl: "/children/photos/hanako-1year.jpg", // 仮パス
  },
];

// マイルストーンデータ
export const milestones: Milestone[] = [
  // 太郎のマイルストーン
  {
    id: "milestone-4",
    childId: "child-1",
    milestoneDate: "2026-08-12",
    title: "初めての言葉「まま」",
    description: "ママと言ってくれました。",
  },
  {
    id: "milestone-5",
    childId: "child-1",
    milestoneDate: "2026-03-15",
    title: "トイレトレーニング完了",
    description: "オムツが外れました。",
  },

  // 花子のマイルストーン
  {
    id: "milestone-6",
    childId: "child-2",
    milestoneDate: "2028-11-10",
    title: "初めての笑顔",
    description: "初めてニコッと笑ってくれました。",
  },
  {
    id: "milestone-7",
    childId: "child-2",
    milestoneDate: "2028-01-05",
    title: "寝返り成功",
    description: "初めて寝返りができました。",
  },
  {
    id: "milestone-8",
    childId: "child-2",
    milestoneDate: "2028-08-20",
    title: "初めての一歩",
    description: "1歳の誕生日に初めて歩きました！",
    photoUrl: "/children/milestones/hanako-walk.jpg", // 仮パス
  },
  {
    id: "milestone-9",
    childId: "child-2",
    milestoneDate: "2028-02-10",
    title: "初めての言葉「にーに」",
    description: "お兄ちゃんのことをにーにと呼びました。",
  },
];
