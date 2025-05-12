import React, { useContext, useState, useRef } from "react";
import { Box } from "@chakra-ui/react";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";

import styles from "@/styles/home.module.scss";

import { GetWindowSize } from "@/hooks/GetWindowSize";
import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

const SjpChart01: React.FunctionComponent = (): JSX.Element => {
  const WindowSize = GetWindowSize();
  // let myWidth: number = WindowSize.width;
  // let myHeight: number = 0;

  // if (myWidth > 500) {
  //   myHeight = 500;
  // } else {
  //   myHeight = myWidth - 100;
  // }
  const { language, setLanguage } = useLanguage();

  if (typeof Highcharts === "object") {
    HighchartsMore(Highcharts);
  }
  const options = {
    chart: {
      type: "area",
      backgroundColor: "none",
      // height: myHeight,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
      style: {},
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      categories: ["2019/5", "6", "7", "8", "9", "10", "11"],
      tickmarkPlacement: "on",
      title: {
        enabled: false,
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
      },
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
          ja: "作業工数",
          language,
        }),

        data: [920, 635, 445, 300, 201, 93, 22],
      },
      {
        name: getMessage({
          ja: "残業",
          us: "residual industry",
          cn: "残業",
          language,
        }),

        data: [320, 200, 133, 20, 0, 0, 0],
      },
      {
        name: getMessage({
          ja: "休日出勤",
          us: "working on a day off",
          cn: "假日工作",
          language,
        }),

        data: [98, 30, 16, 0, 0, 0, 0],
      },
    ],
  };
  return (
    <div className={styles.SjpChart01}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default SjpChart01;
