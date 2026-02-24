"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  List,
  ListItem,
  ListIcon,
  Divider,
  ChakraProvider,
  extendTheme,
  IconButton,
  Badge,
  Avatar,
  Code,
  Image,
  Kbd,
  AvatarGroup,
  createIcon,
  Spacer,
  Center,
  useColorMode,
  useToast,
  OrderedList,
  UnorderedList,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  DarkMode,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { PiAppWindowFill, PiArrowFatLineDownLight } from "react-icons/pi";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "@/components/content";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/ui/BasicDrawer";
import Frame from "../../components/frame";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/ui/CustomBadge";
import DownloadLink from "../../components/DownloadLink";
import UnderlinedTextWithDrawer from "../../components/UnderlinedTextWithDrawer";
import ExternalLink from "../../components/ExternalLink";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ReferenceSettingModal from "../../../../src/components/howto/office/referenceSettingModal";
import { useUserContext } from "@/contexts/useUserContext";
import { supabase } from "@/utils/supabase/client";
import { getIpAddress } from "@/lib/getIpAddress";
import { BsFiletypeExe } from "react-icons/bs";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import DownloadButton from "@/components/ui/DownloadButton2";
import UnzipModal from "@/components/howto/os/UnzipModal";
import FontInstallModal from "@/components/howto/os/FontInstall";
import { getLocalIp } from "../../components/getLocalIp";
import { Key } from "@/components/ui/Key";
import { ImageWithHighlight } from "../../../../src/components/ImageWidthHighlight";
import VBATrustSettingsPage from "@/components/howto/office/VbaTrustSettings";

import ModalYps from "app/downloads/tabs/yps/yps";
import BorderBox from "@/components/ui/BorderBox";
import { downloadLatestFile } from "@/lib/downloadLatestFile";
import CodeBlock from "@/components/CodeBlock";

import SchedulePage from "./parts/SchedulePage";
import DataFlowDiagram from "app/skillBlogs/pages/0015/parts/DataFlowDiagram";
import DataFlowDiagram2 from "app/skillBlogs/pages/0015/parts/DataFlowDiagram2";
import { UrlModalButton } from "@/components/ui/UrlModalButton";
import { ImageSelector } from "@/components/ui/ImageSelector";
import SpecTable_terminal from "./parts/SpecTable_terminal";
import SpecTable_sarver from "./parts/SpecTable_sarver";
import PartListTable from "../../../components/PartListTable";
import PartListPlan from "../../../components/PartListPlan";

import dynamic from "next/dynamic";
import QR_Payload from "./parts/QrPayloadTable";
const FloorPlan = dynamic(() => import("./parts/FloorLayout/ueda"), {
  ssr: false,
});

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

