import fs from "fs";
import path from "path";

const publicDir = path.resolve("public");

// 再帰的にフォルダサイズを計算
function calculateFolderSize(folderPath: string): number {
  let totalSize = 0;

  try {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const entry of entries) {
      // 隠しファイルやシステムファイルをスキップ
      if (
        entry.name === ".DS_Store" ||
        entry.name === "Thumbs.db" ||
        entry.name.startsWith(".")
      ) {
        continue;
      }

      const fullPath = path.join(folderPath, entry.name);

      if (entry.isDirectory()) {
        totalSize += calculateFolderSize(fullPath); // 再帰処理
      } else if (entry.isFile()) {
        const stat = fs.statSync(fullPath);
        totalSize += stat.size;
      }
    }
  } catch (error) {
    console.error(`Error reading folder ${folderPath}:`, error);
  }

  return totalSize;
}

// publicフォルダのサイズを計算
const publicSize = calculateFolderSize(publicDir);

const result = {
  totalBytes: publicSize,
  totalGB: (publicSize / (1024 * 1024 * 1024)).toFixed(3),
  calculatedAt: new Date().toISOString(),
};

// public/vercel-size.json に保存
fs.writeFileSync(
  path.resolve(publicDir, "vercel-size.json"),
  JSON.stringify(result, null, 2)
);

console.log(`Vercel public folder size: ${result.totalGB} GB (${publicSize} bytes)`);
