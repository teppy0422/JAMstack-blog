"use client";

import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "../context/useUserContext";
import { UnreadProvider } from "../context/UnreadContext";
import { theme } from "../libs/theme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body>
        <SessionProvider>
          <UserProvider>
            <UnreadProvider>
              <ChakraProvider theme={theme}>{children}</ChakraProvider>
            </UnreadProvider>
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