function EstimateSection() {
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
        <Text fontWeight="bold" fontSize="sm" mb={2}>
          開発費の根拠（工数内訳）― {planName}
        </Text>
        <Grid
          templateColumns="auto 1fr"
          gap={1}
          fontSize="xs"
          color="gray.500"
          mb={3}
        >
          <GridItem>市場相場</GridItem>
          <GridItem>フリーランスエンジニア：5,000〜15,000円/時</GridItem>
          <GridItem></GridItem>
          <GridItem>中小SIer外注単価：6,000〜10,000円/時</GridItem>
          <GridItem></GridItem>
          <GridItem>大手SIer（SE職種）：10,000〜20,000円/時</GridItem>
          <GridItem>採用単価</GridItem>
          <GridItem>
            8,000円/時（相場中央〜やや低め、個人開発による適正価格）
          </GridItem>
        </Grid>
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

function EstimateSection2() {
  const { colorMode } = useColorMode();
  const [planIndex, setPlanIndex] = useState(2);
  const [devProjects, setDevProjects] = useState<
    { proj: PlanProject; project: ProjectData; parts: PartInfo[] }[]
  >([]);
  const [devTotal, setDevTotal] = useState(0);
  const [planName, setPlanName] = useState("");

  const partMapRef = React.useRef<Record<number, PartInfo>>({});

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
      partMapRef.current = partMap;

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
        // 見積書2専用: dev-base.json の代わりに dev-base-v2.json を使用
        const path =
          proj.path === "dev-base.json" ? "dev-base-v2.json" : proj.path;
        const res = await fetch(`/partlist/projects/${path}`);
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
    const devTax = Math.floor(devTotal * 0.1);
    const grandTotal = devTotal + devTax;
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    const estNo = `${planName.replace(/\s/g, "")}-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

    const rows = devProjects
      .map(({ project, parts, proj }) => {
        const discount = project.discount ?? 0;
        const subtotal =
          (parts.reduce((s, p) => s + getPartPrice(p), 0) + discount) *
          proj.sets;
        const totalHours = parts.reduce((s, p) => s + (p.hours ?? 0), 0);
        const detailRows = parts
          .map((p) => {
            const price = getPartPrice(p);
            const perP =
              p.perPrice != null
                ? p.perPrice
                : p.hours
                  ? Math.round(price / p.hours)
                  : 0;
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
  .footer { margin-top: 24px; font-size: 12px; color: #333; border-top: 1px solid #ccc; padding-top: 8px; }
  .stamp-area { display: grid; grid-template-columns: 1fr auto; gap: 16px; margin-top: 16px; align-items: start; }
  .stamp-box { display: flex; gap: 8px; justify-content: flex-end; }
  .stamp { width: 60px; height: 60px; border: 1px solid #999; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #999; }
</style></head>
<body>
<h1>見 積 書</h1>
<div class="meta-grid">
  <div class="meta-left">
    <div class="client-name">有限会社ウエダ　御中</div>
    <div class="grand-box">合計金額： ¥${grandTotal.toLocaleString()} </div>
    <p class="note-small">※上記金額にて下記の通りお見積り申し上げます。</p>
  </div>
  <div class="meta-right">
    <p><b>見積番号：</b>${estNo}</p>
    <p><b>発行日：</b>${dateStr}</p>
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
    <>
      <HStack justify="space-between" mb={2}>
        <Text fontSize="sm">確認日:2026/2/10</Text>
        <Button
          size="xs"
          leftIcon={<FaDownload />}
          variant="outline"
          borderColor={colorMode === "light" ? "black" : "white"}
          onClick={handlePrint}
        >
          PDF
        </Button>
      </HStack>
      <Box mt={2}>
        <Text fontWeight="bold" fontSize="sm" mb={2}>
          開発費の根拠（工数内訳）― {planName}
        </Text>
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
            合計
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

const BlogPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    currentUserId,
    currentUserName,
    currentUserMainCompany,
    currentUserCompany,
    currentUserCreatedAt,
    getUserById,
    isLoading: isLoadingContext,
  } = useUserContext();

  const { setLanguage } = useLanguage();
  //右リストの読み込みをlanguage取得後にする
  const { language } = useLanguage();
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  useEffect(() => {
    if (language) {
      setIsLanguageLoaded(true);
    }
  }, [language]);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const toast = useToast();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // 点滅アニメーションを定義
  const blink = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  `;
  const blinkAnimation = `${blink} 0.8s infinite`;

  function RequirementTable({
    requirements,
  }: {
    requirements: Record<string, string>;
  }) {
    return (
      <Grid templateColumns="150px 1fr" gap={1} fontSize="sm">
        {Object.entries(requirements).map(([label, value]) => (
          <React.Fragment key={label}>
            <GridItem fontWeight="semibold" color="gray.600">
              {label}
            </GridItem>
            <GridItem whiteSpace="pre-line">{value}</GridItem>
          </React.Fragment>
        ))}
      </Grid>
    );
  }
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
  }
  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs} isThrough hideMenu>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                borderWidth={1}
              />
            </AvatarGroup>
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>
              {getMessage({
                ja: "開発",
                language,
              })}
            </Text>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "PreHarnessPro(仮)",
              us: "",
              cn: "",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "名称未定",
              us: "",
              cn: "",
              language,
            })}
          />

          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            {getMessage({
              ja: "更新日",
              language,
            })}
            :2026-02-09
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title={"1." + getMessage({ ja: "概要", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <VStack align="start" spacing={3} mt={3}>
            <ExternalLink
              href="https://shoryokuka.smrj.go.jp/ippan/"
              text="中小企業省力化投資補助金（一般型）公式サイト"
            />
            <Text fontSize="sm">
              人手不足に悩む中小企業等が、IoT・ロボット等のデジタル技術を活用した設備を導入する際の費用を補助する制度です。
              ハード・ソフトを自由に組み合わせて申請できます。
            </Text>
            <Grid templateColumns="auto 1fr" gap={2} fontSize="sm" w="100%">
              <GridItem fontWeight="semibold" color="gray.500">
                補助対象者
              </GridItem>
              <GridItem>
                中小企業者、小規模企業者、特定非営利活動法人 など
              </GridItem>

              <GridItem fontWeight="semibold" color="gray.500">
                補助率
              </GridItem>
              <GridItem>
                中小企業：1/2（賃上げ実施で2/3）／小規模企業者：2/3
              </GridItem>

              <GridItem fontWeight="semibold" color="gray.500">
                補助上限額
              </GridItem>
              <GridItem>
                750万〜8,000万円（従業員数により異なる）
                <br />
                賃上げ実施で上限額引き上げ可（最大1億円）
              </GridItem>

              <GridItem fontWeight="semibold" color="gray.500">
                対象設備
              </GridItem>
              <GridItem>
                IoT・ロボット・AI等、人手不足解消に効果があるデジタル技術を活用した設備
              </GridItem>

              <GridItem fontWeight="semibold" color="gray.500">
                申請状況
              </GridItem>
              <GridItem>
                第5回公募申請受付中（GビズIDプライムアカウント必須）
              </GridItem>
            </Grid>
          </VStack>
        </SectionBox>
        <SectionBox
          id="section2"
          title={"2." + getMessage({ ja: "システム概要書", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <VStack align="start" spacing={3} mt={3}>
            <Text fontSize="sm" color="gray.500">
              ※作成中
            </Text>
          </VStack>
        </SectionBox>
        <SectionBox
          id="section3"
          title={"3." + getMessage({ ja: "省力化効果", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <VStack align="start" spacing={3} mt={3}>
            <Text fontSize="sm" color="gray.500">
              ※
            </Text>
          </VStack>
        </SectionBox>
        <SectionBox
          id="section4"
          title={"4." + getMessage({ ja: "見積書", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <EstimateSection />
        </SectionBox>
        <SectionBox
          id="section5"
          title={
            "5." + getMessage({ ja: "見積書（開発費のみ請求）", language })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <EstimateSection2 />
        </SectionBox>
        <SectionBox
          id="section6"
          title={"6." + getMessage({ ja: "システム構成図", language })}
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box mt={3}>
            <DataFlowDiagram />
          </Box>
        </SectionBox>
        <SectionBox
          id="section7"
          title={
            "7." + getMessage({ ja: "導入スケジュール(プランC)", language })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box mt={3}>
            <SchedulePage />
          </Box>
        </SectionBox>
      </Frame>
    </>
  );
};

export default BlogPage;
