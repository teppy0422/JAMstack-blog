import React, { useContext } from "react";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";
import styles from "../styles/home.module.scss";

const Skillchart: React.FunctionComponent = (props): JSX.Element => {
  let myHeight: string = props.myHeight;
  console.log(myHeight);
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
            name: "VBA",
            detail: "ほとんどの事が対応可能です",
            y: 100,
            z: 95,
            color: "#0c0",
          },
          {
            name: "VB.net",
            detail: "一般的なアプリ作成が可能です",
            y: 100,
            z: 30,
            color: "#dd44dd",
          },
          {
            name: "フロント",
            detail: "HTML/CSS/JavaScript(Next)",
            y: 100,
            z: 50,
            color: "orange",
          },
          {
            name: "サーバー",
            detail: "PHP/Pythonが少しだけ",
            y: 100,
            z: 10,
            color: "#3333ee",
          },
          {
            name: "Arduino",
            detail: "ステッピングモーターを制御など",
            y: 100,
            z: 60,
            color: "#018F94",
          },
          {
            name: "映像編集",
            detail: "Davinch Resolve",
            y: 100,
            z: 40,
            color: "#999999",
          },
          {
            name: "イラスト",
            detail: "InkScape",
            y: 100,
            z: 30,
            color: "#666666",
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
