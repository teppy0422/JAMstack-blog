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
// import { useAuth } from "../libs/auth";
// type Props = {
//   children: JSX.Element;
// };
// let cnt: number = 0;
// const Auth = ({ children }: Props): JSX.Element => {
//   cnt++;
//   const isLoading = useAuth();
//   console.log({ cnt });
//   return isLoading && cnt < 10 ? <p>Loading...{cnt}</p> : children;
// };
import { AuthProvider } from "../public/framework/context/AuthContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  React.useEffect(() => {
    AOS.init({
      once: false,
      easing: "ease-out-sine",
      duration: 600,
    });
  }, []);

  // loginボタンを隠す
  let keyFlag: boolean = false;
  const handleKeyDown = (event: KeyboardEvent) => {
    // CMDキーの場合処理を行う
    if (event.key === "Meta") {
      if (keyFlag === false) {
        document.getElementById("login").style.display = "block";
        keyFlag = true;
      } else {
        document.getElementById("login").style.display = "none";
        keyFlag = false;
      }
    }
    console.log(event.key);
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
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
      <AuthProvider>
        {/* <RecoilRoot> */}
        {/* <Auth> */}
        <ChakraProvider theme={theme}>
          <NextNprogress color="#f88" showOnShallow={false} height={3} />{" "}
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ChakraProvider>
        {/* </Auth> */}
        {/* </RecoilRoot> */}
      </AuthProvider>
    </>
  );
}
export default MyApp;
