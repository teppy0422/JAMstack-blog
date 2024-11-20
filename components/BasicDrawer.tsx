import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

interface BasicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  header?: string;
  children?: React.ReactNode;
  size?: string;
}

const BasicDrawer: React.FC<BasicDrawerProps> = ({
  isOpen,
  onClose,
  header,
  children,
  size = "xs",
}) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={size}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton _focus={{ _focus: "none" }} />
        <DrawerHeader>{header}</DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default BasicDrawer;
