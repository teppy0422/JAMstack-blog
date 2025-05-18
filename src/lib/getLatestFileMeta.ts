// src/lib/getLatestFileMeta.ts
export async function getLatestFileMeta(folder: string) {
  const res = await fetch(`/download/download-meta.json`, {
    cache: "no-store", // or "force-cache" if preferred
  });

  if (!res.ok) throw new Error("Failed to load metadata");

  const allMeta = await res.json();
  return allMeta[folder]; // { latestFile, latestUpdated } or undefined
}
