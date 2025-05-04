import { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Box,
  Badge,
  useColorMode,
} from "@chakra-ui/react";

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
  ReferenceArea,
  LegendProps,
} from "recharts";
import {
  NUTRIENTS_CONFIG_,
  NUTRIENTS_CONFIG_1_2Y,
  NUTRIENTS_CONFIG_3_5Y,
  NUTRIENTS_CONFIG_6_11Y,
  NUTRIENTS_CONFIG_12_17Y,
  NUTRIENTS_CONFIG_ADULT,
  NUTRIENTS_CONFIG_SENIOR,
  NUTRIENTS_CONFIG_PREGNANT,
  NUTRIENTS_CONFIG_6M_1Y,
  NUTRIENTS_CONFIG_4CANCER,
  NUTRIENTS_CONFIG_PANCREATITIS,
  transformData,
  MenuItem,
} from "../app/utils/categoryConfig";
import { text } from "stream/consumers";

const data = [
  { name: "カロリー", 砂肝: 170, ローストビーフ: 190, ニラ豚: 350 },
  { name: "タンパク質", 砂肝: 22, ローストビーフ: 20, ニラ豚: 11 },
  { name: "脂質", 砂肝: 6.5, ローストビーフ: 10, ニラ豚: 33 },
];

interface PieChartProps {
  data2: MenuItem[];
}
export const MyBarChart: React.FunctionComponent<PieChartProps> = ({
  data2,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(NUTRIENTS_CONFIG_ADULT);
  const [activeConfig, setActiveConfig] = useState("成人"); // アクティブなBadgeを管理
  const { colorMode } = useColorMode();
  let transformedData: any = [];
  const handleConfigChange = (config: any, label: string) => {
    setCurrentConfig(config);
    setActiveConfig(label); // アクティブなBadgeを更新
  };
  useEffect(() => {
    setIsClient(true); // クライアントサイドでのみ表示
  }, []);
  if (!isClient) return null;

  const visibleData = data2
    .filter((item) => item.is_visible) // 表示可能なアイテムをフィルタリング
    .filter((item) => item.quantity > 0); // quantity が 0 を超えるアイテムだけを残す
  transformedData = transformData(visibleData, currentConfig);
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
      const average = label ? currentConfig[label]?.average || null : null; // labelがundefinedの場合はnullを返す
      const max = label ? currentConfig[label]?.max || null : null; // 該当するaverageがない場合はnullを返す
      const unit = label ? NUTRIENTS_CONFIG_[label]?.unit || "" : ""; // 単位を取得
      const getMatchingData = (
        visibleData: MenuItem[],
        label: string,
        itemName: string
      ) => {
        const matchingItem = visibleData.find((item) => item.name === itemName);

        if (matchingItem) {
          const nutrient = matchingItem.nutrients.find((n) =>
            n.startsWith(label)
          );
          if (nutrient) {
            const [, value] = nutrient.split(":");
            return {
              name: matchingItem.name,
              value: parseFloat(value) * matchingItem.quantity,
            }; // 栄養素の値を取得
          }
        }
        return null;
      };
      return (
        <Box
          style={{
            backgroundColor: "#fff",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
          fontSize="12px"
          fontWeight="400"
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>
            {label}{" "}
            <span style={{ margin: 0, color: "#777", fontSize: "11px" }}>
              ({average}
              {unit}
              {max ? ` : 最大:${max}${unit}` : ""})
            </span>
          </p>
          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: "13px",
              marginBottom: "6px",
            }}
          >
            {label
              ? currentConfig[label]?.comment
                  .split("。")
                  .map((sentence: string, index: number) => (
                    <span key={index}>
                      {sentence}
                      {sentence ? "。" : ""}
                      <br />
                    </span>
                  ))
              : ""}
          </p>
          {payload.map((item, index) => {
            const matchingData =
              label && getMatchingData(visibleData, label, item.name);
            if (
              !matchingData ||
              matchingData.value === 0 ||
              matchingData.value == null
            ) {
              return null; // 値が0または空欄の場合は何も表示しない
            }
            return (
              <p key={index} style={{ margin: 0, color: item.color }}>
                {item.name}: {matchingData.value}
                {unit}
              </p>
            );
          })}
        </Box>
      );
    }
    return null;
  };
  // カスタムラベルコンポーネント
  const CustomLabel = ({ x, y, width, height, value, index, dataKey }: any) => {
    const textLen = dataKey.length; // テキストの長さを取得
    const textWidth = textLen * 12; // テキストの幅を計算（1文字あたり6pxと仮定）
    if (textWidth > width) return null; // 値が10未満の場合は何も描画しない
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
  // カスタムLegendコンポーネント
  const CustomLegend: React.FC<LegendProps> = (props) => {
    const { payload } = props;
    return (
      <Box
        style={{
          // listStyleType: "none",
          display: "flex", // 横並びにする
          flexWrap: "wrap", // 必要に応じて折り返し
          margin: 0,
          padding: 0,
          fontSize: "12px",
          fontWeight: "600",
          color: colorMode === "light" ? "#333" : "#eee",
        }}
      >
        {payload?.map((entry, index) => (
          <Box
            key={`item-${index}`}
            style={{ color: entry.color, marginBottom: "4px" }}
            display="inline-block"
            mr={1}
            mb={1}
          >
            ■{entry.value}
          </Box>
        ))}
      </Box>
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
  const CustomBadge = (text: string, color: string, config: any) => {
    return (
      <Badge
        variant={activeConfig === text ? "solid" : "outline"} // アクティブなBadgeはsolidにする
        colorScheme={color}
        onClick={() => handleConfigChange(config, text)} // クリック時にhandleConfigChangeを呼び出す
        mr={1}
        cursor="pointer"
      >
        {text}
      </Badge>
    );
  };
  return (
    <Box>
      {CustomBadge("成人", "teal", NUTRIENTS_CONFIG_ADULT)}
      {CustomBadge("6ヶ月〜1歳", "blue", NUTRIENTS_CONFIG_6M_1Y)}
      {CustomBadge("1〜2歳", "blue", NUTRIENTS_CONFIG_1_2Y)}
      {CustomBadge("3〜5歳", "green", NUTRIENTS_CONFIG_3_5Y)}
      {CustomBadge("6〜11歳", "orange", NUTRIENTS_CONFIG_6_11Y)}
      {CustomBadge("12〜17歳", "orange", NUTRIENTS_CONFIG_12_17Y)}
      {CustomBadge("妊婦", "orange", NUTRIENTS_CONFIG_PREGNANT)}
      {CustomBadge("抗がん剤", "purple", NUTRIENTS_CONFIG_4CANCER)}
      {CustomBadge("膵炎", "purple", NUTRIENTS_CONFIG_PANCREATITIS)}
      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          key={JSON.stringify(transformedData)} // データが変更されるたびに再描画をトリガー
          data={transformedData}
          layout="vertical" // 横向きの棒グラフに設定
        >
          <XAxis
            type="number"
            domain={[0, 200]}
            fontSize="12px"
            fontWeight="400"
            tick={{ fill: colorMode === "light" ? "#333" : "#eee" }}
          />
          <YAxis
            type="category"
            dataKey="name"
            fontSize="12px"
            fontWeight="400"
            tick={{ fill: colorMode === "light" ? "#333" : "#eee" }}
          />
          {/* カテゴリ軸 */}
          <Tooltip content={<CustomTooltip />} />
          {/* カスタムツールチップを指定 */}
          <Legend content={<CustomLegend />} />
          <ReferenceLine x={100} stroke="red" strokeDasharray="3 3" />
          {/* 範囲を示すReferenceArea */}
          {Object.keys(currentConfig).map((nutrient, index) => {
            const average = currentConfig[nutrient]?.average || 0;
            const max = currentConfig[nutrient]?.max || 0;
            const averageArea = 100;
            const maxArea = max / average < 5 ? (max / average) * 100 : 500;
            const fillColor = NUTRIENTS_CONFIG_[nutrient]?.color || "#888"; // 色を取得
            // 範囲が正しい場合のみ描画
            if (average > 0 && max > 0 && average < max && maxArea < 500) {
              return (
                <>
                  <ReferenceArea
                    key={index}
                    x1={averageArea}
                    x2={maxArea}
                    y1={nutrient} // 棒の範囲を調整
                    y2={nutrient} // 棒の範囲を調整
                    // stroke="red" // 範囲の枠線の色
                    // strokeWidth={1} // 枠線の太さ
                    fill={fillColor} // 範囲の背景色
                    fillOpacity={0.3} // 背景色の透明度
                  />
                </>
              );
            }
            return null; // 範囲が不正な場合は描画しない
          })}
          {visibleData.map((item, index) => (
            <Bar
              key={item.name}
              dataKey={item.name} // ここで指定されたキーに基づいて値が取得される
              stackId="a"
              // fill={CATEGORY_CONFIG[item.category]?.bg || "#ccc"} // 色を設定（デフォルトはグレー）
              fill={getColorByIndex(index)}
              isAnimationActive={true} // アニメーションを有効化
              animationDuration={300} // アニメーションの長さを0.3秒に設定
              animationEasing="ease-in-out" // イージングを設定
              barSize={15} // 棒の太さを指定
            >
              <LabelList
                content={(props) => (
                  <CustomLabel {...props} dataKey={item.name} />
                )}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
