// app/blogs/[id]/client.tsx
"use client";

import { useEffect } from "react";
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

export default function BlogContent({ blog }: any) {
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  const { colorMode } = useColorMode();

  // カスタムタグ <pin:#FF0000> を処理（エンコードされている場合も対応）
  const processedContent = blog.content
    // HTMLエンティティをデコード
    .replace(/&lt;pin:(#[0-9A-Fa-f]{6})&gt;/gi, "<pin:$1>")
    // カスタムタグを置換
    .replace(
      /<pin:(#[0-9A-Fa-f]{6})>/gi,
      (match: string, color: string) => `<span class="custom-pin" style="
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
    );

  console.log("Original content:", blog.content.substring(0, 200));
  console.log("Processed content:", processedContent.substring(0, 200));

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

    // 複数回実行して確実に適用
    setTimeout(applyResponsiveEmbed, 100);
    setTimeout(applyResponsiveEmbed, 500);
    setTimeout(applyResponsiveEmbed, 1000);
  }, []);

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
        <Box className={styles.title} fontSize="20px">
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
                  <RepeatClockIcon marginRight="5px" />
                  更新:
                  <Moment
                    format={sameYear ? "MM/DD HH:mm" : "YYYY/MM/DD"}
                    className={styles.publishedAt}
                    style={{ marginLeft: "4px", marginBottom: "0px" }}
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
          height={{ base: "", sm: "200px", md: "200px", xl: "200px" }}
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
