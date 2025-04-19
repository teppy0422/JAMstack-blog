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
import { ChakraProvider } from "@chakra-ui/react";

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
import { UserProvider } from "../context/useUserContext";

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
      <UserProvider>
        <ChakraProvider theme={theme}>
          <NextNprogress color="#f88" showOnShallow={false} height={3} />
          <SessionProvider session={session}>
            <svg width="0" height="0">
              <defs>
                <filter
                  id="outline-filter"
                  filterUnits="objectBoundingBox"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feMorphology
                    operator="dilate"
                    radius="2"
                    in="SourceAlpha"
                    result="dilated"
                  />
                  <feFlood floodColor="white" result="flood" />
                  <feComposite
                    in="flood"
                    in2="dilated"
                    operator="in"
                    result="outline"
                  />
                  <feMerge>
                    <feMergeNode in="outline" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
            <Component {...pageProps} />
          </SessionProvider>
        </ChakraProvider>
      </UserProvider>
    </LanguageProvider>
  );
}
export default MyApp;
