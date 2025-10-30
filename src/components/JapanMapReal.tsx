// src/components/JapanMapReal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Box, useColorMode, Text, Spinner } from "@chakra-ui/react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

interface JapanMapRealProps {
  colorMap?: { [key: string]: string }; // { tokyo: '#FF0000', osaka: '#00FF00' }
  width?: string;
  height?: string;
}

// 都道府県名の英語→日本語マッピング
const PREF_NAME_MAP: { [key: string]: string } = {
  hokkaido: "Hokkaido",
  aomori: "Aomori",
  iwate: "Iwate",
  miyagi: "Miyagi",
  akita: "Akita",
  yamagata: "Yamagata",
  fukushima: "Fukushima",
  ibaraki: "Ibaraki",
  tochigi: "Tochigi",
  gunma: "Gunma",
  saitama: "Saitama",
  chiba: "Chiba",
  tokyo: "Tokyo",
  kanagawa: "Kanagawa",
  niigata: "Niigata",
  toyama: "Toyama",
  ishikawa: "Ishikawa",
  fukui: "Fukui",
  yamanashi: "Yamanashi",
  nagano: "Nagano",
  gifu: "Gifu",
  shizuoka: "Shizuoka",
  aichi: "Aichi",
  mie: "Mie",
  shiga: "Shiga",
  kyoto: "Kyoto",
  osaka: "Osaka",
  hyogo: "Hyogo",
  nara: "Nara",
  wakayama: "Wakayama",
  tottori: "Tottori",
  shimane: "Shimane",
  okayama: "Okayama",
  hiroshima: "Hiroshima",
  yamaguchi: "Yamaguchi",
  tokushima: "Tokushima",
  kagawa: "Kagawa",
  ehime: "Ehime",
  kochi: "Kochi",
  fukuoka: "Fukuoka",
  saga: "Saga",
  nagasaki: "Nagasaki",
  kumamoto: "Kumamoto",
  oita: "Oita",
  miyazaki: "Miyazaki",
  kagoshima: "Kagoshima",
  okinawa: "Okinawa",
};

