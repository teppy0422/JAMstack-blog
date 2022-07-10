import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  useColorMode,
  Button,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Center,
  Tooltip,
} from "@chakra-ui/react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

import { useSession, signIn, signOut } from "next-auth/react";

let LineChart = (pops, ref) => {
  const property = {
    totalCost: pops.totalCost,
    missedCount: pops.missedCount,
    typePerSocund: pops.typePerSocund,
    gameReplay: pops.gameReplay,
    voucherCloseRef: pops.voucherCloseRef,
    times: pops.times,
  };
  const { data: session } = useSession();
  const [hoverData, setHoverData] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();

  const [chartOptions, setChartOptions] = useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  //それぞれのボタン
  const openRef = useRef(null);
  const updateRef = useRef(null);
  const closeRef = useRef(null);
  //保存データ
  const valueRef = useRef(0);
  const timesRef = useRef(0);
  const datesRef = useRef("");
  const idRef = useRef(0);

  useEffect(() => {
    getValue();
    setTimeout(updateSeries, 1000);
    setTimeout(updateSeries, 1500);
  }, []);

  const getResult = async () => {
    let results = [];
    let values = [];
    let times = [];
    let dates = [];
    let ids = [];
    console.log("session,", session);

    if (session !== undefined) {
      const count = 0;
      const email = session.user.email;
      console.log("email", email);
      const response = await fetch("/api/typing", { method: "GET" }); //await で fetch() が完了するまで待つ
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
          if (item.userId === email) {
            count++;
            values.push(item.result);
            times.push(count);
            dates.push(item.date);
            ids.push(item.id);
          }
        }
      });
      console.log("results", results);
      console.log("values", values);
      console.log("dates", dates);
      // console.log("email", results[0].userId);
      valueRef.current = values;
      timesRef.current = times;
      datesRef.current = dates;
      idRef.current = ids;
    }
    return 50;
  };

  function getValue() {
    getResult();
    return valueRef.current;
  }
  function getTimes() {
    return timesRef.current;
  }
  function getColor(type) {
    switch (type) {
      case "text":
        if (colorMode === "light") {
          return "#444444";
        } else {
          return "#ffffff";
        }
      case "backborder":
        if (colorMode === "light") {
          return "#999999";
        } else {
          return "#999999";
        }
    }
  }

  function updateSeries() {
    setChartOptions({
      chart: {
        type: "spline",
        backgroundColor: "none",
        // zoomType: "x",
        // scrollablePlotArea: { minWidth: 100 },
      },
      credits: {
        enabled: false,
      },
      labels: [],
      annotations: [
        {
          draggable: "",
          labelOptions: {
            backgroundColor: "rgba(255,255,255,0.5)",
            verticalAlign: "top",
            y: 0,
          },
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: 8,
                y: 200,
              },
              text: "Arbois",
            },
          ],
        },
      ],
      colors: "#ff0000",
      title: {
        text: "タイピング履歴",
        style: {
          color: getColor("text"),
        },
      },
      xAxis: {
        categories: getTimes(),
        labels: {
          style: {
            color: getColor("text"),
            fontSize: "13px",
          },
        },
        lineColor: getColor("text"),
        lineWidth: 1,
      },
      yAxis: {
        min: 0,
        gridLineColor: getColor("backborder"),
        lineColor: getColor("backborder"),
        lineWidth: 1,
        title: {
          text: "",
          color: "#ff0000",
          style: {
            color: getColor("text"),
            fontSize: "16px",
          },
        },
        labels: {
          style: {
            color: getColor("text"),
            fontSize: "14px",
          },
        },
        style: {
          lineColor: getColor("text"),
        },

        minorTickInterval: 100, // 'auto'
        minorTickWidth: 1,
        minorTickLength: 5,
        minorTickColor: getColor("backborder"),
      },
      tooltip: {
        headerFormat: "{point.x}<br>",
        pointFormat: "{point.y} /KPM",
        shared: true,
      },
      // series: [{ name: "KPM", data: getValue(), color: getColor() }],
      series: [
        { name: "KPM", data: getValue(), color: getColor("text") },
        { name: "missed", data: [10, 20], color: "red" },
      ],
      plotOptions: {
        series: {
          cursor: "pointer",
          point: {
            events: {
              mouseOver(e) {
                setHoverData(e.target.category);
              },
              click: function (e) {
                deleteQuestion(e);
              },
            },
          },
        },
      },
    });
  }
  function deleteQuestion(obj) {
    console.log(obj.point);
    console.log(obj.point.category);
  }

  function graphOpen() {
    const button = document.getElementById("button");
    if (button !== null) {
      button.click();
    }
    console.log("clicked");
  }
  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="80%"
      backdropBlur="2px"
    />
  );
  const [overlay, setOverlay] = React.useState(<OverlayTwo />);
  // 親コンポーネントの ref.current から実行できる関数を定義したオブジェクトを返す
  useImperativeHandle(ref, () => ({
    childClick() {
      openRef.current.click();
      setTimeout(updateSeries, 1000);
      setTimeout(updateSeries, 1500);
    },
  }));
  return (
    <>
      {session ? (
        <Button
          id="openButton"
          onClick={() => {
            onOpen();
            setOverlay(<OverlayTwo />);
            setTimeout(updateSeries, 1000);
            setTimeout(updateSeries, 1500);
          }}
          ref={openRef}
          display="none"
        >
          履歴
        </Button>
      ) : (
        <Button disabled>履歴</Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalOverlay />
        <ModalContent top="60px" w="100%" maxWidth="100%">
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </ModalBody>

          <ModalFooter>
            {session ? (
              <Center fontSize={["0px", "16px", "16px", "16px"]}>
                {session.user.name}
              </Center>
            ) : (
              <Center fontSize="10px">ログインしていません</Center>
            )}
            <Center>{property.totalCost}円</Center>
            <Center>ミス:{property.missedCount}回</Center>
            <Tooltip hasArrow label="1分間の入力キー数" bg="gray.600">
              <Center>タイプ速度:{property.typePerSocund}/KPM</Center>
            </Tooltip>

            <Button
              variant="ghost"
              id="button"
              onClick={() => {
                updateSeries();
              }}
              ref={updateRef}
            >
              更新
            </Button>
            <Button colorScheme="blue" mr={3} ref={closeRef} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <h3>Hovering over {hoverData}</h3>
    </>
  );
};
LineChart = forwardRef(LineChart);
export default LineChart;
