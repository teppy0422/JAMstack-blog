import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  Divider,
  Flex,
  Icon,
  Progress,
  Badge,
  HStack,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import {
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineCheckBox,
  MdEditRoad,
} from "react-icons/md";
import Sidebar from "../components/sidebar";
import Content from "../components/content";
import { Global } from "@emotion/react";
import SidebarBBS from "../components/sidebarBBS";

import { useLanguage } from "../context/LanguageContext";
import getMessage from "../components/getMessage";
// import { AppContext } from "./_app";

interface RoadmapItem {
  year?: string;
  month?: string;
  titleColor?: string;
  main?: string;
  mainDetail?: string[];
  items?: { text: string; completed: boolean }[];
  result?: string;
  possibility?: number;
  duration?: number;
  category?: string[];
  idea?: string[];
}

function getBadgeForCategory(category: string): JSX.Element {
  let colorScheme: string;
  switch (category) {
    case "生産準備+":
      colorScheme = "green";
      break;
    case "順立生産システム":
      colorScheme = "purple";
      break;
    case "部材一覧+":
      colorScheme = "yellow";
      break;
    default:
      colorScheme = "red";
  }

  return (
    <Badge
      variant="outline"
      colorScheme={colorScheme}
      mr={2}
      p={0.5}
      px={1}
      mb={1}
    >
      {category}
    </Badge>
  );
}

const Roadmap = () => {
  const roadmapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { colorMode, toggleColorMode } = useColorMode();

  const [years, setYears] = useState<number[]>([]);
  let previousYear: string | undefined;

  // 現在の年月にスクロール
  const moveThisMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 月は0から始まるので+1
    const targetTitle = `${currentYear}-${currentMonth}`;
    const targetElement = roadmapRefs.current.find((ref) =>
      ref?.textContent?.includes(targetTitle)
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "auto", block: "center" });
    }
  };

  useEffect(() => {
    moveThisMonth;
  }, []);

  const { language, setLanguage } = useLanguage();

  return (
    <>
      <Global
        styles={{
          "@media print": {
            ".print-only": {
              display: "block !important",
            },
          },
          ".print-only": {
            display: "none",
          },
        }}
      />
      <Sidebar />
      <Content isCustomHeader={true}>
        <Button
          onClick={() => moveThisMonth()}
          position="fixed"
          right="0"
          // top="64px"
          bottom="0px"
          p={2}
          m={2}
          bg="transparent"
          border="solid 1px"
          zIndex={99999}
          fontSize={13}
          h={8}
        >
          {getMessage({
            ja: "今月に移動",
            us: "Moved to this month",
            cn: "移至本月",
            language,
          })}
        </Button>
        <Text ml={4} className="print-only">
          {getMessage({
            ja: "※別紙1",
            us: "*Attachment 1",
            cn: "*附录1.",
            language,
          })}
        </Text>
        <Container
          maxW="container.lg"
          py={8}
          fontFamily={getMessage({
            ja: "Noto Sans JP",
            us: "Noto Sans JP",
            cn: "Noto Sans SC",
            language,
          })}
          fontWeight={200}
        >
          <Heading as="h3" fontSize="24px" mb={8} textAlign="center">
            <HStack spacing={2} alignItems="center" justifyContent="center">
              <Text>
                {getMessage({
                  ja: "問い合わせ",
                  us: "Inquiry",
                  cn: "询问",
                  language,
                })}
              </Text>
              <MdEditRoad size={30} />
            </HStack>
          </Heading>
          <Badge variant="solid" colorScheme="green" ml={2}>
            {getMessage({
              ja: "使用者",
              us: "user",
              cn: "使用者",
              language,
            })}
          </Badge>
          <Badge variant="solid" colorScheme="purple" ml={2}>
            {getMessage({
              ja: "管理者",
              us: "administrator",
              cn: "管理者",
              language,
            })}
          </Badge>
          <Badge variant="solid" colorScheme="red" ml={2}>
            {getMessage({
              ja: "開発者",
              us: "developer",
              cn: "开发人员",
              language,
            })}
          </Badge>
          <Box mb={8} p={4} borderRadius="md">
            <Text textAlign="left" colorScheme="gray">
              {getMessage({
                ja: "・以下は契約書に基づいた活動予定内容です。",
                us: "・The following is a list of planned activities based on the contract.",
                cn: "・以下是根据合同计划开展的活动清单。",
                language,
              })}
              <br />
              {getMessage({
                ja: "・実行順は必要だと思う順になっています。順番を変更したい場合はご相談ください。",
                us: "・The order of execution is in the order we think necessary. If you wish to change the order, please contact us.",
                cn: "・执行的顺序是他们认为必要的顺序。如果您想更改订单，请联系我们。",
                language,
              })}
            </Text>
          </Box>
          <SidebarBBS isMain={true} />
        </Container>
      </Content>
    </>
  );
};

export default Roadmap;
