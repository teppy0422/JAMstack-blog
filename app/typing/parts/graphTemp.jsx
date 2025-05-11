"use client";

import React, {
  useState,
  useRef,
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
import { supabase } from "@/utils/supabase/client";

import Highcharts from "highcharts/highcharts";
// import Highcharts from "highcharts/highstock"; //上記との違いわからん
import HighchartsReact from "highcharts-react-official";
import highchartsAccessibility from "highcharts/modules/accessibility";
import AnnotationsFactory from "highcharts/modules/annotations";

// import { useSession, signIn, signOut } from "next-auth/react";
import styles from "@/styles/home.module.scss";

import getMessage from "../../../components/getMessage";
import {
  useLanguage,
  LanguageProvider,
} from "../../../context/LanguageContext";

const GraphTemp = forwardRef((props, ref) => {
  const {
    totalCost,
    missedCount,
    typePerSocund,
    gameReplay,
    voucherCloseRef,
    times,
    user,
    userID,
    visible,
  } = props;
  // const { data: session } = useSession();
  const [hoverData, setHoverData] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const [chartOptions, setChartOptions] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { language, setLanguage } = useLanguage();

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
  const createdAtsRef = useRef("");
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
    let createdAts = []; // created_atを保存

    if (user !== undefined) {
      const { data, error } = await supabase
        .from("typing_results")
        .select("*")
        .eq("user_id", userID)
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }
      data.forEach((item) => {
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
        const dd = new Date(item.created_at);
        let md = dd.getMonth() + 1 + "/" + dd.getDate();
        if (md !== mdBak) {
          let obj = {
            point: {
              xAxis: 0,
              yAxis: 0,
              x: count - 1,
              y: item.result,
            },
            text: md,
          };
          dates.push(obj);
          mdBak = md;
        }
      });
      valueRef.current = values;
      timesRef.current = times;
      idRef.current = ids;
      missedRef.current = misseds;
      costsRef.current = costs;
      datesRef.current = dates;
      createdAtsRef.current = createdAts;
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
        text: getMessage({
          ja: "クリックでデータの削除",
          us: "Delete data with a click",
          cn: "点击删除数据",
          language,
        }),
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
          name: getMessage({
            ja: "金額",
            us: "Amount",
            cn: "金額",
            language,
          }),
          yAxis: 1,
          legendIndex: 2,
          type: "column",
          data: getCosts().map((cost, index) => ({
            y: cost,
            id: idRef.current[index],
          })),
          tooltip: { valueSuffix: "" },
          color: "#dBc6f1",
        },
        {
          name: getMessage({
            ja: "ミス",
            us: "missed",
            cn: "失去的",
            language,
          }),
          legendIndex: 1,
          type: "spline",
          data: getMisseds().map((missed, index) => ({
            y: missed,
            id: idRef.current[index],
          })),
          tooltip: {
            valueSuffix: getMessage({
              ja: " 回",
              us: " time",
              cn: " 回",
              language,
            }),
          },
          color: "red",
        },
        {
          name: "KPM",
          legendIndex: 0,
          type: "spline",
          data: getValue().map((value, index) => ({
            y: value,
            id: idRef.current[index],
          })),
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
                if (visible) {
                  deleteQuestion(e);
                } else {
                  alert(
                    getMessage({
                      ja: "自分のデータのみ削除できます",
                      us: "Only your data can be deleted.",
                      cn: "只能删除自己的数据",
                      language,
                    })
                  );
                }
              },
            },
          },
        },
      },
    });
  }

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
    const id = obj.point.id;
    if (id) {
      delete_one(id).then((value) => {
        getResult().then((value) => {
          updateSeries();
        });
      });
    } else {
      console.log("idがありません");
    }
  }

  const delete_one = async (id) => {
    const { data, error } = await supabase
      .from("typing_results")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error deleting data:", error.message);
    } else {
      console.log("Data deleted successfully:", data);
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
      {user !== null ? (
        <Box
          className={
            visible
              ? `${styles.graphTemp} ${styles.snowTarget}`
              : styles.graphTemp
          }
          style={{
            transform: "translateX(0rem)",
            fontFamily: getMessage({
              ja: "Noto Sans JP",
              us: "Noto Sans JP",
              cn: "Noto Sans SC",
              language,
            }),
          }}
          id={`openButton-${userID}`}
          w="56px"
          _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
          onClick={() => {
            onOpen();
            setOverlay(<OverlayTwo />);
            makeChart();
            console.log("クリックされた");
          }}
          ref={openRef}
          display={visible ? "" : "none"}
        >
          {visible
            ? getMessage({
                ja: "履歴",
                us: "Log",
                cn: "历史",
                language,
              })
            : ""}
        </Box>
      ) : (
        <Tooltip
          hasArrow
          label={getMessage({
            ja: "ログインしていると開けます",
            us: "You can open it if you are logged in.",
            cn: "登录后打开",
            language,
          })}
          bg="gray.600"
        >
          <Box
            className={styles.graphTemp}
            w="56px"
            disabled
            style={{
              fontFamily: getMessage({
                ja: "Noto Sans JP",
                us: "Noto Sans JP",
                cn: "Noto Sans SC",
                language,
              }),
            }}
          >
            {getMessage({
              ja: "履歴",
              us: "Log",
              cn: "历史",
              language,
            })}
          </Box>
        </Tooltip>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        style={{
          fontFamily: getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans,Noto Sans JP",
            cn: "Noto Sans SC",
            language,
          }),
        }}
      >
        {overlay}
        <ModalOverlay />
        <ModalContent top="60px" w="100%" maxWidth="100%">
          <ModalHeader fontSize="16px">
            {getMessage({
              ja: "タイピング履歴",
              us: "Typing history",
              cn: "打字历史",
              language,
            })}
          </ModalHeader>

          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </ModalBody>

          <ModalFooter position="relative">
            <Stack direction="row" margin="auto">
              <Badge>Default</Badge>
              <Tooltip
                hasArrow
                label={getMessage({
                  ja: "1分間の入力キー数",
                  us: "Keys per minute",
                  cn: "每分钟输入的按键数",
                  language,
                })}
                bg="gray.600"
              >
                <Badge
                  colorScheme="green"
                  variant="solid"
                  style={{ cursor: "default" }}
                >
                  {typePerSocund}/KPM
                </Badge>
              </Tooltip>
              <Badge colorScheme="red" variant="outline">
                {getMessage({
                  ja: "ミス",
                  us: "missed",
                  cn: "失去的",
                  language,
                })}
                :{missedCount}
                {getMessage({
                  ja: "回",
                  us: "time",
                  cn: "回",
                  language,
                })}
              </Badge>
              <Badge colorScheme="purple">
                {getMessage({
                  ja: "¥ ",
                  us: "$ ",
                  cn: "¥ ",
                  language,
                })}
                {totalCost}
              </Badge>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* <h5>{hoverData}</h5> */}
    </>
  );
});
export default GraphTemp;
