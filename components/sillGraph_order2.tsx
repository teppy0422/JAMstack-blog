import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  CATEGORY_CONFIG,
  NUTRIENTS_CONFIG_,
} from "../app/utils/categoryConfig";

const data = [
  { name: "カロリー", 砂肝: 170, ローストビーフ: 190, ニラ豚: 350 },
  { name: "タンパク質", 砂肝: 22, ローストビーフ: 20, ニラ豚: 11 },
  { name: "脂質", 砂肝: 6.5, ローストビーフ: 10, ニラ豚: 33 },
];
type ChartDataItem = {
  id: number;
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
};
interface PieChartProps {
  data2: ChartDataItem[];
}
export const MyBarChart: React.FunctionComponent<PieChartProps> = ({
  data2,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // クライアントサイドでのみ表示
  }, []);
  if (!isClient) return null;

  console.log("data2", data2);

  const visibleData = data2.filter((item) => item.is_visible);
  console.log("visibleData", visibleData);

  const visibleData2 = visibleData.map((item) => {
    const normalizedNutrients = item.nutrients.reduce((acc, nutrient) => {
      const [key, value] = nutrient.split(":");
      const average = NUTRIENTS_CONFIG_[key]?.average || 1; // averageが存在しない場合は1を使用
      const normalizedValue = (parseFloat(value || "0") / average) * 100; // averageで割る
      return { ...acc, [key]: normalizedValue };
    }, {});
    return { ...item, normalizedNutrients }; // 正規化されたnutrientsを追加
  });
  console.log("visibleData2", visibleData2);

  // visibleDataを指定された形に変換し、数値をaverageで割る
  const transformedData = Object.keys(NUTRIENTS_CONFIG_).map((nutrient) => {
    const average = NUTRIENTS_CONFIG_[nutrient].average; // averageを取得
    return {
      name: nutrient,
      ...visibleData.reduce((acc, item) => {
        const nutrientValue = item.nutrients
          .find((n) => n.startsWith(nutrient))
          ?.split(":")[1];
        const value = parseFloat(nutrientValue || "0");
        return {
          ...acc,
          [item.name]: (value / average) * 100, // averageで割る
        };
      }, {}),
    };
  });
  console.log("transformedData", transformedData);
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
      payload: Record<string, any>;
    }>;
    label?: string;
  }
  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const average = label ? NUTRIENTS_CONFIG_[label]?.average || null : null; // labelがundefinedの場合はnullを返す
      const max = label ? NUTRIENTS_CONFIG_[label]?.max || null : null; // 該当するaverageがない場合はnullを返す
      const unit = label ? NUTRIENTS_CONFIG_[label]?.unit || "" : ""; // 単位を取得
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
          <p style={{ margin: 0, color: "#666" }}>
            {average}
            {unit}
            {max ? ` / 最大:${max}${unit}` : ""}
          </p>
          {payload.map((item, index) => (
            <p key={index} style={{ margin: 0, color: item.color }}>
              {item.name}: {Math.round(item.payload[item.name])}
              {unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  // カスタムラベルコンポーネント
  const CustomLabel = ({ x, y, width, height, value, index, dataKey }: any) => {
    const textLen = dataKey.length; // テキストの長さを取得
    const textWidth = textLen * 6; // テキストの幅を計算（1文字あたり6pxと仮定）
    if (textWidth > 30 || width < 20) return null; // 値が10未満の場合は何も描画しない
    value = Math.round(value); // 値を整数に丸める

    const centerX = x + width / 2;
    const centerY = y + height / 2;
    return (
      <text
        x={centerX}
        y={centerY}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
      >
        {dataKey}
        {/* {value} */}
        {/* {average} */}
      </text>
    );
  };
  // インデックスに応じた色を決定する関数
  const getColorByIndex = (index: number): string => {
    const colors = [
      "#f56464",
      "#4199e0",
      "#ed8937",
      "#edca4c",
      "#49ba78",
      "#a07aeb",
      "#fd94c6",
      "#2a6bb0",
      "#fbd38d",
      "#4a5568",
      "#f6ad55",
      "#99ba78",
      "#888",
      "#ff7f50",
      "#87ceeb",
      "#6a5acd",
      "#ff69b4",
      "#4682b4",
      "#d2691e",
      "#32cd32",
    ]; // 20色の配列
    return colors[index % colors.length]; // インデックスに応じて色を循環させる
  };
  return (
    <BarChart
      key={JSON.stringify(transformedData)} // データが変更されるたびに再描画をトリガー
      width={600}
      height={500}
      data={transformedData}
      layout="vertical" // 横向きの棒グラフに設定
    >
      <XAxis type="number" domain={[0, 200]} />
      <YAxis type="category" dataKey="name" fontSize="12px" />
      {/* カテゴリ軸 */}
      <Tooltip content={<CustomTooltip />} /> {/* カスタムツールチップを指定 */}
      <Legend />
      <ReferenceLine x={100} stroke="red" strokeDasharray="3 3" />
      {visibleData.map((item, index) => (
        <Bar
          key={item.name}
          dataKey={item.name} // ここで指定されたキーに基づいて値が取得される
          stackId="a"
          // fill={CATEGORY_CONFIG[item.category]?.bg || "#ccc"} // 色を設定（デフォルトはグレー）
          fill={getColorByIndex(index)}
          isAnimationActive={true} // アニメーションを有効化
          animationDuration={300} // アニメーションの長さを0.3秒に設定
        >
          <LabelList
            content={(props) => <CustomLabel {...props} dataKey={item.name} />}
          />
        </Bar>
      ))}
    </BarChart>
  );
};
