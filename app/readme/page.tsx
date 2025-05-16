// app/readme/page.tsx
import fs from "fs";
import path from "path";
import { marked } from "marked";
import styles from "@/styles/home.module.scss";

export default async function ReadmePage() {
  // ルートの README.md を読み込む
  const readmePath = path.join(process.cwd(), "README.md");
  const raw = fs.readFileSync(readmePath, "utf-8");
  const html = marked(raw);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        📘 README プレビュー
      </h1>
      <div
        className={styles.markdown}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
