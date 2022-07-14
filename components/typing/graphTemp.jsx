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
  Stack,
  Badge,
  Box,
} from "@chakra-ui/react";

import Highcharts from "highcharts/highcharts";
// import Highcharts from "highcharts/highstock"; //上記との違いわからん
import HighchartsReact from "highcharts-react-official";
import highchartsAccessibility from "highcharts/modules/accessibility";
import AnnotationsFactory from "highcharts/modules/annotations";

import { useSession, signIn, signOut } from "next-auth/react";
import styles from "../../styles/home.module.scss";

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

  if (typeof window !== `undefined`) {
    AnnotationsFactory(Highcharts);
    highchartsAccessibility(Highcharts);
  }
  //それぞれのボタン
  const openRef = useRef(null);
  const closeRef = useRef(null);
  //保存データ
  const valueRef = useRef(0);
  const timesRef = useRef(0);
  const missedRef = useRef(0);
  const datesRef = useRef("");
  const idRef = useRef(0);
  const costsRef = useRef(0);
  const getIDRef = useRef("");

  useEffect(() => {
    console.log("更新1");
    // getResult();
  }, [session]);

  function makeChart() {
    getResult().then((value) => {
      updateSeries();
    });
  }

  const getResult = async () => {
    let values = [];
    let times = [];
    let dates = [];
    let ids = [];
    let misseds = [];
    let costs = [];
    let count = 0;
    let mdBak = ""; //日付変化の確認

    if (session !== undefined && session !== null) {
      console.log(
        "ログインしています,session.user.email: ",
        session.user.email
      );
      const email = session.user.email;
      const response = await fetch("/api/typing", { method: "GET" }); //await で fetch() が完了するまで待つ
      const data = await response.json(); //await で response.json() が完了するまで待つ
      const arr = await data.map((item, index, array) => {
        if (item.userId !== null) {
          if (item.userId === email) {
            count++;
            values.push(item.result);
            times.push(count);
            ids.push(item.id);
            costs.push(item.cost);
            if (item.missed === 0) {
              misseds.push(null);
            } else {
              misseds.push(item.missed);
            }
            const dd = new Date(item.date);
            console.log(dd);
            let md = dd.getMonth() + 1 + "/" + dd.getDate();
            if (md !== mdBak) {
              let obj = {
                point: {
                  xAxis: 0,
                  yAxis: 0,
                  x: count - 1,
                  y: item.result,
                },
                // x: 10,
                text: md,
              };
              dates.push(obj);
              mdBak = md;
            }
          }
        }
      });
      valueRef.current = values;
      timesRef.current = times;
      idRef.current = ids;
      missedRef.current = misseds;
      costsRef.current = costs;
      datesRef.current = dates;
    } else {
      console.log("ログインしていません");
    }
    return "getResultRow" + count;
  };

  function updateSeries() {
    setChartOptions({
      chart: {
        backgroundColor: "none",
        zoomType: "x",
        scrollablePlotArea: { minWidth: 100 },
      },
      credits: {
        enabled: false,
      },
      labels: [],
      annotations: [
        // {
        //   draggable: "",
        //   labelOptions: {
        //     backgroundColor: "rgba(255,255,255,0.8)",
        //     y: -40,
        //   },
        //   labels: [
        //     {
        //       point: {
        //         xAxis: 0,
        //         yAxis: 0,
        //         x: 3,
        //         y: 376,
        //       },
        //       text: "7/12",
        //     },
        //   ],
        // },
        // {
        //   draggable: "",
        //   labelOptions: {
        //     shape: "connector",
        //     align: "right",
        //     justify: false,
        //     crop: true,
        //     style: {
        //       fontSize: "1em",
        //       textOutline: "1px white",
        //     },
        //     backgroundColor: "rgba(255,255,255,0.8)",
        //   },
        //   labels: [
        //     {
        //       point: {
        //         xAxis: 0,
        //         yAxis: 0,
        //         x: 2,
        //         y: 166,
        //       },
        //       text: "7/11<br>金",
        //     },
        //   ],
        // },
        {
          draggable: "",
          labelOptions: {
            // shape: "connector",
            // align: "top",
            // justify: true,
            // crop: true,
            style: {
              fontSize: "1em",
              // textOutline: "1px white",
            },
            y: -20,
            backgroundColor: "rgba(255,255,255,0.8)",
          },
          labels: getDates(),
        },
      ],
      colors: "#ff0000",
      title: {
        text: "クリックでデータの削除",
        style: {
          color: getColor("text"),
          fontSize: "16px",
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
      yAxis: [
        {
          min: 0,
          gridLineColor: getColor("backborder"),
          lineColor: getColor("backborder"),
          lineWidth: 1,
          title: {
            text: "",
            color: "#ee0000",
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
          // minorTickInterval: 100, // 'auto'
          // minorTickWidth: 1,
          // minorTickLength: 5,
          minorTickColor: getColor("backborder"),
        },
        {
          labels: {
            format: "{value}",
            style: {
              color: "#aB96f1",
            },
          },
          title: {
            text: "",
            style: {
              color: "#aB96f1",
            },
          },
          opposite: true,
        },
      ],
      tooltip: {
        // headerFormat: "{point.x}<br>",
        // pointFormat: "{point.y} /{series.name}<br>",
        shared: true,
      },
      // series: [{ name: "KPM", data: getValue(), color: getColor() }],
      series: [
        {
          name: "金額",
          yAxis: 1,
          legendIndex: 2,
          type: "column",
          data: getCosts(),
          tooltip: { valueSuffix: " 円" },
          color: "#dBc6f1",
        },
        {
          name: "ミス",
          legendIndex: 1,
          type: "spline",
          data: getMisseds(),
          tooltip: { valueSuffix: " 回" },
          color: "red",
        },
        {
          name: "KPM",
          legendIndex: 0,
          type: "spline",
          data: getValue(),
          tooltip: { valueSuffix: " " },
          color: getColor("text"),
          marker: { symbol: "ball" },
        },
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

  const getId = async (getCount) => {
    if (session !== undefined && session !== null) {
      const count = 0;
      const email = session.user.email;
      const response = await fetch("/api/typing", { method: "GET" }); //await で fetch() が完了するまで待つ
      const data = await response.json(); //await で response.json() が完了するまで待つ
      const arr = await data.map((item, index, array) => {
        if (item.userId !== null) {
          if (item.userId === email) {
            count++;
            if (getCount === count) {
              getIDRef.current = item.id;
              return false;
            }
          }
        }
      });
    }
  };
  function getValue() {
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
  function getCosts() {
    return costsRef.current;
  }
  function getDates() {
    console.log(datesRef.current);
    return datesRef.current;
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
          return "#ffffff";
        }
    }
  }
  function deleteQuestion(obj) {
    getId(obj.point.category).then((value) => {
      delete_one(getIDRef.current).then((value) => {
        getResult().then((value) => {
          updateSeries();
        });
      });
    });
  }

  const delete_one = async (delete_id) => {
    console.log("adfa", delete_id);
    const data = {
      delete_id: Number(delete_id),
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
    }
  };
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
      console.log("クリックされたchild");
    },
  }));
  return (
    <>
      {session ? (
        <Box
          className={styles.graphTemp}
          id="openButton"
          w="56px"
          _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
          onClick={() => {
            onOpen();
            setOverlay(<OverlayTwo />);
            makeChart();
            console.log("クリックされた");
          }}
          ref={openRef}
        >
          履歴
        </Box>
      ) : (
        <Tooltip hasArrow label="ログインしていると開けます" bg="gray.600">
          <Box className={styles.graphTemp} w="56px" disabled>
            履歴
          </Box>
        </Tooltip>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalOverlay />
        <ModalContent top="60px" w="100%" maxWidth="100%">
          <ModalHeader fontSize="16px">タイピング履歴</ModalHeader>

          <ModalCloseButton _focus={{ _focus: "none" }} />
          <ModalBody>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </ModalBody>

          <ModalFooter position="relative">
            <Stack direction="row" margin="auto">
              <Badge>Default</Badge>
              <Tooltip hasArrow label="1分間の入力キー数" bg="gray.600">
                <Badge
                  colorScheme="green"
                  variant="solid"
                  style={{ cursor: "default" }}
                >
                  {property.typePerSocund}/KPM
                </Badge>
              </Tooltip>
              <Badge colorScheme="red" variant="outline">
                ミス:{property.missedCount}回
              </Badge>
              <Badge colorScheme="purple">{property.totalCost}円</Badge>
            </Stack>
            <Button
              colorScheme="blue"
              mr={3}
              ref={closeRef}
              onClick={onClose}
              _focus={{ _focus: "none" }}
              position="absolute"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <h5>{hoverData}</h5>
    </>
  );
};
LineChart = forwardRef(LineChart);
export default LineChart;
