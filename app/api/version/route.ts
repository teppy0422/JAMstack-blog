import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const project = searchParams.get("project");

  if (!project) {
    return NextResponse.json(
      { error: "Missing project parameter" },
      { status: 400 }
    );
  }

  try {
    // publicフォルダ内のdownload-meta.jsonのパスを指定
    const filePath = path.join(
      process.cwd(),
      "public",
      "download",
      "download-meta.json"
    );

    // ファイル読み込み
    const fileData = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(fileData);

    // 指定されたプロジェクトのデータを取得
    const data = json[project];

    if (!data || !data.latestFile) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
