import NextLink from "next/link";
import { useState, useEffect } from "react";
import { client } from "../libs/client";
import Content from "../components/content";
import {
  Container,
  Tag,
  Flex,
  Image,
  Box,
  Text,
  Spacer,
  Center,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import styles from "../styles/home.module.scss";
import Moment from "react-moment";
import { motion } from "framer-motion";

import InfiniteScroll from "react-infinite-scroller";

export default function Home({ blog, category, tag, blog2 }) {
  const [showBlogs, setShowBlogs] = useState(blog);

  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "pink.100");
  const color = useColorModeValue("#111111", "#111111");
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  return (
    <>
      <Content>
        <ul>
          {/* tagにデータが無い場合 */}
          {!tag.length && <Text>there are no posts...</Text>}
          {tag.map((tag) => (
            <Tag
              key={tag.name}
              bg={bg}
              className={styles.tags}
              onClick={(e) => testtttt(e, blog, tag, setShowBlogs)}
            >
              <Image src={tag.img.url} boxSize="30px" />
              <Box ml="1">
                <Text fontWeight={500} color="#111111">
                  {tag.name}
                </Text>
              </Box>
            </Tag>
          ))}
        </ul>

        <div style={{ height: "10px" }}></div>

        {showBlogs.map((blog) => (
          <NextLink href={`/blog/${blog.id}`} key={blog.id}>
            <a>
              <Flex className={styles.blogList}>
                <Box ml="3" style={{ margin: "10px 10px" }}>
                  <Text className={styles.blogTitle} fontWeight="bold">
                    {blog.title}
                  </Text>
                  <Text fontSize="sm">{blog.subtitle}</Text>
                  <Text fontSize="sm" style={{ opacity: "0.5" }}>
                    <RepeatClockIcon style={{ marginRight: "5px" }} />
                    <Moment format="YYYY/MM/DD">{blog.updatedAt}</Moment>
                  </Text>
                </Box>
                <Spacer />
                <Box>
                  <Image
                    className={styles.eyecatch}
                    boxSize="80px"
                    objectFit="cover"
                    alt={blog.title}
                    src={blog.eyecatch.url}
                  />
                </Box>
              </Flex>
            </a>
          </NextLink>
        ))}

        <div style={{ height: "100vh" }}></div>
      </Content>
    </>
  );
}
// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
  // getStaticPropsで取得したtagsからtag名のみ抜き出す
  const data = await client.get({
    endpoint: "blog",
    queries: {
      limit: 3000,
    },
  });

  // カテゴリーコンテンツの取得
  const categoryData = await client.get({ endpoint: "categories" });
  // タグコンテンツの取得
  const tagData = await client.get({ endpoint: "tags" });

  return {
    props: {
      blog: data.contents,
      category: categoryData.contents,
      tag: tagData.contents,
    },
  };
};

const testtttt = async (e, blog, tag, setShowBlogs) => {
  // 親要素をから複数の子要素を取得
  let parent = e.currentTarget.parentNode;
  let children = parent.children;
  // タグを色をすべて解除
  for (var i = 0; i < children.length; i++) {
    children[i].style.color = "#111111";
    children[i].style.borderColor = "lightgray";
  }
  // e.currentTarget.style.background = "rgba(255,0,0,0.4)";
  e.currentTarget.style.color = "#ff1111";
  e.currentTarget.style.borderColor = "#ff1111";
  // タグでフィルター
  if (tag.name === "All") {
    setShowBlogs([]);
    setTimeout(function () {
      setShowBlogs(blog);
    }, 100);
  } else {
    const selectedBlogs = blog.filter((blog: any) => {
      const haveTags = blog.tags.map((tag: any) => tag.name);
      return haveTags.includes(tag.name);
    });
    setShowBlogs([]);
    setTimeout(function () {
      setShowBlogs(selectedBlogs);
    }, 100);
  }
  // 画面最上部へスクロールさせる
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
