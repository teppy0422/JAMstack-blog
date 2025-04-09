import { Box, Modal, ModalCloseButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface CustomModalCloseButtonProps {
  colorMode: "light" | "dark";
  top?: string;
  right?: string;
  fontSize?: string;
  boxSize?: string;
  outline?: string;
  outlineColor?: string;
  onClose?: () => void;
  onClick?: () => void;
}
export const CustomModalCloseButton: React.FC<CustomModalCloseButtonProps> = ({
  colorMode,
  top = "0px",
  right = "0px",
  fontSize = "8px",
  boxSize = "24px",
  outline = "",
  outlineColor = "",
  onClose,
  onClick,
}) => {
  const handleClick = () => {
    if (onClose) onClose();
    if (onClick) onClick();
  };
  return (
    <ModalCloseButton
      position="absolute"
      h={boxSize}
      w={boxSize}
      top={top}
      right={right}
      onClick={handleClick}
      _focus={{ boxShadow: "none" }}
      color={
        colorMode === "light"
          ? "custom.theme.light.900"
          : "custom.theme.dark.100"
      }
      bg={
        colorMode === "light"
          ? "custom.theme.light.400"
          : "custom.theme.dark.500"
      }
      border="1px solid"
      borderColor={
        colorMode === "light"
          ? "custom.theme.light.900"
          : "custom.theme.dark.200"
      }
      outline={outline}
      outlineColor={outlineColor}
      _hover={{
        bg:
          colorMode === "light"
            ? "custom.theme.light.100"
            : "custom.theme.dark.400",
        transition: "all 0.2s ease-in-out",
      }}
      borderRadius="50%"
    >
      <CloseIcon fontSize={fontSize} />
    </ModalCloseButton>
  );
};
