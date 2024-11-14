import { extendTheme } from "@chakra-ui/react";

// NB: Chakra gives you access to `colorMode` and `theme` in `props`
export const theme = extendTheme({
  fonts: {
    heading: "'Noto Sans JP', sans-serif",
    body: "'Noto Sans JP', sans-serif", // bodyのフォントを設定
  },
  fontWeights: {
    normal: 200,
    medium: 300,
    bold: 400,
    light: 300, // 追加: フォントの太さを指定
    extraLight: 100, // 追加: より細いフォントの太さを指定
  },
  styles: {
    global: (props) => ({
      "html, body": {
        // color: props.colorMode === "dark" ? "white" : "gray.600",
        // lineHeight: "tall",
        fontFamily: "M PLUS Rounded 1c",
        fontWeight: "200",
        padding: 0,
        margin: 0,
      },
      a: {
        // color: props.colorMode === "dark" ? "white" : "gray.600",
        textDecoration: "none",
      },
    }),
  },
  breakpoints: {
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
    "3xl": "112em", // カスタムブレークポイント
  },
  colors: {
    brand: {
      100: "#ff00ff",
      900: "#1a202c",
    },
    excel: "#1f9b60",
    dotNet: "#9A4F96",
    front: "#F1652A",
    php: "#4E5B92",
    arduino: "#12999F",
    davinci: "#888888",
    inkscape: "#333333",
  },
});

export default theme;
