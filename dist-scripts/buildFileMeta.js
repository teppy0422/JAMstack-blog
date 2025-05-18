"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const downloadDir = path_1.default.resolve("public/download");
const result = {};
// 再帰的に処理する関数
function processFolderRecursively(folderPath, relativePath) {
    const entries = fs_1.default.readdirSync(folderPath, { withFileTypes: true });
    let latestFile = null;
    let latestDate = null;
    for (const entry of entries) {
        const fullPath = path_1.default.join(folderPath, entry.name);
        const relPath = path_1.default.join(relativePath, entry.name);
        if (entry.isDirectory()) {
            processFolderRecursively(fullPath, relPath); // 再帰処理
        }
        else if (entry.isFile()) {
            const stat = fs_1.default.statSync(fullPath);
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
fs_1.default.writeFileSync(path_1.default.resolve(downloadDir, "download-meta.json"), JSON.stringify(result, null, 2));
