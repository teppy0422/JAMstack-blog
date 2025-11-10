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
} from "@chakra-ui/react";

const pcData = [
  {
    category: "端末",
    select: "",
    os: "win11 Pro",
    name: "KUU",
    series: "",
    type: "2in1",
    cpu: "N100",
    memory: "16GB",
    speaker: "?",
    screen: "14inch/35cm",
    cost: "59,999",
    other: "",
    link: "https://www.amazon.co.jp/KUU-Windows11-Pro%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88PC-14-0%E3%82%A4%E3%83%B3%E3%83%81-%E3%83%8E%E3%83%BC%E3%83%88%E3%83%91%E3%82%BD%E3%82%B3%E3%83%B31920x1200%E8%A7%A3%E5%83%8F%E5%BA%A6/dp/B0CW9Q3LPJ/ref=sr_1_2?dib=eyJ2IjoiMSJ9._7QLPopp6hM-racTgJtUbuHUPWr7CbwEyfL49q5dQG9jtvPVmi_1s6fo1k_IzMHMfz4r8m5q1JPZCCLOKyUPyU7ITPhBSZmxwWoC8F9P9fksczwGGG1kTxP1kuQ7Mjk1s3Z3Gqc6pJeS4hxVSN0wXR8beGymzw7rRm4UxpUJq0Q.jk1zsuNxoytLpolLwFUbEFfcJUiMLOVRwNhqZRHVwFY&dib_tag=se&qid=1753257466&refinements=p_89%3AKUU&sr=8-2&srs=2765617051",
  },
  {
    category: "端末",
    select: "",
    os: "win11",
    name: "CHUWI",
    series: "HI10 X1",
    type: "着脱式",
    cpu: "N150",
    memory: "8GB",
    speaker: "",
    screen: "10inch/26cm",
    cost: "33,900",
    other: "USB-A×1,USB-C×2",
    link: "https://www.amazon.co.jp/CHUWI-2in1%E3%82%BF%E3%83%96%E3%83%AC%E3%83%83%E3%83%88-X1-2in1%E3%83%8E%E3%83%BC%E3%83%88%E3%83%91%E3%82%BD%E3%82%B3%E3%83%B31280x800%E8%A7%A3%E5%83%8F%E5%BA%A6-500%E4%B8%87%E7%94%BB%E7%B4%A0Web%E3%82%AB%E3%83%A1%E3%83%A9%E5%86%85%E8%94%B5/dp/B0DNDTZ4J9/ref=sr_1_1?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=26CGPKTW5XPHH&dib=eyJ2IjoiMSJ9.LF2nZUtsP9uTs0Zu-SeNZCuzcdXKNYzJ0t8iKADkeT_tXVu8jdoIlu-fXWdkWbdBna02m1jfmGhEYY49qhfwFoOc0masb8p26fijw-_FS7XPXtXw0p46CCiBZBmMLq4iRpIvMFFSgVLp1sPMV4kwwQ.yCLoNSORF5__sxCtQRn_Rdv1bHjcKufdTAslqr3YcLo&dib_tag=se&keywords=chuwi&qid=1753257949&refinements=p_123%3A134356&rnid=2127209051&s=computers&sprefix=chuwai+%2Caps%2C175&sr=1-1",
  },
  {
    category: "端末",
    select: "⚫︎",
    os: "Android15",
    name: "TCL",
    series: "NXTPAPER11PLUS",
    type: "タブレット",
    cpu: "MediaTek Helio G100",
    memory: "8GB",
    speaker: "⚪︎",
    screen: "11.45inch/30cm",
    cost: "39,800",
    other: "USB-C",
    link: "https://www.tcl.com/jp/ja/tablets/tcl-nxtpaper-11-plus",
  },
  {
    category: "USBハブ",
    select: "⚫︎",
    os: "",
    name: "Anker",
    series: "Nano USB-C 7-in-1",
    type: "",
    cpu: "",
    memory: "",
    speaker: "",
    screen: "要PD",
    cost: "4,990",
    other: "",
    link: "https://www.amazon.co.jp/Anker-HDMI%E3%83%9D%E3%83%BC%E3%83%884K-60Hz%E5%AF%BE%E5%BF%9C%E3%80%815Gbps-%E9%AB%98%E9%80%9F%E3%83%87%E3%83%BC%E3%82%BF%E8%BB%A2%E9%80%81-USB-C%E3%83%9D%E3%83%BC%E3%83%88%E3%80%81USB-A%E3%83%9D%E3%83%BC%E3%83%88%E6%90%AD%E8%BC%89/dp/B0F1MM3FM6/ref=sr_1_1_sspa?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=3UIY5YWYS4URD&dib=eyJ2IjoiMSJ9.E7zxj3_7JCulDScN4ac0GdhSyfAbGmjLZYatZJO3lvVgUM9tVadNPTuk4vlOvO8WzB3MGYvEe_-_gCJD7bZH9hH1Wph-9jF8AQePfRL9XCpC6T1CA0yFPmtVLDAgnbTpA6VlBsdAI_d26fAouYYQl7RcGcWj6VOfjwwMudosVld2X7SIX0ZwR5x37DpPvD2hs-BaW3Ta-UooPlY62wqKYfidc1c9PdZPjjES4sk6oqwGhl-2SLJyVGdH3HH4pHbIF6Nd_CTl-F53eYtoltHN_XabL2r9PhFj6zY2EEe8pEI.t9XB4FylqU5w5bSS8D4D1h3pzB1aIhRDSA8TbeWMwqo&dib_tag=se&keywords=anker+hub&qid=1762750063&sprefix=anker+hu%2Caps%2C202&sr=8-1-spons&ufe=app_do%3Aamzn1.fos.d8e7ee72-073f-4b97-8ec0-59c18d6dfebe&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1",
  },
  {
    category: "USBアダプター",
    select: "⚫︎",
    os: "",
    name: "Viviber",
    series: "AC式充電器",
    type: "",
    cpu: "",
    memory: "",
    speaker: "",
    screen: "",
    cost: "699",
    other: "",
    link: "https://www.amazon.co.jp/usb%E3%82%A2%E3%83%80%E3%83%97%E3%82%BF-%E3%82%A2%E3%82%A4%E3%83%9B%E3%83%B3%E5%85%85%E9%9B%BB%E5%99%A8-2-1A%E3%83%95%E3%83%AB%E3%82%B9%E3%83%94%E3%83%BC%E3%83%89%E5%85%85%E9%9B%BB-iPhone%E5%85%85%E9%9B%BB%E5%99%A8-android%E5%85%85%E9%9B%BB%E5%99%A8/dp/B08RDCV1GV/ref=sr_1_6?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=VEEUR4Y8M9M3&dib=eyJ2IjoiMSJ9.AriFPdaROLjBfLDrnPZIfhh6qmI8ab_MNcU9Tk0tMcrVHJdHGK9D51emif6S8i-VpKCOB9nIG5GKBPFdYViXEjLXqFxxWxf9-VfSiro8rwZm4yjh625yEHhmefnu_YoTmJy0JEahCgFCcMUihy3YFRNrJzwyf9iJ_mwvtxJxbsYRoduLEdYggTaB-Idto8dAnSZwTItNd8k_lt04n2w-xRuloFXHSNVjB_CT_7rM8fhBE9LWA-xaEOWxi6H4ueUFn0y3hiOLsIFCwa9zABZ50BMGeqvHIoTCMtcPT7m4yhQ.EopI_GNHQ_A004V7Ph1rsJgby84qwsQmirwzJVzj1vc&dib_tag=se&keywords=usb%E3%82%A2%E3%83%80%E3%83%97%E3%82%BF%E3%83%BC&qid=1762751714&sprefix=usb%E3%82%A2%E3%83%80%E3%83%97%E3%82%BF%E3%83%BC%2Caps%2C210&sr=8-6&ufe=app_do%3Aamzn1.fos.d8e7ee72-073f-4b97-8ec0-59c18d6dfebe&th=1://www.amazon.co.jp/Anker-HDMI%E3%83%9D%E3%83%BC%E3%83%884K-60Hz%E5%AF%BE%E5%BF%9C%E3%80%815Gbps-%E9%AB%98%E9%80%9F%E3%83%87%E3%83%BC%E3%82%BF%E8%BB%A2%E9%80%81-USB-C%E3%83%9D%E3%83%BC%E3%83%88%E3%80%81USB-A%E3%83%9D%E3%83%BC%E3%83%88%E6%90%AD%E8%BC%89/dp/B0F1MM3FM6/ref=sr_1_1_sspa?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=3UIY5YWYS4URD&dib=eyJ2IjoiMSJ9.E7zxj3_7JCulDScN4ac0GdhSyfAbGmjLZYatZJO3lvVgUM9tVadNPTuk4vlOvO8WzB3MGYvEe_-_gCJD7bZH9hH1Wph-9jF8AQePfRL9XCpC6T1CA0yFPmtVLDAgnbTpA6VlBsdAI_d26fAouYYQl7RcGcWj6VOfjwwMudosVld2X7SIX0ZwR5x37DpPvD2hs-BaW3Ta-UooPlY62wqKYfidc1c9PdZPjjES4sk6oqwGhl-2SLJyVGdH3HH4pHbIF6Nd_CTl-F53eYtoltHN_XabL2r9PhFj6zY2EEe8pEI.t9XB4FylqU5w5bSS8D4D1h3pzB1aIhRDSA8TbeWMwqo&dib_tag=se&keywords=anker+hub&qid=1762750063&sprefix=anker+hu%2Caps%2C202&sr=8-1-spons&ufe=app_do%3Aamzn1.fos.d8e7ee72-073f-4b97-8ec0-59c18d6dfebe&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1",
  },
  {
    category: "マイコン",
    select: "⚫︎",
    os: "",
    name: "Arduino",
    series: "Arduino Leonardo",
    type: "",
    cpu: "",
    memory: "",
    speaker: "",
    screen: "",
    cost: "3,560",
    other: "",
    link: "https://akizukidenshi.com/catalog/g/g107384/",
  },
  {
    category: "電子部品",
    select: "⚫︎",
    os: "",
    name: "",
    series: "部品いろいろ",
    type: "",
    cpu: "",
    memory: "",
    speaker: "",
    screen: "",
    cost: "1,000",
    other: "",
    link: "https://akizukidenshi.com/catalog/default.aspx",
  },
];

export default function SpecTable_terminal() {
  // 選択された項目の合計金額を計算
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
              <Th>タイプ</Th>
              <Th>備考</Th>
              <Th>OS</Th>
              <Th>CPU</Th>
              <Th>メモリ</Th>
              <Th>スピーカー</Th>
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
                <Td>{pc.series}</Td>
                <Td textAlign="right">{pc.cost}</Td>
                <Td>{pc.type}</Td>
                <Td>{pc.screen}</Td>
                <Td>{pc.os}</Td>
                <Td>{pc.cpu}</Td>
                <Td>{pc.memory}</Td>
                <Td>{pc.speaker}</Td>
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
