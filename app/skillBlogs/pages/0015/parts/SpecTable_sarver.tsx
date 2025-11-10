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
  Tfoot,
} from "@chakra-ui/react";

const pcData = [
  {
    select: "⚫︎",
    category: "本体",
    os: "DSM 7.x",
    name: "Synology",
    series: "4",
    type: "DS423+",
    cpu: "AMD Ryzen R1600 Dual",
    memory: "8GB(最大32GB)",
    cost: "202,628",
    other: "",
    link: "https://www.amazon.co.jp/Synology-DiskStation-DS923-4%E3%83%99%E3%82%A4NAS%E3%82%A8%E3%83%B3%E3%82%AF%E3%83%AD%E3%83%BC%E3%82%B8%E3%83%A3%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC-HDD%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%AA%E3%81%97/dp/B0CC2327GF?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&ref_=fplfs&psc=1&smid=A1Q5MW17M8OA18&utm_source=chatgpt.com",
  },
  {
    select: "⚫︎",
    category: "HDD",
    os: "",
    name: "Western Digital",
    series: "",
    type: "WD40EFPX",
    etc: "4TB × 4台",
    cpu: "",
    memory: "",
    cost: "84,680",
    other: "",
    link: "https://www.amazon.co.jp/WD40EFPX-Plus%EF%BC%884TB-3-5%E3%82%A4%E3%83%B3%E3%83%81-5400rpm-256MB/dp/B0BDXSK2K7/ref=pd_day0fbt_thbs_d_sccl_1/358-7624311-3967655?pd_rd_w=E7Gla&content-id=amzn1.sym.2aa98752-dde7-48b0-9ad1-5637428d9be1&pf_rd_p=2aa98752-dde7-48b0-9ad1-5637428d9be1&pf_rd_r=Q3J38V2FE8R93SSVGTAP&pd_rd_wg=KChJU&pd_rd_r=db80d4b1-3118-4cda-8361-cae75941375a&pd_rd_i=B0BDXSK2K7&th=1",
  },
];

export default function SpecTable_sarver() {
  const totalCost = pcData
    .filter((pc) => pc.select === "⚫︎")
    .reduce((sum, pc) => {
      const cost = parseInt(pc.cost.replace(/,/g, ""), 10);
      return sum + cost;
    }, 0);
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
              <Th>使用</Th>
              <Th>カテゴリ</Th>
              <Th>メーカー</Th>
              <Th>品名</Th>
              <Th>金額</Th>
              <Th>備考</Th>
              <Th>ベイ数</Th>
              <Th>OS</Th>
              <Th>CPU</Th>
              <Th>メモリ</Th>
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
                <Td textAlign="center">{pc.select}</Td>
                <Td>{pc.category}</Td>
                <Td fontWeight="bold">{pc.name}</Td>
                <Td>{pc.type}</Td>
                <Td>{pc.cost}</Td>
                <Td>{pc.etc}</Td>
                <Td>{pc.series}</Td>
                <Td>{pc.os}</Td>
                <Td>{pc.cpu}</Td>
                <Td>{pc.memory}</Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Td colSpan={4} textAlign="right" fontWeight="bold">
                ⚫︎の合計
              </Td>
              <Td textAlign="right" fontWeight="bold">
                {totalCost.toLocaleString()}
              </Td>
              <Td colSpan={5}></Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
}
