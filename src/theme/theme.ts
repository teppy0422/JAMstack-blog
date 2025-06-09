import { extendTheme } from "@chakra-ui/react";

// NB: Chakra gives you access to `colorMode` and `theme` in `props`
export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
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
        bg: props.colorMode === "light" ? "#f0e4da" : "#202024",
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
          50: "#fdfcf9", // とても薄い（さらに明るい）
          100: "#fdf8f4", // かなり薄い
          200: "#fbf1ea",
          300: "#f8e9df",
          400: "#f4e2d5",
          500: "#f0e4da", // 基準
          600: "#d8cabf",
          700: "#bfb0a4",
          800: "#a69689",
          850: "#6a4f3e", // 900より少し明るい濃いブラウン
          900: "#3e2c22", // さらに暗くした濃いブラウン
        },
        dark: {
          50: "#6464cf",
          100: "#d9d9dc", // 明るいグレー（寒色寄り）
          200: "#bfbfc2",
          300: "#a5a5a8",
          400: "#4b4b4f", // やや淡いが深みのある色
          500: "#202024", // 基準：スモーキーなダークグレー
          600: "#1b1b1f", // 500より少し暗い
          700: "#161618", // さらにダークに
          800: "#121214", // 基準：非常に濃いグレー
          850: "#0e0e0f",
          900: "#0a0a0b", // ほぼ黒
        },
        red: {
          50: "#FFF5F5",
          100: "#FED7D7",
          200: "#FEB2B2",
          300: "#FC8181",
          400: "#F56565",
          500: "#E53E3E", // 基準色
          600: "#C53030",
          700: "#9B2C2C",
          800: "#822727",
          900: "#63171B",
        },
      },
      hippo: "#73c7c7",
      excel: "#1f9b60",
      access: "#bd4a55",
      dotnet: "#854c8f",
      front: "#F1652A",
      php: "#4E5B92",
      arduino: "#0f8592",
      davinci: "#888888",
      inkscape: "#333333",
      windows: "#0078D7",
      mac: "#BFC1C2",
      linux: "#F47E00",
      omron: "#005cb3",
    },
  },
});
export default theme;
