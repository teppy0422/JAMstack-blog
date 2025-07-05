"use client";
import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Textarea,
  Text,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import TerminalGraph from "@/components/test/TerminalGraph";
import FixedNodeInputList from "@/components/test/FixedNodeInputList";
type FixedNode = {
  terminal: string;
  x: number;
  y: number;
};

export default function TxtAnalyzerPage() {
  const [analyzedText, setAnalyzedText] = useState("");
  const [fixedNodes, setFixedNodes] = useState<FixedNode[]>([
    { terminal: "", x: 0, y: 0 },
  ]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      analyzeText(text);
    };
    reader.readAsText(file, "Shift-JIS");
  };

  const analyzeText = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");
    const header = lines[0].split(",").map((h) => h.trim());
    const dataLines = lines.slice(1);

    const startTerminalIndex = header.indexOf("始点側端末識別子");
    const startPartIndex = header.indexOf("始点側端末矢崎品番");
    const endTerminalIndex = header.indexOf("終点側端末識別子");
    const endPartIndex = header.indexOf("終点側端末矢崎品番");
    const lengthIndex = header.indexOf("線長");

    if (
      startTerminalIndex === -1 ||
      startPartIndex === -1 ||
      endTerminalIndex === -1 ||
      endPartIndex === -1 ||
      lengthIndex === -1
    ) {
      setAnalyzedText("❌ 必要な列が見つかりません。列名を確認してください。");
      return;
    }

    const summaryMap = new Map<
      string,
      {
        terminal: string;
        part: string;
        wireCount: number;
        connections: Map<
          string,
          {
            terminal: string;
            part: string;
            count: number;
            totalLength: number;
          }
        >;
      }
    >();

    const ensureEntry = (terminal: string, part: string) => {
      const key = `${terminal}||${part}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          terminal,
          part,
          wireCount: 0,
          connections: new Map(),
        });
      }
      return summaryMap.get(key)!;
    };

    for (const line of dataLines) {
      const cols = line.split(",").map((c) => c.trim());
      if (cols.length <= lengthIndex) continue;

      const startTerminal = cols[startTerminalIndex];
      const startPart = cols[startPartIndex];
      const endTerminal = cols[endTerminalIndex];
      const endPart = cols[endPartIndex];

      const rawLength = parseFloat(cols[lengthIndex]);
      const length = isNaN(rawLength) ? 0 : rawLength;

      const start = ensureEntry(startTerminal, startPart);
      const end = ensureEntry(endTerminal, endPart);

      start.wireCount++;
      end.wireCount++;

      const endKey = `${endTerminal}||${endPart}`;
      const startKey = `${startTerminal}||${startPart}`;

      const updateConn = (
        from: typeof start,
        toKey: string,
        to: { terminal: string; part: string },
        lengthValue: number
      ) => {
        if (!from.connections.has(toKey)) {
          from.connections.set(toKey, {
            terminal: to.terminal,
            part: to.part,
            count: 0,
            totalLength: 0,
          });
        }
        const conn = from.connections.get(toKey)!;
        conn.count++;
        conn.totalLength += lengthValue;
      };

      updateConn(
        start,
        endKey,
        { terminal: endTerminal, part: endPart },
        length
      );
      updateConn(
        end,
        startKey,
        { terminal: startTerminal, part: startPart },
        length
      );
    }

    const result = Array.from(summaryMap.values()).map((entry) => ({
      terminal: entry.terminal,
      part: entry.part,
      wireCount: entry.wireCount,
      connections: Array.from(entry.connections.values()).map((conn) => ({
        terminal: conn.terminal,
        part: conn.part,
        count: conn.count,
        avgLength:
          conn.count > 0
            ? Math.round((conn.totalLength / conn.count) * 10) / 10
            : 0,
      })),
    }));

    setAnalyzedText(JSON.stringify(result, null, 2));
  };

  // 解析結果をJSONとしてパース
  const parsedData = useMemo(() => {
    try {
      const data = JSON.parse(analyzedText);
      // 総電線数が多い順にソート
      return data;
      // return data.sort((a: any, b: any) => b.wireCount - a.wireCount);
    } catch {
      return [];
    }
  }, [analyzedText]);

  const downloadAnalyzedText = () => {
    const blob = new Blob([analyzedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analyzed.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box p={6}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <FixedNodeInputList
        fixedNodes={fixedNodes}
        setFixedNodes={setFixedNodes}
      />
      <Textarea
        mt={4}
        rows={10}
        value={analyzedText}
        onChange={(e) => setAnalyzedText(e.target.value)}
      />
      {parsedData.length > 0 && (
        <Box mt={10}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            🔌 配置図（電線長ベース）
          </Text>
          <TerminalGraph data={parsedData} fixedNodes={fixedNodes} />
        </Box>
      )}

      <Button mt={4} onClick={downloadAnalyzedText}>
        ダウンロード
      </Button>
      <Box mt={8}>
        <VStack align="stretch" spacing={4}>
          {parsedData.map((entry: any, idx: number) => (
            <Box
              key={idx}
              p={4}
              border="1px solid #ccc"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="bold" fontSize="lg">
                📦 端末: {entry.terminal}（{entry.part}）
              </Text>
              <Text mt={1}>🧵 総電線数: {entry.wireCount}</Text>

              {entry.connections.length > 0 && (
                <>
                  <Text mt={2} fontWeight="semibold">
                    🔗 相手端末:
                  </Text>
                  <VStack align="start" pl={4} spacing={1}>
                    {entry.connections.map((conn, i) => (
                      <Box key={i}>
                        <Text>
                          ・{conn.terminal}({conn.part}): {conn.count}本
                          <Text as="span" color="gray.600" fontSize="sm">
                            (線長: {conn.avgLength}）
                          </Text>
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </>
              )}
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
