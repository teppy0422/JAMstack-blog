import Moment from "react-moment";
import { RepeatClockIcon } from "@chakra-ui/icons";
import {
  Container,
  Divider,
  useColorModeValue,
  Box,
  Image,
} from "@chakra-ui/react";
import { client } from "../../libs/client";
import Header from "../../components/header";
import styles from "../../styles/home.module.scss";

//シンタックスハイライト用
import { load } from "cheerio";
import hljs from "highlight.js";
import "highlight.js/styles/srcery.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function BlogId({ blog, highlightedBody }) {
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  const colorMode = useColorModeValue("light", "dark");
  return (
    <>
      <main>
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
              {blog.tags.map((tag) => (
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
          {/* <Image
            height={{ base: "", sm: "200px", md: "200px", xl: "200px" }}
            objectFit="cover"
            alt={blog.title}
            src={blog.eyecatch.url}
          /> */}
          {/* <p className="category">{blog.category && `${blog.category.name}`}</p> */}
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
  const data = await client.get({
    endpoint: "blog",
    queries: {
      limit: 30,
    },
  });

  const paths = data.contents.map((content) => `/blog/${content.id}`);
  return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context) => {
  const id = context.params.id;
  const data = await client.get({
    endpoint: "blog",
    contentId: id,
    queries: {
      limit: 30,
    },
  });
  const $ = load(data.content); // data.contentはmicroCMSから返されるリッチエディタ部分
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
