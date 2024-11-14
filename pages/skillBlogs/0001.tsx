// components/QiitaPage.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  List,
  ListItem,
  Divider,
  ChakraProvider,
} from "@chakra-ui/react";

const QiitaPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);

  const section1 = { id: "section1", title: "ぼん大学" };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -99% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <ChakraProvider>
      <HStack
        align="start"
        spacing={8}
        p={4}
        fontFamily="Noto Sans JP"
        sx={{ fontWeight: "200 !important" }}
      >
        <VStack
          align="start"
          spacing={6}
          flex="3"
          bg="rgb(255,255,255,0.3)"
          w={["100%", "100%", "100%", "70%"]}
          p={4}
          borderRadius="10px"
        >
          <Box
            id={section1.id}
            ref={(el) => {
              if (el) sectionRefs.current[0] = el;
              if (el && !sections.current.find((s) => s.id === section1.id)) {
                sections.current.push(section1);
              }
            }}
          >
            <Link href={`#${section1.id}`} style={{ textDecoration: "none" }}>
              <Heading size="md">{section1.title}</Heading>
            </Link>
            <Divider mt={2} borderColor="black" />
            <Text mt={2} style={{ fontWeight: "400 !important" }}>
              今回は大学が無料で公開している、エンジニア向けの学びになる資料をまとめていきます。
            </Text>
          </Box>

          <Box
            id="section2"
            ref={(el) => {
              if (el) sectionRefs.current[1] = el;
              if (el && !sections.current.find((s) => s.id === "section2")) {
                sections.current.push({ id: "section2", title: "東京大学" });
              }
            }}
          >
            <Link href="#section2" style={{ textDecoration: "none" }}>
              <Heading size="md">東京大学</Heading>
            </Link>
            <Divider mt={2} borderColor="black" />
            <VStack align="start" mt={2} spacing={2}>
              <Box>
                <Text fontWeight="bold">Pythonプログラミング入門</Text>
                <Text>
                  Pythonについて環境構築から始まり、 <br />
                  基本文法、 <br />
                  数値解析など応用的な使い方までを分かりやすく解説している。
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">AWS入門</Text>
                <Text>
                  ネットワークやクラウド、 <br />
                  インフラの仕組みの解説から始まり、 <br />
                  AWSの構成パターンなどが <br />
                  基礎から解説されている。
                </Text>
              </Box>
            </VStack>
          </Box>
          <Box
            id="section3"
            ref={(el) => {
              if (el) sectionRefs.current[2] = el;
              if (el && !sections.current.find((s) => s.id === "section3")) {
                sections.current.push({ id: "section3", title: "おにく大学" });
              }
            }}
          >
            <Link href="#section3" style={{ textDecoration: "none" }}>
              <Heading size="md">おにく大学</Heading>
            </Link>
            <Divider mt={2} borderColor="black" />
            <VStack align="start" mt={2} spacing={2}>
              <Box>
                <Text fontWeight="bold">Pythonプログラミング入門</Text>
                <Text>
                  Pythonについて環境構築から始まり、基本文法、数値解析など応用的な使い方までを分かりやすく解説している。
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">AWS入門</Text>
                <Text>
                  ネットワークやクラウド、
                  <br />
                  インフラの仕組みの解説から始まり、
                  <br />
                  AWSの構成パターンなどが基礎から解説されている。
                </Text>
              </Box>
            </VStack>
          </Box>
          <Box height="1000vh"></Box>
        </VStack>

        {/* サイドバー */}
        <VStack
          align="start"
          spacing={3}
          flex="1"
          position="sticky"
          top="10px"
          display={["none", "none", "none", "block"]}
        >
          <List spacing={1} fontSize="sm">
            {sections.current.map((section) => (
              <ListItem
                w="100%"
                key={section.id}
                p={1}
                borderRadius="5px"
                bg={activeSection === section.id ? "gray.500" : "transparent"}
                color={activeSection === section.id ? "white" : "black"}
              >
                <Link href={`#${section.id}`}>{section.title}</Link>
              </ListItem>
            ))}
          </List>
        </VStack>
      </HStack>
    </ChakraProvider>
  );
};

export default QiitaPage;
