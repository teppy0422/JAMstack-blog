import { Box, useColorMode } from "@chakra-ui/react";
import { MacFinderIcon } from "@/components/ui/icons";

type ModalButtonProps = {
  label: string;
  onClick: () => void;
  fontSize?: string;
  iconSize?: string;
};
export const ModalButton = ({
  label,
  fontSize = "13px",
  iconSize = "20px",
  onClick,
}: ModalButtonProps) => {
  const { colorMode } = useColorMode();

  return (
    <>
      <Box
        as="span"
        onClick={onClick}
        display="inline-flex"
        alignItems="center"
        cursor="pointer"
        textDecoration="none"
        color={colorMode === "light" ? "#ddd" : "#000"}
        px={1}
        mx={0.5}
        borderRadius="sm"
        bg={
          colorMode === "light" ? "custom.system.300" : "custom.brand.dark.500"
        }
        fontSize="13px"
        _hover={{ opacity: "0.9" }}
      >
        {label}
        <Box ml={0.5}>
          <MacFinderIcon size="20px" />
        </Box>
      </Box>
    </>
  );
};

export default ModalButton;
