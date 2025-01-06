"use client";

//ここでimportしたものは全てのページで読み込まれる
import React, {
  useEffect,
  Dispatch,
  useState,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
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
export { myContext as AppContext };
import { AppProps } from "next/app";
import { LanguageProvider } from "../context/LanguageContext";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <LanguageProvider>
      <Head>
        <title>STUDIO+</title>
        <meta
          name="description"
          content="企業向け生産性向上を図る総合プラットフォーム"
        />
        <meta property="og:title" content="STUDIO+" />
        <meta
          property="og:description"
          content="企業向け生産性向上を図る総合プラットフォーム"
        />
        <meta
          property="og:image"
          content="https://www.teppy.link/images/hippo_003_cir.svg"
        />
        <meta property="og:url" content="https://www.teppy.link/" />
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&family=Yusei+Magic&display=swap"
        /> */}
        {/* アクセス解析 */}
        {/* <script src="//accaii.com/teppy/script.js" async></script> */}
      </Head>
      <ChakraProvider theme={theme}>
        <NextNprogress color="#f88" showOnShallow={false} height={3} />
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ChakraProvider>
    </LanguageProvider>
  );
}
export default MyApp;
