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
            {/* シールっぽくするcomponentで余白を白くするのに必要 */}
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
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
          </LanguageProvider>
        </UnreadProvider>
      </UserProvider>
    </SessionProvider>
  );
}
