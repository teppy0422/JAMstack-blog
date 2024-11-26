//ここでimportしたものは全てのページで読み込まれる
import React, { useEffect, Dispatch, useState, createContext } from "react";
import { DefaultSeo } from "next-seo";
import {
  ChakraProvider,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { theme } from "../libs/theme";
//プログレスバー
import NextNprogress from "nextjs-progressbar";
//リセット用
import "../styles/globals.css";
//ログイン認証
import { SessionProvider } from "next-auth/react";
//状態管理
const myState = {
  colorMode: "",
};
export const myContext = createContext(myState);
import { AppProps } from "next/app";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>blog</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&family=Yusei+Magic&display=swap"
        />
        {/* アクセス解析 */}
        <script src="//accaii.com/teppy/script.js" async></script>
      </Head>
      <ChakraProvider theme={theme}>
        <NextNprogress color="#f88" showOnShallow={false} height={3} />
        <SessionProvider session={session}>
          <myContext.Provider value={myState}>
            <Component {...pageProps} />
          </myContext.Provider>
        </SessionProvider>
      </ChakraProvider>
    </>
  );
}
export default MyApp;
