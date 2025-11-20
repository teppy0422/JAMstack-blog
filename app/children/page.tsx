"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Content from "@/components/content";
import ChildrenList from "./components/ChildrenList";
import TimelineView from "./components/TimelineView";
import GrowthChart from "./components/GrowthChart";
import { children } from "./data/childrenData";

export default function ChildrenPage() {
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>(
    children.map((child) => child.id)
  );

  const toggleChild = (childId: string) => {
    setSelectedChildIds((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  return (
    <Content maxWidth="1200px">
      <Box py={8}>
        <Heading as="h1" size="xl" mb={8} textAlign="center"></Heading>

        <ChildrenList
          selectedChildIds={selectedChildIds}
          onToggleChild={toggleChild}
        />

        {selectedChildIds.length > 0 && (
          <Tabs mt={8} colorScheme="blue">
            <TabList>
              <Tab>記録</Tab>
              <Tab>成長グラフ</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <TimelineView childIds={selectedChildIds} />
              </TabPanel>
              <TabPanel>
                <GrowthChart childIds={selectedChildIds} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Box>
    </Content>
  );
}
