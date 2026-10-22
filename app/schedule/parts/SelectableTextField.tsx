"use client";

import { useState } from "react";
import { Box, FormLabel, Input, Select } from "@chakra-ui/react";

const CUSTOM_OPTION_VALUE = "__custom__";

export default function SelectableTextField({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const isKnownValue = value === "" || options.includes(value);
  const [customMode, setCustomMode] = useState(!isKnownValue);
  const selectValue = customMode ? CUSTOM_OPTION_VALUE : value;

  return (
    <Box flex={1}>
      <FormLabel fontSize="11px" mb={0.5}>
        {label}
      </FormLabel>
      <Select
        size="sm"
        value={selectValue}
        onChange={(e) => {
          if (e.target.value === CUSTOM_OPTION_VALUE) {
            setCustomMode(true);
            onChange("");
          } else {
            setCustomMode(false);
            onChange(e.target.value);
          }
        }}
      >
        <option value="">未設定</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        <option value={CUSTOM_OPTION_VALUE}>＋新規を追加</option>
      </Select>
      {customMode && (
        <Input
          mt={2}
          size="sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Box>
  );
}

export function uniqueSortedOptions(values: (string | null)[]): string[] {
  return Array.from(
    new Set(values.map((v) => v?.trim()).filter((v): v is string => !!v))
  ).sort();
}
