import React, { useEffect, useRef } from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Center,
  Button,
  Kbd,
  Text,
  useColorMode,
} from "@chakra-ui/react";

const menu = (pops) => {
  const property = {
    gameReplay: pops.gameReplay,
  };
  const startMenuRef = useRef(null);

  // useEffect(() => {
  //   //全てのロードが終わったら
  //   window.addEventListener("load", loadEnd);
  // }, []);

  // function loadEnd() {
  //   startMenuRef.current.style.display = "block";
  // }
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Tabs
        defaultIndex={2}
        style={{
          position: "absolute",
          zIndex: 9999,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          // display: "none",
          minHeight: "320px",
        }}
        colorScheme="red"
        bg={colorMode === "light" ? "white" : "gray.700"}
        borderRadius={3}
        p={4}
        px={8}
        ref={startMenuRef}
      >
        <TabList>
          <Tab _focus={{ _focus: "none" }}>自宅</Tab>
          <Tab _focus={{ _focus: "none" }}>村の寿司屋</Tab>
          <Tab _focus={{ _focus: "none" }}>高級店</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Center>制限時間:60秒</Center>
            <Center> ランキング登録不可能</Center>
            <Center>まだ作ってないよ</Center>
          </TabPanel>
          <TabPanel>
            <Center>制限時間:80秒</Center>
            <Center> ランキング登録不可能</Center>
            <Center>まだ作ってないよ</Center>
          </TabPanel>
          <TabPanel>
            <Center>制限時間:100秒</Center>
            <Center> ランキング登録可能</Center>
            <Center>
              <Button
                mt={10}
                p={7}
                onClick={(e) => {
                  property.gameReplay();
                  startMenuRef.current.style.display = "none";
                }}
              >
                <Text colorScheme="cyan">
                  START
                  <Kbd mt={1} style={{ display: "block" }}>
                    SPACE
                  </Kbd>
                </Text>
              </Button>
            </Center>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default menu;
