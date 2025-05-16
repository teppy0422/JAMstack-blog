import React, { useContext, useState, useRef } from "react";
import { Box } from "@chakra-ui/react";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";

import styles from "@/styles/home.module.scss";

import { GetWindowSize } from "@/hooks/GetWindowSize";
import getMessage from "@/utils/getMessage";

interface SjpChart01Props {
  language: string;
}

const SjpChart01: React.FunctionComponent<SjpChart01Props> = ({ language }) => {
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
      text: getMessage({
        ja: "立上げ工数 計56H",
        us: "Start-up team-hours Total 56H",
        cn: "启动工时 总计 56h",
        language,
      }),
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
        getMessage({
          ja: '1月<br><span style="font-size:14px" >出図</span>',
          us: 'Jan.<br><span style="font-size:14px" >DR</span>',
          cn: '一月<br><span style="font-size:14px" >出図</span>',
          language,
        }),
        getMessage({
          ja: '2月<br><span style="font-size:14px" >CV</span>',
          us: 'Feb.<br><span style="font-size:14px" >CV</span>',
          cn: '二月<br><span style="font-size:14px" >CV</span>',
          language,
        }),
        getMessage({
          ja: "3月",
          us: "Mar.",
          cn: "三月",
          language,
        }),
        getMessage({
          ja: "4月",
          us: "Apr.",
          cn: "四月",
          language,
        }),
        getMessage({
          ja: '5月<br><span style="font-size:14px" >1A</span>',
          us: 'May<br><span style="font-size:14px" >1A</span>',
          cn: '五月<br><span style="font-size:14px" >1A</span>',
          language,
        }),
        getMessage({
          ja: '6月<br><span style="font-size:14px" >量確</span>',
          us: 'Jun.<br><span style="font-size:14px" >MP</span>',
          cn: '六月<br><span style="font-size:14px" >量確</span>',
          language,
        }),
        getMessage({
          ja: '7月<br><span style="font-size:14px" >品確</span>',
          us: 'Jul.<br><span style="font-size:14px" >QP</span>',
          cn: '七月<br><span style="font-size:14px" >品確</span>',
          language,
        }),
        getMessage({
          ja: '8月<br><span style="font-size:14px" >量産</span>',
          us: 'Aug.<br><span style="font-size:14px" >SOP</span>',
          cn: '八月<br><span style="font-size:14px" >量産</span>',
          language,
        }),
        getMessage({
          ja: "9月",
          us: "Sep.",
          cn: "九月",
          language,
        }),
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
            text: getMessage({
              ja: "定時能力",
              us: "Daily Punctuality",
              cn: "定時能力",
              language,
            }),
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
        name: getMessage({
          ja: "定時工数",
          us: "Number of timed jobs",
          cn: "定時工数",
          language,
        }),

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
