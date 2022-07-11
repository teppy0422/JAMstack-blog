import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useReducer,
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
  const missedRef = useRef(0);
  const datesRef = useRef("");
  const idRef = useRef(0);

  useEffect(() => {
    console.log("更新");
    getResult();
  }, [session]);

  const getResult = async () => {
    let results = [];
    let values = [];
    let times = [];
    let dates = [];
    let ids = [];
    let misseds = [];

    console.log("session:", session);
    if (session !== undefined) {
      const count = 0;
      const email = session.user.email;
      console.log("email", email);
      const response = await fetch("/api/typing", { method: "GET" }); //await で fetch() が完了するまで待つ
      const data = await response.json(); //await で response.json() が完了するまで待つ
      console.log("data", data);
      const arr = await data.map((item, index, array) => {
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
            if (item.missed === 0) {
              misseds.push(null);
            } else {
              misseds.push(item.missed);
            }
          }
        }
      });
      // console.log("results", results);
      // console.log("values", values);
      // console.log("dates", dates);
      // console.log("email", results[0].userId);
      valueRef.current = values;
      timesRef.current = times;
      datesRef.current = dates;
      idRef.current = ids;
      missedRef.current = misseds;
    }
    return 50;
  };

  const getIDRef = useRef("");
  const getId = async (getCount) => {
    if (session !== undefined) {
      const count = 0;
      const email = session.user.email;
      const response = await fetch("/api/typing", { method: "GET" }); //await で fetch() が完了するまで待つ
      const data = await response.json(); //await で response.json() が完了するまで待つ
      const arr = await data.map((item, index, array) => {
        if (item.userId !== null) {
          if (item.userId === email) {
            count++;
            if (getCount === count) {
              console.log("ggg", item.id);
              getIDRef.current = item.id;
              return item.id;
            }
          }
        }
      });
    }
  };
  function getValue() {
    console.log("getValue:", valueRef.current);
    return valueRef.current;
  }
  function getTimes() {
    return timesRef.current;
  }
  function getMisseds() {
    return missedRef.current;
  }
  function getIds() {
    return idRef.current;
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
        text: "クリックでデータの削除",
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
        pointFormat: "{point.y} /{series.name}<br>",
        shared: true,
      },
      // series: [{ name: "KPM", data: getValue(), color: getColor() }],
      series: [
        { name: "KPM", data: getValue(), color: getColor("text") },
        { name: "ミス", data: getMisseds(), color: "red" },
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
    console.log(obj.point.y);
    console.log("obj.point.category:", obj.point.category);
    getId(obj.point.category);
    console.log("getIDRef:", getIDRef.current);

    delete_one(obj.point.category);
  }

  const delete_one = async (count) => {
    let delete_id = await getId(count);
    console.log("consooooole", delete_id);
    console.log("getidrefffffff", getIDRef.current);
    const data = {
      delete_id: Number(getIDRef.current),
    };
    console.log({ session });
    if (session !== undefined) {
      await fetch("/api/typing", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // 本文のデータ型は "Content-Type" ヘッダーと一致させる必要があります
      }); //await で fetch() が完了するまで待つ
      // const data = await response.json(); //await で response.json() が完了するまで待つ
      // console.log("delete_one:", response);
      console.log("delete_one;end_in");
    }
    console.log("delete_one;end_out");
    getResult(); //画面の更新;
    setTimeout(updateSeries, 100);
  };
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
          _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
          onClick={() => {
            onOpen();
            getResult();
            setOverlay(<OverlayTwo />);
            // updateSeries();

            updateSeries();
          }}
          ref={openRef}
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
          <ModalHeader>タイピング履歴:高級店</ModalHeader>
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
              _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
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
