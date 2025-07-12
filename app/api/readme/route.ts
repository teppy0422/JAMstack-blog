// app/api/readme/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { marked } from "marked";

marked.setOptions({ breaks: true });

export async function GET() {
  try {
    const readmePath = path.join(process.cwd(), "README.md");

    if (!fs.existsSync(readmePath)) {
      return NextResponse.json(
        { error: "README.md not found" },
        { status: 404 }
      );
    }

    const readmeContent = fs.readFileSync(readmePath, "utf-8");
    const htmlContent = marked(readmeContent);

    return NextResponse.json({ html: htmlContent });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
