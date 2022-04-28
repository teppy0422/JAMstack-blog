import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css"; //必要？

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
