"use client";

import { useEffect, useState } from "react";
import { getLatestFileMeta } from "@/lib/getLatestFileMeta";

type Props = {
  folderPath: string; // 例: "./download/sjp/"
  removeStrings?: string[]; // ["Sjp", ".zip", "_"] など
};

export default function LatestUpdateDate({
  folderPath,
  removeStrings = [],
}: Props) {
  const [dateStr, setDateStr] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    const folderName = folderPath.split("/").filter(Boolean).pop(); // "sjp"
    if (!folderName) return;

    getLatestFileMeta(folderName).then((meta) => {
      if (!meta) return;

      if (meta.latestUpdated) {
        const date = new Date(meta.latestUpdated);
        const formatted = date.toLocaleDateString(); // "2025/5/18" など
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
