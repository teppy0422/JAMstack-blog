"use client";

import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "../context/useUserContext";
import { UnreadProvider } from "../context/UnreadContext";
import { LanguageProvider } from "../context/LanguageContext";
import { theme } from "@/theme/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <UnreadProvider>
          <LanguageProvider>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
          </LanguageProvider>
        </UnreadProvider>
      </UserProvider>
    </SessionProvider>
  );
}
