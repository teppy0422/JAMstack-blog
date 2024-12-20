import React, { useContext, useState, useRef } from "react";
import { Box } from "@chakra-ui/react";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";

import styles from "../../../styles/home.module.scss";

import GetWindowSize, { getWindowSize } from "../../../script/GetWindowSize";

const SjpChart01: React.FunctionComponent = (): JSX.Element => {
  const WindowSize = GetWindowSize();
  // let myWidth: number = WindowSize.width;
  // let myHeight: number = 0;

  // if (myWidth > 500) {
  //   myHeight = 500;
  // } else {
  //   myHeight = myWidth - 100;
  // }

  if (typeof Highcharts === "object") {
    HighchartsMore(Highcharts);
  }
  const options = {
    chart: {
      type: "area",
      // backgroundColor: "none",
      backgroundColor: "#f2e9df",
      spacingLeft: 5,
      spacingRight: 5,
      // height: myHeight,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "立上げ工数推移 計56H",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      categories: [
        '1月<br><span style="font-size:14px" >出図</span>',
        '2月<br><span style="font-size:14px" >CV</span>',
        "3月",
        "4月",
        '5月<br><span style="font-size:14px" >1A</span>',
        '6月<br><span style="font-size:14px" >量確</span>',
        '7月<br><span style="font-size:14px" >品確</span>',
        '8月<br><span style="font-size:14px" >量産</span>',
        "9月",
      ],
      tickmarkPlacement: "on",
      title: {
        enabled: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
      labels: {
        formatter: function () {
          return this.value;
        },
        style: {
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
      plotLines: [
        {
          value: 40, // y軸の40の位置に線を引く
          color: "red", // 線の色
          width: 2, // 線の太さ
          dashStyle: "Solid", // 線のスタイル（例: 'Solid', 'Dash', 'Dot'）
          label: {
            text: "定時能力", // 線のラベル
            align: "right", // ラベルの位置
            x: -16,
            style: {
              fontSize: "14px",
              fontWeight: "bold",
              color: "red",
            },
          },
        },
      ],
      max: 70,
    },
    tooltip: {
      split: true,
      valueSuffix: "/H",
    },
    plotOptions: {
      area: {
        stacking: "normal",
        lineColor: "#666666",
        lineWidth: 1,
        marker: {
          lineWidth: 1,
          lineColor: "#666666",
        },
      },
    },
    series: [
      {
        name: "定時工数",
        data: [16, 10, 5, 2, 3, 3, 4, 1, 0],
        color: "#9bc4eb",
      },
    ],
    legend: {
      layout: "horizontal",
      align: "right",
      verticalAlign: "top",
    },
  };
  return (
    <div className={styles.SjpChart01}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default SjpChart01;
