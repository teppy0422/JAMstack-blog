import React from "react";
import { HStack, Box } from "@chakra-ui/react";
import { LuPanelRightOpen } from "react-icons/lu";
import { useColorMode } from "@chakra-ui/react";
import BasicDrawer from "@/components/ui/BasicDrawer";

interface UnderlinedTextWithDrawerProps {
  text: React.ReactNode;
  onOpen: () => void;
  isOpen: boolean;
  onClose: () => void;
  header: string;
  children: React.ReactNode;
  size?: string;
}

const UnderlinedTextWithDrawer: React.FC<UnderlinedTextWithDrawerProps> = ({
  text,
  onOpen,
  isOpen,
  onClose,
  header,
  children,
  size = "xs",
}) => {
  const { colorMode } = useColorMode();
  const color = colorMode === "light" ? "blue.500" : "blue.200";
  return (
    <>
      <HStack
        as="span"
        style={{ whiteSpace: "nowrap" }}
        color={color}
        borderColor={color}
        cursor="pointer"
        onClick={onOpen}
        spacing={1}
        display="inline"
      >
        <Box as="span" display="inline">
          {text}
        </Box>
      </HStack>
      <BasicDrawer
        isOpen={isOpen}
        onClose={onClose}
        header={header}
        size={size}
      >
        {children}
      </BasicDrawer>
    </>
  );
};

export default UnderlinedTextWithDrawer;
