import { createJsPdfWithJapaneseFont } from "./loadJsPdfWithJapaneseFont";
import type { Invoice, InvoiceLineItem } from "./invoiceTypes";

const ISSUER = {
  postalCode: "771-1202",
  address: "徳島県板野郡藍住町奥野和田135-35",
  email: "teppy422@au.com",
  phone: "070-9133-6256",
  name: "片岡哲兵",
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 40;
const MARGIN_TOP = 40;
const FOOTER_TEXT_Y = PAGE_HEIGHT - 34;
const FOOTER_PAGENUM_Y = PAGE_HEIGHT - 20;
const CONTENT_BOTTOM = PAGE_HEIGHT - 55;

const COL = {
  work: MARGIN_X,
  workW: 230,
  hours: MARGIN_X + 230,
  hoursW: 45,
  unit: MARGIN_X + 275,
  unitW: 35,
  unitPrice: MARGIN_X + 310,
  unitPriceW: 60,
  amount: MARGIN_X + 370,
  amountW: 65,
  remarks: MARGIN_X + 435,
};
const TABLE_RIGHT = PAGE_WIDTH - MARGIN_X;
const COL_REMARKS_W = TABLE_RIGHT - COL.remarks;
const HEADER_ROW_H = 16;
const ROW_H = 16;
const DATE_ROW_H = 14;

// 通常テキストの濃度底上げ用の縁取り幅（フォントサイズに比例）
const NORMAL_STROKE_RATIO = 0.035;
// 強調テキストの縁取り幅（フォントサイズに比例、通常よりわずかに太くする程度に留める）
const BOLD_STROKE_RATIO = 0.055;

type Row =
  | { type: "date"; date: string }
  | { type: "item"; item: InvoiceLineItem };

function buildRows(lineItems: InvoiceLineItem[]): Row[] {
  const sorted = [...lineItems].sort((a, b) => a.sort_order - b.sort_order);
  const rows: Row[] = [];
  let lastDate: string | null = null;
  for (const item of sorted) {
    const d = item.work_date || "";
    if (d && d !== lastDate) {
      rows.push({ type: "date", date: d });
      lastDate = d;
    }
    rows.push({ type: "item", item });
  }
  return rows;
}

export async function generateInvoicePdf(
  invoice: Invoice,
  lineItems: InvoiceLineItem[],
  invoiceNumber: string,
  projectName: string
): Promise<Blob> {
  const { doc, fontName } = await createJsPdfWithJapaneseFont();

  let currentFontSize = 9;
  const setSize = (size: number) => {
    currentFontSize = size;
    doc.setFontSize(size);
  };

  // すべてのテキストをこの関数経由で描画する。
  // 常に薄い縁取り（fillThenStroke）を重ねて濃度を底上げし、
  // bold=true のときはさらに太い縁取りで強調する。
  const t = (
    text: string,
    x: number,
    y: number,
    opts: { align?: "left" | "right" | "center"; bold?: boolean; maxWidth?: number } = {}
  ) => {
    const ratio = opts.bold ? BOLD_STROKE_RATIO : NORMAL_STROKE_RATIO;
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(currentFontSize * ratio);
    doc.text(text, x, y, {
      align: opts.align,
      maxWidth: opts.maxWidth,
      renderingMode: "fillThenStroke",
    });
  };

  const drawVerticalLines = (top: number, bottom: number) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.75);
    [COL.hours, COL.unit, COL.unitPrice, COL.amount, COL.remarks].forEach((x) => {
      doc.line(x, top, x, bottom);
    });
  };

  const drawTableHeader = (y: number) => {
    doc.setFillColor(245, 245, 245);
    doc.rect(MARGIN_X, y, TABLE_RIGHT - MARGIN_X, HEADER_ROW_H, "F");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.75);
    doc.rect(MARGIN_X, y, TABLE_RIGHT - MARGIN_X, HEADER_ROW_H);
    drawVerticalLines(y, y + HEADER_ROW_H);

    setSize(9);
    t("作業内容", COL.work + 4, y + 11);
    t("工数", COL.hours + COL.hoursW - 4, y + 11, { align: "right" });
    t("単位", COL.unit + 4, y + 11);
    t("単価", COL.unitPrice + COL.unitPriceW - 4, y + 11, { align: "right" });
    t("合計", COL.amount + COL.amountW - 4, y + 11, { align: "right" });
    t("備考", COL.remarks + 4, y + 11);

    return y + HEADER_ROW_H;
  };

  const drawHeaderBlock = () => {
    let y = MARGIN_TOP;

    doc.setFillColor(221, 221, 221);
    doc.rect(MARGIN_X, y, PAGE_WIDTH - MARGIN_X * 2, 22, "F");
    setSize(15);
    t("請求書", PAGE_WIDTH / 2, y + 15, { align: "center", bold: true });
    y += 34;

    setSize(10);
    t(invoiceNumber, MARGIN_X, y);
    y += 16;

    setSize(11);
    t(`${invoice.client_name} 御中`, MARGIN_X, y, { bold: true });
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(MARGIN_X, y + 3, MARGIN_X + 220, y + 3);
    setSize(9);
    t(`発行日：${invoice.issue_date}`, TABLE_RIGHT, y, { align: "right" });
    y += 18;

    setSize(9);
    t("下記の通り、ご請求申し上げます。", MARGIN_X, y);
    y += 28;

    const issuerLines = [
      `〒${ISSUER.postalCode} ${ISSUER.address}`,
      ISSUER.email,
      ISSUER.phone,
      ISSUER.name,
    ];
    let issuerY = y;
    setSize(9);
    for (const line of issuerLines) {
      t(line, TABLE_RIGHT, issuerY, { align: "right" });
      issuerY += 12;
    }

    setSize(14);
    t(invoice.subject_title?.trim() || projectName, MARGIN_X, y, { bold: true });
    let subjectY = y + 16;
    if (invoice.subject_detail) {
      setSize(10);
      t(`└${invoice.subject_detail}`, MARGIN_X, subjectY);
      subjectY += 12;
    }
    y = Math.max(issuerY, subjectY) + 6;

    setSize(9);
    t("ご請求金額(税込)", MARGIN_X, y);
    y += 18;
    setSize(18);
    t(`¥${invoice.total.toLocaleString()}`, MARGIN_X, y, { bold: true });
    y += 18;

    if (invoice.responder_name) {
      setSize(9);
      t("対応者様", MARGIN_X, y);
      y += 13;
      setSize(11);
      t(invoice.responder_name, MARGIN_X, y, { bold: true });
      y += 14;
    }

    if (invoice.delivery_place) {
      setSize(9);
      t(`納入場所： ${invoice.delivery_place}`, MARGIN_X, y);
      y += 14;
    }

    setSize(9);
    t(`時給：${invoice.hourly_rate.toLocaleString()}円`, TABLE_RIGHT, y, { align: "right" });
    y += 10;

    return y;
  };

  // ---- ページ構成を先に計算する ----
  const rows = buildRows(lineItems);

  let pageIndex = 0;
  let y = 0;
  let tableTop = 0;

  const finishTableBlock = (bottom: number) => {
    if (bottom > tableTop) {
      drawVerticalLines(tableTop, bottom);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.75);
      doc.rect(MARGIN_X, tableTop, TABLE_RIGHT - MARGIN_X, bottom - tableTop);
    }
  };

  const newPlainPage = () => {
    if (pageIndex > 0) doc.addPage();
    pageIndex += 1;
    y = pageIndex === 1 ? drawHeaderBlock() : MARGIN_TOP;
  };

  const newPage = () => {
    newPlainPage();
    y = drawTableHeader(y);
    tableTop = y;
  };

  newPage();

  let rowBottom = y;
  for (const row of rows) {
    const rowH = row.type === "date" ? DATE_ROW_H : ROW_H;
    if (y + rowH > CONTENT_BOTTOM) {
      finishTableBlock(rowBottom);
      newPage();
      rowBottom = y;
    }

    if (row.type === "date") {
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.75);
      doc.line(MARGIN_X, y, TABLE_RIGHT, y);

      setSize(8.5);
      t(row.date, COL.work + 4, y + 10, { bold: true });
    } else {
      const item = row.item;

      setSize(8.5);
      const label = item.section_label
        ? `${item.section_label}：${item.description}`
        : item.description;
      t(label, COL.work + 8, y + 11, { maxWidth: COL.workW - 12 });
      if (item.hours !== null) {
        t(String(item.hours), COL.hours + COL.hoursW - 4, y + 11, { align: "right" });
      }
      t("H", COL.unit + 4, y + 11);
      t(item.unit_price.toLocaleString(), COL.unitPrice + COL.unitPriceW - 4, y + 11, {
        align: "right",
      });
      t(item.amount.toLocaleString(), COL.amount + COL.amountW - 4, y + 11, {
        align: "right",
      });
      if (item.remarks) {
        t(item.remarks, COL.remarks + 4, y + 11, { maxWidth: COL_REMARKS_W - 8 });
      }
    }

    y += rowH;
    rowBottom = y;
  }
  finishTableBlock(rowBottom);

  y += 12;

  const summaryW = 170;
  const summaryX = TABLE_RIGHT - summaryW;
  const summaryRowH = 15;
  const summaryRows: [string, string, boolean][] = [
    ["小計", invoice.subtotal.toLocaleString(), false],
    ["消費税", invoice.tax.toLocaleString(), false],
    ["総合計", invoice.total.toLocaleString(), true],
  ];
  if (y + summaryRowH * 3 > CONTENT_BOTTOM) {
    newPlainPage();
  }
  const summaryTop = y;
  const summaryBottom = y + summaryRowH * summaryRows.length;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.75);
  // 外枠を1回だけ描画（重ね描きによる太線化を防ぐ）
  doc.rect(summaryX, summaryTop, summaryW, summaryBottom - summaryTop);
  doc.line(
    summaryX + summaryW * 0.5,
    summaryTop,
    summaryX + summaryW * 0.5,
    summaryBottom
  );
  for (let i = 1; i < summaryRows.length; i++) {
    const rowY = y + i * summaryRowH;
    doc.line(summaryX, rowY, summaryX + summaryW, rowY);
  }
  setSize(9);
  for (let i = 0; i < summaryRows.length; i++) {
    const [label, value, bold] = summaryRows[i];
    const rowY = y + i * summaryRowH;
    t(label, summaryX + 6, rowY + 10, { bold });
    t(value, summaryX + summaryW - 6, rowY + 10, { align: "right", bold });
  }
  y = summaryTop + summaryRowH * 3 + 16;

  const notesLines = (invoice.notes || "").split("\n").filter((l) => l.length > 0);
  if (notesLines.length > 0) {
    if (y + 14 > CONTENT_BOTTOM) newPlainPage();
    setSize(9);
    t("主な取り組み", MARGIN_X, y, { bold: true });
    y += 14;
    setSize(8.5);
    for (const line of notesLines) {
      if (y + 11 > CONTENT_BOTTOM) newPlainPage();
      t(line, MARGIN_X, y);
      y += 11;
    }
  }

  const totalPages = pageIndex;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    setSize(8);
    if (p === totalPages) {
      t("不明な点は、お手数ですがお問い合わせ願います", PAGE_WIDTH / 2, FOOTER_TEXT_Y, {
        align: "center",
      });
    }
    t(`${p} / ${totalPages} ページ`, PAGE_WIDTH / 2, FOOTER_PAGENUM_Y, { align: "center" });
  }

  return doc.output("blob");
}
