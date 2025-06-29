"use client";
import { Box, List, ListItem, useColorMode, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

type MarkerType = "number" | "dot" | "none";

export default function BorderedListBox({
  items,
  marker = "dot",
  fontSize = "14px",
}: {
  items: string[];
  marker?: MarkerType;
  fontSize?: string;
}) {
  const { colorMode } = useColorMode();
  return (
    <>
      <Box>
        <Box position="relative" display="inline-block" my={3}>
          <Box
            border="1px solid"
            borderColor={
              colorMode === "light"
                ? "custom.theme.light.850"
                : "custom.theme.dark.200"
            }
            borderRadius="md"
            p={2}
            shadow="sm"
            fontSize={fontSize}
          >
            <List
              spacing={1}
              styleType={getStyleType(marker)}
              pl={marker === "none" ? 0 : 4}
            >
              {items.map((item, index) => (
                <ListItem key={index}>
                  {marker === "number" ? `${index + 1}. ` : ""}
                  {item}
                </ListItem>
              ))}
            </List>
          </Box>
          <Text
            position="absolute"
            bg={
              colorMode === "light"
                ? "custom.theme.light.500"
                : "custom.theme.dark.700"
            }
            fontSize="13px"
            top="-9px"
            left="50%"
            px={1}
            textAlign="center"
            transform="translateX(-50%)"
          >
            場所の条件
          </Text>
        </Box>
      </Box>
    </>
  );
}

function getStyleType(marker: "number" | "dot" | "none"): string {
  switch (marker) {
    case "number":
    case "none":
      return "none"; // 数字となしは自前で処理
    case "dot":
    default:
      return "disc";
  }
}
