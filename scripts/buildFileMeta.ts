import fs from "fs";
import path from "path";

const downloadDir = path.resolve("public/download");

const result: Record<
  string,
  { latestFile: string | null; latestUpdated: string | null }
> = {};

// 再帰的に処理する関数
function processFolderRecursively(folderPath: string, relativePath: string) {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  let latestFile: string | null = null;
  let latestDate: Date | null = null;

  for (const entry of entries) {
    // 隠しファイルやシステムファイルをスキップ
    if (
      entry.name === ".DS_Store" ||
      entry.name === "Thumbs.db" ||
      entry.name === "download-meta.json" ||
      entry.name.startsWith(".")
    ) {
      continue;
    }

    const fullPath = path.join(folderPath, entry.name);
    const relPath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      processFolderRecursively(fullPath, relPath); // 再帰処理
    } else if (entry.isFile()) {
      const stat = fs.statSync(fullPath);
      if (!latestDate || stat.mtime > latestDate) {
        latestDate = stat.mtime;
        latestFile = entry.name;
      }
    }
  }

  // ファイルが存在する場合のみ記録
  if (latestFile) {
    result[relativePath] = {
      latestFile,
      latestUpdated: latestDate ? latestDate.toISOString() : null,
    };
  }
}

// download直下から開始
processFolderRecursively(downloadDir, ".");

fs.writeFileSync(
  path.resolve(downloadDir, "download-meta.json"),
  JSON.stringify(result, null, 2)
);
