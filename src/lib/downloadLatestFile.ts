// lib/downloadFile.ts
import getMessage from "@/utils/getMessage";

type DownloadOptions = {
  url: string;
  currentUserName: string | null;
  language: string;
  onProgress?: (progress: number) => void;
  onSuccess?: (fileName: string) => void;
  onError?: (errorMessage: string) => void;
};

export async function downloadLatestFile({
  url,
  currentUserName,
  language,
  onProgress,
  onSuccess,
  onError,
}: DownloadOptions): Promise<void> {
  if (!currentUserName) {
    onError?.(
      getMessage({
        ja: "ダウンロードするにはログインが必要です。",
        us: "Login is required to download.",
        cn: "下载需要登录。",
        language,
      })
    );
    return;
  }

  try {
    let downloadUrl = url;
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(url.split("/").pop() || "");

    if (!hasExtension) {
      const res = await fetch("/download/download-meta.json", {
        cache: "no-store",
      });
      const meta = await res.json();

      const cleanedUrl = url.replace(/^\/?download\/?|\/$/g, "");
      const folderData = meta[cleanedUrl];

      if (!folderData || !folderData.latestFile) {
        const availableKeys = Object.keys(meta).join(", ");
        throw new Error(
          `指定フォルダなし: ${cleanedUrl}。候補: ${availableKeys}`
        );
      }

      const latestFile = folderData.latestFile;
      downloadUrl = `/download/${cleanedUrl}/${latestFile}`;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("GET", downloadUrl, true);
    xhr.responseType = "blob";

    xhr.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = (event.loaded / event.total) * 100;
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        const fileName = downloadUrl.split("/").pop() || "downloaded_file";

        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);

        onSuccess?.(fileName);
      } else {
        onError?.(`HTTP ${xhr.status}`);
      }
    };
    xhr.onerror = () => {
      onError?.("Network error");
    };
    xhr.send();
  } catch (err: any) {
    onError?.(err.message);
  }
}
