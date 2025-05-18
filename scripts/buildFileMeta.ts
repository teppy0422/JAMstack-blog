// scripts/buildFileMeta.ts
import fs from "fs";
import path from "path";

const downloadDir = path.resolve("public/download");
const folderNames = fs
  .readdirSync(downloadDir)
  .filter((name) => fs.statSync(path.join(downloadDir, name)).isDirectory());

const result: Record<
  string,
  { latestFile: string | null; latestUpdated: string | null }
> = {};

for (const folderName of folderNames) {
  const folderPath = path.join(downloadDir, folderName);
  const files = fs.readdirSync(folderPath);

  let latestFile: string | null = null;
  let latestDate: Date | null = null;

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);
    if (!latestDate || stat.mtime > latestDate) {
      latestDate = stat.mtime;
      latestFile = file;
    }
  }

  result[folderName] = {
    latestFile,
    latestUpdated: latestDate ? latestDate.toISOString() : null,
  };
}

fs.writeFileSync(
  path.resolve("public/download/download-meta.json"),
  JSON.stringify(result, null, 2)
);
