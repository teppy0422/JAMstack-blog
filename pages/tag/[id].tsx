import Link from "next/link";
import { client } from "../../libs/client";
import Header from "../../components/header";
import Content from "../../components/content";
import { Container } from "@chakra-ui/react";

export default function CategoryId({ blog }) {
  // タグに紐付いたコンテンツがない場合に表示
  if (blog.length === 0) {
    return <div>ブログコンテンツがありません</div>;
  }
  return (
    <div>
      <Header />
      <div style={{ height: "56px" }}></div>
      <Content isCustomHeader={false}>
        <ul>
          {blog.map((blog) => (
            <li key={blog.id}>
              <Link href={`/blog/${blog.id}`}>
                <a>{blog.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Content>
    </div>
  );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "tags" });

  const paths = data.contents.map((content) => `/tag/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context) => {
  const id = context.params.id;

  const data = await client.get({
    endpoint: "blog",
    queries: { filters: `tags[contains]${id}` },
  });

  return {
    props: {
      blog: data.contents,
    },
  };
};
