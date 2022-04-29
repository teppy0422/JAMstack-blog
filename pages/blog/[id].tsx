import { Container } from "@chakra-ui/react";
import Header from "../../components/header";
import { client } from "../../libs/client";
import styles from "../../styles/home.module.scss";

export default function BlogId({ blog }) {
  return (
    <main>
      <Header />
      <Container className={styles.contain}>
        <h1 style={{ backgroundColor: `lightGray` }} className={styles.title}>
          {blog.title}
        </h1>
        <p className={styles.publishedAt}>{blog.publishedAt}</p>
        <p className="category">{blog.category && `${blog.category.name}`}</p>
        <div
          dangerouslySetInnerHTML={{
            __html: `${blog.content}`,
          }}
          className={styles.post}
        />
      </Container>
    </main>
  );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
  const data = await client.get({ endpoint: "blog" });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({ endpoint: "blog", contentId: id });

  return {
    props: {
      blog: data,
    },
  };
};
