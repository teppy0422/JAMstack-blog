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

  // クライアント側でのみハイライト実行
  useEffect(() => {
    const codeBlocks = document.querySelectorAll("pre code");
    if (codeBlocks.length > 0) {
      hljs.highlightAll();
    }
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
        mt="14px"
        p="10px"
      >
        <Box className={styles.title} fontSize="20px">
          {blog.title}
        </Box>
        <Divider className={myClass} />
        <RepeatClockIcon marginRight="5px" />
        <Moment format="YYYY/MM/DD" className={styles.publishedAt}>
          {blog.publishedAt}
        </Moment>

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
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </Container>
    </main>
  );
}