export const JapanMapReal = ({
  colorMap = {},
  width = "100%",
  height = "auto",
}: JapanMapRealProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPref, setHoveredPref] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // マウント検知
  useEffect(() => {
    console.log("🗾 JapanMapReal: Component mounted");
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !svgRef.current) {
      console.log(
        "⚠️ JapanMapReal: Not ready yet (isMounted:",
        isMounted,
        ", svgRef:",
        !!svgRef.current,
        ")"
      );
      return;
    }

    console.log("🗾 JapanMapReal: Starting to render map...");

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // クリア

    const containerWidth = svgRef.current.parentElement?.clientWidth || 600;
    const svgWidth = containerWidth;
    const svgHeight = svgWidth * 0.8; // アスペクト比

    svg
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

    console.log("🗾 Fetching TopoJSON data...");

    // TopoJSONデータを読み込み
    d3.json("/data/japan-topo.json")
      .then((topology: any) => {
        console.log("✅ TopoJSON data loaded:", topology);
        setLoading(false);

        // TopoJSONをGeoJSONに変換
        const geojson = topojson.feature(
          topology,
          topology.objects.prefectures
        ) as any;

        // 投影法設定（日本に最適化）
        const projection = d3
          .geoMercator()
          .center([138, 38]) // 日本の中心座標
          .scale(svgWidth * 2.2) // スケール調整
          .translate([svgWidth / 2, svgHeight / 2]);

        const path = d3.geoPath().projection(projection);

        // 都道府県グループを作成
        const g = svg.append("g");

        // 沖縄の枠を描画（点線の四角形）
        const okinawaBoxX = svgWidth * 0.15;
        const okinawaBoxY = svgHeight * 0.05;
        const okinawaBoxWidth = svgWidth * 0.2;
        const okinawaBoxHeight = svgHeight * 0.25;

        // 右線
        g.append("line")
          .attr("x1", okinawaBoxX + okinawaBoxWidth)
          .attr("y1", okinawaBoxY)
          .attr("x2", okinawaBoxX + okinawaBoxWidth)
          .attr("y2", okinawaBoxY + okinawaBoxHeight * 0.7)
          .attr("stroke", colorMode === "light" ? "#718096" : "#A0AEC0")
          .attr("stroke-width", 0.5);

        // 斜め線
        g.append("line")
          .attr("x1", okinawaBoxX * 1.8)
          .attr("y1", okinawaBoxY + okinawaBoxHeight)
          .attr("x2", okinawaBoxX + okinawaBoxWidth)
          .attr("y2", okinawaBoxY + okinawaBoxHeight * 0.7)
          .attr("stroke", colorMode === "light" ? "#718096" : "#A0AEC0")
          .attr("stroke-width", 0.5);
        // 下線
        g.append("line")
          .attr("x1", okinawaBoxX)
          .attr("y1", okinawaBoxY + okinawaBoxHeight)
          .attr("x2", okinawaBoxX + okinawaBoxWidth * 0.6)
          .attr("y2", okinawaBoxY + okinawaBoxHeight)
          .attr("stroke", colorMode === "light" ? "#718096" : "#A0AEC0")
          .attr("stroke-width", 0.5);

        // 都道府県を描画
        g.selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr("d", (d: any) => {
            const namValue = d.properties.nam || "";

            // 沖縄の場合は座標を左上に移動
            if (namValue.toLowerCase().includes("okinawa")) {
              // ジオメトリをコピーして座標変換
              const okinawaGeometry = JSON.parse(JSON.stringify(d.geometry));

              // 沖縄用の投影（左上に配置）
              const okinawaProjection = d3
                .geoMercator()
                .center([127.5, 26.5]) // 沖縄の中心座標
                .scale(svgWidth * 4) // より大きくスケール
                .translate([svgWidth * 0.18, svgHeight * 0.15]); // 左上に配置

              const okinawaPath = d3.geoPath().projection(okinawaProjection);
              return okinawaPath(okinawaGeometry) as string;
            }

            // その他の都道府県は通常の投影
            return path(d) as string;
          })
          .attr("class", "prefecture")
          .attr("fill", (d: any, i: number) => {
            // 最初の県だけプロパティをログ出力
            if (i === 0) {
              console.log("🗾 First prefecture properties:", d.properties);
              console.log("🗾 Received colorMap:", colorMap);
            }

            // TopoJSONのnamプロパティから都道府県IDを取得
            // 例: "Tokyo To" -> "tokyo", "Kyoto Fu" -> "kyoto", "Osaka Fu" -> "osaka"
            const namValue = d.properties.nam || "";
            const prefId = Object.keys(PREF_NAME_MAP).find(
              (key) =>
                PREF_NAME_MAP[key].toLowerCase() ===
                namValue
                  .toLowerCase()
                  .replace(" to", "")
                  .replace(" fu", "")
                  .replace(" ken", "")
            );

            // カスタムカラーマップをチェック
            if (prefId && colorMap[prefId]) {
              console.log(
                `🎨 Applying color for ${prefId} (${namValue}):`,
                colorMap[prefId]
              );
              return colorMap[prefId];
            }

            // デフォルトカラー（グレー）
            return colorMode === "light" ? "#E2E8F0" : "#2D3748";
          })
          .attr("stroke", colorMode === "light" ? "#2D3748" : "#E2E8F0")
          .attr("stroke-width", 0.5)
          .style("cursor", "default")
          .on("mouseenter", function (_event, d: any) {
            d3.select(this).attr("opacity", 0.7).attr("stroke-width", 2);
            setHoveredPref(d.properties.nam_ja || d.properties.name);
          })
          .on("mouseleave", function () {
            d3.select(this).attr("opacity", 1).attr("stroke-width", 0.5);
            setHoveredPref(null);
          });
      })
      .catch((err) => {
        console.error("❌ Error loading TopoJSON:", err);
        setError(`地図データの読み込みに失敗しました: ${err.message}`);
        setLoading(false);
      });

    // クリーンアップ関数
    return () => {
      console.log("🗾 Cleaning up map...");
    };
  }, [isMounted, colorMap, colorMode]);

  return (
    <Box
      width={width}
      height={height}
      maxW="800px"
      mx="auto"
      my={0}
      position="relative"
    >
      {/* ローディング表示 */}
      {loading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={colorMode === "light" ? "white" : "gray.800"}
          zIndex={20}
        >
          <Spinner size="xl" color="orange.500" />
          <Text ml={3}>地図を読み込み中...</Text>
        </Box>
      )}

      {/* エラー表示 */}
      {error && (
        <Box
          p={4}
          borderWidth="1px"
          borderRadius="md"
          borderColor="red.500"
          bg={colorMode === "light" ? "red.50" : "red.900"}
        >
          <Text color="red.500">{error}</Text>
        </Box>
      )}

      {/* ホバー時の都道府県名表示 */}
      {hoveredPref && !loading && (
        <Box
          position="absolute"
          top="10px"
          left="10px"
          bg={colorMode === "light" ? "white" : "gray.800"}
          px={3}
          py={2}
          borderRadius="md"
          boxShadow="md"
          zIndex={10}
          pointerEvents="none"
        >
          <Text fontWeight="bold" fontSize="lg">
            {hoveredPref}
          </Text>
        </Box>
      )}

      {/* SVG要素（常にレンダリング） */}
      <svg
        ref={svgRef}
        style={{ display: "block", width: "100%", minHeight: "400px" }}
      />
    </Box>
  );
};
