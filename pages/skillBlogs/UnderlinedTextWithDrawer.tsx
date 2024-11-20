import React from "react";
import { HStack, Box } from "@chakra-ui/react";
import { LuPanelRightOpen } from "react-icons/lu";
import { useColorMode } from "@chakra-ui/react";
import BasicDrawer from "../../components/BasicDrawer";

interface UnderlinedTextWithDrawerProps {
  text: string;
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  header: string;
  children: React.ReactNode;
}

const UnderlinedTextWithDrawer: React.FC<UnderlinedTextWithDrawerProps> = ({
  text,
  onOpen,
  isOpen,
  onClose,
  header,
  children,
}) => {
  const { colorMode } = useColorMode();
  const color = colorMode === "light" ? "blue.500" : "blue.200";
  return (
    <>
      <HStack
        as="span"
        style={{ whiteSpace: "nowrap" }}
        color={color}
        cursor="pointer"
        onClick={onOpen}
        spacing={1}
        borderBottom="2px solid"
        borderColor={color}
        display="inline"
      >
        <Box as="span" display="inline">
          {text}
        </Box>
        <LuPanelRightOpen
          size="20px"
          style={{ marginBottom: "-3px", display: "inline" }}
        />
      </HStack>
      <BasicDrawer isOpen={isOpen} onClose={onClose} header={header}>
        {children}
      </BasicDrawer>
    </>
  );
};

export default UnderlinedTextWithDrawer;
