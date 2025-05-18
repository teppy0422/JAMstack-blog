"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/buildFileMeta.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const downloadDir = path_1.default.resolve("public/download");
const folderNames = fs_1.default
    .readdirSync(downloadDir)
    .filter((name) => fs_1.default.statSync(path_1.default.join(downloadDir, name)).isDirectory());
const result = {};
for (const folderName of folderNames) {
    const folderPath = path_1.default.join(downloadDir, folderName);
    const files = fs_1.default.readdirSync(folderPath);
    let latestFile = null;
    let latestDate = null;
    for (const file of files) {
        const filePath = path_1.default.join(folderPath, file);
        const stat = fs_1.default.statSync(filePath);
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
fs_1.default.writeFileSync(path_1.default.resolve("public/download/download-meta.json"), JSON.stringify(result, null, 2));
