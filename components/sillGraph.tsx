import React, { useContext, useState, useRef } from "react";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";
import { Box } from "@chakra-ui/react";

import styles from "@/styles/home.module.scss";

import GetWindowSize, { getWindowSize } from "../script/GetWindowSize";

import { useLanguage } from "../context/LanguageContext";
import getMessage from "../components/getMessage";

const Skillchart: React.FunctionComponent = (): JSX.Element => {
  const WindowSize = GetWindowSize();
  const { language, setLanguage } = useLanguage();

  let myWidth: number = WindowSize.width;
  let myHeight: number = 0;
  if (myWidth > 500) {
    myHeight = 500;
  } else {
    myHeight = myWidth - 100;
  }
  if (typeof Highcharts === "object") {
    HighchartsMore(Highcharts);
  }
  const options = {
    chart: {
      type: "variablepie",
      backgroundColor: "none",
      height: myHeight,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
      x: 0,
      style: {
        fontSize: "18px",
        fontWidth: 700,
      },
    },

    tooltip: {
      headerFormat: "",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        "自己評価: <b>{point.z}/100</b><br/>" +
        "<b>{point.detail}</b>",
    },
    series: [
      {
        minPointSize: 10,
        innerSize: "10%",
        zMin: 0,
        name: "language",

        data: [
          {
            name: "Excel-vba",
            detail: getMessage({
              ja: "ほとんどの事が対応可能です",
              us: "Almost anything can be handled.",
              cn: "大多数事情都可以处理。",
              language,
            }),

            y: 100,
            z: 95,
            color: "#48BB78",
          },
          {
            name: "VB.net",
            detail: getMessage({
              ja: "一般的なアプリ作成が可能です",
              us: "General application creation is possible",
              cn: "可以创建一般应用程序。",
              language,
            }),
            y: 100,
            z: 30,
            color: "#9A4F96",
          },
          {
            name: getMessage({
              ja: "フロント",
              us: "front",
              cn: "战线",
              language,
            }),
            detail: "HTML/CSS/JavaScript(Next)",
            y: 100,
            z: 50,
            color: "#F1652A",
          },
          {
            name: getMessage({
              ja: "バック",
              us: "back",
              cn: "后",
              language,
            }),
            detail: "PHP/Python",
            y: 100,
            z: 15,
            color: "#4E5B92",
          },
          {
            name: "Arduino",
            detail: getMessage({
              ja: "ステッピングモーターを制御など",
              us: "Control stepping motors, etc.",
              cn: "控制步进电机等",
              language,
            }),
            y: 100,
            z: 60,
            color: "#12999F",
          },
          {
            name: getMessage({
              ja: "映像編集",
              us: "image editing",
              cn: "视频剪辑",
              language,
            }),
            detail: "Davinch Resolve",
            y: 100,
            z: 40,
            color: "#888888",
          },
          {
            name: getMessage({
              ja: "イラスト",
              us: "illustration",
              cn: "图例",
              language,
            }),
            detail: "InkScape",
            y: 100,
            z: 30,
            color: "#333333",
          },
        ],
        dataLabels: {
          enabled: true,
          distance: 15,
          style: {
            fontSize: "12px",
            fontFamily: getMessage({
              ja: "Noto Sans JP",
              us: "Noto Sans JP",
              cn: "Noto Sans SC",
              language,
            }),
            color: "#333",
            textOutline: 0,
          },
        },
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              align: "center",
              verticalAlign: "bottom",
              layout: "horizontal",
            },
          },
        },
      ],
    },
  };
  return (
    <Box w="100%">
      <div className={styles.skillchart}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Box>
  );
};

export default Skillchart;
