import React, { useContext, useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";

import styles from "../../styles/home.module.scss";

import GetWindowSize, { getWindowSize } from "../../script/GetWindowSize";

type Props = {
  results: {
    userId: string;
    result: Number;
    time: Number;
    date: string;
  }[];
};

let results = [];
let chart;
const Skillchart: React.FC<Props> = ({ results }): JSX.Element => {
  console.log("____");

  const { data: session } = useSession();
  console.log("session::", session);

  console.log("results.length", results.length);

  for (let g of results) {
    console.log("g:", g.date);
  }

  const WindowSize = GetWindowSize();
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

  async function myAsync(url) {
    const response = await fetch(url, { method: "GET" }); //await で fetch() が完了するまで待つ
    const data = await response.json(); //await で response.json() が完了するまで待つ
    console.log("data", data);

    const arr = data.map((item, index, array) => {
      if (item.userId !== null) {
        results.push({
          userId: item.userId,
          result: item.result,
          time: item.times,
          date: item.date,
        });
      }
    });
    console.log("results", results);
    console.log("email", results[0].userId);
    // return results;
    // options["series"] = [{ name: "aaa", data: [0, 1], color: "#444444" }];
  }

  const options = {
    title: {
      text: "タイピング履歴",
    },

    subtitle: {
      text: "",
    },

    yAxis: {
      title: {
        text: "Number of Employees",
      },
    },

    xAxis: {
      accessibility: {
        rangeDescription: "Range: 0 to 100",
      },
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2010,
      },
    },

    series: [
      {
        name: "KPM",
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 164175],
        color: "#444444",
      },
      {
        name: "ミス",
        data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434],
        color: "pink",
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
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };
  // function onClick() {
  // highcharts.addSeries({
  //   name: "新しく追加したデータ",
  //   data: [100000, 110000, 120000, 100000, 130000, 140000],
  // });
  // }
  return (
    <div>
      <button onClick={() => myAsync("/api/typing")}>myAsync</button>

      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        results={results}
      />
    </div>
  );
};

export default Skillchart;
