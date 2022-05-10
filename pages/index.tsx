import Link from "next/link";
import { useState } from "react";
import { client } from "../libs/client";
import Header from "../components/header";
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
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import styles from "../styles/home.module.scss";
import Moment from "react-moment";

export default function Home({ blog, category, tag, blog2 }) {
  const [showBlogs, setShowBlogs] = useState(blog);
  return (
    <Content>
      <Header />
      <div style={{ height: "56px" }}></div>
      <div style={{ height: "10px" }}></div>

      <ul>
        {tag.map((tag) => (
          <Box>
            <button onClick={() => testtttt(blog, tag, setShowBlogs)}>
              test_button
            </button>
            <Tag style={{ margin: "5px 5px" }}>
              <Text>
                {tag.name}
                {tag.id}
              </Text>
            </Tag>
          </Box>
        ))}
      </ul>

      <ul>
        {tag.map((tag) => (
          <Link href={`/tag/${tag.id}`}>
            <Tag className={styles.tags}>
              <Image src={tag.img.url} boxSize="32px" />
              <Box ml="1">
                <Text fontWeight={500}>{tag.name}</Text>
              </Box>
            </Tag>
          </Link>
        ))}
      </ul>

      <div style={{ height: "10px" }}></div>

      {showBlogs.map((blog) => (
        <Link href={`/blog/${blog.id}`}>
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
        </Link>
      ))}

      <div style={{ height: "500px" }}></div>
    </Content>
  );
}
// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
  // getStaticPropsで取得したtagsからtag名のみ抜き出す

  const data = await client.get({ endpoint: "blog" });
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

const testtttt = async (blog, tag, setShowBlogs) => {
  console.log(tag);
  if (tag.name === "all") {
    setShowBlogs(blog);
  } else {
    const selectedBlogs = blog.filter((blog: any) => {
      const haveTags = blog.tags.map((tag: any) => tag.name);
      return haveTags.includes(tag.name);
    });
    setShowBlogs(selectedBlogs);
  }
  //画面最上部へスクロールさせる
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
