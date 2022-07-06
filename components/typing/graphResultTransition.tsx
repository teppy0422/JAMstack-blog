import React, { useContext, useState, useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

import Highcharts from "highcharts";
import HighchartsMore from "highcharts/modules/variable-pie";
import HighchartsReact from "highcharts-react-official";

import styles from "../../styles/home.module.scss";

import GetWindowSize, { getWindowSize } from "../../script/GetWindowSize";

const Skillchart: React.FunctionComponent = (): JSX.Element => {
  const { data: session } = useSession();
  console.log("session:", session);

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

  const options = {
    title: {
      text: "タイピング履歴",
    },

    subtitle: {
      text: "Source: thesolarfoundation.com",
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
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
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
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Skillchart;
