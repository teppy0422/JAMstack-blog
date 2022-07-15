import { extendTheme } from "@chakra-ui/react";

// NB: Chakra gives you access to `colorMode` and `theme` in `props`
export const theme = extendTheme({
  styles: {
    global: (props) => ({
      "html, body": {
        // color: props.colorMode === "dark" ? "white" : "gray.600",
        // lineHeight: "tall",
        padding: 0,
        margin: 0,
      },
      a: {
        // color: props.colorMode === "dark" ? "white" : "gray.600",
        textDecoration: "none",
      },
    }),
  },
  colors: {
    brand: {
      100: "#ff00ff",
      // ...
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
