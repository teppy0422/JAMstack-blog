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
    name: "KUU",
    series: "",
    type: "2in1",
    os: "win11 Pro",
    cpu: "N100",
    memory: "16GB",
    speaker: "たぶん内蔵",
    screen: "14inch/33cm",
    cost: "59,999",
    other: "",
    link: "https://www.amazon.co.jp/KUU-Windows11-Pro%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88PC-14-0%E3%82%A4%E3%83%B3%E3%83%81-%E3%83%8E%E3%83%BC%E3%83%88%E3%83%91%E3%82%BD%E3%82%B3%E3%83%B31920x1200%E8%A7%A3%E5%83%8F%E5%BA%A6/dp/B0CW9Q3LPJ/ref=sr_1_2?dib=eyJ2IjoiMSJ9._7QLPopp6hM-racTgJtUbuHUPWr7CbwEyfL49q5dQG9jtvPVmi_1s6fo1k_IzMHMfz4r8m5q1JPZCCLOKyUPyU7ITPhBSZmxwWoC8F9P9fksczwGGG1kTxP1kuQ7Mjk1s3Z3Gqc6pJeS4hxVSN0wXR8beGymzw7rRm4UxpUJq0Q.jk1zsuNxoytLpolLwFUbEFfcJUiMLOVRwNhqZRHVwFY&dib_tag=se&qid=1753257466&refinements=p_89%3AKUU&sr=8-2&srs=2765617051",
  },
  {
    name: "CHUWI",
    series: "HI10 X1",
    type: "着脱式",
    os: "win11",
    cpu: "N150",
    memory: "8GB",
    speaker: "",
    screen: "10inch/26cm",
    cost: "33,900",
    other: "USB-A×1,USB-C×2",
    link: "https://www.amazon.co.jp/CHUWI-2in1%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88-X1-2in1%E3%83%8E%E3%83%BC%E3%83%88%E3%83%91%E3%82%BD%E3%82%B3%E3%83%B31280x800%E8%A7%A3%E5%83%8F%E5%BA%A6-500%E4%B8%87%E7%94%BB%E7%B4%A0Web%E3%82%AB%E3%83%A1%E3%83%A9%E5%86%85%E8%94%B5/dp/B0DNDTZ4J9/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=26CGPKTW5XPHH&dib=eyJ2IjoiMSJ9.LF2nZUtsP9uTs0Zu-SeNZCuzcdXKNYzJ0t8iKADkeT_tXVu8jdoIlu-fXWdkWbdBna02m1jfmGhEYY49qhfwFoOc0masb8p26fijw-_FS7XPXtXw0p46CCiBZBmMLq4iRpIvMFFSgVLp1sPMV4kwwQ.yCLoNSORF5__sxCtQRn_Rdv1bHjcKufdTAslqr3YcLo&dib_tag=se&keywords=chuwi&qid=1753257949&refinements=p_123%3A134356&rnid=2127209051&s=computers&sprefix=chuwai+%2Caps%2C175&sr=1-1",
  },
];

export default function PcSpecTable() {
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
              <Th>メーカー</Th>
              <Th>シリーズ</Th>
              <Th>タイプ</Th>
              <Th>OS</Th>
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
                <Td fontWeight="bold">{pc.name}</Td>
                <Td>{pc.series}</Td>
                <Td>{pc.type}</Td>
                <Td>{pc.os}</Td>
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
