"use client";

import React, { useEffect, useState } from "react";

type Props = {
  folderPath: string;
  removeStrings?: string[];
};

export const LatestUpdateDate: React.FC<Props> = ({
  folderPath,
  removeStrings,
}) => {
  const [latestDate, setLatestDate] = useState<string | null>(null);
  const [latestFileName, setLatestFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestDate = async () => {
      try {
        const res = await fetch(
          `/api/ip/get-latest-updated?path=${encodeURIComponent(folderPath)}`
        );
        const data = await res.json();
        if (res.ok) {
          setLatestDate(formatDate(new Date(data.latestUpdated)));
          setLatestFileName(cleanFileName(data.latestFileName, removeStrings));
        } else {
          setError(data.error || "An unknown error occurred");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch the latest update date");
      }
    };
    fetchLatestDate();
  }, [folderPath]);

  const cleanFileName = (fileName: string, removeStrings?: string[]) => {
    if (!removeStrings) return fileName;
    return removeStrings.reduce(
      (acc, str) => acc.replaceAll(str, ""),
      fileName
    );
  };

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}/${mm}/${dd}`;
  };

  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <div> {latestDate ?? "読み込み中..."}</div>
      <div>{latestFileName ?? "読み込み中..."}</div>
    </div>
  );
};
