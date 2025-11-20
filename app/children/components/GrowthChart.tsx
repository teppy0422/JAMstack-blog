import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorMode,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import { growthRecords, children } from "../data/childrenData";

type Props = {
  childIds: string[];
};

export default function GrowthChart({ childIds }: Props) {
  const { colorMode } = useColorMode();
  const showMultipleChildren = childIds.length > 1;

  const getChildName = (childId: string) => {
    return children.find((c) => c.id === childId)?.name || "";
  };

  const records = growthRecords
    .filter((record) => childIds.includes(record.childId))
    .filter((record) => record.heightCm || record.weightKg)
    .sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());

  if (records.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">成長データがありません</Text>
      </Box>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 成長の増加量を計算
  const latestRecord = records[records.length - 1];
  const firstRecord = records[0];
  const heightGrowth = latestRecord.heightCm && firstRecord.heightCm
    ? latestRecord.heightCm - firstRecord.heightCm
    : 0;
  const weightGrowth = latestRecord.weightKg && firstRecord.weightKg
    ? latestRecord.weightKg - firstRecord.weightKg
    : 0;

  return (
    <VStack spacing={6} align="stretch">
      {/* サマリー統計 */}
      <HStack spacing={4} justifyContent="center" flexWrap="wrap">
        <Stat
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg={colorMode === "light" ? "white" : "gray.800"}
          minW="200px"
        >
          <StatLabel>現在の身長</StatLabel>
          <StatNumber>{latestRecord.heightCm} cm</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {heightGrowth.toFixed(1)} cm成長
          </StatHelpText>
        </Stat>

        <Stat
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg={colorMode === "light" ? "white" : "gray.800"}
          minW="200px"
        >
          <StatLabel>現在の体重</StatLabel>
          <StatNumber>{latestRecord.weightKg} kg</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            {weightGrowth.toFixed(1)} kg増加
          </StatHelpText>
        </Stat>
      </HStack>

      {/* データテーブル */}
      <TableContainer>
        <Table
          variant="simple"
          size="md"
          bg={colorMode === "light" ? "white" : "gray.800"}
          borderRadius="lg"
        >
          <Thead>
            <Tr>
              <Th>日付</Th>
              {showMultipleChildren && <Th>名前</Th>}
              <Th isNumeric>身長 (cm)</Th>
              <Th isNumeric>体重 (kg)</Th>
              <Th isNumeric>身長差</Th>
              <Th isNumeric>体重差</Th>
            </Tr>
          </Thead>
          <Tbody>
            {records.map((record, index) => {
              // 同じ子供の前の記録を探す
              const prevRecord = records
                .slice(0, index)
                .reverse()
                .find((r) => r.childId === record.childId);
              const heightDiff = prevRecord && record.heightCm && prevRecord.heightCm
                ? record.heightCm - prevRecord.heightCm
                : null;
              const weightDiff = prevRecord && record.weightKg && prevRecord.weightKg
                ? record.weightKg - prevRecord.weightKg
                : null;

              return (
                <Tr key={record.id}>
                  <Td>{formatDate(record.recordDate)}</Td>
                  {showMultipleChildren && <Td>{getChildName(record.childId)}</Td>}
                  <Td isNumeric fontWeight="bold">
                    {record.heightCm || "-"}
                  </Td>
                  <Td isNumeric fontWeight="bold">
                    {record.weightKg || "-"}
                  </Td>
                  <Td isNumeric color="green.500">
                    {heightDiff ? `+${heightDiff.toFixed(1)}` : "-"}
                  </Td>
                  <Td isNumeric color="green.500">
                    {weightDiff ? `+${weightDiff.toFixed(1)}` : "-"}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}
