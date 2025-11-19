// src/lib/getLatestFileMeta.ts
type FileMeta = {
  latestFile: string | null;
  latestUpdated: string | null;
  fileSize: number | null;
};

export async function getLatestFileMeta(
  folder: string
): Promise<FileMeta | undefined> {
  const res = await fetch(`/download/download-meta.json`, {
    cache: "no-store", // or "force-cache" if preferred
  });

  if (!res.ok) throw new Error("Failed to load metadata");

  const allMeta = await res.json();
  return allMeta[folder]; // { latestFile, latestUpdated, fileSize } or undefined
}
