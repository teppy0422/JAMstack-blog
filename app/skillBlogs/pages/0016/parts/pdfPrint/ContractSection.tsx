"use client";

import {
  Box,
  Button,
  Divider,
  HStack,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa6";

const articles = [
  {
    title: "第1条（委託業務）",
    lines: [
      "甲は乙に対し、下記業務（以下「本業務」という）を委託し、乙はこれを受託する。",
      "業務内容：PreHarnessPro（仮称）の設計・開発・テスト・納品に関する一切の業務。",
      "本業務の詳細は別紙見積書に記載の内容に準ずる。",
      "本業務に含まれない事項については、甲乙協議のうえ別途定める。",
    ],
  },
  {
    title: "第2条（委託料および支払方法）",
    lines: [
      "甲は乙に対し、本業務の対価として別紙見積書に記載の金額を支払う。",
      "支払条件および支払時期は甲乙協議のうえ別途定める。",
      "仕様変更または追加作業が発生した場合、乙は別途見積を提示し、甲の承認を得たうえで実施する。",
    ],
  },
  {
    title: "第3条（履行期間）",
    lines: [
      "本業務の履行期間は、別途定める期間とする。",
      "履行期間は甲乙協議のうえ変更することができる。",
      "甲の指示変更、確認遅延、仕様変更その他甲の責に帰す事由により作業遅延が生じた場合、履行期間は合理的範囲で延長される。",
    ],
  },
  {
    title: "第4条（成果物の納品および検収）",
    lines: [
      "乙は本業務完了後、成果物（ソフトウェア、ソースコード、関連ドキュメント等）を甲に納品する。",
      "甲は成果物の納品後◯日以内に検収を行うものとする。",
      "期間内に検収結果の通知がない場合、成果物は検収合格とみなす。",
    ],
  },
  {
    title: "第5条（著作権および知的財産権）",
    lines: [
      "本業務により生じた成果物の著作権は、委託料の全額支払い完了をもって乙から甲へ譲渡される。",
      "乙が本業務以前から保有していた既存の知的財産権は乙に帰属する。",
      "乙は自己の技術・ノウハウ・プログラム部品を再利用できるものとする。",
    ],
  },
  {
    title: "第6条（保証および不具合対応）",
    lines: [
      "乙は以下の保証期間において、成果物の不具合対応を行う。",
      "（1）納品後3ヶ月以内：仕様変更を含む不具合対応を無償で行う。",
      "（2）納品後3ヶ月超〜1年以内：別紙見積書または仕様書に明記された機能の動作不良に限り無償で修補を行う。",
      "保証期間残り3ヶ月以内に仕様範囲内の不具合が発生した場合、その発生日を起点として保証期間を3ヶ月リセットする。本リセットは不具合発生のたびに繰り返し適用される。",
      "以下は保証期間内であっても無償対応の対象外とする。",
      "・仕様変更または追加要望",
      "・OS、ブラウザ、外部システム、環境変更に起因する対応",
      "・甲の操作または第三者要因による不具合",
    ],
  },
  {
    title: "第7条（保守およびサポート）",
    lines: [
      "乙は本契約終了後も、システム稼働に関する相談対応を継続して無償で行う。",
      "相談対応の範囲は口頭・メール等による助言に限り、プログラム改修・機能追加・環境変更対応・ハードウェア障害対応は含まない。",
    ],
  },
  {
    title: "第8条（責任の制限）",
    lines: [
      "乙の責任は、受領した委託料の総額を上限とする。",
      "乙は間接損害、逸失利益について責任を負わない。",
    ],
  },
  {
    title: "第9条（秘密保持）",
    lines: [
      "甲および乙は、本契約の履行に際して知り得た相手方の業務上の情報を第三者に開示・漏洩してはならない。",
      "本条の義務は、本契約終了後も存続する。",
    ],
  },
  {
    title: "第10条（再委託）",
    lines: [
      "乙は本業務の一部を第三者に委託できる。",
      "ただし、乙は再委託先に対し本契約と同等の義務を課すものとする。",
    ],
  },
  {
    title: "第11条（契約解除）",
    lines: [
      "甲または乙は、相手方が本契約に違反し、相当期間を定めて催告した後も是正されない場合、本契約を解除することができる。",
    ],
  },
  {
    title: "第12条（反社会的勢力の排除）",
    lines: [
      "甲および乙は、自己および自己の関係者が反社会的勢力に該当しないことを表明し保証する。",
    ],
  },
  {
    title: "第13条（協議事項）",
    lines: [
      "本契約に定めのない事項または疑義が生じた場合、甲乙誠意をもって協議する。",
    ],
  },
  {
    title: "第14条（準拠法および管轄）",
    lines: [
      "本契約は日本法に準拠し、徳島地方裁判所を第一審の専属的合意管轄裁判所とする。",
    ],
  },
];

export default function ContractSection() {
  const { colorMode } = useColorMode();

  const handlePrint = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

    const articleHtml = articles
      .map(
        (a) =>
          `<div class="article"><h2>${a.title}</h2>${a.lines.map((l) => `<p>${l}</p>`).join("")}</div>`,
      )
      .join("");

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>業務委託契約書</title>
<style>
  @page { size: A4; margin: 20mm 25mm; }
  * { box-sizing: border-box; }
  body { font-family: "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif; font-size: 11px; margin: 0; color: #111; line-height: 1.8; }
  h1 { text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 0.3em; margin: 0 0 24px; }
  .date { text-align: right; margin-bottom: 24px; }
  .parties { margin-bottom: 24px; }
  .parties p { margin: 2px 0; }
  .intro { margin-bottom: 20px; }
  h2 { font-size: 16px; font-weight: bold; margin: 20px 0 4px; border-bottom: 1px solid #333; padding-bottom: 2px; }
  p { margin: 4px 0; font-size: 14px; }
  .article { margin-bottom: 12px; }
  .sign-area { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .sign-box { border: 1px solid #999; padding: 16px; min-height: 80px; }
  .sign-box p { margin: 2px 0; }
</style></head>
<body>
<h1>業 務 委 託 契 約 書</h1>
<div class="date">締結日：${dateStr}</div>
<div class="parties">
  <p><b>発注者：</b>有限会社ウエダ（以下「甲」という）</p>
  <p><b>受注者：</b>片岡 哲兵（以下「乙」という）</p>
</div>
<div class="intro">
  <p>甲および乙は、以下の条件に基づき業務委託契約（以下「本契約」という）を締結する。</p>
</div>
${articleHtml}
<div class="sign-area">
  <div class="sign-box">
    <p><b>甲（発注者）</b></p>
    <p>有限会社ウエダ</p>
    <p>代表者：</p>
    <br/>
    <p>署名：＿＿＿＿＿＿＿＿＿＿</p>
    <p>日付：＿＿＿＿年＿＿月＿＿日</p>
  </div>
  <div class="sign-box">
    <p><b>乙（受注者）</b></p>
    <p>片岡 哲兵</p>
    <p>住所：徳島県板野郡藍住町奥野和田135-35</p>
    <br/>
    <p>署名：＿＿＿＿＿＿＿＿＿＿</p>
    <p>日付：＿＿＿＿年＿＿月＿＿日</p>
  </div>
</div>
</body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(() => {
      win.focus();
      win.print();
    }, 300);
  };

  return (
    <VStack align="stretch" spacing={3} mt={2}>
      <HStack justify="flex-end">
        <Button
          size="xs"
          leftIcon={<FaDownload />}
          variant="outline"
          borderColor={colorMode === "light" ? "black" : "white"}
          onClick={handlePrint}
        >
          契約書PDF
        </Button>
      </HStack>

      {/* 契約書プレビュー */}
      <Box
        border="1px solid"
        borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
        borderRadius="md"
        p={4}
        fontSize="sm"
      >
        <Text textAlign="center" fontWeight="bold" fontSize="md" mb={3}>
          業務委託契約書
        </Text>
        <Text mb={3}>
          <b>発注者：</b>有限会社ウエダ（以下「甲」という）
          <br />
          <b>受注者：</b>片岡 哲兵（以下「乙」という）
        </Text>
        <Text mb={3}>
          甲および乙は、以下の条件に基づき業務委託契約（以下「本契約」という）を締結する。
        </Text>
        <VStack align="stretch" spacing={2}>
          {articles.map((article) => (
            <Box key={article.title}>
              <Divider mb={1} />
              <Text fontWeight="bold" mb={1}>
                {article.title}
              </Text>
              {article.lines.map((line, i) => (
                <Text key={i} pl={2}>
                  {line}
                </Text>
              ))}
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
