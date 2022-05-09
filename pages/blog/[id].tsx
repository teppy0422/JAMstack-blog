import { Container, Divider, useColorModeValue } from "@chakra-ui/react";
import { client } from "../../libs/client";
import Header from "../../components/header";
import styles from "../../styles/home.module.scss";

//シンタックスハイライト用
import cheerio from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/srcery.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function BlogId({ blog, highlightedBody }) {
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  return (
    <>
      <main>
        <Header />
        <div style={{ height: "56px" }}></div>
        <Container className={styles.contain}>
          <h1 className={styles.title}>{blog.title}</h1>
          <Divider className={myClass} />
          <p className={styles.publishedAt}>{blog.publishedAt}</p>
          {/* <p className="category">{blog.category && `${blog.category.name}`}</p> */}
          {/* <div
            className={styles.post}
            dangerouslySetInnerHTML={{
              __html: `${blog.content}`,
            }}
          /> */}
          <div
            className={styles.post}
            dangerouslySetInnerHTML={{ __html: highlightedBody }}
          ></div>
        </Container>
      </main>
      <style jsx>{`
        p {
          color: red;
        }
      `}</style>
    </>
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

  const $ = cheerio.load(data.content); // data.contentはmicroCMSから返されるリッチエディタ部分
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });

  return {
    props: {
      blog: data, //未使用
      highlightedBody: $.html(), //ハイライト済みのHTML
    },
  };
};
