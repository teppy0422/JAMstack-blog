import { BoxProps, useColorMode } from "@chakra-ui/react";

export const getColor = (
  text: string
): Pick<BoxProps, "bg" | "color" | "borderColor"> => {
  const { colorMode } = useColorMode();
  const upperText = text.toUpperCase(); // ← ここで一度大文字に変換

  if (upperText.includes("EXCEL")) {
    return {
      bg: "custom.excel",
      color: "white",
      borderColor: "transparent",
    };
  }
  if (upperText.includes("ACCESS")) {
    return {
      bg: "custom.access",
      color: "white",
      borderColor: "transparent",
    };
  }
  if (upperText.includes("VB.NET")) {
    return {
      bg: "custom.dotnet",
      color: "white",
      borderColor: "transparent",
    };
  }
  if (upperText.includes("ARDUINO")) {
    return {
      bg: "custom.arduino",
      color: "white",
      borderColor: "transparent",
    };
  }
  if (upperText.includes("WINDOWS")) {
    return {
      bg: "custom.windows",
      color: "white",
      borderColor: "transparent",
    };
  }
  if (upperText.includes("MAC")) {
    return {
      bg: "custom.mac",
      color: "white",
      borderColor: "transparent",
    };
  }
  if (upperText.includes("LINUX")) {
    return {
      bg: "custom.linux",
      color: "white",
      borderColor: "transparent",
    };
  }

  switch (upperText) {
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
        ? { bg: "gray.500", color: "white", borderColor: "transparent" }
        : { bg: "gray.600", color: "white", borderColor: "transparent" };
  }
};
