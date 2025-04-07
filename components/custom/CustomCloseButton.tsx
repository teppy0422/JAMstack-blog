import { Box, Modal, ModalCloseButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface CustomCloseButtonProps {
  colorMode: "light" | "dark";
  fontSize?: string;
  boxSize?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  onClose?: () => void;
  onClick?: () => void;
}
export const CustomCloseButton: React.FC<CustomCloseButtonProps> = ({
  colorMode,
  fontSize = "8px",
  boxSize = "24px",
  top,
  right,
  bottom,
  left,
  onClose,
  onClick,
}) => {
  const handleClick = () => {
    if (onClose) onClose();
    if (onClick) onClick();
  };
  return (
    <Box
      position="absolute"
      top={top}
      right={right}
      cursor="pointer"
      h={boxSize}
      w={boxSize}
      onClick={handleClick}
      _focus={{ boxShadow: "none" }}
      border="1px solid"
      borderColor={colorMode === "light" ? "custom.theme.light.900" : "white"}
      outline="2px solid"
      outlineColor={colorMode === "light" ? "custom.theme.light.50" : "#181a24"}
      color={colorMode === "light" ? "custom.theme.light.900" : "white"}
      bg={
        colorMode === "light"
          ? "custom.theme.light.400"
          : "custom.theme.dark.500"
      }
      _hover={{
        bg: colorMode === "light" ? "custom.theme.light.800" : "gray.400",
        color: colorMode === "light" ? "custom.theme.light.500" : "#181a24",
        transition: "all 0.2s ease-in-out",
      }}
      borderRadius="50%"
      display="flex" // フレックスボックスを使用
      alignItems="center" // 縦方向の中央揃え
      justifyContent="center" // 横方向の中央揃え
    >
      <CloseIcon fontSize={fontSize} />
    </Box>
  );
};
