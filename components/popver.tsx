import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
} from "@chakra-ui/react";

const CustomPopover = ({ isOpen, onOpen, onClose }) => (
  <Popover isOpen={isOpen} onClose={onClose}>
    <PopoverTrigger>
      <Button onClick={onOpen} _focus={{ _focus: "none" }}>
        Trigger
      </Button>
    </PopoverTrigger>
    <PopoverContent _focus={{ _focus: "none" }}>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Download</PopoverHeader>
      <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
    </PopoverContent>
  </Popover>
);

export default CustomPopover;
