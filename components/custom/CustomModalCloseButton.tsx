import { Box, Modal, ModalCloseButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

interface CustomModalCloseButtonProps {
  colorMode: "light" | "dark";
  fontSize?: string;
  boxSize?: string;
  onClose?: () => void;
  onClick?: () => void;
}
export const CustomModalCloseButton: React.FC<CustomModalCloseButtonProps> = ({
  colorMode,
  fontSize = "8px",
  boxSize = "24px",
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
      onClick={handleClick}
      _focus={{ boxShadow: "none" }}
      border="1px solid"
      borderColor={colorMode === "light" ? "custom.theme.light.900" : "white"}
      color={colorMode === "light" ? "custom.theme.light.900" : "white"}
      bg={
        colorMode === "light"
          ? "custom.theme.light.400"
          : "custom.theme.dark.500"
      }
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
