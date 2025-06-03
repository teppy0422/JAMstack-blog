import { BoxProps, useColorMode } from "@chakra-ui/react";

export const getColor = (
  text: string
): Pick<BoxProps, "bg" | "color" | "borderColor"> => {
  const { colorMode } = useColorMode();
  switch (text) {
    case "不具合":
      return colorMode === "light"
        ? { bg: "red.500", color: "white" }
        : { bg: "pink.500", color: "white" };
    case "新機能":
      return colorMode === "light"
        ? { bg: "green.500", color: "white" }
        : { bg: "green.500", color: "white" };
    case "徳島":
    case "高知":
      return colorMode === "light"
        ? {
            bg: "transparent",
            color: "green.600",
            borderColor: "green.600",
          }
        : { bg: "transparent", color: "green.300", borderColor: "green.300" };
    case "訪問対応":
      return colorMode === "light"
        ? { bg: "transparent", color: "gray.500", borderColor: "gray.500" }
        : { bg: "transparent", color: "gray.300", borderColor: "gray.300" };
    default:
      return colorMode === "light"
        ? { bg: "gray.500", color: "white" }
        : { bg: "gray.600", color: "white" };
  }
};
