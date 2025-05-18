import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folderPath = searchParams.get("path");

  if (!folderPath) {
    return NextResponse.json(
      { error: "Missing path parameter" },
      { status: 400 }
    );
  }

  try {
    const basePath = path.resolve(process.cwd(), "public"); // 操作可能なベースディレクトリ
    const resolvedPath = path.resolve(basePath, folderPath);

    if (!resolvedPath.startsWith(basePath)) {
      return NextResponse.json(
        { error: "Access to this directory is not allowed" },
        { status: 403 }
      );
    }

    const files = fs.readdirSync(resolvedPath);
    let latestFile: String | null = null;
    let latestDate: Date | null = null;

    for (const file of files) {
      const fullPath = path.join(resolvedPath, file);
      const stat = fs.statSync(fullPath);

      if (!latestDate || stat.mtime > latestDate) {
        latestDate = stat.mtime;
        latestFile = file;
      }
    }

    if (!latestDate) {
      return NextResponse.json(
        { error: "No files found in the specified directory" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      latestUpdated: latestDate,
      latestFileName: latestFile,
    });
  } catch (err) {
    console.error("Error reading directory:", err);
    return NextResponse.json(
      { error: "Failed to retrieve the latest updated file" },
      { status: 500 }
    );
  }
}
