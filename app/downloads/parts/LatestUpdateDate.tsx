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

  useEffect(() => {
    // public/download/ 以下の相対パスに変換（例: "sjp/nested"）
    const relativePath = folderPath
      .replace(/^\.?\/?download\/?/, "") // remove leading ./download/
      .replace(/\/+$/, ""); // remove trailing slash

    if (!relativePath) return;

    getLatestFileMeta(relativePath).then((meta) => {
      console.log("meta from getLatestFileMeta:", meta); // ← 追加
      if (!meta) return;

      if (meta.latestUpdated) {
        const date = new Date(meta.latestUpdated);
        console.log("Parsed date:", date); // ← 追加
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
    });
  }, [folderPath, removeStrings]);

  if (!dateStr && !fileName) return null;

  return (
    <span>
      {dateStr}
      <br />
      {fileName}
    </span>
  );
}
