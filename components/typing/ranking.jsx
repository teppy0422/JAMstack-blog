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
  Avatar,
  Text,
  Icon,
  Spacer,
} from "@chakra-ui/react";
import { PiCrown } from "react-icons/pi";
import { FaTrophy, FaCrown } from "react-icons/fa";
import { supabase } from "../../utils/supabase/client";
import styles from "../../styles/home.module.scss";
import PropTypes from "prop-types";
import GraphTemp from "./graphTemp";

const Ranking = forwardRef((props, ref) => {
  const { user } = props;
  const [hoverData, setHoverData] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const [chartOptions, setChartOptions] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userID, setUserID] = useState(null);
  const [ranking, setRanking] = useState([
    {
      user_id: null,
      max_kpm: null,
      name: "",
      picture_url: "",
      user_company: "",
      missed: null,
      created_at: null,
    },
  ]);
  useEffect(() => {
    if (user && user.id) {
      setUserID(user.id);
    }
  }, [user]);
  //それぞれのボタン
  const openRef = useRef(null);

  async function getRanking() {
    // 全てのuser_idとresultを取得
    const { data: allResults, error: allResultsError } = await supabase
      .from("typing_results")
      .select("user_id, result, missed, created_at");
    if (allResultsError) throw allResultsError;

    // user_idごとに最大値を計算
    const userMaxKPMs = Array.from(
      allResults.reduce((map, result) => {
        if (
          !map.has(result.user_id) ||
          map.get(result.user_id).max_kpm < result.result
        ) {
          map.set(result.user_id, {
            max_kpm: result.result,
            missed: result.missed,
            created_at: result.created_at,
          });
        }
        return map;
      }, new Map())
    )
      .map(([user_id, { max_kpm, missed, created_at }]) => ({
        user_id,
        max_kpm,
        missed,
        created_at,
      }))
      .sort((a, b) => b.max_kpm - a.max_kpm);
    // user_idをもとにname, picture_url, user_companyを取得
    const { data: users, error: usersError } = await supabase
      .from("table_users")
      .select("id, user_metadata->>name, picture_url, user_company");
    if (usersError) throw usersError;

    // user_idとname, picture_url, user_companyをマッチング
    const rankingData = userMaxKPMs.map((userMaxKPM) => {
      const user = users.find((u) => u.id === userMaxKPM.user_id);
      return {
        ...userMaxKPM,
        name: user ? user.name : "Unknown", // 修正
        picture_url: user ? user.picture_url : null,
        user_company: user ? user.user_company : null,
      };
    });

    console.log("rankingData:", rankingData);
    return rankingData;
  }
  useEffect(() => {
    const fetchRanking = async () => {
      const userMaxKPMs = await getRanking();
      console.log("userMaxKPMs:", userMaxKPMs);
      if (userMaxKPMs !== undefined) {
        setRanking(userMaxKPMs);
        console.log("ranking:", ranking);
      }
    };
    fetchRanking();
  }, []);
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
      if (openRef.current) {
        openRef.current.click();
      }
      console.log("クリックされたchild");
    },
  }));
  const graphTempRefs = useRef({});
  const handleBoxClick = (user_id) => {
    if (graphTempRefs.current[user_id]) {
      graphTempRefs.current[user_id].childClick();
    }
  };
  return (
    <>
      <Box
        className={`${styles.graphTemp} ${styles.snowTarget}`}
        style={{
          transform: "translateX(0rem)",
        }}
        id={`openButton-${userID}`} // ユニークなIDを設定
        w="56px"
        _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
        onClick={() => {
          console.log(`GraphTemp clicked for userID: ${userID}`); // デバッグ用ログ
          onOpen();
          setOverlay(<OverlayTwo />);
          getRanking();
          console.log("クリックされた");
        }}
        ref={openRef}
      >
        <Icon as={PiCrown} w="24px" h="24px" />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalOverlay />
        <ModalContent top="60px" w={["260px", "300px", "350px", "400px"]}>
          <ModalHeader fontSize="16px">ランキング</ModalHeader>

          <ModalCloseButton _focus={{ _focus: "none" }} />
          <ModalBody>
            <Stack direction="column" margin="auto" spacing={4}>
              {ranking.map((user, index) => (
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  cursor="pointer"
                  borderColor={userID === user.user_id ? "black" : "gray.300"}
                  onClick={() => handleBoxClick(user.user_id)}
                >
                  <Stack direction="row" align="center" spacing={4}>
                    <Text fontSize="xl" fontWeight="bold">
                      <Box
                        position="relative"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        w="24px"
                      >
                        {index < 3 && (
                          <Icon
                            as={FaCrown}
                            w="24px"
                            h="24px"
                            color={
                              index === 0
                                ? "gold"
                                : index === 1
                                ? "silver"
                                : "brown"
                            }
                          />
                        )}
                        <Text fontSize="14px" zIndex="1">
                          {index + 1}
                        </Text>
                      </Box>
                    </Text>
                    <Avatar src={user?.picture_url} loading="lazy" />
                    <Stack direction="column" fontSize="sm" lineHeight="0.8">
                      <Text fontSize="xs">{user?.user_company}</Text>
                      <Text>{user?.name}</Text>
                    </Stack>
                    <Box display="flex" flexDirection="column" ml="auto">
                      <Box display="flex" justifyContent="flex-end">
                        <Badge colorScheme="red">miss:{user?.missed}</Badge>
                        <Badge ml="4px" colorScheme="gray">
                          {user?.created_at
                            ? user.created_at.slice(0, 10)
                            : "N/A"}
                        </Badge>
                      </Box>
                      <Text textAlign="right">
                        <span style={{ fontSize: "1.4rem" }}>
                          {user?.max_kpm}
                        </span>
                        /KPM
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </ModalBody>

          <ModalFooter position="relative">
            <Stack direction="row" margin="auto"></Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {Array.isArray(ranking) &&
        ranking.map((user) => (
          <GraphTemp
            key={user.user_id}
            ref={(el) => (graphTempRefs.current[user.user_id] = el)}
            totalCost={0}
            missedCount={0}
            typePerSocund={0}
            times={0}
            user={user}
            userID={user.user_id} // userIDを渡す
            visible={false}
          />
        ))}
      {/* <h5>{hoverData}</h5> */}
    </>
  );
});
export default Ranking;
