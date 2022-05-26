//ここでimportしたものは全てのページで読み込まれる
import React from "react";
import { DefaultSeo } from "next-seo";
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import theme from "../libs/theme";
import AOS from "aos";
import "aos/dist/aos.css";
//プログレスバー
import NextNprogress from "nextjs-progressbar";
//リセット用
import "../styles/globals.css";
//グーグルログイン

export default function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    AOS.init({
      once: false,
      easing: "ease-out-sine",
      duration: 600,
    });
  }, []);

  return (
    <>
      <Head>
        <title>blog</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&family=Yusei+Magic&display=swap"
        />
        //グーグルログイン
        <meta
          name="google-site-verification"
          content="Ngi-RN_ZOG-QFnccw9v34-f0OEamGQnKIIJubGBUkgY"
        />
      </Head>
      <DefaultSeo
        defaultTitle="teppy-Blog"
        description="雑なポートフォリオ"
        openGraph={{
          type: "website",
          title: "teppy-Blog",
          description: "ポートフォリオ+α",
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
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
