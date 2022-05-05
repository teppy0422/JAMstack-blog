import Header from "../components/header";
import Link from "next/link";
import { client } from "../libs/client";
import { Container } from "@chakra-ui/react";

export default function Home({ blog, category, tag }) {
  return (
    <>
      <Header />
      <div style={{ height: "56px" }}></div>

      <Container>
        <ul>
          <div>-category-</div>
          {category.map((category) => (
            <li key={category.id}>
              <Link href={`/category/${category.id}`}>
                <a>{category.name}</a>
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ height: "100px" }}></div>
        <div>-tag-</div>
        <ul>
          {tag.map((tag) => (
            <li key={tag.id}>
              <Link href={`/tag/${tag.id}`}>
                <a>{tag.name}</a>
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ height: "100px" }}></div>
        <ul>
          {blog.map((blog) => (
            <li key={blog.id}>
              <Link href={`/blog/${blog.id}`}>
                <a>{blog.title}</a>
              </Link>
            </li>
          ))}
        </ul>
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