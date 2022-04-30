import { Container, Divider, useColorModeValue } from "@chakra-ui/react";
import Header from "../../components/header";
import { client } from "../../libs/client";
import styles from "../../styles/home.module.scss";

export default function BlogId({ blog }) {
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  return (
    <main>
      <Header />
      <div style={{ height: "56px" }}></div>
      <Container className={styles.contain}>
        <h1 className={styles.title}>{blog.title}</h1>
        <Divider className={myClass} />
        <p className={styles.publishedAt}>{blog.publishedAt}</p>
        <p className="category">{blog.category && `${blog.category.name}`}</p>
        <div
          className={styles.post}
          dangerouslySetInnerHTML={{
            __html: `${blog.content}`,
          }}
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
