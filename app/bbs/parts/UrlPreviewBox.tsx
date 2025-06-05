import React, { useEffect, useState } from "react";
import { Box, Tooltip, Icon, Flex, IconButton, Text } from "@chakra-ui/react";
import { FaArrowLeft, FaRedo, FaExternalLinkAlt } from "react-icons/fa";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaGlobe } from "react-icons/fa";
function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  } catch {
    return "";
  }
}

type Props = {
  url: string;
  isExpanded: boolean;
  onToggle: () => void;
  urlHistory: { [key: string]: string[] };
  currentUrlIndex: { [key: string]: number };
  urlTitles: { [key: string]: string };
  goBack: (url: string) => string | null;
  addToHistory: (originalUrl: string, newUrl: string) => void;
  setUrlTitles: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  setExpandedUrls: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
  setCurrentUrlIndex: React.Dispatch<
    React.SetStateAction<{ [key: string]: number }>
  >;
  colorMode: string;
  currentUserId: string;
  postUserId: string;
};
const UrlPreviewBox: React.FC<Props> = ({
  url,
  isExpanded,
  onToggle,
  urlHistory,
  currentUrlIndex,
  urlTitles,
  goBack,
  addToHistory,
  setUrlTitles,
  colorMode,
  currentUserId,
  postUserId,
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null); // 追加
  const faviconUrl = getFaviconUrl(url);
  const domain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  })();
  useEffect(() => {
    // microlink.ioの無料APIを使ってOGP画像を取得
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          if (data.data.image?.url) {
            setThumbnailUrl(data.data.image.url);
          }
          // タイトルもセット
          if (data.data.title) {
            setUrlTitles((prev) => ({
              ...prev,
              [url]: data.data.title,
            }));
          }
          if (data.data.description) {
            setDescription(data.data.description);
          } else {
            setDescription(null);
          }
        }
      });
  }, [url, setUrlTitles]);

  return (
    <Box>
      <Box
        width={isExpanded ? "94%" : "50%"}
        height={isExpanded ? "70vh" : "110px"}
        mt="8px"
        transition="all 0.3s ease"
        marginLeft={postUserId === currentUserId ? "auto" : "44px"}
        marginRight={postUserId === currentUserId ? "12px" : "auto"}
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
        borderRadius="8px"
      >
        <Tooltip
          label={isExpanded ? "折りたたむ" : "展開する"}
          placement="top"
          hasArrow
        >
          <Box display="inline-block" position="absolute">
            <Icon
              position="absolute"
              as={LuPanelRightOpen}
              cursor="pointer"
              boxSize="18px"
              right={postUserId === currentUserId ? "" : "-22px"}
              left={postUserId === currentUserId ? "-22px" : ""}
              top="6px"
              transform={
                isExpanded
                  ? postUserId === currentUserId
                    ? "rotate(180deg)"
                    : "rotate(0deg)"
                  : postUserId === currentUserId
                  ? "rotate(0deg)"
                  : "rotate(180deg)"
              }
              transition="transform 0.3s ease"
              onClick={onToggle}
              _hover={{
                transform: isExpanded
                  ? postUserId === currentUserId
                    ? "rotate(180deg) scale(1.2)"
                    : "rotate(0deg) scale(1.2)"
                  : postUserId === currentUserId
                  ? "rotate(0deg) scale(1.2)"
                  : "rotate(180deg) scale(1.2)",
              }}
            />
          </Box>
        </Tooltip>
        <Box
          position="relative"
          height="100%"
          borderRadius="8px"
          overflow="hidden"
        >
          <Flex
            bg={postUserId === currentUserId ? "#DCF8C6" : "#FFFFFF"}
            px={2}
            alignItems="center"
            borderBottom="1px solid"
            borderColor="gray.200"
            width="100%"
          >
            <Box
              flex="1"
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              fontSize="xs"
              color="#000"
              alignContent="center"
            >
              {urlTitles[url] || "ページを読み込み中..."}
            </Box>
            <IconButton
              color="blue.600"
              aria-label="新しいタブで開く"
              icon={<Icon as={FaExternalLinkAlt} />}
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                const currentUrl =
                  urlHistory[url]?.[currentUrlIndex[url] || 0] || url;
                window.open(currentUrl, "_blank");
              }}
            />
          </Flex>
          {isExpanded ? (
            <iframe
              src={url}
              data-original-url={url}
              style={{
                position: "relative",
                top: 0,
                left: 0,
                width: "100%",
                height: "calc(100% - 20px)",
                border: "none",
              }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              loading="lazy"
              onLoad={(e) => {
                const iframe = e.target as HTMLIFrameElement;
                try {
                  const currentUrl = iframe.contentWindow?.location.href;
                  if (
                    currentUrl &&
                    currentUrl !== url &&
                    currentUrl !== iframe.src
                  ) {
                    addToHistory(url, currentUrl);
                  }
                  // まずURLからドメイン名を取得してタイトルの初期値として設定
                  const domain = new URL(url).hostname;
                  setUrlTitles((prev) => ({
                    ...prev,
                    [url]: domain,
                  }));
                  // タイトルの取得を試みる
                  const title =
                    iframe?.contentWindow?.document?.title ||
                    iframe?.contentDocument?.title;
                  if (title) {
                    setUrlTitles((prev) => ({
                      ...prev,
                      [url]: title,
                    }));
                  }
                } catch (error) {
                  // エラーの場合はドメイン名を表示
                  try {
                    const domain = new URL(url).hostname;
                    setUrlTitles((prev) => ({
                      ...prev,
                      [url]: domain,
                    }));
                  } catch (e) {
                    setUrlTitles((prev) => ({
                      ...prev,
                      [url]: url,
                    }));
                  }
                }
              }}
            />
          ) : (
            <Box px={2} py={1} display="flex" alignItems="center" gap={2}>
              {thumbnailUrl ? (
                <>
                  <img
                    src={thumbnailUrl}
                    alt="サムネイル"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                  <Box ml={2} minW={0}>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      noOfLines={2}
                      maxW="280px"
                    >
                      {urlTitles[url] || domain}
                    </Text>
                    {description && (
                      <Text
                        fontSize="xs"
                        color="gray.600"
                        noOfLines={2}
                        maxW="280px"
                        mt={1}
                      >
                        {description}
                      </Text>
                    )}
                  </Box>
                </>
              ) : (
                // アイコン＋ドメイン
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  bg="gray.100"
                  borderRadius="4px"
                  px={2}
                  py={1}
                >
                  <FaGlobe size={24} color="#888" />
                  <Text fontSize="sm" color="gray.600">
                    {domain}
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UrlPreviewBox;
