"use client"; // ← 最重要（これがないとReactのuseStateもonClickも無視される）

import { useState } from "react";
import { VStack, Textarea, Button, Input, Text } from "@chakra-ui/react";

export default function Page() {
  const [d, setD] = useState("m 10,10 l 20,0 l 0,20 z"); // ←テスト用シンプルd
  const [scale, setScale] = useState("2");
  const [scaledD, setScaledD] = useState("");

  const handleScale = () => {
    console.log("ボタン押された");
    const scaleNum = parseFloat(scale);
    if (isNaN(scaleNum)) {
      setScaledD("スケールが無効です");
      return;
    }

    const result = d.replace(/-?\d*\.?\d+/g, (n) => {
      const parsed = parseFloat(n);
      return isNaN(parsed) ? n : (parsed * scaleNum).toFixed(2);
    });

    console.log("変換結果:", result);
    setScaledD(result);
  };

  return (
    <VStack spacing={4} p={6} align="stretch">
      <Text fontWeight="bold">スケール倍率</Text>
      <Input
        value={scale}
        onChange={(e) => setScale(e.target.value)}
        type="number"
        step="0.1"
      />
      <Text fontWeight="bold">元の d 属性</Text>
      <Textarea value={d} onChange={(e) => setD(e.target.value)} rows={6} />
      <Button onClick={handleScale} colorScheme="blue">
        スケーリング実行
      </Button>
      <Text fontWeight="bold">変換後の d 属性</Text>
      <Textarea value={scaledD} readOnly rows={6} />
    </VStack>
  );
}
