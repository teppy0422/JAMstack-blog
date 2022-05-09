import Header from "../components/header";
import Link from "next/link";
import { client } from "../libs/client";
import {
  Container,
  Tag,
  Flex,
  Image,
  Box,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import styles from "../styles/home.module.scss";
import Moment from "react-moment";

export default function Home({ blog, category, tag, eyecatch }) {
  return (
    <>
      <Header />
      <div style={{ height: "56px" }}></div>
      <Container>
        {/* <ul>
          <div>-category-</div>
          {category.map((category) => (
            <li key={category.id}>
              <Link href={`/category/${category.id}`}>
                <a>{category.name}</a>
              </Link>
            </li>
          ))}
        </ul> */}
        <div style={{ height: "10px" }}></div>
        <ul>
          {tag.map((tag) => (
            <Tag style={{ margin: "5px 5px" }}>
              <Link href={`/tag/${tag.id}`}>
                <a>{tag.name}</a>
              </Link>
            </Tag>
          ))}
        </ul>

        <div style={{ height: "10px" }}></div>
        {blog.map((blog) => (
          <Link href={`/blog/${blog.id}`}>
            <a>
              <Flex
                className={styles.blogList}
                style={{
                  margin: "10px 0px",
                  border: "1px #888 solid",
                  borderRadius: "10px",
                }}
              >
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
                    boxSize="80px"
                    className={styles.eyecatch}
                    objectFit="cover"
                    alt={blog.title}
                    src={blog.eyecatch.url}
                  />
                </Box>
              </Flex>
            </a>
          </Link>
        ))}

        <div style={{ height: "900px" }}></div>
      </Container>
    </>
  );
}

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
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
