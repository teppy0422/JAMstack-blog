import Header from "../components/header";
import Link from "next/link";
import { client } from "../libs/client";
import { Container } from "@chakra-ui/react";

export default function Home({ blog }) {
  return (
    <div>
      <Header />
      <div style={{ height: "56px" }}></div>
      <Container>
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
    </div>
  );
}

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async () => {
  const data = await client.get({ endpoint: "blog" });

  return {
    props: {
      blog: data.contents,
    },
  };
};
