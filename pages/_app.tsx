//ここでimportしたものは全てのファイルで読み込まれる
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import "../styles/globals.css"; //リセット用

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>blog</title>
      </Head>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
