"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  Text,
  Heading,
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

interface ProjectData {
  projectName: string;
  parts: { id: number; quantity: number }[];
}

interface PartListCalculatorProps {
  jsonPath?: string;
  projectPath?: string;
}

export default function PartListCalculator({
  jsonPath = "/partlist/list.json",
  projectPath,
}: PartListCalculatorProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [data, setData] = useState<PartListData | null>(null);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    const loadData = async () => {
      const masterRes = await fetch(jsonPath);
      const master: PartListData = await masterRes.json();
      setData(master);

      if (projectPath) {
        const projRes = await fetch(projectPath);
        const proj: ProjectData = await projRes.json();
        setProject(proj);

        const q: Record<number, number> = {};
        proj.parts.forEach((p) => (q[p.id] = p.quantity));
        setQuantities(q);
      } else {
        const q: Record<number, number> = {};
        master.parts.forEach((p) => (q[p.id] = 1));
        setQuantities(q);
      }
    };
    loadData();
  }, [jsonPath, projectPath]);

  const setQuantity = (id: number, val: number) => {
    setQuantities((prev) => ({ ...prev, [id]: val }));
  };

  // プロジェクト指定時はプロジェクトに含まれる部品のみ表示
  const displayParts = useMemo(() => {
    if (!data) return [];
    if (project) {
      const projIds = new Set(project.parts.map((p) => p.id));
      return data.parts.filter((p) => projIds.has(p.id));
    }
    return data.parts;
  }, [data, project]);

  const grandTotal = useMemo(() => {
    return displayParts.reduce(
      (sum, p) => sum + p.unitPrice * (quantities[p.id] || 0),
      0,
    );
  }, [displayParts, quantities]);

  if (!data) return <Text>読み込み中...</Text>;

  const bgCard = isDark ? "gray.700" : "white";
  const bgHeader = isDark ? "gray.600" : "gray.50";
  const borderColor = isDark ? "gray.600" : "gray.200";
  const totalBg = isDark ? "blue.800" : "blue.50";

  return (
    <Box>
      {/* <Heading size="md" mb={2}>
        {project ? project.projectName : data.title}
      </Heading> */}
      <Text fontSize="sm" color="gray.500" mb={4}>
        {data.note}
      </Text>

      <Box
        overflowX="auto"
        bg={bgCard}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Table size="sm">
          <Thead>
            <Tr bg={bgHeader}>
              <Th>ID</Th>
              <Th>メーカー</Th>
              <Th>品名</Th>
              <Th>型番</Th>
              <Th isNumeric>単価</Th>
              <Th isNumeric>数量</Th>
              <Th isNumeric>小計</Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayParts.map((p) => {
              const qty = quantities[p.id] || 0;
              const subtotal = p.unitPrice * qty;
              return (
                <Tr key={p.id}>
                  <Td>{p.id}</Td>
                  <Td>{p.maker}</Td>
                  <Td>
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
                      <Text as="span" fontSize="xs" color="gray.500" ml={1}>
                        ({p.memo})
                      </Text>
                    )}
                  </Td>
                  <Td fontSize="xs">{p.model}</Td>
                  <Td isNumeric>¥{p.unitPrice.toLocaleString()}</Td>
                  <Td isNumeric>
                    <NumberInput
                      size="xs"
                      w="60px"
                      min={0}
                      max={999}
                      value={qty}
                      onChange={(_, val) =>
                        setQuantity(p.id, isNaN(val) ? 0 : val)
                      }
                    >
                      <NumberInputField px={2} />
                    </NumberInput>
                  </Td>
                  <Td isNumeric fontWeight="bold">
                    {subtotal.toLocaleString()}
                  </Td>
                </Tr>
              );
            })}
            <Tr bg={totalBg}>
              <Td colSpan={6} textAlign="right" fontWeight="bold" fontSize="md">
                合計
              </Td>
              <Td isNumeric fontWeight="bold" fontSize="md">
                {grandTotal.toLocaleString()}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
