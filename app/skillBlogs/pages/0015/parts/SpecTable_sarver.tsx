import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
} from "@chakra-ui/react";

const pcData = [
  {
    os: "DSM 7.x",
    name: "Synology",
    series: "4ベイ",
    type: "423+",
    cpu: "Intel Celeron J4125",
    memory: "2GB(最大6GB)",
    speaker: "12.3-28.3W",
    screen: "USB3.2 Gen1 ×2",
    cost: "84,700",
    other: "",
    link: "https://www.amazon.co.jp/KUU-Windows11-Pro%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88PC-14-0%E3%82%A4%E3%83%B3%E3%83%81-%E3%83%8E%E3%83%BC%E3%83%88%E3%83%91%E3%82%BD%E3%82%B3%E3%83%B31920x1200%E8%A7%A3%E5%83%8F%E5%BA%A6/dp/B0CW9Q3LPJ/ref=sr_1_2?dib=eyJ2IjoiMSJ9._7QLPopp6hM-racTgJtUbuHUPWr7CbwEyfL49q5dQG9jtvPVmi_1s6fo1k_IzMHMfz4r8m5q1JPZCCLOKyUPyU7ITPhBSZmxwWoC8F9P9fksczwGGG1kTxP1kuQ7Mjk1s3Z3Gqc6pJeS4hxVSN0wXR8beGymzw7rRm4UxpUJq0Q.jk1zsuNxoytLpolLwFUbEFfcJUiMLOVRwNhqZRHVwFY&dib_tag=se&qid=1753257466&refinements=p_89%3AKUU&sr=8-2&srs=2765617051",
  },
];

export default function SpecTable_sarver() {
  return (
    <Box p={0}>
      <TableContainer>
        <Table
          variant="simple"
          size="md"
          sx={{
            th: { px: 2, py: 1 }, // 全ての <Th> に適用
            td: { px: 2, py: 1 }, // 全ての <Td> に適用
            tr: { my: 0 }, // 全ての <Tr> に適用（例：marginなど）
            fontSize: "14px",
          }}
        >
          <Thead bg="gray.100" p={0}>
            <Tr>
              <Th>OS</Th>
              <Th>メーカー</Th>
              <Th>シリーズ</Th>
              <Th>タイプ</Th>
              <Th>CPU</Th>
              <Th>メモリ</Th>
              <Th>スピーカー</Th>
              <Th>画面サイズ</Th>
              <Th>金額</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pcData.map((pc, index) => (
              <Tr
                onClick={() =>
                  window.open(pc.link, "_blank", "noopener,noreferrer")
                }
                _hover={{ opacity: "0.7", cursor: "pointer" }}
              >
                <Td>{pc.os}</Td>
                <Td fontWeight="bold">{pc.name}</Td>
                <Td>{pc.series}</Td>
                <Td>{pc.type}</Td>
                <Td>{pc.cpu}</Td>
                <Td>{pc.memory}</Td>
                <Td>{pc.speaker}</Td>
                <Td>{pc.screen}</Td>
                <Td>{pc.cost}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
