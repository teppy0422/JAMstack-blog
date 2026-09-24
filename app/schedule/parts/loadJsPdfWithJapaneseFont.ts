const FONT_URL = "/fonts/NotoSansJP-Regular.ttf";
const FONT_VFS_NAME = "NotoSansJP-Regular.ttf";
const FONT_NAME = "NotoSansJP";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

export async function createJsPdfWithJapaneseFont() {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const res = await fetch(FONT_URL);
  const buf = await res.arrayBuffer();
  const base64 = arrayBufferToBase64(buf);

  doc.addFileToVFS(FONT_VFS_NAME, base64);
  doc.addFont(FONT_VFS_NAME, FONT_NAME, "normal");
  doc.addFont(FONT_VFS_NAME, FONT_NAME, "bold");
  doc.setFont(FONT_NAME);

  return { doc, fontName: FONT_NAME };
}
