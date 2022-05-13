import React from "react";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";
import styles from "../styles/home.module.scss";

const RadarChart: React.FunctionComponent = (): JSX.Element => {
  if (typeof Highcharts === "object") {
    HighchartsMore(Highcharts);
  }
  const options = {
    chart: {
      type: "variablepie",
      backgroundColor: "none",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
      x: 0,
      style: {
        fontSize: "30px",
      },
    },

    tooltip: {
      headerFormat: "",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        "自己評価: <b>{point.z}/100</b><br/>",
    },
    series: [
      {
        minPointSize: 0,
        innerSize: "10%",
        zMin: 0,
        name: "language",

        data: [
          {
            name: "VAB",
            y: 100,
            z: 95,
            color: "#0c0",
          },
          {
            name: "VB.net",
            y: 100,
            z: 30,
            color: "#dd44dd",
          },
          {
            name: "WEB-フロント",
            y: 100,
            z: 50,
            color: "orange",
          },
          {
            name: "WEB-サーバー",
            y: 100,
            z: 10,
            color: "#3333ee",
          },
          {
            name: "Arduino",
            y: 100,
            z: 60,
            color: "#018F94",
          },
          {
            name: "映像編集",
            y: 100,
            z: 40,
            color: "#999999",
          },
          {
            name: "イラスト",
            y: 100,
            z: 30,
            color: "#666666",
          },
        ],
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "14px",
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
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default RadarChart;
