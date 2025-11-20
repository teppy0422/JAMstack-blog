"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const publicDir = path_1.default.resolve("public");
// 再帰的にフォルダサイズを計算
function calculateFolderSize(folderPath) {
    let totalSize = 0;
    try {
        const entries = fs_1.default.readdirSync(folderPath, { withFileTypes: true });
        for (const entry of entries) {
            // 隠しファイルやシステムファイルをスキップ
            if (entry.name === ".DS_Store" ||
                entry.name === "Thumbs.db" ||
                entry.name.startsWith(".")) {
                continue;
            }
            const fullPath = path_1.default.join(folderPath, entry.name);
            if (entry.isDirectory()) {
                totalSize += calculateFolderSize(fullPath); // 再帰処理
            }
            else if (entry.isFile()) {
                const stat = fs_1.default.statSync(fullPath);
                totalSize += stat.size;
            }
        }
    }
    catch (error) {
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
fs_1.default.writeFileSync(path_1.default.resolve(publicDir, "vercel-size.json"), JSON.stringify(result, null, 2));
console.log(`Vercel public folder size: ${result.totalGB} GB (${publicSize} bytes)`);
