import React, { useEffect, useState } from "react";
import { Box, Tooltip, Icon, Flex, IconButton, Text } from "@chakra-ui/react";
import {
  FaExternalLinkAltIcon,
  FaGlobeIcon,
  LuPanelRightOpenIcon,
} from "@/components/ui/icons";

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
    // microlink.ioでOGP画像（metaタグ）を優先して取得
    fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(
        url
      )}&meta=true&image=meta`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // OGP画像（og:image）があればそれを使う
          if (data.data.image?.url) {
            setThumbnailUrl(data.data.image.url);
          } else {
            setThumbnailUrl(null);
          }
          // タイトル
          if (data.data.title) {
            setUrlTitles((prev) => ({
              ...prev,
              [url]: data.data.title,
            }));
          }
          // 説明
          if (data.data.description) {
            setDescription(data.data.description);
          } else {
            setDescription(null);
          }
        }
      });
  }, [url, setUrlTitles]);

  const OpenCloseIcon = ({ isRight }: { isRight: boolean }) => {
    return (
      <Tooltip
        label={isExpanded ? "折りたたむ" : "展開する"}
        placement="top"
        hasArrow
      >
        <Box
          position="absolute"
          right={!isRight ? "-22px" : undefined}
          left={isRight ? "-22px" : undefined}
          top="6px"
          cursor="pointer"
          onClick={onToggle}
        >
          <Box
            transform={
              isExpanded
                ? isRight
                  ? "rotate(180deg)"
                  : "rotate(0deg)"
                : isRight
                ? "rotate(0deg)"
                : "rotate(180deg)"
            }
            transition="transform 0.3s ease"
            _hover={{
              transform: isExpanded
                ? isRight
                  ? "rotate(180deg) scale(1.2)"
                  : "rotate(0deg) scale(1.2)"
                : isRight
                ? "rotate(0deg) scale(1.2)"
                : "rotate(180deg) scale(1.2)",
            }}
          >
            <LuPanelRightOpenIcon
              size="18px"
              stroke={
                colorMode === "light"
                  ? "custom.theme.light.900"
                  : "custom.theme.dark.200"
              }
            />
          </Box>
        </Box>
      </Tooltip>
    );
  };

  const isRight = postUserId === currentUserId;
  return (
    <Box zIndex="1000" position="relative">
      <Box
        position="relative"
        width={isExpanded ? "94%" : "320px"}
        height={isExpanded ? "70vh" : "110px"}
        mt="8px"
        transition="all 0.3s ease"
        marginLeft={isRight ? "auto" : "44px"}
        marginRight={isRight ? "12px" : "auto"}
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        borderRadius="8px"
        border="1px solid"
        borderColor={colorMode === "light" ? "transparent" : "gray.600"}
      >
        {!isRight && (
          <Box position="relative" height="0">
            <OpenCloseIcon isRight={false} />
          </Box>
        )}
        <Box height="100%" borderRadius="8px" overflow="hidden">
          <Flex
            bg={isRight ? "#DCF8C6" : "#FFFFFF"}
            p={2}
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

            <Tooltip label="新しいタブで開く" placement="left" hasArrow>
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  const currentUrl =
                    urlHistory[url]?.[currentUrlIndex[url] || 0] || url;
                  window.open(currentUrl, "_blank");
                }}
                cursor="pointer"
                _hover={{ transform: "scale(1.1)" }}
              >
                <FaExternalLinkAltIcon
                  size="14px"
                  fill="custom.theme.light.850"
                />
              </Box>
            </Tooltip>
          </Flex>
          {isExpanded ? (
            <iframe
              src={url}
              data-original-url={url}
              style={{
                top: 0,
                left: 0,
                width: "100%",
                height: "calc(100% - 20px)",
                border: "none",
                transition: "transform 0.3s ease-in-out",
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
            <>
              {thumbnailUrl ? (
                <>
                  <Box
                    px="3px"
                    py="2px"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
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
                          color={
                            colorMode === "light" ? "gray.600" : "gray.400"
                          }
                          noOfLines={2}
                          maxW="280px"
                          mt={1}
                        >
                          {description}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </>
              ) : (
                // アイコン＋ドメイン
                <>
                  <Box
                    display="flex"
                    alignItems="stretch" // 子要素のalignSelfが効くように
                    bg={
                      colorMode === "light"
                        ? "custom.theme.light.200"
                        : "custom.theme.dark.400"
                    }
                    borderRadius="4px"
                    h="74px"
                    overflow="hidden"
                    w="100%"
                  >
                    <Box alignSelf="flex-start">
                      <FaGlobeIcon
                        size="100px"
                        fill={
                          colorMode === "light"
                            ? "custom.theme.light.800"
                            : "custom.theme.dark.700"
                        }
                      />
                    </Box>
                    <Text
                      fontSize="sm"
                      color={
                        colorMode === "light"
                          ? "custom.theme.light.800"
                          : "custom.theme.dark.700"
                      }
                      alignSelf="flex-end"
                      ml={1}
                    >
                      {domain}
                    </Text>
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
        {isRight && <OpenCloseIcon isRight={true} />}
      </Box>
    </Box>
  );
};

export default UrlPreviewBox;
