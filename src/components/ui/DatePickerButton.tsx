"use client";
import React from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
} from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

export default function DatePickerButton({ value, onChange }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box position="relative" display="inline-block" w="full">
      <InputGroup>
        <Input
          placeholder="日付を選択"
          value={value instanceof Date ? value.toLocaleDateString() : ""}
          readOnly
          onClick={onOpen}
        />
        <InputRightElement>
          <Button variant="ghost" onClick={onOpen} h="full">
            <CalendarIcon />
          </Button>
        </InputRightElement>
      </InputGroup>

      {isOpen && (
        <Box position="absolute" zIndex={10} mt={2}>
          <DatePicker
            selected={value ?? undefined}
            onChange={(date) => {
              onChange(date);
              onClose();
            }}
            inline
            dateFormat="yyyy/MM/dd"
          />
        </Box>
      )}
    </Box>
  );
}
