import { BoxProps } from "@chakra-ui/react";

export const hoverUnderlineStyle: BoxProps = {
  position: "relative",
  _hover: {
    "& span::after": {
      width: "100%",
      transition: "width 0.5s",
    },
  },
  _after: {
    content: '""',
    position: "absolute",
    width: "0",
    height: "1px",
    bottom: "-2px",
    left: "0",
    bg: "currentColor",
    transition: "width 0.1s",
  },
};

export const buttonStyle = (
  path: string,
  currentPath: string,
  colorMode: string
): BoxProps => ({
  p: "2",
  w: "full",
  _hover: { bg: "gray.900" },
  cursor: "pointer",
  color: colorMode === "light" ? "white" : "white",
});
