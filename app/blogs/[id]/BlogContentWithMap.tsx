// app/blogs/[id]/BlogContentWithMap.tsx
"use client";

import { useEffect, useRef } from "react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Divider,
  Image,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import Moment from "react-moment";
import hljs from "highlight.js";
import "highlight.js/styles/srcery.css";
import styles from "@/styles/home.module.scss";
import { createRoot } from 'react-dom/client';
import { JapanMapReal } from "@/components/JapanMapReal";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/theme/theme";

export default function BlogContentWithMap({ blog }: any) {
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  const { colorMode } = useColorMode();
  const mapContainersRef = useRef<Set<HTMLElement>>(new Set());

  // カスタムタグ <pin:#FF0000> を処理（エンコードされている場合も対応）
  const processedContent = blog.content
    // HTMLエンティティをデコード
    .replace(/&lt;pin:(#[0-9A-Fa-f]{6})&gt;/gi, "<pin:$1>")
    // カスタムタグを置換
    .replace(
      /<pin:(#[0-9A-Fa-f]{6})>/gi,
      (_match: string, color: string) => `<span class="custom-pin" style="
        display: inline-block;
        width: 16px;
        height: 18px;
        mask-image: url('/images/pin.svg');
        -webkit-mask-image: url('/images/pin.svg');
        mask-size: contain;
        -webkit-mask-size: contain;
        mask-repeat: no-repeat;
        -webkit-mask-repeat: no-repeat;
        background-color: ${color};
        vertical-align: middle;
        margin: 0px;
      "></span>`
    )
    // imgタグのHTMLエンティティをデコード（styleも含む）
    .replace(/&lt;img\s+([^&]+)&gt;/gi, (_match: string, attributes: string) => {
      // 属性内の &quot; を " に変換
      const decodedAttrs = attributes
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");
      return `<img ${decodedAttrs}>`;
    })
    // japanMapタグをプレースホルダーに変換
    // パターン1: 自己閉じタグ <japanMap ... />
    // パターン2: 開始タグのみ <japanMap ...>
    // パターン3: 開始・終了タグペア <japanMap ...></japanMap>
    .replace(
      /&lt;japanMap(?:\s|&nbsp;)+(.*?)(?:\/&gt;|&gt;(?:&lt;\/japanMap&gt;)?)/gi,
      (_match: string, attributes: string) => {
        console.log('🔍 Found japanMap tag with attributes:', attributes);
        // まず全てのHTMLエンティティをデコード
        const decodedAttrs = attributes
          .replace(/&nbsp;/g, ' ')  // &nbsp;を通常のスペースに変換
          .replace(/&quot;/g, '"')
          .replace(/&#x3A;/g, ':')
          .replace(/&#58;/g, ':')
          .replace(/&amp;/g, '&');
        console.log('🔍 Decoded attributes:', decodedAttrs);
        // プレースホルダーに保存（引用符だけ再エンコード）
        return `<div class="japan-map-placeholder" data-map-attrs="${decodedAttrs.replace(/"/g, '&quot;')}"></div>`;
      }
    );

  console.log("Original content (first 500 chars):", blog.content.substring(0, 500));
  console.log("Processed content (first 500 chars):", processedContent.substring(0, 500));

  // japanMapタグを直接検索してログ出力
  const japanMapMatch = blog.content.match(/&lt;japanMap[^&]*?&gt;/gi);
  if (japanMapMatch) {
    console.log("🔍 Found japanMap tags in original content:", japanMapMatch);
  } else {
    console.log("⚠️ No japanMap tags found in original content");
  }

  // クライアント側でのみハイライト実行
  useEffect(() => {
    const codeBlocks = document.querySelectorAll("pre code");
    if (codeBlocks.length > 0) {
      hljs.highlightAll();
    }

    // リンクのアイコンをドメインごとに変更
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (
        href.includes("google.com/maps") ||
        href.includes("google.co.jp/maps") ||
        href.includes("maps.google.com") ||
        href.includes("maps.app.goo.gl")
      ) {
        link.setAttribute("data-link-type", "google-maps");
      }
    });

    // Google Maps埋め込み（embedly）のレスポンシブ化
    const applyResponsiveEmbed = () => {
      const embedlyIframes = document.querySelectorAll("iframe.embedly-embed");

      embedlyIframes.forEach((iframe) => {
        const src = iframe.getAttribute("src") || "";

        if (
          (src.includes("google.com") || src.includes("maps")) &&
          !iframe.parentElement?.classList.contains("responsive-embed-wrapper")
        ) {
          // width/height属性を削除
          iframe.removeAttribute("width");
          iframe.removeAttribute("height");

          // iframeを囲むdivを作成
          const wrapper = document.createElement("div");
          wrapper.className = "responsive-embed-wrapper";
          wrapper.style.position = "relative";
          wrapper.style.width = "100%";
          wrapper.style.maxWidth = "100%";
          wrapper.style.paddingBottom = "100%"; // 1:1比率
          wrapper.style.height = "0";
          wrapper.style.overflow = "hidden";
          wrapper.style.margin = "1em 0";
          wrapper.style.boxSizing = "border-box";

          // iframeのスタイル設定
          (iframe as HTMLElement).style.position = "absolute";
          (iframe as HTMLElement).style.top = "0";
          (iframe as HTMLElement).style.left = "0";
          (iframe as HTMLElement).style.width = "100%";
          (iframe as HTMLElement).style.maxWidth = "100%";
          (iframe as HTMLElement).style.height = "100%";
          (iframe as HTMLElement).style.border = "0";
          (iframe as HTMLElement).style.boxSizing = "border-box";

          // iframeを囲む
          iframe.parentNode?.insertBefore(wrapper, iframe);
          wrapper.appendChild(iframe);
        }
      });
    };

    // 日本地図プレースホルダーをReactコンポーネントに置き換え
    const renderJapanMaps = () => {
      console.log('🗺️ Looking for japan-map-placeholder elements...');
      const placeholders = document.querySelectorAll('.japan-map-placeholder');
      console.log(`🗺️ Found ${placeholders.length} placeholder(s)`);

      placeholders.forEach((placeholder, index) => {
        const attrsString = placeholder.getAttribute('data-map-attrs') || '';
        console.log(`🗺️ Placeholder ${index}: attrs =`, attrsString);

        // 属性をパース（HTMLエンティティをデコード）
        const decodedAttrs = attrsString
          .replace(/&quot;/g, '"')
          .replace(/&#x3A;/g, ':')
          .replace(/&#58;/g, ':')
          .replace(/&amp;/g, '&')
          // microCMSが勝手に追加するspanタグを削除
          .replace(/<span[^>]*>/g, '')
          .replace(/<\/span>/g, '');
        console.log(`🗺️ Decoded attrs:`, decodedAttrs);

        const colorsMatch = decodedAttrs.match(/colors="([^"]*)"/);

        console.log(`🗺️ Colors match:`, colorsMatch);

        const colorMap: { [key: string]: string } = {};

        if (colorsMatch) {
          console.log(`🗺️ Colors string:`, colorsMatch[1]);
          const colorPairs = colorsMatch[1].split(',');
          console.log(`🗺️ Color pairs:`, colorPairs);
          colorPairs.forEach(pair => {
            const [pref, color] = pair.split(':').map(s => s.trim());
            console.log(`🗺️ Parsing pair: "${pair}" -> pref="${pref}", color="${color}"`);
            if (pref && color) {
              colorMap[pref] = color;
            }
          });
        }

        console.log(`🗺️ Parsed colorMap =`, colorMap);

        // Reactコンポーネントをレンダリング
        if (!mapContainersRef.current.has(placeholder as HTMLElement)) {
          console.log(`🗺️ Rendering JapanMapReal component for placeholder ${index}...`);
          const root = createRoot(placeholder);
          root.render(
            <ChakraProvider theme={theme}>
              <JapanMapReal colorMap={colorMap} />
            </ChakraProvider>
          );
          mapContainersRef.current.add(placeholder as HTMLElement);
          console.log(`✅ JapanMapReal component rendered for placeholder ${index}`);
        } else {
          console.log(`⚠️ Placeholder ${index} already has a component`);
        }
      });
    };

    // 複数回実行して確実に適用
    setTimeout(applyResponsiveEmbed, 100);
    setTimeout(applyResponsiveEmbed, 500);
    setTimeout(applyResponsiveEmbed, 1000);

    // 地図のレンダリング
    setTimeout(renderJapanMaps, 100);
  }, [blog.content]);

  return (
    <main
      style={
        colorMode === "light"
          ? { backgroundColor: "#f0e4da" }
          : { backgroundColor: "#202024" }
      }
    >
      <Container
        className={styles.container}
        fontWeight="400"
        mx="auto"
        my="0px"
        p="10px"
      >
        <Box className={styles.title} fontSize="20px">
          {blog.title}
        </Box>
        <Box className={styles.subtitle} fontSize="14px">
          {blog.subtitle}
        </Box>
        <Divider
          borderColor={
            colorMode === "light"
              ? "custom.theme.light.900"
              : "custom.theme.dark.100"
          }
          borderWidth="1px"
        />
        <Divider className={myClass} />
        <Box
          display="flex"
          gap="16px"
          flexWrap="wrap"
          fontSize="14px"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            <Moment
              format="YYYY/MM/DD"
              className={styles.publishedAt}
              style={{ marginLeft: "4px", marginBottom: "0px" }}
            >
              {blog.publishedAt}
            </Moment>
          </Box>
          {blog.updatedAt &&
            blog.updatedAt !== blog.publishedAt &&
            (() => {
              const publishYear = new Date(blog.publishedAt).getFullYear();
              const updateYear = new Date(blog.updatedAt).getFullYear();
              const sameYear = publishYear === updateYear;

              return (
                <Box display="flex" alignItems="center">
                  <RepeatClockIcon marginRight="3px" />
                  <Moment
                    format={sameYear ? "MM/DD HH:mm" : "YYYY/MM/DD"}
                    className={styles.publishedAt}
                    style={{ marginLeft: "2px", marginBottom: "0px" }}
                  >
                    {blog.updatedAt}
                  </Moment>
                </Box>
              );
            })()}
        </Box>

        {blog.tags && blog.tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap="8px" mt="8px" mb="16px">
            {blog.tags.map((tag: any) => (
              <Box
                key={tag.id}
                bg={
                  colorMode === "light"
                    ? "custom.theme.light.100"
                    : "custom.theme.dark.400"
                }
                color={
                  colorMode === "light"
                    ? "custom.theme.light.900"
                    : "custom.theme.dark.100"
                }
                px="8px"
                py="2px"
                borderRadius="4px"
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap="4px"
              >
                {tag.img && (
                  <Image
                    src={tag.img.url}
                    alt={tag.name}
                    boxSize="16px"
                    objectFit="contain"
                  />
                )}
                {tag.name}
              </Box>
            ))}
          </Box>
        )}

        <Image
          height="full"
          objectFit="cover"
          alt={blog.title}
          src={blog.eyecatch?.url}
        />

        <div
          className={styles.post}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </Container>
    </main>
  );
}
