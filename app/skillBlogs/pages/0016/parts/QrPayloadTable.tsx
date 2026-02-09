import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  Button,
  Text,
} from "@chakra-ui/react";
import DownloadLink from "app/skillBlogs/components/DownloadLink";
const pcData = [
  {
    checked: "済",
    isShared: "⚫︎",
    place: "エフ(M3)",
    sample: "N712/ 5M3920002178070018682143V1010A011N712/94.54.5325184039",
    delimiter: "文字数",
    column: "構成No(11-14) 製品品番(25-34) ",
    matchConditions: "各項目",
  },
  {
    checked: "済",
    isShared: "",
    place: "シールド図面",
    sample: "S-88888V1234-C01-CQ7007-100",
    delimiter: "-",
    column: "シールド図面-製品品番-設変-YBM-数量",
    matchConditions: "各項目",
  },
  {
    checked: "",
    isShared: "⚫︎",
    place: "マイクロメーター",
    sample: "12345",
    delimiter: "なし",
    column: "管理No",
    matchConditions: "なし",
  },
  {
    checked: "",
    isShared: "⚫︎",
    place: "appicator_serial",
    sample: "71144545  12345",
    delimiter: "文字数",
    column: "10文字(アプリ品番) 以降(管理No)",
    matchConditions: "先頭8文字",
  },
  {
    checked: "",
    isShared: "⚫︎",
    place: "端子リール",
    sample: "7114454508QQ8808",
    delimiter: "文字数",
    column: "10文字(端子品番) 以降(シリアルNo)",
    matchConditions: "先頭10文字",
  },
  {
    checked: "済",
    isShared: "",
    place: "ログインカード",
    sample: "1234",
    delimiter: "なし",
    column: "ユーザーID",
    matchConditions: "4文字",
  },
];

export default function QR_Payload() {
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
              <Th textAlign="center">確認</Th>
              <Th textAlign="center">既存と共用</Th>
              <Th>使用場所</Th>
              <Th>サンプル</Th>
              <Th>デミリタ</Th>
              <Th>カラム名</Th>
              <Th>マッチ条件</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pcData.map((pc, index) => (
              <Tr>
                <Td textAlign="center">{pc.checked}</Td>
                <Td textAlign="center">{pc.isShared}</Td>
                <Td textAlign="left">{pc.place}</Td>
                <Td>{pc.sample}</Td>
                <Td fontWeight="bold">{pc.delimiter}</Td>
                <Td>{pc.column}</Td>
                <Td>{pc.matchConditions}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Button
        as="a"
        href="https://www.a-groove.com/qr-html?msclkid=3f8dd086368f153594aeb9a9a1b23da6"
        target="_blank"
        rel="noopener noreferrer"
        variant="link"
        colorScheme="blue"
        size="sm"
      >
        QR作成WEBサイト
      </Button>
      <Text fontSize="sm">
        svgをダウンロード(印刷用):
        <DownloadLink href="/images/0015/qr_print.svg" text="qr_print.svg " />
      </Text>
    </Box>
  );
}
