//ここでimportしたものは全てのページで読み込まれる
import { DefaultSeo } from "next-seo";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import theme from "../libs/theme";
//プログレスバー
import NextNprogress from "nextjs-progressbar"; // ここ！
//リセット用
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>blog</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&family=Yusei+Magic&display=swap"
        />
      </Head>
      <DefaultSeo
        defaultTitle="teppy-Blog"
        description="雑なメモ帳"
        openGraph={{
          type: "website",
          title: "teppy-Blog",
          description: "ブログにするつもりのメモ帳です",
          site_name: "teppy-Blog",
          url: "https://jam-stack-blog-teppy0422.vercel.app/",
          images: [
            {
              url: "https://jam-stack-blog-teppy0422.vercel.app/",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
              type: "image/jpeg",
            },
          ],
        }}
        twitter={{
          handle: "@",
          site: "@",
          cardType: "summary_large_image",
        }}
      />
      <ChakraProvider theme={theme}>
        <NextNprogress color="#f88" showOnShallow={false} height={3} />{" "}
        {/* ここ！ */}
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
