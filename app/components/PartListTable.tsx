"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorMode,
} from "@chakra-ui/react";

interface Part {
  id: number;
  maker: string;
  name: string;
  unitPrice: number;
  model: string;
  url: string;
  power: number | null;
  memo: string;
}

interface PartListData {
  title: string;
  note: string;
  parts: Part[];
}

interface PartListTableProps {
  jsonPath?: string;
}

export default function PartListTable({
  jsonPath = "/partlist/list.json",
}: PartListTableProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [data, setData] = useState<PartListData | null>(null);

  useEffect(() => {
    fetch(jsonPath)
      .then((res) => res.json())
      .then((json: PartListData) => setData(json));
  }, [jsonPath]);

  if (!data) return null;

  const bgHeader = isDark ? "gray.600" : "gray.100";

  return (
    <Box overflowX="auto">
      <Text fontSize="xs" color="gray.500" mb={2}>
        {data.note}
      </Text>
      <Table size="sm" variant="simple">
        <Thead>
          <Tr bg={bgHeader}>
            <Th>ID</Th>
            <Th>メーカー</Th>
            <Th>品名</Th>
            <Th>型番</Th>
            <Th isNumeric>単価</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.parts.map((p) => (
            <Tr key={p.id}>
              <Td fontSize="xs">{p.id}</Td>
              <Td fontSize="xs">{p.maker}</Td>
              <Td fontSize="xs">
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}
                {p.memo && (
                  <Text as="span" color="gray.500" ml={1}>
                    ({p.memo})
                  </Text>
                )}
              </Td>
              <Td fontSize="xs">{p.model}</Td>
              <Td isNumeric fontSize="xs">
                ¥{p.unitPrice.toLocaleString()}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
