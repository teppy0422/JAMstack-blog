import { useState } from "react";
import { Box, useToast, Text, Spinner } from "@chakra-ui/react";
import CustomToast from "@/components/ui/CustomToast";
import getMessage from "@/utils/getMessage";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language } = useLanguage();
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!currentUserName) {
      toast({
        position: "bottom",
        duration: 4000,
        isClosable: true,
        render: ({ onClose }) => (
          <CustomToast
            onClose={onClose}
            title={getMessage({
              ja: "ダウンロードできません",
              us: "Cannot download",
              cn: "无法下载。",
              language,
            })}
            description={
              <>
                <Box>
                  {getMessage({
                    ja: "ダウンロードするにはログインと開発による認証が必要です",
                    us: "Download requires login and authentication by development",
                    cn: "下载需要开发人员登录和验证",
                    language,
                  })}
                </Box>
              </>
            }
          />
        ),
      });
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      let downloadUrl = url;
      const hasExtension = /\.[a-zA-Z0-9]+$/.test(url.split("/").pop() || "");

      if (!hasExtension) {
        const res = await fetch(
          "/download/download-meta.json",
          { cache: "no-store" } //キャッシュを使用しない
        );
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
            position: "bottom",
            duration: 4000,
            isClosable: true,
            render: ({ onClose }) => (
              <CustomToast
                onClose={onClose}
                title={getMessage({
                  ja: "ダウンロード完了",
                  us: "Download Complete",
                  cn: "下载完成。",
                  language,
                })}
                description={
                  <>
                    <Box>
                      {{ fileName } +
                        getMessage({
                          ja: " のダウンロードが完了しました",
                          us: " download has been completed",
                          cn: " 的下载已完成",
                          language,
                        })}
                    </Box>
                  </>
                }
              />
            ),
          });
          setIsDownloaded(true);
        } else {
          toast({
            position: "bottom",
            duration: 4000,
            isClosable: true,
            render: ({ onClose }) => (
              <CustomToast
                onClose={onClose}
                title={getMessage({
                  ja: "ダウンロード失敗",
                  us: "Cannot download",
                  cn: "无法下载。",
                  language,
                })}
                description={
                  <>
                    <Box>
                      {getMessage({
                        ja: "エラーコード: ",
                        us: "Error code: ",
                        cn: "错误代码：",
                        language,
                      })}
                      {xhr.status}
                    </Box>
                  </>
                }
              />
            ),
          });
          setDownloadProgress(0);
        }
        setIsDownloading(false);
      };

      xhr.onerror = () => {
        toast({
          position: "bottom",
          duration: 4000,
          isClosable: true,
          render: ({ onClose }) => (
            <CustomToast
              onClose={onClose}
              title={getMessage({
                ja: "ダウンロード失敗",
                us: "Cannot download",
                cn: "无法下载。",
                language,
              })}
              description={
                <>
                  <Box>
                    {getMessage({
                      ja: "ネットワークエラーが発生しました: ",
                      us: "A network error has occurred.",
                      cn: "发生网络错误。",
                      language,
                    })}
                  </Box>
                </>
              }
            />
          ),
        });
        setIsDownloading(false);
        setDownloadProgress(0);
      };

      xhr.send();
    } catch (err: any) {
      toast({
        position: "bottom",
        duration: 4000,
        isClosable: true,
        render: ({ onClose }) => (
          <CustomToast
            onClose={onClose}
            title={getMessage({
              ja: "ダウンロード失敗",
              us: "Cannot download",
              cn: "无法下载。",
              language,
            })}
            description={
              <>
                <Box>
                  {getMessage({
                    ja: "エラーコード: ",
                    us: "Error code: ",
                    cn: "错误代码：",
                    language,
                  })}
                  {err.message}
                </Box>
              </>
            }
          />
        ),
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
