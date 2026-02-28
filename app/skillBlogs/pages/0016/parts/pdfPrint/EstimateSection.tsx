"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import PartListPlan from "./PartListPlan";
import { ANNEX_SECTIONS } from "./annexContent";

const PLAN_PATHS = [
  "/partlist/plans/plan-a.json",
  "/partlist/plans/plan-b.json",
  "/partlist/plans/plan-c.json",
  "/partlist/plans/plan-d.json",
  "/partlist/plans/plan-e.json",
];

type PartEntry = { id: number; quantity: number };
type ProjectData = {
  projectName: string;
  discount?: number;
  parts: PartEntry[];
};
type PlanProject = { path: string; sets: number; type?: string };
type PlanData = { planName: string; projects: PlanProject[] };
type PartInfo = {
  id: number;
  name: string;
  unitPrice?: number;
  perPrice?: number;
  hours?: number;
};

function getPartPrice(p: PartInfo): number {
  if (p.perPrice != null && p.hours != null) return p.perPrice * p.hours;
  return p.unitPrice ?? 0;
}

export default function EstimateSection({
  onPrintReady,
}: {
  onPrintReady?: (fn: () => void) => void;
} = {}) {
  const [planIndex, setPlanIndex] = useState(2);
  const [devProjects, setDevProjects] = useState<
    { proj: PlanProject; project: ProjectData; parts: PartInfo[] }[]
  >([]);
  const [devTotal, setDevTotal] = useState(0);
  const [planName, setPlanName] = useState("");

  useEffect(() => {
    const load = async () => {
      const [planRes, masterRes] = await Promise.all([
        fetch(PLAN_PATHS[planIndex]),
        fetch("/partlist/list.json"),
      ]);
      const plan: PlanData = await planRes.json();
      const master: { parts: PartInfo[] } = await masterRes.json();
      const partMap: Record<number, PartInfo> = {};
      master.parts.forEach((p) => (partMap[p.id] = p));

      const active = plan.projects.filter(
        (p) => p.type === "development" && p.sets >= 1,
      );
      const results: {
        proj: PlanProject;
        project: ProjectData;
        parts: PartInfo[];
      }[] = [];
      let total = 0;
      for (const proj of active) {
        const res = await fetch(`/partlist/projects/${proj.path}`);
        const project: ProjectData = await res.json();
        const parts = project.parts.map((pe) => partMap[pe.id]).filter(Boolean);
        const sub =
          parts.reduce((s, p) => s + getPartPrice(p), 0) +
          (project.discount ?? 0);
        total += sub * proj.sets;
        results.push({ proj, project, parts });
      }
      setPlanName(plan.planName);
      setDevProjects(results);
      setDevTotal(total);
    };
    load();
  }, [planIndex]);

  const handlePrint = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    const estNo = `${planName.replace(/\s/g, "")}-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

    const rows = devProjects
      .map(({ project, parts, proj }) => {
        const discount = project.discount ?? 0;
        const subtotal =
          (parts.reduce((s, p) => s + getPartPrice(p), 0) + discount) * proj.sets;
        const totalHours = parts.reduce((s, p) => s + (p.hours ?? 0), 0);
        const detailRows = parts
          .map((p) => {
            const price = getPartPrice(p);
            const perP = p.perPrice != null ? p.perPrice : p.hours ? Math.round(price / p.hours) : 0;
            const hrs = (p.hours ?? 0) * proj.sets;
            return `<tr class="detail"><td style="padding-left:2em">${p.name}</td><td class="r">${hrs}</td><td class="r">${perP.toLocaleString()}</td><td class="r">${(price * proj.sets).toLocaleString()}</td></tr>`;
          })
          .join("");
        const discountRow =
          discount < 0
            ? `<tr class="detail"><td style="padding-left:2em;color:#444">　値引き</td><td></td><td></td><td class="r" style="color:#444">${(discount * proj.sets).toLocaleString()}</td></tr>`
            : "";
        return `<tr><td><b>${project.projectName}一式</b></td><td class="r">-</td><td class="r">-</td><td class="r"><b>${subtotal.toLocaleString()}</b></td></tr>${detailRows}${discountRow}`;
      })
      .join("");

    const devTax = Math.floor(devTotal * 0.1);
    const grandTotal = devTotal + devTax;

    const annexHtml = ANNEX_SECTIONS.map((s) =>
      `<div style="margin-bottom:20px;"><p style="font-weight:bold; margin-bottom:6px;">${s.title}</p>${s.lines.map((l) => `<p>${l}</p>`).join("")}</div>`
    ).join("");
    const annexPage = `<div style="page-break-before: always;"><h2 style="font-size:16px; font-weight:bold; border-bottom:1px solid #333; padding-bottom:4px; margin-bottom:16px;">【別紙】見積補足資料</h2>${annexHtml}</div>`;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>見積書_${estNo}</title>
<style>
  @page { size: A4; margin: 15mm 20mm; }
  * { box-sizing: border-box; }
  body { font-family: "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif; font-size: 11px; margin: 0; color: #111; }
  h1 { text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 0.3em; margin: 0 0 16px; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; margin-bottom: 16px; }
  .meta-left { border: 1px solid #333; padding: 12px 16px; }
  .meta-right { padding: 4px 0 4px 24px; font-size: 11px; }
  .meta-right p { margin: 3px 0; }
  .client-name { font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 4px; margin-bottom: 8px; }
  .grand-box { border: 2px solid #333; display: inline-block; padding: 6px 24px; margin: 8px 0; font-size: 14px; font-weight: bold; }
  .note-small { font-size: 11px; color: #444; margin: 4px 0; }
  table { border-collapse: collapse; width: 100%; margin-top: 8px; }
  th { background: #333; color: #fff; padding: 5px 8px; font-size: 10px; text-align: left; border: 1px solid #333; }
  td { border: 1px solid #bbb; padding: 4px 8px; vertical-align: top; }
  tr.section-dev td { background: #d6eedd; font-weight: bold; font-size: 10px; }
  tr.dev-subtotal td { background: #e8f5e8; font-weight: bold; }
  tr.detail td { background: #fafafa; font-size: 10px; color: #222; }
  tr.tax-row td { background: #fafafa; font-size: 10px; color: #444; }
  tr.grand td { background: #e8e8e8; font-weight: bold; font-size: 13px; }
  .r { text-align: right; }
</style></head>
<body>
<h1>見 積 書</h1>
<table>
  <thead>
    <tr>
      <th style="width:45%">作業内容</th>
      <th class="r" style="width:12%">工数(h)</th>
      <th class="r" style="width:18%">単価(円/h)</th>
      <th class="r" style="width:25%">金額（円）</th>
    </tr>
  </thead>
  <tbody>
    <tr class="section-dev"><td colspan="4">■ 開発費（ソフトウェア開発・システム構築）</td></tr>
    ${rows}
    <tr class="dev-subtotal">
      <td colspan="3">開発費 小計</td>
      <td class="r">${devTotal.toLocaleString()}</td>
    </tr>
    <tr class="tax-row">
      <td colspan="3">消費税相当額（10%）</td>
      <td class="r">${devTax.toLocaleString()}</td>
    </tr>
    <tr class="grand">
      <td colspan="3">合計金額</td>
      <td class="r">¥ ${grandTotal.toLocaleString()}</td>
    </tr>
  </tbody>
</table>
${annexPage}
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

  useEffect(() => {
    onPrintReady?.(handlePrint);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devProjects, devTotal, planName]);

  return (
    <>
      <Text fontSize="sm">確認日:2026/2/10</Text>
      <Box mt={4}>
        <PartListPlan
          planPaths={PLAN_PATHS}
          defaultPlanIndex={2}
          onPlanChange={setPlanIndex}
        />
      </Box>
      <Box mt={6}>
        <Grid
          templateColumns="1fr auto auto auto"
          gap={1}
          fontSize="xs"
          w="100%"
        >
          <GridItem fontWeight="bold">作業内容</GridItem>
          <GridItem fontWeight="bold" textAlign="right">
            工数(時間)
          </GridItem>
          <GridItem fontWeight="bold" textAlign="right">
            単価(円/時)
          </GridItem>
          <GridItem fontWeight="bold" textAlign="right">
            金額(円)
          </GridItem>

          {devProjects.map(({ project, parts, proj }) => {
            const totalHours = parts.reduce((s, p) => s + (p.hours ?? 0), 0);
            const discount = project.discount ?? 0;
            const subtotal =
              (parts.reduce((s, p) => s + getPartPrice(p), 0) + discount) *
              proj.sets;
            return (
              <React.Fragment key={proj.path}>
                <GridItem colSpan={4} mt={2}>
                  <Text fontSize="xs" fontWeight="bold">
                    ■ {project.projectName}
                  </Text>
                </GridItem>
                {parts.map((p) => (
                  <React.Fragment key={p.id}>
                    <GridItem pl={2}>{p.name}</GridItem>
                    <GridItem textAlign="right">{p.hours ?? "-"}</GridItem>
                    <GridItem textAlign="right">
                      {p.perPrice != null
                        ? p.perPrice.toLocaleString()
                        : p.hours
                          ? Math.round(
                              getPartPrice(p) / p.hours,
                            ).toLocaleString()
                          : "-"}
                    </GridItem>
                    <GridItem textAlign="right">
                      {getPartPrice(p).toLocaleString()}
                    </GridItem>
                  </React.Fragment>
                ))}
                {discount < 0 && (
                  <React.Fragment>
                    <GridItem pl={2} color="gray.500">
                      値引き
                    </GridItem>
                    <GridItem textAlign="right" color="gray.500">
                      -
                    </GridItem>
                    <GridItem textAlign="right" color="gray.500">
                      -
                    </GridItem>
                    <GridItem textAlign="right" color="gray.500">
                      {discount.toLocaleString()}
                    </GridItem>
                  </React.Fragment>
                )}
                <GridItem colSpan={3} fontWeight="bold" pt={1}>
                  小計（{totalHours}時間）
                </GridItem>
                <GridItem fontWeight="bold" textAlign="right" pt={1}>
                  {subtotal.toLocaleString()}
                </GridItem>
              </React.Fragment>
            );
          })}

          <GridItem
            colSpan={3}
            fontWeight="bold"
            fontSize="sm"
            pt={2}
            borderTop="1px solid"
            borderColor="gray.300"
          >
            開発費 合計
          </GridItem>
          <GridItem
            fontWeight="bold"
            fontSize="sm"
            textAlign="right"
            pt={2}
            borderTop="1px solid"
            borderColor="gray.300"
          >
            {devTotal.toLocaleString()}
          </GridItem>
        </Grid>
      </Box>
    </>
  );
}
