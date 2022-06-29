//ここでimportしたものは全てのページで読み込まれる
import React, { useEffect } from "react";
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
import { SessionProvider } from "next-auth/react";
//グーグルログイン別のfirebase
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
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
        {/* グーグルログイン */}
        <meta
          name="google-site-verification"
          content="4var2KY2gn9V8ETNT5Iny7qYQwuuYpfwHbALwJtkyPA"
        />
        {/* アクセス解析 */}
        <script src="//accaii.com/teppy/script.js" async></script>
      </Head>
      <DefaultSeo
        defaultTitle="teppy-Blog"
        description="ブログ"
        openGraph={{
          type: "website",
          title: "teppy-Blog",
          description: "ブログ",
          site_name: "teppy-Blog",
          url: "https://www.teppy.link/",
          images: [
            {
              url: "https://www.teppy.link/",
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
      {/* <RecoilRoot> */}
      <ChakraProvider theme={theme}>
        <NextNprogress color="#f88" showOnShallow={false} height={3} />{" "}
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ChakraProvider>
      {/* </RecoilRoot> */}
    </>
  );
}
export default MyApp;
