import React from "react";
import fs from "fs";
import path from "path";

import Ui from "./client";

import { Text } from "@chakra-ui/react";

// ファイル名から最大の数字を取得する関数
function getMaxVersionNumber(directory: string): {
  maxVersionString: string;
  lastModified: Date;
} {
  try {
    const files = fs.readdirSync(directory);
    let maxNumber = 0;
    let maxVersionString = "";
    let lastModified = new Date(0); // 初期値を設定

    files.forEach((file) => {
      // 'Sjp'で始まり、'_.zip'で終わるファイル名から数字を抽出
      const match = file.match(/^Sjp([\d.]+)_\.zip$/);
      if (match) {
        const versionString = match[1];
        const number = match[1].replace(/\./g, "");
        if (Number(number) > maxNumber) {
          maxNumber = Number(number);
          maxVersionString = versionString; // ドットを含む元の形式を保持
          const filePath = path.join(directory, file);
          const stats = fs.statSync(filePath);
          lastModified = stats.mtime; // 更新日時を取得
        }
      }
    });
    return { maxVersionString, lastModified };
  } catch (error) {
    console.error("Error reading directory:", error);
    return { maxVersionString: "0", lastModified: new Date(0) }; // デフォルト値を返す
  }
}

const Downloads = async () => {
  const directoryPath = path.join(
    process.cwd(),
    "public/files/download/html/Sjp/"
  );
  const { maxVersionString, lastModified } = getMaxVersionNumber(directoryPath);

  return (
    <>
      <Text ml={4} className="print-only">
        ※別紙3
      </Text>
      <Ui maxVersionString={maxVersionString} lastModified={lastModified} />
    </>
  );
};
export default Downloads;
