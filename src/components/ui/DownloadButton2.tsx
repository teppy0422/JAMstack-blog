import { useState } from "react";
import { Box, useToast, Text, Spinner } from "@chakra-ui/react";

type DownloadButtonProps = {
  currentUserName: string | null;
  url: string; // フォルダパス or ファイルパス
  bg: string;
  color: string;
};

const DownloadButton2 = ({
  currentUserName,
  url,
  bg,
  color,
}: DownloadButtonProps) => {
  const toast = useToast();
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!currentUserName) {
      toast({
        title: "ダウンロードできません",
        description: "ダウンロードするにはログインと開発による認証が必要です",
        status: "error",
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      let downloadUrl = url;
      const hasExtension = /\.[a-zA-Z0-9]+$/.test(url.split("/").pop() || "");

      if (!hasExtension) {
        const res = await fetch("/download/download-meta.json");
        const meta = await res.json();

        // デバッグ: metaの内容確認
        console.log("download-meta.json:", meta);

        // URLを整形: download/を削除、先頭・末尾のスラッシュを削除
        const cleanedUrl = url.replace(/^\/?download\/?|\/$/g, "");
        console.log("Cleaned URL:", cleanedUrl);

        const folderData = meta[cleanedUrl];

        if (!folderData || !folderData.latestFile) {
          const availableKeys = Object.keys(meta).join(", ");
          throw new Error(
            `指定されたフォルダが見つかりません: ${cleanedUrl}\n利用可能なキー: ${availableKeys}`
          );
        }
        const latestFile = folderData.latestFile;
        downloadUrl = `/download/${cleanedUrl}/${latestFile}`;
        console.log("Final downloadUrl:", downloadUrl);
      }

      const xhr = new XMLHttpRequest();
      xhr.open("GET", downloadUrl, true);
      xhr.responseType = "blob";

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          setDownloadProgress((event.loaded / event.total) * 100);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const downloadBlobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadBlobUrl;

          const fileName = downloadUrl.split("/").pop() || "downloaded_file";
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(downloadBlobUrl);

          toast({
            title: "ダウンロード完了",
            description: `${fileName} のダウンロードが完了しました`,
            status: "success",
          });
          setIsDownloaded(true);
        } else {
          toast({
            title: "ダウンロード失敗",
            description: `エラーコード: ${xhr.status}`,
            status: "error",
          });
          setDownloadProgress(0);
        }
        setIsDownloading(false);
      };

      xhr.onerror = () => {
        toast({
          title: "ダウンロード失敗",
          description: "ネットワークエラーが発生しました",
          status: "error",
        });
        setIsDownloading(false);
        setDownloadProgress(0);
      };

      xhr.send();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "ダウンロード失敗",
        description: err.message || "不明なエラーが発生しました",
        status: "error",
      });
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return url === "" ? null : (
    <Box position="relative" w="100%" h="100%">
      <Box
        position="absolute"
        top="0"
        left="0"
        h="100%"
        p="0"
        m="0"
        w={`${downloadProgress}%`}
        bg={bg}
        borderRadius="0"
        zIndex="0"
        transition="width 0.2s ease"
      />
      <Box
        as="button"
        w="100%"
        h="100%"
        p="0"
        m="0"
        border="none"
        borderRadius="0"
        marginLeft="auto"
        bg="transparent"
        position="relative"
        zIndex="1"
        onClick={handleDownload}
        color={isDownloaded ? "white" : color}
        _hover={isDownloaded ? {} : { bg: bg, opacity: 0.85, color: "white" }}
        fontFamily="'Archivo Black', 'M PLUS Rounded 1c'"
        letterSpacing="0.2em"
      >
        {isDownloading ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <Spinner size="sm" color="white" mr="2" />
            <Text fontSize="sm">Downloading...</Text>
          </Box>
        ) : (
          "DOWNLOAD"
        )}
      </Box>
    </Box>
  );
};

export default DownloadButton2;
