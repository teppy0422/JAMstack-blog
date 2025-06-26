// components/test/FixedNodeInputList.tsx
"use client";
import { HStack, Input, Box, Text } from "@chakra-ui/react";

type FixedNode = {
  terminal: string;
  x: number;
  y: number;
};

export default function FixedNodeInputList({
  fixedNodes,
  setFixedNodes,
}: {
  fixedNodes: FixedNode[];
  setFixedNodes: (nodes: FixedNode[]) => void;
}) {
  const handleChange = (
    index: number,
    field: keyof FixedNode,
    value: string
  ) => {
    const updated = [...fixedNodes];
    updated[index] = {
      ...updated[index],
      [field]: field === "terminal" ? value : Number(value),
    };
    setFixedNodes(updated);

    const last = updated[updated.length - 1];
    if (
      index === fixedNodes.length - 1 &&
      last.terminal !== "" &&
      !isNaN(last.x) &&
      !isNaN(last.y)
    ) {
      updated.push({ terminal: "", x: 0, y: 0 });
      setFixedNodes(updated);
    }
  };

  return (
    <Box mt={6}>
      <Text mb={2} fontWeight="bold">
        📌 固定端末位置を入力
      </Text>
      {fixedNodes.map((node, index) => (
        <HStack key={index} mb={2}>
          <Input
            placeholder="端末識別子"
            value={node.terminal}
            onChange={(e) => handleChange(index, "terminal", e.target.value)}
            w="40%"
          />
          <Input
            placeholder="x（0〜100）"
            type="number"
            value={node.x}
            onChange={(e) => handleChange(index, "x", e.target.value)}
          />
          <Input
            placeholder="y（0〜100）"
            type="number"
            value={node.y}
            onChange={(e) => handleChange(index, "y", e.target.value)}
          />
        </HStack>
      ))}
    </Box>
  );
}
