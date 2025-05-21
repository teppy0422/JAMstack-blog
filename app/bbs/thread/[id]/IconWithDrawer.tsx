import React from "react";
import { HStack, Box, Icon } from "@chakra-ui/react";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaQuestion } from "react-icons/fa";
import { useColorMode } from "@chakra-ui/react";
import BasicDrawer from "@/components/ui/BasicDrawer";

interface UnderlinedTextWithDrawerProps {
  text: string;
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
  return (
    <>
      <HStack
        as="span"
        style={{ whiteSpace: "nowrap" }}
        cursor="pointer"
        onClick={onOpen}
        spacing={1}
        display="inline"
      >
        <Icon size="28px" as={FaQuestion} />
      </HStack>
      <BasicDrawer
        isOpen={isOpen}
        onClose={onClose}
        header={header}
        size={size}
        placement="left"
      >
        {children}
      </BasicDrawer>
    </>
  );
};

export default UnderlinedTextWithDrawer;
