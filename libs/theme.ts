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
    // これを編集したら npm run dev --forceして反映
    custom: {
      theme: {
        light: {
          100: "#fdf8f4", // かなり薄い
          200: "#fbf1ea",
          300: "#f8e9df",
          400: "#f4e2d5",
          500: "#f0e4da", // 基準
          600: "#d8cabf",
          700: "#bfb0a4",
          800: "#a69689",
          900: "#8d7c6f", // かなり濃い
        },
        dark: "#",
      },
      hippo: "#73c7c7",
      excel: "#1f9b60",
      access: "#bd4a55",
      dotnet: "#854c8f",
      front: "#F1652A",
      php: "#4E5B92",
      arduino: "#12999F",
      davinci: "#888888",
      inkscape: "#333333",
    },
  },
});
export default theme;
