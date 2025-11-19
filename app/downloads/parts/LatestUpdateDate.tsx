"use client";

import { useEffect, useState } from "react";
import { getLatestFileMeta } from "@/lib/getLatestFileMeta";

type Props = {
  folderPath: string; // e.g., "./download/sjp/nested/"
  removeStrings?: string[]; // ["Sjp", ".zip", "_"]
};

export default function LatestUpdateDate({
  folderPath,
  removeStrings = [],
}: Props) {
  const [dateStr, setDateStr] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");

  useEffect(() => {
    // public/download/ 以下の相対パスに変換（例: "sjp/nested"）
    const relativePath = folderPath
      .replace(/^\.?\/?download\/?/, "") // remove leading ./download/
      .replace(/\/+$/, ""); // remove trailing slash

    if (!relativePath) return;

    getLatestFileMeta(relativePath).then((meta) => {
      if (!meta) return;

      if (meta.latestUpdated) {
        const date = new Date(meta.latestUpdated);
        const formatted = date.toLocaleDateString("ja-JP", {
          timeZone: "Asia/Tokyo",
        });
        setDateStr(formatted);
      }

      if (meta.latestFile) {
        let name = meta.latestFile;
        for (const str of removeStrings) {
          name = name.replaceAll(str, "");
        }
        setFileName(name);
      }

      if (meta.fileSize) {
        // ファイルサイズを人間が読みやすい形式に変換
        const bytes = meta.fileSize;
        if (bytes < 1024) {
          setFileSize(`${bytes} B`);
        } else if (bytes < 1024 * 1024) {
          setFileSize(`${(bytes / 1024).toFixed(1)} KB`);
        } else if (bytes < 1024 * 1024 * 1024) {
          setFileSize(`${(bytes / (1024 * 1024)).toFixed(1)} MB`);
        } else {
          setFileSize(`${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`);
        }
      }
    });
  }, [folderPath, removeStrings]);

  if (!dateStr && !fileName) return null;

  return (
    <span>
      #{dateStr}
      <br />
      {fileName}
      {fileSize && (
        <>
          <br />
          {fileSize}
        </>
      )}
    </span>
  );
}
