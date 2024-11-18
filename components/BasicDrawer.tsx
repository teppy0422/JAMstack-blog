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
}

const BasicDrawer: React.FC<BasicDrawerProps> = ({
  isOpen,
  onClose,
  header,
  children,
}) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
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
