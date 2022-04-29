//ここでimportしたものは全てのページで読み込まれる
import { ChakraProvider } from "@chakra-ui/react";
import Head from "next/head";
import "../styles/globals.css"; //リセット用
// import theme from "./theme";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>blog</title>
      </Head>
      {/* <ChakraProvider theme={theme}> */}
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
