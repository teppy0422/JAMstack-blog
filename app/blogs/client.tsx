"use client";

import { useState } from "react";
import NextLink from "next/link";
import {
  Tag,
  Flex,
  Image,
  Box,
  Text,
  Spacer,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import Moment from "react-moment";
import styles from "@/styles/home.module.scss";

import Content from "../../components/content";

interface Blog {
  id: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  eyecatch: { url: string };
  tags: { name: string }[];
}

interface TagData {
  name: string;
  img: { url: string };
}

interface Props {
  blog: Blog[];
  category: any;
  tag: TagData[];
}

export default function ClientPage({ blog, category, tag }: Props) {
  const [showBlogs, setShowBlogs] = useState(blog);
  const bg = useColorModeValue("gray.100", "pink.100");

  const handleTagClick = (
    e: React.MouseEvent<HTMLSpanElement>,
    selectedTag: TagData
  ) => {
    const parent = e.currentTarget.parentNode as HTMLElement;
    const children = Array.from(parent.children) as HTMLElement[];

    children.forEach((el) => {
      el.style.color = "#111111";
      el.style.borderColor = "lightgray";
    });

    const target = e.currentTarget as HTMLElement;
    target.style.color = "#ff1111";
    target.style.borderColor = "#ff1111";

    if (selectedTag.name === "All") {
      setShowBlogs([]);
      setTimeout(() => setShowBlogs(blog), 100);
    } else {
      const filtered = blog.filter((b) =>
        b.tags.some((t) => t.name === selectedTag.name)
      );
      setShowBlogs([]);
      setTimeout(() => setShowBlogs(filtered), 100);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Content isCustomHeader={true}>
        <ul>
          {!tag.length && <Text>There are no posts...</Text>}
          {tag.map((t) => (
            <Tag
              key={t.name}
              bg={bg}
              className={styles.tags}
              onClick={(e) => handleTagClick(e, t)}
            >
              <Image src={t.img.url} boxSize="30px" alt={t.name} />
              <Box ml="1">
                <Text fontWeight={500} color="#111111">
                  {t.name}
                </Text>
              </Box>
            </Tag>
          ))}
        </ul>

        <div style={{ height: "10px" }} />

        {showBlogs.map((b) => (
          <NextLink key={b.id} href={`/blogs/${b.id}`}>
            <Flex className={styles.blogList}>
              <Box ml="3" style={{ margin: "10px 10px" }}>
                <Text className={styles.blogTitle} fontWeight={500}>
                  {b.title}
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight={300}
                  className={styles.subTitle}
                >
                  {b.subtitle}
                </Text>
                <Text fontSize="sm" style={{ opacity: "0.8" }} fontWeight={400}>
                  <RepeatClockIcon style={{ marginRight: "5px" }} />
                  <Moment format="YYYY/MM/DD">{b.updatedAt}</Moment>
                </Text>
              </Box>
              <Spacer />
              <Box>
                <Image
                  className={styles.eyecatch}
                  boxSize="80px"
                  objectFit="cover"
                  alt={b.title}
                  src={b.eyecatch.url}
                />
              </Box>
            </Flex>
          </NextLink>
        ))}

        <div style={{ height: "100vh" }} />
      </Content>
    </>
  );
}
