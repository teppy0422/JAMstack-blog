import React, { useContext, useState, useRef } from "react";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";

import styles from "../styles/home.module.scss";

import GetWindowSize, { getWindowSize } from "../script/GetWindowSize";

const Skillchart: React.FunctionComponent = (): JSX.Element => {
  const WindowSize = GetWindowSize();
  let myWidth: number = WindowSize.width;
  let myHeight: number = 0;
  if (myWidth > 500) {
    myHeight = 500;
  } else {
    myHeight = myWidth - 100;
  }
  console.log(myWidth);
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
        minPointSize: 0,
        innerSize: "10%",
        zMin: 0,
        name: "language",

        data: [
          {
            name: "エクセルVBA",
            detail: "ほとんどの事が対応可能です",
            y: 100,
            z: 95,
            color: "#48BB78",
          },
          {
            name: "VB.net",
            detail: "一般的なアプリ作成が可能です",
            y: 100,
            z: 30,
            color: "#9A4F96",
          },
          {
            name: "フロントエンド",
            detail: "HTML/CSS/JavaScript(Next)",
            y: 100,
            z: 50,
            color: "#F1652A",
          },
          {
            name: "バックエンド",
            detail: "PHP/Pythonが少しだけ",
            y: 100,
            z: 10,
            color: "#4E5B92",
          },
          {
            name: "Arduino",
            detail: "ステッピングモーターを制御など",
            y: 100,
            z: 60,
            color: "#12999F",
          },
          {
            name: "映像編集",
            detail: "Davinch Resolve",
            y: 100,
            z: 40,
            color: "#888888",
          },
          {
            name: "イラスト",
            detail: "InkScape",
            y: 100,
            z: 30,
            color: "#333333",
          },
        ],
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "13px",
            fontFamily: "M PLUS Rounded 1c",
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
    <div className={styles.skillchart}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Skillchart;
