"use client";

import React, { useEffect, useState, useMemo } from "react";
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
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  HStack,
  Button,
  useColorMode,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
} from "@chakra-ui/icons";

interface Part {
  id: number;
  maker: string;
  name: string;
  unitPrice?: number;
  perPrice?: number;
  model: string;
  url: string;
  power: number | null;
  memo: string;
  hours?: number;
}

function getPartPrice(p: Part): number {
  if (p.perPrice != null && p.hours != null) return p.perPrice * p.hours;
  return p.unitPrice ?? 0;
}

interface PartListData {
  title: string;
  note: string;
  parts: Part[];
}

interface ProjectData {
  projectName: string;
  discount?: number;
  parts: { id: number; quantity: number }[];
}

interface PlanProject {
  path: string;
  sets: number;
  type?: "hardware" | "development";
}

interface PlanData {
  planName: string;
  note?: string;
  notice?: string;
  projects: PlanProject[];
}

interface PartListPlanProps {
  planPaths: string[];
  masterPath?: string;
  defaultPlanIndex?: number;
  onPlanChange?: (index: number) => void;
}

export default function PartListPlan({
  planPaths,
  masterPath = "/partlist/list.json",
  defaultPlanIndex = 0,
  onPlanChange,
}: PartListPlanProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [master, setMaster] = useState<PartListData | null>(null);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [projectCache, setProjectCache] = useState<Record<string, ProjectData>>(
    {},
  );
  const [activePlanIndex, setActivePlanIndex] = useState(defaultPlanIndex);
  const [setsOverrides, setSetsOverrides] = useState<
    Record<string, Record<string, number>>
  >({});
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const load = async () => {
      const masterRes = await fetch(masterPath);
      const masterData: PartListData = await masterRes.json();
      setMaster(masterData);

      const loadedPlans: PlanData[] = [];
      const cache: Record<string, ProjectData> = {};
      const overrides: Record<string, Record<string, number>> = {};

      for (const planPath of planPaths) {
        const planRes = await fetch(planPath);
        const plan: PlanData = await planRes.json();
        loadedPlans.push(plan);

        const planOverride: Record<string, number> = {};
        for (const proj of plan.projects) {
          planOverride[proj.path] = proj.sets;
          if (!cache[proj.path]) {
            const projRes = await fetch(`/partlist/projects/${proj.path}`);
            cache[proj.path] = await projRes.json();
          }
        }
        overrides[planPath] = planOverride;
      }

      setPlans(loadedPlans);
      setProjectCache(cache);
      setSetsOverrides(overrides);
    };
    load();
  }, [planPaths, masterPath]);

  const activePlan = plans[activePlanIndex];
  const activePlanPath = planPaths[activePlanIndex];

  const partMap = useMemo(() => {
    if (!master) return {};
    const map: Record<number, Part> = {};
    master.parts.forEach((p) => (map[p.id] = p));
    return map;
  }, [master]);

  const calcProjectSubtotal = (proj: ProjectData): number => {
    return proj.parts.reduce(
      (sum, p) => sum + getPartPrice(partMap[p.id] ?? {}) * p.quantity,
      proj.discount ?? 0,
    );
  };

  const setSetsForProject = (path: string, val: number) => {
    setSetsOverrides((prev) => ({
      ...prev,
      [activePlanPath]: {
        ...prev[activePlanPath],
        [path]: val,
      },
    }));
  };

  const getSets = (path: string): number => {
    return setsOverrides[activePlanPath]?.[path] ?? 0;
  };

  const toggleExpand = (path: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  // 機材費・開発費それぞれの小計
  const { hardwareTotal, developmentTotal, grandTotal } = useMemo(() => {
    if (!activePlan)
      return { hardwareTotal: 0, developmentTotal: 0, grandTotal: 0 };
    let hw = 0;
    let dev = 0;
    for (const proj of activePlan.projects) {
      const project = projectCache[proj.path];
      if (!project) continue;
      const sets = getSets(proj.path);
      const sub = calcProjectSubtotal(project) * sets;
      if (proj.type === "development") dev += sub;
      else hw += sub;
    }
    return { hardwareTotal: hw, developmentTotal: dev, grandTotal: hw + dev };
  }, [activePlan, projectCache, setsOverrides, partMap]);

  if (!master || plans.length === 0) return <Text>読み込み中...</Text>;

  const bgCard = isDark ? "gray.700" : "white";
  const bgHeader = isDark ? "gray.600" : "gray.50";
  const borderColor = isDark ? "gray.600" : "gray.200";
  const detailBg = isDark ? "gray.750" : "gray.50";
  const activeBtnBg = isDark ? "#E3836D" : "#503F35";

  // カテゴリセクションヘッダのスタイル
  const hwSectionBg = isDark ? "blue.900" : "blue.50";
  const hwSectionColor = isDark ? "blue.200" : "blue.700";
  const devSectionBg = isDark ? "green.900" : "green.50";
  const devSectionColor = isDark ? "green.200" : "green.700";
  const hwSubtotalBg = isDark ? "blue.800" : "blue.100";
  const devSubtotalBg = isDark ? "green.800" : "green.100";
  const grandTotalBg = isDark ? "gray.600" : "gray.100";

  const hardwareProjects = activePlan.projects.filter(
    (p) => p.type !== "development",
  );
  const developmentProjects = activePlan.projects.filter(
    (p) => p.type === "development",
  );

  const renderProjectRow = (proj: PlanProject) => {
    const project = projectCache[proj.path];
    if (!project) return null;
    const perSet = calcProjectSubtotal(project);
    const sets = getSets(proj.path);
    const subtotal = perSet * sets;
    const isExpanded = expandedProjects.has(proj.path);
    return (
      <React.Fragment key={proj.path}>
        <Tr>
          <Td
            fontWeight="bold"
            fontSize={{ base: "11px", sm: "14px" }}
            cursor="pointer"
            onClick={() => toggleExpand(proj.path)}
            userSelect="none"
          >
            {isExpanded ? (
              <ChevronDownIcon mr={1} />
            ) : (
              <ChevronRightIcon mr={1} />
            )}
            {project.projectName}
          </Td>
          <Td isNumeric display={{ base: "none", md: "table-cell" }}>
            {perSet.toLocaleString()}
          </Td>
          <Td isNumeric>
            <NumberInput
              size="xs"
              w={{ base: "50px", sm: "70px" }}
              min={0}
              max={999}
              value={sets}
              onChange={(_, val) =>
                setSetsForProject(proj.path, isNaN(val) ? 0 : val)
              }
              ml="auto"
            >
              <NumberInputField px={2} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Td>
          <Td
            isNumeric
            fontWeight="bold"
            fontSize={{ base: "11px", sm: "14px" }}
          >
            {subtotal.toLocaleString()}
          </Td>
        </Tr>
        {isExpanded &&
          project.parts.map((pp) => {
            const part = partMap[pp.id];
            if (!part) return null;
            return (
              <Tr key={`${proj.path}-${pp.id}`} bg={detailBg}>
                <Td pl={8} fontSize="xs">
                  {part.url ? (
                    <a
                      href={part.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      {part.name}
                    </a>
                  ) : (
                    part.name
                  )}
                  {part.maker && (
                    <Text as="span" color="gray.500" ml={1}>
                      ({part.maker})
                    </Text>
                  )}
                  {part.memo && (
                    <Text as="span" color="gray.400" ml={1} fontSize="10px">
                      {part.memo}
                    </Text>
                  )}
                </Td>
                <Td
                  isNumeric
                  fontSize="xs"
                  display={{ base: "none", md: "table-cell" }}
                >
                  {getPartPrice(part).toLocaleString()}
                </Td>
                <Td isNumeric fontSize="xs">
                  {`×${pp.quantity * sets}`}
                </Td>
                <Td isNumeric fontSize="xs">
                  {(getPartPrice(part) * pp.quantity * sets).toLocaleString()}
                </Td>
              </Tr>
            );
          })}
        {isExpanded && project.discount != null && project.discount < 0 && (
          <Tr bg={detailBg}>
            <Td pl={8} fontSize="xs" color="gray.500">
              調整値引き額(端数削除)
            </Td>
            <Td display={{ base: "none", md: "table-cell" }} />
            <Td />
            <Td isNumeric fontSize="xs" color="gray.500">
              {(project.discount * sets).toLocaleString()}
            </Td>
          </Tr>
        )}
      </React.Fragment>
    );
  };

  const handlePrint = () => {
    const hwProjects = activePlan.projects.filter(
      (p) => p.type !== "development",
    );
    const devProjects = activePlan.projects.filter(
      (p) => p.type === "development",
    );

    const renderRows = (projs: typeof activePlan.projects) =>
      projs
        .map((proj) => {
          const project = projectCache[proj.path];
          if (!project) return "";
          const sets = setsOverrides[activePlanPath]?.[proj.path] ?? 0;
          if (sets === 0) return "";
          const partsSum = project.parts.reduce(
            (sum, p) => sum + getPartPrice(partMap[p.id] ?? {}) * p.quantity,
            0,
          );
          const discount = project.discount ?? 0;
          const perSet = partsSum + discount;
          const subtotal = perSet * sets;
          const detailRows = project.parts
            .map((pp) => {
              const part = partMap[pp.id];
              if (!part) return "";
              const makerLabel = part.maker ? `（${part.maker}）` : "";
              const price = getPartPrice(part);
              return `<tr class="detail"><td style="padding-left:2em">${part.name}${makerLabel}</td><td class="r">${price.toLocaleString()}</td><td class="r">×${pp.quantity * sets}</td><td class="r">${(price * pp.quantity * sets).toLocaleString()}</td></tr>`;
            })
            .join("");
          const discountRow =
            discount < 0
              ? `<tr class="detail"><td style="padding-left:2em;color:#888"></td><td></td><td></td><td class="r" style="color:#888">${(discount * sets).toLocaleString()}</td></tr>`
              : "";
          return `<tr><td><b>${project.projectName}</b></td><td class="r">${perSet.toLocaleString()}</td><td class="r">${sets}</td><td class="r"><b>${subtotal.toLocaleString()}</b></td></tr>${detailRows}${discountRow}`;
        })
        .join("");

    const renderDevRows = (projs: typeof activePlan.projects) =>
      projs
        .map((proj) => {
          const project = projectCache[proj.path];
          if (!project) return "";
          const sets = setsOverrides[activePlanPath]?.[proj.path] ?? 0;
          if (sets === 0) return "";
          const partsSum = project.parts.reduce(
            (sum, p) => sum + getPartPrice(partMap[p.id] ?? {}) * p.quantity,
            0,
          );
          const discount = project.discount ?? 0;
          const subtotal = (partsSum + discount) * sets;
          const totalHours = project.parts.reduce(
            (sum, p) => sum + (partMap[p.id]?.hours ?? 0) * p.quantity,
            0,
          );
          const detailRows = project.parts
            .map((pp) => {
              const part = partMap[pp.id];
              if (!part) return "";
              const price = getPartPrice(part);
              const perP =
                part.perPrice != null
                  ? part.perPrice
                  : part.hours
                    ? Math.round(price / part.hours)
                    : 0;
              const hrs = (part.hours ?? 0) * pp.quantity * sets;
              return `<tr class="detail"><td style="padding-left:2em">${part.name}</td><td class="r">${hrs}</td><td class="r">${perP.toLocaleString()}</td><td class="r">${(price * pp.quantity * sets).toLocaleString()}</td></tr>`;
            })
            .join("");
          const discountRow =
            discount < 0
              ? `<tr class="detail"><td style="padding-left:2em;color:#888">　調整値引き額(端数削除)</td><td></td><td></td><td class="r" style="color:#888">${(discount * sets).toLocaleString()}</td></tr>`
              : "";
          return `<tr><td><b>${project.projectName}</b></td><td class="r">${totalHours * sets}h</td><td class="r">-</td><td class="r"><b>${subtotal.toLocaleString()}</b></td></tr>${detailRows}${discountRow}`;
        })
        .join("");

    let hwTotal = 0,
      devTotal = 0;
    activePlan.projects.forEach((proj) => {
      const project = projectCache[proj.path];
      if (!project) return;
      const sets = setsOverrides[activePlanPath]?.[proj.path] ?? 0;
      const sub =
        (project.parts.reduce(
          (sum, p) => sum + getPartPrice(partMap[p.id] ?? {}) * p.quantity,
          0,
        ) +
          (project.discount ?? 0)) *
        sets;
      if (proj.type === "development") devTotal += sub;
      else hwTotal += sub;
    });

    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    const devTax = Math.floor(devTotal * 0.1);
    const grandTotalInc = hwTotal + devTotal + devTax;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>見積書 - ${activePlan.planName}</title>
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
  .note-small { font-size: 10px; color: #555; margin: 4px 0; }
  table { border-collapse: collapse; width: 100%; margin-top: 8px; }
  th { background: #333; color: #fff; padding: 5px 8px; font-size: 10px; text-align: left; border: 1px solid #333; }
  td { border: 1px solid #bbb; padding: 4px 8px; vertical-align: top; }
  tr.section-hw td { background: #dce8f8; font-weight: bold; font-size: 10px; }
  tr.section-dev td { background: #d6eedd; font-weight: bold; font-size: 10px; }
  tr.subtotal td { background: #eef4ff; font-weight: bold; }
  tr.dev-subtotal td { background: #e8f5e8; font-weight: bold; }
  tr.detail td { background: #fafafa; font-size: 10px; color: #333; }
  tr.grand td { background: #f0f0f0; font-weight: bold; font-size: 13px; }
  tr.tax-row td { background: #fafafa; font-size: 10px; color: #555; }
  tr.total-inc td { background: #e8e8e8; font-weight: bold; font-size: 14px; }
  .r { text-align: right; }
  .footer { margin-top: 24px; font-size: 10px; color: #555; border-top: 1px solid #ccc; padding-top: 8px; }
  .stamp-area { display: grid; grid-template-columns: 1fr auto; gap: 16px; margin-top: 16px; align-items: start; }
  .stamp-box { display: flex; gap: 8px; justify-content: flex-end; }
  .stamp { width: 60px; height: 60px; border: 1px solid #999; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #999; }
</style></head>
<body>
<h1>見 積 書</h1>
<div class="meta-grid">
  <div class="meta-left">
    <div class="client-name">有限会社ウエダ　御中</div>
    <div class="grand-box">合計金額： ¥${grandTotalInc.toLocaleString()} </div>
    <p class="note-small">※上記金額にて下記の通りお見積り申し上げます。</p>
  </div>
  <div class="meta-right">
    <p><b>見積番号：</b></p>
    <p><b>発行日：</b></p>
    <p><b>有効期限：</b>発行日より90日間</p>
    <p><b>開発元：</b>片岡 哲兵</p>
    <p>住所：徳島県板野郡藍住町奥野和田135-35</p>
    <p>連絡先：070-9913-6256</p>
    <p>e-mail：teppy422@au.com</p>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th style="width:45%">品名・仕様</th>
      <th class="r" style="width:18%">単価（円）</th>
      <th class="r" style="width:12%">数量</th>
      <th class="r" style="width:25%">金額（円）</th>
    </tr>
  </thead>
  <tbody>
    <tr class="section-hw"><td colspan="4">■ 機材費</td></tr>
    ${renderRows(hwProjects)}
    <tr class="subtotal">
      <td colspan="3">機材費 小計</td>
      <td class="r">${hwTotal.toLocaleString()}</td>
    </tr>
  </tbody>
</table>

<table style="margin-top:12px">
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
    ${renderDevRows(devProjects)}
    <tr class="dev-subtotal">
      <td colspan="3">開発費 小計</td>
      <td class="r">${devTotal.toLocaleString()}</td>
    </tr>
    <tr class="tax-row">
      <td colspan="3">開発費 消費税相当額（10%）</td>
      <td class="r">${devTax.toLocaleString()}</td>
    </tr>
    <tr class="grand">
      <td colspan="3">機材費＋開発費合計</td>
      <td class="r">¥ ${grandTotalInc.toLocaleString()}</td>
    </tr>
  </tbody>
</table>

<div class="footer">
  <p>【備考】</p>
  <p>・本見積は中小企業省力化投資補助金（一般型）申請用として作成したものです。</p>
  <p>・本システムは業務効率化および作業時間削減を目的としています。</p>
  <p>・本見積は想定工数に基づき積算しています。</p>
  <p>・本見積は既存基幹システムとの接続およびデータ連携実装を含みます。</p>
  <p>・開発費には設計・実装・テスト・調整・引継ぎ資料作成を含みます。</p>
  <p>・本見積は本体価格と消費税相当額を区分して表示しています。</p>
  <p>・本見積の有効期限は発行日より90日間とします。</p>
  <br/>
  <p>※当方は適格請求書発行事業者ではありません。</p>
  <p>※当方は免税事業者です。</p>
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
    <Box>
      {plans.length > 1 && (
        <HStack mb={4} flexWrap="wrap" gap={0.5} justify="space-between">
          <HStack flexWrap="wrap" gap={0.5}>
            {plans.map((plan, i) => (
              <Button
                key={i}
                size={{ base: "xs", sm: "sm" }}
                p="0px"
                bg={i === activePlanIndex ? activeBtnBg : undefined}
                color={
                  i === activePlanIndex
                    ? "white"
                    : isDark
                      ? "gray.200"
                      : "gray.700"
                }
                variant={i === activePlanIndex ? "solid" : "outline"}
                borderColor={
                  i === activePlanIndex
                    ? activeBtnBg
                    : isDark
                      ? "gray.500"
                      : "gray.400"
                }
                _hover={{}}
                onClick={() => {
                  setActivePlanIndex(i);
                  onPlanChange?.(i);
                }}
              >
                {plan.planName}
              </Button>
            ))}
          </HStack>
          <Tooltip label="PDFとして印刷/保存" placement="top">
            <Button
              size={{ base: "xs", sm: "sm" }}
              leftIcon={<DownloadIcon />}
              variant="outline"
              borderColor={
                activePlanIndex ? activeBtnBg : isDark ? "gray.500" : "gray.400"
              }
              onClick={handlePrint}
              className="no-print"
            >
              PDF
            </Button>
          </Tooltip>
        </HStack>
      )}

      {activePlan.note && (
        <Text
          fontSize="sm"
          color="gray.500"
          mb={activePlan.notice ? 1 : 4}
          whiteSpace="pre-line"
        >
          {activePlan.note}
        </Text>
      )}
      {activePlan.notice && (
        <Text fontSize="sm" color="red.500" mb={4} whiteSpace="pre-line">
          {activePlan.notice}
        </Text>
      )}

      <Box
        overflowX="auto"
        bg={bgCard}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
      >
        <Table size="sm">
          <Thead>
            <Tr bg={bgHeader} fontSize={{ base: "11px", sm: "14px" }}>
              <Th>プロジェクト</Th>
              <Th isNumeric display={{ base: "none", md: "table-cell" }}>
                セット単価
              </Th>
              <Th isNumeric>セット数</Th>
              <Th isNumeric>小計</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* 機材費セクション */}
            <Tr bg={hwSectionBg}>
              <Td colSpan={4} py={1}>
                <Badge colorScheme="blue" fontSize="xs">
                  機材費
                </Badge>
              </Td>
            </Tr>
            {hardwareProjects.map(renderProjectRow)}
            <Tr bg={hwSubtotalBg}>
              <Td
                fontWeight="bold"
                fontSize={{ base: "11px", sm: "13px" }}
                color={hwSectionColor}
              >
                機材費 小計
              </Td>
              <Td display={{ base: "none", md: "table-cell" }} />
              <Td />
              <Td
                isNumeric
                fontWeight="bold"
                fontSize={{ base: "11px", sm: "13px" }}
                color={hwSectionColor}
              >
                {hardwareTotal.toLocaleString()}
              </Td>
            </Tr>

            {/* 開発費セクション */}
            <Tr bg={devSectionBg}>
              <Td colSpan={4} py={1}>
                <Badge colorScheme="green" fontSize="xs">
                  開発費
                </Badge>
              </Td>
            </Tr>
            {developmentProjects.map(renderProjectRow)}
            <Tr bg={devSubtotalBg}>
              <Td
                fontWeight="bold"
                fontSize={{ base: "11px", sm: "13px" }}
                color={devSectionColor}
              >
                開発費 小計
              </Td>
              <Td display={{ base: "none", md: "table-cell" }} />
              <Td />
              <Td
                isNumeric
                fontWeight="bold"
                fontSize={{ base: "11px", sm: "13px" }}
                color={devSectionColor}
              >
                {developmentTotal.toLocaleString()}
              </Td>
            </Tr>

            {/* 総合計 */}
            <Tr bg={grandTotalBg}>
              <Td fontWeight="bold" fontSize={{ base: "11px", sm: "14px" }}>
                総合計
              </Td>
              <Td display={{ base: "none", md: "table-cell" }} />
              <Td />
              <Td
                isNumeric
                fontWeight="bold"
                fontSize={{ base: "11px", sm: "14px" }}
              >
                {grandTotal.toLocaleString()}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
