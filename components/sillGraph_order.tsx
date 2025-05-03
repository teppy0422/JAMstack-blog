import React from "react";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@chakra-ui/react";
import styles from "../styles/home.module.scss";
import GetWindowSize from "../script/GetWindowSize";
import { useLanguage } from "../context/LanguageContext";
import getMessage from "./getMessage";
import { NUTRIENTS_CONFIG_ } from "../app/utils/categoryConfig";

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
  data: ChartDataItem[];
}
export const PieChart: React.FunctionComponent<PieChartProps> = ({ data }) => {
  const WindowSize = GetWindowSize();
  const { language } = useLanguage();

  const myWidth = WindowSize.width;
  const myHeight = myWidth > 500 ? 400 : myWidth - 0;

  if (typeof Highcharts === "object") {
    HighchartsMore(Highcharts);
  }

  // 栄養素ごとの合計を計算
  const nutrientContributions: {
    [nutrientName: string]: { name: string; value: number }[];
  } = {};
  const foodMap: Record<string, { name: string; y: number }[]> = {};

  // NUTRIENTS_CONFIG_ にあるすべての項目を初期化
  Object.keys(NUTRIENTS_CONFIG_).forEach((name) => {
    nutrientContributions[name] = [];
  });
  const nutrients = Object.keys(NUTRIENTS_CONFIG_); // ← ここで自動取得

  // データを nutrientContributions に分類
  data
    .filter((item) => item.is_visible) // 表示可能なデータのみを対象
    .forEach((item) => {
      if (Array.isArray(item.nutrients)) {
        item.nutrients.forEach((n) => {
          const [name, value] = n.split(":"); // 栄養素名と値を分割
          const num = parseFloat(value); // 値を数値に変換

          // 栄養素名が NUTRIENTS_CONFIG_ に存在する場合のみ処理
          if (!isNaN(num) && NUTRIENTS_CONFIG_.hasOwnProperty(name)) {
            nutrientContributions[name].push({ name: item.name, value: num }); // 各メニューの貢献度を記録
          }
        });
      }
    });

  // 各栄養素ごとに値をまとめていく
  for (const nutrient of nutrients) {
    const entries = nutrientContributions[nutrient];
    if (!entries) continue;

    for (const { name, value } of entries) {
      if (!foodMap[name]) {
        foodMap[name] = [];
      }
      foodMap[name].push({ name, y: value });
    }
  }
  console.log("foodMap", foodMap);

  // 各栄養素を1本の棒グラフにまとめる
  const seriesData = Object.keys(nutrientContributions).map((nutrientName) => {
    console.log(nutrientContributions);
    return {
      name: nutrientName, // 栄養素名（例: カロリー、タンパク質）
      data: nutrientContributions[nutrientName].map((contribution) => {
        // 各 contribution の内容をログに出力
        // console.log(`Contribution:`, contribution);
        return {
          y: contribution.value, // 各メニューの栄養素値
          // y: 20, // 各メニューの栄養素値
          name: contribution.name.charAt(0), // メニュー名の先頭1文字
          color: NUTRIENTS_CONFIG_[nutrientName]?.color || "#888", // NUTRIENTS_CONFIG_ から色を取得
        };
      }),
    };
  });

  const options = {
    chart: {
      type: "bar",
      backgroundColor: "none",
      height: myHeight,
    },
    credits: { enabled: false },
    legend: { enabled: false },
    // title: { enabled: false },
    title: { text: null, x: 0 },
    yAxis: {
      min: 0,
      title: { text: null },
    },
    xAxis: {
      categories: Object.keys(nutrientContributions), // 栄養素名をカテゴリとして設定
      title: { text: null },
      labels: {
        style: {
          fontFamily: getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans JP",
            cn: "Noto Sans SC",
            language,
          }),
          fontSize: "12px",
          color: "#333",
        },
      },
    },
    plotOptions: {
      series: {
        stacking: "normal", // 積み上げ棒グラフを有効化
        pointWidth: 24, // 棒の太さを指定
        dataLabels: {
          enabled: true,
          inside: true, // 棒の中に表示
          formatter: function () {
            return `${this.point.name}`; // メニュー名と値を表示
          },
          style: {
            fontSize: "10px",
            fontFamily: "Noto Sans JP",
            color: "#fff",
            textOutline: "none",
          },
        },
      },
    },
    tooltip: {
      headerFormat: "<b>{point.key}</b><br/>",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
    },
    series: seriesData, // 各栄養素のデータを series に設定
    // series: [
    //   {
    //     name: "",
    //     data: [
    //       {
    //         name: "砂肝",
    //         y: 170,
    //       },
    //       {
    //         name: "砂肝",
    //         y: 22,
    //       },
    //       {
    //         name: "砂肝",
    //         y: 6.5,
    //       },
    //       {
    //         name: "砂肝",
    //         y: 1.5,
    //       },
    //     ],
    //   },
    //   {
    //     name: "",
    //     data: [
    //       {
    //         name: "ローストビーフ",
    //         y: 190,
    //       },
    //       {
    //         name: "ローストビーフ",
    //         y: 20,
    //       },
    //       {
    //         name: "ローストビーフ",
    //         y: 10,
    //       },
    //       {
    //         name: "ローストビーフ",
    //         y: 0.1,
    //       },
    //     ],
    //   },
    //   {
    //     name: "",
    //     data: [
    //       {
    //         name: "ニラ豚",
    //         y: 350,
    //       },
    //       {
    //         name: "ニラ豚",
    //         y: 11,
    //       },
    //       {
    //         name: "ニラ豚",
    //         y: 33,
    //       },
    //       {
    //         name: "ニラ豚",
    //         y: 4,
    //       },
    //     ],
    //   },
    //   {
    //     name: "",
    //     data: [
    //       {
    //         name: "冷奴",
    //         y: 95,
    //       },
    //       {
    //         name: "冷奴",
    //         y: 8,
    //       },
    //       {
    //         name: "冷奴",
    //         y: 6,
    //       },
    //       {
    //         name: "冷奴",
    //         y: 4,
    //       },
    //     ],
    //   },
    // ],
  };

  return (
    <Box w="100%">
      <div className={styles.skillchart}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Box>
  );
};
